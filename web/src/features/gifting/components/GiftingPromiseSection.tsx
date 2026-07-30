"use client";

import Image from "next/image";
import Reveal from "@/shared/Animation/Reveal";
import { giftingPageContent } from "../data/content";

const GiftingPromiseSection = () => {
  const { finishingTouch } = giftingPageContent;

  return (
    <section
      id="the-finishing-touch"
      aria-labelledby="gifting-finishing-title"
      className="bg-gray200 py-16 md:py-100"
    >
      <div className="flex flex-col items-center gap-10">
        <div className="flex max-w-1440 flex-col items-center gap-4 px-4 text-center md:px-10">
          <Reveal
            as="h2"
            id="gifting-finishing-title"
            direction="up"
            className="font-larken text-5xl font-light leading-110 text-darkblack"
          >
            {finishingTouch.title}
          </Reveal>
          <Reveal
            as="p"
            direction="up"
            className="font-gill text-xl font-light leading-110 text-neutral500"
          >
            {finishingTouch.description}
          </Reveal>
        </div>

        <div
          className="relative left-1/2 grid w-screen max-w-none -translate-x-1/2 grid-cols-1 gap-2 md:grid-cols-3"
          role="list"
        >
          {finishingTouch.items.map((item) => (
            <Reveal
              key={item.id}
              direction="up"
              className="flex flex-col items-center gap-4"
              role="listitem"
            >
              <div className="relative h-[320px] w-full md:h-[496px]">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-col items-center gap-3 px-4 text-center text-darkblack">
                <h3 className="font-larken text-xl font-light leading-110">{item.title}</h3>
                <p className="font-gill text-base font-light leading-110">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GiftingPromiseSection;
