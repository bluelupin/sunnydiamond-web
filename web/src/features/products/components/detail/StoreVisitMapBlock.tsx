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

const mapLayers = (
  <div className="grid shrink-0 [&>*]:col-start-1 [&>*]:row-start-1">
    <Image
      src={DELIVERY_STORE_MAP_IMAGES.base}
      alt=""
      width={720}
      height={518}
      className="max-w-none object-cover"
      sizes="720px"
    />
    <Image
      src={DELIVERY_STORE_MAP_IMAGES.overlay1}
      alt=""
      width={720}
      height={518}
      className="max-w-none object-cover"
      sizes="720px"
    />
    <Image
      src={DELIVERY_STORE_MAP_IMAGES.overlay2}
      alt=""
      width={720}
      height={518}
      className="max-w-none object-cover"
      sizes="720px"
    />
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
            "mx-auto -mt-40 flex w-311 flex-col gap-4 bg-gray300 px-4 py-6",
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
        <div className="absolute left-[calc(50%+55.5px)] top-[calc(50%+13.76px)] -translate-x-1/2 -translate-y-1/2">
          {mapLayers}
        </div>
        <div
          className={cn(
            "absolute bottom-4 left-1/2 flex w-311 -translate-x-1/2 flex-col gap-6 bg-gray300 px-4 py-6",
            cardClassName,
          )}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-400 w-full shrink-0 flex-col justify-end overflow-hidden">
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        {mapLayers}
      </div>
      <div
        className={cn(
          "mx-auto flex w-311 flex-col bg-gray300 px-4 py-6",
          variant === "store-select" ? "-mt-60 gap-4" : "mb-4 gap-6",
          cardClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default StoreVisitMapBlock;
