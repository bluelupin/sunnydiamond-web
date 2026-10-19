"use client";

import dynamic from "next/dynamic";
import type {
  NormalizedBespokeCustomDesignForm,
  NormalizedBespokeFeaturedStories,
  NormalizedBespokeGetInTouch,
  NormalizedBespokeGuarantee,
  NormalizedBespokePastCreations,
  NormalizedBespokeStory,
} from "@/services/bespoke/contact-bespoke-page.types";
import BespokeLazyInView from "./BespokeLazyInView";
import BespokeFeaturedStoriesSkeleton from "./skeletons/BespokeFeaturedStoriesSkeleton";
import BespokeGuaranteesSkeleton from "./skeletons/BespokeGuaranteesSkeleton";
import BespokeInterestedSkeleton from "./skeletons/BespokeInterestedSkeleton";
import BespokeStorySkeleton from "./skeletons/BespokeStorySkeleton";

const BespokeStorySection = dynamic(() => import("./BespokeStorySection"), {
  loading: () => <BespokeStorySkeleton />,
});

const BespokeFeaturedStoriesSection = dynamic(
  () => import("./BespokeFeaturedStoriesSection"),
  { loading: () => <BespokeFeaturedStoriesSkeleton /> },
);

const BespokeGuaranteesSection = dynamic(() => import("./BespokeGuaranteesSection"), {
  loading: () => <BespokeGuaranteesSkeleton />,
});

const BespokeInterestedSection = dynamic(() => import("./BespokeInterestedSection"), {
  loading: () => <BespokeInterestedSkeleton />,
});

type BespokeBelowFoldLazyProps = {
  story: NormalizedBespokeStory | null;
  customDesignForm: NormalizedBespokeCustomDesignForm | null;
  featuredStories: NormalizedBespokeFeaturedStories | null;
  pastCreations: NormalizedBespokePastCreations | null;
  guarantees: NormalizedBespokeGuarantee[];
  interested: NormalizedBespokeGetInTouch | null;
};

const BespokeBelowFoldLazy = ({
  story,
  customDesignForm,
  featuredStories,
  pastCreations,
  guarantees,
  interested,
}: BespokeBelowFoldLazyProps) => (
  <>
    {story ? (
      <BespokeLazyInView fallback={<BespokeStorySkeleton />}>
        <BespokeStorySection story={story} customDesignForm={customDesignForm} />
      </BespokeLazyInView>
    ) : null}
    {featuredStories ? (
      <BespokeLazyInView fallback={<BespokeFeaturedStoriesSkeleton />}>
        <BespokeFeaturedStoriesSection
          featuredStories={featuredStories}
          pastCreations={pastCreations}
        />
      </BespokeLazyInView>
    ) : null}
    {guarantees.length > 0 ? (
      <BespokeLazyInView fallback={<BespokeGuaranteesSkeleton />}>
        <BespokeGuaranteesSection guarantees={guarantees} />
      </BespokeLazyInView>
    ) : null}
    {interested ? (
      <BespokeLazyInView fallback={<BespokeInterestedSkeleton />}>
        <BespokeInterestedSection interested={interested} />
      </BespokeLazyInView>
    ) : null}
  </>
);

export default BespokeBelowFoldLazy;
