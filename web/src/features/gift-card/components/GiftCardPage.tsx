"use client";

import { useEffect } from "react";
import GiftingPage from "@/features/gifting/components/GiftingPage";
import GiftCardFlowShell from "./GiftCardFlowShell";

const GiftCardPage = () => {
  useEffect(() => {
    const section = document.getElementById("gift-card");
    if (section) {
      section.scrollIntoView({ behavior: "auto", block: "center" });
    }
  }, []);

  return (
    <>
      <GiftingPage />
      <GiftCardFlowShell defaultOpen />
    </>
  );
};

export default GiftCardPage;
