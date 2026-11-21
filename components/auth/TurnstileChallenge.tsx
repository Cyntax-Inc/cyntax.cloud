"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      theme: "dark" | "light" | "auto";
      size: "normal" | "compact" | "flexible";
      "response-field": boolean;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
      "timeout-callback": () => void;
    },
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

function getTurnstile(): TurnstileApi | undefined {
  return (window as Window & { turnstile?: TurnstileApi }).turnstile;
}

export default function TurnstileChallenge({
  siteKey,
  onTokenChange,
  resetSignal,
}: {
  siteKey: string;
  onTokenChange: (token: string | null) => void;
  resetSignal: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const tokenCallbackRef = useRef(onTokenChange);
  const [verificationError, setVerificationError] = useState(false);

  useEffect(() => {
    tokenCallbackRef.current = onTokenChange;
  }, [onTokenChange]);

  const renderWidget = useCallback(() => {
    const turnstile = getTurnstile();
    if (!containerRef.current || widgetIdRef.current !== null || !turnstile) {
      return;
    }

    widgetIdRef.current = turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action: "login",
      theme: "dark",
      size: window.innerWidth < 400 ? "compact" : "flexible",
      "response-field": false,
      callback: (token) => {
        setVerificationError(false);
        tokenCallbackRef.current(token);
      },
      "expired-callback": () => tokenCallbackRef.current(null),
      "error-callback": () => {
        setVerificationError(true);
        tokenCallbackRef.current(null);
      },
      "timeout-callback": () => tokenCallbackRef.current(null),
    });
  }, [siteKey]);

  useEffect(() => {
    renderWidget();
  }, [renderWidget]);

  useEffect(() => {
    if (resetSignal > 0 && widgetIdRef.current !== null) {
      getTurnstile()?.reset(widgetIdRef.current);
    }
  }, [resetSignal]);

  useEffect(() => {
    return () => {
      if (widgetIdRef.current !== null) {
        getTurnstile()?.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={renderWidget}
        onError={() => {
          setVerificationError(true);
          tokenCallbackRef.current(null);
        }}
      />
      <div ref={containerRef} aria-label="Security verification" />
      {verificationError ? (
        <p className="text-sm text-rose-300">
          Security verification could not load. Refresh the page to try again.
        </p>
      ) : null}
    </>
  );
}
