"use client";

import type { ReactNode } from "react";
import { GiftCardFlowProvider } from "../context/GiftCardFlowContext";
import GiftCardFlowShell from "./GiftCardFlowShell";

type GiftingGiftCardFlowRootProps = {
  children: ReactNode;
  defaultPanelOpen?: boolean;
};

const GiftingGiftCardFlowRoot = ({
  children,
  defaultPanelOpen = false,
}: GiftingGiftCardFlowRootProps) => (
  <GiftCardFlowProvider defaultPanelOpen={defaultPanelOpen}>
    {children}
    <GiftCardFlowShell />
  </GiftCardFlowProvider>
);

export default GiftingGiftCardFlowRoot;
