import { aboutHandcraftedTileLayout } from "@/features/about/data/content";
import { WORLD_OF_SUNNY_PATH } from "@/shared/utils/navigation";
import { extractStrapiImage, resolveCmsAltText, resolveCmsCaption, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
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
  StrapiAboutCraftMosaicTile,
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

/** CMS sections render only when isActive is explicitly true. */
const isAboutSectionActive = (isActive?: boolean | null): boolean =>
  isActive === true;

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

  const desktopAlt = resolveCmsAltText(media.desktopImage) ?? "";
  const mobileAlt = resolveCmsAltText(media.mobileImage) ?? "";

  return {
    desktopUrl: desktopUrl ?? mobileUrl!,
    mobileUrl: mobileUrl ?? desktopUrl!,
    alt: desktopAlt,
    width: desktopFile?.width ?? mobileFile?.width ?? undefined,
    height: desktopFile?.height ?? mobileFile?.height ?? undefined,
  };
};

const mapSeo = (seo?: StrapiAboutSeo | null): NormalizedAboutSeo | null => {
  const metaTitle = cleanText(seo?.metaTitle);
  const metaDescription = cleanText(seo?.metaDescription);
  const rawCanonical = cleanText(seo?.canonicalUrl);
  const canonicalPath =
    !rawCanonical || rawCanonical.replace(/\/$/, "") === "/about"
      ? WORLD_OF_SUNNY_PATH
      : rawCanonical;

  if (!metaTitle && !metaDescription) return null;

  return {
    metaTitle: metaTitle ?? "",
    metaDescription: metaDescription ?? "",
    canonicalPath,
    metaKeywords: cleanText(seo?.metaKeywords ?? undefined),
  };
};

const mapHero = (hero?: StrapiAboutHero | null): NormalizedAboutHero | null => {
  if (!hero || !isAboutSectionActive(hero.isActive)) return null;

  const title = cleanText(hero.title);
  const image = mapResponsiveImage(hero.image);

  if (!title || !image) return null;

  return { title, image };
};

const mapFeatureSlide = (
  slide?: StrapiAboutFeatureSlide | null,
): NormalizedBrillianceSection | null => {
  if (!slide) return null;

  const heading = cleanText(slide.heading);
  const body = cleanText(slide.body);
  const image = mapResponsiveImage(slide.image);

  if (!heading || !body || !image) return null;
  if (!isUsableDescription(body)) return null;

  return { heading, body, image };
};

const mapBrillianceSection = (
  section: StrapiAboutPageEntity["brillianceSection"],
): NormalizedBrillianceSection | null => {
  if (!section || !isAboutSectionActive(section.isActive)) return null;

  const slides = coerceComponentArray<StrapiAboutFeatureSlide>(section.featureSlide);
  for (const slide of slides) {
    const mapped = mapFeatureSlide(slide);
    if (mapped) return mapped;
  }

  return null;
};

const mapLegacyBlock = (
  block?: StrapiAboutLegacyImageBlock | null,
): NormalizedLegacyGalleryItem | null => {
  if (!block) return null;

  const description = cleanText(block.description);
  const image = mapResponsiveImage(block.image);
  const caption =
    resolveCmsCaption(block.image?.desktopImage) ??
    resolveCmsCaption(block.image?.mobileImage) ??
    cleanText(block.image?.caption);

  if (!description && !image) return null;

  return {
    description,
    caption,
    image: image ?? null,
  };
};

const mapLegacy = (
  section: StrapiAboutPageEntity["legacySection"],
): NormalizedAboutLegacy | null => {
  if (!section || !isAboutSectionActive(section.isActive)) return null;

  const title = cleanText(section.heading);
  if (!title) return null;

  const gallery = (section.legacyImageBlock ?? [])
    .map(mapLegacyBlock)
    .filter((item): item is NormalizedLegacyGalleryItem => item !== null);

  if (gallery.length === 0) return null;

  const storyDescription = cleanText(gallery[0]?.description);
  const story = isUsableDescription(storyDescription) ? storyDescription : undefined;

  return { title, story, gallery };
};

