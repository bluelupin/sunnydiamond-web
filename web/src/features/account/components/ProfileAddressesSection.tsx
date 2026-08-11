"use client";

import { useMemo, useState } from "react";
import { CartOutlineButton } from "@/features/cart/components/CartFlowUi";
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
import { ProfileAddressFormSheet } from "./ProfileAddressFormSheet";
import { ProfileDeleteAddressDialog } from "./ProfileDeleteAddressDialog";
import { useProfileDefaultAddressToast } from "./ProfileDefaultAddressToast";
import {
  ProfileAddAddressCard,
  ProfileCard,
  ProfileEmptyState,
} from "./profileUi";
import { useToast } from "@/shared/hooks/use-toast";

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
  const isDefaultBilling = address.isDefaultBilling;
  const showDefaultLabel = isDefaultShipping || isDefaultBilling;
  const defaultLabel = isDefaultShipping
    ? addressContent.defaultShippingLabel
    : addressContent.defaultBillingLabel;

  const addressLines = [
    ...address.streetLines.filter(Boolean),
    [address.city, address.pincode].filter(Boolean).join(", "),
  ].filter(Boolean);

  if (showDefaultLabel) {
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
        <p className="font-gill text-base font-normal leading-110 text-gold500">
          {defaultLabel}
        </p>
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

function AddressesSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
      aria-busy="true"
      aria-label="Loading addresses"
    >
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
  const { toast } = useToast();
  const { showDefaultAddressChangedToast, toast: defaultAddressToast } =
    useProfileDefaultAddressToast();
  const {
    addresses,
    isLoading,
    isSaving,
    error,
    createAddress,
    updateAddress,
    deleteAddress,
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
    await createAddress(input);
    closeForm();
  };

  const handleUpdate = async (input: CustomerAddressInput) => {
    if (!editingUid) {
      return;
    }

    await updateAddress(editingUid, input);
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
    } catch (error) {
      toast({
        title: addressContent.deleteDialog.errorTitle,
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
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
      const input = mapCustomerAddressToFormInput(address);
      await updateAddress(address.uid, { ...input, defaultShipping: true });

      showDefaultAddressChangedToast({
        onUndo: previousDefault
          ? async () => {
              try {
                const undoInput = mapCustomerAddressToFormInput(previousDefault);
                await updateAddress(previousDefault.uid, {
                  ...undoInput,
                  defaultShipping: true,
                });
              } catch (undoError) {
                toast({
                  title: addressContent.markAsDefaultErrorTitle,
                  description:
                    undoError instanceof Error ? undoError.message : "Please try again.",
                  variant: "destructive",
                });
              }
            }
          : undefined,
      });
    } catch (error) {
      toast({
        title: addressContent.markAsDefaultErrorTitle,
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <AddressesSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      {error ? (
        <p className="font-gill text-sm font-light leading-110 text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      {addresses.length === 0 && !sheetOpen ? (
        <ProfileEmptyState
          title={addressContent.emptyTitle}
          description={addressContent.emptyDescription}
          action={
            <CartOutlineButton
              type="button"
              className="w-full max-w-xs"
              onClick={openAddForm}
              disabled={isSaving}
            >
              {addressContent.emptyCta}
            </CartOutlineButton>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

      {defaultAddressToast}
    </div>
  );
};

export default ProfileAddressesSection;
