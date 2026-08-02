import type { MagentoProductCustomOption } from "./productCustomOptions.mapper";

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
  image?: { url?: string | null } | null;
  media_gallery?: MagentoMediaGalleryItem[] | null;
  categories?: MagentoProductCategory[] | null;
  /** Top-level SimpleProduct field — model/lifestyle shot for PLP hover. */
  model_wear_image?: string | null;
  special_price?: number | null;
  custom_attributesV2?: {
    items?: MagentoCustomAttributeItem[] | null;
  } | null;
};

export type MagentoConfigurableOptionValue = {
  uid?: string | null;
  label?: string | null;
  swatch_data?: {
    value?: string | null;
    thumbnail?: string | null;
  } | null;
};

export type MagentoConfigurableOption = {
  attribute_code?: string | null;
  uid?: string | null;
  label?: string | null;
  values?: MagentoConfigurableOptionValue[] | null;
};

export type MagentoConfigurableVariantAttribute = {
  code?: string | null;
  uid?: string | null;
  label?: string | null;
  value_index?: number | null;
};

export type MagentoProductPriceRange = {
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
};

export type MagentoConfigurableVariantProduct = {
  sku?: string | null;
  stock_status?: string | null;
  special_price?: number | null;
  price_range?: MagentoProductPriceRange | null;
  image?: { url?: string | null } | null;
  media_gallery?: MagentoMediaGalleryItem[] | null;
};

export type MagentoConfigurableVariant = {
  attributes?: MagentoConfigurableVariantAttribute[] | null;
  product?: MagentoConfigurableVariantProduct | null;
};

export type MagentoProductDetailItem = MagentoProductListItem & {
  stock_status?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keyword?: string | null;
  canonical_url?: string | null;
  description?: { html?: string | null } | null;
  short_description?: { html?: string | null } | null;
  price_range?: MagentoProductPriceRange | null;
  image?: { url?: string | null } | null;
  custom_attributesV2?: {
    items?: MagentoCustomAttributeItem[] | null;
  } | null;
  related_products?: MagentoProductListItem[] | null;
  options?: MagentoProductCustomOption[] | null;
  configurable_options?: MagentoConfigurableOption[] | null;
  variants?: MagentoConfigurableVariant[] | null;
};

export type MagentoProductByUrlKeyResponse = {
  products: {
    items?: MagentoProductDetailItem[] | null;
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
