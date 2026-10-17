import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../lib/firebaseAdmin";
import { getCurrentUserProfile } from "../../../../../lib/currentUser";
import { canWriteInPortal, ownsPortalResource } from "../../../../../lib/portalAccess";
import { portalApiError } from "../../../../../lib/apiErrors";

type Context = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Context) {
  try {
    const user = await getCurrentUserProfile();
    if (!canWriteInPortal(user.role)) {
      return NextResponse.json({ error: "This account has read-only portal access" }, { status: 403 });
    }
    const { id } = await params;
    const body: unknown = await req.json();
    const message = (body && typeof body === "object" && "message" in body)
      ? (body as { message: unknown }).message : undefined;
    if (typeof message !== "string" || !message.trim() || message.length > 10000) {
      return NextResponse.json({ error: "Message must be between 1 and 10000 characters" }, { status: 400 });
    }
    const ref = db.collection("tickets").doc(id);
    const now = Date.now();
    const result = await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists || !ownsPortalResource(user.uid, snap.data()?.userId)) return "not_found";
      if (snap.data()?.status === "closed") return "closed";
      const messageRef = ref.collection("messages").doc();
      tx.create(messageRef, {
        text: message.trim(),
        authorId: user.uid,
        authorEmail: user.email,
        authorRole: "client",
        createdAt: now,
      });
      tx.update(ref, { updatedAt: now });
      return messageRef.id;
    });
    if (result === "not_found") return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    if (result === "closed") return NextResponse.json({ error: "This ticket is closed" }, { status: 409 });
    return NextResponse.json({ ok: true, id: result });
  } catch (error) {
    return portalApiError(error, "Unable to send message");
  }
}
