export type DiamondSourcingSectionData = {
  id?: number;
  sectionTitle?: string;
  description?: string;
  isActive?: boolean;
};

export type HomepageResponse = {
  diamondSourcingSection?: DiamondSourcingSectionData;
  [key: string]: unknown;
};
