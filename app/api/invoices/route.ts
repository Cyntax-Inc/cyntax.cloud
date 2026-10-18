import { NextResponse } from "next/server";
import { db } from "../../../lib/firebaseAdmin";
import { getCurrentUserProfile } from "../../../lib/currentUser";
import { portalApiError } from "../../../lib/apiErrors";

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
    return portalApiError(error, "Unable to load invoices");
  }
}

