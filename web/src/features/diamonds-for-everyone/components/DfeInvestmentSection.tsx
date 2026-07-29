"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Reveal from "@/shared/Animation/Reveal";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useLoginModal } from "@/features/auth/context/LoginModalContext";
import { diamondsForEveryonePageContent } from "../data/content";
import { formatInr } from "../utils/formatInr";
import { buildDfeInvestUrl } from "../utils/investRoutes";

const DfeInvestmentSection = () => {
  const { investment } = diamondsForEveryonePageContent;
  const { status } = useAuth();
  const { openLoginModal } = useLoginModal();
  const router = useRouter();
  const [monthlyAmount, setMonthlyAmount] = useState<number>(investment.defaultMonthly);

  const contribution = monthlyAmount * investment.monthsPaid;
  const totalValue = monthlyAmount * investment.totalMonths;

  const sliderFillPercent = useMemo(() => {
    const range = investment.maxMonthly - investment.minMonthly;
    if (range <= 0) return 0;
    return ((monthlyAmount - investment.minMonthly) / range) * 100;
  }, [investment.maxMonthly, investment.minMonthly, monthlyAmount]);

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

            <div className="flex flex-col gap-4">
              <p className="font-gill text-base font-normal leading-110 text-[#2B2B2B]">
                {investment.monthlyLabel}
              </p>
              <div className="flex flex-col gap-4">
                <div className="relative h-[6px] w-full bg-[#AEAEAE]">
                  <div
                    className="absolute left-0 top-0 h-[6px] bg-[#666666]"
                    style={{ width: `${sliderFillPercent}%` }}
                  />
                  <input
                    type="range"
                    min={investment.minMonthly}
                    max={investment.maxMonthly}
                    step={investment.step}
                    value={monthlyAmount}
                    onChange={(event) => setMonthlyAmount(Number(event.target.value))}
                    aria-label="Monthly savings amount"
                    className="absolute inset-0 size-full cursor-pointer opacity-0"
                  />
                  <div
                    className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-darkblack"
                    style={{ left: `calc(${sliderFillPercent}% - 8px)` }}
                    aria-hidden
                  />
                </div>
                <div className="flex h-[50px] items-center gap-2 border border-darkblack px-3 py-2">
                  <span className="font-gill text-lg font-light leading-110 text-darkblack">₹</span>
                  <input
                    type="number"
                    min={investment.minMonthly}
                    max={investment.maxMonthly}
                    step={investment.step}
                    value={monthlyAmount}
                    onChange={(event) => {
                      const next = Number(event.target.value);
                      if (Number.isNaN(next)) return;
                      setMonthlyAmount(
                        Math.min(investment.maxMonthly, Math.max(investment.minMonthly, next)),
                      );
                    }}
                    className="min-w-0 flex-1 bg-transparent font-gill text-base font-normal leading-110 text-darkblack outline-none"
                    aria-label="Monthly amount in rupees"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="font-gill text-base font-normal leading-110 text-[#2B2B2B]">
                {investment.summaryTitle}
              </p>
              <div className="bg-gray200 p-4">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3 font-gill text-base leading-110 text-darkblack">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-light">{investment.contributionLabel}</span>
                      <span className="font-normal">{formatInr(contribution)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-light">{investment.freeInstallmentLabel}</span>
                      <span className="font-normal">{investment.freeInstallmentValue}</span>
                    </div>
                  </div>
                  <div className="h-px w-full bg-neutral300" aria-hidden />
                  <div className="flex items-center justify-between gap-4 font-gill text-base leading-110 text-darkblack">
                    <span className="font-normal">{investment.totalLabel}</span>
                    <span className="font-normal">{formatInr(totalValue)}</span>
                  </div>
                </div>
              </div>
            </div>
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
