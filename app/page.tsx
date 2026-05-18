"use client";
import Link from "next/link";

const clubs = [
  { id: "IEEE", nom: "IEEE", description: "Web workshops, algorithms, and tech projects.", membresCount: 42 },
  { id: "croissant-rouge", nom: "Croissant Rouge", description: "Volunteering, humanitarian aid, and community service.", membresCount: 28 },
  { id: "cavalo", nom: "Cavalo Chess", description: "Strategy, competition, and chess excellence.", membresCount: 35 },
];

const events = [
  { id: "evt-1", titre: "Campus Hackathon", date: "2026-05-02", lieu: "Room A12", estPublic: true, club: "IEEE" },
  { id: "evt-2", titre: "Arduino Workshop", date: "2026-05-10", lieu: "Robotics Lab", estPublic: false, club: "IEEE" },
  { id: "evt-3", titre: "Blood Donation Drive", date: "2026-05-15", lieu: "Main Hall", estPublic: true, club: "Croissant Rouge" },
  { id: "evt-4", titre: "University Chess Tournament", date: "2026-05-20", lieu: "Library Hall", estPublic: true, club: "Cavalo" },
];

export default function LandingPage() {
  return (
      <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", color: "var(--color-text-body)", background: "var(--color-bg)" }}>

        {/* NAVBAR — dark navy */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "#0d1b2a",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 60px", height: 70,
          boxShadow: "0 2px 12px rgba(0,0,0,0.18)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6 }}>
              <span style={{ color: "#0d1b2a", fontWeight: 700, fontSize: 16, fontFamily: "sans-serif" }}>U</span>
            </div>
            <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: 20, color: "#ffffff", letterSpacing: "-0.3px" }}>
            Uni<span style={{ color: "#f59e0b" }}>Clubs</span>
          </span>
          </div>

          <div style={{ display: "flex", gap: 36, fontFamily: "sans-serif", fontSize: 14 }}>
            {["#about", "#clubs", "#events", "#contact"].map((href, i) => (
                <a key={href} href={href} style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", transition: "color 0.2s" }}
                   onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
                   onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}>
                  {["About", "Clubs", "Events", "Contact"][i]}
                </a>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, fontFamily: "sans-serif" }}>
            <Link href="/sign-in" style={{
              border: "2px solid rgba(255,255,255,0.5)", color: "#ffffff",
              background: "transparent", borderRadius: 8, padding: "8px 20px",
              fontSize: 14, fontWeight: 500, textDecoration: "none", transition: "all 0.2s"
            }}>Log In</Link>
            <Link href="/sign-up" style={{
              background: "#f59e0b", color: "#0d1b2a",
              borderRadius: 8, padding: "8px 20px",
              fontSize: 14, fontWeight: 600, textDecoration: "none", border: "2px solid #f59e0b"
            }}>Sign Up</Link>
          </div>
        </nav>

        {/* HERO */}
        <section style={{
          position: "relative", height: 580,
          background: "linear-gradient(135deg, #0d1b2a 0%, #1e3a5f 50%, #0d1b2a 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", inset: 0, opacity: 0.05,
            backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 60px)"
          }} />
          <div style={{ position: "relative", textAlign: "center", color: "#ffffff", maxWidth: 700, padding: "0 24px" }}>
            <div style={{
              display: "inline-block", background: "#f59e0b", color: "#0d1b2a",
              fontFamily: "sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 2,
              padding: "6px 16px", marginBottom: 28, textTransform: "uppercase", borderRadius: 4
            }}>University Life Platform</div>

            {/* WHITE heading */}
            <h1 style={{
              fontSize: 58, fontWeight: 400, lineHeight: 1.1, margin: "0 0 20px",
              fontFamily: "'Georgia', serif", color: "#ffffff"
            }}>
              Your Campus.<br />Your Clubs.<br />
              <em style={{ color: "#f59e0b" }}>Your Community.</em>
            </h1>

            <p style={{
              fontFamily: "sans-serif", fontSize: 17, color: "rgba(255,255,255,0.75)",
              margin: "0 0 40px", lineHeight: 1.6, fontWeight: 300
            }}>
              Discover university clubs, join events, and connect with students who share your passions.
            </p>

            <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
              <Link href="/sign-up" style={{
                background: "#f59e0b", color: "#0d1b2a",
                padding: "14px 36px", fontSize: 15, fontFamily: "sans-serif", fontWeight: 600,
                borderRadius: 8, textDecoration: "none", border: "2px solid #f59e0b"
              }}>Get Started</Link>
              <a href="#clubs" style={{
                background: "rgba(255,255,255,0.12)", color: "#ffffff",
                padding: "14px 36px", fontSize: 15, fontFamily: "sans-serif", fontWeight: 400,
                borderRadius: 8, textDecoration: "none", border: "2px solid rgba(255,255,255,0.3)"
              }}>Explore Clubs</a>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <div style={{
          background: "#0d1b2a", padding: "20px 60px",
          display: "flex", justifyContent: "center", gap: 80
        }}>
          {[
            { value: "12+", label: "Active Clubs" },
            { value: "400+", label: "Members" },
            { value: "50+", label: "Events / Year" },
          ].map(stat => (
              <div key={stat.label} style={{ textAlign: "center", color: "#ffffff" }}>
                <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "sans-serif" }}>{stat.value}</div>
                <div style={{ fontSize: 13, opacity: 0.75, fontFamily: "sans-serif", letterSpacing: 0.5 }}>{stat.label}</div>
              </div>
          ))}
        </div>

        {/* ABOUT SECTION */}
        <section id="about" style={{ padding: "100px 60px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <div style={{
                fontFamily: "sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 2,
                color: "#f59e0b", textTransform: "uppercase", marginBottom: 16
              }}>About the Platform</div>
              <h2 style={{ fontSize: 40, fontWeight: 400, margin: "0 0 24px", lineHeight: 1.2, color: "#0d1b2a" }}>
                Bringing Students Together Through Shared Interests
              </h2>
              <p style={{ color: "#64748b", lineHeight: 1.8, fontSize: 16, fontFamily: "sans-serif", margin: "0 0 20px" }}>
                UniClubs is the central hub for university club management. Whether you're a student looking to join a community, a club member staying up to date, or a club president organizing events — everything you need is in one place.
              </p>
              <p style={{ color: "#64748b", lineHeight: 1.8, fontSize: 16, fontFamily: "sans-serif", margin: "0 0 32px" }}>
                From academic societies to humanitarian organizations and competitive clubs, discover your place on campus.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  "Browse and join clubs that match your interests",
                  "Register for public and private events",
                  "Stay informed with club announcements",
                ].map(item => (
                    <div key={item} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontFamily: "sans-serif" }}>
                      <div style={{ width: 20, height: 20, background: "#f59e0b", flexShrink: 0, marginTop: 2, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "#0d1b2a", fontSize: 12, fontWeight: 700 }}>✓</span>
                      </div>
                      <span style={{ color: "#1e293b", fontSize: 15 }}>{item}</span>
                    </div>
                ))}
              </div>
            </div>
            <div style={{ background: "#0d1b2a", padding: 48, position: "relative", borderRadius: 12 }}>
              <div style={{ position: "absolute", top: 12, right: 12, width: 60, height: 60, border: "2px solid #f59e0b", opacity: 0.4, borderRadius: 8 }} />
              <div style={{ color: "#ffffff" }}>
                <div style={{ fontSize: 14, fontFamily: "sans-serif", color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>For Students</div>
                <div style={{ fontSize: 20, marginBottom: 24 }}>Discover your community</div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 24, marginTop: 24 }}>
                  <div style={{ fontSize: 14, fontFamily: "sans-serif", color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>For Club Members</div>
                  <div style={{ fontSize: 20, marginBottom: 24 }}>Stay connected & informed</div>
                </div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 24 }}>
                  <div style={{ fontSize: 14, fontFamily: "sans-serif", color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>For Presidents</div>
                  <div style={{ fontSize: 20 }}>Manage with ease</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CLUBS SECTION */}
        <section id="clubs" style={{ background: "#f8fafc", padding: "100px 60px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <div style={{
                fontFamily: "sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 2,
                color: "#f59e0b", textTransform: "uppercase", marginBottom: 16
              }}>Our Community</div>
              <h2 style={{ fontSize: 42, fontWeight: 400, margin: 0, color: "#0d1b2a" }}>Featured Clubs</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
              {clubs.map(club => (
                  <div key={club.id} style={{
                    background: "#ffffff", padding: 36,
                    borderTop: "3px solid #f59e0b",
                    borderRadius: 8,
                    boxShadow: "0 2px 20px rgba(0,0,0,0.06)"
                  }}>
                    <div style={{
                      width: 48, height: 48, background: "#fef3c7", borderRadius: 8,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: 16
                    }}>
                  <span style={{ color: "#f59e0b", fontWeight: 700, fontSize: 20, fontFamily: "sans-serif" }}>
                    {club.nom.charAt(0)}
                  </span>
                    </div>
                    <h3 style={{ fontSize: 22, fontWeight: 400, margin: "0 0 12px", color: "#0d1b2a" }}>{club.nom}</h3>
                    <p style={{ color: "#64748b", fontFamily: "sans-serif", fontSize: 14, lineHeight: 1.7, margin: "0 0 24px" }}>
                      {club.description}
                    </p>
                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      borderTop: "1px solid #e2e8f0", paddingTop: 20
                    }}>
                  <span style={{ fontFamily: "sans-serif", fontSize: 13, color: "#64748b" }}>
                    {club.membresCount} members
                  </span>
                      <Link href="/clubs" style={{
                        fontFamily: "sans-serif", fontSize: 13, color: "#f59e0b",
                        textDecoration: "none", fontWeight: 600
                      }}>Learn More →</Link>
                    </div>
                  </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 48 }}>
              <Link href="/clubs" style={{
                border: "2px solid #0d1b2a", color: "#0d1b2a",
                background: "transparent", borderRadius: 8,
                padding: "14px 40px", fontFamily: "sans-serif", fontSize: 15, fontWeight: 500,
                textDecoration: "none", display: "inline-block"
              }}>View All Clubs</Link>
            </div>
          </div>
        </section>

        {/* EVENTS SECTION */}
        <section id="events" style={{ padding: "100px 60px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 60 }}>
              <div style={{
                fontFamily: "sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 2,
                color: "#f59e0b", textTransform: "uppercase", marginBottom: 16
              }}>What's Happening</div>
              <h2 style={{ fontSize: 42, fontWeight: 400, margin: 0, color: "#0d1b2a" }}>Upcoming Events</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {events.map((evt, i) => (
                  <div key={evt.id} style={{
                    display: "grid", gridTemplateColumns: "100px 1fr auto auto",
                    alignItems: "center", gap: 32,
                    padding: "28px 32px",
                    background: i % 2 === 0 ? "#ffffff" : "#f8fafc",
                    borderLeft: "4px solid " + (evt.estPublic ? "#f59e0b" : "#0d1b2a"),
                  }}>
                    <div>
                      <div style={{ fontFamily: "sans-serif", fontSize: 24, fontWeight: 700, color: "#0d1b2a" }}>
                        {new Date(evt.date).toLocaleDateString("en-US", { day: "2-digit" })}
                      </div>
                      <div style={{ fontFamily: "sans-serif", fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 }}>
                        {new Date(evt.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 400, marginBottom: 4, color: "#0d1b2a" }}>{evt.titre}</div>
                      <div style={{ fontFamily: "sans-serif", fontSize: 13, color: "#64748b" }}>
                        {evt.lieu} &nbsp;·&nbsp; {evt.club}
                      </div>
                    </div>
                    <span style={{
                      fontFamily: "sans-serif", fontSize: 12, padding: "4px 12px", borderRadius: 20,
                      background: evt.estPublic ? "rgba(245,158,11,0.12)" : "rgba(13,27,42,0.08)",
                      color: evt.estPublic ? "#d97706" : "#0d1b2a",
                      fontWeight: 500
                    }}>
                  {evt.estPublic ? "Public" : "Members Only"}
                </span>
                    <Link href="/sign-up" style={{
                      fontFamily: "sans-serif", fontSize: 13, color: "#f59e0b",
                      textDecoration: "none", fontWeight: 600
                    }}>Register →</Link>
                  </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 48 }}>
              <Link href="/sign-up" style={{
                background: "#f59e0b", color: "#0d1b2a",
                padding: "14px 40px", fontFamily: "sans-serif", fontSize: 15, fontWeight: 600,
                borderRadius: 8, textDecoration: "none", display: "inline-block"
              }}>View All Events</Link>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section style={{ background: "#0d1b2a", padding: "80px 60px", textAlign: "center" }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <h2 style={{ fontSize: 40, fontWeight: 400, color: "#ffffff", margin: "0 0 20px" }}>
              Ready to Get Involved?
            </h2>
            <p style={{ color: "rgba(255,255,255,0.65)", fontFamily: "sans-serif", fontSize: 16, margin: "0 0 40px", lineHeight: 1.7 }}>
              Create your account today and start exploring clubs, events, and your university community.
            </p>
            <Link href="/sign-up" style={{
              background: "#f59e0b", color: "#0d1b2a",
              padding: "16px 48px", fontFamily: "sans-serif", fontSize: 16, fontWeight: 600,
              borderRadius: 8, textDecoration: "none", display: "inline-block"
            }}>Sign Up — It's Free</Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer id="contact" style={{ background: "#0d1b2a", padding: "60px 60px 30px", color: "#ffffff" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 28, height: 28, background: "#f59e0b", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#0d1b2a", fontWeight: 700, fontSize: 14, fontFamily: "sans-serif" }}>U</span>
                  </div>
                  <span style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: 18, color: "#ffffff" }}>
                  Uni<span style={{ color: "#f59e0b" }}>Clubs</span>
                </span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.55)", fontFamily: "sans-serif", fontSize: 14, lineHeight: 1.7, maxWidth: 260 }}>
                  The official university clubs and events management platform.
                </p>
              </div>
              {[
                { title: "Platform", links: ["Home", "Clubs", "Events", "Announcements"] },
                { title: "Roles", links: ["Student", "Member", "President", "Admin"] },
                { title: "Support", links: ["Help Center", "Contact", "Privacy Policy", "Terms"] },
              ].map(col => (
                  <div key={col.title}>
                    <div style={{ color: "#ffffff", fontFamily: "sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 20 }}>
                      {col.title}
                    </div>
                    {col.links.map(link => (
                        <div key={link} style={{ marginBottom: 10 }}>
                          <a href="#" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "sans-serif", fontSize: 14, textDecoration: "none" }}>
                            {link}
                          </a>
                        </div>
                    ))}
                  </div>
              ))}
            </div>
            <div style={{
              borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 28,
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
            <span style={{ color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif", fontSize: 13 }}>
              © 2026 UniClubs. All rights reserved.
            </span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif", fontSize: 13 }}>
              University Club Management System
            </span>
            </div>
          </div>
        </footer>
      </div>
  );
}
