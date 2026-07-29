import type {
  CareerBenefit,
  CareerFaqItem,
  CareerJob,
  CareerLifeHighlight,
} from "../types";

export const careersPageContent = {
  hero: {
    title: "Work with Us",
    ctaLabel: "DISCOVER OPEN ROLES",
    image: {
      desktopUrl: "/images/careers/hero.png",
      mobileUrl: "/images/careers/hero.png",
      alt: "Team at Sunny Diamonds",
    },
  },
  openings: {
    title: "Open Roles",
    mobileTitle: "Your next chapter begins here",
    subtitle: "Explore opportunities across our growing team.",
    viewAllLabel: "VIEW ALL OPENINGS",
  },
  jobListing: {
    title: "Job Listing",
    mobileTitle: "Job listing",
    searchPlaceholder: "Search roles",
    mobileSearchPlaceholder: "Search roles",
    filtersTitle: "Filters",
    filterLocationLabel: "Location",
    filterDepartmentLabel: "Department",
    filterExperienceLabel: "Experience",
    filterSelectPlaceholder: "Select",
    openFiltersLabel: "Open filters",
    closeFiltersLabel: "Close filters",
  },
  jobDetails: {
    applyLabel: "APPLY NOW",
    jobSummaryHeading: "Job Summary",
    rolesHeading: "Roles & Responsibilities",
    qualificationsHeading: "Qualifications & Experience",
    lookingForHeading: "What We're Looking For",
    whyJoinHeading: "Why Join Us?",
    shareLabel: "Share",
    applyModal: {
      title: "Start your Application",
      autofillResumeLabel: "AUTOFILL WITH RESUME",
      applyManuallyLabel: "APPLY MANUALLY",
      applyLinkedInLabel: "APPLY WITH LINKEDIN",
      closeLabel: "Close",
    },
  },
  applicationForm: {
    title: "Start your Application",
    resumeHeading: "Resume",
    resumeHint: "*File up to 5mb and (ZIP, PDF, JPEG, PNG) format supported",
    resumeUploadLabel: "Upload resume",
    resumeRemoveLabel: "Remove resume",
    uploadResumeModal: {
      title: "Upload Resume",
      description:
        "Please review your details before submitting your application. Our team will come to a decision based on the information provided.",
      onlyUploadLabel: "ONLY UPLOAD",
      autofillResumeLabel: "AUTOFILL WITH RESUME",
      closeLabel: "Close",
    },
    confirmSubmissionModal: {
      title: "Confirm Submission?",
      description:
        "Please review your details before submitting your application. Our team will come to a decision based on the information provided.",
      goBackLabel: "GO BACK AND REVIEW",
      submitLabel: "SUBMIT APPLICATION",
      closeLabel: "Close",
    },
    personalDetailsHeading: "Personal Details",
    educationHeading: "Education Details",
    workExperienceHeading: "Work Experience",
    skillsHeading: "Skills and Languages",
    additionalInfoHeading: "Additional Information",
    submitLabel: "SUBMIT APPLICATION",
    noRoleSelected: "Please select a role to continue your application.",
    shareLabel: "Share",
    fields: {
      fullNameLabel: "Full Name*",
      phoneLabel: "Phone No.*",
      emailLabel: "Email ID*",
      dateOfBirthLabel: "Date of Birth*",
      dateOfBirthPlaceholder: "DD/MM/YYYY",
      fieldPlaceholder: "Enter",
      genderLabel: "Gender*",
      highestDegreeLabel: "Highest Degree*",
      areaOfStudyLabel: "Area of Study*",
      yearOfCompletionLabel: "Year of Completion*",
      relevantExperienceLabel: "Relevant Work Experience*",
      currentCompanyLabel: "Current Company's Name",
      currentJobTitleLabel: "Current Job Title",
      currentCtcLabel: "Current CTC",
      expectedCtcLabel: "Expected CTC*",
      noticePeriodLabel: "Notice Period",
      skillsSearchLabel: "Add skills and known languages to your application",
      skillsSearchPlaceholder: "Search",
      skillsLabel: "Skills",
      languagesLabel: "Languages",
      companyRelationLabel: "Do you have any relation in the company?",
      companyRelationYes: "Yes",
      companyRelationNo: "No",
      employeeNameLabel: "Employee Name*",
      employeeJobTitleLabel: "Employee Job Title*",
    },
  },
  applicationSuccess: {
    title: "Application Submitted",
    descriptionLine1:
      "Thank you for applying. Your application has been received and is now under review.",
    descriptionLine2: "We will get back to you shortly.",
    appliedJobDetailsHeading: "Applied Job Details",
    jobTitleLabel: "Job Title:",
    jobIdLabel: "Job ID:",
    goHomeLabel: "GO TO HOME",
  },
  lifeAt: {
    title: "More Than A\nPlace To Work",
    description:
      "We've spent decades building a team that doesn't just make jewellery they understand what jewellery means. The skill the silence before a presentation, the weight of a well- chosen stone.",
    quote: "Every piece we create is for a moment that matters.",
    leftImage: {
      desktopUrl: "/images/careers/life-at.png",
      mobileUrl: "/images/careers/life-at.png",
      alt: "Craftsmanship at Sunny Diamonds",
    },
    rightImage: {
      desktopUrl: "/images/careers/life-right.png",
      mobileUrl: "/images/careers/life-right.png",
      alt: "Team collaboration at Sunny Diamonds",
    },
    highlights: [] satisfies readonly CareerLifeHighlight[],
  },
  benefits: {
    title: "Investing in You",
    image: {
      desktopUrl: "/images/careers/benefits.png",
      mobileUrl: "/images/careers/benefits.png",
      alt: "Learning and development at Sunny Diamonds",
    },
    items: [
      {
        id: "learning",
        label: "Learning & Development",
        description:
          "Continuous training, mentorship, and opportunities to build expertise in the jewellery and luxury retail industry.",
        iconSrc: "/images/about/flourishIcon.svg",
      },
      {
        id: "culture",
        label: "Supportive Culture",
        description:
          "A collaborative environment where craftsmanship, integrity, and pride in every piece we create come first.",
        iconSrc: "/images/about/guarantees/return.svg",
      },
      {
        id: "recognition",
        label: "Recognition & Rewards",
        description:
          "Performance-based recognition, festive bonuses, and employee discounts across our collections.",
        iconSrc: "/images/about/guarantees/moneyback.svg",
      },
    ] satisfies readonly CareerBenefit[],
  },
  bespokeInspirations: {
    title: "The pieces we make last for generations. So can the impact you make.",
    ctaLabel: "DISCOVER OPEN ROLES",
    image: {
      desktopUrl: "/images/careers/bespoke-inspirations.png",
      mobileUrl: "/images/careers/bespoke-inspirations.png",
      alt: "Silk fabric texture",
    },
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        id: "roles",
        question: "What kind of roles does Sunny Diamonds hire for?",
        answer:
          "We hire across retail, sales, customer experience, merchandising, marketing, operations, finance, technology, and corporate functions. As we continue to grow, new opportunities are added regularly.",
      },
      {
        id: "experience",
        question: "Do I need prior jewellery industry experience to apply?",
        answer:
          "Not always. Many roles value retail, hospitality, or customer service experience. We provide training for jewellery-specific knowledge where needed.",
      },
      {
        id: "recruitment",
        question: "What is the recruitment process like?",
        answer:
          "After you apply, our HR team reviews your profile. Shortlisted candidates are invited for interviews, which may include a showroom visit or skills assessment depending on the role.",
      },
      {
        id: "training",
        question: "Do you provide training and career development opportunities?",
        answer:
          "Yes. We offer continuous learning, mentorship, and pathways to grow across retail, design, and corporate functions.",
      },
    ] satisfies readonly CareerFaqItem[],
  },
} as const;

