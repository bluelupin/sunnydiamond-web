import { APPOINTMENT_COUNTRY_CODES, DEFAULT_COUNTRY_CODE } from "@/shared/constants/appointmentForm";

export type CareerResumePrefillData = {
  name?: string;
  countryCode?: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  highestDegree?: string;
  areaOfStudy?: string;
  yearOfCompletion?: string;
  relevantExperience?: string;
  currentCompany?: string;
  currentJobTitle?: string;
  currentCtc?: string;
  expectedCtc?: string;
  noticePeriod?: string;
  skills?: string[];
  languages?: string[];
};

export type CareerFormSnapshot = {
  name: string;
  countryCode: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  highestDegree: string;
  areaOfStudy: string;
  yearOfCompletion: string;
  relevantExperience: string;
  currentCompany: string;
  currentJobTitle: string;
  currentCtc: string;
  expectedCtc: string;
  noticePeriod: string;
  skills: string[];
  languages: string[];
};

export type CareerFormSelectOptions = {
  genderOptions: readonly string[];
  workExperienceOptions: readonly string[];
  noticePeriodOptions: readonly string[];
};

function readRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function readString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function readNumberAsString(value: unknown): string | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(Math.trunc(value));
  }

  return readString(value);
}

function readStringList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const items = value
    .map((entry) => {
      if (typeof entry === "string") {
        return entry.trim();
      }

      const record = readRecord(entry);
      if (!record) {
        return "";
      }

      return (
        readString(record.SkillName) ??
        readString(record.skillName) ??
        readString(record.name) ??
        readString(record.label) ??
        ""
      );
    })
    .filter(Boolean);

  return items.length > 0 ? items : undefined;
}

function unwrapPayload(payload: unknown): Record<string, unknown> | null {
  const root = readRecord(payload);
  if (!root) {
    return null;
  }

  const data = readRecord(root.data);
  if (data) {
    const nested = readRecord(data.data) ?? readRecord(data.parsedData) ?? readRecord(data.result);
    return nested ?? data;
  }

  return root;
}

function readSection(payload: Record<string, unknown>, ...keys: string[]): Record<string, unknown> | null {
  for (const key of keys) {
    const section = readRecord(payload[key]);
    if (section) {
      return section;
    }
  }

  return null;
}

function normalizeDateOfBirth(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    return trimmed.slice(0, 10);
  }

  const dmyMatch = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmyMatch) {
    const [, day, month, year] = dmyMatch;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const parsed = Date.parse(trimmed);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString().slice(0, 10);
  }

  return undefined;
}

function parsePhoneNumber(phoneNo: string): { countryCode: string; phone: string } {
  const normalized = phoneNo.replace(/\s/g, "");

  for (const { code } of APPOINTMENT_COUNTRY_CODES) {
    if (normalized.startsWith(code)) {
      return {
        countryCode: code,
        phone: normalized.slice(code.length).replace(/\D/g, ""),
      };
    }
  }

  const digits = normalized.replace(/\D/g, "");
  if (digits.length > 10) {
    return {
      countryCode: DEFAULT_COUNTRY_CODE,
      phone: digits.slice(-10),
    };
  }

  return {
    countryCode: DEFAULT_COUNTRY_CODE,
    phone: digits,
  };
}

function matchSelectOption(
  value: string | undefined,
  options: readonly string[],
): string | undefined {
  if (!value?.trim() || options.length === 0) {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  const exact = options.find((option) => option.toLowerCase() === normalized);
  if (exact) {
    return exact;
  }

  return options.find(
    (option) =>
      normalized.includes(option.toLowerCase()) || option.toLowerCase().includes(normalized),
  );
}

function mapNoticePeriodValue(
  value: string | number | undefined,
  options: readonly string[],
): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === "number") {
    if (value === 0) {
      return options.find((option) => /immediate/i.test(option));
    }

    const byDays = options.find((option) => option.includes(String(value)));
    if (byDays) {
      return byDays;
    }
  }

  return matchSelectOption(String(value), options);
}

function mergeTextField(current: string, parsed?: string): string {
  if (current.trim()) {
    return current;
  }

  return parsed?.trim() ?? current;
}

function mergeStringArray(current: string[], parsed?: string[]): string[] {
  if (!parsed?.length) {
    return current;
  }

  if (!current.length) {
    return parsed;
  }

  const existing = new Set(current.map((item) => item.toLowerCase()));
  const additions = parsed.filter((item) => !existing.has(item.toLowerCase()));

  return additions.length > 0 ? [...current, ...additions] : current;
}

