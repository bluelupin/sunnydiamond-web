import type { CareerBenefit, CareerJobType } from "@/features/careers/types";
import { extractStrapiImage, resolveCmsMediaUrl } from "@/shared/utils/strapiMedia";
import type {
  NormalizedCareerApplicationFlow,
  NormalizedCareerBenefitsSection,
  NormalizedCareerDiscoverSection,
  NormalizedCareerFaqSection,
  NormalizedCareerHero,
  NormalizedCareerJob,
  NormalizedCareerLandingPage,
  NormalizedCareerLifeSection,
  NormalizedCareerListingPage,
  NormalizedCareerOpeningsSection,
  NormalizedCareerResponsiveImage,
  NormalizedCareerSeo,
  NormalizedCareersPageData,
  StrapiCareerApplicationFlowSection,
  StrapiCareerBenefitFeature,
  StrapiCareerBenefitsSection,
  StrapiCareerCtaButton,
  StrapiCareerDiscoverSection,
  StrapiCareerFaqItem,
  StrapiCareerFaqSection,
  StrapiCareerHero,
  StrapiCareerLandingPageEntity,
  StrapiCareerLifeSection,
  StrapiCareerListingPageEntity,
  StrapiCareerOpeningsSection,
  StrapiCareerOpeningEntity,
  StrapiCareerQualificationGroup,
  StrapiCareerResponsiveImage,
  StrapiCareerSeo,
} from "./careers.types";
import {
  EMPTY_CAREER_LANDING_PAGE,
  EMPTY_CAREER_LISTING_PAGE,
  EMPTY_CAREERS_PAGE_DATA,
} from "./careers.types";

const cleanText = (value?: string | null): string | undefined => {
  const trimmed = value?.trim();
  return trimmed || undefined;
};

const coerceArray = <T>(value: unknown): T[] => {
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
  media?: StrapiCareerResponsiveImage | null,
): NormalizedCareerResponsiveImage | null => {
  if (!media) return null;

  const directUrl = resolveCmsMediaUrl(media);
  const desktopUrl =
    resolveCmsMediaUrl(media.desktopImage) ??
    resolveCmsMediaUrl(media.mobileImage) ??
    directUrl;
  const mobileUrl =
    resolveCmsMediaUrl(media.mobileImage) ??
    resolveCmsMediaUrl(media.desktopImage) ??
    directUrl;

  if (!desktopUrl && !mobileUrl) return null;

  const desktopFile = extractStrapiImage(media.desktopImage);
  const mobileFile = extractStrapiImage(media.mobileImage);

  return {
    desktopUrl: desktopUrl ?? mobileUrl!,
    mobileUrl: mobileUrl ?? desktopUrl!,
    alt:
      cleanText(media.altText) ??
      cleanText(media.caption) ??
      cleanText(desktopFile?.alternativeText) ??
      cleanText(mobileFile?.alternativeText) ??
      "",
    width: desktopFile?.width ?? mobileFile?.width ?? undefined,
    height: desktopFile?.height ?? mobileFile?.height ?? undefined,
  };
};

const resolveCtaLabel = (
  cta?: StrapiCareerCtaButton | string | null,
  fallback?: string | null,
): string | undefined => {
  if (typeof cta === "string") {
    return cleanText(cta);
  }
  return cleanText(cta?.label) ?? cleanText(fallback);
};

const mapFilterOptions = (
  filters?: Array<{ label?: string | null; value?: string | null }> | string[] | null,
): string[] => {
  const entries = coerceArray<{ label?: string | null; value?: string | null } | string>(
    filters,
  );

  return [
    ...new Set(
      entries
        .map((entry) => {
          if (typeof entry === "string") return cleanText(entry);
          return cleanText(entry.value) ?? cleanText(entry.label);
        })
        .filter(Boolean) as string[],
    ),
  ].sort();
};

