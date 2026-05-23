import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavLinks from "@/components/student/NavLinks";
import LogoutButton from "@/components/shared/LogoutButton";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/login");
  }
  const user = session.user;

  return (
    <div className="flex h-screen bg-white text-gray-900 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full hidden md:flex">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-200">
          <span className="font-bold text-xl text-gray-900">Uni</span>
          <span className="font-bold text-xl text-[#F5A623]">Clubs</span>
        </div>

        {/* Navigation */}
        <nav aria-label="Main navigation" className="flex-1 p-4">
          <NavLinks />
        </nav>

        {/* User Info */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
              <AvatarFallback className="bg-[#FFF8EC] text-[#F5A623] font-semibold">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <LogoutButton variant="icon" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Topbar */}
        <header className="sticky top-0 md:hidden bg-gray-50 border-b border-gray-200 px-4 py-3 z-50">
          <div className="flex items-center justify-between relative">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 bg-gray-50 border-r border-gray-200 p-0"
              >
                <div className="px-6 py-5 border-b border-gray-200">
                  <span className="font-bold text-xl text-gray-900">Uni</span>
                  <span className="font-bold text-xl text-[#F5A623]">
                    Clubs
                  </span>
                </div>
                <nav aria-label="Mobile navigation" className="p-4">
                  <NavLinks />
                </nav>

                <div className="px-4 py-4 border-t border-gray-200 mt-auto">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={user?.image || ""}
                        alt={user?.name || ""}
                      />
                      <AvatarFallback className="bg-[#FFF8EC] text-[#F5A623] font-semibold">
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <LogoutButton variant="icon" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <span className="font-bold text-lg absolute left-1/2 -translate-x-1/2 pointer-events-none">
              <span className="text-gray-900">Uni</span>
              <span className="text-[#F5A623]">Clubs</span>
            </span>

            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
              <AvatarFallback className="bg-[#FFF8EC] text-[#F5A623] font-semibold">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
