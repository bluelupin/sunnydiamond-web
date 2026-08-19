const shimmer = "animate-pulse bg-gray200";

function ProfileSupportFaqItemSkeleton({ showDivider = true }: { showDivider?: boolean }) {
  return (
    <>
      <div className="flex w-full items-start gap-2 lg:min-h-14 lg:items-center">
        <div className={`h-4 min-w-0 flex-1 lg:h-5 ${shimmer}`} />
        <div className={`size-6 shrink-0 ${shimmer}`} />
      </div>
      {showDivider ? <div className="h-[0.5px] bg-neutral300" aria-hidden /> : null}
    </>
  );
}

type ProfileSupportFaqSkeletonProps = {
  itemCount?: number;
};

export function ProfileSupportFaqSkeleton({ itemCount = 5 }: ProfileSupportFaqSkeletonProps) {
  return (
    <section
      className="bg-white px-4 py-16 md:px-10 lg:py-100"
      aria-busy="true"
      aria-label="Loading frequently asked questions"
    >
      <div className="mx-auto flex w-full max-w-[910px] flex-col gap-8 lg:items-center lg:gap-10">
        <div className={`h-9 w-64 md:h-10 lg:h-12 lg:w-80 ${shimmer}`} />

        <div className="flex w-full flex-col gap-4">
          {Array.from({ length: itemCount }).map((_, index) => (
            <ProfileSupportFaqItemSkeleton
              key={index}
              showDivider={index < itemCount - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
