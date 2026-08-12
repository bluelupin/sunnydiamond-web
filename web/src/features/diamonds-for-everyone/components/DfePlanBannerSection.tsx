"use client";

import Image from "next/image";
import Reveal from "@/shared/Animation/Reveal";
import type { NormalizedDfePlanIntro } from "@/services/diamonds-for-everyone/diamonds-for-everyone-page.types";

/** Figma 1052:66760 — radial fade from Chalk Beige/200 to Chalk Beige/100 */
const PLAN_BANNER_GRADIENT =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 1440 343' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(84.95 -27.622 -20.662 18.442 305 387.88)'><stop stop-color='rgba(244,243,238,0)' offset='0'/><stop stop-color='rgba(251,250,246,1)' offset='1'/></radialGradient></defs></svg>\")";

type DfePlanBannerSectionProps = {
  planIntro: NormalizedDfePlanIntro;
};

const DfePlanBannerSection = ({ planIntro }: DfePlanBannerSectionProps) => {
  return (
    <section aria-labelledby="dfe-plan-banner-title" className="relative w-full overflow-hidden">
      <div className="relative px-4 py-16 md:py-[104px]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {planIntro.image ? (
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={planIntro.image.desktopUrl}
                alt={planIntro.image.alt}
                width={1440}
                height={750}
                sizes="100vw"
                className="absolute left-[-0.03%] top-[-25.8%] h-[218.07%] max-w-none w-full"
              />
            </div>
          ) : null}
          <div
            className="absolute inset-0"
            style={{ backgroundImage: PLAN_BANNER_GRADIENT, backgroundSize: "100% 100%" }}
          />
        </div>

        <div
          className="relative mx-auto flex w-full max-w-[528px] flex-col items-center gap-4 text-center leading-110 text-darkblack"
        >
          <Reveal
            as="h2"
            id="dfe-plan-banner-title"
            direction="up"
            className="font-larken text-32 font-light md:text-5xl md:whitespace-nowrap"
          >
            {planIntro.title}
          </Reveal>
          {planIntro.description ? (
            <Reveal
              as="p"
              direction="up"
              className="w-full font-gill text-xl font-light"
            >
              {planIntro.description}
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default DfePlanBannerSection;
