"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const DOCTORS = [
  { id: 1, name: "Dr. Priya Sharma", spec: "General Physician", exp: "12 yrs", rating: 4.9, fee: 299, online: true, avatar: "👩‍⚕️", patients: 1240 },
  { id: 2, name: "Dr. Arjun Mehta", spec: "Cardiologist", exp: "18 yrs", rating: 4.8, fee: 599, online: true, avatar: "👨‍⚕️", patients: 980 },
  { id: 3, name: "Dr. Sneha Rao", spec: "Dermatologist", exp: "9 yrs", rating: 4.7, fee: 399, online: false, avatar: "👩‍⚕️", patients: 760 },
  { id: 4, name: "Dr. Rahul Gupta", spec: "Neurologist", exp: "15 yrs", rating: 4.9, fee: 699, online: true, avatar: "👨‍⚕️", patients: 1100 },
];

const QUICK_ACTIONS = [
  { icon: "🩺", label: "Check Symptoms", sub: "AI powered", href: "/symptoms", color: "#00FFD1" },
  { icon: "🤖", label: "AI Assistant", sub: "24/7 help", href: "/chat", color: "#4DB8FF" },
  { icon: "💊", label: "My Medicines", sub: "Order & track", href: "/medicines", color: "#A78BFA" },
  { icon: "📋", label: "My Records", sub: "History", href: "/records", color: "#FB923C" },
];

const SPECIALTIES = [
  { icon: "🫀", name: "Heart" },
  { icon: "🧠", name: "Neuro" },
  { icon: "🦷", name: "Dental" },
  { icon: "👁️", name: "Eye" },
  { icon: "🦴", name: "Ortho" },
  { icon: "🧒", name: "Child" },
  { icon: "🌸", name: "Gyno" },
  { icon: "🫁", name: "Lung" },
];

const RECENT_RX = {
  id: "RX-2041",
  doctor: "Dr. Priya Sharma",
  date: "30 Mar 2026",
  diagnosis: "Acute Upper Respiratory Infection",
  medicines: ["Paracetamol 500mg", "Cetirizine 10mg", "Vitamin C 1000mg"],
  status: "Delivered",
};

type Tab = "home" | "doctors" | "rx" | "profile";

