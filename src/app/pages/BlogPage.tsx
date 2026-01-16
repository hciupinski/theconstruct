import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlogPosts, type BlogPost } from './blogData';

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('idle');

  useEffect(() => {
    const controller = new AbortController();

    const loadPosts = async () => {
      try {
        setLoadState('loading');
        const data = await fetchBlogPosts({ signal: controller.signal });
        setPosts(data);
        setLoadState('ready');
      } catch (error) {
        if (controller.signal.aborted) return;
        setLoadState('error');
      }
    };

    loadPosts();

    return () => controller.abort();
  }, []);

  return (
    <main className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Blog
          </p>
          <h1 className="text-3xl">Notes and Articles</h1>
          <p className="text-muted-foreground">
            Published posts will appear here for public reading.
          </p>
        </header>
        <section className="space-y-4">
          {loadState === 'loading' && (
            <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
                <span>Loading posts...</span>
              </div>
            </div>
          )}
          {loadState === 'error' && (
            <div className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
              Unable to load posts right now.
            </div>
          )}
          {posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`}>
              <article className="rounded-lg border border-border bg-card p-5 transition hover:border-foreground/30 hover:bg-card/80">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {post.publishedAt}
                </p>
                <h2 className="mt-2 text-xl">{post.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
