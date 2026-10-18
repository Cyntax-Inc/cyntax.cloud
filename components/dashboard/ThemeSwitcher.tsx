"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const options = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
] as const;

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="h-11 max-w-sm animate-pulse rounded-lg border border-portal-outline bg-portal-surface-raised" aria-label="Loading appearance settings" />
    );
  }

  return (
    <div role="group" aria-label="Color appearance" className="grid max-w-sm grid-cols-3 gap-2">
      {options.map(({ value, label, Icon }) => {
        const selected = theme === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={selected}
            onClick={() => setTheme(value)}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 ${
              selected
                ? "border-violet-600 bg-violet-600 text-white"
                : "border-portal-outline bg-portal-surface text-portal-muted hover:bg-portal-surface-hover hover:text-portal-foreground"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
