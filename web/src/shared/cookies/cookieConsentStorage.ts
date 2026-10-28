const COOKIE_CONSENT_DISMISSED_KEY = "sunny.cookieConsent.dismissed";

/** UI-only: whether the cookie banner has been dismissed this browser. */
export function wasCookieConsentBannerDismissed(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.localStorage.getItem(COOKIE_CONSENT_DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markCookieConsentBannerDismissed(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(COOKIE_CONSENT_DISMISSED_KEY, "1");
  } catch {
    // ignore private mode / quota
  }
}
