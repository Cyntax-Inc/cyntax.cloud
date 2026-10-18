"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Plus, RotateCw } from "lucide-react";
import TicketList from "../../../components/dashboard/TicketList";
import { usePortalAccess } from "../../../components/dashboard/PortalAccessProvider";
import { type TicketSummary, isActiveTicket, sortTickets } from "../../../lib/ticketPresentation";

export default function TicketsPage() {
  const { readOnly } = usePortalAccess();
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [showClosed, setShowClosed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/tickets", { cache: "no-store", signal: controller.signal });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unable to load tickets");
        if (!controller.signal.aborted) setTickets(Array.isArray(data.tickets) ? data.tickets : []);
      } catch (err) {
        if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "Unable to load tickets");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [refresh]);

  const active = useMemo(() => tickets.filter(isActiveTicket).sort(sortTickets), [tickets]);
  const historical = useMemo(() => tickets.filter((ticket) => !isActiveTicket(ticket)).sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0)), [tickets]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">Support center</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Your tickets</h1><p className="mt-2 text-sm text-white/55">View requests, track progress, and continue conversations.</p></div>
        {!readOnly && <Link href="/dashboard/tickets/new" className="inline-flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white hover:bg-violet-500"><Plus className="h-4 w-4" />New ticket</Link>}
      </div>
      {readOnly && <div className="rounded-xl border border-violet-400/20 bg-violet-400/5 px-5 py-3 text-sm text-violet-200">View-only access: only requests created by your account are visible.</div>}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Filter ticket status" className="inline-flex flex-wrap gap-2">
          <button type="button" onClick={() => setShowClosed(false)} aria-pressed={!showClosed} className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${!showClosed ? "border-violet-400/40 bg-violet-500/20 text-violet-100" : "border-white/10 text-white/60 hover:text-white"}`}>Active ({loading ? "—" : active.length})</button>
          <button type="button" onClick={() => setShowClosed(true)} aria-pressed={showClosed} className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${showClosed ? "border-violet-400/40 bg-violet-500/20 text-violet-100" : "border-white/10 text-white/60 hover:text-white"}`}>Resolved / Closed ({loading ? "—" : historical.length})</button>
        </div>
        <button type="button" onClick={() => setRefresh((n) => n + 1)} className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white"><RotateCw className="h-4 w-4"/>Refresh</button>
      </div>
      {error ? <div role="alert" className="rounded-xl border border-rose-400/20 bg-rose-500/10 p-5 text-sm text-rose-200">{error}</div>
        : loading ? <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-7 py-10 text-sm text-white/50">Loading your tickets...</div>
        : <TicketList tickets={showClosed ? historical : active} readOnly={readOnly} />}
    </div>
  );
}
