import { useEffect, useMemo, useState } from 'react';
import {
  createMatrixPost,
  fetchMatrixPosts,
  publishMatrixPost,
  updateMatrixPost,
  type MatrixPost,
} from '../services/matrixData';
import {
  createMatrixPortfolioProject,
  fetchMatrixPortfolioProjects,
  publishMatrixPortfolioProject,
  updateMatrixPortfolioProject,
  type MatrixPortfolioProject,
} from '../services/matrixPortfolioData';
import type { PortfolioLink } from '../services/portfolioData';
import { getSupabaseClient } from '../lib/supabaseClient';
import MatrixHeader from '../components/matrix/MatrixHeader';
import MatrixPortfolioEditor from '../components/matrix/MatrixPortfolioEditor';
import MatrixPortfolioList from '../components/matrix/MatrixPortfolioList';
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
  const [portfolioLoadState, setPortfolioLoadState] =
    useState<LoadState>('idle');
  const [portfolioLoadError, setPortfolioLoadError] = useState<string | null>(
    null
  );
  const [portfolioProjects, setPortfolioProjects] = useState<
    MatrixPortfolioProject[]
  >([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [draftProjectTitle, setDraftProjectTitle] = useState('');
  const [draftProjectSummary, setDraftProjectSummary] = useState('');
  const [draftProjectDescription, setDraftProjectDescription] = useState('');
  const [draftProjectTechStackInput, setDraftProjectTechStackInput] =
    useState('');
  const [draftProjectLinksInput, setDraftProjectLinksInput] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [showProjectValidation, setShowProjectValidation] = useState(false);
  const [portfolioSaveState, setPortfolioSaveState] =
    useState<LoadState>('idle');
  const [portfolioSaveError, setPortfolioSaveError] = useState<string | null>(
    null
  );
  const [portfolioCreateState, setPortfolioCreateState] =
    useState<LoadState>('idle');
  const [portfolioCreateError, setPortfolioCreateError] =
    useState<string | null>(null);
  const [portfolioPublishState, setPortfolioPublishState] =
    useState<LoadState>('idle');
  const [portfolioPublishError, setPortfolioPublishError] =
    useState<string | null>(null);
  const [isPortfolioPublishModalOpen, setIsPortfolioPublishModalOpen] =
    useState(false);
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

  useEffect(() => {
    const controller = new AbortController();

    const loadProjects = async () => {
      try {
        setPortfolioLoadError(null);
        setPortfolioLoadState('loading');
        const data = await fetchMatrixPortfolioProjects({
          signal: controller.signal,
        });
        setPortfolioProjects(data);
        setPortfolioLoadState('ready');
        setSelectedProjectId(data[0]?.id ?? null);
      } catch (error) {
        if (controller.signal.aborted) return;
        const message =
          error instanceof Error
            ? error.message
            : 'Unable to load projects.';
        setPortfolioLoadError(message);
        setPortfolioLoadState('error');
      }
    };

    loadProjects();

    return () => controller.abort();
  }, []);

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) ?? null,
    [posts, selectedPostId]
  );

  const selectedProject = useMemo(
    () =>
      portfolioProjects.find((project) => project.id === selectedProjectId) ??
      null,
    [portfolioProjects, selectedProjectId]
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

  useEffect(() => {
    if (!selectedProject) return;
    setIsCreatingProject(false);
    setDraftProjectTitle(selectedProject.title);
    setDraftProjectSummary(selectedProject.summary);
    setDraftProjectDescription(selectedProject.description);
    setDraftProjectTechStackInput(selectedProject.techStack.join(', '));
    setDraftProjectLinksInput(
      selectedProject.links
        .map((link) => `${link.label} | ${link.href}`)
        .join('\n')
    );
    setShowProjectValidation(false);
    setPortfolioSaveError(null);
    setPortfolioCreateError(null);
    setPortfolioPublishError(null);
  }, [selectedProject]);

  const isEditingLocked = selectedPost?.status === 'published';
  const isProjectEditingLocked = selectedProject?.status === 'published';
  const isSigningOut = signOutState === 'loading';
  const isSaving = saveState === 'loading';
  const isCreating = createState === 'loading';
  const isPublishing = publishState === 'loading';
  const isPortfolioSaving = portfolioSaveState === 'loading';
  const isPortfolioCreating = portfolioCreateState === 'loading';
  const isPortfolioPublishing = portfolioPublishState === 'loading';

  const normalizeTags = (value: string) =>
    value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

  const normalizeTechStack = (value: string) =>
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const parseLinksInput = (value: string) =>
    value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [labelPart, hrefPart] = line
          .split('|')
          .map((part) => part.trim());
        return {
          label: labelPart ?? '',
          href: hrefPart ?? '',
        } as PortfolioLink;
      });

  const isValidUrl = (value: string) => {
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

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

  const getMissingProjectFields = (project: MatrixPortfolioProject) => {
    const missing: string[] = [];

    if (!project.title.trim()) {
      missing.push('title');
    }

    if (!project.summary.trim()) {
      missing.push('summary');
    }

    if (!project.description.trim()) {
      missing.push('description');
    }

    if (!project.techStack.length) {
      missing.push('tech stack');
    }

    if (!project.links.length) {
      missing.push('links');
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

  const resetProjectDraftForm = () => {
    setDraftProjectTitle('');
    setDraftProjectSummary('');
    setDraftProjectDescription('');
    setDraftProjectTechStackInput('');
    setDraftProjectLinksInput('');
    setShowProjectValidation(false);
    setPortfolioSaveError(null);
    setPortfolioCreateError(null);
    setPortfolioPublishError(null);
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

  const projectValidation = useMemo(() => {
    const errors: Partial<
      Record<'title' | 'summary' | 'description' | 'techStack' | 'links', string>
    > = {};
    const techStack = normalizeTechStack(draftProjectTechStackInput);
    const links = parseLinksInput(draftProjectLinksInput);
    const invalidLinks = links.filter(
      (link) => !link.label || !link.href || !isValidUrl(link.href)
    );

    if (!draftProjectTitle.trim()) {
      errors.title = 'Title is required.';
    }

    if (!draftProjectSummary.trim()) {
      errors.summary = 'Summary is required.';
    }

    if (!draftProjectDescription.trim()) {
      errors.description = 'Description is required.';
    }

    if (techStack.length === 0) {
      errors.techStack = 'At least one tool is required.';
    }

    if (links.length === 0) {
      errors.links = 'At least one link is required.';
    } else if (invalidLinks.length > 0) {
      errors.links = 'Each link must include a label and valid URL.';
    }

    return {
      errors,
      isValid: Object.keys(errors).length === 0,
      techStack,
      links,
    };
  }, [
    draftProjectDescription,
    draftProjectLinksInput,
    draftProjectSummary,
    draftProjectTechStackInput,
    draftProjectTitle,
  ]);

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

  const handleStartNewProjectDraft = () => {
    setSelectedProjectId(null);
    setIsCreatingProject(true);
    resetProjectDraftForm();
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

  const handleCreateProjectDraft = async () => {
    if (isPortfolioCreating || isPortfolioSaving || isPortfolioPublishing) {
      return;
    }

    if (!projectValidation.isValid) {
      setShowProjectValidation(true);
      return;
    }

    try {
      setPortfolioCreateError(null);
      setPortfolioCreateState('loading');
      const newProject = await createMatrixPortfolioProject({
        title: draftProjectTitle.trim(),
        summary: draftProjectSummary.trim(),
        description: draftProjectDescription.trim(),
        techStack: projectValidation.techStack,
        links: projectValidation.links,
      });
      setPortfolioProjects((prev) => [newProject, ...prev]);
      setSelectedProjectId(newProject.id);
      setIsCreatingProject(false);
      setPortfolioCreateState('ready');
      setShowProjectValidation(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create project.';
      setPortfolioCreateError(message);
      setPortfolioCreateState('error');
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

  const handlePublishProjectDraft = async () => {
    if (isPortfolioPublishing || isPortfolioSaving || isPortfolioCreating) {
      return;
    }

    if (!selectedProjectId || !selectedProject) {
      setPortfolioPublishError('Select a draft to publish.');
      setPortfolioPublishState('error');
      return;
    }

    if (selectedProject.status !== 'draft') {
      setPortfolioPublishError('Only draft projects can be published.');
      setPortfolioPublishState('error');
      return;
    }

    if (!projectValidation.isValid) {
      setShowProjectValidation(true);
      return;
    }

    try {
      setPortfolioPublishError(null);
      setPortfolioPublishState('loading');
      const publishedProject = await publishMatrixPortfolioProject(
        selectedProjectId
      );
      const refreshedProjects = await fetchMatrixPortfolioProjects();
      setPortfolioProjects(refreshedProjects);
      setSelectedProjectId(publishedProject.id);
      setPortfolioPublishState('ready');
      setIsPortfolioPublishModalOpen(false);
      setShowProjectValidation(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to publish project.';
      setPortfolioPublishError(message);
      setPortfolioPublishState('error');
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

  const handleSaveProjectDraft = async () => {
    if (isPortfolioSaving || isPortfolioCreating || isPortfolioPublishing) {
      return;
    }

    if (!selectedProjectId) {
      setPortfolioSaveError('Select a project to save.');
      setPortfolioSaveState('error');
      return;
    }

    if (!selectedProject || selectedProject.status !== 'draft') {
      setPortfolioSaveError('Only draft projects can be updated.');
      setPortfolioSaveState('error');
      return;
    }

    if (!projectValidation.isValid) {
      setShowProjectValidation(true);
      return;
    }

    try {
      setPortfolioSaveError(null);
      setPortfolioSaveState('loading');
      const updatedProject = await updateMatrixPortfolioProject(
        selectedProjectId,
        {
          title: draftProjectTitle.trim(),
          summary: draftProjectSummary.trim(),
          description: draftProjectDescription.trim(),
          techStack: projectValidation.techStack,
          links: projectValidation.links,
        }
      );
      const refreshedProjects = await fetchMatrixPortfolioProjects();
      setPortfolioProjects(refreshedProjects);
      setSelectedProjectId(updatedProject.id);
      setPortfolioSaveState('ready');
      setShowProjectValidation(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to save project.';
      setPortfolioSaveError(message);
      setPortfolioSaveState('error');
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
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <MatrixPortfolioList
              projects={portfolioProjects}
              loadState={portfolioLoadState}
              loadError={portfolioLoadError}
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
              onCreateNew={handleStartNewProjectDraft}
              isCreateDisabled={isPortfolioCreating || isPortfolioSaving}
              getMissingFields={getMissingProjectFields}
            />

            <MatrixPortfolioEditor
              selectedProject={selectedProject}
              isCreatingNew={isCreatingProject}
              isEditingLocked={isProjectEditingLocked}
              draftTitle={draftProjectTitle}
              draftSummary={draftProjectSummary}
              draftDescription={draftProjectDescription}
              draftTechStackInput={draftProjectTechStackInput}
              draftLinksInput={draftProjectLinksInput}
              onTitleChange={setDraftProjectTitle}
              onSummaryChange={setDraftProjectSummary}
              onDescriptionChange={setDraftProjectDescription}
              onTechStackChange={setDraftProjectTechStackInput}
              onLinksChange={setDraftProjectLinksInput}
              showValidation={showProjectValidation}
              validation={projectValidation}
              onOpenPublishModal={() => setIsPortfolioPublishModalOpen(true)}
              isPublishing={isPortfolioPublishing}
              isSaving={isPortfolioSaving}
              isCreating={isPortfolioCreating}
              onSave={
                isCreatingProject ? handleCreateProjectDraft : handleSaveProjectDraft
              }
              saveError={portfolioSaveError}
              createError={portfolioCreateError}
              publishError={portfolioPublishError}
            />
          </div>
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
        entityLabel="post"
      />

      <MatrixPublishModal
        isOpen={isPortfolioPublishModalOpen}
        isPublishing={isPortfolioPublishing}
        publishError={portfolioPublishError}
        onClose={() => setIsPortfolioPublishModalOpen(false)}
        onPublish={handlePublishProjectDraft}
        entityLabel="project"
      />
    </main>
  );
}
