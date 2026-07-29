import type { CareerJob } from "../types";

export function formatPostedAbsolute(postedAt: string): string {
  const [year, month, day] = postedAt.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
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

export function filterCareerJobs(
  jobs: readonly CareerJob[],
  query: string,
  filters: CareerJobFilters = {},
): CareerJob[] {
  const normalized = query.trim().toLowerCase();

  return jobs.filter((job) => {
    if (filters.location && job.location !== filters.location) {
      return false;
    }

    if (filters.department && job.department !== filters.department) {
      return false;
    }

    if (filters.experience && job.experienceLabel !== filters.experience) {
      return false;
    }

    if (!normalized) {
      return true;
    }

    const haystack = `${job.title} ${job.department} ${job.location} ${job.summary}`.toLowerCase();
    return haystack.includes(normalized);
  });
}

export function getUniqueCareerFilterOptions(jobs: readonly CareerJob[]) {
  const locations = [...new Set(jobs.map((job) => job.location))].sort();
  const departments = [...new Set(jobs.map((job) => job.department))].sort();
  const experiences = [...new Set(jobs.map((job) => job.experienceLabel))].sort();

  return { locations, departments, experiences };
}
