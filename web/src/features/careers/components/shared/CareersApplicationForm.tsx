"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import FormFieldError from "@/shared/ui/FormFieldError";
import AppointmentDateField from "@/shared/ui/AppointmentDateField";
import { cn } from "@/shared/utils/cn";
import {
  APPOINTMENT_COUNTRY_CODES,
} from "@/shared/constants/appointmentForm";
import {
  invalidFieldClassName,
  sanitizePhoneInput,
  validatePhone,
  validateRequiredEmail,
  validateRequiredName,
} from "@/shared/utils/formValidation";
import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import { submitCareerApplication } from "@/services/careers/career-submission.service";
import { resolveCareerApplicationFlow } from "@/services/careers/resolveCareerApplicationFlow";
import {
  CAREERS_RESUME_ACCEPT,
  CAREERS_RESUME_MAX_BYTES,
  careersFormFieldClassName,
  careersFormFieldGridClassName,
  careersFormFieldsStackClassName,
  careersFormLabelClassName,
  careersFormSectionClassName,
  careersFormSectionTitleClassName,
  getCareersBirthDateBounds,
} from "@/features/careers/constants/careersApplicationForm";
import CareersApplicationJobHeader from "./CareersApplicationJobHeader";
import CareersSelectField from "./CareersSelectField";
import CareersUploadResumeModal from "./CareersUploadResumeModal";
import CareersChevronDownIcon from "./CareersChevronDownIcon";
import CareersResumeFileChip from "./CareersResumeFileChip";
import CareersSearchIcon from "./CareersSearchIcon";
import CareersSubmitConfirmationModal from "./CareersSubmitConfirmationModal";

type ApplicationField =
  | "name"
  | "phone"
  | "email"
  | "dateOfBirth"
  | "gender"
  | "highestDegree"
  | "areaOfStudy"
  | "yearOfCompletion"
  | "relevantExperience"
  | "expectedCtc"
  | "employeeName"
  | "employeeJobTitle"
  | "resume";

function FormField({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className={careersFormLabelClassName}>{label}</label>
      {children}
      {error ? <FormFieldError message={error} /> : null}
    </div>
  );
}

const TagChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => {
  return (
    <span className="inline-flex items-center gap-2 bg-[#ECE9E9] px-4 py-2">
      <span className="font-gill text-sm leading-110 text-darkblack">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="inline-flex size-5 items-center justify-center text-darkblack transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack"
        aria-label={`Remove ${label}`}
      >
        <X className="size-5" strokeWidth={1.5} aria-hidden />
      </button>
    </span>
  );
}

const careersBirthDateBounds = getCareersBirthDateBounds();

