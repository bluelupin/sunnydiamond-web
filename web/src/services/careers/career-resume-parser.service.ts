import { APPOINTMENT_COUNTRY_CODES } from "@/shared/constants/appointmentForm";
import { sanitizePhoneInput } from "@/shared/utils/formValidation";

export type ParsedResumePosition = {
  company: string | null;
  jobTitle: string | null;
  startDate: string | null;
  endDate: string | null;
};

export type ParsedCareerResume = {
  data: {
    fullName: string | null;
    phoneNo: string | null;
    emailId: string | null;
    educationDetails: Array<{
      institutionName: string | null;
      degree: string | null;
      areaOfStudy: string | null;
      completionYear: number | null;
    }>;
    workExperience: {
      relevantWorkExp: string | null;
      currentCompany: string | null;
      currentJobTitle: string | null;
      positions: ParsedResumePosition[];
    };
    skillsAndLanguages: {
      Skills: Array<{ SkillName: string }>;
      Languages: Array<{ SkillName: string }>;
    };
  };
  meta: { ocrUsed: boolean; warnings: string[]; missingFields: string[] };
};

export async function parseCareerResume(file: File, signal?: AbortSignal): Promise<ParsedCareerResume> {
  const formData = new FormData();
  formData.append("resume", file, file.name);
  const response = await fetch("/api/careers/parse-resume", {
    method: "POST",
    body: formData,
    signal,
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      typeof payload?.error === "string"
        ? payload.error
        : "Resume autofill is unavailable. Please complete the form manually.",
    );
  }
  if (!payload?.data?.workExperience || !payload?.meta) {
    throw new Error("Resume autofill returned an invalid response.");
  }
  return payload as ParsedCareerResume;
}

export function getAutofillPhone(value: string | null): { countryCode: string; phone: string } | null {
  if (!value) return null;
  const trimmed = value.trim();
  const code = [...APPOINTMENT_COUNTRY_CODES]
    .sort((a, b) => b.code.length - a.code.length)
    .find((entry) => trimmed.startsWith(entry.code));
  if (trimmed.startsWith("+") && !code) return null;
  const countryCode = code?.code ?? APPOINTMENT_COUNTRY_CODES[0].code;
  const phone = sanitizePhoneInput(code ? trimmed.slice(code.code.length) : trimmed, countryCode);
  return phone ? { countryCode, phone } : null;
}

export function getRelevantExperienceOption(
  duration: string | null,
  options: readonly string[],
): string | null {
  if (!duration) return null;
  const years = Number(duration.match(/(\d+)\s*years?/i)?.[1] ?? 0);
  const months = Number(duration.match(/(\d+)\s*months?/i)?.[1] ?? 0);
  if (!years && !months) return null;
  const totalMonths = years * 12 + months;
  const prefix = totalMonths < 12 ? "0-1" : totalMonths < 36 ? "1-3" : totalMonths < 60 ? "3-5" : "5+";
  return options.find((option) => option.replace(/\s/g, "").startsWith(prefix)) ?? null;
}
