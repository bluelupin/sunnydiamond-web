/**
 * UI chrome defaults for fields not returned / not modeled by Strapi.
 * Media for hero, get-in-touch, and vision steps comes from CMS only.
 */
export const bespokeUiDefaults = {
  pastCreationsTitle: "Past Creations",
  secondaryCtaLabel: "See Past Creations",
  modalCtaLabel: "Save as Inspiration",
  modalCtaHref: "/wishlist",
  visionPlaceholder: "I am looking to get a necklace with a pear shaped diamond pendant",
  formCloseAriaLabel: "Close start your custom creation panel",
  formSuccessToast: {
    title: "Request submitted",
    description: "Our representative will get in touch with you soon.",
  },
} as const;
