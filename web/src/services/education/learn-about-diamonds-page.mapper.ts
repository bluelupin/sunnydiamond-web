import {
  buildCaratSliderSpecForWeights,
  buildSliderSpecForOptionCount,
  educationSliderSpecs,
  type EducationFourCsPanelContent,
  type EducationSliderOption,
} from "@/features/education/data/content";
import { resolveCmsAltText, resolveCmsMediaUrl, resolveCmsMediaUrls } from "@/shared/utils/strapiMedia";
import type {
  NormalizedEducationCertificateSection,
  NormalizedEducationCertification,
  NormalizedEducationCtaBanner,
  NormalizedEducationFaqItem,
  NormalizedEducationFaqSection,
  NormalizedEducationFourCsIntro,
  NormalizedEducationFourCsPanel,
  NormalizedEducationFourCsSection,
  NormalizedEducationHero,
  NormalizedEducationLearnAnatomyDetail,
  NormalizedEducationLearnCareTip,
  NormalizedEducationLearnMoreSection,
  NormalizedEducationLearnTab,
  NormalizedEducationSeo,
  NormalizedLearnAboutDiamondsPage,
  StrapiEducationCertificateSection,
  StrapiEducationCertificationLab,
  StrapiEducationDiscoverSection,
  StrapiEducationSeo,
  StrapiEducationFaqItem,
  StrapiEducationFourCsInfoPanel,
  StrapiEducationFourCsIntro,
  StrapiEducationFourCsSection,
  StrapiEducationFourCsVisualPanel,
  StrapiEducationGradeStop,
  StrapiEducationHero,
  StrapiEducationLearnCarouselImage,
  StrapiEducationLearnFeatureGroup,
  StrapiEducationLearnFeatureItem,
  StrapiEducationLearnMoreSection,
  StrapiEducationLearnTab,
  StrapiEducationResponsiveImage,
  StrapiLearnAboutDiamondsPageEntity,
} from "./learn-about-diamonds-page.types";
import { EMPTY_LEARN_ABOUT_DIAMONDS_PAGE } from "./learn-about-diamonds-page.types";

const PANEL_ID_BY_LABEL: Record<string, EducationFourCsPanelContent["id"]> = {
  CLARITY: "clarity",
  CUT: "cut",
  COLOUR: "colour",
  COLOR: "colour",
  CARAT: "carat",
};

const DEFAULT_LOGO_CLASS = "size-[79px]";
const DEFAULT_MOBILE_LOGO_CLASS = "size-[59.286px]";

const cleanText = (value?: string | null): string | undefined => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

/** CMS sections may use `isActive` or legacy `showField`; default visible when unset. */
const resolveSectionActive = (
  isActive?: boolean | null,
  showField?: boolean | null,
): boolean => {
  if (typeof isActive === "boolean") return isActive;
  if (typeof showField === "boolean") return showField;
  return true;
};

const mapResponsiveImageUrls = (image?: StrapiEducationResponsiveImage | null) => {
  const desktopUrl = resolveCmsMediaUrl(image?.desktopImage) ?? "";
  const mobileUrl = resolveCmsMediaUrl(image?.mobileImage) ?? "";

  return {
    desktopUrl,
    mobileUrl,
    alt: resolveCmsAltText(image?.desktopImage) ?? "",
    hasImage: Boolean(desktopUrl || mobileUrl),
  };
};

const mapSeo = (seo?: StrapiEducationSeo | null): NormalizedEducationSeo | null => {
  if (!seo || !resolveSectionActive(seo.isActive, seo.showField)) return null;

  const metaTitle = cleanText(seo.metaTitle);
  const metaDescription = cleanText(seo.metaDescription);
  const canonicalPath = cleanText(seo.canonicalUrl);
  if (!metaTitle && !metaDescription) return null;

  const ogImageUrl = resolveCmsMediaUrl(seo.ogImage);
  const normalizedCanonicalPath = canonicalPath
    ? canonicalPath.startsWith("/")
      ? canonicalPath
      : `/${canonicalPath}`
    : "";

  return {
    metaTitle: metaTitle ?? "",
    metaDescription: metaDescription ?? "",
    canonicalPath: normalizedCanonicalPath,
    metaKeywords: cleanText(seo.metaKeywords),
    ...(ogImageUrl ? { ogImageUrl } : {}),
  };
};

