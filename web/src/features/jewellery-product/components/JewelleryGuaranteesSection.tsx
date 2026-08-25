import GuaranteesBar from "@/shared/ui/GuaranteesBar";
import type { NormalizedProductLandingTrustBadge } from "@/services/product-landing/product-landing-page.types";

type JewelleryGuaranteesSectionProps = {
  trustBadges: NormalizedProductLandingTrustBadge[];
};

const JewelleryGuaranteesSection = ({ trustBadges }: JewelleryGuaranteesSectionProps) => {
  if (trustBadges.length === 0) return null;

  return (
    <GuaranteesBar
      items={trustBadges}
      ariaLabel="Sunny Diamonds guarantees"
    />
  );
};

export default JewelleryGuaranteesSection;
