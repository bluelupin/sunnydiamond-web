import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import JsonLd from "@/shared/lib/seo/JsonLd";
import { seoContent } from "@/features/cms/data/content";
import BespokePage from "@/features/bespoke/components/BespokePage";
import {
  EMPTY_CONTACT_BESPOKE_PAGE,
  getContactBespokePage,
} from "@/services/bespoke/contact-bespoke-page.service";
import { buildBespokeJsonLd, resolveBespokeSeoMetadata } from "@/shared/lib/seo/bespokeSeo";
import { BESPOKE_JEWELLERY_PATH } from "@/shared/utils/navigation";

/** Refresh CMS-driven bespoke content without a full redeploy. */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getContactBespokePage();
    const { title, description, canonicalPath, keywords } = resolveBespokeSeoMetadata(page);

    return constructMetadata({
      title,
      description,
      canonicalPath,
      ...(keywords ? { keywords } : {}),
    });
  } catch {
    return constructMetadata({
      title: seoContent.bespoke.title,
      description: seoContent.bespoke.description,
      canonicalPath: BESPOKE_JEWELLERY_PATH,
    });
  }
}

export default async function Page() {
  let page = EMPTY_CONTACT_BESPOKE_PAGE;

  try {
    page = await getContactBespokePage();
  } catch {
    page = EMPTY_CONTACT_BESPOKE_PAGE;
  }

  return (
    <>
      <JsonLd data={buildBespokeJsonLd(page)} />
      <BespokePage page={page} />
    </>
  );
}
