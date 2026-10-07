"use client";

import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { cn } from "@/shared/utils/cn";
import type { NormalizedTeamMember } from "@/services/about/about-page.types";
import {
  formatDirectorBioHtml,
  isDirectorBioHtml,
} from "@/features/about/utils/formatDirectorBio";
import "@/shared/styles/editor-content.css";

type AllDirectorsMemberRowProps = {
  member: NormalizedTeamMember;
  imageOnRight: boolean;
};

const bioTypographyClassName =
  "text-left font-gill text-base font-light leading-110 text-neutral500 md:text-lg lg:text-xl";

const AllDirectorsMemberRow = ({ member, imageOnRight }: AllDirectorsMemberRowProps) => {
  const bioHtml = member.bio ? formatDirectorBioHtml(member.bio) : "";
  const bioIsRichHtml = member.bio ? isDirectorBioHtml(member.bio) : false;

  const imageBlock = (
    <div className="relative h-[450px] w-full shrink-0 overflow-hidden bg-gray200 lg:h-[600px] lg:max-w-[478px]">
      {member.image ? (
        <ResponsiveImage
          desktopSrc={member.image.desktopUrl}
          mobileSrc={member.image.mobileUrl}
          alt={member.image.alt || member.name}
          width={member.image.width ?? 478}
          height={member.image.height ?? 600}
          quality={80}
          sizes="(max-width: 1023px) 100vw, 478px"
          className="h-full w-full object-cover object-center object-top"
        />
      ) : null}
    </div>
  );

  const copyBlock = (
    <div className="flex min-w-0 flex-1 flex-col gap-6 lg:gap-10">
      <div className="flex flex-col items-start gap-2 text-left leading-110">
        <h2 className="font-larken text-2xl font-light text-darkblack md:text-3xl lg:text-32">
          {member.name}
        </h2>
        {member.role ? (
          <p className="font-gill text-base font-normal text-neutral500 md:text-lg lg:text-xl">
            {member.role}
          </p>
        ) : null}
      </div>
      {bioHtml ? (
        <div
          className={cn(
            bioTypographyClassName,
            bioIsRichHtml && "editor-content [&_p]:font-gill [&_p]:text-inherit [&_p+p]:mt-4",
          )}
          dangerouslySetInnerHTML={{ __html: bioHtml }}
        />
      ) : null}
    </div>
  );

  return (
    <article
      className={cn(
        "flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:gap-10",
        imageOnRight && "lg:flex-row-reverse",
      )}
    >
      {imageBlock}
      {copyBlock}
    </article>
  );
};

export default AllDirectorsMemberRow;