const mapHero = (hero?: StrapiEducationHero | null): NormalizedEducationHero | null => {
  if (!hero || !resolveSectionActive(hero.isActive, hero.showField)) return null;

  const title = cleanText(hero.title);
  if (!title) return null;

  const image = mapResponsiveImageUrls(hero.image);
  if (!image.hasImage) return null;

  const videoUrl = resolveCmsMediaUrl(hero.heroVideo?.heroVideo);

  return {
    title,
    eyebrow: cleanText(hero.eyebrow),
    subtitle: cleanText(hero.subtitle),
    videoUrl,
    posterDesktopUrl: image.desktopUrl,
    posterMobileUrl: image.mobileUrl,
    posterAlt: image.alt,
  };
};

const mapFaqItems = (items?: StrapiEducationFaqItem[] | null): NormalizedEducationFaqItem[] =>
  items
    ?.map((item, index) => {
      if (!resolveSectionActive(item.isActive, item.showField)) return null;

      const question = cleanText(item.question);
      const answer = cleanText(item.answer);
      if (!question || !answer) return null;

      return {
        id: item.id != null ? String(item.id) : `faq-${index}`,
        question,
        answer,
      };
    })
    .filter((item): item is NormalizedEducationFaqItem => item != null) ?? [];

const mapFaqSection = (
  faqSection?: StrapiLearnAboutDiamondsPageEntity["faqSection"],
): NormalizedEducationFaqSection | null => {
  if (!faqSection || !resolveSectionActive(faqSection.isActive, faqSection.showField)) {
    return null;
  }

  const heading = cleanText(faqSection.sectionHeading);
  const items = mapFaqItems(faqSection.faqItems);
  if (!heading || !items.length) return null;

  return {
    heading,
    items,
  };
};

const mapDiscoverSteps = (
  steps?: StrapiEducationDiscoverSection["steps"],
): string[] =>
  (steps ?? [])
    .filter((step) => resolveSectionActive(step.isActive, step.showField))
    .map((step) => cleanText(step.title))
    .filter((title): title is string => Boolean(title));

const mapDiscoverSection = (
  section?: StrapiEducationDiscoverSection | null,
): NormalizedEducationCtaBanner | null => {
  if (!section || !resolveSectionActive(section.isActive, section.showField)) return null;

  const heading = cleanText(section.heading);
  const subheading = cleanText(section.subheading);
  const ctaLabel = cleanText(section.ctaButtonLabel);
  const ctaHref = cleanText(section.ctaButtonUrl);
  const steps = mapDiscoverSteps(section.steps);
  const background = mapResponsiveImageUrls(section.backgroundImage);

  if (!heading || !subheading) return null;

  return {
    heading,
    subheading,
    ...(ctaLabel && ctaHref ? { ctaLabel, ctaHref } : {}),
    steps,
    imageDesktopUrl: background.desktopUrl,
    imageMobileUrl: background.mobileUrl,
    imageAlt: background.alt,
    hasCmsBackgroundImage: background.hasImage,
  };
};

const normalizeGradeToken = (value: string) =>
  value.trim().toUpperCase().replace(/\s+/g, "");

const gradesMatch = (left?: string | null, right?: string | null) => {
  const a = cleanText(left);
  const b = cleanText(right);
  if (!a || !b) return false;

  const normalizedA = normalizeGradeToken(a);
  const normalizedB = normalizeGradeToken(b);
  return (
    normalizedA === normalizedB ||
    normalizedA.startsWith(normalizedB) ||
    normalizedB.startsWith(normalizedA)
  );
};

const resolvePanelId = (
  sectionLabel?: string | null,
): EducationFourCsPanelContent["id"] | null => {
  const labelKey = cleanText(sectionLabel)?.toUpperCase();
  if (!labelKey) return null;

  return PANEL_ID_BY_LABEL[labelKey] ?? null;
};

const resolvePanelLayout = (index: number) => ({
  mediaPosition: (index % 2 === 0 ? "left" : "right") as "left" | "right",
  background: "chalk" as const,
});

const parseCaratWeight = (gradeCode: string): number | undefined => {
  const match = gradeCode.match(/([\d.]+)/);
  if (!match) return undefined;

  const weight = Number.parseFloat(match[1]!);
  return Number.isFinite(weight) ? weight : undefined;
};

const mapColourSublabel = (longLabel?: string) => {
  const label = cleanText(longLabel);
  if (!label) return undefined;

  const words = label.split(/\s+/);
  if (words.length === 2) {
    return [words[0]!, words[1]!] as [string, string];
  }

  return label;
};

