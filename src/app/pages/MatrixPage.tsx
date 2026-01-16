import { useEffect, useMemo, useState } from 'react';
import {
  createMatrixPost,
  fetchMatrixPosts,
  publishMatrixPost,
  updateMatrixPost,
  type MatrixPost,
} from '../services/matrixData';
import { getSupabaseClient } from '../lib/supabaseClient';
import MatrixHeader from '../components/matrix/MatrixHeader';
import MatrixPostEditor from '../components/matrix/MatrixPostEditor';
import MatrixPostsList from '../components/matrix/MatrixPostsList';
import MatrixPublishModal from '../components/matrix/MatrixPublishModal';
import MatrixTabs from '../components/matrix/MatrixTabs';
import type { LoadState, MatrixTab } from '../components/matrix/matrixTypes';

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
        <MatrixHeader
          onSignOut={handleSignOut}
          isSigningOut={isSigningOut}
          signOutError={signOutError}
        />

        <MatrixTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'portfolio' && (
          <section className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            Portfolio authoring will live here. This button is a placeholder for
            future routing or modal flows.
          </section>
        )}

        {activeTab === 'posts' && (
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <MatrixPostsList
              posts={posts}
              loadState={loadState}
              loadError={loadError}
              selectedPostId={selectedPostId}
              onSelectPost={setSelectedPostId}
              onCreateNew={handleStartNewDraft}
              isCreateDisabled={isCreating || isSaving}
              getMissingFields={getMissingFields}
            />

            <MatrixPostEditor
              selectedPost={selectedPost}
              isCreatingNew={isCreatingNew}
              isEditingLocked={isEditingLocked}
              draftTitle={draftTitle}
              draftExcerpt={draftExcerpt}
              draftContent={draftContent}
              draftTagsInput={draftTagsInput}
              onTitleChange={setDraftTitle}
              onExcerptChange={setDraftExcerpt}
              onContentChange={setDraftContent}
              onTagsChange={setDraftTagsInput}
              showValidation={showValidation}
              validation={validation}
              onOpenPublishModal={() => setIsPublishModalOpen(true)}
              isPublishing={isPublishing}
              isSaving={isSaving}
              isCreating={isCreating}
              onSave={isCreatingNew ? handleCreateDraft : handleSaveDraft}
              saveError={saveError}
              createError={createError}
              publishError={publishError}
            />
          </div>
        )}
      </div>

      <MatrixPublishModal
        isOpen={isPublishModalOpen}
        isPublishing={isPublishing}
        publishError={publishError}
        onClose={() => setIsPublishModalOpen(false)}
        onPublish={handlePublishDraft}
      />
    </main>
  );
}
