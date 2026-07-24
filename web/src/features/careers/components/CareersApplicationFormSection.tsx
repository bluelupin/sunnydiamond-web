"use client";

import { useMemo, useState } from "react";
import Reveal from "@/shared/Animation/Reveal";
import FormFieldError from "@/shared/ui/FormFieldError";
import { useToast } from "@/shared/hooks/use-toast";
import {
  APPOINTMENT_COUNTRY_CODES,
  appointmentFieldClassName,
  appointmentLabelClassName,
} from "@/shared/constants/appointmentForm";
import {
  invalidFieldClassName,
  sanitizePhoneInput,
  validatePhone,
  validateRequiredEmail,
  validateRequiredName,
} from "@/shared/utils/formValidation";
import { cn } from "@/shared/utils/cn";
import { careersPageContent } from "../data/content";
import { useCareersJobs } from "../context/CareersJobsContext";

type ApplicationField = "name" | "email" | "phone" | "portfolio" | "coverLetter";

const CareersApplicationFormSection = () => {
  const { applicationForm } = careersPageContent;
  const { selectedJob } = useCareersJobs();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<ApplicationField, boolean>>>({});

  const errors = useMemo(() => {
    const next: Partial<Record<ApplicationField, string>> = {};

    const nameValidation = validateRequiredName(name);
    if (!nameValidation.valid) next.name = nameValidation.error;

    const emailValidation = validateRequiredEmail(email);
    if (!emailValidation.valid) next.email = emailValidation.error;

    const phoneValidation = validatePhone(phone, countryCode);
    if (!phoneValidation.valid) next.phone = phoneValidation.error;

    if (portfolio.trim() && !/^https?:\/\/.+/i.test(portfolio.trim())) {
      next.portfolio = "Enter a valid URL starting with http:// or https://";
    }

    if (!coverLetter.trim()) {
      next.coverLetter = "Cover letter is required";
    } else if (coverLetter.trim().length < 20) {
      next.coverLetter = "Please write at least 20 characters";
    }

    return next;
  }, [countryCode, coverLetter, email, name, phone, portfolio]);

  const showError = (field: ApplicationField) =>
    Boolean(touched[field] || submitted) && Boolean(errors[field]);

  const markTouched = (field: ApplicationField) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setPortfolio("");
    setCoverLetter("");
    setSubmitted(false);
    setTouched({});
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    if (!selectedJob) {
      return;
    }

    if (Object.keys(errors).length > 0) {
      return;
    }

    toast({
      title: applicationForm.successTitle,
      description: applicationForm.successDescription,
    });
    resetForm();
    document.getElementById("application-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="application-form"
      aria-labelledby="careers-application-title"
      className="bg-gray200 px-4 py-16 md:px-10 md:py-100"
    >
      <div className="mx-auto flex w-full max-w-1360 flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        <div className="flex max-w-[480px] flex-col gap-4">
          <Reveal
            as="h2"
            id="careers-application-title"
            direction="up"
            className="font-larken text-32 font-light leading-110 text-darkblack md:text-4xl lg:text-5xl"
          >
            {applicationForm.title}
          </Reveal>
          <Reveal
            as="p"
            direction="up"
            className="font-gill text-base font-light leading-110 text-neutral500 md:text-lg lg:text-xl"
          >
            {applicationForm.description}
          </Reveal>
        </div>

        <Reveal direction="up" className="w-full max-w-[640px]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-6 md:p-8" noValidate>
            <div className="flex flex-col gap-2">
              <label htmlFor="careers-position" className={appointmentLabelClassName}>
                {applicationForm.positionLabel}
              </label>
              <input
                id="careers-position"
                type="text"
                readOnly
                value={selectedJob?.title ?? ""}
                placeholder={applicationForm.noRoleSelected}
                className={cn(appointmentFieldClassName, "bg-gray200 text-neutral500")}
              />
              {submitted && !selectedJob ? (
                <FormFieldError message={applicationForm.noRoleSelected} />
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="careers-name" className={appointmentLabelClassName}>
                {applicationForm.fields.nameLabel}
              </label>
              <input
                id="careers-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onBlur={() => markTouched("name")}
                className={cn(appointmentFieldClassName, showError("name") && invalidFieldClassName)}
              />
              {showError("name") ? <FormFieldError message={errors.name} /> : null}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="careers-email" className={appointmentLabelClassName}>
                {applicationForm.fields.emailLabel}
              </label>
              <input
                id="careers-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onBlur={() => markTouched("email")}
                className={cn(appointmentFieldClassName, showError("email") && invalidFieldClassName)}
              />
              {showError("email") ? <FormFieldError message={errors.email} /> : null}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="careers-phone" className={appointmentLabelClassName}>
                {applicationForm.fields.phoneLabel}
              </label>
              <div className="flex gap-2">
                <select
                  aria-label="Country code"
                  value={countryCode}
                  onChange={(event) => setCountryCode(event.target.value)}
                  className={cn(appointmentFieldClassName, "w-[110px] shrink-0 bg-[#F2F2F2]")}
                >
                  {APPOINTMENT_COUNTRY_CODES.map((entry) => (
                    <option key={entry.code} value={entry.code}>
                      {entry.code}
                    </option>
                  ))}
                </select>
                <input
                  id="careers-phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => setPhone(sanitizePhoneInput(event.target.value, countryCode))}
                  onBlur={() => markTouched("phone")}
                  className={cn(
                    appointmentFieldClassName,
                    "min-w-0 flex-1",
                    showError("phone") && invalidFieldClassName,
                  )}
                />
              </div>
              {showError("phone") ? <FormFieldError message={errors.phone} /> : null}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="careers-portfolio" className={appointmentLabelClassName}>
                {applicationForm.fields.portfolioLabel}
              </label>
              <input
                id="careers-portfolio"
                type="url"
                value={portfolio}
                placeholder={applicationForm.fields.portfolioPlaceholder}
                onChange={(event) => setPortfolio(event.target.value)}
                onBlur={() => markTouched("portfolio")}
                className={cn(appointmentFieldClassName, showError("portfolio") && invalidFieldClassName)}
              />
              {showError("portfolio") ? <FormFieldError message={errors.portfolio} /> : null}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="careers-cover-letter" className={appointmentLabelClassName}>
                {applicationForm.fields.coverLetterLabel}
              </label>
              <textarea
                id="careers-cover-letter"
                rows={5}
                value={coverLetter}
                placeholder={applicationForm.fields.coverLetterPlaceholder}
                onChange={(event) => setCoverLetter(event.target.value)}
                onBlur={() => markTouched("coverLetter")}
                className={cn(
                  appointmentFieldClassName,
                  "min-h-[140px] resize-y py-3",
                  showError("coverLetter") && invalidFieldClassName,
                )}
              />
              {showError("coverLetter") ? <FormFieldError message={errors.coverLetter} /> : null}
            </div>

            <button
              type="submit"
              className="inline-flex h-14 items-center justify-center bg-darkblack px-8 font-gill text-sm font-normal uppercase leading-110 text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a] focus-visible:ring-offset-2"
            >
              {applicationForm.submitLabel}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
};

export default CareersApplicationFormSection;
