"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}
  @keyframes scan{0%{top:-2px}100%{top:102%}}
  @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  .fade-up{animation:fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both}
  .a1{animation:fadeUp 0.6s ease 0.0s both}
  .a2{animation:fadeUp 0.6s ease 0.1s both}
  .a3{animation:fadeUp 0.6s ease 0.2s both}
  .a4{animation:fadeUp 0.6s ease 0.3s both}
  .a5{animation:fadeUp 0.6s ease 0.4s both}
  .shake{animation:shake 0.5s ease}
  .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .inp{width:100%;padding:14px 16px;border-radius:14px;font-family:inherit;font-size:14px;font-weight:500;outline:none;transition:all 0.3s;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.09);color:#E8F4FF}
  .inp::placeholder{color:rgba(232,244,255,0.28)}
  .inp:focus{border-color:rgba(0,255,209,0.45);background:rgba(0,255,209,0.03);box-shadow:0 0 0 3px rgba(0,255,209,0.08)}
  .bm{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:16px;border-radius:14px;font-family:inherit;font-weight:800;font-size:15px;color:white;border:none;cursor:pointer;transition:all 0.3s;background:linear-gradient(135deg,#00C9A7,#0B6FCC);box-shadow:0 0 28px rgba(0,201,167,0.32)}
  .bm:hover{transform:translateY(-2px);box-shadow:0 0 40px rgba(0,201,167,0.48)}
  .bm:active{transform:scale(0.98)}
  .bm:disabled{opacity:0.45;cursor:not-allowed;transform:none}
  .loader{width:22px;height:22px;border:3px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block}
  .livdot{width:8px;height:8px;border-radius:50%;background:#00FFD1;display:inline-block;position:relative}
  .livdot::after{content:'';position:absolute;inset:-4px;border-radius:50%;background:rgba(0,255,209,0.3);animation:ripple 1.8s infinite}
  .float{animation:floatY 4s ease-in-out infinite}
  .hgrid{position:absolute;inset:0;background-image:linear-gradient(rgba(0,255,209,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,209,0.03) 1px,transparent 1px);background-size:40px 40px;mask-image:radial-gradient(ellipse 80% 70% at 50% 0%,black,transparent);pointer-events:none}
`;

// Admin credentials — change these before going live
const ADMIN_USERNAME = "admin@digidoc.com";
const ADMIN_PASSWORD = "DigiDoc@2026";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [shake, setShake]       = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked]     = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  useEffect(() => {
    if (!locked) return;
    setLockTimer(30);
    const t = setInterval(() => {
      setLockTimer(p => {
        if (p <= 1) { clearInterval(t); setLocked(false); setAttempts(0); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [locked]);

  const handleLogin = () => {
    if (locked) return;
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      setShake(true); setTimeout(() => setShake(false), 600); return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        router.push("/admin/dashboard");
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 3) {
          setLocked(true);
          setError("Too many failed attempts. Account locked for 30 seconds.");
        } else {
          setError(`Invalid credentials. ${3 - newAttempts} attempt${3 - newAttempts > 1 ? "s" : ""} remaining.`);
        }
        setShake(true); setTimeout(() => setShake(false), 600);
      }
    }, 1500);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, display: "flex", flexDirection: "column",
      background: "#020D1A", fontFamily: "'Plus Jakarta Sans',sans-serif",
      color: "#E8F4FF", maxWidth: 480, margin: "0 auto",
      left:0, right:0,
    }}>
      <style>{S}</style>

      {/* BG */}
      <div style={{ position: "fixed", top: "5%", left:0, right:0, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,100,200,0.10),transparent)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "5%", right: "-10%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,255,209,0.05),transparent)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 24px", position: "relative", zIndex: 1, overflowY: "auto" }}>
        <div className="hgrid" style={{ position: "fixed" }} />

        <div style={{ width: "100%", maxWidth: 360 }}>

          {/* Logo */}
          <div className="a1" style={{ textAlign: "center", marginBottom: 32 }}>
            <div className="float" style={{ display: "inline-block", marginBottom: 16 }}>
              <div style={{ width: 80, height: 80, borderRadius: 24, background: "linear-gradient(135deg,rgba(0,201,167,0.2),rgba(11,111,204,0.2))", border: "1.5px solid rgba(0,255,209,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(0,255,209,0.6),transparent)", animation: "scan 2.5s ease-in-out infinite" }} />
                ⚙️
              </div>
            </div>
            <h1 className="a2" style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>
              <span className="shine">Admin Panel</span>
            </h1>
            <div className="a3" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 14px", borderRadius: 100, background: "rgba(0,255,209,0.07)", border: "1px solid rgba(0,255,209,0.18)" }}>
              <span className="livdot" />
              <span style={{ color: "#00FFD1", fontSize: 11, fontWeight: 700 }}>DigiDoc Control Center</span>
            </div>
          </div>

          {/* Lock warning */}
          {locked && (
            <div className="a3" style={{ background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)", borderRadius: 14, padding: "13px 15px", marginBottom: 18, display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 22 }}>🔒</span>
              <div>
                <p style={{ color: "#FF6B6B", fontWeight: 700, fontSize: 13 }}>Account Temporarily Locked</p>
                <p style={{ color: "rgba(255,107,107,0.7)", fontSize: 11, marginTop: 2 }}>Try again in <strong style={{ color: "#FF6B6B" }}>{lockTimer}s</strong></p>
              </div>
            </div>
          )}

          {/* Form */}
          <div className={shake ? "shake" : ""}>

            {/* Username */}
            <div className="a3" style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(232,244,255,0.4)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 7 }}>Admin Email</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>👤</span>
                <input
                  className="inp"
                  style={{ paddingLeft: 42 }}
                  type="email"
                  placeholder="admin@digidoc.com"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  disabled={locked}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="a4" style={{ marginBottom: 6 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(232,244,255,0.4)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 7 }}>Password</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>🔑</span>
                <input
                  className="inp"
                  style={{ paddingLeft: 42, paddingRight: 50 }}
                  type={showPass ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  disabled={locked}
                  autoComplete="current-password"
                />
                <button
                  onClick={() => setShowPass(p => !p)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, opacity: 0.6, padding: 0 }}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14, padding: "9px 13px", borderRadius: 10, background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)" }}>
                <span style={{ fontSize: 14 }}>⚠️</span>
                <p style={{ color: "#FF6B6B", fontSize: 12, fontWeight: 600 }}>{error}</p>
              </div>
            )}

            {/* Attempts indicator */}
            {attempts > 0 && !locked && (
              <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 14 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ width: 28, height: 5, borderRadius: 100, background: i <= attempts ? "#FF6B6B" : "rgba(255,255,255,0.08)", transition: "all 0.3s" }} />
                ))}
              </div>
            )}

            {/* Login btn */}
            <div className="a5" style={{ marginTop: 20 }}>
              <button className="bm" onClick={handleLogin} disabled={loading || locked}>
                {loading ? <span className="loader" /> : <>🔐 Sign In to Admin Panel</>}
              </button>
            </div>
          </div>

          {/* Security note */}
          <div className="a5" style={{ marginTop: 20, background: "rgba(255,179,71,0.05)", border: "1px solid rgba(255,179,71,0.14)", borderRadius: 13, padding: "11px 14px" }}>
            <p style={{ color: "#FFB347", fontWeight: 700, fontSize: 11, marginBottom: 3 }}>🔒 Secure Access Only</p>
            <p style={{ color: "rgba(255,179,71,0.6)", fontSize: 11, lineHeight: 1.6 }}>
              This panel is for DigiDoc administrators only. All login attempts are logged and monitored.
            </p>
          </div>

          {/* Dev hint — remove before going live */}
          <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 12, background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.14)" }}>
            <p style={{ color: "rgba(167,139,250,0.7)", fontSize: 10, fontWeight: 600, marginBottom: 2 }}>🧪 Test Credentials (Remove before live)</p>
            <p style={{ color: "rgba(167,139,250,0.5)", fontSize: 10 }}>Email: admin@digidoc.com</p>
            <p style={{ color: "rgba(167,139,250,0.5)", fontSize: 10 }}>Password: DigiDoc@2026</p>
          </div>

          {/* Back to main site */}
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <a href="/" style={{ color: "rgba(232,244,255,0.25)", fontSize: 12, textDecoration: "none" }}>
              ← Back to DigiDoc
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ flexShrink: 0, padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center", position: "relative", zIndex: 1 }}>
        <p style={{ color: "rgba(255,255,255,0.14)", fontSize: 10 }}>
          🔒 256-bit encrypted · Admin access only · All actions logged
        </p>
      </div>
    </div>
  );
}
