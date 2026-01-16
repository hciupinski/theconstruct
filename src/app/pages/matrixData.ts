import { getSupabaseClient } from '../lib/supabaseClient';

export type MatrixPostStatus = 'draft' | 'published';

export type MatrixPost = {
  id: string;
  title: string;
  excerpt: string;
  status: MatrixPostStatus;
  content: string;
  updatedAt: string;
  tags: string[];
  coverImage?: string | null;
};

type MatrixPostRow = {
  id: string;
  title: string;
  excerpt: string;
  status: MatrixPostStatus;
  content: string;
  updated_at: string;
  tags: string[];
  cover_image?: string | null;
};

type MatrixPostInput = {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  coverImage?: string | null;
};

type MatrixPostUpdate = {
  title?: string;
  excerpt?: string;
  content?: string;
  tags?: string[];
  coverImage?: string | null;
};

function mapMatrixRow(row: MatrixPostRow): MatrixPost {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    status: row.status,
    content: row.content,
    updatedAt: row.updated_at,
    tags: row.tags,
    coverImage: row.cover_image,
  };
}

async function requireMatrixSession() {
  const supabase = getSupabaseClient();
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    throw new Error('Failed to read auth session.');
  }

  if (!sessionData.session) {
    throw new Error('Not authenticated.');
  }

  return supabase;
}

export async function fetchMatrixPosts(options?: {
  signal?: AbortSignal;
}): Promise<MatrixPost[]> {
  const supabase = await requireMatrixSession();

  if (options?.signal?.aborted) {
    return [];
  }

  const { data: rows, error } = await supabase
    .from('blog_posts')
    .select('id,title,excerpt,status,content,updated_at,tags,cover_image')
    .order('updated_at', { ascending: false });

  if (error || !rows) {
    throw new Error('Failed to load matrix posts from Supabase.');
  }

  return (rows as MatrixPostRow[]).map(mapMatrixRow);
}

export async function createMatrixPost(
  input: MatrixPostInput
): Promise<MatrixPost> {
  const supabase = await requireMatrixSession();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      tags: input.tags,
      status: 'draft',
      updated_at: now,
      cover_image: input.coverImage ?? null,
    })
    .select('id,title,excerpt,status,content,updated_at,tags,cover_image')
    .single();

  if (error || !data) {
    throw new Error('Failed to create matrix post.');
  }

  return mapMatrixRow(data as MatrixPostRow);
}

export async function updateMatrixPost(
  id: string,
  updates: MatrixPostUpdate
): Promise<MatrixPost> {
  const supabase = await requireMatrixSession();
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.title !== undefined) {
    payload.title = updates.title;
  }

  if (updates.content !== undefined) {
    payload.content = updates.content;
  }

  if (updates.excerpt !== undefined) {
    payload.excerpt = updates.excerpt;
  }

  if (updates.tags !== undefined) {
    payload.tags = updates.tags;
  }

  if (updates.coverImage !== undefined) {
    payload.cover_image = updates.coverImage;
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .update(payload)
    .eq('id', id)
    .select('id,title,excerpt,status,content,updated_at,tags,cover_image')
    .single();

  if (error || !data) {
    throw new Error('Failed to update matrix post.');
  }

  return mapMatrixRow(data as MatrixPostRow);
}

export async function publishMatrixPost(id: string): Promise<MatrixPost> {
  const supabase = await requireMatrixSession();
  const timestamp = new Date().toISOString();
  const { data, error } = await supabase
    .from('blog_posts')
    .update({
      status: 'published',
      published_at: timestamp,
      updated_at: timestamp,
    })
    .eq('id', id)
    .select('id,title,excerpt,status,content,updated_at,tags,cover_image')
    .single();

  if (error || !data) {
    throw new Error('Failed to publish matrix post.');
  }

  return mapMatrixRow(data as MatrixPostRow);
}
