import GuaranteesBar from "@/shared/ui/GuaranteesBar";
import type { NormalizedProductLandingTrustBadge } from "@/services/product-landing/product-landing-page.types";

type JewelleryGuaranteesSectionProps = {
  trustBadges: NormalizedProductLandingTrustBadge[];
};

const JewelleryGuaranteesSection = ({ trustBadges }: JewelleryGuaranteesSectionProps) => {
  if (trustBadges.length === 0) return null;

  return (
    <GuaranteesBar
      items={trustBadges.map((badge) => ({
        label: badge.label,
        alt: badge.alt,
        icon: {
          desktopUrl: badge.iconSrc,
          mobileUrl: badge.iconSrc,
          alt: badge.alt,
        },
      }))}
      ariaLabel="Sunny Diamonds guarantees"
    />
  );
};

export default JewelleryGuaranteesSection;
