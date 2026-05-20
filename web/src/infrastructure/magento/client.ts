/**
 * Magento Headless GraphQL API Client
 */

const MAGENTO_API_URL: string =
  process.env.NEXT_PUBLIC_MAGENTO_URL ?? (() => {
    throw new Error("NEXT_PUBLIC_MAGENTO_URL is not set");
  })();

export interface GraphQLRequest {
  query: string;
  variables?: Record<string, unknown>;
}

export interface MagentoClientOptions {
  token?: string;
  storeCode?: string;
  currency?: string;
  revalidate?: number; // Cache revalidation in seconds
  tags?: string[];     // Cache tags for revalidation
}

export class MagentoError extends Error {
  constructor(public errors: Array<{ message: string; code?: string }>) {
    super(errors[0]?.message || "Magento API Error");
    this.name = "MagentoError";
  }
}

/**
 * Standard fetch wrapper for Magento GraphQL API.
 * Handles customer sessions, headers, and Next.js caching.
 */
export async function magentoFetch<T>(
  request: GraphQLRequest,
  options: MagentoClientOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  if (options.storeCode) {
    headers["Store"] = options.storeCode;
  }

  if (options.currency) {
    headers["Content-Currency"] = options.currency;
  }

  const fetchOptions: RequestInit = {
    method: "POST",
    headers,
    body: JSON.stringify(request),
    next: {
      revalidate: options.revalidate !== undefined ? options.revalidate : 3600, // Default 1 hour
      tags: options.tags || [],
    },
  };

  try {
    const response = await fetch(MAGENTO_API_URL, fetchOptions);

    if (!response.ok) {
      throw new Error(`Magento HTTP error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    if (json.errors && json.errors.length > 0) {
      throw new MagentoError(json.errors);
    }

    return json.data as T;
  } catch (error) {
    console.error("Magento Fetch Failure:", error);
    throw error;
  }
}
