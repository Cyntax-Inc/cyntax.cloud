
import Link from "next/link";
import { AlertTriangle, ArrowUpRight, TicketPlus } from "lucide-react";
import {
  type TicketSummary,
  formatTicketDate,
  ticketStatusLabel,
  ticketStatusStyle,
} from "../../lib/ticketPresentation";

const priorityStyles: Record<string, string> = {
  urgent: "border-rose-500/50 bg-rose-500/15 text-rose-300",
  high: "border-orange-400/40 bg-orange-400/10 text-orange-300",
  normal: "border-sky-400/35 bg-sky-400/10 text-sky-300",
  low: "border-slate-400/30 bg-slate-400/10 text-slate-300",
};

const closedPriorityStyle =
  "border-white/10 bg-white/[0.025] text-white/35";

export default function TicketList({
  tickets,
  readOnly,
}: {
  tickets: TicketSummary[];
  readOnly: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
      {tickets.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <p className="text-lg font-semibold text-white">
            No requests in this view
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/50">
            Tickets will appear here as you create them and our team works through them.
          </p>
          {!readOnly && (
            <Link
              href="/dashboard/tickets/new"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-violet-300"
            >
              <TicketPlus className="h-4 w-4" />
              Create support ticket
            </Link>
          )}
        </div>
      ) : (
        <div className="divide-y divide-white/10">
          {tickets.map((ticket) => {
            const priority = (ticket.priority || "Normal").trim();
            const priorityKey = priority.toLowerCase();
            const isClosed = ticket.status.toLowerCase() === "closed";

            const priorityClass = isClosed
              ? closedPriorityStyle
              : priorityStyles[priorityKey] || priorityStyles.normal;

            return (
              <Link
                href={`/dashboard/tickets/${encodeURIComponent(ticket.id)}`}
                key={ticket.id}
                className="group flex flex-col gap-3 px-5 py-5 transition hover:bg-white/[0.045] sm:flex-row sm:items-center sm:justify-between sm:px-7"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white group-hover:text-violet-200">
                    {ticket.subject}
                  </p>
                  <p className="mt-2 text-xs text-white/40">
                    {ticket.category || "General support"} · Created {formatTicketDate(ticket.createdAt)} · Updated {formatTicketDate(ticket.updatedAt || ticket.createdAt)}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${priorityClass}`}
                  >
                    {priorityKey === "urgent" && !isClosed ? (
                      <AlertTriangle
                        className="h-3.5 w-3.5 shrink-0"
                        aria-hidden="true"
                      />
                    ) : (
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-current"
                        aria-hidden="true"
                      />
                    )}
                    {priority} priority
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs ${ticketStatusStyle[ticket.status] || ticketStatusStyle.open}`}
                  >
                    {ticketStatusLabel[ticket.status] || ticket.status}
                  </span>

                  <ArrowUpRight className="hidden h-4 w-4 text-white/35 sm:block" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
