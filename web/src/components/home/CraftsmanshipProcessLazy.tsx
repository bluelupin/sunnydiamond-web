"use client";

import { Suspense, lazy } from "react";

const CraftsmanshipProcess = lazy(
  () => import("@/components/home/CraftsmanshipProcess")
);

export default function CraftsmanshipProcessLazy({
  id,
}: {
  id?: string;
}) {
  return (
    <Suspense fallback={<div className="py-16" />}>
      <CraftsmanshipProcess id={id} />
    </Suspense>
  );
}
