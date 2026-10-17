"use client";

import { useCallback, useEffect, useState } from "react";
import InvoiceList from "../../../components/dashboard/InvoiceList";
import { usePortalAccess } from "../../../components/dashboard/PortalAccessProvider";

type Invoice = {
  id: string;
  description: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: "paid" | "open" | "past_due" | "void" | "expired";
  invoiceNumber?: string;
};

export default function BillingPage() {
  const { readOnly } = usePortalAccess();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/invoices", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to load invoices");
      setInvoices(Array.isArray(data.invoices) ? data.invoices : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load invoices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadInvoices(); }, [loadInvoices]);

  async function handlePay(invoiceId: string) {
    if (readOnly || payingId) return;
    setPayingId(invoiceId);
    setError("");
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to start payment");
      if (!data.url) throw new Error("Payment link was unavailable");
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start payment");
      setPayingId(null);
    }
  }

  return (
    <div className="space-y-5">
      {readOnly && <div className="rounded-xl border border-violet-400/20 bg-violet-400/5 px-5 py-3 text-sm text-violet-200">View-only access. Your invoices are available to review or download.</div>}
      {error && <div role="alert" className="rounded-xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error} <button type="button" className="ml-3 underline" onClick={() => void loadInvoices()}>Retry</button></div>}
      {loading ? <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-sm text-white/50">Loading invoices...</div> : <InvoiceList invoices={invoices} onPay={readOnly ? undefined : handlePay} payingId={payingId} />}
    </div>
  );
}
