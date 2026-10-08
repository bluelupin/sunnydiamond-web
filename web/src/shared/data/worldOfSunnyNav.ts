import { learnAboutDiamondsRoute } from "@/features/education/data/content";
import { WORLD_OF_SUNNY_PATH } from "@/shared/utils/navigation";

export type WorldOfSunnyNavItem = {
  id: string;
  label: string;
  href: string;
  imageSrc: string;
};

/** Static World of Sunny mega-menu cards — Figma 6695:49724 / 6695:50267. */
export const WORLD_OF_SUNNY_NAV_ITEMS: WorldOfSunnyNavItem[] = [
  {
    id: "our-story",
    label: "Our Story",
    href: WORLD_OF_SUNNY_PATH,
    imageSrc: "/images/navigation/world-of-sunny/our-story.png",
  },
  {
    id: "learn-about-diamonds",
    label: "Learn More About Diamonds",
    href: learnAboutDiamondsRoute,
    imageSrc: "/images/navigation/world-of-sunny/learn-about-diamonds.png",
  },
  {
    id: "diamonds-for-everyone",
    label: "Diamonds for Everyone",
    href: "/diamonds-for-everyone",
    imageSrc: "/images/navigation/world-of-sunny/diamonds-for-everyone.png",
  },
];
