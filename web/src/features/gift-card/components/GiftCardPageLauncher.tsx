"use client";

import { useEffect } from "react";
import { useGiftCardFlow } from "../context/GiftCardFlowContext";

/** Opens the gift card panel and scrolls to the gifting section on /gift-card. */
const GiftCardPageLauncher = () => {
  const { openPanel } = useGiftCardFlow();

  useEffect(() => {
    openPanel();
    const section = document.getElementById("gift-card");
    if (section) {
      section.scrollIntoView({ behavior: "auto", block: "center" });
    }
  }, [openPanel]);

  return null;
};

export default GiftCardPageLauncher;
