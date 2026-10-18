/** Client portal permissions intentionally do not grant staff capabilities. */
export type PortalRole = "admin" | "client";

export function getPortalRole(role: unknown): PortalRole {
  return typeof role === "string" && role.trim().toLowerCase() === "client"
    ? "client"
    : "admin";
}

export function canWriteInPortal(role: unknown): boolean {
  return getPortalRole(role) === "client";
}

export function isPortalReadOnly(role: unknown): boolean {
  return !canWriteInPortal(role);
}

/** Ownership is mandatory even for admin-role users of this client portal. */
export function ownsPortalResource(uid: string, ownerId: unknown): boolean {
  return typeof ownerId === "string" && ownerId === uid;
}
