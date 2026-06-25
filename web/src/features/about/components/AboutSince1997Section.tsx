"use client";

import { useRef } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import PageContainer from "@/shared/ui/layout/PageContainer";
import type { NormalizedAboutLegacy } from "@/services/about/about-page.types";
import { aboutSince1997Content } from "../data/content";
import { useSince1997HorizontalScroll } from "../hooks/useSince1997HorizontalScroll";

type AboutSince1997SectionProps = NormalizedAboutLegacy;

type GalleryItemProps = {
  desktopUrl: string;
  mobileUrl: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  imageWidth: number;
  imageHeight: number;
  sizes: string;
};

function GalleryImage({
  desktopUrl,
  mobileUrl,
  alt,
  caption,
  width,
  height,
  imageWidth,
  imageHeight,
  sizes,
}: GalleryItemProps) {
  return (
    <figure className="flex shrink-0 flex-col gap-3" style={{ width }}>
      <div className="overflow-hidden" style={{ width, height }}>
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
        <figcaption className="font-gill text-base leading-110 text-darkblack">
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
      {/* Desktop — sticky viewport + scroll-driven horizontal slide */}
      <div className="hidden lg:block">
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden bg-white pt-100">
          <PageContainer className="shrink-0 pb-10">
            <h2
              id="about-since-1997-title"
              className="font-larken text-48 font-light leading-110 text-darkblack"
            >
              {title}
            </h2>
          </PageContainer>

          <PageContainer className="flex min-h-0 flex-1 flex-col pb-100 pt-0">
            <div ref={viewportRef} className="min-h-0 flex-1 overflow-hidden">
              <div
                ref={trackRef}
                className="flex h-full items-center gap-20 will-change-transform motion-reduce:transform-none"
              >
                <article className="flex shrink-0 items-center gap-8">
                  <GalleryImage
                    desktopUrl={founder.image.desktopUrl}
                    mobileUrl={founder.image.mobileUrl}
                    alt={founder.image.alt}
                    caption={founder.caption}
                    width={549}
                    height={600}
                    imageWidth={founderWidth}
                    imageHeight={founderHeight}
                    sizes="549px"
                  />
                  {story ? (
                    <p className="max-w-358 font-gill text-xl font-light leading-110 text-neutral500">
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
                      width={320}
                      height={417}
                      imageWidth={eventWidth}
                      imageHeight={eventHeight}
                      sizes="320px"
                    />
                    <GalleryImage
                      desktopUrl={attending!.image.desktopUrl}
                      mobileUrl={attending!.image.mobileUrl}
                      alt={attending!.image.alt}
                      caption={attending!.caption}
                      width={463}
                      height={600}
                      imageWidth={attendingWidth}
                      imageHeight={attendingHeight}
                      sizes="463px"
                    />
                  </>
                ) : null}
              </div>
            </div>
          </PageContainer>
        </div>

        {hasHorizontalGallery ? (
          <div data-since1997-scroll-spacer aria-hidden className="h-[85vh]" />
        ) : null}
      </div>

      {/* Mobile / tablet — existing layout */}
      <div className="lg:hidden py-16 md:py-20">
        <PageContainer className="pb-0">
          <div className="mb-8 space-y-3">
            <h2 className="font-larken text-32 font-light leading-110 text-darkblack md:text-40">
              {title}
            </h2>
            {story ? (
              <p className="font-gill text-base font-light leading-110 text-neutral500 md:text-lg">
                {story}
              </p>
            ) : null}
          </div>
        </PageContainer>
        <PageContainer className="!pr-0 pl-5 pt-0">
          <div className="horizontalScroll overflow-x-auto pb-2 md:overflow-x-visible">
            <div className="flex min-w-full flex-col items-center gap-6 sm:gap-12 md:min-w-max md:flex-row md:gap-16">
              <article className="flex w-full shrink-0 items-center gap-6 pr-4 md:w-auto md:pr-0">
                <figure className="flex w-full flex-col gap-3 md:w-auto">
                  <div className="h-600 w-full md:w-549">
                    <ResponsiveImage
                      desktopSrc={founder.image.desktopUrl}
                      mobileSrc={founder.image.mobileUrl}
                      alt={founder.image.alt}
                      width={founderWidth}
                      height={founderHeight}
                      quality={80}
                      sizes="549px"
                      className="object-cover"
                    />
                  </div>
                  {founder.caption ? (
                    <figcaption className="font-gill text-sm leading-110 text-darkblack md:text-base">
                      {founder.caption}
                    </figcaption>
                  ) : null}
                </figure>
              </article>

              {hasHorizontalGallery ? (
                <div className="flex w-full shrink-0 items-center gap-3 overflow-x-auto overflow-y-hidden md:w-auto md:gap-5 md:overflow-x-visible">
                  <figure className="flex w-[256px] min-w-[256px] flex-col gap-3 sm:w-[400px] sm:min-w-[400px] md:w-320 md:min-w-0">
                    <div className="h-[240px] overflow-hidden md:h-417">
                      <ResponsiveImage
                        desktopSrc={event!.image.desktopUrl}
                        mobileSrc={event!.image.mobileUrl}
                        alt={event!.image.alt}
                        width={eventWidth}
                        height={eventHeight}
                        quality={80}
                        sizes="320px"
                        className="object-cover"
                      />
                    </div>
                    {event!.caption ? (
                      <figcaption className="font-gill text-base leading-110 text-darkblack">
                        {event!.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                  <figure className="flex w-[256px] min-w-[256px] flex-col gap-3 sm:w-[400px] sm:min-w-[400px] md:w-463 md:min-w-0">
                    <div className="h-[277px] overflow-hidden md:h-600">
                      <ResponsiveImage
                        desktopSrc={attending!.image.desktopUrl}
                        mobileSrc={attending!.image.mobileUrl}
                        alt={attending!.image.alt}
                        width={attendingWidth}
                        height={attendingHeight}
                        quality={80}
                        sizes="463px"
                        className="object-cover"
                      />
                    </div>
                    {attending!.caption ? (
                      <figcaption className="font-gill text-base leading-110 text-darkblack">
                        {attending!.caption}
                      </figcaption>
                    ) : null}
                  </figure>
                </div>
              ) : null}
            </div>
          </div>
        </PageContainer>
      </div>
    </section>
  );
};

export default AboutSince1997Section;
