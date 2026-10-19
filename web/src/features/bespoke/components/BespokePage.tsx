import type { NormalizedContactBespokePage } from "@/services/bespoke/contact-bespoke-page.types";
import BespokeBelowFoldLazy from "./BespokeBelowFoldLazy";
import BespokeHeroSection from "./BespokeHeroSection";

type BespokePageProps = {
  page: NormalizedContactBespokePage;
};

const BespokePage = ({ page }: BespokePageProps) => {
  return (
    <>
      {page.hero && <BespokeHeroSection hero={page.hero} />}
      <BespokeBelowFoldLazy
        story={page.story}
        customDesignForm={page.customDesignForm}
        featuredStories={page.featuredStories}
        pastCreations={page.pastCreations}
        guarantees={page.guarantees}
        interested={page.interested}
      />
    </>
  );
};

export default BespokePage;
