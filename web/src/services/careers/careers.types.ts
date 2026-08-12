import type {
  CareerBenefit,
  CareerFaqItem,
  CareerJob,
  CareerLifeHighlight,
  CareerQualificationGroup,
} from "@/features/careers/types";

export type StrapiCareerMediaFile = {
  url?: string | null;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
};

export type StrapiCareerResponsiveImage = {
  altText?: string | null;
  caption?: string | null;
  desktopImage?: StrapiCareerMediaFile | StrapiCareerMediaFile[] | null;
  mobileImage?: StrapiCareerMediaFile | StrapiCareerMediaFile[] | null;
};

export type StrapiCareerSeo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  metaKeywords?: string | null;
  showField?: boolean | null;
  ogImage?: StrapiCareerResponsiveImage | StrapiCareerMediaFile | null;
};

export type StrapiCareerCtaButton = {
  id?: number | string;
  label?: string | null;
  url?: string | null;
  targetType?: string | null;
  openInNewTab?: boolean | null;
};

export type StrapiCareerHero = {
  title?: string | null;
  ctaLabel?: string | null;
  /** CMS typo — live API uses `CtaLable` */
  CtaLable?: string | null;
  backgroundImage?: StrapiCareerResponsiveImage | null;
  image?: StrapiCareerResponsiveImage | null;
};

export type StrapiCareerFaqItem = {
  id?: number | string;
  question?: string | null;
  answer?: string | null;
};

export type StrapiCareerFaqSection = {
  sectionHeading?: string | null;
  heading?: string | null;
  faqItems?: StrapiCareerFaqItem[] | null;
};

export type StrapiCareerBenefitFeature = {
  id?: number | string;
  label?: string | null;
  title?: string | null;
  FeatureTitle?: string | null;
  description?: string | null;
  FeatureDescription?: string | null;
  icon?: StrapiCareerResponsiveImage | StrapiCareerMediaFile | null;
  image?: StrapiCareerResponsiveImage | null;
  featureImage?: StrapiCareerResponsiveImage | null;
};

export type StrapiCareerBenefitsSection = {
  sectionTitle?: string | null;
  title?: string | null;
  InvestingTitle?: string | null;
  sectionImage?: StrapiCareerResponsiveImage | null;
  image?: StrapiCareerResponsiveImage | null;
  features?: StrapiCareerBenefitFeature[] | null;
  benefitItems?: StrapiCareerBenefitFeature[] | null;
  InvestingFeatures?: StrapiCareerBenefitFeature[] | null;
};

export type StrapiCareerLifeSection = {
  title?: string | null;
  sectionTitle?: string | null;
  featuredTitle?: string | null;
  description?: string | null;
  content?: string | null;
  featuredBody?: string | null;
  quote?: string | null;
  featuredDescription?: string | null;
  leftImage?: StrapiCareerResponsiveImage | null;
  rightImage?: StrapiCareerResponsiveImage | null;
  featuredImage1?: StrapiCareerResponsiveImage | null;
  featuredImage2?: StrapiCareerResponsiveImage | null;
  featuredImages?: StrapiCareerResponsiveImage[] | null;
};

export type StrapiCareerDiscoverSection = {
  title?: string | null;
  heading?: string | null;
  ctaLabel?: string | null;
  ctaButtonLabel?: string | null;
  cta?: StrapiCareerCtaButton | null;
  backgroundImage?: StrapiCareerResponsiveImage | null;
};

export type StrapiCareerOpeningsSection = {
  sectionTitle?: string | null;
  title?: string | null;
  OpeningTitle?: string | null;
  mobileTitle?: string | null;
  sectionDescription?: string | null;
  subtitle?: string | null;
  description?: string | null;
  OpeningDescription?: string | null;
  ctaLabel?: string | null;
  viewAllLabel?: string | null;
  CtaLable?: string | null;
  relatedCareerOpenings?: StrapiCareerOpeningEntity[] | null;
  careerOpenings?: StrapiCareerOpeningEntity[] | null;
  career_openings?: StrapiCareerOpeningEntity[] | null;
};

