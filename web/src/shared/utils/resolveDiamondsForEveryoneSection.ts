import type {
  BespokeForYouCard,
  HomepageEditorialBlocksData,
} from "@/types/homepage/editorialBlocks";
import type {
  DiamondsForEveryoneSectionCta,
  DiamondsForEveryoneSectionData,
  SavingsPlanStep,
} from "@/types/homepage/diamondsForEveryoneSection";

export type ResolvedDiamondsForEveryoneSection = {
  isActive?: boolean;
  eyebrow?: string;
  sectionTitle?: string;
  subtitle?: string;
  steps?: SavingsPlanStep[];
  cta?: DiamondsForEveryoneSectionCta;
  fromCms: boolean;
};

const DIAMONDS_FOR_EVERYONE_TITLE = "diamonds for everyone";

function findDiamondsForEveryoneCard(
  cards: BespokeForYouCard[] | null | undefined,
): BespokeForYouCard | null {
  if (!cards?.length) return null;

  const activeCards = cards.filter((card) => card?.isActive !== false);

  const byTitle = activeCards.find((card) =>
    card.title?.trim().toLowerCase().includes(DIAMONDS_FOR_EVERYONE_TITLE),
  );
  if (byTitle) return byTitle;

  const bySortOrder = activeCards.find((card) => card.sortOrder === 2);
  if (bySortOrder) return bySortOrder;

  const sorted = [...activeCards].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
  return sorted[1] ?? null;
}

function mapCardCta(
  card: BespokeForYouCard,
): DiamondsForEveryoneSectionCta | undefined {
  if (!card.cta) return undefined;

  return {
    label: card.cta.label,
    url: card.cta.url,
  };
}

export function resolveDiamondsForEveryoneSection(
  editorialData?: HomepageEditorialBlocksData | null,
): ResolvedDiamondsForEveryoneSection {
  const dedicated: DiamondsForEveryoneSectionData | null =
    editorialData?.diamondsForEveryoneSection ?? null;
  const card = findDiamondsForEveryoneCard(editorialData?.bespokeForYouCards);
  const fromCms = Boolean(dedicated || card);

  return {
    isActive: dedicated?.isActive ?? card?.isActive,
    eyebrow: dedicated?.eyebrow ?? card?.eyebrow ?? card?.subtitle,
    sectionTitle: dedicated?.sectionTitle ?? card?.title,
    subtitle:
      dedicated?.subtitle ??
      dedicated?.description ??
      card?.description,
    steps: dedicated?.steps,
    cta: dedicated?.cta ?? mapCardCta(card ?? {}),
    fromCms,
  };
}
