"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { PanelFooterGradient } from "@/shared/ui/PanelFooter";
import { ProductDetailSidePanelShell } from "./ProductDetailSidePanelShell";
import type { NormalizedSizeGuide } from "@/services/size-guide/size-guide.types";

type RingSizeChartPanelProps = {
  open: boolean;
  onClose: () => void;
  guide?: NormalizedSizeGuide | null;
};

function resolveVideoMimeType(videoSrc: string): string {
  const normalized = videoSrc.split("?")[0]?.toLowerCase() ?? "";

  if (normalized.endsWith(".webm")) {
    return "video/webm";
  }

  if (normalized.endsWith(".mov")) {
    return "video/quicktime";
  }

  return "video/mp4";
}

const RingSizeChartPanel = ({ open, onClose, guide }: RingSizeChartPanelProps) => {
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const title = guide?.drawerTitle ?? "Size Chart";
  const subtitle = guide?.drawerSubtitle ?? "Measure Dimensions in millimeters";
  const rows = guide?.rows ?? [];
  const videoUrl = guide?.tutorialVideoUrl;
  const videoMimeType = videoUrl ? resolveVideoMimeType(videoUrl) : "video/mp4";
  const circumferenceHeaderUrl = guide?.circumferenceHeaderImageUrl;
  const diameterHeaderUrl = guide?.diameterHeaderImageUrl;

  useEffect(() => {
    if (open) {
      return;
    }

    setHasStartedPlayback(false);
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.pause();
    video.currentTime = 0;
  }, [open]);

  useEffect(() => {
    setHasStartedPlayback(false);
  }, [videoUrl]);

  useEffect(() => {
    if (!open || !videoUrl) {
      return;
    }

    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.load();
  }, [open, videoUrl]);

  const handlePlayVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    // iOS requires play() in the same user-gesture turn — do not setState before play().
    const playPromise = video.play();
    if (playPromise === undefined) {
      setHasStartedPlayback(true);
      return;
    }

    playPromise
      .then(() => {
        setHasStartedPlayback(true);
      })
      .catch(() => {
        setHasStartedPlayback(false);
      });
  }, []);

  const renderTutorialVideo = () => {
    if (!videoUrl) {
      return null;
    }

    return (
      <div className="relative w-full shrink-0 overflow-hidden bg-white">
        <video
          ref={videoRef}
          className="block h-auto w-full"
          playsInline
          preload="auto"
          controls={hasStartedPlayback}
          onPlay={() => setHasStartedPlayback(true)}
          onEnded={() => {
            const video = videoRef.current;
            if (video) {
              video.currentTime = 0;
            }
            setHasStartedPlayback(false);
          }}
        >
          <source src={videoUrl} type={videoMimeType} />
        </video>
        {!hasStartedPlayback ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
            <button
              type="button"
              aria-label={`Play ${title} video`}
              onClick={handlePlayVideo}
              className="inline-flex size-12 touch-manipulation items-center justify-center"
            >
              <Play
                size={32}
                strokeWidth={1.5}
                className="fill-white text-white"
                aria-hidden
              />
            </button>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <ProductDetailSidePanelShell
      open={open}
      onClose={onClose}
      overlayAriaLabel={`Close ${title}`}
      dialogAriaLabel={title}
    >
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${title}`}
          className="absolute top-8 right-7 z-20 text-white"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 18L6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {renderTutorialVideo()}

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 pb-72">
            <div className="flex flex-col gap-6 pb-8">
              <div className="flex flex-col items-center gap-3 px-4 text-center lg:px-8">
                <h2 className="w-full font-larken text-2xl font-light leading-110 text-darkblack">
                  {title}
                </h2>
                <p className="w-full font-gill text-base font-light leading-110 text-darkblack">
                  {subtitle}
                </p>
              </div>

              <div className="grid w-full grid-cols-3">
                {circumferenceHeaderUrl ? (
                  <Image
                    src={circumferenceHeaderUrl}
                    alt="Circumference"
                    width={1402}
                    height={1122}
                    className="aspect-[1402/1122] h-auto w-full object-cover"
                    sizes="160px"
                  />
                ) : (
                  <div className="aspect-[1402/1122] w-full bg-gray200" aria-hidden />
                )}
                {diameterHeaderUrl ? (
                  <Image
                    src={diameterHeaderUrl}
                    alt="Diameter"
                    width={1402}
                    height={1122}
                    className="aspect-[1402/1122] h-auto w-full object-cover object-left-top"
                    sizes="160px"
                  />
                ) : (
                  <div className="aspect-[1402/1122] w-full bg-gray200" aria-hidden />
                )}
                <div className="aspect-[1402/1122] w-full bg-white" aria-hidden />

                <div className="flex h-14 items-center justify-center border-b border-aboutInactive bg-gray200">
                  <p className="font-gill text-sm font-semibold leading-110 text-darkblack">
                    unit
                  </p>
                </div>
                <div className="flex h-14 flex-col items-center justify-center gap-0.5 border-b border-aboutInactive bg-gray200">
                  <p className="font-gill text-sm font-semibold leading-110 text-darkblack">
                    diameter
                  </p>
                  <p className="font-gill text-xs font-light leading-110 text-neutral500">
                    in mm
                  </p>
                </div>
                <div className="flex h-14 items-center justify-center border-b border-aboutInactive bg-gray200">
                  <p className="font-gill text-sm font-semibold leading-110 text-darkblack">
                    sizeLabel
                  </p>
                </div>

                {rows.map((row) => (
                  <Fragment key={row.size}>
                    <div className="flex h-14 items-center justify-center border-b border-aboutInactive">
                      <p className="whitespace-nowrap font-gill text-base leading-110 text-darkblack">
                        {row.circumference}
                      </p>
                    </div>
                    <div className="flex h-14 items-center justify-center border-b border-aboutInactive">
                      <p className="whitespace-nowrap font-gill text-base leading-110 text-darkblack">
                        {row.diameter}
                      </p>
                    </div>
                    <div className="flex h-14 items-center justify-center border-b border-aboutInactive bg-gray200">
                      <p className="whitespace-nowrap font-gill text-base leading-110 text-darkblack">
                        {row.size}
                      </p>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="relative shrink-0">
          <PanelFooterGradient overlay />
        </div>
      </div>
    </ProductDetailSidePanelShell>
  );
};

export default RingSizeChartPanel;
