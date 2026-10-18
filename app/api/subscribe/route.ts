import { NextResponse } from "next/server";
import { db } from "../../../lib/firebaseAdmin"; // adjust only if your export name/path differs
import { FieldValue } from "firebase-admin/firestore";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body?.email?.trim().toLowerCase();
    const source = body?.source?.trim() || "unknown";

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address." },
        { status: 400 }
      );
    }

    // Firestore creates the collection automatically on first write
    await db.collection("subscribers").doc(email).set(
      {
        email,
        source,
        subscribed: true,
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to subscribe." },
      { status: 500 }
    );
  }
}