"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  .a1{animation:fadeUp 0.6s ease 0.0s both}
  .a2{animation:fadeUp 0.6s ease 0.12s both}
  .a3{animation:fadeUp 0.6s ease 0.24s both}
  .a4{animation:fadeUp 0.6s ease 0.36s both}
  .a5{animation:fadeUp 0.6s ease 0.48s both}
  .float{animation:floatY 4s ease-in-out infinite}
  .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .btna{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:14px 28px;border-radius:100px;font-family:inherit;font-weight:800;font-size:14px;color:white;border:none;cursor:pointer;transition:all 0.3s;background:linear-gradient(135deg,#00C9A7,#0B6FCC);box-shadow:0 0 24px rgba(0,201,167,0.3);text-decoration:none}
  .btna:hover{transform:translateY(-2px);box-shadow:0 0 36px rgba(0,201,167,0.45)}
  .btnb{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 24px;border-radius:100px;font-family:inherit;font-weight:600;font-size:13px;color:#00FFD1;border:1.5px solid rgba(0,255,209,0.28);background:rgba(0,255,209,0.05);cursor:pointer;transition:all 0.3s;text-decoration:none}
  .btnb:hover{background:rgba(0,255,209,0.1);border-color:rgba(0,255,209,0.5)}
  .livdot{width:8px;height:8px;border-radius:50%;background:#00FFD1;display:inline-block;position:relative}
  .livdot::after{content:'';position:absolute;inset:-4px;border-radius:50%;background:rgba(0,255,209,0.3);animation:ripple 1.8s infinite}
  .ql{padding:9px 16px;border-radius:100px;font-family:inherit;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.2s;border:1px solid rgba(0,255,209,0.2);background:rgba(0,255,209,0.06);color:#00FFD1;text-decoration:none;display:inline-flex;align-items:center;gap:6px}
  .ql:hover{background:rgba(0,255,209,0.12);border-color:rgba(0,255,209,0.4);transform:translateY(-1px)}
  .hgrid{position:absolute;inset:0;background-image:linear-gradient(rgba(0,255,209,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,209,0.025) 1px,transparent 1px);background-size:40px 40px;mask-image:radial-gradient(ellipse 80% 70% at 50% 50%,black,transparent);pointer-events:none}
`;

const SUGGESTIONS = [
  { icon: "🏠", label: "Go Home",       href: "/"          },
  { icon: "🩺", label: "Find a Doctor", href: "/dashboard" },
  { icon: "🤖", label: "AI Chat",       href: "/chat"      },
  { icon: "📋", label: "Symptom Check", href: "/symptoms"  },
];

export default function NotFound() {
  const [count, setCount] = useState(10);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setCount(p => {
        if (p <= 1) { clearInterval(t); setRedirect(true); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (redirect) window.location.href = "/";
  }, [redirect]);

  return (
    <div style={{
      position: "fixed", inset: 0, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#020D1A", fontFamily: "'Plus Jakarta Sans',sans-serif",
      color: "#E8F4FF", padding: "28px 24px", textAlign: "center",
      maxWidth: 480, margin: "0 auto", left: "50%", transform: "translateX(-50%)",
    }}>
      <style>{S}</style>
      <div className="hgrid" />

      {/* Glow */}
      <div style={{ position: "fixed", top: "30%", left: "50%", transform: "translateX(-50%)", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,100,200,0.08),transparent)", pointerEvents: "none" }} />

      {/* 404 graphic */}
      <div className="a1 float" style={{ marginBottom: 24, position: "relative" }}>
        <div style={{ fontSize: 80, lineHeight: 1, marginBottom: 4 }}>🔭</div>
        <div style={{ position: "absolute", top: -10, right: -20, width: 32, height: 32, borderRadius: "50%", background: "rgba(0,255,209,0.1)", border: "1px solid rgba(0,255,209,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, animation: "pulse 2s infinite" }}>?</div>
      </div>

      {/* 404 number */}
      <div className="a2" style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 72, fontWeight: 900, lineHeight: 1, letterSpacing: "-4px" }} className="shine">404</span>
      </div>

      <h1 className="a3" style={{ fontSize: 22, fontWeight: 800, marginBottom: 10, color: "#E8F4FF" }}>
        Page Not Found
      </h1>

      <p className="a4" style={{ color: "rgba(232,244,255,0.45)", fontSize: 13, lineHeight: 1.8, marginBottom: 28, maxWidth: 280 }}>
        The page you are looking for does not exist or has been moved. Let us get you back on track.
      </p>

      {/* Quick links */}
      <div className="a4" style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 24 }}>
        {SUGGESTIONS.map(s => (
          <Link key={s.label} href={s.href} className="ql">{s.icon} {s.label}</Link>
        ))}
      </div>

      {/* Main CTA */}
      <div className="a5" style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 280, marginBottom: 28 }}>
        <Link href="/" className="btna">🏠 Back to Home</Link>
        <Link href="/login" className="btnb">🩺 Consult a Doctor</Link>
      </div>

      {/* Auto redirect countdown */}
      <div className="a5" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 100, background: "rgba(0,255,209,0.06)", border: "1px solid rgba(0,255,209,0.15)" }}>
        <span className="livdot" />
        <p style={{ color: "rgba(232,244,255,0.45)", fontSize: 12 }}>
          Auto redirect to home in{" "}
          <span style={{ color: "#00FFD1", fontWeight: 700, animation: count <= 3 ? "blink 0.5s infinite" : "none" }}>{count}s</span>
        </p>
      </div>
    </div>
  );
}
