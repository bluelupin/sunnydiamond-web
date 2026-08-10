import type { NormalizedCareerJob, NormalizedCareersPageData } from "@/services/careers/careers.types";
import type { CareerJob } from "../types";

export function mergeCareerJobIntoCms(
  cms: NormalizedCareersPageData,
  job: NormalizedCareerJob,
): NormalizedCareersPageData {
  const existingIndex = cms.jobs.findIndex(
    (entry) => entry.id === job.id || entry.jobCode === job.jobCode,
  );

  if (existingIndex >= 0) {
    const jobs = [...cms.jobs];
    jobs[existingIndex] = job;
    return { ...cms, jobs };
  }

  return {
    ...cms,
    jobs: [...cms.jobs, job],
  };
}

export function resolveCareerJobCode(
  jobs: readonly CareerJob[],
  selectedJobId: string | null | undefined,
  jobCodeOverride?: string,
): string | null {
  const trimmedOverride = jobCodeOverride?.trim();
  if (trimmedOverride) {
    return trimmedOverride;
  }

  return getCareerJobById(jobs, selectedJobId)?.jobCode?.trim() ?? null;
}

export function getCareerJobById(
  jobs: readonly CareerJob[],
  jobId: string | null | undefined,
): CareerJob | null {
  if (!jobId) return null;
  return jobs.find((job) => job.id === jobId || job.jobCode === jobId) ?? null;
}

export function getRelatedCareerJobs(
  jobs: readonly CareerJob[],
  relatedJobIds: readonly string[],
  limit = 3,
): CareerJob[] {
  if (relatedJobIds.length === 0) {
    return [];
  }

  const ordered = relatedJobIds
    .map((jobId) => getCareerJobById(jobs, jobId))
    .filter(Boolean) as CareerJob[];

  return ordered.slice(0, limit);
}

/** First N jobs from the API-sorted list (sortOrder asc, publishedAt desc). */
export function getLandingCareerJobs(
  jobs: readonly CareerJob[],
  limit = 3,
): CareerJob[] {
  return jobs.slice(0, limit);
}
