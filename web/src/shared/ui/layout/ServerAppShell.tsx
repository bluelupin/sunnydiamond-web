import AppProvider from "@/shared/lib/providers/AppProvider";
import Layout from "@/shared/ui/layout/Layout";
import HomepageCmsSeeder from "@/shared/lib/providers/HomepageCmsSeeder";
import MagentoNavSeeder from "@/shared/lib/providers/MagentoNavSeeder";
import { getCachedHomepageShell } from "@/lib/homepage/prefetchHomepageCms";
import { prefetchMagentoJewelleryNav } from "@/lib/magento/prefetchMagento";
import { fetchAuthFeatureFlags } from "@/features/auth/services/authFeatures.server";

export default async function ServerAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  // allSettled: a CMS/nav prefetch failure must not discard the auth flags (or vice versa).
  const [shellResult, jewelleryNavResult, authFeaturesResult] = await Promise.allSettled([
    getCachedHomepageShell(),
    prefetchMagentoJewelleryNav(),
    fetchAuthFeatureFlags(),
  ]);

  const shell = shellResult.status === "fulfilled" ? shellResult.value : undefined;
  const jewelleryNav =
    jewelleryNavResult.status === "fulfilled" ? jewelleryNavResult.value : undefined;
  const authFeatures =
    authFeaturesResult.status === "fulfilled" ? authFeaturesResult.value : undefined;

  return (
    <AppProvider authFeatures={authFeatures}>
      <HomepageCmsSeeder shell={shell} />
      <MagentoNavSeeder jewelleryNav={jewelleryNav} />
      <Layout>{children}</Layout>
    </AppProvider>
  );
}