export type StrapiCareerApplicationFormFields = {
  fullNameLabel?: string | null;
  phoneLabel?: string | null;
  emailLabel?: string | null;
  dateOfBirthLabel?: string | null;
  dateOfBirthPlaceholder?: string | null;
  fieldPlaceholder?: string | null;
  selectPlaceholder?: string | null;
  genderLabel?: string | null;
  highestDegreeLabel?: string | null;
  areaOfStudyLabel?: string | null;
  yearOfCompletionLabel?: string | null;
  relevantExperienceLabel?: string | null;
  currentCompanyLabel?: string | null;
  currentJobTitleLabel?: string | null;
  currentCtcLabel?: string | null;
  expectedCtcLabel?: string | null;
  noticePeriodLabel?: string | null;
  skillsSearchLabel?: string | null;
  skillsSearchPlaceholder?: string | null;
  skillsLabel?: string | null;
  languagesLabel?: string | null;
  companyRelationLabel?: string | null;
  companyRelationYes?: string | null;
  companyRelationNo?: string | null;
  employeeNameLabel?: string | null;
  employeeJobTitleLabel?: string | null;
};

export type StrapiCareerApplicationFlowSection = {
  applyLabel?: string | null;
  jobSummaryHeading?: string | null;
  rolesHeading?: string | null;
  qualificationsHeading?: string | null;
  lookingForHeading?: string | null;
  whyJoinHeading?: string | null;
  shareLabel?: string | null;
  viewJobLabel?: string | null;
  applyModalTitle?: string | null;
  autofillResumeLabel?: string | null;
  applyManuallyLabel?: string | null;
  applyLinkedInLabel?: string | null;
  closeLabel?: string | null;
  applicationFormTitle?: string | null;
  resumeHeading?: string | null;
  resumeHint?: string | null;
  resumeUploadLabel?: string | null;
  resumeRemoveLabel?: string | null;
  uploadResumeModalTitle?: string | null;
  uploadResumeModalDescription?: string | null;
  onlyUploadLabel?: string | null;
  confirmSubmissionTitle?: string | null;
  confirmSubmissionDescription?: string | null;
  goBackLabel?: string | null;
  submitLabel?: string | null;
  personalDetailsHeading?: string | null;
  educationHeading?: string | null;
  workExperienceHeading?: string | null;
  skillsHeading?: string | null;
  additionalInfoHeading?: string | null;
  noRoleSelected?: string | null;
  applicationSuccessTitle?: string | null;
  applicationSuccessDescriptionLine1?: string | null;
  applicationSuccessDescriptionLine2?: string | null;
  appliedJobDetailsHeading?: string | null;
  jobTitleLabel?: string | null;
  jobIdLabel?: string | null;
  goHomeLabel?: string | null;
  genderOptions?: string[] | null;
  workExperienceOptions?: string[] | null;
  noticePeriodOptions?: string[] | null;
  employeeRelationOptions?: string[] | null;
  formFields?: StrapiCareerApplicationFormFields | null;
};

export type StrapiCareerLandingPageEntity = {
  /** Live CMS uses uppercase `SEO` (shared.seo component). */
  SEO?: StrapiCareerSeo | null;
  seo?: StrapiCareerSeo | null;
  heroSection?: StrapiCareerHero | null;
  FAQs?: StrapiCareerFaqSection | null;
  moreThanSection?: StrapiCareerLifeSection | null;
  investingSection?: StrapiCareerBenefitsSection | null;
  discoverSection?: StrapiCareerDiscoverSection | null;
  openingsSection?: StrapiCareerOpeningsSection | null;
  applicationFlowSection?: StrapiCareerApplicationFlowSection | null;
  /** Legacy / alternate keys */
  hero?: StrapiCareerHero | null;
  currentOpeningsSection?: StrapiCareerOpeningsSection | null;
  moreThanWorkplaceSection?: StrapiCareerLifeSection | null;
  lifeAtSection?: StrapiCareerLifeSection | null;
  investingInPeopleSection?: StrapiCareerBenefitsSection | null;
  benefitsSection?: StrapiCareerBenefitsSection | null;
  faqSection?: StrapiCareerFaqSection | null;
};

