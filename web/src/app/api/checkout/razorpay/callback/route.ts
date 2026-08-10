import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayPayment } from "@/features/checkout/services/razorpayCheckout";

async function readRazorpayCallbackFields(request: NextRequest): Promise<{
  paymentId: string;
  signature: string;
}> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
    const formData = await request.formData();
    return {
      paymentId: String(formData.get("razorpay_payment_id") ?? "").trim(),
      signature: String(formData.get("razorpay_signature") ?? "").trim(),
    };
  }

  const bodyText = await request.text();
  const params = new URLSearchParams(bodyText);

  return {
    paymentId: (params.get("razorpay_payment_id") ?? "").trim(),
    signature: (params.get("razorpay_signature") ?? "").trim(),
  };
}

/** Prefer the host that received the Razorpay POST (local/prod stay aligned). */
function resolveCallbackOrigin(request: NextRequest): string {
  return request.nextUrl.origin;
}

/** 303 so browsers follow with GET — Razorpay callbacks are POST. */
function redirectToCheckout(
  origin: string,
  pathWithQuery: string,
): NextResponse {
  return NextResponse.redirect(new URL(pathWithQuery, origin), 303);
}

export async function POST(request: NextRequest) {
  const origin = resolveCallbackOrigin(request);
  const orderNumber = request.nextUrl.searchParams.get("order")?.trim();

  try {
    const { paymentId, signature } = await readRazorpayCallbackFields(request);

    if (!orderNumber || !paymentId || !signature) {
      return redirectToCheckout(origin, "/checkout?payment=failed");
    }

    try {
      await verifyRazorpayPayment({
        orderNumber,
        paymentId,
        signature,
      });
    } catch {
      return redirectToCheckout(
        origin,
        `/checkout?payment=failed&order=${encodeURIComponent(orderNumber)}`,
      );
    }

    return redirectToCheckout(
      origin,
      `/checkout?payment=success&order=${encodeURIComponent(orderNumber)}`,
    );
  } catch {
    const failedPath = orderNumber
      ? `/checkout?payment=failed&order=${encodeURIComponent(orderNumber)}`
      : "/checkout?payment=failed";
    return redirectToCheckout(origin, failedPath);
  }
}

/**
 * Some Razorpay / browser paths land on the callback with GET.
 * Keep the pending order in the query and send the shopper back to checkout.
 */
export async function GET(request: NextRequest) {
  const origin = resolveCallbackOrigin(request);
  const orderNumber = request.nextUrl.searchParams.get("order")?.trim();
  const paymentId = request.nextUrl.searchParams.get("razorpay_payment_id")?.trim();
  const signature = request.nextUrl.searchParams.get("razorpay_signature")?.trim();

  if (orderNumber && paymentId && signature) {
    try {
      await verifyRazorpayPayment({ orderNumber, paymentId, signature });
      return redirectToCheckout(
        origin,
        `/checkout?payment=success&order=${encodeURIComponent(orderNumber)}`,
      );
    } catch {
      return redirectToCheckout(
        origin,
        `/checkout?payment=failed&order=${encodeURIComponent(orderNumber)}`,
      );
    }
  }

  const failedPath = orderNumber
    ? `/checkout?payment=failed&order=${encodeURIComponent(orderNumber)}`
    : "/checkout?payment=failed";
  return redirectToCheckout(origin, failedPath);
}
