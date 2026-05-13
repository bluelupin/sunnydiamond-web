/**
 * Base API Client for Magento Headless Integration
 * 
 * This service handles authentication and basic request logic.
 */

const MAGENTO_API_URL = process.env.NEXT_PUBLIC_MAGENTO_URL || 'https://magento.example.com/graphql';

export interface GraphQLRequest {
  query: string;
  variables?: Record<string, any>;
}

export async function magentoFetch<T>(request: GraphQLRequest): Promise<T> {
  const response = await fetch(MAGENTO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add Authorization headers here if needed
      // 'Authorization': `Bearer ${process.env.MAGENTO_TOKEN}`,
    },
    body: JSON.stringify(request),
    next: {
      // Configure Next.js caching here
      revalidate: 3600, // 1 hour by default
    },
  });

  if (!response.ok) {
    throw new Error(`Magento API error: ${response.statusText}`);
  }

  const json = await response.json();

  if (json.errors) {
    console.error('GraphQL Errors:', json.errors);
    throw new Error(json.errors[0]?.message || 'GraphQL error');
  }

  return json.data as T;
}
