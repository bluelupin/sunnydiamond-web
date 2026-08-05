export type CareerJobType = "Full-time" | "Part-time" | "Contract";

export type CareerQualificationGroup = {
  label: string;
  text: string;
};

export type CareerJob = {
  id: string;
  slug: string;
  jobCode: string;
  title: string;
  department: string;
  location: string;
  type: CareerJobType;
  postedAt: string;
  summary: string;
  experienceLabel: string;
  workplaceLabel: string;
  responsibilities: readonly string[];
  requirements: readonly string[];
  jobSummary?: string;
  jobSummaryTitle?: string;
  rolesAndResponsibilities?: string;
  rolesTitle?: string;
  skills?: string;
  skillsTitle?: string;
  qualifications?: readonly CareerQualificationGroup[];
  qualificationsTitle?: string;
  whatWeAreLookingFor?: string;
  whatWeAreLookingForTitle?: string;
  whyJoinUs?: string;
  whyJoinUsTitle?: string;
  additionalInfo?: string;
  additionalInfoTitle?: string;
  descriptionHtml?: string;
  applyLabel?: string;
  isNew?: boolean;
  isFeatured?: boolean;
};

export type CareersFlowStep =
  | "landing"
  | "listings"
  | "detail"
  | "application"
  | "success";

export type CareersApplicationEntry = "resume" | "manual" | "linkedin";

export type CareerFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type CareerBenefit = {
  id: string;
  label: string;
  description: string;
  iconSrc?: string;
  image?: {
    desktopUrl: string;
    mobileUrl: string;
    alt: string;
    width?: number;
    height?: number;
  };
};

export type CareerLifeHighlight = {
  id: string;
  title: string;
  description: string;
  image: {
    desktopUrl: string;
    mobileUrl: string;
    alt: string;
  };
};
