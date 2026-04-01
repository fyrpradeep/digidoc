"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const FEATURES = [
  { icon: "🧠", title: "AI Symptom Intelligence", desc: "Describe your symptoms in plain words. Our AI understands, analyses, and routes you to exactly the right specialist — instantly.", color: "#00FFD1" },
  { icon: "📹", title: "HD Video Consultation", desc: "Crystal-clear video calls with verified doctors. No third-party apps. Built directly into DigiDoc.", color: "#4DB8FF" },
  { icon: "💊", title: "Smart Digital Prescription", desc: "Doctors write prescriptions live on the platform. One tap to order. Delivered to your door.", color: "#A78BFA" },
  { icon: "🚀", title: "Medicine Home Delivery", desc: "Prescribed medicines ordered in a single tap. Fast, tracked, doorstep delivery every time.", color: "#FB923C" },
  { icon: "🤖", title: "24 / 7 AI Health Assistant", desc: "3am health anxiety? Our AI is always on. Always calm. Always helpful. In any language.", color: "#F472B6" },
  { icon: "📡", title: "Real-time Doctor Availability", desc: "See which doctors are online right now. No appointments. No waiting rooms. Just connect.", color: "#34D399" },
];

const STEPS = [
  { n: "01", icon: "📋", title: "Describe Your Symptoms", sub: "Talk to AI or fill a quick quiz" },
  { n: "02", icon: "⚡", title: "Instant Doctor Match", sub: "AI selects the perfect specialist" },
  { n: "03", icon: "📹", title: "Video or Audio Call", sub: "Consult from literally anywhere" },
  { n: "04", icon: "💊", title: "Prescription + Delivery", sub: "Digital Rx & medicines at your door" },
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
  { name: "Priya M.", city: "Mumbai", text: "Fever at midnight — video call with a doctor in under 3 minutes. This platform changed everything for me.", avatar: "👩", stars: 5 },
  { name: "Rajesh K.", city: "Delhi", text: "Prescription was written before the call even ended. Medicine arrived by morning. Unbelievable.", avatar: "👨", stars: 5 },
  { name: "Ananya S.", city: "Bangalore", text: "No waiting rooms. No appointments. Just open DigiDoc, talk to a doctor, done. Pure magic.", avatar: "👩‍💼", stars: 5 },
];

// Heartbeat SVG path
const HEARTBEAT = "M0,50 L30,50 L40,20 L50,80 L60,10 L70,70 L80,50 L200,50";

