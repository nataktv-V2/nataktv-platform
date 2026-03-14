import { AdScaler } from "@/components/ads/AdScaler";

export default function AdsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdScaler>{children}</AdScaler>;
}
