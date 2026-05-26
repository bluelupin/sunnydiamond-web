"use client";

import { useEffect } from "react";
import { apiFetch } from "@/api/fetchClient";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";

const ApiDebugLogger = () => {
  useEffect(() => {
    const fetchDebug = async () => {
      try {
        const data = await apiFetch(STRAPI_ENDPOINTS.homepage, {
          params: { populate: "*" },
        });

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
