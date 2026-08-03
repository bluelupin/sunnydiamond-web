import type { NormalizedCareerApplicationFlow } from "./careers.types";
import { resolveCareerJobDetailLabels } from "./careersJobDetailLabels";

const OPTIONAL_APPLICATION_FIELD_LABEL_KEYS = new Set<
  keyof NormalizedCareerApplicationFlow["applicationForm"]["fields"]
>([
  "currentCompanyLabel",
  "currentJobTitleLabel",
  "currentCtcLabel",
  "noticePeriodLabel",
  "skillsSearchLabel",
  "skillsLabel",
  "languagesLabel",
  "employeeNameLabel",
  "employeeJobTitleLabel",
]);

function stripOptionalFieldRequiredMarker(label: string): string {
  return label.replace(/\*+$/, "").trim();
}

function stripLeadingRequiredMarker(text: string): string {
  return text.replace(/^\*\s*/, "").trim();
}

function normalizeApplicationFieldLabel(
  key: keyof NormalizedCareerApplicationFlow["applicationForm"]["fields"],
  label: string,
): string {
  if (!OPTIONAL_APPLICATION_FIELD_LABEL_KEYS.has(key)) {
    return label;
  }

  return stripOptionalFieldRequiredMarker(label);
}

const APPLICATION_FORM_FIELD_FALLBACKS: NormalizedCareerApplicationFlow["applicationForm"]["fields"] =
  {
    fullNameLabel: "Full Name*",
    phoneLabel: "Phone Number*",
    emailLabel: "Email*",
    dateOfBirthLabel: "Date of Birth*",
    dateOfBirthPlaceholder: "DD / MM / YYYY",
    fieldPlaceholder: "Enter here",
    selectPlaceholder: "Select",
    genderLabel: "Gender*",
    highestDegreeLabel: "Highest Degree*",
    areaOfStudyLabel: "Area of Study*",
    yearOfCompletionLabel: "Year of Completion*",
    relevantExperienceLabel: "Relevant Experience*",
    currentCompanyLabel: "Current Company",
    currentJobTitleLabel: "Current Job Title",
    currentCtcLabel: "Current CTC",
    expectedCtcLabel: "Expected CTC*",
    noticePeriodLabel: "Notice Period",
    skillsSearchLabel: "Skills",
    skillsSearchPlaceholder: "Search skills",
    skillsLabel: "Skills",
    languagesLabel: "Languages Known",
    companyRelationLabel: "Do you know anyone at Sunny Diamonds?*",
    companyRelationYes: "Yes",
    companyRelationNo: "No",
    employeeNameLabel: "Employee Name",
    employeeJobTitleLabel: "Employee Job Title",
  };

const APPLICATION_FLOW_FALLBACKS: NormalizedCareerApplicationFlow = {
  jobDetails: resolveCareerJobDetailLabels(null),
  applicationForm: {
    title: "Application Form",
    resumeHeading: "Resume",
    resumeHint: "File up to 5 mb and (ZIP, PDF, JPEG, PNG) Format Supported.",
    resumeUploadLabel: "Upload Resume",
    resumeRemoveLabel: "Remove",
    uploadResumeModal: {
      title: "Upload Resume",
      description: "Upload your resume to autofill your application details.",
      onlyUploadLabel: "Upload only",
      autofillResumeLabel: "Autofill with resume",
      closeLabel: "Close",
    },
    confirmSubmissionModal: {
      title: "Confirm Submission",
      description: "Please review your details before submitting your application.",
      goBackLabel: "Go Back",
      submitLabel: "Submit",
      closeLabel: "Close",
    },
    personalDetailsHeading: "Personal Details",
    educationHeading: "Education",
    workExperienceHeading: "Work Experience",
    skillsHeading: "Skills & Languages",
    additionalInfoHeading: "Additional Information",
    submitLabel: "Submit Application",
    noRoleSelected: "Please select a role to continue your application.",
    shareLabel: "Share",
    fields: APPLICATION_FORM_FIELD_FALLBACKS,
    genderOptions: ["Male", "Female", "Other", "Prefer not to say"],
    workExperienceOptions: ["0-1 years", "1-3 years", "3-5 years", "5+ years"],
    noticePeriodOptions: ["Immediate", "15 days", "30 days", "60 days", "90 days"],
    employeeRelationOptions: ["Yes", "No"],
  },
  applicationSuccess: {
    title: "Application Submitted",
    descriptionLine1: "Thank you for applying. Your application has been received and in now under review.",
    descriptionLine2: "We will get back to you shortly.",
    appliedJobDetailsHeading: "Applied Job Details",
    jobTitleLabel: "Job Title:",
    jobIdLabel: "Job ID:",
    goHomeLabel: "Go to Homepage",
  },
};

