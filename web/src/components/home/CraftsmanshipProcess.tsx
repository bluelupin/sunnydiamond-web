 "use client";

import { PencilLine, Gem, Hammer, PackageCheck, type LucideIcon } from "lucide-react";
import OptimizedImage from "@/components/shared/OptimizedImage";
import { homeContent } from "@/data/content";
import { useStepScroll } from "@/hooks/use-step-scroll";
import craftsmanshipDiamond from "@/assets/craftsmanship-diamond-3d.png";

const stepIcons: LucideIcon[] = [PencilLine, Gem, Hammer, PackageCheck];

const CraftsmanshipProcess = ({ id }: { id?: string }) => {
  const { craftsmanship } = homeContent;
  const stepCount = craftsmanship.steps.length;
  const { activeIndex, progress, containerRef } = useStepScroll(stepCount);

  // Scroll-driven 3D rotation: combines tilt (X), spin (Y), and a touch of Z roll
  const rotateY = progress * 540; // strong horizontal spin
  const rotateX = 18 - progress * 36; // subtle tilt from +18 to -18
  const rotateZ = Math.sin(progress * Math.PI * 2) * 8; // gentle wobble

  return (
    <section
      id={id}
      ref={containerRef}
      style={{ height: `${(stepCount + 1) * 100}vh` }}
      aria-label={craftsmanship.title}
      className="bg-gray200 bg-gray200 pt-10 sm:pt-16 md:pt-20"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-gray200">
       <div className="w-full max-w-[1440px] mx-auto h-full px-5 md:px-8 lg:px-12">
          <div className="grid h-full grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12">
            {/* Left column: title + steps */}
            <div className="lg:col-span-5 flex flex-col xl:justify-start lg:justify-start xl:gap-[138px] lg:gap-20">
              <h2 className="lg:text-5xl md:text-4xl text-32 text-black font-normal font-larken tracking-[0%] lg:text-left text-center">
                {craftsmanship.title}
              </h2>

              {/* Active + next upcoming step (faded) */}
              <ol className="space-y-12 md:space-y-16 relative">
                {craftsmanship.steps.map((step, i) => {
                  const Icon = stepIcons[i] ?? PencilLine;
                  const isActive = i === activeIndex;
                  const isNext = i === activeIndex + 1;
                  const isVisible = isActive || isNext;
                  return (
                    <li
                      key={step.number}
                      className="transition-all duration-700 ease-out lg:max-w-auto max-w-420 lg:mx-0 mx-auto mx-auto lg:px-0 px-3 flex flex-col lg:items-start items-center lg:justify-start justify-center gap-4"
                      style={{
                        opacity: isActive ? 1 : isNext ? 0.1 : 0,
                        maxHeight: isVisible ? "320px" : "0px",
                        marginTop: isVisible ? undefined : 0,
                        marginBottom: isVisible ? undefined : 0,
                        overflow: "hidden",
                        transform: isActive
                          ? "translateY(0)"
                          : isNext
                            ? "translateY(8px)"
                            : "translateY(20px)",
                        pointerEvents: isVisible ? "auto" : "none",
                      }}
                      aria-current={isActive ? "step" : undefined}
                      aria-hidden={!isVisible}
                    >
                      <Icon
                        className={`transition-all duration-500 ${isActive
                          ? "text-foreground md:h-7 md:w-7 h-5 w-5"
                          : "text-foreground h-6 w-6"
                          }`}
                        strokeWidth={1.25}
                        aria-hidden
                      />
                      <h3 className="text-base sm:text-xl md:text-2xl lg:text-28 font-normal tracking-[0%] leading-[100%] text-darkblack font-gill lg:text-left text-center">
                        {step.title}
                      </h3>
                      {isActive && (
                        <p className="text-base md:text-lg lg:text-xl font-light text-darkblack tracking-[1%] leading-[100%] font-gill animate-fade-in lg:text-left text-center">
                          {step.description}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Right column: 3D scroll-driven diamond */}
            <div
             className="lg:col-span-7 relative h-auto flex items-center justify-center"
              style={{ perspective: "1200px", perspectiveOrigin: "center center" }}
            >
              <div
                className="w-[80%] h-auto will-change-transform"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
                  transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
                  filter: "drop-shadow(0 30px 50px hsl(var(--foreground) / 0.18))",
                }}
              >
                <OptimizedImage
                  src={craftsmanshipDiamond}
                  alt="Brilliant cut diamond rendered in 3D"
                  width={1280}
                  height={1280}
                  className="w-full h-auto object-contain"

                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CraftsmanshipProcess;
