"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import BookStoreVisitPanel from "./BookStoreVisitPanel";
import { DetailDarkButton, DetailTextLink } from "./shared";
import NearbyStoresList, {
  NearbyStoresSkeleton,
} from "@/features/stores/components/NearbyStoresList";
import { useNearbySearchPoint } from "@/features/stores/hooks/useNearbySearchPoint";
import { nearestStores } from "@/features/stores/utils/geo";
import { mapStoreLocatorShowroomToBookStoreVisit } from "@/features/products/utils/bookStoreVisitStores";
import {
  PDP_HERE_FOR_YOU_ANCHOR,
  resolveHereForYouPanelAction,
} from "@/features/products/utils/hereForYouCardActions";
import type { NormalizedStoreLocatorShowroom } from "@/services/store-locator/store-locator-page.types";
import type { NormalizedProductDisplayCard } from "@/services/product-display/product-display-page.types";
import { sanitizePincodeInput, validateIndianPincode } from "@/shared/utils/formValidation";

// Built from existing PDP styles; awaits OneThing design review (R-X-5).

type NearestStoresStripProps = {
  productName?: string;
  productId?: string;
  hereForYou: NormalizedProductDisplayCard;
};

const textClassName = "font-gill text-base font-light leading-110 text-darkblack";

const SHOWROOMS_TIMEOUT_MS = 10000;

type StripShowrooms = {
  showrooms: NormalizedStoreLocatorShowroom[];
  nearestStoreRadiusKm: number;
};

const NearestStoresStrip = ({ productName, productId, hereForYou }: NearestStoresStripProps) => {
  const rootRef = useRef<HTMLElement>(null);
  const loadStartedRef = useRef(false);
  const [data, setData] = useState<StripShowrooms | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [bookingStoreId, setBookingStoreId] = useState<string | null>(null);
  const { state, lookupPin, locate } = useNearbySearchPoint();

  // Showroom list (with coordinates), fetched once when needed; a failure allows a later retry.
  const loadStores = useCallback(() => {
    if (loadStartedRef.current) return;
    loadStartedRef.current = true;
    setLoadFailed(false);
    void fetch("/api/store-locator/showrooms", { signal: AbortSignal.timeout(SHOWROOMS_TIMEOUT_MS) })
      .then(async (response) => {
        const payload = response.ok ? ((await response.json()) as StripShowrooms) : null;
        if (!payload?.showrooms?.length) {
          throw new Error("No showrooms");
        }
        setData(payload);
      })
      .catch(() => {
        loadStartedRef.current = false;
        setLoadFailed(true);
      });
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadStores();
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadStores]);

  const stores = useMemo(
    () => (data?.showrooms ?? []).map(mapStoreLocatorShowroomToBookStoreVisit),
    [data?.showrooms],
  );
  const radiusKm = data?.nearestStoreRadiusKm;

  const fallbackActions = hereForYou.isActive
    ? hereForYou.buttons.filter((button) => {
        const action = resolveHereForYouPanelAction(button.modalTag);
        return action === "video-call" || action === "try-at-home";
      })
    : [];

  const submitPin = (value: string) => {
    const validation = validateIndianPincode(value);
    if (!validation.valid) {
      setPinError(validation.error ?? "Enter a valid 6-digit pincode");
      return;
    }
    setPinError(null);
    loadStores();
    void lookupPin(value);
  };

  const handlePinChange = (value: string) => {
    const sanitized = sanitizePincodeInput(value);
    setPin(sanitized);
    setPinError(null);
    if (sanitized.length === 6) {
      submitPin(sanitized);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitPin(pin);
  };

  const renderResult = () => {
    if (state.status === "loading") return <NearbyStoresSkeleton />;
    if (state.status === "locating") return <p className={textClassName}>Locating…</p>;
    if (state.status === "pin-failed") {
      return (
        <p className={textClassName} role="status">
          {state.message}
        </p>
      );
    }
    if (state.status === "location-failed") {
      return (
        <p className={textClassName} role="status">
          {`${state.message}. Enter your PIN code instead.`}
        </p>
      );
    }
    if (state.status !== "found") return null;
    if (loadFailed) {
      return (
        <div className="flex flex-col gap-3" role="status">
          <p className={textClassName}>We couldn&apos;t load our showrooms. Please try again.</p>
          <DetailTextLink onClick={loadStores}>Try again</DetailTextLink>
        </div>
      );
    }
    if (!data || radiusKm == null) return <NearbyStoresSkeleton />;

    const results = nearestStores(stores, state.point, radiusKm);
    if (results.length > 0) {
      return <NearbyStoresList results={results} onBook={setBookingStoreId} />;
    }

    return (
      <div className="flex flex-col gap-3" role="status">
        <p className={textClassName}>{`No showroom within ${radiusKm} km`}</p>
        {fallbackActions.length > 0 ? (
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {fallbackActions.map((button) => (
              <DetailTextLink key={button.label} href={`#${PDP_HERE_FOR_YOU_ANCHOR}`}>
                {button.label}
              </DetailTextLink>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <section
      ref={rootRef}
      aria-labelledby="nearest-stores-heading"
      className="flex justify-center px-4 py-10 md:px-8 lg:px-10 lg:py-16"
    >
      <div className="flex w-full max-w-311 flex-col gap-6 lg:max-w-1360">
        <h2
          id="nearest-stores-heading"
          className="font-larken text-2xl font-light leading-110 text-darkblack lg:text-32"
        >
          Find a showroom near you
        </h2>

        <form onSubmit={handleSubmit} className="flex max-w-[520px] flex-col gap-3">
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              value={pin}
              onFocus={loadStores}
              onChange={(event) => handlePinChange(event.target.value)}
              placeholder="Enter PIN code"
              aria-label="PIN code"
              aria-invalid={pinError ? true : undefined}
              className="h-14 min-w-0 flex-1 border border-aboutInactive bg-aboutInactive px-6 font-gill text-base text-darkblack outline-none"
            />
            <DetailDarkButton type="submit" className="w-auto shrink-0 px-7 uppercase">
              Find
            </DetailDarkButton>
          </div>
          {pinError ? (
            <p className="font-gill text-sm font-light leading-110 text-darkblack" role="alert">
              {pinError}
            </p>
          ) : null}
          <DetailTextLink
            onClick={() => {
              loadStores();
              locate();
            }}
            disabled={state.status === "locating"}
          >
            Use my location
          </DetailTextLink>
        </form>

        <div aria-live="polite">{renderResult()}</div>
      </div>

      {bookingStoreId ? (
        <BookStoreVisitPanel
          open
          onClose={() => setBookingStoreId(null)}
          initialStores={stores}
          initialStoreId={bookingStoreId}
          productName={productName}
          productId={productId}
        />
      ) : null}
    </section>
  );
};

export default NearestStoresStrip;
