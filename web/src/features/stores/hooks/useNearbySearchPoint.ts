"use client";

import { useCallback, useRef, useState } from "react";
import { getGeolocationErrorMessage } from "@/shared/utils/reverseGeocode";
import type { GeoPoint } from "../utils/geo";

export type NearbySearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "locating" }
  | { status: "found"; point: GeoPoint }
  | { status: "pin-failed"; message: string }
  | { status: "location-failed"; message: string };

const PIN_LOOKUP_TIMEOUT_MS = 10000;
const PIN_NOT_FOUND_MESSAGE = "We couldn't find that PIN code. Try another or use your location.";
const PIN_INVALID_MESSAGE = "Enter a valid 6-digit pincode";
const PIN_UNAVAILABLE_MESSAGE = "We couldn't check that PIN right now. Try again or use your location.";

/**
 * Where to measure store distances from: a PIN (server lookup) or the browser's location.
 * Geolocation coordinates stay in the browser — they are never sent to a server or logged.
 */
export function useNearbySearchPoint() {
  const [state, setState] = useState<NearbySearchState>({ status: "idle" });
  // Only the latest request may update state.
  const requestIdRef = useRef(0);

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    setState({ status: "idle" });
  }, []);

  const lookupPin = useCallback(async (pin: string) => {
    const requestId = ++requestIdRef.current;
    setState({ status: "loading" });

    try {
      const response = await fetch(`/api/pincode-geo/${encodeURIComponent(pin)}`, {
        signal: AbortSignal.timeout(PIN_LOOKUP_TIMEOUT_MS),
      });
      const payload = response.ok ? ((await response.json()) as GeoPoint) : null;
      if (requestId !== requestIdRef.current) return;

      if (payload && Number.isFinite(payload.lat) && Number.isFinite(payload.lng)) {
        setState({ status: "found", point: { lat: payload.lat, lng: payload.lng } });
        return;
      }

      // 404 = unknown PIN, 400 = malformed; anything else (busy, upstream down) is temporary.
      setState({
        status: "pin-failed",
        message:
          response.status === 404
            ? PIN_NOT_FOUND_MESSAGE
            : response.status === 400
              ? PIN_INVALID_MESSAGE
              : PIN_UNAVAILABLE_MESSAGE,
      });
    } catch {
      // Network error or timeout.
      if (requestId === requestIdRef.current) {
        setState({ status: "pin-failed", message: PIN_UNAVAILABLE_MESSAGE });
      }
    }
  }, []);

  const locate = useCallback(() => {
    const requestId = ++requestIdRef.current;

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setState({
        status: "location-failed",
        message: "Your browser does not support location services.",
      });
      return;
    }

    setState({ status: "locating" });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (requestId !== requestIdRef.current) return;
        setState({
          status: "found",
          point: { lat: position.coords.latitude, lng: position.coords.longitude },
        });
      },
      (error) => {
        if (requestId !== requestIdRef.current) return;
        setState({
          status: "location-failed",
          message: getGeolocationErrorMessage(error.code).title,
        });
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 },
    );
  }, []);

  return { state, lookupPin, locate, reset };
}
