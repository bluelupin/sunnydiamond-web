"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { giftCardFlowContent } from "../data/content";

export type GiftCardType = "physical" | "digital";
export type GiftCardFlowStep = "configure" | "details";

export type GiftCardPartyDetails = {
  fullName: string;
  phone: string;
  email: string;
};

type GiftCardFlowContextValue = {
  step: GiftCardFlowStep;
  cardType: GiftCardType;
  amount: number;
  occasion: string;
  message: string;
  sender: GiftCardPartyDetails;
  receiverSameAsSender: boolean;
  receiver: GiftCardPartyDetails;
  setCardType: (type: GiftCardType) => void;
  setAmount: (amount: number) => void;
  setOccasion: (occasion: string) => void;
  setMessage: (message: string) => void;
  setSender: (details: Partial<GiftCardPartyDetails>) => void;
  setReceiverSameAsSender: (value: boolean) => void;
  setReceiver: (details: Partial<GiftCardPartyDetails>) => void;
  goToDetails: () => void;
  goBack: () => void;
  resetFlow: () => void;
};

const emptyParty: GiftCardPartyDetails = {
  fullName: "",
  phone: "",
  email: "",
};

const GiftCardFlowContext = createContext<GiftCardFlowContextValue | undefined>(undefined);

export function GiftCardFlowProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<GiftCardFlowStep>("configure");
  const [cardType, setCardType] = useState<GiftCardType>("physical");
  const [amount, setAmount] = useState(giftCardFlowContent.amount.default);
  const [occasion, setOccasion] = useState("");
  const [message, setMessage] = useState("");
  const [sender, setSenderState] = useState<GiftCardPartyDetails>(emptyParty);
  const [receiverSameAsSender, setReceiverSameAsSender] = useState(true);
  const [receiver, setReceiverState] = useState<GiftCardPartyDetails>(emptyParty);

  const setSender = useCallback((details: Partial<GiftCardPartyDetails>) => {
    setSenderState((current) => ({ ...current, ...details }));
  }, []);

  const setReceiver = useCallback((details: Partial<GiftCardPartyDetails>) => {
    setReceiverState((current) => ({ ...current, ...details }));
  }, []);

  const resetFlow = useCallback(() => {
    setStep("configure");
    setCardType("physical");
    setAmount(giftCardFlowContent.amount.default);
    setOccasion("");
    setMessage("");
    setSenderState(emptyParty);
    setReceiverSameAsSender(true);
    setReceiverState(emptyParty);
  }, []);

  const goToDetails = useCallback(() => setStep("details"), []);
  const goBack = useCallback(() => setStep("configure"), []);

  const value = useMemo(
    () => ({
      step,
      cardType,
      amount,
      occasion,
      message,
      sender,
      receiverSameAsSender,
      receiver,
      setCardType,
      setAmount,
      setOccasion,
      setMessage,
      setSender,
      setReceiverSameAsSender,
      setReceiver,
      goToDetails,
      goBack,
      resetFlow,
    }),
    [
      amount,
      cardType,
      goBack,
      goToDetails,
      message,
      occasion,
      receiver,
      receiverSameAsSender,
      resetFlow,
      sender,
      step,
    ],
  );

  return <GiftCardFlowContext.Provider value={value}>{children}</GiftCardFlowContext.Provider>;
}

export function useGiftCardFlow() {
  const context = useContext(GiftCardFlowContext);
  if (!context) {
    throw new Error("useGiftCardFlow must be used within GiftCardFlowProvider");
  }
  return context;
}
