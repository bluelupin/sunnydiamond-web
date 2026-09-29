import type { CareerValueOptions } from "@/services/careers/careers.types";
import type { CareerJob } from "../types";

/** Present CMS job titles in title case across careers UI. */
export function formatCareerJobTitle(title: string): string {
  return title
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/** e.g. `HR & ADMINISTRATION` → `HR & Administration`, `SALES` → `Sales` */
export function formatCareerDepartmentLabel(department: string): string {
  return department
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      if (word.length <= 1) {
        return word;
      }

      // Keep two-letter acronyms (HR, IT); title-case longer tokens (SALES, ADMINISTRATION).
      if (/^[A-Z]{2}$/.test(word)) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

const POSTED_MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** Deterministic date label — avoids SSR/client Intl mismatches. */
export function formatPostedAbsolute(postedAt: string): string {
  const [year, month, day] = postedAt.split("-").map(Number);
  const monthLabel = POSTED_MONTH_LABELS[month - 1];

  if (!monthLabel || !year || !day) {
    return postedAt;
  }

  return `${day} ${monthLabel} ${year}`;
}

export function formatPostedRelative(postedAt: string): string {
  const [year, month, day] = postedAt.split("-").map(Number);
  const postedDay = Math.floor(Date.UTC(year, month - 1, day) / (1000 * 60 * 60 * 24));
  const nowDay = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const diffDays = nowDay - postedDay;

  if (diffDays < 1) {
    return "Posted Today";
  }

  if (diffDays < 7) {
    return `Posted ${diffDays} Day${diffDays === 1 ? "" : "s"} Ago`;
  }

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) {
    return `Posted ${diffWeeks} Week${diffWeeks === 1 ? "" : "s"} Ago`;
  }

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `Posted ${diffMonths} Month${diffMonths === 1 ? "" : "s"} Ago`;
  }

  const diffYears = Math.floor(diffDays / 365);
  return `Posted ${diffYears} Year${diffYears === 1 ? "" : "s"} Ago`;
}

export type CareerJobFilters = {
  location?: string;
  department?: string;
  experience?: string;
};

const EMPTY_CAREER_VALUE_OPTIONS: CareerValueOptions = {
  locations: [],
  departments: [],
  experiences: [],
};

/** `HR & Administration`, `hr and administration` and `HR  &  ADMINISTRATION` compare equal. */
const normalizeCareerValue = (value: string) =>
  value.trim().toLowerCase().replace(/\s*&\s*/g, " and ").replace(/\s+/g, " ");

/** Years range from an experience label; "Freshers" starts at 0 and `6+` has no upper limit. */
function parseExperienceYears(label: string): { min: number; max: number } | null {
  const numbers = label.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  if (numbers.length === 0) {
    return /fresher/i.test(label) ? { min: 0, max: 0 } : null;
  }

  const min = numbers[0];
  const max = numbers.length > 1 ? numbers[1] : label.includes("+") ? Infinity : min;
  return { min, max };
}

/**
 * The CMS value a label or job value stands for: same name ignoring case and `&`/`and`,
 * or for experience the range its starting year falls in (`Freshers` → `Years 0-2`, `5+ Yrs` → `Years 4-6`).
 */
export function toCareerValueOption(
  value: string | undefined,
  options: readonly string[],
  matchByYears = false,
): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed || options.length === 0) return undefined;

  const normalized = normalizeCareerValue(trimmed);
  const sameName = options.find((option) => normalizeCareerValue(option) === normalized);
  if (sameName || !matchByYears) return sameName;

  const years = parseExperienceYears(trimmed);
  if (!years) return undefined;

  return options.find((option) => {
    const range = parseExperienceYears(option);
    return (
      range != null &&
      years.min >= range.min &&
      (years.min < range.max || years.min === range.min)
    );
  });
}

/** Compares the mapped CMS values; falls back to a case-insensitive match when either side has none. */
const matchesFilter = (
  jobValue: string | undefined,
  filterValue: string,
  options: readonly string[],
  matchByYears = false,
) => {
  const jobOption = toCareerValueOption(jobValue, options, matchByYears);
  const filterOption = toCareerValueOption(filterValue, options, matchByYears);
  if (jobOption && filterOption) return jobOption === filterOption;

  return (jobValue ?? "").trim().toLowerCase() === filterValue.trim().toLowerCase();
};

export function filterCareerJobs(
  jobs: readonly CareerJob[],
  query: string,
  filters: CareerJobFilters = {},
  valueOptions: CareerValueOptions = EMPTY_CAREER_VALUE_OPTIONS,
): CareerJob[] {
  const normalized = query.trim().toLowerCase();

  return jobs.filter((job) => {
    if (
      filters.location &&
      !matchesFilter(job.location, filters.location, valueOptions.locations)
    ) {
      return false;
    }

    if (
      filters.department &&
      !matchesFilter(job.department, filters.department, valueOptions.departments)
    ) {
      return false;
    }

    if (
      filters.experience &&
      !matchesFilter(job.experienceLabel, filters.experience, valueOptions.experiences, true)
    ) {
      return false;
    }

    if (!normalized) {
      return true;
    }

    // Case-insensitive match on role title and location (e.g. Cochin / cochin / COCHIN).
    const haystack = [job.title, job.location]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

export function getUniqueCareerFilterOptions(jobs: readonly CareerJob[]) {
  const locations = [...new Set(jobs.map((job) => job.location))].sort();
  const departments = [...new Set(jobs.map((job) => job.department))].sort();
  const experiences = [
    ...new Set(
      jobs
        .map((job) => job.experienceLabel)
        .filter((label) => Boolean(label?.trim())),
    ),
  ].sort();

  return { locations, departments, experiences };
}
