import { useEffect, useMemo, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  createMatrixPost,
  fetchMatrixPosts,
  publishMatrixPost,
  updateMatrixPost,
  type MatrixPost,
} from './matrixData';
import { getSupabaseClient } from '../lib/supabaseClient';

type LoadState = 'idle' | 'loading' | 'ready' | 'error';
type MatrixTab = 'posts' | 'portfolio';

export default function MatrixPage() {
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [posts, setPosts] = useState<MatrixPost[]>([]);
  const [activeTab, setActiveTab] = useState<MatrixTab>('posts');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftExcerpt, setDraftExcerpt] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [draftTagsInput, setDraftTagsInput] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [saveState, setSaveState] = useState<LoadState>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [createState, setCreateState] = useState<LoadState>('idle');
  const [createError, setCreateError] = useState<string | null>(null);
  const [publishState, setPublishState] = useState<LoadState>('idle');
  const [publishError, setPublishError] = useState<string | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [signOutState, setSignOutState] = useState<LoadState>('idle');
  const [signOutError, setSignOutError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadPosts = async () => {
      try {
        setLoadError(null);
        setLoadState('loading');
        const data = await fetchMatrixPosts({ signal: controller.signal });
        setPosts(data);
        setLoadState('ready');
        setSelectedPostId(data[0]?.id ?? null);
      } catch (error) {
        if (controller.signal.aborted) return;
        const message =
          error instanceof Error
            ? error.message
            : 'Unable to load posts.';
        setLoadError(message);
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
    setIsCreatingNew(false);
    setDraftTitle(selectedPost.title);
    setDraftExcerpt(selectedPost.excerpt);
    setDraftContent(selectedPost.content);
    setDraftTagsInput(selectedPost.tags.join(', '));
    setShowValidation(false);
    setSaveError(null);
    setCreateError(null);
    setPublishError(null);
  }, [selectedPost]);

  const isEditingLocked = selectedPost?.status === 'published';
  const isSigningOut = signOutState === 'loading';
  const isSaving = saveState === 'loading';
  const isCreating = createState === 'loading';
  const isPublishing = publishState === 'loading';

  const normalizeTags = (value: string) =>
    value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

  const getContentText = (value: string) =>
    value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').trim();

  const getMissingFields = (post: MatrixPost) => {
    const missing: string[] = [];

    if (!post.title.trim()) {
      missing.push('title');
    }

    if (!post.excerpt.trim()) {
      missing.push('excerpt');
    }

    if (!getContentText(post.content)) {
      missing.push('content');
    }

    if (!post.tags.length) {
      missing.push('tags');
    }

    return missing;
  };

  const resetDraftForm = () => {
    setDraftTitle('');
    setDraftExcerpt('');
    setDraftContent('');
    setDraftTagsInput('');
    setShowValidation(false);
    setSaveError(null);
    setCreateError(null);
    setPublishError(null);
  };

  const validation = useMemo(() => {
    const errors: Partial<
      Record<'title' | 'excerpt' | 'content' | 'tags', string>
    > = {};
    const tags = normalizeTags(draftTagsInput);

    if (!draftTitle.trim()) {
      errors.title = 'Title is required.';
    }

    if (!draftExcerpt.trim()) {
      errors.excerpt = 'Excerpt is required.';
    }

    if (!getContentText(draftContent)) {
      errors.content = 'Content is required.';
    }

    if (tags.length === 0) {
      errors.tags = 'At least one tag is required.';
    }

    return {
      errors,
      isValid: Object.keys(errors).length === 0,
      tags,
    };
  }, [draftContent, draftExcerpt, draftTagsInput, draftTitle]);

  const handleSignOut = async () => {
    try {
      setSignOutError(null);
      setSignOutState('loading');
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      setSignOutState('ready');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to sign out.';
      setSignOutError(message);
      setSignOutState('error');
    }
  };

  const handleStartNewDraft = () => {
    setSelectedPostId(null);
    setIsCreatingNew(true);
    resetDraftForm();
  };

  const handleCreateDraft = async () => {
    if (isCreating || isSaving || isPublishing) {
      return;
    }

    if (!validation.isValid) {
      setShowValidation(true);
      return;
    }

    try {
      setCreateError(null);
      setCreateState('loading');
      const newPost = await createMatrixPost({
        title: draftTitle.trim(),
        excerpt: draftExcerpt.trim(),
        content: draftContent,
        tags: validation.tags,
      });
      setPosts((prev) => [newPost, ...prev]);
      setSelectedPostId(newPost.id);
      setIsCreatingNew(false);
      setCreateState('ready');
      setShowValidation(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create post.';
      setCreateError(message);
      setCreateState('error');
    }
  };

  const handlePublishDraft = async () => {
    if (isPublishing || isSaving || isCreating) {
      return;
    }

    if (!selectedPostId || !selectedPost) {
      setPublishError('Select a draft to publish.');
      setPublishState('error');
      return;
    }

    if (selectedPost.status !== 'draft') {
      setPublishError('Only draft posts can be published.');
      setPublishState('error');
      return;
    }

    if (!validation.isValid) {
      setShowValidation(true);
      return;
    }

    try {
      setPublishError(null);
      setPublishState('loading');
      const publishedPost = await publishMatrixPost(selectedPostId);
      const refreshedPosts = await fetchMatrixPosts();
      setPosts(refreshedPosts);
      setSelectedPostId(publishedPost.id);
      setPublishState('ready');
      setIsPublishModalOpen(false);
      setShowValidation(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to publish post.';
      setPublishError(message);
      setPublishState('error');
    }
  };

  const handleSaveDraft = async () => {
    if (isSaving || isCreating || isPublishing) {
      return;
    }

    if (!selectedPostId) {
      setSaveError('Select a post to save.');
      setSaveState('error');
      return;
    }

    if (!selectedPost || selectedPost.status !== 'draft') {
      setSaveError('Only draft posts can be updated.');
      setSaveState('error');
      return;
    }

    if (!validation.isValid) {
      setShowValidation(true);
      return;
    }

    try {
      setSaveError(null);
      setSaveState('loading');
      const updatedPost = await updateMatrixPost(selectedPostId, {
        title: draftTitle.trim(),
        excerpt: draftExcerpt.trim(),
        content: draftContent,
        tags: validation.tags,
      });
      const refreshedPosts = await fetchMatrixPosts();
      setPosts(refreshedPosts);
      setSelectedPostId(updatedPost.id);
      setSaveState('ready');
      setShowValidation(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to save post.';
      setSaveError(message);
      setSaveState('error');
    }
  };

  return (
    <main className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                Matrix
              </p>
              <h1 className="text-3xl">Authoring Console</h1>
            </div>
            <button
              type="button"
              className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? 'Signing out...' : 'Log out'}
            </button>
          </div>
          <p className="text-muted-foreground">
            Draft posts, approve releases, and manage assets with gated access.
          </p>
          {signOutError && (
            <p className="text-sm text-destructive">{signOutError}</p>
          )}
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
                  onClick={handleStartNewDraft}
                  disabled={isCreating || isSaving}
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
                  <p className="text-sm text-muted-foreground">
                    Loading posts...
                  </p>
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

            <section className="rounded-lg border border-border bg-card p-6">
              {!selectedPost && !isCreatingNew && (
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Select a post to view or edit content.</p>
                  <p>
                    Required fields: title, excerpt, content, and tags before
                    saving or approving.
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
                          : selectedPost.status === 'published'
                          ? 'Published'
                          : 'Draft'}
                      </p>
                      <h2 className="text-2xl">
                        {isCreatingNew
                          ? 'New draft'
                          : selectedPost.title}
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
                      onClick={() => setIsPublishModalOpen(true)}
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
                      onChange={(event) => setDraftTitle(event.target.value)}
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
                    onChange={(event) => setDraftExcerpt(event.target.value)}
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
                    onChange={setDraftContent}
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
                    onChange={(event) => setDraftTagsInput(event.target.value)}
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
                        onClick={
                          isCreatingNew ? handleCreateDraft : handleSaveDraft
                        }
                        disabled={
                          isSaving ||
                          isCreating ||
                          !validation.isValid
                        }
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
          </div>
        )}
      </div>

      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-6 py-8">
          <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl">
            <h3 className="text-lg">Publish this post?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Publishing is one-way. This will lock editing and set the
              published date.
            </p>
            {publishError && (
              <p className="mt-4 text-sm text-destructive">{publishError}</p>
            )}
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground"
                onClick={() => setIsPublishModalOpen(false)}
                disabled={isPublishing}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-full border border-border px-4 py-2 text-sm text-destructive"
                onClick={handlePublishDraft}
                disabled={isPublishing}
              >
                {isPublishing ? 'Publishing...' : 'Publish now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
