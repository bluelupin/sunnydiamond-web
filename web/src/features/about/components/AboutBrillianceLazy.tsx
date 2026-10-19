"use client";

import dynamic from "next/dynamic";
import type { NormalizedBrillianceSection } from "@/services/about/about-page.types";
import { LazyInView } from "@/shared/ui/LazyInView";
import AboutBrillianceSkeleton from "./skeletons/AboutBrillianceSkeleton";

const AboutBrillianceSection = dynamic(() => import("./AboutBrillianceSection"), {
  loading: () => <AboutBrillianceSkeleton />,
});

type AboutBrillianceLazyProps = NormalizedBrillianceSection;

const ABOUT_LAZY_ROOT_MARGIN = "240px 0px 240px 0px";

/** Defers brilliance JS and CMS images until the section nears the viewport. */
const AboutBrillianceLazy = (props: AboutBrillianceLazyProps) => (
  <LazyInView fallback={<AboutBrillianceSkeleton />} rootMargin={ABOUT_LAZY_ROOT_MARGIN}>
    <AboutBrillianceSection {...props} />
  </LazyInView>
);

export default AboutBrillianceLazy;
