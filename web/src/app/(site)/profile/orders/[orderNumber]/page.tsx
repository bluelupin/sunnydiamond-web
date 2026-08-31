import { redirect } from "next/navigation";
import { buildProfileOrderDetailHref } from "@/features/account/utils/profileOrderNavigation";

type PageProps = {
  params: Promise<{ orderNumber: string }>;
};

export default async function Page({ params }: PageProps) {
  const { orderNumber } = await params;
  redirect(buildProfileOrderDetailHref(orderNumber));
}
