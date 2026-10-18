import Link from "next/link";
import { ArrowUpRight, TicketPlus } from "lucide-react";
import { type TicketSummary, formatTicketDate, ticketStatusLabel, ticketStatusStyle } from "../../lib/ticketPresentation";

export default function TicketList({ tickets, readOnly }: { tickets: TicketSummary[]; readOnly: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
      {tickets.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <p className="text-lg font-semibold text-white">No requests in this view</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/50">Tickets will appear here as you create them and our team works through them.</p>
          {!readOnly && <Link href="/dashboard/tickets/new" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-violet-300"><TicketPlus className="h-4 w-4"/>Create support ticket</Link>}
        </div>
      ) : (
        <div className="divide-y divide-white/10">
          {tickets.map((ticket) => (
            <Link href={`/dashboard/tickets/${encodeURIComponent(ticket.id)}`} key={ticket.id} className="group flex flex-col gap-3 px-5 py-5 transition hover:bg-white/[0.045] sm:flex-row sm:items-center sm:justify-between sm:px-7">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white group-hover:text-violet-200">{ticket.subject}</p>
                <p className="mt-2 text-xs text-white/40">{ticket.category || "General support"} · Created {formatTicketDate(ticket.createdAt)} · Updated {formatTicketDate(ticket.updatedAt || ticket.createdAt)}</p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">{ticket.priority || "Normal"} priority</span>
                <span className={`rounded-full border px-3 py-1 text-xs ${ticketStatusStyle[ticket.status] || ticketStatusStyle.open}`}>{ticketStatusLabel[ticket.status] || ticket.status}</span>
                <ArrowUpRight className="hidden h-4 w-4 text-white/35 sm:block" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
