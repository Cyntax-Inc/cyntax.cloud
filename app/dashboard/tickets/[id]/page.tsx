"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Clock3, Send } from "lucide-react";
import { usePortalAccess } from "../../../../components/dashboard/PortalAccessProvider";
import { type TicketStatus, ticketStatusLabel, ticketStatusStyle } from "../../../../lib/ticketPresentation";

type Ticket = {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: TicketStatus;
  createdAt?: number | null;
  updatedAt?: number | null;
};
type Activity = { id: string; type: string; changes?: { status?: string; priority?: string }; createdAt?: number | null };
type Message = { id: string; text: string; isOwnMessage?: boolean; createdAt?: number | null };

function formatDate(value?: number | null): string {
  return value ? new Date(value).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "Not yet";
}

function LinkedText({ text }: { text: string }) {
  return <>{text.split(/(https?:\/\/[^\s<>]+)/gi).map((part, index) => /^https?:\/\//i.test(part)
    ? <a key={index} href={part} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex max-w-full items-center gap-1 break-all text-violet-300 underline decoration-violet-400/40 underline-offset-2 hover:text-violet-200">{part}<ArrowUpRight className="inline h-3 w-3 shrink-0"/></a>
    : <span key={index}>{part}</span>)}</>;
}

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { readOnly } = usePortalAccess();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (signal?: AbortSignal) => {
    const res = await fetch(`/api/tickets/${encodeURIComponent(id)}`, { cache: "no-store", signal });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Unable to load ticket");
    if (signal?.aborted) return;
    setTicket(data.ticket);
    setMessages(Array.isArray(data.messages) ? data.messages : []);
    setActivity(Array.isArray(data.activity) ? data.activity : []);
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    void load(controller.signal).catch((err) => {
      if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "Unable to load ticket");
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [load]);

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (readOnly || busy || !reply.trim() || ticket?.status === "closed") return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/tickets/${encodeURIComponent(id)}/messages`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: reply }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to send message");
      setReply("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send message");
    } finally { setBusy(false); }
  }

  if (loading) return <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-sm text-white/50">Loading ticket...</div>;
  if (!ticket) return <div className="space-y-4"><Link className="inline-flex items-center gap-2 text-sm text-violet-300" href="/dashboard/tickets"><ArrowLeft className="h-4 w-4"/>Back to tickets</Link><div role="alert" className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-6 text-rose-200">{error || "Ticket unavailable"}</div></div>;

  return (
    <div className="space-y-6">
      <Link className="inline-flex items-center gap-2 text-sm text-violet-300 transition hover:text-violet-200" href="/dashboard/tickets"><ArrowLeft className="h-4 w-4"/>All tickets</Link>
      <header className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.055] to-transparent p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3 text-xs text-white/45"><span>Support request</span><span className="rounded-md bg-white/5 px-2 py-1 font-mono text-white/60">{ticket.id}</span><span>Opened {formatDate(ticket.createdAt)}</span></div>
        <h1 className="mt-4 break-words text-2xl font-semibold tracking-tight text-white sm:text-3xl">{ticket.subject}</h1>
        <div className="mt-5 flex flex-wrap items-center gap-2"><span className={`rounded-full border px-3 py-1.5 text-xs font-medium ${ticketStatusStyle[ticket.status] || ticketStatusStyle.open}`}>{ticketStatusLabel[ticket.status] || ticket.status}</span><span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70">{ticket.priority || "Normal"} priority</span><span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70">{ticket.category || "General Support"}</span></div>
        <div className="mt-6 border-t border-white/10 pt-5"><h2 className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">Original request</h2><p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-white/75"><LinkedText text={ticket.description || ""}/></p></div>
      </header>

      <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-7" aria-label="Ticket conversation">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5"><div><h2 className="text-xl font-semibold">Conversation</h2><p className="mt-1 text-xs text-white/45">Messages between you and Cyntax support</p></div><span className="text-xs text-white/45">{messages.length} {messages.length === 1 ? "message" : "messages"}</span></div>
        <div className="mt-6 space-y-4">
          {messages.length === 0 && <div className="rounded-xl border border-dashed border-white/15 px-5 py-10 text-center text-sm text-white/50">No messages yet. Your support conversation will appear here.</div>}
          {messages.map((message) => <div key={message.id} className={`flex ${message.isOwnMessage ? "justify-end" : "justify-start"}`}><div className={`max-w-[94%] rounded-2xl border px-5 py-4 sm:max-w-[86%] ${message.isOwnMessage ? "border-violet-400/25 bg-violet-500/10" : "border-white/10 bg-white/[0.045]"}`}><div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-1 text-xs"><span className={`font-semibold ${message.isOwnMessage ? "text-violet-200" : "text-white/75"}`}>{message.isOwnMessage ? "You" : "Cyntax support"}</span><time className="text-white/40">{formatDate(message.createdAt)}</time></div><p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-white/85"><LinkedText text={message.text}/></p></div></div>)}
        </div>
        {error && <div role="alert" className="mt-5 rounded-xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div>}
        {readOnly ? <div className="mt-7 rounded-xl border border-violet-400/20 bg-violet-400/5 p-4 text-sm text-violet-200">View-only access. You can review this conversation but cannot send new messages.</div>
          : ticket.status === "closed" ? <div className="mt-7 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/55">This ticket is closed. Contact support if you need it reopened.</div>
          : <form onSubmit={sendMessage} className="mt-7 space-y-3 border-t border-white/10 pt-6"><label htmlFor="ticket-reply" className="block text-sm font-medium text-white/80">Add a reply</label><textarea id="ticket-reply" className="min-h-28 w-full resize-y rounded-xl border border-white/15 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-violet-400/60" maxLength={10000} value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Describe an update, add details, or ask a question..." required /><div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-white/40">{reply.length.toLocaleString()} / 10,000 characters</span><button type="submit" disabled={busy || !reply.trim()} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-4 w-4"/>{busy ? "Sending..." : "Send reply"}</button></div></form>}
      </section>

      {activity.length > 0 && <details className="rounded-xl border border-white/10 bg-white/[0.025] p-5"><summary className="cursor-pointer text-sm font-medium text-white/70">Ticket activity ({activity.length})</summary><div className="mt-5 space-y-3 border-l border-white/10 pl-4">{activity.map((event) => <p key={event.id} className="flex flex-wrap items-center gap-2 text-xs text-white/55"><Clock3 className="h-3.5 w-3.5"/><time>{formatDate(event.createdAt)}</time><span>·</span><span>{event.changes?.status ? `Status changed to ${event.changes.status.replaceAll("_", " ")}` : event.changes?.priority ? `Priority changed to ${event.changes.priority}` : "Ticket updated"}</span></p>)}</div></details>}
    </div>
  );
}
