import { useEffect, useMemo, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { fetchMatrixPosts, type MatrixPost } from './matrixData';

type LoadState = 'idle' | 'loading' | 'ready' | 'error';
type MatrixTab = 'posts' | 'portfolio';

export default function MatrixPage() {
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [posts, setPosts] = useState<MatrixPost[]>([]);
  const [activeTab, setActiveTab] = useState<MatrixTab>('posts');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadPosts = async () => {
      try {
        setLoadState('loading');
        const data = await fetchMatrixPosts({ signal: controller.signal });
        setPosts(data);
        setLoadState('ready');
        setSelectedPostId(data[0]?.id ?? null);
      } catch (error) {
        if (controller.signal.aborted) return;
        setLoadState('error');
      }
    };

    loadPosts();

    return () => controller.abort();
  }, []);

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) ?? null,
    [posts, selectedPostId]
  );

  useEffect(() => {
    if (!selectedPost) return;
    setDraftTitle(selectedPost.title);
    setDraftContent(selectedPost.content);
  }, [selectedPost]);

  const isEditingLocked = selectedPost?.status === 'published';

  return (
    <main className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Matrix
          </p>
          <h1 className="text-3xl">Authoring Console</h1>
          <p className="text-muted-foreground">
            Draft posts, approve releases, and manage assets with gated access.
          </p>
        </header>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className={`rounded-full border px-4 py-2 text-sm ${
              activeTab === 'posts'
                ? 'border-primary text-primary'
                : 'border-border text-muted-foreground'
            }`}
            onClick={() => setActiveTab('posts')}
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
            onClick={() => setActiveTab('portfolio')}
          >
            Portfolio items
          </button>
        </div>

        {activeTab === 'portfolio' && (
          <section className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            Portfolio authoring will live here. This button is a placeholder for
            future routing or modal flows.
          </section>
        )}

        {activeTab === 'posts' && (
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <section className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg">Posts</h2>
                <button
                  type="button"
                  className="text-sm text-primary"
                  aria-label="Create new draft post"
                >
                  New draft
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {loadState === 'loading' && (
                  <p className="text-sm text-muted-foreground">
                    Loading posts...
                  </p>
                )}
                {loadState === 'error' && (
                  <p className="text-sm text-muted-foreground">
                    Unable to load posts.
                  </p>
                )}
                {posts.map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => setSelectedPostId(post.id)}
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
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-6">
              {!selectedPost && (
                <p className="text-sm text-muted-foreground">
                  Select a post to view or edit content.
                </p>
              )}
              {selectedPost && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {selectedPost.status === 'published'
                          ? 'Approved'
                          : 'Draft'}
                      </p>
                      <h2 className="text-2xl">{selectedPost.title}</h2>
                    </div>
                    <button
                      type="button"
                      className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground"
                      disabled={isEditingLocked}
                    >
                      {isEditingLocked ? 'Approved' : 'Approve post'}
                    </button>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Title</label>
                    <input
                      type="text"
                      value={draftTitle}
                      onChange={(event) => setDraftTitle(event.target.value)}
                      className="w-full rounded-lg border border-border bg-transparent px-4 py-3 text-sm"
                      disabled={isEditingLocked}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Content
                    </label>
                    <ReactQuill
                      theme="snow"
                      value={draftContent}
                      onChange={setDraftContent}
                      readOnly={isEditingLocked}
                      className="rounded-lg border border-border bg-transparent text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Rich text editor supports image embeds for JPG and GIF.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground"
                      disabled={isEditingLocked}
                    >
                      Upload media
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground"
                      disabled={isEditingLocked}
                    >
                      Save draft
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-border px-4 py-2 text-sm text-destructive"
                      disabled={isEditingLocked}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
