"use client";

import { cn } from "@/shared/utils/cn";
import {
  CheckoutAddressBlock,
  CheckoutCheckbox,
  CheckoutField,
  CheckoutPhoneField,
  CheckoutRadioRow,
  CheckoutSectionCard,
  CheckoutSectionHeading,
  CheckoutSelectField,
  CheckoutSubheading,
  CheckoutSummaryText,
} from "./CheckoutUi";
import FormFieldError from "@/shared/ui/FormFieldError";
import { AmexLogo, MastercardLogo, VisaLogo } from "@/shared/ui/PaymentLogos";
import { INDIAN_STATES } from "@/features/checkout/constants/indianStates";
import type { CheckoutFormData, CheckoutPaymentData } from "../types/checkout.types";
import type { CheckoutFormField, CheckoutPaymentField } from "@/shared/utils/formValidation";
import { isCheckoutEmailContact, isCodAvailableForOrderTotal } from "@/shared/utils/formValidation";

type CheckoutFormValidationProps = {
  errors: Partial<Record<CheckoutFormField, string | undefined>>;
  showError: (field: CheckoutFormField) => boolean;
  markTouched: (field: CheckoutFormField) => void;
};

type CheckoutPaymentValidationProps = {
  errors: Partial<Record<CheckoutPaymentField, string | undefined>>;
  showError: (field: CheckoutPaymentField) => boolean;
  markTouched: (field: CheckoutPaymentField) => void;
};

type CheckoutFormStepProps = {
  form: CheckoutFormData;
  onChange: (field: keyof CheckoutFormData, value: string | boolean) => void;
  phoneVerified: boolean;
  onVerifyPhone: () => void;
  validation: CheckoutFormValidationProps;
  isAuthenticated?: boolean;
  hasSavedDeliveryAddress?: boolean;
};

type AddressFieldConfig = {
  name: CheckoutFormField;
  addressLine1: CheckoutFormField;
  addressLine2: CheckoutFormField;
  pincode: CheckoutFormField;
  city: CheckoutFormField;
  state: CheckoutFormField;
  phone: CheckoutFormField;
};

const SHIPPING_ADDRESS_FIELDS: AddressFieldConfig = {
  name: "shippingName",
  addressLine1: "addressLine1",
  addressLine2: "addressLine2",
  pincode: "pincode",
  city: "city",
  state: "state",
  phone: "shippingPhone",
};

const BILLING_ADDRESS_FIELDS: AddressFieldConfig = {
  name: "billingName",
  addressLine1: "billingAddressLine1",
  addressLine2: "billingAddressLine2",
  pincode: "billingPincode",
  city: "billingCity",
  state: "billingState",
  phone: "billingPhone",
};

