"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";

export default function RouteThemeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      forcedTheme={pathname === "/" ? "dark" : undefined}
    >
      {children}
    </ThemeProvider>
  );
}
