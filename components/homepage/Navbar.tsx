"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const navigation = [
  { label: "Solutions", href: "#services" },
  { label: "AIOps & monitoring", href: "#aiops" },
  { label: "Our approach", href: "#approach" },
  { label: "Technology", href: "#tooling" },
  { label: "Hosting plans", href: "#pricing" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#090c14]/95 backdrop-blur-xl supports-[backdrop-filter]:bg-[#090c14]/85">
      <div className="mx-auto flex h-[78px] max-w-[1320px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
        <Link href="/" className="relative z-10 shrink-0" aria-label="Cyntax Cloud home" onClick={() => setMenuOpen(false)}>
          <Image
            src="/logo/logo_transparent_dark_mode.png"
            width={240}
            height={68}
            alt="Cyntax Cloud"
            className="h-10 w-auto object-contain sm:h-[44px]"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 xl:gap-8 xl:flex" aria-label="Main navigation">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[13px] font-medium text-slate-300 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          <Link
            href="/login"
            className="rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-300 transition-colors hover:text-white"
          >
            Client login
          </Link>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-lg border border-violet-400/40 bg-violet-500 px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_0_25px_rgba(114,70,240,0.16)] transition hover:border-violet-300 hover:bg-violet-400"
          >
            Let&apos;s talk <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="mobile-cloud-navigation"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-slate-200 transition hover:bg-white/10 xl:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-cloud-navigation"
          aria-label="Mobile navigation"
          className="border-t border-white/10 bg-[#0b0e17] px-5 pb-6 pt-3 sm:px-8 xl:hidden"
        >
          <div className="mx-auto flex max-w-[1320px] flex-col">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-white/[0.07] py-3.5 text-sm font-medium text-slate-200 hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg border border-white/15 px-5 py-3 text-sm font-medium text-white"
              >
                Client login
              </Link>
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center gap-2 rounded-lg bg-violet-500 px-5 py-3 text-sm font-semibold text-white"
              >
                Let&apos;s talk <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
