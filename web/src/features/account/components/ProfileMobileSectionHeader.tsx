type ProfileMobileSectionHeaderProps = {
  title: string;
};

/** Figma 1480:21068 — mobile section title (navigation via header profile menu). */
export function ProfileMobileSectionHeader({ title }: ProfileMobileSectionHeaderProps) {
  return (
    <h1 className="mb-6 font-larken md:text-32 text-2xl font-light leading-110 text-darkblack lg:hidden">
      {title}
    </h1>
  );
}
