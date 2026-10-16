import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function AuthControls() {
  const {
    configured,
    user,
    loading,
    authError,
    signIn,
    signUp,
    signOut,
    clearAuthError,
  } = useAuth();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  if (!configured) {
    return null;
  }

  if (loading) {
    return <span className="auth-status" aria-live="polite">Auth…</span>;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFormMessage("");
    clearAuthError();

    const action = mode === "signup" ? signUp : signIn;
    const { error } = await action(email.trim(), password);

    setSubmitting(false);

    if (error) {
      setFormMessage(error.message);
      return;
    }

    if (mode === "signup") {
      setFormMessage(
        "Account created. If email confirmation is enabled in Supabase, check your inbox before signing in."
      );
      setMode("signin");
      setPassword("");
      return;
    }

    setOpen(false);
    setEmail("");
    setPassword("");
    setFormMessage("");
  }

  async function handleSignOut() {
    setSubmitting(true);
    await signOut();
    setSubmitting(false);
    setOpen(false);
  }

  const displayEmail =
    user?.email && user.email.length > 22
      ? `${user.email.slice(0, 20)}…`
      : user?.email;

  return (
    <div className="auth-controls">
      {user ? (
        <>
          <span className="auth-user" title={user.email}>
            {displayEmail}
          </span>
          <button
            type="button"
            className="ghost-button auth-button"
            onClick={handleSignOut}
            disabled={submitting}
          >
            Log out
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            className="ghost-button auth-button"
            onClick={() => {
              setOpen((value) => !value);
              setFormMessage("");
              clearAuthError();
            }}
            aria-expanded={open}
            aria-controls="auth-panel"
          >
            Sign in
          </button>
          {open && (
            <div className="auth-panel" id="auth-panel" role="dialog" aria-label="Sign in or sign up">
              <div className="auth-panel-tabs">
                <button
                  type="button"
                  className={mode === "signin" ? "active" : ""}
                  onClick={() => setMode("signin")}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  className={mode === "signup" ? "active" : ""}
                  onClick={() => setMode("signup")}
                >
                  Sign up
                </button>
              </div>
              <form className="auth-form" onSubmit={handleSubmit}>
                <label>
                  Email
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    autoComplete={
                      mode === "signup" ? "new-password" : "current-password"
                    }
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
                <button
                  type="submit"
                  className="cta-button primary auth-submit"
                  disabled={submitting}
                >
                  {submitting
                    ? "Please wait…"
                    : mode === "signup"
                      ? "Create account"
                      : "Sign in"}
                </button>
              </form>
              {(formMessage || authError) && (
                <p className="auth-message" role="status">
                  {formMessage || authError}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
