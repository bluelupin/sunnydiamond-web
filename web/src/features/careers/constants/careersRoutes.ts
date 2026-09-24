export const CAREERS_ROUTE = "/careers";

export const CAREERS_ALL_OPENINGS_ROUTE = "/careers/all-openings";

export function getCareerJobPath(slug: string): string {
  return `${CAREERS_ROUTE}/${encodeURIComponent(slug)}`;
}

export function getCareerApplyPath(slug: string): string {
  return `${CAREERS_ROUTE}/apply/${encodeURIComponent(slug)}`;
}
