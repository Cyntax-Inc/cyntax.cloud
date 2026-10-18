import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/firebaseAdmin";
import { sendTicketEmail } from "../../../lib/postmark";
import { getCurrentUserProfile } from "../../../lib/currentUser";
import { canWriteInPortal } from "../../../lib/portalAccess";
import { portalApiError } from "../../../lib/apiErrors";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUserProfile();

    if (!canWriteInPortal(user.role)) {
      return NextResponse.json({ error: "This account has read-only portal access" }, { status: 403 });
    }

    const body = await req.json();
    const { subject, category, priority, description } = body || {};

    if (typeof subject !== "string" || !subject.trim() || subject.length > 160 ||
        typeof description !== "string" || !description.trim() || description.length > 10000 ||
        (category !== undefined && (typeof category !== "string" || category.length > 100)) ||
        (priority !== undefined && !["Low", "Normal", "High", "Urgent"].includes(priority))) {
      return NextResponse.json(
        { error: "Provide a subject (up to 160 characters), description (up to 10000 characters), and valid priority" },
        { status: 400 }
      );
    }

    const now = Date.now();

    const ticket = {
      userId: user.uid,
      email: user.email,
      clientName: user.displayName || "",
      companyName: user.companyName || "",
      website: user.website || "",
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
    return portalApiError(error, "Unable to create ticket");
  }
}