import assert from "node:assert/strict";
import test from "node:test";
import { verifyTurnstileToken } from "../lib/turnstile.ts";

test("Turnstile refuses empty or oversized tokens without calling Cloudflare", async () => {
  assert.equal(await verifyTurnstileToken("", "secret"), false);
  assert.equal(await verifyTurnstileToken("a".repeat(2049), "secret"), false);
  assert.equal(await verifyTurnstileToken("token", ""), false);
});

test("Turnstile sends the token and secret to Siteverify", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    assert.equal(url, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
    assert.equal(init.method, "POST");
    assert.equal(init.body.get("secret"), "test-secret");
    assert.equal(init.body.get("response"), "test-token");
    return { ok: true, json: async () => ({ success: true, action: "login" }) };
  };
  try {
    assert.equal(await verifyTurnstileToken("test-token", "test-secret"), true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("Turnstile rejects validation failures and wrong actions", async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({ success: false, action: "login" }),
    });
    assert.equal(await verifyTurnstileToken("test-token", "test-secret"), false);

    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({ success: true, action: "contact" }),
    });
    assert.equal(await verifyTurnstileToken("test-token", "test-secret"), false);

    // Cloudflare test keys return success without an action field.
    globalThis.fetch = async () => ({
      ok: true,
      json: async () => ({ success: true }),
    });
    assert.equal(
      await verifyTurnstileToken("test-token", "1x0000000000000000000000000000000AA"),
      true,
    );
    assert.equal(await verifyTurnstileToken("test-token", "test-secret"), false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
