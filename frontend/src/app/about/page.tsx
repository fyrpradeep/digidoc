"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const STATS = [
  { n: "500+",  l: "Verified Doctors",   icon: "🩺", c: "#00FFD1" },
  { n: "50K+",  l: "Patients Served",    icon: "👥", c: "#4DB8FF" },
  { n: "12+",   l: "Specialties",        icon: "🏥", c: "#A78BFA" },
  { n: "4.9★",  l: "Average Rating",     icon: "⭐", c: "#FFB347" },
  { n: "24/7",  l: "Always Available",   icon: "🕐", c: "#34D399" },
  { n: "~2min", l: "Avg. Wait Time",     icon: "⚡", c: "#FB923C" },
];

const TEAM = [
  { name: "Dr. Rajesh Verma",  role: "Chief Medical Officer", avatar: "👨‍⚕️", bio: "20+ years in digital health" },
  { name: "Priya Mehta",       role: "CEO & Co-founder",      avatar: "👩‍💼", bio: "Ex-Google, IIT Delhi alumni" },
  { name: "Arjun Singh",       role: "CTO & Co-founder",      avatar: "👨‍💻", bio: "Built healthcare tech at scale" },
  { name: "Dr. Sneha Rao",     role: "Head of Quality",       avatar: "👩‍⚕️", bio: "Ensuring world-class care" },
];

const VALUES = [
  { icon: "❤️",  title: "Patient First",      desc: "Every decision we make starts with — will this help the patient?" },
  { icon: "🔒",  title: "Privacy Always",     desc: "Your health data is yours. Encrypted, protected, never sold." },
  { icon: "✅",  title: "Doctor Quality",     desc: "Every doctor is MCI-verified, background-checked, and reviewed." },
  { icon: "⚡",  title: "Speed & Access",     desc: "Healthcare when you need it — not when you can get an appointment." },
];

