"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getExpectedDeliveryDate } from "@/features/checkout/types/checkout.types";
import { giftCardFlowContent } from "../data/content";

export type GiftCardType = "physical" | "digital";
export type GiftCardFlowStep = "configure" | "details" | "address" | "success";

export type GiftCardPartyDetails = {
  fullName: string;
  phone: string;
  email: string;
};

export type GiftCardDeliveryAddress = {
  addressLine1: string;
  addressLine2: string;
  pincode: string;
  city: string;
  state: string;
};

const emptyParty: GiftCardPartyDetails = {
  fullName: "",
  phone: "",
  email: "",
};

const emptyAddress: GiftCardDeliveryAddress = {
  addressLine1: "",
  addressLine2: "",
  pincode: "",
  city: "",
  state: "",
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
  deliveryAddress: GiftCardDeliveryAddress;
  orderNumber: string | null;
  estimatedDeliveryDate: string;
  setCardType: (type: GiftCardType) => void;
  setAmount: (amount: number) => void;
  setOccasion: (occasion: string) => void;
  setMessage: (message: string) => void;
  setSender: (details: Partial<GiftCardPartyDetails>) => void;
  setReceiverSameAsSender: (value: boolean) => void;
  setReceiver: (details: Partial<GiftCardPartyDetails>) => void;
  setDeliveryAddress: (address: Partial<GiftCardDeliveryAddress>) => void;
  goToDetails: () => void;
  goToAddress: () => void;
  goBack: () => void;
  completeOrder: () => void;
  resetFlow: () => void;
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
  const [deliveryAddress, setDeliveryAddressState] = useState<GiftCardDeliveryAddress>(emptyAddress);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState(getExpectedDeliveryDate());

  const setSender = useCallback((details: Partial<GiftCardPartyDetails>) => {
    setSenderState((current) => ({ ...current, ...details }));
  }, []);

  const setReceiver = useCallback((details: Partial<GiftCardPartyDetails>) => {
    setReceiverState((current) => ({ ...current, ...details }));
  }, []);

  const setDeliveryAddress = useCallback((address: Partial<GiftCardDeliveryAddress>) => {
    setDeliveryAddressState((current) => ({ ...current, ...address }));
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
    setDeliveryAddressState(emptyAddress);
    setOrderNumber(null);
    setEstimatedDeliveryDate(getExpectedDeliveryDate());
  }, []);

  const goToDetails = useCallback(() => setStep("details"), []);
  const goToAddress = useCallback(() => setStep("address"), []);

  const goBack = useCallback(() => {
    setStep((current) => {
      if (current === "details") return "configure";
      if (current === "address") return "details";
      return current;
    });
  }, []);

  const completeOrder = useCallback(() => {
    setOrderNumber(`GC${Date.now().toString().slice(-8)}`);
    setEstimatedDeliveryDate(getExpectedDeliveryDate());
    setStep("success");
  }, []);

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
      deliveryAddress,
      orderNumber,
      estimatedDeliveryDate,
      setCardType,
      setAmount,
      setOccasion,
      setMessage,
      setSender,
      setReceiverSameAsSender,
      setReceiver,
      setDeliveryAddress,
      goToDetails,
      goToAddress,
      goBack,
      completeOrder,
      resetFlow,
    }),
    [
      amount,
      cardType,
      completeOrder,
      deliveryAddress,
      estimatedDeliveryDate,
      goBack,
      goToAddress,
      goToDetails,
      message,
      occasion,
      orderNumber,
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
