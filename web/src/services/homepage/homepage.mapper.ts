import type { BespokeForYouSectionData } from "@/types/homepage/bespokeForYouSection";
import type {
  CategoryNavigationCta,
  CategoryNavigationImage,
  CategoryNavigationItem,
  FeaturedCollectionSection,
  GiftingBanner,
  HomepageShoppingBlocksData,
} from "@/types/homepage/categoryNavigation";
import type { DiamondsForEveryoneSectionData, SavingsPlanStep } from "@/types/homepage/diamondsForEveryoneSection";
import type {
  DiamondSourcingSectionData,
  HomepageEditorialBlocksData,
  ShowroomSectionData,
  SunnyPromiseSectionData,
} from "@/types/homepage/editorialBlocks";
import type { CraftingBrillianceSectionData } from "@/types/homepage/craftingBrillianceSection";
import type { CraftsmanshipStep } from "@/types/homepage/craftsmanshipSteps";
import type { FeaturedProductsSection } from "@/types/homepage/featuredProducts";
import type { OccasionCard, OccasionSection } from "@/types/homepage/occasionSection";
import { slugifyOccasionTitle } from "@/features/jewellery-product/utils/occasionListing";
import { resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import { resolveResponsiveCmsImage } from "@/shared/utils/responsiveCmsImage";
import type { TrustBadge } from "@/types/homepage/trustBadges";
import type { HomepageSeo } from "@/types/homepage/seo";
import type {
  StrapiCraftingBrillianceSection,
  StrapiCategoryCard,
  StrapiFeaturedCollection,
  StrapiFeaturedProductsBlock,
  StrapiGiftingBanner,
  StrapiGlobalShell,
  StrapiHomepageCta,
  StrapiHomepageEditorialBlocksEntity,
  StrapiHomepageHero,
  StrapiHomepageShellEntity,
  StrapiHomepageShoppingBlocksEntity,
  StrapiOccasionSection,
  StrapiOccasionCard,
  StrapiResponsiveImageBlock,
  StrapiShowroomSection,
  StrapiCraftsmanshipStep,
  StrapiSavingsPlanStep,
  StrapiTextSection,
  StrapiTrustBadge,
} from "./homepage.strapi.types";

export type NormalizedHomepageHero = {
  id?: number;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  isActive?: boolean;
  primaryCta?: CategoryNavigationCta;
  secondaryCta?: CategoryNavigationCta;
  image?: CategoryNavigationImage;
  videoUrl?: string;
};

export type NormalizedHomepageShell = {
  global?: StrapiGlobalShell | null;
  homepage?: {
    hero?: NormalizedHomepageHero | null;
    seo?: HomepageSeo | null;
  } | null;
  hero?: NormalizedHomepageHero | null;
  headerNavigationLinks?: StrapiGlobalShell["headerNavigationLinks"];
  footerLinkGroups?: StrapiGlobalShell["footerLinkGroups"];
  footerCopyright?: string | null;
  socialLinks?: StrapiGlobalShell["socialLinks"];
};

const cleanText = (value?: string | null): string | undefined => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

/** Accepts `#RGB`, `#RRGGBB`, or the same without `#`. Invalid values are ignored. */
function normalizeCssHexColor(value?: string | null): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;

  const hex = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(hex)) {
    return undefined;
  }

  return hex;
}

/** Maps CMS `showField` and legacy `isActive` to a single visibility flag. */
export function resolveSectionActive(
  isActive?: boolean | null,
  showField?: boolean | null,
): boolean | undefined {
  if (typeof isActive === "boolean") return isActive;
  if (typeof showField === "boolean") return showField;
  return undefined;
}

function mapCta(cta?: StrapiHomepageCta | null): CategoryNavigationCta | undefined {
  if (!cta) return undefined;

  const label = cleanText(cta.label);
  const url = cleanText(cta.url);

  if (!label && !url) return undefined;

  return {
    label,
    url,
    to: url,
  };
}

function mapResponsiveImage(
  block?: StrapiResponsiveImageBlock | null,
): CategoryNavigationImage | undefined {
  if (!block) return undefined;

  return {
    desktopImage: block.desktopImage as CategoryNavigationImage["desktopImage"],
    mobileImage: block.mobileImage as CategoryNavigationImage["mobileImage"],
  };
}

function pickResponsiveImage(
  ...candidates: Array<StrapiResponsiveImageBlock | null | undefined>
): CategoryNavigationImage | undefined {
  for (const candidate of candidates) {
    const mapped = mapResponsiveImage(candidate);
    if (mapped?.desktopImage || mapped?.mobileImage) return mapped;
  }
  return undefined;
}

