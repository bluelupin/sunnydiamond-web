export type MagentoProductCategory = {
  id?: number | null;
  name?: string | null;
  url_key?: string | null;
};

export type MagentoMediaGalleryItem = {
  url?: string | null;
  label?: string | null;
  position?: number | null;
  disabled?: boolean | null;
};

export type MagentoCustomAttributeItem = {
  code?: string | null;
  value?: string | null;
  selected_options?: Array<{
    label?: string | null;
    value?: string | null;
  }> | null;
};

export type MagentoProductDetailItem = MagentoProductListItem & {
  stock_status?: string | null;
  description?: { html?: string | null } | null;
  short_description?: { html?: string | null } | null;
  price_range?: {
    minimum_price?: {
      regular_price?: {
        value?: number | null;
        currency?: string | null;
      } | null;
      final_price?: {
        value?: number | null;
        currency?: string | null;
      } | null;
    } | null;
  } | null;
  image?: { url?: string | null } | null;
  custom_attributesV2?: {
    items?: MagentoCustomAttributeItem[] | null;
  } | null;
};

export type MagentoProductByUrlKeyResponse = {
  products: {
    items?: MagentoProductDetailItem[] | null;
  } | null;
};

export type MagentoProductListItem = {
  uid?: string | null;
  sku?: string | null;
  name?: string | null;
  url_key?: string | null;
  price_range?: {
    minimum_price?: {
      final_price?: {
        value?: number | null;
        currency?: string | null;
      } | null;
    } | null;
  } | null;
  media_gallery?: MagentoMediaGalleryItem[] | null;
  categories?: MagentoProductCategory[] | null;
  custom_attributesV2?: {
    items?: MagentoCustomAttributeItem[] | null;
  } | null;
};

export type MagentoAggregationOption = {
  label?: string | null;
  value?: string | null;
  count?: number | null;
};

export type MagentoAggregation = {
  attribute_code?: string | null;
  label?: string | null;
  count?: number | null;
  options?: MagentoAggregationOption[] | null;
};

export type MagentoProductsResponse = {
  products: {
    total_count?: number | null;
    page_info?: {
      current_page?: number | null;
      page_size?: number | null;
      total_pages?: number | null;
    } | null;
    aggregations?: MagentoAggregation[] | null;
    items?: MagentoProductListItem[] | null;
  } | null;
};

export type MagentoProductSortInput = {
  position?: "ASC" | "DESC";
  price?: "ASC" | "DESC";
  name?: "ASC" | "DESC";
};
