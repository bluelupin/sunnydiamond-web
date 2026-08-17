"use client";

import { appointmentLabelClassName } from "@/shared/constants/appointmentForm";
import { CAREERS_FILTER_ALL_LABEL } from "@/features/careers/constants/careersListing";
import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import CareersSelectField from "./CareersSelectField";

type FilterFieldProps = {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

const FilterField = ({ id, label, value, options, onChange }: FilterFieldProps) => {
  return (
    <CareersSelectField
      id={id}
      label={label}
      value={value}
      placeholder={CAREERS_FILTER_ALL_LABEL}
      options={options}
      onChange={onChange}
      labelClassName={appointmentLabelClassName}
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
};

const CareersJobFilterFields = ({
  locationFilter: locationFilterProp,
  departmentFilter: departmentFilterProp,
  experienceFilter: experienceFilterProp,
  onLocationFilterChange,
  onDepartmentFilterChange,
  onExperienceFilterChange,
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
      />
      <FilterField
        id="careers-filter-department"
        label={listing.filterDepartmentLabel}
        value={departmentFilter}
        options={filterOptions.departments}
        onChange={handleDepartmentFilterChange}
      />
      <FilterField
        id="careers-filter-experience"
        label={listing.filterExperienceLabel}
        value={experienceFilter}
        options={filterOptions.experiences}
        onChange={handleExperienceFilterChange}
      />
    </div>
  );
};

export default CareersJobFilterFields;
