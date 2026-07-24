import { trackEvent } from "@/infrastructure/analytics/use-gtag";

export const JEWELLERY_PLP_NAVIGATION_MARK = "jewellery-plp:navigation";
export const JEWELLERY_PLP_PRODUCTS_FETCH_MARK = "jewellery-plp:products-fetch";

export type JewelleryPlpProductsSource = "prefetch" | "network" | "cache";

export type JewelleryPlpMetricPayload = Record<string, string | number | boolean | undefined>;

const reportedFirstGridPaint = new Set<string>();

function isClient(): boolean {
  return typeof window !== "undefined";
}

function logPlpMetric(name: string, valueMs: number, extra?: JewelleryPlpMetricPayload) {
  if (process.env.NODE_ENV === "development") {
    console.info(`[PLP perf] ${name}: ${valueMs.toFixed(0)}ms`, extra ?? "");
  }

  trackEvent("plp_performance", {
    metric_name: name,
    value_ms: Math.round(valueMs),
    ...extra,
  });
}

export function markJewelleryPlpNavigation(): void {
  if (!isClient()) {
    return;
  }

  performance.mark(JEWELLERY_PLP_NAVIGATION_MARK);
}

export function markJewelleryPlpProductsFetchStart(): void {
  if (!isClient()) {
    return;
  }

  performance.mark(JEWELLERY_PLP_PRODUCTS_FETCH_MARK);
}

export function reportJewelleryPlpTtfb(): void {
  if (!isClient()) {
    return;
  }

  const entry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  if (!entry) {
    return;
  }

  const ttfb = entry.responseStart - entry.requestStart;
  if (ttfb > 0) {
    logPlpMetric("PLP_TTFB", ttfb);
  }
}

export function reportJewelleryPlpProductsReady(options: {
  source: JewelleryPlpProductsSource;
  productCount: number;
  categoryUrlKey?: string | null;
  durationMs?: number;
}): void {
  if (!isClient()) {
    return;
  }

  let durationMs = options.durationMs;

  if (durationMs == null) {
    try {
      const measure = performance.measure(
        "jewellery-plp:products-ms",
        JEWELLERY_PLP_PRODUCTS_FETCH_MARK,
      );
      durationMs = measure.duration;
    } catch {
      durationMs = 0;
    }
  }

  logPlpMetric("PLP_products_ms", durationMs, {
    source: options.source,
    product_count: options.productCount,
    category: options.categoryUrlKey ?? "all",
  });
}

export function reportJewelleryPlpFirstGridPaint(options: {
  routeKey: string;
  productCount: number;
  hadPrefetch: boolean;
}): void {
  if (!isClient() || reportedFirstGridPaint.has(options.routeKey)) {
    return;
  }

  reportedFirstGridPaint.add(options.routeKey);

  let durationMs = 0;

  try {
    const measure = performance.measure(
      "jewellery-plp:first-grid-paint",
      JEWELLERY_PLP_NAVIGATION_MARK,
    );
    durationMs = measure.duration;
  } catch {
    durationMs = 0;
  }

  logPlpMetric("PLP_first_grid_paint", durationMs, {
    product_count: options.productCount,
    had_prefetch: options.hadPrefetch,
  });
}

export function logJewelleryPlpGraphqlDuration(
  label: string,
  durationMs: number,
  extra?: JewelleryPlpMetricPayload,
): void {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  console.info(`[PLP GraphQL] ${label}: ${durationMs.toFixed(0)}ms`, extra ?? "");
}

export async function measureJewelleryPlpGraphql<T>(
  label: string,
  operation: () => Promise<T>,
  extra?: JewelleryPlpMetricPayload,
): Promise<T> {
  const start = typeof performance !== "undefined" ? performance.now() : Date.now();

  try {
    return await operation();
  } finally {
    const end = typeof performance !== "undefined" ? performance.now() : Date.now();
    logJewelleryPlpGraphqlDuration(label, end - start, extra);
  }
}
