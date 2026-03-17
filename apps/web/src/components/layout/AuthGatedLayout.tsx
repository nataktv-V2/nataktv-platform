"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { usePathname } from "next/navigation";
import { type ReactNode, useRef, useEffect, useState } from "react";

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
  const navRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(56); // default h-14

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

  // On the profile page when not logged in, hide navbar and bottom nav (login screen takes over)
  const isLoginScreen = pathname === "/profile" && !user && !loading;

  if (isLoginScreen) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
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
