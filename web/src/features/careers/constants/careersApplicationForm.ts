export const CAREERS_RESUME_ACCEPT =
  ".zip,.pdf,.jpeg,.jpg,application/pdf,application/zip,application/x-zip-compressed,image/jpeg";

export const CAREERS_RESUME_MAX_BYTES = 5 * 1024 * 1024;

export const CAREERS_RESUME_MAX_SIZE_TOAST_MESSAGE =
  "File size must not exceed 5 MB.";

export const CAREERS_RESUME_FORMAT_TOAST_MESSAGE =
  "Only ZIP, PDF, JPEG, and JPG file formats are allowed.";

const CAREERS_RESUME_ALLOWED_EXTENSIONS = new Set([".zip", ".pdf", ".jpeg", ".jpg"]);

const CAREERS_RESUME_ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "image/jpeg",
]);

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

  if (extension && CAREERS_RESUME_ALLOWED_EXTENSIONS.has(extension)) {
    if (mimeType && !CAREERS_RESUME_ALLOWED_MIME_TYPES.has(mimeType)) {
      return false;
    }

    return true;
  }

  return Boolean(mimeType && CAREERS_RESUME_ALLOWED_MIME_TYPES.has(mimeType));
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

export function getCareersBirthDateBounds(): { minDate: string; maxDate: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const min = new Date(today);
  min.setFullYear(min.getFullYear() - 100);

  const toDateValue = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return { minDate: toDateValue(min), maxDate: toDateValue(today) };
}

export function formatCareersFileSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb < 0.1) {
    const kb = bytes / 1024;
    return `${kb.toFixed(0)} kb`;
  }
  return `${mb.toFixed(1)} mb`;
}
