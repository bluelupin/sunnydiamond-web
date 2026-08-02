import type { NormalizedCareersPageData } from "@/services/careers/careers.types";
import type { CareerJob } from "../types";

export function getCareerJobById(
  jobs: readonly CareerJob[],
  jobId: string | null | undefined,
): CareerJob | null {
  if (!jobId) return null;
  return jobs.find((job) => job.id === jobId || job.slug === jobId) ?? null;
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
