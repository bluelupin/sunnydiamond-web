"use client";

import { useState } from "react";
import Image from "next/image";
import SectionHeader from "@/shared/ui/SectionHeader";
import ProductGrid from "@/features/products/components/ProductGrid";
import { categories, getProductsByCategory } from "@/features/products/data/products";
import { productsContent } from "@/features/cms/data/content";
import { cn } from "@/shared/utils/cn";

const ProductsPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = getProductsByCategory(activeCategory);

  return (
    <section>
      <div className="container py-10 md:py-16">
        <SectionHeader
          subtitle={productsContent.header.subtitle}
          title={productsContent.header.title}
          as="h1"
          className="mb-[40px]"
        />
      </div>

      {/* Category filter bar — full viewport width */}
      <div className="w-full border-b border-[#CCC] bg-white">
        <nav
          className="flex items-center justify-center gap-8 overflow-x-auto px-10 py-10 scrollbar-hide"
          aria-label="Product categories"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setActiveCategory(cat.value)}
                className="flex w-[86px] shrink-0 flex-col items-center justify-center gap-2 focus-visible:outline-none"
                aria-pressed={isActive}
              >
                <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden">
                  <Image
                    src={cat.icon}
                    alt=""
                    width={40}
                    height={40}
                    aria-hidden
                    className={cn(
                      "size-full object-contain transition-opacity",
                      isActive ? "opacity-100" : "opacity-40",
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "whitespace-nowrap font-gill text-base leading-110 transition-colors",
                    isActive ? "font-semibold darkblack" : "font-normal text-[#999999]",
                  )}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="container py-10">
        <ProductGrid products={filtered} columns={3} />
      </div>
    </section>
  );
};

export default ProductsPage;
