export default function FeaturedCarouselSkeleton() {
  return (
    <div className="relative h-[275px] w-full sm:h-[303px] md:h-[411px]">
      <div className="absolute left-1/2 top-0 h-[155px] w-[200px] -translate-x-1/2 animate-pulse rounded bg-gray200 sm:h-[170px] sm:w-[260px] md:h-[259px] md:w-[600px]" aria-hidden />
    </div>
  );
}
