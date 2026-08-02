import { NextResponse } from "next/server";
import { getStrapiBaseUrl } from "@/api/config";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";
import { getCustomerToken } from "@/services/auth/session";

/**
 * Browser → same-origin BFF → Strapi product-submissions/submit.
 * Forwards multipart as-is and attaches Magento customer Bearer when signed in
 * so CMS can link the submission to My Appointments.
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

  const customerToken = await getCustomerToken();
  const url = `${getStrapiBaseUrl()}/${STRAPI_ENDPOINTS.productSubmissionsSubmit}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(customerToken ? { Authorization: `Bearer ${customerToken}` } : {}),
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
