// components/Footer.tsx
import { Github, Linkedin, Mail, Send } from "lucide-react";

const footerLinks = [
  ["Services", "#services"],
  ["Tooling", "#tooling"],
  ["Pricing", "#pricing"],
  ["Reviews", "#reviews"],
] as const;

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_1fr]">
          {/* Brand / statement */}
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10">
                <span className="text-sm font-semibold text-violet-400">CC</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">Cyntax Cloud</h3>
                <p className="text-sm text-white/45">Secure cloud infrastructure</p>
              </div>
            </div>

            <p className="mt-6 max-w-lg text-sm leading-7 text-white/60">
              Advanced hosting, hardened security, and streamlined administration
              engineered for performance, resilience, and operational efficiency.
            </p>

            <div className="mt-6">
              <a
                href="mailto:hosting@cyntax.cloud"
                className="inline-flex items-center gap-2 text-sm font-medium text-violet-400 transition hover:text-violet-300"
              >
                <Mail className="h-4 w-4" />
                hosting@cyntax.cloud
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/40">
              Navigation
            </h4>

            <nav className="mt-6 flex flex-col gap-4">
              {footerLinks.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  className="text-sm text-white/65 transition hover:text-white"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Subscribe */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/40">
              Stay Updated
            </h4>

            <p className="mt-6 text-sm leading-7 text-white/60">
              Subscribe for product updates, hosting announcements, and platform news.
            </p>

            <form className="mt-6 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                type="email"
                placeholder="Enter your email"
                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-violet-400/50"
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-medium text-white transition hover:bg-violet-500"
              >
                Subscribe
                <Send className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.linkedin.com/company/cyntaxdevelopers"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/75 transition hover:border-violet-400/40 hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
              </a>

              <a
                href="https://github.com/Cyntax-Inc"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/75 transition hover:border-violet-400/40 hover:text-white"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Cyntax Cloud. All rights reserved.</p>
          <p>Built for advanced security, reliability, and optimum efficiency.</p>
        </div>
      </div>
    </footer>
  );
}