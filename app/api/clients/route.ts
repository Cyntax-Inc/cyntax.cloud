import { NextResponse } from "next/server";
import { db } from "../../../lib/firebaseAdmin";
import { getCurrentUserProfile } from "../../../lib/currentUser";

function normalizeRole(role?: string) {
  return String(role || "").trim().toLowerCase();
}

export async function GET() {
  try {
    const currentUser = await getCurrentUserProfile();

    if (normalizeRole(currentUser.role) !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const snapshot = await db.collection("users").get();

    const clients = snapshot.docs
      .map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          uid: data.uid || doc.id,
          email: data.email || "",
          displayName: data.displayName || "",
          companyName: data.companyName || "",
          billingEmail: data.billingEmail || data.email || "",
          isActive: data.isActive !== false,
          role: data.role || "client",
        };
      })
      .filter((user) => user.isActive && normalizeRole(user.role) !== "admin")
      .sort((a, b) => {
        const aName = a.companyName || a.displayName || a.email;
        const bName = b.companyName || b.displayName || b.email;
        return aName.localeCompare(bName);
      });

    return NextResponse.json({ clients });
  } catch (error: any) {
    console.error("Clients fetch error:", error);
    return NextResponse.json(
      { error: error?.message || "Unable to load clients" },
      { status: 500 }
    );
  }
}