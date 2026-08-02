"use client";

import Image from "next/image";
import { PLP_HERO_IMAGE_QUALITY } from "@/features/jewellery-product/utils/jewelleryPlpImage";
import { profileHeroSpec } from "../data/profileContent";
import { ProfileAvatar } from "./ProfileAvatar";

type ProfileHeroSectionProps = {
  firstName: string;
};

const ProfileHeroSection = ({ firstName }: ProfileHeroSectionProps) => {
  const { image, imageCrop, overlayOpacity } = profileHeroSpec;

  return (
    <section
      className="relative left-1/2 h-240 w-screen max-w-none -translate-x-1/2 overflow-visible md:h-320"
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          quality={PLP_HERO_IMAGE_QUALITY}
          sizes="100vw"
          className="object-cover md:hidden"
          style={{ objectPosition: imageCrop.mobile }}
        />
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          quality={PLP_HERO_IMAGE_QUALITY}
          sizes="100vw"
          className="hidden object-cover md:block"
          style={{ objectPosition: imageCrop.desktop }}
        />
        <div
          className="absolute inset-0 md:hidden"
          style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity.mobile})` }}
          aria-hidden
        />
        <div
          className="absolute inset-0 hidden md:block"
          style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity.desktop})` }}
          aria-hidden
        />
      </div>

      <div
        className="absolute left-1/2 z-10 flex -translate-x-1/2 flex-col items-center max-md:top-[191px] md:top-[255px]"
      >
        <div
          className="flex items-center justify-center max-md:h-[85px] max-md:w-20 md:h-[130px] md:w-[122px]"
        >
          <ProfileAvatar firstName={firstName} />
        </div>
      </div>
    </section>
  );
};

export default ProfileHeroSection;
