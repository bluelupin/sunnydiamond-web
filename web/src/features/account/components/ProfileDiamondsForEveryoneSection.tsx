"use client";

import type { AuthCustomer } from "@/features/auth/context/AuthContext";
import AlertTriangleIcon from "@/assets/Icons/AlertTriangleIcon";
import { CartPrimaryLink } from "@/features/cart/components/CartFlowUi";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { maskIdNumber } from "@/features/diamonds-for-everyone/utils/maskIdNumber";
import { useCustomerProfileContact } from "@/shared/hooks/use-customer-profile-contact";
import { useToast } from "@/shared/hooks/use-toast";
import { formatCustomerFullName } from "@/shared/utils/customerName";
import { MOCK_PROFILE_DFE_PLAN } from "../data/profileDfeMockData";
import { profileTabsContent } from "../data/profileContent";
import type { ProfileDfePaymentDueUi, ProfileDfePlanUi } from "../types/profileDfe.types";
import { ProfileDiamondsForEveryoneSkeleton } from "./ProfileDiamondsForEveryoneSkeleton";
import { ProfileDfeReadOnlyField, ProfileDfeSectionCard } from "./profileUi";
import { ProfileDfeInvestmentSummary } from "./ProfileDfeInvestmentSummary";

const DOCUMENT_ICON_SRC = "/images/diamonds-for-everyone/invest-review-document.svg";

function formatInrAmount(amount: number): string {
  return amount.toLocaleString("en-IN");
}

function ProfileDfeAttachmentLink({ fileName }: { fileName: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-gill text-base font-normal leading-110 text-darkblack">
        {profileTabsContent.diamondsForEveryone.imageAttachedLabel}
      </p>
      <div className="flex items-center gap-2">
        <span className="relative size-6 shrink-0 overflow-clip" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={DOCUMENT_ICON_SRC} alt="" className="block size-full max-w-none" />
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

  return (
    <div className="bg-yellow100 md:px-6 px-4 py-4 flex gap-2 flex-nowrap">
      <AlertTriangleIcon className="size-6 shrink-0 text-darkblack" />
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
    <div className="flex flex-col lg:gap-10 gap-6">
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
          <div className="flex flex-col gap-4">
            <div
              className="flex h-[50px] w-full items-center gap-2 border border-black px-3 py-2 text-darkblack"
            >
              <span className="font-gill text-lg font-light tracking-[0.18px]">₹</span>
              <span className="font-gill text-base font-normal">
                {formatInrAmount(plan.monthlyAmount)}
              </span>
            </div>

            <p className="font-gill text-base font-normal leading-110 text-[#2B2B2B]">
              {content.summaryTitle}
            </p>

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

function ProfileDfeEmptyState() {
  const content = profileTabsContent.diamondsForEveryone;

  return (
    <div className="flex flex-col gap-4 bg-gray300 p-6">
      <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
        {content.emptyTitle}
      </h2>
      <p className="font-gill text-base font-light leading-110 text-darkblack">
        {content.emptyDescription}
      </p>
      <CartPrimaryLink href={content.emptyCtaHref} className="w-full max-w-xs">
        {content.emptyCta}
      </CartPrimaryLink>
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

  const accountPhone = (() => {
    if (!contact?.phone) {
      return MOCK_PROFILE_DFE_PLAN.nominee.phone;
    }

    const prefix = contact.countryCode ?? "";
    return `${prefix}${contact.phone}`;
  })();

  const displayFullName = accountFullName || MOCK_PROFILE_DFE_PLAN.nominee.fullName;
  const displayEmail = accountEmail || MOCK_PROFILE_DFE_PLAN.nominee.email;

  // TODO: replace with customer DFE plan API when available.
  const plan: ProfileDfePlanUi | null = MOCK_PROFILE_DFE_PLAN;

  if (isLoading) {
    return <ProfileDiamondsForEveryoneSkeleton />;
  }

  if (!plan) {
    return <ProfileDfeEmptyState />;
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
