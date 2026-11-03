import { readConfirmedConsent } from "@/shared/cookies/cookieConsentStorage";
import { sendDirectEvent, syncDirectProviders } from "./directProviders";

declare global { interface Window { dataLayer?: Record<string, unknown>[] } }

export function trackEvent(action: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (action === "search" && typeof params?.search_term === "string" &&
    /[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:\+?\d[\s().-]*){10,}/i.test(params.search_term)) return;
  const choice = readConfirmedConsent();
  if (!choice || (!choice.preferences.analytics && !choice.preferences.marketing)) return;
  syncDirectProviders(choice.preferences.analytics, choice.preferences.marketing, false);
  window.dataLayer ??= [];
  if (params?.items) window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({ event: action, ...params });
  sendDirectEvent(action, params);
}

export function trackPageView(path: string) {
  if (typeof window !== "undefined") trackEvent("page_view", { page_path: path, page_location: window.location.origin + path });
}
