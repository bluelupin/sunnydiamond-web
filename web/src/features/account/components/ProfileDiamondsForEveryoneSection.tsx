"use client";

import type { AuthCustomer } from "@/features/auth/context/AuthContext";
import AlertTriangleIcon from "@/assets/Icons/AlertTriangleIcon";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { maskIdNumber } from "@/features/diamonds-for-everyone/utils/maskIdNumber";
import { useCustomerProfileContact } from "@/shared/hooks/use-customer-profile-contact";
import { useToast } from "@/shared/hooks/use-toast";
import { formatCustomerFullName } from "@/shared/utils/customerName";
import {
  PROFILE_DFE_USE_DUMMY_PLAN,
  profileDfeDummyPlan,
} from "../data/profileDfeDummyPlan";
import { profileTabsContent } from "../data/profileContent";
import type { ProfileDfePaymentDueUi, ProfileDfePlanUi } from "../types/profileDfe.types";
import { ProfileDiamondsForEveryoneEmptyState } from "./ProfileDiamondsForEveryoneEmptyState";
import { ProfileDiamondsForEveryoneSkeleton } from "./ProfileDiamondsForEveryoneSkeleton";
import { ProfileDfeReadOnlyField, ProfileDfeSectionCard } from "./profileUi";
import { ProfileDfeInvestmentSummary } from "./ProfileDfeInvestmentSummary";
import { cn } from "@/shared/utils/cn";
import { useUiPlatform } from "@/shared/hooks/use-ui-platform";

function formatInrAmount(amount: number): string {
  return amount.toLocaleString("en-IN");
}

function ProfileDfeAttachmentLink({ fileName }: { fileName: string }) {
  const { windows } = useUiPlatform();
  return (
    <div className="flex flex-col gap-2">
      <p className="font-gill text-base font-normal leading-110 text-darkblack">
        {profileTabsContent.diamondsForEveryone.imageAttachedLabel}
      </p>
      <div className="flex items-center gap-2">
        <span className="relative size-6 shrink-0 overflow-clip" aria-hidden>
          <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(!windows && "-translate-y-0.5", "block size-full max-w-none")}>
            <path d="M16.4585 4.10254H3.9585C3.61332 4.10254 3.3335 4.37806 3.3335 4.71792V17.0256C3.3335 17.3655 3.61332 17.641 3.9585 17.641H16.4585C16.8037 17.641 17.0835 17.3655 17.0835 17.0256V4.71792C17.0835 4.37806 16.8037 4.10254 16.4585 4.10254Z" stroke="#0A0A0A" strokeWidth="0.9375" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.7085 9.64025C8.39885 9.64025 8.9585 9.08922 8.9585 8.40948C8.9585 7.72975 8.39885 7.17871 7.7085 7.17871C7.01814 7.17871 6.4585 7.72975 6.4585 8.40948C6.4585 9.08922 7.01814 9.64025 7.7085 9.64025Z" stroke="#0A0A0A" strokeWidth="0.9375" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.63721 17.6403L13.2036 9.2049C13.2617 9.14768 13.3306 9.10229 13.4065 9.07132C13.4823 9.04035 13.5637 9.02441 13.6458 9.02441C13.7279 9.02441 13.8093 9.04035 13.8851 9.07132C13.961 9.10229 14.0299 9.14768 14.088 9.2049L17.0833 12.1549" stroke="#0A0A0A" strokeWidth="0.9375" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="border-b border-darkblack pb-1 font-gill text-base font-light leading-110 text-darkblack">
          {fileName}
        </span>
      </div>
    </div>
  );
}

function ProfileDfePaymentDueBanner({
  paymentDue,
  onPayNow,
}: {
  paymentDue: ProfileDfePaymentDueUi;
  onPayNow: () => void;
}) {
  const content = profileTabsContent.diamondsForEveryone;
  const { windows } = useUiPlatform();
  return (
    <div className="bg-yellow100 md:px-6 px-4 py-4 flex gap-2 flex-nowrap">
      <AlertTriangleIcon className={cn(!windows && "md:-translate-y-1", "size-6 shrink-0 text-darkblack")} />
      <div className="flex min-w-0 items-center justify-between gap-3 w-full flex-wrap">
        <p className="font-gill text-base font-normal leading-110 text-darkblack">
          Payment for the month of {paymentDue.monthLabel} due in {paymentDue.daysUntilDue} days
        </p>
        <DetailTextLink onClick={onPayNow} className="shrink-0 self-start text-sm uppercase sm:self-center">
          {content.payNowLabel}
        </DetailTextLink>
      </div>
    </div>
  );
}

