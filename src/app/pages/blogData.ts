export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  tags: string[];
  coverImage?: string;
};

export async function fetchBlogPosts(options?: {
  signal?: AbortSignal;
}): Promise<BlogPost[]> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase env vars are missing.');
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/blog_posts` +
      `?select=id,title,excerpt,content,published_at,tags,cover_image` +
      `&status=eq.published&order=published_at.desc`,
    {
      signal: options?.signal,
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    }
  );

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

export async function fetchBlogPostById(
  id: string,
  options?: { signal?: AbortSignal }
): Promise<BlogPost> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase env vars are missing.');
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/blog_posts` +
      `?select=id,title,excerpt,content,published_at,tags,cover_image` +
      `&id=eq.${encodeURIComponent(id)}` +
      `&status=eq.published&limit=1`,
    {
      signal: options?.signal,
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to load blog post from Supabase.');
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

  const row = rows[0];
  if (!row) {
    throw new Error('Blog post not found.');
  }

  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    publishedAt: row.published_at,
    tags: row.tags,
    coverImage: row.cover_image,
  };
}
