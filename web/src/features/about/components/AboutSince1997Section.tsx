"use client";

import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import PageContainer from "@/shared/ui/layout/PageContainer";
import { aboutSince1997Content } from "../data/content";

const AboutSince1997Section = () => {
  const [founder, event, attending] = aboutSince1997Content.gallery;

  return (
    <section
      aria-labelledby="about-since-1997-title"
      className="bg-white pb-16 md:py-20 lg:py-104"
    >
      <PageContainer>
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
        <div className="mt-8 flex flex-col gap-8 lg:hidden">
          <figure className="flex flex-col gap-3">
            <div className="aspect-[549/600] w-full overflow-hidden">
              <ResponsiveImage
                desktopSrc={founder.image}
                alt={founder.alt}
                width={founder.width}
                height={founder.height}
                quality={90}
                sizes="100vw"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="font-gill text-sm leading-110 text-darkblack md:text-base">
              {founder.caption}
            </figcaption>
          </figure>

          <div className="grid grid-cols-2 gap-4">
            <figure className="flex flex-col gap-3">
              <div className="aspect-[320/417] overflow-hidden">
                <ResponsiveImage
                  desktopSrc={event.image}
                  alt={event.alt}
                  width={event.width}
                  height={event.height}
                  quality={90}
                  sizes="50vw"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="font-gill text-sm leading-110 text-darkblack md:text-base">
                {event.caption}
              </figcaption>
            </figure>

            <figure className="flex flex-col gap-3">
              <div className="aspect-[463/600] overflow-hidden">
                <ResponsiveImage
                  desktopSrc={attending.image}
                  alt={attending.alt}
                  width={attending.width}
                  height={attending.height}
                  quality={90}
                  sizes="50vw"
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="font-gill text-sm leading-110 text-darkblack md:text-base">
                {attending.caption}
              </figcaption>
            </figure>
          </div>
        </div>

        <div className="mt-10 hidden overflow-x-auto pb-2 lg:block">
          <div className="flex min-w-max items-center gap-20">
            <article className="flex shrink-0 items-center gap-8">
              <figure className="flex flex-col gap-3">
                <div className="h-600 w-549 overflow-hidden">
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

              <p className="max-w-358 font-gill lg:text-xl text-lg font-light leading-110 text-neutral500">
                {aboutSince1997Content.story}
              </p>
            </article>

            <div className="flex shrink-0 items-center gap-5">
              <figure className="flex w-320 flex-col gap-3">
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

              <figure className="flex w-463 flex-col gap-3">
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
