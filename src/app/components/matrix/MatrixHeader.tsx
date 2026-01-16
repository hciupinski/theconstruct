type MatrixHeaderProps = {
  onSignOut: () => void;
  isSigningOut: boolean;
  signOutError: string | null;
};

export default function MatrixHeader({
  onSignOut,
  isSigningOut,
  signOutError,
}: MatrixHeaderProps) {
  return (
    <header className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Matrix
          </p>
          <h1 className="text-3xl">Authoring Console</h1>
        </div>
        <button
          type="button"
          className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground"
          onClick={onSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? 'Signing out...' : 'Log out'}
        </button>
      </div>
      <p className="text-muted-foreground">
        Draft posts, approve releases, and manage assets with gated access.
      </p>
      {signOutError && (
        <p className="text-sm text-destructive">{signOutError}</p>
      )}
    </header>
  );
}
