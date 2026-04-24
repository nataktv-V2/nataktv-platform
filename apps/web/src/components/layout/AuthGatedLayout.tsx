"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useRef, useEffect, useState } from "react";
import { Splash } from "@/components/layout/Splash";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";

// Routes that non-logged-in users CAN visit without being sent to /profile login.
const PUBLIC_ROUTES = new Set(["/profile", "/privacy", "/terms", "/refund", "/help", "/delete-account"]);

export function AuthGatedLayout({
  children,
  navbar,
  bottomNav,
}: {
  children: ReactNode;
  navbar: ReactNode;
  bottomNav: ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(56); // default h-14

  // Upfront-login: any unauthenticated visit to a gated (app) route sends the
  // user to /profile (which shows the login screen). Signup is captured before
  // the user can browse — maximises email/FCM-token retention for retargeting.
  useEffect(() => {
    if (loading) return;
    if (user) return;
    if (PUBLIC_ROUTES.has(pathname)) return;
    router.replace("/profile");
  }, [loading, user, pathname, router]);

  // Measure actual navbar height (accounts for TrialBanner when visible)
  useEffect(() => {
    if (!navRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setNavHeight(entry.contentRect.height);
      }
    });
    observer.observe(navRef.current);
    return () => observer.disconnect();
  }, []);

  // Show branded splash while Firebase auth is still resolving, or while
  // an about-to-happen redirect hasn't fired yet (unauthed on gated route).
  const pendingRedirect = !loading && !user && !PUBLIC_ROUTES.has(pathname);
  if (loading || pendingRedirect) {
    return <Splash />;
  }

  // On the profile page when not logged in, hide navbar and bottom nav (login screen takes over)
  const isLoginScreen = pathname === "/profile" && !user && !loading;

  if (isLoginScreen) {
    // Login screen: hide navbar AND bottom nav so user can only sign in
    // (no escape hatches to other pages).
    return (
      <>
        <PageViewTracker isAuthed={false} />
        <main className="min-h-screen">{children}</main>
      </>
    );
  }

  return (
    <>
      <PageViewTracker isAuthed={!!user} />
      <div ref={navRef} className="fixed top-0 left-0 right-0 z-50">
        {navbar}
      </div>
      <main className="pb-20 min-h-screen" style={{ paddingTop: navHeight }}>
        {children}
      </main>
      {bottomNav}
    </>
  );
}
