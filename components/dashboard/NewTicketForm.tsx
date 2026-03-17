"use client";

import { useState } from "react";
import { Send } from "lucide-react";

const categories = [
  "General Support",
  "Website Change",
  "Hosting",
  "Security",
  "Infrastructure",
  "Deployment",
  "Billing",
];

export default function NewTicketForm() {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [priority, setPriority] = useState("Normal");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSubmitted(false);
    setError("");

    try {
      const res = await fetch("/api/ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          category,
          priority,
          description,
        }),
      });

      const contentType = res.headers.get("content-type") || "";

      let data: any = null;

      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Non-JSON response from /api/ticket:", text);
        throw new Error("Server returned a non-JSON response.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Ticket submission failed");
      }

      setSubject("");
      setCategory(categories[0]);
      setPriority("Normal");
      setDescription("");
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Unable to submit ticket.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
          New Ticket
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white">
          Submit a support request
        </h1>
        <p className="mt-3 text-sm leading-7 text-white/60">
          Provide a clear summary and relevant details so our team can review and respond
          efficiently.
        </p>
      </div>

      <form onSubmit={submit} className="mt-8 grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="Example: VPS deployment issue"
              className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-violet-400/50"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
            >
              {categories.map((item) => (
                <option key={item} value={item} className="bg-black text-white">
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition focus:border-violet-400/50"
          >
            {["Low", "Normal", "High", "Urgent"].map((item) => (
              <option key={item} value={item} className="bg-black text-white">
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={8}
            placeholder="Describe the issue, timeline, affected systems, and any relevant details."
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-violet-400/50"
          />
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        ) : null}

        <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-medium text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Ticket"}
            <Send className="h-4 w-4" />
          </button>

          {submitted ? (
            <p className="text-sm text-violet-300">
              Your ticket has been submitted successfully.
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}