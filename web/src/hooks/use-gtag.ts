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
  if (window.gtag) {
    window.gtag("config", "G-XXXXXXXXXX", { page_path: path });
  }
}