const CheckoutAddressFields = ({
  idPrefix,
  fields,
  form,
  onChange,
  validation,
}: {
  idPrefix: string;
  fields: AddressFieldConfig;
  form: CheckoutFormData;
  onChange: (field: keyof CheckoutFormData, value: string | boolean) => void;
  validation: CheckoutFormValidationProps;
}) => (
  <div className="sm:space-y-6 space-y-4">
    <CheckoutField
      id={`${idPrefix}-name`}
      label="Your Name"
      value={form[fields.name] as string}
      onChange={(value) => onChange(fields.name, value)}
      onBlur={() => validation.markTouched(fields.name)}
      invalid={validation.showError(fields.name)}
      error={validation.showError(fields.name) ? validation.errors[fields.name] : undefined}
    />
    <CheckoutField
      id={`${idPrefix}-address-1`}
      label="Address Line 1"
      value={form[fields.addressLine1] as string}
      onChange={(value) => onChange(fields.addressLine1, value)}
      onBlur={() => validation.markTouched(fields.addressLine1)}
      invalid={validation.showError(fields.addressLine1)}
      error={
        validation.showError(fields.addressLine1) ? validation.errors[fields.addressLine1] : undefined
      }
    />
    <CheckoutField
      id={`${idPrefix}-address-2`}
      label="Address Line 2"
      optional
      value={form[fields.addressLine2] as string}
      onChange={(value) => onChange(fields.addressLine2, value)}
      onBlur={() => validation.markTouched(fields.addressLine2)}
      invalid={validation.showError(fields.addressLine2)}
      error={
        validation.showError(fields.addressLine2) ? validation.errors[fields.addressLine2] : undefined
      }
    />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <CheckoutField
        id={`${idPrefix}-pincode`}
        label="Pincode"
        value={form[fields.pincode] as string}
        onChange={(value) => onChange(fields.pincode, value)}
        onBlur={() => validation.markTouched(fields.pincode)}
        invalid={validation.showError(fields.pincode)}
        error={validation.showError(fields.pincode) ? validation.errors[fields.pincode] : undefined}
      />
      <CheckoutField
        id={`${idPrefix}-city`}
        label="City"
        value={form[fields.city] as string}
        onChange={(value) => onChange(fields.city, value)}
        onBlur={() => validation.markTouched(fields.city)}
        invalid={validation.showError(fields.city)}
        error={validation.showError(fields.city) ? validation.errors[fields.city] : undefined}
      />
    </div>
    <CheckoutSelectField
      id={`${idPrefix}-state`}
      label="State"
      value={form[fields.state] as string}
      onChange={(value) => onChange(fields.state, value)}
      onBlur={() => validation.markTouched(fields.state)}
      options={INDIAN_STATES.map((state) => ({ value: state, label: state }))}
      invalid={validation.showError(fields.state)}
      error={validation.showError(fields.state) ? validation.errors[fields.state] : undefined}
    />
    <CheckoutPhoneField
      id={`${idPrefix}-phone`}
      label="Phone Number"
      value={form[fields.phone] as string}
      onChange={(value) => onChange(fields.phone, value)}
      onBlur={() => validation.markTouched(fields.phone)}
      showVerify={false}
      invalid={validation.showError(fields.phone)}
      error={validation.showError(fields.phone) ? validation.errors[fields.phone] : undefined}
    />
  </div>
);

const buildAddressLines = ({
  addressLine1,
  addressLine2,
  city,
  state,
  pincode,
  phone,
}: {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}) =>
  [
    addressLine1,
    addressLine2,
    `${city}, ${state}, ${pincode}`,
    phone ? `+91 ${phone}` : "",
  ].filter(Boolean);

