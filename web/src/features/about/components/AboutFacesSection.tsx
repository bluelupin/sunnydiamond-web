"use client";

import type { CSSProperties } from "react";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import MediaContentOverlay from "@/shared/ui/MediaContentOverlay";
import { cn } from "@/shared/utils/cn";
import type {
  NormalizedAboutTeam,
  NormalizedTeamMember,
} from "@/services/about/about-page.types";
import { aboutFacesFigmaSpec } from "../data/content";
import Reveal from "@/shared/Animation/Reveal";
import { DetailDarkLink } from "@/features/products/components/detail/shared";
import { ALL_DIRECTORS_PATH } from "@/features/about/constants/aboutRoutes";
import { allDirectorsPageContent } from "@/features/about/data/content";

const hideScrollbarStyle: CSSProperties = {
  scrollbarWidth: "none",
  msOverflowStyle: "none",
};

const DESKTOP_FACES_PER_ROW = 3;

const horizontalRowClassName =
  "flex w-full snap-x snap-mandatory gap-2 overflow-x-auto pl-4 md:h-[600px] lg:gap-1 lg:overflow-visible lg:pl-0 [&::-webkit-scrollbar]:hidden";

const memberFigureClassName = cn(
  "group relative shrink-0 snap-start overflow-hidden",
  "lg:h-[600px] h-[600px] w-[343px] md:h-full lg:w-auto lg:min-w-0 lg:basis-0 lg:flex-1",
  "lg:hover:grow-[1.2] transition-[flex-grow] duration-500 ease-in-out",
);

function chunkTeamMembers<T>(items: T[], size: number): T[][] {
  if (size <= 0) {
    return [items];
  }

  const rows: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    rows.push(items.slice(index, index + size));
  }
  return rows;
}

type TeamMemberFigureProps = {
  member: NormalizedTeamMember;
};

const TeamMemberFigure = ({ member }: TeamMemberFigureProps) => (
  <figure className={memberFigureClassName}>
    <div
      className={cn(
        "absolute inset-0",
        member.image && "lg:inset-x-auto lg:left-1/2 lg:w-[719px] lg:-translate-x-1/2",
      )}
    >
      {member.image ? (
        <ResponsiveImage
          desktopSrc={member.image.desktopUrl}
          mobileSrc={member.image.mobileUrl}
          alt={member.image.alt}
          width={member.image.width ?? 478}
          height={member.image.height ?? 600}
          quality={80}
          sizes="(max-width: 1023px) 343px, 33vw"
          className="h-full w-full object-cover object-center object-top"
        />
      ) : (
        <div aria-hidden className="h-full w-full bg-gray200" />
      )}
    </div>

    <MediaContentOverlay
      gradient={aboutFacesFigmaSpec.overlay.gradient}
      className={cn(
        "opacity-100 transition-opacity duration-500",
        member.image && "lg:opacity-0 lg:group-hover:opacity-100",
      )}
    />
    <figcaption
      className={cn(
        "absolute bottom-0 left-0 z-10 w-full text-left px-4 py-8 lg:px-10 md:px-8 lg:py-10 py-8 transition-all duration-500",
        member.image
          ? "opacity-100 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
          : "opacity-100",
      )}
    >
      <div className="flex flex-col items-start gap-2 leading-110">
        <p className="font-larken lg:text-32 text-2xl text-xl font-light text-white">
          {member.name}
        </p>
        {member.role ? (
          <p className="font-gill lg:text-xl md:text-lg text-base font-light text-aboutInactive">
            {member.role}
          </p>
        ) : null}
      </div>
    </figcaption>
  </figure>
);

type AboutFacesSectionProps = NormalizedAboutTeam;

const AboutFacesSection = ({ title, description, members }: AboutFacesSectionProps) => {
  const desktopRows = chunkTeamMembers(members, DESKTOP_FACES_PER_ROW);

  return (
    <section
      aria-labelledby="about-faces-title"
      className="bg-white lg:pb-104 md:pb-20 pb-16"
    >
      <div className="max-w-1920 2xl:px-[60px] lg:px-10 px-4 flex flex-col items-center text-center md:mb-10 mb-6">
        <div className="flex max-w-full flex-col items-center lg:gap-4 gap-3">
          <Reveal as="h2" direction="up"
            id="about-faces-title"
            className="font-larken font-light leading-110 text-darkblack lg:text-5xl md:text-4xl text-32 md:max-w-fit max-w-[332px]"
          >
            {title}
          </Reveal>
          {description ? (
            <Reveal as="p" direction="up" className="font-gill font-light leading-110 text-neutral500 lg:text-xl md:text-lg text-base ">
              {description}
            </Reveal>
          ) : null}
        </div>
      </div>
      <div className="pl-4 md:pl-0">
        <Reveal
          direction="up"
          className={cn(horizontalRowClassName, "lg:hidden")}
          style={hideScrollbarStyle}
        >
          {members.map((member, index) => (
            <TeamMemberFigure key={`${member.name}-${index}`} member={member} />
          ))}
        </Reveal>

        <div className="hidden lg:flex lg:flex-col lg:gap-x-1 lg:gap-y-10">
          {desktopRows.map((row, rowIndex) => (
            <Reveal
              key={`faces-row-${rowIndex}`}
              direction="up"
              className={cn(horizontalRowClassName, "lg:h-[600px]")}
              style={hideScrollbarStyle}
            >
              {row.map((member, index) => (
                <TeamMemberFigure
                  key={`${member.name}-${rowIndex}-${index}`}
                  member={member}
                />
              ))}
            </Reveal>
          ))}
        </div>
        {members.length > 0 ? (
          <div className="flex justify-center md:mt-10 mt-6">
            <DetailDarkLink href={ALL_DIRECTORS_PATH} className="w-fit uppercase">
              {allDirectorsPageContent.readMoreLabel}
            </DetailDarkLink>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default AboutFacesSection;
