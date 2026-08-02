import {
  prefetchJewelleryListing,
  prefetchMagentoJewelleryNav,
} from "@/lib/magento/prefetchMagento";
import { mapGiftingDiscoverOptions } from "../utils/giftFinderRoutes";
import GiftingDiscoverSection from "./GiftingDiscoverSection";

const GiftingDiscoverOptionsLoader = async () => {
  const [nav, listing] = await Promise.all([
    prefetchMagentoJewelleryNav(),
    prefetchJewelleryListing(null),
  ]);

  const discoverOptions =
    nav && listing?.facets
      ? mapGiftingDiscoverOptions(nav, listing.facets)
      : undefined;

  return <GiftingDiscoverSection discoverOptions={discoverOptions} />;
};

export default GiftingDiscoverOptionsLoader;
