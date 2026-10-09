"use client";

import { useEffect, useState } from "react";
import {
  readJewelleryPlpViewport,
  type JewelleryPlpViewport,
} from "../utils/plpListingCards";

const MD_BREAKPOINT = "(min-width: 768px)";

export function useJewelleryPlpViewport(): JewelleryPlpViewport {
  const [viewport, setViewport] = useState<JewelleryPlpViewport>(readJewelleryPlpViewport);

  useEffect(() => {
    const media = window.matchMedia(MD_BREAKPOINT);

    const syncViewport = () => {
      setViewport(media.matches ? "desktop" : "mobile");
    };

    syncViewport();
    media.addEventListener("change", syncViewport);

    return () => {
      media.removeEventListener("change", syncViewport);
    };
  }, []);

  return viewport;
}
