"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import BespokeFeaturedStoryModal from "@/features/bespoke/components/BespokeFeaturedStoryModal";
import BespokePastCreationsModal from "@/features/bespoke/components/BespokePastCreationsModal";
import {
  resolvePastCreationStory,
  type BespokePastCreationImage,
} from "@/features/bespoke/data/content";
import { unlockBodyScroll, useBodyScrollLock } from "@/shared/hooks/use-body-scroll-lock";
import { useAppStatusToastController } from "@/shared/hooks/useAppStatusToastController";
import type {
  NormalizedBespokeFeaturedSlide,
  NormalizedBespokeFeaturedStories,
  NormalizedBespokePastCreations,
} from "@/services/bespoke/contact-bespoke-page.types";

type FeaturedStoryModalSlide = {
  documentId?: string;
  src: string;
  alt: string;
  modalTitle: string;
  modalDescription: string;
  modalImages: readonly { src: string; alt: string }[];
};

type BespokePastCreationsGalleryHostProps = {
  pastCreations: NormalizedBespokePastCreations | null;
  featuredStories?: Pick<
    NormalizedBespokeFeaturedStories,
    "slides" | "defaultSlideIndex" | "modalCtaLabel"
  > | null;
  activePathname: string;
  children: (api: { openPastCreationsGallery: () => void; hasPastCreationsGallery: boolean }) => ReactNode;
};

