"use client";

import { useState } from "react";
import { FilePlus2 } from "lucide-react";

type Client = {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  companyName: string;
  billingEmail: string;
};

export default function CreateInvoiceForm({
  clients,
  onCreated,
}: {
  clients: Client[];
  onCreated?: () => void;
}) {
  const [userId, setUserId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const amountInCents = Math.round(Number(amount) * 100);

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          description,
          amount: amountInCents,
          dueDate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to create invoice");
      }

      setUserId("");
      setDescription("");
      setAmount("");
      setDueDate("");
      setMessage(`Invoice ${data.invoiceNumber} created successfully.`);
      onCreated?.();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Unable to create invoice");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
        Admin
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
        Create Invoice
      </h2>
      <p className="mt-3 text-sm leading-7 text-white/60">
        Select a client and generate a new invoice from your saved company profile.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-white/80">Client</label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
          >
            <option value="" className="bg-black text-white">
              Select a client
            </option>
            {clients.map((client) => (
              <option key={client.id} value={client.uid} className="bg-black text-white">
                {client.companyName || client.displayName || client.email}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-white/80">Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Managed hosting - March 2026"
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">Amount (USD)</label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            type="number"
            step="0.01"
            min="0"
            placeholder="250.00"
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">Due Date</label>
          <input
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            type="date"
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
          />
        </div>

        {message ? (
          <div className="md:col-span-2 rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-3 text-sm text-violet-300">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="md:col-span-2 rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        ) : null}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FilePlus2 className="h-4 w-4" />
            {loading ? "Creating..." : "Create Invoice"}
          </button>
        </div>
      </form>
    </section>
  );
}