"use client";

import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, LogIn } from "lucide-react";
import TurnstileChallenge from "../../components/auth/TurnstileChallenge";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    if (!turnstileToken) {
      setError("Please complete the security verification.");
      return;
    }

    setLoading(true);
    setError("");
    let signedInToFirebase = false;

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      signedInToFirebase = true;
      const idToken = await cred.user.getIdToken();

      const sessionRes = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken, turnstileToken }),
      });
      const sessionData = await sessionRes.json();

      if (!sessionRes.ok) {
        if (sessionRes.status === 403) {
          throw new Error("Security verification failed. Please try again.");
        }
        if (sessionRes.status === 503) {
          throw new Error("Security verification is unavailable. Please try again later.");
        }
        throw new Error(sessionData.error || "Unable to create session");
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      if (signedInToFirebase) {
        await signOut(auth).catch(() => {});
      }

      const code =
        err && typeof err === "object" && "code" in err ? err.code : null;
      if (
        code === "auth/invalid-credential" ||
        code === "auth/wrong-password" ||
        code === "auth/user-not-found"
      ) {
        setError("Invalid email or password.");
      } else if (
        err instanceof Error &&
        err.message.startsWith("Security verification")
      ) {
        setError(err.message);
      } else {
        console.error("Authentication error:", err);
        setError("Unable to sign in. Please try again later.");
      }
    } finally {
      // A Turnstile token must not be reused for another login attempt.
      setTurnstileToken(null);
      setResetSignal((count) => count + 1);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-16 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
              Cyntax Cloud
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Secure client access for billing and support.
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-7 text-white/60">
              Sign in to access your client portal, submit support requests, review
              ticket status, and manage active invoices through a streamlined secure
              dashboard.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10">
                <LockKeyhole className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Protected Access</p>
                <p className="text-sm text-white/45">
                  For authorized Cyntax Cloud accounts.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur md:p-8">
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10">
                <span className="text-sm font-semibold text-violet-400">CC</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-white">
                  Client Login
                </h2>
                <p className="text-sm text-white/45">
                  Access your dashboard and account services
                </p>
              </div>
            </div>
            <form onSubmit={login} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-violet-400/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-violet-400/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              {turnstileSiteKey ? (
                <TurnstileChallenge
                  siteKey={turnstileSiteKey}
                  onTokenChange={setTurnstileToken}
                  resetSignal={resetSignal}
                />
              ) : (
                <p className="text-sm text-rose-300">
                  Security verification is unavailable. Please contact support.
                </p>
              )}
              {error ? (
                <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                  {error}
                </div>
              ) : null}
              <button
                type="submit"
                disabled={loading || !turnstileToken || !turnstileSiteKey}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Sign In"}
                <LogIn className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
