"use client";

import { useState } from "react";
import EducationDiscoverJourneyPanel from "./EducationDiscoverJourneyPanel";

type EducationDiscoverJourneyCtaProps = {
  label: string;
};

const EducationDiscoverJourneyCta = ({ label }: EducationDiscoverJourneyCtaProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-border-slide inline-flex h-14 min-w-[199px] shrink-0 items-center justify-center whitespace-nowrap border border-neutral300 bg-transparent px-7 py-5 font-gill text-sm font-normal uppercase leading-110 text-darkblack"
      >
        <span className="relative z-[1]">{label}</span>
      </button>

      <EducationDiscoverJourneyPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default EducationDiscoverJourneyCta;
