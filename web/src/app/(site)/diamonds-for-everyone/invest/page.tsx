import type { Metadata } from "next";
import { Suspense } from "react";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { siteConfig } from "@/shared/lib/siteConfig";
import DfeInvestPage from "@/features/diamonds-for-everyone/components/invest/DfeInvestPage";
import { diamondsForEveryonePageContent } from "@/features/diamonds-for-everyone/data/content";
import { resolveDfeInvestmentConfig } from "@/features/diamonds-for-everyone/utils/investmentConfig";
import { parseDfeInvestAmount } from "@/features/diamonds-for-everyone/utils/investRoutes";
import { getDiamondsForEveryonePage } from "@/services/diamonds-for-everyone/diamonds-for-everyone-page.service";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getDiamondsForEveryonePage();
  const title = page.investmentPlanner?.accountSetup?.heading;
  const description = page.investmentPlanner?.accountSetup?.description;

  return constructMetadata({
    title: title ?? siteConfig.brand.name,
    ...(description ? { description } : {}),
    canonicalPath: "/diamonds-for-everyone/invest",
  });
}

type PageProps = {
  searchParams: Promise<{ amount?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = await getDiamondsForEveryonePage();
  const investment =
    page.investmentPlanner?.investment ??
    resolveDfeInvestmentConfig(null, diamondsForEveryonePageContent.investment);
  const monthlyAmount = parseDfeInvestAmount(params.amount, investment);

  return (
    <Suspense fallback={null}>
      <DfeInvestPage
        monthlyAmount={monthlyAmount}
        investment={investment}
        investmentPlannerImage={page.investmentPlanner?.image ?? null}
        accountSetup={page.investmentPlanner?.accountSetup ?? null}
        stepperSteps={page.investmentPlanner?.stepperSteps ?? []}
        successScreen={page.successScreen}
      />
    </Suspense>
  );
}
