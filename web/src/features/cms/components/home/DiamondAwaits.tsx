 "use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { homeContent } from "@/features/cms/data/content";
import { products as allProducts, type Product } from "@/features/products/data/products";
import { useFadeIn } from "@/shared/hooks/use-fade-in";
import type { StaticImageData } from "next/image";

import ringTransparent from "@/assets/section5-image1.avif";
import necklaceTransparent from "@/assets/section5-image1.avif";
import earringsTransparent from "@/assets/section5-image1.avif";
import braceletTransparent from "@/assets/section5-image1.avif";
import LeftArrow from "@/assets/Icons/LeftArrow";
import RightArrow from "@/assets/Icons/RightArrow";

const transparentByCategory: Record<string, string | StaticImageData> = {
  Rings: ringTransparent,
  Necklaces: necklaceTransparent,
  Earrings: earringsTransparent,
  Bracelets: braceletTransparent,
};

const getTransparent = (p: Product) =>
  transparentByCategory[p.category] ?? p.image;

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(price);

const DiamondAwaits = ({ id }: { id?: string }) => {
  const { diamondAwaits } = homeContent;
  const ref = useFadeIn();

  const items: Product[] = useMemo(
    () =>
      diamondAwaits.productIds
        .map((pid) => allProducts.find((p) => p.id === pid))
        .filter((p): p is Product => Boolean(p)),
    [diamondAwaits.productIds]
  );

  const total = items.length;

  // Start from second item
  const [index, setIndex] = useState(1);

  const trackRef = useRef<HTMLDivElement>(null);
  const trackWidthRef = useRef(1);

  const dragState = useRef({
    active: false,
    startX: 0,
    deltaX: 0,
    pointerId: 0,
    width: 0,
  });

  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (total <= 1) {
      setIndex(0);
    }
  }, [total]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    trackWidthRef.current = el.clientWidth || 1;

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;

      if (w) trackWidthRef.current = w;
    });

    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  // Infinite slider
  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((prev) => {
        if (dir === 1) {
          return (prev + 1) % total;
        }

        return (prev - 1 + total) % total;
      });
    },
    [total]
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;

    trackRef.current.setPointerCapture(e.pointerId);

    dragState.current = {
      active: true,
      startX: e.clientX,
      deltaX: 0,
      pointerId: e.pointerId,
      width: trackWidthRef.current || trackRef.current.clientWidth || 1,
    };

    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;

    const dx = e.clientX - dragState.current.startX;

    dragState.current.deltaX = dx;

    setDragOffset(dx);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;

    const { deltaX, width } = dragState.current;

    dragState.current.active = false;

    try {
      trackRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      //
    }

    setIsDragging(false);
    setDragOffset(0);

    const threshold = Math.max(40, width * 0.15);

    // Infinite swipe
    if (deltaX <= -threshold) go(1);
    else if (deltaX >= threshold) go(-1);
  };

  if (total === 0) return null;

  const dragPct = trackWidthRef.current
    ? dragOffset / trackWidthRef.current
    : 0;

  return (
    <section
      id={id}
      ref={ref}
      className="bg-gray200 py-6 sm:py-10 md:py-16 lg:py-20 overflow-hidden h-auto flex flex-col items-center justify-center"
      aria-label="Featured diamond carousel"
    >
      {/* Heading */}
      <div className="text-center md:max-w-2xl sm:max-w-xl max-w-[350px] mx-auto md:mb-10 sm:mb-8 mb-6 px-5">
        <h2 className="md:mb-5 mb-3 text-foreground lg:text-5xl md:text-4xl text-[32px] font-larken font-light tracking-[0%] leading-[100%] text-darkblack text-center whitespace-nowrap">
          {diamondAwaits.title}
        </h2>

        <p className="text-base md:text-lg lg:text-xl text-darkblack font-light font-gill tracking-[1%] leading-[100%] text-center">
          {diamondAwaits.subtitle}
        </p>
      </div>

      {/* Slider */}
      <div className="relative w-full">
        <div
          ref={trackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={diamondAwaits.title}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={`relative w-full mx-auto select-none touch-pan-y outline-none h-[250px] sm:h-[310px] md:h-[350px] lg:h-[336px] ${isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          style={{ WebkitUserSelect: "none" }}
        >
          {items.map((p, i) => {
            // Infinite distance calculation
            let dist = i - index;

            if (dist > total / 2) dist -= total;
            if (dist < -total / 2) dist += total;

            dist -= dragPct;

            const absDist = Math.abs(dist);

            if (absDist > 2.2) return null;

            const translateXVw = dist * 47;
            const scale = Math.max(0.7, 1 - absDist * 0.18);
            const opacity = Math.max(0, 1 - absDist * 0.55);

            const isActive = i === index;

            const zIndex = 100 - Math.round(absDist * 10);

            return (
              <div
                key={p.id}
                aria-roledescription="slide"
                aria-hidden={!isActive}
                className="absolute top-0 left-1/2 h-full w-[80vw] sm:w-[55vw] md:w-[42vw] lg:w-[36vw] -translate-x-1/2 flex flex-col items-center justify-start"
                style={{
                  transform: `translate3d(calc(-50% + ${translateXVw}vw), 0, 0) scale(${scale})`,
                  opacity,
                  zIndex,
                  transition: isDragging
                    ? "none"
                    : "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease",
                  pointerEvents: isActive ? "auto" : "none",
                  willChange: "transform, opacity",
                  filter: isActive ? "none" : "blur(2px)",
                }}
              >
                <Link
                  href={`/product/${p.id}`}
                  className="block w-full overflow-hidden group md:h-278 h-206"
                  aria-label={`View ${p.name}`}
                  draggable={false}
                  onClick={(e) => {
                    if (Math.abs(dragState.current.deltaX) > 5)
                      e.preventDefault();

                    if (!isActive) e.preventDefault();
                  }}
                  tabIndex={isActive ? 0 : -1}
                >
                  <OptimizedImage
                    src={getTransparent(p)}
                    alt={p.name}
                    width={1200}
                    height={1200}
                    priority={isActive}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.02] pointer-events-none"
                  />
                </Link>

                <div
                  className="mt-4 flex flex-col items-center text-center"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transition: "opacity 0.4s ease",
                  }}
                >
                  <h3 className="md:mb-4 sm:mb-3 mb-2 text-base md:text-lg lg:text-xl text-darkblack font-light font-gill tracking-[1%] leading-[100%]">
                    {p.name}
                  </h3>

                  <p className="md:mb-6 sm:mb-5 mb-4 text-base md:text-lg lg:text-xl text-darkblack font-normal tracking-[1%] font-gill">
                    <span aria-hidden className="mr-0.5">
                      ₹
                    </span>

                    <span className="font-medium">
                      {formatPrice(p.price)}
                    </span>
                  </p>

                  <Link
                    href={`/product/${p.id}`}
                    tabIndex={isActive ? 0 : -1}
                    className="group relative overflow-hidden inline-flex items-center justify-center border-[0.8px] border-darkblack text-darkblack md:text-base text-sm px-8 md:h-50 h-12 tracking-[1.8%] uppercase font-gill transition-colors duration-500"
                  >
                    <span className="absolute inset-0 bg-darkblack origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100"></span>

                    <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                      {diamondAwaits.cta.label}
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="md:mt-12 mt-8 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous"
            className="text-black transition-opacity hover:opacity-70"
          >
            <LeftArrow className="md:w-8 md:h-8 w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next"
            className="text-black transition-opacity hover:opacity-70"
          >
            <RightArrow className="md:w-8 md:h-8 w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default DiamondAwaits;
