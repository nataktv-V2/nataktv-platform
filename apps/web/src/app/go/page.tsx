import type { Metadata } from "next";
import { GoRedirect } from "./GoRedirect";

export const metadata: Metadata = {
  title: "Download Natak TV - Indian Dramas & Web Series",
  description: "Download Natak TV to watch 100+ Indian dramas and web series. Available on Google Play Store.",
  alternates: { canonical: "/go" },
  robots: {
    index: false,
    follow: false,
  },
};

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.nataktv.app";

export default function GoPage() {
  return (
    <>
      {/* Server-side meta refresh fallback for bots/browsers with JS disabled */}
      <meta httpEquiv="refresh" content={`0;url=${PLAY_STORE_URL}`} />
      <GoRedirect playStoreUrl={PLAY_STORE_URL} />
    </>
  );
}
