/**
 * DFE calculator + invest-flow copy only.
 * Marketing page sections (hero, plan, benefits, FAQ) come from CMS.
 */
export const diamondsForEveryonePageContent = {
  investment: {
    title: "Plan Your Investment",
    monthlyLabel: "Choose how much you'd like to contribute each month.",
    summaryTitle: "Your 12-Month Summary",
    contributionLabel: "Your Contribution",
    freeInstallmentLabel: "Bonus",
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
  investFlow: {
    /** Figma nodes 4453:33669 (desktop) / 4453:39061 (mobile) — invest intro step */
    pageTitle: "Your Investment Plan",
    backLabel: "Back to Diamonds for Everyone",
    cancelLabel: "CANCEL",
    nextLabel: "NEXT",
    payLabel: "PAY NOW",
    intro: {
      title: "Diamonds for Everyone",
      subtitle:
        "Keep the following ready and set up your account in 3 simple steps.",
      steps: [
        {
          label: "Verify Your Identity",
          detail: "Your government-issued ID",
        },
        {
          label: "Add a Nominee",
          detail: "Details of your chosen nominee",
        },
        {
          label: "Make Your First Contribution",
          detail: "Your payment method and details",
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
      uploadButtonLabel: "ATTACH IMAGE",
      removeFileLabel: "REMOVE",
      aadhaarError: "Enter Valid Aadhar Number",
    },
    nominee: {
      /** Figma 4453:33830 desktop, 4453:38279 mobile */
      title: "Nominee Details",
      mobileTitle: "Add a Nominee",
      subtitle: "Add the details of your chosen nominee.",
      nameLabel: "Full Name*",
      relationshipLabel: "Relationship*",
      relationshipOptions: ["Spouse", "Parent", "Child", "Sister", "Other"],
      phoneLabel: "Phone No.*",
      emailLabel: "Email ID",
      phoneError: "Please enter a valid phone number",
      emailError: "Please enter a valid email",
      reviewAndPayLabel: "REVIEW AND PAY",
    },
    review: {
      /** Figma 4453:33877 desktop, 4453:39217 mobile */
      title: "Your Plan Summary",
      accountHolderTitle: "Account Holder",
      fullNameLabel: "Full Name",
      phoneLabel: "Phone No.",
      emailLabel: "Email ID",
      instalmentAmountTitle: "Instalment Amount",
      summarySectionTitle: "Your 12-Month Summary",
      reminderText:
        "We'll send you a reminder every month on your registered email before your installment is due.",
      contributionLabel: "Your Contribution",
      bonusLabel: "Bonus",
      totalLabel: "Total Value",
      idProofTitle: "ID Proof",
      nomineeDetailsTitle: "Nominee Details",
      editLabel: "EDIT",
      idTypeLabel: "ID Type",
      idNumberLabel: "ID Number",
      idCardCopyLabel: "ID Card Copy",
      nomineeNameLabel: "Full Name",
      nomineeRelationshipLabel: "Relationship",
      nomineePhoneLabel: "Phone No.",
      nomineeEmailLabel: "Email ID",
    },
    success: {
      /** Figma 4453:33975 desktop, 4453:39314 mobile */
      title: "Welcome to Diamonds for Everyone",
      subtitle:
        "You're all set. Monthly instalment reminders will be sent to your registered email address.",
      managePaymentsLabel: "MANAGE PAYMENTS",
      managePaymentsHref: "/profile",
      backToShoppingLabel: "GO BACK TO SHOPPING",
      backToShoppingHref: "/",
      image: {
        src: "/images/diamonds-for-everyone/invest-success-rings.png",
        alt: "Diamond rings",
      },
    },
  },
} as const;
