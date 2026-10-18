"use client";

import { LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useState } from "react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;
    setLoading(true);

    try {
      await signOut(auth);
    } catch (error) {
      console.error("Firebase sign out failed:", error);
    }

    try {
      await fetch("/api/auth/session", {
        method: "DELETE",
        cache: "no-store",
      });
    } catch (error) {
      console.error("Session delete request failed:", error);
    }

    // Force a fresh request so middleware/server auth sees the cleared cookie
    window.location.href = "/login";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/75 transition hover:border-violet-400/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogOut className="h-4 w-4" />
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}