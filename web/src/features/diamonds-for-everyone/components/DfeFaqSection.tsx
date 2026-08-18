"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "@/shared/Animation/Reveal";
import { cn } from "@/shared/utils/cn";
import type { NormalizedDfeFaq } from "@/services/diamonds-for-everyone/diamonds-for-everyone-page.types";

const faqTransitionClassName =
  "transition-[grid-template-rows,opacity] duration-500 ease-in-out";

const faqIconTransitionClassName = "transition-opacity duration-500 ease-in-out";

const FaqToggleIcon = ({ isOpen }: { isOpen: boolean }) => (
  <span className="relative inline-flex size-6 shrink-0 items-center justify-center" aria-hidden>
    <span
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        faqIconTransitionClassName,
        isOpen ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      <Image
        src="/images/cms/icon-accordion-plus.svg"
        alt=""
        width={17}
        height={17}
        className="size-[17px]"
      />
    </span>
    <span
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        faqIconTransitionClassName,
        isOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <Image
        src="/images/diamonds-for-everyone/icon-accordion-minus.svg"
        alt=""
        width={17}
        height={17}
        className="size-[17px]"
      />
    </span>
  </span>
);

type DfeFaqSectionProps = {
  faq: NormalizedDfeFaq;
};

const DfeFaqSection = ({ faq }: DfeFaqSectionProps) => {
  const [openId, setOpenId] = useState<string | null>(faq.items[0]?.id ?? null);

  return (
    <section
      aria-labelledby="dfe-faq-title"
      className="mx-auto max-w-[1440px] px-4 py-16 md:px-10 md:py-[104px]"
    >
      <div className="flex flex-col items-center lg:gap-10 md:gap-8 gap-6">
        <Reveal
          as="h2"
          id="dfe-faq-title"
          direction="up"
          className="md:text-center text-left font-larken text-32 font-light leading-110 text-darkblack lg:text-5xl md:text-4xl sm:text-3xl"
        >
          {faq.title}
        </Reveal>

        <div className="w-full max-w-[910px]">
          {faq.items.map((item, index) => {
            const isOpen = openId === item.id;
            const panelId = `dfe-faq-panel-${item.id}`;
            const buttonId = `dfe-faq-button-${item.id}`;

            return (
              <div key={item.id} className="flex flex-col gap-4 mt-[18px]">
                <div
                  className={cn(
                    "flex flex-col overflow-hidden",
                    isOpen && "gap-4 pb-4",
                  )}
                >
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center gap-2 text-left md:min-h-auto py-0"
                  >
                    <span className="min-w-0 flex-1 font-gill lg:text-xl md:text-lg sm:text-base font-normal leading-110 text-darkblack">
                      {item.question}
                    </span>
                    <FaqToggleIcon isOpen={isOpen} />
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={cn(
                      "grid min-h-0",
                      faqTransitionClassName,
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                    aria-hidden={!isOpen}
                  >
                    <div className="overflow-hidden">
                      <p className="font-gill lg:text-xl md:text-lg sm:text-sm font-light leading-110 text-neutral500">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>

                {index < faq.items.length - 1 ? (
                  <div className="h-px w-full bg-neutral300" aria-hidden />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DfeFaqSection;
