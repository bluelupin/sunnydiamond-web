# Trending product SEO links

Homepage and gifting render up to eight product links from the same snapshot used by their carousels (up to 24 products). The snapshot is cached for 15 minutes with the `magento-trending-products` tag. The homepage renders on demand; gifting prerenders and currently has an effective 60-second refresh window because of its other data dependencies.

## Refresh after a Magento change

Configure Magento (or its integration worker) to call the existing authenticated endpoint after a change that affects a trending product, including name, URL key, visibility, or the trending attribute:

```http
POST /api/revalidate
Authorization: Bearer <REVALIDATE_SECRET>
Content-Type: application/json

{"source":"magento","action":"trending-products-updated"}
```

The endpoint marks the trending data tag stale, then invalidates `/`, `/gifting`, and `/api/magento/trending-products`. Without the event, the 15-minute data TTL remains the fallback. Revalidation is lazy: the next visit can receive the last good snapshot while a fresh one is fetched; the updated links appear after successful regeneration. Empty or failed Magento reads throw, so they cannot replace a successful snapshot. A cold build with no previous snapshot fails rather than publishing empty product links.

When Cloudflare caches HTML, configure `CLOUDFLARE_ZONE_ID` and a zone-scoped `CLOUDFLARE_API_TOKEN` with Cache Purge permission. The endpoint then purges the two HTML URLs and returns `cdnPurge: "purged"`; it returns HTTP 502 when the purge fails so the caller can retry. Keep the edge HTML TTL short (at most 60 seconds), since the first request after a purge can still receive the last good snapshot while Magento refreshes. If Cloudflare does not cache HTML, leave these unset; the response says `cdnPurge: "not_configured"`. If a custom CDN cache key includes RSC query variants, configure separate purging for those variants or bypass CDN caching for HTML/RSC.

## Verify and monitor

- Check raw HTML of `/` and `/gifting` for `/product/` links after deployment and after a trending-product update.
- Check `X-Trending-Products-Fetched-At` on `/api/magento/trending-products`; alert on the `Trending product snapshot is older than 30 minutes` warning.
- Alert on `Trending product refresh failed`, 503 responses from the trending API, and 502 revalidation responses.
- Compare the initial product links with the hydrated carousel. The same snapshot should supply both.
