"use client";

import { appointmentLabelClassName } from "@/shared/constants/appointmentForm";
import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import CareersSelectField from "./CareersSelectField";

type FilterFieldProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
};

const FilterField = ({ id, label, value, placeholder, options, onChange }: FilterFieldProps) => {
  return (
    <CareersSelectField
      id={id}
      label={label}
      value={value}
      placeholder={placeholder.trim() || "-select-"}
      options={options}
      onChange={onChange}
      labelClassName={appointmentLabelClassName}
    />
  );
};

const CareersJobFilterFields = () => {
  const {
    cms,
    filterOptions,
    locationFilter,
    departmentFilter,
    experienceFilter,
    setLocationFilter,
    setDepartmentFilter,
    setExperienceFilter,
  } = useCareersJobs();
  const { listing } = cms;

  if (
    !listing.filterLocationLabel ||
    !listing.filterDepartmentLabel ||
    !listing.filterExperienceLabel
  ) {
    return null;
  }

  const selectPlaceholder = listing.filterSelectPlaceholder ?? "";

  return (
    <div className="flex flex-col gap-4">
      <FilterField
        id="careers-filter-location"
        label={listing.filterLocationLabel}
        value={locationFilter}
        placeholder={selectPlaceholder}
        options={filterOptions.locations}
        onChange={setLocationFilter}
      />
      <FilterField
        id="careers-filter-department"
        label={listing.filterDepartmentLabel}
        value={departmentFilter}
        placeholder={selectPlaceholder}
        options={filterOptions.departments}
        onChange={setDepartmentFilter}
      />
      <FilterField
        id="careers-filter-experience"
        label={listing.filterExperienceLabel}
        value={experienceFilter}
        placeholder={selectPlaceholder}
        options={filterOptions.experiences}
        onChange={setExperienceFilter}
      />
    </div>
  );
};

export default CareersJobFilterFields;
