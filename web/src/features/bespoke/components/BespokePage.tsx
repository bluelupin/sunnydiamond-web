import type { NormalizedContactBespokePage } from "@/services/bespoke/contact-bespoke-page.types";
import BespokeFeaturedStoriesSection from "./BespokeFeaturedStoriesSection";
import BespokeGuaranteesSection from "./BespokeGuaranteesSection";
import BespokeHeroSection from "./BespokeHeroSection";
import BespokeInterestedSection from "./BespokeInterestedSection";
import BespokeStorySection from "./BespokeStorySection";

type BespokePageProps = {
  page: NormalizedContactBespokePage;
};

const BespokePage = ({ page }: BespokePageProps) => {
  return (
    <>
      {page.hero && <BespokeHeroSection hero={page.hero} />}
      {page.story &&
        <BespokeStorySection story={page.story} customDesignForm={page.customDesignForm} />
      }
      {page.featuredStories && (
        <BespokeFeaturedStoriesSection
          featuredStories={page.featuredStories}
        />
      )}
      {page.guarantees.length > 0 && <BespokeGuaranteesSection guarantees={page.guarantees} />}
      {page.interested && <BespokeInterestedSection interested={page.interested} />}
    </>
  );
};

export default BespokePage;
