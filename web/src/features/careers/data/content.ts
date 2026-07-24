import type {
  CareerBenefit,
  CareerFaqItem,
  CareerJob,
  CareerLifeHighlight,
} from "../types";

export const careersPageContent = {
  hero: {
    title: "Craft Your Career With Us",
    description:
      "Join a legacy of diamond craftsmanship and help create jewellery that becomes part of life's most cherished moments.",
    image: {
      desktopUrl: "/images/about/handcrafted-bg.webp",
      mobileUrl: "/images/about/handcrafted-bg.webp",
      alt: "Craftsmanship at Sunny Diamonds",
    },
  },
  recentOpenings: {
    title: "Recent Openings",
    description: "Explore our latest opportunities across retail, design, and operations.",
  },
  jobListing: {
    title: "All Open Roles",
    description: "Find a role that matches your skills and passion for fine jewellery.",
  },
  jobDetails: {
    title: "Role Overview",
    responsibilitiesHeading: "Key Responsibilities",
    requirementsHeading: "What We're Looking For",
    emptyState: "Select a role from the listings above to view full details.",
  },
  applicationForm: {
    title: "Apply Now",
    description:
      "Share your details and we'll be in touch if your profile is a match for the role.",
    positionLabel: "Applying for",
    noRoleSelected: "Please select a role to continue your application.",
    submitLabel: "Submit Application",
    successTitle: "Application received",
    successDescription: "Thank you for your interest. Our HR team will review your profile and reach out soon.",
    fields: {
      nameLabel: "Full Name",
      emailLabel: "Email Address",
      phoneLabel: "Phone Number",
      portfolioLabel: "LinkedIn / Portfolio URL",
      portfolioPlaceholder: "https://",
      coverLetterLabel: "Cover Letter",
      coverLetterPlaceholder: "Tell us why you'd be a great fit for Sunny Diamonds.",
    },
  },
  lifeAt: {
    title: "Life at Sunny Diamonds",
    description:
      "From master artisans to showroom consultants, our team shares a commitment to excellence, heritage, and growth.",
    highlights: [
      {
        id: "craft",
        title: "Master Craftsmanship",
        description:
          "Work alongside skilled artisans who have perfected diamond setting and jewellery design for generations.",
        image: {
          desktopUrl: "/images/home/craftsmanship-bg.webp",
          mobileUrl: "/images/home/craftsmanship-bg.webp",
          alt: "Jewellery craftsmanship at Sunny Diamonds",
        },
      },
      {
        id: "growth",
        title: "Growth & Learning",
        description:
          "Structured training in product knowledge, customer experience, and leadership across our showrooms and atelier.",
        image: {
          desktopUrl: "/images/home/crafting-rarity-necklace.png",
          mobileUrl: "/images/home/crafting-rarity-necklace.png",
          alt: "Team learning at Sunny Diamonds",
        },
      },
      {
        id: "culture",
        title: "People-First Culture",
        description:
          "A supportive environment where collaboration, integrity, and pride in every piece we create come first.",
        image: {
          desktopUrl: "/images/home/bespoke-for-you-bg.webp",
          mobileUrl: "/images/home/bespoke-for-you-bg.webp",
          alt: "Team culture at Sunny Diamonds",
        },
      },
    ] satisfies readonly CareerLifeHighlight[],
  },
  benefits: {
    title: "Employee Benefits",
    description: "We invest in our people with benefits designed for wellbeing and long-term growth.",
    items: [
      {
        id: "health",
        label: "Health & Wellness",
        description: "Medical coverage and wellness support for you and your family.",
        iconSrc: "/images/about/guarantees/return.svg",
      },
      {
        id: "learning",
        label: "Learning Programs",
        description: "Ongoing training in diamonds, design, and customer excellence.",
        iconSrc: "/images/about/flourishIcon.svg",
      },
      {
        id: "growth",
        label: "Career Growth",
        description: "Clear pathways to advance across retail, design, and operations.",
        iconSrc: "/images/about/guarantees/moneyback.svg",
      },
      {
        id: "perks",
        label: "Team Perks",
        description: "Employee discounts, festive bonuses, and recognition programs.",
        iconSrc: "/images/products/pdp/benefit-cod.svg",
      },
    ] satisfies readonly CareerBenefit[],
  },
  bespokeInspirations: {
    title: "Bespoke Inspirations",
    description:
      "Many of our designers began on the showroom floor. Discover how bespoke craftsmanship can shape your career journey.",
    primaryCta: { label: "Explore Bespoke", href: "/bespoke-jewellery" },
    secondaryCta: { label: "Our Story", href: "/about" },
    image: {
      desktopUrl: "/images/home/bespoke-for-you-bg.webp",
      mobileUrl: "/images/home/bespoke-for-you-bg.webp",
      alt: "Bespoke jewellery inspiration",
    },
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        id: "apply",
        question: "How do I apply for a role?",
        answer:
          "Select a position from our openings, review the role details, and complete the application form on this page. Our HR team reviews every submission.",
      },
      {
        id: "timeline",
        question: "What is the typical hiring timeline?",
        answer:
          "We aim to respond within one to two weeks. Shortlisted candidates are invited for interviews, which may include a showroom visit or design assessment depending on the role.",
      },
      {
        id: "experience",
        question: "Do I need jewellery industry experience?",
        answer:
          "Experience is valued but not always required. We look for customer focus, attention to detail, and a genuine interest in diamonds and fine jewellery.",
      },
      {
        id: "locations",
        question: "Which locations are you hiring in?",
        answer:
          "Roles are listed with their location. We hire across our Kerala showrooms and select cities in South India, with some hybrid roles in digital and design.",
      },
      {
        id: "internships",
        question: "Do you offer internships or graduate programs?",
        answer:
          "Yes. We periodically open internship and trainee roles in design, retail, and operations. Check Recent Openings or contact HR for upcoming cohorts.",
      },
    ] satisfies readonly CareerFaqItem[],
  },
} as const;

export const careerJobs: readonly CareerJob[] = [
  {
    id: "retail-sales-consultant-kochi",
    title: "Retail Sales Consultant",
    department: "Retail",
    location: "Kochi, Kerala",
    type: "Full-time",
    postedAt: "2026-07-01",
    isNew: true,
    summary:
      "Guide customers through our diamond collections with warmth, product expertise, and a passion for memorable experiences.",
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
    title: "Jewellery Designer",
    department: "Design",
    location: "Chalakkudy, Kerala",
    type: "Full-time",
    postedAt: "2026-06-20",
    isNew: true,
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
    title: "Digital Marketing Executive",
    department: "Marketing",
    location: "Hybrid — Kochi",
    type: "Full-time",
    postedAt: "2026-06-10",
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
    title: "CAD Designer",
    department: "Design",
    location: "Chalakkudy, Kerala",
    type: "Full-time",
    postedAt: "2026-05-28",
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
    title: "Store Manager",
    department: "Retail",
    location: "Bangalore, Karnataka",
    type: "Full-time",
    postedAt: "2026-05-15",
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
    title: "Design Intern",
    department: "Design",
    location: "Kochi, Kerala",
    type: "Contract",
    postedAt: "2026-07-05",
    isNew: true,
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
