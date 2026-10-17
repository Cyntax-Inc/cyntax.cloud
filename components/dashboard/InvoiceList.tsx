"use client";

import { CreditCard, Download } from "lucide-react";

type Invoice = {
  id: string;
  description: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: "paid" | "open" | "past_due" | "void";
  invoiceNumber?: string;
};

const statusStyles: Record<Invoice["status"], string> = {
  paid: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
  open: "border-violet-400/20 bg-violet-500/10 text-violet-300",
  past_due: "border-rose-400/20 bg-rose-500/10 text-rose-300",
  void: "border-white/10 bg-white/[0.06] text-white/60",
};

function formatMoney(amount: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format((amount || 0) / 100);
}

export default function InvoiceList({
  invoices,
  onPay,
}: {
  invoices: Invoice[];
  onPay?: (invoiceId: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Billing
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            Invoices and payments
          </h1>
        </div>

        <p className="text-sm text-white/45">
          Secure checkout for open balances and active service invoices.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {invoices.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-8 text-sm text-white/50">
            No invoices available.
          </div>
        ) : (
          invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-base font-medium text-white">{invoice.description}</p>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${statusStyles[invoice.status]}`}
                  >
                    {invoice.status.replaceAll("_", " ")}
                  </span>
                </div>
                <p className="mt-2 text-sm text-white/50">
                  {invoice.invoiceNumber ? `${invoice.invoiceNumber} - ` : ""}
                  Due: {invoice.dueDate}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={`/api/invoices/${invoice.id}/pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 text-sm font-medium text-white/75 transition hover:border-violet-400/40 hover:text-white"
                >
                  PDF
                  <Download className="h-4 w-4" />
                </a>

                <div className="text-right">
                  <p className="text-lg font-semibold text-white">
                    {formatMoney(invoice.amount, invoice.currency)}
                  </p>
                  <p className="text-xs text-white/45">USD</p>
                </div>

                {invoice.status !== "paid" && invoice.status !== "void" ? (
                  <button
                    onClick={() => onPay?.(invoice.id)}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-medium text-white transition hover:bg-violet-500"
                  >
                    Pay Now
                    <CreditCard className="h-4 w-4" />
                  </button>
                ) : (
                  <span className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 text-sm font-medium text-white/60">
                    {invoice.status === "paid" ? "Paid" : "Void"}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}