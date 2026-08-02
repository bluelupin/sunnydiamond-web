import Link from "next/link";
import SDLogo from "@/assets/Icons/SDLogo";
import { siteConfig } from "@/shared/lib/siteConfig";

const ErrorBrandHeader = () => (
  <header className="flex flex-col items-center gap-3">
    <Link
      href="/"
      aria-label={`${siteConfig.brand.name} home`}
      className="inline-flex text-[#B8894E] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8894E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6EFE3]"
    >
      <SDLogo className="!h-14 !w-14 md:!h-16 md:!w-16" />
    </Link>
    <p className="font-gill text-xs uppercase tracking-[0.2em] text-[#6B6B6B]">
      {siteConfig.brand.displayName}
    </p>
  </header>
);

export default ErrorBrandHeader;
