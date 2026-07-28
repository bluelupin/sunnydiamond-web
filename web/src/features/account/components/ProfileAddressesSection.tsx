"use client";

import { useMemo, useState } from "react";
import {
  CheckoutCheckbox,
  CheckoutField,
  CheckoutSelectField,
} from "@/features/checkout/components/CheckoutUi";
import { INDIAN_STATES } from "@/features/checkout/constants/indianStates";
import {
  CartOutlineButton,
  CartPrimaryButton,
  CartPrimaryLink,
} from "@/features/cart/components/CartFlowUi";
import { mapCustomerAddressToFormInput } from "@/services/customer/customer-account.mapper";
import type {
  CustomerAddress,
  CustomerAddressInput,
} from "@/services/customer/customer-account.types";
import {
  getProfileAddressFormErrors,
  isProfileAddressFormValid,
  sanitizePhoneInput,
  sanitizePincodeInput,
  shouldShowFieldError,
  type ProfileAddressFormField,
} from "@/shared/utils/formValidation";
import { useCustomerAddresses } from "../hooks/useCustomerAddresses";
import { formatAddressLines } from "../utils/formatAccountData";

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

type ProfileAddressFormProps = {
  initialValues?: CustomerAddressInput;
  submitLabel: string;
  isSaving: boolean;
  onCancel?: () => void;
  onSubmit: (input: CustomerAddressInput) => Promise<void>;
};

const ProfileAddressForm = ({
  initialValues,
  submitLabel,
  isSaving,
  onCancel,
  onSubmit,
}: ProfileAddressFormProps) => {
  const [form, setForm] = useState<CustomerAddressInput>(
    normalizeProfileAddressForm(initialValues ?? emptyAddressForm()),
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<ProfileAddressFormField, boolean>>>({});

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
    <form onSubmit={handleSubmit} className="space-y-4 rounded-sm border border-neutral300 bg-white p-5 md:p-6" noValidate>
      <CheckoutField
        id="profile-address-name"
        label="Your Name"
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
      <div className="grid gap-4 sm:grid-cols-2">
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

      <div className="flex flex-col gap-3 sm:flex-row">
        <CartPrimaryButton type="submit" className="sm:max-w-xs" disabled={isSaving}>
          {isSaving ? "Saving..." : submitLabel}
        </CartPrimaryButton>
        {onCancel ? (
          <CartOutlineButton type="button" className="sm:max-w-xs" onClick={onCancel} disabled={isSaving}>
            Cancel
          </CartOutlineButton>
        ) : null}
      </div>
    </form>
  );
};

function AddressCard({
  address,
  isSaving,
  onEdit,
  onDelete,
}: {
  address: CustomerAddress;
  isSaving: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const badges = [
    address.isDefaultShipping ? "Default shipping" : null,
    address.isDefaultBilling ? "Default billing" : null,
  ].filter(Boolean);

  return (
    <article className="rounded-sm border border-neutral300 bg-gray200/40 p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="font-gill text-base font-normal leading-110 text-darkblack">{address.fullName}</p>
          <p className="font-gill text-sm font-light leading-110 text-neutral500">
            {formatAddressLines(address.streetLines)}
            <br />
            {address.city}, {address.state} {address.pincode}
            <br />
            {address.phone}
          </p>
          {badges.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex rounded-sm bg-white px-2 py-1 font-gill text-xs font-light leading-110 text-neutral500"
                >
                  {badge}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
          <CartOutlineButton type="button" className="w-full min-w-[120px] md:w-auto" onClick={onEdit} disabled={isSaving}>
            Edit
          </CartOutlineButton>
          <CartOutlineButton
            type="button"
            className="w-full min-w-[120px] md:w-auto"
            onClick={onDelete}
            disabled={isSaving}
          >
            Delete
          </CartOutlineButton>
        </div>
      </div>
    </article>
  );
}

function AddressesSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading addresses">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="h-36 animate-pulse rounded-sm border border-neutral300 bg-gray200/60"
        />
      ))}
    </div>
  );
}

const ProfileAddressesSection = () => {
  const {
    addresses,
    isLoading,
    isSaving,
    error,
    createAddress,
    updateAddress,
    deleteAddress,
  } = useCustomerAddresses(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUid, setEditingUid] = useState<string | null>(null);

  const editingAddress = useMemo(
    () => addresses.find((address) => address.uid === editingUid) ?? null,
    [addresses, editingUid],
  );

  const handleCreate = async (input: CustomerAddressInput) => {
    await createAddress(input);
    setShowAddForm(false);
  };

  const handleUpdate = async (input: CustomerAddressInput) => {
    if (!editingUid) {
      return;
    }

    await updateAddress(editingUid, input);
    setEditingUid(null);
  };

  const handleDelete = async (uid: string) => {
    const confirmed = window.confirm("Delete this address?");
    if (!confirmed) {
      return;
    }

    await deleteAddress(uid);

    if (editingUid === uid) {
      setEditingUid(null);
    }
  };

  if (isLoading) {
    return <AddressesSkeleton />;
  }

  return (
    <div className="space-y-6">
      {error ? (
        <p className="font-gill text-sm font-light leading-110 text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      {addresses.length === 0 && !showAddForm && !editingAddress ? (
        <div className="flex flex-col items-start gap-4 rounded-sm border border-dashed border-neutral300 bg-gray200/60 p-6">
          <div className="space-y-2">
            <p className="font-gill text-base font-normal leading-110 text-darkblack">
              No saved addresses
            </p>
            <p className="font-gill text-sm font-light leading-110 text-neutral500">
              Add a delivery address to speed up checkout on your next purchase.
            </p>
          </div>
          <CartPrimaryLink href="/jewellery" className="w-full max-w-xs">
            Continue Shopping
          </CartPrimaryLink>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) =>
            editingUid === address.uid ? (
              <ProfileAddressForm
                key={address.uid}
                initialValues={mapCustomerAddressToFormInput(address)}
                submitLabel="Update Address"
                isSaving={isSaving}
                onCancel={() => setEditingUid(null)}
                onSubmit={handleUpdate}
              />
            ) : (
              <AddressCard
                key={address.uid}
                address={address}
                isSaving={isSaving}
                onEdit={() => {
                  setShowAddForm(false);
                  setEditingUid(address.uid);
                }}
                onDelete={() => void handleDelete(address.uid)}
              />
            ),
          )}
        </div>
      )}

      {showAddForm ? (
        <ProfileAddressForm
          submitLabel="Save Address"
          isSaving={isSaving}
          onCancel={() => setShowAddForm(false)}
          onSubmit={handleCreate}
        />
      ) : (
        <CartOutlineButton
          type="button"
          className="w-full max-w-xs"
          onClick={() => {
            setEditingUid(null);
            setShowAddForm(true);
          }}
          disabled={isSaving}
        >
          Add New Address
        </CartOutlineButton>
      )}
    </div>
  );
};

export default ProfileAddressesSection;
