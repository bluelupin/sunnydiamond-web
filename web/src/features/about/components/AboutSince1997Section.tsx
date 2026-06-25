"use client";

import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import PageContainer from "@/shared/ui/layout/PageContainer";
import type { NormalizedAboutLegacy } from "@/services/about/about-page.types";
import {
  aboutSince1997Content,
} from "../data/content";

type AboutSince1997SectionProps = NormalizedAboutLegacy;

const AboutSince1997Section = ({ title, story, gallery }: AboutSince1997SectionProps) => {
  const [founder, event, attending] = gallery;
  const founderWidth = founder.image.width ?? aboutSince1997Content.gallery[0]?.width ?? 549;
  const founderHeight = founder.image.height ?? aboutSince1997Content.gallery[0]?.height ?? 600;
  const eventWidth = event?.image.width ?? aboutSince1997Content.gallery[1]?.width ?? 320;
  const eventHeight = event?.image.height ?? aboutSince1997Content.gallery[1]?.height ?? 417;
  const attendingWidth = attending?.image.width ?? aboutSince1997Content.gallery[2]?.width ?? 463;
  const attendingHeight = attending?.image.height ?? aboutSince1997Content.gallery[2]?.height ?? 600;

  return (
    <section
      aria-labelledby="about-since-1997-title"
      className="bg-white py-16 md:py-20 lg:py-100"
    >
      <PageContainer className="pb-0">
        <div className="space-y-3 lg:mb-[40px] mb-8">
          <h2
            id="about-since-1997-title"
            className="font-larken font-light leading-110 text-darkblack lg:text-48 md:text-40 text-32"
          >
            {title}
          </h2>
          {story ? (
            <p className="lg:hidden font-gill font-light leading-110 text-neutral500 md:text-lg text-base">
              {story}
            </p>
          ) : null}
        </div>
      </PageContainer>
      <PageContainer className="pt-0 !pr-0 pl-5">
        <div className="md:overflow-x-auto pb-2 horizontalScroll overflow-x-visible">
          <div className="flex md:flex-row flex-col md:min-w-max min-w-full items-center lg:gap-20 md:gap-16 sm:gap-12 gap-6">
            <article className="flex shrink-0 items-center lg:gap-8 gap-6 md:w-auto w-full md:pr-0 pr-4">
              <figure className="flex flex-col gap-3 md:w-auto w-full">
                <div className="h-600 md:w-549 w-full">
                  <ResponsiveImage
                    desktopSrc={founder.image.desktopUrl}
                    mobileSrc={founder.image.mobileUrl}
                    alt={founder.image.alt}
                    width={founderWidth}
                    height={founderHeight}
                    quality={90}
                    sizes="549px"
                    className="object-cover"
                  />
                </div>
                {founder.caption ? (
                  <figcaption className="font-gill md:text-base text-sm leading-110 text-darkblack">
                    {founder.caption}
                  </figcaption>
                ) : null}
              </figure>

              {story ? (
                <p className="lg:flex hidden max-w-358 font-gill lg:text-xl text-lg font-light leading-110 text-neutral500">
                  {story}
                </p>
              ) : null}
            </article>
            {event && attending ? (
              <div className="md:w-auto w-full flex shrink-0 items-center md:gap-5 gap-3 overflow-y-hidden overflow-x-auto md:overflow-x-visible">
                <figure className="flex md:w-320 md:min-w-0 sm:min-w-[400px] min-w-[256px] sm:w-[400px] w-[256px] flex-col gap-3">
                  <div className="md:h-417 h-[240px] overflow-hidden">
                    <ResponsiveImage
                      desktopSrc={event.image.desktopUrl}
                      mobileSrc={event.image.mobileUrl}
                      alt={event.image.alt}
                      width={eventWidth}
                      height={eventHeight}
                      quality={90}
                      sizes="320px"
                      className="object-cover"
                    />
                  </div>
                  {event.caption ? (
                    <figcaption className="font-gill text-base leading-110 text-darkblack">
                      {event.caption}
                    </figcaption>
                  ) : null}
                </figure>
                <figure className="flex md:w-463 md:min-w-0 sm:min-w-[400px] min-w-[256px] sm:w-[400px] w-[256px] flex-col gap-3">
                  <div className="md:h-600 h-[277px] overflow-hidden">
                    <ResponsiveImage
                      desktopSrc={attending.image.desktopUrl}
                      mobileSrc={attending.image.mobileUrl}
                      alt={attending.image.alt}
                      width={attendingWidth}
                      height={attendingHeight}
                      quality={90}
                      sizes="463px"
                      className="object-cover"
                    />
                  </div>
                  {attending.caption ? (
                    <figcaption className="font-gill text-base leading-110 text-darkblack">
                      {attending.caption}
                    </figcaption>
                  ) : null}
                </figure>
              </div>
            ) : null}
          </div>
        </div>
      </PageContainer>
    </section>
  );
};

export default AboutSince1997Section;
