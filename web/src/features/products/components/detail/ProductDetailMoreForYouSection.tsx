"use client";

import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OptimizedImage from "@/shared/ui/OptimizedImage";
import PageContainer from "@/shared/ui/layout/PageContainer";
import { cn } from "@/shared/utils/cn";
import type { Product } from "@/features/products/data/products";
import { DetailOutlineLink } from "./shared";

type ProductDetailMoreForYouSectionProps = {
  products: Product[];
};

const ProductDetailMoreForYouSection = ({ products }: ProductDetailMoreForYouSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(Math.min(1, Math.max(products.length - 1, 0)));

  const scrollTo = useCallback(
    (index: number) => {
      if (products.length === 0) return;
      setActiveIndex((index + products.length) % products.length);
    },
    [products.length],
  );

  if (products.length === 0) return null;

  const activeProduct = products[activeIndex];

  return (
    <section aria-labelledby="more-for-you-heading" className="py-16 lg:py-[104px]">
      <PageContainer>
        <h2
          id="more-for-you-heading"
          className="mb-10 font-larken text-[40px] font-light leading-110 text-darkblack lg:text-48"
        >
          More for You
        </h2>

        <div className="relative">
          <div className="flex items-stretch gap-5 overflow-hidden lg:gap-10">
            {products.map((product, index) => {
              const isActive = index === activeIndex;

              return (
                <article
                  key={product.id}
                  className={cn(
                    "relative shrink-0 overflow-hidden transition-all duration-500",
                    isActive ? "w-full lg:w-[600px]" : "hidden lg:block lg:w-[220px] lg:opacity-60",
                  )}
                  aria-hidden={!isActive}
                >
                  <div
                    className={cn(
                      "relative overflow-hidden bg-gray300",
                      isActive ? "h-[259px] lg:h-[373px]" : "h-[240px]",
                    )}
                  >
                    <OptimizedImage
                      src={product.image}
                      alt={product.name}
                      sizes={isActive ? "(max-width: 1024px) 100vw, 600px" : "220px"}
                      className="object-cover"
                    />

                    {isActive ? (
                      <>
                        <button
                          type="button"
                          aria-label="Previous recommendation"
                          onClick={() => scrollTo(activeIndex - 1)}
                          className="absolute left-4 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center bg-white/80"
                        >
                          <ChevronLeft size={24} strokeWidth={1.25} />
                        </button>
                        <button
                          type="button"
                          aria-label="Next recommendation"
                          onClick={() => scrollTo(activeIndex + 1)}
                          className="absolute right-4 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center bg-white/80"
                        >
                          <ChevronRight size={24} strokeWidth={1.25} />
                        </button>
                      </>
                    ) : null}
                  </div>

                  {isActive ? (
                    <div className="mt-6 flex flex-col items-center gap-6 text-center">
                      <p className="font-gill text-xl leading-110 text-darkblack">{activeProduct.name}</p>
                      <DetailOutlineLink href={`/product/${activeProduct.id}`} className="min-w-[122px]">
                        Shop Now
                      </DetailOutlineLink>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      </PageContainer>
    </section>
  );
};

export default ProductDetailMoreForYouSection;
