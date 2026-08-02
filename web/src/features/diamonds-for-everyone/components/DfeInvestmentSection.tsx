"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Reveal from "@/shared/Animation/Reveal";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useLoginModal } from "@/features/auth/context/LoginModalContext";
import { diamondsForEveryonePageContent } from "../data/content";
import { buildDfeInvestUrl } from "../utils/investRoutes";
import DfeInvestmentCalculator from "./DfeInvestmentCalculator";

const DfeInvestmentSection = () => {
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

  return (
    <section
      aria-labelledby="dfe-investment-title"
      className="mx-auto max-w-[1440px] px-4 py-16 md:px-[100px] md:py-[104px]"
    >
      <div className="flex flex-col items-center justify-between gap-10 lg:flex-row lg:gap-16">
        <Reveal direction="up" className="relative h-[280px] w-full max-w-[541px] shrink-0 md:h-[422px]">
          <Image
            src="/images/diamonds-for-everyone/plan-investment.png"
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 541px"
          />
        </Reveal>

        <div className="flex w-full max-w-[530px] flex-col gap-10">
          <div className="flex flex-col gap-10">
            <Reveal
              as="h2"
              id="dfe-investment-title"
              direction="up"
              className="text-center font-larken text-32 font-light leading-110 text-darkblack md:text-left md:text-5xl"
            >
              {investment.title}
            </Reveal>

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
            className="inline-flex h-14 w-full items-center justify-center bg-darkblack px-7 font-gill text-sm font-normal uppercase leading-110 text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkblack focus-visible:ring-offset-2"
          >
            {investment.ctaLabel}
          </button>
        </div>
      </div>
    </section>
  );
};

export default DfeInvestmentSection;
