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
    <div
      className="min-h-screen flex flex-row"
      style={{ fontFamily: "Inter, sans-serif", background: NAVY }}
    >
      <AuthLeftPanel
        badge="Join Us"
        heading={
          <span>
            Sign up for{" "}
            <em style={{ color: "#e74c3c", fontStyle: "normal" }}>UniClubs</em>
          </span>
        }
        subtitle="Create your account to join clubs, attend events, and connect with your campus community."
        bullets={[
          "Create your student profile",
          "Join and manage clubs",
          "Access exclusive member events",
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
            Sign Up
          </h1>
          <div className="text-[15px] text-[#1a1a2e] mb-2">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="font-semibold hover:underline"
              style={{ color: CRIMSON }}
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
            <div style={{ color: CRIMSON }} className="text-[14px] font-sans">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-[15px] text-white font-semibold text-[16px] mt-2"
            style={{
              borderRadius: 0,
              background: NAVY,
              fontWeight: 600,
              transition: "background 0.2s",
            }}
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