const mapSeo = (seo?: StrapiCareerSeo | null): NormalizedCareerSeo | null => {
  const metaTitle = cleanText(seo?.metaTitle);
  const metaDescription = cleanText(seo?.metaDescription);
  const rawCanonical = cleanText(seo?.canonicalUrl);

  if (!metaTitle || !metaDescription) return null;

  const canonicalPath =
    !rawCanonical || rawCanonical === "/careers"
      ? "/careers"
      : rawCanonical.startsWith("/")
        ? rawCanonical
        : `/${rawCanonical}`;

  const ogImageUrl = resolveCmsMediaUrl(seo?.ogImage);

  return {
    metaTitle,
    metaDescription,
    canonicalPath,
    metaKeywords: cleanText(seo?.metaKeywords),
    ...(ogImageUrl ? { ogImageUrl } : {}),
  };
};

const mapHero = (hero?: StrapiCareerHero | null): NormalizedCareerHero | null => {
  const title = cleanText(hero?.title);
  const ctaLabel =
    cleanText(hero?.ctaLabel) ?? cleanText(hero?.CtaLable);
  const image =
    mapResponsiveImage(hero?.backgroundImage) ?? mapResponsiveImage(hero?.image);

  if (!title || !ctaLabel || !image) return null;

  return { title, ctaLabel, image };
};

const resolveOpeningId = (opening: StrapiCareerOpeningEntity): string | null => {
  return (
    cleanText(opening.slug) ??
    cleanText(opening.documentId) ??
    (opening.id != null ? String(opening.id) : null)
  );
};

const mapQualifications = (
  groups?: StrapiCareerQualificationGroup[] | null,
): NormalizedCareerJob["qualifications"] => {
  return coerceArray<StrapiCareerQualificationGroup>(groups)
    .map((group) => {
      const label = cleanText(group.label);
      const text = cleanText(group.text) ?? cleanText(group.description);
      if (!label || !text) return null;
      return { label, text };
    })
    .filter(Boolean) as NonNullable<NormalizedCareerJob["qualifications"]>;
};

const normalizeEmploymentType = (value?: string | null): CareerJobType | null => {
  const normalized = cleanText(value)?.toLowerCase();
  if (!normalized) return null;
  if (normalized.includes("part")) return "Part-time";
  if (normalized.includes("contract") || normalized.includes("intern")) return "Contract";
  if (normalized.includes("full")) return "Full-time";
  return null;
};

const resolvePostedAt = (opening: StrapiCareerOpeningEntity): string | null => {
  const candidate =
    cleanText(opening.postedAt) ??
    cleanText(opening.publishedAt) ??
    cleanText(opening.createdAt) ??
    cleanText(opening.updatedAt);

  if (!candidate) return null;

  const parsed = Date.parse(candidate);
  if (Number.isNaN(parsed)) return null;

  return new Date(parsed).toISOString().slice(0, 10);
};

