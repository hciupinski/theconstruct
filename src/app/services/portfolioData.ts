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

const mockPortfolioProjects: PortfolioProject[] = [
  {
    id: 'cloud-architecture',
    title: 'Cloud Architecture Blueprint',
    summary: 'Reference architecture for secure, multi-tenant platforms.',
    description:
      'Designed a reusable cloud blueprint with zero-trust networking, layered observability, and CI/CD guardrails.',
    techStack: ['Azure', '.NET', 'Terraform', 'OpenTelemetry'],
    links: [
      { label: 'Project', href: 'https://example.com/cloud-architecture' },
      { label: 'GitHub', href: 'https://github.com/example/cloud-architecture' },
    ],
  },
  {
    id: 'secure-payments',
    title: 'Secure Payments Platform',
    summary: 'PCI-focused payments workflow with automated risk scoring.',
    description:
      'Implemented event-driven workflows, tokenized storage, and real-time fraud signals for a payment gateway.',
    techStack: ['.NET', 'Postgres', 'Kafka', 'Vault'],
    links: [
      { label: 'Project', href: 'https://example.com/payments' },
      { label: 'GitHub', href: 'https://github.com/example/payments' },
    ],
  },
  {
    id: 'portfolio-os',
    title: 'Portfolio OS',
    summary: 'Interactive portfolio experience with 3D and motion.',
    description:
      'Built a 3D-first interface with custom animations, scroll-driven storytelling, and performance budgets.',
    techStack: ['React', 'Three.js', 'Vite', 'Tailwind'],
    links: [
      { label: 'Project', href: 'https://example.com/portfolio-os' },
      { label: 'GitHub', href: 'https://github.com/example/portfolio-os' },
    ],
  },
];

async function fetchPortfolioProjectsMock(options?: {
  signal?: AbortSignal;
}): Promise<PortfolioProject[]> {
  const payload = encodeURIComponent(JSON.stringify(mockPortfolioProjects));
  const response = await fetch(`data:application/json,${payload}`, {
    signal: options?.signal,
  });

  if (!response.ok) {
    throw new Error('Failed to load portfolio projects.');
  }

  return (await response.json()) as PortfolioProject[];
}

async function fetchPortfolioProjectsFromSupabase(options?: {
  signal?: AbortSignal;
}): Promise<PortfolioProject[]> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase env vars are missing.');
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/portfolio_projects?select=*`,
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
  const dataSource = import.meta.env.VITE_PORTFOLIO_SOURCE ?? 'mock';

  if (dataSource === 'supabase') {
    return fetchPortfolioProjectsFromSupabase(options);
  }

  return fetchPortfolioProjectsMock(options);
}
