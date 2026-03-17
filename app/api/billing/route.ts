import { NextRequest, NextResponse } from "next/server";
import { stripe } from "../../../lib/stripe";
import { adminAuth, db } from "../../../lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);

    const body = await req.json();
    const { invoiceId } = body;

    if (!invoiceId) {
      return NextResponse.json({ error: "Missing invoiceId" }, { status: 400 });
    }

    const invoiceRef = db.collection("invoices").doc(invoiceId);
    const invoiceSnap = await invoiceRef.get();

    if (!invoiceSnap.exists) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const invoice = invoiceSnap.data();

    if (!invoice || invoice.userId !== decoded.uid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (invoice.status === "paid") {
      return NextResponse.json({ error: "Invoice already paid" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: invoice.customerEmail,
      line_items: [
        {
          price_data: {
            currency: invoice.currency || "usd",
            product_data: {
              name: invoice.description,
            },
            unit_amount: invoice.amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        invoiceId,
        userId: decoded.uid,
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/billing?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/billing?canceled=1`,
      automatic_tax: {
        enabled: false,
      },
    });

    await invoiceRef.update({
      stripeSessionId: session.id,
      updatedAt: Date.now(),
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Billing session error:", error);
    return NextResponse.json({ error: "Unable to create checkout session" }, { status: 500 });
  }
}