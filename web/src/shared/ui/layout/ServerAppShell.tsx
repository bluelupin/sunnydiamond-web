import AppProvider from "@/shared/lib/providers/AppProvider";
import Layout from "@/shared/ui/layout/Layout";
import HomepageCmsSeeder from "@/shared/lib/providers/HomepageCmsSeeder";
import { homepageQueryKeys } from "@/hooks/homepage/queryKeys";
import { seedHomepageCmsCache } from "@/lib/homepage/cmsCache";
import {
  getCachedHomepageShell,
  getCachedHomepageShoppingBlocks,
} from "@/lib/homepage/prefetchHomepageCms";

export default async function ServerAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  let shell: Awaited<ReturnType<typeof getCachedHomepageShell>> | undefined;
  let shopping: Awaited<ReturnType<typeof getCachedHomepageShoppingBlocks>> | undefined;

  try {
    [shell, shopping] = await Promise.all([
      getCachedHomepageShell(),
      getCachedHomepageShoppingBlocks(),
    ]);
  } catch {
    shell = undefined;
    shopping = undefined;
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
      <Layout>{children}</Layout>
    </AppProvider>
  );
}
