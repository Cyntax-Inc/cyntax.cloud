"use client";

import { useEffect } from "react";
import { onIdTokenChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";

export default function SessionWatcher() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        try {
          await fetch("/api/auth/session", { method: "DELETE" });
        } catch (error) {
          console.error("Failed clearing session cookie:", error);
        }

        router.replace("/login");
        return;
      }

      try {
        await user.getIdToken(true);
      } catch (error) {
        console.error("Token refresh failed:", error);

        try {
          await signOut(auth);
          await fetch("/api/auth/session", { method: "DELETE" });
        } catch (logoutError) {
          console.error("Failed during forced logout:", logoutError);
        }

        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return null;
}