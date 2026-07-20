import BespokeFeaturedStoriesSection from "./BespokeFeaturedStoriesSection";
import BespokeGuaranteesSection from "./BespokeGuaranteesSection";
import BespokeHeroSection from "./BespokeHeroSection";
import BespokeInterestedSection from "./BespokeInterestedSection";
import BespokeStorySection from "./BespokeStorySection";

const BespokePage = () => {
  return (
    <>
      <BespokeHeroSection />
      <BespokeStorySection />
      <BespokeFeaturedStoriesSection />
      <BespokeGuaranteesSection />
      <BespokeInterestedSection />
    </>
  );
};

export default BespokePage;
