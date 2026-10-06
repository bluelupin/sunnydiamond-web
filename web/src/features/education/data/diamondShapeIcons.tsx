import type { ComponentType } from "react";
import BaguetteShapeIcon from "@/assets/Icons/DiscoverJourney/BaguetteShapeIcon";
import BrilliantCutShapeIcon from "@/assets/Icons/DiscoverJourney/BrilliantCutShapeIcon";
import CushionShapeIcon from "@/assets/Icons/DiscoverJourney/CushionShapeIcon";
import EmeraldShapeIcon from "@/assets/Icons/DiscoverJourney/EmeraldShapeIcon";
import FrenchShapeIcon from "@/assets/Icons/DiscoverJourney/FrenchShapeIcon";
import HeartShapeIcon from "@/assets/Icons/DiscoverJourney/HeartShapeIcon";
import LucidaShapeIcon from "@/assets/Icons/DiscoverJourney/LucidaShapeIcon";
import MarquiseShapeIcon from "@/assets/Icons/DiscoverJourney/MarquiseShapeIcon";
import OvalShapeIcon from "@/assets/Icons/DiscoverJourney/OvalShapeIcon";
import PearShapeIcon from "@/assets/Icons/DiscoverJourney/PearShapeIcon";
import PrincessShapeIcon from "@/assets/Icons/DiscoverJourney/PrincessShapeIcon";
import RoundShapeIcon from "@/assets/Icons/DiscoverJourney/RoundShapeIcon";
import SquareShapeIcon from "@/assets/Icons/DiscoverJourney/SquareShapeIcon";
import { slugifyDiamondShapeLabel } from "@/features/jewellery-product/utils/diamondShapeListing";

/** Figma 4903:61397 — Magento `sd_diamond_shape` option value → icon (Discover journey step 3). */
export const diamondShapeIconSrc: Record<string, ComponentType<{ className?: string }>> = {
  "64": RoundShapeIcon,
  "65": OvalShapeIcon,
  "66": CushionShapeIcon,
  "67": PearShapeIcon,
  "68": EmeraldShapeIcon,
  "69": HeartShapeIcon,
};

/** Label slug fallback for Magento facet options (including shapes beyond the six core ids). */
export const diamondShapeIconByLabelSlug: Record<
  string,
  ComponentType<{ className?: string }>
> = {
  round: RoundShapeIcon,
  oval: OvalShapeIcon,
  cushion: CushionShapeIcon,
  pear: PearShapeIcon,
  emerald: EmeraldShapeIcon,
  heart: HeartShapeIcon,
  princess: PrincessShapeIcon,
  baguette: BaguetteShapeIcon,
  french: FrenchShapeIcon,
  "brilliant-cut": BrilliantCutShapeIcon,
  brilliant: BrilliantCutShapeIcon,
  marquise: MarquiseShapeIcon,
  square: SquareShapeIcon,
  lucida: LucidaShapeIcon,
};

export function resolveDiscoverJourneyDiamondShapeIcon(option: {
  value: string;
  label: string;
}): ComponentType<{ className?: string }> | null {
  const byValue = diamondShapeIconSrc[option.value.trim()];
  if (byValue) {
    return byValue;
  }

  const labelSlug = slugifyDiamondShapeLabel(option.label);
  if (!labelSlug) {
    return null;
  }

  return diamondShapeIconByLabelSlug[labelSlug] ?? null;
}
