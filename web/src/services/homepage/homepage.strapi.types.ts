/** Loose Strapi DTO shapes for homepage custom endpoints (CMS field names). */

import type { HomepageSeo } from "@/types/homepage/seo";
import type { FooterLinkGroup, HeaderNavLink } from "@/shared/lib/shellNavigation";

export type StrapiHomepageCta = {
  id?: number;
  label?: string | null;
  url?: string | null;
  targetType?: string | null;
  openInNewTab?: boolean | null;
};

export type StrapiResponsiveImageBlock = {
  id?: number;
  altText?: string | null;
  desktopImage?: unknown;
  mobileImage?: unknown;
};

export type StrapiHeroVideoBlock = {
  id?: number;
  altText?: string | null;
  heroVideo?: { url?: string | null } | null;
};

export type StrapiHomepageHero = {
  id?: number;
  eyebrow?: string | null;
  title?: string | null;
  mainTitle?: string | null;
  subtitle?: string | null;
  showField?: boolean | null;
  isActive?: boolean | null;
  cta?: StrapiHomepageCta | null;
  ctaButton?: StrapiHomepageCta | null;
  primaryCta?: StrapiHomepageCta | null;
  secondaryCta?: StrapiHomepageCta | null;
  image?: StrapiResponsiveImageBlock | null;
  imageBackground?: StrapiResponsiveImageBlock | null;
  videoBackground?: StrapiHeroVideoBlock | null;
};

export type StrapiFooterTickerItem = {
  id?: number;
  label?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  showField?: boolean | null;
};

export type StrapiGlobalShell = {
  headerNavigationLinks?: HeaderNavLink[] | null;
  footerLinkGroups?: FooterLinkGroup[] | null;
  footerCopyright?: string | null;
  socialLinks?: unknown[] | null;
  defaultSeo?: HomepageSeo | null;
  /** Site-wide marquee ticker (Global config). */
  footerTickerItems?: StrapiFooterTickerItem[] | null;
};

export type StrapiHomepageShellEntity = {
  global?: StrapiGlobalShell | null;
  homepage?: {
    hero?: StrapiHomepageHero | null;
    seo?: Record<string, unknown> | null;
  } | null;
  hero?: StrapiHomepageHero | null;
};

export type StrapiCategoryCard = {
  id?: number;
  title?: string | null;
  label?: string | null;
  slug?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  image?: StrapiResponsiveImageBlock | null;
  cutoutImage?: StrapiResponsiveImageBlock | null;
  hoverImage?: StrapiResponsiveImageBlock | null;
  cta?: StrapiHomepageCta | null;
};

export type StrapiProductSkuItem = {
  id?: number;
  sku?: string | null;
};

export type StrapiEditorialCollection = {
  id?: number;
  documentId?: string;
  collectionName?: string | null;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  featuredProductSku?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  cta?: StrapiHomepageCta | null;
  productSkus?: StrapiProductSkuItem[] | null;
  backgroundImage?: StrapiResponsiveImageBlock | null;
};

/** Legacy flat featured-collection block + new collection-showcase shape. */
export type StrapiFeaturedCollection = {
  id?: number;
  sectionTitle?: string | null;
  title?: string | null;
  description?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  magentoCollectionRef?: string | null;
  cta?: StrapiHomepageCta | null;
  primaryImage?: StrapiResponsiveImageBlock | null;
  backgroundImage?: StrapiResponsiveImageBlock | null;
  image?: StrapiResponsiveImageBlock | null;
  products?: unknown[] | null;
  /** New showcase wrapper */
  eyebrow?: string | null;
  collections?: StrapiEditorialCollection[] | null;
};

export type StrapiFeaturedProductsBlock = {
  id?: number;
  sectionTitle?: string | null;
  title?: string | null;
  description?: string | null;
  subtitle?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  cta?: StrapiHomepageCta | null;
  products?: unknown[] | null;
};

