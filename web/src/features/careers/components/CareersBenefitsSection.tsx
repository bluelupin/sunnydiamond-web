"use client";

import { useMemo, useState } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import Reveal from "@/shared/Animation/Reveal";
import { cn } from "@/shared/utils/cn";
import type { NormalizedCareerBenefitsSection } from "@/services/careers/careers.types";

type CareersBenefitsSectionProps = {
  benefits: NormalizedCareerBenefitsSection;
};

const CareersBenefitsSection = ({ benefits }: CareersBenefitsSectionProps) => {
  const [activeId, setActiveId] = useState(benefits.items[0]?.id ?? "");

  const activeImage = useMemo(() => {
    const activeItem =
      benefits.items.find((item) => item.id === activeId) ?? benefits.items[0];

    return activeItem?.image ?? benefits.image;
  }, [activeId, benefits.image, benefits.items]);

  return (
    <section
      id="employee-benefits"
      aria-labelledby="careers-benefits-title"
      className="bg-white md:py-16 md:py-104 md:mb-0 mb-16"
    >
      <div className="flex w-full flex-col gap-8 md:gap-10">
        <Reveal
          as="h2"
          id="careers-benefits-title"
          direction="up"
          className="2xl:px-[60px] lg:px-10 px-8 w-full font-larken text-32 font-light leading-110 text-darkblack md:text-5xl"
        >
          {benefits.title}
        </Reveal>
        <div className="flex w-full flex-col md:min-h-[346px] md:flex-row lg:gap-6 md:gap-4 gap-4 md:px-0 px-4">
          <div
            className="flex w-full flex-col xl:w-[593px] lg:w-[493px] md:w-[393px] md:shrink-0 md:self-stretch md:border-r md:border-r-[0.5px] md:border-neutral300"
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
                        ? "flex-col gap-4 bg-gray300 px-4 py-6 md:px-8 lg:px-10 md:py-8"
                        : "flex-row items-center px-4 md:py-6 py-4 md:pl-8 lg:pl-10 md:pr-6 md:py-8",
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
          {activeImage &&
            <Reveal
              direction="up"
              className="relative w-full overflow-hidden md:flex-1"
            >
              <ResponsiveImage
                key={activeImage.desktopUrl}
                desktopSrc={activeImage.desktopUrl}
                mobileSrc={activeImage.mobileUrl}
                alt={activeImage.alt}
                width={activeImage.width ?? 1025}
                height={activeImage.height ?? 737}
                className="size-full object-cover object-center"
              />
            </Reveal>
          }
        </div>
      </div>
    </section>
  );
};

export default CareersBenefitsSection;
