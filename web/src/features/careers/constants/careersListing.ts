export const CAREERS_LISTING_CLEAR_FILTERS_LABEL = "Clear";
export const CAREERS_LISTING_PAGE_SIZE = 10;

export function hasActiveListingFilters(
  searchQuery: string,
  locationFilter: string,
  departmentFilter: string,
  experienceFilter: string,
) {
  return Boolean(
    searchQuery.trim() || locationFilter || departmentFilter || experienceFilter,
  );
}
