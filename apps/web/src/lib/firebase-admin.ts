import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

let app: App;

if (getApps().length === 0) {
  // Support both plain JSON and base64-encoded service account key
  const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const serviceAccountB64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_B64;
  const serviceAccount = serviceAccountRaw
    ? serviceAccountRaw
    : serviceAccountB64
      ? Buffer.from(serviceAccountB64, "base64").toString("utf-8")
      : null;

  if (serviceAccount) {
    app = initializeApp({
      credential: cert(JSON.parse(serviceAccount)),
    });
  } else {
    // Fallback: use project ID only (works for token verification in dev)
    app = initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
} else {
  app = getApps()[0]!;
}

const adminAuth = getAuth(app);

export async function verifyFirebaseToken(token: string) {
  try {
    return await adminAuth.verifyIdToken(token);
  } catch {
    return null;
  }
}

export { adminAuth };
