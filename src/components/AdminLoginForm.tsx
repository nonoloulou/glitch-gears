"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AdminLoginFormProps = {
  onSuccess?: () => void;
};

export default function AdminLoginForm({ onSuccess }: AdminLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    onSuccess?.();
    window.location.href = "/admin";
  }

  return (
    <form onSubmit={handleSubmit} className="soft-card mx-auto w-full max-w-md space-y-6 p-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-medium text-white">Admin Login</h1>
        <p className="text-sm text-text-secondary">
          Sign in to manage products and promotions.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-neutral-700 bg-neutral-900/80 px-4 py-3 text-sm text-neutral-300">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-text-secondary">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="soft-input"
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-2 block text-sm text-text-secondary">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="soft-input"
            autoComplete="current-password"
          />
        </div>
      </div>

      <button type="submit" disabled={loading} className="soft-button w-full">
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
