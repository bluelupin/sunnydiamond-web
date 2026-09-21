"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Reveal from "@/shared/Animation/Reveal";
import GiftingPanelCheckbox from "@/shared/ui/GiftingPanelCheckbox";
import FormFieldError from "@/shared/ui/FormFieldError";
import CareersSelectField from "@/features/careers/components/shared/CareersSelectField";
import { useToast } from "@/shared/hooks/use-toast";
import { useAppointmentFormValidation } from "@/shared/hooks/use-appointment-form-validation";
import { useCustomerProfileContact } from "@/shared/hooks/use-customer-profile-contact";
import { useAuth } from "@/features/auth/context/AuthContext";
import PhoneCountryCodeSelect from "@/shared/ui/PhoneCountryCodeSelect";
import {
  fetchGenericFormByTag,
  submitContactEnquiry,
} from "@/services/forms/generic-form.service";
import type { NormalizedContactForm } from "@/services/contact/contact-page.types";
import {
  formatRequiredFieldLabel,
  invalidFieldClassName,
  invalidFieldContainerClassName,
  sanitizePhoneInput,
} from "@/shared/utils/formValidation";
import { cn } from "@/shared/utils/cn";
import ContactConsentLabel from "./ContactConsentLabel";


const contactLabelClassName =
  "font-gill text-base font-normal leading-110 text-darkblack";

const contactPhoneLabelClassName =
  "font-gill text-base font-normal leading-110 text-[#2B2B2B] md:text-darkblack";

const contactFieldClassName =
  "h-14 w-full bg-[#F2F2F2] p-3 font-gill text-base font-normal leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600";

const MESSAGE_MAX_LENGTH = 500;

type ContactFormSectionProps = {
  form: NormalizedContactForm;
};

