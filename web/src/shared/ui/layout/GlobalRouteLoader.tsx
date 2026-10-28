import { cn } from "@/shared/utils/cn";

/** Shared loader visuals — used by route fallbacks and PWA launch splash. */
export function GlobalRouteLoaderContent() {
  return (
    <div className="relative flex flex-col items-center space-y-6">
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 animate-ping rounded-full border border-primary/20 duration-1000" />
        <div className="absolute inset-2 rotate-45 animate-spin rounded-bl-none rounded-tr-none border-2 border-primary [animation-duration:3s]" />
        <div className="absolute inset-4 -rotate-45 animate-pulse rounded-br-none rounded-tl-none border border-primary/40" />
      </div>

      <div className="flex flex-col items-center space-y-1">
        <span className="font-Larken text-xl font-larken uppercase italic tracking-[0.2em] text-foreground md:text-2xl">
          Sunny Diamonds
        </span>
        <span className="font-gill text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Crafting Brilliance Since 1997
        </span>
      </div>
    </div>
  );
}

type GlobalRouteLoaderFrameProps = {
  className?: string;
  /** When false, omits fixed positioning (for static PWA first-paint shell). */
  fixed?: boolean;
};

export function GlobalRouteLoaderFrame({
  className,
  fixed = true,
}: GlobalRouteLoaderFrameProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-white",
        fixed && "fixed inset-0 z-50 bg-background",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <GlobalRouteLoaderContent />
    </div>
  );
}

export default function GlobalRouteLoader() {
  return <GlobalRouteLoaderFrame />;
}
