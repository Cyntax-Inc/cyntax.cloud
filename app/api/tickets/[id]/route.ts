import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/firebaseAdmin";
import { getCurrentUserProfile } from "../../../../lib/currentUser";

type Context = { params: Promise<{ id: string }> };
const statuses = ["open", "in_progress", "waiting_on_client", "resolved", "closed"];
const priorities = ["Low", "Normal", "High", "Urgent"];

function failure(error: unknown) {
  const message = error instanceof Error ? error.message : "Request failed";
  return NextResponse.json({ error: message === "Unauthorized" ? "Unauthorized" : message === "User is inactive" ? message : "Unable to process ticket" }, { status: message === "Unauthorized" ? 401 : message === "User is inactive" ? 403 : 500 });
}

export async function GET(_req: NextRequest, { params }: Context) {
  try {
    const user = await getCurrentUserProfile();
    const { id } = await params;
    const ref = db.collection("tickets").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    const ticket = snap.data()!;
    if (user.role !== "admin" && ticket.userId !== user.uid) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const [messages, clientSnap, activity] = await Promise.all([
      ref.collection("messages").orderBy("createdAt", "asc").get(),
      ticket.userId ? db.collection("users").doc(ticket.userId).get() : Promise.resolve(null),
      ref.collection("activity").orderBy("createdAt", "asc").get(),
    ]);
    const client = clientSnap?.data();
    const clientDetails = {
      displayName: client?.displayName || ticket.clientName || "",
      companyName: client?.companyName || ticket.companyName || "",
      email: client?.email || ticket.email || "",
      website: client?.website || ticket.website || "",
      phone: client?.phone || "",
    };
    return NextResponse.json({ ticket: { id: snap.id, ...ticket }, client: clientDetails, messages: messages.docs.map(doc => ({ id: doc.id, ...doc.data() })), activity: activity.docs.map(doc => ({ id: doc.id, ...doc.data() })), isAdmin: user.role === "admin" });
  } catch (error) { return failure(error); }
}

export async function PATCH(req: NextRequest, { params }: Context) {
  try {
    const user = await getCurrentUserProfile();
    if (user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    const body = await req.json();
    const status = body.status;
    const priority = body.priority;
    if ((status !== undefined && !statuses.includes(status)) || (priority !== undefined && !priorities.includes(priority)) || (status === undefined && priority === undefined)) return NextResponse.json({ error: "Invalid update" }, { status: 400 });
    const ref = db.collection("tickets").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    const now = Date.now();
    const changes: Record<string, unknown> = { updatedAt: now };
    const old = snap.data()!;
    if (status !== undefined && status !== old.status) { changes.status = status; changes.lastStatusUpdateAt = now; }
    if (priority !== undefined && priority !== old.priority) changes.priority = priority;
    if (Object.keys(changes).length === 1) return NextResponse.json({ ok: true });
    const batch = db.batch();
    batch.update(ref, changes);
    batch.create(ref.collection("activity").doc(), { type: "ticket_updated", changes, actorId: user.uid, actorEmail: user.email, createdAt: now });
    await batch.commit();
    return NextResponse.json({ ok: true });
  } catch (error) { return failure(error); }
}
