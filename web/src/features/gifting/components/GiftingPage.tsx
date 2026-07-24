import GiftingDiscoverSection from "./GiftingDiscoverSection";
import GiftingGiftCardSection from "./GiftingGiftCardSection";
import GiftingIntroSection from "./GiftingIntroSection";
import GiftingOccasionSection from "./GiftingOccasionSection";
import GiftingProductListSection from "./GiftingProductListSection";
import GiftingPromiseSection from "./GiftingPromiseSection";

const GiftingPage = () => {
  return (
    <>
      <GiftingIntroSection />
      <GiftingOccasionSection />
      <GiftingProductListSection />
      <GiftingDiscoverSection />
      <GiftingGiftCardSection />
      <GiftingPromiseSection />
    </>
  );
};

export default GiftingPage;
