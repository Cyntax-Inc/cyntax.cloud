import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/firebaseAdmin";
import { sendTicketEmail } from "../../../lib/postmark";
import { getCurrentUserProfile } from "../../../lib/currentUser";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserProfile();

    const body = await req.json();
    const { subject, category, priority, description } = body;

    if (!subject || !description) {
      return NextResponse.json(
        { error: "Subject and description are required" },
        { status: 400 }
      );
    }

    const now = Date.now();

    const ticket = {
      userId: user.uid,
      email: user.email,
      subject: String(subject).trim(),
      category: category ? String(category).trim() : "General Support",
      priority: priority ? String(priority).trim() : "Normal",
      description: String(description).trim(),
      status: "open",
      createdAt: now,
      updatedAt: now,
      lastStatusUpdateAt: null,
      lastViewedByTeamAt: null,
    };

    const ref = await db.collection("tickets").add(ticket);

    try {
      await sendTicketEmail({
        id: ref.id,
        email: user.email,
        subject: ticket.subject,
        category: ticket.category,
        priority: ticket.priority,
        description: ticket.description,
        status: ticket.status,
      });
    } catch (emailError) {
      console.error("Postmark email failed:", emailError);
    }

    return NextResponse.json({
      ok: true,
      id: ref.id,
      message: "Ticket created successfully",
    });
  } catch (error: any) {
    console.error("Ticket creation error:", error);
    return NextResponse.json(
      { error: error?.message || "Unable to create ticket" },
      { status: 500 }
    );
  }
}