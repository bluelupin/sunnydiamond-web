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
  const [form, setForm] = useState<CustomerAddressInput>(initialValues ?? emptyAddressForm());
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (field: keyof CustomerAddressInput, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    try {
      await onSubmit(form);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to save address");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-sm border border-neutral300 bg-white p-5 md:p-6">
      <CheckoutField
        id="profile-address-name"
        label="Your Name"
        value={form.name}
        onChange={(value) => handleChange("name", value)}
      />
      <CheckoutField
        id="profile-address-line-1"
        label="Address Line 1"
        value={form.addressLine1}
        onChange={(value) => handleChange("addressLine1", value)}
      />
      <CheckoutField
        id="profile-address-line-2"
        label="Address Line 2"
        optional
        value={form.addressLine2 ?? ""}
        onChange={(value) => handleChange("addressLine2", value)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <CheckoutField
          id="profile-address-pincode"
          label="Pincode"
          value={form.pincode}
          onChange={(value) => handleChange("pincode", value)}
        />
        <CheckoutField
          id="profile-address-city"
          label="City"
          value={form.city}
          onChange={(value) => handleChange("city", value)}
        />
      </div>
      <CheckoutSelectField
        id="profile-address-state"
        label="State"
        value={form.state}
        onChange={(value) => handleChange("state", value)}
        options={stateOptions}
      />
      <CheckoutField
        id="profile-address-phone"
        label="Phone"
        type="tel"
        value={form.phone}
        onChange={(value) => handleChange("phone", value)}
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
