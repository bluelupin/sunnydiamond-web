import { NextResponse } from "next/server";
import { getStrapiBaseUrl } from "@/api/config";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";

/**
 * Browser → same-origin BFF → Strapi `POST /api/generic-submissions`.
 *
 * Thin collection proxy for generic forms (contact, store-locator Book a Visit).
 * - Do not attach Magento Bearer — collection create rejects Magento JWT (401).
 * - Strip `magentoCustomerId` — not a collection attribute (400 Invalid key).
 *
 * PDP Visit Us → My Appointments uses `product-store-visit` via
 * `/api/product-submissions/submit` (not this route).
 * Try at Home / Video Call also use product-submissions (not this route).
 */

function stripMagentoCustomerId(body: unknown): unknown {
  if (!body || typeof body !== "object") {
    return body;
  }

  const record = body as Record<string, unknown>;
  const data = record.data;

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const nextData = { ...(data as Record<string, unknown>) };
    delete nextData.magentoCustomerId;
    return { ...record, data: nextData };
  }

  const next = { ...record };
  delete next.magentoCustomerId;
  return next;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const url = `${getStrapiBaseUrl()}/${STRAPI_ENDPOINTS.genericSubmissions}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stripMagentoCustomerId(body)),
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json")
      ? await response.json().catch(() => null)
      : await response.text().catch(() => null);

    if (!response.ok) {
      const message =
        payload &&
        typeof payload === "object" &&
        payload !== null &&
        "error" in payload &&
        typeof (payload as { error?: unknown }).error === "object" &&
        (payload as { error?: { message?: unknown } }).error?.message
          ? String((payload as { error: { message: string } }).error.message)
          : `Generic submission failed (${response.status})`;

      return NextResponse.json(
        { error: message, details: payload },
        { status: response.status >= 400 && response.status < 600 ? response.status : 502 },
      );
    }

    return NextResponse.json(payload ?? { ok: true }, { status: response.status || 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generic submission proxy failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
