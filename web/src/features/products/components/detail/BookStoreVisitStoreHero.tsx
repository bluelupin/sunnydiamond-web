import Image from "next/image";
import type { BookStoreVisitStore } from "@/features/products/data/bookStoreVisitContent";
import { BookStoreVisitStoreInfoCard } from "./BookStoreVisitStoreInfoCard";

type BookStoreVisitStoreHeroProps = {
  store: BookStoreVisitStore;
  directionsLabel?: string | null;
};

/** Store hero image with centred chalk info card — Figma 4903:34659 / 4903:39793. */
export function BookStoreVisitStoreHero({ store, directionsLabel }: BookStoreVisitStoreHeroProps) {
  const heroImage = store.heroImage || store.mobileHeroImage;

  return (
    <div
      className="relative w-full aspect-[3/4] min-h-[420px] overflow-hidden bg-gray300 md:aspect-auto md:h-[486px] md:min-h-[486px]"
    >
      {heroImage ? (
        <Image
          src={heroImage}
          alt={store.imageAlt || store.storeName}
          fill
          className="object-cover object-center"
          sizes="(max-width: 480px) 100vw, 480px"
        />
      ) : null}
      <div
        className="absolute inset-4 flex flex-col justify-end"
        aria-label={`${store.storeName} location details`}
      >
        <BookStoreVisitStoreInfoCard store={store} directionsLabel={directionsLabel} />
      </div>
    </div>
  );
}
