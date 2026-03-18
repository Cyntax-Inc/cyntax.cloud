import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "../../../../lib/stripe";
import { db } from "../../../../lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return new NextResponse("Webhook not configured", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const invoiceId = session.metadata?.invoiceId;

      if (invoiceId) {
        await db.collection("invoices").doc(invoiceId).update({
          status: "paid",
          stripeSessionId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : null,
          updatedAt: Date.now(),
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler failed:", error);
    return new NextResponse("Webhook error", { status: 500 });
  }
}