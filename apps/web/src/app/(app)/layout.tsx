import { AuthProvider } from "@/components/auth/AuthProvider";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { TrialBanner } from "@/components/subscription/TrialBanner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TrialBanner />
      <AppNavbar />
      <main className="pt-14 pb-20 min-h-screen">{children}</main>
      <BottomNav />
    </AuthProvider>
  );
}
