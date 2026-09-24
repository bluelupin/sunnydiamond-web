"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import AppStatusToast, { appStatusToastDurationMs } from "@/shared/ui/AppStatusToast";
import FormFieldError from "@/shared/ui/FormFieldError";
import AppointmentDateField from "@/shared/ui/AppointmentDateField";
import { cn } from "@/shared/utils/cn";

import PhoneCountryCodeSelect from "@/shared/ui/PhoneCountryCodeSelect";
import {
  invalidFieldClassName,
  invalidFieldContainerClassName,
  sanitizePhoneInput,
  validateOptionalEmail,
  validatePhone,
  validateRequiredName,
} from "@/shared/utils/formValidation";
import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useCustomerProfileContact } from "@/shared/hooks/use-customer-profile-contact";
import { submitCareerApplication } from "@/services/careers/career-submission.service";
import { isValidCtcLpa } from "@/services/careers/career-submission.mapper";
import {
  getAutofillPhone,
  getRelevantExperienceOption,
  parseCareerResume,
  type ParsedResumePosition,
} from "@/services/careers/career-resume-parser.service";
import { resolveCareerApplicationFlow } from "@/services/careers/resolveCareerApplicationFlow";
import { toast } from "@/shared/hooks/use-toast";
import {
  CAREERS_RESUME_PARSE_ERROR_MESSAGE,
  CAREERS_RESUME_PARSE_LOADING_MESSAGE,
  CAREERS_RESUME_PARSE_SUCCESS_MESSAGE,
} from "@/features/careers/constants/careersCopy";
import {
  CAREERS_NUMERIC_ONLY_ERROR,
  CAREERS_AUTOFILL_RESUME_ACCEPT,
  CAREERS_RESUME_ACCEPT,
  CAREERS_RESUME_FORMAT_TOAST_MESSAGE,
  CAREERS_RESUME_MAX_SIZE_TOAST_MESSAGE,
  CAREERS_SUBMITTING_APPLICATION_LABEL,
  CAREERS_YEAR_OF_COMPLETION_MAX_LENGTH,
  careersFormFieldClassName,
  careersFormFieldsStackClassName,
  careersFormLabelClassName,
  careersFormSectionClassName,
  careersFormSectionTitleClassName,
  getCareersBirthDateBounds,
  getCareersDateOfBirthError,
  getCareersResumeValidationError,
  isCareersAutofillFileSupported,
  isCareersNumericInput,
  sanitizeCareersNumericInput,
  type CareersResumeValidationError,
} from "@/features/careers/constants/careersApplicationForm";
import {
  careersDarkCtaClassName,
  careersOutlineCtaClassName,
} from "@/features/careers/constants/careersCtaStyles";
import CareersApplicationJobHeader from "./CareersApplicationJobHeader";
import CareersSelectField from "./CareersSelectField";
import CareersUploadResumeModal from "./CareersUploadResumeModal";
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
  | "currentCtc"
  | "expectedCtc"
  | "companyRelation"
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
  const { cms, selectedJob, goToSuccess, applicationEntry, pendingResumeFile, clearPendingResume } =
    useCareersJobs();
  const applicationFlow = useMemo(
    () => resolveCareerApplicationFlow(cms.landing.applicationFlow),
    [cms.landing.applicationFlow],
  );
  const { status } = useAuth();
  const isAuthenticated = status === "authenticated";
  const { contact: profileContact } = useCustomerProfileContact(isAuthenticated);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [resumeValidationToastMessage, setResumeValidationToastMessage] = useState<string | null>(
    null,
  );
  const resumeValidationToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeAutofillRequestedRef = useRef(false);
  const parsedResumeKeyRef = useRef<string | null>(null);

  const resumeInputRef = useRef<HTMLInputElement>(null);

  const [uploadResumeModalOpen, setUploadResumeModalOpen] = useState(false);
  const [submitConfirmModalOpen, setSubmitConfirmModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [resumeAutofillComplete, setResumeAutofillComplete] = useState(false);
  const [resumeParseError, setResumeParseError] = useState<string | null>(null);
  const [resumeParseWarnings, setResumeParseWarnings] = useState<string[]>([]);
  const [parsedPositions, setParsedPositions] = useState<ParsedResumePosition[]>([]);
  const parseAbortRef = useRef<AbortController | null>(null);
  const autofillNextFileRef = useRef(false);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<ApplicationField, boolean>>>({});
  const [hasAppliedProfilePrefill, setHasAppliedProfilePrefill] = useState(false);

  const autofillFromResume = useCallback(async (file: File) => {
    parseAbortRef.current?.abort();
    const controller = new AbortController();
    parseAbortRef.current = controller;
    setIsParsingResume(true);
    setResumeAutofillComplete(false);
    setResumeParseError(null);
    setResumeParseWarnings([]);
    setParsedPositions([]);
    try {
      const parsed = await parseCareerResume(file, controller.signal);
      if (controller.signal.aborted) return;
      const { data, meta } = parsed;
      const education = data.educationDetails?.[0];
      const phoneValue = getAutofillPhone(data.phoneNo);
      const experienceOption = getRelevantExperienceOption(
        data.workExperience.relevantWorkExp,
        applicationFlow.applicationForm.workExperienceOptions,
      );
      if (data.fullName) setName((current) => current.trim() || data.fullName!);
      if (data.emailId) setEmail((current) => current.trim() || data.emailId!);
      if (phoneValue) {
        setPhone((current) => current.trim() || phoneValue.phone);
        setCountryCode((current) => phone.trim() ? current : phoneValue.countryCode);
      }
      if (education?.degree) setHighestDegree((current) => current.trim() || education.degree!);
      if (education?.areaOfStudy) setAreaOfStudy((current) => current.trim() || education.areaOfStudy!);
      if (education?.completionYear) setYearOfCompletion((current) => current.trim() || String(education.completionYear));
      if (experienceOption) setRelevantExperience((current) => current || experienceOption);
      const parsedCompany = data.workExperience.currentCompany || data.workExperience.positions?.[0]?.company;
      const parsedTitle = data.workExperience.currentJobTitle || data.workExperience.positions?.[0]?.jobTitle;
      if (parsedCompany) {
        setCurrentCompany((current) => current.trim() || parsedCompany);
      }
      if (parsedTitle) {
        setCurrentJobTitle((current) => current.trim() || parsedTitle);
      }
      const parsedSkills = [...new Set(data.skillsAndLanguages?.Skills?.map((item) => item.SkillName).filter(Boolean) ?? [])];
      const parsedLanguages = [...new Set(data.skillsAndLanguages?.Languages?.map((item) => item.SkillName).filter(Boolean) ?? [])];
      setSkills((current) => current.length ? current : parsedSkills);
      setLanguages((current) => current.length ? current : parsedLanguages);
      setParsedPositions(data.workExperience.positions ?? []);
      setResumeAutofillComplete(true);
      setResumeParseWarnings([
        ...(meta.warnings ?? []),
        ...(meta.missingFields?.length ? ["Some fields could not be read. Please complete and review the form."] : []),
      ]);
    } catch (error) {
      if (!controller.signal.aborted) {
        setResumeParseError(error instanceof Error ? error.message : "Resume autofill failed. Please complete the form manually.");
      }
    } finally {
      if (parseAbortRef.current === controller) {
        parseAbortRef.current = null;
        setIsParsingResume(false);
      }
    }
  }, [applicationFlow.applicationForm.workExperienceOptions, phone]);

  const dismissResumeValidationToast = useCallback(() => {
    if (resumeValidationToastTimeoutRef.current) {
      clearTimeout(resumeValidationToastTimeoutRef.current);
      resumeValidationToastTimeoutRef.current = null;
    }
    setResumeValidationToastMessage(null);
  }, []);

  const showResumeValidationToast = useCallback(
    (error: CareersResumeValidationError) => {
      dismissResumeValidationToast();
      setResumeValidationToastMessage(
        error === "size"
          ? CAREERS_RESUME_MAX_SIZE_TOAST_MESSAGE
          : CAREERS_RESUME_FORMAT_TOAST_MESSAGE,
      );
      resumeValidationToastTimeoutRef.current = setTimeout(() => {
        setResumeValidationToastMessage(null);
        resumeValidationToastTimeoutRef.current = null;
      }, appStatusToastDurationMs);
    },
    [dismissResumeValidationToast],
  );

  useEffect(() => {
    return () => {
      if (resumeValidationToastTimeoutRef.current) {
        clearTimeout(resumeValidationToastTimeoutRef.current);
      }
      parseAbortRef.current?.abort();
    };
  }, []);

  const attachResumeFile = useCallback((file: File) => {
    setResumeFile(file);

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    if (resumeInputRef.current) {
      resumeInputRef.current.files = dataTransfer.files;
    }
  }, []);

  const getFormSnapshot = useCallback(
    (): CareerFormSnapshot => ({
      name,
      countryCode,
      phone,
      email,
      dateOfBirth,
      gender,
      highestDegree,
      areaOfStudy,
      yearOfCompletion,
      relevantExperience,
      currentCompany,
      currentJobTitle,
      currentCtc,
      expectedCtc,
      noticePeriod,
      skills,
      languages,
    }),
    [
      areaOfStudy,
      countryCode,
      currentCompany,
      currentCtc,
      currentJobTitle,
      dateOfBirth,
      email,
      expectedCtc,
      gender,
      highestDegree,
      languages,
      name,
      noticePeriod,
      phone,
      relevantExperience,
      skills,
      yearOfCompletion,
    ],
  );

  const applyFormSnapshot = useCallback((snapshot: CareerFormSnapshot) => {
    setName(snapshot.name);
    setCountryCode(snapshot.countryCode);
    setPhone(snapshot.phone);
    setEmail(snapshot.email);
    setDateOfBirth(snapshot.dateOfBirth);
    setGender(snapshot.gender);
    setHighestDegree(snapshot.highestDegree);
    setAreaOfStudy(snapshot.areaOfStudy);
    setYearOfCompletion(snapshot.yearOfCompletion);
    setRelevantExperience(snapshot.relevantExperience);
    setCurrentCompany(snapshot.currentCompany);
    setCurrentJobTitle(snapshot.currentJobTitle);
    setCurrentCtc(snapshot.currentCtc);
    setExpectedCtc(snapshot.expectedCtc);
    setNoticePeriod(snapshot.noticePeriod);
    setSkills(snapshot.skills);
    setLanguages(snapshot.languages);
  }, []);

  const autofillFromResume = useCallback(
    async (file: File) => {
      const fileKey = `${file.name}:${file.size}:${file.lastModified}`;
      if (parsedResumeKeyRef.current === fileKey) {
        return;
      }

      setIsParsingResume(true);
      toast({ title: CAREERS_RESUME_PARSE_LOADING_MESSAGE });

      try {
        const prefill = await parseCareerResume(file);
        const merged = mergeCareerResumePrefill(prefill, getFormSnapshot(), {
          genderOptions: applicationFlow.applicationForm.genderOptions,
          workExperienceOptions: applicationFlow.applicationForm.workExperienceOptions,
          noticePeriodOptions: applicationFlow.applicationForm.noticePeriodOptions,
        });

        applyFormSnapshot(merged);
        parsedResumeKeyRef.current = fileKey;
        toast({ title: CAREERS_RESUME_PARSE_SUCCESS_MESSAGE });
      } catch (error) {
        const rawMessage = error instanceof Error ? error.message.trim() : "";
        const isPayloadTooLarge =
          /\b413\b/.test(rawMessage) || /too large/i.test(rawMessage);

        toast({
          title: isPayloadTooLarge
            ? CAREERS_RESUME_MAX_SIZE_TOAST_MESSAGE
            : CAREERS_RESUME_PARSE_ERROR_MESSAGE,
        });
      } finally {
        setIsParsingResume(false);
      }
    },
    [applicationFlow.applicationForm, applyFormSnapshot, getFormSnapshot],
  );

  useEffect(() => {
    if (!pendingResumeFile) {
      return;
    }

    const validationError = getCareersResumeValidationError(pendingResumeFile);
    if (validationError) {
      showResumeValidationToast(validationError);
      clearPendingResume();
      return;
    }

    attachResumeFile(pendingResumeFile);
    const shouldAutofill = applicationEntry === "resume";
    clearPendingResume();

    if (shouldAutofill) {
      void autofillFromResume(pendingResumeFile);
    }

    if (applicationEntry === "resume") {
      if (isCareersAutofillFileSupported(pendingResumeFile)) {
        void autofillFromResume(pendingResumeFile);
      } else {
        setResumeParseError("Autofill accepts PDF, DOCX, JPG, or PNG. Your resume is attached; complete the form manually.");
      }
    }
    clearPendingResume();
  }, [applicationEntry, autofillFromResume, clearPendingResume, pendingResumeFile, showResumeValidationToast]);

  useEffect(() => {
    if (!profileContact || hasAppliedProfilePrefill) {
      return;
    }

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

  const errors = useMemo(() => {
    const next: Partial<Record<ApplicationField, string>> = {};

    const nameValidation = validateRequiredName(name);
    if (!nameValidation.valid) next.name = nameValidation.error;

    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      // Figma careers form: same copy for empty + invalid (matches phone pattern).
      next.email = "Please enter a valid email";
    } else {
      const emailValidation = validateOptionalEmail(emailTrimmed);
      if (!emailValidation.valid) next.email = emailValidation.error;
    }

    const phoneValidation = validatePhone(phone, countryCode);
    if (!phoneValidation.valid) next.phone = phoneValidation.error;

    const dobError = getCareersDateOfBirthError(dateOfBirth);
    if (dobError) next.dateOfBirth = dobError;
    if (!gender) next.gender = "Gender is required";
    if (!highestDegree.trim()) next.highestDegree = "Highest degree is required";
    if (!areaOfStudy.trim()) next.areaOfStudy = "Area of study is required";
    if (!yearOfCompletion.trim()) {
      next.yearOfCompletion = "Year of completion is required";
    } else if (!isCareersNumericInput(yearOfCompletion)) {
      next.yearOfCompletion = CAREERS_NUMERIC_ONLY_ERROR;
    }
    if (!relevantExperience) next.relevantExperience = "Relevant work experience is required";
    if (currentCtc.trim() && !isCareersNumericInput(currentCtc)) {
      next.currentCtc = CAREERS_NUMERIC_ONLY_ERROR;
    }
    if (!expectedCtc.trim()) {
      next.expectedCtc = "Expected CTC is required";
    } else if (!isValidCtcLpa(expectedCtc)) {
      next.expectedCtc = CAREERS_NUMERIC_ONLY_ERROR;
    }
    if (!resumeFile) next.resume = "Resume is required";
    if (hasCompanyRelation === null) {
      next.companyRelation = "Please select whether you have a company relation";
    }

    return next;
  }, [
    areaOfStudy,
    countryCode,
    currentCtc,
    dateOfBirth,
    email,
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

  const isFormComplete = Object.keys(errors).length === 0;

  const showError = (field: ApplicationField) =>
    Boolean(touched[field] || submitted) && Boolean(errors[field]);

  const markTouched = (field: ApplicationField) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const handleResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const shouldAutofill = autofillNextFileRef.current;
    autofillNextFileRef.current = false;
    if (!file) {
      return;
    }
    parseAbortRef.current?.abort();
    setIsParsingResume(false);
    setResumeAutofillComplete(false);
    setResumeParseError(null);
    setResumeParseWarnings([]);
    setParsedPositions([]);

    const validationError = getCareersResumeValidationError(file);
    if (validationError) {
      setResumeFile(null);
      parsedResumeKeyRef.current = null;
      event.target.value = "";
      showResumeValidationToast(validationError);
      return;
    }

    setResumeFile(file);
    event.target.value = "";
    setUploadResumeModalOpen(false);
    if (shouldAutofill) {
      if (isCareersAutofillFileSupported(file)) {
        void autofillFromResume(file);
      } else {
        setResumeParseError("Autofill accepts PDF, DOCX, JPG, or PNG. Your resume is attached; complete the form manually.");
      }
    } else {
      parseAbortRef.current?.abort();
      setIsParsingResume(false);
    }
  };

  const openResumeFilePicker = (autofill: boolean) => {
    autofillNextFileRef.current = autofill;
    if (resumeInputRef.current) {
      resumeInputRef.current.accept = autofill ? CAREERS_AUTOFILL_RESUME_ACCEPT : CAREERS_RESUME_ACCEPT;
    }
    resumeInputRef.current?.click();
  };

  const removeResume = () => {
    parseAbortRef.current?.abort();
    setIsParsingResume(false);
    setResumeFile(null);
    setResumeParseError(null);
    setResumeParseWarnings([]);
    setParsedPositions([]);
    setResumeAutofillComplete(false);
    if (resumeInputRef.current) {
      resumeInputRef.current.value = "";
    }
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

    if (isParsingResume) return;
    if (!selectedJob) {
      return;
    }

    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitConfirmModalOpen(true);
    setSubmitError(null);
  };

  const handleConfirmSubmit = async () => {
    if (!selectedJob) {
      return;
    }

    if (!resumeFile) {
      setSubmitError("Please upload your resume before submitting.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

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
        },
        resumeFile,
      });

      setSubmitConfirmModalOpen(false);
      goToSuccess();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Unable to submit your application. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const { applicationForm } = applicationFlow;

  if (!selectedJob) {
    return (
      <p className="font-gill text-base font-light leading-110 text-neutral500">
        {applicationForm.noRoleSelected}
      </p>
    );
  }

  const fields = applicationForm.fields;
  const textPlaceholder = fields.fieldPlaceholder;
  const selectPlaceholder = fields.selectPlaceholder;
  const skillSearchTerm = skillSearch.trim();
  const showSkillSearchDropdown = skillSearchTerm.length > 0;
  const skillsLabelText = fields.skillsLabel.replace(/\*+$/, "").trim();
  const languagesLabelText = fields.languagesLabel.replace(/\*+$/, "").trim();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10" noValidate>
      <CareersApplicationJobHeader job={selectedJob} />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 bg-gray200 md:p-6 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4">
            <h2 className={careersFormSectionTitleClassName}>{applicationForm.resumeHeading}</h2>
            <p className="font-gill text-base font-light leading-110 text-darkblack">
              {applicationForm.resumeHint}
            </p>
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
                className={careersOutlineCtaClassName}
              >
                <span className="relative z-10">{applicationForm.resumeUploadLabel}</span>
              </button>
            )}
          </div>
        </div>
        {showError("resume") ? <FormFieldError message={errors.resume!} /> : null}
        {isParsingResume ? (
          <p className="font-gill text-sm text-darkblack" role="status">Reading your resume…</p>
        ) : null}
        {resumeAutofillComplete ? (
          <p className="font-gill text-sm text-darkblack" role="status">Resume details added. Please review the form before submitting.</p>
        ) : null}
        {resumeParseError ? (
          <div className="flex flex-wrap items-center gap-3" role="alert">
            <p className="font-gill text-sm text-red-700">{resumeParseError}</p>
            {resumeFile && isCareersAutofillFileSupported(resumeFile) ? (
              <button type="button" onClick={() => void autofillFromResume(resumeFile)} className="font-gill text-sm underline">
                Try autofill again
              </button>
            ) : null}
          </div>
        ) : null}
        {resumeParseWarnings.length > 0 ? (
          <ul className="list-disc pl-5 font-gill text-sm text-amber-800" aria-label="Resume review notes">
            {resumeParseWarnings.map((warning) => <li key={warning}>{warning}</li>)}
          </ul>
        ) : null}

        <section className={careersFormSectionClassName}>
          <h2 className={careersFormSectionTitleClassName}>
            {applicationForm.personalDetailsHeading}
          </h2>
          <div className={careersFormFieldsStackClassName}>
            <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-6">
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
                <div
                  className={cn(
                    "flex h-14 w-full items-center gap-2 border border-transparent bg-[#F2F2F2] p-3",
                    showError("phone") && invalidFieldContainerClassName,
                  )}
                >
                  <PhoneCountryCodeSelect
                    id="careers-country-code"
                    value={countryCode}
                    onChange={(nextCode) => {
                      setCountryCode(nextCode);
                      setPhone(sanitizePhoneInput(phone, nextCode));
                    }}
                    onBlur={() => markTouched("phone")}
                  />
                  <input
                    type="tel"
                    autoComplete="tel"
                    placeholder={fields.fieldPlaceholder}
                    value={phone}
                    onChange={(event) => setPhone(sanitizePhoneInput(event.target.value, countryCode))}
                    onBlur={() => markTouched("phone")}
                    aria-invalid={showError("phone") || undefined}
                    className="min-w-0 flex-1 bg-transparent font-gill text-base font-normal leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600"
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
                placeholder={selectPlaceholder}
                error={showError("gender") ? errors.gender : undefined}
              />
            </div>
          </div>
        </section>

        <section className={careersFormSectionClassName}>
          <h2 className={careersFormSectionTitleClassName}>Education Details</h2>
          <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-6">
            <FormField
              label={fields.highestDegreeLabel}
              error={showError("highestDegree") ? errors.highestDegree : undefined}
            >
              <input
                type="text"
                placeholder={textPlaceholder}
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
                placeholder={textPlaceholder}
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
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={textPlaceholder}
                value={yearOfCompletion}
                onChange={(event) =>
                  setYearOfCompletion(
                    sanitizeCareersNumericInput(
                      event.target.value,
                      CAREERS_YEAR_OF_COMPLETION_MAX_LENGTH,
                    ),
                  )
                }
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
            Work Experience
          </h2>
          <div className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 gap-6">
            <CareersSelectField
              id="careers-relevant-experience"
              label={fields.relevantExperienceLabel}
              value={relevantExperience}
              onChange={setRelevantExperience}
              onBlur={() => markTouched("relevantExperience")}
              options={applicationForm.workExperienceOptions}
              placeholder={selectPlaceholder}
              error={showError("relevantExperience") ? errors.relevantExperience : undefined}
            />
            <FormField label={fields.currentCompanyLabel}>
              <input
                type="text"
                placeholder={textPlaceholder}
                value={currentCompany}
                onChange={(event) => setCurrentCompany(event.target.value)}
                className={careersFormFieldClassName}
              />
            </FormField>
            <FormField label={fields.currentJobTitleLabel}>
              <input
                type="text"
                placeholder={textPlaceholder}
                value={currentJobTitle}
                onChange={(event) => setCurrentJobTitle(event.target.value)}
                className={careersFormFieldClassName}
              />
            </FormField>
            <FormField
              label={fields.currentCtcLabel}
              error={showError("currentCtc") ? errors.currentCtc : undefined}
            >
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={textPlaceholder}
                value={currentCtc}
                onChange={(event) =>
                  setCurrentCtc(sanitizeCareersNumericInput(event.target.value))
                }
                onBlur={() => markTouched("currentCtc")}
                className={cn(
                  careersFormFieldClassName,
                  showError("currentCtc") && invalidFieldClassName,
                )}
              />
            </FormField>
            <FormField
              label={fields.expectedCtcLabel}
              error={showError("expectedCtc") ? errors.expectedCtc : undefined}
            >
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={textPlaceholder}
                value={expectedCtc}
                onChange={(event) =>
                  setExpectedCtc(sanitizeCareersNumericInput(event.target.value))
                }
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
              placeholder={selectPlaceholder}
            />
          </div>
          {parsedPositions.length > 0 ? (
            <div className="flex flex-col gap-3 border-t border-neutral300 pt-4">
              <h3 className={careersFormLabelClassName}>Experience found in resume</h3>
              <ul className="flex flex-col gap-2">
                {parsedPositions.map((position, index) => (
                  <li key={`${position.jobTitle ?? "role"}-${position.startDate ?? index}-${index}`} className="font-gill text-sm text-darkblack">
                    <span className="font-medium">{position.jobTitle || "Role not identified"}</span>
                    {position.company ? ` · ${position.company}` : ""}
                    {position.startDate || position.endDate ? ` · ${position.startDate || "?"}–${position.endDate || "?"}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <section className={careersFormSectionClassName}>
          <h2 className={careersFormSectionTitleClassName}>
            {applicationForm.skillsHeading}
          </h2>
          <FormField label="" className="max-w-[356px]" arial-hidden>
            <p className="md:text-base text-sm font-gill font-normal text-darkblack">
              Add skills and known languages to your application
            </p>
            <div className="relative">
              <div className="flex h-14 items-center justify-between bg-[#F2F2F2] p-3">
                <input
                  type="text"
                  value={skillSearch}
                  placeholder={fields.skillsSearchPlaceholder}
                  onChange={(event) => setSkillSearch(event.target.value)}
                  onKeyDown={handleSkillSearchKeyDown}
                  className="min-w-0 flex-1 bg-transparent font-gill text-base leading-110 text-darkblack outline-none placeholder:text-[#999999]"
                  aria-expanded={showSkillSearchDropdown}
                  aria-controls="careers-skills-languages-search-options"
                />
                <CareersSearchIcon />
              </div>
              {showSkillSearchDropdown ? (
                <div
                  id="careers-skills-languages-search-options"
                  role="listbox"
                  aria-label="Add search result"
                  className="absolute left-0 right-0 top-full z-[90] mt-1 flex flex-col bg-[#F2F2F2] shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                >
                  <button
                    type="button"
                    role="option"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={addSkill}
                    className="flex h-14 w-full items-center p-3 text-left font-gill text-sm font-normal leading-110 text-darkblack transition-colors hover:bg-[#DECAA0]"
                  >
                    Add &quot;{skillSearchTerm}&quot; as {skillsLabelText}
                  </button>
                  <button
                    type="button"
                    role="option"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={addLanguage}
                    className="flex h-14 w-full items-center p-3 text-left font-gill text-sm font-normal leading-110 text-darkblack transition-colors hover:bg-[#DECAA0]"
                  >
                    Add &quot;{skillSearchTerm}&quot; as {languagesLabelText}
                  </button>
                </div>
              ) : null}
            </div>
          </FormField>
          {skills.length > 0 ? (
            <div className="flex flex-col gap-4 items-start">
              <p className={careersFormLabelClassName}>{fields.skillsLabel}</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <TagChip
                    key={skill}
                    label={skill}
                    onRemove={() =>
                      setSkills((current) => current.filter((item) => item !== skill))
                    }
                  />
                ))}
              </div>
            </div>
          ) : null}

          {languages.length > 0 ? (
            <div className="flex flex-col gap-4">
              <p className={careersFormLabelClassName}>{fields.languagesLabel}</p>
              <div className="flex flex-wrap gap-2">
                {languages.map((language) => (
                  <TagChip
                    key={language}
                    label={language}
                    onRemove={() =>
                      setLanguages((current) =>
                        current.filter((item) => item !== language),
                      )
                    }
                  />
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <section className={careersFormSectionClassName}>
          <h2 className={careersFormSectionTitleClassName}>
            {applicationForm.additionalInfoHeading}
          </h2>

          <div
            className={cn(
              "flex max-w-[356px] flex-col gap-3",
              showError("companyRelation") && "rounded-sm ring-1 ring-[#F91616] p-3 -m-3",
            )}
          >
            <p className={careersFormLabelClassName}>{fields.companyRelationLabel}</p>
            <div className="flex gap-6">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="company-relation"
                  checked={hasCompanyRelation === true}
                  onChange={() => {
                    setHasCompanyRelation(true);
                    markTouched("companyRelation");
                  }}
                  className="size-6 accent-darkblack"
                />
                <span className="font-gill text-base leading-110 text-darkblack">
                  {fields.companyRelationYes}
                </span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="company-relation"
                  checked={hasCompanyRelation === false}
                  onChange={() => {
                    setHasCompanyRelation(false);
                    setEmployeeName("");
                    setEmployeeJobTitle("");
                    markTouched("companyRelation");
                  }}
                  className="size-6 accent-darkblack"
                />
                <span className="font-gill text-base leading-110 text-darkblack">
                  {fields.companyRelationNo}
                </span>
              </label>
            </div>
            {showError("companyRelation") ? (
              <FormFieldError message={errors.companyRelation} />
            ) : null}
          </div>

          {hasCompanyRelation ? (
            <div className="grid gap-6 md:grid-cols-2">
              <CareersSelectField
                id="careers-employee-name"
                label={fields.employeeNameLabel}
                value={employeeName}
                onChange={setEmployeeName}
                options={applicationForm.employeeRelationOptions}
                placeholder={selectPlaceholder}
              />

              <FormField label={fields.employeeJobTitleLabel}>
                <input
                  type="text"
                  placeholder={textPlaceholder}
                  value={employeeJobTitle}
                  onChange={(event) => setEmployeeJobTitle(event.target.value)}
                  className={careersFormFieldClassName}
                />
              </FormField>
            </div>
          ) : null}
        </section>
      </div>

      <button
        type="submit"
        disabled={!isFormComplete || isSubmitting || isParsingResume}
        className={cn(careersDarkCtaClassName, "w-full md:w-[193px]")}
      >
        <span className="relative z-10">
          {isSubmitting ? CAREERS_SUBMITTING_APPLICATION_LABEL : applicationForm.submitLabel}
        </span>
      </button>

      <CareersUploadResumeModal
        uploadResumeModal={applicationForm.uploadResumeModal}
        open={uploadResumeModalOpen}
        onOpenChange={setUploadResumeModalOpen}
        onOnlyUpload={() => openResumeFilePicker(false)}
        onAutofillResume={() => openResumeFilePicker(true)}
        onOnlyUpload={() => openResumeFilePicker(false)}
        onAutofillResume={() => openResumeFilePicker(true)}
      />

      <CareersSubmitConfirmationModal
        confirmSubmissionModal={applicationForm.confirmSubmissionModal}
        open={submitConfirmModalOpen}
        onOpenChange={setSubmitConfirmModalOpen}
        onConfirm={handleConfirmSubmit}
        isSubmitting={isSubmitting}
        errorMessage={submitError}
      />

      <AppStatusToast
        open={Boolean(resumeValidationToastMessage)}
        message={resumeValidationToastMessage ?? ""}
      />
    </form>
  );
};

export default CareersApplicationForm;
