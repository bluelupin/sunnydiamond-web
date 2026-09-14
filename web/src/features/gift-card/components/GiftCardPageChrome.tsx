"use client";

import { useEffect } from "react";

/** Scrolls to the gift-card section when landing on /gift-card. */
const GiftCardPageChrome = () => {
  useEffect(() => {
    const section = document.getElementById("gift-card");
    if (section) {
      section.scrollIntoView({ behavior: "auto", block: "center" });
    }
  }, []);

  return null;
};

export default GiftCardPageChrome;
