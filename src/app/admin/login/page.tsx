"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { isConvexConfigured } from "@/lib/convex-url";
import { site } from "@/lib/site.config";

type Mode = "signIn" | "signUp";

export default function LoginPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setBusy(true);
    setError(null);

    try {
      if (!isConvexConfigured) throw new Error("no deployment");

      if (mode === "signUp" && password.length < 8) {
        throw new Error("short password");
      }

      await signIn("password", {
        email: email.trim(),
        password,
        flow: mode,
      });

      router.push("/admin");
    } catch (e) {
      if (!isConvexConfigured) {
        setError("No Convex deployment yet. Run npx convex dev first.");
      } else if (e instanceof Error && e.message === "short password") {
        setError("Use at least eight characters.");
      } else if (mode === "signUp") {
        setError(
          "Could not create that account. It may already exist, so try signing in."
        );
      } else {
        setError("That email and password did not match an account.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-[360px]">
        <h1 className="font-display text-3xl tracking-wordmark">
          {site.wordmark}
        </h1>

        <p className="mt-2 text-[14px] text-muted">
          {mode === "signIn" ? "Studio sign in" : "Create a studio account"}
        </p>

        <div className="mt-10 space-y-4">
          <div>
            <label htmlFor="email" className="text-[13px] text-sage">
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border border-linen/20 bg-transparent px-3 py-2.5 text-[14px] focus:border-amber focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-[13px] text-sage">
              Password
            </label>

            <div className="relative mt-2">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete={
                  mode === "signIn" ? "current-password" : "new-password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void submit();
                }}
                className="w-full border border-linen/20 bg-transparent py-2.5 pl-3 pr-12 text-[14px] focus:border-amber focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-controls="password"
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted hover:text-amber focus-visible:outline focus-visible:outline-1 focus-visible:outline-amber"
              >
                <svg
                  aria-hidden="true"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                  {showPassword && <path d="m3 3 18 18" />}
                </svg>
              </button>
            </div>
          </div>

          {error ? <p className="text-[13px] text-amber">{error}</p> : null}

          <button
            type="button"
            onClick={() => void submit()}
            disabled={busy}
            className="w-full border border-amber bg-amber py-2.5 text-[13px] tracking-wide text-ink disabled:opacity-60"
          >
            {busy
              ? mode === "signIn"
                ? "Signing in"
                : "Creating account"
              : mode === "signIn"
                ? "Sign in"
                : "Create account"}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "signIn" ? "signUp" : "signIn");
              setShowPassword(false);
              setError(null);
            }}
            className="w-full text-[13px] text-muted underline-offset-4 hover:text-linen hover:underline"
          >
            {mode === "signIn"
              ? "First time here? Create an account"
              : "I already have an account"}
          </button>
        </div>

        <p className="mt-8 text-[12px] leading-[1.7] text-muted">
          Creating an account grants nothing on its own. Access to the dashboard
          is decided separately, by the studio access list.
        </p>
      </div>
    </div>
  );
}