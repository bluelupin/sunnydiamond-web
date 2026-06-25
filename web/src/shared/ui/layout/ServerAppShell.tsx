import AppProvider from "@/shared/lib/providers/AppProvider";
import Layout from "@/shared/ui/layout/Layout";
import HomepageCmsSeeder from "@/shared/lib/providers/HomepageCmsSeeder";
import { getCachedHomepageShell } from "@/lib/homepage/prefetchHomepageCms";

export default async function ServerAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  let shell: Awaited<ReturnType<typeof getCachedHomepageShell>> | undefined;

  try {
    shell = await getCachedHomepageShell();
  } catch {
    shell = undefined;
  }

  return (
    <AppProvider>
      <HomepageCmsSeeder shell={shell} />
      <Layout>{children}</Layout>
    </AppProvider>
  );
}
