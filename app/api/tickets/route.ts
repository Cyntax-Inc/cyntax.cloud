import { NextResponse } from "next/server";
import { db } from "../../../lib/firebaseAdmin";
import { getCurrentUserProfile } from "../../../lib/currentUser";
import { portalApiError } from "../../../lib/apiErrors";

export async function GET() {
  try {
    const user = await getCurrentUserProfile();
    // Role never widens the scope in the client-facing application.
    const snapshot = await db.collection("tickets").where("userId", "==", user.uid).get();
    const tickets = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        subject: data.subject ?? "",
        category: data.category ?? "",
        priority: data.priority ?? "Normal",
        status: data.status ?? "open",
        createdAt: data.createdAt ?? null,
        updatedAt: data.updatedAt ?? null,
        lastStatusUpdateAt: data.lastStatusUpdateAt ?? null,
        lastViewedByTeamAt: data.lastViewedByTeamAt ?? null,
      };
    });
    return NextResponse.json({ tickets });
  } catch (error) {
    return portalApiError(error, "Unable to load tickets");
  }
}
