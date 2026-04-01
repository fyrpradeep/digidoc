"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const FEATURES = [
  { icon: "🧠", title: "AI Symptom Intelligence", desc: "Describe your symptoms. AI instantly finds the right specialist for you.", color: "#00FFD1" },
  { icon: "📹", title: "HD Video Consultation", desc: "Crystal-clear video calls with verified doctors. Built directly into DigiDoc.", color: "#4DB8FF" },
  { icon: "💊", title: "Smart Digital Prescription", desc: "Doctors write prescriptions live on the platform. One tap to order.", color: "#A78BFA" },
  { icon: "🚀", title: "Medicine Home Delivery", desc: "Prescribed medicines ordered in a single tap. Fast doorstep delivery.", color: "#FB923C" },
  { icon: "🤖", title: "24/7 AI Health Assistant", desc: "3am health anxiety? Our AI is always on. Always calm. Always helpful.", color: "#F472B6" },
  { icon: "📡", title: "Real-time Doctor Availability", desc: "See which doctors are online right now. No appointments. Just connect.", color: "#34D399" },
];

const STEPS = [
  { n: "01", icon: "📋", title: "Describe Your Symptoms", sub: "Talk to AI or fill a quick quiz" },
  { n: "02", icon: "⚡", title: "Instant Doctor Match", sub: "AI selects the perfect specialist" },
  { n: "03", icon: "📹", title: "Video or Audio Call", sub: "Consult from literally anywhere" },
  { n: "04", icon: "💊", title: "Prescription + Delivery", sub: "Digital Rx and medicines at your door" },
];

const SPECS = [
  { icon: "🫀", name: "Cardiology" },
  { icon: "🧠", name: "Neurology" },
  { icon: "🦷", name: "Dentistry" },
  { icon: "👁️", name: "Eye Care" },
  { icon: "🦴", name: "Orthopedics" },
  { icon: "🧒", name: "Pediatrics" },
  { icon: "🌸", name: "Gynecology" },
  { icon: "🫁", name: "Pulmonology" },
  { icon: "🩹", name: "Dermatology" },
  { icon: "🩺", name: "General" },
  { icon: "🧬", name: "Oncology" },
  { icon: "🦻", name: "ENT" },
];

const REVIEWS = [
  { name: "Priya M.", city: "Mumbai", text: "Fever at midnight. Video call with a doctor in under 3 minutes. This changed everything for me.", avatar: "👩", stars: 5 },
  { name: "Rajesh K.", city: "Delhi", text: "Prescription was ready before the call ended. Medicine arrived by morning. Unbelievable.", avatar: "👨", stars: 5 },
  { name: "Ananya S.", city: "Bangalore", text: "No waiting rooms. No appointments. Just open DigiDoc and talk to a doctor. Pure magic.", avatar: "👩‍💼", stars: 5 },
];

