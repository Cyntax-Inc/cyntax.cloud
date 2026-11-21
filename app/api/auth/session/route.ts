import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "../../../../lib/firebaseAdmin";
import { verifyTurnstileToken } from "../../../../lib/turnstile";

const EXPIRES_IN = 60 * 60 * 24 * 5 * 1000;

export async function POST(req: NextRequest) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.error("Missing TURNSTILE_SECRET_KEY");
    return NextResponse.json(
      { error: "Sign-in verification is unavailable" },
      { status: 503 },
    );
  }

  try {
    const { idToken, turnstileToken } = await req.json();

    if (typeof idToken !== "string" || !idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    if (typeof turnstileToken !== "string" || !turnstileToken || turnstileToken.length > 2048) {
      return NextResponse.json(
        { error: "Security verification required" },
        { status: 403 },
      );
    }

    // Verify on the server before issuing an authenticated session cookie.
    if (!(await verifyTurnstileToken(turnstileToken, secretKey))) {
      return NextResponse.json(
        { error: "Security verification failed. Please try again." },
        { status: 403 },
      );
    }

    // Require a recent sign-in before minting a long-lived session.
    const decoded = await adminAuth.verifyIdToken(idToken, true);
    if (!decoded.auth_time || Date.now() / 1000 - decoded.auth_time > 5 * 60) {
      return NextResponse.json({ error: "Please sign in again" }, { status: 401 });
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: EXPIRES_IN,
    });

    const res = NextResponse.json({ ok: true });
    
    res.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: EXPIRES_IN / 1000,
    });

    return res;
  } catch (error) {
    console.error("Failed to create session cookie:", error);
    return NextResponse.json(
      { error: "Unable to create session" },
      { status: 401 },
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}