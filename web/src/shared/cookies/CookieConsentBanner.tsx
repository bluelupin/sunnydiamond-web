"use client";

import { useCallback, useEffect, useState, type AnimationEvent } from "react";
import { usePathname } from "next/navigation";
import {
  CartOutlineButton,
  CartPrimaryButton,
  CartTextLink,
} from "@/features/cart/components/CartFlowUi";
import GiftingPanelCheckbox from "@/shared/ui/GiftingPanelCheckbox";
import { cn } from "@/shared/utils/cn";
import { isAuthRoute } from "@/shared/utils/navigation";
import { COOKIE_CONSENT_COPY } from "./cookieConsentCopy";
import {
  persistCookieConsentChoice,
  readCookieConsentPreferences,
  type CookieConsentPreferences,
  wasCookieConsentBannerDismissed,
} from "./cookieConsentStorage";

const cookieConsentBannerAnimationMs = 320;

type BannerPhase = "hidden" | "enter" | "visible" | "exit";

export default function CookieConsentBanner() {
  const pathname = usePathname() ?? "/";
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<BannerPhase>("hidden");
  const [expanded, setExpanded] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(true);

  const suppressOnRoute = isAuthRoute(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    if (suppressOnRoute || wasCookieConsentBannerDismissed()) {
      setOpen(false);
      return;
    }

    const stored = readCookieConsentPreferences();
    setAnalyticsEnabled(stored.analytics);
    setMarketingEnabled(stored.marketing);
    setExpanded(false);
    setOpen(true);
  }, [mounted, suppressOnRoute]);

  useEffect(() => {
    if (open) {
      setPhase((current) => (current === "hidden" || current === "exit" ? "enter" : current));
      return;
    }

    setPhase((current) => (current === "hidden" ? "hidden" : "exit"));
  }, [open]);

  useEffect(() => {
    if (phase !== "enter" && phase !== "exit") {
      return;
    }

    const timer = window.setTimeout(() => {
      setPhase((current) => {
        if (current === "enter") {
          return "visible";
        }

        if (current === "exit") {
          return "hidden";
        }

        return current;
      });
    }, cookieConsentBannerAnimationMs);

    return () => window.clearTimeout(timer);
  }, [phase]);

  const handleAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.currentTarget !== event.target) {
      return;
    }

    setPhase((current) => {
      if (current === "enter") {
        return "visible";
      }

      if (current === "exit") {
        return "hidden";
      }

      return current;
    });
  };

  const closeBanner = useCallback((preferences: CookieConsentPreferences) => {
    persistCookieConsentChoice(preferences);
    setOpen(false);
  }, []);

  const handleAcceptAll = useCallback(() => {
    closeBanner({ analytics: true, marketing: true });
  }, [closeBanner]);

  const handleRejectNonEssential = useCallback(() => {
    closeBanner({ analytics: false, marketing: false });
  }, [closeBanner]);

  const handleSavePreferences = useCallback(() => {
    closeBanner({ analytics: analyticsEnabled, marketing: marketingEnabled });
  }, [analyticsEnabled, marketingEnabled, closeBanner]);

  const handleClose = useCallback(() => {
    handleRejectNonEssential();
  }, [handleRejectNonEssential]);

  if (!mounted || phase === "hidden") {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-[54] flex justify-center px-4",
        "pb-[calc(1rem+env(safe-area-inset-bottom,0px))] md:justify-end md:px-6 md:pb-6",
      )}
    >
      <div
        onAnimationEnd={handleAnimationEnd}
        className={cn(
          "pointer-events-auto relative w-full max-w-[420px] bg-white p-5 shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
          "md:max-w-[500px] md:p-6",
          "motion-reduce:animate-none",
          phase === "enter" &&
          "animate-in fade-in duration-300 ease-out max-md:slide-in-from-bottom-full md:slide-in-from-bottom-4",
          phase === "exit" &&
          "animate-out fade-out duration-300 ease-in max-md:slide-out-to-bottom-full md:slide-out-to-bottom-4",
        )}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 inline-flex size-8 items-center justify-center md:right-5 md:top-5"
          aria-label="Close cookie banner"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M18 6L6 18" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" stroke="#0A0A0A" />
            <path d="M18 18L6 6" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" stroke="#0A0A0A" />
          </svg>
        </button>

        <div className="pr-10">
          <h2
            id="cookie-consent-title"
            className="font-larken md:text-xl text-lg font-light leading-110 text-darkblack"
          >
            {COOKIE_CONSENT_COPY.title}
          </h2>
        </div>

        <p
          id="cookie-consent-description"
          className="mt-3 font-gill md:text-base text-sm font-light leading-110 text-neutral500"
        >
          {COOKIE_CONSENT_COPY.description}{" "}
          <CartTextLink
            href={COOKIE_CONSENT_COPY.privacyPolicyHref}
            className="inline align-baseline"
          >
            {COOKIE_CONSENT_COPY.privacyPolicyLabel}
          </CartTextLink>
          .
        </p>

        {expanded ? (
          <div className="mt-4 flex flex-col gap-3 border-t border-neutral300 pt-4">
            <PreferenceRow
              title={COOKIE_CONSENT_COPY.necessaryTitle}
              description={COOKIE_CONSENT_COPY.necessaryDescription}
              checked
              disabled
              onChange={() => undefined}
            />
            <PreferenceRow
              title={COOKIE_CONSENT_COPY.analyticsTitle}
              description={COOKIE_CONSENT_COPY.analyticsDescription}
              checked={analyticsEnabled}
              onChange={setAnalyticsEnabled}
            />
            <PreferenceRow
              title={COOKIE_CONSENT_COPY.marketingTitle}
              description={COOKIE_CONSENT_COPY.marketingDescription}
              checked={marketingEnabled}
              onChange={setMarketingEnabled}
            />
          </div>
        ) : null}

        <div className="mt-4 flex flex-col gap-2 sm:mt-4">
          {!expanded ? (
            <CartTextLink onClick={() => setExpanded(true)} className="w-fit mb-3">
              {COOKIE_CONSENT_COPY.managePreferences}
            </CartTextLink>
          ) : null}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-3">
            {expanded ? (
              <CartOutlineButton
                type="button"
                className="w-full sm:min-w-0 sm:flex-1"
                onClick={handleSavePreferences}
              >
                {COOKIE_CONSENT_COPY.savePreferences}
              </CartOutlineButton>
            ) : (
              <CartOutlineButton
                type="button"
                className="w-full sm:min-w-0 sm:flex-1"
                onClick={handleRejectNonEssential}
              >
                {COOKIE_CONSENT_COPY.rejectNonEssential}
              </CartOutlineButton>
            )}
            <CartPrimaryButton
              type="button"
              className="w-full sm:min-w-0 sm:flex-1"
              onClick={handleAcceptAll}
            >
              {COOKIE_CONSENT_COPY.acceptAll}
            </CartPrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreferenceRow({
  title,
  description,
  checked,
  disabled = false,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <GiftingPanelCheckbox
        checked={checked}
        checkedFill="black"
        disabled={disabled}
        onChange={onChange}
        className="mt-0.5 shrink-0"
      />
      <div className="min-w-0">
        <p className="font-gill text-sm font-normal leading-110 text-darkblack">{title}</p>
        <p className="mt-0.5 font-gill text-sm font-light leading-110 text-neutral500">{description}</p>
      </div>
    </div>
  );
}
