import { aboutHandcraftedContent } from "@/features/about/data/content";
import { extractStrapiImage, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import type {
  NormalizedAboutCraft,
  NormalizedAboutHero,
  NormalizedAboutLegacy,
  NormalizedAboutPage,
  NormalizedAboutSeo,
  NormalizedAboutTeam,
  NormalizedAboutTimeline,
  NormalizedBrandTagline,
  NormalizedCraftCard,
  NormalizedBrillianceSection,
  NormalizedLegacyGalleryItem,
  NormalizedResponsiveImage,
  NormalizedTeamMember,
  NormalizedTimelineMilestone,
  NormalizedTrustBadge,
  StrapiAboutCraftMosaicSection,
  StrapiAboutCraftSection,
  StrapiAboutFeatureSlide,
  StrapiAboutHero,
  StrapiAboutLegacyImageBlock,
  StrapiAboutPageEntity,
  StrapiAboutResponsiveImage,
  StrapiAboutSeo,
  StrapiAboutTeamMember,
  StrapiAboutTimelineMilestone,
  StrapiAboutTrustBadge,
} from "./about-page.types";
import { EMPTY_ABOUT_PAGE } from "./about-page.types";

const cleanText = (value?: string | null): string | undefined => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

const isUsableDescription = (value?: string): boolean =>
  Boolean(value && value.toLowerCase() !== "to be added");

const coerceComponentArray = <T>(value: unknown): T[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value as T[];

  if (typeof value === "object" && value !== null && "data" in value) {
    const data = (value as { data?: unknown }).data;
    if (Array.isArray(data)) return data as T[];
    if (data && typeof data === "object") return [data as T];
  }

  return [value as T];
};

const mapResponsiveImage = (
  media?: StrapiAboutResponsiveImage | null,
): NormalizedResponsiveImage | null => {
  if (!media) return null;

  const desktopFile = extractStrapiImage(media.desktopImage);
  const mobileFile = extractStrapiImage(media.mobileImage);

  const desktopUrl =
    resolveCmsMediaUrl(media.desktopImage) ??
    resolveCmsMediaUrl(media.mobileImage);
  const mobileUrl =
    resolveCmsMediaUrl(media.mobileImage) ??
    resolveCmsMediaUrl(media.desktopImage);

  if (!desktopUrl && !mobileUrl) return null;

  const resolvedDesktop = desktopUrl ?? mobileUrl!;
  const resolvedMobile = mobileUrl ?? desktopUrl!;

  const alt =
    cleanText(media.altText) ??
    cleanText(media.caption) ??
    cleanText(desktopFile?.alternativeText) ??
    cleanText(mobileFile?.alternativeText) ??
    "";

  return {
    desktopUrl: resolvedDesktop,
    mobileUrl: resolvedMobile,
    alt,
    width: desktopFile?.width ?? mobileFile?.width ?? undefined,
    height: desktopFile?.height ?? mobileFile?.height ?? undefined,
  };
};

const mapSeo = (seo?: StrapiAboutSeo | null): NormalizedAboutSeo | null => {
  const metaTitle = cleanText(seo?.metaTitle);
  const metaDescription = cleanText(seo?.metaDescription);
  const canonicalPath = cleanText(seo?.canonicalUrl) ?? "/about";

  if (!metaTitle && !metaDescription) return null;

  return {
    metaTitle: metaTitle ?? "Our Story | Sunny Diamonds",
    metaDescription:
      metaDescription ??
      "Learn about Sunny Diamonds' legacy of crafting premium diamond jewellery.",
    canonicalPath,
    metaKeywords: cleanText(seo?.metaKeywords ?? undefined),
  };
};

const mapHero = (hero?: StrapiAboutHero | null): NormalizedAboutHero | null => {
  if (!hero || hero.isActive === false) return null;

  const title = cleanText(hero.title) ?? cleanText(hero.eyebrow);
  const image = mapResponsiveImage(hero.image);

  if (!title || !image) return null;

  return { title, image };
};

const mapFeatureSlide = (
  slide?: StrapiAboutFeatureSlide | null,
): NormalizedBrillianceSection | null => {
  if (!slide) return null;

  const heading = cleanText(slide.heading);
  const description =
    cleanText(slide.body) ?? cleanText(slide.description);
  const image = mapResponsiveImage(slide.image);

  if (!heading || !description || !image) return null;
  if (!isUsableDescription(description)) return null;

  return { heading, description, image };
};

const mapBrillianceSection = (
  section: StrapiAboutPageEntity["brillianceSection"],
): NormalizedBrillianceSection | null => {
  if (!section) return null;

  const slides = coerceComponentArray<StrapiAboutFeatureSlide>(section.featureSlide);
  for (const slide of slides) {
    const mapped = mapFeatureSlide(slide);
    if (mapped) return mapped;
  }

  const pinnedImage = mapResponsiveImage(section.pinnedImage);
  const heading = cleanText(section.heading);
  const description = cleanText(section.description);
  const image = mapResponsiveImage(section.image) ?? pinnedImage ?? undefined;

  if (!heading || !description || !image) return null;

  return { heading, description, image };
};

const mapLegacyBlock = (
  block?: StrapiAboutLegacyImageBlock | null,
): NormalizedLegacyGalleryItem | null => {
  if (!block) return null;

  const image = mapResponsiveImage(block.image);
  if (!image) return null;

  const caption =
    cleanText(block.image?.caption) ??
    cleanText(block.image?.altText) ??
    image.alt;

  return {
    description: cleanText(block.description),
    caption,
    image: { ...image, alt: caption || image.alt },
  };
};

const mapLegacy = (
  section: StrapiAboutPageEntity["legacySection"],
): NormalizedAboutLegacy | null => {
  if (!section) return null;

  const title = cleanText(section.heading);
  if (!title) return null;

  const gallery = (section.legacyImageBlock ?? [])
    .map(mapLegacyBlock)
    .filter((item): item is NormalizedLegacyGalleryItem => item !== null);

  if (gallery.length === 0) return null;

  const story =
    gallery.map((item) => item.description).find(isUsableDescription) ??
    gallery[0]?.description;

  return { title, story, gallery };
};

const mapTeamMember = (
  member?: StrapiAboutTeamMember | null,
): NormalizedTeamMember | null => {
  if (!member) return null;

  const name = cleanText(member.name);
  const role = cleanText(member.role);
  const image = mapResponsiveImage(member.image);

  if (!name || !image) return null;

  return {
    name,
    role: role && isUsableDescription(role) ? role : "",
    image,
  };
};

const mapTeam = (
  section: StrapiAboutPageEntity["teamSection"],
): NormalizedAboutTeam | null => {
  if (!section) return null;

  const title = cleanText(section.heading);
  if (!title) return null;

  const members = (section.teamMember ?? [])
    .map(mapTeamMember)
    .filter((member): member is NormalizedTeamMember => member !== null);

  if (members.length === 0) return null;

  return {
    title,
    description: cleanText(section.subheading),
    members,
  };
};

const mapCraftCards = (
  mosaic?: StrapiAboutCraftMosaicSection | null,
): NormalizedCraftCard[] => {
  const layoutCards = aboutHandcraftedContent.cards;
  const cards: NormalizedCraftCard[] = [];

  (mosaic?.tile ?? []).forEach((tile, index) => {
    const title = cleanText(tile.title);
    if (!title) return;

    const layout = layoutCards[index];
    if (!layout) return;

    cards.push({
      title,
      position: { left: layout.position.left, top: layout.position.top },
      gap: layout.gap,
      layoutIndex: index,
    });
  });

  return cards;
};

const mapCraft = (
  craftSection?: StrapiAboutCraftSection | null,
  mosaicSection?: StrapiAboutCraftMosaicSection | null,
): NormalizedAboutCraft | null => {
  if (!craftSection) return null;

  const title = cleanText(craftSection.heading);
  if (!title) return null;

  const videoUrl = resolveCmsMediaUrl(craftSection.videoUrl?.heroVideo);
  const centerImage = mapResponsiveImage(craftSection.backgroundImage);
  const posterUrl =
    centerImage?.desktopUrl ??
    resolveCmsMediaUrl(craftSection.backgroundImage?.desktopImage);

  const cards = mapCraftCards(mosaicSection);

  if (!videoUrl && !centerImage && cards.length === 0) return null;

  return {
    title,
    videoUrl,
    posterUrl,
    overlayOpacity:
      typeof craftSection.overlayOpacity === "number"
        ? craftSection.overlayOpacity
        : 0.3,
    centerImage: centerImage ?? undefined,
    cards,
  };
};

const mapBrandTagline = (
  section: StrapiAboutPageEntity["brandTaglineSection"],
): NormalizedBrandTagline | null => {
  if (!section) return null;

  const quote = cleanText(section.tagline);
  if (!quote) return null;

  const iconUrl =
    resolveCmsMediaUrl(section.icon?.desktopImage) ??
    resolveCmsMediaUrl(section.icon?.mobileImage);

  return {
    quote,
    iconUrl,
  };
};

const mapTrustBadge = (
  badge?: StrapiAboutTrustBadge | null,
): NormalizedTrustBadge | null => {
  if (!badge) return null;

  const label = cleanText(badge.label);
  const icon = mapResponsiveImage(badge.icon);

  if (!label || !icon) return null;

  return {
    label,
    icon: { ...icon, alt: icon.alt || label },
  };
};

const mapTrustBadges = (
  section: StrapiAboutPageEntity["trustBadgesSection"],
): NormalizedTrustBadge[] | null => {
  if (!section) return null;

  const badges = (section.trustBadge ?? [])
    .map(mapTrustBadge)
    .filter((badge): badge is NormalizedTrustBadge => badge !== null);

  return badges.length > 0 ? badges : null;
};

const mapTimelineMilestone = (
  item?: StrapiAboutTimelineMilestone | null,
): NormalizedTimelineMilestone | null => {
  if (!item) return null;

  const yearValue = item.year;
  const year =
    yearValue != null && String(yearValue).trim()
      ? String(yearValue).trim()
      : undefined;

  const title = cleanText(item.title) ?? cleanText(item.heading);
  const description =
    cleanText(item.body) ??
    cleanText(item.description) ??
    cleanText(item.content);

  if (!year || !title || !description) return null;
  if (!isUsableDescription(description)) return null;

  return { year, title, description };
};

const sortTimelineMilestones = (
  milestones: NormalizedTimelineMilestone[],
): NormalizedTimelineMilestone[] =>
  [...milestones].sort((a, b) => {
    const yearA = Number.parseInt(a.year, 10);
    const yearB = Number.parseInt(b.year, 10);

    if (Number.isFinite(yearA) && Number.isFinite(yearB) && yearA !== yearB) {
      return yearA - yearB;
    }

    return a.year.localeCompare(b.year);
  });

const mapTimeline = (
  section: StrapiAboutPageEntity["timelineSection"],
): NormalizedAboutTimeline | null => {
  if (!section) return null;

  const backgroundImage = mapResponsiveImage(section.backgroundImage);
  if (!backgroundImage) return null;

  const rawMilestones =
    section.timelineMilestone ?? section.milestones ?? [];

  const milestones = sortTimelineMilestones(
    rawMilestones
      .map(mapTimelineMilestone)
      .filter((item): item is NormalizedTimelineMilestone => item !== null),
  );

  if (milestones.length === 0) return null;

  const years = milestones.map((milestone) => milestone.year);
  const preferredDefault = years.includes("2008") ? "2008" : years[0];

  return {
    backgroundImage,
    milestones,
    years,
    defaultYear: preferredDefault,
  };
};

export function mapAboutPageData(
  raw?: StrapiAboutPageEntity | null,
): NormalizedAboutPage {
  if (!raw) {
    return { ...EMPTY_ABOUT_PAGE };
  }

  return {
    seo: mapSeo(raw.seo),
    hero: mapHero(raw.hero),
    brillianceSection: mapBrillianceSection(raw.brillianceSection),
    legacy: mapLegacy(raw.legacySection),
    team: mapTeam(raw.teamSection),
    craft: mapCraft(raw.craftSection, raw.craftMosaicSection),
    brandTagline: mapBrandTagline(raw.brandTaglineSection),
    trustBadges: mapTrustBadges(raw.trustBadgesSection),
    timeline: mapTimeline(raw.timelineSection),
  };
}
