"use client";

import { Fragment, useState } from "react";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import { cn } from "@/shared/utils/cn";
import type { NormalizedSupportFaqSection } from "@/services/support/support-page.types";

const faqTransitionClassName =
  "transition-[grid-template-rows,opacity] duration-500 ease-in-out";

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

type SupportFaqSectionProps = {
  faq: NormalizedSupportFaqSection;
};

const SupportFaqSection = ({ faq }: SupportFaqSectionProps) => {
  const [openId, setOpenId] = useState<string | null>(faq.items[0]?.id ?? null);

  if (faq.items.length === 0) return null;

  return (
    <section
      aria-labelledby={faq.title ? "support-faq-title" : undefined}
      aria-label={faq.title ? undefined : "Frequently asked questions"}
      className="bg-white px-4 pb-16 md:px-8 lg:px-10 lg:pb-100"
    >
      <div className="mx-auto flex max-w-[910px] flex-col items-center">
        {faq.title ? (
          <ScrollReveal delayMs={0} className="mb-8 w-full md:mb-10">
            <h2
              id="support-faq-title"
              className="w-full text-left font-larken text-32 font-light leading-110 text-darkblack md:text-4xl lg:text-center lg:text-5xl"
            >
              {faq.title}
            </h2>
          </ScrollReveal>
        ) : null}

        <div className="w-full border-t border-neutral300">
          {faq.items.map((item) => {
            const isOpen = openId === item.id;
            const panelId = `support-faq-panel-${item.id}`;
            const buttonId = `support-faq-button-${item.id}`;

            return (
              <Fragment key={item.id}>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex w-full items-start justify-between gap-4 py-5 text-left"
                >
                  <span className="font-gill text-base font-normal leading-110 text-darkblack md:text-lg">
                    {item.question}
                  </span>
                  <span className="relative mt-0.5 flex size-6 shrink-0 items-center justify-center" aria-hidden>
                    <span
                      className={cn(
                        "absolute inset-0 flex items-center justify-center transition-opacity duration-500",
                        isOpen ? "pointer-events-none opacity-0" : "opacity-100",
                      )}
                    >
                      <FaqPlusIcon />
                    </span>
                    <span
                      className={cn(
                        "absolute inset-0 flex items-center justify-center transition-opacity duration-500",
                        isOpen ? "opacity-100" : "pointer-events-none opacity-0",
                      )}
                    >
                      <FaqMinusIcon />
                    </span>
                  </span>
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={cn("grid", faqTransitionClassName, isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 font-gill text-base font-light leading-110 text-neutral500 md:text-lg">
                      {item.answer}
                    </p>
                  </div>
                </div>
                <div className="h-px w-full bg-neutral300" aria-hidden />
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SupportFaqSection;
