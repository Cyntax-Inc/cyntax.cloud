"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    // Capture form BEFORE any await — React events become null after await
    const form = e.currentTarget;

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      service: String(formData.get("service") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Handle non-success HTTP codes
      if (!res.ok) {
        let message = "Failed to submit your request.";
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch { /* ignore JSON errors */ }
        throw new Error(message);
      }

      // SUCCESS: show message + clear the form
      setStatus("success");
      form.reset();

      // OPTIONAL: auto-hide the success after 5s
      // setTimeout(() => setStatus("idle"), 5000);

    } catch (err: any) {
      console.error("[LeadForm] submit error:", err);
      setStatus("error");
      setError(err?.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {/* fields identical to your version */}
      <div className="grid gap-1">
        <label className="text-sm font-medium" htmlFor="name">Name</label>
        <input id="name" name="name" required className="rounded-xl border px-3 py-2" />
      </div>

      <div className="grid gap-1 sm:grid-cols-2 sm:gap-4">
        <div>
          <label className="text-sm font-medium" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required className="mt-1 w-full rounded-xl border px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="phone">Phone</label>
          <input id="phone" name="phone" required className="mt-1 w-full rounded-xl border px-3 py-2" />
        </div>
      </div>

      <div className="relative">
        <select
          id="service"
          name="service"
          required
          className="rounded-xl border px-3 py-2 w-full appearance-none"
        >
          <option value="">Select…</option>
          <option>Hosting</option>
          <option>Automation</option>
          <option>DevOps</option>
          <option>Database</option>
          <option>Disaster Recovery</option>
        </select>

        {/* Custom arrow */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          ▼
        </span>
      </div>


      <div className="grid gap-1">
        <label className="text-sm font-medium" htmlFor="message">Project Details</label>
        <textarea id="message" name="message" rows={4} required className="rounded-xl border px-3 py-2" />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-xl px-5 py-3 font-semibold
                   bg-neutral-900 text-white
                   dark:bg-white dark:text-neutral-900
                   shadow hover:opacity-90
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                   focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
      >
        {status === "loading" ? "Sending…" : "Request Quote"}
      </button>

      {status === "success" && (
        <p className="rounded-xl border border-green-600 bg-white/80 dark:bg-green-600/20 backdrop-blur p-3 text-green-700 dark:text-green-300">
          Thanks! Your request has been submitted successfully. We'll be in touch soon.
        </p>
      )}

      {status === "error" && error && (
        <p className="rounded-xl border border-red-600 bg-white/80 dark:bg-red-600/20 backdrop-blur p-3 text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
    </form>
  );
}
