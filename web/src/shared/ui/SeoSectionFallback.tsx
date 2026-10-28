import Link from "next/link";

type SeoLink = { href: string; label: string };

type Props = {
  id?: string;
  title?: string | null;
  description?: string | null;
  links?: SeoLink[];
  className?: string;
  appearance?: "default" | "product-carousel";
};

/** Lightweight, visible content until a viewport-gated section mounts. */
export default function SeoSectionFallback({
  id,
  title,
  description,
  links = [],
  className = "",
  appearance = "default",
}: Props) {
  if (!title?.trim() && !description?.trim() && links.length === 0) return null;

  const isProductCarousel = appearance === "product-carousel";

  return (
    <section
      id={id}
      className={`w-full px-4 py-16 md:py-24 ${className}`}
      aria-label={title?.trim() || "Explore"}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center text-center">
      {title?.trim() ? <h2 className="font-larken text-3xl font-light leading-tight text-darkblack md:text-5xl">{title.trim()}</h2> : null}
      {description?.trim() ? <p className="mt-3 max-w-2xl font-gill text-base text-neutral500 md:text-xl">{description.trim()}</p> : null}
      {links.length > 0 ? (
        <nav
          aria-label={`${title?.trim() || "Explore"} links`}
          className={`mt-10 flex w-full gap-4 overflow-x-auto pb-2 ${isProductCarousel ? "justify-start md:justify-center" : "flex-wrap justify-center"}`}
        >
          {links.map(({ href, label }) => (
            <Link
              key={`${href}:${label}`}
              href={href}
              className={isProductCarousel
                ? "flex w-40 shrink-0 flex-col gap-3 text-left font-gill text-sm text-darkblack md:w-52"
                : "inline-flex min-h-11 items-center justify-center rounded-full border border-neutral300 px-5 py-2 font-gill text-sm text-darkblack transition-colors hover:border-darkblack"}
            >
              {isProductCarousel ? <span className="block aspect-square w-full rounded-lg bg-gray200" aria-hidden /> : null}
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      ) : null}
      </div>
    </section>
  );
}
