import PageContainer from "@/shared/ui/layout/PageContainer";
import { Skeleton } from "@/shared/ui/skeleton";

const AboutHandcraftedSkeleton = () => (
  <section aria-busy="true" aria-label="Loading handcrafted section" className="overflow-x-hidden bg-white">
    <PageContainer className="px-0 md:px-0">
      <Skeleton className="h-700 w-full rounded-none bg-gray200" aria-hidden />
    </PageContainer>
    <div className="relative z-10 mt-6 px-3 md:hidden">
      <div className="flex w-full flex-col gap-[2px]">
        <div className="grid grid-cols-3 gap-[2px]">
          <Skeleton className="aspect-square rounded-none bg-gray200" aria-hidden />
          <Skeleton className="aspect-square rounded-none bg-gray200" aria-hidden />
          <Skeleton className="aspect-square rounded-none bg-gray200" aria-hidden />
        </div>
        <div className="grid grid-cols-2 gap-[2px]">
          <Skeleton className="aspect-[3/2] rounded-none bg-gray200" aria-hidden />
          <Skeleton className="aspect-[3/2] rounded-none bg-gray200" aria-hidden />
        </div>
      </div>
    </div>
    <PageContainer className="relative z-10 mt-6 hidden md:block">
      <Skeleton className="mx-auto aspect-[1160/693] w-full max-w-[1160px] rounded-md bg-gray200" aria-hidden />
    </PageContainer>
    <div className="flex justify-center pb-16 pt-5 md:pb-20 lg:pb-[100px]">
      <Skeleton className="h-24 w-px rounded-none bg-gray300" aria-hidden />
    </div>
  </section>
);

export default AboutHandcraftedSkeleton;