const retailSalesDetail = {
  jobCode: "SD2847",
  experienceLabel: "2-4 yrs",
  workplaceLabel: "On-site",
  isFeatured: true,
  jobSummary:
    "As a Retail Sales Consultant at Sunny Diamonds, you will be the face of our brand — guiding customers through our diamond collections with warmth, product expertise, and a passion for creating memorable experiences. You will work closely with our design and bespoke teams to help clients find or create pieces that mark life's most cherished moments.",
  rolesAndResponsibilities:
    "You will welcome and assist customers across engagement, wedding, and everyday jewellery categories. Share deep product knowledge on diamonds, certifications, and craftsmanship. Support bespoke consultations and coordinate with the design team. Maintain showroom presentation standards and inventory accuracy.",
  qualifications: [
    {
      label: "Education",
      text: "Bachelor's degree in any discipline. Diploma in retail or hospitality is a plus.",
    },
    {
      label: "Experience",
      text: "1–3 years in luxury retail or customer-facing roles preferred.",
    },
    {
      label: "Skills",
      text: "Excellent communication in English and Malayalam. Strong interpersonal skills and attention to detail.",
    },
  ],
  whatWeAreLookingFor:
    "A genuine interest in fine jewellery and client service. Someone who listens carefully, communicates with warmth, and takes pride in helping customers find pieces that matter.",
  whyJoinUs:
    "Join a legacy of diamond craftsmanship. Work alongside master artisans and consultants who have perfected the art of fine jewellery for generations. Structured training, clear growth pathways, and a people-first culture await you.",
} as const;

