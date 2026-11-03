export type CookieConsentPreferences = { analytics: boolean; marketing: boolean };

export const COOKIE_NOTICE_VERSION = "2026-11-02";
export const COOKIE_CONSENT_CHANGED = "sunny:cookie-consent-changed";
export const OPEN_COOKIE_SETTINGS = "sunny:open-cookie-settings";

const CHOICE_KEY = "sunny.cookieConsent.choice.v2";
const PENDING_KEY = "sunny.cookieConsent.pending.v2";
const BROWSER_ID_KEY = "sunny.cookieConsent.browserId";
const ACCOUNT_LINK_KEY = "sunny.cookieConsent.accountLink.v2";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type ConsentChoice = {
  requestId: string;
  browserId: string;
  noticeVersion: string;
  preferences: CookieConsentPreferences;
  confirmed: boolean;
};

const denied: CookieConsentPreferences = { analytics: false, marketing: false };

function validChoice(value: unknown): value is ConsentChoice {
  if (!value || typeof value !== "object") return false;
  const choice = value as Partial<ConsentChoice>;
  return typeof choice.requestId === "string" &&
    typeof choice.browserId === "string" &&
    choice.noticeVersion === COOKIE_NOTICE_VERSION &&
    typeof choice.confirmed === "boolean" &&
    typeof choice.preferences?.analytics === "boolean" &&
    typeof choice.preferences?.marketing === "boolean";
}

function read(key: string): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return validChoice(parsed) ? parsed : null;
  } catch { return null; }
}

export function readConfirmedConsent(): ConsentChoice | null {
  if (read(PENDING_KEY)) return null;
  const choice = read(CHOICE_KEY);
  return choice?.confirmed ? choice : null;
}

export function readPendingConsent(): ConsentChoice | null { return read(PENDING_KEY); }

export function readCookieConsentPreferences(): CookieConsentPreferences {
  return readPendingConsent()?.preferences ?? readConfirmedConsent()?.preferences ?? denied;
}

export function wasCookieConsentBannerDismissed(): boolean {
  return Boolean(readPendingConsent() ?? readConfirmedConsent());
}

export function createConsentChoice(preferences: CookieConsentPreferences): ConsentChoice {
  let browserId = "";
  try { browserId = window.localStorage.getItem(BROWSER_ID_KEY) ?? ""; } catch { /* unavailable */ }
  if (!browserId) {
    browserId = crypto.randomUUID();
    try { window.localStorage.setItem(BROWSER_ID_KEY, browserId); } catch { /* unavailable */ }
  }
  return { requestId: crypto.randomUUID(), browserId, noticeVersion: COOKIE_NOTICE_VERSION, preferences, confirmed: false };
}

export function storePendingConsent(choice: ConsentChoice): boolean {
  try { window.localStorage.setItem(PENDING_KEY, JSON.stringify(choice)); }
  catch { return false; }
  window.dispatchEvent(new Event(COOKIE_CONSENT_CHANGED));
  return true;
}

export function confirmConsent(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(CHOICE_KEY, JSON.stringify({ ...choice, confirmed: true }));
    window.localStorage.removeItem(PENDING_KEY);
  } catch { return; }
  window.dispatchEvent(new Event(COOKIE_CONSENT_CHANGED));
}

export async function submitPendingConsent(choice: ConsentChoice): Promise<boolean> {
  try {
    const response = await fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId: choice.requestId, browserId: choice.browserId,
        noticeVersion: choice.noticeVersion, ...choice.preferences }),
      cache: "no-store",
    });
    if (!response.ok) return false;
    if (readPendingConsent()?.requestId === choice.requestId) confirmConsent(choice);
    return true;
  } catch { return false; }
}

export async function linkConfirmedConsentToCustomer(customerId: number): Promise<void> {
  const current = readConfirmedConsent();
  if (!current || !Number.isSafeInteger(customerId) || customerId <= 0) return;
  type AccountLink = { customerId: number; requestId: string; completed: boolean };
  let link: AccountLink | null = null;
  try {
    const raw = window.localStorage.getItem(ACCOUNT_LINK_KEY);
    if (raw) link = JSON.parse(raw) as AccountLink;
  } catch { /* unavailable */ }
  if (link?.customerId === customerId && link.completed) return;
  if (link?.customerId !== customerId || !UUID.test(link.requestId)) {
    link = { customerId, requestId: crypto.randomUUID(), completed: false };
    try { window.localStorage.setItem(ACCOUNT_LINK_KEY, JSON.stringify(link)); } catch { return; }
  }
  if (!link) return;
  try {
    const response = await fetch("/api/consent", {
      method: "POST", headers: { "Content-Type": "application/json" }, cache: "no-store",
      body: JSON.stringify({ requestId: link.requestId, browserId: current.browserId,
        noticeVersion: current.noticeVersion, ...current.preferences, linkCustomer: true,
        expectedCustomerId: customerId }),
    });
    const result = response.ok ? await response.json() as { customerLinked?: boolean } : null;
    if (result?.customerLinked) window.localStorage.setItem(ACCOUNT_LINK_KEY,
      JSON.stringify({ ...link, completed: true }));
  } catch { /* retry on next authenticated refresh */ }
}
