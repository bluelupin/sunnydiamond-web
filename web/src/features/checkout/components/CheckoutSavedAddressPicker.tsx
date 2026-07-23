"use client";

import type { CustomerAddress } from "@/services/customer/customer-account.types";
import { cn } from "@/shared/utils/cn";
import { formatAddressLines } from "@/features/account/utils/formatAccountData";

type CheckoutSavedAddressPickerProps = {
  addresses: CustomerAddress[];
  selectedUid: string;
  onSelect: (address: CustomerAddress) => void;
  onUseNewAddress: () => void;
  usingNewAddress: boolean;
};

const CheckoutSavedAddressPicker = ({
  addresses,
  selectedUid,
  onSelect,
  onUseNewAddress,
  usingNewAddress,
}: CheckoutSavedAddressPickerProps) => {
  if (addresses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <p className="font-gill text-sm font-light leading-110 text-neutral500">
        Choose a saved address or enter a new one below.
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {addresses.map((address) => {
          const isSelected = !usingNewAddress && selectedUid === address.uid;

          return (
            <li key={address.uid}>
              <button
                type="button"
                onClick={() => onSelect(address)}
                className={cn(
                  "flex h-full w-full flex-col items-start gap-2 rounded-sm border p-4 text-left transition-colors",
                  isSelected
                    ? "border-darkblack bg-white"
                    : "border-neutral300 bg-gray200/40 hover:border-darkblack hover:bg-white",
                )}
              >
                <span className="font-gill text-base font-normal leading-110 text-darkblack">
                  {address.fullName}
                </span>
                <span className="font-gill text-sm font-light leading-110 text-neutral500">
                  {formatAddressLines(address.streetLines)}
                  <br />
                  {address.city}, {address.state} {address.pincode}
                </span>
                {address.isDefaultShipping ? (
                  <span className="font-gill text-xs font-light leading-110 text-neutral500">
                    Default shipping
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={onUseNewAddress}
        className={cn(
          "font-gill text-sm font-normal leading-110 underline-offset-2 hover:underline",
          usingNewAddress ? "text-darkblack" : "text-neutral500",
        )}
      >
        {usingNewAddress ? "Entering a new address" : "Use a different address"}
      </button>
    </div>
  );
};

export default CheckoutSavedAddressPicker;
