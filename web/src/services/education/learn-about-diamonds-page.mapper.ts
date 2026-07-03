import {
  buildCaratSliderSpecForWeights,
  buildSliderSpecForOptionCount,
  educationCertifiedContent,
  educationDiscoverContent,
  educationFaqItems,
  educationFourCsIntroContent,
  educationFourCsPanels,
  educationPageImages,
  educationSliderSpecs,
  type EducationFourCsPanelContent,
  type EducationSliderOption,
} from "@/features/education/data/content";
import { resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
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
  NormalizedLearnAboutDiamondsPage,
  StrapiEducationCertificateSection,
  StrapiEducationCertificationLab,
  StrapiEducationCtaBanner,
  StrapiEducationFaqItem,
  StrapiEducationFourCsInfoPanel,
  StrapiEducationFourCsIntro,
  StrapiEducationFourCsSection,
  StrapiEducationFourCsVisualPanel,
  StrapiEducationGradeStop,
  StrapiEducationHero,
  StrapiEducationResponsiveImage,
  StrapiLearnAboutDiamondsPageEntity,
} from "./learn-about-diamonds-page.types";
import { EMPTY_LEARN_ABOUT_DIAMONDS_PAGE } from "./learn-about-diamonds-page.types";

const STATIC_PANEL_BY_ID = Object.fromEntries(
  educationFourCsPanels.map((panel) => [panel.id, panel]),
) as Record<string, EducationFourCsPanelContent>;

const PANEL_ID_BY_LABEL: Record<string, EducationFourCsPanelContent["id"]> = {
  CLARITY: "clarity",
  CUT: "cut",
  COLOUR: "colour",
  COLOR: "colour",
  CARAT: "carat",
};

const cleanText = (value?: string | null): string | undefined => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

const mapHero = (hero?: StrapiEducationHero | null): NormalizedEducationHero | null => {
  if (!hero || hero.isActive === false) return null;

  const title = cleanText(hero.title);
  if (!title) return null;

  const desktopUrl = resolveCmsMediaUrl(hero.image?.desktopImage);
  const mobileUrl = resolveCmsMediaUrl(hero.image?.mobileImage);

  if (!desktopUrl && !mobileUrl) return null;

  const posterDesktopUrl = desktopUrl ?? mobileUrl!;
  const posterMobileUrl = mobileUrl ?? desktopUrl!;
  const posterAlt =
    cleanText(hero.image?.altText) ?? cleanText(hero.image?.caption) ?? "";
  const videoUrl = resolveCmsMediaUrl(hero.heroVideo?.heroVideo);

  return {
    title,
    eyebrow: cleanText(hero.eyebrow),
    subtitle: cleanText(hero.subtitle),
    videoUrl,
    posterDesktopUrl,
    posterMobileUrl,
    posterAlt,
  };
};

const mapBackgroundUrls = (image?: StrapiEducationResponsiveImage | null) => {
  const desktopUrl =
    resolveCmsMediaUrl(image?.desktopImage) ??
    resolveCmsMediaUrl(image?.mobileImage);
  const mobileUrl =
    resolveCmsMediaUrl(image?.mobileImage) ??
    resolveCmsMediaUrl(image?.desktopImage);

  const hasCmsBackgroundImage = Boolean(desktopUrl || mobileUrl);

  return {
    desktopUrl: desktopUrl ?? educationPageImages.discoverImage,
    mobileUrl: mobileUrl ?? educationPageImages.discoverImage,
    alt: cleanText(image?.altText) ?? cleanText(image?.caption) ?? "",
    hasCmsBackgroundImage,
  };
};

const mapFaqItems = (items?: StrapiEducationFaqItem[] | null): NormalizedEducationFaqItem[] => {
  const mapped =
    items
      ?.map((item, index) => {
        const question = cleanText(item.question);
        const answer = cleanText(item.answer);
        if (!question) return null;

        return {
          id: item.id != null ? String(item.id) : `faq-${index}`,
          question,
          answer: answer ?? "",
        };
      })
      .filter((item): item is NormalizedEducationFaqItem => item != null) ?? [];

  if (mapped.length) return mapped;

  return educationFaqItems.map(({ id, question, answer }) => ({
    id,
    question,
    answer: answer ?? "",
  }));
};

const mapFaqSection = (
  faqSection?: StrapiLearnAboutDiamondsPageEntity["faqSection"],
): NormalizedEducationFaqSection => ({
  heading: cleanText(faqSection?.sectionHeading) ?? "Frequently Asked Questions",
  items: mapFaqItems(faqSection?.faqItems),
});

