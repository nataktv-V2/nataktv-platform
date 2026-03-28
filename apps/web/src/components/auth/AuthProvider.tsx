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
  signInWithCredential,
  getRedirectResult,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

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
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Handle redirect result on page load (for any legacy redirect flows)
  useEffect(() => {
    getRedirectResult(auth).catch(() => {});
  }, []);

  const signInWithGoogle = async () => {
    try {
      const isCapacitor = typeof window !== "undefined" && !!(window as unknown as { Capacitor?: unknown }).Capacitor;
      if (isCapacitor) {
        // Inside Capacitor WebView: use native Google Sign-In (no Chrome opening)
        try {
          // Access GoogleAuth plugin via Capacitor's plugin bridge (avoids build-time import)
          const cap = (window as unknown as { Capacitor?: { Plugins?: { GoogleAuth?: { signIn: () => Promise<{ authentication: { idToken: string } }> } } } }).Capacitor;
          const googleAuth = cap?.Plugins?.GoogleAuth;
          if (googleAuth) {
            const result = await googleAuth.signIn();
            const credential = GoogleAuthProvider.credential(result.authentication.idToken);
            await signInWithCredential(auth, credential);
          } else {
            // GoogleAuth plugin not available, fallback to popup
            await signInWithPopup(auth, googleProvider);
          }
        } catch (nativeErr: unknown) {
          const msg = (nativeErr as { message?: string })?.message || "";
          // If user cancelled native sign-in, silently ignore
          if (msg.includes("cancel") || msg.includes("12501")) return;
          console.error("Native Google sign-in error:", nativeErr);
          // Fallback to popup if native fails
          await signInWithPopup(auth, googleProvider);
        }
      } else {
        // Regular browser: always use popup (redirect has issues with auth state loss on mobile)
        await signInWithPopup(auth, googleProvider);
      }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return;
      console.error("Google sign-in error:", err);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