export type StrapiGiftingBanner = {
  id?: number;
  title?: string | null;
  description?: string | null;
  subtitle?: string | null;
  mobileDescription?: string | null;
  mobileSubtitle?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  cta?: StrapiHomepageCta | null;
  primaryCta?: StrapiHomepageCta | null;
  secondaryCta?: StrapiHomepageCta | null;
  secondary?: StrapiHomepageCta | null;
  backgroundImage?: StrapiResponsiveImageBlock | null;
  cutoutImage?: StrapiResponsiveImageBlock | null;
  sideImage?: unknown;
  image?: StrapiResponsiveImageBlock | null;
};

export type StrapiTrustBadge = {
  id?: number;
  label?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  icon?: unknown;
};

export type StrapiHomepageShoppingBlocksEntity = {
  trustBadges?: StrapiTrustBadge[] | null;
  categoryCards?: StrapiCategoryCard[] | null;
  categoryNavigation?: StrapiCategoryCard[] | null;
  featuredCollection?: StrapiFeaturedCollection | null;
  featuredCollectionSection?: StrapiFeaturedCollection | null;
  featuredProducts?: StrapiFeaturedProductsBlock | null;
  featuredProductsSection?: StrapiFeaturedProductsBlock | null;
  giftingBanner?: StrapiGiftingBanner | null;
};

export type StrapiTextSection = {
  id?: number;
  title?: string | null;
  sectionTitle?: string | null;
  description?: string | null;
  subtitle?: string | null;
  eyebrow?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  cta?: StrapiHomepageCta | null;
  primaryCta?: StrapiHomepageCta | null;
  secondaryCta?: StrapiHomepageCta | null;
  image?: StrapiResponsiveImageBlock | null;
  cutoutImage?: StrapiResponsiveImageBlock | null;
  gifOrImage?: unknown;
  video?: StrapiHeroVideoBlock | null;
  posterImage?: unknown;
  steps?: unknown[] | null;
};

export type StrapiShowroomSection = {
  id?: number;
  sectionTitle?: string | null;
  description?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  cta?: StrapiHomepageCta | null;
  image?: StrapiResponsiveImageBlock | null;
  showrooms?: unknown[] | null;
  sortOrder?: number | null;
};

export type StrapiOccasionSection = {
  id?: number;
  sectionTitle?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  occasions?: unknown[] | null;
};

export type StrapiOccasionCard = {
  id?: number;
  title?: string | null;
  description?: string | null;
  subtitle?: string | null;
  slug?: string | null;
  filterSlug?: string | null;
  sortOrder?: number | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  cta?: StrapiHomepageCta | null;
  image?: StrapiResponsiveImageBlock | null;
};

export type StrapiCraftingBrillianceSection = {
  id?: number;
  title?: string | null;
  sectionTitle?: string | null;
  isActive?: boolean | null;
  showField?: boolean | null;
  cta?: StrapiHomepageCta | null;
  backgroundImage?: StrapiResponsiveImageBlock | null;
  cutoutImage?: StrapiResponsiveImageBlock | null;
};

export type StrapiHomepageEditorialBlocksEntity = {
  sunnyPromise?: StrapiTextSection | null;
  sunnyPromiseSection?: StrapiTextSection | null;
  bespokeForYou?: StrapiTextSection | null;
  bespokeForYouSection?: StrapiTextSection | null;
  diamondsForEveryone?: StrapiTextSection | null;
  diamondsForEveryoneSection?: StrapiTextSection | null;
  diamondSourcingSection?: StrapiTextSection | null;
  craftsmanshipSection?: StrapiTextSection | null;
  occasionSection?: StrapiOccasionSection | null;
  showroom?: StrapiShowroomSection | null;
  showroomSection?: StrapiShowroomSection | null;
  craftingBrillianceSection?: StrapiCraftingBrillianceSection | null;
  bespokeForYouCards?: unknown[] | null;
  showroomTeaser?: unknown;
};
