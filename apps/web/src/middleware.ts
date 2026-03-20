import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pages allowed on the marketing domain (nataktv.com)
const LANDING_PATHS = new Set(["/", "/privacy", "/terms", "/refund", "/delete-account"]);

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // Determine if this is the marketing domain or the app domain
  const isAppDomain = hostname.startsWith("app.");
  const isMarketingDomain = !isAppDomain;

  // --- Marketing domain (nataktv.com) ---
  if (isMarketingDomain) {
    // Allow landing page, legal pages, and static assets
    if (LANDING_PATHS.has(pathname) || pathname.startsWith("/_next") || pathname.startsWith("/posters") || pathname.startsWith("/api") || pathname.includes(".")) {
      return NextResponse.next();
    }
    // Everything else on marketing domain → redirect to app domain
    const appUrl = new URL(pathname, `https://app.${hostname}`);
    appUrl.search = request.nextUrl.search;
    return NextResponse.redirect(appUrl);
  }

  // --- App domain (app.nataktv.com) ---
  if (isAppDomain) {
    // Root of app domain → redirect to /home (which triggers login if needed)
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|firebase-messaging-sw.js|manifest.json).*)",
  ],
};