function mapHero(raw?: StrapiHomepageHero | null): NormalizedHomepageHero | undefined {
  if (!raw) return undefined;

  const isActive = resolveSectionActive(raw.isActive, raw.showField);
  if (isActive === false) return undefined;

  const image = pickResponsiveImage(raw.imageBackground, raw.image);
  const videoUrl =
    typeof raw.videoBackground?.heroVideo === "object" &&
    raw.videoBackground.heroVideo &&
    "url" in raw.videoBackground.heroVideo
      ? cleanText((raw.videoBackground.heroVideo as { url?: string }).url)
      : undefined;

  return {
    id: raw.id,
    eyebrow: cleanText(raw.eyebrow),
    title: cleanText(raw.title) ?? cleanText(raw.mainTitle),
    subtitle: cleanText(raw.subtitle),
    isActive,
    primaryCta: mapCta(raw.primaryCta ?? raw.ctaButton ?? raw.cta),
    secondaryCta: mapCta(raw.secondaryCta),
    image,
    videoUrl,
  };
}

export function mapHomepageShellData(
  raw?: StrapiHomepageShellEntity | null,
): NormalizedHomepageShell {
  if (!raw) return {};

  const hero = mapHero(raw.homepage?.hero ?? raw.hero);

  return {
    global: raw.global ?? undefined,
    homepage: {
      ...(raw.homepage ?? {}),
      hero: hero ?? null,
      seo: raw.homepage?.seo ?? null,
    },
    hero: hero ?? null,
  };
}

function mapCategoryCard(card: StrapiCategoryCard): CategoryNavigationItem {
  return {
    id: card.id,
    title: cleanText(card.title) ?? cleanText(card.label),
    label: cleanText(card.label),
    slug: cleanText(card.slug),
    sortOrder: card.sortOrder ?? undefined,
    isActive: card.isActive ?? undefined,
    image: mapResponsiveImage(card.image),
    cutoutImage: mapResponsiveImage(card.cutoutImage),
    hoverImage: mapResponsiveImage(card.hoverImage),
    cta: mapCta(card.cta),
  };
}

function mapFeaturedCollection(
  raw?: StrapiFeaturedCollection | null,
): FeaturedCollectionSection | null {
  if (!raw) return null;

  // New shape: collection-showcase-section with editorial-collection relations
  const collections = Array.isArray(raw.collections) ? raw.collections : [];
  if (collections.length > 0) {
    const activeCollections = collections.filter((item) => item?.isActive !== false);

    const selected =
      activeCollections.find((item) => cleanText(item.slug)?.toLowerCase() === "alankara") ??
      activeCollections[0] ??
      collections.find((item) => cleanText(item.slug)?.toLowerCase() === "alankara") ??
      collections[0];

    if (!selected) return null;
    if (selected.isActive === false) return null;

    const productSkus = (selected.productSkus ?? [])
      .map((item) => cleanText(item?.sku))
      .filter((sku): sku is string => Boolean(sku));

    const featuredProductSku = cleanText(selected.featuredProductSku);

    return {
      id: selected.id ?? raw.id,
      sectionTitle: cleanText(selected.title) ?? cleanText(selected.collectionName),
      description: cleanText(selected.description),
      isActive: true,
      slug: cleanText(selected.slug),
      cta: mapCta(selected.cta),
      primaryImage: selected.backgroundImage as FeaturedCollectionSection["primaryImage"],
      backgroundImage: selected.backgroundImage as FeaturedCollectionSection["backgroundImage"],
      image: selected.backgroundImage as FeaturedCollectionSection["image"],
      productSkus,
      featuredProductSku: featuredProductSku ?? null,
      products: null,
    };
  }

  // Legacy flat featured-collection block
  const isActive = resolveSectionActive(raw.isActive, raw.showField);
  if (isActive === false) return null;

  return {
    id: raw.id,
    sectionTitle: cleanText(raw.sectionTitle) ?? cleanText(raw.title),
    description: cleanText(raw.description),
    isActive,
    cta: mapCta(raw.cta),
    primaryImage: pickResponsiveImage(raw.primaryImage, raw.image, raw.backgroundImage),
    backgroundImage: raw.backgroundImage as FeaturedCollectionSection["backgroundImage"],
    image: pickResponsiveImage(raw.image, raw.primaryImage),
    products: Array.isArray(raw.products)
      ? (raw.products as FeaturedCollectionSection["products"])
      : null,
    productSkus: null,
    featuredProductSku: null,
  };
}

