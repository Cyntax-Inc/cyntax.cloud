import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "../../../../lib/stripe";
import { db } from "../../../../lib/firebaseAdmin";

export const dynamic = "force-dynamic";

function now() {
  return Date.now();
}

async function markInvoicePaid({
  invoiceId,
  stripeSessionId,
  stripePaymentIntentId,
  amountPaid,
  rawEventType,
}: {
  invoiceId: string;
  stripeSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  amountPaid?: number | null;
  rawEventType: string;
}) {
  await db.collection("invoices").doc(invoiceId).set(
    {
      status: "paid",
      paidAt: now(),
      updatedAt: now(),
      stripeSessionId: stripeSessionId ?? null,
      stripePaymentIntentId: stripePaymentIntentId ?? null,
      amountPaid: amountPaid ?? null,
      stripeLastEventType: rawEventType,
    },
    { merge: true }
  );
}

async function markInvoiceExpired({
  invoiceId,
  stripeSessionId,
}: {
  invoiceId: string;
  stripeSessionId?: string | null;
}) {
  await db.collection("invoices").doc(invoiceId).set(
    {
      status: "expired",
      updatedAt: now(),
      stripeSessionId: stripeSessionId ?? null,
      stripeLastEventType: "checkout.session.expired",
    },
    { merge: true }
  );
}

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
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log("Stripe webhook: checkout.session.completed", {
          sessionId: session.id,
          paymentStatus: session.payment_status,
          metadata: session.metadata,
        });

        const invoiceId = String(session.metadata?.invoiceId || "").trim();

        if (!invoiceId) {
          console.error(
            "checkout.session.completed missing metadata.invoiceId",
            {
              sessionId: session.id,
              metadata: session.metadata,
            }
          );
          break;
        }

        if (session.payment_status !== "paid") {
          console.log("Checkout session completed but not paid yet", {
            sessionId: session.id,
            invoiceId,
            paymentStatus: session.payment_status,
          });
          break;
        }

        await markInvoicePaid({
          invoiceId,
          stripeSessionId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id || null,
          amountPaid: session.amount_total ?? null,
          rawEventType: event.type,
        });

        console.log("Invoice marked paid from checkout.session.completed", {
          invoiceId,
          sessionId: session.id,
        });

        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log("Stripe webhook: checkout.session.async_payment_succeeded", {
          sessionId: session.id,
          metadata: session.metadata,
        });

        const invoiceId = String(session.metadata?.invoiceId || "").trim();

        if (!invoiceId) {
          console.error(
            "checkout.session.async_payment_succeeded missing metadata.invoiceId",
            {
              sessionId: session.id,
              metadata: session.metadata,
            }
          );
          break;
        }

        await markInvoicePaid({
          invoiceId,
          stripeSessionId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id || null,
          amountPaid: session.amount_total ?? null,
          rawEventType: event.type,
        });

        console.log("Invoice marked paid from async payment success", {
          invoiceId,
          sessionId: session.id,
        });

        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        console.log("Stripe webhook: payment_intent.succeeded", {
          paymentIntentId: paymentIntent.id,
          metadata: paymentIntent.metadata,
          amountReceived: paymentIntent.amount_received,
        });

        const invoiceId = String(paymentIntent.metadata?.invoiceId || "").trim();

        if (!invoiceId) {
          console.log(
            "payment_intent.succeeded had no metadata.invoiceId; skipping invoice update",
            {
              paymentIntentId: paymentIntent.id,
            }
          );
          break;
        }

        await markInvoicePaid({
          invoiceId,
          stripeSessionId: null,
          stripePaymentIntentId: paymentIntent.id,
          amountPaid: paymentIntent.amount_received ?? paymentIntent.amount ?? null,
          rawEventType: event.type,
        });

        console.log("Invoice marked paid from payment_intent.succeeded", {
          invoiceId,
          paymentIntentId: paymentIntent.id,
        });

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log("Stripe webhook: checkout.session.expired", {
          sessionId: session.id,
          metadata: session.metadata,
        });

        const invoiceId = String(session.metadata?.invoiceId || "").trim();

        if (!invoiceId) {
          console.log("Expired checkout session missing metadata.invoiceId", {
            sessionId: session.id,
          });
          break;
        }

        await markInvoiceExpired({
          invoiceId,
          stripeSessionId: session.id,
        });

        console.log("Invoice marked expired from checkout.session.expired", {
          invoiceId,
          sessionId: session.id,
        });

        break;
      }

      default: {
        console.log("Unhandled Stripe event:", event.type);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler failed:", error);
    return new NextResponse("Webhook error", { status: 500 });
  }
}