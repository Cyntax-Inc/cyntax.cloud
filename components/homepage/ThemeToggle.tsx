"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle light/dark mode"
      className="flex items-center gap-2 rounded-full border p-2 px-3 text-sm font-medium shadow-sm hover:shadow transition"
    >
      {isDark ? (
        <>
          <Sun className="h-5 w-5 text-grey-700" />
          {/* Text hidden on small screens */}
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="h-5 w-5 text-gray-700 dark:text-gray-700" />
          <span className="hidden sm:inline">Dark</span>
        </>
      )}
    </button>
  );
}
