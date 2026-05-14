interface StatItem {
  value: string;
  label: string;
}

interface StatGridProps {
  items: readonly StatItem[];
  className?: string;
}

const StatGrid = ({ items, className = "" }: StatGridProps) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-${items.length} gap-6 py-8 border-t border-b border-border text-center ${className}`}
    >
      {items.map((stat) => (
        <div key={stat.label}>
          <p className="font-heading text-2xl font-semibold text-foreground">
            {stat.value}
          </p>
          <p className="text-xs tracking-widest uppercase text-muted-foreground mt-1">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatGrid;
