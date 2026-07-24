import { NextResponse } from "next/server";
import { getTrendingProductsCached } from "@/lib/magento/trendingProductsCache";

/** Matches MAGENTO_CATALOG_REVALIDATE_SECONDS default — segment config must be a literal. */
export const revalidate = 3600;

export async function GET() {
  try {
    const products = await getTrendingProductsCached();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
