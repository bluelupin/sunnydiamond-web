"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import { resolveCmsMediaUrl, resolveCmsAltText } from "@/shared/utils/strapiMedia";
import { useFadeIn } from "@/shared/hooks/use-fade-in";
import { useParallax } from "@/shared/hooks/use-parallax";
import RightArrow from "@/assets/Icons/RightArrow";
import LeftArrow from "@/assets/Icons/LeftArrow";
import GiftIcon from "@/assets/Icons/GiftIcon";
import { useHomepageShoppingBlocks } from "@/hooks/homepage/useHomepageShoppingBlocks";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(price);

interface FeaturedCollectionSectionProps {
  id?: string;
}

const FeaturedCollectionSection = ({ id }: FeaturedCollectionSectionProps) => {
  const { data: shoppingData, isLoading: isShoppingLoading } = useHomepageShoppingBlocks();
  const featuredCollectionData = shoppingData?.homepage?.featuredCollectionSection || shoppingData?.featuredCollectionSection;
  const sectionTitle = featuredCollectionData?.sectionTitle ?? "";
  const ctaUrl = featuredCollectionData?.cta?.url ?? featuredCollectionData?.cta?.to ?? "";
  const ctaLabel = featuredCollectionData?.cta?.label ?? featuredCollectionData?.label?.label ?? "";
  const collectionDesktopBgUrl = useMemo(
    () => resolveCmsMediaUrl((featuredCollectionData as any)?.primaryImage?.desktopImage ?? (featuredCollectionData as any)?.image),
    [featuredCollectionData]
  );

  const collectionMobileBgUrl = useMemo(
    () => resolveCmsMediaUrl((featuredCollectionData as any)?.primaryImage?.mobileImage ?? (featuredCollectionData as any)?.image),
    [featuredCollectionData]
  );

  const bgAlt = useMemo(
    () =>
      resolveCmsAltText((featuredCollectionData as any)?.primaryImage?.desktopImage ?? (featuredCollectionData as any)?.image) ||
      resolveCmsAltText((featuredCollectionData as any)?.primaryImage?.mobileImage ?? (featuredCollectionData as any)?.image) ||
      sectionTitle ||
      "",
    [featuredCollectionData, sectionTitle]
  );

  const giftingBannerData = shoppingData?.homepage?.giftingBanner || shoppingData?.giftingBanner;
  const title = giftingBannerData?.title ?? "";
  const primaryCtaUrl =
    giftingBannerData?.primaryCta?.url ??
    giftingBannerData?.primaryCta?.to ??
    giftingBannerData?.cta?.url ??
    giftingBannerData?.cta?.to ??
    "";
  const primaryCtaLabel = giftingBannerData?.primaryCta?.label ?? giftingBannerData?.cta?.label ?? "";
  const secondaryCtaUrl =
    giftingBannerData?.secondaryCta?.url ??
    giftingBannerData?.secondaryCta?.to ??
    giftingBannerData?.secondary?.url ??
    giftingBannerData?.secondary?.to ??
    "";
  const secondaryCtaLabel =
    giftingBannerData?.secondaryCta?.label ??
    giftingBannerData?.secondary?.label ??
    "";

  const featured = shoppingData?.featuredCollectionSection ?? null;

  const giftDesktopUrl = useMemo(
    () => resolveCmsMediaUrl((giftingBannerData as any)?.image?.desktopImage ?? (giftingBannerData as any)?.image),
    [giftingBannerData]
  );

  const giftMobileUrl = useMemo(
    () => resolveCmsMediaUrl((giftingBannerData as any)?.image?.mobileImage ?? (giftingBannerData as any)?.image),
    [giftingBannerData]
  );

  const giftImageAlt = useMemo(
    () =>
      resolveCmsAltText((giftingBannerData as any)?.image?.desktopImage ?? (giftingBannerData as any)?.image) ||
      resolveCmsAltText((giftingBannerData as any)?.image?.mobileImage ?? (giftingBannerData as any)?.image) ||
      sectionTitle ||
      "",
    [giftingBannerData, sectionTitle]
  );
  const ref = useFadeIn();
  const parallaxRef = useParallax<HTMLDivElement>(0.18);

  const items = useMemo(() => {
    const products = Array.isArray(featured?.products) ? featured?.products : [];
    return products
      .map((p: any) => ({
        id: p?.id,
        name: p?.name ?? "",
        price: typeof p?.price === "number" ? p?.price : null,
        imageUrl: resolveCmsMediaUrl(p?.image ?? p?.image?.data?.attributes ?? p?.image),
      }))
      .filter((p: any) => Boolean(p.id) && Boolean(p.name) && Boolean(p.imageUrl));
  }, [featured?.products]);

  const total = items.length;
  const [index, setIndex] = useState(0);

  // Drag state
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

  // Cache track width via ResizeObserver so render never reads layout.
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

  const go = useCallback(
    (dir: -1 | 1) =>
      setIndex((i) => Math.min(Math.max(i + dir, 0), Math.max(total - 1, 0))),
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
      /* noop */
    }
    setIsDragging(false);
    setDragOffset(0);
    const threshold = Math.max(40, width * 0.15);
    if (deltaX <= -threshold && index < total - 1) go(1);
    else if (deltaX >= threshold && index > 0) go(-1);
  };

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!trackRef.current) return;
      if (document.activeElement !== trackRef.current) return;
      if (e.key === "ArrowRight" && index < total - 1) go(1);
      if (e.key === "ArrowLeft" && index > 0) go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, total]);

  if (isShoppingLoading) {
    return (
      <section id={id} ref={ref} aria-label="Alankara Collection and Gifting" className="bg-white" aria-busy="true">
        <div className="grid grid-cols-1 md:grid-cols-2 p-4 md:p-0">
          <div className="relative lg:h-700 md:h-550 h-auto overflow-hidden group bg-gray200/60" />
          <div className="md:bg-white bg-gray100 flex flex-col items-center justify-end text-center px-6 py-10 sm:py-12 md:py-14 lg:py-65 lg:h-700 md:h-550 h-auto overflow-hidden">
            <div className="w-60 max-w-md aspect-square bg-gray200/60 rounded" />
            <div className="mt-6 h-5 w-56 bg-gray200/60 rounded" />
            <div className="mt-3 h-6 w-28 bg-gray200/60 rounded" />
          </div>
          <div className="md:bg-giftingBg md:bg-white bg-right w-full bg-[length:100%] bg-gray100 bg-no-repeat flex flex-col items-center justify-center text-center py-16 sm:py-14 md:py-20 md:min-h-560 md:h-auto h-auto order-4 md:order-3">
            <div className="md:mt-12 md:mb-10 mb-6 h-10 w-72 bg-gray200/60 rounded" />
            <div className="h-12 w-44 bg-gray200/60 rounded" />
            <div className="md:mt-8 mt-6 h-4 w-56 bg-gray200/60 rounded" />
          </div>
          <div className="relative lg:h-700 md:h-auto h-80 overflow-hidden order-3 md:order-4 md:mt-0 mt-4 bg-gray200/60" />
        </div>
      </section>
    );
  }
  return (
    <section
      id={id}
      ref={ref}
      aria-label="Alankara Collection and Gifting"
      className="bg-white"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 p-4 md:p-0">
        {/* TL: Alankara Collection */}
        <div className="relative lg:h-700 md:h-550 min-h-[400px] overflow-hidden group">
          <ResponsiveImage
            desktopSrc={collectionDesktopBgUrl || ""}
            mobileSrc={collectionMobileBgUrl || ""}
            alt={bgAlt}
            priority
            width={collectionDesktopBgUrl ? 720 : 360}
            height={collectionDesktopBgUrl ? 700 : 320}
            quality={collectionDesktopBgUrl ? 90 : 85}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" aria-hidden />
          <div className="absolute inset-0 flex flex-col items-center justify-end md:gap-10 gap-8 px-6 md:px-10 lg:pb-74 md:pb-16 pb-10">
            <h2 className="lg:text-5xl md:text-4xl text-32 text-white font-normal font-larken tracking-[0%] text-center">
              {sectionTitle}
            </h2>
            <Link
              href={ctaUrl}
              className="inline-block text-white md:text-base text-sm font-gill tracking-[1.8%] uppercase font-normal border-b border-white/80 pb-2 hover:border-white"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>

        {/* TR: Draggable transparent ring carousel with scroll parallax */}
        {/* <div className="md:bg-white bg-gray100 flex flex-col items-center justify-end text-center px-6 py-10 sm:py-12 md:py-14 lg:py-65 lg:h-700 md:h-550 h-auto overflow-hidden">
          <div
            ref={parallaxRef}
            className="w-full flex flex-col items-center"
          >
            <div
              ref={trackRef}
              role="region"
              aria-roledescription="carousel"
              aria-label={sectionTitle}
              tabIndex={0}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              className={`relative md:w-full w-60 max-w-md aspect-square select-none touch-pan-y outline-none ${isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
              style={{ WebkitUserSelect: "none" }}
            >
              {items.map((p, i) => {
                const dragPct = dragOffset / trackWidthRef.current;
                const isActive = i === index;
                const offset = isActive ? -dragPct : 0;
                const opacity = isActive ? Math.max(0, 1 - Math.abs(dragPct) * 1.2) : 0;
                const translateX = offset * 70;
                return (
                  <div
                    key={String(p.id)}
                    aria-roledescription="slide"
                    aria-hidden={!isActive}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      transform: `translate3d(${translateX}%, 0, 0)`,
                      opacity,
                      transition: isDragging
                        ? "none"
                        : "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease",
                      pointerEvents: isActive ? "auto" : "none",
                      willChange: "transform, opacity",
                    }}
                  >
                    {p.imageUrl ? (
                      <OptimizedImage
                        src={p.imageUrl}
                        alt={p.name}
                        width={1024}
                        height={1024}
                        className="w-[78%] h-[78%] object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.18)]"
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>

            {items[index] && (
              <>
                <h3 className="md:mb-4 sm:mb-3 mb-2 text-base md:text-lg lg:text-xl text-darkblack font-light tracking-[1%] font-gill">
                  {items[index].name}
                </h3>
                <p className="md:mb-6 mb-8 text-base md:text-lg lg:text-xl text-darkblack font-normal tracking-[1%] font-gill">
                  <span aria-hidden className="mr-0.5">₹</span>
                  <span className="font-medium">
                    {typeof items[index].price === "number" ? formatPrice(items[index].price) : ""}
                  </span>
                </p>
                <Link
                  href={`/product/${items[index].id ?? ""}`}
                  className="group relative overflow-hidden inline-flex items-center justify-center border-[0.8px] border-darkblack text-darkblack md:text-base text-sm px-8 md:h-50 h-12 tracking-[1.8%] uppercase font-gill transition-colors duration-500"
                >
                  <span className="absolute inset-0 bg-darkblack origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100"></span>
                  <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                    Discover
                  </span>
                </Link>
                <div className="mt-6 flex items-center justify-center gap-6">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous product"
                    disabled={index === 0}
                    className={`text-black transition-opacity ${index === 0 ? "opacity-30 cursor-not-allowed" : "opacity-100"}`}
                  >
                    <LeftArrow className="md:w-8 md:h-8 w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next product"
                    disabled={index === total - 1}
                    className={`text-black transition-opacity ${index === total - 1 ? "opacity-30 cursor-not-allowed" : "opacity-100"}`}
                  >
                    <RightArrow className="md:w-8 md:h-8 w-6 h-6" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div> */}

        {/* BL: Gifting */}
        <div className="md:bg-giftingBg md:bg-white bg-right w-full bg-[length:100%] bg-gray100 bg-no-repeat flex flex-col items-center justify-center text-center py-16 sm:py-14 md:py-20 md:min-h-560 md:h-auto h-auto order-4 md:order-3">
          <GiftIcon className="text-creamColor w-24 md:flex hidden" />
          <h2 className="md:mt-12 md:mb-10 mb-6 lg:text-5xl md:text-4xl text-32 text-darkblack font-light font-gill tracking-[0%] leading-[100%] md:max-w-394 max-w-60 px-5">
            {title || "Gifting For Your Valentine (F)"}
          </h2>
          <Link
            href={primaryCtaUrl}
            className="group relative overflow-hidden inline-flex items-center justify-center border-[0.8px] border-darkblack text-darkblack md:text-base text-sm px-8 md:h-50 h-12 tracking-[1.8%] uppercase font-gill transition-colors duration-500"
          >
            <span className="absolute inset-0 bg-darkblack origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100"></span>
            <span className="relative z-10 group-hover:text-white transition-colors duration-500">
              {primaryCtaLabel || 'Shop Now (F)'}
            </span>
          </Link>
          <Link
            href={secondaryCtaUrl}
            className="md:mt-8 mt-6 inline-block text-darkblack md:text-base text-sm font-gill tracking-[1.8%] uppercase font-normal border-b border-darkblack pb-2"
          >
            {secondaryCtaLabel || 'Send a Gift Card Instead (F)'}
          </Link>
        </div>

        {/* BR: Couple holding hands */}
        <div className="relative lg:h-700 md:h-auto h-80 overflow-hidden order-3 md:order-4 md:mt-0 mt-4">
          <ResponsiveImage
            desktopSrc={giftDesktopUrl || ""}
            mobileSrc={giftMobileUrl}
            alt={giftImageAlt}
            priority
            width={1024}
            height={1024}
            quality={giftDesktopUrl ? 90 : 85}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollectionSection;
