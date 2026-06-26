"use client";

import { Fragment, useState } from "react";
import Image from "next/image";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import { educationFaqItems, educationPageImages } from "../data/content";

const FaqToggleIcon = ({ isOpen }: { isOpen: boolean }) => (
  <Image
    src={isOpen ? educationPageImages.faqIconMinus : educationPageImages.faqIconPlus}
    alt=""
    width={24}
    height={24}
    aria-hidden
    className="shrink-0"
  />
);

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
