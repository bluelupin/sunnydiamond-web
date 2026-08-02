"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import Reveal from "@/shared/Animation/Reveal";
import FormFieldError from "@/shared/ui/FormFieldError";
import InlineCustomSelect from "@/shared/ui/InlineCustomSelect";
import { useToast } from "@/shared/hooks/use-toast";
import { buildPolicyCertificationsHref } from "@/features/cms/utils/policyCertificationsRoutes";
import { useAppointmentFormValidation } from "@/shared/hooks/use-appointment-form-validation";
import { useCustomerProfileContact } from "@/shared/hooks/use-customer-profile-contact";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  APPOINTMENT_COUNTRY_CODES,
} from "@/shared/constants/appointmentForm";
import {
  createGenericSubmission,
  getGenericFormByTag,
} from "@/services/forms/generic-form.service";
import {
  invalidFieldClassName,
  invalidFieldContainerClassName,
  sanitizePhoneInput,
} from "@/shared/utils/formValidation";
import { cn } from "@/shared/utils/cn";
import { contactPageContent } from "../data/content";

const consentLinkClassName =
  "border-b border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack";

const mobileConsentLinkClassName = "font-gill font-normal text-neutral500";

const contactLabelClassName =
  "font-gill text-base font-normal leading-110 text-darkblack";

const contactPhoneLabelClassName =
  "font-gill text-base font-normal leading-110 text-[#2B2B2B] md:text-darkblack";

const contactFieldClassName =
  "h-14 w-full bg-[#F2F2F2] p-3 font-gill text-base font-normal leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600";

const contactSelectTriggerClassName = "text-base font-normal";

const contactSelectPlaceholderClassName = "font-normal text-gray600";

const SELECT_CHEVRON_ICON = "/images/jewellery/chevron-down-filter.svg";

const ContactPhoneChevron = () => (
  <span
    className="pointer-events-none inline-flex size-6 shrink-0 items-center justify-center"
    aria-hidden
  >
    <Image
      src={SELECT_CHEVRON_ICON}
      alt=""
      width={7}
      height={15}
      className="rotate-90 shrink-0 object-contain"
      style={{ width: 7.038, height: 14.651 }}
    />
  </span>
);

type ContactConsentCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

const ContactConsentCheckbox = ({ checked, onChange }: ContactConsentCheckboxProps) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={cn(
      "relative size-6 shrink-0",
      checked
        ? "flex items-center justify-center border border-transparent bg-linkGold"
        : "overflow-clip md:flex md:items-center md:justify-center md:border md:border-darkblack md:bg-white",
    )}
  >
    {checked ? (
      <Check className="size-4 text-white" strokeWidth={2.5} aria-hidden />
    ) : (
      <>
        <span className="absolute left-1/2 top-1/2 size-[18px] -translate-x-1/2 -translate-y-1/2 md:hidden">
          <span className="absolute inset-[-2.78%]">
            <img
              src="/images/contact/icon-checkbox-off.svg"
              alt=""
              className="block size-full max-w-none"
            />
          </span>
        </span>
        <Check className="hidden size-4 opacity-0 md:block" strokeWidth={2.5} aria-hidden />
      </>
    )}
  </button>
);

