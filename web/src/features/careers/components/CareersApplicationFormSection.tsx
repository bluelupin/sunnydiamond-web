"use client";

import Reveal from "@/shared/Animation/Reveal";
import CareersApplicationForm from "./shared/CareersApplicationForm";

const CareersApplicationFormSection = () => {
  return (
    <section
      id="application-form"
      aria-labelledby="careers-application-title"
      className="bg-white pt-10 pb-100 max-w-[1240px] px-4 mx-auto"
    >
      <div className="flex w-full flex-col gap-10">
        <Reveal direction="up">
          <CareersApplicationForm />
        </Reveal>
      </div>
    </section>
  );
};

export default CareersApplicationFormSection;
