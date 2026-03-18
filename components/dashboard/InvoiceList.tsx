"use client";

import { CreditCard, ExternalLink } from "lucide-react";

type Invoice = {
  id: string;
  description: string;
  amount: string;
  dueDate: string;
  status: "paid" | "open" | "past_due";
};

const statusStyles: Record<Invoice["status"], string> = {
  paid: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
  open: "border-violet-400/20 bg-violet-500/10 text-violet-300",
  past_due: "border-rose-400/20 bg-rose-500/10 text-rose-300",
};

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
                <p className="mt-2 text-sm text-white/50">Due: {invoice.dueDate}</p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="text-right">
                  <p className="text-lg font-semibold text-white">{invoice.amount}</p>
                  <p className="text-xs text-white/45">USD</p>
                </div>

                {invoice.status !== "paid" ? (
                  <button
                    onClick={() => onPay?.(invoice.id)}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-medium text-white transition hover:bg-violet-500"
                  >
                    Pay Now
                    <CreditCard className="h-4 w-4" />
                  </button>
                ) : (
                  <span className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 text-sm font-medium text-white/60">
                    Paid
                    <ExternalLink className="h-4 w-4" />
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/[0.08] p-4 text-sm leading-7 text-white/70">
        Payment methods shown at checkout may include credit and debit cards, Apple Pay,
        Google Pay, Cash App Pay, Venmo, PayPal, and other available wallet or regional
        methods depending on account configuration and device support.
      </div>
    </div>
  );
}