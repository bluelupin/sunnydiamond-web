"use client";

import { useCareersJobs } from "@/features/careers/context/CareersJobsContext";
import CareersJobFilterFields from "./CareersJobFilterFields";

const CareersJobFiltersSidebar = () => {
  const { cms } = useCareersJobs();
  const filtersTitle = cms.listing.filtersTitle;

  if (!filtersTitle) {
    return null;
  }

  return (
    <aside className="w-full shrink-0 bg-gray200 lg:w-[437px]">
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-6">
          <h3 className="font-larken text-2xl font-light leading-110 text-darkblack">
            {filtersTitle}
          </h3>
          <span className="h-px w-full bg-neutral300" aria-hidden />
        </div>

        <CareersJobFilterFields />
      </div>
    </aside>
  );
};

export default CareersJobFiltersSidebar;
