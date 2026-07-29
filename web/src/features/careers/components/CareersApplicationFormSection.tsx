"use client";

import Reveal from "@/shared/Animation/Reveal";
import CareersApplicationForm from "./shared/CareersApplicationForm";

const CareersApplicationFormSection = () => {
  return (
    <section
      id="application-form"
      aria-labelledby="careers-application-title"
      className="bg-white px-4 pb-10 pt-[calc(4.5rem+env(safe-area-inset-top,0px)+2.5rem)] md:px-100 md:landscape:pb-104 md:landscape:pt-[144px]"
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
