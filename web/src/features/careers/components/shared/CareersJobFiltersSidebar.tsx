"use client";

import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import CareersJobFilterFields from "./CareersJobFilterFields";
import CareersJobFiltersHeader from "./CareersJobFiltersHeader";

const CareersJobFiltersSidebar = () => {
  const { cms } = useCareersJobs();
  const filtersTitle = cms.listing.filtersTitle;

  if (!filtersTitle) {
    return null;
  }

  return (
    <aside className="hidden h-fit w-full shrink-0 self-start bg-gray200 lg:sticky lg:top-28 lg:block lg:max-h-[calc(100dvh-7rem)] lg:w-[437px] lg:overflow-y-auto">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-6">
          <CareersJobFiltersHeader title={filtersTitle} />
          <span className="h-px w-full bg-neutral300" aria-hidden />
        </div>

        <CareersJobFilterFields />
      </div>
    </aside>
  );
};

export default CareersJobFiltersSidebar;
