"use client";

import { useMemo, useState } from "react";
import {
  DetailDarkButton,
  DetailOutlineButton,
  DetailTextLink,
} from "@/features/products/components/detail/shared";
import { mapCustomerAddressToFormInput } from "@/services/customer/customer-account.mapper";
import type {
  CustomerAddress,
  CustomerAddressInput,
} from "@/services/customer/customer-account.types";
import { profileTabsContent } from "../data/profileContent";
import { useCustomerAddresses } from "../hooks/useCustomerAddresses";
import { ProfileAddressesEmptyState } from "./ProfileAddressesEmptyState";
import { ProfileAddressesListingSkeleton } from "./ProfileAddressesListingSkeleton";
import { ProfileAddressFormSheet } from "./ProfileAddressFormSheet";
import { ProfileDeleteAddressDialog } from "./ProfileDeleteAddressDialog";
import { ProfileAddAddressCard, ProfileCard } from "./profileUi";
import FormFieldError from "@/shared/ui/FormFieldError";
import { useProfileAddressToastController } from "../hooks/useProfileAddressToastController";

const addressContent = profileTabsContent.addresses;

function AddressCard({
  address,
  isSaving,
  onEdit,
  onDelete,
  onMarkAsDefault,
}: {
  address: CustomerAddress;
  isSaving: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMarkAsDefault: () => void;
}) {
  const isDefaultShipping = address.isDefaultShipping;

  const addressLines = [
    ...address.streetLines.filter(Boolean),
    [address.city, address.pincode].filter(Boolean).join(", "),
  ].filter(Boolean);

  if (isDefaultShipping) {
    return (
      <ProfileCard className="flex flex-col gap-6">
        <div className="flex flex-col md:gap-6 gap-4">
          <div className="flex flex-col gap-3 font-gill text-base leading-110 text-darkblack">
            <p className="font-normal">{address.fullName}</p>
            <div className="font-light leading-[145%]">
              {addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
          <p className="font-gill text-base font-normal leading-110 text-gold500">
            {addressContent.defaultShippingLabel}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <DetailOutlineButton
            type="button"
            className="min-w-0 flex-1"
            onClick={onDelete}
            disabled={isSaving}
          >
            {addressContent.removeLabel}
          </DetailOutlineButton>
          <DetailDarkButton
            type="button"
            className="min-w-0 flex-1"
            onClick={onEdit}
            disabled={isSaving}
          >
            {addressContent.editLabel}
          </DetailDarkButton>
        </div>
      </ProfileCard>
    );
  }

  return (
    <ProfileCard className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 font-gill text-base leading-110 text-darkblack">
        <p className="font-normal">{address.fullName}</p>
        <div className="font-light">
          {addressLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
      <DetailTextLink
        onClick={isSaving ? undefined : onMarkAsDefault}
        className={isSaving ? "pointer-events-none opacity-50 text-sm uppercase" : "text-sm uppercase"}
      >
        {addressContent.markAsDefaultLabel}
      </DetailTextLink>
      <div className="flex items-center gap-4">
        <DetailOutlineButton
          type="button"
          className="min-w-0 flex-1"
          onClick={onDelete}
          disabled={isSaving}
        >
          {addressContent.removeLabel}
        </DetailOutlineButton>
        <DetailDarkButton
          type="button"
          className="min-w-0 flex-1"
          onClick={onEdit}
          disabled={isSaving}
        >
          {addressContent.editLabel}
        </DetailDarkButton>
      </div>
    </ProfileCard>
  );
}

const ProfileAddressesSection = () => {
  const { show: showAddressToast, node: addressToast } = useProfileAddressToastController();
  const {
    addresses,
    isLoading,
    isSaving,
    error,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultShippingAddress,
  } = useCustomerAddresses(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [deleteUid, setDeleteUid] = useState<string | null>(null);

  const editingAddress = useMemo(
    () => addresses.find((address) => address.uid === editingUid) ?? null,
    [addresses, editingUid],
  );

  const closeForm = () => {
    setSheetOpen(false);
    setEditingUid(null);
  };

  const openAddForm = () => {
    setEditingUid(null);
    setSheetOpen(true);
  };

  const openEditForm = (uid: string) => {
    setEditingUid(uid);
    setSheetOpen(true);
  };

  const handleCreate = async (input: CustomerAddressInput) => {
    const shouldBeDefault =
      addresses.length === 0 || !addresses.some((address) => address.isDefaultShipping);

    await createAddress({
      ...input,
      defaultShipping: shouldBeDefault,
      defaultBilling: false,
    });
    closeForm();
  };

  const handleUpdate = async (input: CustomerAddressInput) => {
    if (!editingUid) {
      return;
    }

    await updateAddress(editingUid, {
      ...input,
      defaultShipping: editingAddress?.isDefaultShipping ?? false,
      defaultBilling: false,
    });
    closeForm();
  };

  const handleDeleteRequest = (uid: string) => {
    setDeleteUid(uid);
  };

  const handleConfirmDelete = async () => {
    if (!deleteUid) {
      return;
    }

    try {
      await deleteAddress(deleteUid);

      if (editingUid === deleteUid) {
        closeForm();
      }

      setDeleteUid(null);
    } catch {
      // Errors surface via FormFieldError from useCustomerAddresses.
    }
  };

  const handleMarkAsDefault = async (address: CustomerAddress) => {
    if (address.isDefaultShipping || isSaving) {
      return;
    }

    const previousDefault = addresses.find(
      (item) => item.isDefaultShipping && item.uid !== address.uid,
    );

    try {
      await setDefaultShippingAddress(address.uid);

      showAddressToast(addressContent.defaultAddressChangedMessage, {
        onUndo: previousDefault
          ? async () => {
            await setDefaultShippingAddress(previousDefault.uid);
          }
          : undefined,
      });
    } catch {
      // Errors surface via FormFieldError from useCustomerAddresses.
    }
  };

  if (isLoading) {
    return <ProfileAddressesListingSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      {error ? (
        <FormFieldError message={error} />
      ) : null}

      {addresses.length === 0 && !sheetOpen ? (
        <ProfileAddressesEmptyState onAddAddress={openAddForm} isSaving={isSaving} />
      ) : (
        <div className="grid grid-cols-1 lg:gap-6 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {!sheetOpen ? (
            <ProfileAddAddressCard
              label={addressContent.addCardLabel}
              onClick={openAddForm}
              disabled={isSaving}
            />
          ) : null}
          {addresses.map((address) => (
            <AddressCard
              key={address.uid}
              address={address}
              isSaving={isSaving}
              onEdit={() => openEditForm(address.uid)}
              onDelete={() => handleDeleteRequest(address.uid)}
              onMarkAsDefault={() => void handleMarkAsDefault(address)}
            />
          ))}
        </div>
      )}

      <ProfileAddressFormSheet
        open={sheetOpen}
        onOpenChange={(open) => {
          if (!open && isSaving) {
            return;
          }

          if (!open) {
            closeForm();
          } else {
            setSheetOpen(true);
          }
        }}
        title={editingUid ? addressContent.editFormTitle : addressContent.addFormTitle}
        initialValues={
          editingAddress ? mapCustomerAddressToFormInput(editingAddress) : undefined
        }
        isEditing={Boolean(editingUid)}
        isSaving={isSaving}
        onSubmit={editingUid ? handleUpdate : handleCreate}
      />

      <ProfileDeleteAddressDialog
        open={deleteUid !== null}
        onOpenChange={(open) => {
          if (!open && isSaving) {
            return;
          }

          if (!open) {
            setDeleteUid(null);
          }
        }}
        onConfirmDelete={() => void handleConfirmDelete()}
        isDeleting={isSaving}
      />

      {addressToast}
    </div>
  );
};

export default ProfileAddressesSection;