export type StrapiCareerFilterSectionItem = {
  id?: number | string;
  ItemName?: string | null;
};

export type StrapiCareerFilterSectionGroup = {
  id?: number | string;
  FeaturedTitle?: string | null;
  Items?: StrapiCareerFilterSectionItem[] | null;
};

export type StrapiCareerListingFilterSection = {
  id?: number | string;
  /** CMS typo — live API uses `fiterTitle` */
  fiterTitle?: string | null;
  filterTitle?: string | null;
  Location?: StrapiCareerFilterSectionGroup | null;
  Department?: StrapiCareerFilterSectionGroup | null;
  Experience?: StrapiCareerFilterSectionGroup | null;
};

export type StrapiCareerListingPageEntity = {
  /** Live CMS uses uppercase `SEO` (shared.seo component). */
  SEO?: StrapiCareerSeo | null;
  seo?: StrapiCareerSeo | null;
  hero?: StrapiCareerHero | null;
  heroSection?: StrapiCareerHero | null;
  featuredTitle?: string | null;
  title?: string | null;
  mobileTitle?: string | null;
  searchPlaceholder?: string | null;
  mobileSearchPlaceholder?: string | null;
  filterSection?: StrapiCareerListingFilterSection | null;
  /** Legacy flat filter fields — prefer `filterSection` when present */
  filtersTitle?: string | null;
  filterLocationLabel?: string | null;
  filterDepartmentLabel?: string | null;
  filterExperienceLabel?: string | null;
  filterSelectPlaceholder?: string | null;
  openFiltersLabel?: string | null;
  closeFiltersLabel?: string | null;
  emptyResultsMessage?: string | null;
  locationFilters?: Array<{ id?: number | string; label?: string | null; value?: string | null }> | string[] | null;
  departmentFilters?: Array<{ id?: number | string; label?: string | null; value?: string | null }> | string[] | null;
  experienceFilters?: Array<{ id?: number | string; label?: string | null; value?: string | null }> | string[] | null;
};

export type StrapiCareerQualificationGroup = {
  id?: number | string;
  label?: string | null;
  text?: string | null;
  description?: string | null;
};

export type StrapiCareerJobDescriptionSection = {
  id?: number | string;
  sectionTitle?: string | null;
  sectionContent?: string | null;
};

export type StrapiCareerQualificationsAndExperience = {
  id?: number | string;
  sectionTitle?: string | null;
  education?: StrapiCareerJobDescriptionSection | null;
  experience?: StrapiCareerJobDescriptionSection | null;
};

export type StrapiCareerJobDescription = {
  id?: number | string;
  jobSummary?: StrapiCareerJobDescriptionSection | null;
  rolesAndResponsibilities?: StrapiCareerJobDescriptionSection | null;
  skills?: StrapiCareerJobDescriptionSection | null;
  whatWeAreLookingFor?: StrapiCareerJobDescriptionSection | null;
  whyJoinUs?: StrapiCareerJobDescriptionSection | null;
  additionalInfo?: StrapiCareerJobDescriptionSection | null;
  qualificationsAndExperience?: StrapiCareerQualificationsAndExperience | null;
};

