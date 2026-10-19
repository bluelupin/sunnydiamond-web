import { Skeleton } from "@/shared/ui/skeleton";

const BespokeGuaranteesSkeleton = () => (
  <section aria-busy="true" aria-label="Loading guarantees section" className="bg-gray200">
    <ul className="m-0 flex list-none flex-col items-center justify-center gap-6 p-0 py-10 md:flex-row md:gap-12 md:py-16">
      {Array.from({ length: 3 }).map((_, index) => (
        <li key={index} className="flex flex-col items-center gap-2">
          <Skeleton className="size-10 rounded-md bg-gray300 lg:size-16" aria-hidden />
          <Skeleton className="h-5 w-40 rounded-md bg-gray300" aria-hidden />
        </li>
      ))}
    </ul>
  </section>
);

export default BespokeGuaranteesSkeleton;
