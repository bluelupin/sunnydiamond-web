"use client";

import Link from "next/link";
import Reveal from "@/shared/Animation/Reveal";
import { resolveImageSrcString } from "@/shared/utils/image";
import { giftingPageContent } from "../data/content";

const PROMISE_VIDEO_MP4 = "/videos/handcrafted-bg.mp4";
const PROMISE_POSTER = "/images/about/handcrafted-bg.webp";

const GiftingPromiseSection = () => {
  const { promise } = giftingPageContent;

  return (
    <section
      id="sunnys-promise"
      aria-labelledby="gifting-promise-title"
      className="flex flex-col items-center gap-8 bg-white px-4 py-16 lg:gap-10 lg:px-10 lg:py-100"
    >
      <Reveal
        as="h2"
        id="gifting-promise-title"
        direction="up"
        className="text-center font-larken text-32 font-light leading-110 text-darkblack md:text-4xl lg:text-5xl lg:whitespace-nowrap"
      >
        {promise.title}
      </Reveal>

      <Reveal direction="up" className="relative h-[400px] w-full max-w-[1360px] shrink-0 overflow-hidden md:h-[560px] lg:h-[700px]">
        <video
          className="absolute inset-0 size-full object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={resolveImageSrcString(PROMISE_POSTER)}
          aria-hidden
          tabIndex={-1}
        >
          <source src={PROMISE_VIDEO_MP4} type="video/mp4" />
        </video>
      </Reveal>

      <div className="flex w-full flex-col items-center gap-6 lg:gap-6">
        <Reveal
          direction="up"
          className="max-w-[480px] text-center font-gill text-base font-light leading-110 text-neutral500 md:text-xl"
        >
          {promise.description}
        </Reveal>
        <Reveal direction="up">
          <Link
            href={promise.cta.href}
            className="relative cursor-pointer border-b-[1.5px] border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-darkMagenta after:transition-all after:duration-300 hover:border-darkMagenta hover:text-darkMagenta hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0a0a] focus-visible:ring-offset-2"
          >
            {promise.cta.label}
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default GiftingPromiseSection;
