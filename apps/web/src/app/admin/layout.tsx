"use client";

import Link from "next/link";
import { useAuth, AuthProvider } from "@/components/auth/AuthProvider";
import { useEffect, useState } from "react";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user?.uid) {
      setIsAdmin(false);
      return;
    }
    fetch(`/api/admin/check?uid=${user.uid}`)
      .then((res) => res.json())
      .then((data) => setIsAdmin(data.isAdmin === true))
      .catch(() => setIsAdmin(false));
  }, [user?.uid, loading]);

  if (loading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Admin Access Required</h1>
          <p className="text-zinc-400">Please sign in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-zinc-400 mb-4">You do not have admin privileges.</p>
          <Link href="/home" className="text-[#f97316] hover:underline">
            Go back to app
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminGuard>
        <div className="min-h-screen bg-[#0a0a0c]">
          <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-[#121216] border-b border-white/10 flex items-center px-4 gap-4">
            <Link href="/admin" className="font-bold text-lg">
              <span className="text-[#f97316]">Natak</span>
              <span className="bg-gradient-to-r from-[#ffd700] to-[#e91e63] text-transparent bg-clip-text"> Admin</span>
            </Link>
            <nav className="flex gap-1 ml-6">
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/videos"
                className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Videos
              </Link>
              <Link
                href="/admin/users"
                className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Users
              </Link>
              <Link
                href="/admin/categories"
                className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Categories
              </Link>
              <Link
                href="/admin/languages"
                className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Languages
              </Link>
              <Link
                href="/admin/notifications"
                className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Notify
              </Link>
            </nav>
            <div className="ml-auto">
              <Link
                href="/home"
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                ← Back to App
              </Link>
            </div>
          </header>
          <main className="pt-14 p-6">{children}</main>
        </div>
      </AdminGuard>
    </AuthProvider>
  );
}
