"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Reveal from "@/shared/Animation/Reveal";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useLoginModal } from "@/features/auth/context/LoginModalContext";
import type { NormalizedDfeInvestmentPlanner } from "@/services/diamonds-for-everyone/diamonds-for-everyone-page.types";
import { buildDfeInvestUrl } from "../utils/investRoutes";
import DfeInvestmentCalculator from "./DfeInvestmentCalculator";

type DfeInvestmentSectionProps = {
  investmentPlanner: NormalizedDfeInvestmentPlanner;
};

const DfeInvestmentSection = ({ investmentPlanner }: DfeInvestmentSectionProps) => {
  const { investment } = investmentPlanner;
  const { status } = useAuth();
  const { openLoginModal } = useLoginModal();
  const router = useRouter();
  const [monthlyAmount, setMonthlyAmount] = useState<number>(investment.defaultMonthly);

  const handleStartInvesting = () => {
    const investUrl = buildDfeInvestUrl(monthlyAmount, investment);
    if (status === "authenticated") {
      router.push(investUrl);
      return;
    }
    openLoginModal({ returnUrl: investUrl });
  };

  const image = investmentPlanner.image;
  const desktopImageUrl =
    image?.desktopUrl?.trim() || image?.mobileUrl?.trim() || "";
  const mobileImageUrl =
    image?.mobileUrl?.trim() || image?.desktopUrl?.trim() || "";
  const hasImage = Boolean(desktopImageUrl);
  const imageAlt =
    image?.desktopAlt?.trim() ||
    image?.mobileAlt?.trim() ||
    "";
  const buttonLabel = investmentPlanner.buttonLabel?.trim();
  const monthlyDescription = investmentPlanner.description?.trim();
  const monthlySummary = investmentPlanner.monthlySummary?.trim();

  return (
    <section
      aria-labelledby="dfe-investment-title"
      className="mx-auto w-full max-w-[1440px] px-6 pb-16 lg:px-100 lg:pb-104"
    >
      <div className="flex flex-col items-stretch justify-between gap-6 md:flex-row md:items-center md:gap-10">
        {hasImage ? (
          <Reveal
            direction="up"
            className="relative shrink-0 overflow-hidden md:block hidden xl:w-[541px] lg:w-[400px] xl:h-[422px] lg:h-[300px] w-[350px] h-[350px] max-w-[541px]"
          >
            <div className="relative size-full">
              <ResponsiveImage
                desktopSrc={desktopImageUrl}
                mobileSrc={mobileImageUrl}
                alt={imageAlt}
                desktopAlt={image?.desktopAlt}
                mobileAlt={image?.mobileAlt}
                fill
                className="absolute top-[0.11%] left-[-7.36%] h-[123.4%] max-w-none w-[116.1%] object-cover"
                sizes="541px"
              />
            </div>
          </Reveal>
        ) : null}

        <div className="flex w-full xl:max-w-[530px] md:max-w-[450px] max-w-full flex-col gap-6 lg:gap-10">
          <div className="flex flex-col gap-6">
            <Reveal
              as="h2"
              id="dfe-investment-title"
              direction="up"
              className="font-larken text-32 font-light leading-110 text-darkblack lg:text-5xl"
            >
              {investmentPlanner.title}
            </Reveal>
            <Reveal direction="up">
              <DfeInvestmentCalculator
                investment={investment}
                monthlyAmount={monthlyAmount}
                onMonthlyAmountChange={setMonthlyAmount}
                monthlyDescription={monthlyDescription}
                monthlySummary={monthlySummary}
              />
            </Reveal>
          </div>

          {buttonLabel ? (
            <button
              type="button"
              onClick={handleStartInvesting}
              className="btn-dark-slide inline-flex h-14 w-full items-center justify-center border border-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
            >
              <span className="relative z-10">{buttonLabel}</span>
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default DfeInvestmentSection;
