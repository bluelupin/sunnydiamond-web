"use client";

import { useState } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import Reveal from "@/shared/Animation/Reveal";
import { cn } from "@/shared/utils/cn";
import type { NormalizedCareerBenefitsSection } from "@/services/careers/careers.types";

type CareersBenefitsSectionProps = {
  benefits: NormalizedCareerBenefitsSection;
};

const CareersBenefitsSection = ({ benefits }: CareersBenefitsSectionProps) => {
  const [activeId, setActiveId] = useState(benefits.items[0]?.id ?? "");

  return (
    <section
      id="employee-benefits"
      aria-labelledby="careers-benefits-title"
      className="bg-white px-4 py-16 md:px-10 md:py-104"
    >
      <div className="flex w-full flex-col gap-2.5 md:gap-10">
        <div className="flex w-full flex-col gap-8 md:gap-10">
          <Reveal
            as="h2"
            id="careers-benefits-title"
            direction="up"
            className="w-full text-center font-larken text-32 font-light leading-110 text-darkblack md:text-left md:text-5xl"
          >
            {benefits.title}
          </Reveal>

          <div className="flex w-full flex-col md:h-[346px] md:flex-row md:gap-6">
            <div
              className="flex w-full flex-col md:w-[593px] md:shrink-0 md:self-stretch md:border-r md:border-r-[0.5px] md:border-neutral300"
            >
              {benefits.items.map((item) => {
                const isActive = item.id === activeId;

                return (
                  <Reveal key={item.id} direction="up" className="w-full">
                    <button
                      type="button"
                      onClick={() => setActiveId(item.id)}
                      className={cn(
                        "flex w-full text-left transition-colors",
                        isActive
                          ? "flex-col gap-4 bg-gray300 px-4 py-6 md:px-10 md:py-8"
                          : "flex-row items-center px-4 py-6 md:pl-10 md:pr-6 md:py-8",
                      )}
                      aria-expanded={isActive}
                    >
                      <span className="font-larken text-xl font-light leading-110 text-darkblack md:text-2xl">
                        {item.label}
                      </span>
                      {isActive ? (
                        <>
                          <span className="h-px w-full bg-neutral300" aria-hidden />
                          <span className="w-full font-gill text-sm font-light leading-110 text-neutral500 md:max-w-[513px] md:text-xl md:text-darkblack">
                            {item.description}
                          </span>
                        </>
                      ) : null}
                    </button>
                  </Reveal>
                );
              })}
            </div>

            {benefits.image ? (
              <Reveal
                direction="up"
                className="relative hidden h-full min-h-0 flex-1 overflow-hidden md:block"
              >
                <ResponsiveImage
                  desktopSrc={benefits.image.desktopUrl}
                  mobileSrc={benefits.image.mobileUrl}
                  alt={benefits.image.alt}
                  width={1025}
                  height={346}
                  className="size-full object-cover object-center"
                />
              </Reveal>
            ) : null}
          </div>
        </div>

        {benefits.image ? (
          <Reveal
            direction="up"
            className="relative aspect-[2500/1797] w-full overflow-hidden md:hidden"
          >
            <ResponsiveImage
              desktopSrc={benefits.image.desktopUrl}
              mobileSrc={benefits.image.mobileUrl}
              alt={benefits.image.alt}
              width={1025}
              height={737}
              className="size-full object-cover object-center"
            />
          </Reveal>
        ) : null}
      </div>
    </section>
  );
};

export default CareersBenefitsSection;
