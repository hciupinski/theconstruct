export default function ArchitectPage() {
  return (
    <main className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Resume
          </p>
          <h1 className="text-3xl">Architect Profile</h1>
          <p className="text-muted-foreground">
            This page will host the resume layout and the full architect-focused
            profile.
          </p>
        </header>
        <section className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          Resume sections: summary, experience, architecture highlights, and
          certifications.
        </section>
      </div>
    </main>
  );
}
