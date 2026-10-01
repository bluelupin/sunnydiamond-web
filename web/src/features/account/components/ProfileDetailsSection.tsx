"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth, type AuthCustomer } from "@/features/auth/context/AuthContext";
import { useAuthFeatures } from "@/features/auth/context/AuthFeaturesContext";
import CheckoutOtpModal from "@/features/checkout/components/CheckoutOtpModal";
import {
  sanitizePhoneInput,
  validatePhone,
  validateRequiredName,
} from "@/shared/utils/formValidation";
import { formatLoginPhoneForMagento, splitPhoneNumber } from "@/lib/auth/magentoPhone";
import PhoneCountryCodeSelect from "@/shared/ui/PhoneCountryCodeSelect";
import { cn } from "@/shared/utils/cn";
import {
  DetailDarkButton,
  DetailOutlineButton,
  DetailTextLink,
} from "@/features/products/components/detail/shared";
import AppStatusToast, { appStatusToastDurationMs } from "@/shared/ui/AppStatusToast";
import { useCustomerProfileContact } from "@/shared/hooks/use-customer-profile-contact";
import {
  APPOINTMENT_COUNTRY_CODES,
  appointmentFieldClassName,
  appointmentLabelClassName,
} from "@/shared/constants/appointmentForm";
import { profileDetailsContent } from "../data/profileContent";
import { formatCustomerFullName } from "../utils/formatAccountData";
import { isRegisteredProfileEmail } from "../utils/profileEmailVerification";
import { useDeleteAccount } from "../hooks/useDeleteAccount";
import { ProfileDeleteAccountDialog } from "./ProfileDeleteAccountDialog";
import { ProfileDeleteAccountReasonDialog } from "./ProfileDeleteAccountReasonDialog";
import { ProfileDeleteAccountSuccessDialog } from "./ProfileDeleteAccountSuccessDialog";
import { ProfileEmailVerifiedBadge, ProfileFieldInfoTooltip } from "./profileUi";
import {
  getAppointmentContactLocks,
  getAuthLoginIdentifierKind,
} from "@/features/auth/utils/authLoginIdentifier";
import { TooltipProvider } from "@/shared/ui/tooltip";

type ProfileDetailsSectionProps = {
  customer: AuthCustomer;
};

