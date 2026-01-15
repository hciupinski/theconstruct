const placeholderCards = ['Project One', 'Project Two', 'Project Three'];

export default function PortfolioPage() {
  return (
    <main className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Portfolio
          </p>
          <h1 className="text-3xl">Project Highlights</h1>
          <p className="text-muted-foreground">
            Each card will open a modal with full project details and links.
          </p>
        </header>
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {placeholderCards.map((title) => (
            <div
              key={title}
              className="rounded-lg border border-border bg-card p-5 shadow-sm"
            >
              <h2 className="text-lg">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Description, tech stack, and links will appear in the modal.
              </p>
              <button
                className="mt-4 inline-flex items-center text-sm font-medium text-primary"
                type="button"
              >
                View details
              </button>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
