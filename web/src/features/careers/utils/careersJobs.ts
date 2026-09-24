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

export function resolveCareerJobSlug(
  jobs: readonly CareerJob[],
  selectedJobId: string | null | undefined,
  slugOverride?: string,
): string | null {
  const trimmedOverride = slugOverride?.trim();
  if (trimmedOverride) {
    return trimmedOverride;
  }

  return getCareerJobById(jobs, selectedJobId)?.slug?.trim() ?? null;
}

export function getCareerJobById(
  jobs: readonly CareerJob[],
  jobId: string | null | undefined,
): CareerJob | null {
  if (!jobId) return null;
  return (
    jobs.find(
      (job) => job.id === jobId || job.jobCode === jobId || job.slug === jobId,
    ) ?? null
  );
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

