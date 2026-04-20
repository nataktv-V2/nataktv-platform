import { AuthProvider } from "@/components/auth/AuthProvider";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { AuthGatedLayout } from "@/components/layout/AuthGatedLayout";
import { BackButtonHandler } from "@/components/layout/BackButtonHandler";
import { NotificationPrompt } from "@/components/notifications/NotificationPrompt";
import { UpdatePrompt } from "@/components/layout/UpdatePrompt";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <BackButtonHandler />
      <AuthGatedLayout
        navbar={<AppNavbar />}
        bottomNav={<BottomNav />}
      >
        {children}
        <NotificationPrompt />
        <UpdatePrompt />
      </AuthGatedLayout>
    </AuthProvider>
  );
}
