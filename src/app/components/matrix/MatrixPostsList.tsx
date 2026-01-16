import type { MatrixPost } from '../../services/matrixData';
import type { LoadState } from './matrixTypes';

type MatrixPostsListProps = {
  posts: MatrixPost[];
  loadState: LoadState;
  loadError: string | null;
  selectedPostId: string | null;
  onSelectPost: (id: string) => void;
  onCreateNew: () => void;
  isCreateDisabled: boolean;
  getMissingFields: (post: MatrixPost) => string[];
};

export default function MatrixPostsList({
  posts,
  loadState,
  loadError,
  selectedPostId,
  onSelectPost,
  onCreateNew,
  isCreateDisabled,
  getMissingFields,
}: MatrixPostsListProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg">Posts</h2>
        <button
          type="button"
          className="text-sm text-primary"
          aria-label="Create new draft post"
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
          <p className="text-sm text-muted-foreground">Loading posts...</p>
        )}
        {loadState === 'error' && (
          <p className="text-sm text-destructive">
            {loadError ?? 'Unable to load posts.'}
          </p>
        )}
        {loadState === 'ready' && posts.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            <p>No posts yet. Create your first draft to get started.</p>
          </div>
        )}
        {posts.map((post) => {
          const missingFields = getMissingFields(post);

          return (
            <button
              key={post.id}
              type="button"
              onClick={() => onSelectPost(post.id)}
              className={`w-full rounded-lg border px-4 py-3 text-left text-sm ${
                post.id === selectedPostId
                  ? 'border-primary text-primary'
                  : 'border-border text-muted-foreground'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">
                  {post.title}
                </span>
                <span className="text-xs uppercase tracking-[0.2em]">
                  {post.status}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Updated {post.updatedAt}
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
