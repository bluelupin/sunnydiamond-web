import Image from "next/image";
import type { BookStoreVisitStore } from "@/features/products/data/bookStoreVisitContent";

type StoreLocatorMapViewProps = {
  store: BookStoreVisitStore;
};

export function StoreLocatorMapView({ store }: StoreLocatorMapViewProps) {
  return (
    <div className="relative h-full min-h-[400px] w-full overflow-hidden bg-gray300 lg:min-h-[609px]">
      {store.heroImage ? (
        <Image
          src={store.heroImage}
          alt={`Sunny Diamonds showroom in ${store.storeName}`}
          fill
          className="object-cover animate-in fade-in duration-500"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      ) : null}
    </div>
  );
}
