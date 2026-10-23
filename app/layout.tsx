import type { Metadata } from "next";
import "./globals.css";
import RouteThemeProvider from "../components/RouteThemeProvider";

export const metadata: Metadata = {
  title: "Cyntax Cloud",
  description: "Cloud services",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RouteThemeProvider>{children}</RouteThemeProvider>
      </body>
    </html>
  );
}
