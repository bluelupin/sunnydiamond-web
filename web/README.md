This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Product store availability

The Magento product queries read `custom_attributesV2.items` for both the parent product and configurable children. The store code comes from the item with `code: "sd_feed_store"`. `stock_status` and `sunny_availability` are separate signals used for stock and purchase status, including made-to-order products.

The product detail page uses the selected child's store code when the shopper changes metal or size. A child with `unknown` or a missing code clears the parent store. The jewellery listing uses the store for the same variant it uses for the card price. It displays a showroom only for a recognized code.

Supported codes are `CBE` (Coimbatore), `CHE` (Chennai), `CLT` (Calicut), `EKM` (Kochi), `TCR` (Thrissur), and `TVM` (Trivandrum). The delivery drawer looks up the matching showroom by slug in `/api/store-locator/showrooms` for its address, phone number, and directions link.

Verified against Magento UAT using the Adeline Diamond Earring (`2141124782035-feed`). Its Yellow Gold child reports `CBE`. Its White Gold child reports `unknown` while `stock_status` is `IN_STOCK` and `sunny_availability` is `MADE_TO_ORDER`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
