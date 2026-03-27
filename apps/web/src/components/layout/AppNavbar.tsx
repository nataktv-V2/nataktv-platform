"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppNavbar() {
  const pathname = usePathname();
  const isSearchPage = pathname === "/search";

  return (
    <header className="bg-bg-primary/90 backdrop-blur-md border-b border-border-subtle safe-area-top">
      <div className="flex items-center justify-between px-4 h-14 max-w-5xl mx-auto">
        <Link href="/home" className="flex items-center gap-1.5">
          <span className="text-lg font-bold">
            <span className="bg-gradient-to-r from-brand-yellow via-brand-orange via-brand-pink to-brand-purple bg-clip-text text-transparent">
              Natak
            </span>
            <span className="ml-1 bg-brand-purple text-white text-xs px-1.5 py-0.5 rounded font-semibold">
              TV
            </span>
          </span>
        </Link>
        {!isSearchPage && (
          <Link
            href="/search"
            className="flex items-center gap-2 bg-bg-surface border border-border-subtle rounded-full px-4 py-1.5 text-sm text-text-muted hover:border-border-default transition-colors flex-1 mx-4 max-w-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
            </svg>
            Search shows, movies...
          </Link>
        )}
      </div>
    </header>
  );
}
