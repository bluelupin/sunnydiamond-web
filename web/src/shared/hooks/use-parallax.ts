import { useEffect, useRef } from "react";
import { registerParallax } from "@/shared/lib/parallaxManager";

/**
 * Lightweight parallax hook. Translates the target element on the Y axis based on
 * the section's position in the viewport. GPU-accelerated (transform only) and
 * throttled with a shared requestAnimationFrame loop. Honors prefers-reduced-motion
 * and skips work on coarse pointers / small screens for graceful fallback.
 */
export function useParallax<T extends HTMLElement = HTMLElement>(speed = 0.2) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches && window.innerWidth < 768;
    if (reduceMotion || isCoarse) return;

    const section: HTMLElement | null =
      el.parentElement?.closest("section") ?? el.parentElement;
    if (!section) return;

    return registerParallax(el, section, speed);
  }, [speed]);

  return ref;
}
