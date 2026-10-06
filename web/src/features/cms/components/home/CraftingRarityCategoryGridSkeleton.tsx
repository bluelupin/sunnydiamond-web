import { cn } from "@/shared/utils/cn";

export const CATEGORY_GRID_CLASS_NAME =
  "grid w-full grid-cols-2 gap-3 px-4 md:grid-cols-4 md:px-0 lg:mt-12 md:mt-10 mt-8";

export const CATEGORY_CARD_WRAPPER_CLASS_NAME =
  "aspect-square w-full xl:h-[424px] lg:h-[380px] md:h-[250px] h-[226px]";

export function CategoryCardSkeleton() {
  return (
    <div
      className={cn(
        "flex aspect-square h-full w-full flex-col items-center justify-between overflow-hidden bg-gray300",
        "px-4 pt-4 md:pt-8 lg:px-6 lg:pt-12",
      )}
      aria-hidden
    >
      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-hidden lg:h-[303px] md:h-[250px] lg:max-w-[303px] md:max-w-[250px] h-[176px] max-w-[133px] h-full w-full">
        <div className="h-full w-full h-full max-w-full animate-pulse rounded-none bg-gray200" />
      </div>
      <div className="relative z-10 w-full shrink-0 pb-4 md:pb-10 lg:pb-[51px]">
        <div className="mx-auto h-4 w-24 animate-pulse rounded-none bg-gray200 md:h-5 md:w-32" />
      </div>
    </div>
  );
}

export function CategoryGridSkeleton() {
  return (
    <div className={CATEGORY_GRID_CLASS_NAME}>
      {[0, 1, 2, 3].map((index) => (
        <div key={index} className={CATEGORY_CARD_WRAPPER_CLASS_NAME}>
          <CategoryCardSkeleton />
        </div>
      ))}
    </div>
  );
}
