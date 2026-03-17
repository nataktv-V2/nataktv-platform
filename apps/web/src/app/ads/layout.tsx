import { AdScaler } from "@/components/ads/AdScaler";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-poppins",
});

export default function AdsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={poppins.variable}>
      <AdScaler>{children}</AdScaler>
    </div>
  );
}