export const CheckoutFormStep = ({
  form,
  onChange,
  phoneVerified,
  onVerifyPhone,
  validation,
  isAuthenticated = false,
  hasSavedDeliveryAddress = true,
}: CheckoutFormStepProps) => (
  <div className="flex flex-col gap-6">
    <CheckoutSectionCard>
      <h2 className="font-gill text-xl font-normal leading-110 text-darkblack lg:text-2xl">
        Personal Information
      </h2>
      {isAuthenticated ? (
        <p className="font-gill text-sm font-light leading-110 text-neutral500">
          Signed in to your Sunny Diamonds account.
        </p>
      ) : null}
      <CheckoutField
        id="checkout-name"
        label="Your Name*"
        value={form.name}
        onChange={(value) => onChange("name", value)}
        onBlur={() => validation.markTouched("name")}
        invalid={validation.showError("name")}
        error={validation.showError("name") ? validation.errors.name : undefined}
      />
      {isAuthenticated ? (
        <CheckoutField
          id="checkout-email"
          label="Email"
          type="email"
          value={form.phoneOrEmail}
          onChange={(value) => onChange("phoneOrEmail", value)}
          onBlur={() => validation.markTouched("phoneOrEmail")}
          invalid={validation.showError("phoneOrEmail")}
          error={validation.showError("phoneOrEmail") ? validation.errors.phoneOrEmail : undefined}
        />
      ) : (
        <CheckoutPhoneField
          id="checkout-phone-email"
          label="PhoneNo / Email ID"
          mode="phoneOrEmail"
          value={form.phoneOrEmail}
          onChange={(value) => onChange("phoneOrEmail", value)}
          onBlur={() => validation.markTouched("phoneOrEmail")}
          verified={phoneVerified}
          onVerify={onVerifyPhone}
          invalid={validation.showError("phoneOrEmail")}
          error={validation.showError("phoneOrEmail") ? validation.errors.phoneOrEmail : undefined}
        />
      )}
    </CheckoutSectionCard>

    <CheckoutSectionCard gapClassName="lg:gap-8 gap-6">
      <CheckoutSubheading>Delivery Address</CheckoutSubheading>
      {isAuthenticated && !hasSavedDeliveryAddress ? (
        <p
          id="checkout-delivery-address-required"
          className="font-gill text-sm font-light leading-130 text-neutral500"
          role="status"
        >
          Add a delivery address in{" "}
          <a href="/profile?section=addresses" className="border-b border-darkblack text-darkblack">
            My Addresses
          </a>{" "}
          on your profile before continuing checkout.
        </p>
      ) : (
        <>
          {isAuthenticated ? (
            <p className="font-gill text-sm font-light leading-130 text-neutral500">
              Prefilled from your saved address. Any changes here apply to this order only.
            </p>
          ) : null}
          <div className="space-y-6">
            <CheckoutSubheading className="lg:text-xl text-base">SHIPPING ADDRESS</CheckoutSubheading>
            <CheckoutAddressFields
              idPrefix="checkout-shipping"
              fields={SHIPPING_ADDRESS_FIELDS}
              form={form}
              onChange={onChange}
              validation={validation}
            />
          </div>

          <div className="lg:space-y-6 space-y-4">
            <CheckoutSubheading className="lg:text-xl text-base">BILLING ADDRESS</CheckoutSubheading>
            <CheckoutCheckbox
              checked={form.billingSameAsShipping}
              onChange={(checked) => onChange("billingSameAsShipping", checked)}
              label="My billing address is the same as my shipping address"
            />
          </div>

          {!form.billingSameAsShipping ? (
            <CheckoutAddressFields
              idPrefix="checkout-billing"
              fields={BILLING_ADDRESS_FIELDS}
              form={form}
              onChange={onChange}
              validation={validation}
            />
          ) : null}
        </>
      )}
    </CheckoutSectionCard>
  </div>
);

type CheckoutPaymentStepProps = {
  form: CheckoutFormData;
  payment: CheckoutPaymentData;
  orderTotal: number;
  onPaymentChange: (field: keyof CheckoutPaymentData, value: CheckoutPaymentData["method"]) => void;
  onEditPersonal: () => void;
  onEditDelivery: () => void;
  onEditPayment: () => void;
  validation: CheckoutPaymentValidationProps;
  isAuthenticated?: boolean;
};

const RazorpaySecureNote = () => (
  <CheckoutSummaryText>
    You will complete this payment in Razorpay&apos;s secure window after reviewing your order.
  </CheckoutSummaryText>
);

const PaymentCardLogos = () => (
  <div className="flex h-6 items-center gap-2">
    <div className="flex h-6 w-10 items-center justify-center overflow-hidden rounded-sm bg-white">
      <VisaLogo className="h-4 w-10" />
    </div>
    <div className="flex h-6 w-10 items-center justify-center overflow-hidden rounded-sm bg-white">
      <MastercardLogo className="h-6 w-10" />
    </div>
    <div className="flex h-6 w-10 items-center justify-center overflow-hidden rounded-sm bg-white">
      <AmexLogo className="h-6 w-10" />
    </div>
  </div>
);

