"use client";

import { useEffect } from "react";
import { getHomepageShell } from "@/services/homepage/homepageShell.service";
import { getHomepageShoppingBlocks } from "@/services/homepage/homepageShoppingBlocks.service";
import { getHomepageEditorialBlocks } from "@/services/homepage/homepageEditorialBlocks.service";

const ApiDebugLogger = () => {
  useEffect(() => {
    const fetchDebug = async () => {
      try {
        if (typeof window !== "undefined") {
          console.group("[API Debug] Homepage section-wise responses");
          const [
            homePageShell,
            homepageShoppingBlocks,
            homepageEditorialBlocks,
          ] = await Promise.all([
            getHomepageShell(),
            getHomepageEditorialBlocks(),
            getHomepageShoppingBlocks(),
          ]);

          console.log("homepageShell:", homePageShell);
          console.log("homepageShoppingBlocks:", homepageShoppingBlocks);
          console.log("homepageEditorialBlocks:", homepageEditorialBlocks);
          console.groupEnd();
        }
      } catch (error) {
        console.error("[API Debug] Homepage section fetch failed", error);
      }
    };

    fetchDebug();
  }, []);

  return null;
};

export default ApiDebugLogger;
