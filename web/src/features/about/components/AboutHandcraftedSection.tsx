"use client";

import MediaContentOverlay from "@/shared/ui/MediaContentOverlay";
import PageContainer from "@/shared/ui/layout/PageContainer";
import type { NormalizedAboutCraft } from "@/services/about/about-page.types";
import AboutHandcraftedHeroMedia from "./AboutHandcraftedHeroMedia";
import VerticalScrollLine from "./VerticalScrollLine";
import Image from "next/image";
import {
  aboutHandcraftedAssets,
} from "../data/content";
type AboutHandcraftedSectionProps = NormalizedAboutCraft;

const AboutHandcraftedSection = ({
  title,
  videoUrl,
  posterUrl,
  overlayOpacity,
}: AboutHandcraftedSectionProps) => (
  <>
    <section
      aria-labelledby="about-handcrafted-title"
      className="overflow-x-hidden bg-white"
    >
      <PageContainer className="px-0 md:px-0">
        <div className="relative h-700 w-full overflow-hidden">
          <div className="absolute inset-0">
            <AboutHandcraftedHeroMedia videoUrl={videoUrl} posterUrl={posterUrl} />
          </div>
          <MediaContentOverlay solidOpacity={overlayOpacity} />
          <div className="absolute inset-x-0 bottom-0 top-16 z-10 flex flex-col items-center justify-center gap-4 px-5 md:top-20">
            <h2
              id="about-handcrafted-title"
              className="text-center font-larken text-[32px] font-light leading-[110%] text-white md:text-[40px] lg:text-5xl"
            >
              {title}
            </h2>
            <span className="h-px w-full max-w-[440px] bg-neutral300" aria-hidden />
          </div>
        </div>
      </PageContainer>
      <PageContainer className="mt-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center gap-3">
            <div className="sm:w-[222px] sm:h-[222px] w-[111px] h-[132px]">
              <Image
                src="/images/about/craftsmanship-764d7a.png"
                alt=""
                width={1161}
                height={694}
                aria-hidden
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="sm:w-[222px] sm:h-[222px] w-[111px] h-[132px] bg-chalkCard flex flex-col items-center justify-center gap-3">
              <Image
                src={aboutHandcraftedAssets.flourish}
                alt=""
                width="222"
                height="222"
                aria-hidden
                className="h-[15px] w-4 shrink-0"
              />
              <h3 className="text-center font-larken lg:text-2xl sm:text-xl sm:text-lg text-base font-light leading-[110%] text-darkblack">
                Ethically Sourced, conflict free diamonds
              </h3>
            </div>
            <div className="sm:w-[222px] sm:h-[222px] w-[111px] h-[132px]">
              <Image
                src="/images/about/craftsmanship-764d7a.png"
                alt=""
                width={1161}
                height={694}
                aria-hidden
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="sm:w-[222px] sm:h-[222px] w-[111px] h-[132px] sm:block hidden">
              <Image
                src="/images/about/craftsmanship-764d7a.png"
                alt=""
                width={1161}
                height={694}
                aria-hidden
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="sm:w-[222px] sm:h-[222px] w-[111px] h-[132px] sm:block hidden">
              <Image
                src="/images/about/craftsmanship-764d7a.png"
                alt=""
                width={1161}
                height={694}
                aria-hidden
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="sm:w-[222px] sm:h-[222px] w-[173px] h-[132px]">
              <Image
                src="/images/about/craftsmanship-764d7a.png"
                alt=""
                width={1161}
                height={694}
                aria-hidden
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="sm:w-[222px] sm:h-[222px] w-[111px] h-[132px] bg-chalkCard sm:flex hidden flex-col items-center justify-center gap-3">
              <Image
                src={aboutHandcraftedAssets.flourish}
                alt=""
                width="222"
                height="222"
                aria-hidden
                className="h-[15px] w-4 shrink-0"
              />
              <h3 className="max-w-[79.73%] text-center font-larken text-2xl font-light leading-[110%] text-darkblack">
                Ethically Sourced, conflict free diamonds
              </h3>
            </div>
            <div className="sm:w-[222px] sm:h-[222px] w-[173px] h-[132px]">
              <Image
                src="/images/about/craftsmanship-764d7a.png"
                alt=""
                width={1161}
                height={694}
                aria-hidden
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="sm:w-[222px] sm:h-[222px] w-[111px] h-[132px] bg-chalkCard flex flex-col items-center justify-center gap-3">
              <Image
                src={aboutHandcraftedAssets.flourish}
                alt=""
                width="222"
                height="222"
                aria-hidden
                className="h-[15px] w-4 shrink-0"
              />
              <h3 className="text-center font-larken lg:text-2xl sm:text-xl sm:text-lg text-base font-light leading-[110%] text-darkblack">
                Ethically Sourced, conflict free diamonds
              </h3>
            </div>
            <div className="sm:w-[222px] sm:h-[222px] w-[111px] h-[132px]">
              <Image
                src="/images/about/craftsmanship-764d7a.png"
                alt=""
                width={1161}
                height={694}
                aria-hidden
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="sm:w-[222px] sm:h-[222px] w-[111px] h-[132px] bg-chalkCard flex flex-col items-center justify-center gap-3">
              <Image
                src={aboutHandcraftedAssets.flourish}
                alt=""
                width="222"
                height="222"
                aria-hidden
                className="h-[15px] w-4 shrink-0"
              />
              <h3 className="text-center font-larken lg:text-2xl sm:text-xl sm:text-lg text-base font-light leading-[110%] text-darkblack">
                Ethically Sourced, conflict free diamonds
              </h3>
            </div>
          </div>
        </div>
      </PageContainer>

    </section>
    <VerticalScrollLine className="pb-16 pt-5 md:pb-20 lg:pb-[100px]" />
  </>
);

export default AboutHandcraftedSection;
