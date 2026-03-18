"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type SubscribeFormProps = {
  source: "hero" | "footer";
  inputId?: string;
  placeholder: string;
  buttonText: string;
  formClassName: string;
  inputClassName: string;
  buttonClassName: string;
  showIcon?: boolean;
};

export default function SubscribeForm({
  source,
  inputId,
  placeholder,
  buttonText,
  formClassName,
  inputClassName,
  buttonClassName,
  showIcon = false,
}: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim()) return;

    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setStatus("error");
        setMessage(data.error || "Subscription failed.");
        return;
      }

      setStatus("success");
      setMessage("Thanks for subscribing.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className={formClassName}>
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>

        <input
          id={inputId}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          className={inputClassName}
        />

        <button type="submit" disabled={loading} className={buttonClassName}>
          {loading ? "Submitting..." : buttonText}
          {showIcon && !loading ? <Send className="h-4 w-4" /> : null}
        </button>
      </form>

      {status === "success" && (
        <p className="mt-2 text-sm text-green-400">{message}</p>
      )}

      {status === "error" && (
        <p className="mt-2 text-sm text-red-400">{message}</p>
      )}
    </div>
  );
}