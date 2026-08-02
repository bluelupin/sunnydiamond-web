import type { IndianState } from "@/features/checkout/constants/indianStates";

/** Magento `region_id` values for India (`country_code: IN`) on the dev store. */
export const INDIA_MAGENTO_REGION_IDS: Record<IndianState, number> = {
  "Andhra Pradesh": 570,
  "Arunachal Pradesh": 571,
  Assam: 572,
  Bihar: 573,
  Chhattisgarh: 575,
  Goa: 579,
  Gujarat: 580,
  Haryana: 581,
  "Himachal Pradesh": 582,
  Jharkhand: 584,
  Karnataka: 585,
  Kerala: 586,
  "Madhya Pradesh": 588,
  Maharashtra: 589,
  Manipur: 590,
  Meghalaya: 591,
  Mizoram: 592,
  Nagaland: 593,
  Odisha: 594,
  Punjab: 596,
  Rajasthan: 597,
  Sikkim: 598,
  "Tamil Nadu": 599,
  Telangana: 600,
  Tripura: 601,
  "Uttar Pradesh": 602,
  Uttarakhand: 603,
  "West Bengal": 604,
};

export function getIndiaMagentoRegionId(state: string): number | null {
  const normalized = state.trim();
  if (!normalized) {
    return null;
  }

  return INDIA_MAGENTO_REGION_IDS[normalized as IndianState] ?? null;
}

export function getIndianStateFromMagentoRegionId(regionId: number): IndianState | null {
  for (const [state, id] of Object.entries(INDIA_MAGENTO_REGION_IDS)) {
    if (id === regionId) {
      return state as IndianState;
    }
  }

  return null;
}