const mapCtaBanner = (
  ctaBanner?: StrapiEducationCtaBanner | null,
): NormalizedEducationCtaBanner => {
  const background = mapBackgroundUrls(ctaBanner?.backgroundImage);

  return {
    heading: cleanText(ctaBanner?.heading) ?? educationDiscoverContent.title,
    subheading:
      cleanText(ctaBanner?.subheading) ?? educationDiscoverContent.description,
    ctaLabel:
      cleanText(ctaBanner?.ctaButtonLabel) ?? educationDiscoverContent.ctaLabel,
    ctaHref:
      cleanText(ctaBanner?.ctaButtonUrl) ?? educationDiscoverContent.ctaHref,
    imageDesktopUrl: background.desktopUrl,
    imageMobileUrl: background.mobileUrl,
    imageAlt: background.alt,
    hasCmsBackgroundImage: background.hasCmsBackgroundImage,
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
): EducationFourCsPanelContent["id"] => {
  const labelKey = cleanText(sectionLabel)?.toUpperCase();
  if (labelKey && PANEL_ID_BY_LABEL[labelKey]) {
    return PANEL_ID_BY_LABEL[labelKey];
  }

  return educationFourCsPanels[fallbackIndex]?.id ?? "clarity";
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

const mapCutOptionImage = (label: string) =>
  label.trim().toLowerCase() === "excellent"
    ? educationPageImages.cutDiamondExcellent
    : educationPageImages.cutDiamondGood;

const mapGradeStopToOption = (
  stop: StrapiEducationGradeStop,
  panelId: EducationFourCsPanelContent["id"],
  activeGradeCode?: string,
  visualImageUrl?: string,
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

  if (panelId === "cut") {
    option.image = mapCutOptionImage(label);
  } else if (visualImageUrl) {
    option.image = visualImageUrl;
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
): NormalizedEducationFourCsPanel => {
  const panelId = resolvePanelId(index, info.sectionLabel);
  const staticPanel = STATIC_PANEL_BY_ID[panelId] ?? educationFourCsPanels[index]!;
  const activeGradeCode = cleanText(info.activeGradeCode);
  const visualImageUrl =
    resolveCmsMediaUrl(visual?.visualImage?.desktopImage) ??
    resolveCmsMediaUrl(visual?.visualImage?.mobileImage);

  const mappedOptions =
    visual?.gradeStops
      ?.map((stop) => mapGradeStopToOption(stop, panelId, activeGradeCode, visualImageUrl))
      .filter((option): option is EducationSliderOption => option != null) ?? [];

  const options = mappedOptions.length ? mappedOptions : staticPanel.slider.options;
  const defaultIndex = resolveDefaultIndex(
    options,
    activeGradeCode,
    staticPanel.slider.defaultIndex,
  );

  const slider = {
    ...staticPanel.slider,
    defaultIndex,
    options,
    ...(visualImageUrl && panelId !== "cut" && panelId !== "carat"
      ? { image: visualImageUrl }
      : {}),
  };

  return {
    ...staticPanel,
    id: panelId,
    code: cleanText(info.displayTag) ?? staticPanel.code,
    title: cleanText(info.sectionLabel) ?? staticPanel.title,
    description: cleanText(info.description) ?? staticPanel.description,
    footnote: cleanText(info.brandNote) ?? staticPanel.footnote,
    slider,
    sliderSpec: resolveSliderSpec(panelId, options),
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

const mapFourCsIntroImage = (image?: StrapiEducationFourCsIntro["image"]) => {
  const desktopUrl =
    resolveCmsMediaUrl(image?.desktopImage) ??
    resolveCmsMediaUrl(image?.mobileImage) ??
    educationPageImages.diamondOval;
  const mobileUrl =
    resolveCmsMediaUrl(image?.mobileImage) ??
    resolveCmsMediaUrl(image?.desktopImage) ??
    educationPageImages.diamondOval;

  return {
    desktopUrl,
    mobileUrl,
    alt: cleanText(image?.altText) ?? cleanText(image?.caption) ?? "",
  };
};

const mapFourCsIntro = (
  intro?: StrapiEducationFourCsIntro | null,
  fourCsSection?: StrapiEducationFourCsSection | null,
): NormalizedEducationFourCsIntro => {
  const fallback = EMPTY_LEARN_ABOUT_DIAMONDS_PAGE.fourCsIntro;
  const image = mapFourCsIntroImage(intro?.image);

  const heading = cleanText(intro?.heading) ?? fallback.desktopTitle;
  const mobileHeading =
    cleanText(intro?.mobileHeading) ?? heading ?? fallback.mobileTitle;
  const description = cleanText(intro?.body) ?? fallback.description;

  const pillarsFromPanels =
    fourCsSection?.cInfoPanel
      ?.map((panel) => formatPillarLabel(panel.sectionLabel))
      .filter((label): label is string => Boolean(label)) ?? [];

  const pillars =
    pillarsFromPanels.length > 0 ? pillarsFromPanels : fallback.pillars;

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
): NormalizedEducationFourCsSection => {
  const infoPanels = section?.cInfoPanel ?? [];
  if (!infoPanels.length) {
    return EMPTY_LEARN_ABOUT_DIAMONDS_PAGE.fourCs;
  }

  const visualPanels = section?.cVisualPanel ?? [];
  const panels = infoPanels.map((info, index) =>
    mapFourCsPanel(info, visualPanels[index] ?? null, index),
  );

  return panels.length
    ? { panels }
    : EMPTY_LEARN_ABOUT_DIAMONDS_PAGE.fourCs;
};

const STATIC_CERTIFICATION_BY_ID = Object.fromEntries(
  educationCertifiedContent.certifications.map((cert) => [cert.id, cert]),
) as Record<
  string,
  (typeof educationCertifiedContent.certifications)[number]
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

const resolveLabId = (lab: StrapiEducationCertificationLab, index: number) => {
  const codeKey = cleanText(lab.labCode)?.toUpperCase();
  if (codeKey && LAB_ID_BY_CODE[codeKey]) {
    return LAB_ID_BY_CODE[codeKey];
  }

  const nameKey = cleanText(lab.labName)?.toUpperCase();
  if (nameKey?.includes("GIA")) return "gia";
  if (nameKey?.includes("AMERICAN GEM")) return "ags";
  if (nameKey?.includes("HOGE RAADVOOR") || nameKey?.includes("HRD")) return "hrd";
  if (nameKey?.includes("KIMBER")) return "kimberley";

  return educationCertifiedContent.certifications[index]?.id ?? `lab-${index}`;
};

const mapCertificationLab = (
  lab: StrapiEducationCertificationLab,
  index: number,
): NormalizedEducationCertification | null => {
  const id = resolveLabId(lab, index);
  const staticCert = STATIC_CERTIFICATION_BY_ID[id];
  const label =
    cleanText(lab.labName) ??
    cleanText(lab.labDescription) ??
    staticCert?.label;
  if (!label) return null;

  const logoUrl =
    resolveCmsMediaUrl(lab.labLogo?.desktopImage) ??
    resolveCmsMediaUrl(lab.labLogo?.mobileImage) ??
    staticCert?.logo ??
    "";

  if (!logoUrl) return null;

  return {
    id,
    logoUrl,
    label,
    ...(staticCert && "mobileLabelLines" in staticCert
      ? { mobileLabelLines: staticCert.mobileLabelLines }
      : {}),
    logoClassName: staticCert?.logoClassName ?? "size-[79px]",
    mobileLogoClassName: staticCert?.mobileLogoClassName ?? "size-[59.286px]",
    imageClassName: staticCert?.imageClassName ?? "size-full object-cover",
    ...(staticCert && "logoWrapClassName" in staticCert
      ? { logoWrapClassName: staticCert.logoWrapClassName }
      : {}),
    usesCmsLogo: Boolean(
      resolveCmsMediaUrl(lab.labLogo?.desktopImage) ??
        resolveCmsMediaUrl(lab.labLogo?.mobileImage),
    ),
  };
};

const mapCertificateSection = (
  section?: StrapiEducationCertificateSection | null,
): NormalizedEducationCertificateSection => {
  const fallback = EMPTY_LEARN_ABOUT_DIAMONDS_PAGE.certificate;
  const mappedLabs =
    section?.certificationLabs
      ?.map((lab, index) => mapCertificationLab(lab, index))
      .filter((lab): lab is NormalizedEducationCertification => lab != null) ?? [];

  const certifications = mappedLabs.length ? mappedLabs : fallback.certifications;

  return {
    title: cleanText(section?.sectionHeading) ?? fallback.title,
    certifications,
    mobileLogoOrder: fallback.mobileLogoOrder,
    whyTitle:
      cleanText(section?.whyCertificationHeading) ?? fallback.whyTitle,
    whyDescription:
      cleanText(section?.whyCertificationDescription) ??
      cleanText(section?.sectionDescription) ??
      fallback.whyDescription,
    howTitle: cleanText(section?.howToVerifyHeading) ?? fallback.howTitle,
    howDescription:
      cleanText(section?.howToVerifyDescription) ?? fallback.howDescription,
  };
};

export function mapLearnAboutDiamondsPage(
  raw?: StrapiLearnAboutDiamondsPageEntity | null,
): NormalizedLearnAboutDiamondsPage {
  if (!raw) return EMPTY_LEARN_ABOUT_DIAMONDS_PAGE;

  return {
    hero: mapHero(raw.hero),
    faq: mapFaqSection(raw.faqSection),
    ctaBanner: mapCtaBanner(raw.ctaBanner),
    fourCsIntro: mapFourCsIntro(raw.fourCsIntro, raw.fourCsSection),
    fourCs: mapFourCsSection(raw.fourCsSection),
    certificate: mapCertificateSection(raw.certificateSection),
  };
}
