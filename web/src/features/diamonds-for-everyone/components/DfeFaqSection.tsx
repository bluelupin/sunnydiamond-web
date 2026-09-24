"use client";

import { Fragment, useState } from "react";
import Reveal from "@/shared/Animation/Reveal";
import { cn } from "@/shared/utils/cn";
import type { NormalizedDfeFaq } from "@/services/diamonds-for-everyone/diamonds-for-everyone-page.types";

const faqPanelTransitionClassName =
  "transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

const faqIconTransitionClassName =
  "transition-opacity duration-300 ease-in-out motion-reduce:transition-none";

const FaqToggleIcon = ({ isOpen, clipId }: { isOpen: boolean; clipId: string }) => (
  <span className="relative inline-flex size-6 shrink-0 items-center justify-center" aria-hidden>
    <span
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        faqIconTransitionClassName,
        isOpen ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-6"
      >
        <path d="M4 12.25H20.5" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12.25 4V20.5" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
    <span
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        faqIconTransitionClassName,
        isOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-6"
      >
        <g clipPath={`url(#${clipId})`}>
          <path d="M17 12H5V11H17V12Z" fill="#0A0A0A" />
        </g>
        <defs>
          <clipPath id={clipId}>
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
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
      <div className="flex flex-col items-center gap-8 md:gap-10">
        <Reveal
          as="h2"
          id="dfe-faq-title"
          direction="up"
          className="text-left font-larken text-32 font-light leading-110 text-darkblack sm:text-3xl md:text-center md:text-4xl lg:text-5xl"
        >
          {faq.title}
        </Reveal>

        <div className="flex w-full max-w-[910px] flex-col gap-4">
          {faq.items.map((item, index) => {
            const isOpen = openId === item.id;
            const panelId = `dfe-faq-panel-${item.id}`;
            const buttonId = `dfe-faq-button-${item.id}`;
            const clipId = `dfe-faq-minus-clip-${item.id}`;

            return (
              <Fragment key={item.id}>
                <div className="flex flex-col overflow-hidden rounded">
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-start gap-2 py-0 text-left lg:min-h-14 lg:items-center"
                  >
                    <span className="min-w-0 flex-1 font-gill text-base font-normal leading-110 text-darkblack md:text-lg lg:text-xl">
                      {item.question}
                    </span>
                    <FaqToggleIcon isOpen={isOpen} clipId={clipId} />
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    aria-hidden={!isOpen}
                    className={cn(
                      "grid min-h-0",
                      faqPanelTransitionClassName,
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="pt-4 font-gill text-sm font-light leading-110 text-neutral500 md:text-lg lg:text-xl">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>

                {index < faq.items.length - 1 ? (
                  <div
                    className="w-full shrink-0 border-t border-neutral300 [border-top-width:0.5px]"
                    aria-hidden
                  />
                ) : null}
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DfeFaqSection;
