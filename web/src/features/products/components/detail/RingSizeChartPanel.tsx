"use client";

import { Fragment, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import {
  RING_SIZE_CHART_IMAGES,
} from "@/features/products/data/ringSizeChartContent";
import { PanelFooterGradient } from "@/shared/ui/PanelFooter";
import { ProductDetailSidePanelShell } from "./ProductDetailSidePanelShell";
import type { NormalizedSizeGuide } from "@/services/size-guide/size-guide.types";

type RingSizeChartPanelProps = {
  open: boolean;
  onClose: () => void;
  guide?: NormalizedSizeGuide | null;
};

const RingSizeChartPanel = ({ open, onClose, guide }: RingSizeChartPanelProps) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const title = guide?.drawerTitle ?? "Size Chart";
  const subtitle = guide?.drawerSubtitle ?? "Measure Dimensions in millimeters";
  const rows = guide?.rows ?? [];
  const videoUrl = guide?.tutorialVideoUrl;

  return (
    <ProductDetailSidePanelShell
      open={open}
      onClose={onClose}
      overlayAriaLabel={`Close ${title}`}
      dialogAriaLabel={title}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-end px-4 pt-6 lg:px-6 lg:pt-10">
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title}`}
            className="inline-flex size-6 items-center justify-center"
          >
            <Image
              src="/images/navigation/menu-close.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden
            />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6 pb-72">
            {videoUrl ? (
              <div className="relative h-400 w-full shrink-0 overflow-hidden bg-darkblack">
                {isVideoPlaying ? (
                  <video
                    src={videoUrl}
                    className="h-full w-full object-cover"
                    controls
                    autoPlay
                    playsInline
                  />
                ) : (
                  <div className="grid h-full w-full [&>*]:col-start-1 [&>*]:row-start-1">
                    <Image
                      src={RING_SIZE_CHART_IMAGES.videoPoster}
                      alt=""
                      width={480}
                      height={400}
                      className="h-full w-full object-cover"
                      sizes="(max-width: 1024px) 100vw, 480px"
                    />
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        aria-label={`Play ${title} video`}
                        onClick={() => setIsVideoPlaying(true)}
                        className="inline-flex size-8 items-center justify-center"
                      >
                        <Play
                          size={32}
                          strokeWidth={1.5}
                          className="fill-white text-white"
                          aria-hidden
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid h-400 w-full shrink-0 overflow-hidden [&>*]:col-start-1 [&>*]:row-start-1">
                <Image
                  src={RING_SIZE_CHART_IMAGES.videoPoster}
                  alt=""
                  width={480}
                  height={400}
                  className="h-full w-full object-cover"
                  sizes="(max-width: 1024px) 100vw, 480px"
                />
              </div>
            )}

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
                <div className="flex h-14 items-center justify-center border-b border-aboutInactive bg-gray200">
                  <p className="font-gill text-sm font-semibold leading-110 text-darkblack">
                    sizeLabel
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
                    unit
                  </p>
                </div>

                {rows.map((row) => (
                  <Fragment key={row.size}>
                    <div className="flex h-14 items-center justify-center border-b border-aboutInactive">
                      <p className="whitespace-nowrap font-gill text-base leading-110 text-darkblack">
                        {row.size}
                      </p>
                    </div>
                    <div className="flex h-14 items-center justify-center border-b border-aboutInactive">
                      <p className="whitespace-nowrap font-gill text-base leading-110 text-darkblack">
                        {row.diameter}
                      </p>
                    </div>
                    <div className="flex h-14 items-center justify-center border-b border-aboutInactive bg-gray200">
                      <p className="whitespace-nowrap font-gill text-base leading-110 text-darkblack">
                        {row.circumference}
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
