import { NextResponse } from "next/server";
import { getStrapiBaseUrl } from "@/api/config";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";

/**
 * Browser → same-origin BFF → Strapi `POST /api/generic-submissions/submit`.
 *
 * Contact Us enquiry uses a flat JSON body (no `{ data }` wrapper):
 * formTag, fullName, phone, email, reasonForContact, message, consentAccepted, sourcePage.
 *
 * Book a Visit / other collection creates continue to use `/api/generic-submissions`.
 */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const url = `${getStrapiBaseUrl()}/${STRAPI_ENDPOINTS.genericSubmissionsSubmit}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
    const message =
      error instanceof Error ? error.message : "Generic submission submit proxy failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
