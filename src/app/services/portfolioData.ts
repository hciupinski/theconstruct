export type PortfolioLink = {
  label: string;
  href: string;
};

export type PortfolioProject = {
  id: string;
  title: string;
  summary: string;
  description: string;
  techStack: string[];
  links: PortfolioLink[];
  coverImage?: string;
};

async function fetchPortfolioProjectsFromSupabase(options?: {
  signal?: AbortSignal;
}): Promise<PortfolioProject[]> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase env vars are missing.');
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/portfolio_projects` +
      `?select=id,title,summary,description,tech_stack,links,cover_image` +
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
    throw new Error('Failed to load portfolio projects from Supabase.');
  }

  const rows = (await response.json()) as Array<{
    id: string;
    title: string;
    summary: string;
    description: string;
    tech_stack: string[];
    links: PortfolioLink[];
    cover_image?: string;
  }>;

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    summary: row.summary,
    description: row.description,
    techStack: row.tech_stack,
    links: row.links,
    coverImage: row.cover_image,
  }));
}

export async function fetchPortfolioProjects(options?: {
  signal?: AbortSignal;
}): Promise<PortfolioProject[]> {
  return fetchPortfolioProjectsFromSupabase(options);
}