export const mapCareerOpening = (
  opening: StrapiCareerOpeningEntity,
): NormalizedCareerJob | null => {
  const slug = cleanText(opening.slug);
  const id = resolveOpeningId(opening);
  const title = cleanText(opening.jobTitle) ?? cleanText(opening.title);
  const jobCode = cleanText(opening.jobID) ?? cleanText(opening.jobId);
  const location = cleanText(opening.location);
  const department = cleanText(opening.department);
  const experienceLabel =
    cleanText(opening.requiredExperience) ?? cleanText(opening.experience);
  const type = normalizeEmploymentType(opening.employmentType);
  const summary = cleanText(opening.summary);
  const postedAt = resolvePostedAt(opening);

  const workplaceLabel =
    cleanText(opening.workplaceLabel) ?? cleanText(opening.workplaceType) ?? "";

  if (!id || !title || !jobCode || !location || !department || !experienceLabel || !type || !summary || !postedAt) {
    return null;
  }
  const mappedQualifications = mapQualifications(opening.qualifications);
  const descriptionHtml =
    cleanText(opening.jobDescription) ?? cleanText(opening.description);
  const responsibilities = coerceArray<string>(opening.responsibilities)
    .map((item) => cleanText(item))
    .filter(Boolean) as string[];
  const requirements = coerceArray<string>(opening.requirements)
    .map((item) => cleanText(item))
    .filter(Boolean) as string[];

  return {
    id,
    slug: slug ?? id,
    documentId: cleanText(opening.documentId),
    jobCode,
    title,
    department,
    location,
    type,
    postedAt,
    summary,
    experienceLabel,
    workplaceLabel,
    responsibilities,
    requirements,
    jobSummary: cleanText(opening.jobSummary),
    rolesAndResponsibilities: cleanText(opening.rolesAndResponsibilities),
    ...(mappedQualifications && mappedQualifications.length > 0
      ? { qualifications: mappedQualifications }
      : {}),
    whatWeAreLookingFor: cleanText(opening.whatWeAreLookingFor),
    whyJoinUs: cleanText(opening.whyJoinUs),
    descriptionHtml,
    applyLabel:
      resolveCtaLabel(opening.applyCta) ??
      cleanText(opening.applyCtaLabel) ??
      cleanText(opening.applyLabel),
    sortOrder: typeof opening.sortOrder === "number" ? opening.sortOrder : 0,
    isActive: opening.isActive !== false,
    isFeatured: opening.isFeatured === true,
    isNew: opening.isNew === true,
  };
};

export const mapCareerOpenings = (
  openings?: StrapiCareerOpeningEntity[] | null,
): NormalizedCareerJob[] => {
  return coerceArray<StrapiCareerOpeningEntity>(openings)
    .map(mapCareerOpening)
    .filter(Boolean)
    .sort((a, b) => {
      if (a!.sortOrder !== b!.sortOrder) {
        return a!.sortOrder - b!.sortOrder;
      }
      return b!.postedAt.localeCompare(a!.postedAt);
    }) as NormalizedCareerJob[];
};

const mapOpeningsSection = (
  section?: StrapiCareerOpeningsSection | null,
): NormalizedCareerOpeningsSection | null => {
  if (!section) return null;

  const title =
    cleanText(section.OpeningTitle) ??
    cleanText(section.sectionTitle) ??
    cleanText(section.title);
  const mobileTitle = cleanText(section.mobileTitle) ?? title;
  const subtitle =
    cleanText(section.OpeningDescription) ??
    cleanText(section.sectionDescription) ??
    cleanText(section.subtitle) ??
    cleanText(section.description);
  const viewAllLabel =
    cleanText(section.CtaLable) ??
    cleanText(section.ctaLabel) ??
    cleanText(section.viewAllLabel);
  const relatedOpenings = coerceArray<StrapiCareerOpeningEntity>(
    section.career_openings ??
      section.relatedCareerOpenings ??
      section.careerOpenings,
  ).filter((opening) => opening.isActive !== false);

  if (!title || !mobileTitle || !subtitle || !viewAllLabel) return null;

  const relatedJobIds = relatedOpenings
    .map(resolveOpeningId)
    .filter(Boolean) as string[];

  return {
    title,
    mobileTitle,
    subtitle,
    viewAllLabel,
    relatedJobIds,
  };
};

const mapLifeSection = (
  section?: StrapiCareerLifeSection | null,
): NormalizedCareerLifeSection | null => {
  if (!section) return null;

  const title =
    cleanText(section.featuredTitle) ??
    cleanText(section.title) ??
    cleanText(section.sectionTitle);
  const description =
    cleanText(section.featuredBody) ??
    cleanText(section.description) ??
    cleanText(section.content);
  const quote = cleanText(section.featuredDescription) ?? cleanText(section.quote);
  const featuredImages = coerceArray<StrapiCareerResponsiveImage>(section.featuredImages)
    .map(mapResponsiveImage)
    .filter(Boolean) as NormalizedCareerResponsiveImage[];

  const leftImage =
    mapResponsiveImage(section.featuredImage1) ??
    mapResponsiveImage(section.leftImage) ??
    featuredImages[0] ??
    null;
  const rightImage =
    mapResponsiveImage(section.featuredImage2) ??
    mapResponsiveImage(section.rightImage) ??
    featuredImages[1] ??
    featuredImages[0] ??
    null;

  if (!title || !description || !leftImage || !rightImage) return null;

  return {
    title,
    description,
    quote,
    leftImage,
    rightImage,
    highlights: [],
  };
};

