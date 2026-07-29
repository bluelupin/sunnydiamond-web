"use client";

import Image from "next/image";
import { DfeInvestFlowProvider, useDfeInvestFlow } from "../../context/DfeInvestFlowContext";
import DfeInvestAuthGate from "./DfeInvestAuthGate";
import DfeInvestKycStep from "./DfeInvestKycStep";
import DfeInvestNomineeStep from "./DfeInvestNomineeStep";
import DfeInvestReviewStep from "./DfeInvestReviewStep";
import { DfeInvestHeader, DfeInvestStepper } from "./DfeInvestStepper";

function DfeInvestStepContent() {
  const { step } = useDfeInvestFlow();

  if (step === "nominee") {
    return <DfeInvestNomineeStep />;
  }

  if (step === "review") {
    return <DfeInvestReviewStep />;
  }

  return <DfeInvestKycStep />;
}

const DfeInvestPageContent = ({ monthlyAmount }: { monthlyAmount: number }) => {
  return (
    <DfeInvestFlowProvider monthlyAmount={monthlyAmount}>
      <section
        className="relative flex min-h-[calc(100dvh-4.5rem-env(safe-area-inset-top,0px))] flex-col items-center justify-center bg-gray300 py-8 md:landscape:min-h-[calc(100dvh-104px)] lg:landscape:min-h-[calc(100dvh-104px)]"
      >
        <div className="relative mx-auto flex w-full max-w-[601px] flex-col items-center gap-10 px-4">
          <DfeInvestHeader />
          <DfeInvestStepper />
          <div className="w-full bg-gray200 p-6">
            <DfeInvestStepContent />
          </div>
        </div>

        <div
          className="pointer-events-none absolute bottom-0 right-0 hidden h-[425px] w-[522px] overflow-hidden lg:block"
          aria-hidden
        >
          <Image
            src="/images/diamonds-for-everyone/invest-decorative.png"
            alt=""
            fill
            className="object-cover object-center"
            sizes="522px"
          />
        </div>
      </section>
    </DfeInvestFlowProvider>
  );
};

const DfeInvestPage = ({ monthlyAmount }: { monthlyAmount: number }) => {
  return (
    <DfeInvestAuthGate>
      <DfeInvestPageContent monthlyAmount={monthlyAmount} />
    </DfeInvestAuthGate>
  );
};

export default DfeInvestPage;
