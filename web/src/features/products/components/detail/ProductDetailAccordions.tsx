"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import type { ProductDetailAccordion } from "@/features/products/types/productDetail";

type ProductDetailAccordionsProps = {
  items: ProductDetailAccordion[];
};

const ProductDetailAccordions = ({ items }: ProductDetailAccordionsProps) => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordion((current) => (current === id ? null : id));
  };

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
              className="flex h-10 items-center justify-between text-left lg:h-14"
            >
              <span className="font-gill text-xl font-normal leading-110 text-darkblack lg:text-2xl">
                {accordion.title}
              </span>
              <span className="inline-flex size-[32px] shrink-0 items-center justify-center p-[6px]" aria-hidden>
                <Image
                  src={
                    isOpen
                      ? "/images/products/pdp/accordion-minus.svg"
                      : "/images/products/pdp/accordion-plus.svg"
                  }
                  alt=""
                  width={12}
                  height={12}
                  className="size-[12px] object-contain"
                />
              </span>
            </button>
            <div
              id={`product-accordion-${accordion.id}`}
              role="region"
              aria-labelledby={`product-accordion-trigger-${accordion.id}`}
              aria-hidden={!isOpen}
              className={cn(
                "grid min-h-0 transition-[grid-template-rows,opacity] duration-500 ease-in-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="pb-3 pt-2 font-gill text-base font-light leading-110 text-neutral500 lg:pt-3">
                  {accordion.content}
                </p>
              </div>
            </div>
            <div className="h-px bg-neutral300" aria-hidden />
          </div>
        );
      })}
    </section>
  );
};

export default ProductDetailAccordions;
