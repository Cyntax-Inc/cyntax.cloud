"use client";

import { createContext, useContext, type ReactNode } from "react";

type PortalAccess = { readOnly: boolean };
const PortalAccessContext = createContext<PortalAccess | null>(null);

export function PortalAccessProvider({ readOnly, children }: PortalAccess & { children: ReactNode }) {
  return (
    <PortalAccessContext.Provider value={{ readOnly }}>
      {children}
    </PortalAccessContext.Provider>
  );
}

export function usePortalAccess(): PortalAccess {
  const context = useContext(PortalAccessContext);
  if (!context) throw new Error("PortalAccessProvider is missing");
  return context;
}
