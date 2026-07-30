import type { Metadata } from "next";
import { Suspense } from "react";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import DfeInvestPage from "@/features/diamonds-for-everyone/components/invest/DfeInvestPage";
import { diamondsForEveryonePageContent } from "@/features/diamonds-for-everyone/data/content";
import { parseDfeInvestAmount } from "@/features/diamonds-for-everyone/utils/investRoutes";

export const metadata: Metadata = constructMetadata({
  title: diamondsForEveryonePageContent.investFlow.pageTitle,
  description:
    "Open your Diamonds for Everyone account, complete KYC, add a nominee, and review your savings plan with Sunny Diamonds.",
  canonicalPath: "/diamonds-for-everyone/invest",
});

type PageProps = {
  searchParams: Promise<{ amount?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const monthlyAmount = parseDfeInvestAmount(params.amount);

  return (
    <Suspense fallback={null}>
      <DfeInvestPage monthlyAmount={monthlyAmount} />
    </Suspense>
  );
}
