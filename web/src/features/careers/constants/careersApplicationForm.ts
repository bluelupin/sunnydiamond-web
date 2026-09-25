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

function getCareersResumeFileExtension(fileName: string): string {
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

/**
 * DOB must be strictly before today (today / future dates are invalid).
 * Picker max is yesterday so those dates cannot be selected.
 */
export function getCareersBirthDateBounds(
  referenceDate = new Date(),
): { minDate: string; maxDate: string } {
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  const max = new Date(today);
  max.setDate(max.getDate() - 1);

  const min = new Date(today);
  min.setFullYear(min.getFullYear() - CAREERS_DOB_MAX_AGE_YEARS);

  const toDateValue = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return { minDate: toDateValue(min), maxDate: toDateValue(max) };
}

/** Returns an error message when DOB is missing or not strictly before today. */
export function getCareersDateOfBirthError(
  value: string,
  referenceDate = new Date(),
): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Date of birth is required";
  }

  const parsed = new Date(`${trimmed}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return "Enter a valid date of birth";
  }

  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);
  parsed.setHours(0, 0, 0, 0);

  if (parsed.getTime() >= today.getTime()) {
    return "Date of birth must be before today";
  }

  const { minDate } = getCareersBirthDateBounds(referenceDate);
  const min = new Date(`${minDate}T00:00:00`);
  if (parsed.getTime() < min.getTime()) {
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
