"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getExpectedDeliveryDate } from "@/features/checkout/types/checkout.types";
import { giftCardFlowContent } from "../data/content";
import {
  clearGiftCardFlowStorage,
  readGiftCardFlowStorage,
  writeGiftCardFlowStorage,
} from "../utils/giftCardFlowStorage";
import type { GiftCardOccasionOption } from "../utils/giftCardOccasions.utils";

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
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  step: GiftCardFlowStep;
  cardType: GiftCardType;
  amount: number;
  occasion: string;
  digitalDeliveryDate: string;
  message: string;
  sender: GiftCardPartyDetails;
  receiverSameAsSender: boolean;
  receiver: GiftCardPartyDetails;
  deliveryAddress: GiftCardDeliveryAddress;
  orderNumber: string | null;
  estimatedDeliveryDate: string;
  occasionOptions: GiftCardOccasionOption[];
  isOccasionsLoading: boolean;
  pendingAuthAfterConfigure: boolean;
  setCardType: (type: GiftCardType) => void;
  setAmount: (amount: number) => void;
  setOccasion: (occasion: string) => void;
  setDigitalDeliveryDate: (date: string) => void;
  setMessage: (message: string) => void;
  setSender: (details: Partial<GiftCardPartyDetails>) => void;
  setReceiverSameAsSender: (value: boolean) => void;
  setReceiver: (details: Partial<GiftCardPartyDetails>) => void;
  setDeliveryAddress: (address: Partial<GiftCardDeliveryAddress>) => void;
  setOccasionOptions: (options: GiftCardOccasionOption[]) => void;
  setIsOccasionsLoading: (loading: boolean) => void;
  requestDetailsStep: () => void;
  beginGuestAuthForDetails: () => void;
  goToDetails: () => void;
  goToAddress: () => void;
  goBack: () => void;
  markOrderComplete: (orderNumber: string) => void;
  resetFlow: () => void;
  persistFlowState: () => void;
  resumeAfterAuth: () => void;
};

const GiftCardFlowContext = createContext<GiftCardFlowContextValue | undefined>(undefined);

type GiftCardFlowProviderProps = {
  children: ReactNode;
  defaultPanelOpen?: boolean;
};

