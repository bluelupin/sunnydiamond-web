"use client";

import { X } from "lucide-react";
import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/ui/drawer";
import CareersJobFilterFields from "./CareersJobFilterFields";
import CareersJobFiltersHeader from "./CareersJobFiltersHeader";

type CareersJobFiltersDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CareersJobFiltersDrawer = ({ open, onOpenChange }: CareersJobFiltersDrawerProps) => {
  const { cms } = useCareersJobs();
  const { filtersTitle, closeFiltersLabel } = cms.listing;

  if (!filtersTitle) {
    return null;
  }

  const closeLabel = closeFiltersLabel ?? filtersTitle;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} shouldScaleBackground={false}>
      <DrawerContent className="z-[80] flex max-h-[90vh] min-h-0 flex-col overflow-hidden rounded-none border-0 bg-gray200 p-0 [&>div:first-child]:hidden">
        <DrawerTitle className="sr-only">{filtersTitle}</DrawerTitle>
        <div className="flex flex-col gap-6 p-6">
          <CareersJobFiltersHeader
            title={filtersTitle}
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
          <CareersJobFilterFields />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CareersJobFiltersDrawer;
