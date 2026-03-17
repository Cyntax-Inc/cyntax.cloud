"use client";

import { useEffect, useState } from "react";
import InvoiceList from "../../../components/dashboard/InvoiceList";
import CreateInvoiceForm from "../../../components/dashboard/CreateInvoiceForm";

type Invoice = {
  id: string;
  description: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: "paid" | "open" | "past_due" | "void";
  invoiceNumber?: string;
};

type Client = {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  companyName: string;
  billingEmail: string;
};

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadBillingData() {
    try {
      setLoading(true);
      setError("");

      const [profileRes, invoicesRes] = await Promise.all([
        fetch("/api/settings/profile", { cache: "no-store" }),
        fetch("/api/invoices", { cache: "no-store" }),
      ]);

      const profileData = await profileRes.json();
      const invoicesData = await invoicesRes.json();

      if (!profileRes.ok) {
        throw new Error(profileData.error || "Unable to load profile");
      }

      if (!invoicesRes.ok) {
        throw new Error(invoicesData.error || "Unable to load invoices");
      }

      setRole(String(profileData.profile?.role || "").trim().toLowerCase());
      setInvoices(Array.isArray(invoicesData.invoices) ? invoicesData.invoices : []);

      const isAdmin = String(profileData.profile?.role || "").trim().toLowerCase() === "admin";

      if (isAdmin) {
        const clientsRes = await fetch("/api/clients", { cache: "no-store" });
        const clientsData = await clientsRes.json();

        if (!clientsRes.ok) {
          throw new Error(clientsData.error || "Unable to load clients");
        }

        setClients(Array.isArray(clientsData.clients) ? clientsData.clients : []);
      } else {
        setClients([]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Unable to load billing");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBillingData();
  }, []);

  async function handlePay(invoiceId: string) {
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invoiceId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
      alert("Unable to start payment flow.");
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-white/60 md:p-8">
        Loading billing...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-6 text-rose-300 md:p-8">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {role === "admin" ? (
        <CreateInvoiceForm clients={clients} onCreated={loadBillingData} />
      ) : null}

      <InvoiceList invoices={invoices} onPay={handlePay} />
    </div>
  );
}