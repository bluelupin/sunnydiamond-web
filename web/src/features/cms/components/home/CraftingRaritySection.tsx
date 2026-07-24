import Image from "next/image";
import CraftingRarityCategoryGrid from "@/features/cms/components/home/CraftingRarityCategoryGrid";
import CraftingRarityCopyBlock from "@/features/cms/components/home/CraftingRarityCopyBlock";
import Reveal from "@/shared/Animation/Reveal";
import type { ResolvedCraftingRarityContent } from "@/lib/homepage/resolveHomepageAboveFold";

const CRAFTING_RARITY_NECKLACE = "/images/home/crafting-rarity-necklace.png";
const IMAGE_QUALITY = 75;

type CraftingRaritySectionProps = {
  id?: string;
  content: ResolvedCraftingRarityContent;
};

const CraftingRaritySection = ({ id, content }: CraftingRaritySectionProps) => {
  const { subtitleLines, secondaryCtaUrl, secondaryCtaLabel, categories } = content;

  return (
    <section id={id} className="w-full bg-white md:pb-12 pb-16">
      <div className="relative overflow-hidden h-390 md:h-420 lg:h-432">
        <Reveal
          direction="up"
          className="pointer-events-none absolute right-[-29px] sm:top-[-83px] top-[-100px] z-0 lg:right-[2%] lg:top-[-204px] lg:w-[600px] lg:h-[850px] md:w-[550px] md:h-[560px] sm:w-[550px] sm:h-[560px] w-full h-[435px]"
        >
          <div className="relative h-full w-full rotate-[-13.91deg]">
            <Image
              src={CRAFTING_RARITY_NECKLACE}
              alt=""
              fill
              quality={IMAGE_QUALITY}
              className="object-contain"
              sizes="(max-width: 1024px) 346px, 664px"
            />
          </div>
        </Reveal>
        <CraftingRarityCopyBlock
          subtitleLines={subtitleLines}
          secondaryCtaUrl={secondaryCtaUrl}
          secondaryCtaLabel={secondaryCtaLabel}
        />
      </div>

      <CraftingRarityCategoryGrid categories={categories} />
    </section>
  );
};

export default CraftingRaritySection;