const mapGradeStopToOption = (
  stop: StrapiEducationGradeStop,
  panelId: EducationFourCsPanelContent["id"],
  activeGradeCode?: string,
): EducationSliderOption | null => {
  const label = cleanText(stop.gradeCode);
  if (!label) return null;

  const longLabel = cleanText(stop.gradeLongLabel);
  const highlight = gradesMatch(label, activeGradeCode);
  const labelParts = label.split(/\s+/);

  const option: EducationSliderOption = {
    label,
    highlight,
  };

  if (panelId === "colour") {
    option.sublabel = mapColourSublabel(longLabel);
  }

  if (panelId === "carat") {
    option.caratWeight = parseCaratWeight(label);
  }

  const gradeImageUrls = [
    ...resolveCmsMediaUrls(stop.gradeImage?.desktopImage),
    // Only use mobile files when desktop has none (avoid duplicating the same pair).
  ];
  const mobileOnlyUrls =
    gradeImageUrls.length === 0
      ? resolveCmsMediaUrls(stop.gradeImage?.mobileImage)
      : [];
  const mediaUrls = gradeImageUrls.length > 0 ? gradeImageUrls : mobileOnlyUrls;
  const gradeAlt = resolveCmsAltText(stop.gradeImage?.desktopImage) ?? "";

  if (mediaUrls[0]) {
    option.image = mediaUrls[0];
    option.imageAlt = gradeAlt;
  }

  // Cut: CMS often uploads two diamonds per grade for the Figma dual compare layout.
  if (panelId === "cut" && mediaUrls.length >= 2 && mediaUrls[0] && mediaUrls[1]) {
    option.dualImages = [mediaUrls[0], mediaUrls[1]];
    option.dualImageAlts = [gradeAlt, gradeAlt];
  }

  if (labelParts.length === 2) {
    option.mobileLabelLines = [labelParts[0]!, labelParts[1]!];
  }

  return option;
};

const resolveDefaultIndex = (
  options: EducationSliderOption[],
  activeGradeCode?: string,
  fallbackIndex = 0,
) => {
  if (!activeGradeCode) return fallbackIndex;

  const matchedIndex = options.findIndex((option) =>
    gradesMatch(option.label, activeGradeCode),
  );

  return matchedIndex >= 0 ? matchedIndex : fallbackIndex;
};

const resolveSliderSpec = (
  panelId: EducationFourCsPanelContent["id"],
  options: EducationSliderOption[],
): NormalizedEducationFourCsPanel["sliderSpec"] => {
  const baseSpec = educationSliderSpecs[panelId];
  if (!baseSpec) return undefined;

  if (panelId === "carat") {
    const weights = options
      .map((option) => option.caratWeight)
      .filter((weight): weight is number => weight != null);

    if (weights.length === options.length && weights.length > 0) {
      return buildCaratSliderSpecForWeights(weights);
    }
  }

  return buildSliderSpecForOptionCount(baseSpec, options.length);
};

const mapFourCsPanel = (
  info: StrapiEducationFourCsInfoPanel,
  visual: StrapiEducationFourCsVisualPanel | null,
  index: number,
): NormalizedEducationFourCsPanel | null => {
  const panelId = resolvePanelId(info.sectionLabel);
  if (!panelId) return null;

  const panelLayout = resolvePanelLayout(index);

  const title = cleanText(info.sectionLabel);
  const description = cleanText(info.description);
  const code = cleanText(info.displayTag);
  if (!title || !description || !code) return null;

  const activeGradeCode = cleanText(info.activeGradeCode);
  const visualImage = mapResponsiveImageUrls(visual?.visualImage);
  const visualImageUrl = visualImage.desktopUrl || visualImage.mobileUrl || undefined;

  const mappedOptions =
    (visual?.gradeStops ?? [])
      .map((stop) => mapGradeStopToOption(stop, panelId, activeGradeCode))
      .filter((option): option is EducationSliderOption => option != null);

  // No static slider/copy fallbacks — require CMS gradeStops.
  if (!mappedOptions.length) return null;

  const options = mappedOptions;
  const defaultIndex = resolveDefaultIndex(options, activeGradeCode, 0);

  const slider = {
    defaultIndex,
    options,
    ...(visualImageUrl && panelId !== "cut" && panelId !== "carat"
      ? { image: visualImageUrl, imageAlt: visualImage.alt }
      : {}),
  };

  return {
    id: panelId,
    code,
    title,
    description,
    footnote: cleanText(info.brandNote) ?? "",
    mediaPosition: panelLayout.mediaPosition,
    background: panelLayout.background,
    slider,
    sliderSpec: resolveSliderSpec(panelId, options),
    ...(visualImage.alt ? { panelTextureAlt: visualImage.alt } : {}),
    ...(panelId === "carat" && visualImage.desktopUrl
      ? {
          caratHandImage: {
            desktopUrl: visualImage.desktopUrl,
            mobileUrl: visualImage.mobileUrl,
            alt: visualImage.alt,
          },
        }
      : {}),
  };
};

