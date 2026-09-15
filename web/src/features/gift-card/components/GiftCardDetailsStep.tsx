"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { CartPrimaryButton } from "@/features/cart/components/CartFlowUi";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { RIGHT_PANEL_CONTENT_PADDING_CLASS } from "@/shared/ui/rightPanel";
import { RightPanelScrollLayout } from "@/shared/ui/RightPanelScrollLayout";
import { cn } from "@/shared/utils/cn";
import {
  validatePhone,
  validateRequiredEmail,
  validateRequiredName,
} from "@/shared/utils/formValidation";
import { useCustomerProfileContact } from "@/shared/hooks/use-customer-profile-contact";
import { useGiftCardFlow } from "../context/GiftCardFlowContext";
import { useGiftCardPayment } from "../hooks/useGiftCardPayment";
import { giftCardFlowContent } from "../data/content";
import {
  GiftCardCheckbox,
  GiftCardPhoneField,
  GiftCardTextField,
  giftCardSectionHeadingClass,
} from "./GiftCardFormUi";
import type { GiftCardPartyDetails } from "../context/GiftCardFlowContext";

const isGiftCardPartyComplete = (party: GiftCardPartyDetails): boolean =>
  validateRequiredName(party.fullName).valid &&
  validatePhone(party.phone, "+91").valid &&
  validateRequiredEmail(party.email).valid;

const GiftCardDetailsStep = ({ header }: { header: ReactNode }) => {
  const { status, customer } = useAuth();
  const { contact: profileContact } = useCustomerProfileContact(status === "authenticated");
  const { initiatePayment, isPaying, statusToastNode } = useGiftCardPayment();
  const [hasAppliedProfilePrefill, setHasAppliedProfilePrefill] = useState(false);

  const {
    cardType,
    sender,
    receiver,
    receiverSameAsSender,
    setSender,
    setReceiver,
    setReceiverSameAsSender,
    goToAddress,
    isPanelOpen,
  } = useGiftCardFlow();

  const { details, cta } = giftCardFlowContent;

  useEffect(() => {
    if (!isPanelOpen) {
      setHasAppliedProfilePrefill(false);
    }
  }, [isPanelOpen]);

  useEffect(() => {
    if (hasAppliedProfilePrefill) return;

    const profileName = profileContact?.fullName?.trim();
    const profileEmail = profileContact?.email?.trim() || customer?.email?.trim();
    const profilePhone = profileContact?.phone?.trim();

    if (profileName && !sender.fullName.trim()) {
      setSender({ fullName: profileName });
    }
    if (profileEmail && !sender.email.trim()) {
      setSender({ email: profileEmail });
    }
    if (profilePhone && !sender.phone.trim()) {
      setSender({ phone: profilePhone });
    }

    if (profileName || profileEmail || profilePhone || customer) {
      setHasAppliedProfilePrefill(true);
    }
  }, [
    customer,
    hasAppliedProfilePrefill,
    profileContact,
    sender.email,
    sender.fullName,
    sender.phone,
    setSender,
  ]);

  const canContinue =
    isGiftCardPartyComplete(sender) &&
    (receiverSameAsSender || isGiftCardPartyComplete(receiver));

  const handleContinue = async () => {
    if (!canContinue || isPaying) return;

    if (cardType === "physical") {
      goToAddress();
      return;
    }

    await initiatePayment();
  };

  return (
    <>
      {statusToastNode}
      <RightPanelScrollLayout
        footer={
          <PanelFooter>
            <CartPrimaryButton
              type="button"
              disabled={!canContinue || isPaying}
              onClick={handleContinue}
            >
              {cardType === "digital" ? cta.payNow : cta.addAddress}
            </CartPrimaryButton>
          </PanelFooter>
        }
      >
        {header}
        <div className={cn("flex flex-col gap-10 pt-6 pb-24", RIGHT_PANEL_CONTENT_PADDING_CLASS)}>
          <div className="flex flex-col gap-4">
            <p className={cn("mb-2", giftCardSectionHeadingClass)}>
              {details.senderHeading}
            </p>
            <GiftCardTextField
              id="gift-card-sender-name"
              label={details.fullNameLabel}
              value={sender.fullName}
              onChange={(value) => setSender({ fullName: value })}
              placeholder={details.placeholder}
            />
            <GiftCardPhoneField
              id="gift-card-sender-phone"
              label={details.phoneLabel}
              value={sender.phone}
              onChange={(value) => setSender({ phone: value })}
            />
            <GiftCardTextField
              id="gift-card-sender-email"
              label={details.emailLabel}
              value={sender.email}
              onChange={(value) => setSender({ email: value })}
              placeholder={details.placeholder}
              type="email"
            />
          </div>

          <div className="flex flex-col gap-4">
            <p className={cn("mb-2", giftCardSectionHeadingClass)}>{details.receiverHeading}</p>
            <GiftCardCheckbox
              checked={receiverSameAsSender}
              onChange={setReceiverSameAsSender}
              label={details.sameAsSenderLabel}
            />
            {!receiverSameAsSender ? (
              <div className="flex flex-col gap-4">
                <GiftCardTextField
                  id="gift-card-receiver-name"
                  label={details.fullNameLabel}
                  value={receiver.fullName}
                  onChange={(value) => setReceiver({ fullName: value })}
                  placeholder={details.placeholder}
                />
                <GiftCardPhoneField
                  id="gift-card-receiver-phone"
                  label={details.phoneLabel}
                  value={receiver.phone}
                  onChange={(value) => setReceiver({ phone: value })}
                />
                <GiftCardTextField
                  id="gift-card-receiver-email"
                  label={details.emailLabel}
                  value={receiver.email}
                  onChange={(value) => setReceiver({ email: value })}
                  placeholder={details.placeholder}
                  type="email"
                />
              </div>
            ) : null}
          </div>
        </div>
      </RightPanelScrollLayout>
    </>
  );
};

export default GiftCardDetailsStep;
