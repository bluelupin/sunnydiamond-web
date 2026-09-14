import { NextResponse } from "next/server";
import { getStrapiBaseUrl } from "@/api/config";
import { STRAPI_ENDPOINTS } from "@/api/endpoints";

const GENERIC_FORM_POPULATE_QUERY =
  "populate[availableTimeSlots]=true" +
  "&populate[dynamicFields][populate]=*" +
  "&populate[showrooms][populate][image][populate]=*";

/**
 * Browser → same-origin BFF → Strapi generic-forms by formTag.
 * Keeps Strapi URL server-side for client-side form config refresh.
 */
export async function GET(request: Request) {
  const formTag = new URL(request.url).searchParams.get("formTag")?.trim();

  if (!formTag) {
    return NextResponse.json({ error: "formTag query parameter is required" }, { status: 400 });
  }

  const query =
    `${GENERIC_FORM_POPULATE_QUERY}` +
    `&filters[formTag][$eq]=${encodeURIComponent(formTag)}`;

  const url = `${getStrapiBaseUrl()}/${STRAPI_ENDPOINTS.genericForms}?${query}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
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
        typeof (payload as { error?: { message?: unknown } }).error === "object" &&
        (payload as { error?: { message?: string } }).error?.message
          ? String((payload as { error: { message: string } }).error.message)
          : `Failed to load generic form (${response.status})`;

      return NextResponse.json({ error: message }, { status: response.status });
    }

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generic form proxy failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
