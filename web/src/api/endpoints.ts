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
  occasions: "api/occasions",
  genericForms: "api/generic-forms",
  genericSubmissions: "api/generic-submissions",
  productForms: "api/product-forms",
  productSubmissions: "api/product-submissions",
  /** Custom CMS action — accepts multipart `data` + `uploadedImage` (Postman-verified). */
  productSubmissionsSubmit: "api/product-submissions/submit",
  /** Custom creation submit — JSON or multipart `data` + `referenceImage`. */
  bespokeSubmissionsSubmit: "api/bespoke-submissions/submit",
  /** @deprecated Legacy single-type slug — prefer split homepage endpoints */
  homepage: "homepage",
} as const;

export type StrapiEndpoint = (typeof STRAPI_ENDPOINTS)[keyof typeof STRAPI_ENDPOINTS];
