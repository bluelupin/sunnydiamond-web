import { cache } from "react";
import { magentoGraphqlFetch } from "../graphqlClient";
import { MAGENTO_ENGRAVING_FONTS_METADATA_QUERY } from "./engravingFonts.query";

export type MagentoEngravingFontOption = {
  label: string;
  value: string;
};

type MagentoEngravingFontsMetadataResponse = {
  customAttributeMetadata?: {
    items?: Array<{
      attribute_code?: string | null;
      attribute_options?: Array<{
        label?: string | null;
        value?: string | null;
      }> | null;
    }> | null;
  } | null;
};

function mapEngravingFontOptions(
  response: MagentoEngravingFontsMetadataResponse,
): MagentoEngravingFontOption[] {
  const items = response.customAttributeMetadata?.items ?? [];
  const engravingItem =
    items.find((item) => item.attribute_code === "engraving_fonts") ?? items[0];

  return (engravingItem?.attribute_options ?? [])
    .map((option) => ({
      label: option.label?.trim() ?? "",
      value: option.value?.trim() ?? "",
    }))
    .filter((option) => option.label.length > 0 && option.value.length > 0);
}

export async function fetchMagentoEngravingFontOptions(
  signal?: AbortSignal,
): Promise<MagentoEngravingFontOption[]> {
  const data = await magentoGraphqlFetch<MagentoEngravingFontsMetadataResponse>({
    query: MAGENTO_ENGRAVING_FONTS_METADATA_QUERY,
    signal,
    cache: "force-cache",
  });

  return mapEngravingFontOptions(data);
}

export const getMagentoEngravingFontOptions = cache(() => fetchMagentoEngravingFontOptions());
