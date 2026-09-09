/** Sets `data-ui-platform` on <html> before React hydrates. */
export const UI_PLATFORM_BOOTSTRAP_SCRIPT = `
(function () {
  try {
    var ua = navigator.userAgent || "";
    var plt = navigator.platform || "";
    var maxTouch = navigator.maxTouchPoints || 0;
    var isIpad = plt === "MacIntel" && maxTouch > 1;
    var isApple = /Mac|iPhone|iPad|iPod/i.test(ua) || isIpad;
    var platform = "other";
    if (/Win/i.test(ua) || /Win/i.test(plt)) platform = "windows";
    else if (isApple) platform = "apple";
    document.documentElement.setAttribute("data-ui-platform", platform);
  } catch (e) {}
})();
`.trim();
