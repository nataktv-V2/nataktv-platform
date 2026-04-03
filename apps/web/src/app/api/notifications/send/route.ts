import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
let _lastAccessTokenError: string | null = null;

function getServiceAccountKey(): string | null {
  // Option 1: base64-encoded env var (avoids JSON quoting issues in .env)
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64;
  if (b64) {
    try {
      return Buffer.from(b64, "base64").toString("utf-8");
    } catch { /* invalid base64 */ }
  }

  // Option 2: plain JSON env var
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    return process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  }

  return null;
}

/**
 * POST /api/notifications/send
 * Admin-only: Send push notifications to users via FCM HTTP v1 API
 * Body: { title, body, image?, url?, target: "all" | "subscribers" | "trial" }
 */
export async function POST(req: NextRequest) {
  try {
    const { title, body, image, url, target } = await req.json();

    if (!title || !body) {
      return NextResponse.json({ error: "Title and body are required" }, { status: 400 });
    }

    // Build user filter based on target audience
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { fcmToken: { not: null } };

    if (target === "subscribers") {
      where.subscriptions = {
        some: { status: { in: ["ACTIVE", "TRIAL"] } },
      };
    } else if (target === "trial") {
      where.subscriptions = {
        some: { status: "TRIAL" },
      };
    }
    // "all" = no additional filter

    const users = await prisma.user.findMany({
      where,
      select: { fcmToken: true },
    });

    const userTokens = users
      .map((u) => u.fcmToken)
      .filter((t): t is string => !!t);

    // Also get tokens from push_tokens table (includes anonymous users)
    let allTokens: string[] = [...userTokens];
    if (target === "all") {
      try {
        const pushTokenRows = await prisma.$queryRawUnsafe<{ token: string }[]>(
          `SELECT token FROM push_tokens WHERE token IS NOT NULL`
        );
        const pushTokens = pushTokenRows.map((r) => r.token);
        // Merge and deduplicate
        allTokens = [...new Set([...userTokens, ...pushTokens])];
      } catch { /* push_tokens table may not exist yet */ }
    }

    const tokens = allTokens;

    if (tokens.length === 0) {
      return NextResponse.json({ sent: 0, message: "No users with FCM tokens found" });
    }

    // Send via FCM HTTP v1 API
    const accessToken = await getAccessToken();
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (!accessToken || !projectId) {
      const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64;
      const plain = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      return NextResponse.json(
        { error: "Firebase not configured for sending. Set FIREBASE_SERVICE_ACCOUNT_KEY.", debug: { hasAccessToken: !!accessToken, hasProjectId: !!projectId, hasB64: !!b64, b64Len: b64?.length || 0, hasPlain: !!plain, cwd: process.cwd(), tokenError: _lastAccessTokenError } },
        { status: 500 }
      );
    }

    let sent = 0;
    let failed = 0;
    const failedTokens: string[] = [];

    // Send to each token (FCM v1 doesn't support multicast in a single call)
    // Batch in groups of 10 for performance
    const batchSize = 10;
    for (let i = 0; i < tokens.length; i += batchSize) {
      const batch = tokens.slice(i, i + batchSize);
      const results = await Promise.allSettled(
        batch.map((token) =>
          fetch(
            `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                message: {
                  token,
                  notification: {
                    title,
                    body,
                    ...(image ? { image } : {}),
                  },
                  data: {
                    url: url || "/home",
                  },
                  webpush: {
                    fcmOptions: {
                      link: url || "/home",
                    },
                  },
                },
              }),
            }
          )
        )
      );

      for (let j = 0; j < results.length; j++) {
        const r = results[j]!;
        if (r.status === "fulfilled" && r.value.ok) {
          sent++;
        } else {
          failed++;
          const token = batch[j];
          if (token) failedTokens.push(token);
        }
      }
    }

    // Clean up invalid tokens
    if (failedTokens.length > 0) {
      await prisma.user.updateMany({
        where: { fcmToken: { in: failedTokens } },
        data: { fcmToken: null },
      });
    }

    return NextResponse.json({ sent, failed, total: tokens.length });
  } catch (error) {
    console.error("Send notification error:", error);
    return NextResponse.json({ error: "Failed to send notifications", detail: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

/**
 * Get OAuth2 access token from Firebase service account for FCM v1 API
 */
async function getAccessToken(): Promise<string | null> {
  try {
    const serviceAccountKey = getServiceAccountKey();
    if (!serviceAccountKey) return null;

    const sa = JSON.parse(serviceAccountKey);

    // Build JWT using Buffer (Node.js) instead of btoa (browser)
    const toBase64Url = (data: string | Buffer) => {
      const b = typeof data === "string" ? Buffer.from(data) : data;
      return b.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    };

    const header = toBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const now = Math.floor(Date.now() / 1000);
    const claimSet = toBase64Url(
      JSON.stringify({
        iss: sa.client_email,
        scope: "https://www.googleapis.com/auth/firebase.messaging",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600,
      })
    );

    const signInput = `${header}.${claimSet}`;

    // Import the private key and sign
    const pemContents = sa.private_key
      .replace(/-----BEGIN PRIVATE KEY-----/, "")
      .replace(/-----END PRIVATE KEY-----/, "")
      .replace(/\n/g, "");
    const binaryDer = Buffer.from(pemContents, "base64");
    const key = await crypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      key,
      new TextEncoder().encode(signInput)
    );
    const sig = toBase64Url(Buffer.from(signature));

    const jwt = `${header}.${claimSet}.${sig}`;

    // Exchange JWT for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      _lastAccessTokenError = `Token exchange failed: ${JSON.stringify(tokenData)}`;
    }
    return tokenData.access_token || null;
  } catch (err) {
    console.error("Failed to get FCM access token:", err instanceof Error ? `${err.message}\n${err.stack}` : err);
    // Store the error so we can return it in the debug response
    _lastAccessTokenError = err instanceof Error ? err.message : String(err);
    return null;
  }
  return null;
}

