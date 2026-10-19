"use client";

import { useEffect } from "react";

/**
 * Registers `/sw.js` for PWA install/offline checks (production and local dev).
 * In dev, stale SW cache can affect HMR — unregister under Application → Service Workers if needed.
 */
export default function PwaServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    const register = () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        /* registration optional — app works without SW */
      });
    };

    if (document.readyState === "complete") {
      register();
      return;
    }

    window.addEventListener("load", register, { once: true });
  }, []);

  return null;
}