export default function Page() {
  const [tick, setTick]       = useState(0);
  const [rev, setRev]         = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [cnt, setCnt]         = useState({ d: 0, p: 0 });
  const statsRef              = useRef<HTMLDivElement>(null);
  const counted               = useRef(false);
  const canvasRef             = useRef<HTMLCanvasElement>(null);

  // Scroll
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Testimonial cycle
  useEffect(() => {
    const t = setInterval(() => setRev(p => (p + 1) % 3), 5000);
    return () => clearInterval(t);
  }, []);

  // Heartbeat tick
  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 50);
    return () => clearInterval(t);
  }, []);

  // Count up
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

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; o: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        o: Math.random() * 0.4 + 0.1,
      });
    }

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,209,${p.o})`;
        ctx.fill();
      });
      // Draw lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,255,209,${0.08 * (1 - dist / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  const navScrolled = scrollY > 40;

  return (
    <main style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#020D1A", color: "#E8F4FF", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}

        @keyframes fadeUp   {from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatY   {0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes floatY2  {0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 16px rgba(0,255,209,0.3)}50%{box-shadow:0 0 36px rgba(0,255,209,0.7)}}
        @keyframes scanline {0%{transform:translateY(-100%)}100%{transform:translateY(100%)}}
        @keyframes rotateSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes shimmerH {0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes borderGlow{0%,100%{border-color:rgba(0,255,209,0.3)}50%{border-color:rgba(0,255,209,0.8)}}
        @keyframes ripple    {0%{transform:scale(0.8);opacity:1}100%{transform:scale(2);opacity:0}}
        @keyframes slideUp  {from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

        .a1{animation:fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.0s both}
        .a2{animation:fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.12s both}
        .a3{animation:fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.24s both}
        .a4{animation:fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.36s both}
        .a5{animation:fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.48s both}
        .a6{animation:fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.6s both}

        .float  {animation:floatY  4s ease-in-out infinite}
        .float2 {animation:floatY2 5.5s ease-in-out 0.8s infinite}
        .float3 {animation:floatY2 3.5s ease-in-out 1.5s infinite}

        .shine-text{
          background:linear-gradient(90deg,#00FFD1,#4DB8FF,#A78BFA,#00FFD1);
          background-size:300% auto;
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;
          background-clip:text;
          animation:shimmerH 4s linear infinite;
        }

        .btn-main{
          display:inline-flex;align-items:center;justify-content:center;
          gap:8px;border:none;cursor:pointer;transition:all 0.3s;
          text-decoration:none;position:relative;overflow:hidden;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;
          background:linear-gradient(135deg,#00C9A7,#0B6FCC);
          color:white;border-radius:100px;
          box-shadow:0 0 32px rgba(0,201,167,0.4),0 8px 24px rgba(0,0,0,0.3);
        }
        .btn-main::after{
          content:'';position:absolute;inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,0.15),transparent);
          opacity:0;transition:opacity 0.3s;
        }
        .btn-main:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 0 48px rgba(0,201,167,0.6),0 12px 32px rgba(0,0,0,0.4);}
        .btn-main:hover::after{opacity:1;}
        .btn-main:active{transform:scale(0.97);}

        .btn-ghost{
          display:inline-flex;align-items:center;justify-content:center;
          gap:8px;cursor:pointer;transition:all 0.3s;text-decoration:none;
          font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;
          background:rgba(0,255,209,0.05);
          color:#00FFD1;border-radius:100px;
          border:1.5px solid rgba(0,255,209,0.3);
        }
        .btn-ghost:hover{background:rgba(0,255,209,0.1);border-color:rgba(0,255,209,0.7);box-shadow:0 0 20px rgba(0,255,209,0.2);}

        .glass-card{
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:20px;
          backdrop-filter:blur(20px);
          transition:all 0.35s;
        }
        .glass-card:hover{
          background:rgba(0,255,209,0.05);
          border-color:rgba(0,255,209,0.2);
          transform:translateY(-6px);
          box-shadow:0 24px 48px rgba(0,0,0,0.4),0 0 32px rgba(0,255,209,0.08);
        }

        .teal-card{
          background:rgba(0,255,209,0.04);
          border:1px solid rgba(0,255,209,0.15);
          border-radius:20px;
          transition:all 0.3s;
        }
        .teal-card:hover{
          background:rgba(0,255,209,0.08);
          border-color:rgba(0,255,209,0.4);
          transform:translateY(-4px);
          box-shadow:0 16px 40px rgba(0,0,0,0.3);
        }

        .spec-btn{
          display:flex;flex-direction:column;align-items:center;
          gap:5px;padding:13px 10px;border-radius:14px;
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.06);
          min-width:74px;cursor:pointer;transition:all 0.25s;
          text-decoration:none;flex-shrink:0;
        }
        .spec-btn:hover{
          background:rgba(0,255,209,0.08);
          border-color:rgba(0,255,209,0.35);
          transform:scale(1.08);
          box-shadow:0 0 20px rgba(0,255,209,0.15);
        }

        .stat-box{
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:18px;text-align:center;padding:18px 8px;
          transition:all 0.3s;
        }
        .stat-box:hover{
          border-color:rgba(0,255,209,0.3);
          box-shadow:0 0 24px rgba(0,255,209,0.1);
        }

        .live-dot{
          width:8px;height:8px;border-radius:50%;
          background:#00FFD1;display:inline-block;
          position:relative;
        }
        .live-dot::after{
          content:'';position:absolute;inset:-4px;
          border-radius:50%;background:rgba(0,255,209,0.3);
          animation:ripple 1.8s infinite;
        }

        .noscroll::-webkit-scrollbar{display:none}
        .noscroll{-ms-overflow-style:none;scrollbar-width:none}

        .hero-grid{
          position:absolute;inset:0;
          background-image:
            linear-gradient(rgba(0,255,209,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,209,0.04) 1px, transparent 1px);
          background-size:40px 40px;
          mask-image:radial-gradient(ellipse 80% 80% at 50% 0%, black, transparent);
          pointer-events:none;
        }

        .number-badge{
          width:52px;height:52px;border-radius:16px;flex-shrink:0;
          display:flex;align-items:center;justify-content:center;
          font-weight:900;font-size:14px;
          background:linear-gradient(135deg,rgba(0,255,209,0.2),rgba(77,184,255,0.2));
          border:1px solid rgba(0,255,209,0.25);
          color:#00FFD1;
        }
      `}</style>

      {/* PARTICLE CANVAS */}
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: 0.6 }} />

      {/* RADIAL GLOW BG */}
      <div style={{ position: "fixed", top: "10%", left:0, right:0, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,100,200,0.12) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "20%", right: "-20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,255,209,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* NAVBAR */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 20px",
        background: navScrolled ? "rgba(2,13,26,0.92)" : "transparent",
        backdropFilter: navScrolled ? "blur(24px)" : "none",
        borderBottom: navScrolled ? "1px solid rgba(0,255,209,0.1)" : "1px solid transparent",
        transition: "all 0.4s",
      }}>
        <Image src="/logo.png" alt="DigiDoc" width={130} height={44} priority style={{ height: 34, width: "auto", filter: "brightness(1.1)" }} />
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link href="/login" className="btn-ghost" style={{ padding: "9px 18px", fontSize: 13 }}>Sign In</Link>
          <Link href="/login" className="btn-main" style={{ padding: "9px 20px", fontSize: 13 }}>Get Started →</Link>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section style={{ position: "relative", padding: "60px 20px 72px", textAlign: "center", zIndex: 1 }}>
        <div className="hero-grid" />

        {/* Heartbeat line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, overflow: "hidden", height: 60, opacity: 0.4, pointerEvents: "none" }}>
          <svg viewBox="0 0 400 60" style={{ width: "100%", height: 60 }} preserveAspectRatio="none">
            <path d={HEARTBEAT} fill="none" stroke="#00FFD1" strokeWidth="1.5"
              strokeDasharray="400" strokeDashoffset={400 - (tick % 200) * 2}
              style={{ transition: "stroke-dashoffset 0.05s linear" }} />
          </svg>
        </div>

        {/* Badge */}
        <div className="a1" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 100, marginBottom: 24, background: "rgba(0,255,209,0.08)", border: "1px solid rgba(0,255,209,0.2)" }}>
          <span className="live-dot" />
          <span style={{ color: "#00FFD1", fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>500+ Doctors Online Right Now</span>
        </div>

        {/* Headline */}
        <h1 className="a2" style={{ fontSize: 42, fontWeight: 900, lineHeight: 1.1, marginBottom: 18, letterSpacing: "-1px" }}>
          The Future of{" "}
          <span className="shine-text">Healthcare</span>
          <br />
          Is Already Here. 🏥
        </h1>

        <p className="a3" style={{ fontSize: 15, color: "rgba(232,244,255,0.65)", lineHeight: 1.8, maxWidth: 320, margin: "0 auto 36px" }}>
          Symptoms → AI Match → Video Call → Prescription → Medicine at your door.
          <br />
          <span style={{ color: "#00FFD1", fontWeight: 700 }}>One platform. Zero friction.</span>
        </p>

        {/* CTA */}
        <div className="a4" style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 300, margin: "0 auto 20px" }}>
          <Link href="/login" className="btn-main" style={{ fontSize: 16, padding: "18px 28px" }}>
            🩺 Consult a Doctor — It's Free
          </Link>
          <Link href="/register-doctor" className="btn-ghost" style={{ fontSize: 14, padding: "14px 24px" }}>
            👨‍⚕️ I'm a Doctor — Join DigiDoc
          </Link>
        </div>

        <p className="a5" style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>
          Login with your mobile number &nbsp;·&nbsp; Takes 10 seconds
        </p>

        {/* Hero floating card */}
        <div className="a6 float" style={{ marginTop: 52, display: "inline-block", position: "relative" }}>
          {/* Main card */}
          <div style={{
            background: "rgba(255,255,255,0.04)", borderRadius: 28, padding: "28px 32px",
            border: "1px solid rgba(0,255,209,0.2)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 40px rgba(0,255,209,0.08)",
            backdropFilter: "blur(24px)", display: "inline-flex",
            flexDirection: "column", alignItems: "center", gap: 16, minWidth: 256,
            animation: "borderGlow 3s ease-in-out infinite",
          }}>
            {/* Scan line effect */}
            <div style={{ position: "absolute", inset: 0, borderRadius: 28, overflow: "hidden", pointerEvents: "none" }}>
              <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, rgba(0,255,209,0.4), transparent)", animation: "scanline 3s ease-in-out infinite" }} />
            </div>
            <div style={{ fontSize: 56 }}>🩺</div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontWeight: 700, color: "#E8F4FF", fontSize: 15 }}>Dr. Priya Sharma</p>
              <p style={{ color: "#00FFD1", fontSize: 12, marginTop: 3, fontWeight: 600 }}>General Physician &nbsp;·&nbsp; ⭐ 4.9</p>
            </div>
            <div style={{ display: "flex", gap: 8, width: "100%" }}>
              <div style={{ flex: 1, padding: "10px 0", borderRadius: 100, textAlign: "center", background: "linear-gradient(135deg,#00C9A7,#0B6FCC)", color: "white", fontSize: 12, fontWeight: 700 }}>📹 Video</div>
              <div style={{ flex: 1, padding: "10px 0", borderRadius: 100, textAlign: "center", background: "rgba(0,255,209,0.1)", color: "#00FFD1", fontSize: 12, fontWeight: 700, border: "1px solid rgba(0,255,209,0.2)" }}>📞 Audio</div>
            </div>
          </div>

          {/* Floating badge 1 */}
          <div className="float2" style={{ position: "absolute", top: -18, left: -32, background: "rgba(0,20,40,0.9)", backdropFilter: "blur(16px)", borderRadius: 14, padding: "10px 16px", border: "1px solid rgba(0,255,209,0.2)", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
            <p style={{ color: "#00FFD1", fontWeight: 700, fontSize: 12 }}>✅ Doctor Found</p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, marginTop: 2 }}>Matched in 2 seconds</p>
          </div>

          {/* Floating badge 2 */}
          <div className="float3" style={{ position: "absolute", bottom: 16, right: -32, background: "rgba(0,20,40,0.9)", backdropFilter: "blur(16px)", borderRadius: 14, padding: "10px 16px", border: "1px solid rgba(77,184,255,0.25)", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
            <p style={{ color: "#4DB8FF", fontWeight: 700, fontSize: 12 }}>⏱ Wait: &lt;3 min</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════════ */}
      <div ref={statsRef} style={{ padding: "0 16px 40px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
          {[
            { val: `${cnt.d}+`, label: "Verified Doctors", color: "#00FFD1" },
            { val: `${Math.floor(cnt.p / 1000)}K+`, label: "Patients Served", color: "#4DB8FF" },
            { val: "4.9★", label: "Avg Rating", color: "#A78BFA" },
            { val: "<3min", label: "Wait Time", color: "#FB923C" },
          ].map(s => (
            <div key={s.label} className="stat-box">
              <p style={{ fontWeight: 900, fontSize: 18, color: s.color }}>{s.val}</p>
              <p style={{ fontSize: 10, color: "rgba(232,244,255,0.45)", marginTop: 4, lineHeight: 1.3 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: "40px 20px", position: "relative", zIndex: 1, background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <p style={{ textAlign: "center", color: "#00FFD1", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 }}>The Process</p>
        <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 800, marginBottom: 6 }}>How DigiDoc Works</h2>
        <p style={{ textAlign: "center", color: "rgba(232,244,255,0.5)", fontSize: 13, marginBottom: 30 }}>From symptoms to solution in 4 steps</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {STEPS.map((s, i) => (
            <div key={s.n} className="teal-card" style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px" }}>
              <div className="number-badge">{s.n}</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: "#E8F4FF" }}>{s.icon}&nbsp; {s.title}</p>
                <p style={{ color: "rgba(232,244,255,0.5)", fontSize: 12, marginTop: 3 }}>{s.sub}</p>
              </div>
              {i < 3 && <div style={{ position: "absolute", left: 36, marginTop: 72, width: 2, height: 12, background: "rgba(0,255,209,0.15)" }} />}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: "44px 20px", position: "relative", zIndex: 1 }}>
        <p style={{ textAlign: "center", color: "#00FFD1", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 }}>Why DigiDoc</p>
        <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Built Different.<br />Built for You.</h2>
        <p style={{ textAlign: "center", color: "rgba(232,244,255,0.5)", fontSize: 13, marginBottom: 30 }}>No other platform does all of this together.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {FEATURES.map(f => (
            <div key={f.title} className="glass-card" style={{ padding: "22px 18px" }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, marginBottom: 14, background: `${f.color}14`, border: `1px solid ${f.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{f.icon}</div>
              <p style={{ fontWeight: 700, fontSize: 13, color: "#E8F4FF", marginBottom: 8, lineHeight: 1.3 }}>{f.title}</p>
              <p style={{ fontSize: 11, color: "rgba(232,244,255,0.5)", lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SPECIALTIES
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: "40px 0", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)", position: "relative", zIndex: 1 }}>
        <p style={{ textAlign: "center", color: "#00FFD1", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 }}>Our Doctors</p>
        <h2 style={{ textAlign: "center", fontSize: 24, fontWeight: 800, marginBottom: 6, padding: "0 20px" }}>12+ Specialties</h2>
        <p style={{ textAlign: "center", color: "rgba(232,244,255,0.5)", fontSize: 13, marginBottom: 24, padding: "0 20px" }}>All MCI-verified. All experienced. All available.</p>

        <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "4px 20px 8px" }} className="noscroll">
          {SPECS.map(s => (
            <Link href="/login" key={s.name} className="spec-btn">
              <span style={{ fontSize: 24 }}>{s.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(232,244,255,0.7)", textAlign: "center", lineHeight: 1.3 }}>{s.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: "44px 20px", position: "relative", zIndex: 1 }}>
        <p style={{ textAlign: "center", color: "#00FFD1", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 }}>Real Stories</p>
        <h2 style={{ textAlign: "center", fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Patients Love DigiDoc ❤️</h2>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,255,209,0.12)", borderRadius: 24, padding: 28, backdropFilter: "blur(20px)" }}>
          {REVIEWS.map((r, i) => (
            <div key={i} style={{ display: i === rev ? "block" : "none", animation: i === rev ? "slideUp 0.5s ease" : "none" }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                {[...Array(r.stars)].map((_, j) => <span key={j} style={{ color: "#FFB347", fontSize: 18 }}>★</span>)}
              </div>
              <p style={{ color: "rgba(232,244,255,0.85)", fontSize: 14, lineHeight: 1.8, marginBottom: 20, fontStyle: "italic" }}>
                "{r.text}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(0,255,209,0.1)", border: "1px solid rgba(0,255,209,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{r.avatar}</div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: "#E8F4FF" }}>{r.name}</p>
                  <p style={{ fontSize: 11, color: "rgba(232,244,255,0.4)" }}>{r.city}</p>
                </div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
            {[0, 1, 2].map(i => (
              <div key={i} onClick={() => setRev(i)} style={{ width: i === rev ? 24 : 8, height: 8, borderRadius: 100, cursor: "pointer", background: i === rev ? "#00FFD1" : "rgba(255,255,255,0.15)", transition: "all 0.35s" }} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TRUST SECTION
      ══════════════════════════════════════════════════ */}
      <section style={{ margin: "0 16px 28px", borderRadius: 28, padding: "36px 24px", position: "relative", zIndex: 1, overflow: "hidden", background: "linear-gradient(135deg, rgba(11,111,204,0.2), rgba(0,201,167,0.15))", border: "1px solid rgba(0,255,209,0.15)" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(rgba(0,255,209,0.08),transparent)", pointerEvents: "none" }} />
        <div style={{ textAlign: "center", position: "relative" }}>
          <p style={{ fontSize: 40, marginBottom: 12 }}>🛡️</p>
          <h2 style={{ color: "#E8F4FF", fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Safe. Secure. Private.</h2>
          <p style={{ color: "rgba(232,244,255,0.65)", fontSize: 13, lineHeight: 1.8, marginBottom: 22 }}>
            Every doctor is MCI-registered and verified. Your data is encrypted end-to-end. Your consultations are yours alone.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 10 }}>
            {["✅ MCI Verified", "🔒 End-to-End Encrypted", "🇮🇳 Made in India", "🏥 HIPAA Compliant"].map(b => (
              <span key={b} style={{ padding: "7px 14px", borderRadius: 100, background: "rgba(0,255,209,0.08)", color: "#00FFD1", fontSize: 11, fontWeight: 600, border: "1px solid rgba(0,255,209,0.2)" }}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════ */}
      <section style={{ padding: "52px 20px 60px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(rgba(0,201,167,0.08),transparent)", pointerEvents: "none" }} />
        <p style={{ fontSize: 52, marginBottom: 16 }}>⚡</p>
        <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12, letterSpacing: "-0.5px", lineHeight: 1.15 }}>
          Your Health Can't Wait.
          <br />
          <span className="shine-text">Neither Can We.</span>
        </h2>
        <p style={{ color: "rgba(232,244,255,0.55)", fontSize: 14, marginBottom: 32, lineHeight: 1.75 }}>
          Login with your mobile number.<br />
          Be talking to a doctor in under 3 minutes.
        </p>
        <Link href="/login" className="btn-main" style={{ fontSize: 16, padding: "20px 36px", display: "inline-flex", marginBottom: 14 }}>
          🩺 Talk to a Doctor Now — Free
        </Link>
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, marginTop: 8 }}>Trusted by 50,000+ patients across India</p>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "28px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center", position: "relative", zIndex: 1 }}>
        <Image src="/logo.png" alt="DigiDoc" width={110} height={36} style={{ height: 30, width: "auto", margin: "0 auto 10px", display: "block", filter: "brightness(1.2)" }} />
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginBottom: 18 }}>Doctor Anywhere Anytime</p>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 20, marginBottom: 16 }}>
          {[["About", "/about"], ["Privacy", "/privacy"], ["Terms", "/terms"], ["For Doctors", "/register-doctor"], ["Contact", "/contact"]].map(([l, h]) => (
            <Link key={l} href={h} style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, textDecoration: "none" }}>{l}</Link>
          ))}
        </div>
        <p style={{ color: "rgba(255,255,255,0.15)", fontSize: 11 }}>© 2026 DigiDoc. All rights reserved. Made with ❤️ in India</p>
      </footer>

    </main>
  );
}
