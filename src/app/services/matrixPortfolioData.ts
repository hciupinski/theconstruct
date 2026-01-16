import { getSupabaseClient } from '../lib/supabaseClient';
import type { PortfolioLink } from './portfolioData';

export type MatrixPortfolioStatus = 'draft' | 'published';

export type MatrixPortfolioProject = {
  id: string;
  title: string;
  summary: string;
  description: string;
  techStack: string[];
  links: PortfolioLink[];
  status: MatrixPortfolioStatus;
  updatedAt: string;
  coverImage?: string | null;
};

type MatrixPortfolioRow = {
  id: string;
  title: string;
  summary: string;
  description: string;
  tech_stack: string[];
  links: PortfolioLink[];
  status: MatrixPortfolioStatus;
  updated_at: string;
  cover_image?: string | null;
};

type MatrixPortfolioInput = {
  title: string;
  summary: string;
  description: string;
  techStack: string[];
  links: PortfolioLink[];
  coverImage?: string | null;
};

type MatrixPortfolioUpdate = {
  title?: string;
  summary?: string;
  description?: string;
  techStack?: string[];
  links?: PortfolioLink[];
  coverImage?: string | null;
};

function mapPortfolioRow(row: MatrixPortfolioRow): MatrixPortfolioProject {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    description: row.description,
    techStack: row.tech_stack,
    links: row.links,
    status: row.status,
    updatedAt: row.updated_at,
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

export async function fetchMatrixPortfolioProjects(options?: {
  signal?: AbortSignal;
}): Promise<MatrixPortfolioProject[]> {
  const supabase = await requireMatrixSession();

  if (options?.signal?.aborted) {
    return [];
  }

  const { data: rows, error } = await supabase
    .from('portfolio_projects')
    .select(
      'id,title,summary,description,tech_stack,links,status,updated_at,cover_image'
    )
    .order('updated_at', { ascending: false });

  if (error || !rows) {
    throw new Error('Failed to load portfolio projects from Supabase.');
  }

  return (rows as MatrixPortfolioRow[]).map(mapPortfolioRow);
}

export async function createMatrixPortfolioProject(
  input: MatrixPortfolioInput
): Promise<MatrixPortfolioProject> {
  const supabase = await requireMatrixSession();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('portfolio_projects')
    .insert({
      title: input.title,
      summary: input.summary,
      description: input.description,
      tech_stack: input.techStack,
      links: input.links,
      status: 'draft',
      updated_at: now,
      cover_image: input.coverImage ?? null,
    })
    .select(
      'id,title,summary,description,tech_stack,links,status,updated_at,cover_image'
    )
    .single();

  if (error || !data) {
    throw new Error('Failed to create portfolio project.');
  }

  return mapPortfolioRow(data as MatrixPortfolioRow);
}

export async function updateMatrixPortfolioProject(
  id: string,
  updates: MatrixPortfolioUpdate
): Promise<MatrixPortfolioProject> {
  const supabase = await requireMatrixSession();
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.title !== undefined) {
    payload.title = updates.title;
  }

  if (updates.summary !== undefined) {
    payload.summary = updates.summary;
  }

  if (updates.description !== undefined) {
    payload.description = updates.description;
  }

  if (updates.techStack !== undefined) {
    payload.tech_stack = updates.techStack;
  }

  if (updates.links !== undefined) {
    payload.links = updates.links;
  }

  if (updates.coverImage !== undefined) {
    payload.cover_image = updates.coverImage;
  }

  const { data, error } = await supabase
    .from('portfolio_projects')
    .update(payload)
    .eq('id', id)
    .select(
      'id,title,summary,description,tech_stack,links,status,updated_at,cover_image'
    )
    .single();

  if (error || !data) {
    throw new Error('Failed to update portfolio project.');
  }

  return mapPortfolioRow(data as MatrixPortfolioRow);
}

export async function publishMatrixPortfolioProject(
  id: string
): Promise<MatrixPortfolioProject> {
  const supabase = await requireMatrixSession();
  const timestamp = new Date().toISOString();
  const { data, error } = await supabase
    .from('portfolio_projects')
    .update({
      status: 'published',
      published_at: timestamp,
      updated_at: timestamp,
    })
    .eq('id', id)
    .select(
      'id,title,summary,description,tech_stack,links,status,updated_at,cover_image'
    )
    .single();

  if (error || !data) {
    throw new Error('Failed to publish portfolio project.');
  }

  return mapPortfolioRow(data as MatrixPortfolioRow);
}
