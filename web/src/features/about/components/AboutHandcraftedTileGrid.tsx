"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { LazyInView } from "@/shared/ui/LazyInView";
import { cn } from "@/shared/utils/cn";
import type { NormalizedCraftCard } from "@/services/about/about-page.types";
import {
  aboutHandcraftedAssets,
  aboutHandcraftedContent,
  aboutPageImages,
} from "../data/content";

type AboutHandcraftedTileGridProps = {
  cards: NormalizedCraftCard[];
};

const craftPhotoClass = "h-full w-full bg-cover bg-center";
const craftPhotoStyle = {
  backgroundImage: `url(${aboutPageImages.craftsmanship})`,
} as const;

const STAGGER_MS = 75;
const REVEAL_DURATION = "duration-700 ease-reveal";

/** Diagonal sweep: top-left → bottom-right for a cohesive grid formation. */
function revealDelay(row: number, col: number, colsInRow: number) {
  return (row * colsInRow + col) * STAGGER_MS;
}

type AnimatedTileProps = {
  revealed: boolean;
  reducedMotion: boolean;
  delayMs: number;
  className?: string;
  children: ReactNode;
};

function AnimatedTile({
  revealed,
  reducedMotion,
  delayMs,
  className,
  children,
}: AnimatedTileProps) {
  return (
    <div
      className={cn(
        className,
        !reducedMotion &&
        "motion-safe:transition-[opacity,transform] motion-safe:will-change-[opacity,transform]",
        !reducedMotion && REVEAL_DURATION,
        revealed || reducedMotion
          ? "translate-y-0 scale-100 opacity-100"
          : "translate-y-5 scale-[0.94] opacity-0",
      )}
      style={
        !reducedMotion && delayMs > 0
          ? { transitionDelay: `${delayMs}ms` }
          : undefined
      }
    >
      {children}
    </div>
  );
}

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
  title,
  className,
  compact,
}: {
  title: string;
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
        className="md:h-[15px] md:w-[15px] w-3 h-3 shrink-0"
      />
      <h3
        className={cn(
          "text-center font-larken font-light leading-[110%] text-darkblack",
          compact
            ? "max-w-[79.73%] text-sm text-base md:text-base lg:text-xl xl:text-2xl"
            : "text-sm text-base md:text-base lg:text-xl xl:text-2xl",
        )}
      >
        {title}
      </h3>
    </div>
  );
}

function GridFallback() {
  return (
    <div
      className="min-h-[460px] w-full animate-pulse bg-transparent sm:min-h-[520px]"
      aria-hidden
    />
  );
}

