interface SectionHeaderProps {
  subtitle?: string;
  title: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}

const SectionHeader = ({
  subtitle,
  title,
  as: Tag = "h2",
  className = "",
}: SectionHeaderProps) => {
  return (
    <div className={`text-center ${className}`}>
      {subtitle && (
        <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
          {subtitle}
        </p>
      )}
      <Tag className="text-h2 text-foreground">
        {title}
      </Tag>
    </div>
  );
};

export default SectionHeader;