const mapBenefitItem = (
  feature: StrapiCareerBenefitFeature,
  index: number,
): CareerBenefit | null => {
  const label =
    cleanText(feature.FeatureTitle) ??
    cleanText(feature.label) ??
    cleanText(feature.title);
  const description =
    cleanText(feature.FeatureDescription) ?? cleanText(feature.description);
  const iconSrc =
    resolveCmsMediaUrl(feature.icon) ??
    resolveCmsMediaUrl(feature.featureImage) ??
    resolveCmsMediaUrl(feature.image?.desktopImage) ??
    resolveCmsMediaUrl(feature.image?.mobileImage);

  if (!label || !description) return null;

  return {
    id: feature.id != null ? String(feature.id) : `benefit-${index}`,
    label,
    description,
    iconSrc,
  };
};

const mapBenefitFeatureImage = (
  feature: StrapiCareerBenefitFeature,
): NormalizedCareerResponsiveImage | null => {
  return mapResponsiveImage(feature.featureImage) ?? mapResponsiveImage(feature.image);
};

const mapBenefitsSection = (
  section?: StrapiCareerBenefitsSection | null,
): NormalizedCareerBenefitsSection | null => {
  if (!section) return null;

  const title =
    cleanText(section.InvestingTitle) ??
    cleanText(section.sectionTitle) ??
    cleanText(section.title);
  const features = coerceArray<StrapiCareerBenefitFeature>(
    section.InvestingFeatures ?? section.features ?? section.benefitItems,
  );
  const items = features.map(mapBenefitItem).filter(Boolean) as CareerBenefit[];
  const image =
    mapResponsiveImage(section.sectionImage) ??
    mapResponsiveImage(section.image) ??
    features.map(mapBenefitFeatureImage).find(Boolean) ??
    null;

  if (!title || items.length === 0) return null;

  return { title, image, items };
};

const mapFaqItem = (item: StrapiCareerFaqItem, index: number) => {
  const question = cleanText(item.question);
  const answer = cleanText(item.answer);
  if (!question || !answer) return null;

  return {
    id: item.id != null ? String(item.id) : `faq-${index}`,
    question,
    answer,
  };
};

const mapFaqSection = (
  section?: StrapiCareerFaqSection | null,
): NormalizedCareerFaqSection | null => {
  if (!section) return null;

  const title =
    cleanText(section.sectionHeading) ?? cleanText(section.heading);
  const items = coerceArray<StrapiCareerFaqItem>(section.faqItems)
    .map(mapFaqItem)
    .filter(Boolean) as NonNullable<ReturnType<typeof mapFaqItem>>[];

  if (!title || items.length === 0) return null;

  return { title, items };
};

const mapDiscoverSection = (
  section?: StrapiCareerDiscoverSection | null,
): NormalizedCareerDiscoverSection | null => {
  if (!section) return null;

  const title = cleanText(section.title) ?? cleanText(section.heading);
  const ctaLabel =
    resolveCtaLabel(section.cta) ??
    cleanText(section.ctaLabel) ??
    cleanText(section.ctaButtonLabel);
  const image = mapResponsiveImage(section.backgroundImage);

  if (!title || !ctaLabel || !image) return null;

  return { title, ctaLabel, image };
};

