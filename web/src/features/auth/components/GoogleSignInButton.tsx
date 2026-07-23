"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { toast } from "sonner";
import { runPostLoginSync } from "../services/postLoginSync";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

type GoogleCredentialResponse = {
  credential?: string;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

/** Renders the Google Identity Services button. Renders nothing when the client ID is not configured. */
const GoogleSignInButton = ({ nextUrl }: { nextUrl: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  const initialize = () => {
    if (initializedRef.current || !GOOGLE_CLIENT_ID) return;
    const google = window.google;
    const container = containerRef.current;
    if (!google || !container) return;

    initializedRef.current = true;
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response: GoogleCredentialResponse) => {
        void handleCredential(response);
      },
    });
    google.accounts.id.renderButton(container, {
      theme: "outline",
      size: "large",
      width: 320,
      text: "continue_with",
    });
  };

  const handleCredential = async (response: GoogleCredentialResponse) => {
    if (!response.credential) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }

    const apiResponse = await fetch("/api/auth/social", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider: "GOOGLE", idToken: response.credential }),
    }).catch(() => null);

    if (!apiResponse?.ok) {
      const data = (await apiResponse?.json().catch(() => null)) as { error?: string } | null;
      toast.error(data?.error ?? "Google sign-in failed. Please try again.");
      return;
    }

    await runPostLoginSync();
    window.location.assign(nextUrl);
  };

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initialize}
      />
      <div ref={containerRef} className="flex justify-center" />
    </>
  );
};

export default GoogleSignInButton;
