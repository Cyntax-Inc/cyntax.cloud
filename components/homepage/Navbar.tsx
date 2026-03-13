"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Linkedin, Github, Cloud } from "lucide-react";


export default function Navbar() {
  const [open, setOpen] = useState(false);

  const nav = (
    <ul className="flex flex-col gap-4 lg:flex-row lg:items-center">
      {[
        ["Services", "#services"],
        ["Tooling", "#tooling"],
        ["Pricing", "#pricing"],
        ["Reviews", "#reviews"],
      ].map(([label, href]) => (
        <li key={href}>
          <Link
            href={href}
            className="hover:underline"
            onClick={() => setOpen(false)}
          >
            {label}
          </Link>
        </li>
      ))}

      <li className="lg:ml-4">
        <div className="flex items-center gap-2">

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/company/cyntaxdevelopers"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="social-link flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 bg-white/80 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Linkedin className="w-4 h-4" />
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/Cyntax-Inc"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="social-link flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 bg-white/80 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Github className="w-4 h-4" />
          </a>

          <ThemeToggle />
        </div>
      </li>
    </ul>
  );

  return (
    <header className="sticky top-0 z-50 border-b bg-[rgb(var(--bg))]/80 backdrop-blur">
      <div className="container-pad flex items-center justify-between py-3">

        {/* Logo + Brand name */}
        <Link
          href="#"
          className="flex items-center gap-2 text-xl font-bold tracking-tight"
        >
          <span>Cyntax Cloud</span>
          <Cloud className="h-9 w-9" />
        </Link>

        <button
          className="lg:hidden rounded-xl border border-gray-300 py-2 px-3 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <nav className="hidden lg:block">{nav}</nav>
      </div>

      {open && <div className="container-pad pb-4 lg:hidden">{nav}</div>}
    </header>
  );
}