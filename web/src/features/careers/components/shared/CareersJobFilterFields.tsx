"use client";

import { appointmentLabelClassName } from "@/shared/constants/appointmentForm";
import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

/** Radix Select does not allow empty string values — maps cleared filter to this sentinel. */
const FILTER_ALL_VALUE = "__careers_filter_all__";

/** Matches MetalEngravingPanel font dropdown trigger styling. */
const engravingSelectTriggerClassName =
  "h-14 rounded-none border-0 bg-aboutInactive px-3 font-gill text-base text-darkblack focus:ring-0";

type FilterFieldProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
};

const FilterField = ({ id, label, value, placeholder, options, onChange }: FilterFieldProps) => {
  const selectPlaceholder = placeholder.trim() || "-select-";

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={appointmentLabelClassName}>
        {label}
      </label>
      <Select
        value={value || FILTER_ALL_VALUE}
        onValueChange={(next) => onChange(next === FILTER_ALL_VALUE ? "" : next)}
      >
        <SelectTrigger id={id} className={engravingSelectTriggerClassName}>
          <SelectValue placeholder={selectPlaceholder} />
        </SelectTrigger>
        <SelectContent className="z-[80]">
          <SelectItem value={FILTER_ALL_VALUE}>{selectPlaceholder}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
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
