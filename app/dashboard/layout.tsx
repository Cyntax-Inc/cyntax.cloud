import type { ReactNode } from "react";
import DashboardNav from "../../components/dashboard/DashboardNav";
import SessionWatcher from "../../components/dashboard/SessionWatcher";
import { requireUser } from "../../lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireUser();

  return (
    <main className="min-h-screen bg-black text-white">
      <SessionWatcher />
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <DashboardNav />
          <section className="min-w-0">{children}</section>
        </div>
      </div>
    </main>
  );
}