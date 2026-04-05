"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signInWithCustomToken,
  getRedirectResult,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any;
import { initRevenueCat, loginRevenueCat, logoutRevenueCat, isCapacitorApp } from "@/lib/revenuecat";
import { initPushNotifications, linkPushTokenToUser } from "@/lib/push-notifications";

type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

async function syncUserToDatabase(firebaseUser: FirebaseUser) {
  const token = await firebaseUser.getIdToken();
  await fetch("/api/auth/sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
    }),
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Register push notifications on app load (even before login)
  useEffect(() => {
    if (isCapacitorApp()) {
      initPushNotifications();
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
        try {
          await syncUserToDatabase(firebaseUser);
        } catch {
          // Sync failed — user can still use the app, sync retries on next load
        }
        // Init Capacitor-only features
        if (isCapacitorApp()) {
          initRevenueCat(firebaseUser.uid).then(() => loginRevenueCat(firebaseUser.uid));
          linkPushTokenToUser(firebaseUser.uid);
        }
      } else {
        setUser(null);
        if (isCapacitorApp()) logoutRevenueCat();
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Handle redirect result on page load (fires after signInWithRedirect returns)
  useEffect(() => {
    getRedirectResult(auth).catch(() => {});
  }, []);

  const signInWithGoogle = async () => {
    try {
      const isCapacitor = typeof window !== "undefined" && !!window?.Capacitor;
      if (isCapacitor) {
        // Native Google Sign-In via Capacitor plugin + custom token
        // Play signing key's OAuth client is in Google's internal GCP project,
        // so we can't use idToken/accessToken (same-project error).
        // Instead: native picker → get user info → backend creates custom token.
        try {
          const Capacitor = window.Capacitor;
          if (Capacitor?.Plugins?.GoogleAuth) {
            const GoogleAuth = Capacitor.Plugins.GoogleAuth;
            await GoogleAuth.initialize({
              scopes: "profile,email",
              grantOfflineAccess: false,
            });
            // Sign out first to force account picker on every login
            try { await GoogleAuth.signOut(); } catch { /* ignore */ }
            const result = await GoogleAuth.signIn();
            console.log("Native signIn result:", JSON.stringify(result));

            // Extract user info from native sign-in (always available)
            const googleId = result?.id;
            const email = result?.email;
            const displayName = result?.displayName || result?.name;
            const photoUrl = result?.imageUrl || result?.photoUrl;

            if (!googleId || !email) {
              console.error("No user info from native signIn:", JSON.stringify(result));
              alert("Login failed. Please try again.");
              return;
            }

            // Get custom token from our backend
            const res = await fetch("/api/auth/google-native", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ googleId, email, displayName, photoUrl }),
            });

            if (!res.ok) {
              const errData = await res.json().catch(() => ({}));
              throw new Error(errData.error || "Backend auth failed");
            }

            const { token } = await res.json();
            await signInWithCustomToken(auth, token);
            console.log("signInWithCustomToken SUCCESS");
          } else {
            await signInWithPopup(auth, googleProvider);
          }
        } catch (nativeErr: unknown) {
          const msg = String((nativeErr as { message?: string })?.message || nativeErr);
          console.error("Native Google sign-in error:", msg);
          if (msg.includes("cancel") || msg.includes("12501")) return;
          alert("Login error: " + msg.substring(0, 100));
        }
      } else {
        // Regular browser: try popup first, fall back to redirect if blocked
        try {
          await signInWithPopup(auth, googleProvider);
        } catch (popupErr: unknown) {
          const popupCode = (popupErr as { code?: string })?.code;
          if (popupCode === "auth/popup-closed-by-user" || popupCode === "auth/cancelled-popup-request") return;
          if (popupCode === "auth/popup-blocked") {
            await signInWithRedirect(auth, googleProvider);
            return;
          }
          throw popupErr;
        }
      }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return;
      console.error("Google sign-in error:", err);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    // Also sign out from native Google plugin so account picker shows next time
    try {
      const isCapacitor = typeof window !== "undefined" && !!window?.Capacitor;
      if (isCapacitor && window.Capacitor?.Plugins?.GoogleAuth) {
        await window.Capacitor.Plugins.GoogleAuth.signOut();
      }
    } catch {
      // Ignore — native signOut can sometimes fail, but Firebase signOut already worked
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
