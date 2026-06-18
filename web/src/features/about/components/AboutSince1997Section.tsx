"use client";

import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import PageContainer from "@/shared/ui/layout/PageContainer";
import { aboutSince1997Content } from "../data/content";

const AboutSince1997Section = () => {
  const [founder, event, attending] = aboutSince1997Content.gallery;

  return (
    <section
      aria-labelledby="about-since-1997-title"
      className="bg-white py-16 md:py-20 lg:py-104"
    >
      <PageContainer>
        <h2
          id="about-since-1997-title"
          className="font-larken text-32 font-light leading-110 text-darkblack md:text-40 lg:text-48"
        >
          {aboutSince1997Content.title}
        </h2>

        <div className="mt-8 flex flex-col gap-8 lg:hidden">
          <p className="font-gill text-base font-light leading-110 text-gray500 md:text-lg">
            {aboutSince1997Content.story}
          </p>

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
                <figcaption className="font-gill text-base leading-110 text-darkblack">
                  {founder.caption}
                </figcaption>
              </figure>

              <p className="max-w-358 font-gill text-xl font-light leading-110 text-gray500">
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
