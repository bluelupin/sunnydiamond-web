"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Play, SlidersHorizontal } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import {
  RING_SIZE_CHART_IMAGES,
  RING_SIZE_CHART_ROWS,
} from "@/features/products/data/ringSizeChartContent";

type RingSizeChartPanelProps = {
  open: boolean;
  onClose: () => void;
};

const RingSizeChartPanel = ({ open, onClose }: RingSizeChartPanelProps) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close ring size chart"
        className="absolute inset-0 bg-[rgba(30,30,30,0.75)] backdrop-blur-[10px] animate-in fade-in duration-300 lg:bg-[#1E1E1E]/25"
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Ring size chart"
        className={cn(
          "absolute flex flex-col overflow-hidden bg-white shadow-2xl",
          "inset-x-0 bottom-0 top-12 max-lg:animate-in max-lg:slide-in-from-bottom max-lg:duration-300",
          "lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:top-0 lg:w-full lg:max-w-[480px] lg:animate-in lg:slide-in-from-right lg:duration-300",
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close ring size chart"
          className="absolute right-4 top-6 z-20 inline-flex size-6 items-center justify-center lg:right-8"
        >
          <Image
            src="/images/navigation/menu-close.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden
          />
        </button>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6">
            <div className="relative h-[400px] w-full shrink-0 overflow-hidden">
              <Image
                src={RING_SIZE_CHART_IMAGES.videoPoster}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 480px"
              />
              <button
                type="button"
                aria-label="Play ring sizing guide"
                className="absolute left-1/2 top-1/2 z-10 inline-flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              >
                <Play size={32} strokeWidth={1.5} className="fill-white text-white" aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Filter ring size chart"
                className="absolute right-4 top-6 z-10 inline-flex size-6 items-center justify-center text-darkblack"
              >
                <SlidersHorizontal size={24} strokeWidth={1.5} aria-hidden />
              </button>
            </div>

            <div className="flex flex-col gap-6 pb-8">
              <div className="flex flex-col items-center gap-3 px-4 text-center lg:px-8">
                <h2 className="w-full font-larken text-24 font-light leading-110 text-darkblack">
                  Ring Size Chart
                </h2>
                <p className="w-full font-gill text-base font-light leading-110 text-[#1E1E1E]">
                  Measure Dimensions in millimeters
                </p>
              </div>

              <div className="flex w-full items-stretch">
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="relative aspect-[1402/1122] w-full shrink-0">
                    <Image
                      src={RING_SIZE_CHART_IMAGES.circumferenceHeader}
                      alt="Circumference"
                      fill
                      className="object-cover"
                      sizes="125px"
                    />
                  </div>
                  {RING_SIZE_CHART_ROWS.map((row) => (
                    <div
                      key={`circumference-${row.size}`}
                      className="flex h-14 items-center justify-center border-b border-aboutInactive"
                    >
                      <p className="whitespace-nowrap font-gill text-base leading-110 text-darkblack">
                        {row.circumference}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="relative aspect-[1402/1122] w-full shrink-0 overflow-hidden">
                    <Image
                      src={RING_SIZE_CHART_IMAGES.diameterHeader}
                      alt="Diameter"
                      fill
                      className="object-cover object-left-top"
                      sizes="125px"
                    />
                  </div>
                  {RING_SIZE_CHART_ROWS.map((row) => (
                    <div
                      key={`diameter-${row.size}`}
                      className="flex h-14 items-center justify-center border-b border-aboutInactive"
                    >
                      <p className="whitespace-nowrap font-gill text-base leading-110 text-darkblack">
                        {row.diameter}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="h-[100.4px] shrink-0 bg-white" aria-hidden />
                  {RING_SIZE_CHART_ROWS.map((row) => (
                    <div
                      key={`size-${row.size}`}
                      className="flex h-14 items-center justify-center border-b border-aboutInactive bg-gray200"
                    >
                      <p className="whitespace-nowrap font-gill text-base leading-110 text-darkblack">
                        {row.size}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default RingSizeChartPanel;
