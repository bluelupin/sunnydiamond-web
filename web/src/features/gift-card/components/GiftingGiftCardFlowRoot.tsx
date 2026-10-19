"use client";

import { useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { GiftCardFlowProvider, useGiftCardFlow } from "../context/GiftCardFlowContext";
import GiftCardFlowController from "./GiftCardFlowController";

const GiftCardFlowShell = dynamic(() => import("./GiftCardFlowShell"), { ssr: false });

type GiftingGiftCardFlowRootProps = {
  children?: ReactNode;
  defaultPanelOpen?: boolean;
};

function DeferredGiftCardShell() {
  const { isPanelOpen } = useGiftCardFlow();
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    if (isPanelOpen) {
      const frame = requestAnimationFrame(() => setHasOpened(true));
      return () => cancelAnimationFrame(frame);
    }
  }, [isPanelOpen]);

  return isPanelOpen || hasOpened ? <GiftCardFlowShell /> : null;
}

const GiftingGiftCardFlowRoot = ({
  children = null,
  defaultPanelOpen = false,
}: GiftingGiftCardFlowRootProps) => (
  <GiftCardFlowProvider defaultPanelOpen={defaultPanelOpen}>
    <GiftCardFlowController />
    {children}
    <DeferredGiftCardShell />
  </GiftCardFlowProvider>
);

export default GiftingGiftCardFlowRoot;
