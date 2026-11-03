import { readConfirmedConsent } from "@/shared/cookies/cookieConsentStorage";

declare global { interface Window { dataLayer?: Record<string, unknown>[] } }

export function trackEvent(action: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || process.env.NEXT_PUBLIC_APP_ENV !== "production" || !process.env.NEXT_PUBLIC_GTM_ID) return;
  if (action === "search" && typeof params?.search_term === "string" &&
    /[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:\+?\d[\s().-]*){10,}/i.test(params.search_term)) return;
  const choice = readConfirmedConsent();
  if (!choice || (!choice.preferences.analytics && !choice.preferences.marketing)) return;
  window.dataLayer ??= [];
  if (params?.items) window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({ event: action, ...params });
}

export function trackPageView(path: string) {
  if (typeof window !== "undefined") trackEvent("page_view", { page_path: path, page_location: window.location.origin + path });
}
