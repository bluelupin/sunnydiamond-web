"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useHomepageShell } from "@/hooks/homepage/useHomepageShell";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import { useHomepageShoppingBlocks } from "@/hooks/homepage/useHomepageShoppingBlocks";
import CraftingRarityCategoryGrid from "@/features/cms/components/home/CraftingRarityCategoryGrid";
import { cn } from "@/shared/utils/cn";
import PageContainer from "@/shared/ui/layout/PageContainer";
import Reveal from "@/shared/Animation/Reveal";

interface CraftingRaritySectionProps {
  id?: string;
}

const CRAFTING_RARITY_NECKLACE = "/images/home/crafting-rarity-necklace.png";
const IMAGE_QUALITY = 90;

function splitCraftingTitleLines(title: string): string[] {
  const trimmed = title.trim();
  if (!trimmed) return [];

  if (trimmed.includes("\n")) {
    return trimmed
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }

  const breakAfter = "Crafting Rarity";
  if (trimmed.toLowerCase().startsWith(breakAfter.toLowerCase())) {
    const remainder = trimmed.slice(breakAfter.length).trim();
    return remainder ? [breakAfter, remainder] : [trimmed];
  }

  return [trimmed];
}

function CraftingRarityCopyBlock({
  subtitleLines,
  secondaryCtaUrl,
  secondaryCtaLabel,
}: {
  subtitleLines: string[];
  secondaryCtaUrl: string;
  secondaryCtaLabel: string;
}) {
  return (
    <PageContainer className="relative z-10 px-4 md:px-8 lg:px-10 2xl:px-[60px]">
      <Reveal direction="up" className="lg:h-432 h-390 w-full max-w-640 flex flex-col items-start lg:justify-center justify-end lg:gap-10 md:gap-8 gap-6">
        <h2 className="lg:text-5xl sm:text-4xl text-32 font-larken font-light leading-110 text-darkblack">
          {subtitleLines.map((line, index) => (
            <span key={`${line}-${index}`} className="block">
              {line}
            </span>
          ))}
        </h2>
        {secondaryCtaUrl ? (
          <Link
            href={secondaryCtaUrl}
            className="relative shrink-0 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-darkMagenta after:transition-all after:duration-300 cursor-pointer border-b-[1.5px] border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack hover:border-darkMagenta hover:text-darkMagenta sm:pb-1 hover:after:w-full"
          >
            {secondaryCtaLabel}
          </Link>
        ) : null}
      </Reveal>
    </PageContainer>
  );
}

const CraftingRaritySection = ({ id }: CraftingRaritySectionProps) => {
  const { data: shellData, isLoading: isShellLoading } = useHomepageShell();
  const { data: editorialData, isLoading: isEditorialLoading } = useHomepageEditorialBlocks();
  const { data: shoppingData, isLoading: isShoppingLoading } = useHomepageShoppingBlocks();

  const hero = shellData?.homepage?.hero || shellData?.hero;
  const craftingBrilliance = editorialData?.craftingBrillianceSection ?? null;

  const titleSource = useMemo(() => {
    const cmsTitle = craftingBrilliance?.title?.trim();
    const heroSubtitle = hero?.subtitle?.trim();
    return cmsTitle || heroSubtitle || "";
  }, [craftingBrilliance?.title, hero?.subtitle]);

  const subtitleLines = useMemo(
    () => splitCraftingTitleLines(titleSource),
    [titleSource],
  );

  const secondaryCtaUrl =
    craftingBrilliance?.cta?.url ??
    craftingBrilliance?.cta?.to ??
    hero?.secondaryCta?.url ??
    hero?.secondaryCta?.to ??
    "/jewellery";
  const secondaryCtaLabel =
    craftingBrilliance?.cta?.label?.trim() ??
    hero?.secondaryCta?.label ??
    "Explore Products";

  const categories = useMemo(() => {
    const items = shoppingData?.categoryNavigation;
    if (!Array.isArray(items)) return [];

    return [...items]
      .filter((item) => item?.isActive !== false)
      .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0));
  }, [shoppingData?.categoryNavigation]);

  const isCopyLoading = isShellLoading || isEditorialLoading;
  const isCategoriesLoading = isShoppingLoading;

  if (isCopyLoading) {
    return (
      <section
        id={id}
        className="w-full bg-white pb-16 lg:pb-0"
        aria-busy="true"
        aria-label="Crafting rarity section loading"
      >
        <div className="relative overflow-hidden h-390 md:h-420 lg:h-432">
          <div
            className={cn(
              "absolute bottom-0 flex max-w-[549px] flex-col gap-[24px] left-[16px] lg:bottom-auto lg:top-[132px] lg:gap-10",
              "lg:left-[max(40px,calc(100vw*40/1440))]",
            )}
          >
            <div className="h-[106px] w-[min(549px,90vw)] animate-pulse rounded bg-gray200" aria-hidden />
            <div className="h-[19px] w-[134px] animate-pulse rounded bg-gray200" aria-hidden />
          </div>
        </div>
        <CraftingRarityCategoryGrid categories={[]} isLoading />
      </section>
    );
  }

  return (
    <section id={id} className="w-full bg-white md:pb-12 pb-16">
      <div className="relative overflow-hidden h-390 md:h-420 lg:h-432">
        <Reveal
          direction="up"
          className="pointer-events-none absolute right-[-29px] sm:top-[-83px] top-[-100px] z-0 lg:right-[2%] lg:top-[-204px] lg:w-[600px] lg:h-[850px] md:w-[550px] md:h-[560px] sm:w-[550px] sm:h-[560px] w-full h-[435px]"
        >
          <div className="relative h-full w-full rotate-[-13.91deg]">
            <Image
              src={CRAFTING_RARITY_NECKLACE}
              alt=""
              fill
              quality={IMAGE_QUALITY}
              className="object-contain"
              sizes="(max-width: 1024px) 346px, 664px"
            />
          </div>
        </Reveal>
        <CraftingRarityCopyBlock
          subtitleLines={subtitleLines}
          secondaryCtaUrl={secondaryCtaUrl}
          secondaryCtaLabel={secondaryCtaLabel}
        />
      </div>

      <CraftingRarityCategoryGrid categories={categories} isLoading={isCategoriesLoading} />
    </section>
  );
};

export default CraftingRaritySection;
