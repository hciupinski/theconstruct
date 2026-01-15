export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  tags: string[];
  coverImage?: string;
};

const mockBlogPosts: BlogPost[] = [
  {
    id: 'resilient-systems',
    title: 'Designing resilient systems',
    excerpt:
      'Notes on resiliency patterns for modern cloud architectures and critical services.',
    content:
      'This is a placeholder for the full post content. It will be replaced by CMS or Supabase data.',
    publishedAt: '2024-05-10',
    tags: ['Architecture', 'Resilience', 'Cloud'],
  },
  {
    id: 'full-stack-observability',
    title: 'Full-stack observability',
    excerpt:
      'How to instrument frontend and backend services for faster debugging.',
    content:
      'This is a placeholder for the full post content. It will be replaced by CMS or Supabase data.',
    publishedAt: '2024-05-18',
    tags: ['Observability', 'Frontend', 'Backend'],
  },
];

async function fetchBlogPostsMock(options?: {
  signal?: AbortSignal;
}): Promise<BlogPost[]> {
  const payload = encodeURIComponent(JSON.stringify(mockBlogPosts));
  const response = await fetch(`data:application/json,${payload}`, {
    signal: options?.signal,
  });

  if (!response.ok) {
    throw new Error('Failed to load blog posts.');
  }

  return (await response.json()) as BlogPost[];
}

async function fetchBlogPostsFromSupabase(options?: {
  signal?: AbortSignal;
}): Promise<BlogPost[]> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase env vars are missing.');
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/blog_posts?select=*`, {
    signal: options?.signal,
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to load blog posts from Supabase.');
  }

  const rows = (await response.json()) as Array<{
    id: string;
    title: string;
    excerpt: string;
    content: string;
    published_at: string;
    tags: string[];
    cover_image?: string;
  }>;

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    publishedAt: row.published_at,
    tags: row.tags,
    coverImage: row.cover_image,
  }));
}

export async function fetchBlogPosts(options?: {
  signal?: AbortSignal;
}): Promise<BlogPost[]> {
  const dataSource = import.meta.env.VITE_BLOG_SOURCE ?? 'mock';

  if (dataSource === 'supabase') {
    return fetchBlogPostsFromSupabase(options);
  }

  return fetchBlogPostsMock(options);
}
