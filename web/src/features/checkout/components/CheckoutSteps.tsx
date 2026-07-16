"use client";

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
import { AmexLogo, MastercardLogo, VisaLogo } from "@/shared/ui/PaymentLogos";
import type { CheckoutFormData, CheckoutPaymentData } from "../types/checkout.types";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

type CheckoutFormStepProps = {
  form: CheckoutFormData;
  onChange: (field: keyof CheckoutFormData, value: string | boolean) => void;
  phoneVerified: boolean;
  onVerifyPhone: () => void;
};

type AddressFieldConfig = {
  name: keyof CheckoutFormData;
  addressLine1: keyof CheckoutFormData;
  addressLine2: keyof CheckoutFormData;
  pincode: keyof CheckoutFormData;
  city: keyof CheckoutFormData;
  state: keyof CheckoutFormData;
  phone: keyof CheckoutFormData;
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
}: {
  idPrefix: string;
  fields: AddressFieldConfig;
  form: CheckoutFormData;
  onChange: (field: keyof CheckoutFormData, value: string | boolean) => void;
}) => (
  <div className="space-y-6">
    <CheckoutField
      id={`${idPrefix}-name`}
      label="Your Name"
      value={form[fields.name] as string}
      onChange={(value) => onChange(fields.name, value)}
    />
    <CheckoutField
      id={`${idPrefix}-address-1`}
      label="Address Line 1"
      value={form[fields.addressLine1] as string}
      onChange={(value) => onChange(fields.addressLine1, value)}
    />
    <CheckoutField
      id={`${idPrefix}-address-2`}
      label="Address Line 2"
      optional
      value={form[fields.addressLine2] as string}
      onChange={(value) => onChange(fields.addressLine2, value)}
    />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <CheckoutField
        id={`${idPrefix}-pincode`}
        label="Pincode"
        value={form[fields.pincode] as string}
        onChange={(value) => onChange(fields.pincode, value)}
      />
      <CheckoutField
        id={`${idPrefix}-city`}
        label="City"
        value={form[fields.city] as string}
        onChange={(value) => onChange(fields.city, value)}
      />
    </div>
    <CheckoutSelectField
      id={`${idPrefix}-state`}
      label="State"
      value={form[fields.state] as string}
      onChange={(value) => onChange(fields.state, value)}
      options={INDIAN_STATES.map((state) => ({ value: state, label: state }))}
    />
    <CheckoutPhoneField
      id={`${idPrefix}-phone`}
      label="Phone Number"
      value={form[fields.phone] as string}
      onChange={(value) => onChange(fields.phone, value)}
      showVerify={false}
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
}: CheckoutFormStepProps) => (
  <div className="flex flex-col gap-6">
    <CheckoutSectionCard>
      <h2 className="font-gill text-2xl font-normal leading-110 text-darkblack">Personal Information</h2>
      <CheckoutField
        id="checkout-name"
        label="Your Name*"
        value={form.name}
        onChange={(value) => onChange("name", value)}
      />
      <CheckoutPhoneField
        id="checkout-phone-email"
        label="PhoneNo / Email ID"
        value={form.phoneOrEmail}
        onChange={(value) => onChange("phoneOrEmail", value)}
        verified={phoneVerified}
        onVerify={onVerifyPhone}
      />
    </CheckoutSectionCard>

    <CheckoutSectionCard gapClassName="gap-8">
      <CheckoutSubheading>Delivery Address</CheckoutSubheading>
      <div className="space-y-6">
        <CheckoutSubheading>SHIPPING ADDRESS</CheckoutSubheading>
        <CheckoutAddressFields
          idPrefix="checkout-shipping"
          fields={SHIPPING_ADDRESS_FIELDS}
          form={form}
          onChange={onChange}
        />
      </div>

      <div className="space-y-6">
        <CheckoutSubheading>BILLING ADDRESS</CheckoutSubheading>
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
        />
      ) : null}
    </CheckoutSectionCard>
  </div>
);

type CheckoutPaymentStepProps = {
  form: CheckoutFormData;
  payment: CheckoutPaymentData;
  onPaymentChange: (field: keyof CheckoutPaymentData, value: string) => void;
  onEditPersonal: () => void;
  onEditDelivery: () => void;
  onEditPayment: () => void;
};

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
  onPaymentChange,
  onEditPersonal,
  onEditDelivery,
  onEditPayment,
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

  return (
    <div className="flex flex-col gap-[33px]">
      <CheckoutSectionCard>
        <CheckoutSectionHeading onEdit={onEditPersonal}>Personal Information</CheckoutSectionHeading>
        <CheckoutSummaryText>
          You are checking out as {form.name || "Guest"}
          {form.phoneOrEmail ? `, +91 ${form.phoneOrEmail}` : ""}
        </CheckoutSummaryText>
      </CheckoutSectionCard>

      <CheckoutSectionCard gapClassName="gap-8">
        <CheckoutSectionHeading onEdit={onEditDelivery}>Delivery Address</CheckoutSectionHeading>
        <div className="flex flex-col gap-4">
          <CheckoutSubheading>SHIPPING ADDRESS</CheckoutSubheading>
          <CheckoutAddressBlock name={form.shippingName || form.name} lines={shippingLines} />
        </div>
        <div className="flex flex-col gap-4">
          <CheckoutSubheading>BILLING ADDRESS</CheckoutSubheading>
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

        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between self-stretch">
            <CheckoutRadioRow
              checked={payment.method === "card"}
              onChange={() => onPaymentChange("method", "card")}
              label="Credit/Debit Card"
            />
            {payment.method === "card" ? <PaymentCardLogos /> : null}
          </div>

          {payment.method === "card" ? (
            <>
              <CheckoutField
                id="card-name"
                label="Name on Card"
                value={payment.cardName}
                onChange={(value) => onPaymentChange("cardName", value)}
              />
              <CheckoutField
                id="card-number"
                label="Credit Card No"
                value={payment.cardNumber}
                onChange={(value) => onPaymentChange("cardNumber", value)}
              />
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <CheckoutField
                  id="card-expiry"
                  label="Expiry Date"
                  value={payment.expiry}
                  onChange={(value) => onPaymentChange("expiry", value)}
                />
                <CheckoutField
                  id="card-cvv"
                  label="Security Code"
                  value={payment.cvv}
                  onChange={(value) => onPaymentChange("cvv", value)}
                />
              </div>
            </>
          ) : null}

          <CheckoutRadioRow
            checked={payment.method === "upi"}
            onChange={() => onPaymentChange("method", "upi")}
            label="UPI"
          />

          <CheckoutRadioRow
            checked={payment.method === "netbanking"}
            onChange={() => onPaymentChange("method", "netbanking")}
            label="Net Banking"
          />

          <CheckoutRadioRow
            checked={payment.method === "cod"}
            onChange={() => onPaymentChange("method", "cod")}
            align="start"
            label={
              <span className="flex flex-col gap-1">
                <span>Cash On Delivery</span>
                <span className="font-gill text-xs font-light leading-110 text-darkblack">
                  *for orders up to ₹40,000
                </span>
              </span>
            }
          />
        </div>
      </CheckoutSectionCard>
    </div>
  );
};
