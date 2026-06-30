import Link from "next/link";
import { errorPageCopy } from "@/features/error/data/errorPageContent";

const ErrorFooterMessage = () => (
  <footer className="flex flex-col items-center gap-3 text-center">
    <p className="max-w-sm font-gill text-sm font-light leading-relaxed text-[#6B6B6B]">
      {errorPageCopy.footerMessage}
    </p>
    <Link
      href="/contact"
      className="text-link-underline font-gill text-sm uppercase tracking-[0.08em] text-[#B8894E] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8894E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6EFE3]"
    >
      {errorPageCopy.contactSupport}
    </Link>
  </footer>
);

export default ErrorFooterMessage;
