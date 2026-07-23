import { redirect } from "next/navigation";
import { sanitizeReturnUrl } from "@/features/auth/utils/authNavigation";

type SignUpPageProps = {
  searchParams: Promise<{ returnUrl?: string }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const returnUrl = sanitizeReturnUrl(params.returnUrl);
  const query = returnUrl !== "/" ? `?returnUrl=${encodeURIComponent(returnUrl)}` : "";

  redirect(`/login${query}`);
}
