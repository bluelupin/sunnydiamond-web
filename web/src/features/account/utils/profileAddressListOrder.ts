import type { CustomerAddress } from "@/services/customer/customer-account.types";

const storageKey = (customerId: number) => `sd-profile-address-order:${customerId}`;

export function readProfileAddressListOrder(customerId: number): string[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(storageKey(customerId));
    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed.filter((uid): uid is string => typeof uid === "string" && uid.length > 0);
  } catch {
    return null;
  }
}

export function writeProfileAddressListOrder(
  customerId: number,
  addresses: CustomerAddress[],
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    storageKey(customerId),
    JSON.stringify(addresses.map((address) => address.uid)),
  );
}

export function orderAddressesByUidList(
  uidOrder: string[],
  addresses: CustomerAddress[],
): CustomerAddress[] {
  if (uidOrder.length === 0) {
    return addresses;
  }

  const nextByUid = new Map(addresses.map((address) => [address.uid, address]));
  const ordered = uidOrder
    .map((uid) => nextByUid.get(uid))
    .filter((address): address is CustomerAddress => address != null);
  const appended = addresses.filter((address) => !uidOrder.includes(address.uid));
  return [...ordered, ...appended];
}