const mapTeamMember = (
  member?: StrapiAboutTeamMember | null,
): NormalizedTeamMember | null => {
  if (!member) return null;

  const name = cleanText(member.name);
  const role = cleanText(member.role);
  const image = mapResponsiveImage(member.image);

  if (!name) return null;

  return {
    name,
    role: role && isUsableDescription(role) ? role : "",
    image: image ?? null,
  };
};

const mapTeam = (
  section: StrapiAboutPageEntity["teamSection"],
): NormalizedAboutTeam | null => {
  if (!section || !isAboutSectionActive(section.isActive)) return null;

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

const normalizeCraftTileType = (raw?: string | null): "textCard" | "image" => {
  const normalized = (raw ?? "").trim().toLowerCase().replace(/[-_\s]/g, "");
  return normalized === "textcard" ? "textCard" : "image";
};

const mapCraftCards = (
  mosaic?: StrapiAboutCraftMosaicSection | null,
): NormalizedCraftCard[] => {
  const layoutCards = aboutHandcraftedTileLayout.cards;
  let textCardCounter = 0;

  return coerceComponentArray<StrapiAboutCraftMosaicTile>(mosaic?.tile)
    .map((tile, index) => {
      const type = normalizeCraftTileType(tile.type);
      const title = cleanText(tile.title);
      const image = mapResponsiveImage(tile.image);
      const imageUrl = image?.desktopUrl ?? image?.mobileUrl;
      const mobileImageUrl = image?.mobileUrl ?? image?.desktopUrl;

      const layout = layoutCards[textCardCounter];
      const layoutIndex =
        type === "textCard" ? textCardCounter : index + layoutCards.length;
      const card: NormalizedCraftCard = {
        type,
        title: title ?? undefined,
        imageUrl: imageUrl ?? undefined,
        mobileImageUrl: mobileImageUrl ?? undefined,
        imageAlt: image?.alt,
        position:
          type === "textCard" && layout
            ? { left: layout.position.left, top: layout.position.top }
            : undefined,
        gap: layout?.gap ?? 0,
        layoutIndex,
        tileIndex: index,
      };

      if (type === "textCard") {
        textCardCounter += 1;
      }

      return card;
    })
    .filter((card) => {
      if (card.type === "textCard") {
        return Boolean(card.title);
      }

      return card.type === "image";
    });
};

const mapCraft = (
  craftSection?: StrapiAboutCraftSection | null,
  mosaicSection?: StrapiAboutCraftMosaicSection | null,
): NormalizedAboutCraft | null => {
  if (!craftSection || !isAboutSectionActive(craftSection.isActive)) return null;

  const title = cleanText(craftSection.heading);
  if (!title) return null;

  const videoUrl = resolveCmsMediaUrl(craftSection.videoUrl?.heroVideo);
  const centerImage = mapResponsiveImage(craftSection.backgroundImage);
  const posterUrl =
    centerImage?.desktopUrl ??
    resolveCmsMediaUrl(craftSection.backgroundImage?.desktopImage);

  const cards = isAboutSectionActive(mosaicSection?.isActive)
    ? mapCraftCards(mosaicSection)
    : [];

  return {
    title,
    videoUrl,
    posterUrl,
    posterAlt: centerImage?.alt ?? "",
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
  if (!section || !isAboutSectionActive(section.isActive)) return null;

  const quote = cleanText(section.tagline);
  if (!quote) return null;

  const iconUrl = resolveCmsMediaUrl(section.icon?.desktopImage);

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
    icon,
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

  const title = cleanText(item.heading);
  const description = cleanText(item.body);

  if (!year || !title || !description) return null;
  if (!isUsableDescription(description)) return null;

  return { year, title, description };
};

const mapTimeline = (
  section: StrapiAboutPageEntity["timelineSection"],
): NormalizedAboutTimeline | null => {
  if (!section || !isAboutSectionActive(section.isActive)) return null;

  const backgroundImage = mapResponsiveImage(section.backgroundImage);

  const milestones = (section.timelineMilestone ?? [])
    .map(mapTimelineMilestone)
    .filter((item): item is NormalizedTimelineMilestone => item !== null);

  if (milestones.length === 0) return null;

  const years = milestones.map((milestone) => milestone.year);

  return {
    backgroundImage: backgroundImage ?? null,
    milestones,
    years,
    defaultYear: years[0],
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
