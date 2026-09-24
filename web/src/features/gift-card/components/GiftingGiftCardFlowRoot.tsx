"use client";

import type { ReactNode } from "react";
import { GiftCardFlowProvider } from "../context/GiftCardFlowContext";
import GiftCardFlowController from "./GiftCardFlowController";
import GiftCardFlowShell from "./GiftCardFlowShell";

type GiftingGiftCardFlowRootProps = {
  children?: ReactNode;
  defaultPanelOpen?: boolean;
};

const GiftingGiftCardFlowRoot = ({
  children = null,
  defaultPanelOpen = false,
}: GiftingGiftCardFlowRootProps) => (
  <GiftCardFlowProvider defaultPanelOpen={defaultPanelOpen}>
    <GiftCardFlowController />
    {children}
    <GiftCardFlowShell />
  </GiftCardFlowProvider>
);

export default GiftingGiftCardFlowRoot;