const BespokePastCreationsGalleryHost = ({
  pastCreations,
  featuredStories,
  activePathname,
  children,
}: BespokePastCreationsGalleryHostProps) => {
  const pathname = usePathname() ?? activePathname;
  const slides: readonly NormalizedBespokeFeaturedSlide[] = featuredStories?.slides ?? [];
  const defaultSlideIndex = featuredStories?.defaultSlideIndex ?? 0;
  const modalCtaLabel = featuredStories?.modalCtaLabel;

  const [modalOpen, setModalOpen] = useState(false);
  const [pastCreationsOpen, setPastCreationsOpen] = useState(false);
  const [modalContext, setModalContext] = useState<{ slideIndex: number; imageIndex: number } | null>(
    null,
  );
  const [modalSlideOverride, setModalSlideOverride] = useState<FeaturedStoryModalSlide | null>(null);

  const modalHistoryDepthRef = useRef(0);
  const skipHistoryPopRef = useRef(false);
  const modalOpenRef = useRef(modalOpen);
  const pastCreationsOpenRef = useRef(pastCreationsOpen);
  const { show: showInspirationStatusToast, node: inspirationStatusToast } =
    useAppStatusToastController();

  modalOpenRef.current = modalOpen;
  pastCreationsOpenRef.current = pastCreationsOpen;

  const hasPastCreationsGallery = Boolean(pastCreations?.images.length);

  const isOverlayOpen = modalOpen || pastCreationsOpen;
  useBodyScrollLock(isOverlayOpen);

  const pushModalHistory = useCallback(() => {
    window.history.pushState({ sdBespokePastCreationsModal: true }, "");
    modalHistoryDepthRef.current += 1;
  }, []);

  const popModalHistory = useCallback(() => {
    if (modalHistoryDepthRef.current <= 0) return;

    skipHistoryPopRef.current = true;
    modalHistoryDepthRef.current -= 1;
    window.history.back();
  }, []);

  const resetModalState = useCallback(() => {
    modalHistoryDepthRef.current = 0;
    setModalOpen(false);
    setPastCreationsOpen(false);
    setModalContext(null);
    setModalSlideOverride(null);
    unlockBodyScroll();
  }, []);

  useEffect(() => {
    if (pathname !== activePathname) {
      resetModalState();
    }
  }, [activePathname, pathname, resetModalState]);

  useEffect(() => {
    const onPageShow = () => {
      if (!modalOpenRef.current && !pastCreationsOpenRef.current) {
        unlockBodyScroll();
        return;
      }

      resetModalState();
    };

    const onPopState = () => {
      if (skipHistoryPopRef.current) {
        skipHistoryPopRef.current = false;
        return;
      }

      if (modalHistoryDepthRef.current > 0) {
        modalHistoryDepthRef.current -= 1;
      }

      if (modalOpenRef.current) {
        setModalOpen(false);
        setModalContext(null);
        setModalSlideOverride(null);
        if (!pastCreationsOpenRef.current) {
          unlockBodyScroll();
        }
        return;
      }

      if (pastCreationsOpenRef.current) {
        setPastCreationsOpen(false);
        unlockBodyScroll();
      }
    };

    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("popstate", onPopState);
    };
  }, [resetModalState]);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setModalContext(null);
    setModalSlideOverride(null);
    if (!pastCreationsOpenRef.current) {
      unlockBodyScroll();
    }
  }, []);

  const handlePastCreationsClose = useCallback(() => {
    setPastCreationsOpen(false);
    if (!modalOpenRef.current) {
      unlockBodyScroll();
    }
  }, []);

  const closeStoryModal = useCallback(() => {
    if (modalOpen) {
      popModalHistory();
    }
    handleModalClose();
  }, [handleModalClose, modalOpen, popModalHistory]);

  const closePastCreationsModal = useCallback(() => {
    if (pastCreationsOpen) {
      popModalHistory();
    }
    handlePastCreationsClose();
  }, [handlePastCreationsClose, pastCreationsOpen, popModalHistory]);

  const openStoryModal = useCallback(() => {
    pushModalHistory();
    setModalOpen(true);
  }, [pushModalHistory]);

  const openPastCreationsGallery = useCallback(() => {
    if (!pastCreations) return;
    pushModalHistory();
    setPastCreationsOpen(true);
  }, [pastCreations, pushModalHistory]);

  const handlePastCreationImageClick = useCallback(
    (image: BespokePastCreationImage) => {
      if (slides.length === 0) {
        if (!pastCreations) return;

        setModalSlideOverride({
          documentId: image.documentId,
          src: image.src,
          alt: image.alt,
          modalTitle: pastCreations.title,
          modalDescription: "",
          modalImages: [{ src: image.src, alt: image.alt }],
        });
        setModalContext({ slideIndex: 0, imageIndex: 0 });
        openStoryModal();
        return;
      }

      const resolved = resolvePastCreationStory(slides, image.src, defaultSlideIndex);
      const baseSlide = slides[resolved.slideIndex];
      const matchedIndex = baseSlide.modalImages.findIndex((item) => item.src === image.src);

      if (matchedIndex >= 0) {
        setModalSlideOverride(null);
        setModalContext({ slideIndex: resolved.slideIndex, imageIndex: matchedIndex });
      } else {
        setModalSlideOverride({
          ...baseSlide,
          documentId: image.documentId ?? baseSlide.documentId,
          modalImages: [{ src: image.src, alt: image.alt }, ...baseSlide.modalImages],
        });
        setModalContext({ slideIndex: resolved.slideIndex, imageIndex: 0 });
      }

      openStoryModal();
    },
    [defaultSlideIndex, openStoryModal, pastCreations, slides],
  );

  const modalSlide: FeaturedStoryModalSlide | null =
    modalSlideOverride ??
    (modalContext !== null ? slides[modalContext.slideIndex] ?? slides[defaultSlideIndex] : null);

  return (
    <>
      {children({ openPastCreationsGallery, hasPastCreationsGallery })}
      {pastCreations ? (
        <BespokePastCreationsModal
          open={pastCreationsOpen}
          images={pastCreations.images}
          onClose={closePastCreationsModal}
          onImageClick={handlePastCreationImageClick}
          suppressEscape={modalOpen}
        />
      ) : null}
      <BespokeFeaturedStoryModal
        open={modalOpen}
        slide={modalSlide}
        initialImageIndex={modalContext?.imageIndex ?? 0}
        elevated={pastCreationsOpen}
        modalCtaLabel={modalCtaLabel}
        onClose={closeStoryModal}
        onShowStatusToast={showInspirationStatusToast}
      />
      {inspirationStatusToast}
    </>
  );
};

export default BespokePastCreationsGalleryHost;
