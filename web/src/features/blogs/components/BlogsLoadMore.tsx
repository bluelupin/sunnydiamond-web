"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import {
  BLOGS_LOAD_MORE_STEP,
} from "../utils/blogsListingQuery";

type BlogsLoadMoreProps = {
  category: string;
  limit: number;
  total: number;
  buttonLabel: string;
};

const BlogsLoadMore = ({
  category,
  limit,
  total,
  buttonLabel,
}: BlogsLoadMoreProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const shownCount = Math.min(limit, total);
  const hasMore = limit < total;
  const progressWidth = Math.min((shownCount / Math.max(total, 1)) * 360, 360);

  const handleLoadMore = () => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    const nextLimit = Math.min(limit + BLOGS_LOAD_MORE_STEP, total);
    params.set("limit", String(nextLimit));

    if (category !== "all") {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    const query = params.toString();
    router.push(query ? `/blogs?${query}` : "/blogs", { scroll: false });
  };

  if (total === 0) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-[360px] flex-col items-center gap-6">
      <div className="flex w-full flex-col items-center gap-3">
        <p className="font-gill text-base font-light leading-110 text-darkblack">
          {shownCount} out of {total} Blogs
        </p>
        <div className="h-0.5 w-full overflow-hidden bg-neutral300">
          <div
            className="h-[3px] bg-darkblack transition-all duration-300"
            style={{ width: `${progressWidth}px` }}
            aria-hidden
          />
        </div>
      </div>
      {hasMore ? (
        <button
          type="button"
          onClick={handleLoadMore}
          className={cn(
            "flex h-14 w-full items-center justify-center border border-neutral300 px-7 font-gill text-sm font-normal uppercase leading-110 text-darkblack transition-colors hover:border-darkblack",
          )}
        >
          {buttonLabel}
        </button>
      ) : null}
    </div>
  );
};

export default BlogsLoadMore;
