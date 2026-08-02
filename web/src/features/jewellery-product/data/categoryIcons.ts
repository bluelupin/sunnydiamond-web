import type { ComponentType } from "react";
import type { JewelleryCategorySlug } from "../types";
import AllTabIcon from "@/assets/Icons/PLP/AllTabIcon";
import RingsTabIcon from "@/assets/Icons/PLP/RingsTabIcon";
import EarringsTabIcon from "@/assets/Icons/PLP/EarringsTabIcon";
import NecklaceTabIcon from "@/assets/Icons/PLP/NcklaceTabIcon";
import PendantsTabIcon from "@/assets/Icons/PLP/PendantsTabIcon";
import BraceletsTabIcon from "@/assets/Icons/PLP/BraceletsTabIcon";
import BanglesTabIcon from "@/assets/Icons/PLP/BanglesTabIcon";
import NosepinsTabIcon from "@/assets/Icons/PLP/NosepinsTabIcon";

export const categoryIconSrc: Record<JewelleryCategorySlug, ComponentType<{ className?: string }>> = {
  all: AllTabIcon,
  rings: RingsTabIcon,
  earrings: EarringsTabIcon,
  necklace: NecklaceTabIcon,
  pendants: PendantsTabIcon,
  bracelets: BraceletsTabIcon,
  bangles: BanglesTabIcon,
  nosepins: NosepinsTabIcon,
};
