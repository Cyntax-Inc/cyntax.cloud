"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Ticket = { id: string; subject: string; description: string; category: string; priority: string; status: string; email?: string; createdAt?: number };
type Client = { displayName: string; companyName: string; email: string; website: string; phone: string };
type Activity = { id: string; type: string; changes?: { status?: string; priority?: string }; actorEmail?: string; createdAt?: number };
type Message = { id: string; text: string; authorEmail: string; authorRole: string; createdAt: number };
const statuses = ["open", "in_progress", "waiting_on_client", "resolved", "closed"];
const priorities = ["Low", "Normal", "High", "Urgent"];
const inputClass = "rounded-xl border border-white/10 bg-[#171717] px-4 py-3 text-sm text-white outline-none focus:border-violet-400/50";
const formatDate = (n?: number) => n ? new Date(n).toLocaleString() : "—";

function LinkedText({ text }: { text: string }) {
  return <>{text.split(/(https?:\/\/[^\s<>]+)/gi).map((part, index) => /^https?:\/\//i.test(part) ? <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="break-all text-violet-400 underline hover:text-violet-300">{part}</a> : <span key={index}>{part}</span>)}</>;
}

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    const res = await fetch(`/api/tickets/${encodeURIComponent(id)}`, { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Unable to load ticket");
    setTicket(data.ticket); setMessages(data.messages); setClient(data.client || null); setActivity(data.activity || []); setIsAdmin(data.isAdmin);
  }, [id]);
  useEffect(() => {
    let active = true;
    async function begin() { try { await load(); } catch (e) { if (active) setError(e instanceof Error ? e.message : "Unable to load ticket"); } finally { if (active) setLoading(false); } }
    begin(); return () => { active = false; };
  }, [load]);
  async function send() {
    if (!reply.trim() || busy) return;
    setBusy(true); setError("");
    try {
      const res = await fetch(`/api/tickets/${encodeURIComponent(id)}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: reply }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error || "Unable to send reply");
      setReply(""); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to send reply"); } finally { setBusy(false); }
  }
  async function update(field: "status" | "priority", value: string) {
    if (busy) return;
    setBusy(true); setError("");
    try {
      const res = await fetch(`/api/tickets/${encodeURIComponent(id)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [field]: value }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error || "Unable to update ticket");
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to update ticket"); } finally { setBusy(false); }
  }
  if (loading) return <div className="text-white/60">Loading ticket...</div>;
  if (!ticket) return <div className="space-y-4"><Link className="text-violet-400" href="/dashboard/tickets">← Back to tickets</Link><p className="text-rose-300">{error || "Ticket not found"}</p></div>;
  return <div className="space-y-6">
    <Link className="text-sm text-violet-400 hover:text-violet-300" href="/dashboard/tickets">← Back to tickets</Link>
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <p className="text-xs text-white/40">Ticket {ticket.id} · Opened {formatDate(ticket.createdAt)}</p>
      <h1 className="mt-3 text-2xl font-semibold text-white">{ticket.subject}</h1>
      <p className="mt-3 text-sm text-white/50">{ticket.category || "General Support"} · {ticket.email || ""}</p>
      <div className="mt-5 grid gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm sm:grid-cols-2">
        <div><span className="block text-xs text-white/40">Client / Company</span><span className="text-white/85">{client?.displayName || "—"}{client?.companyName ? ` · ${client.companyName}` : ""}</span></div>
        <div><span className="block text-xs text-white/40">Contact</span><span className="text-white/85">{client?.email || ticket.email || "—"}{client?.phone ? ` · ${client.phone}` : ""}</span></div>
        <div className="sm:col-span-2"><span className="block text-xs text-white/40">Account website</span>{client?.website ? <a href={/^https?:\/\//i.test(client.website) ? client.website : `https://${client.website}`} target="_blank" rel="noopener noreferrer" className="break-all text-violet-400 underline hover:text-violet-300">{client.website}</a> : <span className="text-white/50">Not provided in account settings</span>}</div>
      </div>
      <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-white/80"><LinkedText text={ticket.description} /></p>
      <div className="mt-6 flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-2 text-xs text-white/50">Status
          {isAdmin ? <select className={inputClass} value={ticket.status} disabled={busy} onChange={e => update("status", e.target.value)}>{statuses.map(s => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}</select> : <span className="text-sm text-white">{ticket.status.replaceAll("_", " ")}</span>}
        </label>
        <label className="flex flex-col gap-2 text-xs text-white/50">Priority
          {isAdmin ? <select className={inputClass} value={ticket.priority} disabled={busy} onChange={e => update("priority", e.target.value)}>{priorities.map(p => <option key={p}>{p}</option>)}</select> : <span className="text-sm text-white">{ticket.priority}</span>}
        </label>
        {isAdmin && ticket.status !== "closed" && <button type="button" disabled={busy} onClick={() => update("status", "closed")} className="rounded-xl border border-white/20 px-4 py-3 text-sm text-white hover:bg-white/10 disabled:opacity-50">Close ticket</button>}
        {isAdmin && ticket.status === "closed" && <button type="button" disabled={busy} onClick={() => update("status", "open")} className="rounded-xl bg-violet-600 px-4 py-3 text-sm text-white disabled:opacity-50">Reopen ticket</button>}
      </div>
    </section>
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <h2 className="text-lg font-semibold text-white">Conversation</h2>
      <div className="mt-5 space-y-3">
        {messages.length === 0 && <p className="text-sm text-white/40">No replies yet. Start the conversation below.</p>}
        {messages.map(m => <div key={m.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><div className="flex flex-wrap justify-between gap-2 text-xs text-white/45"><span>{m.authorRole === "admin" ? "Cyntax Admin" : m.authorEmail}</span><span>{formatDate(m.createdAt)}</span></div><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/85"><LinkedText text={m.text} /></p></div>)}
      </div>
      {activity.length > 0 && <details className="mt-6 rounded-xl border border-white/10 p-4"><summary className="cursor-pointer text-sm text-white/70">Status and activity history ({activity.length})</summary><div className="mt-4 space-y-2">{activity.map(a => <div key={a.id} className="text-xs text-white/55">{formatDate(a.createdAt)} · {a.actorEmail || "Admin"} · {a.changes?.status ? `Status: ${a.changes.status.replaceAll("_", " ")}` : a.changes?.priority ? `Priority: ${a.changes.priority}` : a.type}</div>)}</div></details>}
      {ticket.status === "closed" && <p className="mt-6 text-sm text-white/50">This ticket is closed. {isAdmin ? "Reopen it to continue the conversation." : "Contact support if you need it reopened."}</p>}
      {ticket.status !== "closed" && <form onSubmit={e => { e.preventDefault(); send(); }} className="mt-6 space-y-3">
        <label htmlFor="ticket-reply" className="block text-sm text-white/70">Reply</label>
        <textarea id="ticket-reply" className={`${inputClass} w-full`} rows={4} maxLength={10000} value={reply} onChange={e => setReply(e.target.value)} placeholder="Write a message..." required />
        {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
        <button type="submit" disabled={busy || !reply.trim()} className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50">{busy ? "Saving..." : "Send reply"}</button>
      </form>}
    </section>
  </div>;
}
