import { cache } from "react";
import { magentoGraphqlFetch } from "../graphqlClient";
import { MAGENTO_PRODUCT_BY_URL_KEY_QUERY } from "./productDetail.query";
import { mapMagentoProductDetailToProduct } from "./productDetail.mapper";
import { resolveMoreForYouProducts } from "./moreForYou.service";
import { fetchMagentoEngravingFontOptions } from "./engravingFonts.service";
import { isMagentoProductEngravingEnabled } from "./productEngraving.mapper";
import type {
  MagentoCustomAttributeItem,
  MagentoProductByUrlKeyResponse,
  MagentoProductDetailItem,
} from "./magentoProduct.types";
import type { MagentoEngravingFontOption } from "./engravingFonts.service";
import type { Product } from "@/features/products/data/products";
import type { MoreForYouCarouselItem } from "@/features/products/data/moreForYouContent";

export type MagentoProductDetailPageData = {
  product: Product;
  moreForYou: MoreForYouCarouselItem[];
};

type MagentoProductDetailCore = {
  item: MagentoProductDetailItem;
  product: Product;
};

function normalizeProductUrlKey(urlKey: string): string {
  return urlKey.trim();
}

async function resolveEngravingFontMetadata(
  items: MagentoCustomAttributeItem[] | null | undefined,
  signal?: AbortSignal,
): Promise<MagentoEngravingFontOption[]> {
  if (!isMagentoProductEngravingEnabled(items)) {
    return [];
  }

  return fetchMagentoEngravingFontOptions(signal);
}

async function loadMagentoProductDetailCore(
  urlKey: string,
  signal?: AbortSignal,
): Promise<MagentoProductDetailCore | null> {
  const normalizedUrlKey = normalizeProductUrlKey(urlKey);
  if (!normalizedUrlKey) {
    return null;
  }

  const data = await magentoGraphqlFetch<MagentoProductByUrlKeyResponse>({
    query: MAGENTO_PRODUCT_BY_URL_KEY_QUERY,
    variables: { urlKey: normalizedUrlKey },
    signal,
  });

  const item = data.products?.items?.[0];
  if (!item) {
    return null;
  }

  const engravingFontOptions = await resolveEngravingFontMetadata(
    item.custom_attributesV2?.items,
    signal,
  );
  const product = mapMagentoProductDetailToProduct(item, { engravingFontOptions });
  if (!product) {
    return null;
  }

  return { item, product };
}

/** Request-scoped dedupe for PDP metadata + page body (single Magento product query). */
const getMagentoProductDetailCore = cache((urlKey: string) =>
  loadMagentoProductDetailCore(urlKey),
);

export async function getMagentoProductByUrlKey(urlKey: string): Promise<Product | null> {
  const core = await getMagentoProductDetailCore(normalizeProductUrlKey(urlKey));
  return core?.product ?? null;
}

export async function fetchMagentoProductDetailPage(
  urlKey: string,
  signal?: AbortSignal,
): Promise<MagentoProductDetailPageData | null> {
  const normalizedUrlKey = normalizeProductUrlKey(urlKey);
  if (!normalizedUrlKey) {
    return null;
  }

  const core = signal
    ? await loadMagentoProductDetailCore(normalizedUrlKey, signal)
    : await getMagentoProductDetailCore(normalizedUrlKey);

  if (!core) {
    return null;
  }

  const moreForYou = await resolveMoreForYouProducts(core.item, signal);

  return { product: core.product, moreForYou };
}

/** Client-side refresh (e.g. wishlist panel) — bypasses request cache when a signal is passed. */
export async function fetchMagentoProductByUrlKey(
  urlKey: string,
  signal?: AbortSignal,
): Promise<Product | null> {
  const normalizedUrlKey = normalizeProductUrlKey(urlKey);
  if (!normalizedUrlKey) {
    return null;
  }

  if (signal) {
    const core = await loadMagentoProductDetailCore(normalizedUrlKey, signal);
    return core?.product ?? null;
  }

  return getMagentoProductByUrlKey(normalizedUrlKey);
}
