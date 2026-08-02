import { trackEvent } from "@/infrastructure/analytics/use-gtag";

export const HOMEPAGE_NAVIGATION_MARK = "homepage:navigation";
export const HOMEPAGE_TRENDING_FETCH_MARK = "homepage:trending-fetch";

export type HomepageTrendingSource = "network" | "cache";

export type HomepageMetricPayload = Record<string, string | number | boolean | undefined>;

let reportedHeroPaint = false;
let reportedTrendingReady = false;

function isClient(): boolean {
  return typeof window !== "undefined";
}

function logHomeMetric(name: string, valueMs: number, extra?: HomepageMetricPayload) {
  if (process.env.NODE_ENV === "development") {
    console.info(`[Home perf] ${name}: ${valueMs.toFixed(0)}ms`, extra ?? "");
  }

  trackEvent("homepage_performance", {
    metric_name: name,
    value_ms: Math.round(valueMs),
    ...extra,
  });
}

export function markHomepageNavigation(): void {
  if (!isClient()) {
    return;
  }

  performance.mark(HOMEPAGE_NAVIGATION_MARK);
}

export function markHomepageTrendingFetchStart(): void {
  if (!isClient()) {
    return;
  }

  performance.mark(HOMEPAGE_TRENDING_FETCH_MARK);
}

export function reportHomepageTtfb(): void {
  if (!isClient()) {
    return;
  }

  const entry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (!entry) {
    return;
  }

  const ttfb = entry.responseStart - entry.requestStart;
  if (ttfb > 0) {
    logHomeMetric("HOME_TTFB", ttfb);
  }
}

export function reportHomepageHeroPaint(options: { hasHeroContent: boolean }): void {
  if (!isClient() || reportedHeroPaint) {
    return;
  }

  reportedHeroPaint = true;

  let durationMs = 0;

  try {
    const measure = performance.measure("homepage:hero-paint", HOMEPAGE_NAVIGATION_MARK);
    durationMs = measure.duration;
  } catch {
    durationMs = 0;
  }

  logHomeMetric("HOME_hero_paint", durationMs, {
    has_hero_content: options.hasHeroContent,
  });
}

export function reportHomepageTrendingReady(options: {
  source: HomepageTrendingSource;
  productCount: number;
  durationMs?: number;
}): void {
  if (!isClient() || reportedTrendingReady) {
    return;
  }

  reportedTrendingReady = true;

  let durationMs = options.durationMs;

  if (durationMs == null) {
    try {
      const measure = performance.measure("homepage:trending-ms", HOMEPAGE_TRENDING_FETCH_MARK);
      durationMs = measure.duration;
    } catch {
      durationMs = 0;
    }
  }

  logHomeMetric("HOME_trending_ms", durationMs, {
    source: options.source,
    product_count: options.productCount,
  });
}
