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
  getRedirectResult,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
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
      const isCapacitor = typeof window !== "undefined" && !!(window as unknown as { Capacitor?: unknown }).Capacitor;
      if (isCapacitor) {
        // Capacitor WebView: use Firebase web redirect flow
        // Native GoogleAuth.signIn() fails because Play signing key's OAuth client
        // is in a different GCP project than the web client (Google-managed conflict).
        // signInWithRedirect works purely via web — no native OAuth client needed.
        console.log("Capacitor detected — using signInWithRedirect");
        await signInWithRedirect(auth, googleProvider);
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
