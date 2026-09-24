"use client";

import { DfeInvestFlowProvider, useDfeInvestFlow } from "../../context/DfeInvestFlowContext";
import type {
  NormalizedDfeAccountSetup,
  NormalizedDfeResponsiveImage,
  NormalizedDfeStepperStep,
  NormalizedDfeSuccessScreen,
} from "@/services/diamonds-for-everyone/diamonds-for-everyone-page.types";
import ResponsiveImage from "@/shared/ui/ResponsiveImage";
import DfeInvestAuthGate from "./DfeInvestAuthGate";
import DfeInvestKycStep from "./DfeInvestKycStep";
import DfeInvestNomineeStep from "./DfeInvestNomineeStep";
import DfeInvestIntroStep from "./DfeInvestIntroStep";
import DfeInvestReviewStep from "./DfeInvestReviewStep";
import DfeInvestSuccessStep from "./DfeInvestSuccessStep";
import { DfeInvestHeader, DfeInvestStepper } from "./DfeInvestStepper";

type DfeInvestStepContentProps = {
  accountSetup: NormalizedDfeAccountSetup | null;
  investmentPlannerImage: NormalizedDfeResponsiveImage | null;
  successScreen: NormalizedDfeSuccessScreen | null;
};

function DfeInvestStepContent({
  accountSetup,
  investmentPlannerImage,
  successScreen,
}: DfeInvestStepContentProps) {
  const { step } = useDfeInvestFlow();

  if (step === "intro") {
    return accountSetup ? <DfeInvestIntroStep accountSetup={accountSetup} /> : null;
  }

  if (step === "success") {
    return successScreen ? (
      <DfeInvestSuccessStep
        successScreen={successScreen}
        investmentPlannerImage={investmentPlannerImage}
      />
    ) : null;
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
  accountSetup: NormalizedDfeAccountSetup | null;
  stepperSteps: NormalizedDfeStepperStep[];
  successScreen: NormalizedDfeSuccessScreen | null;
};

const DfeInvestPageContent = ({
  monthlyAmount,
  investmentPlannerImage,
  accountSetup,
  stepperSteps,
  successScreen,
}: DfeInvestPageContentProps) => {
  return (
    <DfeInvestFlowProvider
      initialMonthlyAmount={monthlyAmount}
      cancelButtonLabel={accountSetup?.cancelButtonLabel}
    >
      <DfeInvestPageLayout
        investmentPlannerImage={investmentPlannerImage}
        accountSetup={accountSetup}
        stepperSteps={stepperSteps}
        successScreen={successScreen}
      />
    </DfeInvestFlowProvider>
  );
};

type DfeInvestPageLayoutProps = {
  investmentPlannerImage: NormalizedDfeResponsiveImage | null;
  accountSetup: NormalizedDfeAccountSetup | null;
  stepperSteps: NormalizedDfeStepperStep[];
  successScreen: NormalizedDfeSuccessScreen | null;
};

function DfeInvestPageLayout({
  investmentPlannerImage,
  accountSetup,
  stepperSteps,
  successScreen,
}: DfeInvestPageLayoutProps) {
  const { step } = useDfeInvestFlow();
  const isStandaloneStep = step === "intro" || step === "success";
  const showStepper = !isStandaloneStep;
  const showInvestHeader = !isStandaloneStep;
  /** Figma: KYC column 601px; nominee/review column 648px (600px card + 24px outer pad). */
  const flowContentMaxWidth =
    step === "kyc" ? "max-w-[601px]" : "max-w-[648px]";

  const decorativeImage = successScreen?.image ?? investmentPlannerImage;
  const desktopImageUrl =
    decorativeImage?.desktopUrl?.trim() ||
    decorativeImage?.mobileUrl?.trim() ||
    "";
  const mobileImageUrl =
    decorativeImage?.mobileUrl?.trim() ||
    decorativeImage?.desktopUrl?.trim() ||
    "";
  const hasDecorativeImage = Boolean(desktopImageUrl);
  const imageAlt =
    decorativeImage?.desktopAlt?.trim() ||
    decorativeImage?.mobileAlt?.trim() ||
    "";

  return (
    <section
      className={
        step === "review"
          ? "overflow-hidden relative flex min-h-[calc(100dvh-4.5rem-env(safe-area-inset-top,0px))] flex-col items-center justify-start bg-gray300 lg:py-[106px] md:py-16 py-10 md:landscape:min-h-[calc(100dvh-104px)] lg:landscape:min-h-[calc(100dvh-104px)]"
          : "overflow-hidden relative flex min-h-[calc(100dvh-4.5rem-env(safe-area-inset-top,0px))] flex-col items-center justify-center bg-gray300 lg:py-[106px] md:py-16 py-10 md:landscape:min-h-[calc(100dvh-104px)] lg:landscape:min-h-[calc(100dvh-104px)]"
      }
    >
      <div
        className={`relative mx-auto flex w-full flex-col items-center px-4 ${step === "success"
            ? "max-w-[601px]"
            : isStandaloneStep
              ? "max-w-[648px]"
              : flowContentMaxWidth
          }`}
      >
        {isStandaloneStep ? (
          <DfeInvestStepContent
            accountSetup={accountSetup}
            investmentPlannerImage={investmentPlannerImage}
            successScreen={successScreen}
          />
        ) : (
          <>
            <div className="md:mb-10 mb-6 flex w-full flex-col gap-6">
              {showInvestHeader ? (
                <DfeInvestHeader heading={accountSetup?.heading} />
              ) : null}
              {showStepper ? <DfeInvestStepper steps={stepperSteps} /> : null}
            </div>
            <div className="flex w-full justify-center bg-gray200 p-3 lg:p-6">
              <DfeInvestStepContent
                accountSetup={accountSetup}
                investmentPlannerImage={investmentPlannerImage}
                successScreen={successScreen}
              />
            </div>
          </>
        )}
      </div>

      {hasDecorativeImage && step !== "success" ? (
        <div
          className={
            step === "intro"
              ? "pointer-events-none absolute -right-[191px] -bottom-[104px] hidden h-[468px] w-[575px] overflow-hidden lg:block"
              : "pointer-events-none absolute -right-[173px] -bottom-[104px] hidden h-[425px] w-[522px] overflow-hidden lg:block"
          }
          aria-hidden
        >
          <div className="absolute left-0 top-[-42.07%] h-[184.31%] w-full">
            <ResponsiveImage
              desktopSrc={desktopImageUrl}
              mobileSrc={mobileImageUrl}
              alt={imageAlt}
              desktopAlt={decorativeImage?.desktopAlt}
              mobileAlt={decorativeImage?.mobileAlt}
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
  accountSetup: NormalizedDfeAccountSetup | null;
  stepperSteps: NormalizedDfeStepperStep[];
  successScreen: NormalizedDfeSuccessScreen | null;
};

const DfeInvestPage = ({
  monthlyAmount,
  investmentPlannerImage,
  accountSetup,
  stepperSteps,
  successScreen,
}: DfeInvestPageProps) => {
  return (
    <DfeInvestAuthGate>
      <DfeInvestPageContent
        monthlyAmount={monthlyAmount}
        investmentPlannerImage={investmentPlannerImage}
        accountSetup={accountSetup}
        stepperSteps={stepperSteps}
        successScreen={successScreen}
      />
    </DfeInvestAuthGate>
  );
};

export default DfeInvestPage;
