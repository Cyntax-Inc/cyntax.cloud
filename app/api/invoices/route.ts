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
          description: data.description || "",
          amount: data.amount || 0,
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
    const { userId, description, amount, dueDate } = body;

    if (!userId || !description || !amount || !dueDate) {
      return NextResponse.json(
        { error: "userId, description, amount, and dueDate are required" },
        { status: 400 }
      );
    }

    const clientSnap = await db.collection("users").doc(String(userId)).get();

    if (!clientSnap.exists) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const client = clientSnap.data()!;
    const now = Date.now();

    const invoice = {
      userId: client.uid || clientSnap.id,
      clientEmail: client.email || "",
      clientName: client.displayName || "",
      clientCompanyName: client.companyName || "",
      billingEmail: client.billingEmail || client.email || "",

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

      invoiceNumber: formatInvoiceNumber(now),
      description: String(description).trim(),
      amount: Number(amount),
      currency: "usd",
      dueDate: String(dueDate),
      status: "open",

      stripeSessionId: null,
      stripePaymentIntentId: null,

      createdAt: now,
      updatedAt: now,
    };

    const ref = await db.collection("invoices").add(invoice);

    return NextResponse.json({
      ok: true,
      id: ref.id,
      invoiceNumber: invoice.invoiceNumber,
    });
  } catch (error: any) {
    console.error("Invoice creation error:", error);
    return NextResponse.json(
      { error: error?.message || "Unable to create invoice" },
      { status: 500 }
    );
  }
}