function withFallback<T extends string>(value: string | undefined | null, fallback: T): T {
  return (value && value.trim() ? value : fallback) as T;
}

/** CMS `applicationFlowSection` with safe defaults so apply/manual form works on slug pages. */
export function resolveCareerApplicationFlow(
  applicationFlow?: NormalizedCareerApplicationFlow | null,
): NormalizedCareerApplicationFlow {
  if (!applicationFlow) {
    return APPLICATION_FLOW_FALLBACKS;
  }

  const fallback = APPLICATION_FLOW_FALLBACKS;

  return {
    jobDetails: resolveCareerJobDetailLabels(applicationFlow.jobDetails),
    applicationForm: {
      title: withFallback(applicationFlow.applicationForm.title, fallback.applicationForm.title),
      resumeHeading: withFallback(
        applicationFlow.applicationForm.resumeHeading,
        fallback.applicationForm.resumeHeading,
      ),
      resumeHint: stripLeadingRequiredMarker(
        withFallback(
          applicationFlow.applicationForm.resumeHint,
          fallback.applicationForm.resumeHint,
        ),
      ),
      resumeUploadLabel: withFallback(
        applicationFlow.applicationForm.resumeUploadLabel,
        fallback.applicationForm.resumeUploadLabel,
      ),
      resumeRemoveLabel: withFallback(
        applicationFlow.applicationForm.resumeRemoveLabel,
        fallback.applicationForm.resumeRemoveLabel,
      ),
      uploadResumeModal: {
        title: withFallback(
          applicationFlow.applicationForm.uploadResumeModal.title,
          fallback.applicationForm.uploadResumeModal.title,
        ),
        description: withFallback(
          applicationFlow.applicationForm.uploadResumeModal.description,
          fallback.applicationForm.uploadResumeModal.description,
        ),
        onlyUploadLabel: withFallback(
          applicationFlow.applicationForm.uploadResumeModal.onlyUploadLabel,
          fallback.applicationForm.uploadResumeModal.onlyUploadLabel,
        ),
        autofillResumeLabel: withFallback(
          applicationFlow.applicationForm.uploadResumeModal.autofillResumeLabel,
          fallback.applicationForm.uploadResumeModal.autofillResumeLabel,
        ),
        closeLabel: withFallback(
          applicationFlow.applicationForm.uploadResumeModal.closeLabel,
          fallback.applicationForm.uploadResumeModal.closeLabel,
        ),
      },
      confirmSubmissionModal: {
        title: withFallback(
          applicationFlow.applicationForm.confirmSubmissionModal.title,
          fallback.applicationForm.confirmSubmissionModal.title,
        ),
        description: withFallback(
          applicationFlow.applicationForm.confirmSubmissionModal.description,
          fallback.applicationForm.confirmSubmissionModal.description,
        ),
        goBackLabel: withFallback(
          applicationFlow.applicationForm.confirmSubmissionModal.goBackLabel,
          fallback.applicationForm.confirmSubmissionModal.goBackLabel,
        ),
        submitLabel: withFallback(
          applicationFlow.applicationForm.confirmSubmissionModal.submitLabel,
          fallback.applicationForm.confirmSubmissionModal.submitLabel,
        ),
        closeLabel: withFallback(
          applicationFlow.applicationForm.confirmSubmissionModal.closeLabel,
          fallback.applicationForm.confirmSubmissionModal.closeLabel,
        ),
      },
      personalDetailsHeading: withFallback(
        applicationFlow.applicationForm.personalDetailsHeading,
        fallback.applicationForm.personalDetailsHeading,
      ),
      educationHeading: withFallback(
        applicationFlow.applicationForm.educationHeading,
        fallback.applicationForm.educationHeading,
      ),
      workExperienceHeading: withFallback(
        applicationFlow.applicationForm.workExperienceHeading,
        fallback.applicationForm.workExperienceHeading,
      ),
      skillsHeading: withFallback(
        applicationFlow.applicationForm.skillsHeading,
        fallback.applicationForm.skillsHeading,
      ),
      additionalInfoHeading: withFallback(
        applicationFlow.applicationForm.additionalInfoHeading,
        fallback.applicationForm.additionalInfoHeading,
      ),
      submitLabel: withFallback(
        applicationFlow.applicationForm.submitLabel,
        fallback.applicationForm.submitLabel,
      ),
      noRoleSelected: withFallback(
        applicationFlow.applicationForm.noRoleSelected,
        fallback.applicationForm.noRoleSelected,
      ),
      shareLabel: withFallback(
        applicationFlow.applicationForm.shareLabel,
        fallback.applicationForm.shareLabel,
      ),
      fields: Object.fromEntries(
        Object.entries(fallback.applicationForm.fields).map(([key, defaultValue]) => {
          const fieldKey =
            key as keyof NormalizedCareerApplicationFlow["applicationForm"]["fields"];
          const resolvedLabel = withFallback(
            applicationFlow.applicationForm.fields[fieldKey],
            defaultValue,
          );

          return [
            key,
            normalizeApplicationFieldLabel(fieldKey, resolvedLabel),
          ];
        }),
      ) as NormalizedCareerApplicationFlow["applicationForm"]["fields"],
      genderOptions:
        applicationFlow.applicationForm.genderOptions.length > 0
          ? applicationFlow.applicationForm.genderOptions
          : fallback.applicationForm.genderOptions,
      workExperienceOptions:
        applicationFlow.applicationForm.workExperienceOptions.length > 0
          ? applicationFlow.applicationForm.workExperienceOptions
          : fallback.applicationForm.workExperienceOptions,
      noticePeriodOptions:
        applicationFlow.applicationForm.noticePeriodOptions.length > 0
          ? applicationFlow.applicationForm.noticePeriodOptions
          : fallback.applicationForm.noticePeriodOptions,
      employeeRelationOptions:
        applicationFlow.applicationForm.employeeRelationOptions.length > 0
          ? applicationFlow.applicationForm.employeeRelationOptions
          : fallback.applicationForm.employeeRelationOptions,
    },
    applicationSuccess: {
      title: withFallback(
        applicationFlow.applicationSuccess.title,
        fallback.applicationSuccess.title,
      ),
      descriptionLine1: withFallback(
        applicationFlow.applicationSuccess.descriptionLine1,
        fallback.applicationSuccess.descriptionLine1,
      ),
      descriptionLine2: withFallback(
        applicationFlow.applicationSuccess.descriptionLine2,
        fallback.applicationSuccess.descriptionLine2,
      ),
      appliedJobDetailsHeading: withFallback(
        applicationFlow.applicationSuccess.appliedJobDetailsHeading,
        fallback.applicationSuccess.appliedJobDetailsHeading,
      ),
      jobTitleLabel: withFallback(
        applicationFlow.applicationSuccess.jobTitleLabel,
        fallback.applicationSuccess.jobTitleLabel,
      ),
      jobIdLabel: withFallback(
        applicationFlow.applicationSuccess.jobIdLabel,
        fallback.applicationSuccess.jobIdLabel,
      ),
      goHomeLabel: withFallback(
        applicationFlow.applicationSuccess.goHomeLabel,
        fallback.applicationSuccess.goHomeLabel,
      ),
    },
  };
}
