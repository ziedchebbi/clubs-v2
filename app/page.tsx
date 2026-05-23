import Link from "next/link";
import {
  Users,
  CalendarDays,
  Megaphone,
  ShieldCheck,
  ArrowRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Users,
    title: "Join Clubs",
    description:
      "Browse clubs at your university, request to join, and become part of communities that match your interests.",
  },
  {
    icon: CalendarDays,
    title: "Attend Events",
    description:
      "Discover upcoming events from your clubs, RSVP in one tap, and never miss what's happening on campus.",
  },
  {
    icon: Megaphone,
    title: "Stay Updated",
    description:
      "Get announcements from your clubs directly in your activity feed. Comment and engage with your community.",
  },
  {
    icon: ShieldCheck,
    title: "Club Management",
    description:
      "Officers and chairs can manage members, post events and announcements, and approve join requests.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navbar */}
      <header
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm 
                         border-b border-gray-200"
      >
        <div
          className="max-w-6xl mx-auto px-6 py-4 flex items-center 
                        justify-between"
        >
          <span className="font-bold text-xl">
            <span className="text-gray-900">Uni</span>
            <span className="text-[#F5A623]">Clubs</span>
          </span>
          <Button
            asChild
            size="sm"
            className="bg-[#F5A623] text-[#0F1117] hover:bg-[#E09510] 
                       font-semibold"
          >
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section
        className="max-w-6xl mx-auto px-6 pt-24 pb-20 
                          text-center space-y-8"
      >
        {/* Badge */}
        <div
          className="inline-flex items-center gap-1.5 bg-[#FFF8EC] 
                        text-[#F5A623] text-xs font-semibold rounded-full 
                        px-3 py-1.5 border border-[#F5A623]/20"
        >
          <Star className="h-3 w-3 fill-[#F5A623]" />
          Built for university students
        </div>

        {/* Heading */}
        <h1
          className="text-5xl sm:text-6xl font-bold tracking-tight 
                       text-gray-900 max-w-3xl mx-auto leading-tight"
        >
          Your university clubs,{" "}
          <span className="text-[#F5A623]">all in one place</span>
        </h1>

        {/* Subheading */}
        <p
          className="text-gray-500 text-lg sm:text-xl max-w-xl mx-auto 
                      leading-relaxed"
        >
          Discover clubs, join communities, attend events, and stay connected
          with everything happening at your university.
        </p>

        {/* CTA */}
        <div
          className="flex flex-col sm:flex-row items-center 
                        justify-center gap-3 pt-2"
        >
          <Button
            asChild
            size="lg"
            className="bg-[#F5A623] text-[#0F1117] hover:bg-[#E09510] 
                       font-semibold px-8 rounded-xl"
          >
            <Link href="/signup" className="flex items-center gap-2">
              Create your account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Link
            href="/login"
            className="text-gray-500 text-sm hover:text-gray-900 
                       hover:underline transition-colors"
          >
            Already have an account? Sign in →
          </Link>
        </div>

        {/* Hero visual */}
        <div className="mt-12 relative max-w-3xl mx-auto">
          {/* Glow */}
          <div
            className="absolute inset-0 bg-[#F5A623]/10 rounded-2xl 
                          blur-3xl -z-10"
          />

          {/* Mock feed card */}
          <div
            className="bg-white border border-gray-200 rounded-2xl 
                          shadow-xl p-6 text-left space-y-4"
          >
            {/* Mock topbar */}
            <div
              className="flex items-center justify-between pb-4 
                            border-b border-gray-100"
            >
              <span className="font-bold text-lg">
                <span className="text-gray-900">Uni</span>
                <span className="text-[#F5A623]">Clubs</span>
              </span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#F5A623]" />
                <span className="text-gray-400 text-xs">Activity Feed</span>
              </div>
            </div>

            {/* Mock feed items */}
            {[
              {
                type: "Announcement",
                club: "AI & Robotics Club",
                author: "Amir B.",
                content:
                  "Welcome to the club! Our first meeting is Thursday at 5pm in building B.",
                badge: "bg-[#FFF8EC] text-[#F5A623]",
                comments: 3,
              },
              {
                type: "Event",
                club: "Photography Society",
                author: "Sara M.",
                content: "Golden Hour Photo Walk — Sat, Jun 14 · 5:00 PM",
                badge: "bg-blue-50 text-blue-600",
                comments: 7,
              },
              {
                type: "Announcement",
                club: "Debate Club",
                author: "Yacine H.",
                content:
                  "Practice sessions every Monday and Wednesday at 6pm. New members welcome!",
                badge: "bg-[#FFF8EC] text-[#F5A623]",
                comments: 2,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl 
                           hover:bg-gray-50 transition-colors"
              >
                {/* Avatar */}
                <div
                  className="h-8 w-8 rounded-full bg-[#FFF8EC] 
                                flex items-center justify-center 
                                text-[#F5A623] font-bold text-sm shrink-0"
                >
                  {item.author.charAt(0)}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-gray-900 font-semibold text-sm">
                      {item.author}
                    </span>
                    <span className="text-gray-400 text-xs">
                      in {item.club}
                    </span>
                    <span
                      className={`text-xs font-semibold rounded-full 
                                  px-2 py-0.5 ${item.badge}`}
                    >
                      {item.type}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">{item.content}</p>
                  <p className="text-gray-300 text-xs">
                    {item.comments} comments
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 border-y border-gray-200 py-20">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything your club needs
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              UniClubs brings students, clubs, and university admins together in
              one simple platform.
            </p>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 
                          gap-6"
          >
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white border border-gray-200 rounded-xl p-6 
                           space-y-3 shadow-sm hover:shadow-md 
                           hover:border-[#F5A623] transition-all group"
              >
                <div
                  className="bg-[#FFF8EC] rounded-lg p-2.5 w-fit 
                                group-hover:bg-[#F5A623]/20 transition-colors"
                >
                  <feature.icon className="h-5 w-5 text-[#F5A623]" />
                </div>
                <h3 className="text-gray-900 font-semibold">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-20 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-gray-900">
            Get started in minutes
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Join your university's clubs and start engaging with your campus
            community today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Create your account",
              description:
                "Sign up with your university email and select your university.",
            },
            {
              step: "02",
              title: "Join clubs",
              description:
                "Browse clubs at your university and request to join the ones that interest you.",
            },
            {
              step: "03",
              title: "Stay connected",
              description:
                "See events and announcements from your clubs in your personal activity feed.",
            },
          ].map((item) => (
            <div key={item.step} className="space-y-3">
              <span className="text-4xl font-bold text-[#F5A623]/30">
                {item.step}
              </span>
              <h3 className="text-gray-900 font-semibold text-lg">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#FFF8EC] border-t border-[#F5A623]/20 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Ready to get involved?
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Join UniClubs and discover everything happening at your university.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#F5A623] text-[#0F1117] hover:bg-[#E09510] 
                       font-semibold px-8 rounded-xl"
          >
            <Link href="/signup" className="flex items-center gap-2">
              Create your account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div
          className="max-w-6xl mx-auto px-6 flex items-center 
                        justify-between flex-wrap gap-4"
        >
          <span className="font-bold text-gray-900">
            Uni<span className="text-[#F5A623]">Clubs</span>
          </span>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} UniClubs. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
