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

// Debug logger that persists across redirects
function authLog(msg: string) {
  if (typeof window === "undefined") return;
  try {
    const logs = JSON.parse(localStorage.getItem("__authDebug") || "[]");
    logs.push(`${new Date().toISOString().slice(11, 19)} ${msg}`);
    // Keep last 30 entries
    if (logs.length > 30) logs.splice(0, logs.length - 30);
    localStorage.setItem("__authDebug", JSON.stringify(logs));
  } catch { /* ignore */ }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  // Show debug logs on page
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const logs = JSON.parse(localStorage.getItem("__authDebug") || "[]");
        setDebugLogs(logs);
      } catch { /* ignore */ }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    authLog("AuthProvider mounted");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        authLog(`onAuthStateChanged: USER=${firebaseUser.email}`);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
        try {
          await syncUserToDatabase(firebaseUser);
          authLog("syncUserToDatabase: OK");
        } catch (e) {
          authLog(`syncUserToDatabase: FAIL ${e}`);
        }
      } else {
        authLog("onAuthStateChanged: NO USER");
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Handle redirect result on page load (fires after signInWithRedirect returns)
  useEffect(() => {
    authLog("getRedirectResult: checking...");
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          authLog(`getRedirectResult: SUCCESS user=${result.user.email}`);
        } else {
          authLog("getRedirectResult: null (no pending redirect)");
        }
      })
      .catch((err) => {
        authLog(`getRedirectResult: ERROR ${err.code} ${err.message}`);
      });
  }, []);

  const signInWithGoogle = async () => {
    authLog("signInWithGoogle: called");
    try {
      const isCapacitor = typeof window !== "undefined" && !!(window as unknown as { Capacitor?: unknown }).Capacitor;
      authLog(`isCapacitor: ${isCapacitor}`);
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
        // Regular browser: try popup first, fall back to redirect if blocked
        try {
          authLog("trying signInWithPopup...");
          await signInWithPopup(auth, googleProvider);
          authLog("signInWithPopup: SUCCESS");
        } catch (popupErr: unknown) {
          const popupCode = (popupErr as { code?: string })?.code;
          authLog(`signInWithPopup failed: ${popupCode}`);
          if (popupCode === "auth/popup-closed-by-user" || popupCode === "auth/cancelled-popup-request") return;
          if (popupCode === "auth/popup-blocked") {
            authLog("falling back to signInWithRedirect...");
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
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
      {/* Temporary debug panel — remove after fixing login */}
      {debugLogs.length > 0 && (
        <div style={{ position: "fixed", bottom: 70, left: 4, right: 4, maxHeight: 150, overflow: "auto", background: "#000", border: "1px solid #f97316", borderRadius: 8, padding: 8, zIndex: 9999, fontSize: 10, fontFamily: "monospace", color: "#0f0" }}>
          <div style={{ color: "#f97316", fontWeight: "bold", marginBottom: 4 }}>AUTH DEBUG (tap to clear)</div>
          {debugLogs.map((log, i) => <div key={i}>{log}</div>)}
          <button onClick={() => { localStorage.removeItem("__authDebug"); setDebugLogs([]); }} style={{ color: "#f00", marginTop: 4, fontSize: 10 }}>Clear</button>
        </div>
      )}
    </AuthContext.Provider>
  );
}
