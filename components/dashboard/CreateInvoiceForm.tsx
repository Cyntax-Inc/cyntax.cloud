"use client";

import { useEffect, useMemo, useState } from "react";
import { FilePlus2, Plus, Trash2 } from "lucide-react";

type Client = {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  companyName: string;
  billingEmail: string;

  billingAddressLine1?: string;
  billingAddressLine2?: string;
  addressLine1?: string;
  addressLine2?: string;
  addresLine1?: string;
  addresLine2?: string;

  billingCity?: string;
  billingState?: string;
  billingPostalCode?: string;
  billingCountry?: string;

  billingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
};

type LineItem = {
  description: string;
  quantity: number;
  rate: string;
};

const DEFAULT_TERMS = "Net 30";

export default function CreateInvoiceForm({
  clients,
  onCreated,
}: {
  clients: Client[];
  onCreated?: () => void;
}) {
  const [userId, setUserId] = useState("");

  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [paymentTerms, setPaymentTerms] = useState(DEFAULT_TERMS);
  const [dueDate, setDueDate] = useState("");

  const [clientCompanyName, setClientCompanyName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [billingAddressLine1, setBillingAddressLine1] = useState("");
  const [billingAddressLine2, setBillingAddressLine2] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingState, setBillingState] = useState("");
  const [billingPostalCode, setBillingPostalCode] = useState("");
  const [billingCountry, setBillingCountry] = useState("");

  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      description: "",
      quantity: 1,
      rate: "",
    },
  ]);

  const [taxRate, setTaxRate] = useState("0");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedClient = useMemo(
    () => clients.find((client) => client.uid === userId) || null,
    [clients, userId]
  );

  useEffect(() => {
    if (!selectedClient) return;

    const resolvedLine1 =
      selectedClient.billingAddressLine1 ||
      selectedClient.addressLine1 ||
      selectedClient.addresLine1 ||
      selectedClient.billingAddress?.line1 ||
      "";

    const resolvedLine2 =
      selectedClient.billingAddressLine2 ||
      selectedClient.addressLine2 ||
      selectedClient.addresLine2 ||
      selectedClient.billingAddress?.line2 ||
      "";

    const resolvedCity =
      selectedClient.billingCity ||
      selectedClient.billingAddress?.city ||
      "";

    const resolvedState =
      selectedClient.billingState ||
      selectedClient.billingAddress?.state ||
      "";

    const resolvedPostalCode =
      selectedClient.billingPostalCode ||
      selectedClient.billingAddress?.postalCode ||
      "";

    const resolvedCountry =
      selectedClient.billingCountry ||
      selectedClient.billingAddress?.country ||
      "";

    setClientCompanyName(selectedClient.companyName || selectedClient.displayName || "");
    setBillingEmail(selectedClient.billingEmail || selectedClient.email || "");
    setBillingAddressLine1(resolvedLine1);
    setBillingAddressLine2(resolvedLine2);
    setBillingCity(resolvedCity);
    setBillingState(resolvedState);
    setBillingPostalCode(resolvedPostalCode);
    setBillingCountry(resolvedCountry);

    console.log("Selected client for invoice:", selectedClient);
    console.log("Resolved billing address:", {
      resolvedLine1,
      resolvedLine2,
      resolvedCity,
      resolvedState,
      resolvedPostalCode,
      resolvedCountry,
    });
  }, [selectedClient]);

  const hasSavedBillingDetails = useMemo(() => {
    if (!selectedClient) return false;

    const addressLine1 =
      selectedClient.billingAddressLine1 ||
      selectedClient.addressLine1 ||
      selectedClient.addresLine1 ||
      selectedClient.billingAddress?.line1 ||
      "";

    const city =
      selectedClient.billingCity ||
      selectedClient.billingAddress?.city ||
      "";

    const state =
      selectedClient.billingState ||
      selectedClient.billingAddress?.state ||
      "";

    const postalCode =
      selectedClient.billingPostalCode ||
      selectedClient.billingAddress?.postalCode ||
      "";

    const country =
      selectedClient.billingCountry ||
      selectedClient.billingAddress?.country ||
      "";

    return Boolean(
      (selectedClient.companyName || selectedClient.displayName) &&
        (selectedClient.billingEmail || selectedClient.email) &&
        addressLine1 &&
        city &&
        state &&
        postalCode &&
        country
    );
  }, [selectedClient]);

  const requiresBillingDetails = useMemo(() => {
    return Boolean(selectedClient && !hasSavedBillingDetails);
  }, [selectedClient, hasSavedBillingDetails]);

  const subtotal = useMemo(() => {
    return lineItems.reduce((sum, item) => {
      const quantity = Number(item.quantity || 0);
      const rate = Number(item.rate || 0);
      return sum + quantity * rate;
    }, 0);
  }, [lineItems]);

  const taxAmount = useMemo(() => {
    const rate = Number(taxRate || 0);
    return subtotal * (rate / 100);
  }, [subtotal, taxRate]);

  const total = useMemo(() => subtotal + taxAmount, [subtotal, taxAmount]);

  function updateLineItem(index: number, patch: Partial<LineItem>) {
    setLineItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  }

  function addLineItem() {
    setLineItems((prev) => [
      ...prev,
      { description: "", quantity: 1, rate: "" },
    ]);
  }

  function removeLineItem(index: number) {
    setLineItems((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (!userId) {
        throw new Error("Please select a client.");
      }

      const cleanedItems = lineItems
        .map((item) => ({
          description: item.description.trim(),
          quantity: Number(item.quantity || 0),
          rate: Math.round(Number(item.rate || 0) * 100),
        }))
        .filter((item) => item.description && item.quantity > 0 && item.rate >= 0);

      if (cleanedItems.length === 0) {
        throw new Error("Please add at least one valid line item.");
      }

      if (
        !clientCompanyName.trim() ||
        !billingEmail.trim() ||
        !billingAddressLine1.trim() ||
        !billingCity.trim() ||
        !billingState.trim() ||
        !billingPostalCode.trim() ||
        !billingCountry.trim()
      ) {
        throw new Error("Please complete all required billing fields.");
      }

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          invoiceDate,
          paymentTerms,
          dueDate,
          client: {
            companyName: clientCompanyName.trim(),
            billingEmail: billingEmail.trim(),
            billingAddress: {
              line1: billingAddressLine1.trim(),
              line2: billingAddressLine2.trim(),
              city: billingCity.trim(),
              state: billingState.trim(),
              postalCode: billingPostalCode.trim(),
              country: billingCountry.trim(),
            },
          },
          lineItems: cleanedItems,
          taxRate: Number(taxRate || 0),
          notes: notes.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to create invoice");
      }

      setUserId("");
      setInvoiceDate(new Date().toISOString().slice(0, 10));
      setPaymentTerms(DEFAULT_TERMS);
      setDueDate("");
      setClientCompanyName("");
      setBillingEmail("");
      setBillingAddressLine1("");
      setBillingAddressLine2("");
      setBillingCity("");
      setBillingState("");
      setBillingPostalCode("");
      setBillingCountry("");
      setLineItems([{ description: "", quantity: 1, rate: "" }]);
      setTaxRate("0");
      setNotes("");

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
        Generate a structured invoice with company details, billing address, payment terms,
        and line items.
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

        {selectedClient ? (
          <div className="md:col-span-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/65">
            {hasSavedBillingDetails
              ? "Saved client billing details loaded."
              : "This client is missing billing details. Complete the required fields below and save the invoice to store them."}
          </div>
        ) : null}

        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">Invoice Date</label>
          <input
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
            required
            type="date"
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

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-white/80">Payment Terms</label>
          <input
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
            required
            placeholder="Net 30"
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-white/80">Bill To Company</label>
          <input
            value={clientCompanyName}
            onChange={(e) => setClientCompanyName(e.target.value)}
            required
            placeholder="El Mex"
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-white/80">Billing Email</label>
          <input
            value={billingEmail}
            onChange={(e) => setBillingEmail(e.target.value)}
            type="email"
            required={requiresBillingDetails}
            placeholder="billing@example.com"
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-white/80">Address Line 1</label>
          <input
            value={billingAddressLine1}
            onChange={(e) => setBillingAddressLine1(e.target.value)}
            required={requiresBillingDetails}
            placeholder="7124 SC-9"
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-white/80">Address Line 2</label>
          <input
            value={billingAddressLine2}
            onChange={(e) => setBillingAddressLine2(e.target.value)}
            placeholder="Suite, unit, or additional address info"
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">City</label>
          <input
            value={billingCity}
            onChange={(e) => setBillingCity(e.target.value)}
            required={requiresBillingDetails}
            placeholder="Inman"
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">State / Region</label>
          <input
            value={billingState}
            onChange={(e) => setBillingState(e.target.value)}
            required={requiresBillingDetails}
            placeholder="SC"
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">Postal Code</label>
          <input
            value={billingPostalCode}
            onChange={(e) => setBillingPostalCode(e.target.value)}
            required={requiresBillingDetails}
            placeholder="29349"
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">Country</label>
          <input
            value={billingCountry}
            onChange={(e) => setBillingCountry(e.target.value)}
            required={requiresBillingDetails}
            placeholder="United States"
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
          />
        </div>

        <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-white/80">Line Items</label>
            <button
              type="button"
              onClick={addLineItem}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/80 transition hover:bg-white/[0.04]"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {lineItems.map((item, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[1.6fr_0.5fr_0.7fr_auto]"
              >
                <input
                  value={item.description}
                  onChange={(e) =>
                    updateLineItem(index, { description: e.target.value })
                  }
                  placeholder="Managed hosting - March 2026"
                  className="h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
                />

                <input
                  value={item.quantity}
                  onChange={(e) =>
                    updateLineItem(index, { quantity: Number(e.target.value || 0) })
                  }
                  type="number"
                  min="1"
                  step="1"
                  className="h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
                />

                <input
                  value={item.rate}
                  onChange={(e) => updateLineItem(index, { rate: e.target.value })}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="44.59"
                  className="h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
                />

                <button
                  type="button"
                  onClick={() => removeLineItem(index)}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-rose-400/20 px-3 text-rose-300 transition hover:bg-rose-500/10"
                  aria-label="Remove line item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">Tax Rate (%)</label>
          <input
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-sm text-white/45">Invoice Preview Totals</p>
          <div className="mt-3 space-y-2 text-sm text-white/80">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tax</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between font-semibold text-white">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-white/80">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Optional billing notes or service period details"
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400/50"
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