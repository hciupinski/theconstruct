import type { MatrixTab } from './matrixTypes';

type MatrixTabsProps = {
  activeTab: MatrixTab;
  onChange: (tab: MatrixTab) => void;
};

export default function MatrixTabs({ activeTab, onChange }: MatrixTabsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        className={`rounded-full border px-4 py-2 text-sm ${
          activeTab === 'posts'
            ? 'border-primary text-primary'
            : 'border-border text-muted-foreground'
        }`}
        onClick={() => onChange('posts')}
      >
        Blog posts
      </button>
      <button
        type="button"
        className={`rounded-full border px-4 py-2 text-sm ${
          activeTab === 'portfolio'
            ? 'border-primary text-primary'
            : 'border-border text-muted-foreground'
        }`}
        onClick={() => onChange('portfolio')}
      >
        Portfolio items
      </button>
    </div>
  );
}
