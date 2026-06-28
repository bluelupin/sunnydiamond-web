"use client";

import { Fragment, useState } from "react";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import { educationFaqItems } from "../data/content";

const FaqPlusIcon = () => (
  <span className="relative size-6 shrink-0 overflow-hidden" aria-hidden>
    <span className="absolute inset-1/4">
      <svg viewBox="0 0 12 12" fill="none" className="size-full" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M5.5 6.5H0V5.5H5.5V0H6.5V5.5H12V6.5H6.5V12H5.5V6.5Z"
          fill="#0A0A0A"
        />
      </svg>
    </span>
  </span>
);

const FaqMinusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className="size-6 shrink-0"
    aria-hidden
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17 12H5V11H17V12Z" fill="#0A0A0A" />
  </svg>
);

const FaqToggleIcon = ({ isOpen }: { isOpen: boolean }) =>
  isOpen ? <FaqMinusIcon /> : <FaqPlusIcon />;

const EducationFaqSection = () => {
  const [openId, setOpenId] = useState<string | null>("authenticity");

  return (
    <section
      aria-labelledby="education-faq-title"
      className="bg-white px-4 py-16 lg:px-10 lg:py-[104px]"
    >
      <div className="mx-auto flex max-w-[910px] flex-col items-center gap-8 lg:gap-10">
        <ScrollReveal as="h2" delayMs={0} className="w-full">
          <span
            id="education-faq-title"
            className="block w-full text-left font-larken text-[32px] font-light leading-110 text-darkblack lg:text-center lg:text-[48px]"
          >
            Frequently Asked Questions
          </span>
        </ScrollReveal>

        <div className="flex w-full flex-col gap-4">
          {educationFaqItems.map((item, index) => {
            const isOpen = openId === item.id;

            return (
              <Fragment key={item.id}>
                <ScrollReveal delayMs={80 + index * 70}>
                  <div
                    className={
                      isOpen
                        ? "flex flex-col gap-4 overflow-hidden rounded"
                        : "flex flex-col overflow-hidden rounded lg:h-14 lg:justify-center"
                    }
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      className="flex w-full items-start gap-2 text-left lg:items-center"
                    >
                      <span className="min-w-0 flex-1 font-gill text-base font-normal leading-110 text-darkblack lg:text-[20px]">
                        {item.question}
                      </span>
                      <FaqToggleIcon isOpen={isOpen} />
                    </button>

                    {isOpen && item.answer ? (
                      <p className="font-gill text-sm font-light leading-110 text-neutral500 lg:text-[20px]">
                        {item.answer}
                      </p>
                    ) : null}
                  </div>
                </ScrollReveal>

                {index < educationFaqItems.length - 1 ? (
                  <div className="h-[0.5px] bg-neutral300" aria-hidden />
                ) : null}
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EducationFaqSection;
