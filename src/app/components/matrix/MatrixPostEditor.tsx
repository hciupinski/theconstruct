import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import type { MatrixPost } from '../../services/matrixData';

type ValidationState = {
  errors: Partial<Record<'title' | 'excerpt' | 'content' | 'tags', string>>;
  isValid: boolean;
};

type MatrixPostEditorProps = {
  selectedPost: MatrixPost | null;
  isCreatingNew: boolean;
  isEditingLocked: boolean;
  draftTitle: string;
  draftExcerpt: string;
  draftContent: string;
  draftTagsInput: string;
  onTitleChange: (value: string) => void;
  onExcerptChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onTagsChange: (value: string) => void;
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

export default function MatrixPostEditor({
  selectedPost,
  isCreatingNew,
  isEditingLocked,
  draftTitle,
  draftExcerpt,
  draftContent,
  draftTagsInput,
  onTitleChange,
  onExcerptChange,
  onContentChange,
  onTagsChange,
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
}: MatrixPostEditorProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      {!selectedPost && !isCreatingNew && (
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Select a post to view or edit content.</p>
          <p>
            Required fields: title, excerpt, content, and tags before saving or
            approving.
          </p>
        </div>
      )}
      {(selectedPost || isCreatingNew) && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {isCreatingNew
                  ? 'New draft'
                  : selectedPost?.status === 'published'
                  ? 'Published'
                  : 'Draft'}
              </p>
              <h2 className="text-2xl">
                {isCreatingNew ? 'New draft' : selectedPost?.title}
              </h2>
              {isEditingLocked && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Published posts are locked and cannot be edited.
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
                : 'Approve post'}
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
            <label className="text-sm font-medium">Excerpt</label>
            <textarea
              value={draftExcerpt}
              onChange={(event) => onExcerptChange(event.target.value)}
              className="min-h-[120px] w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm"
              disabled={isEditingLocked}
            />
            {showValidation && validation.errors.excerpt && (
              <p className="text-sm text-destructive">
                {validation.errors.excerpt}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Content</label>
            <ReactQuill
              theme="snow"
              value={draftContent}
              onChange={onContentChange}
              readOnly={isEditingLocked}
              className="rounded-lg border border-border bg-transparent text-sm"
            />
            {showValidation && validation.errors.content && (
              <p className="text-sm text-destructive">
                {validation.errors.content}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Rich text editor supports image embeds for JPG and GIF.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Tags</label>
            <input
              type="text"
              value={draftTagsInput}
              onChange={(event) => onTagsChange(event.target.value)}
              className="w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm"
              disabled={isEditingLocked}
              placeholder="Security, Infrastructure, Systems"
            />
            {showValidation && validation.errors.tags && (
              <p className="text-sm text-destructive">
                {validation.errors.tags}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Separate tags with commas.
            </p>
          </div>

          {!isEditingLocked && (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground"
              >
                Upload media
              </button>
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
              <button
                type="button"
                className="rounded-full border border-border px-4 py-2 text-sm text-destructive"
                disabled={isCreatingNew}
              >
                Delete
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
