"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2, Eye, EyeOff, Check, X, AtSign, KeyRound, Mail } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { checkUsername, registerUser, UsernameCheck } from "@/lib/actions/auth";

interface Props {
  callbackUrl: string;
  error?: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked: "This email is already linked to a different provider. Sign in with the original method.",
  OAuthSignin: "Could not connect to the provider. Please try again.",
  OAuthCallback: "Something went wrong during sign-in. Please try again.",
  CredentialsSignin: "Wrong username or password.",
  Default: "Something went wrong. Please try again.",
};

type Mode = "signin" | "signup";

export default function SignInClient({ callbackUrl, error }: Props) {
  const [mode, setMode] = useState<Mode>("signin");
  const [oauthLoading, setOauthLoading] = useState<"github" | "google" | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(
    error ? (ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default) : null
  );

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Live username availability (sign-up only, debounced).
  // "checking" is set in the event handlers; the effect only resolves it.
  const [check, setCheck] = useState<{ state: "idle" | "checking" | "done"; result?: UsernameCheck }>({ state: "idle" });
  useEffect(() => {
    if (mode !== "signup" || username.trim().length < 3) return;
    const t = setTimeout(async () => {
      try {
        const result = await checkUsername(username);
        setCheck({ state: "done", result });
      } catch {
        setCheck({ state: "idle" });
      }
    }, 450);
    return () => clearTimeout(t);
  }, [username, mode]);

  const handleUsernameChange = (value: string) => {
    const v = value.toLowerCase();
    setUsername(v);
    if (mode === "signup") {
      setCheck(v.trim().length >= 3 ? { state: "checking" } : { state: "idle" });
    }
  };

  const handleOAuth = (provider: "github" | "google") => {
    setOauthLoading(provider);
    signIn(provider, { callbackUrl });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const result = await registerUser({ username, email, password });
        if (!result.ok) {
          setFormError(result.error ?? "Could not create your account.");
          setSubmitting(false);
          return;
        }
      }
      const res = await signIn("credentials", { username, password, redirect: false });
      if (res?.error) {
        setFormError(ERROR_MESSAGES.CredentialsSignin);
        setSubmitting(false);
        return;
      }
      window.location.assign(callbackUrl);
    } catch {
      setFormError(ERROR_MESSAGES.Default);
      setSubmitting(false);
    }
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setFormError(null);
    setCheck(next === "signup" && username.trim().length >= 3 ? { state: "checking" } : { state: "idle" });
  };

  const usernameTaken = mode === "signup" && check.state === "done" && !check.result?.available;
  const inputBase =
    "w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-shadow";

  return (
    <div className="relative min-h-screen bg-zinc-50 flex items-center justify-center px-4 py-10 overflow-hidden">
      {/* Backdrop — same language as the landing page */}
      <div className="absolute inset-0 hero-dots pointer-events-none" aria-hidden="true" />
      <div className="hero-blob absolute -top-24 left-1/4 w-[480px] h-[340px] rounded-full bg-gradient-to-br from-violet-200/40 to-indigo-200/30 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative w-full max-w-sm">
        {/* Logo + heading */}
        <div className="text-center mb-8">
          <Logo className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            {mode === "signin" ? (
              <>Welcome <span className="font-display-serif italic font-normal">back</span></>
            ) : (
              <>Claim your <span className="font-display-serif italic font-normal">corner</span> of the web</>
            )}
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {mode === "signin"
              ? "Sign in to save and publish your portfolio"
              : "Your username becomes your portfolio URL"}
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          {/* Mode toggle */}
          <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl mb-5">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                aria-pressed={mode === m}
                className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-violet-500 ${
                  mode === m ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {m === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          {/* Error */}
          {formError && (
            <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {formError}
            </div>
          )}

          {/* Credentials form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-zinc-600 mb-1.5">
                Username
              </label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" aria-hidden="true" />
                <input
                  id="username"
                  type="text"
                  required
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  placeholder="your-name"
                  className={inputBase}
                />
                {mode === "signup" && check.state !== "idle" && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {check.state === "checking" ? (
                      <Loader2 className="h-4 w-4 text-zinc-400 animate-spin" aria-hidden="true" />
                    ) : check.result?.available ? (
                      <Check className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" aria-hidden="true" />
                    )}
                  </span>
                )}
              </div>
              {mode === "signup" && (
                <p
                  className={`mt-1.5 text-xs ${usernameTaken ? "text-red-600" : "text-zinc-500"}`}
                  aria-live="polite"
                >
                  {usernameTaken
                    ? check.result?.reason
                    : <>Your portfolio will live at <span className="font-medium text-zinc-700">portfolioforge.dev/u/{username || "your-name"}</span></>}
                </p>
              )}
            </div>

            {mode === "signup" && (
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-zinc-600 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" aria-hidden="true" />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputBase}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-zinc-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={mode === "signup" ? 8 : undefined}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "signup" ? "8+ characters" : "Your password"}
                  className={`${inputBase} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || (mode === "signup" && usernameTaken)}
              className="press-scale btn-shine w-full flex items-center justify-center gap-2 bg-zinc-900 text-white py-3 rounded-xl font-semibold hover:bg-zinc-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {submitting
                ? (mode === "signup" ? "Creating your account…" : "Signing in…")
                : (mode === "signup" ? "Create account" : "Sign in")}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5" aria-hidden="true">
            <div className="h-px flex-1 bg-zinc-200" />
            <span className="text-xs text-zinc-400">or continue with</span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleOAuth("github")}
              disabled={!!oauthLoading || submitting}
              className="flex items-center justify-center gap-2 bg-zinc-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors cursor-pointer disabled:opacity-60"
            >
              {oauthLoading === "github" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <GitHubIcon />}
              GitHub
            </button>
            <button
              onClick={() => handleOAuth("google")}
              disabled={!!oauthLoading || submitting}
              className="flex items-center justify-center gap-2 bg-white text-zinc-800 border border-zinc-300 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-50 transition-colors cursor-pointer disabled:opacity-60"
            >
              {oauthLoading === "google" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <GoogleIcon />}
              Google
            </button>
          </div>

          <p className="text-center text-xs text-zinc-400 pt-4">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-zinc-600">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy" className="underline hover:text-zinc-600">Privacy Policy</Link>.
          </p>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-4">
          Your portfolio data is always yours. Export or delete anytime.
        </p>
      </div>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}