export const CheckoutPaymentStep = ({
  form,
  payment,
  orderTotal,
  onPaymentChange,
  onEditPersonal,
  onEditDelivery,
  onEditPayment,
  validation,
  isAuthenticated = false,
}: CheckoutPaymentStepProps) => {
  const shippingLines = buildAddressLines({
    addressLine1: form.addressLine1,
    addressLine2: form.addressLine2,
    city: form.city,
    state: form.state,
    pincode: form.pincode,
    phone: form.shippingPhone,
  });

  const billingLines = form.billingSameAsShipping
    ? shippingLines
    : buildAddressLines({
      addressLine1: form.billingAddressLine1,
      addressLine2: form.billingAddressLine2,
      city: form.billingCity,
      state: form.billingState,
      pincode: form.billingPincode,
      phone: form.billingPhone,
    });

  const billingName = form.billingSameAsShipping
    ? form.shippingName || form.name
    : form.billingName || form.name;

  const isCodAvailable = isCodAvailableForOrderTotal(orderTotal);

  return (
    <div className="flex flex-col lg:gap-[33px] gap-6">
      <CheckoutSectionCard>
        <CheckoutSectionHeading onEdit={onEditPersonal}>Personal Information</CheckoutSectionHeading>
        <CheckoutSummaryText>
          You are checking out as {form.name || "Guest"}
          {form.phoneOrEmail
            ? isCheckoutEmailContact(form.phoneOrEmail)
              ? `, ${form.phoneOrEmail}`
              : `, +91 ${form.phoneOrEmail}`
            : ""}
        </CheckoutSummaryText>
      </CheckoutSectionCard>

      <CheckoutSectionCard gapClassName="lg:gap-8 gap-6">
        <CheckoutSectionHeading onEdit={onEditDelivery}>Delivery Address</CheckoutSectionHeading>
        <div className="flex flex-col gap-4">
          <CheckoutSubheading className="lg:text-xl text-base">SHIPPING ADDRESS</CheckoutSubheading>
          <CheckoutAddressBlock name={form.shippingName || form.name} lines={shippingLines} />
        </div>
        <div className="flex flex-col gap-4">
          <CheckoutSubheading className="lg:text-xl text-base">BILLING ADDRESS</CheckoutSubheading>
          <CheckoutCheckbox
            checked={form.billingSameAsShipping}
            onChange={() => undefined}
            readOnly
            label="My billing address is the same as my shipping address"
          />
          {!form.billingSameAsShipping ? (
            <CheckoutAddressBlock name={billingName} lines={billingLines} />
          ) : null}
        </div>
      </CheckoutSectionCard>

      <CheckoutSectionCard gapClassName="gap-6">
        <CheckoutSectionHeading onEdit={onEditPayment}>Payment Mehtod</CheckoutSectionHeading>

        <div id="checkout-payment-methods" className="flex flex-col gap-6">
          <div className="flex items-center justify-between self-stretch">
            <CheckoutRadioRow
              checked={payment.method === "card"}
              onChange={() => onPaymentChange("method", "card")}
              label="Credit/Debit Card"
            />
            {payment.method === "card" ? <PaymentCardLogos /> : null}
          </div>

          {payment.method === "card" ? <RazorpaySecureNote /> : null}

          <CheckoutRadioRow
            checked={payment.method === "upi"}
            onChange={() => onPaymentChange("method", "upi")}
            label="UPI"
          />

          {payment.method === "upi" ? <RazorpaySecureNote /> : null}

          <CheckoutRadioRow
            checked={payment.method === "netbanking"}
            onChange={() => onPaymentChange("method", "netbanking")}
            label="Net Banking"
          />

          {payment.method === "netbanking" ? <RazorpaySecureNote /> : null}

          <div className="flex flex-col gap-2">
            <CheckoutRadioRow
              checked={payment.method === "cod"}
              disabled={!isCodAvailable}
              onChange={() => onPaymentChange("method", "cod")}
              align="start"
              label={
                <span className="flex flex-col gap-1">
                  <span>Cash On Delivery</span>
                  <span
                    className={cn(
                      "font-gill text-xs font-light leading-110",
                      isCodAvailable ? "text-darkblack" : "text-neutral500",
                    )}
                  >
                    {isCodAvailable
                      ? "*for orders up to ₹40,000"
                      : "Not available for orders above ₹40,000"}
                  </span>
                </span>
              }
            />
            {payment.method === "cod" ? (
              <FormFieldError
                id="checkout-cod-error"
                message={validation.showError("cod") ? validation.errors.cod : undefined}
              />
            ) : null}
          </div>
        </div>
      </CheckoutSectionCard>
    </div>
  );
};
