"use client";

import { Fragment } from "react";
import Image from "next/image";
import Reveal from "@/shared/Animation/Reveal";
import { careersPageContent } from "../data/content";

const CareersBenefitsSection = () => {
  const { benefits } = careersPageContent;

  return (
    <section
      id="employee-benefits"
      aria-labelledby="careers-benefits-title"
      className="bg-gray200 px-4 py-16 md:px-10 md:py-100"
    >
      <div className="mx-auto flex w-full max-w-1360 flex-col gap-10">
        <div className="flex max-w-[640px] flex-col gap-4 text-center md:mx-auto">
          <Reveal
            as="h2"
            id="careers-benefits-title"
            direction="up"
            className="font-larken text-32 font-light leading-110 text-darkblack md:text-4xl lg:text-5xl"
          >
            {benefits.title}
          </Reveal>
          <Reveal
            as="p"
            direction="up"
            className="font-gill text-base font-light leading-110 text-neutral500 md:text-lg lg:text-xl"
          >
            {benefits.description}
          </Reveal>
        </div>

        <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-4">
          {benefits.items.map((item) => (
            <Fragment key={item.id}>
              <Reveal
                as="li"
                direction="up"
                className="flex flex-col items-center gap-4 border border-neutral300 bg-white p-6 text-center"
              >
                <div className="flex size-16 items-center justify-center">
                  <Image src={item.iconSrc} alt="" width={64} height={64} className="size-full" aria-hidden />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-gill text-lg font-normal leading-110 text-darkblack md:text-xl">
                    {item.label}
                  </p>
                  <p className="font-gill text-sm font-light leading-110 text-neutral500 md:text-base">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            </Fragment>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CareersBenefitsSection;
