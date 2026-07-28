"use client";

import Image from "next/image";
import { DetailTextLink } from "@/features/products/components/detail/shared";
import { profileTabsContent } from "../data/profileContent";
import type { ProfileBespokeItemUi } from "../types/profileUi.types";
import { ProfileCard, ProfileMetaDivider } from "./profileUi";

type ProfileBespokeCardProps = {
  item: ProfileBespokeItemUi;
  onShare: () => void;
  onRemove: () => void;
};

export function ProfileBespokeCard({ item, onShare, onRemove }: ProfileBespokeCardProps) {
  const content = profileTabsContent.bespoke;

  return (
    <ProfileCard className="flex flex-col gap-6 p-0">
      <div className="relative mx-6 mt-10 h-[303px] overflow-hidden bg-white">
        <Image
          src={item.imageSrc}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 440px"
        />
      </div>

      <div className="flex flex-col items-center gap-4 px-6 pb-6 text-center">
        <h3 className="font-gill text-xl font-normal leading-110 text-darkblack">
          {item.title}
        </h3>

        {item.size || item.metal ? (
          <div className="flex flex-wrap items-center justify-center gap-2 font-gill text-xl leading-110 text-darkblack">
            {item.size ? (
              <span className="font-light">
                Size: <span className="font-normal">{item.size}</span>
              </span>
            ) : null}
            {item.size && item.metal ? <ProfileMetaDivider /> : null}
            {item.metal ? <span className="font-light">{item.metal}</span> : null}
          </div>
        ) : null}

        {item.price ? (
          <p className="font-gill text-xl font-normal leading-110 text-darkblack">
            {item.price}
          </p>
        ) : null}

        <div className="flex items-center gap-6 pt-2">
          <DetailTextLink onClick={onShare} className="text-sm uppercase">
            {content.shareLabel}
          </DetailTextLink>
          <DetailTextLink onClick={onRemove} className="text-sm uppercase">
            {content.removeLabel}
          </DetailTextLink>
        </div>
      </div>
    </ProfileCard>
  );
}