const mapApplicationFormFields = (
  section: StrapiCareerApplicationFlowSection,
): NormalizedCareerApplicationFlow["applicationForm"]["fields"] | null => {
  const fields = section.formFields;
  const requiredPairs: Array<[string | undefined, keyof NormalizedCareerApplicationFlow["applicationForm"]["fields"]]> = [
    [cleanText(fields?.fullNameLabel), "fullNameLabel"],
    [cleanText(fields?.phoneLabel), "phoneLabel"],
    [cleanText(fields?.emailLabel), "emailLabel"],
    [cleanText(fields?.dateOfBirthLabel), "dateOfBirthLabel"],
    [cleanText(fields?.dateOfBirthPlaceholder), "dateOfBirthPlaceholder"],
    [cleanText(fields?.fieldPlaceholder), "fieldPlaceholder"],
    [cleanText(fields?.genderLabel), "genderLabel"],
    [cleanText(fields?.highestDegreeLabel), "highestDegreeLabel"],
    [cleanText(fields?.areaOfStudyLabel), "areaOfStudyLabel"],
    [cleanText(fields?.yearOfCompletionLabel), "yearOfCompletionLabel"],
    [cleanText(fields?.relevantExperienceLabel), "relevantExperienceLabel"],
    [cleanText(fields?.currentCompanyLabel), "currentCompanyLabel"],
    [cleanText(fields?.currentJobTitleLabel), "currentJobTitleLabel"],
    [cleanText(fields?.currentCtcLabel), "currentCtcLabel"],
    [cleanText(fields?.expectedCtcLabel), "expectedCtcLabel"],
    [cleanText(fields?.noticePeriodLabel), "noticePeriodLabel"],
    [cleanText(fields?.skillsSearchLabel), "skillsSearchLabel"],
    [cleanText(fields?.skillsSearchPlaceholder), "skillsSearchPlaceholder"],
    [cleanText(fields?.skillsLabel), "skillsLabel"],
    [cleanText(fields?.languagesLabel), "languagesLabel"],
    [cleanText(fields?.companyRelationLabel), "companyRelationLabel"],
    [cleanText(fields?.companyRelationYes), "companyRelationYes"],
    [cleanText(fields?.companyRelationNo), "companyRelationNo"],
    [cleanText(fields?.employeeNameLabel), "employeeNameLabel"],
    [cleanText(fields?.employeeJobTitleLabel), "employeeJobTitleLabel"],
  ];

  const mapped = Object.fromEntries(
    requiredPairs.map(([value, key]) => [key, value]),
  ) as Partial<NormalizedCareerApplicationFlow["applicationForm"]["fields"]>;

  if (Object.values(mapped).some((value) => !value)) {
    return null;
  }

  return mapped as NormalizedCareerApplicationFlow["applicationForm"]["fields"];
};

