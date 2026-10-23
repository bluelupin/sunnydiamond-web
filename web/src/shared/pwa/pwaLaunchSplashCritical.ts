export const PWA_LAUNCH_HTML_ATTR = "data-pwa-launch";
export const PWA_LAUNCH_PENDING_VALUE = "pending";
export const PWA_LAUNCH_DONE_VALUE = "done";

const pwaLaunchSplashVisibleRules = `
  background-color: #ffffff;
  overflow: hidden;
`;

const pwaLaunchStaticPanelRules = `
  display: flex;
  position: fixed;
  inset: 0;
  z-index: 2147483646;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  touch-action: none;
`;

const pwaLaunchShellStyles = `
.pwa-launch-shell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}
.pwa-launch-mark {
  width: 5rem;
  height: 5rem;
  border: 2px solid rgba(198, 168, 125, 0.45);
  border-radius: 4px;
  box-sizing: border-box;
  transform: rotate(45deg);
  background: transparent;
}
.pwa-launch-copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  text-align: center;
}
.pwa-launch-title {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.25rem;
  font-weight: 600;
  font-style: italic;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #1a1a1a;
}
.pwa-launch-tagline {
  margin: 0;
  font-family: "Gill Sans", Calibri, sans-serif;
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #6b6b6b;
}
`;

/** Inline in `<head>` so the PWA launch splash paints before CSS bundles load. */
export const PWA_LAUNCH_SPLASH_CRITICAL_CSS = `
${pwaLaunchShellStyles}

#pwa-launch-splash-static {
  display: none;
}

@media (display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui) {
  html:not([data-pwa-launch="done"]) {
    background-color: #ffffff;
  }
  html:not([data-pwa-launch="done"]) body {
    ${pwaLaunchSplashVisibleRules}
  }
  html:not([data-pwa-launch="done"]) .pwa-app-shell-gate {
    visibility: hidden;
  }
  html:not([data-pwa-launch="done"]) #pwa-launch-splash-static {
    ${pwaLaunchStaticPanelRules}
  }
}

html[data-pwa-display="standalone"]:not([data-pwa-launch="done"]) {
  background-color: #ffffff;
}
html[data-pwa-display="standalone"]:not([data-pwa-launch="done"]) body {
  ${pwaLaunchSplashVisibleRules}
}
html[data-pwa-display="standalone"]:not([data-pwa-launch="done"]) .pwa-app-shell-gate {
  visibility: hidden;
}
html[data-pwa-display="standalone"]:not([data-pwa-launch="done"]) #pwa-launch-splash-static {
  ${pwaLaunchStaticPanelRules}
}
`.trim();

export function completePwaLaunchSplash(): void {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.setAttribute(PWA_LAUNCH_HTML_ATTR, PWA_LAUNCH_DONE_VALUE);
}
