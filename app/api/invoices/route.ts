import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/firebaseAdmin";
import { getCurrentUserProfile } from "../../../lib/currentUser";

function normalizeRole(role?: string) {
  return String(role || "").trim().toLowerCase();
}

function formatInvoiceNumber(timestamp: number) {
  const date = new Date(timestamp);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 900 + 100);
  return `INV-${yyyy}${mm}${dd}-${rand}`;
}

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

type InvoiceLineItem = {
  description: string;
  quantity: number;
  rate: number; // cents
};

export async function GET() {
  try {
    const user = await getCurrentUserProfile();

    const snapshot = await db
      .collection("invoices")
      .where("userId", "==", user.uid)
      .get();

    const invoices = snapshot.docs
      .map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          description:
            data.description ||
            data.lineItems?.[0]?.description ||
            "",
          amount: data.amount ?? data.total ?? 0,
          currency: data.currency || "usd",
          dueDate: data.dueDate || "",
          status: data.status || "open",
          invoiceNumber: data.invoiceNumber || "",
          createdAt: data.createdAt || null,
        };
      })
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    return NextResponse.json({ invoices });
  } catch (error: any) {
    console.error("Invoices fetch error:", error);
    return NextResponse.json(
      { error: error?.message || "Unable to load invoices", invoices: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminUser = await getCurrentUserProfile();

    if (normalizeRole(adminUser.role) !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    const {
      userId,
      invoiceDate,
      paymentTerms,
      dueDate,
      client,
      lineItems,
      taxRate,
      notes,
    } = body;

    if (!userId || !dueDate || !client || !Array.isArray(lineItems) || lineItems.length === 0) {
      return NextResponse.json(
        {
          error:
            "userId, dueDate, client, and at least one line item are required",
        },
        { status: 400 }
      );
    }

    const cleanedLineItems: InvoiceLineItem[] = lineItems
      .map((item: any) => ({
        description: String(item?.description || "").trim(),
        quantity: toNumber(item?.quantity),
        rate: Math.round(toNumber(item?.rate)),
      }))
      .filter(
        (item) =>
          item.description &&
          item.quantity > 0 &&
          Number.isFinite(item.rate) &&
          item.rate >= 0
      );

    if (cleanedLineItems.length === 0) {
      return NextResponse.json(
        { error: "At least one valid line item is required" },
        { status: 400 }
      );
    }

    const clientSnap = await db.collection("users").doc(String(userId)).get();

    if (!clientSnap.exists) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const clientDoc = clientSnap.data() || {};
    const now = Date.now();

    const subtotal = cleanedLineItems.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );

    const normalizedTaxRate = toNumber(taxRate || 0);
    const taxAmount = Math.round(subtotal * (normalizedTaxRate / 100));
    const total = subtotal + taxAmount;

    const clientCompanyName = String(client?.companyName || "").trim();
    const billingEmail = String(client?.billingEmail || "").trim();

    const billingAddressLine1 = String(client?.billingAddress?.line1 || "").trim();
    const billingAddressLine2 = String(client?.billingAddress?.line2 || "").trim();
    const billingCity = String(client?.billingAddress?.city || "").trim();
    const billingState = String(client?.billingAddress?.state || "").trim();
    const billingPostalCode = String(client?.billingAddress?.postalCode || "").trim();
    const billingCountry = String(client?.billingAddress?.country || "").trim();

    if (
      !clientCompanyName ||
      !billingEmail ||
      !billingAddressLine1 ||
      !billingCity ||
      !billingState ||
      !billingPostalCode ||
      !billingCountry
    ) {
      return NextResponse.json(
        { error: "Complete client billing details are required" },
        { status: 400 }
      );
    }

    // Save/update client billing profile for future auto-fill
    await db.collection("users").doc(String(userId)).set(
      {
        companyName: clientCompanyName,
        billingEmail,
        addressLine1: billingAddressLine1,
        addressLine2: billingAddressLine2,
        city: billingCity,
        state: billingState,
        postalCode: billingPostalCode,
        country: billingCountry,
        updatedAt: now,
      },
      { merge: true }
    );

    const invoiceNumber = formatInvoiceNumber(now);

    const invoice = {
      userId: clientDoc.uid || clientSnap.id,
      clientEmail: clientDoc.email || "",
      clientName: clientDoc.displayName || "",
      clientCompanyName: clientCompanyName,
      billingEmail,

      billingAddress: {
        line1: billingAddressLine1,
        line2: billingAddressLine2,
        city: billingCity,
        state: billingState,
        postalCode: billingPostalCode,
        country: billingCountry,
      },

      issuerName: adminUser.displayName || "",
      issuerCompanyName: adminUser.companyName || "Cyntax Cloud",
      issuerEmail: adminUser.email || "",
      issuerWebsite: adminUser.website || "",
      issuerAddressLine1: adminUser.addressLine1 || "",
      issuerAddressLine2: adminUser.addressLine2 || "",
      issuerCity: adminUser.city || "",
      issuerState: adminUser.state || "",
      issuerPostalCode: adminUser.postalCode || "",
      issuerCountry: adminUser.country || "",

      invoiceNumber,
      invoiceDate: invoiceDate || new Date(now).toISOString().slice(0, 10),
      paymentTerms: String(paymentTerms || "Net 30"),
      dueDate: String(dueDate),
      status: "open",
      currency: "usd",

      lineItems: cleanedLineItems.map((item) => ({
        ...item,
        amount: item.quantity * item.rate,
      })),

      description: cleanedLineItems.map((item) => item.description).join(", "),
      amount: total,
      subtotal,
      taxRate: normalizedTaxRate,
      taxAmount,
      total,
      balanceDue: total,
      notes: String(notes || "").trim(),

      stripeSessionId: null,
      stripePaymentIntentId: null,

      createdAt: now,
      updatedAt: now,
    };

    const ref = await db.collection("invoices").add(invoice);

    return NextResponse.json({
      ok: true,
      id: ref.id,
      invoiceNumber,
    });
  } catch (error: any) {
    console.error("Invoice creation error:", error);
    return NextResponse.json(
      { error: error?.message || "Unable to create invoice" },
      { status: 500 }
    );
  }
}