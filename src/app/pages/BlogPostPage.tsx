import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchBlogPostById, type BlogPost } from '../services/blogData';
import TagList from '../components/ui/TagList';

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogPostPage() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) {
      setLoadState('error');
      setErrorMessage('Missing blog post identifier.');
      return;
    }

    const controller = new AbortController();

    const loadPost = async () => {
      try {
        setLoadState('loading');
        setErrorMessage(null);
        const data = await fetchBlogPostById(postId, {
          signal: controller.signal,
        });
        setPost(data);
        setLoadState('ready');
      } catch (error) {
        if (controller.signal.aborted) return;
        setLoadState('error');
        setErrorMessage(
          error instanceof Error ? error.message : 'Unable to load post.'
        );
      }
    };

    loadPost();

    return () => controller.abort();
  }, [postId]);

  const formattedDate = useMemo(() => {
    if (!post) return '';
    return formatDate(post.publishedAt);
  }, [post]);

  return (
    <main className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <span className="text-base">←</span>
            Back to all posts
          </Link>
        </div>

        {loadState === 'loading' && (
          <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
              <span>Loading post...</span>
            </div>
          </div>
        )}

        {loadState === 'error' && (
          <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            {errorMessage ?? 'Unable to load post right now.'}
          </div>
        )}

        {post && loadState === 'ready' && (
          <article className="space-y-8">
            <header className="space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {formattedDate}
              </p>
              <h1 className="text-3xl sm:text-4xl leading-tight">
                {post.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
              <TagList items={post.tags} />
            </header>

            {post.coverImage && (
              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            <div
              className="space-y-5 text-base leading-7 text-foreground/90"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        )}
      </div>
    </main>
  );
}
