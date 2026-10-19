import { Skeleton } from "@/shared/ui/skeleton";

const BespokeStorySkeleton = () => (
  <section aria-busy="true" aria-label="Loading bespoke story section" className="bg-white py-16 lg:py-104 pl-4 lg:pl-10">
    <div className="mx-auto mb-6 flex max-w-[720px] flex-col gap-4 pr-4">
      <Skeleton className="mx-auto h-10 w-full max-w-md rounded-md bg-gray200" aria-hidden />
      <Skeleton className="mx-auto h-6 w-full max-w-lg rounded-md bg-gray200" aria-hidden />
    </div>
    <Skeleton className="h-[250px] w-full max-w-[970px] rounded-none bg-gray200 md:h-[400px]" aria-hidden />
  </section>
);

export default BespokeStorySkeleton;
