import type { MatrixPortfolioProject } from '../../services/matrixPortfolioData';
import type { LoadState } from './matrixTypes';

type MatrixPortfolioListProps = {
  projects: MatrixPortfolioProject[];
  loadState: LoadState;
  loadError: string | null;
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
  onCreateNew: () => void;
  isCreateDisabled: boolean;
  getMissingFields: (project: MatrixPortfolioProject) => string[];
};

export default function MatrixPortfolioList({
  projects,
  loadState,
  loadError,
  selectedProjectId,
  onSelectProject,
  onCreateNew,
  isCreateDisabled,
  getMissingFields,
}: MatrixPortfolioListProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg">Projects</h2>
        <button
          type="button"
          className="text-sm text-primary"
          aria-label="Create new draft project"
          onClick={onCreateNew}
          disabled={isCreateDisabled}
        >
          New draft
        </button>
      </div>
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span>Title</span>
          <span>Status</span>
        </div>
        {loadState === 'loading' && (
          <p className="text-sm text-muted-foreground">Loading projects...</p>
        )}
        {loadState === 'error' && (
          <p className="text-sm text-destructive">
            {loadError ?? 'Unable to load projects.'}
          </p>
        )}
        {loadState === 'ready' && projects.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            <p>No projects yet. Create your first draft to get started.</p>
          </div>
        )}
        {projects.map((project) => {
          const missingFields = getMissingFields(project);

          return (
            <button
              key={project.id}
              type="button"
              onClick={() => onSelectProject(project.id)}
              className={`w-full rounded-lg border px-4 py-3 text-left text-sm ${
                project.id === selectedProjectId
                  ? 'border-primary text-primary'
                  : 'border-border text-muted-foreground'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">
                  {project.title}
                </span>
                <span className="text-xs uppercase tracking-[0.2em]">
                  {project.status}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Updated {project.updatedAt}
              </p>
              {missingFields.length > 0 && (
                <p className="mt-2 text-xs text-destructive">
                  Missing {missingFields.join(', ')}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
