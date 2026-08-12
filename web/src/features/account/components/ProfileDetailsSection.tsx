"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import InformationIcon from "@/assets/Icons/InformationIcon";
import { useAuth, type AuthCustomer } from "@/features/auth/context/AuthContext";
import {
  DetailDarkButton,
  DetailOutlineButton,
  DetailTextLink,
} from "@/features/products/components/detail/shared";
import AppStatusToast, { appStatusToastDurationMs } from "@/shared/ui/AppStatusToast";
import { useCustomerProfileContact } from "@/shared/hooks/use-customer-profile-contact";
import {
  appointmentFieldClassName,
  appointmentLabelClassName,
} from "@/shared/constants/appointmentForm";
import { profileDetailsContent } from "../data/profileContent";
import { useDeleteAccount } from "../hooks/useDeleteAccount";
import { ProfileDeleteAccountDialog } from "./ProfileDeleteAccountDialog";
import { ProfileDeleteAccountReasonDialog } from "./ProfileDeleteAccountReasonDialog";
import { ProfileDeleteAccountSuccessDialog } from "./ProfileDeleteAccountSuccessDialog";

type ProfileDetailsSectionProps = {
  customer: AuthCustomer;
};

/** Figma 1480:20341 — profile personal details, delete account, and logout mobile layout */
const ProfileDetailsSection = ({ customer }: ProfileDetailsSectionProps) => {
  const { logout } = useAuth();
  const { contact } = useCustomerProfileContact(true);
  const content = profileDetailsContent;
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteReasonOpen, setDeleteReasonOpen] = useState(false);
  const [deleteSuccessOpen, setDeleteSuccessOpen] = useState(false);
  const [statusToastMessage, setStatusToastMessage] = useState<string | null>(null);
  const statusToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { isSubmitting, error, clearError, deleteAccount } = useDeleteAccount();

  const dismissStatusToast = useCallback(() => {
    if (statusToastTimeoutRef.current) {
      clearTimeout(statusToastTimeoutRef.current);
      statusToastTimeoutRef.current = null;
    }
    setStatusToastMessage(null);
  }, []);

  const showStatusToast = useCallback(
    (message: string) => {
      dismissStatusToast();
      setStatusToastMessage(message);
      statusToastTimeoutRef.current = setTimeout(() => {
        setStatusToastMessage(null);
        statusToastTimeoutRef.current = null;
      }, appStatusToastDurationMs);
    },
    [dismissStatusToast],
  );

  useEffect(() => {
    return () => {
      if (statusToastTimeoutRef.current) {
        clearTimeout(statusToastTimeoutRef.current);
      }
    };
  }, []);

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
    showStatusToast(content.saveUnavailableToastMessage);
  };

  const handleVerifyEmail = () => {
    showStatusToast(content.emailVerifiedToastMessage);
  };

  const handleProceedToDelete = () => {
    clearError();
    setDeleteReasonOpen(true);
  };

  const handleReasonOpenChange = (open: boolean) => {
    if (!open) {
      clearError();
    }
    setDeleteReasonOpen(open);
  };

  const handleConfirmDelete = async (payload: { reason: string; comments: string }) => {
    try {
      await deleteAccount(payload);
      setDeleteReasonOpen(false);
      setDeleteSuccessOpen(true);
    } catch {
      // `useDeleteAccount` keeps the message; the reason dialog renders it.
    }
  };

  // The account is already gone server-side — dismissing only clears local state.
  // The dialog stays mounted while `logout` hard-navigates home.
  const handleSuccessOpenChange = (open: boolean) => {
    if (!open) {
      void logout();
    }
  };

  return (
    <>
      <AppStatusToast
        open={Boolean(statusToastMessage)}
        message={statusToastMessage ?? ""}
      />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
        <h2 className="font-gill text-xl font-normal leading-110 text-darkblack lg:font-larken lg:text-2xl lg:font-light">
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
            <div className="flex h-14 w-full items-center justify-between bg-aboutInactive p-3">
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
                <InformationIcon className="size-6 shrink-0 text-darkblack" aria-hidden />
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

      <div className="flex flex-col gap-6 bg-gray300 p-4 lg:p-6">
        <div className="flex flex-col gap-4">
          <h3 className="font-gill text-xl font-normal leading-110 text-darkblack lg:font-larken lg:text-2xl lg:font-light">
            {content.deleteAccount.title}
          </h3>
          <p className="font-gill text-base font-light leading-110 text-darkblack lg:text-neutral500">
            {content.deleteAccount.description}
          </p>
        </div>
        <DetailTextLink onClick={() => setDeleteConfirmOpen(true)} className="text-sm uppercase">
          {content.deleteAccount.ctaLabel}
        </DetailTextLink>
      </div>

      <ProfileDeleteAccountDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onDelete={handleProceedToDelete}
      />

      <ProfileDeleteAccountReasonDialog
        open={deleteReasonOpen}
        onOpenChange={handleReasonOpenChange}
        onConfirm={(payload) => void handleConfirmDelete(payload)}
        isSubmitting={isSubmitting}
        errorMessage={error}
      />

      <ProfileDeleteAccountSuccessDialog
        open={deleteSuccessOpen}
        onOpenChange={handleSuccessOpenChange}
      />

      <div className="flex flex-col gap-6 bg-gray300 p-4 lg:flex-row lg:items-center lg:justify-between lg:p-6">
        <div className="flex flex-col gap-4 lg:max-w-md">
          <h3 className="font-gill text-xl font-normal leading-110 text-darkblack lg:font-larken lg:text-2xl lg:font-light">
            {content.logout.title}
          </h3>
          <p className="font-gill text-base font-light leading-110 text-darkblack lg:text-neutral500">
            {content.logout.description}
          </p>
        </div>
        <DetailDarkButton
          type="button"
          onClick={() => void logout()}
          className="w-full shrink-0 lg:w-auto lg:min-w-[160px]"
        >
          {content.logout.ctaLabel}
        </DetailDarkButton>
      </div>
      </div>
    </>
  );
};

export default ProfileDetailsSection;
