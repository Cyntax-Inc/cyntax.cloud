import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "../lib/firebaseAdmin";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    return null;
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    return decoded;
  } catch (error) {
    console.error("Invalid or expired session:", error);
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}