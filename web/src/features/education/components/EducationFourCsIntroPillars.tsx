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
    <div ref={ref} className="flex flex-wrap items-center justify-center gap-y-2 font-gill lg:text-2xl md:text-xl text-base leading-110 text-darkblack lg:flex-nowrap lg:gap-x-8 md:gap-x-6 gap-3">
      {pillars.map((pillar, index) => {
        const labelOrder = revealOrder++;
        const isLast = index === pillars.length - 1;

        return (
          <Fragment key={pillar}>
            <span className={revealClassName(labelOrder)} style={revealStyle(labelOrder)}>
              {pillar}
            </span>

            {!isLast ? (
              <Image
                src="/images/education/scroll-arrow.svg"
                alt="Scroll arrow"
                width={24}
                height={23}
                className={cn(
                  educationScrollArrowClassName,
                  "shrink-0",
                  revealClassName(revealOrder),
                )}
                style={revealStyle(revealOrder++)}
                aria-hidden
              />
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
};

export default EducationFourCsIntroPillars;
