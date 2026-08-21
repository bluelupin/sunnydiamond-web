"use client";

import Image from "next/image";
import { PLP_HERO_IMAGE_QUALITY } from "@/features/jewellery-product/utils/jewelleryPlpImage";
import type { NormalizedProfileBackgroundImage } from "@/services/profile/profile-page.types";
import { ProfileAvatar } from "./ProfileAvatar";

/** Layout-only hero styling — not CMS content. */
const PROFILE_HERO_LAYOUT = {
  imageCrop: {
    mobile: "80% 70%",
    desktop: "50% 30%",
  },
  overlayOpacity: {
    mobile: 0.6,
    desktop: 0.4,
  },
} as const;

type ProfileHeroSectionProps = {
  firstName: string;
  backgroundImage: NormalizedProfileBackgroundImage | null;
};

const ProfileHeroSection = ({ firstName, backgroundImage }: ProfileHeroSectionProps) => {
  const { imageCrop, overlayOpacity } = PROFILE_HERO_LAYOUT;
  const desktopUrl = backgroundImage?.desktopUrl?.trim() ?? "";
  const mobileUrl = backgroundImage?.mobileUrl?.trim() ?? desktopUrl;
  const alt = backgroundImage?.alt ?? "Sunny Diamonds profile banner";

  return (
    <section
      className="relative left-1/2 h-240 w-screen max-w-none -translate-x-1/2 overflow-visible md:h-320"
    >
      <div className="absolute inset-0 overflow-hidden">
        {mobileUrl ? (
          <Image
            src={mobileUrl}
            alt={alt}
            fill
            priority
            quality={PLP_HERO_IMAGE_QUALITY}
            sizes="100vw"
            className="object-cover md:hidden"
            style={{ objectPosition: imageCrop.mobile }}
          />
        ) : null}
        {desktopUrl ? (
          <Image
            src={desktopUrl}
            alt={alt}
            fill
            priority
            quality={PLP_HERO_IMAGE_QUALITY}
            sizes="100vw"
            className="hidden object-cover md:block"
            style={{ objectPosition: imageCrop.desktop }}
          />
        ) : null}
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