export const careerJobs: readonly CareerJob[] = [
  {
    id: "retail-sales-consultant-kochi",
    jobCode: retailSalesDetail.jobCode,
    title: "Retail Sales Consultant",
    department: "Retail",
    location: "Kochi, Kerala",
    type: "Full-time",
    postedAt: "2026-06-01",
    isNew: true,
    isFeatured: retailSalesDetail.isFeatured,
    experienceLabel: retailSalesDetail.experienceLabel,
    workplaceLabel: retailSalesDetail.workplaceLabel,
    summary:
      "Guide customers through our diamond collections with warmth, product expertise, and a passion for memorable experiences.",
    jobSummary: retailSalesDetail.jobSummary,
    rolesAndResponsibilities: retailSalesDetail.rolesAndResponsibilities,
    qualifications: retailSalesDetail.qualifications,
    whatWeAreLookingFor: retailSalesDetail.whatWeAreLookingFor,
    whyJoinUs: retailSalesDetail.whyJoinUs,
    responsibilities: [
      "Welcome and assist customers across engagement, wedding, and everyday jewellery categories.",
      "Share product knowledge on diamonds, certifications, and craftsmanship.",
      "Support bespoke consultations and coordinate with the design team.",
      "Maintain showroom presentation and inventory accuracy.",
    ],
    requirements: [
      "1–3 years in luxury retail or customer-facing roles preferred.",
      "Excellent communication in English and Malayalam.",
      "Genuine interest in fine jewellery and client service.",
    ],
  },
  {
    id: "jewellery-designer-chalakkudy",
    jobCode: "SD2851",
    title: "Jewellery Designer",
    department: "Design",
    location: "Chalakkudy, Kerala",
    type: "Full-time",
    postedAt: "2026-06-20",
    isNew: true,
    experienceLabel: "3-5 yrs",
    workplaceLabel: "On-site",
    summary:
      "Create original designs for bespoke and collection pieces, from concept sketches to production-ready specifications.",
    responsibilities: [
      "Develop design concepts aligned with Sunny Diamonds aesthetics and client briefs.",
      "Prepare technical drawings and collaborate with master craftsmen.",
      "Research trends while honouring traditional craftsmanship.",
      "Present designs to clients and internal stakeholders.",
    ],
    requirements: [
      "Degree or diploma in jewellery design or related field.",
      "Proficiency in CAD tools and hand sketching.",
      "Portfolio demonstrating fine jewellery design work.",
    ],
  },
  {
    id: "digital-marketing-executive",
    jobCode: "SD2860",
    title: "Digital Marketing Executive",
    department: "Marketing",
    location: "Hybrid — Kochi",
    type: "Full-time",
    postedAt: "2026-06-10",
    experienceLabel: "2-4 yrs",
    workplaceLabel: "Hybrid",
    summary:
      "Drive brand storytelling across digital channels and support campaigns that connect customers to our collections.",
    responsibilities: [
      "Plan and execute social, email, and performance marketing campaigns.",
      "Coordinate with creative teams on content and product launches.",
      "Track campaign performance and optimize for engagement and conversion.",
      "Support e-commerce and showroom event promotions.",
    ],
    requirements: [
      "2+ years in digital marketing for lifestyle or luxury brands.",
      "Experience with Meta, Google Ads, and analytics tools.",
      "Strong writing and visual storytelling skills.",
    ],
  },
  {
    id: "cad-designer-chalakkudy",
    jobCode: "SD2872",
    title: "CAD Designer",
    department: "Design",
    location: "Chalakkudy, Kerala",
    type: "Full-time",
    postedAt: "2026-05-28",
    experienceLabel: "2-4 yrs",
    workplaceLabel: "On-site",
    summary:
      "Translate designer concepts into precise CAD models for prototyping and production in our atelier.",
    responsibilities: [
      "Build accurate 3D models for rings, necklaces, and bespoke commissions.",
      "Collaborate with designers and craftsmen on feasibility and stone setting.",
      "Maintain design files and revision history.",
      "Support rapid prototyping for client approvals.",
    ],
    requirements: [
      "Experience with Matrix, Rhino, or similar jewellery CAD software.",
      "Understanding of manufacturing constraints and diamond setting.",
      "Detail-oriented with strong spatial visualization.",
    ],
  },
  {
    id: "store-manager-bangalore",
    jobCode: "SD2885",
    title: "Store Manager",
    department: "Retail",
    location: "Bangalore, Karnataka",
    type: "Full-time",
    postedAt: "2026-05-15",
    experienceLabel: "5+ yrs",
    workplaceLabel: "On-site",
    summary:
      "Lead showroom operations, team performance, and the Sunny Diamonds client experience at our Bangalore location.",
    responsibilities: [
      "Oversee daily store operations, staffing, and sales targets.",
      "Coach consultants on product knowledge and client service standards.",
      "Manage inventory, visual merchandising, and local events.",
      "Report on performance and customer feedback to regional leadership.",
    ],
    requirements: [
      "5+ years in luxury retail with 2+ years in a leadership role.",
      "Proven track record of team development and sales growth.",
      "Strong operational and interpersonal skills.",
    ],
  },
  {
    id: "design-intern-kochi",
    jobCode: "SD2891",
    title: "Design Intern",
    department: "Design",
    location: "Kochi, Kerala",
    type: "Contract",
    postedAt: "2026-07-05",
    isNew: true,
    experienceLabel: "0-1 yr",
    workplaceLabel: "On-site",
    summary:
      "A six-month internship supporting our design studio with research, sketching, and CAD production.",
    responsibilities: [
      "Assist senior designers with mood boards and concept development.",
      "Prepare presentation materials for client reviews.",
      "Support CAD revisions and sample coordination.",
      "Document design processes and archive references.",
    ],
    requirements: [
      "Currently pursuing or recently completed a design-related degree.",
      "Basic sketching and digital design skills.",
      "Eagerness to learn fine jewellery craftsmanship.",
    ],
  },
];

export function getRecentCareerJobs(limit = 3): CareerJob[] {
  return [...careerJobs]
    .sort((a, b) => b.postedAt.localeCompare(a.postedAt))
    .slice(0, limit);
}

export function getCareerJobById(jobId: string | null | undefined): CareerJob | null {
  if (!jobId) return null;
  return careerJobs.find((job) => job.id === jobId) ?? null;
}

export function getFeaturedCareerJob(): CareerJob | null {
  return careerJobs.find((job) => job.isFeatured) ?? careerJobs[0] ?? null;
}
