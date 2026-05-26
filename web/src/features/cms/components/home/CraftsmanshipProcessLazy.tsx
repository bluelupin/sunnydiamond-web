"use client";

import { Suspense, lazy } from "react";

const CraftsmanshipProcess = lazy(
  () => import("@/features/cms/components/home/CraftsmanshipProcess")
);

export default function CraftsmanshipProcessLazy({
  id,
  homeData,
}: {
  id?: string;
  homeData?: Record<string, any>;
}) {
  return (
    <Suspense fallback={<div className="py-16" />}>
      <CraftsmanshipProcess id={id} homeData={homeData} />
    </Suspense>
  );
}
