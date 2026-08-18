"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import {
  CAREERS_FILTER_APPLY_LABEL,
  CAREERS_FILTER_CLEAR_ALL_LABEL,
} from "@/features/careers/constants/careersListing";
import {
  careersDarkCtaClassName,
  careersOutlineCtaClassName,
} from "@/features/careers/constants/careersCtaStyles";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/ui/drawer";
import { PanelFooter, PanelFooterDualActions } from "@/shared/ui/PanelFooter";
import { cn } from "@/shared/utils/cn";
import CareersJobFilterFields from "./CareersJobFilterFields";
import CareersJobFiltersHeader from "./CareersJobFiltersHeader";

type CareersJobFiltersDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type FilterDraft = {
  location: string;
  department: string;
  experience: string;
};

const createEmptyFilterDraft = (): FilterDraft => ({
  location: "",
  department: "",
  experience: "",
});

const CareersJobFiltersDrawer = ({ open, onOpenChange }: CareersJobFiltersDrawerProps) => {
  const {
    cms,
    locationFilter,
    departmentFilter,
    experienceFilter,
    setLocationFilter,
    setDepartmentFilter,
    setExperienceFilter,
  } = useCareersJobs();
  const { filtersTitle, closeFiltersLabel } = cms.listing;
  const [draft, setDraft] = useState<FilterDraft>(createEmptyFilterDraft);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const justOpened = open && !wasOpenRef.current;

    if (justOpened) {
      setDraft({
        location: locationFilter,
        department: departmentFilter,
        experience: experienceFilter,
      });
    }

    wasOpenRef.current = open;
  }, [open, locationFilter, departmentFilter, experienceFilter]);

  if (!filtersTitle) {
    return null;
  }

  const closeLabel = closeFiltersLabel ?? filtersTitle;

  const applyDraft = () => {
    setLocationFilter(draft.location);
    setDepartmentFilter(draft.department);
    setExperienceFilter(draft.experience);
    onOpenChange(false);
  };

  const handleClearAll = () => {
    const cleared = createEmptyFilterDraft();
    setDraft(cleared);
    setLocationFilter(cleared.location);
    setDepartmentFilter(cleared.department);
    setExperienceFilter(cleared.experience);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} shouldScaleBackground={false}>
      <DrawerContent className="z-[80] flex max-h-[90vh] min-h-0 flex-col overflow-hidden rounded-none border-0 bg-gray200 p-0 [&>div:first-child]:hidden">
        <DrawerTitle className="sr-only">{filtersTitle}</DrawerTitle>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="flex flex-col gap-6 p-6">
            <CareersJobFiltersHeader
              title={filtersTitle}
              showClearAction={false}
              trailing={
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="inline-flex size-6 shrink-0 items-center justify-center text-darkblack transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
                  aria-label={closeLabel}
                >
                  <X className="size-6" strokeWidth={1.5} aria-hidden />
                </button>
              }
            />
            <span className="h-px w-full bg-neutral300" aria-hidden />
            <CareersJobFilterFields
              locationFilter={draft.location}
              departmentFilter={draft.department}
              experienceFilter={draft.experience}
              onLocationFilterChange={(value) =>
                setDraft((current) => ({ ...current, location: value }))
              }
              onDepartmentFilterChange={(value) =>
                setDraft((current) => ({ ...current, department: value }))
              }
              onExperienceFilterChange={(value) =>
                setDraft((current) => ({ ...current, experience: value }))
              }
            />
          </div>
        </div>

        <PanelFooter
          showGradient={false}
          contentClassName="border-t border-neutral300 bg-gray200 px-6 py-6"
        >
          <PanelFooterDualActions>
            <button
              type="button"
              onClick={handleClearAll}
              className={cn(careersOutlineCtaClassName, "min-w-0 flex-1")}
            >
              <span className="relative z-10">{CAREERS_FILTER_CLEAR_ALL_LABEL}</span>
            </button>
            <button
              type="button"
              onClick={applyDraft}
              className={cn(careersDarkCtaClassName, "min-w-0 flex-1")}
            >
              <span className="relative z-10">{CAREERS_FILTER_APPLY_LABEL}</span>
            </button>
          </PanelFooterDualActions>
        </PanelFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CareersJobFiltersDrawer;
