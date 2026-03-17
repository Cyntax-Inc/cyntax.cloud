"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Clock3,
  CreditCard,
  LifeBuoy,
  PlusCircle,
  ReceiptText,
} from "lucide-react";

type Ticket = {
  id: string;
  subject: string;
  category?: string;
  priority?: string;
  status: "open" | "in_progress" | "waiting_on_client" | "resolved" | "closed";
  createdAt?: number | null;
  lastStatusUpdateAt?: number | null;
};

const actions = [
  {
    title: "Support Tickets",
    description: "View your current and previous tickets.",
    href: "/dashboard/tickets",
    icon: LifeBuoy,
  },
  {
    title: "Submit New Ticket",
    description: "Open a new support request.",
    href: "/dashboard/tickets/new",
    icon: PlusCircle,
  },
  {
    title: "Billing & Payments",
    description: "Review invoices and payments.",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
];

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
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function DashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsError, setTicketsError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadTickets() {
      try {
        setTicketsLoading(true);
        setTicketsError("");

        const res = await fetch("/api/tickets", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load tickets");
        }

        if (!active) return;

        setTickets(Array.isArray(data.tickets) ? data.tickets : []);
      } catch (err: any) {
        console.error(err);
        if (!active) return;
        setTicketsError(err?.message || "Unable to load tickets.");
        setTickets([]);
      } finally {
        if (active) {
          setTicketsLoading(false);
        }
      }
    }

    loadTickets();

    return () => {
      active = false;
    };
  }, []);

  const ticketSummary = useMemo(() => {
    const open = tickets.filter((t) => t.status === "open").length;
    const inProgress = tickets.filter((t) => t.status === "in_progress").length;
    const waiting = tickets.filter((t) => t.status === "waiting_on_client").length;
    const resolved = tickets.filter((t) => t.status === "resolved").length;

    return {
      total: tickets.length,
      open,
      inProgress,
      waiting,
      resolved,
    };
  }, [tickets]);

  const recentTickets = useMemo(() => tickets.slice(0, 5), [tickets]);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-violet-500/[0.06] p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
          Cyntax Cloud Portal
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Support and billing, streamlined.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">
          Manage tickets, review service activity, and complete invoice payments through a
          secure and simplified client dashboard.
        </p>
      </div>

      <section className="space-y-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Quick Actions
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            Jump right in
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {actions.map(({ title, description, href, icon: Icon }) => (
            <Link
              key={title}
              href={href}
              className="group inline-flex min-h-[120px] flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-400/30 hover:bg-white/[0.05]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10">
                <Icon className="h-5 w-5 text-violet-400" />
              </div>

              <div className="mt-4">
                <h3 className="text-base font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{description}</p>
              </div>

              <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-violet-400 transition group-hover:text-violet-300">
                Open
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-white/45">Total Tickets</p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {ticketsLoading ? "—" : ticketSummary.total}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-white/45">Open Tickets</p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {ticketsLoading ? "—" : ticketSummary.open}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-white/45">In Progress</p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {ticketsLoading ? "—" : ticketSummary.inProgress}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-white/45">Outstanding Balance</p>
          <p className="mt-3 text-3xl font-semibold text-white">$0.00</p>
          <p className="mt-2 text-xs text-white/40">
            Billing summary will update from live invoices.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
                Recent Tickets
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                Latest support activity
              </h2>
            </div>

            <Link
              href="/dashboard/tickets"
              className="inline-flex items-center gap-2 text-sm font-medium text-violet-400 transition hover:text-violet-300"
            >
              View all tickets
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {ticketsLoading ? (
            <div className="mt-6 text-sm text-white/60">Loading tickets...</div>
          ) : ticketsError ? (
            <div className="mt-6 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {ticketsError}
            </div>
          ) : recentTickets.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.04] px-6 py-10 text-center">
              <h3 className="text-lg font-semibold text-white">No tickets yet</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/55">
                You do not have any current or previous support requests.
              </p>
              <Link
                href="/dashboard/tickets/new"
                className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-medium text-white transition hover:bg-violet-500"
              >
                Open New Ticket
                <PlusCircle className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {recentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {ticket.subject}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/45">
                      <span>{ticket.category || "General Support"}</span>
                      <span>•</span>
                      <span>Opened {formatDate(ticket.createdAt)}</span>
                      <span>•</span>
                      <span>
                        Last update{" "}
                        {ticket.lastStatusUpdateAt
                          ? formatDate(ticket.lastStatusUpdateAt)
                          : "Awaiting team review"}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-medium capitalize ${statusStyles[ticket.status]}`}
                  >
                    {ticket.status.replaceAll("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10">
                <ReceiptText className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
                  Billing Summary
                </p>
                <h2 className="mt-1 text-xl font-semibold text-white">
                  Account billing
                </h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm text-white/45">Outstanding Balance</p>
                <p className="mt-2 text-2xl font-semibold text-white">$0.00</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm text-white/45">Open Invoices</p>
                <p className="mt-2 text-2xl font-semibold text-white">0</p>
              </div>

              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.08] p-4 text-sm leading-7 text-white/70">
                Billing data will appear here once live invoices are connected to Firestore.
              </div>

              <Link
                href="/dashboard/billing"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-medium text-white transition hover:bg-violet-500"
              >
                Open Billing
                <CreditCard className="h-4 w-4" />
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-violet-400" />
              <h2 className="text-lg font-semibold text-white">Status Snapshot</h2>
            </div>

            <div className="mt-5 grid gap-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Waiting on Client</span>
                <span className="text-white">{ticketsLoading ? "—" : ticketSummary.waiting}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Resolved</span>
                <span className="text-white">{ticketsLoading ? "—" : ticketSummary.resolved}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}