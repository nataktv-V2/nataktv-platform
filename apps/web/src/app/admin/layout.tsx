import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import Link from "next/link";

async function getAdminUser(firebaseUid: string | undefined) {
  if (!firebaseUid) return null;
  try {
    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      select: { role: true, displayName: true },
    });
    return user;
  } catch {
    return null;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // For now, we'll skip server-side auth check and do it client-side
  // In production, verify Firebase token server-side
  return (
    <div className="min-h-screen bg-[#0a0a0c]">
      {/* Admin Top Bar */}
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
  );
}
