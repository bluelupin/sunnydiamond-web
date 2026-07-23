import type { Metadata } from "next";
import { Suspense } from "react";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import ProfileOrderDetailPage from "@/features/account/components/ProfileOrderDetailPage";

type PageProps = {
  params: Promise<{ orderNumber: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { orderNumber } = await params;

  return constructMetadata({
    title: `Order ${orderNumber}`,
    description: `View details for Sunny Diamonds order ${orderNumber}.`,
    canonicalPath: `/profile/orders/${orderNumber}`,
    noIndex: true,
  });
}

export default async function Page({ params }: PageProps) {
  await params;

  return (
    <Suspense fallback={<div className="min-h-[40vh] bg-gray200" aria-hidden />}>
      <ProfileOrderDetailPage />
    </Suspense>
  );
}
