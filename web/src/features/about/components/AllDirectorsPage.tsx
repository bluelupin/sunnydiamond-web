"use client";

import PageContainer from "@/shared/ui/layout/PageContainer";
import Reveal from "@/shared/Animation/Reveal";
import type { NormalizedAboutTeam } from "@/services/about/about-page.types";
import { allDirectorsPageContent } from "@/features/about/data/content";
import AllDirectorsMemberRow from "@/features/about/components/AllDirectorsMemberRow";

type AllDirectorsPageProps = {
  team: NormalizedAboutTeam | null;
};

const AllDirectorsPage = ({ team }: AllDirectorsPageProps) => {
  const members = team?.members ?? [];
  const pageTitle = allDirectorsPageContent.title;

  return (
    <PageContainer className="flex flex-col items-center gap-8 md:gap-10 md:py-16 lg:gap-16 lg:py-16 md:py-10 py-8">
      <Reveal as="h1" direction="up" className="text-center font-larken text-32 font-light leading-110 text-darkblack md:text-4xl lg:text-5xl">
        {pageTitle}
      </Reveal>

      {members.length === 0 ? (
        <p className="font-gill text-base font-light leading-110 text-neutral500 md:text-lg">
          Director profiles are not available right now. Please check back soon.
        </p>
      ) : (
        <div className="flex w-full max-w-[1200px] flex-col gap-12 md:gap-16 lg:gap-16">
          {members.map((member, index) => (
            <Reveal key={`${member.name}-${index}`} direction="up">
              <AllDirectorsMemberRow member={member} imageOnRight={index % 2 === 1} />
            </Reveal>
          ))}
        </div>
      )}
    </PageContainer>
  );
};

export default AllDirectorsPage;
