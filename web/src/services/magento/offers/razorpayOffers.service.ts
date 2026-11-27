import { magentoGraphqlFetch } from "../graphqlClient";

export type RazorpayBank = { code: string; name: string | null };

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
  card_issuers: RazorpayBank[];
  netbanking_banks: RazorpayBank[];
  bank_names: string[];
  card_types: string[];
  card_networks: string[];
};

export async function getRazorpayDisplayOffers(): Promise<RazorpayDisplayOffer[]> {
  const data = await magentoGraphqlFetch<{ sunnyRazorpayOffers: RazorpayDisplayOffer[] }>({
    query: `query SunnyRazorpayOffers {
      sunnyRazorpayOffers {
        id title description terms terms_url starts_at ends_at min_amount payment_methods
        card_issuers { code name }
        netbanking_banks { code name }
        bank_names card_types card_networks
      }
    }`,
    cache: "no-store",
  });
  return data.sunnyRazorpayOffers;
}
