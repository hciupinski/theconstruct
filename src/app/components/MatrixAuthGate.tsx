import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '../lib/supabaseClient';

type AuthStatus = 'loading' | 'signed-out' | 'signed-in' | 'error';

type MatrixAuthGateProps = {
  children: ReactNode;
};

export default function MatrixAuthGate({ children }: MatrixAuthGateProps) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<Session | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const allowedEmail = useMemo(
    () => import.meta.env.VITE_MATRIX_ALLOWED_EMAIL?.toLowerCase() ?? null,
    []
  );

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | null = null;

    const initAuth = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        let resolvedSession = data.session;

        if (resolvedSession) {
          const { data: userData, error: userError } =
            await supabase.auth.getUser();

          if (userError) {
            throw userError;
          }

          if (userData.user) {
            resolvedSession = { ...resolvedSession, user: userData.user };
          }
        }

        if (!isMounted) return;
        setSession(resolvedSession);
        setStatus(resolvedSession ? 'signed-in' : 'signed-out');

        const { data: authData } = supabase.auth.onAuthStateChange(
          (_event, nextSession) => {
            setSession(nextSession);
            setStatus(nextSession ? 'signed-in' : 'signed-out');
          }
        );

        unsubscribe = () => authData.subscription.unsubscribe();
      } catch (err) {
        if (!isMounted) return;
        const message =
          err instanceof Error ? err.message : 'Failed to initialize auth.';
        setErrorMessage(message);
        setStatus('error');
      }
    };

    initAuth();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  const handleSignIn = async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/matrix`,
        },
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to start Google sign-in.';
      setErrorMessage(message);
      setStatus('error');
    }
  };

  const handleSignOut = async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to sign out.';
      setErrorMessage(message);
      setStatus('error');
    }
  };

  const sessionEmail = session?.user?.email?.toLowerCase() ?? null;
  const isAllowedEmail =
    Boolean(allowedEmail) &&
    Boolean(sessionEmail) &&
    allowedEmail === sessionEmail;

  if (status === 'loading') {
    return (
      <main className="min-h-screen pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          Checking authentication status...
        </div>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className="min-h-screen pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          {errorMessage ?? 'Authentication is unavailable.'}
        </div>
      </main>
    );
  }

  if (!allowedEmail) {
    return (
      <main className="min-h-screen pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto space-y-3 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          <p>Missing `VITE_MATRIX_ALLOWED_EMAIL` configuration.</p>
          {sessionEmail && (
            <p>
              Signed in as <span className="text-foreground">{sessionEmail}</span>.
            </p>
          )}
        </div>
      </main>
    );
  }

  if (status === 'signed-out') {
    return (
      <main className="min-h-screen pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto space-y-4 rounded-lg border border-border bg-card p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
              Matrix
            </p>
            <h1 className="text-2xl">Sign in required</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Access to the Matrix authoring console is restricted to the
            approved Google account.
          </p>
          <button
            type="button"
            className="rounded-full border border-primary px-4 py-2 text-sm text-primary"
            onClick={handleSignIn}
          >
            Continue with Google
          </button>
        </div>
      </main>
    );
  }

  if (!isAllowedEmail) {
    return (
      <main className="min-h-screen pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto space-y-4 rounded-lg border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Signed in as <span className="text-foreground">{sessionEmail}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            This account is not authorized to access the Matrix authoring
            console.
          </p>
          <button
            type="button"
            className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
