import type {
  BespokeForYouCard,
  HomepageEditorialBlocksData,
} from "@/types/homepage/editorialBlocks";
import type {
  BespokeForYouSectionCta,
  BespokeForYouSectionData,
} from "@/types/homepage/bespokeForYouSection";

export type ResolvedBespokeForYouSection = {
  isActive?: boolean;
  sectionTitle?: string;
  subtitle?: string;
  image?: BespokeForYouSectionData["image"];
  primaryCta?: BespokeForYouSectionCta;
  secondaryCta?: BespokeForYouSectionCta;
  /** True when data came from Strapi (dedicated section or card). */
  fromCms: boolean;
};

const BESPOKE_FOR_YOU_TITLE = "bespoke for you";

function findBespokeForYouCard(
  cards: BespokeForYouCard[] | null | undefined,
): BespokeForYouCard | null {
  if (!cards?.length) return null;

  const activeCards = cards.filter((card) => card?.isActive !== false);

  const byTitle = activeCards.find((card) =>
    card.title?.trim().toLowerCase().includes(BESPOKE_FOR_YOU_TITLE),
  );
  if (byTitle) return byTitle;

  const bySortOrder = activeCards.find((card) => card.sortOrder === 1);
  if (bySortOrder) return bySortOrder;

  const sorted = [...activeCards].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
  return sorted[0] ?? null;
}

function mapCardCta(card: BespokeForYouCard): BespokeForYouSectionCta | undefined {
  if (!card.cta) return undefined;

  return {
    label: card.cta.label,
    url: card.cta.url,
    targetType: card.cta.targetType,
    openInNewTab: card.cta.openInNewTab,
  };
}

export function resolveBespokeForYouSection(
  editorialData?: HomepageEditorialBlocksData | null,
): ResolvedBespokeForYouSection {
  const dedicated: BespokeForYouSectionData | null =
    editorialData?.bespokeForYouSection ?? null;
  const card = findBespokeForYouCard(editorialData?.bespokeForYouCards);
  const fromCms = Boolean(dedicated || card);

  return {
    isActive: dedicated?.isActive ?? card?.isActive,
    sectionTitle: dedicated?.sectionTitle ?? card?.title,
    subtitle:
      dedicated?.subtitle ??
      dedicated?.description ??
      card?.description,
    image: dedicated?.image ?? card?.image,
    primaryCta: dedicated?.primaryCta ?? mapCardCta(card ?? {}),
    secondaryCta: dedicated?.secondaryCta,
    fromCms,
  };
}
