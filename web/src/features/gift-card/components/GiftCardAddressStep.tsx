"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { CartPrimaryButton } from "@/features/cart/components/CartFlowUi";
import { getExpectedDeliveryDate } from "@/features/checkout/types/checkout.types";
import FormFieldError from "@/shared/ui/FormFieldError";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { RIGHT_PANEL_CONTENT_PADDING_CLASS } from "@/shared/ui/rightPanel";
import { RightPanelScrollLayout } from "@/shared/ui/RightPanelScrollLayout";
import { useCurrentLocationAddress } from "@/shared/hooks/use-current-location-address";
import { cn } from "@/shared/utils/cn";
import {
  invalidFieldClassName,
  sanitizePincodeInput,
  shouldShowFieldError,
  validateAddressLine1,
  validateCity,
  validateIndianPincode,
  validateIndianState,
} from "@/shared/utils/formValidation";
import { INDIAN_STATES } from "@/features/checkout/constants/indianStates";
import { useGiftCardFlow } from "../context/GiftCardFlowContext";
import { useGiftCardPayment } from "../hooks/useGiftCardPayment";
import { giftCardFlowContent } from "../data/content";
import {
  giftCardFieldClassName,
  giftCardFieldLabelClass,
  giftCardSectionHeadingClass,
} from "./GiftCardFormUi";

type AddressField = "addressLine1" | "addressLine2" | "pincode" | "city" | "state";

const GiftCardAddressStep = ({ header }: { header: ReactNode }) => {
  const { deliveryAddress, setDeliveryAddress, estimatedDeliveryDate } = useGiftCardFlow();
  const { initiatePayment, isPaying, statusToastNode } = useGiftCardPayment();
  const { detectAddress, isLocating } = useCurrentLocationAddress();
  const [touched, setTouched] = useState<Partial<Record<AddressField, boolean>>>({});

  const { address } = giftCardFlowContent;
  const stateOptions = INDIAN_STATES;

  const errors = useMemo(() => {
    const pincodeValidation = validateIndianPincode(deliveryAddress.pincode);
    return {
      addressLine1: validateAddressLine1(deliveryAddress.addressLine1).error,
      addressLine2: undefined,
      pincode: pincodeValidation.valid ? undefined : address.invalidPincodeError,
      city: validateCity(deliveryAddress.city).error,
      state: validateIndianState(deliveryAddress.state, stateOptions).error,
    };
  }, [address.invalidPincodeError, deliveryAddress, stateOptions]);

  const isValid = Object.values(errors).every((error) => !error);

  const markTouched = (field: AddressField) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const showError = (field: AddressField) =>
    shouldShowFieldError(Boolean(touched[field]), false, errors[field]);

  const handleUseCurrentLocation = async () => {
    const detected = await detectAddress();
    if (!detected) return;

    setDeliveryAddress({
      addressLine1: detected.addressLine1,
      addressLine2: detected.addressLine2,
      pincode: detected.pincode,
      city: detected.city,
      state: detected.state,
    });
    setTouched({
      addressLine1: true,
      addressLine2: true,
      pincode: true,
      city: true,
      state: true,
    });
  };

  const handlePayNow = async () => {
    setTouched({
      addressLine1: true,
      addressLine2: true,
      pincode: true,
      city: true,
      state: true,
    });
    if (!isValid || isPaying) return;
    await initiatePayment();
  };

  const deliveryEstimate = estimatedDeliveryDate || getExpectedDeliveryDate();

  return (
    <>
      {statusToastNode}
      <RightPanelScrollLayout
        footer={
          <PanelFooter>
            <div className="flex flex-col gap-4">
              <p className="text-center font-gill text-sm font-light leading-110 text-neutral500">
                {address.estimatedDeliveryPrefix} {deliveryEstimate}
              </p>
              <CartPrimaryButton
                type="button"
                disabled={!isValid || isPaying}
                onClick={handlePayNow}
              >
                {address.payNowLabel}
              </CartPrimaryButton>
            </div>
          </PanelFooter>
        }
      >
        {header}
        <div className={cn("flex flex-col pt-6 pb-24", RIGHT_PANEL_CONTENT_PADDING_CLASS)}>
          <div className="mb-6 flex justify-center">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="border-b border-darkblack pb-1 font-gill text-sm font-normal uppercase leading-110 text-darkblack disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLocating ? address.detectingLocationLabel : address.useCurrentLocationLabel}
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <p className={giftCardSectionHeadingClass}>{address.heading}</p>

            <div className="flex flex-col gap-2">
              <label className={giftCardFieldLabelClass} htmlFor="gift-card-address-line-1">
                {address.addressLine1Label}
              </label>
              <input
                id="gift-card-address-line-1"
                type="text"
                value={deliveryAddress.addressLine1}
                onChange={(event) => setDeliveryAddress({ addressLine1: event.target.value })}
                onBlur={() => markTouched("addressLine1")}
                placeholder={address.placeholder}
                autoComplete="address-line1"
                className={cn(giftCardFieldClassName, showError("addressLine1") && invalidFieldClassName)}
              />
              <FormFieldError
                message={showError("addressLine1") ? errors.addressLine1 : undefined}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className={giftCardFieldLabelClass} htmlFor="gift-card-address-line-2">
                {address.addressLine2Label}
              </label>
              <input
                id="gift-card-address-line-2"
                type="text"
                value={deliveryAddress.addressLine2}
                onChange={(event) => setDeliveryAddress({ addressLine2: event.target.value })}
                onBlur={() => markTouched("addressLine2")}
                placeholder={address.placeholder}
                autoComplete="address-line2"
                className={giftCardFieldClassName}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <label className={giftCardFieldLabelClass} htmlFor="gift-card-pincode">
                  {address.pincodeLabel}
                </label>
                <input
                  id="gift-card-pincode"
                  type="text"
                  inputMode="numeric"
                  value={deliveryAddress.pincode}
                  onChange={(event) =>
                    setDeliveryAddress({ pincode: sanitizePincodeInput(event.target.value) })
                  }
                  onBlur={() => markTouched("pincode")}
                  placeholder={address.placeholder}
                  autoComplete="postal-code"
                  maxLength={6}
                  className={cn(giftCardFieldClassName, showError("pincode") && invalidFieldClassName)}
                />
                <FormFieldError message={showError("pincode") ? errors.pincode : undefined} />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <label className={giftCardFieldLabelClass} htmlFor="gift-card-city">
                  {address.cityLabel}
                </label>
                <input
                  id="gift-card-city"
                  type="text"
                  value={deliveryAddress.city}
                  onChange={(event) => setDeliveryAddress({ city: event.target.value })}
                  onBlur={() => markTouched("city")}
                  placeholder={address.placeholder}
                  autoComplete="address-level2"
                  className={cn(giftCardFieldClassName, showError("city") && invalidFieldClassName)}
                />
                <FormFieldError message={showError("city") ? errors.city : undefined} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={giftCardFieldLabelClass} htmlFor="gift-card-state">
                {address.stateLabel}
              </label>
              <input
                id="gift-card-state"
                type="text"
                value={deliveryAddress.state}
                onChange={(event) => setDeliveryAddress({ state: event.target.value })}
                onBlur={() => markTouched("state")}
                placeholder={address.placeholder}
                autoComplete="address-level1"
                className={cn(giftCardFieldClassName, showError("state") && invalidFieldClassName)}
              />
              <FormFieldError message={showError("state") ? errors.state : undefined} />
            </div>
          </div>
        </div>
      </RightPanelScrollLayout>
    </>
  );
};

export default GiftCardAddressStep;
