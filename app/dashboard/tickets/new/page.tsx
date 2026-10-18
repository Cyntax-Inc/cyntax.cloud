import Link from "next/link";
import NewTicketForm from "../../../../components/dashboard/NewTicketForm";
import { getCurrentUserProfile } from "../../../../lib/currentUser";
import { isPortalReadOnly } from "../../../../lib/portalAccess";

export default async function NewTicketPage() {
  const user = await getCurrentUserProfile();
  if (isPortalReadOnly(user.role)) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-300">View-only access</p>
        <h1 className="mt-3 text-2xl font-semibold">New tickets are unavailable</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">This account can review its existing tickets, but cannot create or change requests in the client portal.</p>
        <Link className="mt-6 inline-block text-sm font-medium text-violet-300 hover:text-violet-200" href="/dashboard/tickets">Back to your tickets &rarr;</Link>
      </div>
    );
  }
  return <NewTicketForm />;
}
