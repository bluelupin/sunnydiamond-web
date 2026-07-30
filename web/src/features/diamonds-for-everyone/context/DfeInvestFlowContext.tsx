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

export type DfeInvestStep = "intro" | "kyc" | "nominee" | "review";

type DfeInvestFlowContextValue = {
  monthlyAmount: number;
  setMonthlyAmount: (value: number) => void;
  step: DfeInvestStep;
  idType: string;
  idNumber: string;
  idFile: File | null;
  nomineeName: string;
  nomineeRelationship: string;
  nomineePhone: string;
  setIdType: (value: string) => void;
  setIdNumber: (value: string) => void;
  setIdFile: (file: File | null) => void;
  setNomineeName: (value: string) => void;
  setNomineeRelationship: (value: string) => void;
  setNomineePhone: (value: string) => void;
  goToStep: (step: DfeInvestStep) => void;
  goNext: () => void;
  goBack: () => void;
  contribution: number;
  totalValue: number;
};

const DfeInvestFlowContext = createContext<DfeInvestFlowContextValue | undefined>(undefined);

const STEP_ORDER: DfeInvestStep[] = ["intro", "kyc", "nominee", "review"];

export function DfeInvestFlowProvider({
  initialMonthlyAmount,
  children,
}: {
  initialMonthlyAmount: number;
  children: ReactNode;
}) {
  const { investment, monthsPaid, totalMonths } = {
    investment: diamondsForEveryonePageContent.investment,
    monthsPaid: diamondsForEveryonePageContent.investment.monthsPaid,
    totalMonths: diamondsForEveryonePageContent.investment.totalMonths,
  };

  const clampMonthlyAmount = useCallback((value: number) => {
    return Math.min(investment.maxMonthly, Math.max(investment.minMonthly, value));
  }, [investment.maxMonthly, investment.minMonthly]);

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

  const setMonthlyAmount = useCallback(
    (value: number) => {
      setMonthlyAmountState(clampMonthlyAmount(value));
    },
    [clampMonthlyAmount],
  );

  const contribution = monthlyAmount * monthsPaid;
  const totalValue = monthlyAmount * totalMonths;

  const goToStep = useCallback((nextStep: DfeInvestStep) => {
    setStep(nextStep);
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
      step,
      idType,
      idNumber,
      idFile,
      nomineeName,
      nomineeRelationship,
      nomineePhone,
      setIdType,
      setIdNumber,
      setIdFile,
      setNomineeName,
      setNomineeRelationship,
      setNomineePhone,
      goToStep,
      goNext,
      goBack,
      contribution,
      totalValue,
    }),
    [
      monthlyAmount,
      setMonthlyAmount,
      step,
      idType,
      idNumber,
      idFile,
      nomineeName,
      nomineeRelationship,
      nomineePhone,
      goToStep,
      goNext,
      goBack,
      contribution,
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
