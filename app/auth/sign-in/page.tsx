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
    <div className="min-h-screen flex flex-row font-sans bg-[#0d1b3e]">
      <AuthLeftPanel
        badge="Welcome Back"
        heading={
          <span>
            Sign in to <em className="text-[#e74c3c] not-italic">UniClubs</em>
          </span>
        }
        subtitle="Access your campus clubs, events, and more."
        bullets={[
          "Discover and join student clubs",
          "RSVP and attend campus events",
          "Manage your memberships easily",
        ]}
      />
      <div className="flex-1 flex items-center justify-center bg-[#f7f5f0] min-h-screen w-full p-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white shadow-md p-8 sm:p-10 rounded-none flex flex-col gap-7"
        >
          <h1 className="text-[#0d1b3e] text-3xl font-serif font-normal mb-1">
            Sign In
          </h1>
          <div className="text-[#4b5563] text-sm mb-2">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="text-[#c0392b] font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b]"
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
              className="text-[#c0392b] text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b]"
            >
              Forgot password?
            </Link>
          </div>
          {error && (
            <div className="bg-[#fef2f2] border border-red-200 text-[#991b1b] text-sm px-3 py-2 rounded">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0d1b3e] hover:bg-[#162447] text-white font-bold py-3 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-[#0d1b3e] focus:ring-offset-2"
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
