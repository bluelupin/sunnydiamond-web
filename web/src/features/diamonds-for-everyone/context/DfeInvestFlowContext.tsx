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

export type DfeInvestStep = "kyc" | "nominee" | "review";

type DfeInvestFlowContextValue = {
  monthlyAmount: number;
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

const STEP_ORDER: DfeInvestStep[] = ["kyc", "nominee", "review"];

export function DfeInvestFlowProvider({
  monthlyAmount,
  children,
}: {
  monthlyAmount: number;
  children: ReactNode;
}) {
  const { monthsPaid, totalMonths } = diamondsForEveryonePageContent.investment;
  const [step, setStep] = useState<DfeInvestStep>("kyc");
  const [idType, setIdType] = useState<string>(
    diamondsForEveryonePageContent.investFlow.kyc.idTypeOptions[0],
  );
  const [idNumber, setIdNumber] = useState("");
  const [idFile, setIdFile] = useState<File | null>(null);
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeRelationship, setNomineeRelationship] = useState("");
  const [nomineePhone, setNomineePhone] = useState("");

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
