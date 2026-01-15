import { useEffect, useState } from 'react';
import {
  fetchPortfolioProjects,
  type PortfolioProject,
} from './portfolioData';

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

export default function PortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [selectedProject, setSelectedProject] =
    useState<PortfolioProject | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadProjects = async () => {
      try {
        setLoadState('loading');
        const data = await fetchPortfolioProjects({
          signal: controller.signal,
        });
        setProjects(data);
        setLoadState('ready');
      } catch (error) {
        if (controller.signal.aborted) return;
        setLoadState('error');
      }
    };

    loadProjects();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedProject(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedProject]);

  return (
    <main className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Portfolio
          </p>
          <h1 className="text-3xl">Project Highlights</h1>
          <p className="text-muted-foreground">
            Each card opens a modal with description, tech stack, and links.
          </p>
        </header>
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loadState === 'loading' && (
            <div className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
              Loading projects...
            </div>
          )}
          {loadState === 'error' && (
            <div className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
              Unable to load projects right now.
            </div>
          )}
          {projects.map((project) => (
            <article
              key={project.id}
              className="rounded-lg border border-border bg-card p-5 shadow-sm"
            >
              <h2 className="text-lg">{project.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {project.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <button
                className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                type="button"
                onClick={() => setSelectedProject(project)}
                aria-haspopup="dialog"
              >
                View details
              </button>
            </article>
          ))}
        </section>
      </div>
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-modal-title"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="w-full max-w-2xl rounded-lg bg-card p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Project
                </p>
                <h2 id="portfolio-modal-title" className="text-2xl">
                  {selectedProject.title}
                </h2>
              </div>
              <button
                type="button"
                className="text-sm text-muted-foreground"
                onClick={() => setSelectedProject(null)}
                aria-label="Close project details"
              >
                Close
              </button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {selectedProject.description}
            </p>
            <div className="mt-6">
              <h3 className="text-sm font-medium">Tech stack</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedProject.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <h3 className="text-sm font-medium">Links</h3>
              <div className="flex flex-wrap gap-3 text-sm">
                {selectedProject.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-primary underline underline-offset-4"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
