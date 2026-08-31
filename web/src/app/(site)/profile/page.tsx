import { Suspense } from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/shared/lib/seo/metadata";
import { seoContent } from "@/features/cms/data/content";
import ProfilePage from "@/features/account/components/ProfilePage";

export const metadata: Metadata = constructMetadata({
  title: seoContent.profile.title,
  description: seoContent.profile.description,
  canonicalPath: "/profile",
  noIndex: true,
});

export default function Page() {
  return (
    <Suspense
      fallback={
        <section className="flex min-h-[60vh] items-center justify-center bg-white">
          <p className="sr-only" aria-live="polite">
            Loading profile
          </p>
        </section>
      }
    >
      <ProfilePage />
    </Suspense>
  );
}
