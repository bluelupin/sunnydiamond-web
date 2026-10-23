/** Set on `<html>` before hydration when the app runs as an installed PWA. */
export const PWA_DISPLAY_HTML_ATTR = "data-pwa-display";
export const PWA_DISPLAY_STANDALONE_VALUE = "standalone";

/**
 * Detects installed PWA (standalone / fullscreen / iOS home screen) and tags `<html>`
 * so CSS can hide the root vertical scrollbar without affecting in-browser views.
 */
export const PWA_DISPLAY_BOOTSTRAP_SCRIPT = `
(function () {
  try {
    var nav = window.navigator;
    var iosStandalone = nav.standalone === true;
    var installedDisplayMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches;
    if (iosStandalone || installedDisplayMode) {
      document.documentElement.setAttribute(
        "${PWA_DISPLAY_HTML_ATTR}",
        "${PWA_DISPLAY_STANDALONE_VALUE}"
      );
    }
  } catch (e) {}
})();
`.trim();
