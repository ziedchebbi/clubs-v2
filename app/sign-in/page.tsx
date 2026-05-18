"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import { AlertCircle } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signUp.email({ name, email, password });
      router.push("/dashboard");
    } catch (e: any) {
      setError(e?.message || "Failed to create account.");
    }

    setIsLoading(false);
  };

  return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">

        <div className="w-full max-w-md">

          {/* Top */}
          <div className="flex justify-between items-center mb-10">
            <Link href="/" className="text-sm text-slate-600 hover:text-[#0d1b2a]">
              ← Go back
            </Link>
            <div className="text-sm px-3 py-1 rounded-full border text-slate-600">
              English
            </div>
          </div>

          {/* Header */}
          <h1 className="text-3xl font-semibold text-[#0d1b2a] mb-2">
            Create account
          </h1>
          <p className="text-slate-500 text-sm mb-8">
            Join UniClubs and discover your community.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="text-xs text-slate-500 block mb-1">Full Name</label>
              <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs text-slate-500 block mb-1">Email</label>
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs text-slate-500 block mb-1">Password</label>
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Error */}
            {error && (
                <div className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
            )}

            {/* Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0d1b2a] hover:bg-[#1e3a5f] text-white font-medium rounded-full py-2.5 transition"
            >
              {isLoading ? "Creating..." : "Create Account"}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8 text-sm text-slate-400">
            <div className="flex-1 h-px bg-slate-300"></div>
            Or continue with
            <div className="flex-1 h-px bg-slate-300"></div>
          </div>

          {/* Google */}
          <button className="w-full border border-slate-300 rounded-full py-2 text-sm hover:bg-slate-50">
            Continue with Google
          </button>

          {/* Footer */}
          <div className="text-center bg-slate-200 text-sm text-slate-700 mt-10 p-4 rounded-lg">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-amber-600 font-medium">
              Sign in
            </Link>
          </div>

        </div>
      </div>
  );
}