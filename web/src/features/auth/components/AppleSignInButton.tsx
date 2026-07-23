"use client";

import { useState } from "react";
import Script from "next/script";
import { toast } from "sonner";
import { runPostLoginSync } from "../services/postLoginSync";

const APPLE_CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
const APPLE_REDIRECT_URI = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI;

type AppleSignInResponse = {
  authorization: {
    id_token: string;
  };
  user?: {
    name?: {
      firstName?: string;
      lastName?: string;
    };
  };
};

declare global {
  interface Window {
    AppleID?: {
      auth: {
        init: (config: Record<string, unknown>) => void;
        signIn: () => Promise<AppleSignInResponse>;
      };
    };
  }
}

/** Sign in with Apple (popup flow). Renders nothing when the Service ID is not configured. */
const AppleSignInButton = ({ nextUrl }: { nextUrl: string }) => {
  const [submitting, setSubmitting] = useState(false);

  if (!APPLE_CLIENT_ID) {
    return null;
  }

  const handleClick = async () => {
    const appleId = window.AppleID;
    if (!appleId) {
      toast.error("Apple sign-in is still loading. Please try again.");
      return;
    }

    setSubmitting(true);
    const nonce = crypto.randomUUID();

    try {
      appleId.auth.init({
        clientId: APPLE_CLIENT_ID,
        scope: "name email",
        redirectURI: APPLE_REDIRECT_URI ?? `${window.location.origin}/login`,
        usePopup: true,
        nonce,
      });

      const response = await appleId.auth.signIn();

      const apiResponse = await fetch("/api/auth/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "APPLE",
          idToken: response.authorization.id_token,
          nonce,
          // Apple returns the name only on the FIRST authorization — forward it.
          firstName: response.user?.name?.firstName,
          lastName: response.user?.name?.lastName,
        }),
      });

      if (!apiResponse.ok) {
        const data = (await apiResponse.json().catch(() => null)) as { error?: string } | null;
        toast.error(data?.error ?? "Apple sign-in failed. Please try again.");
        setSubmitting(false);
        return;
      }

      await runPostLoginSync();
      window.location.assign(nextUrl);
    } catch {
      // User closed the popup or the flow failed.
      setSubmitting(false);
    }
  };

  return (
    <>
      <Script
        src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
        strategy="afterInteractive"
      />
      <button
        type="button"
        disabled={submitting}
        onClick={() => void handleClick()}
        className="inline-flex w-full max-w-[320px] items-center justify-center gap-2 border border-darkblack bg-black px-8 py-3 font-body text-sm uppercase tracking-widest text-white transition-colors hover:bg-darkblack disabled:opacity-60"
      >
        {submitting ? "Signing in…" : " Sign in with Apple"}
      </button>
    </>
  );
};

export default AppleSignInButton;
