"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { educationFaqItems } from "../data/content";

const EducationFaqSection = () => {
  const [openId, setOpenId] = useState<string | null>("authenticity");

  return (
    <section
      aria-labelledby="education-faq-title"
      className="bg-white px-4 py-16 lg:px-10 lg:py-[104px]"
    >
      <div className="mx-auto flex max-w-[910px] flex-col items-center gap-10">
        <h2
          id="education-faq-title"
          className="text-center font-larken text-[32px] font-light leading-110 text-darkblack lg:text-[48px]"
        >
          Frequently Asked Questions
        </h2>

        <div className="flex w-full flex-col gap-4">
          {educationFaqItems.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div key={item.id} className="flex flex-col gap-4">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex min-h-14 w-full items-center justify-between gap-2 py-6 text-left lg:py-6"
                >
                  <span className="flex-1 font-gill text-base leading-110 text-darkblack lg:text-[20px]">
                    {item.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp size={24} strokeWidth={1.25} aria-hidden className="shrink-0 lg:hidden" />
                  ) : (
                    <Plus size={24} strokeWidth={1.5} aria-hidden className="shrink-0 lg:hidden" />
                  )}
                  {isOpen ? (
                    <ChevronUp size={24} strokeWidth={1.25} aria-hidden className="hidden shrink-0 lg:block" />
                  ) : (
                    <ChevronDown size={24} strokeWidth={1.25} aria-hidden className="hidden shrink-0 lg:block" />
                  )}
                </button>

                {isOpen && item.answer ? (
                  <p className="pb-2 font-gill text-base font-light leading-110 text-neutral500 lg:text-[20px]">
                    {item.answer}
                  </p>
                ) : null}

                <div className="h-px bg-neutral300" aria-hidden />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EducationFaqSection;
