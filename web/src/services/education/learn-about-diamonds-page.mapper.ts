import {
  buildCaratSliderSpecForWeights,
  buildSliderSpecForOptionCount,
  educationCertificationLogoStyles,
  educationFourCsPanelLayouts,
  educationSliderSpecs,
  type EducationFourCsPanelContent,
  type EducationFourCsPanelLayout,
  type EducationSliderOption,
} from "@/features/education/data/content";
import { resolveEducationDiamondShapeHref } from "@/features/jewellery-product/utils/diamondShapeListing";
import { resolveEducationFancyColourHref } from "@/features/jewellery-product/utils/fancyColourListing";
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

const STATIC_LAYOUT_BY_ID = Object.fromEntries(
  educationFourCsPanelLayouts.map((layout) => [layout.id, layout]),
) as Record<string, EducationFourCsPanelLayout>;

const PANEL_ID_BY_LABEL: Record<string, EducationFourCsPanelLayout["id"]> = {
  CLARITY: "clarity",
  CUT: "cut",
  COLOUR: "colour",
  COLOR: "colour",
  CARAT: "carat",
};

const STATIC_CERTIFICATION_BY_ID = Object.fromEntries(
  educationCertificationLogoStyles.certifications.map((cert) => [cert.id, cert]),
) as Record<
  string,
  (typeof educationCertificationLogoStyles.certifications)[number]
>;

const LAB_ID_BY_CODE: Record<string, string> = {
  GIA: "gia",
  AGS: "ags",
  HRD: "hrd",
  TKP: "kimberley",
  KIMBERLEY: "kimberley",
  KPCS: "kimberley",
  "KIMBERLY PROCESS": "kimberley",
};

const cleanText = (value?: string | null): string | undefined => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

const mapResponsiveImageUrls = (image?: StrapiEducationResponsiveImage | null) => {
  const desktopUrl =
    resolveCmsMediaUrl(image?.desktopImage) ??
    resolveCmsMediaUrl(image?.mobileImage);
  const mobileUrl =
    resolveCmsMediaUrl(image?.mobileImage) ??
    resolveCmsMediaUrl(image?.desktopImage);

  return {
    desktopUrl: desktopUrl ?? "",
    mobileUrl: mobileUrl ?? "",
    alt:
      cleanText(image?.altText) ??
      cleanText(image?.caption) ??
      resolveCmsAltText(image?.desktopImage) ??
      resolveCmsAltText(image?.mobileImage) ??
      resolveCmsAltText(image) ??
      "",
    hasImage: Boolean(desktopUrl || mobileUrl),
  };
};

const mapSeo = (seo?: StrapiEducationSeo | null): NormalizedEducationSeo | null => {
  if (!seo || seo.showField === false) return null;

  const metaTitle = cleanText(seo.metaTitle);
  const metaDescription = cleanText(seo.metaDescription);
  const canonicalPath = cleanText(seo.canonicalUrl);
  if (!metaTitle && !metaDescription) return null;

  const ogImageUrl = resolveCmsMediaUrl(seo.ogImage);
  const rawCanonical = canonicalPath ?? "/learn-about-diamonds";
  const normalizedCanonicalPath =
    rawCanonical === "/education" || rawCanonical === "education"
      ? "/learn-about-diamonds"
      : rawCanonical.startsWith("/")
        ? rawCanonical
        : `/${rawCanonical}`;

  return {
    metaTitle: metaTitle ?? "",
    metaDescription: metaDescription ?? "",
    canonicalPath: normalizedCanonicalPath,
    metaKeywords: cleanText(seo.metaKeywords),
    ...(ogImageUrl ? { ogImageUrl } : {}),
  };
};

