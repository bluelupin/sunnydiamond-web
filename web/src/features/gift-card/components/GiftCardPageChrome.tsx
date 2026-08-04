"use client";

import { useEffect } from "react";
import GiftCardFlowShell from "./GiftCardFlowShell";

/** Scrolls to the gift-card section and opens the gift-card flow panel. */
const GiftCardPageChrome = () => {
  useEffect(() => {
    const section = document.getElementById("gift-card");
    if (section) {
      section.scrollIntoView({ behavior: "auto", block: "center" });
    }
  }, []);

  return <GiftCardFlowShell defaultOpen />;
};

export default GiftCardPageChrome;