function mapFeaturedProducts(
  raw?: StrapiFeaturedProductsBlock | null,
): FeaturedProductsSection | null {
  if (!raw) return null;

  const isActive = resolveSectionActive(raw.isActive, raw.showField);
  if (isActive === false) return null;

  return {
    id: raw.id,
    sectionTitle: cleanText(raw.sectionTitle) ?? cleanText(raw.title),
    description: cleanText(raw.description) ?? cleanText(raw.subtitle),
    isActive,
    cta: mapCta(raw.cta),
    products: Array.isArray(raw.products)
      ? (raw.products as FeaturedProductsSection["products"])
      : undefined,
  };
}

function mapGiftingBanner(raw?: StrapiGiftingBanner | null): GiftingBanner | null {
  if (!raw) return null;

  const isActive = resolveSectionActive(raw.isActive, raw.showField);
  if (isActive === false) return null;

  return {
    id: raw.id,
    title: cleanText(raw.title),
    description: cleanText(raw.description),
    subtitle: cleanText(raw.subtitle),
    mobileDescription: cleanText(raw.mobileDescription),
    mobileSubtitle: cleanText(raw.mobileSubtitle),
    isActive,
    cta: mapCta(raw.cta),
    primaryCta: mapCta(raw.primaryCta ?? raw.cta),
    secondaryCta: mapCta(raw.secondaryCta ?? raw.secondary),
    secondary: mapCta(raw.secondary),
    backgroundColor: normalizeCssHexColor(raw.backgroundColor),
    backgroundImage: pickResponsiveImage(raw.backgroundImage),
    backgroundVideoUrl: resolveCmsMediaUrl(raw.backgroundVideo?.heroVideo),
    cutoutImage: pickResponsiveImage(raw.cutoutImage),
    image: pickResponsiveImage(raw.cutoutImage, raw.image),
    sideImage: raw.sideImage as GiftingBanner["sideImage"],
  };
}

function mapTrustBadge(badge: StrapiTrustBadge): TrustBadge {
  return {
    id: badge.id,
    label: cleanText(badge.label),
    sortOrder: badge.sortOrder ?? undefined,
    isActive: badge.isActive ?? undefined,
  };
}

export function mapHomepageShoppingBlocksData(
  raw?: StrapiHomepageShoppingBlocksEntity | null,
): HomepageShoppingBlocksData {
  if (!raw) return {};

  const categorySource = raw.categoryNavigation ?? raw.categoryCards ?? [];
  const categoryNavigation = categorySource.map(mapCategoryCard);
  const trustBadges = (raw.trustBadges ?? []).map(mapTrustBadge);
  const featuredCollectionSection = mapFeaturedCollection(
    raw.featuredCollectionSection ?? raw.featuredCollection,
  );
  const featuredProductsSection = mapFeaturedProducts(
    raw.featuredProductsSection ?? raw.featuredProducts,
  );
  const giftingBanner = mapGiftingBanner(raw.giftingBanner);

  return {
    categoryNavigation,
    trustBadges,
    featuredCollectionSection,
    featuredProductsSection,
    giftingBanner,
    homepage: {
      categoryNavigation,
      trustBadges,
      featuredCollectionSection,
      featuredProductsSection,
      giftingBanner,
    },
  };
}

function mapTextSectionToBespoke(raw?: StrapiTextSection | null): BespokeForYouSectionData | null {
  if (!raw) return null;

  const isActive = resolveSectionActive(raw.isActive, raw.showField);
  if (isActive === false) return null;

  return {
    id: raw.id,
    sectionTitle: cleanText(raw.sectionTitle) ?? cleanText(raw.title),
    subtitle: cleanText(raw.subtitle) ?? cleanText(raw.description),
    description: cleanText(raw.description),
    isActive,
    primaryCta: mapCta(raw.primaryCta ?? raw.cta),
    secondaryCta: mapCta(raw.secondaryCta),
    image: pickResponsiveImage(raw.backgroundImage, raw.image) as BespokeForYouSectionData["image"],
  };
}

