import type { CartLineItem } from "@/features/cart/types/cart.types";
import {
  getMagentoIntegrationAccessToken,
  getMagentoRestBaseUrl,
  MAGENTO_DEFAULT_STORE_CODE,
} from "@/services/magento/config";

type MagentoOrderSearchResponse = {
  items?: Array<{
    entity_id?: number;
    increment_id?: string;
    status?: string;
  }>;
};

type MagentoOrderStatusHistory = {
  comment?: string | null;
};

type MagentoOrderDetailResponse = {
  status_histories?: MagentoOrderStatusHistory[] | null;
};

const STOREFRONT_LINE_METADATA_MARKER = "Storefront line options:";

function formatLineMetadataComment(items: CartLineItem[]): string {
  const lines = items.map((item) => {
    const parts: string[] = [];
    const { options } = item;

    if (options.engraving?.trim() && options.engravingSupported) {
      parts.push(`Engraving: ${options.engraving.trim()}`);
    }
    if (options.engravingFont?.trim() && options.engravingSupported) {
      parts.push(`Font: ${options.engravingFont.trim()}`);
    }
    if (options.ringSize?.trim()) {
      parts.push(`Ring size: ${options.ringSize.trim()}`);
    }
    if (options.metal?.trim()) {
      parts.push(`Metal: ${options.metal.trim()}`);
    }
    if (options.isGift || item.gifting) {
      parts.push("Gift wrap: Yes");
    }
    if (item.gifting?.note?.trim()) {
      parts.push(`Gift note: "${item.gifting.note.trim()}"`);
    }

    const details = parts.length > 0 ? parts.join(", ") : "No personalization selected";
    return `- ${item.product.name} (${item.product.id}): ${details}`;
  });

  const giftedItems = items.filter((item) => item.gifting || item.options.isGift);
  const giftingSummary =
    giftedItems.length === 0
      ? []
      : giftedItems.some((item) => item.gifting?.wrapMode === "separate")
        ? ["Gifting: SEPARATE PACKAGES — one per gift item, note per item."]
        : ["Gifting: ONE PACKAGE — all gift items together, single shared note."];

  return ["Storefront line options:", ...giftingSummary, ...lines].join("\n");
}

async function findMagentoOrderEntityId(orderNumber: string): Promise<{
  entityId: number;
  status: string;
} | null> {
  const token = getMagentoIntegrationAccessToken();
  if (!token) {
    return null;
  }

  const searchParams = new URLSearchParams({
    "searchCriteria[filter_groups][0][filters][0][field]": "increment_id",
    "searchCriteria[filter_groups][0][filters][0][value]": orderNumber,
    "searchCriteria[filter_groups][0][filters][0][condition_type]": "eq",
  });

  const response = await fetch(
    `${getMagentoRestBaseUrl()}/rest/V1/orders?${searchParams.toString()}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        Store: MAGENTO_DEFAULT_STORE_CODE,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Magento order lookup failed (${response.status})`);
  }

  const json = (await response.json()) as MagentoOrderSearchResponse;
  const order = json.items?.[0];
  const entityId = order?.entity_id;
  const status = order?.status?.trim();

  if (!entityId || !status) {
    return null;
  }

  return { entityId, status };
}

export async function attachLineMetadataToMagentoOrder(
  orderNumber: string,
  items: CartLineItem[],
): Promise<boolean> {
  const token = getMagentoIntegrationAccessToken();
  if (!token || items.length === 0) {
    return false;
  }

  const order = await findMagentoOrderEntityId(orderNumber);
  if (!order) {
    return false;
  }

  const response = await fetch(
    `${getMagentoRestBaseUrl()}/rest/V1/orders/${order.entityId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        Store: MAGENTO_DEFAULT_STORE_CODE,
      },
      body: JSON.stringify({
        statusHistory: {
          comment: formatLineMetadataComment(items),
          is_customer_notified: 0,
          is_visible_on_front: 1,
          parent_id: order.entityId,
          status: order.status,
        },
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Magento order comment failed (${response.status})`);
  }

  return true;
}

function isStorefrontLineMetadataComment(comment: string): boolean {
  return (
    comment.includes(STOREFRONT_LINE_METADATA_MARKER) || comment.includes("Gift wrap: Yes")
  );
}

export async function fetchStorefrontLineMetadataComments(
  orderNumber: string,
): Promise<string[]> {
  const token = getMagentoIntegrationAccessToken();
  if (!token) {
    return [];
  }

  try {
    const order = await findMagentoOrderEntityId(orderNumber);
    if (!order) {
      return [];
    }

    const response = await fetch(
      `${getMagentoRestBaseUrl()}/rest/V1/orders/${order.entityId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          Store: MAGENTO_DEFAULT_STORE_CODE,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return [];
    }

    const json = (await response.json()) as MagentoOrderDetailResponse;

    return (json.status_histories ?? [])
      .map((entry) => entry.comment?.trim() ?? "")
      .filter(isStorefrontLineMetadataComment);
  } catch {
    return [];
  }
}
