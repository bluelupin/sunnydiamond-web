"use client";

import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import PageContainer from "@/shared/ui/layout/PageContainer";
import { aboutSince1997Content } from "../data/content";

const AboutSince1997Section = () => {
  const [founder, event, attending] = aboutSince1997Content.gallery;

  return (
    <section
      aria-labelledby="about-since-1997-title"
      className="bg-white pb-16 md:py-20 lg:py-100"
    >
      <PageContainer className="pb-0">
        <div className="space-y-3 lg:mb-[40px] mb-8">
          <h2
            id="about-since-1997-title"
            className="font-larken font-light leading-110 text-darkblack lg:text-48 md:text-40 text-32"
          >
            {aboutSince1997Content.title}
          </h2>
          <p className="lg:hidden font-gill font-light leading-110 text-neutral500 md:text-lg text-base">
            {aboutSince1997Content.story}
          </p>
        </div>
      </PageContainer>
      <PageContainer className="pt-0 !pr-0">
        <div className="md:overflow-x-auto pb-2 horizontalScroll overflow-x-visible">
          <div className="flex md:flex-row flex-col md:min-w-max min-w-full items-center lg:gap-20 md:gap-16 sm:gap-12 gap-11">
            <article className="flex shrink-0 items-center lg:gap-8 gap-6 md:w-auto w-full">
              <figure className="flex flex-col gap-3 md:w-auto w-full">
                <div className="h-600 md:w-549 w-full">
                  <ResponsiveImage
                    desktopSrc={founder.image}
                    alt={founder.alt}
                    width={founder.width}
                    height={founder.height}
                    quality={90}
                    sizes="549px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="font-gill md:text-base text-sm leading-110 text-darkblack">
                  {founder.caption}
                </figcaption>
              </figure>

              <p className="lg:flex hidden max-w-358 font-gill lg:text-xl text-lg font-light leading-110 text-neutral500">
                {aboutSince1997Content.story}
              </p>
            </article>
            <div className="flex shrink-0 items-center gap-5 overflow-x-auto md:overflow-x-visible">
              <figure className="flex md:w-320 w-[90%] md:min-w-0 min-w-[80%] flex-col gap-3">
                <div className="h-417 overflow-hidden">
                  <ResponsiveImage
                    desktopSrc={event.image}
                    alt={event.alt}
                    width={event.width}
                    height={event.height}
                    quality={90}
                    sizes="320px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="font-gill text-base leading-110 text-darkblack">
                  {event.caption}
                </figcaption>
              </figure>
              <figure className="flex md:w-463 w-[90%] md:min-w-0 min-w-[80%] flex-col gap-3">
                <div className="h-600 overflow-hidden">
                  <ResponsiveImage
                    desktopSrc={attending.image}
                    alt={attending.alt}
                    width={attending.width}
                    height={attending.height}
                    quality={90}
                    sizes="463px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="font-gill text-base leading-110 text-darkblack">
                  {attending.caption}
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
};

export default AboutSince1997Section;
