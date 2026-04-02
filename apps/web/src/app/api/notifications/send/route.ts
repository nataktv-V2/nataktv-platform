import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    const tokens = users
      .map((u) => u.fcmToken)
      .filter((t): t is string => !!t);

    if (tokens.length === 0) {
      return NextResponse.json({ sent: 0, message: "No users with FCM tokens found" });
    }

    // Send via FCM HTTP v1 API
    const accessToken = await getAccessToken();
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (!accessToken || !projectId) {
      return NextResponse.json(
        { error: "Firebase not configured for sending. Set FIREBASE_SERVICE_ACCOUNT_KEY." },
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
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 });
  }
}

/**
 * Get OAuth2 access token from Firebase service account for FCM v1 API
 */
async function getAccessToken(): Promise<string | null> {
  try {
    let serviceAccountKey: string | undefined;

    // Try reading from file first (most reliable)
    try {
      const fs = await import("fs");
      const path = await import("path");
      const filePath = path.join(process.cwd(), "firebase-sa.json");
      if (fs.existsSync(filePath)) {
        serviceAccountKey = fs.readFileSync(filePath, "utf-8");
      }
    } catch { /* file not found */ }

    // Fallback to env var
    if (!serviceAccountKey) {
      serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    }

    if (!serviceAccountKey) return null;

    const sa = JSON.parse(serviceAccountKey);

    // Build JWT
    const header = btoa(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const now = Math.floor(Date.now() / 1000);
    const claimSet = btoa(
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
    const key = await importPrivateKey(sa.private_key);
    const signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      key,
      new TextEncoder().encode(signInput)
    );
    const sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const jwt = `${header.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")}.${claimSet.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")}.${sig}`;

    // Exchange JWT for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
    });

    const tokenData = await tokenRes.json();
    return tokenData.access_token || null;
  } catch (err) {
    console.error("Failed to get FCM access token:", err);
    return null;
  }
}

async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const pemContents = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\n/g, "");
  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
}
