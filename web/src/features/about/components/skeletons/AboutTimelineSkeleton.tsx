import PageContainer from "@/shared/ui/layout/PageContainer";
import { Skeleton } from "@/shared/ui/skeleton";

const AboutTimelineSkeleton = () => (
  <section aria-busy="true" aria-label="Loading timeline section" className="relative">
    <div className="sticky top-0 z-10 h-screen overflow-hidden">
      <Skeleton className="absolute inset-0 rounded-none bg-gray200" aria-hidden />
      <PageContainer className="relative z-10 flex h-full flex-col px-4 lg:px-0">
        <div className="flex h-full flex-col md:flex-row lg:justify-between">
          <div className="w-full shrink-0 pt-5 md:w-143 md:pt-0">
            <Skeleton className="mb-4 h-8 w-24 rounded-md bg-gray300/80 md:hidden" aria-hidden />
            <div className="hidden flex-col gap-8 md:flex">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-6 w-16 rounded-md bg-gray300/70"
                  aria-hidden
                />
              ))}
            </div>
          </div>
          <div className="mb-16 mt-auto lg:mb-100 lg:mt-auto lg:self-end">
            <Skeleton className="h-48 w-full rounded-none bg-white/90 lg:h-56 lg:w-557" aria-hidden />
          </div>
        </div>
      </PageContainer>
    </div>
  </section>
);

export default AboutTimelineSkeleton;
