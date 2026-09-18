"use client";

import { DfeInvestFlowProvider, useDfeInvestFlow } from "../../context/DfeInvestFlowContext";
import type { NormalizedDfeResponsiveImage } from "@/services/diamonds-for-everyone/diamonds-for-everyone-page.types";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import DfeInvestAuthGate from "./DfeInvestAuthGate";
import DfeInvestKycStep from "./DfeInvestKycStep";
import DfeInvestNomineeStep from "./DfeInvestNomineeStep";
import DfeInvestIntroStep from "./DfeInvestIntroStep";
import DfeInvestReviewStep from "./DfeInvestReviewStep";
import DfeInvestSuccessStep from "./DfeInvestSuccessStep";
import { DfeInvestHeader, DfeInvestStepper } from "./DfeInvestStepper";

function DfeInvestStepContent() {
  const { step } = useDfeInvestFlow();

  if (step === "intro") {
    return <DfeInvestIntroStep />;
  }

  if (step === "success") {
    return <DfeInvestSuccessStep />;
  }

  if (step === "nominee") {
    return <DfeInvestNomineeStep />;
  }

  if (step === "review") {
    return <DfeInvestReviewStep />;
  }

  return <DfeInvestKycStep />;
}

type DfeInvestPageContentProps = {
  monthlyAmount: number;
  investmentPlannerImage: NormalizedDfeResponsiveImage | null;
};

const DfeInvestPageContent = ({
  monthlyAmount,
  investmentPlannerImage,
}: DfeInvestPageContentProps) => {
  return (
    <DfeInvestFlowProvider initialMonthlyAmount={monthlyAmount}>
      <DfeInvestPageLayout investmentPlannerImage={investmentPlannerImage} />
    </DfeInvestFlowProvider>
  );
};

type DfeInvestPageLayoutProps = {
  investmentPlannerImage: NormalizedDfeResponsiveImage | null;
};

function DfeInvestPageLayout({ investmentPlannerImage }: DfeInvestPageLayoutProps) {
  const { step } = useDfeInvestFlow();
  const isStandaloneStep = step === "intro" || step === "success";
  const showStepper = !isStandaloneStep;
  const showInvestHeader = !isStandaloneStep;
  /** Figma: KYC column 601px; nominee/review column 648px (600px card + 24px outer pad). */
  const flowContentMaxWidth =
    step === "kyc" ? "max-w-[601px]" : "max-w-[648px]";

  const desktopImageUrl =
    investmentPlannerImage?.desktopUrl?.trim() ||
    investmentPlannerImage?.mobileUrl?.trim() ||
    "";
  const mobileImageUrl =
    investmentPlannerImage?.mobileUrl?.trim() ||
    investmentPlannerImage?.desktopUrl?.trim() ||
    "";
  const hasInvestmentPlannerImage = Boolean(desktopImageUrl);
  const imageAlt =
    investmentPlannerImage?.desktopAlt?.trim() ||
    investmentPlannerImage?.mobileAlt?.trim() ||
    "";

  return (
    <section
      className={
        step === "review"
          ? "relative flex min-h-[calc(100dvh-4.5rem-env(safe-area-inset-top,0px))] flex-col items-center justify-start bg-gray300 lg:py-[106px] md:py-16 py-10 md:landscape:min-h-[calc(100dvh-104px)] lg:landscape:min-h-[calc(100dvh-104px)]"
          : "relative flex min-h-[calc(100dvh-4.5rem-env(safe-area-inset-top,0px))] flex-col items-center justify-center bg-gray300 lg:py-[106px] md:py-16 py-10 md:landscape:min-h-[calc(100dvh-104px)] lg:landscape:min-h-[calc(100dvh-104px)]"
      }
    >
      <div
        className={`relative mx-auto flex w-full flex-col items-center px-4 ${
          step === "success"
            ? "max-w-[601px]"
            : isStandaloneStep
              ? "max-w-[648px]"
              : flowContentMaxWidth
        }`}
      >
        {isStandaloneStep ? (
          <DfeInvestStepContent />
        ) : (
          <>
            <div className="md:mb-10 mb-6 flex w-full flex-col gap-6">
              {showInvestHeader ? <DfeInvestHeader /> : null}
              {showStepper ? <DfeInvestStepper /> : null}
            </div>
            <div className="flex w-full justify-center bg-gray200 p-3 lg:p-6">
              <DfeInvestStepContent />
            </div>
          </>
        )}
      </div>

      {hasInvestmentPlannerImage && step !== "success" ? (
        <div
          className={
            step === "intro"
              ? "pointer-events-none absolute -right-[191px] bottom-0 hidden h-[468px] w-[575px] overflow-hidden lg:block"
              : "pointer-events-none absolute -right-[173px] bottom-0 hidden h-[425px] w-[522px] overflow-hidden lg:block"
          }
          aria-hidden
        >
          <div className="absolute left-0 top-[-42.07%] h-[184.31%] w-full">
            <ResponsiveImage
              desktopSrc={desktopImageUrl}
              mobileSrc={mobileImageUrl}
              alt={imageAlt}
              desktopAlt={investmentPlannerImage?.desktopAlt}
              mobileAlt={investmentPlannerImage?.mobileAlt}
              fill
              className="object-cover object-left-top"
              sizes={step === "intro" ? "575px" : "522px"}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}

type DfeInvestPageProps = {
  monthlyAmount: number;
  investmentPlannerImage: NormalizedDfeResponsiveImage | null;
};

const DfeInvestPage = ({ monthlyAmount, investmentPlannerImage }: DfeInvestPageProps) => {
  return (
    <DfeInvestAuthGate>
      <DfeInvestPageContent
        monthlyAmount={monthlyAmount}
        investmentPlannerImage={investmentPlannerImage}
      />
    </DfeInvestAuthGate>
  );
};

export default DfeInvestPage;
