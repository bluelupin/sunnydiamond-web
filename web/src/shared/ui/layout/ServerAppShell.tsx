import AppProvider from "@/shared/lib/providers/AppProvider";
import Layout from "@/shared/ui/layout/Layout";
import HomepageCmsSeeder from "@/shared/lib/providers/HomepageCmsSeeder";
import MagentoNavSeeder from "@/shared/lib/providers/MagentoNavSeeder";
import { homepageQueryKeys } from "@/hooks/homepage/queryKeys";
import { seedHomepageCmsCache } from "@/lib/homepage/cmsCache";
import {
  getCachedHomepageShell,
  getCachedHomepageShoppingBlocks,
} from "@/lib/homepage/prefetchHomepageCms";
import { prefetchMagentoJewelleryNav } from "@/lib/magento/prefetchMagento";

export default async function ServerAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  let shell: Awaited<ReturnType<typeof getCachedHomepageShell>> | undefined;
  let shopping: Awaited<ReturnType<typeof getCachedHomepageShoppingBlocks>> | undefined;
  let jewelleryNav: Awaited<ReturnType<typeof prefetchMagentoJewelleryNav>> | undefined;

  try {
    [shell, shopping, jewelleryNav] = await Promise.all([
      getCachedHomepageShell(),
      getCachedHomepageShoppingBlocks(),
      prefetchMagentoJewelleryNav(),
    ]);
  } catch {
    shell = undefined;
    shopping = undefined;
    jewelleryNav = undefined;
  }

  seedHomepageCmsCache(
    { shell, shopping },
    {
      shell: homepageQueryKeys.homepageShell,
      editorial: homepageQueryKeys.homePageEditorialBlocks,
      shopping: homepageQueryKeys.homePageShoppingBlocks,
    },
  );

  return (
    <AppProvider>
      <HomepageCmsSeeder shell={shell} shopping={shopping} />
      <MagentoNavSeeder jewelleryNav={jewelleryNav} />
      <Layout>{children}</Layout>
    </AppProvider>
  );
}
