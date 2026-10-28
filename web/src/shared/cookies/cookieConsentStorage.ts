const COOKIE_CONSENT_DISMISSED_KEY = "sunny.cookieConsent.dismissed";
const COOKIE_CONSENT_PREFERENCES_KEY = "sunny.cookieConsent.preferences";

export type CookieConsentPreferences = {
  analytics: boolean;
  marketing: boolean;
};

const DEFAULT_COOKIE_CONSENT_PREFERENCES: CookieConsentPreferences = {
  analytics: true,
  marketing: true,
};

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

export function readCookieConsentPreferences(): CookieConsentPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_COOKIE_CONSENT_PREFERENCES;
  }

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_PREFERENCES_KEY);
    if (!raw) {
      return DEFAULT_COOKIE_CONSENT_PREFERENCES;
    }

    const parsed = JSON.parse(raw) as Partial<CookieConsentPreferences>;
    return {
      analytics:
        typeof parsed.analytics === "boolean"
          ? parsed.analytics
          : DEFAULT_COOKIE_CONSENT_PREFERENCES.analytics,
      marketing:
        typeof parsed.marketing === "boolean"
          ? parsed.marketing
          : DEFAULT_COOKIE_CONSENT_PREFERENCES.marketing,
    };
  } catch {
    return DEFAULT_COOKIE_CONSENT_PREFERENCES;
  }
}

export function writeCookieConsentPreferences(preferences: CookieConsentPreferences): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(COOKIE_CONSENT_PREFERENCES_KEY, JSON.stringify(preferences));
  } catch {
    // ignore private mode / quota
  }
}

export function persistCookieConsentChoice(preferences: CookieConsentPreferences): void {
  writeCookieConsentPreferences(preferences);
  markCookieConsentBannerDismissed();
}
