import { cn } from "@/shared/utils/cn";

type ProfileMobileSectionHeaderProps = {
  title: string;
  /** Wishlist mobile title is centered; other profile sections stay left-aligned. */
  align?: "left" | "center";
};

/** Figma 1480:21068 — mobile section title (navigation via header profile menu). */
export function ProfileMobileSectionHeader({
  title,
  align = "left",
}: ProfileMobileSectionHeaderProps) {
  return (
    <h1
      className={cn(
        "mb-6 font-larken text-32 font-light leading-110 text-darkblack lg:hidden",
        align === "center" ? "text-center" : "text-left",
      )}
    >
      {title}
    </h1>
  );
}
