import PageContainer from "@/shared/ui/layout/PageContainer";
import { Skeleton } from "@/shared/ui/skeleton";

const AboutBrillianceSkeleton = () => (
  <section aria-busy="true" aria-label="Loading brilliance section" className="bg-white pt-14 sm:pt-16 lg:pt-100">
    <PageContainer className="flex w-full justify-center">
      <div className="flex w-full max-w-[950px] flex-col items-center text-center">
        <Skeleton className="mx-auto mb-8 h-12 w-full max-w-[640px] rounded-md bg-gray200 lg:mb-12 md:mb-9 sm:h-14 lg:h-20" aria-hidden />
        <Skeleton className="mx-auto h-220 w-220 rounded-md bg-gray200 sm:h-280 sm:w-280 lg:h-354 lg:w-354" aria-hidden />
        <Skeleton className="mx-auto mt-5 h-24 w-px rounded-none bg-gray300 lg:mt-[23px]" aria-hidden />
        <Skeleton className="mx-auto mt-2.5 h-20 w-full max-w-[557px] rounded-md bg-gray200 sm:mt-3 lg:mt-[13px]" aria-hidden />
      </div>
    </PageContainer>
  </section>
);

export default AboutBrillianceSkeleton;
