import {
  prefetchJewelleryListing,
  prefetchMagentoJewelleryNav,
} from "@/lib/magento/prefetchMagento";
import type { NormalizedGiftingGiftFinder } from "@/services/gifting/gifting-page.types";
import { mapGiftingDiscoverOptions } from "../utils/giftFinderRoutes";
import GiftingDiscoverSection from "./GiftingDiscoverSection";

type GiftingDiscoverOptionsLoaderProps = {
  giftFinder: NormalizedGiftingGiftFinder;
};

const GiftingDiscoverOptionsLoader = async ({
  giftFinder,
}: GiftingDiscoverOptionsLoaderProps) => {
  const [nav, listing] = await Promise.all([
    prefetchMagentoJewelleryNav(),
    prefetchJewelleryListing(null),
  ]);

  const discoverOptions =
    nav && listing?.facets
      ? mapGiftingDiscoverOptions(nav, listing.facets)
      : undefined;

  return (
    <GiftingDiscoverSection
      giftFinder={giftFinder}
      discoverOptions={discoverOptions}
    />
  );
};

export default GiftingDiscoverOptionsLoader;
