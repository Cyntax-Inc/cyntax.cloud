"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Check, Circle, X } from "lucide-react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  updatePassword,
} from "firebase/auth";
import { auth } from "../../lib/firebase";

function passwordError(error: unknown): string {
  const code = (error as { code?: string } | null)?.code;
  switch (code) {
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Your current password is incorrect.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/weak-password":
      return "Your password does not meet the required security rules.";
    case "auth/requires-recent-login":
      return "Please sign in again before changing your password.";
    case "auth/network-request-failed":
      return "Connection failed. Please check your network and try again.";
    default:
      return "Unable to update your password. Please try again.";
  }
}

function getRequirements(password: string) {
  return [
    { label: "12+ characters", met: password.length >= 12 },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Lowercase letter", met: /[a-z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
    { label: "Special character", met: /[^A-Za-z0-9\s]/.test(password) },
  ];
}

export default function PasswordSettings() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const currentInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const requirements = getRequirements(newPassword);
  const passed = requirements.filter((item) => item.met).length;
  const validPassword = passed === requirements.length;
  const strength = !newPassword ? 0 : validPassword ? 3 : passed >= 3 ? 2 : 1;
  const strengthText = ["", "Weak", "Improving", "Meets requirements"][strength];
  const strengthColor =
    strength === 3 ? "bg-emerald-500" : strength === 2 ? "bg-amber-500" : "bg-rose-500";
  const strengthTextColor =
    strength === 3
      ? "text-emerald-700 dark:text-emerald-300"
      : strength === 2
        ? "text-amber-700 dark:text-amber-300"
        : "text-rose-700 dark:text-rose-300";
  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordReused = currentPassword.length > 0 && currentPassword === newPassword;
  const canSubmit =
    !busy && currentPassword.length > 0 && validPassword && passwordsMatch && !passwordReused;

  function openDialog() {
    setError("");
    if (!dialogRef.current?.open) dialogRef.current?.showModal();
    setIsOpen(true);
    currentInputRef.current?.focus();
  }

  function closeDialog() {
    if (!busy) dialogRef.current?.close();
  }

  function resetOnClose() {
    setIsOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setError("");

    if (!validPassword) {
      setError("Your new password must meet all five requirements.");
      return;
    }
    if (!passwordsMatch) {
      setError("The new passwords do not match.");
      return;
    }
    if (passwordReused) {
      setError("Choose a new password different from your current password.");
      return;
    }

    const user = auth.currentUser;
    if (!user?.email) {
      setError("Your sign-in session is unavailable. Please sign in again.");
      return;
    }

    setBusy(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // Refresh Firebase and the app session after changing credentials.
      await Promise.allSettled([
        fetch("/api/auth/session", { method: "DELETE" }),
        signOut(auth),
      ]);
      router.replace("/login");
      router.refresh();
    } catch (err: unknown) {
      setError(passwordError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="security-title" className="min-w-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 id="security-title" className="text-base font-semibold text-portal-foreground">
            Password &amp; security
          </h2>
          <p className="mt-1 text-xs leading-5 text-portal-muted">
            Update your sign-in password.
          </p>
        </div>
        <button
          type="button"
          onClick={openDialog}
          className="shrink-0 rounded-md border border-portal-outline px-3 py-2 text-xs font-medium text-portal-foreground transition hover:bg-portal-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
        >
          Change password
        </button>
      </div>

      <dialog
        ref={dialogRef}
        onClose={resetOnClose}
        onCancel={(event) => {
          if (busy) event.preventDefault();
        }}
        aria-labelledby="change-password-title"
        aria-describedby="change-password-description"
        className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-xl border border-portal-outline bg-portal-surface-raised p-0 text-portal-foreground shadow-2xl backdrop:bg-black/70"
      >
        <div className="flex items-start justify-between gap-4 border-b border-portal-outline px-5 py-4 sm:px-6">
          <div>
            <h2 id="change-password-title" className="text-lg font-semibold">
              Change password
            </h2>
            <p id="change-password-description" className="mt-1 text-xs leading-5 text-portal-muted">
              Create a secure password for your account.
            </p>
          </div>
          <button
            type="button"
            onClick={closeDialog}
            disabled={busy}
            aria-label="Close password dialog"
            className="rounded-md p-2 text-portal-muted transition hover:bg-portal-surface-hover hover:text-portal-foreground focus-visible:outline-2 focus-visible:outline-violet-500 disabled:opacity-50"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={changePassword} className="space-y-4 px-5 py-5 sm:px-6">
          <div>
            <label htmlFor="current-password" className="mb-1.5 block text-xs font-medium text-portal-muted">
              Current password
            </label>
            <input
              ref={currentInputRef}
              id="current-password"
              type="password"
              autoComplete="current-password"
              required
              disabled={busy}
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="h-10 w-full rounded-lg border border-portal-outline bg-portal-surface px-3 text-sm text-portal-foreground outline-none focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500/20"
            />
          </div>
          <div>
            <label htmlFor="new-password" className="mb-1.5 block text-xs font-medium text-portal-muted">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={12}
              disabled={busy}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              aria-describedby="password-strength password-requirements"
              className="h-10 w-full rounded-lg border border-portal-outline bg-portal-surface px-3 text-sm text-portal-foreground outline-none focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500/20"
            />
            <div id="password-strength" className="mt-2" aria-live="polite" aria-atomic="true">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-portal-muted">Password strength</span>
                <span className={strength ? strengthTextColor : "text-portal-muted"}>
                  {strengthText || "Not entered"}
                </span>
              </div>
              <div aria-hidden="true" className="mt-1.5 grid grid-cols-3 gap-1.5">
                {[1, 2, 3].map((segment) => (
                  <span
                    key={segment}
                    className={`h-1.5 rounded-full transition-colors ${
                      strength >= segment ? strengthColor : "bg-portal-outline"
                    }`}
                  />
                ))}
              </div>
            </div>
            <ul id="password-requirements" aria-label="Password requirements" className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
              {requirements.map(({ label, met }) => (
                <li key={label} className={`flex items-center gap-1.5 text-xs ${
                  met ? "text-emerald-700 dark:text-emerald-300" : "text-portal-muted"
                }`}>
                  {met ? (
                    <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  ) : (
                    <Circle className="h-3 w-3 shrink-0" aria-hidden="true" />
                  )}
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <label htmlFor="confirm-password" className="mb-1.5 block text-xs font-medium text-portal-muted">
              Confirm new password
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={12}
              disabled={busy}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              aria-describedby={confirmPassword ? "password-match" : undefined}
              className="h-10 w-full rounded-lg border border-portal-outline bg-portal-surface px-3 text-sm text-portal-foreground outline-none focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500/20"
            />
            {confirmPassword && (
              <p
                id="password-match"
                role="status"
                className={`mt-1.5 text-xs ${
                  passwordsMatch
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-rose-700 dark:text-rose-300"
                }`}
              >
                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
              </p>
            )}
            {passwordReused && (
              <p className="mt-1.5 text-xs text-rose-700 dark:text-rose-300">
                Your new password must differ from your current password.
              </p>
            )}
          </div>
          {error && (
            <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">
              {error}
            </p>
          )}
          <p className="text-xs leading-5 text-portal-muted">
            After updating your password, you'll sign in again.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="submit"
              disabled={!canSubmit}
              className="min-h-10 rounded-lg bg-violet-600 px-4 text-sm font-medium text-white transition hover:bg-violet-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Updating..." : "Update password"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={closeDialog}
              className="min-h-10 rounded-lg border border-portal-outline px-4 text-sm text-portal-foreground hover:bg-portal-surface-hover disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </dialog>
    </section>
  );
}