export default function Page() {
  const [rev, setRev] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [cnt, setCnt] = useState({ d: 0, p: 0 });
  const statsRef = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setRev(p => (p + 1) % 3), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !counted.current) {
        counted.current = true;
        let d = 0, p = 0;
        const t = setInterval(() => {
          d = Math.min(d + 10, 500);
          p = Math.min(p + 800, 50000);
          setCnt({ d, p });
          if (d >= 500) clearInterval(t);
        }, 20);
      }
    }, { threshold: 0.4 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const nav = scrollY > 40;

  return (
    <main style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#020D1A", color: "#E8F4FF", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
        @keyframes scanline{0%{top:-10%}100%{top:110%}}
        @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .a1{animation:fadeUp 0.7s ease 0.0s both}
        .a2{animation:fadeUp 0.7s ease 0.12s both}
        .a3{animation:fadeUp 0.7s ease 0.24s both}
        .a4{animation:fadeUp 0.7s ease 0.36s both}
        .a5{animation:fadeUp 0.7s ease 0.5s both}
        .a6{animation:fadeUp 0.7s ease 0.64s both}
        .float{animation:floatY 4s ease-in-out infinite}
        .float2{animation:floatY 5s ease-in-out 1s infinite}
        .float3{animation:floatY 3.5s ease-in-out 1.8s infinite}
        .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#A78BFA,#00FFD1);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 4s linear infinite}
        .gtext{background:linear-gradient(135deg,#00FFD1,#4DB8FF);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .btna{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:none;cursor:pointer;transition:all 0.3s;text-decoration:none;font-family:inherit;font-weight:800;background:linear-gradient(135deg,#00C9A7,#0B6FCC);color:white;border-radius:100px;box-shadow:0 0 28px rgba(0,201,167,0.35),0 6px 20px rgba(0,0,0,0.3)}
        .btna:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 0 44px rgba(0,201,167,0.55),0 10px 28px rgba(0,0,0,0.4)}
        .btna:active{transform:scale(0.97)}
        .btnb{display:inline-flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;transition:all 0.3s;text-decoration:none;font-family:inherit;font-weight:700;background:rgba(0,255,209,0.05);color:#00FFD1;border-radius:100px;border:1.5px solid rgba(0,255,209,0.28)}
        .btnb:hover{background:rgba(0,255,209,0.1);border-color:rgba(0,255,209,0.65);box-shadow:0 0 20px rgba(0,255,209,0.18)}
        .gc{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:20px;backdrop-filter:blur(20px);transition:all 0.35s}
        .gc:hover{background:rgba(0,255,209,0.05);border-color:rgba(0,255,209,0.2);transform:translateY(-6px);box-shadow:0 24px 48px rgba(0,0,0,0.4)}
        .tc{background:rgba(0,255,209,0.04);border:1px solid rgba(0,255,209,0.14);border-radius:18px;transition:all 0.3s}
        .tc:hover{background:rgba(0,255,209,0.08);border-color:rgba(0,255,209,0.38);transform:translateY(-3px)}
        .sp{display:flex;flex-direction:column;align-items:center;gap:5px;padding:13px 10px;border-radius:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);min-width:72px;cursor:pointer;transition:all 0.25s;text-decoration:none;flex-shrink:0}
        .sp:hover{background:rgba(0,255,209,0.08);border-color:rgba(0,255,209,0.3);transform:scale(1.07)}
        .sb{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;text-align:center;padding:16px 6px;transition:all 0.3s}
        .sb:hover{border-color:rgba(0,255,209,0.28);box-shadow:0 0 20px rgba(0,255,209,0.08)}
        .livdot{width:8px;height:8px;border-radius:50%;background:#00FFD1;display:inline-block;position:relative}
        .livdot::after{content:'';position:absolute;inset:-4px;border-radius:50%;background:rgba(0,255,209,0.3);animation:ripple 1.8s infinite}
        .noscroll::-webkit-scrollbar{display:none}
        .noscroll{-ms-overflow-style:none;scrollbar-width:none}
        .hgrid{position:absolute;inset:0;background-image:linear-gradient(rgba(0,255,209,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,209,0.035) 1px,transparent 1px);background-size:40px 40px;mask-image:radial-gradient(ellipse 80% 70% at 50% 0%,black,transparent);pointer-events:none}
        .nbadge{width:50px;height:50px;border-radius:14px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;background:linear-gradient(135deg,rgba(0,255,209,0.18),rgba(77,184,255,0.18));border:1px solid rgba(0,255,209,0.22);color:#00FFD1}
      `}</style>

      {/* BG GLOW */}
      <div style={{ position: "fixed", top: "5%", left: "50%", transform: "translateX(-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,100,200,0.10),transparent)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "10%", right: "-15%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,255,209,0.05),transparent)", pointerEvents: "none", zIndex: 0 }} />

      {/* NAVBAR */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 20px", background: nav ? "rgba(2,13,26,0.93)" : "transparent", backdropFilter: nav ? "blur(24px)" : "none", borderBottom: nav ? "1px solid rgba(0,255,209,0.09)" : "1px solid transparent", transition: "all 0.4s" }}>
        <Image src="/logo.png" alt="DigiDoc" width={130} height={44} priority style={{ height: 33, width: "auto", filter: "brightness(1.1)" }} />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/login" className="btnb" style={{ padding: "8px 16px", fontSize: 13 }}>Sign In</Link>
          <Link href="/login" className="btna" style={{ padding: "9px 18px", fontSize: 13 }}>Get Started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", padding: "60px 20px 70px", textAlign: "center", zIndex: 1, overflow: "hidden" }}>
        <div className="hgrid" />

        <div className="a1" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 16px", borderRadius: 100, marginBottom: 24, background: "rgba(0,255,209,0.08)", border: "1px solid rgba(0,255,209,0.2)" }}>
          <span className="livdot" />
          <span style={{ color: "#00FFD1", fontSize: 12, fontWeight: 700 }}>500+ Doctors Online Right Now</span>
        </div>

        <h1 className="a2" style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.1, marginBottom: 18, letterSpacing: "-0.8px" }}>
          The Future of{" "}
          <span className="shine">Healthcare</span>
          <br />
          Is Already Here. 🏥
        </h1>

        <p className="a3" style={{ fontSize: 15, color: "rgba(232,244,255,0.6)", lineHeight: 1.8, maxWidth: 310, margin: "0 auto 34px" }}>
          Symptoms to doctor match to video call to prescription to medicine delivery.{" "}
          <span style={{ color: "#00FFD1", fontWeight: 700 }}>One platform. Zero friction.</span>
        </p>

        <div className="a4" style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 300, margin: "0 auto 18px" }}>
          <Link href="/login" className="btna" style={{ fontSize: 15, padding: "17px 28px" }}>
            🩺 Consult a Doctor — Free
          </Link>
          <Link href="/register-doctor" className="btnb" style={{ fontSize: 14, padding: "14px 24px" }}>
            👨‍⚕️ I am a Doctor — Join DigiDoc
          </Link>
        </div>

        <p className="a5" style={{ color: "rgba(255,255,255,0.28)", fontSize: 12 }}>
          Login with your mobile number &nbsp;·&nbsp; Ready in 10 seconds
        </p>

        {/* HERO CARD */}
        <div className="a6 float" style={{ marginTop: 50, display: "inline-block", position: "relative" }}>
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 28, padding: "26px 30px", border: "1px solid rgba(0,255,209,0.18)", boxShadow: "0 32px 80px rgba(0,0,0,0.5),0 0 36px rgba(0,255,209,0.07)", backdropFilter: "blur(24px)", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 14, minWidth: 248, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(0,255,209,0.5),transparent)", animation: "scanline 3s ease-in-out infinite" }} />
            <div style={{ fontSize: 54 }}>🩺</div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontWeight: 700, color: "#E8F4FF", fontSize: 15 }}>Dr. Priya Sharma</p>
              <p style={{ color: "#00FFD1", fontSize: 12, marginTop: 3, fontWeight: 600 }}>General Physician · ⭐ 4.9</p>
            </div>
            <div style={{ display: "flex", gap: 8, width: "100%" }}>
              <div style={{ flex: 1, padding: "9px 0", borderRadius: 100, textAlign: "center", background: "linear-gradient(135deg,#00C9A7,#0B6FCC)", color: "white", fontSize: 12, fontWeight: 700 }}>📹 Video</div>
              <div style={{ flex: 1, padding: "9px 0", borderRadius: 100, textAlign: "center", background: "rgba(0,255,209,0.1)", color: "#00FFD1", fontSize: 12, fontWeight: 700, border: "1px solid rgba(0,255,209,0.2)" }}>📞 Audio</div>
            </div>
          </div>

          <div className="float2" style={{ position: "absolute", top: -16, left: -30, background: "rgba(2,16,32,0.92)", backdropFilter: "blur(16px)", borderRadius: 14, padding: "10px 14px", border: "1px solid rgba(0,255,209,0.2)", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
            <p style={{ color: "#00FFD1", fontWeight: 700, fontSize: 12 }}>✅ Doctor Found</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, marginTop: 2 }}>Matched in 2 seconds</p>
          </div>

          <div className="float3" style={{ position: "absolute", bottom: 18, right: -30, background: "rgba(2,16,32,0.92)", backdropFilter: "blur(16px)", borderRadius: 14, padding: "10px 14px", border: "1px solid rgba(77,184,255,0.22)", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
            <p style={{ color: "#4DB8FF", fontWeight: 700, fontSize: 12 }}>Wait: Under 3 min</p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div ref={statsRef} style={{ padding: "0 16px 40px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {[
            { val: cnt.d + "+", label: "Verified Doctors", c: "#00FFD1" },
            { val: Math.floor(cnt.p / 1000) + "K+", label: "Patients Served", c: "#4DB8FF" },
            { val: "4.9★", label: "Avg Rating", c: "#A78BFA" },
            { val: "~3 min", label: "Wait Time", c: "#FB923C" },
          ].map(s => (
            <div key={s.label} className="sb">
              <p style={{ fontWeight: 900, fontSize: 16, color: s.c }}>{s.val}</p>
              <p style={{ fontSize: 9, color: "rgba(232,244,255,0.4)", marginTop: 4, lineHeight: 1.3 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section style={{ padding: "40px 20px", position: "relative", zIndex: 1, background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ textAlign: "center", color: "#00FFD1", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 }}>The Process</p>
        <h2 style={{ textAlign: "center", fontSize: 24, fontWeight: 800, marginBottom: 6 }}>How DigiDoc Works</h2>
        <p style={{ textAlign: "center", color: "rgba(232,244,255,0.45)", fontSize: 13, marginBottom: 28 }}>From symptoms to solution in 4 steps</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {STEPS.map(s => (
            <div key={s.n} className="tc" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
              <div className="nbadge">{s.n}</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: "#E8F4FF" }}>{s.icon} {s.title}</p>
                <p style={{ color: "rgba(232,244,255,0.45)", fontSize: 12, marginTop: 3 }}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "44px 20px", position: "relative", zIndex: 1 }}>
        <p style={{ textAlign: "center", color: "#00FFD1", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 }}>Why DigiDoc</p>
        <h2 style={{ textAlign: "center", fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Built Different.<br />Built for You.</h2>
        <p style={{ textAlign: "center", color: "rgba(232,244,255,0.45)", fontSize: 13, marginBottom: 28 }}>No other platform does all of this.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {FEATURES.map(f => (
            <div key={f.title} className="gc" style={{ padding: "20px 16px" }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, marginBottom: 12, background: f.color + "14", border: "1px solid " + f.color + "28", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21 }}>{f.icon}</div>
              <p style={{ fontWeight: 700, fontSize: 12, color: "#E8F4FF", marginBottom: 7, lineHeight: 1.3 }}>{f.title}</p>
              <p style={{ fontSize: 11, color: "rgba(232,244,255,0.45)", lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SPECIALTIES */}
      <section style={{ padding: "38px 0", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)", position: "relative", zIndex: 1 }}>
        <p style={{ textAlign: "center", color: "#00FFD1", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 }}>Our Doctors</p>
        <h2 style={{ textAlign: "center", fontSize: 22, fontWeight: 800, marginBottom: 6, padding: "0 20px" }}>12+ Specialties</h2>
        <p style={{ textAlign: "center", color: "rgba(232,244,255,0.45)", fontSize: 13, marginBottom: 22, padding: "0 20px" }}>All MCI-verified. All experienced. All available.</p>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "4px 20px 8px" }} className="noscroll">
          {SPECS.map(s => (
            <Link href="/login" key={s.name} className="sp">
              <span style={{ fontSize: 24 }}>{s.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(232,244,255,0.65)", textAlign: "center", lineHeight: 1.3 }}>{s.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "44px 20px", position: "relative", zIndex: 1 }}>
        <p style={{ textAlign: "center", color: "#00FFD1", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 }}>Real Stories</p>
        <h2 style={{ textAlign: "center", fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Patients Love DigiDoc ❤️</h2>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,255,209,0.11)", borderRadius: 22, padding: 26, backdropFilter: "blur(20px)" }}>
          {REVIEWS.map((r, i) => (
            <div key={i} style={{ display: i === rev ? "block" : "none", animation: i === rev ? "slideUp 0.5s ease" : "none" }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                {Array.from({ length: r.stars }).map((_, j) => <span key={j} style={{ color: "#FFB347", fontSize: 17 }}>★</span>)}
              </div>
              <p style={{ color: "rgba(232,244,255,0.82)", fontSize: 14, lineHeight: 1.8, marginBottom: 18, fontStyle: "italic" }}>"{r.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(0,255,209,0.08)", border: "1px solid rgba(0,255,209,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{r.avatar}</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 13, color: "#E8F4FF" }}>{r.name}</p>
                  <p style={{ fontSize: 11, color: "rgba(232,244,255,0.38)" }}>{r.city}</p>
                </div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 18 }}>
            {[0, 1, 2].map(i => (
              <div key={i} onClick={() => setRev(i)} style={{ width: i === rev ? 22 : 8, height: 8, borderRadius: 100, cursor: "pointer", background: i === rev ? "#00FFD1" : "rgba(255,255,255,0.14)", transition: "all 0.35s" }} />
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section style={{ margin: "0 16px 28px", borderRadius: 26, padding: "34px 22px", position: "relative", zIndex: 1, overflow: "hidden", background: "linear-gradient(135deg,rgba(11,111,204,0.22),rgba(0,201,167,0.16))", border: "1px solid rgba(0,255,209,0.14)" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 38, marginBottom: 12 }}>🛡️</p>
          <h2 style={{ color: "#E8F4FF", fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Safe. Secure. Private.</h2>
          <p style={{ color: "rgba(232,244,255,0.6)", fontSize: 13, lineHeight: 1.8, marginBottom: 20 }}>
            Every doctor is MCI-registered and verified. Your data is encrypted end-to-end. Your consultations are yours alone.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8 }}>
            {["✅ MCI Verified", "🔒 Encrypted", "🇮🇳 Made in India", "🏥 HIPAA Compliant"].map(b => (
              <span key={b} style={{ padding: "6px 13px", borderRadius: 100, background: "rgba(0,255,209,0.07)", color: "#00FFD1", fontSize: 11, fontWeight: 600, border: "1px solid rgba(0,255,209,0.18)" }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: "52px 20px 60px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(rgba(0,201,167,0.07),transparent)", pointerEvents: "none" }} />
        <p style={{ fontSize: 50, marginBottom: 14 }}>⚡</p>
        <h2 style={{ fontSize: 30, fontWeight: 900, marginBottom: 12, letterSpacing: "-0.5px", lineHeight: 1.15 }}>
          Your Health Cannot Wait.
          <br />
          <span className="gtext">Neither Can We.</span>
        </h2>
        <p style={{ color: "rgba(232,244,255,0.5)", fontSize: 14, marginBottom: 30, lineHeight: 1.8 }}>
          Login with your mobile number.<br />
          Be talking to a doctor in under 3 minutes.
        </p>
        <Link href="/login" className="btna" style={{ fontSize: 16, padding: "19px 32px", display: "inline-flex", marginBottom: 14 }}>
          🩺 Talk to a Doctor Now — Free
        </Link>
        <p style={{ color: "rgba(255,255,255,0.22)", fontSize: 12, marginTop: 8 }}>Trusted by 50,000+ patients across India</p>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "26px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center", position: "relative", zIndex: 1 }}>
        <Image src="/logo.png" alt="DigiDoc" width={110} height={36} style={{ height: 29, width: "auto", margin: "0 auto 10px", display: "block", filter: "brightness(1.2)" }} />
        <p style={{ color: "rgba(255,255,255,0.28)", fontSize: 12, marginBottom: 16 }}>Doctor Anywhere Anytime</p>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 18, marginBottom: 14 }}>
          {[["About", "/about"], ["Privacy", "/privacy"], ["Terms", "/terms"], ["For Doctors", "/register-doctor"], ["Contact", "/contact"]].map(([l, h]) => (
            <Link key={l} href={h} style={{ color: "rgba(255,255,255,0.32)", fontSize: 12, textDecoration: "none" }}>{l}</Link>
          ))}
        </div>
        <p style={{ color: "rgba(255,255,255,0.14)", fontSize: 11 }}>2026 DigiDoc. All rights reserved. Made with love in India</p>
      </footer>
    </main>
  );
}
