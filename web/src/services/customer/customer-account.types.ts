export type CustomerOrderItemOption = {
  label: string;
  value: string;
};

export type CustomerOrderItem = {
  productName: string;
  quantity: number;
  productUrlKey: string | null;
  productSku: string | null;
  imageUrl: string | null;
  selectedOptions: CustomerOrderItemOption[];
  enteredOptions: CustomerOrderItemOption[];
};

export type CustomerOrder = {
  id: string;
  number: string;
  orderDate: string;
  status: string;
  items: CustomerOrderItem[];
  grandTotal: number;
  currency: string;
};

export type CustomerOrdersPage = {
  orders: CustomerOrder[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
};

export type CustomerAddress = {
  uid: string;
  fullName: string;
  streetLines: string[];
  city: string;
  state: string;
  pincode: string;
  countryCode: string;
  phone: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
};

export type CustomerAddressInput = {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  pincode: string;
  city: string;
  state: string;
  phone: string;
  defaultShipping?: boolean;
  defaultBilling?: boolean;
};
