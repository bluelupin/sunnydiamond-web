"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type TransitionEvent,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import AppStatusToast, { appStatusToastDurationMs } from "@/shared/ui/AppStatusToast";
import { useToast } from "@/shared/hooks/use-toast";
import { useAuth } from "@/features/auth/context/AuthContext";
import { getLoginHrefForReturn } from "@/features/auth/utils/authNavigation";
import { saveCustomerCreationClient } from "@/services/customer/customer-saved-creations.client";
import { bespokeFeaturedStoryModalFigmaSpec } from "@/features/bespoke/data/content";

const spec = bespokeFeaturedStoryModalFigmaSpec;

type FeaturedStoryModalImage = {
  src: string;
  alt: string;
};

type FeaturedStoryModalSlide = {
  documentId?: string;
  src: string;
  alt: string;
  modalTitle: string;
  modalDescription: string;
  modalImages: readonly FeaturedStoryModalImage[];
};

type BespokeFeaturedStoryModalProps = {
  open: boolean;
  slide: FeaturedStoryModalSlide | null;
  modalCtaLabel: string;
  modalCtaHref: string;
  initialImageIndex?: number;
  elevated?: boolean;
  onClose: () => void;
};

const useFeaturedStoryModalEffects = (open: boolean, onClose: () => void) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);
};

