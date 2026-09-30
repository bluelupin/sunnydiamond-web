/** Approved Figma copy for the application form. */
export const CAREERS_APPLICATION_FIELD_LABELS = {
  fullNameLabel: "Full Name*",
  phoneLabel: "Phone No.*",
  emailLabel: "Email ID*",
  dateOfBirthLabel: "Date of Birth*",
  genderLabel: "Gender*",
  highestDegreeLabel: "Highest Degree*",
  areaOfStudyLabel: "Area of Study*",
  yearOfCompletionLabel: "Year of Completion*",
  relevantExperienceLabel: "Relevant Work Experience*",
  currentCompanyLabel: "Current Company's Name",
  currentJobTitleLabel: "Current Job Title",
  currentCtcLabel: "Current CTC",
  expectedCtcLabel: "Expected CTC*",
  noticePeriodLabel: "Notice Period",
  companyRelationLabel: "Do you have any relation in the company?",
  employeeNameLabel: "Employee Name*",
  employeeJobTitleLabel: "Employee Job Title*",
} as const;

export const CAREERS_RESUME_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const CAREERS_AUTOFILL_RESUME_ACCEPT =
  ".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const CAREERS_RESUME_MAX_BYTES = 5 * 1024 * 1024;

export const CAREERS_RESUME_MAX_SIZE_TOAST_MESSAGE =
  "File size must not exceed 5 MB.";

export const CAREERS_RESUME_FORMAT_TOAST_MESSAGE =
  "Only PDF, DOC, and DOCX file formats are allowed.";

const CAREERS_RESUME_ALLOWED_MIME_TYPES: Record<string, readonly string[]> = {
  ".pdf": ["application/pdf"],
  ".doc": ["application/msword"],
  ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/zip", "application/x-zip-compressed"],
};
const CAREERS_AUTOFILL_ALLOWED_EXTENSIONS = new Set([".pdf", ".docx"]);


export type CareersResumeValidationError = "size" | "format";

export function getCareersResumeFileExtension(fileName: string): string {
  const parts = fileName.trim().toLowerCase().split(".");

  if (parts.length < 2) {
    return "";
  }

  return `.${parts.pop() ?? ""}`;
}

export function isCareersResumeFileFormatAllowed(file: File): boolean {
  const extension = getCareersResumeFileExtension(file.name);
  const mimeType = file.type.trim().toLowerCase();

  const allowedTypes = CAREERS_RESUME_ALLOWED_MIME_TYPES[extension];
  return Boolean(allowedTypes && (!mimeType || allowedTypes.includes(mimeType)));
}

export function getCareersResumeValidationError(
  file: File,
): CareersResumeValidationError | null {
  if (file.size > CAREERS_RESUME_MAX_BYTES) {
    return "size";
  }

  if (!isCareersResumeFileFormatAllowed(file)) {
    return "format";
  }

  return null;
}

export function isCareersAutofillFileSupported(file: File): boolean {
  const extension = getCareersResumeFileExtension(file.name);
  return CAREERS_AUTOFILL_ALLOWED_EXTENSIONS.has(extension) && isCareersResumeFileFormatAllowed(file);
}

export const CAREERS_SUBMITTING_APPLICATION_LABEL = "Submitting...";

export const CAREERS_NUMERIC_ONLY_ERROR = "Enter numbers only";

export const CAREERS_YEAR_OF_COMPLETION_MAX_LENGTH = 4;

export function sanitizeCareersNumericInput(value: string, maxLength?: number): string {
  const digitsOnly = value.replace(/\D/g, "");

  if (typeof maxLength === "number") {
    return digitsOnly.slice(0, maxLength);
  }

  return digitsOnly;
}

export function isCareersNumericInput(value: string): boolean {
  const trimmed = value.trim();

  return trimmed.length > 0 && /^\d+$/.test(trimmed);
}

export const careersFormLabelClassName =
  "font-gill text-base font-normal leading-110 text-darkblack";

export const careersFormFieldClassName =
  "h-14 w-full bg-[#F2F2F2] p-3 font-gill text-base font-normal leading-110 text-darkblack outline-none placeholder:font-normal placeholder:text-gray600";

