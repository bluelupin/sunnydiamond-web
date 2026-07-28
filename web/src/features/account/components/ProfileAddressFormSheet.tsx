"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  CheckoutCheckbox,
  CheckoutField,
  CheckoutSelectField,
} from "@/features/checkout/components/CheckoutUi";
import { INDIAN_STATES } from "@/features/checkout/constants/indianStates";
import { DetailDarkButton, DetailTextLink } from "@/features/products/components/detail/shared";
import { useCurrentLocationAddress } from "@/shared/hooks/use-current-location-address";
import { Sheet, SheetContent, SheetTitle } from "@/shared/ui/sheet";
import { PanelFooter } from "@/shared/ui/PanelFooter";
import { cn } from "@/shared/utils/cn";
import {
  getProfileAddressFormErrors,
  isProfileAddressFormValid,
  sanitizePhoneInput,
  sanitizePincodeInput,
  shouldShowFieldError,
  type ProfileAddressFormField,
} from "@/shared/utils/formValidation";
import type { CustomerAddressInput } from "@/services/customer/customer-account.types";
import { profileTabsContent } from "../data/profileContent";

const addressContent = profileTabsContent.addresses;

const emptyAddressForm = (): CustomerAddressInput => ({
  name: "",
  addressLine1: "",
  addressLine2: "",
  pincode: "",
  city: "",
  state: "",
  phone: "",
  defaultShipping: false,
  defaultBilling: false,
});

const stateOptions = INDIAN_STATES.map((state) => ({ value: state, label: state }));

function normalizeProfileAddressForm(input: CustomerAddressInput): CustomerAddressInput {
  const phoneDigits = input.phone.replace(/\D/g, "");
  const normalizedPhone =
    phoneDigits.length === 12 && phoneDigits.startsWith("91")
      ? phoneDigits.slice(2)
      : phoneDigits.length === 11 && phoneDigits.startsWith("0")
        ? phoneDigits.slice(1)
        : phoneDigits;

  return {
    ...input,
    pincode: sanitizePincodeInput(input.pincode),
    phone: sanitizePhoneInput(normalizedPhone, "+91"),
  };
}

type ProfileAddressFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  initialValues?: CustomerAddressInput;
  isEditing?: boolean;
  isSaving: boolean;
  onSubmit: (input: CustomerAddressInput) => Promise<void>;
};

