"use client";

import { useCallback, useState } from "react";
import { useToast } from "@/shared/hooks/use-toast";
import {
  getGeolocationErrorMessage,
  type ParsedAddress,
} from "@/shared/utils/reverseGeocode";

const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

const getCurrentPosition = () =>
  new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, GEOLOCATION_OPTIONS);
  });

const fetchAddressFromCoordinates = async (latitude: number, longitude: number) => {
  const response = await fetch(
    `/api/reverse-geocode?lat=${encodeURIComponent(String(latitude))}&lon=${encodeURIComponent(String(longitude))}`,
  );

  if (!response.ok) {
    throw new Error("reverse-geocode-failed");
  }

  return (await response.json()) as ParsedAddress;
};

export const useCurrentLocationAddress = () => {
  const { toast } = useToast();
  const [isLocating, setIsLocating] = useState(false);

  const detectAddress = useCallback(async (): Promise<ParsedAddress | null> => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      toast({
        title: "Location unavailable",
        description: "Your browser does not support location services.",
      });
      return null;
    }

    setIsLocating(true);

    try {
      const position = await getCurrentPosition();
      const address = await fetchAddressFromCoordinates(
        position.coords.latitude,
        position.coords.longitude,
      );

      toast({
        title: "Address detected",
        description: "We've filled in your current location.",
      });

      return address;
    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        const message = getGeolocationErrorMessage(error.code);
        toast(message);
        return null;
      }

      toast({
        title: "Address lookup failed",
        description: "We couldn't resolve your current location. Please enter your address manually.",
      });
      return null;
    } finally {
      setIsLocating(false);
    }
  }, [toast]);

  return {
    detectAddress,
    isLocating,
  };
};
