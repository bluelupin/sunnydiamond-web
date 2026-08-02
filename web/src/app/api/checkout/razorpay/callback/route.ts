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

export async function POST(request: NextRequest) {
  const orderNumber = request.nextUrl.searchParams.get("order")?.trim();
  const { paymentId, signature } = await readRazorpayCallbackFields(request);
  const origin = request.nextUrl.origin;

  if (!orderNumber || !paymentId || !signature) {
    return NextResponse.redirect(new URL("/checkout?payment=failed", origin));
  }

  try {
    await verifyRazorpayPayment({
      orderNumber,
      paymentId,
      signature,
    });
  } catch {
    return NextResponse.redirect(
      new URL(`/checkout?payment=failed&order=${encodeURIComponent(orderNumber)}`, origin),
    );
  }

  return NextResponse.redirect(
    new URL(
      `/checkout?payment=success&order=${encodeURIComponent(orderNumber)}`,
      origin,
    ),
  );
}
