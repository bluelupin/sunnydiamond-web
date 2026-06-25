import PageContainer from "@/shared/ui/layout/PageContainer";
import { Skeleton } from "@/shared/ui/skeleton";

export default function AboutLoading() {
  return (
    <div aria-busy="true" aria-label="Loading about page">
      <Skeleton className="h-580 w-full rounded-none bg-gray200 sm:h-580 lg:h-640" />

      <PageContainer className="py-16">
        <Skeleton className="mx-auto h-12 w-full max-w-[640px]" />
        <Skeleton className="mx-auto mt-8 h-220 w-220 sm:h-280 sm:w-280 lg:mt-12 lg:h-354 lg:w-354" />
        <Skeleton className="mx-auto mt-8 h-24 w-full max-w-[557px]" />
      </PageContainer>

      <PageContainer className="py-16 md:py-20 lg:py-100">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-6 h-6 w-full max-w-xl" />
        <div className="mt-10 flex gap-6 overflow-hidden">
          <Skeleton className="h-600 w-full max-w-[549px] shrink-0" />
          <Skeleton className="hidden h-600 w-463 shrink-0 md:block" />
        </div>
      </PageContainer>

      <PageContainer className="py-16">
        <Skeleton className="mx-auto h-10 w-80" />
        <div className="mt-10 flex gap-2 overflow-hidden">
          <Skeleton className="h-[560px] w-[343px] shrink-0 md:w-[400px] lg:h-[600px] lg:flex-1" />
          <Skeleton className="hidden h-[560px] w-[343px] shrink-0 md:block md:w-[400px] lg:h-[600px] lg:flex-1" />
          <Skeleton className="hidden h-[560px] w-[343px] shrink-0 lg:block lg:h-[600px] lg:flex-1" />
        </div>
      </PageContainer>

      <Skeleton className="h-700 w-full rounded-none" />

      <PageContainer className="py-16">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-center">
          <Skeleton className="h-16 w-16 shrink-0 rounded-full" />
          <Skeleton className="h-16 w-16 shrink-0 rounded-full" />
          <Skeleton className="h-16 w-16 shrink-0 rounded-full" />
        </div>
      </PageContainer>

      <PageContainer className="py-16 md:py-20">
        <Skeleton className="mx-auto h-12 w-full max-w-3xl" />
      </PageContainer>
    </div>
  );
}
