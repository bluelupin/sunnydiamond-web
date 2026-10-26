import Link from "next/link";

type SeoLink = { href: string; label: string };

type Props = {
  id?: string;
  title?: string | null;
  description?: string | null;
  links?: SeoLink[];
  className?: string;
};

/** Lightweight, visible content until a viewport-gated section mounts. */
export default function SeoSectionFallback({
  id,
  title,
  description,
  links = [],
  className = "",
}: Props) {
  if (!title?.trim() && !description?.trim() && links.length === 0) return null;

  return (
    <section id={id} className={`mx-auto w-full max-w-7xl px-4 py-12 ${className}`}>
      {title?.trim() ? <h2 className="font-larken text-3xl text-darkblack">{title.trim()}</h2> : null}
      {description?.trim() ? <p className="mt-3 text-neutral500">{description.trim()}</p> : null}
      {links.length > 0 ? (
        <nav aria-label={`${title?.trim() || "Explore"} links`} className="mt-5 flex flex-wrap gap-4">
          {links.map(({ href, label }) => (
            <Link key={`${href}:${label}`} href={href} className="underline underline-offset-4">
              {label}
            </Link>
          ))}
        </nav>
      ) : null}
    </section>
  );
}