function AboutHandcraftedTileGridInner({ cards }: AboutHandcraftedTileGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const fallbackCards = aboutHandcraftedContent.cards;
  const cardByIndex = (index: number) =>
    cards.find((card) => card.layoutIndex === index)?.title ??
    fallbackCards[index]?.title ??
    fallbackCards[0]?.title ??
    "";

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    if (motionQuery.matches) {
      setRevealed(true);
      return;
    }

    const node = gridRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setRevealed(true);
        observer.disconnect();
      },
      { threshold: 0.15, rootMargin: "0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const tileProps = (row: number, col: number, colsInRow: number) => ({
    revealed,
    reducedMotion,
    delayMs: revealDelay(row, col, colsInRow),
  });

  return (
    <div ref={gridRef} className="flex flex-col gap-3">
      <div className="flex items-center justify-center gap-3">
        <AnimatedTile
          {...tileProps(0, 0, 5)}
          className="h-[132px] w-[111px] sm:h-[132px] sm:w-[130px] md:h-[130px] md:w-[130px] lg:h-[175px] lg:w-[175px] xl:h-[222px] xl:w-[222px]"
        >
          <CraftPhotoTile className="size-full" />
        </AnimatedTile>
        <AnimatedTile
          {...tileProps(0, 1, 5)}
          className="h-[132px] w-[111px] sm:h-[132px] sm:w-[130px] md:h-[130px] md:w-[130px] lg:h-[175px] lg:w-[175px] xl:h-[222px] xl:w-[222px]"
        >
          <CraftTextTile title={cardByIndex(1)} className="size-full" />
        </AnimatedTile>
        <AnimatedTile
          {...tileProps(0, 2, 5)}
          className="h-[132px] w-[111px] sm:h-[132px] sm:w-[130px] md:h-[130px] md:w-[130px] lg:h-[175px] lg:w-[175px] xl:h-[222px] xl:w-[222px]"
        >
          <CraftPhotoTile className="size-full" />
        </AnimatedTile>
        <AnimatedTile
          {...tileProps(0, 3, 5)}
          className="md:h-[130px] md:w-[130px] lg:h-[175px] lg:w-[175px] xl:h-[222px] xl:w-[222px] md:block hidden"
        >
          <CraftPhotoTile className="size-full" />
        </AnimatedTile>
        <AnimatedTile
          {...tileProps(0, 4, 5)}
          className="md:h-[130px] md:w-[130px] lg:h-[175px] lg:w-[175px] xl:h-[222px] xl:w-[222px] md:block hidden"
        >
          <CraftPhotoTile className="size-full" />
        </AnimatedTile>
      </div>

      <div className="flex items-center justify-center gap-3">
        <AnimatedTile
          {...tileProps(1, 0, 3)}
          className="h-[111px] w-[172px] sm:h-[132px] sm:w-[200px] md:h-[130px] md:w-[130px] lg:h-[175px] lg:w-[175px] xl:h-[222px] xl:w-[222px]"
        >
          <CraftPhotoTile className="size-full" />
        </AnimatedTile>
        <AnimatedTile
          {...tileProps(1, 1, 3)}
          className="md:h-[130px] md:w-[130px] lg:h-[175px] lg:w-[175px] xl:h-[222px] xl:w-[222px] md:block hidden"
        >
          <CraftTextTile
            title={cardByIndex(1)}
            className="size-full"
            compact
          />
        </AnimatedTile>
        <AnimatedTile
          {...tileProps(1, 2, 3)}
          className="h-[111px] w-[172px] sm:h-[132px] sm:w-[200px] md:h-[130px] md:w-[130px] lg:h-[175px] lg:w-[175px] xl:h-[222px] xl:w-[222px]"
        >
          <CraftPhotoTile className="size-full" />
        </AnimatedTile>
      </div>

      <div className="flex items-center justify-center gap-3">
        <AnimatedTile
          {...tileProps(2, 0, 3)}
          className="h-[132px] w-[111px] sm:h-[132px] sm:w-[130px] md:h-[130px] md:w-[130px] lg:h-[175px] lg:w-[175px] xl:h-[222px] xl:w-[222px]"
        >
          <CraftTextTile title={cardByIndex(0)} className="size-full" />
        </AnimatedTile>
        <AnimatedTile
          {...tileProps(2, 1, 3)}
          className="h-[132px] w-[111px] sm:h-[132px] sm:w-[130px] md:h-[130px] md:w-[130px] lg:h-[175px] lg:w-[175px] xl:h-[222px] xl:w-[222px]"
        >
          <CraftPhotoTile className="size-full" />
        </AnimatedTile>
        <AnimatedTile
          {...tileProps(2, 2, 3)}
          className="h-[132px] w-[111px] sm:h-[132px] sm:w-[130px] md:h-[130px] md:w-[130px] lg:h-[175px] lg:w-[175px] xl:h-[222px] xl:w-[222px]"
        >
          <CraftTextTile title={cardByIndex(2)} className="size-full" />
        </AnimatedTile>
      </div>
    </div>
  );
}

const AboutHandcraftedTileGrid = ({ cards }: AboutHandcraftedTileGridProps) => (
  <LazyInView
    fallback={<GridFallback />}
    className="min-h-[400px] sm:min-h-[520px]"
    rootMargin="120px 0px 80px 0px"
    threshold={0.01}
  >
    <AboutHandcraftedTileGridInner cards={cards} />
  </LazyInView>
);

export default AboutHandcraftedTileGrid;
