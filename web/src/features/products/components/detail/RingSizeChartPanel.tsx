"use client";

import { Fragment } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import {
  RING_SIZE_CHART_IMAGES,
  RING_SIZE_CHART_ROWS,
} from "@/features/products/data/ringSizeChartContent";
import { PanelFooterGradient } from "@/shared/ui/PanelFooter";
import { ProductDetailSidePanelShell } from "./ProductDetailSidePanelShell";

type RingSizeChartPanelProps = {
  open: boolean;
  onClose: () => void;
};

const RingSizeChartPanel = ({ open, onClose }: RingSizeChartPanelProps) => {
  return (
    <ProductDetailSidePanelShell
      open={open}
      onClose={onClose}
      overlayAriaLabel="Close ring size chart"
      dialogAriaLabel="Ring size chart"
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-end px-4 pt-6 lg:px-6 lg:pt-[40px]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close ring size chart"
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
            <div className="grid h-400 w-full shrink-0 overflow-hidden [&>*]:col-start-1 [&>*]:row-start-1">
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
                  aria-label="Play ring sizing guide"
                  className="inline-flex size-8 items-center justify-center"
                >
                  <Play size={32} strokeWidth={1.5} className="fill-white text-white" aria-hidden />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-6 pb-8">
              <div className="flex flex-col items-center gap-3 px-4 text-center lg:px-8">
                <h2 className="w-full font-larken text-2xl font-light leading-110 text-darkblack">
                  Ring Size Chart
                </h2>
                <p className="w-full font-gill text-base font-light leading-110 text-darkblack">
                  Measure Dimensions in millimeters
                </p>
              </div>

              <div className="grid w-full grid-cols-3">
                <Image
                  src={RING_SIZE_CHART_IMAGES.circumferenceHeader}
                  alt="Circumference"
                  width={1402}
                  height={1122}
                  className="aspect-[1402/1122] h-auto w-full object-cover"
                  sizes="160px"
                />
                <Image
                  src={RING_SIZE_CHART_IMAGES.diameterHeader}
                  alt="Diameter"
                  width={1402}
                  height={1122}
                  className="aspect-[1402/1122] h-auto w-full object-cover object-left-top"
                  sizes="160px"
                />
                <div className="aspect-[1402/1122] w-full bg-white" aria-hidden />

                {RING_SIZE_CHART_ROWS.map((row) => (
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
