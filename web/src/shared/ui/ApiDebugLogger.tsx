"use client";

import { useEffect } from "react";
import { getHomepageContent } from "@/services/homepage.service";

const ApiDebugLogger = () => {
  useEffect(() => {
    const fetchDebug = async () => {
      try {
        const data = await getHomepageContent();

        if (typeof window !== "undefined") {
          console.group("[API Debug] Homepage response");
          console.log(data);
          console.groupEnd();
        }
      } catch (error) {
        console.error("[API Debug] Homepage fetch failed", error);
      }
    };

    fetchDebug();
  }, []);

  return null;
};

export default ApiDebugLogger;
