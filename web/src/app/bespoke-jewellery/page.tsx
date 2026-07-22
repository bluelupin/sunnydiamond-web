import { Suspense } from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import JsonLd from "@/shared/lib/seo/JsonLd";
import { footerPages } from "@/features/cms/data/footerPages";
import BespokePage from "@/features/bespoke/components/BespokePage";
import {
  EMPTY_CONTACT_BESPOKE_PAGE,
  getContactBespokePage,
} from "@/services/bespoke/contact-bespoke-page.service";
import { buildBespokeJsonLd, resolveBespokeSeoMetadata } from "@/shared/lib/seo/bespokeSeo";

const fallback = footerPages.bespokeJewellery;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await getContactBespokePage();
    const { title, description, canonicalPath, keywords, image } = resolveBespokeSeoMetadata(page);

    return constructMetadata({
      title,
      description,
      canonicalPath,
      keywords,
      image,
    });
  } catch {
    return constructMetadata({
      title: fallback.title,
      description: fallback.description,
      canonicalPath: "/bespoke-jewellery",
    });
  }
}

async function BespokePageContent() {
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

export default function Page() {
  return (
    <Suspense fallback={null}>
      <BespokePageContent />
    </Suspense>
  );
}