/** Figma 1480:20341 — profile personal details, delete account, and logout mobile layout */
const ProfileDetailsSection = ({ customer }: ProfileDetailsSectionProps) => {
  const { logout, refresh } = useAuth();
  const { otpLoginEnabled, otpCountryCodes } = useAuthFeatures();
  // With SMS OTP on, a new number is verified by SMS, so only SMS countries are offered.
  const phoneCountryCodes = otpLoginEnabled
    ? otpCountryCodes
    : APPOINTMENT_COUNTRY_CODES.map((entry) => entry.code);
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

  const initialFullName = formatCustomerFullName(customer.firstname, customer.lastname);
  const initialEmail = customer.email ?? "";
  // Placeholder guest addresses get neither a badge nor a Verify link.
  const isEmailVerifiable = isRegisteredProfileEmail(initialEmail);
  const [emailOtpOpen, setEmailOtpOpen] = useState(false);

  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+91");
  const [phoneOtpOpen, setPhoneOtpOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setFullName(initialFullName);
  }, [initialFullName]);

  // Account mobile number first (refreshed after a save); address-book phone as fallback.
  const { countryCode: initialCountryCode, national: initialPhone } = useMemo(
    () =>
      customer.phone
        ? splitPhoneNumber(customer.phone)
        : { countryCode: contact?.countryCode || "+91", national: contact?.phone ?? "" },
    [customer.phone, contact?.countryCode, contact?.phone],
  );

  // Re-sync the field when the stored number changes (initial load, post-save refresh).
  // Starts unsynced so a number already known on the first render fills the field too.
  const initialPhoneKey = `${initialCountryCode} ${initialPhone}`;
  const [syncedPhone, setSyncedPhone] = useState<string | null>(null);
  if (syncedPhone !== initialPhoneKey) {
    setSyncedPhone(initialPhoneKey);
    setPhone(initialPhone);
    setPhoneCountryCode(initialCountryCode);
  }

  const nameChanged = fullName.trim() !== initialFullName.trim();
  const phoneChanged = phone !== initialPhone || (Boolean(phone) && phoneCountryCode !== initialCountryCode);
  const hasChanges = nameChanged || phoneChanged;
  const phoneE164 = formatLoginPhoneForMagento(phoneCountryCode, phone);
  const { phoneLocked } = getAppointmentContactLocks(getAuthLoginIdentifierKind());
  const phoneInfoTooltip = phoneLocked
    ? content.phoneRegisteredTooltip
    : content.phoneInfo;

  const handleCancel = () => {
    setFullName(initialFullName);
    setPhone(initialPhone);
    setPhoneCountryCode(initialCountryCode);
  };

  const handleLogout = () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    void logout();
  };

  const handleSave = () => {
    const nameValidation = validateRequiredName(fullName);
    if (!nameValidation.valid) {
      showStatusToast(nameValidation.error ?? content.saveErrorToastMessage);
      return;
    }

    if (phoneChanged && phone && !validatePhone(phone, phoneCountryCode).valid) {
      showStatusToast(content.phoneInvalidMessage);
      return;
    }

    void (async () => {
      setIsSaving(true);

      try {
        if (nameChanged) {
          await patchProfile({ fullName: fullName.trim() }, content.saveErrorToastMessage);
        }

        if (phoneChanged) {
          // With SMS OTP on, the number must be verified before it is linked.
          if (otpLoginEnabled && phone) {
            if (nameChanged) {
              await refresh();
            }
            setPhoneOtpOpen(true);
            return;
          }
          await patchProfile({ phone: phoneE164 }, content.phoneErrorToastMessage);
        }

        await refresh();
        showStatusToast(
          phoneChanged ? content.phoneSuccessToastMessage : content.saveSuccessToastMessage,
        );
      } catch (error) {
        showStatusToast(error instanceof Error ? error.message : content.saveErrorToastMessage);
      } finally {
        setIsSaving(false);
      }
    })();
  };

  const handlePhoneLinked = () => {
    setPhoneOtpOpen(false);
    void refresh().then(() => showStatusToast(content.phoneSuccessToastMessage));
  };

  const patchProfile = async (body: Record<string, string>, fallbackError: string) => {
    const response = await fetch("/api/customer/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      throw new Error(payload.error || fallbackError);
    }
  };

  const handleEmailVerified = () => {
    setEmailOtpOpen(false);
    void refresh().then(() => showStatusToast(content.emailVerifiedToastMessage));
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

  // Deletion is scheduled and every token revoked server-side — dismissing only clears local state.
  // The dialog stays mounted while `logout` hard-navigates home.
  const handleSuccessOpenChange = (open: boolean) => {
    if (!open) {
      void logout();
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <>
      <AppStatusToast
        open={Boolean(statusToastMessage)}
        message={statusToastMessage ?? ""}
      />
      <CheckoutOtpModal
        open={phoneOtpOpen}
        phone={phone}
        countryCode={phoneCountryCode}
        purpose="link"
        onClose={() => setPhoneOtpOpen(false)}
        onVerify={handlePhoneLinked}
      />
      <CheckoutOtpModal
        open={emailOtpOpen}
        phone={initialEmail}
        purpose="verifyEmail"
        onClose={() => {
          setEmailOtpOpen(false);
          // Picks up a verification done elsewhere ("already verified" in the popup).
          void refresh();
        }}
        onVerify={handleEmailVerified}
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
                {!isEmailVerifiable ? null : customer.emailVerified ? (
                  <ProfileEmailVerifiedBadge label={content.verifiedLabel} />
                ) : (
                  <DetailTextLink
                    onClick={() => setEmailOtpOpen(true)}
                    className="shrink-0 text-sm uppercase"
                  >
                    {content.verifyLabel}
                  </DetailTextLink>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <label htmlFor="profile-phone" className={appointmentLabelClassName}>
                  {content.fields.phone}
                </label>
                <ProfileFieldInfoTooltip
                  message={phoneInfoTooltip}
                  ariaLabel="Phone number information"
                />
              </div>
              <div className={cn(appointmentFieldClassName, "flex items-center gap-2")}>
                <PhoneCountryCodeSelect
                  id="profile-phone-country-code"
                  value={phoneCountryCode}
                  codes={phoneCountryCodes}
                  onChange={(code) => {
                    setPhoneCountryCode(code);
                    setPhone((current) => sanitizePhoneInput(current, code));
                  }}
                />
                <input
                  id="profile-phone"
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(event) => setPhone(sanitizePhoneInput(event.target.value, phoneCountryCode))}
                  placeholder={content.phonePlaceholder}
                  autoComplete="tel-national"
                  className="min-w-0 flex-1 bg-transparent font-gill text-base leading-110 text-darkblack outline-none placeholder:text-[#999999]"
                />
                {/* Only a number proven with a code signs in; offer the code for one typed in without it. */}
                {otpLoginEnabled && phone && !phoneChanged ? (
                  customer.phoneVerified ? (
                    <ProfileEmailVerifiedBadge label={content.verifiedLabel} />
                  ) : (
                    <DetailTextLink
                      onClick={() => setPhoneOtpOpen(true)}
                      className="shrink-0 text-sm uppercase"
                    >
                      {content.verifyLabel}
                    </DetailTextLink>
                  )
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            <DetailDarkButton
              type="button"
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="w-full md:order-2 md:flex-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "SAVING" : content.saveLabel}
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
          <div className="flex flex-col gap-[14px]">
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
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full shrink-0 lg:w-auto lg:min-w-[160px] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoggingOut ? content.logout.loggingOutLabel : content.logout.ctaLabel}
          </DetailDarkButton>
        </div>
      </div>
      </>
    </TooltipProvider>
  );
};

export default ProfileDetailsSection;
