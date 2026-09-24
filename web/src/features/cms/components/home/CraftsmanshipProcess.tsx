"use client";

import Image from "next/image";
import { useStepScroll } from "@/shared/hooks/use-step-scroll";
import { useHomepageEditorialBlocks } from "@/hooks/homepage/useHomepageEditorialBlocks";
import { isSectionActive } from "@/shared/utils/cmsSection";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import ScrollReveal from "@/shared/ui/ScrollReveal";
import { resolveCraftsmanshipSection } from "@/shared/utils/resolveCraftsmanshipSection";
import {
  craftsmanshipProcessFigmaSpec,
  craftsmanshipRadialGradientStyle,
} from "@/features/cms/data/craftsmanshipProcessFigmaSpec";
import { cn } from "@/shared/utils/cn";
import { useMemo } from "react";

interface CraftsmanshipProcessProps {
  id?: string;
}

/** Figma 684:3024 — silk ripple texture behind the scroll-driven diamond. */

function CraftsmanshipSilkLayer({
  variant,
  desktopSrc,
  mobileSrc,
  alt,
}: {
  variant: "desktop" | "mobile";
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
}) {
  const src = variant === "desktop" ? desktopSrc : mobileSrc;

  if (variant === "desktop") {
    const spec = craftsmanshipProcessFigmaSpec.desktop.texture;

    return (
      <div
        className="absolute left-1/2 top-[calc(50%+0.08px)] hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center lg:flex"
      >
        <div className="rotate-90">
          <Image
            src={src}
            alt={alt}
            width={spec.imageWidth}
            height={spec.imageHeight}
            className="max-w-none object-cover"
            style={{
              width: spec.imageWidth,
              height: `max(100vw, ${spec.minSpan}px)`,
            }}
            sizes="100vw"
          />
        </div>
      </div>
    );
  }

  const spec = craftsmanshipProcessFigmaSpec.mobile.texture;

  return (
    <div
      className="absolute left-1/2 top-0 flex -translate-x-1/2 items-center justify-center lg:hidden"
    >
      <div className="rotate-90">
        <Image
          src={src}
          alt={alt}
          width={spec.imageWidth}
          height={spec.imageHeight}
          className="h-screen w-[651px] max-w-none object-bottom md:max-lg:portrait:h-[85vh]"
          sizes="100vw"
        />
      </div>
    </div>
  );
}

function CraftsmanshipRadialLayer({ variant }: { variant: "desktop" | "mobile" }) {
  const spec =
    variant === "desktop"
      ? craftsmanshipProcessFigmaSpec.desktop
      : craftsmanshipProcessFigmaSpec.mobile;

  const visibility = variant === "desktop" ? "hidden lg:flex" : "flex lg:hidden";

  if (variant === "mobile") {
    const { radial } = craftsmanshipProcessFigmaSpec.mobile;
    const centerXPercent = (radial.centerX / radial.viewWidth) * 100;
    const centerYPercent = (radial.centerY / radial.viewHeight) * 100;
    const ellipseWidthPercent = (radial.ellipseWidth / radial.viewWidth) * 100;
    const ellipseHeightPercent = (radial.ellipseHeight / radial.viewHeight) * 100;

    return (
      <div
        className={`absolute inset-0 ${visibility}`}
        style={{
          backgroundImage: `radial-gradient(ellipse ${ellipseWidthPercent}% ${ellipseHeightPercent}% at ${centerXPercent}% ${centerYPercent}%, ${radial.from} 0%, ${radial.to} 100%)`,
        }}
        aria-hidden
      />
    );
  }

  return (
    <div
      className={`absolute left-1/2 top-1/2 ${visibility} -translate-x-1/2 -translate-y-1/2 items-center justify-center`}
      style={{ height: spec.radial.layerHeight, width: `max(100vw, ${spec.texture.minSpan}px)` }}
    >
      <div
        className="max-w-none rotate-90"
        style={{
          width: spec.radial.viewWidth,
          height: `max(100vw, ${spec.texture.minSpan}px)`,
          ...craftsmanshipRadialGradientStyle(spec.radial),
        }}
      />
    </div>
  );
}

function CraftsmanshipBackground({
  desktopSrc,
  mobileSrc,
  alt,
}: {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
}) {
  const hasBackground = Boolean(desktopSrc || mobileSrc);
  if (!hasBackground) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <CraftsmanshipSilkLayer variant="mobile" desktopSrc={desktopSrc} mobileSrc={mobileSrc} alt={alt} />
      <CraftsmanshipSilkLayer variant="desktop" desktopSrc={desktopSrc} mobileSrc={mobileSrc} alt={alt} />
      <CraftsmanshipRadialLayer variant="mobile" />
      <CraftsmanshipRadialLayer variant="desktop" />
    </div>
  );
}

