"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";

const NAVY = "#0d1b3e";
const CRIMSON = "#c0392b";

export default function LandingPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-8 lg:px-16 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight text-[#1a1a2e] select-none">
            Uni<span className="text-[#c0392b]">Clubs</span>
          </span>
        </div>
        {/* Desktop nav links */}
        <div className="hidden md:flex gap-8 items-center">
          {[
            { href: "#about", label: "About" },
            { href: "#clubs", label: "Clubs" },
            { href: "#events", label: "Events" },
            { href: "#contact", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[#374151] text-sm font-medium hover:text-[#c0392b] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b]"
            >
              {item.label}
            </Link>
          ))}
        </div>
        {/* Desktop auth buttons */}
        <div className="hidden md:flex gap-3 items-center">
          {session ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="border border-[#1a1a2e] text-[#1a1a2e] px-4 py-2 text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b] hover:bg-gray-50"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={async () => {
                  await signOut();
                  window.location.href = "/auth/sign-in";
                }}
                className="border border-[#1a1a2e] text-[#1a1a2e] px-4 py-2 text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b] hover:bg-gray-50"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                className="border border-[#1a1a2e] text-[#1a1a2e] px-4 py-2 text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b] hover:bg-gray-50"
              >
                Log In
              </Link>
              <Link
                href="/auth/sign-up"
                className="bg-[#c0392b] text-white px-4 py-2 text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b] hover:bg-[#a93226]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b]"
          aria-label={
            mobileNavOpen ? "Close navigation menu" : "Open navigation menu"
          }
          onClick={() => setMobileNavOpen((v) => !v)}
        >
          <span aria-hidden="true">
            {mobileNavOpen ? (
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#1a1a2e"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#1a1a2e"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </span>
        </button>
      </nav>

      {/* Mobile nav menu */}
      {mobileNavOpen && (
        <div className="md:hidden w-full bg-white border-t border-gray-200 shadow-sm z-40">
          <nav className="flex flex-col gap-1 py-2">
            {[
              { href: "#about", label: "About" },
              { href: "#clubs", label: "Clubs" },
              { href: "#events", label: "Events" },
              { href: "#contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-3 text-[#1a1a2e] text-base font-medium hover:text-[#c0392b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b]"
                onClick={() => setMobileNavOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 px-4 pt-2 pb-3">
              {session ? (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="border border-[#1a1a2e] text-[#1a1a2e] px-4 py-2 text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b] hover:bg-gray-50"
                      onClick={() => setMobileNavOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={async () => {
                      await signOut();
                      window.location.href = "/auth/sign-in";
                    }}
                    className="border border-[#1a1a2e] text-[#1a1a2e] px-4 py-2 text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b] hover:bg-gray-50"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/sign-in"
                    className="border border-[#1a1a2e] text-[#1a1a2e] px-4 py-2 text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b] hover:bg-gray-50"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="bg-[#c0392b] text-white px-4 py-2 text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b] hover:bg-[#a93226]"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0d1b3e] to-[#1a2d5a] py-24 sm:py-32 px-4 sm:px-8 text-center">
        <span
          className="inline-block bg-[#c0392b] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 mb-6"
          aria-hidden="true"
        >
          Welcome
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-white leading-tight mb-6">
          Your Campus. Your Clubs.{" "}
          <em className="text-[#e74c3c] not-italic">Your Community.</em>
        </h1>
        <p className="text-white/80 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Discover, join, and lead student clubs at your university. Connect
          with peers, attend events, and make your mark on campus life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/sign-up"
            className="bg-[#c0392b] text-white px-8 py-4 text-base font-semibold rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b] hover:bg-[#a93226]"
          >
            Get Started
          </Link>
          <Link
            href="#clubs"
            className="border border-white/60 text-white px-8 py-4 text-base font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b] hover:bg-white/10"
          >
            Explore Clubs
          </Link>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#c0392b] py-6 px-4">
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto text-center">
          {[
            { value: "12+", label: "Active Clubs" },
            { value: "400+", label: "Members" },
            { value: "50+", label: "Events / Year" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-white text-2xl sm:text-3xl font-bold">
                {stat.value}
              </div>
              <div className="text-white/90 text-xs sm:text-sm uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-20 px-4 sm:px-8 max-w-6xl mx-auto w-full"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[#c0392b] text-xs font-bold uppercase tracking-widest mb-4 block">
              About the Platform
            </span>
            <h2 className="text-[#1a1a2e] text-3xl sm:text-4xl font-serif font-normal mb-6">
              Bringing Students Together Through Shared Interests
            </h2>
            <p className="text-[#4b5563] text-base leading-relaxed mb-6">
              UniClubs is your all-in-one platform for discovering, joining, and
              managing student clubs at your university. Whether you're a
              student looking to get involved, a club member organizing events,
              or a club president managing your team, UniClubs makes campus life
              easier and more connected.
            </p>
            <ul className="space-y-3">
              {[
                "For Students: Browse and join clubs, RSVP to events, and connect with like-minded peers.",
                "For Club Members: Stay updated on club activities, participate in discussions, and manage your memberships.",
                "For Club Presidents: Streamline club management, assign roles, and promote your club to the campus community.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="inline-flex w-5 h-5 bg-[#c0392b] text-white items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span className="text-[#374151] text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#0d1b3e] p-10">
            <div className="text-white/70 text-sm mb-6" aria-hidden="true">
              Platform Stats
            </div>
            {[
              { value: "12", label: "Clubs" },
              { value: "400", label: "Members" },
              { value: "50", label: "Events/Year" },
            ].map((stat, i, arr) => (
              <div
                key={stat.label}
                className={`flex justify-between py-3 ${i < arr.length - 1 ? "border-b border-white/20" : ""}`}
              >
                <span className="text-white text-lg font-serif">
                  {stat.value}
                </span>
                <span className="text-white/70 text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clubs Section */}
      <section id="clubs" className="bg-[#f7f5f0] py-20 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <span className="text-[#c0392b] text-xs font-bold uppercase tracking-widest mb-4 block">
            Our Community
          </span>
          <h2 className="text-[#1a1a2e] text-3xl sm:text-4xl font-serif font-normal mb-10">
            Featured Clubs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "IEEE",
                icon: "⚡",
                desc: "Advancing technology for humanity. Workshops, competitions, and networking.",
                members: 42,
              },
              {
                name: "Croissant Rouge",
                icon: "❤️",
                desc: "Humanitarian club focused on volunteering and social impact.",
                members: 28,
              },
              {
                name: "Cavalo Chess",
                icon: "♟️",
                desc: "For chess lovers of all levels. Tournaments, lessons, and fun!",
                members: 35,
              },
            ].map((club) => (
              <div
                key={club.name}
                className="bg-white border-t-4 border-[#c0392b] shadow-sm hover:shadow-md transition-shadow p-8 flex flex-col"
              >
                <div className="text-4xl mb-4" aria-hidden="true">
                  {club.icon}
                </div>
                <h3 className="text-[#1a1a2e] text-xl font-serif font-normal mb-2">
                  {club.name}
                </h3>
                <p className="text-[#4b5563] text-sm leading-relaxed mb-6 flex-1">
                  {club.desc}
                </p>
                <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                  <span className="text-[#6b7280] text-sm">
                    {club.members} members
                  </span>
                  <Link
                    href="/etudiant/clubs"
                    className="text-[#c0392b] font-semibold text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b]"
                  >
                    Learn More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/etudiant/clubs"
              className="border-2 border-[#0d1b3e] text-[#0d1b3e] px-10 py-3 text-sm font-semibold hover:bg-[#0d1b3e] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b]"
            >
              View All Clubs
            </Link>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <span className="text-[#c0392b] text-xs font-bold uppercase tracking-widest mb-4 block">
            What's Happening
          </span>
          <h2 className="text-[#1a1a2e] text-3xl sm:text-4xl font-serif font-normal mb-10">
            Upcoming Events
          </h2>
          <div className="flex flex-col gap-2">
            {[
              {
                title: "Campus Hackathon",
                date: "2026-05-02",
                lieu: "Room A12",
                public: true,
                club: "IEEE",
              },
              {
                title: "Arduino Workshop",
                date: "2026-05-10",
                lieu: "Robotics Lab",
                public: false,
                club: "IEEE",
              },
              {
                title: "Blood Donation Drive",
                date: "2026-05-15",
                lieu: "Main Hall",
                public: true,
                club: "Croissant Rouge",
              },
              {
                title: "University Chess Tournament",
                date: "2026-05-20",
                lieu: "Library Hall",
                public: true,
                club: "Cavalo Chess",
              },
            ].map((evt, i) => (
              <div
                key={evt.title}
                className={`grid grid-cols-1 sm:grid-cols-[80px_1fr_auto_auto] gap-4 items-center p-6 border-l-4 ${evt.public ? "border-l-[#c0392b]" : "border-l-[#0d1b3e]"} ${i % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"}`}
              >
                <div>
                  <div className="text-[#0d1b3e] text-2xl font-bold font-sans">
                    {new Date(evt.date).toLocaleDateString("en-US", {
                      day: "2-digit",
                    })}
                  </div>
                  <div className="text-[#6b7280] text-xs uppercase tracking-wide">
                    {new Date(evt.date).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div>
                  <div className="text-[#1a1a2e] text-lg font-serif">
                    {evt.title}
                  </div>
                  <div className="text-[#4b5563] text-sm">
                    📍 {evt.lieu} · {evt.club}
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 ${evt.public ? "bg-[#fef0ee] text-[#991b1b]" : "bg-[#eef0fa] text-[#1e40af]"}`}
                >
                  {evt.public ? "Public" : "Members Only"}
                </span>
                <Link
                  href="/etudiant/evenements"
                  className="text-[#c0392b] font-semibold text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b]"
                >
                  Register →
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/etudiant/evenements"
              className="bg-[#0d1b3e] text-white px-10 py-3 text-sm font-semibold hover:bg-[#162447] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b]"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0d1b3e] py-20 px-4 text-center">
        <h2 className="text-white text-3xl sm:text-4xl font-serif font-normal mb-4">
          Ready to Get Involved?
        </h2>
        <p className="text-white/80 text-base leading-relaxed mb-10 max-w-xl mx-auto">
          Create your account today and start exploring clubs, events, and your
          university community.
        </p>
        <Link
          href="/auth/sign-up"
          className="bg-[#c0392b] text-white px-12 py-4 text-base font-semibold hover:bg-[#a93226] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b]"
        >
          Sign Up — It's Free
        </Link>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#0a1428] py-16 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="text-white font-bold text-lg mb-4">
                Uni<span className="text-[#e74c3c]">Clubs</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                The official university clubs and events management platform.
              </p>
            </div>
            {[
              {
                title: "Platform",
                links: ["Home", "Clubs", "Events", "Announcements"],
              },
              {
                title: "Roles",
                links: ["Student", "Member", "President", "Admin"],
              },
              {
                title: "Support",
                links: ["Help Center", "Contact", "Privacy Policy", "Terms"],
              },
            ].map((col) => (
              <div key={col.title}>
                <div className="text-white text-xs font-bold uppercase tracking-widest mb-4">
                  {col.title}
                </div>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-white/60 text-sm hover:text-white/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c0392b]"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-white/40 text-xs">
              © 2026 UniClubs. All rights reserved.
            </span>
            <span className="text-white/40 text-xs">
              University Club Management System
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
