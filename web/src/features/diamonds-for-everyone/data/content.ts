/**
 * DFE calculator + invest-flow copy only.
 * Marketing page sections (hero, plan, lifestyle, benefits, FAQ) come from CMS.
 */
export const diamondsForEveryonePageContent = {
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
      /** Figma node 1052:66453 */
      title: "Nominee Details",
      nameLabel: "Full Name*",
      relationshipLabel: "Relationship*",
      relationshipOptions: ["Spouse", "Parent", "Child", "Sister", "Other"],
      phoneLabel: "Phone No.*",
      emailLabel: "Email ID",
      reviewAndPayLabel: "REVIEW AND PAY",
    },
    review: {
      /** Figma node 1052:66514 */
      title: "Your Investment Summary",
      accountHolderTitle: "Account Holder",
      fullNameLabel: "Full Name",
      phoneLabel: "Phone No.",
      emailLabel: "Email ID",
      investmentDetailsTitle: "Investment Details",
      reminderText:
        "We'll send you a reminder every month on your registered email before your installment is due.",
      summaryTitle: "Your 12 Month Investments Summary",
      contributionLabel: "Your Contribution",
      sunnyContributionLabel: "The Sunny Contribution",
      totalLabel: "Total Value",
      idProofTitle: "ID Proof",
      nomineeDetailsTitle: "Nominee Details",
      editLabel: "EDIT",
      idTypeLabel: "ID Type",
      idNumberLabel: "ID Number",
      idCardCopyLabel: "ID Card Copy*",
      nomineeNameLabel: "Full Name*",
      nomineeRelationshipLabel: "Relationship",
      nomineePhoneLabel: "Phone No.*",
      nomineeEmailLabel: "Email ID",
    },
    success: {
      /** Figma node 1052:66596 */
      title: "11+1 Plan Activated",
      subtitle:
        "Monthly installment reminders will be sent to your registered email address.",
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