export default function PatientDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("home");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDoctors = DOCTORS.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.spec.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main style={{ minHeight: "100vh", background: "#020D1A", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#E8F4FF", paddingBottom: 80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmerH { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes ripple { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2.2);opacity:0} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .a1{animation:fadeUp 0.5s ease 0.0s both}
        .a2{animation:fadeUp 0.5s ease 0.1s both}
        .a3{animation:fadeUp 0.5s ease 0.2s both}
        .a4{animation:fadeUp 0.5s ease 0.3s both}
        .a5{animation:fadeUp 0.5s ease 0.4s both}
        .shine { background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmerH 3s linear infinite; }
        .gc { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:18px; transition:all 0.3s; }
        .gc:hover { background:rgba(0,255,209,0.04); border-color:rgba(0,255,209,0.18); }
        .doc-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:18px; transition:all 0.3s; cursor:pointer; }
        .doc-card:hover { background:rgba(0,255,209,0.04); border-color:rgba(0,255,209,0.2); transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,0.3); }
        .qa-card { border-radius:16px; padding:16px 14px; cursor:pointer; transition:all 0.25s; text-decoration:none; display:flex; flex-direction:column; align-items:flex-start; gap:8px; }
        .qa-card:hover { transform:translateY(-4px); box-shadow:0 12px 28px rgba(0,0,0,0.3); }
        .qa-card:active { transform:scale(0.97); }
        .spec-btn { display:flex; flex-direction:column; align-items:center; gap:5px; padding:12px 10px; border-radius:14px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); min-width:64px; cursor:pointer; transition:all 0.2s; text-decoration:none; flex-shrink:0; }
        .spec-btn:hover { background:rgba(0,255,209,0.08); border-color:rgba(0,255,209,0.3); transform:scale(1.06); }
        .btn-main { display:flex; align-items:center; justify-content:center; gap:8px; padding:14px; border-radius:14px; font-family:inherit; font-weight:700; font-size:14px; color:white; border:none; cursor:pointer; transition:all 0.3s; background:linear-gradient(135deg,#00C9A7,#0B6FCC); box-shadow:0 0 20px rgba(0,201,167,0.3); width:100%; }
        .btn-main:hover { transform:translateY(-2px); box-shadow:0 0 32px rgba(0,201,167,0.5); }
        .btn-ghost { display:flex; align-items:center; justify-content:center; gap:8px; padding:12px; border-radius:14px; font-family:inherit; font-weight:600; font-size:13px; color:#00FFD1; border:1px solid rgba(0,255,209,0.25); background:rgba(0,255,209,0.05); cursor:pointer; transition:all 0.3s; width:100%; }
        .btn-ghost:hover { background:rgba(0,255,209,0.1); border-color:rgba(0,255,209,0.5); }
        .livdot { width:8px; height:8px; border-radius:50%; background:#00FFD1; display:inline-block; position:relative; flex-shrink:0; }
        .livdot::after { content:''; position:absolute; inset:-3px; border-radius:50%; background:rgba(0,255,209,0.3); animation:ripple 1.8s infinite; }
        .offdot { width:8px; height:8px; border-radius:50%; background:rgba(255,255,255,0.2); display:inline-block; flex-shrink:0; }
        .search-input { width:100%; padding:12px 16px 12px 42px; border-radius:14px; font-family:inherit; font-size:14px; outline:none; transition:all 0.3s; background:rgba(255,255,255,0.04); border:1.5px solid rgba(255,255,255,0.08); color:#E8F4FF; }
        .search-input::placeholder { color:rgba(232,244,255,0.3); }
        .search-input:focus { border-color:rgba(0,255,209,0.4); background:rgba(0,255,209,0.04); }
        .noscroll::-webkit-scrollbar { display:none; }
        .noscroll { -ms-overflow-style:none; scrollbar-width:none; }
        .nav-item { display:flex; flex-direction:column; align-items:center; gap:3px; padding:8px 16px; cursor:pointer; transition:all 0.2s; border-top:2px solid transparent; flex:1; background:none; border-left:none; border-right:none; border-bottom:none; font-family:inherit; }
        .nav-item.active { border-top-color:#00FFD1; }
        .badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:100px; font-size:11px; font-weight:700; }
      `}</style>

      {/* HEADER */}
      <div className="a1" style={{ padding: "16px 20px 12px", background: "rgba(2,13,26,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "rgba(232,244,255,0.45)", fontSize: 12, marginBottom: 2 }}>Good morning 👋</p>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#E8F4FF" }}>Rahul Verma</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/notifications" style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, textDecoration: "none", position: "relative" }}>
              🔔
              <div style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "#FF6B6B", border: "1.5px solid #020D1A" }} />
            </Link>
            <Link href="/profile" style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg,rgba(0,201,167,0.2),rgba(11,111,204,0.2))", border: "1px solid rgba(0,255,209,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, textDecoration: "none" }}>
              🧑
            </Link>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "0 20px" }}>

        {/* HOME TAB */}
        {tab === "home" && (
          <div>
            {/* Health card */}
            <div className="a2" style={{ margin: "20px 0 20px", borderRadius: 22, padding: "22px 20px", background: "linear-gradient(135deg, rgba(0,201,167,0.18), rgba(11,111,204,0.22))", border: "1px solid rgba(0,255,209,0.2)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(0,255,209,0.06)", pointerEvents: "none" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ color: "rgba(232,244,255,0.55)", fontSize: 12, marginBottom: 4 }}>Your Health Score</p>
                  <p style={{ fontSize: 36, fontWeight: 900, color: "#00FFD1" }}>87 <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(232,244,255,0.5)" }}>/ 100</span></p>
                  <p style={{ color: "rgba(232,244,255,0.55)", fontSize: 12, marginTop: 4 }}>Last checkup: 15 days ago</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 44 }}>💚</div>
                  <span className="badge" style={{ background: "rgba(0,255,209,0.15)", color: "#00FFD1", marginTop: 6, display: "inline-flex" }}>Healthy</span>
                </div>
              </div>
              <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                <Link href="/symptoms" className="btn-main" style={{ flex: 1, padding: "10px", fontSize: 13 }}>🩺 Consult Now</Link>
                <Link href="/records" className="btn-ghost" style={{ flex: 1, padding: "10px", fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>📋 My Records</Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="a3">
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "rgba(232,244,255,0.5)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Quick Actions</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                {QUICK_ACTIONS.map(q => (
                  <Link key={q.label} href={q.href} className="qa-card" style={{ background: q.color + "10", border: "1px solid " + q.color + "20" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 13, background: q.color + "18", border: "1px solid " + q.color + "28", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{q.icon}</div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 13, color: "#E8F4FF" }}>{q.label}</p>
                      <p style={{ fontSize: 11, color: "rgba(232,244,255,0.4)", marginTop: 2 }}>{q.sub}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Specialties */}
            <div className="a4" style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "rgba(232,244,255,0.5)", textTransform: "uppercase", letterSpacing: 1.5 }}>Specialties</h3>
                <Link href="/doctors" style={{ color: "#00FFD1", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>View All →</Link>
              </div>
              <div style={{ display: "flex", gap: 10, overflowX: "auto" }} className="noscroll">
                {SPECIALTIES.map(s => (
                  <Link key={s.name} href="/doctors" className="spec-btn">
                    <span style={{ fontSize: 22 }}>{s.icon}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(232,244,255,0.6)" }}>{s.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Online Doctors */}
            <div className="a5">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "rgba(232,244,255,0.5)", textTransform: "uppercase", letterSpacing: 1.5 }}>Doctors Online</h3>
                  <span className="livdot" />
                </div>
                <button onClick={() => setTab("doctors")} style={{ color: "#00FFD1", fontSize: 12, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>View All →</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {DOCTORS.filter(d => d.online).slice(0, 2).map(d => (
                  <div key={d.id} className="doc-card" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }} onClick={() => router.push("/call/" + d.id)}>
                    <div style={{ width: 50, height: 50, borderRadius: 16, background: "rgba(0,255,209,0.08)", border: "1px solid rgba(0,255,209,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{d.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        <p style={{ fontWeight: 700, fontSize: 14, color: "#E8F4FF" }}>{d.name}</p>
                        <span className="livdot" />
                      </div>
                      <p style={{ color: "rgba(232,244,255,0.45)", fontSize: 12 }}>{d.spec} · {d.exp}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <span style={{ color: "#FFB347", fontSize: 11 }}>★ {d.rating}</span>
                        <span style={{ color: "rgba(232,244,255,0.3)", fontSize: 11 }}>·</span>
                        <span style={{ color: "#00FFD1", fontSize: 11, fontWeight: 600 }}>₹{d.fee}/consult</span>
                      </div>
                    </div>
                    <div style={{ background: "linear-gradient(135deg,#00C9A7,#0B6FCC)", borderRadius: 10, padding: "8px 14px", color: "white", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>Consult</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Last Prescription */}
            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "rgba(232,244,255,0.5)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Last Prescription</h3>
              <div className="gc" style={{ padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: "#E8F4FF" }}>{RECENT_RX.id}</p>
                    <p style={{ color: "rgba(232,244,255,0.45)", fontSize: 12, marginTop: 2 }}>{RECENT_RX.doctor}</p>
                  </div>
                  <span className="badge" style={{ background: "rgba(0,255,209,0.1)", color: "#00FFD1", alignSelf: "flex-start" }}>✓ {RECENT_RX.status}</span>
                </div>
                <p style={{ color: "rgba(232,244,255,0.6)", fontSize: 12, marginBottom: 10 }}>Dx: {RECENT_RX.diagnosis}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                  {RECENT_RX.medicines.map(m => (
                    <span key={m} style={{ padding: "4px 10px", borderRadius: 100, background: "rgba(77,184,255,0.1)", border: "1px solid rgba(77,184,255,0.2)", color: "#4DB8FF", fontSize: 11, fontWeight: 600 }}>{m}</span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Link href={"/prescription/" + RECENT_RX.id} className="btn-main" style={{ flex: 1, padding: "10px", fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>📄 View Full</Link>
                  <Link href="/order" className="btn-ghost" style={{ flex: 1, padding: "10px", fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>🛒 Reorder</Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DOCTORS TAB */}
        {tab === "doctors" && (
          <div style={{ paddingTop: 20, animation: "slideUp 0.4s ease" }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Find a Doctor</h2>
            <p style={{ color: "rgba(232,244,255,0.45)", fontSize: 13, marginBottom: 20 }}>All doctors are MCI-verified</p>

            <div style={{ position: "relative", marginBottom: 20 }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>🔍</span>
              <input className="search-input" placeholder="Search doctor or specialty..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>

            {/* Filter chips */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 20 }} className="noscroll">
              {["All", "Online Now", "General", "Cardiologist", "Dermatologist", "Neurologist"].map(f => (
                <button key={f} style={{ padding: "6px 14px", borderRadius: 100, flexShrink: 0, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, transition: "all 0.2s", background: f === "All" ? "linear-gradient(135deg,#00C9A7,#0B6FCC)" : "rgba(255,255,255,0.04)", color: f === "All" ? "white" : "rgba(232,244,255,0.5)", border: f === "All" ? "none" : "1px solid rgba(255,255,255,0.08)" }}>
                  {f}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filteredDoctors.map(d => (
                <div key={d.id} className="doc-card" style={{ padding: "16px" }} onClick={() => router.push("/call/" + d.id)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
                    <div style={{ width: 54, height: 54, borderRadius: 16, background: "rgba(0,255,209,0.08)", border: "1px solid rgba(0,255,209,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{d.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <p style={{ fontWeight: 700, fontSize: 14, color: "#E8F4FF" }}>{d.name}</p>
                        {d.online ? <span className="livdot" /> : <span className="offdot" />}
                      </div>
                      <p style={{ color: "rgba(232,244,255,0.45)", fontSize: 12 }}>{d.spec} · {d.exp} exp</p>
                      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                        <span style={{ color: "#FFB347", fontSize: 11 }}>★ {d.rating}</span>
                        <span style={{ color: "rgba(232,244,255,0.3)", fontSize: 11 }}>·</span>
                        <span style={{ color: "rgba(232,244,255,0.45)", fontSize: 11 }}>{d.patients.toLocaleString()} patients</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ color: "#00FFD1", fontWeight: 800, fontSize: 15 }}>₹{d.fee}</p>
                      <p style={{ color: "rgba(232,244,255,0.35)", fontSize: 10 }}>per consult</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-main" style={{ flex: 1, padding: "10px", fontSize: 12 }} disabled={!d.online}>
                      {d.online ? "📹 Video Call" : "⏰ Not Available"}
                    </button>
                    <button className="btn-ghost" style={{ flex: 1, padding: "10px", fontSize: 12 }} disabled={!d.online}>
                      📞 Audio Call
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRESCRIPTIONS TAB */}
        {tab === "rx" && (
          <div style={{ paddingTop: 20, animation: "slideUp 0.4s ease" }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>My Prescriptions</h2>
            <p style={{ color: "rgba(232,244,255,0.45)", fontSize: 13, marginBottom: 20 }}>All your digital prescriptions</p>

            {[RECENT_RX, { ...RECENT_RX, id: "RX-1988", date: "12 Mar 2026", diagnosis: "Viral Fever", status: "Delivered" }].map((rx, i) => (
              <div key={rx.id} className="gc" style={{ padding: 18, marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 15, color: "#E8F4FF" }}>{rx.id}</p>
                    <p style={{ color: "rgba(232,244,255,0.4)", fontSize: 12, marginTop: 2 }}>{rx.doctor} · {rx.date}</p>
                  </div>
                  <span className="badge" style={{ background: "rgba(0,255,209,0.1)", color: "#00FFD1", alignSelf: "flex-start" }}>✓ {rx.status}</span>
                </div>
                <p style={{ color: "rgba(232,244,255,0.55)", fontSize: 12, marginBottom: 12 }}>Dx: {rx.diagnosis}</p>

                {/* Order tracking */}
                <div style={{ marginBottom: 14 }}>
                  {["Ordered", "Confirmed", "Dispatched", "Delivered"].map((s, si) => (
                    <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, background: si <= (i === 0 ? 3 : 3) ? "linear-gradient(135deg,#00C9A7,#0B6FCC)" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "white", fontWeight: 700 }}>
                        {si <= 3 ? "✓" : ""}
                      </div>
                      <p style={{ color: si <= 3 ? "#E8F4FF" : "rgba(232,244,255,0.3)", fontSize: 12, fontWeight: si <= 3 ? 600 : 400 }}>{s}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Link href={"/prescription/" + rx.id} className="btn-main" style={{ flex: 1, padding: "10px", fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>📄 View Details</Link>
                  <Link href="/order" className="btn-ghost" style={{ flex: 1, padding: "10px", fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>🛒 Reorder</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PROFILE TAB */}
        {tab === "profile" && (
          <div style={{ paddingTop: 20, animation: "slideUp 0.4s ease" }}>
            <div className="gc" style={{ padding: 24, textAlign: "center", marginBottom: 20 }}>
              <div style={{ width: 72, height: 72, borderRadius: 22, background: "linear-gradient(135deg,rgba(0,201,167,0.2),rgba(11,111,204,0.2))", border: "1px solid rgba(0,255,209,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 14px" }}>🧑</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#E8F4FF", marginBottom: 4 }}>Rahul Verma</h2>
              <p style={{ color: "#00FFD1", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>+91 9999999999</p>
              <p style={{ color: "rgba(232,244,255,0.4)", fontSize: 12 }}>Patient ID: PAT-10042</p>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              {[{ n: "8", l: "Consultations" }, { n: "3", l: "Prescriptions" }, { n: "12", l: "Medicines" }].map(s => (
                <div key={s.l} className="gc" style={{ flex: 1, padding: 14, textAlign: "center" }}>
                  <p style={{ fontSize: 20, fontWeight: 900, color: "#00FFD1" }}>{s.n}</p>
                  <p style={{ fontSize: 10, color: "rgba(232,244,255,0.4)", marginTop: 3 }}>{s.l}</p>
                </div>
              ))}
            </div>

            {[
              { icon: "👤", label: "Edit Profile", href: "/profile/edit" },
              { icon: "🏥", label: "Medical History", href: "/records" },
              { icon: "📍", label: "Saved Addresses", href: "/addresses" },
              { icon: "💳", label: "Payment Methods", href: "/payments" },
              { icon: "🔔", label: "Notifications", href: "/notifications" },
              { icon: "🔒", label: "Privacy & Security", href: "/privacy" },
              { icon: "❓", label: "Help & Support", href: "/support" },
            ].map(item => (
              <Link key={item.label} href={item.href} style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 18px", borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 10, textDecoration: "none", transition: "all 0.2s" }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span style={{ fontWeight: 600, fontSize: 14, color: "#E8F4FF", flex: 1 }}>{item.label}</span>
                <span style={{ color: "rgba(232,244,255,0.3)", fontSize: 16 }}>→</span>
              </Link>
            ))}

            <button onClick={() => router.push("/login")} style={{ width: "100%", marginTop: 8, padding: "14px", borderRadius: 14, background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)", color: "#FF6B6B", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "rgba(2,13,26,0.97)", backdropFilter: "blur(24px)", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", zIndex: 100 }}>
        {[
          { tab: "home" as Tab, icon: "🏠", label: "Home" },
          { tab: "doctors" as Tab, icon: "🩺", label: "Doctors" },
          { tab: "rx" as Tab, icon: "💊", label: "Prescriptions" },
          { tab: "profile" as Tab, icon: "👤", label: "Profile" },
        ].map(n => (
          <button key={n.tab} className={"nav-item" + (tab === n.tab ? " active" : "")} onClick={() => setTab(n.tab)}
            style={{ color: tab === n.tab ? "#00FFD1" : "rgba(232,244,255,0.35)" }}>
            <span style={{ fontSize: 20 }}>{n.icon}</span>
            <span style={{ fontSize: 10, fontWeight: tab === n.tab ? 700 : 500 }}>{n.label}</span>
          </button>
        ))}
      </div>
    </main>
  );
}