const formatPillarLabel = (label?: string | null) => {
  const cleaned = cleanText(label);
  if (!cleaned) return undefined;

  return cleaned
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const mapFourCsIntro = (
  intro?: StrapiEducationFourCsIntro | null,
): NormalizedEducationFourCsIntro | null => {
  if (!intro || !resolveSectionActive(intro.isActive, intro.showField)) return null;

  const image = mapResponsiveImageUrls(intro.decorativeImage);
  const heading = cleanText(intro.heading);
  const description = cleanText(intro.body);
  if (!heading || !description || !image.hasImage) return null;

  const mobileHeading = cleanText(intro.mobileHeading);

  const pillars =
    intro.fourCsTags
      ?.filter((tag) => resolveSectionActive(tag.isActive, tag.showField))
      .map((tag) => formatPillarLabel(tag.label))
      .filter((label): label is string => Boolean(label)) ?? [];

  if (!pillars.length) return null;

  return {
    desktopTitle: heading,
    ...(mobileHeading ? { mobileTitle: mobileHeading } : {}),
    description,
    pillars,
    imageDesktopUrl: image.desktopUrl,
    imageMobileUrl: image.mobileUrl,
    imageAlt: image.alt,
  };
};

const mapFourCsSection = (
  section?: StrapiEducationFourCsSection | null,
): NormalizedEducationFourCsSection | null => {
  if (!section || !resolveSectionActive(section.isActive, section.showField)) return null;

  // Preserve Strapi component order (drag-and-drop). Pair info[i] with visual[i].
  const infoPanels = section?.cInfoPanel ?? [];
  if (!infoPanels.length) return null;

  const visualPanels = section?.cVisualPanel ?? [];
  const panels = infoPanels
    .map((info, index) => mapFourCsPanel(info, visualPanels[index] ?? null, index))
    .filter((panel): panel is NormalizedEducationFourCsPanel => panel != null);

  return panels.length ? { panels } : null;
};

const mapCertificationLab = (
  lab: StrapiEducationCertificationLab,
  index: number,
): NormalizedEducationCertification | null => {
  const id = lab.id != null ? String(lab.id) : `lab-${index}`;
  const label = cleanText(lab.labDescription);
  if (!label) return null;

  const logoUrl = resolveCmsMediaUrl(lab.labLogo?.desktopImage);
  if (!logoUrl) return null;

  const logoAlt = resolveCmsAltText(lab.labLogo?.desktopImage) ?? "";

  return {
    id,
    logoUrl,
    logoAlt,
    label,
    logoClassName: DEFAULT_LOGO_CLASS,
    mobileLogoClassName: DEFAULT_MOBILE_LOGO_CLASS,
    imageClassName: "size-full object-contain",
    usesCmsLogo: true,
  };
};

/**
 * CMS often stores Why + How copy in `sectionDescription` as:
 *   Why Certifications Matter?\n<body>\n\nHow to check authenticity?\n<body>
 * Prefer dedicated why/how fields when present.
 */
const parseCertificateSectionDescription = (raw?: string | null) => {
  const text = cleanText(raw);
  if (!text) return null;

  const mapBlock = (block: string) => {
    const lines = block
      .split(/\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length === 0) return { title: "", description: "" };
    if (lines.length === 1) return { title: "", description: lines[0]! };
    return {
      title: lines[0]!,
      description: lines.slice(1).join(" "),
    };
  };

  const blocks = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length >= 2) {
    const why = mapBlock(blocks[0]!);
    const how = mapBlock(blocks[1]!);
    return {
      whyTitle: why.title,
      whyDescription: why.description,
      howTitle: how.title,
      howDescription: how.description,
    };
  }

  const howSplit = text.split(/\n(?=How to check authenticity)/i);
  if (howSplit.length >= 2) {
    const why = mapBlock(howSplit[0]!);
    const how = mapBlock(howSplit[1]!);
    return {
      whyTitle: why.title,
      whyDescription: why.description,
      howTitle: how.title,
      howDescription: how.description,
    };
  }

  return {
    whyTitle: "",
    whyDescription: text,
    howTitle: "",
    howDescription: "",
  };
};