function CraftsmanshipStepIcon({
  iconUrl,
  iconAlt,
  isActiveStep,
}: {
  iconUrl?: string;
  iconAlt?: string;
  isActiveStep: boolean;
}) {
  if (!iconUrl) return null;

  return (
    <Image
      src={iconUrl}
      alt={iconAlt || ""}
      width={28}
      height={28}
      className={cn(
        "shrink-0 object-contain transition-all duration-500",
        isActiveStep ? "md:h-7 md:w-7 h-5 w-5" : "h-6 w-6",
      )}
      aria-hidden={!iconAlt}
    />
  );
}

const CraftsmanshipProcess = ({ id }: CraftsmanshipProcessProps) => {
  const { data: editorialData, isLoading: isEditorialLoading } = useHomepageEditorialBlocks();

  const craftsmanship = useMemo(
    () => resolveCraftsmanshipSection(editorialData?.craftsmanshipSection),
    [editorialData?.craftsmanshipSection],
  );

  const { sectionTitle, steps, desktopImageUrl, mobileImageUrl, imageDesktopAlt, imageMobileAlt, imageAlt, backgroundDesktopUrl, backgroundMobileUrl, backgroundAlt } = craftsmanship;
  const silkDesktopSrc = backgroundDesktopUrl || backgroundMobileUrl || "";
  const silkMobileSrc = backgroundMobileUrl || backgroundDesktopUrl || "";
  const silkAlt = backgroundAlt;
  const stepCount = steps.length;
  const hasDiamondImage = Boolean(desktopImageUrl || mobileImageUrl);
  const resolvedDesktopImage = desktopImageUrl ?? mobileImageUrl;
  const resolvedMobileImage = mobileImageUrl ?? desktopImageUrl;
  const { activeIndex, progress, containerRef } = useStepScroll(Math.max(stepCount, 1));

  // Scroll-driven 3D rotation: combines tilt (X), spin (Y), and a touch of Z roll
  const rotateY = progress * 540;
  const rotateX = 18 - progress * 36;
  const rotateZ = Math.sin(progress * Math.PI * 2) * 8;

  if (!isSectionActive(craftsmanship.isActive)) {
    return null;
  }

  if (!isEditorialLoading && (!sectionTitle.trim() || stepCount === 0)) {
    return null;
  }

  if (isEditorialLoading) {
    return (
      <section
        id={id}
        ref={containerRef}
        style={{ height: `calc(2 * var(--craftsmanship-vh-unit, 100vh))` }}
        aria-label="Craftsmanship"
        className="craftsmanship-process-section [--craftsmanship-vh-unit:100vh] md:max-lg:portrait:[--craftsmanship-vh-unit:72vh] bg-gray200 py-16 md:py-0 md:pt-20 md:max-lg:portrait:pt-12"
        aria-busy="true"
      >
        <div className="sticky md:top-24 top-10 h-screen overflow-hidden bg-gray200 md:max-lg:portrait:h-[85vh]">
          <CraftsmanshipBackground
            desktopSrc={silkDesktopSrc}
            mobileSrc={silkMobileSrc}
            alt={silkAlt}
          />
          <div className="container relative z-10 h-full">
            <div className="flex h-full flex-col lg:grid lg:grid-cols-12 lg:gap-12">
              <div className="flex shrink-0 flex-col gap-8 lg:col-span-5 xl:justify-start lg:justify-start xl:gap-[138px] lg:gap-20">
                <div className="h-10 w-72 bg-gray300 rounded mx-auto lg:mx-0" aria-hidden />
                <div className="space-y-12 md:space-y-16 relative">
                  <div className="h-24 w-full bg-gray300/70 rounded" aria-hidden />
                  <div className="h-24 w-full bg-gray300/50 rounded" aria-hidden />
                </div>
              </div>
              <div className="relative mt-auto flex flex-1 items-end justify-center lg:col-span-7 lg:mt-0 lg:items-center">
                <div className="w-[80%] aspect-square bg-gray300/70 rounded-full" aria-hidden />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      ref={containerRef}
      style={{ height: `calc(${stepCount + 1} * var(--craftsmanship-vh-unit, 100vh))` }}
      aria-label={sectionTitle}
      className="craftsmanship-process-section [--craftsmanship-vh-unit:100vh] md:max-lg:portrait:[--craftsmanship-vh-unit:72vh] bg-gray200 py-16 md:py-0 md:pt-20 md:max-lg:portrait:pt-12"
    >
      <div className="sticky lg:top-24 top-10 h-screen overflow-hidden bg-gray200 md:max-lg:portrait:h-[85vh]">
        <CraftsmanshipBackground
          desktopSrc={silkDesktopSrc}
          mobileSrc={silkMobileSrc}
          alt={silkAlt}
        />
        <div className="max-w-1920 mx-auto 2xl:px[60px] md:px-10 px-4 relative z-10 h-full">
          <div className="flex h-full flex-col lg:grid lg:grid-cols-12 lg:gap-12">
            {/* Title + steps — top on mobile, left on desktop */}
            <div className="flex shrink-0 flex-col gap-8 md:max-lg:portrait:gap-6 lg:col-span-6 xl:col-span-5 xl:justify-start lg:justify-start xl:gap-[138px] lg:gap-20">
              <ScrollReveal as="h2" delayMs={0} className="lg:text-5xl md:text-4xl text-32 text-black font-normal font-larken tracking-[0%] lg:text-left text-center">
                {sectionTitle}
              </ScrollReveal>

              {/* Active + next upcoming step (faded) */}
              <ol className="relative space-y-10 md:max-lg:portrait:space-y-8 lg:space-y-16">
                {steps.map((step, i) => {
                  const isActiveStep = i === activeIndex;
                  const isNext = i === activeIndex + 1;
                  const isVisible = isActiveStep || isNext;
                  return (
                    <li
                      key={String(step.id ?? step.number ?? i)}
                      className="mx-auto flex max-w-420 flex-col items-center justify-center gap-3 px-3 transition-all duration-700 ease-out lg:mx-0 lg:items-start lg:justify-start lg:gap-4 lg:px-0"
                      style={{
                        opacity: isActiveStep ? 1 : isNext ? 0.1 : 0,
                        maxHeight: isVisible ? "320px" : "0px",
                        marginTop: isVisible ? undefined : 0,
                        marginBottom: isVisible ? undefined : 0,
                        overflow: "hidden",
                        transform: isActiveStep
                          ? "translateY(0)"
                          : isNext
                            ? "translateY(8px)"
                            : "translateY(20px)",
                        pointerEvents: isVisible ? "auto" : "none",
                      }}
                      aria-current={isActiveStep ? "step" : undefined}
                      aria-hidden={!isVisible}
                    >
                      <CraftsmanshipStepIcon
                        iconUrl={step.iconUrl}
                        iconAlt={step.iconAlt}
                        isActiveStep={isActiveStep}
                      />
                      <h3 className="text-center font-gill text-base font-normal leading-[100%] tracking-[0%] text-darkblack sm:text-xl md:text-2xl lg:text-left lg:text-32">
                        {step.title || ""}
                      </h3>
                      {isActiveStep ? (
                        <p className="animate-fade-in text-center font-gill text-base font-light leading-[100%] tracking-[1%] text-gray500 md:text-lg lg:text-left lg:text-xl lg:text-darkblack">
                          {step.description || ""}
                        </p>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            </div>
            {/* Diamond — bottom on mobile, right on desktop */}
            <div
              className="relative mt-auto flex min-h-0 flex-1 items-end justify-center pb-2 pt-4 sm:pb-4 lg:col-span-6 lg:mt-0 lg:items-center lg:pb-0 lg:pt-0 xl:col-span-7"
              style={{ perspective: "1200px", perspectiveOrigin: "center center" }}
            >
              <div
                className="aspect-square h-auto w-[min(72vw,280px)] will-change-transform sm:w-[min(68vw,320px)] md:h-[400px] md:w-[400px] md:aspect-[400/400] md:max-lg:portrait:h-[320px] md:max-lg:portrait:w-[320px] md:max-lg:portrait:aspect-square lg:h-[550px] lg:w-[550px] lg:aspect-[550/550]"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
                  transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                  filter: "drop-shadow(0 30px 50px hsl(var(--foreground) / 0.18))",
                }}
              >
                {hasDiamondImage && resolvedDesktopImage && resolvedMobileImage && (
                  <ResponsiveImage
                    desktopSrc={resolvedDesktopImage}
                    mobileSrc={resolvedMobileImage}
                    alt={imageAlt}
                    desktopAlt={imageDesktopAlt}
                    mobileAlt={imageMobileAlt}
                    width={resolvedDesktopImage ? 550 : 550}
                    height={resolvedMobileImage ? 400 : 400}
                    quality={75}
                    className="w-full h-h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CraftsmanshipProcess;
