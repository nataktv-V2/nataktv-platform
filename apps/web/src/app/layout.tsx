import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Natak TV - Watch Indian Dramas & Short Films",
  description:
    "India's mobile-first streaming platform for short dramas, web series, and original shows in Hindi, Tamil, Telugu and more. Subscribe and start watching.",
  keywords: [
    "natak tv",
    "indian dramas",
    "short films",
    "web series",
    "hindi drama",
    "tamil drama",
    "telugu drama",
    "streaming",
  ],
  openGraph: {
    title: "Natak TV - Watch Indian Dramas & Short Films",
    description:
      "India's mobile-first streaming platform. Subscribe from ₹199/month.",
    type: "website",
    locale: "en_IN",
    siteName: "Natak TV",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0a0c",
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
