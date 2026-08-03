export const CAREERS_ROUTE = "/careers";

export function getCareerJobPath(jobCode: string): string {
  return `${CAREERS_ROUTE}/${encodeURIComponent(jobCode)}`;
}
