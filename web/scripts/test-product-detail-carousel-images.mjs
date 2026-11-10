import assert from "node:assert/strict";
import {
  getProductDetailCarouselImages,
  getProductDetailGallerySlots,
  getProductDetailLifestyleImages,
} from "../src/features/products/components/detail/productDetailCarouselImages.ts";

const baseProduct = {
  id: "TEST-SKU",
  name: "Test Ring",
  image: "https://cdn.example.com/primary.jpg",
  images: [],
  carat: "1 ct",
  metal: "Gold",
  inStock: true,
  price: 1000,
  urlKey: "test-ring",
};

const img = (n) => `https://cdn.example.com/view-${n}.jpg`;

const productWithGallery = {
  ...baseProduct,
  images: [img(1), img(2), img(3), img(4), img(5), img(6)],
};

const slots = getProductDetailGallerySlots(productWithGallery);
const lifestyle = getProductDetailLifestyleImages(productWithGallery);
const carousel = getProductDetailCarouselImages(productWithGallery);

const desktopSequence = [slots.heroImage, slots.thumbOne, slots.thumbTwo, ...lifestyle];

assert.deepEqual(
  carousel.map(String),
  desktopSequence.map(String),
  "carousel matches desktop gallery sequence",
);

assert.equal(carousel.length, 6, "carousel includes all gallery images beyond the old 5-slide cap");

const carouselKeys = carousel.map(String);
assert.ok(carouselKeys.includes(img(6)), "sixth gallery image appears in carousel");

console.log("test-product-detail-carousel-images.mjs: ok");
