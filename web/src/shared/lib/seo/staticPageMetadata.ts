import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";

type StaticPageMetadataOptions = {
  path: string;
  title: string;
  description: string;
  noIndex?: boolean;
};

export function createStaticPageMetadata({
  path,
  title,
  description,
  noIndex,
}: StaticPageMetadataOptions): Metadata {
  return constructMetadata({
    title,
    description,
    canonicalPath: path,
    noIndex,
  });
}
