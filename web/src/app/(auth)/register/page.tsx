import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/features/auth/components/RegisterForm";
import { sanitizeNextUrl } from "@/features/auth/utils/nextUrl";

export const metadata: Metadata = {
  title: "Create Account",
  robots: { index: false, follow: false },
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const nextUrl = sanitizeNextUrl(next);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-larken text-32 font-light text-darkblack">Create Account</h1>
        <p className="font-body text-sm text-muted-foreground">
          Save your wishlist, track orders and check out faster.
        </p>
      </div>

      <RegisterForm nextUrl={nextUrl} />

      <p className="font-body text-sm text-darkblack">
        Already have an account?{" "}
        <Link
          href={`/login?next=${encodeURIComponent(nextUrl)}`}
          className="border-b border-darkblack pb-0.5 uppercase tracking-widest"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
