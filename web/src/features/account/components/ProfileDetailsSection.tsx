"use client";

import { useEffect, useMemo, useState } from "react";
import { Info } from "lucide-react";
import { useAuth, type AuthCustomer } from "@/features/auth/context/AuthContext";
import {
  DetailDarkButton,
  DetailOutlineButton,
  DetailTextLink,
} from "@/features/products/components/detail/shared";
import { useToast } from "@/shared/hooks/use-toast";
import { useCustomerProfileContact } from "@/shared/hooks/use-customer-profile-contact";
import {
  appointmentFieldClassName,
  appointmentLabelClassName,
} from "@/shared/constants/appointmentForm";
import { profileDetailsContent } from "../data/profileContent";
import { ProfileDeleteAccountDialog } from "./ProfileDeleteAccountDialog";
import { ProfileDeleteAccountReasonDialog } from "./ProfileDeleteAccountReasonDialog";

type ProfileDetailsSectionProps = {
  customer: AuthCustomer;
};

const ProfileDetailsSection = ({ customer }: ProfileDetailsSectionProps) => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const { contact } = useCustomerProfileContact(true);
  const content = profileDetailsContent;
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteReasonOpen, setDeleteReasonOpen] = useState(false);

  const initialFullName = [customer.firstname, customer.lastname].filter(Boolean).join(" ");
  const initialEmail = customer.email ?? "";

  const [fullName, setFullName] = useState(initialFullName);

  useEffect(() => {
    setFullName(initialFullName);
  }, [initialFullName]);

  const phoneDisplay = useMemo(() => {
    if (!contact?.phone) return "";
    const prefix = contact.countryCode ?? "";
    return `${prefix}${contact.phone}`;
  }, [contact]);

  const hasChanges = fullName.trim() !== initialFullName.trim();

  const handleCancel = () => {
    setFullName(initialFullName);
  };

  const handleSave = () => {
    toast({
      title: content.saveUnavailableTitle,
      description: content.saveUnavailableDescription,
    });
  };

  const handleVerifyEmail = () => {
    toast({
      title: "Email verified",
      description: "Your email is linked to your Sunny Diamonds account.",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">
          {content.sectionTitle}
        </h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="profile-full-name" className={appointmentLabelClassName}>
              {content.fields.fullName}
            </label>
            <input
              id="profile-full-name"
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              autoComplete="name"
              className={appointmentFieldClassName}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="profile-email" className={appointmentLabelClassName}>
              {content.fields.email}
            </label>
            <div className="flex h-14 w-full items-center justify-between bg-[#F2F2F2] px-3">
              <input
                id="profile-email"
                type="email"
                value={initialEmail}
                readOnly
                className="min-w-0 flex-1 bg-transparent font-gill text-base leading-110 text-darkblack outline-none"
              />
              <DetailTextLink onClick={handleVerifyEmail} className="shrink-0 text-sm uppercase">
                {content.verifyLabel}
              </DetailTextLink>
            </div>
          </div>

          <div className="flex flex-col gap-2 opacity-50">
            <div className="flex items-center gap-2">
              <span className={appointmentLabelClassName}>{content.fields.phone}</span>
              <button
                type="button"
                className="text-darkblack"
                aria-label={content.phoneInfo}
                title={content.phoneInfo}
              >
                <Info className="size-6" strokeWidth={1.5} aria-hidden />
              </button>
            </div>
            <input
              id="profile-phone"
              type="text"
              value={phoneDisplay}
              readOnly
              className={appointmentFieldClassName}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
          <DetailDarkButton
            type="button"
            onClick={handleSave}
            disabled={!hasChanges}
            className="w-full md:order-2 md:flex-1 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {content.saveLabel}
          </DetailDarkButton>
          <DetailOutlineButton
            type="button"
            onClick={handleCancel}
            className="w-full md:order-1 md:flex-1"
          >
            {content.cancelLabel}
          </DetailOutlineButton>
        </div>
      </div>

      <div className="flex flex-col gap-6 bg-gray300 p-4 md:gap-6 md:p-6">
        <div className="flex flex-col gap-3.5 md:gap-4">
          <h3 className="font-larken text-2xl font-light leading-110 text-darkblack">
            {content.deleteAccount.title}
          </h3>
          <p className="font-gill text-base font-light leading-110 text-neutral500">
            {content.deleteAccount.description}
          </p>
        </div>
        <DetailTextLink
          onClick={() => setDeleteConfirmOpen(true)}
          className="text-sm uppercase"
        >
          {content.deleteAccount.ctaLabel}
        </DetailTextLink>
      </div>

      <ProfileDeleteAccountDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onDelete={() => setDeleteReasonOpen(true)}
      />

      <ProfileDeleteAccountReasonDialog
        open={deleteReasonOpen}
        onOpenChange={setDeleteReasonOpen}
        onConfirm={() => {
          setDeleteReasonOpen(false);
          toast({
            title: content.deleteAccount.reasonDialog.deletedToastTitle,
            description: content.deleteAccount.reasonDialog.deletedToastDescription,
          });
        }}
      />

      <div className="flex flex-col gap-6 bg-gray300 p-4 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex max-w-md flex-col gap-4">
          <h3 className="font-larken text-2xl font-light leading-110 text-darkblack">
            {content.logout.title}
          </h3>
          <p className="font-gill text-base font-light leading-110 text-neutral500">
            {content.logout.description}
          </p>
        </div>
        <DetailDarkButton
          type="button"
          onClick={() => void logout()}
          className="w-full shrink-0 md:w-auto md:min-w-[160px]"
        >
          {content.logout.ctaLabel}
        </DetailDarkButton>
      </div>
    </div>
  );
};

export default ProfileDetailsSection;
