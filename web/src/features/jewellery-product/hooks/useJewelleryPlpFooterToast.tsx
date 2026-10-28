"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  consumePlpFooterToastIntent,
  getPlpFooterToastMessage,
  readPlpFooterToastIntentFromSearch,
  stripPlpFooterToastFromBrowserUrl,
} from "@/shared/lib/footerPlpToast";
import { useAppStatusToastController } from "@/shared/hooks/useAppStatusToastController";
import {
  isJewelleryCategoryPath,
  JEWELLERY_PATH,
  readJewelleryListingUrlParams,
} from "../utils/jewelleryRoutes";

/** Shows footer PLP toast after Try at Home / Schedule a Video Call. */
export function useJewelleryPlpFooterToast() {
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const shownOnRouteRef = useRef<string | null>(null);
  const { show, dismiss, node } = useAppStatusToastController(undefined, {
    hideIcon: true,
    dismissible: true,
  });

  useEffect(() => {
    shownOnRouteRef.current = null;
  }, [pathname]);

  useLayoutEffect(() => {
    const onPlp = pathname === JEWELLERY_PATH || isJewelleryCategoryPath(pathname);

    if (!onPlp) {
      return;
    }

    const fromSession = consumePlpFooterToastIntent();
    const fromUrl = readPlpFooterToastIntentFromSearch(
      readJewelleryListingUrlParams(searchParams?.toString()),
    );
    const intent = fromSession ?? fromUrl;

    if (!intent) {
      return;
    }

    const routeKey = `${pathname}:${intent}`;
    if (!fromSession && shownOnRouteRef.current === routeKey) {
      return;
    }
    shownOnRouteRef.current = routeKey;

    show(getPlpFooterToastMessage(intent));

    window.setTimeout(() => {
      stripPlpFooterToastFromBrowserUrl();
    }, 0);
  }, [pathname, searchParams, show]);

  return { dismiss, node };
}
