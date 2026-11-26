import { magentoGraphqlFetch } from "../graphqlClient";

export type RazorpayDisplayOffer = {
  id: string;
  title: string;
  description: string | null;
  terms: string | null;
  terms_url: string | null;
  starts_at: number | null;
  ends_at: number | null;
  min_amount: number | null;
  payment_methods: string[];
};

export async function getRazorpayDisplayOffers(): Promise<RazorpayDisplayOffer[]> {
  const data = await magentoGraphqlFetch<{ sunnyRazorpayOffers: RazorpayDisplayOffer[] }>({
    query: `query SunnyRazorpayOffers {
      sunnyRazorpayOffers {
        id title description terms terms_url starts_at ends_at min_amount payment_methods
      }
    }`,
    cache: "no-store",
  });
  return data.sunnyRazorpayOffers;
}
