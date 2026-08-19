export const STRAPI_ENDPOINTS = {
  homepageShell: "api/homepage/shell",
  homepageEditorialBlocks: "api/homepage/editorial-blocks",
  homepageShoppingBlocks: "api/homepage/shopping-blocks",
  learnAboutDiamondsPage: "api/learn-about-diamonds-page",
  aboutPage: "api/about-page",
  productDisplayPage: "api/product-display-page",
  /** Jewellery PLP (`/jewellery`) — SEO + landing content */
  productLandingPage: "api/product-landing-page",
  contactBespokePage: "api/contact-bespoke-page",
  featuredStories: "api/featured-stories",
  /** Store locator page — hero, filters, showrooms, SEO (deep-populated). */
  storeLocatorPage: "api/store-locator-page",
  /** Help & Support / FAQs page — contact options, FAQs, SEO. */
  supportPage: "api/support-page",
  /** Contact Us page — hero, contact options, enquiry form, Visit Us, SEO. */
  contactPage: "api/contact-page",
  /** Diamonds for Everyone marketing page — hero, plan, investment, benefits, FAQ, SEO. */
  diamondsForEveryonePage: "api/diamonds-for-everyone-page",
  /** Gifting marketing page — hero, occasions, gift finder, gift card, trust badges, SEO. */
  giftingPage: "api/gifting-page",
  occasions: "api/occasions",
  /** PDP size dropdown + chart drawer — fetch all, match by `name` / category */
  sizeGuides: "api/size-guides",
  genericForms: "api/generic-forms",
  genericSubmissions: "api/generic-submissions",
  /** Custom CMS action — flat JSON (contact enquiry, Magento-aware Book a Visit). */
  genericSubmissionsSubmit: "api/generic-submissions/submit",
  productForms: "api/product-forms",
  productSubmissions: "api/product-submissions",
  /** Custom CMS action — accepts multipart `data` + `uploadedImage` (Postman-verified). */
  productSubmissionsSubmit: "api/product-submissions/submit",
  /** Custom creation submit — JSON or multipart `data` + `referenceImage`. */
  bespokeSubmissionsSubmit: "api/bespoke-submissions/submit",
  /** Authenticated customer appointments (Bearer Magento customer token). */
  customerAppointments: "api/customer/appointments",
  /** Authenticated customer saved bespoke creations. */
  customerSavedCreations: "api/customer/saved-creations",
  careerLandingPage: "api/career-landing-page",
  careerListingPage: "api/career-listing-page",
  careerOpenings: "api/career-openings",
  jobOpeningSubmissions: "api/submissions-job-openings",
  /** Custom CMS action — multipart `data` + `resume` (Postman-verified). */
  jobOpeningSubmissionsSubmit: "api/submissions-job-openings/submit",
  blogLandingPage: "api/blog-landing-page",
  blogCategories: "api/blog-categories",
  blogPosts: "api/blog-posts",
  policyCertificationsPage: "api/policy-certifications-page",
  legalPages: "api/legal-pages",
  /** Homepage single-type — used for SEO fields the shell endpoint omits (metaKeywords). */
  homepage: "api/homepage",
} as const;

export type StrapiEndpoint = (typeof STRAPI_ENDPOINTS)[keyof typeof STRAPI_ENDPOINTS];
