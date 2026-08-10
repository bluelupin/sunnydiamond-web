export const CAREERS_ROUTE = "/careers";

export const CAREERS_ALL_OPENINGS_ROUTE = "/careers/all-openings";

export function getCareerJobPath(jobCode: string): string {
  return `${CAREERS_ROUTE}/${encodeURIComponent(jobCode)}`;
}

export function getCareerApplyPath(jobCode: string): string {
  return `${CAREERS_ROUTE}/apply/${encodeURIComponent(jobCode)}`;
}
