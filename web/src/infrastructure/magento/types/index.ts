/**
 * Type definitions for Magento GraphQL API responses
 */

export interface MagentoMoney {
  value: number;
  currency: string;
}

export interface MagentoImage {
  url: string;
  label?: string;
}

export interface MagentoProductPriceRange {
  minimum_price: {
    regular_price: MagentoMoney;
    final_price: MagentoMoney;
    discount?: {
      amount_off: number;
      percent_off: number;
    };
  };
}

export interface MagentoProduct {
  uid: string;
  id: number;
  sku: string;
  name: string;
  description?: {
    html: string;
  };
  short_description?: {
    html: string;
  };
  image?: MagentoImage;
  media_gallery?: MagentoImage[];
  price_range: MagentoProductPriceRange;
  stock_status: "IN_STOCK" | "OUT_OF_STOCK";
  categories?: Array<{
    uid: string;
    name: string;
  }>;
  // Custom attributes
  carat?: string;
  metal?: string;
  rating_summary?: number;
  reviews_count?: number;
}

export interface MagentoCartItem {
  uid: string;
  id: string;
  quantity: number;
  product: MagentoProduct;
  prices?: {
    price: MagentoMoney;
    row_total: MagentoMoney;
  };
}

export interface MagentoCart {
  id: string;
  items: MagentoCartItem[];
  prices?: {
    grand_total: MagentoMoney;
  };
}

export interface MagentoCustomer {
  firstname: string;
  lastname: string;
  email: string;
  addresses?: Array<{
    id: number;
    firstname: string;
    lastname: string;
    street: string[];
    city: string;
    telephone: string;
  }>;
}

export interface ProductsQueryResponse {
  products: {
    total_count: number;
    items: MagentoProduct[];
  };
}

export interface ProductDetailQueryResponse {
  products: {
    items: MagentoProduct[];
  };
}

export interface CartQueryResponse {
  cart: MagentoCart;
}

export interface CustomerQueryResponse {
  customer: MagentoCustomer;
}