const mapCertificateSection = (
  section?: StrapiEducationCertificateSection | null,
): NormalizedEducationCertificateSection | null => {
  if (!section || !resolveSectionActive(section.isActive, section.showField)) return null;

  const certifications =
    section.certificationLabs
      ?.map((lab, index) => mapCertificationLab(lab, index))
      .filter((lab): lab is NormalizedEducationCertification => lab != null) ?? [];

  const title = cleanText(section.sectionHeading);
  const parsedDescription = parseCertificateSectionDescription(section.sectionDescription);

  const whyTitle = parsedDescription?.whyTitle ?? "";
  const whyDescription = parsedDescription?.whyDescription ?? "";
  const howTitle = parsedDescription?.howTitle ?? "";
  const howDescription = parsedDescription?.howDescription ?? "";

  if (!title || !certifications.length) return null;
  if (!whyTitle && !whyDescription && !howTitle && !howDescription) return null;

  const background = mapResponsiveImageUrls(section.bgImage);

  return {
    title,
    certifications,
    mobileLogoOrder: certifications.map((cert) => cert.id),
    whyTitle,
    whyDescription,
    howTitle,
    howDescription,
    ...(background.hasImage
      ? {
          backgroundDesktopUrl: background.desktopUrl,
          backgroundMobileUrl: background.mobileUrl,
          backgroundAlt: background.alt,
        }
      : {}),
  };
};

const formatTabLabel = (tabLabel?: string | null) => {
  const cleaned = cleanText(tabLabel);
  if (!cleaned) return undefined;

  return cleaned.replace(/_/g, " ");
};

