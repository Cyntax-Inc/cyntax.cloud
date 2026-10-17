import { NextResponse } from "next/server";

export function portalApiError(error: unknown, fallback = "Unable to process request") {
  const message = error instanceof Error ? error.message : "";
  if (message === "Unauthorized") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (message === "User is inactive") {
    return NextResponse.json({ error: "Account is inactive" }, { status: 403 });
  }
  console.error("Portal request failed:", error);
  return NextResponse.json({ error: fallback }, { status: 500 });
}
