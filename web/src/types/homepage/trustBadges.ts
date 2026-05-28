export type TrustBadge = {
  id?: number;
  label?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type TrustBadgesData = {
  trustBadges?: TrustBadge[];
};

