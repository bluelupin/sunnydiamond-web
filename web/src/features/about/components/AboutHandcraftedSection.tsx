"use client";

import Image from "next/image";
import MediaContentOverlay from "@/shared/ui/MediaContentOverlay";
import PageContainer from "@/shared/ui/layout/PageContainer";
import { cn } from "@/shared/utils/cn";
import type { NormalizedAboutCraft } from "@/services/about/about-page.types";
import AboutHandcraftedHeroMedia from "./AboutHandcraftedHeroMedia";
import VerticalScrollLine from "./VerticalScrollLine";
import {
  aboutHandcraftedAssets,
  aboutPageImages,
} from "../data/content";

type AboutHandcraftedSectionProps = NormalizedAboutCraft;

const craftPhotoClass =
  "h-full w-full bg-cover bg-center";
const craftPhotoStyle = {
  backgroundImage: `url(${aboutPageImages.craftsmanship})`,
} as const;

function CraftPhotoTile({ className }: { className?: string }) {
  return (
    <div
      className={cn(craftPhotoClass, className)}
      style={craftPhotoStyle}
      aria-hidden
    />
  );
}

function CraftTextTile({
  className,
  compact,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 bg-chalkCard",
        className,
      )}
    >
      <Image
        src={aboutHandcraftedAssets.flourish}
        alt=""
        width={16}
        height={15}
        aria-hidden
        className="h-[15px] w-4 shrink-0"
      />
      <h3
        className={cn(
          "text-center font-larken font-light leading-[110%] text-darkblack",
          compact
            ? "max-w-[79.73%] text-2xl"
            : "text-base sm:text-lg md:text-xl lg:text-2xl",
        )}
      >
        Ethically Sourced, conflict free diamonds
      </h3>
    </div>
  );
}

const AboutHandcraftedSection = ({
  title,
  videoUrl,
  posterUrl,
  overlayOpacity,
}: AboutHandcraftedSectionProps) => (
  <>
    <section
      aria-labelledby="about-handcrafted-title"
      className="overflow-x-hidden bg-white"
    >
      <PageContainer className="px-0 md:px-0">
        <div className="relative h-700 w-full overflow-hidden">
          <div className="absolute inset-0">
            <AboutHandcraftedHeroMedia videoUrl={videoUrl} posterUrl={posterUrl} />
          </div>
          <MediaContentOverlay solidOpacity={overlayOpacity} />
          <div className="absolute inset-x-0 bottom-0 top-16 z-10 flex flex-col items-center justify-center gap-4 px-5 md:top-20">
            <h2
              id="about-handcrafted-title"
              className="text-center font-larken text-[32px] font-light leading-[110%] text-white md:text-[40px] lg:text-5xl"
            >
              {title}
            </h2>
            <span className="h-px w-full max-w-[440px] bg-neutral300" aria-hidden />
          </div>
        </div>
      </PageContainer>
      <PageContainer className="mt-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center gap-3">
            <div className="h-[132px] w-[111px] sm:h-[222px] sm:w-[222px]">
              <CraftPhotoTile className="size-full" />
            </div>
            <div className="h-[132px] w-[111px] sm:h-[222px] sm:w-[222px]">
              <CraftTextTile className="size-full" />
            </div>
            <div className="h-[132px] w-[111px] sm:h-[222px] sm:w-[222px]">
              <CraftPhotoTile className="size-full" />
            </div>
            <div className="hidden h-[222px] w-[222px] sm:block">
              <CraftPhotoTile className="size-full" />
            </div>
            <div className="hidden h-[222px] w-[222px] sm:block">
              <CraftPhotoTile className="size-full" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[132px] w-[173px] sm:h-[222px] sm:w-[222px]">
              <CraftPhotoTile className="size-full" />
            </div>
            <div className="hidden h-[222px] w-[222px] sm:flex">
              <CraftTextTile className="size-full" compact />
            </div>
            <div className="h-[132px] w-[173px] sm:h-[222px] sm:w-[222px]">
              <CraftPhotoTile className="size-full" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="h-[132px] w-[111px] sm:h-[222px] sm:w-[222px]">
              <CraftTextTile className="size-full" />
            </div>
            <div className="h-[132px] w-[111px] sm:h-[222px] sm:w-[222px]">
              <CraftPhotoTile className="size-full" />
            </div>
            <div className="h-[132px] w-[111px] sm:h-[222px] sm:w-[222px]">
              <CraftTextTile className="size-full" />
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
    <VerticalScrollLine className="pb-16 pt-5 md:pb-20 lg:pb-[100px]" />
  </>
);

export default AboutHandcraftedSection;
