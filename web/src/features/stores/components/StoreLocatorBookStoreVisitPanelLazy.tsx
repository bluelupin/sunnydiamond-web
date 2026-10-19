"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import { ShowroomsLayoutSkeleton } from "./ShowroomsLayoutSkeleton";

const BookStoreVisitPanel = dynamic(
  () => import("@/features/products/components/detail/BookStoreVisitPanel"),
  {
    ssr: true,
    loading: () => (
      <div className="w-full" aria-busy="true" aria-label="Loading showrooms">
        <ShowroomsLayoutSkeleton />
      </div>
    ),
  },
);

type StoreLocatorBookStoreVisitPanelLazyProps = ComponentProps<typeof BookStoreVisitPanel>;

/** Store locator only — splits the heavy book-visit panel chunk; SSR markup unchanged. */
const StoreLocatorBookStoreVisitPanelLazy = (
  props: StoreLocatorBookStoreVisitPanelLazyProps,
) => <BookStoreVisitPanel {...props} />;

export default StoreLocatorBookStoreVisitPanelLazy;