const mapApplicationFlow = (
  section?: StrapiCareerApplicationFlowSection | null,
): NormalizedCareerApplicationFlow | null => {
  if (!section) return null;

  const fields = mapApplicationFormFields(section);
  const genderOptions = coerceArray<string>(section.genderOptions)
    .map((item) => cleanText(item))
    .filter(Boolean) as string[];
  const workExperienceOptions = coerceArray<string>(section.workExperienceOptions)
    .map((item) => cleanText(item))
    .filter(Boolean) as string[];
  const noticePeriodOptions = coerceArray<string>(section.noticePeriodOptions)
    .map((item) => cleanText(item))
    .filter(Boolean) as string[];
  const employeeRelationOptions = coerceArray<string>(section.employeeRelationOptions)
    .map((item) => cleanText(item))
    .filter(Boolean) as string[];

  const requiredStrings = {
    applyLabel: cleanText(section.applyLabel),
    jobSummaryHeading: cleanText(section.jobSummaryHeading),
    rolesHeading: cleanText(section.rolesHeading),
    qualificationsHeading: cleanText(section.qualificationsHeading),
    lookingForHeading: cleanText(section.lookingForHeading),
    whyJoinHeading: cleanText(section.whyJoinHeading),
    shareLabel: cleanText(section.shareLabel),
    viewJobLabel: cleanText(section.viewJobLabel),
    applyModalTitle: cleanText(section.applyModalTitle),
    autofillResumeLabel: cleanText(section.autofillResumeLabel),
    applyManuallyLabel: cleanText(section.applyManuallyLabel),
    applyLinkedInLabel: cleanText(section.applyLinkedInLabel),
    closeLabel: cleanText(section.closeLabel),
    applicationFormTitle: cleanText(section.applicationFormTitle),
    resumeHeading: cleanText(section.resumeHeading),
    resumeHint: cleanText(section.resumeHint),
    resumeUploadLabel: cleanText(section.resumeUploadLabel),
    resumeRemoveLabel: cleanText(section.resumeRemoveLabel),
    uploadResumeModalTitle: cleanText(section.uploadResumeModalTitle),
    uploadResumeModalDescription: cleanText(section.uploadResumeModalDescription),
    onlyUploadLabel: cleanText(section.onlyUploadLabel),
    confirmSubmissionTitle: cleanText(section.confirmSubmissionTitle),
    confirmSubmissionDescription: cleanText(section.confirmSubmissionDescription),
    goBackLabel: cleanText(section.goBackLabel),
    submitLabel: cleanText(section.submitLabel),
    personalDetailsHeading: cleanText(section.personalDetailsHeading),
    educationHeading: cleanText(section.educationHeading),
    workExperienceHeading: cleanText(section.workExperienceHeading),
    skillsHeading: cleanText(section.skillsHeading),
    additionalInfoHeading: cleanText(section.additionalInfoHeading),
    noRoleSelected: cleanText(section.noRoleSelected),
    applicationSuccessTitle: cleanText(section.applicationSuccessTitle),
    applicationSuccessDescriptionLine1: cleanText(section.applicationSuccessDescriptionLine1),
    applicationSuccessDescriptionLine2: cleanText(section.applicationSuccessDescriptionLine2),
    appliedJobDetailsHeading: cleanText(section.appliedJobDetailsHeading),
    jobTitleLabel: cleanText(section.jobTitleLabel),
    jobIdLabel: cleanText(section.jobIdLabel),
    goHomeLabel: cleanText(section.goHomeLabel),
  };

  if (
    Object.values(requiredStrings).some((value) => !value) ||
    !fields ||
    genderOptions.length === 0 ||
    workExperienceOptions.length === 0 ||
    noticePeriodOptions.length === 0 ||
    employeeRelationOptions.length === 0
  ) {
    return null;
  }

  return {
    jobDetails: {
      applyLabel: requiredStrings.applyLabel!,
      jobSummaryHeading: requiredStrings.jobSummaryHeading!,
      rolesHeading: requiredStrings.rolesHeading!,
      qualificationsHeading: requiredStrings.qualificationsHeading!,
      lookingForHeading: requiredStrings.lookingForHeading!,
      whyJoinHeading: requiredStrings.whyJoinHeading!,
      shareLabel: requiredStrings.shareLabel!,
      viewJobLabel: requiredStrings.viewJobLabel!,
      applyModal: {
        title: requiredStrings.applyModalTitle!,
        autofillResumeLabel: requiredStrings.autofillResumeLabel!,
        applyManuallyLabel: requiredStrings.applyManuallyLabel!,
        applyLinkedInLabel: requiredStrings.applyLinkedInLabel!,
        closeLabel: requiredStrings.closeLabel!,
      },
    },
    applicationForm: {
      title: requiredStrings.applicationFormTitle!,
      resumeHeading: requiredStrings.resumeHeading!,
      resumeHint: requiredStrings.resumeHint!,
      resumeUploadLabel: requiredStrings.resumeUploadLabel!,
      resumeRemoveLabel: requiredStrings.resumeRemoveLabel!,
      uploadResumeModal: {
        title: requiredStrings.uploadResumeModalTitle!,
        description: requiredStrings.uploadResumeModalDescription!,
        onlyUploadLabel: requiredStrings.onlyUploadLabel!,
        autofillResumeLabel: requiredStrings.autofillResumeLabel!,
        closeLabel: requiredStrings.closeLabel!,
      },
      confirmSubmissionModal: {
        title: requiredStrings.confirmSubmissionTitle!,
        description: requiredStrings.confirmSubmissionDescription!,
        goBackLabel: requiredStrings.goBackLabel!,
        submitLabel: requiredStrings.submitLabel!,
        closeLabel: requiredStrings.closeLabel!,
      },
      personalDetailsHeading: requiredStrings.personalDetailsHeading!,
      educationHeading: requiredStrings.educationHeading!,
      workExperienceHeading: requiredStrings.workExperienceHeading!,
      skillsHeading: requiredStrings.skillsHeading!,
      additionalInfoHeading: requiredStrings.additionalInfoHeading!,
      submitLabel: requiredStrings.submitLabel!,
      noRoleSelected: requiredStrings.noRoleSelected!,
      shareLabel: requiredStrings.shareLabel!,
      fields,
      genderOptions,
      workExperienceOptions,
      noticePeriodOptions,
      employeeRelationOptions,
    },
    applicationSuccess: {
      title: requiredStrings.applicationSuccessTitle!,
      descriptionLine1: requiredStrings.applicationSuccessDescriptionLine1!,
      descriptionLine2: requiredStrings.applicationSuccessDescriptionLine2!,
      appliedJobDetailsHeading: requiredStrings.appliedJobDetailsHeading!,
      jobTitleLabel: requiredStrings.jobTitleLabel!,
      jobIdLabel: requiredStrings.jobIdLabel!,
      goHomeLabel: requiredStrings.goHomeLabel!,
    },
  };
};

