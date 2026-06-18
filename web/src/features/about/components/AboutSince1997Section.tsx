"use client";

import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { aboutSince1997Content } from "../data/content";

const AboutSince1997Section = () => {
  const [founder, event, attending] = aboutSince1997Content.gallery;

  return (
    <section
      aria-labelledby="about-since-1997-title"
      className="bg-white py-16 md:py-20 lg:py-104"
    >
      <div className="container">
        <h2
          id="about-since-1997-title"
          className="font-larken text-32 font-light leading-110 text-darkblack md:text-40 lg:text-48"
        >
          {aboutSince1997Content.title}
        </h2>

        <div className="mt-10 overflow-x-auto pb-2 lg:mt-10">
          <div className="flex min-w-max items-center gap-8 lg:min-w-0 lg:gap-20">
            <article className="flex shrink-0 items-center gap-6 lg:gap-8">
              <figure className="flex flex-col gap-3">
                <div className="h-320 w-280 overflow-hidden sm:h-480 sm:w-420 lg:h-600 lg:w-549">
                  <ResponsiveImage
                    desktopSrc={founder.image}
                    alt={founder.alt}
                    width={founder.width}
                    height={founder.height}
                    quality={90}
                    sizes="(max-width: 768px) 280px, 549px"
                    className="object-cover"
                  />
                </div>
                <figcaption className="font-gill text-sm leading-110 text-darkblack md:text-base">
                  {founder.caption}
                </figcaption>
              </figure>

              <p className="max-w-358 font-gill text-base font-light leading-110 text-gray500 md:text-lg lg:text-xl">
                {aboutSince1997Content.story}
              </p>
            </article>

            <div className="flex shrink-0 items-center gap-5">
              <figure className="flex w-240 flex-col gap-3 sm:w-280 lg:w-320">
                <div className="h-280 overflow-hidden sm:h-360 lg:h-417">
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
                <figcaption className="font-gill text-sm leading-110 text-darkblack md:text-base">
                  {event.caption}
                </figcaption>
              </figure>

              <figure className="flex w-280 flex-col gap-3 sm:w-360 lg:w-463">
                <div className="h-360 overflow-hidden sm:h-480 lg:h-600">
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
                <figcaption className="font-gill text-sm leading-110 text-darkblack md:text-base">
                  {attending.caption}
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSince1997Section;
