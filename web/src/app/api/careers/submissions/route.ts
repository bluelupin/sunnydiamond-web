import { NextResponse } from "next/server";
import { getStrapiBaseUrl } from "@/api/config";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";

function readStrapiErrorMessage(payload: unknown, fallback: string): string {
  if (
    payload &&
    typeof payload === "object" &&
    "error" in payload &&
    typeof (payload as { error?: unknown }).error === "object" &&
    (payload as { error?: { message?: unknown } }).error?.message
  ) {
    return String((payload as { error: { message: string } }).error.message);
  }

  return fallback;
}

/**
 * Browser → same-origin BFF → Strapi `POST /api/submissions-job-openings/submit`.
 * Forwards multipart as-is (`data` JSON string + optional `resume` file).
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

  const url = `${getStrapiBaseUrl()}/${STRAPI_ENDPOINTS.jobOpeningSubmissionsSubmit}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json")
      ? await response.json().catch(() => null)
      : await response.text().catch(() => null);

    if (!response.ok) {
      const message = readStrapiErrorMessage(
        payload,
        `Career submission failed (${response.status})`,
      );

      return NextResponse.json(
        { error: message, details: payload },
        { status: response.status >= 400 && response.status < 600 ? response.status : 502 },
      );
    }

    return NextResponse.json(payload ?? { ok: true }, { status: response.status || 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Career submission proxy failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
