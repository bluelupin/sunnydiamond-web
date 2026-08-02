export type MagentoCategoryNode = {
  id?: number | null;
  uid?: string | null;
  name?: string | null;
  url_path?: string | null;
  url_key?: string | null;
  level?: number | null;
  product_count?: number | null;
  image?: string | null;
  children?: MagentoCategoryNode[] | null;
};

export type MagentoCategoryListResponse = {
  categoryList: MagentoCategoryNode[] | null;
};
