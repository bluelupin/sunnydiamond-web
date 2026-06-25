import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import type { NormalizedCraftCard } from "@/services/about/about-page.types";
import {
  aboutHandcraftedAssets,
  aboutHandcraftedFigmaSpec,
  aboutHandcraftedMobileLayout,
} from "../data/content";

const { card: cardSpec, mobileGrid } = aboutHandcraftedFigmaSpec;
const { mosaicCols, mosaicRows } = mobileGrid;

type AboutHandcraftedMobileGridProps = {
  cards: NormalizedCraftCard[];
};

type MosaicPhotoTileProps = {
  mosaicCol: number;
  mosaicRow: number;
  className?: string;
};

const MosaicPhotoTile = ({ mosaicCol, mosaicRow, className }: MosaicPhotoTileProps) => (
  <div className={cn("relative overflow-hidden", className)}>
    <div
      className="absolute inset-0 bg-no-repeat"
      style={{
        backgroundImage: `url(${aboutHandcraftedAssets.intersect})`,
        backgroundSize: `${mosaicCols * 100}% ${mosaicRows * 100}%`,
        backgroundPosition: `${(mosaicCol / (mosaicCols - 1)) * 100}% ${(mosaicRow / (mosaicRows - 1)) * 100}%`,
      }}
      role="img"
      aria-hidden
    />
  </div>
);

type MobileCardTileProps = {
  card: NormalizedCraftCard;
  className?: string;
};

const MobileCardTile = ({ card, className }: MobileCardTileProps) => (
  <article
    className={cn(
      "flex h-[111px] flex-col items-center justify-center bg-chalkCard px-2",
      className,
    )}
    style={{ gap: `${card.gap}px` }}
  >
    <Image
      src={aboutHandcraftedAssets.flourish}
      alt=""
      width={cardSpec.iconWidth}
      height={cardSpec.iconHeight}
      aria-hidden
      className="h-[10px] w-[10px] shrink-0"
    />
    <h3 className="darkblack text-center font-larken text-sm font-light leading-[110%]">
      {card.title}
    </h3>
  </article>
);

const AboutHandcraftedMobileGrid = ({ cards }: AboutHandcraftedMobileGridProps) => {
  const cardByIndex = new Map(cards.map((card) => [card.layoutIndex, card]));

  type MobileLayoutTile =
    | (typeof aboutHandcraftedMobileLayout.row1)[number]
    | (typeof aboutHandcraftedMobileLayout.row3)[number];

  const renderTile = (
    tile: MobileLayoutTile,
    key: string,
    photoClassName: string,
  ) => {
    if (tile.type === "photo") {
      return (
        <MosaicPhotoTile
          key={key}
          mosaicCol={tile.mosaicCol}
          mosaicRow={tile.mosaicRow}
          className={photoClassName}
        />
      );
    }

    const card = cardByIndex.get(tile.cardIndex);
    if (!card) {
      return (
        <MosaicPhotoTile
          key={key}
          mosaicCol={tile.cardIndex === 1 ? 2 : tile.cardIndex === 0 ? 0 : 4}
          mosaicRow={tile.cardIndex === 1 ? 1 : tile.cardIndex === 0 ? 2 : 2}
          className={photoClassName}
        />
      );
    }

    return <MobileCardTile key={key} card={card} className={photoClassName} />;
  };

  return (
    <div className="flex w-full flex-col gap-[2px]">
      <div className="grid grid-cols-3 gap-[2px]">
        {aboutHandcraftedMobileLayout.row1.map((tile, index) =>
          renderTile(tile, `r1-${index}`, "aspect-square"),
        )}
      </div>

      <div className="grid grid-cols-2 gap-[2px]">
        {aboutHandcraftedMobileLayout.row2.map((tile, index) => (
          <MosaicPhotoTile
            key={`r2-${index}`}
            mosaicCol={tile.mosaicCol}
            mosaicRow={tile.mosaicRow}
            className="aspect-[3/2]"
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-[2px]">
        {aboutHandcraftedMobileLayout.row3.map((tile, index) =>
          renderTile(tile, `r3-${index}`, "aspect-square"),
        )}
      </div>
    </div>
  );
};

export default AboutHandcraftedMobileGrid;
