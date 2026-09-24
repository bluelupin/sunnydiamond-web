import type { Metadata } from "next";
import { Suspense } from "react";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { seoContent } from "@/features/cms/data/content";
import OrderTrackingPage from "@/features/order-tracking/components/OrderTrackingPage";

export const metadata: Metadata = constructMetadata({
  title: seoContent.orderTracking.title,
  description: seoContent.orderTracking.description,
  canonicalPath: "/order-tracking",
});

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] bg-gray200" aria-hidden />}>
      <OrderTrackingPage />
    </Suspense>
  );
}
