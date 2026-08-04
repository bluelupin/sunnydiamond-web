import type { NormalizedDiamondsForEveryonePage } from "@/services/diamonds-for-everyone/diamonds-for-everyone-page.types";
import DfeFaqSection from "./DfeFaqSection";
import DfeHeroSection from "./DfeHeroSection";
import DfeInvestmentSection from "./DfeInvestmentSection";
import DfeLifestyleSection from "./DfeLifestyleSection";
import DfePlanBannerSection from "./DfePlanBannerSection";
import DfeSavingsPlanSection from "./DfeSavingsPlanSection";

type DiamondsForEveryonePageProps = {
  page: NormalizedDiamondsForEveryonePage;
};

const DiamondsForEveryonePage = ({ page }: DiamondsForEveryonePageProps) => {
  return (
    <>
      {page.hero ? <DfeHeroSection hero={page.hero} /> : null}
      {page.planIntro ? <DfePlanBannerSection planIntro={page.planIntro} /> : null}
      {page.investmentPlanner ? (
        <DfeInvestmentSection investmentPlanner={page.investmentPlanner} />
      ) : null}
      {page.editorialBanner ? (
        <DfeLifestyleSection editorialBanner={page.editorialBanner} />
      ) : null}
      {page.benefits ? <DfeSavingsPlanSection benefits={page.benefits} /> : null}
      {page.faq ? <DfeFaqSection faq={page.faq} /> : null}
    </>
  );
};

export default DiamondsForEveryonePage;
