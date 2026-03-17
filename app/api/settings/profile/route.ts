import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/firebaseAdmin";
import { getCurrentUserProfile } from "../../../../lib/currentUser";

export async function GET() {
  try {
    const user = await getCurrentUserProfile();

    return NextResponse.json({
      profile: {
        displayName: user.displayName || "",
        email: user.email || "",
        phone: user.phone || "",
        title: user.title || "",
        companyName: user.companyName || "",
        billingEmail: user.billingEmail || "",
        website: user.website || "",
        addressLine1: user.addressLine1 || "",
        addressLine2: user.addressLine2 || "",
        city: user.city || "",
        state: user.state || "",
        postalCode: user.postalCode || "",
        country: user.country || "",
        timezone: user.timezone || "",
        role: user.role || "client",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Unable to load profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUserProfile();
    const body = await req.json();

    await db.collection("users").doc(user.uid).update({
      displayName: String(body.displayName || "").trim(),
      phone: String(body.phone || "").trim(),
      title: String(body.title || "").trim(),
      companyName: String(body.companyName || "").trim(),
      billingEmail: String(body.billingEmail || "").trim(),
      website: String(body.website || "").trim(),
      addressLine1: String(body.addressLine1 || "").trim(),
      addressLine2: String(body.addressLine2 || "").trim(),
      city: String(body.city || "").trim(),
      state: String(body.state || "").trim(),
      postalCode: String(body.postalCode || "").trim(),
      country: String(body.country || "").trim(),
      timezone: String(body.timezone || "").trim(),
      updatedAt: Date.now(),
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Unable to update profile" },
      { status: 500 }
    );
  }
}