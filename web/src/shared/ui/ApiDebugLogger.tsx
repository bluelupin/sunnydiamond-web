"use client";

import { useEffect } from "react";
import { getHeroSection } from "@/services/homepage/hero.service";
import { getTrustBadges } from "@/services/homepage/trustBadges.service";
import { getCategoryNavigationSection } from "@/services/homepage/categoryNavigation.service";
import { getDiamondSourcingSection } from "@/services/homepage/diamondSourcing.service";
import { getFeaturedCollectionSection } from "@/services/homepage/featuredCollection.service";
import { getGiftingBanner } from "@/services/homepage/giftingBanner.service";
import { getFeaturedProductsSection } from "@/services/homepage/featuredProducts.service";
import { getOccasionsTeaser } from "@/services/homepage/occasionsTeaser.service";
import { getCraftsmanshipSteps } from "@/services/homepage/craftsmanshipSteps.service";
import { getSunnyPromiseSection } from "@/services/homepage/sunnyPromise.service";
import { getBespokeForYouCards } from "@/services/homepage/bespokeCards.service";
import { getShowroomTeaser } from "@/services/homepage/showroomTeaser.service";
import { getHomepageSeo } from "@/services/homepage/seo.service";

const ApiDebugLogger = () => {
  useEffect(() => {
    const fetchDebug = async () => {
      try {
        if (typeof window !== "undefined") {
          console.group("[API Debug] Homepage section-wise responses");
          const [
            hero,
            trustBadges,
            categoryNavigation,
            diamondSourcing,
            featuredCollection,
            giftingBanner,
            featuredProducts,
            occasionsTeaser,
            craftsmanshipSteps,
            sunnyPromise,
            bespokeCards,
            showroomTeaser,
            seo,
          ] = await Promise.all([
            getHeroSection(),
            getTrustBadges(),
            getCategoryNavigationSection(),
            getDiamondSourcingSection(),
            getFeaturedCollectionSection(),
            getGiftingBanner(),
            getFeaturedProductsSection(),
            getOccasionsTeaser(),
            getCraftsmanshipSteps(),
            getSunnyPromiseSection(),
            getBespokeForYouCards(),
            getShowroomTeaser(),
            getHomepageSeo(),
          ]);

          console.log("hero:", hero);
          console.log("trustBadges:", trustBadges);
          console.log("categoryNavigation:", categoryNavigation);
          console.log("diamondSourcingSection:", diamondSourcing);
          console.log("featuredCollectionSection:", featuredCollection);
          console.log("giftingBanner:", giftingBanner);
          console.log("featuredProductsSection:", featuredProducts);
          console.log("occasionsTeaser:", occasionsTeaser);
          console.log("craftsmanshipSteps:", craftsmanshipSteps);
          console.log("sunnyPromiseSection:", sunnyPromise);
          console.log("bespokeForYouCards:", bespokeCards);
          console.log("showroomTeaser:", showroomTeaser);
          console.log("seo:", seo);
          console.groupEnd();
        }
      } catch (error) {
        console.error("[API Debug] Homepage section fetch failed", error);
      }
    };

    fetchDebug();
  }, []);

  return null;
};

export default ApiDebugLogger;
