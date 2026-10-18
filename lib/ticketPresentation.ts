export type TicketStatus = "open" | "in_progress" | "waiting_on_client" | "resolved" | "closed";

export type TicketSummary = {
  id: string;
  subject: string;
  category?: string;
  priority?: string;
  status: TicketStatus;
  createdAt?: number | null;
  updatedAt?: number | null;
  lastStatusUpdateAt?: number | null;
  lastViewedByTeamAt?: number | null;
};

const priorityOrder: Record<string, number> = { Urgent: 0, High: 1, Normal: 2, Low: 3 };
const statusOrder: Record<TicketStatus, number> = {
  waiting_on_client: 0,
  in_progress: 1,
  open: 2,
  resolved: 3,
  closed: 4,
};

export function isActiveTicket(ticket: TicketSummary): boolean {
  return ticket.status !== "resolved" && ticket.status !== "closed";
}

export function sortTickets(a: TicketSummary, b: TicketSummary): number {
  return (priorityOrder[a.priority || ""] ?? 4) - (priorityOrder[b.priority || ""] ?? 4)
    || (statusOrder[a.status] ?? 5) - (statusOrder[b.status] ?? 5)
    || (b.updatedAt ?? b.createdAt ?? 0) - (a.updatedAt ?? a.createdAt ?? 0);
}

export function formatTicketDate(value?: number | null): string {
  if (typeof value !== "number" || !Number.isFinite(value) || !value) return "Not yet";
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export const ticketStatusLabel: Record<TicketStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  waiting_on_client: "Awaiting your reply",
  resolved: "Resolved",
  closed: "Closed",
};

export const ticketStatusStyle: Record<TicketStatus, string> = {
  open: "border-sky-400/25 bg-sky-400/10 text-sky-200",
  in_progress: "border-violet-400/25 bg-violet-400/10 text-violet-200",
  waiting_on_client: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  resolved: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  closed: "border-white/10 bg-white/5 text-white/50",
};
