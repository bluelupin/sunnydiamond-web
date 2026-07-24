"use client";

import { useEffect, useRef } from "react";
import {
  markHomepageNavigation,
  reportHomepageHeroPaint,
  reportHomepageTtfb,
} from "@/lib/homepage/homepagePerformance";

type HomepagePerformanceReporterProps = {
  hasHeroContent: boolean;
};

const HomepagePerformanceReporter = ({ hasHeroContent }: HomepagePerformanceReporterProps) => {
  const reportedRef = useRef(false);

  useEffect(() => {
    if (reportedRef.current) {
      return;
    }

    reportedRef.current = true;
    markHomepageNavigation();
    reportHomepageTtfb();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        reportHomepageHeroPaint({ hasHeroContent });
      });
    });
  }, [hasHeroContent]);

  return null;
};

export default HomepagePerformanceReporter;