export function GiftCardFlowProvider({
  children,
  defaultPanelOpen = false,
}: GiftCardFlowProviderProps) {
  const persisted = readGiftCardFlowStorage();

  const [isPanelOpen, setIsPanelOpen] = useState(defaultPanelOpen);
  const [step, setStep] = useState<GiftCardFlowStep>(persisted?.step ?? "configure");
  const [cardType, setCardType] = useState<GiftCardType>(persisted?.cardType ?? "physical");
  const [amount, setAmount] = useState(persisted?.amount ?? giftCardFlowContent.amount.default);
  const [occasion, setOccasion] = useState(persisted?.occasion ?? "");
  const [digitalDeliveryDate, setDigitalDeliveryDate] = useState(
    persisted?.digitalDeliveryDate ?? "",
  );
  const [message, setMessage] = useState(persisted?.message ?? "");
  const [sender, setSenderState] = useState<GiftCardPartyDetails>(persisted?.sender ?? emptyParty);
  const [receiverSameAsSender, setReceiverSameAsSender] = useState(
    persisted?.receiverSameAsSender ?? true,
  );
  const [receiver, setReceiverState] = useState<GiftCardPartyDetails>(
    persisted?.receiver ?? emptyParty,
  );
  const [deliveryAddress, setDeliveryAddressState] = useState<GiftCardDeliveryAddress>(
    persisted?.deliveryAddress ?? emptyAddress,
  );
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState(getExpectedDeliveryDate());
  const [occasionOptions, setOccasionOptions] = useState<GiftCardOccasionOption[]>([]);
  const [isOccasionsLoading, setIsOccasionsLoading] = useState(false);
  const [pendingAuthAfterConfigure, setPendingAuthAfterConfigure] = useState(
    persisted?.pendingAuthAfterConfigure ?? false,
  );

  const setSender = useCallback((details: Partial<GiftCardPartyDetails>) => {
    setSenderState((current) => ({ ...current, ...details }));
  }, []);

  const setReceiver = useCallback((details: Partial<GiftCardPartyDetails>) => {
    setReceiverState((current) => ({ ...current, ...details }));
  }, []);

  const setDeliveryAddress = useCallback((address: Partial<GiftCardDeliveryAddress>) => {
    setDeliveryAddressState((current) => ({ ...current, ...address }));
  }, []);

  const updateCardType = useCallback((type: GiftCardType) => {
    setCardType(type);
    if (type === "physical") {
      setDigitalDeliveryDate("");
    }
  }, []);

  const persistFlowState = useCallback(
    (overrides?: Partial<{ pendingAuthAfterConfigure: boolean; step: GiftCardFlowStep }>) => {
      writeGiftCardFlowStorage({
        step: overrides?.step ?? step,
        cardType,
        amount,
        occasion,
        digitalDeliveryDate,
        message,
        sender,
        receiverSameAsSender,
        receiver,
        deliveryAddress,
        pendingAuthAfterConfigure:
          overrides?.pendingAuthAfterConfigure ?? pendingAuthAfterConfigure,
      });
    },
    [
      amount,
      cardType,
      deliveryAddress,
      message,
      occasion,
      digitalDeliveryDate,
      pendingAuthAfterConfigure,
      receiver,
      receiverSameAsSender,
      sender,
      step,
    ],
  );

  useEffect(() => {
    if (!isPanelOpen) return;
    persistFlowState();
  }, [isPanelOpen, persistFlowState]);

  useEffect(() => {
    if (!receiverSameAsSender) return;
    setReceiverState(sender);
  }, [receiverSameAsSender, sender]);

  const openPanel = useCallback(() => setIsPanelOpen(true), []);

  const closePanel = useCallback(() => {
    setIsPanelOpen(false);
  }, []);

  const resetFlow = useCallback(() => {
    setStep("configure");
    setCardType("physical");
    setAmount(giftCardFlowContent.amount.default);
    setOccasion("");
    setDigitalDeliveryDate("");
    setMessage("");
    setSenderState(emptyParty);
    setReceiverSameAsSender(true);
    setReceiverState(emptyParty);
    setDeliveryAddressState(emptyAddress);
    setOrderNumber(null);
    setEstimatedDeliveryDate(getExpectedDeliveryDate());
    setPendingAuthAfterConfigure(false);
    clearGiftCardFlowStorage();
  }, []);

  const goToDetails = useCallback(() => {
    setStep("details");
    setPendingAuthAfterConfigure(false);
    persistFlowState({ step: "details", pendingAuthAfterConfigure: false });
  }, [persistFlowState]);

  const goToAddress = useCallback(() => setStep("address"), []);

  const goBack = useCallback(() => {
    setStep((current) => {
      if (current === "details") return "configure";
      if (current === "address") return "details";
      return current;
    });
  }, []);

  const markOrderComplete = useCallback((nextOrderNumber: string) => {
    setOrderNumber(nextOrderNumber);
    setEstimatedDeliveryDate(getExpectedDeliveryDate());
    setStep("success");
    clearGiftCardFlowStorage();
  }, []);

  const requestDetailsStep = useCallback(() => {
    goToDetails();
  }, [goToDetails]);

  const beginGuestAuthForDetails = useCallback(() => {
    setPendingAuthAfterConfigure(true);
    persistFlowState({ pendingAuthAfterConfigure: true });
  }, [persistFlowState]);

  const resumeAfterAuth = useCallback(() => {
    setPendingAuthAfterConfigure(false);
    goToDetails();
  }, [goToDetails]);

  const value = useMemo(
    () => ({
      isPanelOpen,
      openPanel,
      closePanel,
      step,
      cardType,
      amount,
      occasion,
      digitalDeliveryDate,
      message,
      sender,
      receiverSameAsSender,
      receiver,
      deliveryAddress,
      orderNumber,
      estimatedDeliveryDate,
      occasionOptions,
      isOccasionsLoading,
      pendingAuthAfterConfigure,
      setCardType: updateCardType,
      setAmount,
      setOccasion,
      setDigitalDeliveryDate,
      setMessage,
      setSender,
      setReceiverSameAsSender,
      setReceiver,
      setDeliveryAddress,
      setOccasionOptions,
      setIsOccasionsLoading,
      requestDetailsStep,
      beginGuestAuthForDetails,
      goToDetails,
      goToAddress,
      goBack,
      markOrderComplete,
      resetFlow,
      persistFlowState,
      resumeAfterAuth,
    }),
    [
      amount,
      beginGuestAuthForDetails,
      cardType,
      closePanel,
      deliveryAddress,
      digitalDeliveryDate,
      estimatedDeliveryDate,
      goBack,
      goToAddress,
      goToDetails,
      isOccasionsLoading,
      isPanelOpen,
      markOrderComplete,
      message,
      occasion,
      occasionOptions,
      openPanel,
      orderNumber,
      pendingAuthAfterConfigure,
      persistFlowState,
      receiver,
      receiverSameAsSender,
      requestDetailsStep,
      resetFlow,
      resumeAfterAuth,
      sender,
      step,
      updateCardType,
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
