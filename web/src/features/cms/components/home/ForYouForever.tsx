"use client";

import Link from "next/link";
import { useMemo } from "react";

import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { useFadeIn } from "@/shared/hooks/use-fade-in";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import {
  resolveCmsAltText,
  resolveCmsMediaUrl,
} from "@/shared/utils/strapiMedia";

interface ForYouForeverProps {
  id?: string;
}

interface BespokeForYouCard {
  id: number;
  title: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  image?: any;
  cta?: {
    id: number;
    label: string;
    url: string;
    targetType?: "internal" | "external";
    openInNewTab?: boolean;
  };
}

const ForYouForever = ({ id }: ForYouForeverProps) => {
  const { data: editorialData, isLoading } = useHomepageEditorialBlocks();

  const headingRef = useFadeIn(0);

  const cardRefs = [
    useFadeIn(150),
    useFadeIn(300),
    useFadeIn(450),
    useFadeIn(600),
  ];

  const cards = useMemo(
    () =>
      (editorialData?.bespokeForYouCards ?? [])
        .filter((item: BespokeForYouCard) => item?.isActive)
        .sort(
          (a: BespokeForYouCard, b: BespokeForYouCard) =>
            (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0)
        )
        .map((card: BespokeForYouCard) => {
          const desktopImageUrl = resolveCmsMediaUrl(
            card?.image?.desktopImage ??
            card?.image?.data?.attributes ??
            card?.image
          );

          const mobileImageUrl = resolveCmsMediaUrl(
            card?.image?.mobileImage ??
            card?.image?.data?.attributes ??
            card?.image
          );

          const imageAlt =
            card?.image?.altText ||
            resolveCmsAltText(
              card?.image?.desktopImage ??
              card?.image?.data?.attributes ??
              card?.image
            ) ||
            resolveCmsAltText(
              card?.image?.mobileImage ??
              card?.image?.data?.attributes ??
              card?.image
            ) ||
            card?.title ||
            "";

          return {
            ...card,
            desktopImageUrl,
            mobileImageUrl,
            imageAlt,
          };
        }),
    [editorialData]
  );

  return (
    !isLoading ? (
      <section
        id={id}
        className="md:px-0 px-4 py-10 sm:py-12 md:py-16 lg:py-20 bg-gray200 lg:min-h-[948px]"
      >
        <h2
          ref={headingRef as React.RefObject<HTMLHeadingElement>}
          className="lg:text-5xl md:text-4xl text-32 text-center text-darkblack font-larken font-light tracking-[0%] leading-[100%] mb-4 sm:mb-6 md:mb-8 lg:mb-10"
        >
          For you, Forever
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-0 gap-12">
          {cards.map((card: any, idx: any) => (
            <figure
              key={card.id}
              ref={cardRefs[idx] as React.RefObject<HTMLElement>}
              className="flex flex-col"
            >
              <Link
                href={card?.cta?.url || "#"}
                target={card?.cta?.openInNewTab ? "_blank" : undefined}
                rel={
                  card?.cta?.openInNewTab
                    ? "noopener noreferrer"
                    : undefined
                }
                className="group block"
              >
                <div className="aspect-square md:aspect-auto h-[357px] md:h-auto lg:h-[620px] overflow-hidden w-full">
                  {card.desktopImageUrl ? (
                    <ResponsiveImage
                      desktopSrc={card.desktopImageUrl}
                      mobileSrc={card.mobileImageUrl}
                      alt={card.imageAlt}
                      width={1280}
                      height={1280}
                      quality={90}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray300 flex items-center justify-center">
                      <span className="text-sm text-gray500">
                        No Image Available
                      </span>
                    </div>
                  )}
                </div>

                <figcaption className="mt-4 text-center md:px-4 px-2">
                  <h3 className="mb-2 text-base md:text-lg lg:text-xl tracking-[1.8%] font-normal leading-[150%] text-black font-gill">
                    {card.title}
                  </h3>

                  <p className="text-base md:text-lg lg:text-xl text-darkblack leading-[100%] tracking-[1%] font-light font-gill">
                    {card.description}
                  </p>

                  {/* {card?.cta?.label && (
                  <div className="mt-4">
                    <span className="text-sm uppercase tracking-[1.5px] border-b border-current pb-1">
                      {card.cta.label}
                    </span>
                  </div>
                )} */}
                </figcaption>
              </Link>
            </figure>
          ))}
        </div>
      </section>
    ) : (
      <section
        id={id}
        className="md:px-0 px-4 py-10 sm:py-12 md:py-16 lg:py-20 bg-gray200"
        aria-busy="true"
      >
        <div
          ref={headingRef as React.RefObject<HTMLDivElement>}
          className="h-10 w-64 bg-gray300 rounded mx-auto mb-10"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-0 gap-12">
          {[1, 2].map((item) => (
            <div key={item}>
              <div className="aspect-square md:aspect-auto h-[357px] lg:h-[620px] bg-gray300 rounded" />

              <div className="mt-4 h-6 bg-gray300 rounded w-3/4 mx-auto" />

              <div className="mt-2 h-5 bg-gray300 rounded w-5/6 mx-auto" />
            </div>
          ))}
        </div>
      </section>
    )
  );
};

export default ForYouForever;
