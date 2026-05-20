/**
 * Strapi headless CMS client wrapper
 */

const STRAPI_API_URL: string =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? (() => {
    throw new Error("NEXT_PUBLIC_STRAPI_URL is not set");
  })();

export async function strapiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${STRAPI_API_URL}/${endpoint.startsWith("/") ? endpoint.substring(1) : endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi API error: ${response.statusText}`);
  }

  const json = await response.json();
  return json.data as T;
}
