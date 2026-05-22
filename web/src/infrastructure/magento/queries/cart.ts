import { magentoFetch } from "../client";
import type { CartQueryResponse } from "../types";

export const GET_CART_QUERY = `
  query GetCart($cartId: String!) {
    cart(cart_id: $cartId) {
      id
      items {
        uid
        id
        quantity
        product {
          uid
          sku
          name
          image {
            url
            label
          }
          price_range {
            minimum_price {
              final_price {
                value
                currency
              }
            }
          }
          stock_status
        }
        prices {
          price {
            value
            currency
          }
          row_total {
            value
            currency
          }
        }
      }
      prices {
        grand_total {
          value
          currency
        }
      }
    }
  }
`;

export async function fetchCart(cartId: string) {
  return magentoFetch<CartQueryResponse>({
    query: GET_CART_QUERY,
    variables: { cartId },
  }, { revalidate: 0 }); // Cart data should not be cached globally
}
