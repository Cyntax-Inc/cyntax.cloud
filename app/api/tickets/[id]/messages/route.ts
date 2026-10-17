import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../lib/firebaseAdmin";
import { getCurrentUserProfile } from "../../../../../lib/currentUser";

type Context = { params: Promise<{ id: string }> };
export async function POST(req: NextRequest, { params }: Context) {
  try {
    const user = await getCurrentUserProfile();
    const { id } = await params;
    const body = await req.json();
    if (typeof body.message !== "string" || !body.message.trim() || body.message.length > 10000) return NextResponse.json({ error: "Message must be between 1 and 10000 characters" }, { status: 400 });
    const ref = db.collection("tickets").doc(id);
    const now = Date.now();
    const result = await db.runTransaction(async tx => {
      const snap = await tx.get(ref);
      if (!snap.exists) return "not_found";
      if (user.role !== "admin" && snap.data()?.userId !== user.uid) return "forbidden";
      const messageRef = ref.collection("messages").doc();
      tx.create(messageRef, { text: body.message.trim(), authorId: user.uid, authorEmail: user.email, authorRole: user.role === "admin" ? "admin" : "client", createdAt: now });
      tx.update(ref, { updatedAt: now });
      return messageRef.id;
    });
    if (result === "not_found") return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    if (result === "forbidden") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json({ ok: true, id: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message === "Unauthorized" ? "Unauthorized" : "Unable to send message" }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}
