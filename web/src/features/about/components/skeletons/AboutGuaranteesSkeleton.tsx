import PageContainer from "@/shared/ui/layout/PageContainer";
import { Skeleton } from "@/shared/ui/skeleton";

const AboutGuaranteesSkeleton = () => (
  <section aria-busy="true" aria-label="Loading guarantees section" className="bg-gray200">
    <PageContainer className="py-16">
      <div className="flex flex-col items-center gap-6 md:hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex w-full flex-col items-center gap-3">
            {index > 0 ? <Skeleton className="h-px w-full rounded-none bg-gray300" aria-hidden /> : null}
            <Skeleton className="h-10 w-10 rounded-md bg-gray300" aria-hidden />
            <Skeleton className="h-5 w-48 max-w-full rounded-md bg-gray300" aria-hidden />
          </div>
        ))}
      </div>
      <div className="hidden md:flex lg:items-stretch lg:justify-center lg:gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            {index > 0 ? <Skeleton className="h-136 w-px rounded-none bg-gray300" aria-hidden /> : null}
            <div className="flex h-136 w-260 flex-col items-center justify-center gap-3">
              <Skeleton className="h-16 w-16 rounded-md bg-gray300" aria-hidden />
              <Skeleton className="h-5 w-40 rounded-md bg-gray300" aria-hidden />
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  </section>
);

export default AboutGuaranteesSkeleton;
