export type ProfileDfeNomineeUi = {
  fullName: string;
  relationship: string;
  phone: string;
  email: string;
};

export type ProfileDfePaymentDueUi = {
  monthLabel: string;
  daysUntilDue: number;
};

export type ProfileDfePlanUi = {
  monthlyAmount: number;
  contribution: number;
  freeInstallmentAmount: number;
  totalValue: number;
  idType: string;
  idNumber: string;
  idFileName: string;
  nominee: ProfileDfeNomineeUi;
  paymentDue?: ProfileDfePaymentDueUi | null;
};
