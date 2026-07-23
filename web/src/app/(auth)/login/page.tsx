import type { Metadata } from "next";
import Link from "next/link";
import AppleSignInButton from "@/features/auth/components/AppleSignInButton";
import EmailPasswordForm from "@/features/auth/components/EmailPasswordForm";
import GoogleSignInButton from "@/features/auth/components/GoogleSignInButton";
import PhoneOtpForm from "@/features/auth/components/PhoneOtpForm";
import { sanitizeNextUrl } from "@/features/auth/utils/nextUrl";

const OTP_LOGIN_ENABLED = process.env.NEXT_PUBLIC_OTP_LOGIN_ENABLED === "1";
const SOCIAL_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
);

const Divider = ({ label }: { label: string }) => (
  <div className="flex w-full items-center gap-4">
    <span className="h-px flex-1 bg-border" />
    <span className="font-body text-xs uppercase tracking-widest text-muted-foreground">
      {label}
    </span>
    <span className="h-px flex-1 bg-border" />
  </div>
);

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const nextUrl = sanitizeNextUrl(next);

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-larken text-32 font-light text-darkblack">Sign In</h1>
        <p className="font-body text-sm text-muted-foreground">
          Access your wishlist, orders and saved details.
        </p>
      </div>

      {OTP_LOGIN_ENABLED ? (
        <>
          <PhoneOtpForm nextUrl={nextUrl} />
          <Divider label="or" />
        </>
      ) : null}

      {SOCIAL_CONFIGURED ? (
        <>
          <div className="flex w-full flex-col items-center gap-3">
            <GoogleSignInButton nextUrl={nextUrl} />
            <AppleSignInButton nextUrl={nextUrl} />
          </div>
          <Divider label="or sign in with email" />
        </>
      ) : null}

      <EmailPasswordForm nextUrl={nextUrl} />

      <p className="font-body text-sm text-darkblack">
        New to Sunny Diamonds?{" "}
        <Link
          href={`/register?next=${encodeURIComponent(nextUrl)}`}
          className="border-b border-darkblack pb-0.5 uppercase tracking-widest"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