export const mapCareerLandingPage = (
  raw?: StrapiCareerLandingPageEntity | null,
): NormalizedCareerLandingPage => {
  if (!raw) return { ...EMPTY_CAREER_LANDING_PAGE };

  const openingsSection =
    raw.openingsSection ?? raw.currentOpeningsSection ?? null;

  return {
    seo: mapSeo(raw.seo),
    hero: mapHero(raw.heroSection ?? raw.hero),
    openings: mapOpeningsSection(openingsSection),
    lifeAt: mapLifeSection(raw.moreThanSection ?? raw.moreThanWorkplaceSection ?? raw.lifeAtSection),
    benefits: mapBenefitsSection(
      raw.investingSection ?? raw.investingInPeopleSection ?? raw.benefitsSection,
    ),
    faq: mapFaqSection(raw.FAQs ?? raw.faqSection),
    discover: mapDiscoverSection(raw.discoverSection),
    applicationFlow: mapApplicationFlow(raw.applicationFlowSection),
  };
};

const mergeCareerOpenings = (
  primary?: StrapiCareerOpeningEntity[] | null,
  embedded?: StrapiCareerOpeningEntity[] | null,
): NormalizedCareerJob[] => {
  const combined = [
    ...coerceArray<StrapiCareerOpeningEntity>(primary),
    ...coerceArray<StrapiCareerOpeningEntity>(embedded),
  ];

  const byKey = new Map<string, NormalizedCareerJob>();

  for (const opening of combined) {
    if (opening.isActive === false) continue;
    const mapped = mapCareerOpening(opening);
    if (!mapped) continue;
    const key = mapped.slug || mapped.id;
    if (!byKey.has(key)) {
      byKey.set(key, mapped);
    }
  }

  return [...byKey.values()].sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }
    return b.postedAt.localeCompare(a.postedAt);
  });
};

