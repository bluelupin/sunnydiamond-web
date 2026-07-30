import GiftingDiscoverSection from "./GiftingDiscoverSection";
import GiftingGiftCardSection from "./GiftingGiftCardSection";
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
      <GiftingDiscoverSection />
      <GiftingGiftCardSection />
      <GiftingPromiseSection />
    </>
  );
};

export default GiftingPage;
