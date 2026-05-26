import { getApiErrorMessage } from "@/shared/utils/errorHandler";
import { buildQueryString } from "./queryBuilder";

const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  (() => {
    throw new Error("Missing NEXT_PUBLIC_API_URL or NEXT_PUBLIC_STRAPI_URL");
  })();

const API_DEBUG = process.env.NEXT_PUBLIC_API_DEBUG === "true";

export type ApiFetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  authToken?: string;
  params?: Record<string, unknown>;
};

export class ApiError extends Error {
  public status?: number;
  public details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function buildHeaders(options: ApiFetchOptions): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...options.headers,
  };

  if (options.body != null && !(options.body instanceof FormData) && options.method !== "GET") {
    headers["Content-Type"] = "application/json";
  }

  if (options.authToken) {
    headers.Authorization = `Bearer ${options.authToken}`;
  }

  return headers;
}

async function parseJsonSafe(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

function normalizeResponse<T>(json: unknown): T {
  if (json && typeof json === "object" && "data" in json) {
    const data = (json as Record<string, unknown>).data;

    if (Array.isArray(data)) {
      return data as T;
    }

    if (data && typeof data === "object" && "attributes" in data) {
      return ((data as Record<string, unknown>).attributes as unknown) as T;
    }

    return data as T;
  }

  return json as T;
}

export async function apiFetch<T = unknown>(endpoint: string, options: ApiFetchOptions = {}): Promise<T> {
  const path = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const url = new URL(`${API_BASE_URL}/${path}`);

  if (options.params) {
    const queryString = buildQueryString(options.params);
    if (queryString) {
      url.search = queryString;
    }
  }

  if (API_DEBUG) {
    console.groupCollapsed("API Request", url.toString());
    console.log("method:", options.method ?? "GET");
    console.log("headers:", buildHeaders(options));
    console.log("body:", options.body);
    console.groupEnd();
  }

  const response = await fetch(url.toString(), {
    method: options.method ?? "GET",
    headers: buildHeaders(options),
    body:
      options.body != null && !(options.body instanceof FormData) && options.method !== "GET"
        ? JSON.stringify(options.body)
        : (options.body as BodyInit | undefined),
    signal: options.signal,
  });

  if (API_DEBUG) {
    console.groupCollapsed("API Response", url.toString());
    console.log("status:", response.status);
    console.log("statusText:", response.statusText);
    console.log("headers:", Object.fromEntries(response.headers.entries()));
    console.groupEnd();
  }

  if (!response.ok) {
    const errorBody = await parseJsonSafe(response);
    const message = getApiErrorMessage(errorBody) || `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, errorBody);
  }

  const json = await parseJsonSafe(response);

  if (API_DEBUG) {
    console.groupCollapsed("API Response Payload", url.toString());
    console.log(json);
    console.groupEnd();
  }

  return normalizeResponse<T>(json);
}