const MILESTONES = [
  { year: "2023", title: "DigiDoc Founded",          desc: "Started with a vision to make doctors accessible to everyone" },
  { year: "2024", title: "100 Doctors Onboarded",    desc: "First 100 verified doctors joined the platform" },
  { year: "2024", title: "10,000 Consultations",     desc: "Reached 10K successful consultations milestone" },
  { year: "2025", title: "Medicine Delivery Launched",desc: "End-to-end healthcare — from consult to doorstep delivery" },
  { year: "2026", title: "500+ Doctors · 50K Patients",desc: "Growing every day — India's most complete telemedicine platform" },
];

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
  @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  .a1{animation:fadeUp 0.6s ease 0.0s both}
  .a2{animation:fadeUp 0.6s ease 0.12s both}
  .a3{animation:fadeUp 0.6s ease 0.24s both}
  .a4{animation:fadeUp 0.6s ease 0.36s both}
  .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .gc{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:18px;transition:all 0.3s}
  .gc:hover{border-color:rgba(0,255,209,0.18);background:rgba(0,255,209,0.03)}
  .btna{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:14px 28px;border-radius:100px;font-family:inherit;font-weight:800;font-size:14px;color:white;border:none;cursor:pointer;transition:all 0.3s;background:linear-gradient(135deg,#00C9A7,#0B6FCC);box-shadow:0 0 24px rgba(0,201,167,0.3);text-decoration:none}
  .btna:hover{transform:translateY(-2px);box-shadow:0 0 36px rgba(0,201,167,0.45)}
  .btnb{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 24px;border-radius:100px;font-family:inherit;font-weight:600;font-size:14px;color:#00FFD1;border:1.5px solid rgba(0,255,209,0.28);background:rgba(0,255,209,0.05);cursor:pointer;transition:all 0.3s;text-decoration:none}
  .btnb:hover{background:rgba(0,255,209,0.1);border-color:rgba(0,255,209,0.5)}
  .livdot{width:8px;height:8px;border-radius:50%;background:#00FFD1;display:inline-block;position:relative}
  .livdot::after{content:'';position:absolute;inset:-4px;border-radius:50%;background:rgba(0,255,209,0.3);animation:ripple 1.8s infinite}
  .float{animation:floatY 4s ease-in-out infinite}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
  .hgrid{position:absolute;inset:0;background-image:linear-gradient(rgba(0,255,209,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,209,0.025) 1px,transparent 1px);background-size:40px 40px;mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,black,transparent);pointer-events:none}
`;

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);
  const [cnt, setCnt]         = useState({ doctors: 0, patients: 0 });
  const statsRef              = useRef<HTMLDivElement>(null);
  const counted               = useRef(false);

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !counted.current) {
        counted.current = true;
        let d = 0, p = 0;
        const t = setInterval(() => {
          d = Math.min(d + 10, 500);
          p = Math.min(p + 1000, 50000);
          setCnt({ doctors: d, patients: p });
          if (d >= 500) clearInterval(t);
        }, 20);
      }
    }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <main style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", background: "#020D1A", color: "#E8F4FF", overflowX: "hidden" }}>
      <style>{S}</style>

      {/* BG GLOW */}
      <div style={{ position: "fixed", top: "5%", left: "50%", transform: "translateX(-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,100,200,0.08),transparent)", pointerEvents: "none", zIndex: 0 }} />

      {/* NAVBAR */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 20px", background: scrollY > 30 ? "rgba(2,13,26,0.93)" : "transparent", backdropFilter: scrollY > 30 ? "blur(24px)" : "none", borderBottom: scrollY > 30 ? "1px solid rgba(0,255,209,0.09)" : "1px solid transparent", transition: "all 0.4s" }}>
        <Link href="/"><Image src="/logo.png" alt="DigiDoc" width={120} height={40} style={{ height: 32, width: "auto", filter: "brightness(1.1)" }} /></Link>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/login" className="btnb" style={{ padding: "8px 16px", fontSize: 12 }}>Sign In</Link>
          <Link href="/login" className="btna" style={{ padding: "8px 16px", fontSize: 12 }}>Get Started</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: "relative", padding: "52px 20px 60px", textAlign: "center", overflow: "hidden", zIndex: 1 }}>
        <div className="hgrid" />

        <div className="a1" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 100, marginBottom: 20, background: "rgba(0,255,209,0.08)", border: "1px solid rgba(0,255,209,0.2)" }}>
          <span className="livdot" />
          <span style={{ color: "#00FFD1", fontSize: 11, fontWeight: 700 }}>Our Story</span>
        </div>

        <h1 className="a2" style={{ fontSize: 34, fontWeight: 900, lineHeight: 1.15, marginBottom: 16, letterSpacing: "-0.5px" }}>
          We believe <span className="shine">everyone</span><br />deserves a doctor.
        </h1>

        <p className="a3" style={{ color: "rgba(232,244,255,0.55)", fontSize: 14, lineHeight: 1.8, maxWidth: 320, margin: "0 auto 28px" }}>
          DigiDoc was born from a simple belief — quality healthcare should not depend on where you live, how much you earn, or whether you can get an appointment.
        </p>

        <div className="a4 float" style={{ display: "inline-block" }}>
          <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg,rgba(0,201,167,0.2),rgba(11,111,204,0.2))", border: "2px solid rgba(0,255,209,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🏥</div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section style={{ padding: "36px 20px", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "relative", zIndex: 1 }}>
        <p style={{ textAlign: "center", color: "#00FFD1", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 }}>Our Mission</p>
        <h2 style={{ textAlign: "center", fontSize: 22, fontWeight: 800, marginBottom: 14 }}>Making Healthcare Human Again</h2>
        <p style={{ color: "rgba(232,244,255,0.5)", fontSize: 13, lineHeight: 1.85, textAlign: "center", maxWidth: 340, margin: "0 auto" }}>
          We connect patients with verified, experienced doctors through technology — removing the friction of booking, waiting, and travelling. From symptom to solution in minutes, not days.
        </p>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} style={{ padding: "40px 20px", position: "relative", zIndex: 1 }}>
        <p style={{ textAlign: "center", color: "#00FFD1", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 3, marginBottom: 20 }}>By The Numbers</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { n: cnt.doctors + "+",              l: "Doctors",      icon: "🩺", c: "#00FFD1" },
            { n: Math.floor(cnt.patients/1000) + "K+", l: "Patients", icon: "👥", c: "#4DB8FF" },
            { n: "12+",                          l: "Specialties",  icon: "🏥", c: "#A78BFA" },
            { n: "4.9★",                         l: "Rating",       icon: "⭐", c: "#FFB347" },
            { n: "24/7",                         l: "Available",    icon: "🕐", c: "#34D399" },
            { n: "~2 min",                       l: "Wait Time",    icon: "⚡", c: "#FB923C" },
          ].map(s => (
            <div key={s.l} className="gc" style={{ padding: "14px 10px", textAlign: "center" }}>
              <span style={{ fontSize: 22, display: "block", marginBottom: 6 }}>{s.icon}</span>
              <p style={{ fontWeight: 900, fontSize: 16, color: s.c }}>{s.n}</p>
              <p style={{ fontSize: 10, color: "rgba(232,244,255,0.4)", marginTop: 3 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── VALUES ── */}
      <section style={{ padding: "36px 20px", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "relative", zIndex: 1 }}>
        <p style={{ textAlign: "center", color: "#00FFD1", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 }}>What We Stand For</p>
        <h2 style={{ textAlign: "center", fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Our Core Values</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {VALUES.map(v => (
            <div key={v.title} className="gc" style={{ padding: "16px 18px", display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(0,255,209,0.08)", border: "1px solid rgba(0,255,209,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{v.icon}</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: "#E8F4FF", marginBottom: 5 }}>{v.title}</p>
                <p style={{ color: "rgba(232,244,255,0.5)", fontSize: 12, lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MILESTONES ── */}
      <section style={{ padding: "40px 20px", position: "relative", zIndex: 1 }}>
        <p style={{ textAlign: "center", color: "#00FFD1", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 }}>Our Journey</p>
        <h2 style={{ textAlign: "center", fontSize: 22, fontWeight: 800, marginBottom: 28 }}>How We Got Here</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {MILESTONES.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 16, position: "relative" }}>
              {/* Line */}
              {i < MILESTONES.length - 1 && (
                <div style={{ position: "absolute", left: 19, top: 40, width: 2, height: "calc(100% - 12px)", background: "linear-gradient(to bottom,rgba(0,255,209,0.3),rgba(0,255,209,0.05))" }} />
              )}
              {/* Dot */}
              <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,rgba(0,201,167,0.2),rgba(11,111,204,0.2))", border: "1.5px solid rgba(0,255,209,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#00FFD1" }}>{m.year}</div>
              <div style={{ paddingBottom: 24, flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: "#E8F4FF", marginBottom: 4 }}>{m.title}</p>
                <p style={{ color: "rgba(232,244,255,0.45)", fontSize: 12, lineHeight: 1.6 }}>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ padding: "36px 20px", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "relative", zIndex: 1 }}>
        <p style={{ textAlign: "center", color: "#00FFD1", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 }}>The People</p>
        <h2 style={{ textAlign: "center", fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Leadership Team</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {TEAM.map(t => (
            <div key={t.name} className="gc" style={{ padding: "18px 14px", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,rgba(0,201,167,0.15),rgba(11,111,204,0.15))", border: "1.5px solid rgba(0,255,209,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 10px" }}>{t.avatar}</div>
              <p style={{ fontWeight: 700, fontSize: 13, color: "#E8F4FF", marginBottom: 3 }}>{t.name}</p>
              <p style={{ color: "#00FFD1", fontSize: 10, fontWeight: 600, marginBottom: 4 }}>{t.role}</p>
              <p style={{ color: "rgba(232,244,255,0.35)", fontSize: 10, lineHeight: 1.5 }}>{t.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRUST ── */}
      <section style={{ margin: "28px 20px", borderRadius: 24, padding: "30px 22px", background: "linear-gradient(135deg,rgba(11,111,204,0.2),rgba(0,201,167,0.15))", border: "1px solid rgba(0,255,209,0.14)", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 32, marginBottom: 10 }}>🛡️</p>
          <h2 style={{ color: "#E8F4FF", fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Safe. Secure. Trusted.</h2>
          <p style={{ color: "rgba(232,244,255,0.55)", fontSize: 12, lineHeight: 1.8, marginBottom: 16 }}>
            All doctors are MCI-registered. Data is end-to-end encrypted. Consultations are 100% private.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8 }}>
            {["MCI Verified","HIPAA Compliant","Data Encrypted","Made in India"].map(b => (
              <span key={b} style={{ padding: "5px 12px", borderRadius: 100, background: "rgba(0,255,209,0.07)", color: "#00FFD1", fontSize: 11, fontWeight: 600, border: "1px solid rgba(0,255,209,0.18)" }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "40px 20px 52px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 10, lineHeight: 1.2 }}>
          Ready to experience<br /><span className="shine">the future of healthcare?</span>
        </h2>
        <p style={{ color: "rgba(232,244,255,0.45)", fontSize: 13, marginBottom: 24 }}>
          Join 50,000+ patients already using DigiDoc.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 300, margin: "0 auto" }}>
          <Link href="/login" className="btna">🩺 Consult a Doctor — Free</Link>
          <Link href="/register-doctor" className="btnb">👨‍⚕️ Join as a Doctor</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "22px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center", position: "relative", zIndex: 1 }}>
        <Image src="/logo.png" alt="DigiDoc" width={100} height={34} style={{ height: 28, width: "auto", margin: "0 auto 8px", display: "block", filter: "brightness(1.2)" }} />
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, marginBottom: 12 }}>Doctor Anywhere Anytime</p>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 16, marginBottom: 12 }}>
          {[["Home","/"],["Login","/login"],["Privacy","/privacy"],["Terms","/terms"],["Contact","/contact"]].map(([l,h]) => (
            <Link key={l} href={h} style={{ color: "rgba(255,255,255,0.28)", fontSize: 11, textDecoration: "none" }}>{l}</Link>
          ))}
        </div>
        <p style={{ color: "rgba(255,255,255,0.12)", fontSize: 10 }}>2026 DigiDoc. All rights reserved. Made with love in India</p>
      </footer>
    </main>
  );
}
