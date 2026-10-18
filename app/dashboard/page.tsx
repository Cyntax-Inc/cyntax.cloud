"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle, ArrowRight, CircleAlert, Clock3, CreditCard, LifeBuoy,
  Plus, RefreshCw, TicketCheck, TicketPlus,
} from "lucide-react";
import { usePortalAccess } from "../../components/dashboard/PortalAccessProvider";
import {
  type TicketSummary, formatTicketDate, isActiveTicket,
  sortTickets, ticketStatusLabel, ticketStatusStyle,
} from "../../lib/ticketPresentation";

type Invoice = { id: string; amount: number; currency: string; status: string };

const priorityStyles: Record<string, string> = {
  urgent: "border-rose-500/50 bg-rose-500/15 text-rose-300",
  high: "border-orange-400/40 bg-orange-400/10 text-orange-300",
  normal: "border-sky-400/35 bg-sky-400/10 text-sky-300",
  low: "border-slate-400/30 bg-slate-400/10 text-slate-300",
};

function PriorityBadge({ priority, status }: { priority?: string; status: TicketSummary["status"] }) {
  const label = priority?.trim() || "Normal";
  const level = label.toLowerCase();
  const closed = status === "closed";
  const style = closed
    ? "border-white/10 bg-white/[0.025] text-white/35"
    : priorityStyles[level] || priorityStyles.normal;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}>
      {level === "urgent" && !closed ? (
        <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      ) : (
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />
      )}
      {label}
    </span>
  );
}

