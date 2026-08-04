"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: "#f5f5f7" }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span
            style={{
              fontSize: "28px",
              fontWeight: 600,
              lineHeight: 1.14,
              letterSpacing: "0.196px",
              color: "#1d1d1f",
            }}
          >
            JS
          </span>
          <h1
            className="mt-4"
            style={{
              fontFamily:
                '"SF Pro Display", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
              fontSize: "28px",
              fontWeight: 600,
              lineHeight: 1.14,
              color: "#1d1d1f",
            }}
          >
            Admin Login
          </h1>
          <p
            className="mt-1"
            style={{
              fontSize: "14px",
              lineHeight: 1.43,
              letterSpacing: "-0.224px",
              color: "#7a7a7a",
            }}
          >
            Sign in to manage your site content.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              style={{
                borderRadius: "11px",
                backgroundColor: "#fef5f5",
                border: "1px solid #ffcdd2",
                padding: "12px",
                fontSize: "14px",
                color: "#c62828",
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 500,
                color: "#1d1d1f",
                marginBottom: "4px",
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                borderRadius: "11px",
                border: "1px solid #e0e0e0",
                backgroundColor: "#ffffff",
                padding: "11px 17px",
                fontSize: "17px",
                lineHeight: 1.47,
                color: "#1d1d1f",
                outline: "none",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#0066cc";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0, 102, 204, 0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e0e0e0";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 500,
                color: "#1d1d1f",
                marginBottom: "4px",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                display: "block",
                width: "100%",
                borderRadius: "11px",
                border: "1px solid #e0e0e0",
                backgroundColor: "#ffffff",
                padding: "11px 17px",
                fontSize: "17px",
                lineHeight: 1.47,
                color: "#1d1d1f",
                outline: "none",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#0066cc";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0, 102, 204, 0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e0e0e0";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
