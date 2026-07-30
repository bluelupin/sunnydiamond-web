export const diamondsForEveryoneHeroFigmaSpec = {
  /** Figma node 1052:66687 — page hero banner (aligned with contact/store locator pattern) */
  height: {
    mobile: 240,
    desktop: 320,
  },
  overlayOpacity: 0.4,
  titleTop: {
    mobile: 152,
    desktop: 203,
  },
} as const;

export const diamondsForEveryonePageContent = {
  hero: {
    title: "Diamonds for Everyone",
    image: {
      desktopUrl: "/images/diamonds-for-everyone/hero.png",
      mobileUrl: "/images/diamonds-for-everyone/hero.png",
      alt: "Diamond jewellery at Sunny Diamonds",
    },
  },
  planBanner: {
    title: "11+1 plan",
    description:
      "A smarter way to own fine jewellery, start with Diamond For Everyone at just ₹1,000 a month and enjoy the 12th installment free.",
    image: {
      src: "/images/diamonds-for-everyone/plan-banner.png",
      alt: "",
    },
  },
  investment: {
    title: "Plan Your Investment",
    monthlyLabel: "Define your monthly savings amount",
    summaryTitle: "Your 12 Month Investments Summary",
    contributionLabel: "Your Contribution",
    freeInstallmentLabel: "12th Instalment",
    freeInstallmentValue: "Free",
    totalLabel: "Total Value",
    ctaLabel: "START INVESTING",
    investPath: "/diamonds-for-everyone/invest",
    minMonthly: 1000,
    maxMonthly: 50000,
    step: 500,
    defaultMonthly: 5000,
    monthsPaid: 11,
    totalMonths: 12,
  },
  lifestyle: {
    image: {
      src: "/images/diamonds-for-everyone/lifestyle.png",
      alt: "Sunny Diamonds lifestyle",
    },
  },
  savingsPlan: {
    eyebrow: "FLEXIBLE SAVINGS PLAN",
    title: "Diamonds for Everyone",
    subtitle: "Start today and take the first step towards owning a Sunny Diamonds creation",
    steps: [
      {
        stepNumber: 1,
        description: "Begin your journey with monthly instalments starting from ₹1,000.",
      },
      {
        stepNumber: 2,
        description: "We pay the final instalment for the 12th month on your behalf",
      },
      {
        stepNumber: 3,
        description: "Use your accumulated savings for a timeless Sunny Diamonds creation.",
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        id: "what-is-dfe",
        question: "What is the Diamonds for Everyone Plan?",
        answer:
          "The Diamonds for Everyone Plan is a systematic plan that allows customers to save a fixed amount every month and redeem the accumulated value to purchase jewellery at the end of the scheme period.",
      },
      {
        id: "duration",
        question: "What is the duration of the scheme?",
        answer:
          "The scheme runs for 12 months. You contribute for 11 months and Sunny Diamonds contributes the 12th monthly instalment on your behalf.",
      },
      {
        id: "minimum-instalment",
        question: "What is the minimum monthly instalment amount?",
        answer:
          "You can begin your Diamonds for Everyone journey with monthly instalments starting from ₹1,000.",
      },
      {
        id: "terms",
        question: "What are the terms and conditions of the plan?",
        answer:
          "The accumulated value can be used towards purchasing jewellery from Sunny Diamonds subject to the programme terms. Please review the DFE Terms & Conditions on our Policy & Certifications page for full details.",
      },
    ],
  },
  investFlow: {
    /** Figma node 1052:66382 — intro step (first screen after login / START INVESTING) */
    pageTitle: "Your Investment Plan",
    backLabel: "Back to Diamonds for Everyone",
    cancelLabel: "CANCEL",
    nextLabel: "NEXT",
    payLabel: "PAY NOW",
    intro: {
      title: "Diamonds for Everyone",
      subtitle:
        "Keep the following things ready and set your account in 3 simple steps",
      steps: [
        {
          label: "Verify your identity",
          detail: "Your government ID proof",
        },
        {
          label: "Assign a nominee",
          detail: "Details of your chosen nominee",
        },
        {
          label: "Pay the 1st Instalment",
          detail: "Payment method and details",
        },
      ],
      openAccountLabel: "OPEN YOUR ACCOUNT",
    },
    steps: [
      { id: "kyc", label: "Quick KYC" },
      { id: "nominee", label: "Add a Nominee" },
      { id: "review", label: "Review & Pay" },
    ],
    kyc: {
      title: "Complete Quick KYC",
      idTypeLabel: "ID Type*",
      idTypeOptions: ["Aadhaar", "PAN", "Passport"],
      idNumberLabel: "ID Number*",
      idUploadLabel: "ID Card Copy*",
      uploadButtonLabel: "UPLOAD",
      removeFileLabel: "REMOVE",
      aadhaarError: "Enter Valid Aadhar Number",
    },
    nominee: {
      title: "Add a Nominee",
      nameLabel: "Nominee Full Name*",
      relationshipLabel: "Relationship*",
      relationshipOptions: ["Spouse", "Parent", "Child", "Sibling", "Other"],
      phoneLabel: "Nominee Phone No.*",
    },
    review: {
      title: "Review & Pay",
      monthlyLabel: "Monthly Instalment",
      contributionLabel: "Your Contribution (11 months)",
      freeInstallmentLabel: "12th Instalment",
      freeInstallmentValue: "Free",
      totalLabel: "Total Plan Value",
    },
  },
} as const;
