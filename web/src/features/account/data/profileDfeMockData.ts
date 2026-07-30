import type { ProfileDfePlanUi } from "../types/profileDfe.types";

/** Placeholder plan data until customer DFE API is wired. */
export const MOCK_PROFILE_DFE_PLAN: ProfileDfePlanUi = {
  monthlyAmount: 5000,
  contribution: 55000,
  freeInstallmentAmount: 5000,
  totalValue: 60000,
  idType: "Aadhar",
  idNumber: "123456789872",
  idFileName: "aadhar.jpeg",
  nominee: {
    fullName: "Gauri J",
    relationship: "Sister",
    phone: "9876898872",
    email: "xyz@gmail.com",
  },
  paymentDue: {
    monthLabel: "july",
    daysUntilDue: 3,
  },
};