export default function DashboardPage() {
  const { readOnly } = usePortalAccess();
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [ticketsRes, invoicesRes] = await Promise.all([
          fetch("/api/tickets", { cache: "no-store", signal: controller.signal }),
          fetch("/api/invoices", { cache: "no-store", signal: controller.signal }),
        ]);
        const [ticketData, invoiceData] = await Promise.all([ticketsRes.json(), invoicesRes.json()]);
        if (!ticketsRes.ok) throw new Error(ticketData.error || "Unable to load tickets");
        if (!invoicesRes.ok) throw new Error(invoiceData.error || "Unable to load billing summary");
        if (controller.signal.aborted) return;
        setTickets(Array.isArray(ticketData.tickets) ? ticketData.tickets : []);
        setInvoices(Array.isArray(invoiceData.invoices) ? invoiceData.invoices : []);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Unable to load your overview");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [refresh]);
  const activeTickets = useMemo(() => tickets.filter(isActiveTicket).sort(sortTickets), [tickets]);
  const summary = useMemo(() => ({
    total: activeTickets.length,
    open: activeTickets.filter((ticket) => ticket.status === "open").length,
    inProgress: activeTickets.filter((ticket) => ticket.status === "in_progress").length,
    awaiting: activeTickets.filter((ticket) => ticket.status === "waiting_on_client").length,
  }), [activeTickets]);
  const outstandingInvoices = invoices.filter((invoice) => invoice.status === "open" || invoice.status === "past_due" || invoice.status === "expired");
  const balances = outstandingInvoices.reduce<Record<string, number>>((acc, invoice) => {
    const currency = (invoice.currency || "usd").toUpperCase();
    acc[currency] = (acc[currency] || 0) + (Number(invoice.amount) || 0);
    return acc;
  }, {});
  const balanceSummary = Object.keys(balances).length
    ? Object.entries(balances).map(([currency, amount]) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount / 100)).join(" / ")
    : "$0.00";
  const stats = [
    { label: "Active tickets", count: summary.total, hint: "Open, in progress, or awaiting a reply", icon: LifeBuoy },
    { label: "Awaiting your reply", count: summary.awaiting, hint: "Requests that need your attention", icon: CircleAlert },
    { label: "In progress", count: summary.inProgress, hint: "Currently being worked on", icon: Clock3 },
    { label: "Open invoices", count: outstandingInvoices.length, hint: balanceSummary + " outstanding", icon: CreditCard },
  ];
  return (
    <div className="space-y-7">
      <header className="relative overflow-hidden rounded-3xl border border-violet-400/15 bg-gradient-to-br from-[#191525] via-[#10101b] to-[#0b0b11] p-6 sm:p-9">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">Cyntax Cloud / Client portal</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Your service overview</h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-white/60">Stay on top of support requests, conversations, and account billing in one place.</p>
            {readOnly && <span className="mt-4 inline-flex rounded-full border border-violet-400/25 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-200">View-only account</span>}
          </div>
          {!readOnly && <Link href="/dashboard/tickets/new" className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-500"><Plus className="h-4 w-4" />New support ticket</Link>}
        </div>
      </header>
      {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200"><span>{error}</span><button type="button" onClick={() => setRefresh((n) => n + 1)} className="inline-flex items-center gap-2 font-medium underline"><RefreshCw className="h-4 w-4" />Retry</button></div>}
      <section aria-label="Account snapshot" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, count, hint, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <div className="flex items-center justify-between gap-3"><p className="text-sm text-white/65">{label}</p><Icon className="h-4 w-4 text-violet-300" aria-hidden="true" /></div>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-white tabular-nums">{loading || error ? "—" : count}</p>
            <p className="mt-2 text-xs leading-5 text-white/40">{label === "Open invoices" && (loading || error) ? "Invoice balance" : hint}</p>
          </div>
        ))}
      </section>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)]">
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-5 sm:px-7">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">Support queue</p><h2 className="mt-2 text-xl font-semibold text-white">Active requests</h2><p className="mt-1 text-xs text-white/45">Prioritized by urgency, status, and recent activity</p></div>
            <Link className="inline-flex items-center gap-2 text-sm font-medium text-violet-300 hover:text-violet-200" href="/dashboard/tickets">All tickets <ArrowRight className="h-4 w-4" /></Link>
          </div>
          {loading ? <p className="px-7 py-10 text-sm text-white/45">Loading support activity...</p>
            : error ? <p className="px-7 py-10 text-sm text-white/45">Activity is temporarily unavailable.</p>
            : activeTickets.length === 0 ? <div className="px-7 py-12 text-center"><TicketCheck className="mx-auto h-9 w-9 text-emerald-300/70"/><h3 className="mt-4 text-base font-semibold text-white">All caught up</h3><p className="mt-2 text-sm text-white/50">You have no active support requests.</p>{!readOnly && <Link href="/dashboard/tickets/new" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-violet-300"><TicketPlus className="h-4 w-4" />Create a ticket</Link>}</div>
            : <div className="divide-y divide-white/10">{activeTickets.slice(0, 6).map((ticket) => (
                <Link key={ticket.id} href={`/dashboard/tickets/${encodeURIComponent(ticket.id)}`} className="group flex flex-col gap-3 px-5 py-4 transition hover:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between sm:px-7">
                  <div className="min-w-0"><p className="truncate text-sm font-semibold text-white group-hover:text-violet-200">{ticket.subject}</p><p className="mt-1.5 text-xs text-white/40">{ticket.category || "General support"} <span aria-hidden="true">·</span> Updated {formatTicketDate(ticket.updatedAt || ticket.createdAt)}</p></div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2"><PriorityBadge priority={ticket.priority} status={ticket.status} /><span className={`rounded-full border px-2.5 py-1 text-xs ${ticketStatusStyle[ticket.status] || ticketStatusStyle.open}`}>{ticketStatusLabel[ticket.status] || "Open"}</span><ArrowRight className="hidden h-4 w-4 text-white/35 sm:block"/></div>
                </Link>
              ))}</div>}
        </section>
        <div className="space-y-5">
          <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
            <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10"><CreditCard className="h-5 w-5 text-violet-300"/></div><div><h2 className="font-semibold">Billing overview</h2><p className="text-xs text-white/45">Invoices linked to your account</p></div></div>
            <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4"><p className="text-xs text-white/45">Outstanding balance</p><p className="mt-2 break-words text-2xl font-semibold text-white">{loading || error ? "—" : balanceSummary}</p><p className="mt-2 text-xs text-white/40">{loading || error ? "Loading..." : `${outstandingInvoices.length} unpaid invoice${outstandingInvoices.length === 1 ? "" : "s"}`}</p></div>
            <Link href="/dashboard/billing" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-medium text-white/85 transition hover:border-violet-400/40 hover:bg-violet-500/10">View billing <ArrowRight className="h-4 w-4"/></Link>
          </section>
          <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-6"><h2 className="font-semibold">Ticket status</h2><p className="mt-1 text-xs text-white/45">Only active requests are counted</p><div className="mt-5 space-y-4">{[{ label: "Open", count: summary.open },{ label: "In progress", count: summary.inProgress },{ label: "Awaiting client", count: summary.awaiting }].map((item) => <div key={item.label} className="flex items-center justify-between gap-4 text-sm"><span className="text-white/55">{item.label}</span><span className="font-semibold tabular-nums text-white">{loading || error ? "—" : item.count}</span></div>)}</div></section>
        </div>
      </div>
    </div>
  );
}
