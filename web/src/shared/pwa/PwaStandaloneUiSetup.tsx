"use client";

import { useLayoutEffect } from "react";
import { applyPwaStandaloneDocumentClass } from "./pwaDisplayBootstrap";
import { isPwaStandaloneDisplayMode } from "./pwaInstallPrompt";

/** Ensures PWA-only document classes apply after hydration (backup to beforeInteractive bootstrap). */
export default function PwaStandaloneUiSetup() {
  useLayoutEffect(() => {
    applyPwaStandaloneDocumentClass();

    if (typeof window.matchMedia !== "function") {
      return;
    }

    const queries = [
      "(display-mode: standalone)",
      "(display-mode: fullscreen)",
      "(display-mode: minimal-ui)",
    ];
    const media = queries.map((query) => window.matchMedia(query));

    const sync = () => {
      if (isPwaStandaloneDisplayMode()) {
        applyPwaStandaloneDocumentClass();
      }
    };

    for (const mq of media) {
      mq.addEventListener("change", sync);
    }

    return () => {
      for (const mq of media) {
        mq.removeEventListener("change", sync);
      }
    };
  }, []);

  return null;
}
