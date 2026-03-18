import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "../../../lib/stripe";
import { db } from "../../../lib/firebaseAdmin";
import { getCurrentUserProfile } from "../../../lib/currentUser";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserProfile();
    const body = await req.json();
    const { invoiceId } = body;

    if (!invoiceId) {
      return NextResponse.json({ error: "Missing invoiceId" }, { status: 400 });
    }

    const invoiceRef = db.collection("invoices").doc(String(invoiceId));
    const invoiceSnap = await invoiceRef.get();

    if (!invoiceSnap.exists) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const invoice = invoiceSnap.data()!;

    if (invoice.userId !== user.uid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (invoice.status === "paid") {
      return NextResponse.json({ error: "Invoice already paid" }, { status: 400 });
    }

    const stripe = await getStripe();
    
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: invoice.billingEmail || invoice.clientEmail,
      line_items: [
        {
          price_data: {
            currency: invoice.currency || "usd",
            product_data: {
              name: `${invoice.issuerCompanyName || "Invoice"} - ${invoice.invoiceNumber}`,
              description: invoice.description,
            },
            unit_amount: invoice.amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        invoiceId: invoiceSnap.id,
        userId: user.uid,
        invoiceNumber: invoice.invoiceNumber || "",
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/billing?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/billing?canceled=1`,
    });

    await invoiceRef.update({
      stripeSessionId: session.id,
      updatedAt: Date.now(),
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Billing route error:", error);
    return NextResponse.json(
      { error: error?.message || "Unable to create checkout session" },
      { status: 500 }
    );
  }
}