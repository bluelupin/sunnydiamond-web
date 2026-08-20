"use client";

import Link from "next/link";
import PageContainer from "@/shared/ui/layout/PageContainer";
import Reveal from "@/shared/Animation/Reveal";

type CraftingRarityCopyBlockProps = {
  subtitleLines: string[];
  secondaryCtaUrl: string;
  secondaryCtaLabel: string;
};

export default function CraftingRarityCopyBlock({
  subtitleLines,
  secondaryCtaUrl,
  secondaryCtaLabel,
}: CraftingRarityCopyBlockProps) {
  return (
    <PageContainer className="relative z-10 px-4 md:px-8 lg:px-10 2xl:px-[60px]">
      <Reveal
        direction="up"
        className="lg:h-432 h-390 w-full max-w-640 flex flex-col items-start lg:justify-center justify-end lg:gap-10 md:gap-8 gap-6"
      >
        <h2 className="lg:text-5xl sm:text-4xl text-32 font-larken font-light leading-110 text-darkblack">
          {subtitleLines.map((line, index) => (
            <span key={`${line}-${index}`} className="block">
              {line}
            </span>
          ))}
        </h2>
        {secondaryCtaUrl && secondaryCtaLabel ? (
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
