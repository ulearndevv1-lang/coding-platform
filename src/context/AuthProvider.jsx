import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContext";
import { getSupabase, isSupabaseConfigured } from "../lib/supabaseClient";

export function AuthProvider({ children }) {
  const configured = isSupabaseConfigured();
  const supabase = configured ? getSupabase() : null;

  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(configured);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let cancelled = false;

    supabase.auth.getSession().then(({ data, error }) => {
      if (cancelled) {
        return;
      }
      if (error) {
        setAuthError(error.message);
      }
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signUp = useCallback(async (email, password) => {
    setAuthError("");
    if (!supabase) {
      return {
        error: new Error(
          "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local."
        ),
      };
    }
    const result = await supabase.auth.signUp({ email, password });
    if (result.error) {
      setAuthError(result.error.message);
    }
    return result;
  }, [supabase]);

  const signIn = useCallback(async (email, password) => {
    setAuthError("");
    if (!supabase) {
      return {
        error: new Error(
          "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local."
        ),
      };
    }
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (result.error) {
      setAuthError(result.error.message);
    }
    return result;
  }, [supabase]);

  const signOut = useCallback(async () => {
    setAuthError("");
    if (!supabase) {
      return { error: new Error("Supabase is not configured.") };
    }
    const result = await supabase.auth.signOut();
    if (result.error) {
      setAuthError(result.error.message);
    }
    return result;
  }, [supabase]);

  const clearAuthError = useCallback(() => setAuthError(""), []);

  const value = useMemo(
    () => ({
      configured,
      session,
      user,
      loading,
      authError,
      signUp,
      signIn,
      signOut,
      clearAuthError,
    }),
    [
      configured,
      session,
      user,
      loading,
      authError,
      signUp,
      signIn,
      signOut,
      clearAuthError,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