function parseSavingsPlanStepNumber(label: string | undefined, index: number): number {
  if (!label) return index + 1;
  const digits = label.replace(/\D/g, "");
  const parsed = Number.parseInt(digits, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : index + 1;
}

function mapDiamondsForEveryoneSteps(
  rawSteps?: StrapiSavingsPlanStep[] | null,
): SavingsPlanStep[] {
  if (!Array.isArray(rawSteps)) return [];

  const steps: SavingsPlanStep[] = [];

  rawSteps.forEach((step, index) => {
    if (step?.isActive === false) return;

    const description = cleanText(step.description);
    if (!description) return;

    steps.push({
      id: step.id,
      description,
      highlightedText: cleanText(step.highlightedText),
      stepNumber: parseSavingsPlanStepNumber(cleanText(step.label), index),
      isActive: step.isActive ?? true,
    });
  });

  return steps;
}

function mapTextSectionToDiamondsForEveryone(
  raw?: StrapiTextSection | null,
): DiamondsForEveryoneSectionData | null {
  if (!raw) return null;

  const isActive = resolveSectionActive(raw.isActive, raw.showField);
  if (isActive === false) return null;

  return {
    id: raw.id,
    eyebrow: cleanText(raw.eyebrow),
    sectionTitle: cleanText(raw.sectionTitle) ?? cleanText(raw.title),
    subtitle: cleanText(raw.subtitle),
    description: cleanText(raw.description),
    isActive,
    backgroundImage: pickResponsiveImage(raw.backgroundImage) as DiamondsForEveryoneSectionData["backgroundImage"],
    steps: mapDiamondsForEveryoneSteps(raw.steps as StrapiSavingsPlanStep[] | null | undefined),
    cta: mapCta(raw.cta ?? raw.primaryCta),
  };
}

function mapSunnyPromise(raw?: StrapiTextSection | null): SunnyPromiseSectionData | null {
  if (!raw) return null;

  const isActive = resolveSectionActive(raw.isActive, raw.showField);
  if (isActive === false) return null;

  return {
    id: raw.id,
    sectionTitle: cleanText(raw.sectionTitle) ?? cleanText(raw.title),
    description: cleanText(raw.description),
    isActive,
    cta: mapCta(raw.cta),
    posterImage: raw.posterImage as SunnyPromiseSectionData["posterImage"],
    videoUrl: resolveCmsMediaUrl(raw.video?.heroVideo),
  };
}

function mapDiamondSourcing(raw?: StrapiTextSection | null): DiamondSourcingSectionData | null {
  if (!raw) return null;

  const isActive = resolveSectionActive(raw.isActive, raw.showField);
  if (isActive === false) return null;

  return {
    id: raw.id,
    sectionTitle: cleanText(raw.sectionTitle) ?? cleanText(raw.title),
    isActive,
    image: pickResponsiveImage(raw.cutoutImage, raw.image) as DiamondSourcingSectionData["image"],
    gifOrImage: pickResponsiveImage(raw.gifOrImage) as DiamondSourcingSectionData["gifOrImage"],
  };
}

function mapCraftsmanshipSteps(rawSteps?: StrapiCraftsmanshipStep[] | null): CraftsmanshipStep[] {
  if (!Array.isArray(rawSteps)) return [];

  return rawSteps
    .filter((step) => step?.isActive !== false)
    .map((step, index) => {
      const icon = resolveResponsiveCmsImage(
        (step.icon ?? step.image) as CategoryNavigationImage | null | undefined,
      );

      return {
        id: step.id,
        title: cleanText(step.title),
        description: cleanText(step.description),
        number: String(index + 1).padStart(2, "0"),
        isActive: step.isActive ?? true,
        iconUrl: icon.desktopUrl || icon.mobileUrl,
        iconAlt: icon.desktopAlt || undefined,
      };
    });
}

function mapCraftsmanshipSection(
  raw?: StrapiTextSection | null,
): HomepageEditorialBlocksData["craftsmanshipSection"] {
  if (!raw) return null;

  const isActive = resolveSectionActive(raw.isActive, raw.showField);
  if (isActive === false) return null;

  return {
    id: raw.id,
    sectionTitle: cleanText(raw.sectionTitle) ?? cleanText(raw.title),
    isActive,
    image: pickResponsiveImage(raw.image) as NonNullable<
      HomepageEditorialBlocksData["craftsmanshipSection"]
    >["image"],
    backgroundImage: pickResponsiveImage(raw.backgroundImage) as NonNullable<
      HomepageEditorialBlocksData["craftsmanshipSection"]
    >["backgroundImage"],
    steps: mapCraftsmanshipSteps(raw.steps),
  };
}

function mapOccasionSection(raw?: StrapiOccasionSection | null): OccasionSection | null {
  if (!raw) return null;

  const isActive = resolveSectionActive(raw.isActive, raw.showField);
  if (isActive === false) return null;

  const embedded = mapOccasionCards(
    Array.isArray(raw.occasions) ? (raw.occasions as StrapiOccasionCard[]) : [],
  );

  return {
    id: raw.id,
    sectionTitle: cleanText(raw.sectionTitle),
    isActive,
    occasions: embedded.length > 0 ? embedded : null,
  };
}

export function mapOccasionCard(raw?: StrapiOccasionCard | null): OccasionCard | null {
  if (!raw) return null;

  const isActive = resolveSectionActive(raw.isActive, raw.showField);
  if (isActive === false) return null;

  const title = cleanText(raw.title);
  if (!title) return null;

  return {
    id: raw.id,
    title,
    description: cleanText(raw.description),
    subtitle: cleanText(raw.subtitle),
    filterSlug: cleanText(raw.filterSlug),
    slug: cleanText(raw.filterSlug) ?? cleanText(raw.slug) ?? slugifyOccasionTitle(title),
    sortOrder: raw.sortOrder ?? undefined,
    isActive,
    cta: mapCta(raw.cta),
    image: pickResponsiveImage(raw.image),
  };
}

export function mapOccasionCards(
  items?: StrapiOccasionCard[] | null,
): OccasionCard[] {
  if (!Array.isArray(items)) return [];

  return items
    .map(mapOccasionCard)
    .filter((card): card is OccasionCard => card !== null);
}

function mapCraftingBrillianceSection(
  raw?: StrapiCraftingBrillianceSection | null,
): CraftingBrillianceSectionData | null {
  if (!raw) return null;

  const isActive = resolveSectionActive(raw.isActive, raw.showField);
  if (isActive === false) return null;

  const title = cleanText(raw.title) ?? cleanText(raw.sectionTitle);
  if (!title) return null;

  return {
    id: raw.id,
    title,
    isActive,
    cta: mapCta(raw.cta),
    backgroundImage: pickResponsiveImage(raw.backgroundImage),
    cutoutImage: pickResponsiveImage(raw.cutoutImage),
  };
}

function mapShowroomSection(raw?: StrapiShowroomSection | null): ShowroomSectionData | null {
  if (!raw) return null;

  const isActive = resolveSectionActive(raw.isActive, raw.showField);
  if (isActive === false) return null;

  return {
    id: raw.id,
    sectionTitle: cleanText(raw.sectionTitle),
    description: cleanText(raw.description),
    isActive,
    showrooms: Array.isArray(raw.showrooms)
      ? (raw.showrooms as ShowroomSectionData["showrooms"])
      : null,
  };
}

export function mapHomepageEditorialBlocksData(
  raw?: StrapiHomepageEditorialBlocksEntity | null,
): HomepageEditorialBlocksData {
  if (!raw) return {};

  const sunnyPromiseSection = mapSunnyPromise(raw.sunnyPromiseSection ?? raw.sunnyPromise);
  const bespokeForYouSection = mapTextSectionToBespoke(
    raw.bespokeForYouSection ?? raw.bespokeForYou,
  );
  const diamondsForEveryoneSection = mapTextSectionToDiamondsForEveryone(
    raw.diamondsForEveryoneSection ?? raw.diamondsForEveryone,
  );
  const diamondSourcingSection = mapDiamondSourcing(raw.diamondSourcingSection);
  const craftsmanshipSection = mapCraftsmanshipSection(raw.craftsmanshipSection);
  const occasionSection = mapOccasionSection(raw.occasionSection);
  const showroomSection = mapShowroomSection(raw.showroomSection ?? raw.showroom);
  const craftingBrillianceSection = mapCraftingBrillianceSection(raw.craftingBrillianceSection);

  return {
    sunnyPromiseSection,
    bespokeForYouSection,
    diamondsForEveryoneSection,
    diamondSourcingSection,
    craftsmanshipSection,
    occasionSection,
    showroomSection,
    craftingBrillianceSection,
    bespokeForYouCards: Array.isArray(raw.bespokeForYouCards)
      ? (raw.bespokeForYouCards as HomepageEditorialBlocksData["bespokeForYouCards"])
      : null,
    showroomTeaser: raw.showroomTeaser as HomepageEditorialBlocksData["showroomTeaser"],
    homepage: {
      craftsmanshipSection,
    },
  };
}

export const EMPTY_HOMEPAGE_SHELL: NormalizedHomepageShell = {};
export const EMPTY_HOMEPAGE_EDITORIAL: HomepageEditorialBlocksData = {};
export const EMPTY_HOMEPAGE_SHOPPING: HomepageShoppingBlocksData = {};
