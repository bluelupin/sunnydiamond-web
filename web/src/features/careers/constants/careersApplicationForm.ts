export const CAREERS_RESUME_ACCEPT =
  ".zip,.pdf,.jpeg,.jpg,.png,application/pdf,application/zip,image/jpeg,image/png";

export const CAREERS_RESUME_MAX_BYTES = 5 * 1024 * 1024;

export const CAREERS_GENDER_OPTIONS = ["Female", "Male", "Other"] as const;

export const CAREERS_WORK_EXPERIENCE_OPTIONS = [
  "0–1 years",
  "1–2 years",
  "2–4 years",
  "4–6 years",
  "6+ years",
] as const;

export const CAREERS_NOTICE_PERIOD_OPTIONS = [
  "Immediate",
  "15 days",
  "1 month",
  "2 months",
  "3 months",
] as const;

export const CAREERS_EMPLOYEE_OPTIONS = [
  "Saumya",
  "Gauri J",
  "Priya Nair",
  "Rahul Menon",
] as const;

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
