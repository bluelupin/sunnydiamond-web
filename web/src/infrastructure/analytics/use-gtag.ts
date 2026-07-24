import { getGaMeasurementId } from "@/infrastructure/analytics/gaConfig";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(action: string, params?: Record<string, unknown>) {
  if (window.gtag) {
    window.gtag("event", action, params);
  }
}

export function trackPageView(path: string) {
  const measurementId = getGaMeasurementId();

  if (window.gtag && measurementId) {
    window.gtag("config", measurementId, { page_path: path });
  }
}
