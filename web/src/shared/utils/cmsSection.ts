/** CMS sections are visible unless explicitly deactivated. */
export function isSectionActive(isActive?: boolean | null): boolean {
  return isActive !== false;
}
