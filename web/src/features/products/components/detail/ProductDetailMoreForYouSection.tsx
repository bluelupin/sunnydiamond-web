"use client";

import FeaturedProductsCarousel, {
  type FeaturedCarouselItem,
} from "@/features/cms/components/home/FeaturedProductsCarousel";
import PageContainer from "@/shared/ui/layout/PageContainer";
import type { MoreForYouCarouselItem } from "@/features/products/data/moreForYouContent";

type ProductDetailMoreForYouSectionProps = {
  items: MoreForYouCarouselItem[];
};

const MORE_FOR_YOU_CTA_LABEL = "Discover";

function mapToFeaturedCarouselItems(items: MoreForYouCarouselItem[]): FeaturedCarouselItem[] {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    price: null,
    image: item.image,
    href: item.href,
  }));
}

const ProductDetailMoreForYouSection = ({ items }: ProductDetailMoreForYouSectionProps) => {
  if (items.length === 0) return null;

  const carouselItems = mapToFeaturedCarouselItems(items);

  return (
    <section aria-labelledby="more-for-you-heading" className="overflow-x-clip py-16 lg:py-100">
      <div className="flex w-full max-w-full flex-col items-center gap-6 overflow-x-clip lg:gap-10">
        <div className="px-4 lg:px-10">
          <PageContainer className="px-0">
            <div className="mx-auto flex w-full max-w-1360 flex-col items-center gap-3 text-center lg:max-w-none lg:gap-0">
              <h2
                id="more-for-you-heading"
                className="w-full font-larken text-32 font-light leading-110 text-darkblack lg:text-center lg:text-48"
              >
                {/* <span className="md:hidden">Your Diamond Awaits</span> */}
                <span>More for You</span>
              </h2>
              <p className="max-w-[306px] font-gill text-base font-light leading-110 text-neutral500 md:hidden">
                Traditional mastery bringing every diamond to radiant, eternal life.
              </p>
            </div>
          </PageContainer>
        </div>

        <FeaturedProductsCarousel
          items={carouselItems}
          ctaLabel={MORE_FOR_YOU_CTA_LABEL}
          sectionLabel="More for You"
        />
      </div>
    </section>
  );
};

export default ProductDetailMoreForYouSection;
