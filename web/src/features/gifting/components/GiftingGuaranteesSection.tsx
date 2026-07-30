import GuaranteesBar from "@/shared/ui/GuaranteesBar";
import { giftingPageContent } from "../data/content";

const GiftingGuaranteesSection = () => (
  <GuaranteesBar
    items={giftingPageContent.guarantees}
    ariaLabel="Sunny Diamonds guarantees"
  />
);

export default GiftingGuaranteesSection;
