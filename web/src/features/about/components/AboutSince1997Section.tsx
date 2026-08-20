"use client";

import { useRef } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import MediaContentOverlay from "@/shared/ui/MediaContentOverlay";
import PageContainer from "@/shared/ui/layout/PageContainer";
import { cn } from "@/shared/utils/cn";
import type {
  NormalizedLegacyGalleryItem,
  NormalizedResponsiveImage,
} from "@/services/about/about-page.types";
import { useSince1997HorizontalScroll } from "../hooks/useSince1997HorizontalScroll";
import Reveal from "@/shared/Animation/Reveal";

type AboutSince1997SectionProps = {
  title: string;
  story?: string;
  gallery: NormalizedLegacyGalleryItem[];
};

type GalleryImageProps = {
  image?: NormalizedResponsiveImage | null;
  caption?: string;
  description?: string;
  sizes: string;
  figureClassName?: string;
  frameClassName?: string;
  captionClassName?: string;
  dataSince1997Last?: boolean;
};

function GalleryImage({
  image,
  caption,
  description,
  sizes,
  figureClassName,
  frameClassName,
  captionClassName,
  dataSince1997Last,
}: GalleryImageProps) {
  const overlayLabel = caption ?? description;

  return (
    <figure
      className={cn("flex shrink-0 flex-col gap-3", figureClassName)}
      {...(dataSince1997Last ? { "data-since1997-last-image": true } : {})}
    >
      <div className={cn("relative overflow-hidden", frameClassName)}>
        {image ? (
          <ResponsiveImage
            desktopSrc={image.desktopUrl}
            mobileSrc={image.mobileUrl}
            alt={image.alt}
            width={image.width}
            height={image.height}
            quality={80}
            sizes={sizes}
            className="size-full object-cover"
          />
        ) : (
          <>
            <div aria-hidden className="size-full bg-gray200" />
            <MediaContentOverlay
              gradient="bottom-strong"
              className="opacity-100"
            />
            {overlayLabel ? (
              <figcaption
                className={cn(
                  "absolute bottom-0 left-0 z-10 w-full px-6 py-8 font-gill leading-110 text-white md:px-8 md:py-10",
                  captionClassName,
                )}
              >
                {overlayLabel}
              </figcaption>
            ) : null}
          </>
        )}
      </div>
      {image && caption ? (
        <figcaption
          className={cn("font-gill leading-110 text-darkblack", captionClassName)}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

const AboutSince1997Section = ({ title, story, gallery }: AboutSince1997SectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  const [founder, event, attending] = gallery;
  const hasHorizontalGallery = Boolean(founder && event && attending);

  useSince1997HorizontalScroll(sectionRef, hasHorizontalGallery);

  if (!founder) return null;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-since-1997-title"
      className="relative bg-white"
    >
      {/* Desktop — sticky viewport + scroll-driven horizontal slide */}
      <div data-since1997-mode="desktop" className="hidden md:block">
        <div className="sticky 2xl:top-0 md:top-10 top-[-150px] flex flex-col overflow-x-hidden bg-white">
          <PageContainer className="shrink-0 2xl:pb-11 lg:pb-10 pb-8">
            <Reveal as="h2" direction="up"
              id="about-since-1997-title"
              className="font-larken text-3xl md:text-4xl lg:text-5xl xl:text-56 font-light leading-110 text-darkblack">
              {title}
            </Reveal>
          </PageContainer>
          <PageContainer className="xl:pb-100 pb-16 pr-0">
            <Reveal direction="up" className="flex min-h-0 flex-1 flex-col">
              <div data-since1997-viewport className="min-h-0 flex-1 w-full overflow-x-hidden overflow-y-visible">
                <div
                  data-since1997-track
                  className="flex h-full items-start xl:gap-20 gap-16 will-change-transform motion-reduce:transform-none"
                >
                  <article className="flex shrink-0 items-center lg:gap-8 md:gap-6 gap-10">
                    <GalleryImage
                      image={founder.image}
                      caption={founder.caption}
                      description={founder.description}
                      sizes="549px"
                      figureClassName="w-[549px]"
                      frameClassName="h-600 w-[549px]"
                      captionClassName="text-base"
                    />
                    {story ? (
                      <p className="max-w-358 font-gill lg:text-xl md:text-lg text-base font-light leading-110 text-neutral500">
                        {story}
                      </p>
                    ) : null}
                  </article>

                  {hasHorizontalGallery ? (
                    <div className="flex items-center justify-center gap-4 lg:gap-5 2xl:gap-8">
                      <GalleryImage
                        image={event!.image}
                        caption={event!.caption}
                        description={event!.description}
                        sizes="320px"
                        figureClassName="w-[320px]"
                        frameClassName="h-[417px]"
                        captionClassName="text-base"
                      />
                      <GalleryImage
                        image={attending!.image}
                        caption={attending!.caption}
                        description={attending!.description}
                        sizes="463px"
                        figureClassName="w-[463px]"
                        frameClassName="h-600"
                        captionClassName="text-base"
                        dataSince1997Last
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </Reveal>
          </PageContainer>
        </div>

        {hasHorizontalGallery ? (
          <div data-since1997-scroll-spacer aria-hidden className="h-[85vh]" />
        ) : null}
      </div>

      {/* Mobile / tablet — original vertical layout; images 2+3 slide on scroll */}
      <div data-since1997-mode="mobile" className="md:hidden">
        <div className="py-16 md:py-20">
          <PageContainer className="pb-0">
            <div className="mb-8 space-y-3">
              <Reveal as="h2" direction="up" className="font-larken text-32 font-light leading-110 text-darkblack md:text-40">
                {title}
              </Reveal>
              {story ? (
                <Reveal as="p" direction="up" className="font-gill text-base font-light leading-110 text-neutral500 md:text-lg">
                  {story}
                </Reveal>
              ) : null}
            </div>
          </PageContainer>

          <Reveal direction="up" className="md:px-8 px-4">
            <article className="flex w-full shrink-0 items-center gap-6">
              <GalleryImage
                image={founder.image}
                caption={founder.caption}
                description={founder.description}
                sizes="549px"
                figureClassName="w-full"
                frameClassName="md:h-600 h-[426px] w-full"
                captionClassName="text-sm md:text-base"
              />
            </article>
          </Reveal>
        </div>

        {hasHorizontalGallery ? (
          <Reveal direction="up" data-since1997-scroll-zone className="relative">
            <div className="sticky sm:top-0 top-[120px] bg-white pb-16 md:pb-20">
              <PageContainer className="!pr-0 pl-5 pt-0">
                <div data-since1997-viewport className="overflow-x-hidden overflow-y-visible">
                  <div
                    data-since1997-track
                    className="flex w-full shrink-0 items-start gap-3 will-change-transform motion-reduce:transform-none sm:gap-12"
                  >
                    <GalleryImage
                      image={event!.image}
                      caption={event!.caption}
                      description={event!.description}
                      sizes="320px"
                      figureClassName="w-[256px] min-w-[256px] sm:w-[550px] lg:w-[400px] lg:min-w-[400px]"
                      frameClassName="lg:h-[240px] md:h-[500px] sm:h-[400px] h-[240px]"
                      captionClassName="text-base"
                    />
                    <GalleryImage
                      image={attending!.image}
                      caption={attending!.caption}
                      description={attending!.description}
                      sizes="463px"
                      figureClassName="w-[256px] min-w-[256px] sm:w-[550px] lg:w-[400px] lg:min-w-[400px]"
                      frameClassName="lg:h-[277px] md:h-[560px] sm:h-[520px] h-[277px]"
                      captionClassName="text-base"
                      dataSince1997Last
                    />
                  </div>
                </div>
              </PageContainer>
            </div>
            <div data-since1997-scroll-spacer aria-hidden className="h-[70vh]" />
          </Reveal>
        ) : null}
      </div>
    </section>
  );
};

export default AboutSince1997Section;
