type MatrixPublishModalProps = {
  isOpen: boolean;
  isPublishing: boolean;
  publishError: string | null;
  onClose: () => void;
  onPublish: () => void;
};

export default function MatrixPublishModal({
  isOpen,
  isPublishing,
  publishError,
  onClose,
  onPublish,
}: MatrixPublishModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-6 py-8">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl">
        <h3 className="text-lg">Publish this post?</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Publishing is one-way. This will lock editing and set the published
          date.
        </p>
        {publishError && (
          <p className="mt-4 text-sm text-destructive">{publishError}</p>
        )}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground"
            onClick={onClose}
            disabled={isPublishing}
          >
            Cancel
          </button>
          <button
            type="button"
            className="rounded-full border border-border px-4 py-2 text-sm text-destructive"
            onClick={onPublish}
            disabled={isPublishing}
          >
            {isPublishing ? 'Publishing...' : 'Publish now'}
          </button>
        </div>
      </div>
    </div>
  );
}