const deriveFilterOptionsFromJobs = (jobs: readonly NormalizedCareerJob[]) => ({
  locations: [...new Set(jobs.map((job) => job.location))].sort(),
  departments: [...new Set(jobs.map((job) => job.department))].sort(),
  experiences: [...new Set(jobs.map((job) => job.experienceLabel))].sort(),
});

export const mapCareerListingPage = (
  raw?: StrapiCareerListingPageEntity | null,
): NormalizedCareerListingPage => {
  if (!raw) return { ...EMPTY_CAREER_LISTING_PAGE };

  const cmsFilters = {
    locations: mapFilterOptions(raw.locationFilters),
    departments: mapFilterOptions(raw.departmentFilters),
    experiences: mapFilterOptions(raw.experienceFilters),
  };

  return {
    seo: mapSeo(raw.seo),
    hero: mapHero(raw.hero),
    featuredTitle: cleanText(raw.featuredTitle) ?? null,
    title: cleanText(raw.title) ?? null,
    mobileTitle: cleanText(raw.mobileTitle) ?? null,
    searchPlaceholder: cleanText(raw.searchPlaceholder) ?? null,
    mobileSearchPlaceholder: cleanText(raw.mobileSearchPlaceholder) ?? null,
    filtersTitle: cleanText(raw.filtersTitle) ?? null,
    filterLocationLabel: cleanText(raw.filterLocationLabel) ?? null,
    filterDepartmentLabel: cleanText(raw.filterDepartmentLabel) ?? null,
    filterExperienceLabel: cleanText(raw.filterExperienceLabel) ?? null,
    filterSelectPlaceholder: cleanText(raw.filterSelectPlaceholder) ?? null,
    openFiltersLabel: cleanText(raw.openFiltersLabel) ?? null,
    closeFiltersLabel: cleanText(raw.closeFiltersLabel) ?? null,
    emptyResultsMessage: cleanText(raw.emptyResultsMessage) ?? null,
    filterOptions: cmsFilters,
  };
};

export const mapCareersPageData = ({
  landing,
  listing,
  openings,
}: {
  landing?: StrapiCareerLandingPageEntity | null;
  listing?: StrapiCareerListingPageEntity | null;
  openings?: StrapiCareerOpeningEntity[] | null;
}): NormalizedCareersPageData => {
  const mappedLanding = mapCareerLandingPage(landing);
  const mappedListing = mapCareerListingPage(listing);
  const embeddedOpenings =
    landing?.openingsSection?.career_openings ??
    landing?.openingsSection?.careerOpenings ??
    landing?.openingsSection?.relatedCareerOpenings ??
    landing?.currentOpeningsSection?.relatedCareerOpenings ??
    null;
  const mappedJobs = mergeCareerOpenings(openings, embeddedOpenings);

  const derivedFilters = deriveFilterOptionsFromJobs(mappedJobs);
  const listingWithFilters =
    mappedListing.filterOptions.locations.length > 0 ||
    mappedListing.filterOptions.departments.length > 0 ||
    mappedListing.filterOptions.experiences.length > 0
      ? mappedListing
      : {
          ...mappedListing,
          filterOptions: derivedFilters,
        };

  const openingsCopy = mappedLanding.openings;
  const listingWithLandingFallback = {
    ...listingWithFilters,
    title: listingWithFilters.title ?? openingsCopy?.title ?? null,
    mobileTitle: listingWithFilters.mobileTitle ?? openingsCopy?.mobileTitle ?? null,
    searchPlaceholder:
      listingWithFilters.searchPlaceholder ?? openingsCopy?.subtitle ?? null,
    mobileSearchPlaceholder:
      listingWithFilters.mobileSearchPlaceholder ??
      listingWithFilters.searchPlaceholder ??
      openingsCopy?.subtitle ??
      null,
  };

  return {
    landing: mappedLanding,
    listing: listingWithLandingFallback,
    jobs: mappedJobs,
  };
};

export { EMPTY_CAREERS_PAGE_DATA };
