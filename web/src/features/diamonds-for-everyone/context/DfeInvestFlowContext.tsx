"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { diamondsForEveryonePageContent } from "../data/content";
import {
  clampDfeMonthlyAmount,
  computeDfeInvestmentSummary,
  type DfeInvestmentConfig,
} from "../utils/investmentConfig";

export type DfeInvestStep = "intro" | "kyc" | "nominee" | "review" | "success";

type DfeInvestFlowContextValue = {
  monthlyAmount: number;
  setMonthlyAmount: (value: number) => void;
  cancelButtonLabel?: string;
  step: DfeInvestStep;
  idType: string;
  idNumber: string;
  idFile: File | null;
  nomineeName: string;
  nomineeRelationship: string;
  nomineePhone: string;
  nomineeEmail: string;
  setIdType: (value: string) => void;
  setIdNumber: (value: string) => void;
  setIdFile: (file: File | null) => void;
  setNomineeName: (value: string) => void;
  setNomineeRelationship: (value: string) => void;
  setNomineePhone: (value: string) => void;
  setNomineeEmail: (value: string) => void;
  goToStep: (step: DfeInvestStep) => void;
  completeEnrollment: () => void;
  goNext: () => void;
  goBack: () => void;
  investment: DfeInvestmentConfig;
  contribution: number;
  bonus: number;
  totalValue: number;
};

const DfeInvestFlowContext = createContext<DfeInvestFlowContextValue | undefined>(undefined);

const STEP_ORDER: DfeInvestStep[] = ["intro", "kyc", "nominee", "review", "success"];

export function DfeInvestFlowProvider({
  initialMonthlyAmount,
  investment,
  cancelButtonLabel,
  children,
}: {
  initialMonthlyAmount: number;
  investment: DfeInvestmentConfig;
  cancelButtonLabel?: string;
  children: ReactNode;
}) {
  const clampMonthlyAmount = useCallback(
    (value: number) => clampDfeMonthlyAmount(value, investment),
    [investment],
  );

  const [monthlyAmount, setMonthlyAmountState] = useState(() =>
    clampMonthlyAmount(initialMonthlyAmount),
  );
  const [step, setStep] = useState<DfeInvestStep>("intro");
  const [idType, setIdType] = useState<string>(
    diamondsForEveryonePageContent.investFlow.kyc.idTypeOptions[0],
  );
  const [idNumber, setIdNumber] = useState("");
  const [idFile, setIdFile] = useState<File | null>(null);
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeRelationship, setNomineeRelationship] = useState("");
  const [nomineePhone, setNomineePhone] = useState("");
  const [nomineeEmail, setNomineeEmail] = useState("");

  const setMonthlyAmount = useCallback(
    (value: number) => {
      setMonthlyAmountState(clampMonthlyAmount(value));
    },
    [clampMonthlyAmount],
  );

  const { contribution, bonus, totalValue } = computeDfeInvestmentSummary(monthlyAmount, investment);

  const goToStep = useCallback((nextStep: DfeInvestStep) => {
    setStep(nextStep);
  }, []);

  const completeEnrollment = useCallback(() => {
    setStep("success");
  }, []);

  const goNext = useCallback(() => {
    const index = STEP_ORDER.indexOf(step);
    if (index < STEP_ORDER.length - 1) {
      setStep(STEP_ORDER[index + 1]);
    }
  }, [step]);

  const goBack = useCallback(() => {
    const index = STEP_ORDER.indexOf(step);
    if (index > 0) {
      setStep(STEP_ORDER[index - 1]);
    }
  }, [step]);

  const value = useMemo(
    () => ({
      monthlyAmount,
      setMonthlyAmount,
      cancelButtonLabel,
      step,
      idType,
      idNumber,
      idFile,
      nomineeName,
      nomineeRelationship,
      nomineePhone,
      nomineeEmail,
      setIdType,
      setIdNumber,
      setIdFile,
      setNomineeName,
      setNomineeRelationship,
      setNomineePhone,
      setNomineeEmail,
      goToStep,
      completeEnrollment,
      goNext,
      goBack,
      investment,
      contribution,
      bonus,
      totalValue,
    }),
    [
      monthlyAmount,
      setMonthlyAmount,
      cancelButtonLabel,
      step,
      idType,
      idNumber,
      idFile,
      nomineeName,
      nomineeRelationship,
      nomineePhone,
      nomineeEmail,
      goToStep,
      completeEnrollment,
      goNext,
      goBack,
      investment,
      contribution,
      bonus,
      totalValue,
    ],
  );

  return (
    <DfeInvestFlowContext.Provider value={value}>{children}</DfeInvestFlowContext.Provider>
  );
}

export function useDfeInvestFlow() {
  const context = useContext(DfeInvestFlowContext);
  if (!context) {
    throw new Error("useDfeInvestFlow must be used within DfeInvestFlowProvider");
  }
  return context;
}
