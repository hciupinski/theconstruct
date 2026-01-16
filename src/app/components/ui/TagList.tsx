type TagListProps = {
  items: string[];
  label?: string;
  className?: string;
};

export default function TagList({ items, label, className }: TagListProps) {
  if (items.length === 0) return null;

  return (
    <div
      className={`flex flex-wrap gap-2 ${className ?? ''}`.trim()}
      aria-label={label ?? 'Tags'}
    >
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
