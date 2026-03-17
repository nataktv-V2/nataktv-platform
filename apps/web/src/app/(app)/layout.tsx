import { AuthProvider } from "@/components/auth/AuthProvider";
import { AppNavbar } from "@/components/layout/AppNavbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { AuthGatedLayout } from "@/components/layout/AuthGatedLayout";
import { NotificationPrompt } from "@/components/notifications/NotificationPrompt";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGatedLayout
        navbar={<AppNavbar />}
        bottomNav={<BottomNav />}
      >
        {children}
        <NotificationPrompt />
      </AuthGatedLayout>
    </AuthProvider>
  );
}
