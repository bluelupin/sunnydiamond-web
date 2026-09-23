import { diamondsForEveryonePageContent } from "@/features/diamonds-for-everyone/data/content";
import type { ProfileDfePlanUi } from "../types/profileDfe.types";

/** Toggle off when customer DFE plan API is wired. */
export const PROFILE_DFE_USE_DUMMY_PLAN = true;

const investment = diamondsForEveryonePageContent.investment;

/** Placeholder plan for profile DFE tab UI testing until API integration. */
export const profileDfeDummyPlan: ProfileDfePlanUi = {
  monthlyAmount: investment.defaultMonthly,
  contribution: investment.defaultMonthly * investment.monthsPaid,
  freeInstallmentAmount: investment.defaultMonthly,
  totalValue: investment.defaultMonthly * investment.totalMonths,
  idType: "Aadhaar",
  idNumber: "123456789012",
  idFileName: "aadhaar-card.jpg",
  nominee: {
    fullName: "Priya Sharma",
    relationship: "Spouse",
    phone: "+91 9876543210",
    email: "priya.sharma@example.com",
  },
  paymentDue: {
    monthLabel: "March",
    daysUntilDue: 5,
  },
};
