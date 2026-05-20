import { useEffect, useRef } from "react";

/**
 * Lightweight parallax hook. Translates the target element on the Y axis based on
 * the section's position in the viewport. GPU-accelerated (transform only) and
 * throttled with requestAnimationFrame. Honors prefers-reduced-motion and skips
 * work on coarse pointers / small screens for graceful fallback.
 *
 * Reflow-safe: caches the parent section once, gates work via IntersectionObserver,
 * and performs all reads before writes inside a single rAF tick.
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

    let frame = 0;
    let ticking = false;
    let inView = false;

    const update = () => {
      ticking = false;
      if (!inView) return;
      // READ
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      const y = -progress * speed * 100;
      // WRITE
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      frame = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? false;
        if (inView) onScroll();
      },
      { rootMargin: "100px 0px" }
    );
    io.observe(section);

    el.style.willChange = "transform";
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      el.style.willChange = "";
    };
  }, [speed]);

  return ref;
}