export const careersFormSelectClassName =
  "h-14 w-full appearance-none bg-[#F2F2F2] p-3 font-gill text-base font-normal leading-110 text-darkblack outline-none";

/** Absolute chevron for native selects — aligns with 12px field padding (Figma 1480:3410). */
export const careersFormSelectChevronClassName =
  "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2";

export const careersFormSectionClassName =
  "flex flex-col gap-6 bg-gray200 p-4 md:p-6";

export const careersFormSectionTitleClassName =
  "font-larken text-xl font-light leading-110 text-darkblack";

export const careersFormFieldsStackClassName = "flex w-full flex-col gap-6";

export const careersFormFieldGridClassName =
  "grid gap-6 md:grid-cols-2 lg:grid-cols-3";

/** Oldest DOB allowed in the careers date picker (years before today). */
export const CAREERS_DOB_MAX_AGE_YEARS = 100;

/** Youngest applicant age allowed (legal working age). */
export const CAREERS_DOB_MIN_AGE_YEARS = 18;

const toCareersDateValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function startOfCareersLocalDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

/** Parses `YYYY-MM-DD` (careers date field value) in local time. */
export function parseCareersDateValue(value: string): Date | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const parsed = new Date(`${trimmed}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return startOfCareersLocalDay(parsed);
}

/** True when the person has reached (or passed) their `minimumAge` birthday on `referenceDate`. */
export function hasReachedMinimumAge(
  birthDate: Date,
  minimumAge: number,
  referenceDate = new Date(),
): boolean {
  const referenceDay = startOfCareersLocalDay(referenceDate);
  const birthDay = startOfCareersLocalDay(birthDate);
  const milestone = new Date(birthDay);
  milestone.setFullYear(milestone.getFullYear() + minimumAge);
  return milestone.getTime() <= referenceDay.getTime();
}

/** Latest selectable DOB for applicants who meet `minimumAge` on `referenceDate`. */
export function getLatestBirthDateForMinimumAge(
  minimumAge: number,
  referenceDate = new Date(),
): Date {
  const referenceDay = startOfCareersLocalDay(referenceDate);
  const latest = new Date(referenceDay);
  latest.setFullYear(latest.getFullYear() - minimumAge);
  return latest;
}

/**
 * DOB calendar bounds for legal working age:
 * - maxDate = latest DOB for someone at least 18 today
 * - minDate = today minus 100 years
 */
export function getCareersBirthDateBounds(
  referenceDate = new Date(),
): { minDate: string; maxDate: string } {
  const referenceDay = startOfCareersLocalDay(referenceDate);

  const max = getLatestBirthDateForMinimumAge(CAREERS_DOB_MIN_AGE_YEARS, referenceDay);

  const min = new Date(referenceDay);
  min.setFullYear(min.getFullYear() - CAREERS_DOB_MAX_AGE_YEARS);

  return { minDate: toCareersDateValue(min), maxDate: toCareersDateValue(max) };
}

/** Returns an error message when DOB is missing or outside legal working-age bounds. */
export function getCareersDateOfBirthError(
  value: string,
  referenceDate = new Date(),
): string | undefined {
  if (!value.trim()) {
    return "Date of birth is required";
  }

  const parsed = parseCareersDateValue(value);
  if (!parsed) {
    return "Enter a valid date of birth";
  }

  if (!hasReachedMinimumAge(parsed, CAREERS_DOB_MIN_AGE_YEARS, referenceDate)) {
    return `You must be at least ${CAREERS_DOB_MIN_AGE_YEARS} years old`;
  }

  const { minDate } = getCareersBirthDateBounds(referenceDate);
  const min = parseCareersDateValue(minDate);
  if (!min || parsed.getTime() < min.getTime()) {
    return "Enter a valid date of birth";
  }

  return undefined;
}

export function formatCareersFileSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb < 0.1) {
    const kb = bytes / 1024;
    return `${kb.toFixed(0)} kb`;
  }
  return `${mb.toFixed(1)} mb`;
}
