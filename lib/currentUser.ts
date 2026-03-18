import { cookies } from "next/headers";
import { adminAuth, db } from "./firebaseAdmin";

export async function getCurrentUserProfile() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    throw new Error("Unauthorized");
  }

  const decoded = await adminAuth.verifySessionCookie(session, true);
  const uid = decoded.uid;

  const userRef = db.collection("users").doc(uid);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    const now = Date.now();

    const newUser = {
      uid,
      email: decoded.email || "",
      displayName: decoded.name || "",
      phone: "",
      title: "",
      companyName: "",
      billingEmail: decoded.email || "",
      website: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      timezone: "",
      role: "client",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    await userRef.set(newUser);
    return newUser;
  }

  const user = userSnap.data();

  if (!user?.isActive) {
    throw new Error("User is inactive");
  }

  return {
    uid,
    email: user.email || decoded.email || "",
    displayName: user.displayName || "",
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
    isActive: user.isActive,
    createdAt: user.createdAt || null,
    updatedAt: user.updatedAt || null,
  };
}