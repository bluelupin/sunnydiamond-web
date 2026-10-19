"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useLoginModal } from "@/features/auth/context/LoginModalContext";
import { getMagentoProductAttributeOptions } from "@/services/magento/products/productAttributeOptions.service";
import { useGiftCardFlow } from "../context/GiftCardFlowContext";
import { mapMagentoOccasionsToGiftCardOptions } from "../utils/giftCardOccasions.utils";

/** Loads Magento occasions and resumes the flow after guest authentication. */
const GiftCardFlowController = () => {
  const { status } = useAuth();
  const { isLoginModalOpen } = useLoginModal();
  const {
    isPanelOpen,
    openPanel,
    pendingAuthAfterConfigure,
    resumeAfterAuth,
    setOccasionOptions,
    setIsOccasionsLoading,
  } = useGiftCardFlow();
  const hasResumedAfterAuthRef = useRef(false);
  const hasLoadedOccasionsRef = useRef(false);

  useEffect(() => {
    if (pendingAuthAfterConfigure) {
      openPanel();
    }
  }, [openPanel, pendingAuthAfterConfigure]);

  useEffect(() => {
    if (!isPanelOpen || hasLoadedOccasionsRef.current) return;

    let cancelled = false;
    const controller = new AbortController();

    void (async () => {
      setIsOccasionsLoading(true);
      try {
        const options = await getMagentoProductAttributeOptions("sd_occasions", controller.signal);
        if (!cancelled) {
          setOccasionOptions(mapMagentoOccasionsToGiftCardOptions(options));
        }
      } catch {
        if (!cancelled) {
          setOccasionOptions(mapMagentoOccasionsToGiftCardOptions([]));
        }
      } finally {
        if (!cancelled) {
          hasLoadedOccasionsRef.current = true;
          setIsOccasionsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [isPanelOpen, setIsOccasionsLoading, setOccasionOptions]);

  useEffect(() => {
    if (!isPanelOpen) {
      hasResumedAfterAuthRef.current = false;
    }
  }, [isPanelOpen]);

  useEffect(() => {
    if (
      !pendingAuthAfterConfigure ||
      status !== "authenticated" ||
      isLoginModalOpen ||
      hasResumedAfterAuthRef.current
    ) {
      return;
    }

    hasResumedAfterAuthRef.current = true;
    resumeAfterAuth();
  }, [isLoginModalOpen, pendingAuthAfterConfigure, resumeAfterAuth, status]);

  return null;
};

export default GiftCardFlowController;
