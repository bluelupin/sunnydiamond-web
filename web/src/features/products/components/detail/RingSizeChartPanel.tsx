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

type TutorialVideoProps = {
  videoUrl: string;
  mimeType: string;
  title: string;
};

/**
 * Own component so the panel can reset it with a key: closing the drawer or
 * switching guide throws this away, which stops playback and clears the poster
 * state without a single state-syncing effect.
 */
const TutorialVideo = ({ videoUrl, mimeType, title }: TutorialVideoProps) => {
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    // iOS keeps playback inline only with both attributes present on the element.
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.load();
  }, [videoUrl]);

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
        <source src={videoUrl} type={mimeType} />
      </video>
      {!hasStartedPlayback ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20">
          <button
            type="button"
            aria-label={`Play ${title} video`}
            onClick={handlePlayVideo}
            className="inline-flex size-12 touch-manipulation items-center justify-center"
          >
            <Play size={32} strokeWidth={1.5} className="fill-white text-white" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
};

const RingSizeChartPanel = ({ open, onClose, guide }: RingSizeChartPanelProps) => {
  const title = guide?.drawerTitle ?? "Size Chart";
  const subtitle = guide?.drawerSubtitle ?? "Measure Dimensions in millimeters";
  const rows = guide?.rows ?? [];
  const videoUrl = guide?.tutorialVideoUrl;
  const videoMimeType = videoUrl ? resolveVideoMimeType(videoUrl) : "video/mp4";
  const circumferenceHeaderUrl = guide?.circumferenceHeaderImageUrl;
  const diameterHeaderUrl = guide?.diameterHeaderImageUrl;
  // Categories measured by a single dimension (e.g. necklace chain lengths)
  // leave the measurement columns empty — hide any column with no data at all.
  const showCircumference = rows.some((row) => row.circumference.trim() !== "");
  const showDiameter = rows.some((row) => row.diameter.trim() !== "");
  const columnCount = 1 + (showCircumference ? 1 : 0) + (showDiameter ? 1 : 0);
  const gridColsClass = ["grid-cols-1", "grid-cols-2", "grid-cols-3"][columnCount - 1];

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

        {videoUrl ? (
          <TutorialVideo key={videoUrl} videoUrl={videoUrl} mimeType={videoMimeType} title={title} />
        ) : null}

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 pb-72">
            <div className="flex flex-col gap-6 pb-8">
              <div className="flex flex-col items-center gap-3 px-4 text-center lg:px-8 pt-6">
                <h2 className="w-full font-larken text-2xl font-light leading-110 text-darkblack">
                  {title}
                </h2>
                <p className="w-full font-gill text-base font-light leading-110 text-darkblack">
                  {subtitle}
                </p>
              </div>
              <div className={`grid w-full ${gridColsClass}`}>
                {showCircumference ? (
                  circumferenceHeaderUrl ? (
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
                  )
                ) : null}
                {showDiameter ? (
                  diameterHeaderUrl ? (
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
                  )
                ) : null}
                {/* Balances the measurement illustrations — with no measurement
                    column there is nothing to balance, and this would be a tall
                    blank block above the table. */}
                {columnCount > 1 ? (
                  <div className="aspect-[1402/1122] w-full bg-white" aria-hidden />
                ) : null}

                {showCircumference ? (
                  <div className="flex h-14 flex-col items-center justify-center gap-0.5 border-b border-aboutInactive bg-gray200">
                    <p className="font-gill text-sm font-semibold leading-110 text-darkblack">
                      Circumference
                    </p>
                    <p className="font-gill text-xs font-light leading-110 text-neutral500">
                      in mm
                    </p>
                  </div>
                ) : null}
                {showDiameter ? (
                  <div className="flex h-14 flex-col items-center justify-center gap-0.5 border-b border-aboutInactive bg-gray200">
                    <p className="font-gill text-sm font-semibold leading-110 text-darkblack">
                      Diameter
                    </p>
                    <p className="font-gill text-xs font-light leading-110 text-neutral500">
                      in mm
                    </p>
                  </div>
                ) : null}
                <div className="flex h-14 items-center justify-center border-b border-aboutInactive bg-gray200">
                  <p className="font-gill text-sm font-semibold leading-110 text-darkblack">
                    Size
                  </p>
                </div>

                {rows.map((row, index) => (
                  <Fragment key={`${row.group}-${row.size}`}>
                    {row.group && row.group !== rows[index - 1]?.group ? (
                      <div className="col-span-full flex h-12 items-center justify-center border-b border-aboutInactive bg-white">
                        <p className="font-gill text-sm font-semibold uppercase leading-110 tracking-wide text-darkblack">
                          {row.group}
                        </p>
                      </div>
                    ) : null}
                    {showCircumference ? (
                      <div className="flex h-14 items-center justify-center border-b border-aboutInactive">
                        <p className="whitespace-nowrap font-gill text-base leading-110 text-darkblack">
                          {row.circumference}
                        </p>
                      </div>
                    ) : null}
                    {showDiameter ? (
                      <div className="flex h-14 items-center justify-center border-b border-aboutInactive">
                        <p className="whitespace-nowrap font-gill text-base leading-110 text-darkblack">
                          {row.diameter}
                        </p>
                      </div>
                    ) : null}
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
