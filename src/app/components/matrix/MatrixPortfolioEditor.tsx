import type { MatrixPortfolioProject } from '../../services/matrixPortfolioData';

type ValidationState = {
  errors: Partial<
    Record<'title' | 'summary' | 'description' | 'techStack' | 'links', string>
  >;
  isValid: boolean;
};

type MatrixPortfolioEditorProps = {
  selectedProject: MatrixPortfolioProject | null;
  isCreatingNew: boolean;
  isEditingLocked: boolean;
  draftTitle: string;
  draftSummary: string;
  draftDescription: string;
  draftTechStackInput: string;
  draftLinksInput: string;
  onTitleChange: (value: string) => void;
  onSummaryChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTechStackChange: (value: string) => void;
  onLinksChange: (value: string) => void;
  showValidation: boolean;
  validation: ValidationState;
  onOpenPublishModal: () => void;
  isPublishing: boolean;
  isSaving: boolean;
  isCreating: boolean;
  onSave: () => void;
  saveError: string | null;
  createError: string | null;
  publishError: string | null;
};

export default function MatrixPortfolioEditor({
  selectedProject,
  isCreatingNew,
  isEditingLocked,
  draftTitle,
  draftSummary,
  draftDescription,
  draftTechStackInput,
  draftLinksInput,
  onTitleChange,
  onSummaryChange,
  onDescriptionChange,
  onTechStackChange,
  onLinksChange,
  showValidation,
  validation,
  onOpenPublishModal,
  isPublishing,
  isSaving,
  isCreating,
  onSave,
  saveError,
  createError,
  publishError,
}: MatrixPortfolioEditorProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      {!selectedProject && !isCreatingNew && (
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Select a project to view or edit details.</p>
          <p>
            Required fields: title, summary, description, tech stack, and links
            before publishing.
          </p>
        </div>
      )}
      {(selectedProject || isCreatingNew) && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {isCreatingNew
                  ? 'New draft'
                  : selectedProject?.status === 'published'
                  ? 'Published'
                  : 'Draft'}
              </p>
              <h2 className="text-2xl">
                {isCreatingNew ? 'New draft' : selectedProject?.title}
              </h2>
              {isEditingLocked && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Published projects are locked and cannot be edited.
                </p>
              )}
            </div>
            <button
              type="button"
              className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground"
              onClick={onOpenPublishModal}
              disabled={
                isEditingLocked ||
                isCreatingNew ||
                isPublishing ||
                !validation.isValid
              }
            >
              {isEditingLocked
                ? 'Published'
                : isPublishing
                ? 'Publishing...'
                : 'Publish project'}
            </button>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Title</label>
            <input
              type="text"
              value={draftTitle}
              onChange={(event) => onTitleChange(event.target.value)}
              className="w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm"
              disabled={isEditingLocked}
            />
            {showValidation && validation.errors.title && (
              <p className="text-sm text-destructive">
                {validation.errors.title}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Summary</label>
            <textarea
              value={draftSummary}
              onChange={(event) => onSummaryChange(event.target.value)}
              className="min-h-[120px] w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm"
              disabled={isEditingLocked}
            />
            {showValidation && validation.errors.summary && (
              <p className="text-sm text-destructive">
                {validation.errors.summary}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={draftDescription}
              onChange={(event) => onDescriptionChange(event.target.value)}
              className="min-h-[160px] w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm"
              disabled={isEditingLocked}
            />
            {showValidation && validation.errors.description && (
              <p className="text-sm text-destructive">
                {validation.errors.description}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Tech stack</label>
            <input
              type="text"
              value={draftTechStackInput}
              onChange={(event) => onTechStackChange(event.target.value)}
              className="w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm"
              disabled={isEditingLocked}
              placeholder="React, Supabase, Tailwind"
            />
            {showValidation && validation.errors.techStack && (
              <p className="text-sm text-destructive">
                {validation.errors.techStack}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Separate tools with commas.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Links</label>
            <textarea
              value={draftLinksInput}
              onChange={(event) => onLinksChange(event.target.value)}
              className="min-h-[140px] w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm"
              disabled={isEditingLocked}
              placeholder="Live demo | https://example.com\nGitHub | https://github.com/org/repo"
            />
            {showValidation && validation.errors.links && (
              <p className="text-sm text-destructive">
                {validation.errors.links}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Add one link per line using the format: Label | https://url.
            </p>
          </div>

          {!isEditingLocked && (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground"
                onClick={onSave}
                disabled={isSaving || isCreating || !validation.isValid}
              >
                {isCreatingNew
                  ? isCreating
                    ? 'Creating...'
                    : 'Create draft'
                  : isSaving
                  ? 'Saving...'
                  : 'Save draft'}
              </button>
            </div>
          )}
          {(saveError || createError) && (
            <p className="text-sm text-destructive">
              {saveError ?? createError}
            </p>
          )}
          {publishError && (
            <p className="text-sm text-destructive">{publishError}</p>
          )}
        </div>
      )}
    </section>
  );
}
