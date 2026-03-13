// app/api/lead/route.ts
import { NextResponse } from "next/server";
import { getDb } from "../../../lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, service, message } = body ?? {};

    // Minimal validation: all fields required
    if (!name || !email || !phone || !service || !message) {
      return NextResponse.json(
        { error: "Please fill out all fields before submitting." },
        { status: 400 }
      );
    }

    const db = getDb();
    const collection = process.env.FIREBASE_LEADS_COLLECTION || "leads";

    const docRef = await db.collection(collection).add({
      name,
      email,
      phone,
      service,
      message,
      createdAt: new Date().toISOString(),
      status: "new",
    });

    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (err) {
    console.error("[lead] Error handling request:", err);
    return NextResponse.json(
      { error: "Failed to submit your request. Please try again." },
      { status: 500 }
    );
  }
}
