export const CAREERS_LISTING_CLEAR_FILTERS_LABEL = "Clear";
export const CAREERS_LISTING_PAGE_SIZE = 10;
export const CAREERS_FILTER_ALL_LABEL = "All";
export const CAREERS_FILTER_CLEAR_ALL_LABEL = "Clear All";
export const CAREERS_FILTER_APPLY_LABEL = "Apply Filters";

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
