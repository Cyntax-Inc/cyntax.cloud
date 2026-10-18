import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import DashboardNav from "../../components/dashboard/DashboardNav";
import SessionWatcher from "../../components/dashboard/SessionWatcher";
import { PortalAccessProvider } from "../../components/dashboard/PortalAccessProvider";
import { getCurrentUserProfile } from "../../lib/currentUser";
import { isPortalReadOnly } from "../../lib/portalAccess";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  let profile;
  try {
    profile = await getCurrentUserProfile();
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") redirect("/login");
    throw error;
  }
  const readOnly = isPortalReadOnly(profile.role);

  return (
    <PortalAccessProvider readOnly={readOnly}>
      <main className="portal-theme min-h-screen bg-portal-canvas text-portal-foreground">
        <SessionWatcher />
        <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
          <div className="grid gap-6 lg:grid-cols-[224px_minmax(0,1fr)] lg:gap-8">
            <DashboardNav readOnly={readOnly} />
            <section className="min-w-0">{children}</section>
          </div>
        </div>
      </main>
    </PortalAccessProvider>
  );
}
