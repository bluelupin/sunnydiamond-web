import AboutBrillianceSkeleton from "./AboutBrillianceSkeleton";
import AboutFacesSkeleton from "./AboutFacesSkeleton";
import AboutGuaranteesSkeleton from "./AboutGuaranteesSkeleton";
import AboutHandcraftedSkeleton from "./AboutHandcraftedSkeleton";
import AboutHeirloomSkeleton from "./AboutHeirloomSkeleton";
import AboutHeroSkeleton from "./AboutHeroSkeleton";
import AboutSince1997Skeleton from "./AboutSince1997Skeleton";
import AboutTimelineSkeleton from "./AboutTimelineSkeleton";

const AboutPageSkeleton = () => (
  <div aria-busy="true" aria-label="Loading about page">
    <AboutHeroSkeleton />
    <AboutBrillianceSkeleton />
    <AboutSince1997Skeleton />
    <AboutFacesSkeleton />
    <AboutHandcraftedSkeleton />
    <AboutTimelineSkeleton />
    <AboutGuaranteesSkeleton />
    <AboutHeirloomSkeleton />
  </div>
);

export default AboutPageSkeleton;
