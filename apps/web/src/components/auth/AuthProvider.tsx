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
  signInWithCredential,
  getRedirectResult,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { initRevenueCat, loginRevenueCat, logoutRevenueCat, isCapacitorApp } from "@/lib/revenuecat";
import { registerPushNotifications } from "@/lib/push-notifications";

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
          registerPushNotifications(firebaseUser.uid);
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
      const isCapacitor = typeof window !== "undefined" && !!(window as unknown as { Capacitor?: unknown }).Capacitor;
      if (isCapacitor) {
        // Inside Capacitor WebView: use native Google Sign-In (no Chrome opening)
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const Capacitor = (window as any).Capacitor;
          if (Capacitor?.Plugins?.GoogleAuth) {
            const GoogleAuth = Capacitor.Plugins.GoogleAuth;
            // Must initialize before signIn — creates the GoogleSignInClient on native side
            await GoogleAuth.initialize({
              clientId: "342635565192-46l6ple0vs3p6mc6l5e0kkf4jvj4v53f.apps.googleusercontent.com",
              scopes: "profile,email",
              grantOfflineAccess: true,
            });
            // Sign out first to force account picker (otherwise auto-picks last account)
            try { await GoogleAuth.signOut(); } catch { /* ignore — may not be signed in */ }
            const result = await GoogleAuth.signIn();
            console.log("Native signIn result:", JSON.stringify(result));
            const idToken = result?.authentication?.idToken;
            if (idToken) {
              const credential = GoogleAuthProvider.credential(idToken);
              await signInWithCredential(auth, credential);
              console.log("signInWithCredential SUCCESS");
            } else {
              console.error("No idToken from native signIn:", JSON.stringify(result));
              // Show error to user instead of opening Chrome
              alert("Login failed: no token received. Please try again.");
            }
          } else {
            // No GoogleAuth plugin — not in Capacitor or plugin missing
            await signInWithPopup(auth, googleProvider);
          }
        } catch (nativeErr: unknown) {
          const msg = String((nativeErr as { message?: string })?.message || nativeErr);
          console.error("Native Google sign-in error:", msg);
          if (msg.includes("cancel") || msg.includes("12501")) return;
          // Do NOT fall back to popup in Capacitor — it opens Chrome
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
    // Only Firebase signOut — native GoogleAuth.signOut() crashes the Capacitor WebView.
    // Account picker will still show on next login because GoogleAuth.initialize()
    // is called fresh before each signIn attempt.
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
