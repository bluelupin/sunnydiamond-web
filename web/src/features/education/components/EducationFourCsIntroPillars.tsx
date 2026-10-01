"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { observeScrollReveal } from "@/shared/lib/scrollRevealObserver";
import { cn } from "@/shared/utils/cn";
import {
  educationFourCsIntroSpec,
  educationScrollArrowClassName,
} from "../data/content";

const STAGGER_MS = 120;
const spec = educationFourCsIntroSpec;

type EducationFourCsIntroPillarsProps = {
  pillars: readonly string[];
};

const EducationFourCsIntroPillars = ({ pillars }: EducationFourCsIntroPillarsProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReducedMotion(true);
      setVisible(true);
      return;
    }

    return observeScrollReveal(node, () => setVisible(true), {
      threshold: 0.12,
      rootMargin: "0px 0px -6% 0px",
    });
  }, []);

  const revealClassName = (order: number) =>
    cn(
      !reducedMotion &&
      "motion-safe:transition-[opacity,transform] motion-safe:duration-700 motion-safe:ease-reveal",
      reducedMotion || visible ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0",
    );

  const revealStyle = (order: number) =>
    !reducedMotion
      ? { transitionDelay: visible ? `${order * STAGGER_MS}ms` : "0ms" }
      : undefined;

  let revealOrder = 0;

  return (
    <div ref={ref} className="flex flex-wrap items-center justify-center gap-y-2 font-gill lg:text-2xl md:text-xl text-base leading-110 text-darkblack lg:flex-nowrap gap-x-6 gap-3">
      {pillars.map((pillar, index) => {
        const labelOrder = revealOrder++;
        const isLast = index === pillars.length - 1;

        return (
          <Fragment key={pillar}>
            <span className={revealClassName(labelOrder)} style={revealStyle(labelOrder)}>
              {pillar}
            </span>
            {!isLast ? (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                  className={cn(
                    educationScrollArrowClassName,
                    "shrink-0",
                    revealClassName(revealOrder),
                  )}
                  style={revealStyle(revealOrder++)}
                  aria-hidden>
                  <path d="M8 0L8.47664 3.07107C8.83287 5.36635 10.6336 7.16713 12.9289 7.52336L16 8L12.9289 8.47664C10.6336 8.83287 8.83287 10.6336 8.47664 12.9289L8 16L7.52336 12.9289C7.16713 10.6336 5.36635 8.83287 3.07108 8.47664L0 8L3.07107 7.52336C5.36635 7.16713 7.16713 5.36635 7.52336 3.07108L8 0Z" fill="#0A0A0A" />
                </svg>
                {/* <Image
                  src="/images/education/scroll-arrow-black.svg"
                  alt="Scroll arrow"
                  width={16}
                  height={16}
                  className={cn(
                    educationScrollArrowClassName,
                    "shrink-0",
                    revealClassName(revealOrder),
                  )}
                  style={revealStyle(revealOrder++)}
                  aria-hidden
                /> */}
              </>
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
};

export default EducationFourCsIntroPillars;
