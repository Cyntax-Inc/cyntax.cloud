type Ticket = {
  id: string;
  subject: string;
  category?: string;
  priority?: string;
  status: "open" | "in_progress" | "waiting_on_client" | "resolved" | "closed";
  createdAt?: number | null;
};

const statusStyles: Record<Ticket["status"], string> = {
  open: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
  in_progress: "border-violet-400/20 bg-violet-500/10 text-violet-300",
  waiting_on_client: "border-amber-400/20 bg-amber-500/10 text-amber-300",
  resolved: "border-sky-400/20 bg-sky-500/10 text-sky-300",
  closed: "border-white/10 bg-white/[0.06] text-white/60",
};

function formatDate(value?: number | null) {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function TicketList({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Support Tickets
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            Current requests
          </h1>
        </div>

        <p className="text-sm text-white/45">
          Review current statuses and recent support activity.
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        <div className="hidden grid-cols-[1.4fr_0.9fr_0.9fr_0.9fr] gap-4 border-b border-white/10 bg-white/[0.04] px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/40 md:grid">
          <span>Subject</span>
          <span>Category</span>
          <span>Priority</span>
          <span>Status</span>
        </div>

        <div className="divide-y divide-white/10">
          {tickets.length === 0 ? (
            <div className="px-5 py-10 text-sm text-white/50">
              No tickets available.
            </div>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="grid gap-4 px-5 py-5 md:grid-cols-[1.4fr_0.9fr_0.9fr_0.9fr] md:items-center"
              >
                <div>
                  <p className="text-sm font-medium text-white">{ticket.subject}</p>
                  <p className="mt-1 text-xs text-white/40">
                    {formatDate(ticket.createdAt)}
                  </p>
                </div>

                <div className="text-sm text-white/65">{ticket.category || "—"}</div>
                <div className="text-sm text-white/65">{ticket.priority || "—"}</div>

                <div>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${statusStyles[ticket.status]}`}
                  >
                    {ticket.status.replaceAll("_", " ")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}