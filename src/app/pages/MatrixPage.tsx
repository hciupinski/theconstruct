export default function MatrixPage() {
  return (
    <main className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Matrix
          </p>
          <h1 className="text-3xl">Authoring Console</h1>
          <p className="text-muted-foreground">
            Authenticated users will create and manage posts from this page.
          </p>
        </header>
        <section className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          Editor, media uploads, and post management tools will live here.
        </section>
      </div>
    </main>
  );
}
