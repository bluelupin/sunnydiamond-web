"use client";

import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import CareersInlineSelectField from "./CareersInlineSelectField";

const CAREERS_FILTER_PLACEHOLDER = "Select";

type FilterFieldProps = {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  listPlacement?: "portaled" | "inline";
};

const FilterField = ({
  id,
  label,
  value,
  options,
  onChange,
  listPlacement,
}: FilterFieldProps) => {
  return (
    <CareersInlineSelectField
      id={id}
      label={label}
      value={value}
      options={options}
      placeholder={CAREERS_FILTER_PLACEHOLDER}
      onChange={onChange}
      listPlacement={listPlacement}
    />
  );
};

type CareersJobFilterFieldsProps = {
  locationFilter?: string;
  departmentFilter?: string;
  experienceFilter?: string;
  onLocationFilterChange?: (value: string) => void;
  onDepartmentFilterChange?: (value: string) => void;
  onExperienceFilterChange?: (value: string) => void;
  listPlacement?: "portaled" | "inline";
};

const CareersJobFilterFields = ({
  locationFilter: locationFilterProp,
  departmentFilter: departmentFilterProp,
  experienceFilter: experienceFilterProp,
  onLocationFilterChange,
  onDepartmentFilterChange,
  onExperienceFilterChange,
  listPlacement,
}: CareersJobFilterFieldsProps = {}) => {
  const {
    cms,
    filterOptions,
    locationFilter: contextLocationFilter,
    departmentFilter: contextDepartmentFilter,
    experienceFilter: contextExperienceFilter,
    setLocationFilter,
    setDepartmentFilter,
    setExperienceFilter,
  } = useCareersJobs();
  const { listing } = cms;

  const locationFilter = locationFilterProp ?? contextLocationFilter;
  const departmentFilter = departmentFilterProp ?? contextDepartmentFilter;
  const experienceFilter = experienceFilterProp ?? contextExperienceFilter;
  const handleLocationFilterChange = onLocationFilterChange ?? setLocationFilter;
  const handleDepartmentFilterChange = onDepartmentFilterChange ?? setDepartmentFilter;
  const handleExperienceFilterChange = onExperienceFilterChange ?? setExperienceFilter;

  if (
    !listing.filterLocationLabel ||
    !listing.filterDepartmentLabel ||
    !listing.filterExperienceLabel
  ) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <FilterField
        id="careers-filter-location"
        label={listing.filterLocationLabel}
        value={locationFilter}
        options={filterOptions.locations}
        onChange={handleLocationFilterChange}
        listPlacement={listPlacement}
      />
      <FilterField
        id="careers-filter-department"
        label={listing.filterDepartmentLabel}
        value={departmentFilter}
        options={filterOptions.departments}
        onChange={handleDepartmentFilterChange}
        listPlacement={listPlacement}
      />
      <FilterField
        id="careers-filter-experience"
        label={listing.filterExperienceLabel}
        value={experienceFilter}
        options={filterOptions.experiences}
        onChange={handleExperienceFilterChange}
        listPlacement={listPlacement}
      />
    </div>
  );
};

export default CareersJobFilterFields;
