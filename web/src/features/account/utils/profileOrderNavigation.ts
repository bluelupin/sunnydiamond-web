export const PROFILE_ORDER_QUERY_PARAM = "order";

export function buildProfileOrderDetailHref(orderNumber: string): string {
  const params = new URLSearchParams({
    section: "orders",
    [PROFILE_ORDER_QUERY_PARAM]: orderNumber.trim(),
  });

  return `/profile?${params.toString()}`;
}
