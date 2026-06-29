"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { observeScrollReveal } from "@/shared/lib/scrollRevealObserver";
import { cn } from "@/shared/utils/cn";
import { educationFourCsIntroSpec, educationPageImages } from "../data/content";

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

  return (
    <div ref={ref} className={spec.pillarsClassName}>
      {pillars.map((pillar, index) => (
        <span
          key={pillar}
          className={cn(
            spec.pillarItemClassName,
            !reducedMotion &&
              "motion-safe:transition-[opacity,transform] motion-safe:duration-700 motion-safe:ease-reveal",
            reducedMotion || visible
              ? "translate-x-0 opacity-100"
              : "-translate-x-4 opacity-0",
          )}
          style={
            !reducedMotion
              ? { transitionDelay: visible ? `${index * STAGGER_MS}ms` : "0ms" }
              : undefined
          }
        >
          {index > 0 ? (
            <Image
              src={educationPageImages.star}
              alt=""
              width={16}
              height={16}
              className="size-4"
              aria-hidden
            />
          ) : null}
          {pillar}
        </span>
      ))}
    </div>
  );
};

export default EducationFourCsIntroPillars;