const mapHero = (hero?: StrapiEducationHero | null): NormalizedEducationHero | null => {
  if (!hero || hero.isActive === false) return null;

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
  const heading = cleanText(faqSection?.sectionHeading);
  const items = mapFaqItems(faqSection?.faqItems);
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
    .filter((step) => step.isActive !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((step) => cleanText(step.title))
    .filter((title): title is string => Boolean(title));

const mapDiscoverSection = (
  section?: StrapiEducationDiscoverSection | null,
): NormalizedEducationCtaBanner | null => {
  if (!section) return null;

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
  fallbackIndex: number,
  sectionLabel?: string | null,
): EducationFourCsPanelContent["id"] | null => {
  const labelKey = cleanText(sectionLabel)?.toUpperCase();
  if (labelKey && PANEL_ID_BY_LABEL[labelKey]) {
    return PANEL_ID_BY_LABEL[labelKey];
  }

  return educationFourCsPanelLayouts[fallbackIndex]?.id ?? null;
};

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
  visualImageUrl?: string,
  visualImageAlt?: string,
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
  const gradeAlt =
    resolveCmsAltText(stop.gradeImage) ??
    resolveCmsAltText(stop.gradeImage?.desktopImage) ??
    resolveCmsAltText(stop.gradeImage?.mobileImage) ??
    "";

  if (mediaUrls[0]) {
    option.image = mediaUrls[0];
    option.imageAlt = gradeAlt;
  } else if (visualImageUrl && panelId !== "cut") {
    option.image = visualImageUrl;
    option.imageAlt = visualImageAlt || gradeAlt;
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
  const panelId = resolvePanelId(index, info.sectionLabel);
  if (!panelId) return null;

  const panelLayout = STATIC_LAYOUT_BY_ID[panelId] ?? educationFourCsPanelLayouts[index];
  if (!panelLayout) return null;

  const title = cleanText(info.sectionLabel);
  const description = cleanText(info.description);
  const code = cleanText(info.displayTag);
  if (!title || !description || !code) return null;

  const activeGradeCode = cleanText(info.activeGradeCode);
  const visualImage = mapResponsiveImageUrls(visual?.visualImage);
  const visualImageUrl = visualImage.desktopUrl || visualImage.mobileUrl || undefined;

  const mappedOptions =
    (visual?.gradeStops ?? [])
      .map((stop) =>
        mapGradeStopToOption(stop, panelId, activeGradeCode, visualImageUrl, visualImage.alt),
      )
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
  };
};

const PILLAR_LABEL_OVERRIDES: Record<string, string> = {
  CLARITY: "Clarity",
  CUT: "Cut",
  COLOUR: "Colour",
  COLOR: "Colour",
  CARAT: "Carat",
};

const formatPillarLabel = (label?: string | null) => {
  const cleaned = cleanText(label);
  if (!cleaned) return undefined;

  const key = cleaned.toUpperCase();
  if (PILLAR_LABEL_OVERRIDES[key]) {
    return PILLAR_LABEL_OVERRIDES[key];
  }

  return cleaned
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const mapFourCsIntroImage = (intro?: StrapiEducationFourCsIntro | null) => {
  const image = intro?.decorativeImage ?? intro?.image;
  return mapResponsiveImageUrls(image);
};

const mapFourCsIntro = (
  intro?: StrapiEducationFourCsIntro | null,
  fourCsSection?: StrapiEducationFourCsSection | null,
): NormalizedEducationFourCsIntro | null => {
  if (!intro) return null;

  const image = mapFourCsIntroImage(intro);
  const heading = cleanText(intro.heading);
  const description = cleanText(intro.body);
  if (!heading || !description || !image.hasImage) return null;

  const mobileHeading = cleanText(intro.mobileHeading) ?? heading;

  // Use CMS list order as returned (Strapi drag-and-drop). Do not re-sort by
  // sortOrder — those numbers are often stale after drag and would undo the order.
  const pillarsFromTags =
    intro.fourCsTags
      ?.map((tag) => formatPillarLabel(tag.label))
      .filter((label): label is string => Boolean(label)) ?? [];

  const pillarsFromPanels =
    (fourCsSection?.cInfoPanel ?? [])
      .map((panel) => formatPillarLabel(panel.sectionLabel))
      .filter((label): label is string => Boolean(label));

  const pillars = pillarsFromTags.length > 0 ? pillarsFromTags : pillarsFromPanels;
  if (!pillars.length) return null;

  return {
    desktopTitle: heading,
    mobileTitle: mobileHeading,
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
  // Preserve Strapi component order (drag-and-drop). Pair info[i] with visual[i].
  const infoPanels = section?.cInfoPanel ?? [];
  if (!infoPanels.length) return null;

  const visualPanels = section?.cVisualPanel ?? [];
  const panels = infoPanels
    .map((info, index) => mapFourCsPanel(info, visualPanels[index] ?? null, index))
    .filter((panel): panel is NormalizedEducationFourCsPanel => panel != null);

  return panels.length ? { panels } : null;
};

const resolveLabId = (lab: StrapiEducationCertificationLab, index: number) => {
  const codeKey = cleanText(lab.labCode)?.toUpperCase();
  if (codeKey && LAB_ID_BY_CODE[codeKey]) {
    return LAB_ID_BY_CODE[codeKey];
  }

  const nameKey = cleanText(lab.labName)?.toUpperCase();
  if (nameKey && LAB_ID_BY_CODE[nameKey]) {
    return LAB_ID_BY_CODE[nameKey];
  }
  if (nameKey?.includes("GIA")) return "gia";
  if (nameKey?.includes("AMERICAN GEM")) return "ags";
  if (nameKey?.includes("HOGE RAADVOOR") || nameKey?.includes("HRD")) return "hrd";
  if (nameKey?.includes("KIMBER")) return "kimberley";

  const descriptionKey = cleanText(lab.labDescription)?.toUpperCase();
  if (descriptionKey?.includes("GIA") || descriptionKey?.includes("GEMOLOGICAL")) {
    return "gia";
  }
  if (descriptionKey?.includes("AMERICAN GEM")) return "ags";
  if (descriptionKey?.includes("HOGE RAADVOOR") || descriptionKey?.includes("HRD")) {
    return "hrd";
  }
  if (descriptionKey?.includes("KIMBER")) return "kimberley";

  return `lab-${index}`;
};

/** Prefer labDescription under logos (short labName is for CMS ID only). */
const mapCertificationLab = (
  lab: StrapiEducationCertificationLab,
  index: number,
): NormalizedEducationCertification | null => {
  const id = resolveLabId(lab, index);
  const staticCert = STATIC_CERTIFICATION_BY_ID[id];
  const label =
    cleanText(lab.labDescription) ??
    cleanText(lab.labName);
  if (!label) return null;

  const logoUrl =
    resolveCmsMediaUrl(lab.labLogo?.desktopImage) ??
    resolveCmsMediaUrl(lab.labLogo?.mobileImage);
  if (!logoUrl) return null;

  const logoAlt =
    resolveCmsAltText(lab.labLogo) ??
    resolveCmsAltText(lab.labLogo?.desktopImage) ??
    resolveCmsAltText(lab.labLogo?.mobileImage) ??
    "";

  return {
    id,
    logoUrl,
    logoAlt,
    label,
    logoClassName: staticCert?.logoClassName ?? "size-[79px]",
    mobileLogoClassName: staticCert?.mobileLogoClassName ?? "size-[59.286px]",
    imageClassName: staticCert?.imageClassName ?? "size-full object-cover",
    ...(staticCert && "logoWrapClassName" in staticCert
      ? { logoWrapClassName: staticCert.logoWrapClassName }
      : {}),
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
  if (!section) return null;

  const certifications =
    section.certificationLabs
      ?.map((lab, index) => mapCertificationLab(lab, index))
      .filter((lab): lab is NormalizedEducationCertification => lab != null) ?? [];

  const title = cleanText(section.sectionHeading);
  const parsedDescription = parseCertificateSectionDescription(section.sectionDescription);

  const whyTitle =
    cleanText(section.whyCertificationHeading) ?? parsedDescription?.whyTitle ?? "";
  const whyDescription =
    cleanText(section.whyCertificationDescription) ??
    parsedDescription?.whyDescription ??
    "";
  const howTitle =
    cleanText(section.howToVerifyHeading) ?? parsedDescription?.howTitle ?? "";
  const howDescription =
    cleanText(section.howToVerifyDescription) ??
    parsedDescription?.howDescription ??
    "";

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
  if (!image.hasImage) return null;

  const ctaLabel = cleanText(item.ctaButton?.label);
  const shapeHref = resolveEducationDiamondShapeHref({
    ctaLabel,
    ctaUrl: item.ctaButton?.url,
  });
  const fancyHref = resolveEducationFancyColourHref({
    ctaLabel,
    ctaUrl: item.ctaButton?.url,
  });

  // Prefer an explicit shape/colour deep-link when either resolver produced one.
  const ctaHref =
    (shapeHref?.includes("diamondShape=") ? shapeHref : undefined) ??
    (fancyHref?.includes("fancyColour=") ? fancyHref : undefined) ??
    fancyHref ??
    shapeHref;

  return {
    src: image.desktopUrl,
    alt: image.alt,
    ctaLabel,
    ctaHref,
  };
};

/** Prefer featureGroups (current CMS); fall back to legacy top-level featureItems. */
const resolveLearnFeatureGroups = (
  tab: StrapiEducationLearnTab,
): StrapiEducationLearnFeatureGroup[] => {
  const groups = (tab.featureGroups ?? []).filter(
    (group) => (group.featureItems?.length ?? 0) > 0,
  );
  if (groups.length) return groups;

  if ((tab.featureItems?.length ?? 0) > 0) {
    return [
      {
        featureSubtitle: tab.featureSubtitle,
        featureItems: tab.featureItems,
      },
    ];
  }

  return [];
};

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

      const title =
        cleanText(group.featureSubtitle) ?? cleanText(tab.featureSubtitle);

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

  const image = featureImage.hasImage
    ? featureImage
    : carouselUrls.hasImage
      ? carouselUrls
      : null;

  if (!image || !sections.length) return null;

  const imageAlt =
    image.alt ||
    cleanText(tab.tabLabel)?.replace(/_/g, " ") ||
    "Diamond anatomy";

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
  if (!section) return null;

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
    ctaBanner: mapDiscoverSection(raw.discoverSection ?? raw.ctaBanner),
    fourCsIntro: mapFourCsIntro(raw.fourCsIntro, raw.fourCsSection),
    fourCs: mapFourCsSection(raw.fourCsSection),
    certificate: mapCertificateSection(raw.certificateSection),
    learnMore: mapLearnMoreSection(raw.learnMoreSection),
    seo: mapSeo(raw.seo),
  };
}