const CareersApplicationForm = () => {
  const { cms, selectedJob, goToSuccess, pendingResumeFile, clearPendingResume, applicationEntry } =
    useCareersJobs();
  const applicationFlow = resolveCareerApplicationFlow(cms.landing.applicationFlow);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const resumeInputRef = useRef<HTMLInputElement>(null);

  const [uploadResumeModalOpen, setUploadResumeModalOpen] = useState(false);
  const [submitConfirmModalOpen, setSubmitConfirmModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [highestDegree, setHighestDegree] = useState("");
  const [areaOfStudy, setAreaOfStudy] = useState("");
  const [yearOfCompletion, setYearOfCompletion] = useState("");
  const [relevantExperience, setRelevantExperience] = useState("");
  const [currentCompany, setCurrentCompany] = useState("");
  const [currentJobTitle, setCurrentJobTitle] = useState("");
  const [currentCtc, setCurrentCtc] = useState("");
  const [expectedCtc, setExpectedCtc] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [hasCompanyRelation, setHasCompanyRelation] = useState<boolean | null>(null);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeJobTitle, setEmployeeJobTitle] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<ApplicationField, boolean>>>({});

  useEffect(() => {
    if (!pendingResumeFile) {
      return;
    }

    setResumeFile(pendingResumeFile);
    setTouched((current) => ({ ...current, resume: true }));

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(pendingResumeFile);
    if (resumeInputRef.current) {
      resumeInputRef.current.files = dataTransfer.files;
    }

    clearPendingResume();
  }, [clearPendingResume, pendingResumeFile]);

  const errors = useMemo(() => {
    const next: Partial<Record<ApplicationField, string>> = {};

    const nameValidation = validateRequiredName(name);
    if (!nameValidation.valid) next.name = nameValidation.error;

    const emailValidation = validateRequiredEmail(email);
    if (!emailValidation.valid) next.email = emailValidation.error;

    const phoneValidation = validatePhone(phone, countryCode);
    if (!phoneValidation.valid) next.phone = phoneValidation.error;

    if (!dateOfBirth.trim()) next.dateOfBirth = "Date of birth is required";
    if (!gender) next.gender = "Gender is required";
    if (!highestDegree.trim()) next.highestDegree = "Highest degree is required";
    if (!areaOfStudy.trim()) next.areaOfStudy = "Area of study is required";
    if (!yearOfCompletion.trim()) next.yearOfCompletion = "Year of completion is required";
    if (!relevantExperience) next.relevantExperience = "Relevant work experience is required";
    if (!expectedCtc.trim()) next.expectedCtc = "Expected CTC is required";
    if (!resumeFile) next.resume = "Resume is required";

    if (hasCompanyRelation) {
      if (!employeeName) next.employeeName = "Employee name is required";
      if (!employeeJobTitle.trim()) next.employeeJobTitle = "Employee job title is required";
    }

    return next;
  }, [
    areaOfStudy,
    countryCode,
    dateOfBirth,
    email,
    employeeJobTitle,
    employeeName,
    expectedCtc,
    gender,
    hasCompanyRelation,
    highestDegree,
    name,
    phone,
    relevantExperience,
    resumeFile,
    yearOfCompletion,
  ]);

  const showError = (field: ApplicationField) =>
    Boolean(touched[field] || submitted) && Boolean(errors[field]);

  const markTouched = (field: ApplicationField) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const handleShare = async () => {
    if (!selectedJob) return;
    const url = `${window.location.origin}/careers`;
    try {
      if (navigator.share) {
        await navigator.share({ title: selectedJob.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
    } catch {
      // User cancelled share or clipboard unavailable.
    }
  };

  const handleResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setResumeFile(null);
      return;
    }

    if (file.size > CAREERS_RESUME_MAX_BYTES) {
      setResumeFile(null);
      setTouched((current) => ({ ...current, resume: true }));
      event.target.value = "";
      return;
    }

    setResumeFile(file);
    markTouched("resume");
    setUploadResumeModalOpen(false);
  };

  const openResumeFilePicker = () => {
    resumeInputRef.current?.click();
  };

  const removeResume = () => {
    setResumeFile(null);
    if (resumeInputRef.current) {
      resumeInputRef.current.value = "";
    }
    markTouched("resume");
  };

  const addSkill = () => {
    const value = skillSearch.trim();
    if (!value || skills.includes(value)) {
      return;
    }
    setSkills((current) => [...current, value]);
    setSkillSearch("");
  };

  const addLanguage = () => {
    const value = skillSearch.trim();
    if (!value || languages.includes(value)) {
      return;
    }
    setLanguages((current) => [...current, value]);
    setSkillSearch("");
  };

  const handleSkillSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    addSkill();
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

    setSubmitConfirmModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!selectedJob) {
      return;
    }

    setIsSubmitting(true);

    try {
      await submitCareerApplication({
        jobID: selectedJob.jobCode,
        jobTitle: selectedJob.title,
        location: selectedJob.location,
        department: selectedJob.department,
        experience: selectedJob.experienceLabel,
        personalDetails: {
          fullName: name.trim(),
          phone: `${countryCode}${phone.trim()}`,
          email: email.trim(),
          dateOfBirth,
          gender,
        },
        educationDetails: {
          highestDegree: highestDegree.trim(),
          areaOfStudy: areaOfStudy.trim(),
          yearOfCompletion: yearOfCompletion.trim(),
        },
        workExperience: {
          relevantExperience,
          currentCompany: currentCompany.trim(),
          currentJobTitle: currentJobTitle.trim(),
          currentCtc: currentCtc.trim(),
          expectedCtc: expectedCtc.trim(),
          noticePeriod,
        },
        skillsAndLanguages: {
          skills,
          languages,
        },
        addInfo: {
          hasCompanyRelation,
          employeeName,
          employeeJobTitle: employeeJobTitle.trim(),
          applicationEntry: applicationEntry ?? "manual",
        },
        resumeFile,
      });

      setSubmitConfirmModalOpen(false);
      goToSuccess();
    } catch {
      setSubmitConfirmModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const { applicationForm, jobDetails } = applicationFlow;

  if (!selectedJob) {
    return (
      <p className="font-gill text-base font-light leading-110 text-neutral500">
        {applicationForm.noRoleSelected}
      </p>
    );
  }

  const fields = applicationForm.fields;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10" noValidate>
      <CareersApplicationJobHeader
        job={selectedJob}
        shareLabel={jobDetails.shareLabel}
        onShare={handleShare}
      />

      <div className="flex flex-col gap-6">
        <div
          className={cn(
            "flex flex-col gap-6 bg-gray200 p-6 md:flex-row md:items-center md:justify-between",
            showError("resume") && "ring-1 ring-red-600",
          )}
        >
          <div className="flex flex-col gap-4">
            <h2 className={careersFormSectionTitleClassName}>{applicationForm.resumeHeading}</h2>
            <p className="font-gill text-base font-light leading-110 text-darkblack">
              {applicationForm.resumeHint}
            </p>
            {showError("resume") ? <FormFieldError message={errors.resume} /> : null}
          </div>

          <div className="flex shrink-0 items-center gap-10">
            <input
              ref={resumeInputRef}
              type="file"
              accept={CAREERS_RESUME_ACCEPT}
              className="hidden"
              onChange={handleResumeChange}
            />
            {resumeFile ? (
              <CareersResumeFileChip
                fileName={resumeFile.name}
                fileSize={resumeFile.size}
                onRemove={removeResume}
                removeLabel={applicationForm.resumeRemoveLabel}
              />
            ) : (
              <button
                type="button"
                onClick={() => setUploadResumeModalOpen(true)}
                className="inline-flex h-14 items-center justify-center border border-neutral300 bg-white px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack transition-colors hover:bg-gray300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
              >
                {applicationForm.resumeUploadLabel}
              </button>
            )}
          </div>
        </div>

        <section className={careersFormSectionClassName}>
          <h2 className={careersFormSectionTitleClassName}>
            {applicationForm.personalDetailsHeading}
          </h2>
          <div className={careersFormFieldsStackClassName}>
            <div className={careersFormFieldGridClassName}>
              <FormField label={fields.fullNameLabel} error={showError("name") ? errors.name : undefined}>
                <input
                  type="text"
                  autoComplete="name"
                  placeholder={fields.fieldPlaceholder}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  onBlur={() => markTouched("name")}
                  className={cn(
                    careersFormFieldClassName,
                    showError("name") && invalidFieldClassName,
                  )}
                />
              </FormField>

              <FormField label={fields.phoneLabel} error={showError("phone") ? errors.phone : undefined}>
                <div className="flex h-14 items-center gap-2 bg-[#F2F2F2] p-3">
                  <div className="flex shrink-0 items-center">
                    <select
                      aria-label="Country code"
                      value={countryCode}
                      onChange={(event) => setCountryCode(event.target.value)}
                      className="appearance-none bg-transparent font-gill text-base font-normal leading-110 text-darkblack outline-none"
                    >
                      {APPOINTMENT_COUNTRY_CODES.map((entry) => (
                        <option key={entry.code} value={entry.code}>
                          {entry.code}
                        </option>
                      ))}
                    </select>
                    <CareersChevronDownIcon />
                  </div>
                  <input
                    type="tel"
                    autoComplete="tel"
                    placeholder={fields.fieldPlaceholder}
                    value={phone}
                    onChange={(event) => setPhone(sanitizePhoneInput(event.target.value, countryCode))}
                    onBlur={() => markTouched("phone")}
                    className={cn(
                      "min-w-0 flex-1 bg-transparent font-gill text-base font-normal leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600",
                      showError("phone") && "text-red-600 placeholder:text-red-600",
                    )}
                  />
                </div>
              </FormField>

              <FormField label={fields.emailLabel} error={showError("email") ? errors.email : undefined}>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder={fields.fieldPlaceholder}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  onBlur={() => markTouched("email")}
                  className={cn(
                    careersFormFieldClassName,
                    showError("email") && invalidFieldClassName,
                  )}
                />
              </FormField>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:max-w-[736px]">
              <FormField
                label={fields.dateOfBirthLabel}
                error={showError("dateOfBirth") ? errors.dateOfBirth : undefined}
              >
                <AppointmentDateField
                  id="careers-date-of-birth"
                  value={dateOfBirth}
                  minDate={careersBirthDateBounds.minDate}
                  maxDate={careersBirthDateBounds.maxDate}
                  onChange={setDateOfBirth}
                  onBlur={() => markTouched("dateOfBirth")}
                  hasError={showError("dateOfBirth")}
                  aria-invalid={showError("dateOfBirth") || undefined}
                  placeholder={fields.dateOfBirthPlaceholder}
                  displayFormat="dd/mm/yyyy"
                />
              </FormField>

              <CareersSelectField
                id="careers-gender"
                label={fields.genderLabel}
                value={gender}
                onChange={setGender}
                onBlur={() => markTouched("gender")}
                options={applicationForm.genderOptions}
                placeholder="Select"
                error={showError("gender") ? errors.gender : undefined}
              />
            </div>
          </div>
        </section>

        <section className={careersFormSectionClassName}>
          <h2 className={careersFormSectionTitleClassName}>{applicationForm.educationHeading}</h2>
          <div className={careersFormFieldGridClassName}>
            <FormField
              label={fields.highestDegreeLabel}
              error={showError("highestDegree") ? errors.highestDegree : undefined}
            >
              <input
                type="text"
                value={highestDegree}
                onChange={(event) => setHighestDegree(event.target.value)}
                onBlur={() => markTouched("highestDegree")}
                className={cn(
                  careersFormFieldClassName,
                  showError("highestDegree") && invalidFieldClassName,
                )}
              />
            </FormField>

            <FormField
              label={fields.areaOfStudyLabel}
              error={showError("areaOfStudy") ? errors.areaOfStudy : undefined}
            >
              <input
                type="text"
                value={areaOfStudy}
                onChange={(event) => setAreaOfStudy(event.target.value)}
                onBlur={() => markTouched("areaOfStudy")}
                className={cn(
                  careersFormFieldClassName,
                  showError("areaOfStudy") && invalidFieldClassName,
                )}
              />
            </FormField>

            <FormField
              label={fields.yearOfCompletionLabel}
              error={showError("yearOfCompletion") ? errors.yearOfCompletion : undefined}
            >
              <input
                type="text"
                value={yearOfCompletion}
                onChange={(event) => setYearOfCompletion(event.target.value)}
                onBlur={() => markTouched("yearOfCompletion")}
                className={cn(
                  careersFormFieldClassName,
                  showError("yearOfCompletion") && invalidFieldClassName,
                )}
              />
            </FormField>
          </div>
        </section>

        <section className={careersFormSectionClassName}>
          <h2 className={careersFormSectionTitleClassName}>
            {applicationForm.workExperienceHeading}
          </h2>
          <div className={careersFormFieldGridClassName}>
            <CareersSelectField
              id="careers-relevant-experience"
              label={fields.relevantExperienceLabel}
              value={relevantExperience}
              onChange={setRelevantExperience}
              onBlur={() => markTouched("relevantExperience")}
              options={applicationForm.workExperienceOptions}
              placeholder="Select"
              error={showError("relevantExperience") ? errors.relevantExperience : undefined}
            />

            <FormField label={fields.currentCompanyLabel}>
              <input
                type="text"
                value={currentCompany}
                onChange={(event) => setCurrentCompany(event.target.value)}
                className={careersFormFieldClassName}
              />
            </FormField>

            <FormField label={fields.currentJobTitleLabel}>
              <input
                type="text"
                value={currentJobTitle}
                onChange={(event) => setCurrentJobTitle(event.target.value)}
                className={careersFormFieldClassName}
              />
            </FormField>
          </div>

          <div className={careersFormFieldGridClassName}>
            <FormField label={fields.currentCtcLabel}>
              <input
                type="text"
                value={currentCtc}
                onChange={(event) => setCurrentCtc(event.target.value)}
                className={careersFormFieldClassName}
              />
            </FormField>

            <FormField
              label={fields.expectedCtcLabel}
              error={showError("expectedCtc") ? errors.expectedCtc : undefined}
            >
              <input
                type="text"
                value={expectedCtc}
                onChange={(event) => setExpectedCtc(event.target.value)}
                onBlur={() => markTouched("expectedCtc")}
                className={cn(
                  careersFormFieldClassName,
                  showError("expectedCtc") && invalidFieldClassName,
                )}
              />
            </FormField>

            <CareersSelectField
              id="careers-notice-period"
              label={fields.noticePeriodLabel}
              value={noticePeriod}
              onChange={setNoticePeriod}
              options={applicationForm.noticePeriodOptions}
              placeholder="Select"
            />
          </div>
        </section>

        <section className={careersFormSectionClassName}>
          <h2 className={careersFormSectionTitleClassName}>{applicationForm.skillsHeading}</h2>

          <FormField label={fields.skillsSearchLabel} className="max-w-[356px]">
            <div className="flex h-14 items-center justify-between bg-[#F2F2F2] p-3">
              <input
                type="text"
                value={skillSearch}
                placeholder={fields.skillsSearchPlaceholder}
                onChange={(event) => setSkillSearch(event.target.value)}
                onKeyDown={handleSkillSearchKeyDown}
                className="min-w-0 flex-1 bg-transparent font-gill text-base leading-110 text-darkblack outline-none placeholder:text-[#999999]"
              />
              <CareersSearchIcon />
            </div>
          </FormField>

          <div className="flex flex-col gap-4">
            <p className={careersFormLabelClassName}>{fields.skillsLabel}</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <TagChip
                  key={skill}
                  label={skill}
                  onRemove={() => setSkills((current) => current.filter((item) => item !== skill))}
                />
              ))}
            </div>
            {skillSearch.trim() ? (
              <button
                type="button"
                onClick={addLanguage}
                className="font-gill text-sm font-light leading-110 text-neutral500 underline-offset-2 hover:underline"
              >
                Add &quot;{skillSearch.trim()}&quot; as language
              </button>
            ) : null}
          </div>

          <div className="flex flex-col gap-4">
            <p className={careersFormLabelClassName}>{fields.languagesLabel}</p>
            <div className="flex flex-wrap gap-2">
              {languages.map((language) => (
                <TagChip
                  key={language}
                  label={language}
                  onRemove={() =>
                    setLanguages((current) => current.filter((item) => item !== language))
                  }
                />
              ))}
            </div>
          </div>
        </section>

        <section className={careersFormSectionClassName}>
          <h2 className={careersFormSectionTitleClassName}>
            {applicationForm.additionalInfoHeading}
          </h2>

          <div className="flex max-w-[356px] flex-col gap-3">
            <p className={careersFormLabelClassName}>{fields.companyRelationLabel}</p>
            <div className="flex gap-6">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="company-relation"
                  checked={hasCompanyRelation === true}
                  onChange={() => setHasCompanyRelation(true)}
                  className="size-6 accent-darkblack"
                />
                <span className="font-gill text-base leading-110 text-darkblack">
                  {fields.companyRelationYes}
                </span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="company-relation"
                  checked={hasCompanyRelation === false}
                  onChange={() => {
                    setHasCompanyRelation(false);
                    setEmployeeName("");
                    setEmployeeJobTitle("");
                  }}
                  className="size-6 accent-darkblack"
                />
                <span className="font-gill text-base leading-110 text-darkblack">
                  {fields.companyRelationNo}
                </span>
              </label>
            </div>
          </div>

          {hasCompanyRelation ? (
            <div className="grid gap-6 md:grid-cols-2">
              <CareersSelectField
                id="careers-employee-name"
                label={fields.employeeNameLabel}
                value={employeeName}
                onChange={setEmployeeName}
                onBlur={() => markTouched("employeeName")}
                options={applicationForm.employeeRelationOptions}
                placeholder="Select"
                error={showError("employeeName") ? errors.employeeName : undefined}
              />

              <FormField
                label={fields.employeeJobTitleLabel}
                error={showError("employeeJobTitle") ? errors.employeeJobTitle : undefined}
              >
                <input
                  type="text"
                  value={employeeJobTitle}
                  onChange={(event) => setEmployeeJobTitle(event.target.value)}
                  onBlur={() => markTouched("employeeJobTitle")}
                  className={cn(
                    careersFormFieldClassName,
                    showError("employeeJobTitle") && invalidFieldClassName,
                  )}
                />
              </FormField>
            </div>
          ) : null}
        </section>
      </div>

      <button
        type="submit"
        className="inline-flex h-14 w-full items-center justify-center bg-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2 md:w-[193px]"
      >
        {applicationForm.submitLabel}
      </button>

      <CareersUploadResumeModal
        uploadResumeModal={applicationForm.uploadResumeModal}
        open={uploadResumeModalOpen}
        onOpenChange={setUploadResumeModalOpen}
        onOnlyUpload={openResumeFilePicker}
        onAutofillResume={openResumeFilePicker}
      />

      <CareersSubmitConfirmationModal
        confirmSubmissionModal={applicationForm.confirmSubmissionModal}
        open={submitConfirmModalOpen}
        onOpenChange={setSubmitConfirmModalOpen}
        onConfirm={handleConfirmSubmit}
        isSubmitting={isSubmitting}
      />
    </form>
  );
};

export default CareersApplicationForm;
