import { magentoFetch } from "../client";
import type { CartQueryResponse } from "../types";

export const CREATE_EMPTY_CART_MUTATION = `
  mutation CreateEmptyCart {
    createEmptyCart
  }
`;

export const ADD_TO_CART_MUTATION = `
  mutation AddToCart($cartId: String!, $cartItem: CartItemInput!) {
    addProductsToCart(cartId: $cartId, cartItems: [$cartItem]) {
      cart {
        id
        items {
          uid
          quantity
        }
      }
    }
  }
`;

export const UPDATE_CART_ITEM_MUTATION = `
  mutation UpdateCartItem($cartId: String!, $cartItem: CartItemUpdateInput!) {
    updateCartItems(input: { cart_id: $cartId, cart_items: [$cartItem] }) {
      cart {
        id
        items {
          uid
          quantity
        }
      }
    }
  }
`;

export const REMOVE_FROM_CART_MUTATION = `
  mutation RemoveFromCart($cartId: String!, $cartItemUid: String!) {
    removeItemFromCart(input: { cart_id: $cartId, cart_item_uid: $cartItemUid }) {
      cart {
        id
        items {
          uid
          quantity
        }
      }
    }
  }
`;

export async function createEmptyCart(): Promise<string> {
  const data = await magentoFetch<{ createEmptyCart: string }>({
    query: CREATE_EMPTY_CART_MUTATION,
  }, { revalidate: 0 });
  return data.createEmptyCart;
}

export async function addToCart(cartId: string, sku: string, quantity: number) {
  return magentoFetch<any>({
    query: ADD_TO_CART_MUTATION,
    variables: {
      cartId,
      cartItem: {
        sku,
        quantity,
      },
    },
  }, { revalidate: 0 });
}

export async function updateCartItem(cartId: string, cartItemUid: string, quantity: number) {
  return magentoFetch<any>({
    query: UPDATE_CART_ITEM_MUTATION,
    variables: {
      cartId,
      cartItem: {
        cart_item_uid: cartItemUid,
        quantity,
      },
    },
  }, { revalidate: 0 });
}

export async function removeFromCart(cartId: string, cartItemUid: string) {
  return magentoFetch<any>({
    query: REMOVE_FROM_CART_MUTATION,
    variables: {
      cartId,
      cartItemUid,
    },
  }, { revalidate: 0 });
}
