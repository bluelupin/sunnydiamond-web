"use client";

import LoginCreateAccountContent from "./LoginCreateAccountContent";
import LoginModalContent from "./LoginModalContent";
import LoginOtpContent from "./LoginOtpContent";
import type { AuthFlowContentProps } from "../hooks/useAuthFlow";

type AuthFlowStepsProps = AuthFlowContentProps;

const AuthFlowSteps = ({
  step,
  titleClassName,
  signIn,
  otp,
  createAccount,
}: AuthFlowStepsProps) => {
  if (step === "sign-in") {
    return <LoginModalContent {...signIn} titleClassName={titleClassName} />;
  }

  if (step === "otp") {
    return <LoginOtpContent {...otp} titleClassName={titleClassName} />;
  }

  return <LoginCreateAccountContent {...createAccount} titleClassName={titleClassName} />;
};

export default AuthFlowSteps;
