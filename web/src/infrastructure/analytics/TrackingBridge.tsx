"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { COOKIE_CONSENT_CHANGED, readConfirmedConsent, readPendingConsent, submitPendingConsent } from "@/shared/cookies/cookieConsentStorage";
import { trackEvent } from "./use-gtag";
import { syncDirectProviders } from "./directProviders";

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const ga4MeasurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
const trackingEnabled = Boolean(gtmId && /^GTM-[A-Z0-9]+$/.test(gtmId));
const directTrackingEnabled = Boolean(process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ||
  process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID);
const campaignKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
const contactValue = /[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:\+?\d[\s().-]*){10,}/i;
const clarityAllowed = (path: string) => path === "/" || /^\/(jewellery|product)(\/|$)/.test(path);

function pagePayload(marketing: boolean) {
  const query = new URLSearchParams(window.location.search);
  const safe = new URLSearchParams();
  for (const key of campaignKeys) {
    const value = query.get(key);
    if (value && value.length <= 150 && !contactValue.test(value)) safe.set(key, value);
  }
  if (marketing) for (const key of ["gclid", "fbclid"]) {
    const value = query.get(key);
    if (value && value.length <= 200 && !contactValue.test(value)) safe.set(key, value);
  }
  const path = window.location.pathname + (safe.size ? `?${safe}` : "");
  return { page_path: path, page_location: window.location.origin + path,
    clarity_allowed: clarityAllowed(window.location.pathname) };
}

function pauseClarity() {
  (window as Window & { clarity?: (...args: unknown[]) => void }).clarity?.("pause");
}

function updateLoadedProviders(analytics: boolean, marketing: boolean) {
  const clarity = (window as Window & { clarity?: (...args: unknown[]) => void }).clarity;
  clarity?.("consentv2", { ad_Storage: marketing ? "granted" : "denied",
    analytics_Storage: analytics ? "granted" : "denied" });
  const fbq = (window as Window & { fbq?: (...args: unknown[]) => void }).fbq;
  fbq?.("consent", marketing ? "grant" : "revoke");
}

export default function TrackingBridge() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPage = useRef<string | null>(null);
  const previousConsent = useRef<{ analytics: boolean; marketing: boolean } | null>(null);

  useEffect(() => {
    if (!trackingEnabled && !directTrackingEnabled) return;
    let active = true;
    const sync = () => {
      const choice = readConfirmedConsent();
      const analytics = choice?.preferences.analytics === true;
      const marketing = choice?.preferences.marketing === true;
      if (!choice) lastPage.current = null;
      if ((analytics && !previousConsent.current?.analytics) || (marketing && !previousConsent.current?.marketing)) {
        lastPage.current = null;
      }
      previousConsent.current = { analytics, marketing };
      window.dataLayer ??= [];
      window.dataLayer.push({
        ga4_measurement_id: ga4MeasurementId && /^G-[A-Z0-9]+$/.test(ga4MeasurementId) ? ga4MeasurementId : undefined,
        meta_pixel_id: metaPixelId && /^\d+$/.test(metaPixelId) ? metaPixelId : undefined,
        clarity_project_id: clarityProjectId && /^[a-z0-9]+$/i.test(clarityProjectId) ? clarityProjectId : undefined,
      });
      window.dataLayer.push({ event: "consent_state", analytics_consent: analytics, marketing_consent: marketing });
      updateLoadedProviders(analytics, marketing);
      syncDirectProviders(analytics, marketing, clarityAllowed(window.location.pathname));
      if (gtmId && trackingEnabled && (analytics || marketing) && !document.getElementById("sunny-gtm")) {
        const script = document.createElement("script");
        script.id = "sunny-gtm";
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
        document.head.appendChild(script);
      }
      if (choice) {
        const path = window.location.pathname + window.location.search;
        if (lastPage.current !== path) {
          lastPage.current = path;
          trackEvent("page_view", pagePayload(marketing));
        }
      }
    };
    const retry = async () => { const pending = readPendingConsent(); if (pending && active) await submitPendingConsent(pending); };
    sync();
    void retry();
    window.addEventListener(COOKIE_CONSENT_CHANGED, sync);
    window.addEventListener("online", retry);
    const timer = window.setInterval(retry, 30000);
    return () => { active = false; window.removeEventListener(COOKIE_CONSENT_CHANGED, sync); window.removeEventListener("online", retry); window.clearInterval(timer); };
  }, []);

  useEffect(() => {
    if (!trackingEnabled && !directTrackingEnabled) return;
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!anchor || anchor.getAttribute("target") === "_blank") return;
      const url = new URL(anchor.getAttribute("href") ?? "", window.location.href);
      if (url.origin === window.location.origin && !clarityAllowed(url.pathname)) pauseClarity();
    };
    const onPopState = () => { if (!clarityAllowed(window.location.pathname)) pauseClarity(); };
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => { document.removeEventListener("click", onClick, true); window.removeEventListener("popstate", onPopState); };
  }, []);

  useEffect(() => {
    if (!trackingEnabled && !directTrackingEnabled) return;
    const clarity = (window as Window & { clarity?: (...args: unknown[]) => void }).clarity;
    if (readConfirmedConsent()?.preferences.analytics) {
      syncDirectProviders(true, readConfirmedConsent()?.preferences.marketing === true, clarityAllowed(pathname ?? "/"));
    }
    if (clarityAllowed(pathname ?? "/") && readConfirmedConsent()?.preferences.analytics) clarity?.("resume");
    else clarity?.("pause");
  }, [pathname]);

  useEffect(() => {
    if ((!trackingEnabled && !directTrackingEnabled) || !readConfirmedConsent()) return;
    const query = searchParams?.toString();
    const path = `${pathname ?? "/"}${query ? `?${query}` : ""}`;
    if (path === lastPage.current) return;
    lastPage.current = path;
    trackEvent("page_view", pagePayload(readConfirmedConsent()?.preferences.marketing === true));
  }, [pathname, searchParams]);

  return null;
}
