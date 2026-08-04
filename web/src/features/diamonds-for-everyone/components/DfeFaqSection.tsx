"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "@/shared/Animation/Reveal";
import type { NormalizedDfeFaq } from "@/services/diamonds-for-everyone/diamonds-for-everyone-page.types";

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
      <div className="flex flex-col items-center gap-10">
        <Reveal
          as="h2"
          id="dfe-faq-title"
          direction="up"
          className="text-center font-larken text-32 font-light leading-110 text-darkblack md:text-5xl"
        >
          {faq.title}
        </Reveal>

        <div className="w-full max-w-[910px]">
          {faq.items.map((item, index) => {
            const isOpen = openId === item.id;

            return (
              <div key={item.id} className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-2 py-6 text-left md:py-0 md:min-h-14"
                >
                  <span className="min-w-0 flex-1 font-gill text-xl font-normal leading-110 text-darkblack">
                    {item.question}
                  </span>
                  <span className="inline-flex size-6 shrink-0 items-center justify-center" aria-hidden>
                    <Image
                      src={
                        isOpen
                          ? "/images/diamonds-for-everyone/icon-accordion-minus.svg"
                          : "/images/cms/icon-accordion-plus.svg"
                      }
                      alt=""
                      width={17}
                      height={17}
                      className="size-[17px]"
                    />
                  </span>
                </button>
                {isOpen ? (
                  <p className="font-gill text-xl font-light leading-110 text-neutral500">
                    {item.answer}
                  </p>
                ) : null}
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
