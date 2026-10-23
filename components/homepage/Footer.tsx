import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import SubscribeForm from "./SubscribeForm";

const links = [
  { label: "Solutions", href: "#services" },
  { label: "AIOps & monitoring", href: "#aiops" },
  { label: "Our approach", href: "#approach" },
  { label: "Technology", href: "#tooling" },
  { label: "Hosting plans", href: "#pricing" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#080b13] px-5 pt-16 sm:px-8 lg:px-10 lg:pt-20">
      <div className="mx-auto grid max-w-[1240px] gap-12 pb-14 md:grid-cols-2 lg:grid-cols-[1.1fr_0.7fr_1fr] lg:gap-20 lg:pb-20">
        <div>
          <Image
            src="/logo/logo_transparent_dark_mode.png"
            width={240}
            height={68}
            alt="Cyntax Cloud"
            className="h-[46px] w-auto object-contain"
          />
          <p className="mt-6 max-w-[330px] text-[13px] leading-7 text-slate-400">
            Cloud architecture, infrastructure, orchestration, observability and DevOps, engineered for real-world operations.
          </p>
          <a href="mailto:hosting@cyntax.cloud" className="mt-6 inline-flex items-center gap-2 text-[13px] font-medium text-violet-300 transition-colors hover:text-violet-200">
            <Mail className="h-4 w-4" aria-hidden="true" /> hosting@cyntax.cloud
          </a>
          <div className="mt-6 flex gap-2.5">
            <a href="https://www.linkedin.com/company/cyntaxdevelopers" target="_blank" rel="noopener noreferrer" aria-label="Cyntax Cloud on LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.12] text-slate-400 transition hover:border-white/25 hover:text-white">
              <Linkedin className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href="https://github.com/Cyntax-Inc" target="_blank" rel="noopener noreferrer" aria-label="Cyntax Cloud on GitHub" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.12] text-slate-400 transition hover:border-white/25 hover:text-white">
              <Github className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">Explore</h3>
          <nav aria-label="Footer navigation" className="mt-6 flex flex-col items-start gap-3.5">
            {links.map(({ label, href }) => (
              <a key={href} href={href} className="text-[13px] text-slate-400 transition hover:text-white">{label}</a>
            ))}
            <Link href="/login" className="inline-flex items-center gap-1.5 text-[13px] text-slate-400 transition hover:text-white">
              Client portal <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </nav>
        </div>

        <div>
          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">Stay informed</h3>
          <p className="mt-6 max-w-[330px] text-[13px] leading-7 text-slate-400">
            Occasional updates on cloud infrastructure, services and platform developments.
          </p>
          <div className="mt-5">
            <SubscribeForm
              source="footer"
              inputId="cloud-footer-email"
              placeholder="Work email address"
              buttonText="Subscribe"
              showIcon
              formClassName="flex flex-col gap-2 sm:flex-row"
              inputClassName="h-11 min-w-0 w-full flex-1 rounded-lg border border-white/[0.12] bg-white/[0.04] px-3.5 text-[13px] text-white placeholder:text-slate-500 outline-none transition focus:border-violet-400/60"
              buttonClassName="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-violet-500 px-4 text-[13px] font-semibold text-white transition hover:bg-violet-400 disabled:opacity-60"
            />
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1240px] flex-col gap-2 border-t border-white/[0.08] py-6 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Cyntax Cloud. All rights reserved.</p>
        <p>Cloud services by Cyntax Inc.</p>
      </div>
    </footer>
  );
}
