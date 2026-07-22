/**
 * Local media assets only — used when Strapi returns text/structure but nested
 * media is missing (known populate gaps). No marketing copy lives here.
 */
export const bespokeMediaFallbacks = {
  hero: {
    desktop: "/images/bespoke/hero.jpg",
    mobile: "/images/bespoke/hero.jpg",
    alt: "Bespoke jewellery",
  },
  interested: {
    desktop: "/images/bespoke/interested.jpg",
    mobile: "/images/bespoke/interested.jpg",
    alt: "Bespoke jewellery",
  },
  storyVideo: "/videos/Bespoke-story-video.mp4",
  storySteps: [
    {
      src: "/images/bespoke/story-step-01.jpg",
      alt: "Bespoke design process",
    },
    {
      src: "/images/bespoke/story-step-02.jpg",
      alt: "Bespoke craftsmanship",
    },
    {
      src: "/images/bespoke/story-step-03.jpg",
      alt: "Finished bespoke jewellery",
    },
  ],
} as const;

/** UI chrome not modeled in Strapi customDesignForm / featured CTAs. */
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
