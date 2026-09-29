import FeaturedProductsCenterModeSlider from "@/features/cms/components/home/FeaturedProductsCenterModeSlider";
import type { FeaturedCarouselItem } from "@/types/homepage/featuredCarousel";

type SearchNoResultsProps = {
  query: string;
  bestsellers: FeaturedCarouselItem[];
  advisorHref?: string;
};

/** R-PS-6: the results-page message, bestsellers and a way to reach a person. */
export default function SearchNoResults({ query, bestsellers, advisorHref }: SearchNoResultsProps) {
  return (
    <div className="flex flex-col items-center gap-10 overflow-x-clip py-16 lg:py-20">
      <div className="flex max-w-[640px] flex-col items-center gap-6 px-4 text-center">
        <p className="font-gill text-lg font-light leading-110 text-darkblack lg:text-xl">
          We couldn&apos;t find a match for &ldquo;{query}&rdquo;. Try a different spelling, or explore our
          bestsellers below.
        </p>
        {advisorHref ? (
          <a
            href={advisorHref}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b-[1.5px] border-darkblack pb-1 font-gill text-sm uppercase leading-110 text-darkblack"
          >
            Speak to a client advisor
          </a>
        ) : null}
      </div>
      {bestsellers.length ? (
        <div className="w-full">
          <FeaturedProductsCenterModeSlider items={bestsellers} ctaLabel="Discover" showCta />
        </div>
      ) : null}
    </div>
  );
}