export type StrapiCareerOpeningEntity = {
  id?: number | string;
  documentId?: string | null;
  jobID?: string | null;
  jobId?: string | null;
  slug?: string | null;
  jobTitle?: string | null;
  title?: string | null;
  location?: string | null;
  department?: string | null;
  requiredExperience?: string | null;
  experience?: string | null;
  employmentType?: string | null;
  summary?: string | null;
  jobDescription?: StrapiCareerJobDescription | string | null;
  description?: string | null;
  applyCta?: StrapiCareerCtaButton | string | null;
  applyCtaLabel?: string | null;
  applyLabel?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  isFeatured?: boolean | null;
  isNew?: boolean | null;
  workplaceType?: string | null;
  workplaceLabel?: string | null;
  publishedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  postedAt?: string | null;
  jobSummary?: string | null;
  rolesAndResponsibilities?: string | null;
  qualifications?: StrapiCareerQualificationGroup[] | null;
  whatWeAreLookingFor?: string | null;
  whyJoinUs?: string | null;
  responsibilities?: string[] | null;
  requirements?: string[] | null;
  seo?: StrapiCareerSeo | null;
};

export type NormalizedCareerResponsiveImage = {
  desktopUrl: string;
  mobileUrl: string;
  alt: string;
  width?: number;
  height?: number;
};

export type NormalizedCareerSeo = {
  metaTitle: string;
  metaDescription: string;
  canonicalPath: string;
  metaKeywords?: string;
  ogImageUrl?: string;
};

export type NormalizedCareerHero = {
  title: string;
  ctaLabel: string;
  image: NormalizedCareerResponsiveImage;
};

export type NormalizedCareerOpeningsSection = {
  title: string;
  mobileTitle: string;
  subtitle: string;
  viewAllLabel: string;
  relatedJobIds: string[];
};

export type NormalizedCareerLifeSection = {
  title: string;
  description: string;
  quote?: string;
  leftImage: NormalizedCareerResponsiveImage;
  rightImage: NormalizedCareerResponsiveImage;
  highlights: readonly CareerLifeHighlight[];
};

export type NormalizedCareerBenefitsSection = {
  title: string;
  /** Optional — accordion still renders when CMS media is not yet uploaded. */
  image: NormalizedCareerResponsiveImage | null;
  items: readonly CareerBenefit[];
};

export type NormalizedCareerDiscoverSection = {
  title: string;
  ctaLabel: string;
  image: NormalizedCareerResponsiveImage;
};

export type NormalizedCareerFaqSection = {
  title: string;
  items: readonly CareerFaqItem[];
};

export type NormalizedCareerApplicationFormFields = {
  fullNameLabel: string;
  phoneLabel: string;
  emailLabel: string;
  dateOfBirthLabel: string;
  dateOfBirthPlaceholder: string;
  fieldPlaceholder: string;
  selectPlaceholder: string;
  genderLabel: string;
  highestDegreeLabel: string;
  areaOfStudyLabel: string;
  yearOfCompletionLabel: string;
  relevantExperienceLabel: string;
  currentCompanyLabel: string;
  currentJobTitleLabel: string;
  currentCtcLabel: string;
  expectedCtcLabel: string;
  noticePeriodLabel: string;
  skillsSearchLabel: string;
  skillsSearchPlaceholder: string;
  skillsLabel: string;
  languagesLabel: string;
  companyRelationLabel: string;
  companyRelationYes: string;
  companyRelationNo: string;
  employeeNameLabel: string;
  employeeJobTitleLabel: string;
};

export type NormalizedCareerApplicationFlow = {
  jobDetails: {
    applyLabel: string;
    jobSummaryHeading: string;
    rolesHeading: string;
    qualificationsHeading: string;
    skillsHeading: string;
    lookingForHeading: string;
    whyJoinHeading: string;
    additionalInfoHeading: string;
    shareLabel: string;
    viewJobLabel: string;
    applyModal: {
      title: string;
      autofillResumeLabel: string;
      applyManuallyLabel: string;
      applyLinkedInLabel: string;
      closeLabel: string;
    };
  };
  applicationForm: {
    title: string;
    resumeHeading: string;
    resumeHint: string;
    resumeUploadLabel: string;
    resumeRemoveLabel: string;
    uploadResumeModal: {
      title: string;
      description: string;
      onlyUploadLabel: string;
      autofillResumeLabel: string;
      closeLabel: string;
    };
    confirmSubmissionModal: {
      title: string;
      description: string;
      goBackLabel: string;
      submitLabel: string;
      closeLabel: string;
    };
    personalDetailsHeading: string;
    educationHeading: string;
    workExperienceHeading: string;
    skillsHeading: string;
    additionalInfoHeading: string;
    submitLabel: string;
    noRoleSelected: string;
    shareLabel: string;
    fields: NormalizedCareerApplicationFormFields;
    genderOptions: readonly string[];
    workExperienceOptions: readonly string[];
    noticePeriodOptions: readonly string[];
    employeeRelationOptions: readonly string[];
  };
  applicationSuccess: {
    title: string;
    descriptionLine1: string;
    descriptionLine2: string;
    appliedJobDetailsHeading: string;
    jobTitleLabel: string;
    jobIdLabel: string;
    goHomeLabel: string;
  };
};

