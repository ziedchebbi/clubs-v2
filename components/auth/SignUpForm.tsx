"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUp } from "@/lib/auth-client";
import { setUserUniversity } from "@/app/(auth)/signup/actions";
import { Eye, EyeOff } from "lucide-react";

type University = { id: string; name: string };

type Props = { universities: University[] };

export default function SignUpForm({ universities }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    setError("");

    if (!name.trim()) return setError("Name is required");
    if (!email.trim()) return setError("Email is required");
    if (!universityId) return setError("Please select your university");
    if (password.length < 8)
      return setError("Password must be at least 8 characters");
    if (password !== confirmPassword) return setError("Passwords do not match");

    startTransition(async () => {
      const { data, error } = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (error || !data?.user) {
        setError(error?.message ?? "Something went wrong");
        return;
      }

      // Set university after sign up
      const result = await setUserUniversity(data.user.id, universityId);
      if (result.error) {
        setError(result.error);
        return;
      }

      router.push("/feed");
      router.refresh();
    });
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-2xl 
                    p-8 shadow-sm space-y-5"
    >
      {/* Name */}
      <div className="space-y-1.5">
        <label className="text-gray-700 text-sm font-medium">Full Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          className="bg-gray-50 border-gray-200 text-gray-900 
                     placeholder:text-gray-400"
        />
      </div>

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
        />
      </div>

      {/* University */}
      <div className="space-y-1.5">
        <label className="text-gray-700 text-sm font-medium">University</label>
        <select
          value={universityId}
          onChange={(e) => setUniversityId(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 
                     text-gray-900 text-sm px-3 py-2 focus:outline-none 
                     focus:ring-2 focus:ring-[#F5A623] 
                     focus:border-transparent"
        >
          <option value="">Select your university...</option>
          {universities.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="text-gray-700 text-sm font-medium">Password</label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="bg-gray-50 border-gray-200 text-gray-900 
                       placeholder:text-gray-400 pr-10"
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

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label className="text-gray-700 text-sm font-medium">
          Confirm Password
        </label>
        <div className="relative">
          <Input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your password"
            className="bg-gray-50 border-gray-200 text-gray-900 
                       placeholder:text-gray-400 pr-10"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 
                       text-gray-400 hover:text-gray-600"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? (
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
        disabled={isPending}
        className="w-full bg-[#F5A623] text-[#0F1117] 
                   hover:bg-[#E09510] font-semibold"
      >
        {isPending ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-center text-gray-500 text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#F5A623] font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
