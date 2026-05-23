import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SignUpForm from "@/components/auth/SignUpForm";

export default async function SignUpPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/feed");

  const universities = await prisma.university.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center 
                    justify-center p-4"
    >
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            <span className="text-gray-900">Uni</span>
            <span className="text-[#F5A623]">Clubs</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">Create your account</p>
        </div>
        <SignUpForm universities={universities} />
      </div>
    </div>
  );
}
