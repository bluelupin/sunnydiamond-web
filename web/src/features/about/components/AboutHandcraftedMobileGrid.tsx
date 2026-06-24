import Image from "next/image";
import { cn } from "@/shared/utils/cn";
import {
  aboutHandcraftedAssets,
  aboutHandcraftedContent,
  aboutHandcraftedFigmaSpec,
  aboutHandcraftedMobileLayout,
} from "../data/content";

const { card: cardSpec, mobileGrid } = aboutHandcraftedFigmaSpec;
const { mosaicCols, mosaicRows } = mobileGrid;

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
  cardIndex: number;
  className?: string;
};

const MobileCardTile = ({ cardIndex, className }: MobileCardTileProps) => {
  const card = aboutHandcraftedContent.cards[cardIndex];

  return (
    <article
      className={cn(
        "flex flex-col items-center justify-center bg-chalkCard px-2",
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
      <h3 className="text-center font-larken text-sm font-light leading-[110%] darkblack">
        {card.title}
      </h3>
    </article>
  );
};

const AboutHandcraftedMobileGrid = () => (
  <div className="flex w-full flex-col gap-[2px]">
    <div className="grid grid-cols-3 gap-[2px]">
      {aboutHandcraftedMobileLayout.row1.map((tile, index) =>
        tile.type === "photo" ? (
          <MosaicPhotoTile
            key={`r1-${index}`}
            mosaicCol={tile.mosaicCol}
            mosaicRow={tile.mosaicRow}
            className="aspect-square"
          />
        ) : (
          <MobileCardTile key={`r1-${index}`} cardIndex={tile.cardIndex} className="aspect-square" />
        ),
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
        tile.type === "photo" ? (
          <MosaicPhotoTile
            key={`r3-${index}`}
            mosaicCol={tile.mosaicCol}
            mosaicRow={tile.mosaicRow}
            className="aspect-square"
          />
        ) : (
          <MobileCardTile key={`r3-${index}`} cardIndex={tile.cardIndex} className="aspect-square" />
        ),
      )}
    </div>
  </div>
);

export default AboutHandcraftedMobileGrid;
