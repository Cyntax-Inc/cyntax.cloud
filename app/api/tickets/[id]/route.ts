import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/firebaseAdmin";
import { getCurrentUserProfile } from "../../../../lib/currentUser";
import { portalApiError } from "../../../../lib/apiErrors";
import { isPortalReadOnly, ownsPortalResource } from "../../../../lib/portalAccess";

type Context = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Context) {
  try {
    const user = await getCurrentUserProfile();
    const { id } = await params;
    const ref = db.collection("tickets").doc(id);
    const snap = await ref.get();
    if (!snap.exists || !ownsPortalResource(user.uid, snap.data()?.userId)) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const [messages, activity] = await Promise.all([
      ref.collection("messages").orderBy("createdAt", "asc").get(),
      ref.collection("activity").orderBy("createdAt", "asc").get(),
    ]);

    const ticket = snap.data()!;
    return NextResponse.json({
      ticket: {
        id: snap.id,
        subject: ticket.subject ?? "",
        description: ticket.description ?? "",
        category: ticket.category ?? "General Support",
        priority: ticket.priority ?? "Normal",
        status: ticket.status ?? "open",
        createdAt: ticket.createdAt ?? null,
        updatedAt: ticket.updatedAt ?? null,
      },
      messages: messages.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text ?? "",
        authorId: doc.data().authorId ?? "",
        authorRole: doc.data().authorRole ?? "client",
        isOwnMessage: doc.data().authorId === user.uid,
        createdAt: doc.data().createdAt ?? null,
      })),
      activity: activity.docs.map((doc) => ({
        id: doc.id,
        type: doc.data().type ?? "ticket_updated",
        changes: doc.data().changes ?? {},
        createdAt: doc.data().createdAt ?? null,
      })),
      readOnly: isPortalReadOnly(user.role),
    });
  } catch (error) {
    return portalApiError(error, "Unable to load ticket");
  }
}

// PATCH intentionally removed. Ticket state and priority are staff-only operations.
