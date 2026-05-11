"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import Link from "next/link";
import AuthLeftPanel from "@/components/auth/AuthLeftPanel";
import AuthInput from "@/components/auth/AuthInput";

const NAVY = "#0d1b3e";
const CRIMSON = "#c0392b";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await signUp.email({ name, email, password });
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-row font-sans bg-[#0d1b3e]">
      <AuthLeftPanel
        badge="Join Us"
        heading={
          <span>
            Sign up for <em className="text-[#e74c3c] not-italic">UniClubs</em>
          </span>
        }
        subtitle="Create your account to join clubs, attend events, and connect with your campus community."
        bullets={[
          "Create your student profile",
          "Join and manage clubs",
          "Access exclusive member events",
        ]}
      />
      <div className="flex-1 flex items-center justify-center bg-[#f7f5f0] min-h-screen w-full p-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white shadow-md p-8 sm:p-10 rounded-none flex flex-col gap-7"
        >
          <h1 className="text-[#0d1b3e] text-3xl font-serif font-normal mb-1">
            Sign Up
          </h1>
          <div className="text-[#4b5563] text-sm mb-2">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="text-[#c0392b] font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b]"
            >
              Sign In
            </Link>
          </div>
          <AuthInput
            label="Name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
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
            placeholder="Create a password"
            required
          />
          <AuthInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            required
          />
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
            {loading ? "Signing up..." : "Sign Up"}
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
