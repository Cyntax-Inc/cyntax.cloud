import { NextResponse } from "next/server";
import { db } from "../../../lib/firebaseAdmin";
import { getCurrentUserProfile } from "../../../lib/currentUser";

export async function GET() {
  try {
    const user = await getCurrentUserProfile();

    const snapshot = await db
      .collection("tickets")
      .where("userId", "==", user.uid)
      .get();

    const tickets = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        subject: data.subject ?? "",
        category: data.category ?? "",
        priority: data.priority ?? "",
        status: data.status ?? "open",
        createdAt: data.createdAt ?? null,
        updatedAt: data.updatedAt ?? null,
        lastStatusUpdateAt: data.lastStatusUpdateAt ?? null,
        lastViewedByTeamAt: data.lastViewedByTeamAt ?? null,
        description: data.description ?? "",
      };
    });

    tickets.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    return NextResponse.json({ tickets });
  } catch (error: any) {
    console.error("Tickets fetch error:", error);
    return NextResponse.json(
      { error: error?.message || "Unable to load tickets", tickets: [] },
      { status: 500 }
    );
  }
}