import { isPwaStandaloneDisplayMode } from "./pwaInstallPrompt";
import {
  PWA_LAUNCH_HTML_ATTR,
  PWA_LAUNCH_PENDING_VALUE,
} from "./pwaLaunchSplashCritical";

/** Set on `<html>` before hydration when the app runs as an installed PWA. */
export const PWA_DISPLAY_HTML_ATTR = "data-pwa-display";
export const PWA_DISPLAY_STANDALONE_VALUE = "standalone";

/** Applied to `<html>` and `<body>` for root scrollbar hiding in installed PWAs. */
export const PWA_ROOT_SCROLLBAR_HIDDEN_CLASS = "pwa-root-scrollbar-hidden";

export function applyPwaStandaloneDocumentClass(): boolean {
  if (typeof document === "undefined" || !isPwaStandaloneDisplayMode()) {
    return false;
  }

  const { documentElement, body } = document;
  documentElement.setAttribute(PWA_DISPLAY_HTML_ATTR, PWA_DISPLAY_STANDALONE_VALUE);
  documentElement.setAttribute(PWA_LAUNCH_HTML_ATTR, PWA_LAUNCH_PENDING_VALUE);
  documentElement.classList.add(PWA_ROOT_SCROLLBAR_HIDDEN_CLASS);
  body?.classList.add(PWA_ROOT_SCROLLBAR_HIDDEN_CLASS);
  return true;
}

/**
 * Detects installed PWA (standalone / fullscreen / minimal-ui / iOS home screen) and tags
 * `<html>` / `<body>` so CSS can hide the root vertical scrollbar without affecting browsers.
 */
export const PWA_DISPLAY_BOOTSTRAP_SCRIPT = `
(function () {
  try {
    var attr = "${PWA_DISPLAY_HTML_ATTR}";
    var value = "${PWA_DISPLAY_STANDALONE_VALUE}";
    var launchAttr = "${PWA_LAUNCH_HTML_ATTR}";
    var launchPending = "${PWA_LAUNCH_PENDING_VALUE}";
    var rootClass = "${PWA_ROOT_SCROLLBAR_HIDDEN_CLASS}";
    var nav = window.navigator;
    var iosStandalone = nav.standalone === true;
    var installedDisplayMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      window.matchMedia("(display-mode: minimal-ui)").matches;
    if (!iosStandalone && !installedDisplayMode) {
      return;
    }
    function apply() {
      var root = document.documentElement;
      root.setAttribute(attr, value);
      root.setAttribute(launchAttr, launchPending);
      root.classList.add(rootClass);
      if (document.body) {
        document.body.classList.add(rootClass);
      }
    }
    apply();
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", apply, { once: true });
    }
  } catch (e) {}
})();
`.trim();
