"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!email.trim() || !password) return;
    setError("");

    startTransition(async () => {
      const { error } = await signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        setError("Invalid email or password");
        return;
      }

      router.push("/feed");
      router.refresh();
    });
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center 
                    justify-center p-4"
    >
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            <span className="text-gray-900">Uni</span>
            <span className="text-[#F5A623]">Clubs</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">Sign in to your account</p>
        </div>

        {/* Card */}
        <div
          className="bg-white border border-gray-200 rounded-2xl 
                        p-8 shadow-sm space-y-5"
        >
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-gray-700 text-sm font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="bg-gray-50 border-gray-200 text-gray-900 
                         placeholder:text-gray-400"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-gray-700 text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-gray-50 border-gray-200 text-gray-900 
                           placeholder:text-gray-400 pr-10"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 
                           text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div
              className="bg-red-50 border border-red-200 rounded-lg 
                            px-4 py-3 text-red-500 text-sm"
            >
              {error}
            </div>
          )}

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || !email.trim() || !password}
            className="w-full bg-[#F5A623] text-[#0F1117] 
                       hover:bg-[#E09510] font-semibold"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </Button>

          <p className="text-center text-gray-500 text-sm">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-[#F5A623] font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
