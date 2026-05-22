import { magentoFetch } from "../client";

export const GENERATE_CUSTOMER_TOKEN_MUTATION = `
  mutation GenerateToken($email: String!, $password: String!) {
    generateCustomerToken(email: $email, password: $password) {
      token
    }
  }
`;

export const CREATE_CUSTOMER_MUTATION = `
  mutation CreateCustomer($input: CustomerInput!) {
    createCustomer(input: $input) {
      customer {
        email
        firstname
        lastname
      }
    }
  }
`;

export async function generateCustomerToken(email: string, password: string): Promise<string> {
  const data = await magentoFetch<{ generateCustomerToken: { token: string } }>({
    query: GENERATE_CUSTOMER_TOKEN_MUTATION,
    variables: { email, password },
  }, { revalidate: 0 });
  return data.generateCustomerToken.token;
}
