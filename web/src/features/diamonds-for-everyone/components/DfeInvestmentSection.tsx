"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Reveal from "@/shared/Animation/Reveal";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useLoginModal } from "@/features/auth/context/LoginModalContext";
import type { NormalizedDfeInvestmentPlanner } from "@/services/diamonds-for-everyone/diamonds-for-everyone-page.types";
import { diamondsForEveryonePageContent } from "../data/content";
import { buildDfeInvestUrl } from "../utils/investRoutes";
import DfeInvestmentCalculator from "./DfeInvestmentCalculator";

type DfeInvestmentSectionProps = {
  investmentPlanner: NormalizedDfeInvestmentPlanner;
};

const DfeInvestmentSection = ({ investmentPlanner }: DfeInvestmentSectionProps) => {
  const { investment } = diamondsForEveryonePageContent;
  const { status } = useAuth();
  const { openLoginModal } = useLoginModal();
  const router = useRouter();
  const [monthlyAmount, setMonthlyAmount] = useState<number>(investment.defaultMonthly);

  const handleStartInvesting = () => {
    const investUrl = buildDfeInvestUrl(monthlyAmount);
    if (status === "authenticated") {
      router.push(investUrl);
      return;
    }
    openLoginModal({ returnUrl: investUrl });
  };

  const imageSrc = investmentPlanner.image?.desktopUrl;
  const ctaLabel = investmentPlanner.ctaLabel ?? investment.ctaLabel;

  return (
    <section
      aria-labelledby="dfe-investment-title"
      className="mx-auto 2xl:max-w-1920 max-w-[1440px] px-4 py-16 lg:px-100 md:px-16 sm:px-10 px-6 md:py-100"
    >
      <div className="flex flex-col items-center justify-between gap-10 lg:flex-row lg:gap-16">
        {imageSrc ? (
          <Reveal direction="up" className="relative h-[280px] w-full xl:max-w-[541px] max-w-[400px] shrink-0 md:h-[422px]">
            <Image
              src={imageSrc}
              alt={investmentPlanner.image?.alt ?? ""}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 541px"
            />
          </Reveal>
        ) : null}

        <div className="flex w-full max-w-[530px] flex-col md:gap-10 gap-6">
          <div className="flex flex-col lg:gap-10 md:gap-8 gap-6">
            <div className="flex flex-col gap-3">
              <Reveal
                as="h2"
                id="dfe-investment-title"
                direction="up"
                className="font-larken text-32 font-light leading-110 text-darkblack md:text-left xl:text-5xl md:text-4xl sm:text-3xl"
              >
                {investmentPlanner.title}
              </Reveal>
              <Reveal
                as="p"
                id="dfe-investment-description"
                direction="up"
                className="font-gill font-light leading-110 text-darkblack text-base text-neutral500 md:hidden flex"
              >
                Find the perfect expression of motion for your loved ones.
              </Reveal>
            </div>
            <Reveal direction="up">
              <DfeInvestmentCalculator
                monthlyAmount={monthlyAmount}
                onMonthlyAmountChange={setMonthlyAmount}
              />
            </Reveal>
          </div>

          <button
            type="button"
            onClick={handleStartInvesting}
            className="btn-dark-slide inline-flex h-14 w-full items-center justify-center border border-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
          >
            <span className="relative z-10">{ctaLabel}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default DfeInvestmentSection;
