"use client";

import Image from "next/image";
import { PLP_HERO_IMAGE_QUALITY } from "@/features/jewellery-product/utils/jewelleryPlpImage";
import { profileHeroSpec } from "../data/profileContent";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileBespokeRemovedToastBanner } from "./ProfileBespokeRemovedToast";

type ProfileHeroSectionProps = {
  firstName: string;
};

const ProfileHeroSection = ({ firstName }: ProfileHeroSectionProps) => {
  const { image } = profileHeroSpec;

  return (
    <section
      aria-hidden
      className="relative left-1/2 z-30 h-[240px] w-screen max-w-none -translate-x-1/2 overflow-visible md:h-320"
    >
      <div className="relative size-full overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          quality={PLP_HERO_IMAGE_QUALITY}
          sizes="100vw"
          className="object-cover object-[50%_30%]"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="absolute left-1/2 top-[191px] z-40 flex -translate-x-1/2 flex-col items-center md:top-[255px]">
        <ProfileAvatar firstName={firstName} />
        <ProfileBespokeRemovedToastBanner />
      </div>
    </section>
  );
};

export default ProfileHeroSection;
