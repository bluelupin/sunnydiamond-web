import { CartDivider } from "@/features/cart/components/CartFlowUi";
import { ProfileOrderCardDivider } from "./profileUi";

const shimmer = "animate-pulse bg-gray200";

function TimelineSkeleton() {
  return (
    <div className="border border-neutral300 bg-white">
      <div className="flex items-center justify-between border-b border-neutral300 px-4 py-4 lg:px-6">
        <div className={`h-4 w-32 ${shimmer}`} />
        <div className={`h-4 w-24 ${shimmer}`} />
      </div>

      <div className="hidden p-6 lg:block">
        <div className="relative">
          <div className={`absolute left-[10%] top-5 h-px w-[80%] ${shimmer}`} />
          <ol className="relative flex justify-between">
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index} className="flex min-w-0 flex-1 flex-col items-center gap-3">
                <div className={`size-10 shrink-0 rounded-full ${shimmer}`} />
                <div className={`h-4 w-16 max-w-full ${shimmer}`} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function ItemRowSkeleton() {
  return (
    <div className="border border-aboutInactive bg-white p-4">
      <div className="flex items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-6">
          <div className={`h-[63px] w-[71px] shrink-0 ${shimmer}`} />
          <div className="flex min-w-0 flex-col gap-2">
            <div className={`h-4 w-40 ${shimmer}`} />
            <div className={`h-3.5 w-28 ${shimmer}`} />
          </div>
        </div>
        <div className={`hidden h-4 w-16 shrink-0 sm:block ${shimmer}`} />
      </div>
    </div>
  );
}

export function ProfileOrderCardSkeleton() {
  return (
    <article className="bg-gray300 p-4 lg:p-6" aria-hidden>
      <div className="flex flex-col gap-6 lg:hidden">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className={`h-9 w-36 ${shimmer}`} />

            <div className="flex flex-col gap-2">
              <div className={`h-4 w-48 ${shimmer}`} />
              <div className={`h-4 w-56 ${shimmer}`} />
            </div>
          </div>

          <ProfileOrderCardDivider />

          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={`size-[100px] shrink-0 ${shimmer}`} />
            ))}
          </div>

          <ProfileOrderCardDivider />

          <div className="flex items-center justify-between">
            <div className={`h-4 w-12 ${shimmer}`} />
            <div className={`h-4 w-20 ${shimmer}`} />
          </div>
        </div>

        <div className={`h-14 w-full ${shimmer}`} />
      </div>

      <div className="hidden flex-col gap-6 lg:flex">
        <div className="flex flex-col gap-6">
          <div className={`h-10 w-40 ${shimmer}`} />

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`h-4 w-44 ${shimmer}`} />
              <div className={`hidden h-4 w-px bg-neutral300 sm:block`} aria-hidden />
              <div className={`h-4 w-36 ${shimmer}`} />
            </div>
            <div className={`h-4 w-32 shrink-0 ${shimmer}`} />
          </div>
        </div>

        <TimelineSkeleton />

        <div className="flex flex-col gap-4">
          <ItemRowSkeleton />
        </div>

        <div className="flex justify-end">
          <div className={`h-4 w-36 ${shimmer}`} />
        </div>

        <CartDivider />

        <div className="flex items-center justify-between">
          <div className={`h-4 w-12 ${shimmer}`} />
          <div className={`h-4 w-24 ${shimmer}`} />
        </div>

        <CartDivider />

        <div className="flex gap-6">
          <div className={`h-14 flex-1 ${shimmer}`} />
          <div className={`h-14 flex-1 ${shimmer}`} />
        </div>
      </div>
    </article>
  );
}
