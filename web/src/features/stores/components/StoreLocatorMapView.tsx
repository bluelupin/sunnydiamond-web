import Image from "next/image";
import type { BookStoreVisitStore } from "@/features/products/data/bookStoreVisitContent";
import { DELIVERY_STORE_MAP_IMAGES } from "@/features/products/data/deliveryStoreContent";

type StoreLocatorMapViewProps = {
  store: BookStoreVisitStore;
};

export function StoreLocatorMapView({ store }: StoreLocatorMapViewProps) {
  return (
    <div className="relative h-full min-h-[400px] w-full overflow-hidden lg:min-h-[609px]">
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={DELIVERY_STORE_MAP_IMAGES.base}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <Image
          src={DELIVERY_STORE_MAP_IMAGES.overlay1}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <Image
          src={DELIVERY_STORE_MAP_IMAGES.overlay2}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      {store.heroImage ? (
        <div
          className="absolute overflow-hidden animate-in fade-in duration-500"
          style={{
            height: "93.99%",
            left: "22.49%",
            top: "5.99%",
            width: "51.95%",
          }}
        >
          <div className="relative size-full">
            <Image
              src={store.heroImage}
              alt={`Sunny Diamonds showroom in ${store.storeName}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 80vw, 40vw"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
