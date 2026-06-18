"use client";

import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { aboutSince1997Content } from "../data/content";

const AboutSince1997Section = () => {
  const [founder, event, attending] = aboutSince1997Content.gallery;

  return (
    <section
      aria-labelledby="about-since-1997-title"
      className="bg-white py-16 md:py-20 lg:py-[104px]"
    >
      <div className="container">
        <h2
          id="about-since-1997-title"
          className="font-larken font-light text-[32px] md:text-[40px] lg:text-[48px] leading-[110%] text-darkblack"
        >
          {aboutSince1997Content.title}
        </h2>

        <div className="mt-10 lg:mt-10 overflow-x-auto pb-2">
          <div className="flex items-center gap-8 lg:gap-20 min-w-max lg:min-w-0">
            <article className="flex items-center gap-6 lg:gap-8 shrink-0">
              <figure className="flex flex-col gap-3">
                <div className="w-[280px] sm:w-[420px] lg:w-[549px] h-[320px] sm:h-[480px] lg:h-[600px] overflow-hidden">
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
                <figcaption className="font-gill text-sm md:text-base text-darkblack leading-[110%]">
                  {founder.caption}
                </figcaption>
              </figure>

              <p className="font-gill font-light text-base md:text-lg lg:text-xl leading-[110%] text-gray500 max-w-[358px]">
                {aboutSince1997Content.story}
              </p>
            </article>

            <div className="flex items-center gap-5 shrink-0">
              <figure className="flex flex-col gap-3 w-[240px] sm:w-[280px] lg:w-[320px]">
                <div className="h-[280px] sm:h-[360px] lg:h-[417px] overflow-hidden">
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
                <figcaption className="font-gill text-sm md:text-base text-darkblack leading-[110%]">
                  {event.caption}
                </figcaption>
              </figure>

              <figure className="flex flex-col gap-3 w-[280px] sm:w-[360px] lg:w-[463px]">
                <div className="h-[360px] sm:h-[480px] lg:h-[600px] overflow-hidden">
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
                <figcaption className="font-gill text-sm md:text-base text-darkblack leading-[110%]">
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
