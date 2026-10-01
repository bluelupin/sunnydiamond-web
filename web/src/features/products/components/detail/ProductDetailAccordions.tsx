"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import {
  accordionCollapseIconClassName,
  accordionCollapseInnerClassName,
  accordionCollapsePanelClassName,
} from "@/shared/ui/accordionCollapse";
import type { ProductDetailAccordion } from "@/features/products/types/productDetail";

type ProductDetailAccordionsProps = {
  items: ProductDetailAccordion[];
};

const ProductDetailAccordions = ({ items }: ProductDetailAccordionsProps) => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordion((current) => (current === id ? null : id));
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-label="Product information" className="flex flex-col gap-3">
      {items.map((accordion) => {
        const isOpen = openAccordion === accordion.id;

        return (
          <div key={accordion.id} className="flex flex-col">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`product-accordion-${accordion.id}`}
              id={`product-accordion-trigger-${accordion.id}`}
              onClick={() => toggleAccordion(accordion.id)}
              className="flex h-10 items-center justify-between text-left"
            >
              <span className="font-gill text-xl font-normal leading-110 text-darkblack">
                {accordion.title}
              </span>
              <span className="relative inline-flex size-[32px] shrink-0 items-center justify-center p-[6px]" aria-hidden>
                <span
                  className={cn(
                    "absolute inset-0 flex items-center justify-center",
                    accordionCollapseIconClassName,
                    isOpen ? "pointer-events-none opacity-0" : "opacity-100",
                  )}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12.25H20.5" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12.25 4V20.5" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span
                  className={cn(
                    "absolute inset-0 flex items-center justify-center",
                    accordionCollapseIconClassName,
                    isOpen ? "opacity-100" : "pointer-events-none opacity-0",
                  )}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 12.25H20.5" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
            </button>
            <div
              id={`product-accordion-${accordion.id}`}
              role="region"
              aria-labelledby={`product-accordion-trigger-${accordion.id}`}
              aria-hidden={!isOpen}
              className={cn(accordionCollapsePanelClassName(isOpen), "md:pb-3 pb-4")}
            >
              <div className={accordionCollapseInnerClassName}>
                <p className="pb-3 pt-2 font-gill text-base font-light leading-110 text-neutral500 lg:pt-3">
                  {accordion.content}
                </p>
              </div>
            </div>
            <div className="h-[0.5px] bg-neutral300" aria-hidden />
          </div>
        );
      })}
    </section>
  );
};

export default ProductDetailAccordions;
