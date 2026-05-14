"use client";

import { useState } from "react";
import Layout from "@/components/layout/Layout";
import SectionHeader from "@/components/shared/SectionHeader";
import ProductGrid from "@/components/product/ProductGrid";
import { categories, getProductsByCategory } from "@/data/products";
import { productsContent } from "@/data/content";

const ProductsPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = getProductsByCategory(activeCategory);

  return (
    <Layout>
      <section className="container py-10 md:py-16">
        <SectionHeader
          subtitle={productsContent.header.subtitle}
          title={productsContent.header.title}
          as="h1"
          className="mb-10"
        />

        <nav className="flex flex-wrap justify-center gap-2 mb-10" aria-label="Product categories">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs tracking-widest uppercase font-body border transition-colors ${
                activeCategory === cat
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>

        <ProductGrid products={filtered} columns={3} />
      </section>
    </Layout>
  );
};

export default ProductsPage;
