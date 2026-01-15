const placeholderPosts = [
  {
    title: 'Designing resilient systems',
    excerpt: 'Notes on resiliency patterns for modern cloud architectures.',
    date: '2024-05-10',
  },
  {
    title: 'Full-stack observability',
    excerpt: 'How to instrument frontend and backend for faster debugging.',
    date: '2024-05-18',
  },
];

export default function BlogPage() {
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
          {placeholderPosts.map((post) => (
            <article
              key={post.title}
              className="rounded-lg border border-border bg-card p-5"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {post.date}
              </p>
              <h2 className="mt-2 text-xl">{post.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {post.excerpt}
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
