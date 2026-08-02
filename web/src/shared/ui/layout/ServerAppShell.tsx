import AppProvider from "@/shared/lib/providers/AppProvider";
import Layout from "@/shared/ui/layout/Layout";
import HomepageCmsSeeder from "@/shared/lib/providers/HomepageCmsSeeder";
import MagentoNavSeeder from "@/shared/lib/providers/MagentoNavSeeder";
import { getCachedHomepageShell } from "@/lib/homepage/prefetchHomepageCms";
import { prefetchMagentoJewelleryNav } from "@/lib/magento/prefetchMagento";

export default async function ServerAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  let shell: Awaited<ReturnType<typeof getCachedHomepageShell>> | undefined;
  let jewelleryNav: Awaited<ReturnType<typeof prefetchMagentoJewelleryNav>> | undefined;

  try {
    [shell, jewelleryNav] = await Promise.all([
      getCachedHomepageShell(),
      prefetchMagentoJewelleryNav(),
    ]);
  } catch {
    shell = undefined;
    jewelleryNav = undefined;
  }

  return (
    <AppProvider>
      <HomepageCmsSeeder shell={shell} />
      <MagentoNavSeeder jewelleryNav={jewelleryNav} />
      <Layout>{children}</Layout>
    </AppProvider>
  );
}