const ContactFormSection = ({ form }: ContactFormSectionProps) => {
  const { toast } = useToast();
  const { status } = useAuth();
  const isAuthenticated = status === "authenticated";
  const { contact: profileContact } = useCustomerProfileContact(isAuthenticated);

  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dropdownValues, setDropdownValues] = useState<Record<string, string>>({});
  const [extraFieldValues, setExtraFieldValues] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [hasAppliedProfilePrefill, setHasAppliedProfilePrefill] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dropdownFields, setDropdownFields] = useState(form.dropdownFields ?? []);
  const [orderedFields, setOrderedFields] = useState(form.orderedFields ?? []);
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

  const { errors, submitted, markTouched, showError, validateSubmit, resetValidation, isValid } =
    useAppointmentFormValidation(formValues, validationOptions);

  const consentLabel = form.consentLabel?.trim() ?? "";
  const consentRequired = form.requiresConsent && Boolean(consentLabel);

  const missingRequiredDropdown = dropdownFields.some(
    (field) => field.isRequired && !(dropdownValues[field.id] ?? "").trim(),
  );
  const missingRequiredExtra = orderedFields.some(
    (field) =>
      field.kind === "text" &&
      field.isRequired &&
      !(extraFieldValues[field.id] ?? "").trim(),
  );
  const showConsentError = submitted && consentRequired && !consentAccepted;

  const isFormReady =
    isValid &&
    !missingRequiredDropdown &&
    !missingRequiredExtra &&
    (!consentRequired || consentAccepted);

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
    setDropdownFields(form.dropdownFields ?? []);
    setOrderedFields(form.orderedFields ?? []);
    setExtraFieldValues({});
    setSubmitLabel(form.submitLabel);
    setFormTag(form.formTag);
  }, [form.dropdownFields, form.orderedFields, form.formTag, form.submitLabel]);

  useEffect(() => {
    const controller = new AbortController();

    fetchGenericFormByTag(form.formTag, controller.signal)
      .then((cmsForm) => {
        if (!cmsForm) return;

        setFormTag(cmsForm.formTag);
        if (cmsForm.submitButtonText) {
          setSubmitLabel(cmsForm.submitButtonText);
        }

        // Keep page-mapped dropdownFields; only refresh options for the primary reason field
        // when live CMS returns purpose options.
        if (cmsForm.purposeOptions.length > 0 && form.dropdownFields.length > 0) {
          setDropdownFields((current) =>
            current.map((field, index) =>
              index === 0
                ? { ...field, options: cmsForm.purposeOptions }
                : field,
            ),
          );
        }
      })
      .catch(() => {
        // Page-level CMS form config is used when live form fetch fails.
      });

    return () => controller.abort();
  }, [form.dropdownFields, form.formTag, form.submitLabel, form.orderedFields]);

  const dropdownById = useMemo(() => {
    const map = new Map(dropdownFields.map((field) => [field.id, field]));
    return map;
  }, [dropdownFields]);

  const renderNameField = () => (
    <div className="flex flex-col gap-2">
      {form.fields.nameLabel ? (
        <label htmlFor="contact-name" className={contactLabelClassName}>
          {formatRequiredFieldLabel(form.fields.nameLabel)}
        </label>
      ) : null}
      <input
        id="contact-name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        onBlur={() => markTouched("name")}
        autoComplete="name"
        placeholder={form.fields.namePlaceholder ?? form.fields.fieldPlaceholder}
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
  );

  const renderPhoneField = () => (
    <div className="flex flex-col gap-2">
      <div className="flex h-[82px] flex-col items-start justify-between md:h-auto md:gap-2">
        {form.fields.phoneLabel ? (
          <label htmlFor="contact-phone" className={contactPhoneLabelClassName}>
            {formatRequiredFieldLabel(form.fields.phoneLabel)}
          </label>
        ) : null}
        <div
          className={cn(
            "flex h-14 w-full items-center gap-2 bg-[#F2F2F2] p-3",
            showError("phone") && invalidFieldContainerClassName,
          )}
        >
          <PhoneCountryCodeSelect
            id="contact-country-code"
            value={countryCode}
            onChange={(nextCode) => {
              setCountryCode(nextCode);
              setPhone(sanitizePhoneInput(phone, nextCode));
              markTouched("phone");
            }}
            onBlur={() => markTouched("phone")}
          />
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
            placeholder={form.fields.phonePlaceholder ?? "Phone number"}
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
  );

  const renderEmailField = () => (
    <div className="flex flex-col gap-2">
      {form.fields.emailLabel ? (
        <label htmlFor="contact-email" className={contactLabelClassName}>
          {formatRequiredFieldLabel(form.fields.emailLabel)}
        </label>
      ) : null}
      <input
        id="contact-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        onBlur={() => markTouched("email")}
        autoComplete="email"
        placeholder={form.fields.emailPlaceholder ?? "Email address"}
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
  );

  const renderMessageField = () => (
    <div className="flex flex-col gap-2">
      {form.fields.messageLabel ? (
        <label htmlFor="contact-message" className={contactLabelClassName}>
          {formatRequiredFieldLabel(form.fields.messageLabel)}
        </label>
      ) : null}
      <textarea
        id="contact-message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onBlur={() => markTouched("note")}
        placeholder={form.fields.messagePlaceholder}
        rows={4}
        maxLength={MESSAGE_MAX_LENGTH}
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
  );

  const renderDropdownField = (fieldId: string) => {
    const field = dropdownById.get(fieldId);
    if (!field) return null;

    const value = dropdownValues[field.id] ?? "";
    const showFieldError = submitted && field.isRequired && !value.trim();

    return (
      <CareersSelectField
        key={field.id}
        id={`contact-dropdown-${field.id}`}
        label={
          field.isRequired ? formatRequiredFieldLabel(field.label) : field.label
        }
        value={value}
        options={field.options}
        placeholder={field.placeholder}
        onChange={(next) =>
          setDropdownValues((current) => ({
            ...current,
            [field.id]: next,
          }))
        }
        labelClassName={contactLabelClassName}
        error={showFieldError ? "Please select an option" : undefined}
      />
    );
  };

  const renderExtraTextField = (field: {
    id: string;
    label: string;
    placeholder?: string;
    isRequired: boolean;
    multiline?: boolean;
  }) => {
    const value = extraFieldValues[field.id] ?? "";
    const showFieldError = submitted && field.isRequired && !value.trim();
    const inputId = `contact-extra-${field.id}`;
    const label = field.isRequired
      ? formatRequiredFieldLabel(field.label)
      : field.label;

    return (
      <div key={field.id} className="flex flex-col gap-2">
        <label htmlFor={inputId} className={contactLabelClassName}>
          {label}
        </label>
        {field.multiline ? (
          <textarea
            id={inputId}
            value={value}
            onChange={(event) =>
              setExtraFieldValues((current) => ({
                ...current,
                [field.id]: event.target.value,
              }))
            }
            placeholder={field.placeholder}
            rows={4}
            maxLength={MESSAGE_MAX_LENGTH}
            aria-invalid={showFieldError || undefined}
            aria-describedby={showFieldError ? `${inputId}-error` : undefined}
            className={cn(
              "h-[100px] w-full resize-none bg-[#F2F2F2] p-3 font-gill text-base font-normal leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600",
              showFieldError && invalidFieldClassName,
            )}
          />
        ) : (
          <input
            id={inputId}
            type="text"
            value={value}
            onChange={(event) =>
              setExtraFieldValues((current) => ({
                ...current,
                [field.id]: event.target.value,
              }))
            }
            placeholder={field.placeholder}
            aria-invalid={showFieldError || undefined}
            aria-describedby={showFieldError ? `${inputId}-error` : undefined}
            className={cn(
              contactFieldClassName,
              showFieldError && invalidFieldClassName,
            )}
          />
        )}
        <FormFieldError
          id={`${inputId}-error`}
          message={showFieldError ? "This field is required" : undefined}
        />
      </div>
    );
  };

  const renderedFields: ReactNode[] = [];
  for (let index = 0; index < orderedFields.length; index += 1) {
    const field = orderedFields[index];
    const next = orderedFields[index + 1];

    // Keep phone + email side-by-side when CMS lists them consecutively.
    if (field.kind === "phone" && next?.kind === "email") {
      renderedFields.push(
        <div key="phone-email" className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {renderPhoneField()}
          {renderEmailField()}
        </div>,
      );
      index += 1;
      continue;
    }

    if (field.kind === "email" && next?.kind === "phone") {
      renderedFields.push(
        <div key="email-phone" className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {renderEmailField()}
          {renderPhoneField()}
        </div>,
      );
      index += 1;
      continue;
    }

    if (field.kind === "name") {
      renderedFields.push(<div key="name">{renderNameField()}</div>);
    } else if (field.kind === "phone") {
      renderedFields.push(<div key="phone">{renderPhoneField()}</div>);
    } else if (field.kind === "email") {
      renderedFields.push(<div key="email">{renderEmailField()}</div>);
    } else if (field.kind === "message") {
      renderedFields.push(<div key="message">{renderMessageField()}</div>);
    } else if (field.kind === "dropdown") {
      renderedFields.push(renderDropdownField(field.id));
    } else if (field.kind === "text") {
      renderedFields.push(renderExtraTextField(field));
    }
  }

  // Fallback if CMS order is empty — previous hard-coded sequence.
  if (renderedFields.length === 0) {
    renderedFields.push(
      <div key="name">{renderNameField()}</div>,
      <div key="phone-email" className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {renderPhoneField()}
        {renderEmailField()}
      </div>,
      ...dropdownFields.map((field) => renderDropdownField(field.id)),
      <div key="message">{renderMessageField()}</div>,
    );
  }

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setDropdownValues({});
    setExtraFieldValues({});
    setMessage("");
    setConsentAccepted(false);
    setHasAppliedProfilePrefill(false);
    resetValidation();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    validateSubmit(async () => {
      if (
        missingRequiredDropdown ||
        missingRequiredExtra ||
        (consentRequired && !consentAccepted)
      ) {
        return;
      }

      setIsSubmitting(true);

      try {
        const selectedDropdowns = dropdownFields
          .map((field) => {
            const value = (dropdownValues[field.id] ?? "").trim();
            return value
              ? {
                  id: field.id,
                  label: field.label.replace(/\*$/, "").trim(),
                  fieldType: "dropdown",
                  value,
                }
              : null;
          })
          .filter(
            (
              entry,
            ): entry is {
              id: string;
              label: string;
              fieldType: string;
              value: string;
            } => entry != null,
          );

        const primaryReason = selectedDropdowns[0]?.value ?? "";
        const extraDropdownEntries = selectedDropdowns.slice(1);
        const extraTextEntries = orderedFields
          .filter(
            (field): field is Extract<typeof field, { kind: "text" }> =>
              field.kind === "text",
          )
          .map((field) => {
            const value = (extraFieldValues[field.id] ?? "").trim();
            if (!value) return null;
            return {
              id: field.id,
              label: field.label.replace(/\*$/, "").trim(),
              fieldType: field.multiline ? "textarea" : "text",
              value,
            };
          })
          .filter(
            (
              entry,
            ): entry is {
              id: string;
              label: string;
              fieldType: string;
              value: string;
            } => entry != null,
          );

        const dynamicFieldPayload = [...extraDropdownEntries, ...extraTextEntries];
        const extraNotes = dynamicFieldPayload
          .map((entry) => `${entry.label}: ${entry.value}`)
          .join("\n");
        const composedMessage = [message.trim(), extraNotes]
          .filter(Boolean)
          .join("\n");

        await submitContactEnquiry({
          formTag,
          fullName: name.trim(),
          email: email.trim(),
          phone: `${countryCode}${phone.trim()}`,
          reasonForContact: primaryReason,
          message: composedMessage,
          consentAccepted: consentRequired ? consentAccepted : false,
          sourcePage: "/contact",
          ...(dynamicFieldPayload.length > 0
            ? { dynamicFields: dynamicFieldPayload }
            : {}),
        });

        toast({
          title: "Your request has been submitted successfully.",
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
    <section aria-labelledby="contact-form-title" className="flex w-full flex-col items-center gap-6 lg:pb-[104px] md:pb-20 pb-16">
      <Reveal
        as="h2"
        id="contact-form-title"
        direction="up"
        className="w-full md:text-center text-left font-larken text-2xl font-light leading-110 text-darkblack md:text-32"
      >
        {form.title}
      </Reveal>
      <div className="h-px w-full bg-neutral300 md:hidden" aria-hidden />
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-6">{renderedFields}</div>

          {consentRequired ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <GiftingPanelCheckbox
                  checked={consentAccepted}
                  onChange={setConsentAccepted}
                  aria-label="Accept terms and privacy policy"
                  className="translate-y-0"
                />
                <p className="min-w-0 flex-1 font-gill text-base font-light leading-110 text-neutral500">
                  <ContactConsentLabel label={consentLabel} />
                </p>
              </div>
              {showConsentError ? (
                <FormFieldError message="Please accept the terms to continue." />
              ) : null}
            </div>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isFormReady}
          className={cn(
            "mx-auto inline-flex h-14 w-full items-center justify-center px-7 font-gill text-sm font-normal uppercase leading-110 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2 md:w-[308px]",
            isFormReady && !isSubmitting
              ? "btn-dark-slide border border-darkblack"
              : "cursor-not-allowed bg-neutral500 opacity-50",
          )}
        >
          {isFormReady && !isSubmitting ? (
            <span className="relative z-10">{submitLabel}</span>
          ) : (
            submitLabel
          )}
        </button>
      </form>
    </section>
  );
};

export default ContactFormSection;
