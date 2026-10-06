"use client";

import { useState } from "react";
import type { NormalizedEducationDiscoverStep } from "@/services/education/learn-about-diamonds-page.types";
import EducationDiscoverJourneyPanel from "./EducationDiscoverJourneyPanel";

type EducationDiscoverJourneyCtaProps = {
  label: string;
  steps?: NormalizedEducationDiscoverStep[];
};

const EducationDiscoverJourneyCta = ({ label, steps = [] }: EducationDiscoverJourneyCtaProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:inline-flex max-md:!absolute btn-border-slide h-14 min-w-[199px] shrink-0 items-center justify-center whitespace-nowrap border border-neutral300 bg-transparent px-7 py-5 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
      >
        <span className="relative z-[1]">{label}</span>
      </button>

      <EducationDiscoverJourneyPanel
        open={open}
        onClose={() => setOpen(false)}
        steps={steps}
      />
    </>
  );
};

export default EducationDiscoverJourneyCta;
