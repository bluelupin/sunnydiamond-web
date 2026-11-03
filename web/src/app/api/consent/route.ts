import { NextResponse } from "next/server";
import { getStrapiApiToken, getStrapiBaseUrl } from "@/api/config";
import { getCustomerToken } from "@/services/auth/session";
import { magentoGraphqlFetch } from "@/services/magento/graphqlClient";
import { decodeMagentoEntityId } from "@/services/magento/decodeMagentoEntityId";
import { cmsForwardedIpHeaders } from "@/services/http/clientIp";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const NOTICE_VERSION = "2026-11-02";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const input: unknown = await request.json().catch(() => null);
  if (!input || typeof input !== "object") return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  const choice = input as Record<string, unknown>;
  if (typeof choice.requestId !== "string" || !uuid.test(choice.requestId) ||
    typeof choice.browserId !== "string" || !uuid.test(choice.browserId) ||
    choice.noticeVersion !== NOTICE_VERSION || typeof choice.analytics !== "boolean" || typeof choice.marketing !== "boolean") {
    return NextResponse.json({ error: "Invalid consent choice" }, { status: 400 });
  }
  try {
    let magentoCustomerId: number | undefined;
    const token = await getCustomerToken();
    if (token) {
      try {
        const result = await magentoGraphqlFetch<{ customer: { id: number | string } }>({
          query: "query ConsentCustomerIdentity { customer { id } }", authToken: token,
        });
        magentoCustomerId = decodeMagentoEntityId(result.customer.id) ?? undefined;
      } catch { /* Audit remains anonymous if Magento cannot verify the session. */ }
    }
    if (choice.linkCustomer === true && !magentoCustomerId) {
      return NextResponse.json({ error: "Customer verification unavailable" }, { status: 503 });
    }
    if (choice.linkCustomer === true && choice.expectedCustomerId !== magentoCustomerId) {
      return NextResponse.json({ error: "Customer session changed" }, { status: 409 });
    }
    const response = await fetch(`${getStrapiBaseUrl()}/api/cookie-consents/record`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getStrapiApiToken()}`, ...cmsForwardedIpHeaders(request) },
      body: JSON.stringify({ requestId: choice.requestId, browserId: choice.browserId,
        noticeVersion: choice.noticeVersion, analytics: choice.analytics, marketing: choice.marketing,
        ...(magentoCustomerId ? { magentoCustomerId } : {}) }),
      cache: "no-store",
    });
    if (!response.ok) return NextResponse.json({ error: "Consent audit unavailable" }, { status: 502 });
    return NextResponse.json({ ok: true, requestId: choice.requestId, customerLinked: Boolean(magentoCustomerId) });
  } catch {
    return NextResponse.json({ error: "Consent audit unavailable" }, { status: 502 });
  }
}
