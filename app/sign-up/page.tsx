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
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-6">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-[#0d1b2a]">Uni</span>
              <span className="text-amber-500">Clubs</span>
            </Link>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-md p-8">

            <h1 className="text-xl font-bold text-center text-[#0d1b2a] mb-2">
              Create an Account
            </h1>

            <p className="text-sm text-center text-slate-500 mb-6">
              Join the community and start exploring clubs today.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                  Full Name
                </label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                  Email
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                  Password
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Error */}
              {error && (
                  <div className="bg-red-100 border border-red-200 text-red-700 text-sm rounded-lg p-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
              )}

              {/* Submit */}
              <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-[#0d1b2a] font-semibold rounded-lg py-2.5 transition"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{" "}
              <Link
                  href="/sign-in"
                  className="font-semibold text-amber-600 hover:text-amber-700"
              >
                Sign In
              </Link>
            </p>

          </div>
        </div>
      </div>
  );
}