"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { usePathname, useSearchParams } from "next/navigation";
import {
  getPlpFooterToastMessage,
  peekPlpFooterToastIntent,
  readPlpFooterToastIntentFromSearch,
  stripPlpFooterToastFromBrowserUrl,
  takePlpFooterToastIntent,
} from "@/shared/lib/footerPlpToast";
import { useAppStatusToastController } from "@/shared/hooks/useAppStatusToastController";
import {
  isJewelleryCategoryPath,
  JEWELLERY_PATH,
  readJewelleryListingUrlParams,
} from "../utils/jewelleryRoutes";

const PLP_FOOTER_TOAST_DEDUPE_PREFIX = "sunny.plpFooterToastShown:";

/**
 * Lives in site layout (not PLP Suspense) so footer → PLP toast survives listing remounts.
 */
export default function PlpFooterToastHost() {
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const presentingRef = useRef(false);
  const { show, node } = useAppStatusToastController(undefined, {
    hideIcon: true,
    dismissible: true,
  });

  useEffect(() => {
    const onPlp = pathname === JEWELLERY_PATH || isJewelleryCategoryPath(pathname);
    if (!onPlp) {
      presentingRef.current = false;
      return;
    }

    const fromUrl = readPlpFooterToastIntentFromSearch(
      readJewelleryListingUrlParams(searchParams?.toString()),
    );
    const intent = peekPlpFooterToastIntent() ?? fromUrl;
    if (!intent) {
      presentingRef.current = false;
      return;
    }

    const dedupeKey = `${PLP_FOOTER_TOAST_DEDUPE_PREFIX}${pathname}:${intent}`;
    if (presentingRef.current) {
      return;
    }

    try {
      const shownAt = sessionStorage.getItem(dedupeKey);
      if (shownAt && Date.now() - Number(shownAt) < 4_000) {
        return;
      }
      sessionStorage.setItem(dedupeKey, String(Date.now()));
    } catch {
      // ignore
    }

    presentingRef.current = true;
    show(getPlpFooterToastMessage(intent));

    window.setTimeout(() => {
      takePlpFooterToastIntent();
      stripPlpFooterToastFromBrowserUrl();
      presentingRef.current = false;
    }, 0);
  }, [pathname, searchParams, show]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(node, document.body);
}
