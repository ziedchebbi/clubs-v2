"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";

const NAVY = "#0d1b3e";
const CRIMSON = "#c0392b";

export default function LandingPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div
      className="min-h-screen flex flex-col font-sans bg-white"
      style={{ fontFamily: "Georgia, serif" }}
    >
      {/* Navbar */}
      <nav
        className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <span
              className="text-2xl font-extrabold tracking-tight"
              style={{ color: NAVY }}
            >
              Uni<span style={{ color: CRIMSON }}>Clubs</span>
            </span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <Link
              href="#about"
              className="text-gray-700 hover:text-blue-700 font-medium"
            >
              About
            </Link>
            <Link
              href="#clubs"
              className="text-gray-700 hover:text-blue-700 font-medium"
            >
              Clubs
            </Link>
            <Link
              href="#events"
              className="text-gray-700 hover:text-blue-700 font-medium"
            >
              Events
            </Link>
            <Link
              href="#contact"
              className="text-gray-700 hover:text-blue-700 font-medium"
            >
              Contact
            </Link>
          </div>
          <div className="flex gap-3 items-center">
            {session ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="px-3 py-1 rounded bg-gray-100 text-sm font-semibold text-gray-800 hover:bg-gray-200 border border-gray-300"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="px-4 py-1.5 rounded bg-gray-100 text-sm font-semibold text-gray-800 hover:bg-gray-200 border border-gray-300"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/sign-in"
                  className="px-4 py-1.5 rounded border border-gray-300 text-sm font-semibold text-gray-800 hover:bg-gray-100"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="px-4 py-1.5 rounded bg-[var(--crimson,#c0392b)] text-white text-sm font-semibold hover:bg-red-700"
                  style={{ background: CRIMSON }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="w-full py-24 px-4 text-center"
        style={{
          background: `linear-gradient(120deg, ${NAVY} 60%, #1a295a 100%)`,
          color: "#fff",
        }}
      >
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Your Campus. Your Clubs. Your Community.
        </h1>
        <p
          className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Discover, join, and lead student clubs at your university. Connect
          with peers, attend events, and make your mark on campus life.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/auth/sign-up"
            className="px-8 py-3 rounded bg-[var(--crimson,#c0392b)] text-white font-semibold text-lg shadow hover:bg-red-700"
            style={{ background: CRIMSON }}
          >
            Get Started
          </Link>
          <Link
            href="#clubs"
            className="px-8 py-3 rounded border border-white text-white font-semibold text-lg hover:bg-white hover:text-[var(--navy,#0d1b3e)] transition"
            style={{ color: "#fff", borderColor: "#fff" }}
          >
            Explore Clubs
          </Link>
        </div>
      </section>

      {/* Stats Bar */}
      <section
        className="w-full bg-[var(--crimson,#c0392b)] text-white py-4 flex justify-center gap-12 text-center text-lg font-semibold shadow"
        style={{ background: CRIMSON }}
      >
        <div>
          12+ <span className="font-normal">Active Clubs</span>
        </div>
        <div>
          400+ <span className="font-normal">Members</span>
        </div>
        <div>
          50+ <span className="font-normal">Events / Year</span>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="max-w-5xl mx-auto py-20 px-4"
        style={{ fontFamily: "Georgia, serif" }}
      >
        <h2 className="text-3xl font-bold mb-4 text-[var(--navy,#0d1b3e)]">
          About UniClubs
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          UniClubs is your all-in-one platform for discovering, joining, and
          managing student clubs at your university. Whether you're a student
          looking to get involved, a club member organizing events, or a club
          president managing your team, UniClubs makes campus life easier and
          more connected.
        </p>
        <ul className="list-disc pl-6 text-gray-800 space-y-2">
          <li>
            <b>For Students:</b> Browse and join clubs, RSVP to events, and
            connect with like-minded peers.
          </li>
          <li>
            <b>For Club Members:</b> Stay updated on club activities,
            participate in discussions, and manage your memberships.
          </li>
          <li>
            <b>For Club Presidents:</b> Streamline club management, assign
            roles, and promote your club to the campus community.
          </li>
        </ul>
      </section>

      {/* Featured Clubs */}
      <section id="clubs" className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-2xl font-bold mb-8 text-[var(--navy,#0d1b3e)]">
          Featured Clubs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "IEEE",
              desc: "Advancing technology for humanity. Workshops, competitions, and networking.",
              logo: "/ieee-logo.png",
            },
            {
              name: "Croissant Rouge",
              desc: "Humanitarian club focused on volunteering and social impact.",
              logo: "/croissant-rouge-logo.png",
            },
            {
              name: "Cavalo Chess",
              desc: "For chess lovers of all levels. Tournaments, lessons, and fun!",
              logo: "/chess-logo.png",
            },
          ].map((club) => (
            <div
              key={club.name}
              className="bg-white rounded-lg shadow p-6 flex flex-col items-center border border-gray-100"
            >
              <div className="w-20 h-20 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
                {/* Placeholder for logo */}
                <img
                  src={club.logo}
                  alt={club.name + " logo"}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[var(--navy,#0d1b3e)]">
                {club.name}
              </h3>
              <p className="text-gray-700 mb-4 text-center">{club.desc}</p>
              <Link
                href="/etudiant/clubs"
                className="text-[var(--crimson,#c0392b)] font-semibold hover:underline"
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="events" className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-2xl font-bold mb-8 text-[var(--navy,#0d1b3e)]">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              name: "Welcome Fair",
              date: "Sep 15, 2026",
              club: "All Clubs",
              type: "Public",
            },
            {
              name: "IEEE Hackathon",
              date: "Oct 2, 2026",
              club: "IEEE",
              type: "Members Only",
            },
            {
              name: "Blood Donation Drive",
              date: "Nov 10, 2026",
              club: "Croissant Rouge",
              type: "Public",
            },
            {
              name: "Chess Open",
              date: "Dec 5, 2026",
              club: "Cavalo Chess",
              type: "Members Only",
            },
          ].map((event) => (
            <div
              key={event.name}
              className="bg-white rounded-lg shadow p-6 flex flex-col border border-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-[var(--navy,#0d1b3e)]">
                  {event.name}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${event.type === "Public" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"}`}
                >
                  {event.type}
                </span>
              </div>
              <div className="text-gray-600 mb-1">{event.date}</div>
              <div className="text-gray-700">
                Hosted by <span className="font-semibold">{event.club}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="w-full py-12 bg-[var(--navy,#0d1b3e)] text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Involved?</h2>
        <Link
          href="/auth/sign-up"
          className="inline-block px-8 py-3 rounded bg-[var(--crimson,#c0392b)] text-white font-semibold text-lg shadow hover:bg-red-700"
          style={{ background: CRIMSON }}
        >
          Sign Up
        </Link>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-100 py-8 mt-auto border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[var(--navy,#0d1b3e)] font-bold text-lg">
            UniClubs
          </div>
          <div className="flex gap-6 text-gray-700 text-sm">
            <Link href="#about">About</Link>
            <Link href="#clubs">Clubs</Link>
            <Link href="#events">Events</Link>
            <Link href="#contact">Contact</Link>
          </div>
          <div className="text-gray-500 text-xs">
            © {new Date().getFullYear()} UniClubs. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
