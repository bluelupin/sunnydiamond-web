export type CareerJobType = "Full-time" | "Part-time" | "Contract";

export type CareerJob = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: CareerJobType;
  postedAt: string;
  summary: string;
  responsibilities: readonly string[];
  requirements: readonly string[];
  isNew?: boolean;
};

export type CareerFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type CareerBenefit = {
  id: string;
  label: string;
  description: string;
  iconSrc: string;
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
