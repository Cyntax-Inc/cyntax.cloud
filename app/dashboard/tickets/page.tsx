"use client";

import { useEffect, useState } from "react";
import TicketList from "../../../components/dashboard/TicketList";

type Ticket = {
  id: string;
  subject: string;
  category?: string;
  priority?: string;
  status: "open" | "in_progress" | "waiting_on_client" | "resolved" | "closed";
  createdAt?: number | null;
  updatedAt?: number | null;
  lastStatusUpdateAt?: number | null;
  description?: string;
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showClosed, setShowClosed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadTickets() {
      try {
        setLoading(true);
        setError("");

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
        setError(err?.message || "Unable to load tickets right now.");
        setTickets([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadTickets();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/60 md:p-8">
        Loading tickets...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-6 text-sm text-rose-300 md:p-8">
        {error}
      </div>
    );
  }

  const visible = tickets.filter(t => showClosed ? (t.status === "closed" || t.status === "resolved") : t.status !== "closed" && t.status !== "resolved");
  return <div className="space-y-4">
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={() => setShowClosed(false)} className={`rounded-xl px-4 py-2 text-sm ${!showClosed ? "bg-violet-600 text-white" : "border border-white/10 text-white/60"}`}>Unresolved ({tickets.filter(t => t.status !== "closed" && t.status !== "resolved").length})</button>
      <button type="button" onClick={() => setShowClosed(true)} className={`rounded-xl px-4 py-2 text-sm ${showClosed ? "bg-violet-600 text-white" : "border border-white/10 text-white/60"}`}>Resolved / Closed ({tickets.filter(t => t.status === "closed" || t.status === "resolved").length})</button>
    </div>
    <TicketList tickets={visible} />
  </div>;
}