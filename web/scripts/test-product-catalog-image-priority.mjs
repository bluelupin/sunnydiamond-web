import assert from "node:assert/strict";
import {
  isValidProductCatalogImage,
  resolveProductCatalogImagePriority,
  resolveProductCatalogImagePriorityPreserving,
  PRODUCT_IMAGE_PLACEHOLDER_SRC,
} from "../src/features/products/utils/productImagePlaceholder.ts";

const VALID = "https://cdn.example.com/catalog/f/_/f_ring.jpg";
const PARENT = "https://cdn.example.com/catalog/parent.jpg";
const MAGENTO_PLACEHOLDER = "https://magento.example.com/static/placeholder/default/image.jpg";

assert.equal(
  resolveProductCatalogImagePriority(VALID, PARENT),
  VALID,
  "prefers variant when valid",
);
assert.equal(
  resolveProductCatalogImagePriority("", PARENT),
  PARENT,
  "falls back to parent when variant empty",
);
assert.equal(
  resolveProductCatalogImagePriority(undefined, PARENT),
  PARENT,
  "falls back to parent when variant missing",
);
assert.equal(
  resolveProductCatalogImagePriority(MAGENTO_PLACEHOLDER, PARENT),
  PARENT,
  "skips Magento placeholder variant",
);
assert.equal(
  resolveProductCatalogImagePriority(undefined, undefined),
  PRODUCT_IMAGE_PLACEHOLDER_SRC,
  "uses public placeholder last",
);
assert.equal(
  resolveProductCatalogImagePriorityPreserving(VALID, PARENT),
  VALID,
  "preserving helper keeps valid variant",
);
assert.equal(
  isValidProductCatalogImage(PRODUCT_IMAGE_PLACEHOLDER_SRC),
  false,
  "public placeholder is not valid API imagery",
);
assert.equal(
  resolveProductCatalogImagePriority(PRODUCT_IMAGE_PLACEHOLDER_SRC, PARENT),
  PARENT,
  "skips public placeholder in priority chain",
);

console.log("test-product-catalog-image-priority: ok");
