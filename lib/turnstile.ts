/** Cloudflare Turnstile tokens are single-use and expire after five minutes. */
type SiteverifyResponse = {
  success?: boolean;
  action?: string;
};

export async function verifyTurnstileToken(
  token: string,
  secretKey: string,
): Promise<boolean> {
  if (!token || token.length > 2048 || !secretKey) {
    return false;
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret: secretKey, response: token }),
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      },
    );

    if (!response.ok) {
      return false;
    }

    const result = (await response.json()) as SiteverifyResponse;
    // Cloudflare's documented successful dummy secret omits `action`.
    const usingCloudflareTestKey =
      secretKey === "1x0000000000000000000000000000000AA";
    // Dummy keys must never be accepted by the deployed app.
    if (usingCloudflareTestKey && process.env.NODE_ENV === "production") {
      return false;
    }
    return (
      result?.success === true &&
      (result.action === "login" ||
        (usingCloudflareTestKey && result.action === undefined))
    );
  } catch (error) {
    console.error("Turnstile siteverify request failed:", error);
    return false;
  }
}
