import AboutBrillianceSkeleton from "./AboutBrillianceSkeleton";
import AboutFacesSkeleton from "./AboutFacesSkeleton";
import AboutGuaranteesSkeleton from "./AboutGuaranteesSkeleton";
import AboutHandcraftedSkeleton from "./AboutHandcraftedSkeleton";
import AboutHeirloomSkeleton from "./AboutHeirloomSkeleton";
import AboutHeroSkeleton from "./AboutHeroSkeleton";
import AboutSince1997Skeleton from "./AboutSince1997Skeleton";
import AboutTimelineSkeleton from "./AboutTimelineSkeleton";

type AboutPageSkeletonProps = {
  /** Timeline is below the fold and CMS-controlled — omit unless known active. */
  includeTimeline?: boolean;
};

const AboutPageSkeleton = ({ includeTimeline = false }: AboutPageSkeletonProps) => (
  <div aria-busy="true" aria-label="Loading about page">
    <AboutHeroSkeleton />
    <AboutBrillianceSkeleton />
    <AboutSince1997Skeleton />
    <AboutFacesSkeleton />
    <AboutHandcraftedSkeleton />
    {includeTimeline ? <AboutTimelineSkeleton /> : null}
    <AboutGuaranteesSkeleton />
    <AboutHeirloomSkeleton />
  </div>
);

export default AboutPageSkeleton;
