"use client";

import { PencilLine, Gem, Hammer, PackageCheck, type LucideIcon } from "lucide-react";
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
import { useMemo } from "react";

interface CraftsmanshipProcessProps {
  id?: string;
}

/** Figma 684:3024 — silk ripple texture behind the scroll-driven diamond. */
const CRAFTSMANSHIP_BACKGROUND = "/images/home/craftsmanship-bg.webp";

function CraftsmanshipSilkLayer({ variant }: { variant: "desktop" | "mobile" }) {
  if (variant === "desktop") {
    const spec = craftsmanshipProcessFigmaSpec.desktop.texture;

    return (
      <div
        className="absolute left-1/2 top-[calc(50%+0.08px)] hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center lg:flex"
      // style={{ height: spec.height, width: `max(100vw, ${spec.minSpan}px)` }}
      >
        <div className="rotate-90">
          <Image
            src={CRAFTSMANSHIP_BACKGROUND}
            alt=""
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
    // style={{ height: spec.height, width: `max(100vw, ${spec.minSpan}px)` }}
    >
      <div className="sm:rotate-90 rotate-180 test-2">
        <Image
          src={CRAFTSMANSHIP_BACKGROUND}
          alt=""
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

function CraftsmanshipBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <CraftsmanshipSilkLayer variant="mobile" />
      <CraftsmanshipSilkLayer variant="desktop" />
      <CraftsmanshipRadialLayer variant="mobile" />
      <CraftsmanshipRadialLayer variant="desktop" />
    </div>
  );
}

const stepIcons: LucideIcon[] = [PencilLine, Gem, Hammer, PackageCheck];

const CraftsmanshipProcess = ({ id }: CraftsmanshipProcessProps) => {
  const { data: editorialData, isLoading: isEditorialLoading } = useHomepageEditorialBlocks();

  const craftsmanship = useMemo(() => {
    const cmsSection =
      editorialData?.craftsmanshipSection ||
      editorialData?.homepage?.craftsmanshipSection;
    return resolveCraftsmanshipSection(cmsSection);
  }, [editorialData]);

  const { sectionTitle, steps, desktopImageUrl, mobileImageUrl, imageAlt } = craftsmanship;
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
          <CraftsmanshipBackground />
          <div className="container relative z-10 h-full">
            <div className="grid h-full grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12">
              <div className="lg:col-span-5 flex flex-col gap-8 xl:justify-start lg:justify-start xl:gap-[138px] lg:gap-20">
                <div className="h-10 w-72 bg-gray300 rounded mx-auto lg:mx-0" aria-hidden />
                <div className="space-y-12 md:space-y-16 relative">
                  <div className="h-24 w-full bg-gray300/70 rounded" aria-hidden />
                  <div className="h-24 w-full bg-gray300/50 rounded" aria-hidden />
                </div>
              </div>
              <div className="lg:col-span-7 relative h-auto flex items-center justify-center">
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
        <CraftsmanshipBackground />
        <div className="max-w-1920 mx-auto 2xl:px[60px] md:px-10 px-4 relative z-10 h-full">
          <div className="grid h-full grid-cols-1 lg:grid-cols-12 gap-6 md:gap-0 lg:gap-12">
            {/* Left column: title + steps */}
            <div className="xl:col-span-5 lg:col-span-6 flex flex-col xl:justify-start lg:justify-start xl:gap-[138px] lg:gap-20 gap-8 md:max-lg:portrait:gap-6">
              <ScrollReveal as="h2" delayMs={0} className="lg:text-5xl md:text-4xl text-32 text-black font-normal font-larken tracking-[0%] lg:text-left text-center">
                {sectionTitle}
              </ScrollReveal>

              {/* Active + next upcoming step (faded) */}
              <ol className="space-y-10 lg:space-y-16 relative md:max-lg:portrait:space-y-8">
                {steps.map((step, i) => {
                  const Icon = stepIcons[i] ?? PencilLine;
                  const isActiveStep = i === activeIndex;
                  const isNext = i === activeIndex + 1;
                  const isVisible = isActiveStep || isNext;
                  return (
                    <li
                      key={String(step.id ?? step.number ?? i)}
                      className="transition-all duration-700 ease-out lg:max-w-auto max-w-420 lg:mx-0 mx-auto mx-auto lg:px-0 px-3 flex flex-col lg:items-start items-center lg:justify-start justify-center gap-4"
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
                      <Icon
                        className={`transition-all duration-500 ${isActiveStep
                          ? "text-foreground md:h-7 md:w-7 h-5 w-5"
                          : "text-foreground h-6 w-6"
                          }`}
                        strokeWidth={1.25}
                        aria-hidden
                      />
                      <h3 className="text-base sm:text-xl md:text-2xl lg:text-32 font-normal tracking-[0%] leading-[100%] text-darkblack font-gill lg:text-left text-center">
                        {step.title || ""}
                      </h3>
                      {isActiveStep && (
                        <p className="text-base md:text-lg lg:text-xl font-light text-darkblack tracking-[1%] leading-[100%] font-gill animate-fade-in lg:text-left text-center">
                          {step.description || ""}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
            {/* Right column: 3D scroll-driven diamond */}
            <div
              className="xl:col-span-7 lg:col-span-6 relative h-auto flex items-center justify-center"
              style={{ perspective: "1200px", perspectiveOrigin: "center center" }}
            >
              <div className="lg:w-[550px] lg:h-[550px] lg:aspect-[550/550] md:w-[400px] md:h-[400px] md:aspect-[400/400] md:max-lg:portrait:w-[320px] md:max-lg:portrait:h-[320px] md:max-lg:portrait:aspect-square w-[400px] h-[400px] aspect-[400/400] h-auto will-change-transform"
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
