"use client";

import { useEffect, useMemo, useState } from "react";
import { useHomepageShoppingBlocks } from "@/hooks/homepage/useHomepageShoppingBlocks";
import { AlankaraCollection } from "@/shared/ui/collection/AlankaraCollection";
import { isSectionActive } from "@/shared/utils/cmsSection";
import {
  mapMagentoProductsToAlankaraCollection,
  resolveAlankaraCollectionSection,
} from "@/shared/utils/resolveAlankaraCollectionSection";
import { getMagentoProductsBySkus } from "@/services/magento/products/products.service";
import type { AlankaraCollectionProduct } from "@/shared/ui/collection/alankaraCollection.types";

interface FeaturedCollectionSectionProps {
  id?: string;
  sectionHeading?: string;
  description?: string;
}

const FeaturedCollectionSection = ({
  id,
  sectionHeading,
  description: descriptionProp,
}: FeaturedCollectionSectionProps) => {
  const { data: shoppingData, isLoading: isShoppingLoading } = useHomepageShoppingBlocks();
  const featuredCollectionData =
    shoppingData?.homepage?.featuredCollectionSection || shoppingData?.featuredCollectionSection;

  const collectionProps = useMemo(
    () =>
      resolveAlankaraCollectionSection(featuredCollectionData, {
        descriptionOverride: descriptionProp,
      }),
    [descriptionProp, featuredCollectionData],
  );

  const productSkus = collectionProps.productSkus;
  const featuredProductSku = collectionProps.featuredProductSku;
  const skuKey = productSkus.join("|");

  const [magentoProducts, setMagentoProducts] = useState<AlankaraCollectionProduct[] | null>(
    null,
  );
  const [defaultActiveIndex, setDefaultActiveIndex] = useState(
    collectionProps.defaultActiveIndex,
  );
  const [isMagentoLoading, setIsMagentoLoading] = useState(productSkus.length > 0);

  useEffect(() => {
    if (productSkus.length === 0) {
      setMagentoProducts(null);
      setDefaultActiveIndex(collectionProps.defaultActiveIndex);
      setIsMagentoLoading(false);
      return;
    }

    const controller = new AbortController();
    const skus = skuKey.split("|").filter(Boolean);
    setIsMagentoLoading(true);

    void getMagentoProductsBySkus(skus, controller.signal)
      .then((items) => {
        if (controller.signal.aborted) return;
        const mapped = mapMagentoProductsToAlankaraCollection(items, skus, {
          featuredProductSku,
        });
        setMagentoProducts(mapped.products.length > 0 ? mapped.products : null);
        setDefaultActiveIndex(mapped.defaultActiveIndex);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setMagentoProducts(null);
        setDefaultActiveIndex(collectionProps.defaultActiveIndex);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsMagentoLoading(false);
        }
      });

    return () => controller.abort();
  }, [skuKey, featuredProductSku, collectionProps.defaultActiveIndex]);

  if (!isSectionActive(collectionProps.isActive)) {
    return null;
  }

  if (isShoppingLoading || (productSkus.length > 0 && isMagentoLoading && !magentoProducts)) {
    return (
      <section
        id={id}
        aria-label="Alankara Collection"
        className="bg-white min-[1920px]:relative min-[1920px]:left-1/2 min-[1920px]:w-screen min-[1920px]:max-w-none min-[1920px]:-translate-x-1/2"
        aria-busy="true"
      >
        {sectionHeading ? (
          <div className="mx-auto w-full max-w-1440 px-4 pt-16 lg:px-8 lg:pt-104">
            <h2 className="mb-10 text-center font-larken text-32 font-light leading-110 text-darkblack lg:text-left lg:text-48">
              {sectionHeading}
            </h2>
          </div>
        ) : null}
        <div className="mx-auto grid w-full max-w-1440 grid-cols-1 md:grid-cols-2 min-[1920px]:mx-0 min-[1920px]:!max-w-none min-[1920px]:w-full">
          <div className="h-[540px] bg-gray200 lg:h-[800px]" />
          <div className="hidden h-[800px] bg-gray200/80 md:block" />
        </div>
      </section>
    );
  }

  const {
    productSkus: _skus,
    featuredProductSku: _featured,
    defaultActiveIndex: _default,
    products: fallbackProducts,
    ...alankaraProps
  } = collectionProps;

  return (
    <AlankaraCollection
      id={id}
      sectionHeading={sectionHeading}
      defaultProductCtaLabel="Shop Now"
      defaultActiveIndex={defaultActiveIndex}
      {...alankaraProps}
      products={magentoProducts ?? fallbackProducts}
    />
  );
};

export default FeaturedCollectionSection;
