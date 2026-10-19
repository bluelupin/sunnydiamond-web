"use client";

import dynamic from "next/dynamic";
import type { NormalizedBrillianceSection } from "@/services/about/about-page.types";
import AboutBrillianceSkeleton from "./skeletons/AboutBrillianceSkeleton";
import AboutLazyInView from "./AboutLazyInView";

const AboutBrillianceSection = dynamic(() => import("./AboutBrillianceSection"), {
  loading: () => <AboutBrillianceSkeleton />,
});

type AboutBrillianceLazyProps = NormalizedBrillianceSection;

/** Defers brilliance JS and CMS images until the section nears the viewport. */
const AboutBrillianceLazy = (props: AboutBrillianceLazyProps) => (
  <AboutLazyInView fallback={<AboutBrillianceSkeleton />}>
    <AboutBrillianceSection {...props} />
  </AboutLazyInView>
);

export default AboutBrillianceLazy;
