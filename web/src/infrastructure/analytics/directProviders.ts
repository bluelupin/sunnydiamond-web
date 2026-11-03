import { readConfirmedConsent } from "@/shared/cookies/cookieConsentStorage";

type GoogleTag = (...args: unknown[]) => void;
type MetaPixel = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  loaded: boolean;
  version: string;
};
type ProviderWindow = Window & {
  gtag?: GoogleTag;
  fbq?: MetaPixel;
  clarity?: (...args: unknown[]) => void;
};

const ga4Id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
const metaId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

function addScript(id: string, src: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function googleTag() {
  const provider = window as ProviderWindow;
  if (!provider.gtag) {
    provider.gtag = (...args: unknown[]) => {
      window.dataLayer ??= [];
      window.dataLayer.push(args as unknown as Record<string, unknown>);
    };
  }
  return provider.gtag;
}

export function syncDirectProviders(analytics: boolean, marketing: boolean, allowClarity: boolean) {
  const choice = readConfirmedConsent();
  if (!choice) return;
  analytics = analytics && choice.preferences.analytics;
  marketing = marketing && choice.preferences.marketing;
  if (analytics && ga4Id && /^G-[A-Z0-9]+$/.test(ga4Id) && !document.getElementById("sunny-ga4")) {
    const gtag = googleTag();
    gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: marketing ? "granted" : "denied",
      ad_user_data: marketing ? "granted" : "denied",
      ad_personalization: marketing ? "granted" : "denied",
    });
    gtag("js", new Date());
    gtag("config", ga4Id, { send_page_view: false });
    const userId = [...(window.dataLayer ?? [])].reverse().find((entry) => "user_id" in entry)?.user_id;
    if (typeof userId === "string") gtag("set", { user_id: userId });
    addScript("sunny-ga4", `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`);
  }
  if (analytics && document.getElementById("sunny-ga4")) {
    googleTag()("consent", "update", {
      analytics_storage: "granted",
      ad_storage: marketing ? "granted" : "denied",
      ad_user_data: marketing ? "granted" : "denied",
      ad_personalization: marketing ? "granted" : "denied",
    });
  }

  if (marketing && metaId && /^\d+$/.test(metaId) && !document.getElementById("sunny-meta")) {
    const provider = window as ProviderWindow;
    if (!provider.fbq) {
      const fbq = ((...args: unknown[]) => {
        if (fbq.callMethod) fbq.callMethod(...args);
        else fbq.queue.push(args);
      }) as MetaPixel;
      fbq.queue = [];
      fbq.loaded = true;
      fbq.version = "2.0";
      provider.fbq = fbq;
    }
    provider.fbq("init", metaId);
    provider.fbq("consent", "grant");
    addScript("sunny-meta", "https://connect.facebook.net/en_US/fbevents.js");
  }

  if (analytics && allowClarity && clarityId && /^[a-z0-9]+$/i.test(clarityId) && !document.getElementById("sunny-clarity")) {
    const provider = window as ProviderWindow;
    if (!provider.clarity) {
      const queue: unknown[][] = [];
      const clarity = (...args: unknown[]) => { queue.push(args); };
      (clarity as typeof clarity & { q: unknown[][] }).q = queue;
      provider.clarity = clarity;
    }
    provider.clarity("consentv2", {
      ad_Storage: marketing ? "granted" : "denied",
      analytics_Storage: "granted",
    });
    addScript("sunny-clarity", `https://www.clarity.ms/tag/${encodeURIComponent(clarityId)}`);
  }
}

export function setDirectUserId(userId: string | null) {
  if (!document.getElementById("sunny-ga4")) return;
  (window as ProviderWindow).gtag?.("set", { user_id: userId ?? undefined });
}

export function sendDirectEvent(action: string, params: Record<string, unknown> = {}) {
  const choice = readConfirmedConsent();
  if (!choice) return;
  const provider = window as ProviderWindow;
  if (choice.preferences.analytics && ga4Id && document.getElementById("sunny-ga4")) {
    provider.gtag?.("event", action, { ...params, send_to: ga4Id });
  }
  if (!choice.preferences.marketing || !document.getElementById("sunny-meta")) return;
  const eventName: Record<string, string> = {
    page_view: "PageView",
    view_item: "ViewContent",
    search: "Search",
    add_to_wishlist: "AddToWishlist",
    add_to_cart: "AddToCart",
    begin_checkout: "InitiateCheckout",
    purchase: "Purchase",
  };
  const mapped = eventName[action];
  if (!mapped) return;
  const items = Array.isArray(params.items) ? params.items as Array<Record<string, unknown>> : [];
  const contentIds = items.map((item) => item.item_id).filter((id) => typeof id === "string" || typeof id === "number");
  provider.fbq?.("track", mapped, {
    ...(contentIds.length ? { content_ids: contentIds, content_type: "product" } : {}),
    ...(typeof params.value === "number" ? { value: params.value } : {}),
    ...(typeof params.currency === "string" ? { currency: params.currency } : {}),
    ...(action === "search" && typeof params.search_term === "string" ? { search_string: params.search_term } : {}),
  });
}
