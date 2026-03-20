import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NOTIFICATION_MESSAGES } from "@/lib/notification-messages";

/**
 * GET /api/notifications/cron
 * Automated push notification sender — called by external cron twice daily
 * (12:30 PM IST and 7:30 PM IST)
 * Auth: CRON_SECRET header check
 */
export async function GET(req: NextRequest) {
  // Verify cron secret
  const secret = req.headers.get("x-cron-secret") || req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Pick a random trending/recent video to attach to the notification
    const videos = await prisma.video.findMany({
      orderBy: { views: "desc" },
      take: 10,
      select: { id: true, title: true },
    });

    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    if (!randomVideo) {
      return NextResponse.json({ error: "No videos found" }, { status: 404 });
    }

    // Pick a random message template
    const template = NOTIFICATION_MESSAGES[Math.floor(Math.random() * NOTIFICATION_MESSAGES.length)]!;
    const title = template.title.replace("{video}", randomVideo.title);
    const body = template.body.replace("{video}", randomVideo.title);
    const url = `/video/${randomVideo.id}`;

    // Get all users with FCM tokens
    const users = await prisma.user.findMany({
      where: { fcmToken: { not: null } },
      select: { fcmToken: true },
    });

    const tokens = users.map((u) => u.fcmToken).filter((t): t is string => !!t);

    if (tokens.length === 0) {
      return NextResponse.json({ sent: 0, message: "No FCM tokens registered" });
    }

    // Get FCM access token
    const accessToken = await getAccessToken();
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (!accessToken || !projectId) {
      return NextResponse.json(
        { error: "Firebase not configured. Set FIREBASE_SERVICE_ACCOUNT_KEY and NEXT_PUBLIC_FIREBASE_PROJECT_ID." },
        { status: 500 }
      );
    }

    let sent = 0;
    let failed = 0;
    const failedTokens: string[] = [];

    // Batch send in groups of 10
    const batchSize = 10;
    for (let i = 0; i < tokens.length; i += batchSize) {
      const batch = tokens.slice(i, i + batchSize);
      const results = await Promise.allSettled(
        batch.map((token) =>
          fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: {
                token,
                notification: { title, body },
                data: { url },
                webpush: { fcmOptions: { link: url } },
              },
            }),
          })
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

    return NextResponse.json({
      sent,
      failed,
      total: tokens.length,
      notification: { title, body, url },
      video: randomVideo.title,
    });
  } catch (error) {
    console.error("Cron notification error:", error);
    return NextResponse.json({ error: "Failed to send cron notifications" }, { status: 500 });
  }
}

// Reuse the same OAuth2 token logic from the send route
async function getAccessToken(): Promise<string | null> {
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) return null;

    const sa = JSON.parse(serviceAccountKey);
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