type FeaturedStoryModalCarouselProps = {
  images: readonly FeaturedStoryModalImage[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
};

const FeaturedStoryModalCarousel = ({
  images,
  activeIndex,
  onActiveIndexChange,
}: FeaturedStoryModalCarouselProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, startX: 0, deltaX: 0, moved: false });
  const activeIndexRef = useRef(activeIndex);

  const [viewportWidth, setViewportWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);

  activeIndexRef.current = activeIndex;

  const canSlide = images.length > 1;

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateWidth = () => {
      setViewportWidth(viewport.offsetWidth);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(viewport);

    return () => observer.disconnect();
  }, []);

  const goToIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= images.length || index === activeIndexRef.current) return;

      setDragOffset(0);
      setEnableTransition(true);
      onActiveIndexChange(index);
    },
    [images.length, onActiveIndexChange],
  );

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!canSlide) return;
    if ((event.target as HTMLElement).closest("button")) return;

    trackRef.current?.setPointerCapture(event.pointerId);
    dragState.current = { active: true, startX: event.clientX, deltaX: 0, moved: false };
    setIsDragging(true);
    setEnableTransition(false);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    const deltaX = event.clientX - dragState.current.startX;
    if (Math.abs(deltaX) > 4) {
      dragState.current.moved = true;
    }
    dragState.current.deltaX = deltaX;
    setDragOffset(deltaX);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;

    const { deltaX, moved } = dragState.current;
    dragState.current.active = false;

    try {
      trackRef.current?.releasePointerCapture(event.pointerId);
    } catch {
      /* noop */
    }

    setIsDragging(false);

    if (!moved) {
      setDragOffset(0);
      setEnableTransition(true);
      return;
    }

    if (deltaX <= -spec.swipeThresholdPx) {
      goToIndex(Math.min(activeIndexRef.current + 1, images.length - 1));
    } else if (deltaX >= spec.swipeThresholdPx) {
      goToIndex(Math.max(activeIndexRef.current - 1, 0));
    } else {
      setDragOffset(0);
      setEnableTransition(true);
    }
  };

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== "transform") return;
    setEnableTransition(true);
    setDragOffset(0);
  };

  const trackOffset = viewportWidth > 0 ? -activeIndex * viewportWidth + dragOffset : 0;

  return (
    <div ref={viewportRef} className="relative h-full min-h-0 w-full overflow-hidden max-md:w-full">
      <div
        ref={trackRef}
        className={cn(
          "h-full overflow-hidden",
          canSlide && (isDragging ? "cursor-grabbing" : "cursor-grab"),
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className="flex h-full touch-none select-none will-change-transform"
          style={{
            transform: canSlide ? `translate3d(${trackOffset}px, 0, 0)` : undefined,
            transition: enableTransition ? `transform ${spec.slideDurationMs}ms ease-out` : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {images.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              className="relative h-full shrink-0"
              style={{ width: viewportWidth > 0 ? viewportWidth : "100%" }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 767px) 100vw, 480px"
                className="object-cover object-center"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

type FeaturedStoryModalPaginationProps = {
  images: readonly FeaturedStoryModalImage[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

const FeaturedStoryModalPagination = ({
  images,
  activeIndex,
  onSelect,
}: FeaturedStoryModalPaginationProps) => {
  if (images.length <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {images.map((image, index) => {
        const isActive = index === activeIndex;

        if (isActive) {
          return (
            <span
              key={`${image.src}-${index}-active`}
              aria-hidden
              className="block h-1 rounded-[24px] bg-white transition-all duration-300"
              style={{ width: spec.paginationActiveWidth }}
            />
          );
        }

        return (
          <button
            key={`${image.src}-${index}`}
            type="button"
            aria-label={`View image ${index + 1}`}
            onClick={() => onSelect(index)}
            className="size-2 rounded-full bg-neutral300 transition-colors hover:bg-white"
          />
        );
      })}
    </div>
  );
};

type FeaturedStoryModalPanelProps = {
  slide: FeaturedStoryModalSlide;
  modalCtaLabel: string;
  modalCtaHref: string;
  initialImageIndex?: number;
  onClose: () => void;
  onShowStatusToast: (message: string) => void;
};

const FeaturedStoryModalPanel = ({
  slide,
  modalCtaLabel,
  initialImageIndex = 0,
  onClose,
  onShowStatusToast,
}: FeaturedStoryModalPanelProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { status } = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(initialImageIndex);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setActiveImageIndex(initialImageIndex);
  }, [slide.src, initialImageIndex]);

  const handleSaveInspiration = async () => {
    const creationDocumentId = slide.documentId?.trim();
    if (!creationDocumentId) {
      toast({
        title: "Could not save inspiration",
        description: "This creation is missing a CMS id. Please try another story.",
      });
      return;
    }

    // Wait for auth hydration — treating "loading" as guest was aborting saves.
    if (status === "loading") {
      toast({
        title: "Just a moment",
        description: "Checking your sign-in status. Tap Save again in a second.",
      });
      return;
    }

    if (status !== "authenticated") {
      onClose();
      router.push(getLoginHrefForReturn("/bespoke-jewellery"));
      return;
    }

    if (isSaving) return;
    setIsSaving(true);
    try {
      const result = await saveCustomerCreationClient(creationDocumentId);
      onShowStatusToast(result.alreadySaved ? "Already saved" : "Saved as inspiration");
      onClose();
    } catch (error) {
      toast({
        title: "Could not save inspiration",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const canSave = Boolean(slide.documentId?.trim());
  const saveDisabled = isSaving || status === "loading";

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col bg-black max-md:h-[85vh] max-md:w-full">
      <div className="relative min-h-0 flex-1">
        <FeaturedStoryModalCarousel
          images={slide.modalImages}
          activeIndex={activeImageIndex}
          onActiveIndexChange={setActiveImageIndex}
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close featured story"
          className="absolute right-4 top-6 z-20 inline-flex size-6 items-center justify-center text-white transition-opacity hover:opacity-70 md:right-6 md:top-10"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            className="size-6 md:size-8"
          >
            <path
              d="M24 8L8 24"
              stroke="white"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M24 24L8 8"
              stroke="white"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 z-10 flex w-full flex-col gap-6 bg-transparent px-4 pb-10 pt-5 md:gap-6 md:px-6"
        style={{
          backgroundImage: "linear-gradient(to bottom, #00000000, #000000B1, #000000)",
        }}
      >
        <FeaturedStoryModalPagination
          images={slide.modalImages}
          activeIndex={activeImageIndex}
          onSelect={setActiveImageIndex}
        />

        <div className="flex flex-col gap-2 md:gap-4">
          <h2 className="font-larken text-2xl font-light leading-110 text-white md:text-32">
            {slide.modalTitle}
          </h2>
          <p
            className="line-clamp-2 font-gill text-base font-light leading-110 text-white md:text-xl"
            style={{ fontSize: spec.bodySize }}
          >
            {slide.modalDescription}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            void handleSaveInspiration();
          }}
          disabled={saveDisabled}
          className="inline-flex w-fit border-b border-white pb-1 font-gill text-sm font-normal uppercase leading-110 text-white transition-opacity hover:opacity-80 disabled:opacity-60"
        >
          {isSaving ? "Saving..." : status === "loading" ? "Loading..." : modalCtaLabel}
        </button>

        {!canSave ? (
          <p className="font-gill text-xs font-light leading-110 text-white/70">
            Save unavailable for this item (missing CMS document id).
          </p>
        ) : null}
      </div>
    </div>
  );
};

const BespokeFeaturedStoryModal = ({
  open,
  slide,
  modalCtaLabel,
  modalCtaHref,
  initialImageIndex = 0,
  elevated = false,
  onClose,
}: BespokeFeaturedStoryModalProps) => {
  const [statusToastMessage, setStatusToastMessage] = useState<string | null>(null);
  const statusToastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissStatusToast = useCallback(() => {
    if (statusToastTimeoutRef.current) {
      clearTimeout(statusToastTimeoutRef.current);
      statusToastTimeoutRef.current = null;
    }
    setStatusToastMessage(null);
  }, []);

  const showStatusToast = useCallback(
    (message: string) => {
      dismissStatusToast();
      setStatusToastMessage(message);
      statusToastTimeoutRef.current = setTimeout(() => {
        setStatusToastMessage(null);
        statusToastTimeoutRef.current = null;
      }, appStatusToastDurationMs);
    },
    [dismissStatusToast],
  );

  useFeaturedStoryModalEffects(open, onClose);

  useEffect(() => {
    return () => {
      if (statusToastTimeoutRef.current) {
        clearTimeout(statusToastTimeoutRef.current);
      }
    };
  }, []);

  const statusToast = (
    <AppStatusToast open={Boolean(statusToastMessage)} message={statusToastMessage ?? ""} />
  );

  if (!open || !slide) {
    return statusToastMessage ? statusToast : null;
  }

  return (
    <>
      {statusToast}
    <div
      className={cn(
        "fixed inset-0 flex md:items-stretch md:justify-end max-md:items-end",
        elevated ? "z-[80]" : "z-[70]",
      )}
    >
      <button
        type="button"
        aria-label="Close featured story"
        onClick={onClose}
        className={cn(
          "animate-in fade-in duration-300 backdrop-blur-[10px]",
          "max-md:absolute max-md:inset-0 max-md:z-0",
          "md:h-full md:min-h-0 md:flex-1",
        )}
        style={{ backgroundColor: spec.overlayColor }}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={slide.modalTitle}
        className={cn(
          "relative z-10 flex min-h-0 w-full flex-col overflow-hidden bg-black shadow-2xl",
          "max-md:h-[85vh] max-md:max-h-[85vh] max-md:max-w-none max-md:animate-in max-md:fade-in max-md:duration-300",
          "md:h-full md:max-w-480 md:shrink-0 md:animate-in md:slide-in-from-right md:duration-300",
        )}
      >
        <FeaturedStoryModalPanel
          key={`${slide.src}-${initialImageIndex}-${slide.modalImages[initialImageIndex]?.src ?? ""}`}
          slide={slide}
          modalCtaLabel={modalCtaLabel}
          modalCtaHref={modalCtaHref}
          initialImageIndex={initialImageIndex}
          onClose={onClose}
          onShowStatusToast={showStatusToast}
        />
      </aside>
    </div>
    </>
  );
};

export default BespokeFeaturedStoryModal;
