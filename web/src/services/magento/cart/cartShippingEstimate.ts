import type { MagentoEstimateAddressInput } from "./magentoCart.types";

/** Default domestic address used only to estimate shipping on the cart page. */
export const DEFAULT_CART_SHIPPING_ESTIMATE_ADDRESS: MagentoEstimateAddressInput = {
  postcode: "682001",
  country_code: "IN",
  region: {
    region_id: 586,
  },
};