export function ProfileAddressFormSheet({
  open,
  onOpenChange,
  title,
  initialValues,
  isEditing = false,
  isSaving,
  onSubmit,
}: ProfileAddressFormSheetProps) {
  const { detectAddress, isLocating } = useCurrentLocationAddress();
  const [form, setForm] = useState<CustomerAddressInput>(
    normalizeProfileAddressForm(initialValues ?? emptyAddressForm()),
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<ProfileAddressFormField, boolean>>>({});
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      setForm(normalizeProfileAddressForm(initialValues ?? emptyAddressForm()));
      setFormError(null);
      setSubmitted(false);
      setTouched({});
    }

    wasOpenRef.current = open;
  }, [open, initialValues]);

  const errors = useMemo(
    () => getProfileAddressFormErrors(form, INDIAN_STATES),
    [form],
  );

  const showError = (field: ProfileAddressFormField) =>
    shouldShowFieldError(Boolean(touched[field]), submitted, errors[field]);

  const markTouched = (field: ProfileAddressFormField) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const handleChange = (field: keyof CustomerAddressInput, value: string | boolean) => {
    if (field === "pincode" && typeof value === "string") {
      setForm((current) => ({ ...current, pincode: sanitizePincodeInput(value) }));
      return;
    }

    if (field === "phone" && typeof value === "string") {
      setForm((current) => ({ ...current, phone: sanitizePhoneInput(value, "+91") }));
      return;
    }

    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleUseCurrentLocation = async () => {
    const address = await detectAddress();
    if (!address) {
      return;
    }

    setForm((current) => ({
      ...current,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      pincode: address.pincode,
      city: address.city,
      state: address.state,
    }));
    setTouched((current) => ({
      ...current,
      addressLine1: true,
      addressLine2: true,
      pincode: true,
      city: true,
      state: true,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setSubmitted(true);

    if (!isProfileAddressFormValid(form, INDIAN_STATES)) {
      return;
    }

    try {
      await onSubmit(form);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to save address");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        overlayClassName="bg-[rgba(30,30,30,0.75)] backdrop-blur-[4.5px]"
        className="flex h-screen max-h-screen w-full max-w-[472px] flex-col gap-0 border-0 bg-white p-0 sm:max-w-[472px] [&>button]:hidden"
      >
        <SheetTitle className="sr-only">{title}</SheetTitle>

        <div className="px-6 pt-10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-larken text-2xl font-light leading-110 text-darkblack">{title}</h2>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-darkblack"
              aria-label="Close address form"
            >
              <X className="size-6" strokeWidth={1.5} aria-hidden />
            </button>
          </div>
          <div className="mt-5 h-px w-full bg-neutral300" aria-hidden />
        </div>

        <form
          id="profile-address-form"
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
          noValidate
        >
          <div className="flex-1 overflow-y-auto px-6 pt-6">
            <div className="flex flex-col items-center gap-6 pb-72">
              {!isEditing ? (
                <DetailTextLink
                  onClick={isLocating || isSaving ? undefined : handleUseCurrentLocation}
                  className={cn(
                    "text-sm uppercase",
                    (isLocating || isSaving) && "pointer-events-none opacity-50",
                  )}
                >
                  {isLocating ? "DETECTING LOCATION..." : addressContent.useCurrentLocationLabel}
                </DetailTextLink>
              ) : null}

              <div className="flex w-full flex-col gap-6">
                <CheckoutField
                  id="profile-address-name"
                  label={addressContent.fullNameLabel}
                  value={form.name}
                  onChange={(value) => handleChange("name", value)}
                  onBlur={() => markTouched("name")}
                  invalid={showError("name")}
                  error={showError("name") ? errors.name : undefined}
                />
                <CheckoutField
                  id="profile-address-line-1"
                  label="Address Line 1"
                  value={form.addressLine1}
                  onChange={(value) => handleChange("addressLine1", value)}
                  onBlur={() => markTouched("addressLine1")}
                  invalid={showError("addressLine1")}
                  error={showError("addressLine1") ? errors.addressLine1 : undefined}
                />
                <CheckoutField
                  id="profile-address-line-2"
                  label="Address Line 2"
                  optional
                  value={form.addressLine2 ?? ""}
                  onChange={(value) => handleChange("addressLine2", value)}
                  onBlur={() => markTouched("addressLine2")}
                  invalid={showError("addressLine2")}
                  error={showError("addressLine2") ? errors.addressLine2 : undefined}
                />
                <div className="grid gap-6 sm:grid-cols-2">
                  <CheckoutField
                    id="profile-address-pincode"
                    label="Pincode"
                    value={form.pincode}
                    onChange={(value) => handleChange("pincode", value)}
                    onBlur={() => markTouched("pincode")}
                    invalid={showError("pincode")}
                    error={showError("pincode") ? errors.pincode : undefined}
                  />
                  <CheckoutField
                    id="profile-address-city"
                    label="City"
                    value={form.city}
                    onChange={(value) => handleChange("city", value)}
                    onBlur={() => markTouched("city")}
                    invalid={showError("city")}
                    error={showError("city") ? errors.city : undefined}
                  />
                </div>
                <CheckoutSelectField
                  id="profile-address-state"
                  label="State"
                  value={form.state}
                  onChange={(value) => handleChange("state", value)}
                  onBlur={() => markTouched("state")}
                  invalid={showError("state")}
                  error={showError("state") ? errors.state : undefined}
                  options={stateOptions}
                  placeholder="Select"
                />
                <CheckoutField
                  id="profile-address-phone"
                  label="Phone"
                  type="tel"
                  value={form.phone}
                  onChange={(value) => handleChange("phone", value)}
                  onBlur={() => markTouched("phone")}
                  invalid={showError("phone")}
                  error={showError("phone") ? errors.phone : undefined}
                />
                <div className="space-y-3">
                  <CheckoutCheckbox
                    label="Set as default shipping address"
                    checked={Boolean(form.defaultShipping)}
                    onChange={(checked) => handleChange("defaultShipping", checked)}
                  />
                  <CheckoutCheckbox
                    label="Set as default billing address"
                    checked={Boolean(form.defaultBilling)}
                    onChange={(checked) => handleChange("defaultBilling", checked)}
                  />
                </div>

                {formError ? (
                  <p className="font-gill text-sm font-light leading-110 text-red-700" role="alert">
                    {formError}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <PanelFooter contentClassName="px-4 py-6">
            <DetailDarkButton type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? "Saving..." : addressContent.saveLabel}
            </DetailDarkButton>
          </PanelFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