export type NormalizedCareerListingPage = {
  seo: NormalizedCareerSeo | null;
  hero: NormalizedCareerHero | null;
  featuredTitle: string | null;
  title: string | null;
  mobileTitle: string | null;
  searchPlaceholder: string | null;
  mobileSearchPlaceholder: string | null;
  filtersTitle: string | null;
  filterLocationLabel: string | null;
  filterDepartmentLabel: string | null;
  filterExperienceLabel: string | null;
  filterSelectPlaceholder: string | null;
  openFiltersLabel: string | null;
  closeFiltersLabel: string | null;
  emptyResultsMessage: string | null;
  filterOptions: {
    locations: string[];
    departments: string[];
    experiences: string[];
  };
};

export type NormalizedCareerLandingPage = {
  seo: NormalizedCareerSeo | null;
  hero: NormalizedCareerHero | null;
  openings: NormalizedCareerOpeningsSection | null;
  lifeAt: NormalizedCareerLifeSection | null;
  benefits: NormalizedCareerBenefitsSection | null;
  discover: NormalizedCareerDiscoverSection | null;
  faq: NormalizedCareerFaqSection | null;
  applicationFlow: NormalizedCareerApplicationFlow | null;
};

export type NormalizedCareerJob = CareerJob & {
  documentId?: string;
  slug: string;
  applyLabel?: string;
  descriptionHtml?: string;
  sortOrder: number;
  isActive: boolean;
};

export type NormalizedCareersPageData = {
  landing: NormalizedCareerLandingPage;
  listing: NormalizedCareerListingPage;
  jobs: NormalizedCareerJob[];
};

export const EMPTY_CAREER_LANDING_PAGE: NormalizedCareerLandingPage = {
  seo: null,
  hero: null,
  openings: null,
  lifeAt: null,
  benefits: null,
  discover: null,
  faq: null,
  applicationFlow: null,
};

export const EMPTY_CAREER_LISTING_PAGE: NormalizedCareerListingPage = {
  seo: null,
  hero: null,
  featuredTitle: null,
  title: null,
  mobileTitle: null,
  searchPlaceholder: null,
  mobileSearchPlaceholder: null,
  filtersTitle: null,
  filterLocationLabel: null,
  filterDepartmentLabel: null,
  filterExperienceLabel: null,
  filterSelectPlaceholder: null,
  openFiltersLabel: null,
  closeFiltersLabel: null,
  emptyResultsMessage: null,
  filterOptions: {
    locations: [],
    departments: [],
    experiences: [],
  },
};

export const EMPTY_CAREERS_PAGE_DATA: NormalizedCareersPageData = {
  landing: EMPTY_CAREER_LANDING_PAGE,
  listing: EMPTY_CAREER_LISTING_PAGE,
  jobs: [],
};

export type CareerJobSubmissionPayload = {
  jobID: string;
  jobTitle: string;
  location: string;
  department: string;
  experience: string;
  personalDetails: Record<string, unknown>;
  educationDetails: Record<string, unknown>;
  workExperience: Record<string, unknown>;
  skillsAndLanguages: Record<string, unknown>;
  addInfo: Record<string, unknown>;
};

export type { CareerQualificationGroup };
