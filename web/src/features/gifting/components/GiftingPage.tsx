import { Suspense } from "react";
import GiftingDiscoverOptionsLoader from "./GiftingDiscoverOptionsLoader";
import GiftingDiscoverSection from "./GiftingDiscoverSection";
import GiftingGiftCardSection from "./GiftingGiftCardSection";
import GiftingGuaranteesSection from "./GiftingGuaranteesSection";
import GiftingIntroSection from "./GiftingIntroSection";
import GiftingOccasionSection from "./GiftingOccasionSection";
import GiftingProductListSection from "./GiftingProductListSection";
import GiftingPromiseSection from "./GiftingPromiseSection";
import GiftingWithLoveSection from "./GiftingWithLoveSection";

const GiftingPage = () => {
  return (
    <>
      <GiftingIntroSection />
      <GiftingWithLoveSection />
      <GiftingOccasionSection />
      <GiftingProductListSection />
      <Suspense fallback={<GiftingDiscoverSection />}>
        <GiftingDiscoverOptionsLoader />
      </Suspense>
      <GiftingGiftCardSection />
      <GiftingPromiseSection />
      <GiftingGuaranteesSection />
    </>
  );
};

export default GiftingPage;
