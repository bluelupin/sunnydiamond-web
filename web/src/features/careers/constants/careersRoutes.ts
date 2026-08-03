export const CAREERS_ROUTE = "/careers";

export function getCareerJobPath(slug: string): string {
  return `${CAREERS_ROUTE}/${encodeURIComponent(slug)}`;
}
