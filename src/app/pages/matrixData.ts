import { getSupabaseClient } from '../lib/supabaseClient';

export type MatrixPostStatus = 'draft' | 'published';

export type MatrixPost = {
  id: string;
  title: string;
  status: MatrixPostStatus;
  content: string;
  updatedAt: string;
  coverImage?: string;
};

type MatrixPostRow = {
  id: string;
  title: string;
  status: MatrixPostStatus;
  content: string;
  updated_at: string;
  cover_image?: string;
};

const mockMatrixPosts: MatrixPost[] = [
  {
    id: 'draft-001',
    title: 'Zero trust foundations',
    status: 'draft',
    content:
      'Draft notes on zero trust, identity-centric policies, and network segmentation.',
    updatedAt: '2024-06-01',
  },
  {
    id: 'published-002',
    title: 'Observability playbook',
    status: 'published',
    content:
      'Published article on full-stack observability. Editing is locked after approval.',
    updatedAt: '2024-05-22',
  },
];

async function fetchMatrixPostsMock(options?: {
  signal?: AbortSignal;
}): Promise<MatrixPost[]> {
  const payload = encodeURIComponent(JSON.stringify(mockMatrixPosts));
  const response = await fetch(`data:application/json,${payload}`, {
    signal: options?.signal,
  });

  if (!response.ok) {
    throw new Error('Failed to load matrix posts.');
  }

  return (await response.json()) as MatrixPost[];
}

async function fetchMatrixPostsFromSupabase(options?: {
  signal?: AbortSignal;
}): Promise<MatrixPost[]> {
  const supabase = getSupabaseClient();
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    throw new Error('Failed to read auth session.');
  }

  if (!sessionData.session) {
    throw new Error('Not authenticated.');
  }

  if (options?.signal?.aborted) {
    return [];
  }

  const { data: rows, error } = await supabase
    .from('blog_posts')
    .select('id,title,status,content,updated_at,cover_image')
    .order('updated_at', { ascending: false });

  if (error || !rows) {
    throw new Error('Failed to load matrix posts from Supabase.');
  }

  return (rows as MatrixPostRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    content: row.content,
    updatedAt: row.updated_at,
    coverImage: row.cover_image,
  }));
}

export async function fetchMatrixPosts(options?: {
  signal?: AbortSignal;
}): Promise<MatrixPost[]> {
  const dataSource = import.meta.env.VITE_MATRIX_SOURCE ?? 'mock';

  if (dataSource === 'supabase') {
    return fetchMatrixPostsFromSupabase(options);
  }

  return fetchMatrixPostsMock(options);
}
