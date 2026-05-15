/**
 * Base API Client for Magento Headless Integration
 *
 * This service handles authentication and basic request logic.
 */

const MAGENTO_API_URL = process.env.NEXT_PUBLIC_MAGENTO_URL || "https://magento.example.com/graphql";

export interface GraphQLRequest {
  query: string;
  variables?: Record<string, unknown>;
}

export async function magentoFetch<T>(request: GraphQLRequest): Promise<T> {
  const response = await fetch(MAGENTO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    next: {
      revalidate: 3600, // 1 hour by default
    },
  });

  if (!response.ok) {
    throw new Error(`Magento API error: ${response.statusText}`);
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0]?.message || "GraphQL error");
  }

  return json.data as T;
}
