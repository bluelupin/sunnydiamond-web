import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";
import { DELIVERY_STORE_MAP_IMAGES } from "@/features/products/data/deliveryStoreContent";

type StoreVisitMapBlockProps = {
  variant: "availability" | "store-select" | "booking-hero";
  heroImage?: string;
  children: ReactNode;
  cardClassName?: string;
};

const MAP_LAYER_POSITION_CLASSNAME =
  "absolute left-[calc(50%+55.5px)] top-[calc(50%+13.76px)] h-[518px] w-[720px] -translate-x-1/2 -translate-y-1/2";

const MapLayersStack = () => (
  <div className={MAP_LAYER_POSITION_CLASSNAME}>
    <div className="relative size-full" aria-hidden>
      <Image
        src={DELIVERY_STORE_MAP_IMAGES.base}
        alt=""
        fill
        className="object-cover"
        sizes="720px"
      />
      <Image
        src={DELIVERY_STORE_MAP_IMAGES.overlay1}
        alt=""
        fill
        className="object-cover"
        sizes="720px"
      />
      <Image
        src={DELIVERY_STORE_MAP_IMAGES.overlay2}
        alt=""
        fill
        className="object-cover"
        sizes="720px"
      />
    </div>
  </div>
);

const StoreVisitMapBlock = ({
  variant,
  heroImage,
  children,
  cardClassName,
}: StoreVisitMapBlockProps) => {
  if (variant === "booking-hero" && heroImage) {
    return (
      <div className="flex h-400 w-full shrink-0 flex-col justify-end overflow-hidden">
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
          <Image
            src={heroImage}
            alt=""
            width={1005}
            height={476}
            className="max-w-none object-cover"
            style={{
              width: "209.18%",
              height: "118.92%",
              marginLeft: "-53.51%",
              marginTop: "-13.32%",
            }}
            sizes="(max-width: 480px) 100vw, 480px"
            aria-hidden
          />
        </div>
        <div
          className={cn(
            "mx-4 -mt-10 flex w-auto flex-col gap-4 bg-gray300 px-4 py-6",
            cardClassName,
          )}
        >
          {children}
        </div>
      </div>
    );
  }

  if (variant === "availability") {
    return (
      <div className="relative h-400 w-full shrink-0 overflow-hidden">
        <MapLayersStack />
        <div
          className={cn(
            "absolute inset-x-4 bottom-4 flex flex-col gap-6 bg-gray300 px-4 py-6",
            cardClassName,
          )}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-400 w-full shrink-0 overflow-hidden">
      <MapLayersStack />
      <div
        className={cn(
          "absolute inset-x-4 top-[163px] flex flex-col gap-4 bg-gray300 px-4 py-6",
          cardClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default StoreVisitMapBlock;
