import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

/**
 * POST /api/auth/google-native
 *
 * Called from Capacitor native Google Sign-In flow.
 * Receives the Google user info from native sign-in (no idToken needed)
 * and creates a Firebase custom token so the client can authenticate.
 *
 * This bypasses the "Android clients and Web clients must be in the same project"
 * error that occurs when the Play signing key's OAuth client is in a different
 * GCP project than the web client.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { googleId, email, displayName, photoUrl } = body;

    if (!googleId || !email) {
      return NextResponse.json(
        { error: "Missing googleId or email" },
        { status: 400 }
      );
    }

    // Try to find existing user by email first (they may have signed in via web before)
    // If not found, create with google_ prefix UID
    let uid: string;
    try {
      const existingUser = await adminAuth.getUserByEmail(email);
      uid = existingUser.uid;
      // Update their info
      await adminAuth.updateUser(uid, {
        displayName: displayName || undefined,
        photoURL: photoUrl || undefined,
      });
    } catch {
      // No existing user with this email — create new one
      uid = `google_${googleId}`;
      try {
        await adminAuth.getUser(uid);
        await adminAuth.updateUser(uid, {
          email,
          displayName: displayName || undefined,
          photoURL: photoUrl || undefined,
        });
      } catch {
        await adminAuth.createUser({
          uid,
          email,
          displayName: displayName || undefined,
          photoURL: photoUrl || undefined,
        });
      }
    }

    // Create a custom token for this user
    const customToken = await adminAuth.createCustomToken(uid);

    return NextResponse.json({ token: customToken });
  } catch (err) {
    console.error("google-native auth error:", err);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
