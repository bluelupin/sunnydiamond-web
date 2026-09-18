import { NextResponse } from "next/server";
import { getStrapiApiToken, getStrapiBaseUrl } from "@/api/config";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { getSessionMagentoCustomerId } from "@/services/auth/getSessionMagentoCustomerId";

const AUTH_REQUIRED_FORM_TAGS = new Set([
  "try-at-home",
  "try-at-home-form",
  "schedule-video-call",
  "product-video-call",
]);

function requiresAuthenticatedCustomer(formTag: unknown): boolean {
  if (typeof formTag !== "string") return false;
  return AUTH_REQUIRED_FORM_TAGS.has(formTag.trim().toLowerCase());
}

/**
 * Browser → same-origin BFF → Strapi product-submissions/submit.
 * Authorization: CMS API token (server-only).
 * magentoCustomerId is injected from the Magento session when present,
 * and required for Try at Home / Video Call.
 */
export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart body" }, { status: 400 });
  }

  const dataField = formData.get("data");
  if (typeof dataField !== "string" || !dataField.trim()) {
    return NextResponse.json({ error: "Missing data field" }, { status: 400 });
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(dataField) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid data JSON" }, { status: 400 });
  }

  const magentoCustomerId = await getSessionMagentoCustomerId(request);
  const needsAuth = requiresAuthenticatedCustomer(parsed.formTag);

  if (needsAuth && magentoCustomerId == null) {
    return NextResponse.json(
      { error: "Unauthorized", reason: "no_session" },
      { status: 401 },
    );
  }

  // Never trust client-supplied customer id.
  delete parsed.magentoCustomerId;
  if (magentoCustomerId != null) {
    parsed.magentoCustomerId = magentoCustomerId;
  }

  formData.set("data", JSON.stringify(parsed));

  const url = `${getStrapiBaseUrl()}/${STRAPI_ENDPOINTS.productSubmissionsSubmit}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${getStrapiApiToken()}`,
      },
      body: formData,
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
          : `Product submission failed (${response.status})`;

      return NextResponse.json(
        { error: message, details: payload },
        { status: response.status >= 400 && response.status < 600 ? response.status : 502 },
      );
    }

    return NextResponse.json(payload ?? { ok: true }, { status: response.status || 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Product submission proxy failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
