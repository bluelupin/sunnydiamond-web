export const contactMobileFigmaSpec = {
  /** Figma node 1480:177909 — mobile contact page */
  contentPadding: {
    x: 16,
    y: 64,
  },
  sectionGap: 64,
  hero: {
    height: 240,
    titleSize: 32,
    imageCrop: {
      left: "-41.17%",
      width: "182.42%",
      top: "2.34%",
      height: "100%",
    },
  },
} as const;

export const contactHeroFigmaSpec = {
  /** Figma node 1480:178047 — contact page hero banner */
  height: {
    mobile: 240,
    desktop: 320,
  },
  imageCrop: {
    heightScale: "253.26%",
    topOffset: "-108.25%",
  },
  overlayOpacity: 0.4,
  titleTop: {
    mobile: 152,
    desktop: 203,
  },
} as const;

export const contactPageContent = {
  hero: {
    title: "Contact Us",
    image: {
      /** Exported from Figma UI-Production node 1480:178047 */
      desktopUrl: "/images/contact/hero.png",
      mobileUrl: "/images/contact/hero.png",
      alt: "Sunny Diamonds team at a consultation",
      width: 1672,
      height: 941,
    },
  },
  intro: {
    description:
      "Connect with our team for personalised assistance. We're always here to help with any questions you may have",
    mobileDescription:
      "Explore and find creations designed to celebrate the people and moments that matter most.",
  },
  infoCards: [
    {
      id: "call",
      title: "Call Us",
      hours: [
        { label: "Monday to Saturday", value: "9:00 AM to 7:00 PM" },
        { label: "Sunday:", value: "9:00 AM to 4:00 PM" },
      ],
      link: {
        label: "+91 9744355555",
        href: "tel:+919744355555",
      },
    },
    {
      id: "email",
      title: "Email Us",
      mobileTitle: "Email",
      description:
        "Our customer support team would be delighted to help resolve your concerns",
      link: {
        label: "GET INTOUCH@SUNNYDIAMONDS.COM",
        href: "mailto:getintouch@sunnydiamonds.com",
      },
    },
    {
      id: "concierge",
      title: "Personal Concierge",
      description: "Get quick assistance from our dedicated member of our team",
      link: {
        label: "WHATSAPP",
        href: "https://wa.me/919744355555",
      },
    },
  ],
  form: {
    title: "Reach Out to Us",
    formTag: "contact-us",
    submitLabel: "SUBMIT",
    successTitle: "Message sent",
    successDescription: "We'll get back to you within 24 hours.",
    fields: {
      nameLabel: "Full Name*",
      phoneLabel: "Phone No.*",
      emailLabel: "Email ID*",
      reasonLabel: "Reason for contacting us*",
      reasonPlaceholder: "Select a reason",
      mobileReasonPlaceholder: "Select",
      messageLabel: "Message*",
      messagePlaceholder: "Enter your message",
      mobileMessagePlaceholder: "Tell us more about why you are reaching out to us",
      mobileFieldPlaceholder: "Enter",
    },
    reasonOptions: [
      "I want to purchase jewellery for my wedding",
      "Product enquiry",
      "Order support",
      "Bespoke jewellery consultation",
      "Store visit enquiry",
      "Other",
    ],
    consentPrefix: "I agree to the",
    consentSuffix: ". My data will be stored for 90 days.*",
    mobileConsentSuffix: ". My data will be stored for 90 days.",
    termsLabel: "TERMS & CONDITIONS",
    mobileTermsLabel: "Terms and Conditions",
    privacyLabel: "PRIVACY POLICY",
    mobilePrivacyLabel: "Privacy Policy",
    consentError: "Please accept the terms and privacy policy to continue.",
  },
  visitUs: {
    title: "Visit Us",
    description: "Schedule your store visit and we'll be ready to welcome you.",
    ctaLabel: "BOOK A VISIT",
    image: {
      src: "/images/contact/visit-us.png",
      mobileSrc: "/images/contact/visit-us-mobile.png",
      alt: "Sunny Diamonds showroom interior",
    },
  },
} as const;
