"use client";

import { cn } from "@/shared/utils/cn";
import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import { careersFormSelectChevronClassName } from "@/features/careers/constants/careersApplicationForm";
import CareersChevronDownIcon from "./CareersChevronDownIcon";

type FilterFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
};

const FilterField = ({ label, value, placeholder, options, onChange }: FilterFieldProps) => (
  <div className="flex h-[82px] flex-col justify-between">
    <span className="font-gill text-base font-normal leading-110 text-[#2B2B2B]">{label}</span>
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-14 w-full appearance-none bg-[#F2F2F2] p-3 pr-10 font-gill text-base font-normal leading-110 text-darkblack",
          !value && "text-gray600",
        )}
        aria-label={label}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <CareersChevronDownIcon className={careersFormSelectChevronClassName} />
    </div>
  </div>
);

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
    !listing.filterExperienceLabel ||
    !listing.filterSelectPlaceholder
  ) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <FilterField
        label={listing.filterLocationLabel}
        value={locationFilter}
        placeholder={listing.filterSelectPlaceholder}
        options={filterOptions.locations}
        onChange={setLocationFilter}
      />
      <FilterField
        label={listing.filterDepartmentLabel}
        value={departmentFilter}
        placeholder={listing.filterSelectPlaceholder}
        options={filterOptions.departments}
        onChange={setDepartmentFilter}
      />
      <FilterField
        label={listing.filterExperienceLabel}
        value={experienceFilter}
        placeholder={listing.filterSelectPlaceholder}
        options={filterOptions.experiences}
        onChange={setExperienceFilter}
      />
    </div>
  );
};

export default CareersJobFilterFields;
