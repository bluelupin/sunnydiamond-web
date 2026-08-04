import GuaranteesBar from "@/shared/ui/GuaranteesBar";
import type { NormalizedGiftingTrustBadge } from "@/services/gifting/gifting-page.types";

type GiftingGuaranteesSectionProps = {
  trustBadges: NormalizedGiftingTrustBadge[];
};

const GiftingGuaranteesSection = ({ trustBadges }: GiftingGuaranteesSectionProps) => {
  if (trustBadges.length === 0) return null;

  return (
    <GuaranteesBar
      items={trustBadges}
      ariaLabel="Sunny Diamonds guarantees"
    />
  );
};

export default GiftingGuaranteesSection;
