"use client";

import { useRef } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import PageContainer from "@/shared/ui/layout/PageContainer";
import { cn } from "@/shared/utils/cn";
import type { NormalizedAboutLegacy } from "@/services/about/about-page.types";
import { aboutSince1997Content } from "../data/content";
import { useSince1997HorizontalScroll } from "../hooks/useSince1997HorizontalScroll";

type AboutSince1997SectionProps = NormalizedAboutLegacy;

type GalleryItemProps = {
  desktopUrl: string;
  mobileUrl: string;
  alt: string;
  caption?: string;
  imageWidth: number;
  imageHeight: number;
  sizes: string;
  figureClassName?: string;
  frameClassName?: string;
  captionClassName?: string;
  dataSince1997Last?: boolean;
};

function GalleryImage({
  desktopUrl,
  mobileUrl,
  alt,
  caption,
  imageWidth,
  imageHeight,
  sizes,
  figureClassName,
  frameClassName,
  captionClassName,
  dataSince1997Last,
}: GalleryItemProps) {
  return (
    <figure
      className={cn("flex shrink-0 flex-col gap-3", figureClassName)}
      {...(dataSince1997Last ? { "data-since1997-last-image": true } : {})}
    >
      <div className={cn("overflow-hidden", frameClassName)}>
        <ResponsiveImage
          desktopSrc={desktopUrl}
          mobileSrc={mobileUrl}
          alt={alt}
          width={imageWidth}
          height={imageHeight}
          quality={80}
          sizes={sizes}
          className="size-full object-cover"
        />
      </div>
      {caption ? (
        <figcaption className={cn("font-gill leading-110 text-darkblack", captionClassName)}>
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

const AboutSince1997Section = ({ title, story, gallery }: AboutSince1997SectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const [founder, event, attending] = gallery;
  const hasHorizontalGallery = Boolean(event && attending);

  useSince1997HorizontalScroll(sectionRef, trackRef, viewportRef, hasHorizontalGallery);

  const founderWidth = founder.image.width ?? aboutSince1997Content.gallery[0]?.width ?? 549;
  const founderHeight = founder.image.height ?? aboutSince1997Content.gallery[0]?.height ?? 600;
  const eventWidth = event?.image.width ?? aboutSince1997Content.gallery[1]?.width ?? 320;
  const eventHeight = event?.image.height ?? aboutSince1997Content.gallery[1]?.height ?? 417;
  const attendingWidth = attending?.image.width ?? aboutSince1997Content.gallery[2]?.width ?? 463;
  const attendingHeight = attending?.image.height ?? aboutSince1997Content.gallery[2]?.height ?? 600;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-since-1997-title"
      className="relative bg-white"
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden bg-white pt-16 md:pt-20 lg:pt-100">
        <PageContainer className="shrink-0 pb-8 lg:pb-10">
          <h2
            id="about-since-1997-title"
            className="font-larken text-32 font-light leading-110 text-darkblack md:text-40 lg:text-48"
          >
            {title}
          </h2>
          {story ? (
            <p className="mt-3 font-gill text-base font-light leading-110 text-neutral500 md:text-lg lg:hidden">
              {story}
            </p>
          ) : null}
        </PageContainer>

        <div className="flex min-h-0 flex-1 flex-col pb-16 pt-0 md:pb-20 lg:pb-100 lg:pl-[40px] lg:pr-0 max-lg:pl-5 max-lg:pr-0">
          <div ref={viewportRef} className="min-h-0 flex-1 overflow-hidden">
            <div
              ref={trackRef}
              className="flex h-full items-center gap-3 will-change-transform motion-reduce:transform-none md:gap-5 lg:gap-20"
            >
              <article className="flex w-full min-w-full shrink-0 items-center gap-6 pr-4 lg:w-auto lg:min-w-0 lg:gap-8 lg:pr-0">
                <GalleryImage
                  desktopUrl={founder.image.desktopUrl}
                  mobileUrl={founder.image.mobileUrl}
                  alt={founder.image.alt}
                  caption={founder.caption}
                  imageWidth={founderWidth}
                  imageHeight={founderHeight}
                  sizes="549px"
                  figureClassName="w-full lg:w-[549px]"
                  frameClassName="h-600 w-full lg:w-[549px]"
                  captionClassName="text-sm md:text-base"
                />
                {story ? (
                  <p className="hidden max-w-358 shrink-0 font-gill text-xl font-light leading-110 text-neutral500 lg:block">
                    {story}
                  </p>
                ) : null}
              </article>

              {hasHorizontalGallery ? (
                <>
                  <GalleryImage
                    desktopUrl={event!.image.desktopUrl}
                    mobileUrl={event!.image.mobileUrl}
                    alt={event!.image.alt}
                    caption={event!.caption}
                    imageWidth={eventWidth}
                    imageHeight={eventHeight}
                    sizes="320px"
                    figureClassName="w-[256px] min-w-[256px] sm:w-[400px] sm:min-w-[400px] lg:w-[320px] lg:min-w-0"
                    frameClassName="h-[240px] lg:h-[417px]"
                    captionClassName="text-base"
                  />
                  <GalleryImage
                    desktopUrl={attending!.image.desktopUrl}
                    mobileUrl={attending!.image.mobileUrl}
                    alt={attending!.image.alt}
                    caption={attending!.caption}
                    imageWidth={attendingWidth}
                    imageHeight={attendingHeight}
                    sizes="463px"
                    figureClassName="w-[256px] min-w-[256px] sm:w-[400px] sm:min-w-[400px] lg:w-[463px] lg:min-w-0"
                    frameClassName="h-[277px] md:h-600 lg:h-600"
                    captionClassName="text-base"
                    dataSince1997Last
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {hasHorizontalGallery ? (
        <div data-since1997-scroll-spacer aria-hidden className="h-[85vh]" />
      ) : null}
    </section>
  );
};

export default AboutSince1997Section;