export function mapCareerResumeParseResponse(payload: unknown): CareerResumePrefillData | null {
  const root = unwrapPayload(payload);
  if (!root) {
    return null;
  }

  const personalDetails = readSection(root, "personalDetails", "personal_details");
  const educationDetails = readSection(root, "educationDetails", "education_details");
  const workExperience = readSection(root, "workExperience", "work_experience");
  const skillsAndLanguages = readSection(root, "skillsAndLanguages", "skills_and_languages");

  const fullPhone =
    readString(personalDetails?.PhoneNo) ??
    readString(personalDetails?.phone) ??
    readString(personalDetails?.phoneNo) ??
    readString(root.phone);

  const parsedPhone = fullPhone ? parsePhoneNumber(fullPhone) : undefined;

  const noticeRaw =
    workExperience?.NoticePerd ??
    workExperience?.noticePeriod ??
    workExperience?.notice_period ??
    workExperience?.NoticePeriod;

  const noticePeriod =
    typeof noticeRaw === "number"
      ? String(noticeRaw)
      : readString(noticeRaw);

  return {
    name:
      readString(personalDetails?.Name) ??
      readString(personalDetails?.fullName) ??
      readString(personalDetails?.name) ??
      readString(root.fullName) ??
      readString(root.name),
    countryCode: parsedPhone?.countryCode,
    phone: parsedPhone?.phone,
    email:
      readString(personalDetails?.EmailId) ??
      readString(personalDetails?.email) ??
      readString(personalDetails?.emailId) ??
      readString(root.email),
    dateOfBirth:
      normalizeDateOfBirth(
        readString(personalDetails?.DOB) ??
          readString(personalDetails?.dateOfBirth) ??
          readString(personalDetails?.dob) ??
          readString(root.dateOfBirth) ??
          "",
      ) ?? undefined,
    gender:
      readString(personalDetails?.Gender) ??
      readString(personalDetails?.gender) ??
      readString(root.gender),
    highestDegree:
      readString(educationDetails?.Degree) ??
      readString(educationDetails?.highestDegree) ??
      readString(educationDetails?.degree) ??
      readString(root.highestDegree),
    areaOfStudy:
      readString(educationDetails?.AreaOfStudy) ??
      readString(educationDetails?.areaOfStudy) ??
      readString(educationDetails?.area_of_study) ??
      readString(root.areaOfStudy),
    yearOfCompletion:
      readNumberAsString(educationDetails?.Year) ??
      readString(educationDetails?.yearOfCompletion) ??
      readString(educationDetails?.year) ??
      readString(root.yearOfCompletion),
    relevantExperience:
      readString(workExperience?.RelvWorkExp) ??
      readString(workExperience?.relevantExperience) ??
      readString(workExperience?.relevant_experience) ??
      readString(root.relevantExperience),
    currentCompany:
      readString(workExperience?.CurrCompName) ??
      readString(workExperience?.currentCompany) ??
      readString(workExperience?.current_company) ??
      readString(root.currentCompany),
    currentJobTitle:
      readString(workExperience?.CurrJobTitle) ??
      readString(workExperience?.currentJobTitle) ??
      readString(workExperience?.current_job_title) ??
      readString(root.currentJobTitle),
    currentCtc:
      readNumberAsString(workExperience?.CurrCtc) ??
      readString(workExperience?.currentCtc) ??
      readString(root.currentCtc),
    expectedCtc:
      readNumberAsString(workExperience?.ExpecCtc) ??
      readString(workExperience?.expectedCtc) ??
      readString(root.expectedCtc),
    noticePeriod,
    skills:
      readStringList(skillsAndLanguages?.Skills) ??
      readStringList(skillsAndLanguages?.skills) ??
      readStringList(root.skills),
    languages:
      readStringList(skillsAndLanguages?.Languages) ??
      readStringList(skillsAndLanguages?.languages) ??
      readStringList(root.languages),
  };
}

export function mergeCareerResumePrefill(
  prefill: CareerResumePrefillData,
  current: CareerFormSnapshot,
  options: CareerFormSelectOptions,
): CareerFormSnapshot {
  return {
    name: mergeTextField(current.name, prefill.name),
    countryCode: current.phone.trim() ? current.countryCode : prefill.countryCode ?? current.countryCode,
    phone: mergeTextField(current.phone, prefill.phone),
    email: mergeTextField(current.email, prefill.email),
    dateOfBirth: mergeTextField(current.dateOfBirth, prefill.dateOfBirth),
    gender:
      current.gender ||
      matchSelectOption(prefill.gender, options.genderOptions) ||
      current.gender,
    highestDegree: mergeTextField(current.highestDegree, prefill.highestDegree),
    areaOfStudy: mergeTextField(current.areaOfStudy, prefill.areaOfStudy),
    yearOfCompletion: mergeTextField(current.yearOfCompletion, prefill.yearOfCompletion),
    relevantExperience:
      current.relevantExperience ||
      matchSelectOption(prefill.relevantExperience, options.workExperienceOptions) ||
      current.relevantExperience,
    currentCompany: mergeTextField(current.currentCompany, prefill.currentCompany),
    currentJobTitle: mergeTextField(current.currentJobTitle, prefill.currentJobTitle),
    currentCtc: mergeTextField(current.currentCtc, prefill.currentCtc),
    expectedCtc: mergeTextField(current.expectedCtc, prefill.expectedCtc),
    noticePeriod:
      current.noticePeriod ||
      mapNoticePeriodValue(prefill.noticePeriod, options.noticePeriodOptions) ||
      current.noticePeriod,
    skills: mergeStringArray(current.skills, prefill.skills),
    languages: mergeStringArray(current.languages, prefill.languages),
  };
}
