"use client";

import { Fragment, useState } from "react";
import Reveal from "@/shared/Animation/Reveal";
import { cn } from "@/shared/utils/cn";
import { careersPageContent } from "@/features/careers/data/content";

const faqTransitionClassName =
  "transition-[grid-template-rows,opacity] duration-500 ease-in-out";

const faqIconTransitionClassName = "transition-opacity duration-500 ease-in-out";

const FaqPlusIcon = () => (
  <span className="relative size-6 shrink-0 overflow-hidden" aria-hidden>
    <span className="absolute inset-1/4">
      <svg viewBox="0 0 12 12" fill="none" className="size-full" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 6.5H0V5.5H5.5V0H6.5V5.5H12V6.5H6.5V12H5.5V6.5Z" fill="#0A0A0A" />
      </svg>
    </span>
  </span>
);

const FaqMinusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="size-6 shrink-0" aria-hidden xmlns="http://www.w3.org/2000/svg">
    <path d="M17 12H5V11H17V12Z" fill="#0A0A0A" />
  </svg>
);

const FaqToggleIcon = ({ isOpen }: { isOpen: boolean }) => (
  <span className="relative flex size-6 shrink-0 items-center justify-center" aria-hidden>
    <span
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        faqIconTransitionClassName,
        isOpen ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      <FaqPlusIcon />
    </span>
    <span
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        faqIconTransitionClassName,
        isOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <FaqMinusIcon />
    </span>
  </span>
);

const CareersFaqSection = () => {
  const { faq } = careersPageContent;
  const [openId, setOpenId] = useState<string | null>(faq.items[0]?.id ?? null);

  return (
    <section
      id="careers-faq"
      aria-labelledby="careers-faq-title"
      className="bg-white px-4 py-16 md:px-10 md:py-104"
    >
      <div className="mx-auto flex w-full max-w-[910px] flex-col items-center gap-8 md:gap-10">
        <Reveal
          as="h2"
          id="careers-faq-title"
          direction="up"
          className="w-full text-center font-larken text-32 font-light leading-110 text-darkblack md:text-5xl"
        >
          {faq.title}
        </Reveal>

        <div className="flex w-full flex-col gap-4">
          {faq.items.map((item, index) => {
            const isOpen = openId === item.id;

            return (
              <Fragment key={item.id}>
                <Reveal direction="up" delay={index * 0.05}>
                  <div
                    className={cn(
                      "flex flex-col overflow-hidden rounded",
                      isOpen ? "gap-4" : "min-h-14 justify-center py-6",
                    )}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      className="flex w-full items-center gap-2 text-left"
                    >
                      <span className="min-w-0 flex-1 font-gill text-base font-normal leading-110 text-darkblack md:text-xl">
                        {item.question}
                      </span>
                      <FaqToggleIcon isOpen={isOpen} />
                    </button>

                    <div
                      className={cn(
                        "grid min-h-0",
                        faqTransitionClassName,
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                      aria-hidden={!isOpen}
                    >
                      <div className="overflow-hidden">
                        <p className="font-gill text-base font-light leading-110 text-neutral500 md:text-xl">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>

                {index < faq.items.length - 1 ? (
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

export default CareersFaqSection;
