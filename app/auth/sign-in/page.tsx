"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import AuthLeftPanel from "@/components/auth/AuthLeftPanel";
import AuthInput from "@/components/auth/AuthInput";

const NAVY = "#0d1b3e";
const CRIMSON = "#c0392b";

export default function SignInPage() {
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
      await signIn.email({ email, password });
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-row"
      style={{ fontFamily: "Inter, sans-serif", background: NAVY }}
    >
      <AuthLeftPanel
        badge="Welcome Back"
        heading={
          <span>
            Sign in to{" "}
            <em style={{ color: "#e74c3c", fontStyle: "normal" }}>UniClubs</em>
          </span>
        }
        subtitle="Access your campus clubs, events, and more."
        bullets={[
          "Discover and join student clubs",
          "RSVP and attend campus events",
          "Manage your memberships easily",
        ]}
      />
      <div className="flex-1 flex items-center justify-center bg-[#f7f5f0] min-h-screen w-full">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[420px] bg-white shadow p-10 flex flex-col gap-7"
          style={{ margin: "48px 0", borderRadius: 0 }}
        >
          <h1
            className="text-3xl font-serif font-normal mb-1"
            style={{
              color: NAVY,
              fontFamily: "Georgia, serif",
              fontWeight: 400,
            }}
          >
            Sign In
          </h1>
          <div className="text-[15px] text-[#1a1a2e] mb-2">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="text-[var(--crimson,#c0392b)] font-semibold hover:underline"
              style={{ color: CRIMSON }}
            >
              Sign Up
            </Link>
          </div>
          <AuthInput
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <AuthInput
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <div className="flex justify-end -mt-2">
            <Link
              href="#"
              className="text-[var(--crimson,#c0392b)] text-[14px] font-medium hover:underline"
              style={{ color: CRIMSON }}
            >
              Forgot password?
            </Link>
          </div>
          {error && (
            <div
              className="text-[var(--crimson,#c0392b)] text-[14px] font-sans mb-2"
              style={{ color: CRIMSON }}
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-[15px] bg-[var(--navy,#0d1b3e)] text-white font-semibold text-[16px] mt-2"
            style={{
              borderRadius: 0,
              background: NAVY,
              fontWeight: 600,
              transition: "background 0.2s",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
      <style>{`
        @media (max-width: 767px) {
          .min-h-screen.flex.flex-row > div:first-child { display: none !important; }
        }
      `}</style>
    </div>
  );
}
