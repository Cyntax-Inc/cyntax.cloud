"use client";

import InvoiceList from "../../../components/dashboard/InvoiceList";

const mockInvoices = [
  {
    id: "inv_001",
    description: "Managed hosting - March 2026",
    amount: "$250.00",
    dueDate: "March 20, 2026",
    status: "open" as const,
  },
  {
    id: "inv_002",
    description: "Security hardening add-on",
    amount: "$125.00",
    dueDate: "March 10, 2026",
    status: "past_due" as const,
  },
  {
    id: "inv_003",
    description: "Cloud infrastructure retainer - February 2026",
    amount: "$500.00",
    dueDate: "February 20, 2026",
    status: "paid" as const,
  },
];

export default function BillingPage() {
  async function handlePay(invoiceId: string) {
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invoiceId }),
      });

      if (!res.ok) {
        throw new Error("Unable to create checkout session");
      }

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
      alert("Unable to start payment flow.");
    }
  }

  return <InvoiceList invoices={mockInvoices} onPay={handlePay} />;
}