const slugifyTabLabel = (tabLabel?: string | null, index = 0) => {
  const cleaned = cleanText(tabLabel);
  if (!cleaned) return `tab-${index}`;

  return cleaned
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const mapLearnLayoutType = (
  layoutType?: string | null,
): NormalizedEducationLearnTab["layout"] => {
  const normalized = (layoutType ?? "").trim().toLowerCase();

  if (normalized.includes("image") && normalized.includes("feature")) {
    return "anatomy-detail";
  }

  if (normalized.includes("feature list")) {
    return "care-grid";
  }

  return "carousel";
};

const splitDescription = (value?: string | null): string[] => {
  const cleaned = cleanText(value);
  if (!cleaned) return [];

  return cleaned.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
};

const parseTraitLabel = (label: string, index: number) => {
  const colonIndex = label.indexOf(":");
  if (colonIndex === -1) {
    return {
      id: `trait-${index}`,
      term: label,
      definition: "",
    };
  }

  return {
    id: `trait-${index}`,
    term: label.slice(0, colonIndex).trim(),
    definition: label.slice(colonIndex + 1).trim(),
  };
};

const mapCarouselSlide = (item: StrapiEducationLearnCarouselImage) => {
  const image = mapResponsiveImageUrls(item.image);
  if (!image.desktopUrl) return null;

  const ctaLabel = cleanText(item.ctaButton?.label);
  const ctaHref = cleanText(item.ctaButton?.url);

  return {
    src: image.desktopUrl,
    alt: image.alt,
    ctaLabel,
    ctaHref,
  };
};

const resolveLearnFeatureGroups = (
  tab: StrapiEducationLearnTab,
): StrapiEducationLearnFeatureGroup[] =>
  (tab.featureGroups ?? []).filter((group) => (group.featureItems?.length ?? 0) > 0);

const flattenLearnFeatureItems = (
  tab: StrapiEducationLearnTab,
): StrapiEducationLearnFeatureItem[] =>
  resolveLearnFeatureGroups(tab).flatMap((group) => group.featureItems ?? []);

const mapCareTips = (
  items?: StrapiEducationLearnFeatureItem[] | null,
): NormalizedEducationLearnCareTip[] =>
  (items ?? [])
    .map((item, index) => {
      const label = cleanText(item.label);
      if (!label) return null;

      const iconUrls = mapResponsiveImageUrls(item.icon);
      if (!iconUrls.hasImage) return null;

      return {
        id: item.id != null ? String(item.id) : `care-${index}`,
        icon: iconUrls.desktopUrl,
        ...(iconUrls.alt ? { iconAlt: iconUrls.alt } : {}),
        labelLines: [label],
      };
    })
    .filter((tip): tip is NormalizedEducationLearnCareTip => tip != null);

const mapAnatomyDetail = (
  tab: StrapiEducationLearnTab,
): NormalizedEducationLearnAnatomyDetail | null => {
  const groups = resolveLearnFeatureGroups(tab);
  const sections = groups
    .map((group, groupIndex) => {
      const traits =
        group.featureItems
          ?.map((item, index) => {
            const label = cleanText(item.label);
            if (!label) return null;
            return parseTraitLabel(label, index);
          })
          .filter((trait): trait is NonNullable<typeof trait> => trait != null) ?? [];

      const title = cleanText(group.featureSubtitle);

      if (!title || !traits.length) return null;

      return {
        id: group.id != null ? String(group.id) : `anatomy-section-${groupIndex}`,
        title,
        traits,
      };
    })
    .filter(
      (section): section is NonNullable<typeof section> => section != null,
    );

  const carouselImage = tab.carouselImage?.[0];
  const featureImage = mapResponsiveImageUrls(tab.featureImage);
  const carouselUrls = mapResponsiveImageUrls(carouselImage?.image);
  const image = featureImage.hasImage ? featureImage : carouselUrls.hasImage ? carouselUrls : null;

  if (!image?.desktopUrl || !sections.length) return null;

  const imageAlt = image.alt;

  return {
    image: image.desktopUrl,
    imageAlt,
    sections,
  };
};

const mapLearnTab = (
  tab: StrapiEducationLearnTab,
  index: number,
): NormalizedEducationLearnTab | null => {
  if (!resolveSectionActive(tab.isActive, tab.showField)) return null;

  const label = formatTabLabel(tab.tabLabel);
  const description = splitDescription(tab.tabDescription);
  if (!label || !description.length) return null;

  // Orphan/incomplete CMS tabs (e.g. duplicate SHAPE with no layoutType) — skip.
  if (!(tab.layoutType ?? "").trim()) return null;

  const layout = mapLearnLayoutType(tab.layoutType);
  const id = slugifyTabLabel(tab.tabLabel, index);
  const mapped: NormalizedEducationLearnTab = {
    id,
    label,
    description,
    layout,
  };

  if (layout === "care-grid") {
    const careTips = mapCareTips(flattenLearnFeatureItems(tab));
    if (!careTips.length) return null;
    mapped.careTips = careTips;
    return mapped;
  }

  if (layout === "anatomy-detail") {
    const anatomyDetail = mapAnatomyDetail(tab);
    if (!anatomyDetail) return null;
    mapped.anatomyDetail = anatomyDetail;
    return mapped;
  }

  const slides =
    tab.carouselImage
      ?.map((item) => mapCarouselSlide(item))
      .filter((slide): slide is NonNullable<typeof slide> => slide != null) ?? [];

  if (!slides.length) return null;

  const primaryCta = slides.find((slide) => slide.ctaLabel && slide.ctaHref);
  mapped.slides = slides.map(({ src, alt, ctaLabel, ctaHref }) => ({
    src,
    alt,
    ...(ctaLabel ? { ctaLabel } : {}),
    ...(ctaHref ? { ctaHref } : {}),
  }));
  if (primaryCta?.ctaLabel && primaryCta.ctaHref) {
    mapped.ctaLabel = primaryCta.ctaLabel;
    mapped.ctaHref = primaryCta.ctaHref;
  }
  return mapped;
};

const mapLearnMoreSection = (
  section?: StrapiEducationLearnMoreSection | null,
): NormalizedEducationLearnMoreSection | null => {
  if (!section || !resolveSectionActive(section.isActive, section.showField)) return null;

  const title = cleanText(section.sectionHeading);
  const tabs =
    section.tabs
      ?.map((tab, index) => mapLearnTab(tab, index))
      .filter((tab): tab is NormalizedEducationLearnTab => tab != null) ?? [];

  if (!title || !tabs.length) return null;

  return { title, tabs };
};

export function mapLearnAboutDiamondsPage(
  raw?: StrapiLearnAboutDiamondsPageEntity | null,
): NormalizedLearnAboutDiamondsPage {
  if (!raw) return EMPTY_LEARN_ABOUT_DIAMONDS_PAGE;

  return {
    hero: mapHero(raw.hero),
    faq: mapFaqSection(raw.faqSection),
    ctaBanner: mapDiscoverSection(raw.discoverSection),
    fourCsIntro: mapFourCsIntro(raw.fourCsIntro),
    fourCs: mapFourCsSection(raw.fourCsSection),
    certificate: mapCertificateSection(raw.certificateSection),
    learnMore: mapLearnMoreSection(raw.learnMoreSection),
    seo: mapSeo(raw.seo),
  };
}