const ContactFormSection = () => {
  const { form } = contactPageContent;
  const { toast } = useToast();
  const { status } = useAuth();
  const isAuthenticated = status === "authenticated";
  const { contact: profileContact } = useCustomerProfileContact(isAuthenticated);

  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [hasAppliedProfilePrefill, setHasAppliedProfilePrefill] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reasonOptions, setReasonOptions] = useState<string[]>([...form.reasonOptions]);
  const [submitLabel, setSubmitLabel] = useState<string>(form.submitLabel);
  const [formTag, setFormTag] = useState<string>(form.formTag);

  const formValues = useMemo(
    () => ({ name, countryCode, phone, email, date: "", note: message }),
    [name, countryCode, phone, email, message],
  );

  const validationOptions = useMemo(
    () => ({ noteRequired: true, emailRequired: true }),
    [],
  );

  const { errors, isValid, submitted, markTouched, showError, validateSubmit, resetValidation } =
    useAppointmentFormValidation(formValues, validationOptions);

  const isFormReady = useMemo(
    () => isValid && reason.trim().length > 0 && consentAccepted,
    [isValid, reason, consentAccepted],
  );

  const showReasonError = submitted && !reason.trim();
  const showConsentError = submitted && !consentAccepted;

  // Prefill from My Profile once when logged in; never overwrite fields the user already typed.
  useEffect(() => {
    if (!profileContact || hasAppliedProfilePrefill) return;

    const profileName = profileContact.fullName?.trim();
    const profileEmail = profileContact.email?.trim();
    const profilePhone = profileContact.phone?.trim();
    const profileCountryCode = profileContact.countryCode?.trim();

    if (profileName && !name.trim()) {
      setName(profileName);
    }
    if (profileEmail && !email.trim()) {
      setEmail(profileEmail);
    }
    if (profilePhone && !phone.trim()) {
      setPhone(profilePhone);
    }
    if (profileCountryCode) {
      setCountryCode(profileCountryCode);
    }

    setHasAppliedProfilePrefill(true);
  }, [profileContact, hasAppliedProfilePrefill, name, email, phone]);

  useEffect(() => {
    const controller = new AbortController();

    getGenericFormByTag(form.formTag, controller.signal)
      .then((cmsForm) => {
        if (!cmsForm) return;

        setFormTag(cmsForm.formTag);
        setSubmitLabel(cmsForm.submitButtonText || form.submitLabel);

        if (cmsForm.purposeOptions.length > 0) {
          setReasonOptions(cmsForm.purposeOptions);
        }
      })
      .catch(() => {
        // Static fallback content is sufficient when CMS is unavailable.
      });

    return () => controller.abort();
  }, [form.formTag, form.submitLabel]);

  const resetForm = () => {
    setName("");
    setCountryCode("+91");
    setPhone("");
    setEmail("");
    setReason("");
    setMessage("");
    setConsentAccepted(false);
    setHasAppliedProfilePrefill(false);
    resetValidation();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    validateSubmit(async () => {
      if (!reason.trim() || !consentAccepted) {
        return;
      }

      setIsSubmitting(true);

      try {
        const notes = `Reason: ${reason}\n\n${message.trim()}`;

        await createGenericSubmission({
          formTag,
          fullName: name.trim(),
          email: email.trim(),
          phone: `${countryCode}${phone.trim()}`,
          notes,
          sourcePage: "/contact",
          consentAccepted: true,
        });

        toast({
          title: form.successTitle,
          description: form.successDescription,
        });
        resetForm();
      } catch (error) {
        toast({
          title: "Unable to send message",
          description:
            error instanceof Error ? error.message : "Please try again in a moment.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  return (
    <section aria-labelledby="contact-form-title" className="w-full md:px-10">
      <div className="mx-auto w-full max-w-[1140px] md:bg-gray200 md:p-6">
        <div className="flex flex-col gap-6">
          <Reveal
            as="h2"
            id="contact-form-title"
            direction="up"
            className="font-larken text-2xl font-light leading-110 text-darkblack md:text-32"
          >
            {form.title}
          </Reveal>

          <div className="h-px w-full bg-neutral300 md:hidden" aria-hidden />

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-name" className={contactLabelClassName}>
                    {form.fields.nameLabel}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    onBlur={() => markTouched("name")}
                    autoComplete="name"
                    placeholder={form.fields.mobileFieldPlaceholder}
                    aria-invalid={showError("name") || undefined}
                    aria-describedby={showError("name") ? "contact-name-error" : undefined}
                    className={cn(
                      contactFieldClassName,
                      showError("name") && invalidFieldClassName,
                    )}
                  />
                  <FormFieldError
                    id="contact-name-error"
                    message={showError("name") ? errors.name : undefined}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <div className="flex h-[82px] flex-col items-start justify-between md:h-auto md:gap-2">
                      <label htmlFor="contact-phone" className={contactPhoneLabelClassName}>
                        {form.fields.phoneLabel}
                      </label>
                      <div
                        className={cn(
                          "flex h-14 w-full items-center gap-2 bg-[#F2F2F2] p-3",
                          showError("phone") && invalidFieldContainerClassName,
                        )}
                      >
                        <div className="flex shrink-0 items-center">
                          <select
                            value={countryCode}
                            onChange={(event) => {
                              setCountryCode(event.target.value);
                              setPhone(sanitizePhoneInput(phone, event.target.value));
                              markTouched("phone");
                            }}
                            aria-label="Country code"
                            className="appearance-none bg-transparent font-gill text-base font-normal leading-110 text-darkblack outline-none"
                          >
                            {APPOINTMENT_COUNTRY_CODES.map((entry) => (
                              <option key={entry.code} value={entry.code}>
                                {entry.code}
                              </option>
                            ))}
                          </select>
                          <ContactPhoneChevron />
                        </div>
                        <input
                          id="contact-phone"
                          type="tel"
                          inputMode="numeric"
                          value={phone}
                          onChange={(event) =>
                            setPhone(sanitizePhoneInput(event.target.value, countryCode))
                          }
                          onBlur={() => markTouched("phone")}
                          autoComplete="tel-national"
                          placeholder={form.fields.mobileFieldPlaceholder}
                          aria-invalid={showError("phone") || undefined}
                          aria-describedby={showError("phone") ? "contact-phone-error" : undefined}
                          className="min-w-0 flex-1 bg-transparent font-gill text-base font-normal leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600"
                        />
                      </div>
                    </div>
                    <FormFieldError
                      id="contact-phone-error"
                      message={showError("phone") ? errors.phone : undefined}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-email" className={contactLabelClassName}>
                      {form.fields.emailLabel}
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      onBlur={() => markTouched("email")}
                      autoComplete="email"
                      placeholder={form.fields.mobileFieldPlaceholder}
                      aria-invalid={showError("email") || undefined}
                      aria-describedby={showError("email") ? "contact-email-error" : undefined}
                      className={cn(
                        contactFieldClassName,
                        showError("email") && invalidFieldClassName,
                      )}
                    />
                    <FormFieldError
                      id="contact-email-error"
                      message={showError("email") ? errors.email : undefined}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex h-[82px] flex-col items-start justify-between md:h-auto md:gap-2">
                    <label htmlFor="contact-reason" className={contactLabelClassName}>
                      {form.fields.reasonLabel}
                    </label>
                    <InlineCustomSelect
                      id="contact-reason"
                      label={form.fields.reasonLabel}
                      value={reason}
                      options={reasonOptions}
                      placeholder={form.fields.mobileReasonPlaceholder}
                      onChange={setReason}
                      hideLabel
                      labelClassName={contactLabelClassName}
                      triggerClassName={cn(contactFieldClassName, contactSelectTriggerClassName)}
                      placeholderClassName={contactSelectPlaceholderClassName}
                      invalid={showReasonError}
                      errorId="contact-reason-error"
                    />
                  </div>
                  {showReasonError ? (
                    <FormFieldError id="contact-reason-error" message="Please select a reason" />
                  ) : null}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-message" className={contactLabelClassName}>
                    {form.fields.messageLabel}
                  </label>
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onBlur={() => markTouched("note")}
                    placeholder={form.fields.mobileMessagePlaceholder}
                    rows={4}
                    aria-invalid={showError("note") || undefined}
                    aria-describedby={showError("note") ? "contact-message-error" : undefined}
                    className={cn(
                      "h-[100px] w-full resize-none bg-[#F2F2F2] p-3 font-gill text-base font-normal leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600",
                      showError("note") && invalidFieldClassName,
                    )}
                  />
                  <FormFieldError
                    id="contact-message-error"
                    message={showError("note") ? errors.note : undefined}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <ContactConsentCheckbox
                    checked={consentAccepted}
                    onChange={setConsentAccepted}
                  />
                  <p className="hidden min-w-0 flex-1 font-gill text-base font-light leading-110 text-darkblack md:block">
                    {form.consentPrefix}{" "}
                    <Link href="/terms-and-conditions" className={consentLinkClassName}>
                      {form.termsLabel}
                    </Link>{" "}
                    <span className="font-gill font-normal">and</span>{" "}
                    <Link
                      href={buildPolicyCertificationsHref("privacy-policy")}
                      className={consentLinkClassName}
                    >
                      {form.privacyLabel}
                    </Link>
                    {form.consentSuffix}
                  </p>
                  <p className="min-w-0 flex-1 font-gill text-sm leading-110 text-neutral500 md:hidden">
                    <span className="font-light">{form.consentPrefix} </span>
                    <span className="font-normal">
                      <Link href="/terms-and-conditions" className={mobileConsentLinkClassName}>
                        {form.mobileTermsLabel}
                      </Link>
                      {" and "}
                      <Link
                        href={buildPolicyCertificationsHref("privacy-policy")}
                        className={mobileConsentLinkClassName}
                      >
                        {form.mobilePrivacyLabel}
                      </Link>
                      {form.mobileConsentSuffix}
                    </span>
                  </p>
                </div>
                {showConsentError ? (
                  <FormFieldError message={form.consentError} />
                ) : null}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isFormReady}
              className="btn-dark-slide inline-flex h-14 w-full items-center justify-center border border-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white disabled:cursor-not-allowed disabled:border-darkblack disabled:bg-neutral500 disabled:opacity-50 md:w-auto md:self-start"
            >
              <span className="relative z-10">{submitLabel}</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;
