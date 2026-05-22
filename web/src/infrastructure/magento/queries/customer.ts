import { magentoFetch } from "../client";
import type { CustomerQueryResponse } from "../types";

export const GET_CUSTOMER_QUERY = `
  query GetCustomer {
    customer {
      firstname
      lastname
      email
      addresses {
        id
        firstname
        lastname
        street
        city
        telephone
      }
    }
  }
`;

export async function fetchCustomer(token: string) {
  return magentoFetch<CustomerQueryResponse>({
    query: GET_CUSTOMER_QUERY,
  }, { token, revalidate: 0 }); // User profile should not be cached
}
