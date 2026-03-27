import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Natak TV - Watch Indian Dramas & Short Films",
    template: "%s | Natak TV",
  },
  description:
    "India's mobile-first streaming platform for short dramas, web series, and original shows in Hindi, Tamil, Telugu and more. Subscribe from ₹199/month.",
  keywords: [
    "natak tv",
    "indian dramas",
    "short films",
    "web series",
    "hindi drama",
    "tamil drama",
    "telugu drama",
    "streaming",
    "online drama",
    "indian web series",
  ],
  authors: [{ name: "INDIDINO VENTURES PRIVATE LIMITED" }],
  creator: "Natak TV",
  publisher: "INDIDINO VENTURES PRIVATE LIMITED",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://nataktv.com"),
  openGraph: {
    title: "Natak TV - Watch Indian Dramas & Short Films",
    description:
      "India's mobile-first streaming platform. Short films, web series & originals. Subscribe from ₹199/month.",
    type: "website",
    locale: "en_IN",
    siteName: "Natak TV",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Natak TV - Watch Indian Dramas & Short Films",
    description:
      "India's mobile-first streaming platform. Subscribe from ₹199/month.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0a0c",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
