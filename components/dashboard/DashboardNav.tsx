"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  PlusCircle,
  Settings,
  X,
} from "lucide-react";
import clsx from "clsx";
import LogoutButton from "./LogoutButton";

const links = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/tickets",
    label: "Tickets",
    icon: LifeBuoy,
  },
  {
    href: "/dashboard/tickets/new",
    label: "New Ticket",
    icon: PlusCircle,
  },
  {
    href: "/dashboard/billing",
    label: "Billing",
    icon: CreditCard,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
  },
];

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <nav className="flex flex-col gap-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={clsx(
                "group inline-flex min-h-[48px] items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition",
                active
                  ? "border-violet-400/30 bg-violet-500/10 text-white"
                  : "border-transparent text-white/65 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
              )}
            >
              <Icon
                className={clsx(
                  "h-4 w-4 shrink-0 transition",
                  active
                    ? "text-violet-400"
                    : "text-white/45 group-hover:text-violet-300"
                )}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 border-t border-white/10 pt-4">
        <LogoutButton />
      </div>
    </>
  );
}

export default function DashboardNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      {/* Mobile dropdown nav */}
      <div className="relative lg:hidden" ref={menuRef}>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10">
                <span className="text-sm font-semibold text-violet-400">CC</span>
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight text-white">
                  Client Portal
                </p>
                <p className="text-xs text-white/45">Cyntax Cloud</p>
              </div>
            </div>

            <button
              type="button"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={open}
              onClick={() => setOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/80 transition hover:border-violet-400/40 hover:text-white"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {open ? (
            <div className="mt-4 border-t border-white/10 pt-4">
              <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
            </div>
          ) : null}
        </div>
      </div>

      {/* Desktop sidebar nav */}
      <aside className="hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur lg:block">
        <div className="mb-4 flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10">
            <span className="text-sm font-semibold text-violet-400">CC</span>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-white">
              Client Portal
            </p>
            <p className="text-xs text-white/45">Cyntax Cloud</p>
          </div>
        </div>

        <NavLinks pathname={pathname} />
      </aside>
    </>
  );
}