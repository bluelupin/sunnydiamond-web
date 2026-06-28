import PageContainer from "@/shared/ui/layout/PageContainer";
import { Skeleton } from "@/shared/ui/skeleton";

const AboutSince1997Skeleton = () => (
  <>
    <section
      aria-busy="true"
      aria-label="Loading legacy section"
      className="relative hidden bg-white md:block"
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden bg-white pt-100">
        <PageContainer className="shrink-0 pb-10">
          <Skeleton className="h-12 w-48 rounded-md bg-gray200" aria-hidden />
        </PageContainer>
        <PageContainer className="flex min-h-0 flex-1 flex-col pb-100 pt-0">
          <div className="flex min-h-0 flex-1 items-center gap-20 overflow-hidden">
            <Skeleton className="h-600 w-[549px] shrink-0 rounded-md bg-gray200" aria-hidden />
            <Skeleton className="hidden h-600 w-358 shrink-0 rounded-md bg-gray200 md:block" aria-hidden />
            <Skeleton className="h-417 w-320 shrink-0 rounded-md bg-gray200" aria-hidden />
          </div>
        </PageContainer>
      </div>
    </section>

    <section aria-busy="true" aria-hidden className="bg-white py-16 md:py-20 md:hidden">
      <PageContainer className="pb-0">
        <Skeleton className="h-10 w-48 rounded-md bg-gray200" aria-hidden />
        <Skeleton className="mt-3 h-6 w-full max-w-xl rounded-md bg-gray200" aria-hidden />
      </PageContainer>
      <PageContainer className="pt-0 !pr-0 pl-5">
        <Skeleton className="mt-8 h-600 w-full rounded-md bg-gray200" aria-hidden />
        <div className="mt-6 flex gap-3 overflow-hidden">
          <Skeleton className="h-[240px] w-[256px] shrink-0 rounded-md bg-gray200" aria-hidden />
          <Skeleton className="h-[277px] w-[256px] shrink-0 rounded-md bg-gray200" aria-hidden />
        </div>
      </PageContainer>
    </section>
  </>
);

export default AboutSince1997Skeleton;
