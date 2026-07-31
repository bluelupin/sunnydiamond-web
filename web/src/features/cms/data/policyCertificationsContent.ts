export type PolicyAccordionSection = {
  id: string;
  title: string;
  intro?: string;
  listItems?: string[];
  body?: string;
};

export type PolicyDocument = {
  id: string;
  navLabel: string;
  /** Mobile nav label when it differs from desktop sidebar text. */
  mobileNavLabel?: string;
  contentTitle: string;
  sections: PolicyAccordionSection[];
};

export type PolicyNavGroup = {
  id: string;
  label: string;
  items: PolicyDocument[];
};