function ProfileDfePlanView({
  plan,
  accountFullName,
  accountPhone,
  accountEmail,
  onPayNow,
}: {
  plan: ProfileDfePlanUi;
  accountFullName: string;
  accountPhone: string;
  accountEmail: string;
  onPayNow: () => void;
}) {
  const content = profileTabsContent.diamondsForEveryone;

  return (
    <div className="flex flex-col gap-6">
      {plan.paymentDue &&
        <ProfileDfePaymentDueBanner paymentDue={plan.paymentDue} onPayNow={onPayNow} />
      }
      <div className="flex flex-col gap-6">
        <h1 className="font-larken text-32 font-light leading-110 text-darkblack">
          {content.pageTitle}
        </h1>
        <ProfileDfeSectionCard title={content.accountHolderTitle}>
          <div className="flex flex-col gap-6">
            <ProfileDfeReadOnlyField
              label={content.fullNameLabel}
              value={accountFullName}
              mutedLabel
            />
            <ProfileDfeReadOnlyField label={content.phoneLabel} value={accountPhone} />
            <ProfileDfeReadOnlyField label={content.emailLabel} value={accountEmail} />
          </div>
        </ProfileDfeSectionCard>

        <ProfileDfeSectionCard title={content.investmentDetailsTitle}>
          <div className="flex flex-col md:gap-4 gap-6">
            <div
              className="flex md:h-[50px] h-14 w-full items-center gap-2 md:border-[0.4px] border-black md:py-2 px-3 py-3 text-darkblack md:bg-transparent bg-aboutInactive"
            >
              <span className="font-gill text-lg font-light tracking-[0.18px]">₹</span>
              <span className="font-gill text-base font-normal">
                {formatInrAmount(plan.monthlyAmount)}
              </span>
            </div>
            <p className="font-gill text-base font-normal leading-110 text-[#2B2B2B]">
              {content.summaryTitle}
            </p>
            <span className="h-px md:hidden w-full bg-neutral300" aria-hidden />
            <ProfileDfeInvestmentSummary
              contributionLabel={content.contributionLabel}
              contributionAmount={plan.contribution}
              freeInstallmentLabel={content.freeInstallmentLabel}
              freeInstallmentAmount={plan.freeInstallmentAmount}
              totalValueLabel={content.totalValueLabel}
              totalValue={plan.totalValue}
            />
          </div>
        </ProfileDfeSectionCard>

        <ProfileDfeSectionCard title={content.idProofTitle}>
          <div className="flex flex-col gap-6">
            <ProfileDfeReadOnlyField label={content.idTypeLabel} value={plan.idType} />
            <ProfileDfeReadOnlyField
              label={content.idNumberLabel}
              value={maskIdNumber(plan.idNumber)}
            />
            <ProfileDfeAttachmentLink fileName={plan.idFileName} />
          </div>
        </ProfileDfeSectionCard>

        <ProfileDfeSectionCard title={content.nomineeDetailsTitle}>
          <div className="flex flex-col gap-6">
            <ProfileDfeReadOnlyField
              label={content.nomineeNameLabel}
              value={plan.nominee.fullName}
              mutedLabel
            />
            <ProfileDfeReadOnlyField
              label={content.nomineeRelationshipLabel}
              value={plan.nominee.relationship}
              mutedLabel
            />
            <ProfileDfeReadOnlyField label={content.nomineePhoneLabel} value={plan.nominee.phone} />
            <ProfileDfeReadOnlyField label={content.nomineeEmailLabel} value={plan.nominee.email} />
          </div>
        </ProfileDfeSectionCard>
      </div>
    </div>
  );
}

type ProfileDiamondsForEveryoneSectionProps = {
  customer: AuthCustomer;
};

const ProfileDiamondsForEveryoneSection = ({ customer }: ProfileDiamondsForEveryoneSectionProps) => {
  const { toast } = useToast();
  const { contact, isLoading } = useCustomerProfileContact(true);
  const dfeContent = profileTabsContent.diamondsForEveryone;

  const handlePayNow = () => {
    toast({
      title: dfeContent.payNowUnavailableTitle,
      description: dfeContent.payNowUnavailableDescription,
    });
  };

  const accountFullName = formatCustomerFullName(customer.firstname, customer.lastname);
  const accountEmail = customer.email?.trim() ?? "";

  const accountPhone = contact?.phone
    ? `${contact.countryCode ?? ""}${contact.phone}`
    : "";

  const displayFullName = accountFullName;
  const displayEmail = accountEmail;

  // Customer DFE plan API — replace dummy plan when integration is ready.
  const plan: ProfileDfePlanUi | null = PROFILE_DFE_USE_DUMMY_PLAN ? profileDfeDummyPlan : null;

  if (isLoading) {
    return <ProfileDiamondsForEveryoneSkeleton />;
  }

  if (!plan) {
    return <ProfileDiamondsForEveryoneEmptyState />;
  }

  return (
    <ProfileDfePlanView
      plan={plan}
      accountFullName={displayFullName}
      accountPhone={accountPhone}
      accountEmail={displayEmail}
      onPayNow={handlePayNow}
    />
  );
};

export default ProfileDiamondsForEveryoneSection;
