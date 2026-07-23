"use client";

import LoginCreateAccountContent from "./LoginCreateAccountContent";
import LoginModalContent from "./LoginModalContent";
import LoginOtpContent from "./LoginOtpContent";
import LoginPasswordContent from "./LoginPasswordContent";
import type { AuthFlowContentProps } from "../hooks/useAuthFlow";

type AuthFlowStepsProps = AuthFlowContentProps;

const AuthFlowSteps = ({
  step,
  titleClassName,
  signIn,
  otp,
  createAccount,
  password,
}: AuthFlowStepsProps) => {
  if (step === "sign-in") {
    return <LoginModalContent {...signIn} titleClassName={titleClassName} />;
  }

  if (step === "otp") {
    return <LoginOtpContent {...otp} titleClassName={titleClassName} />;
  }

  if (step === "password") {
    return <LoginPasswordContent {...password} titleClassName={titleClassName} />;
  }

  return <LoginCreateAccountContent {...createAccount} titleClassName={titleClassName} />;
};

export default AuthFlowSteps;
