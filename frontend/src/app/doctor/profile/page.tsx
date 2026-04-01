"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Step = "mobile" | "otp" | "role";

// Simulate existing users (later this will come from backend API)
const EXISTING_USERS: Record<string, string> = {
  "9999999999": "patient",
  "8888888888": "doctor",
};

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [isExisting, setIsExisting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step !== "otp") return;
    setTimer(30);
    setCanResend(false);
    const t = setInterval(() => {
      setTimer(p => {
        if (p <= 1) { clearInterval(t); setCanResend(true); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [step]);

  useEffect(() => {
    if (step === "otp") setTimeout(() => inputRefs.current[0]?.focus(), 300);
  }, [step]);

  const handleSendOTP = () => {
    const cleaned = mobile.replace(/\D/g, "");
    if (cleaned.length < 10) {
      setShake(true); setTimeout(() => setShake(false), 600); return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Check if user already exists
      const existing = EXISTING_USERS[cleaned];
      setIsExisting(!!existing);
      setStep("otp");
    }, 1200);
  };

  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (newOtp.every(d => d !== "") && newOtp.join("").length === 6) {
      setTimeout(() => handleVerify(newOtp), 300);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (otpArr = otp) => {
    if (otpArr.join("").length < 6) {
      setShake(true); setTimeout(() => setShake(false), 600); return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const cleaned = mobile.replace(/\D/g, "");
      const existingRole = EXISTING_USERS[cleaned];
      if (existingRole) {
        // Existing user — go directly to their dashboard
        if (existingRole === "patient") router.push("/dashboard");
        else if (existingRole === "doctor") router.push("/doctor/dashboard");
      } else {
        // New user — ask role
        setStep("role");
      }
    }, 1200);
  };

  const handleRoleSelect = (role: string) => {
    setLoading(true);
    setTimeout(() => {
      if (role === "patient") router.push("/dashboard");
      else router.push("/doctor/dashboard");
    }, 800);
  };

  const otpFilled = otp.every(d => d !== "");

  return (
    <main style={{ minHeight: "100vh", background: "#020D1A", fontFamily: "'Plus Jakarta Sans', sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }
        @keyframes ripple { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2.2);opacity:0} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes shimmerH { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes slideRight { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .shake { animation: shake 0.5s ease; }
        .shine { background: linear-gradient(90deg,#00FFD1,#4DB8FF,#A78BFA,#00FFD1); background-size:300% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmerH 4s linear infinite; }
        .btn-main { display:flex; align-items:center; justify-content:center; gap:10px; width:100%; padding:16px; border-radius:16px; font-family:inherit; font-weight:800; font-size:15px; color:white; border:none; cursor:pointer; transition:all 0.3s; background:linear-gradient(135deg,#00C9A7,#0B6FCC); box-shadow:0 0 28px rgba(0,201,167,0.35),0 6px 20px rgba(0,0,0,0.3); }
        .btn-main:hover { transform:translateY(-2px); box-shadow:0 0 44px rgba(0,201,167,0.55); }
        .btn-main:active { transform:scale(0.98); }
        .btn-main:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
        .mobile-input { width:100%; padding:16px 20px 16px 52px; border-radius:14px; font-family:inherit; font-size:16px; font-weight:600; letter-spacing:1px; outline:none; transition:all 0.3s; background:rgba(255,255,255,0.04); border:1.5px solid rgba(255,255,255,0.1); color:#E8F4FF; }
        .mobile-input::placeholder { color:rgba(232,244,255,0.3); font-weight:400; }
        .mobile-input:focus { border-color:rgba(0,255,209,0.5); background:rgba(0,255,209,0.04); box-shadow:0 0 0 3px rgba(0,255,209,0.1); }
        .otp-box { width:46px; height:56px; text-align:center; font-size:22px; font-weight:800; border-radius:14px; outline:none; transition:all 0.25s; background:rgba(255,255,255,0.04); border:1.5px solid rgba(255,255,255,0.1); color:#00FFD1; font-family:inherit; }
        .otp-box:focus { border-color:rgba(0,255,209,0.6); background:rgba(0,255,209,0.06); box-shadow:0 0 0 3px rgba(0,255,209,0.12); transform:scale(1.08); }
        .otp-box.filled { border-color:rgba(0,255,209,0.4); background:rgba(0,255,209,0.08); }
        .role-card { display:flex; align-items:center; gap:16px; padding:20px; border-radius:18px; cursor:pointer; transition:all 0.3s; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); width:100%; text-align:left; font-family:inherit; }
        .role-card:hover { transform:translateX(6px); border-color:rgba(0,255,209,0.3); background:rgba(0,255,209,0.05); box-shadow:0 8px 24px rgba(0,0,0,0.3); }
        .role-card:active { transform:scale(0.98); }
        .livdot { width:8px; height:8px; border-radius:50%; background:#00FFD1; display:inline-block; position:relative; }
        .livdot::after { content:''; position:absolute; inset:-4px; border-radius:50%; background:rgba(0,255,209,0.3); animation:ripple 1.8s infinite; }
        .loader { width:20px; height:20px; border:2.5px solid rgba(255,255,255,0.3); border-top-color:white; border-radius:50%; animation:spin 0.8s linear infinite; display:inline-block; }
        .back-btn { display:inline-flex; align-items:center; gap:6px; color:rgba(232,244,255,0.45); font-size:13px; font-weight:600; cursor:pointer; transition:color 0.2s; background:none; border:none; font-family:inherit; padding:0; }
        .back-btn:hover { color:#00FFD1; }
        .hgrid { position:fixed; inset:0; background-image:linear-gradient(rgba(0,255,209,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,209,0.03) 1px,transparent 1px); background-size:40px 40px; mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,black,transparent); pointer-events:none; z-index:0; }
      `}</style>

      <div className="hgrid" />
      <div style={{ position:"fixed", top:"5%", left:"50%", transform:"translateX(-50%)", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(0,100,200,0.10),transparent)", pointerEvents:"none", zIndex:0 }} />

      {/* NAV */}
      <nav style={{ position:"relative", zIndex:10, padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <Link href="/">
          <Image src="/logo.png" alt="DigiDoc" width={120} height={40} style={{ height:32, width:"auto", filter:"brightness(1.1)" }} />
        </Link>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 14px", borderRadius:100, background:"rgba(0,255,209,0.08)", border:"1px solid rgba(0,255,209,0.2)" }}>
          <span className="livdot" />
          <span style={{ color:"#00FFD1", fontSize:11, fontWeight:700 }}>500+ Online</span>
        </div>
      </nav>

      {/* MAIN */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 20px", position:"relative", zIndex:1 }}>
        <div style={{ width:"100%", maxWidth:380 }}>

          {/* STEP 1 — MOBILE */}
          {step === "mobile" && (
            <div className="fade-up">
              <div style={{ textAlign:"center", marginBottom:36 }}>
                <div style={{ width:72, height:72, borderRadius:22, background:"linear-gradient(135deg,rgba(0,201,167,0.2),rgba(11,111,204,0.2))", border:"1px solid rgba(0,255,209,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 20px" }}>📱</div>
                <h1 style={{ fontSize:26, fontWeight:900, marginBottom:8, letterSpacing:"-0.5px" }}>
                  Welcome to <span className="shine">DigiDoc</span>
                </h1>
                <p style={{ color:"rgba(232,244,255,0.5)", fontSize:14, lineHeight:1.7 }}>
                  Enter your mobile number.<br />A doctor is just minutes away.
                </p>
              </div>

              <div className={shake ? "shake" : ""}>
                <label style={{ color:"rgba(232,244,255,0.45)", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1.5, display:"block", marginBottom:10 }}>Mobile Number</label>
                <div style={{ position:"relative", marginBottom:16 }}>
                  <div style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", color:"rgba(232,244,255,0.4)", fontSize:15, fontWeight:700, pointerEvents:"none" }}>+91</div>
                  <input
                    className="mobile-input"
                    type="tel"
                    placeholder="XXXXX XXXXX"
                    value={mobile}
                    maxLength={13}
                    onChange={e => setMobile(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSendOTP()}
                    autoFocus
                  />
                </div>
                <button className="btn-main" onClick={handleSendOTP} disabled={loading || mobile.replace(/\D/g,"").length < 10}>
                  {loading ? <span className="loader" /> : <>Send OTP <span style={{ fontSize:18 }}>→</span></>}
                </button>
              </div>

              <p style={{ textAlign:"center", color:"rgba(232,244,255,0.25)", fontSize:12, marginTop:20, lineHeight:1.7 }}>
                By continuing you agree to our{" "}
                <Link href="/terms" style={{ color:"#00FFD1", textDecoration:"none" }}>Terms</Link>
                {" & "}
                <Link href="/privacy" style={{ color:"#00FFD1", textDecoration:"none" }}>Privacy Policy</Link>
              </p>

              {/* Admin login link — hidden at bottom */}
              <div style={{ marginTop:40, textAlign:"center" }}>
                <Link href="/admin/login" style={{ color:"rgba(232,244,255,0.2)", fontSize:11, textDecoration:"none", transition:"color 0.2s" }}>
                  Admin Panel Access →
                </Link>
              </div>
            </div>
          )}

          {/* STEP 2 — OTP */}
          {step === "otp" && (
            <div className="fade-up">
              <button className="back-btn" onClick={() => { setStep("mobile"); setOtp(["","","","","",""]); }} style={{ marginBottom:28 }}>
                ← Back
              </button>

              <div style={{ textAlign:"center", marginBottom:32 }}>
                <div style={{ width:72, height:72, borderRadius:22, background:"linear-gradient(135deg,rgba(0,201,167,0.2),rgba(11,111,204,0.2))", border:"1px solid rgba(0,255,209,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 20px" }}>🔐</div>
                <h2 style={{ fontSize:24, fontWeight:900, marginBottom:8 }}>Enter OTP</h2>
                <p style={{ color:"rgba(232,244,255,0.5)", fontSize:14, lineHeight:1.7 }}>
                  6-digit code sent to<br />
                  <span style={{ color:"#00FFD1", fontWeight:700 }}>+91 {mobile}</span>
                </p>

                {/* Show message if existing user */}
                {isExisting && (
                  <div style={{ marginTop:12, padding:"10px 16px", borderRadius:12, background:"rgba(0,255,209,0.06)", border:"1px solid rgba(0,255,209,0.15)", display:"inline-block" }}>
                    <p style={{ color:"#00FFD1", fontSize:12, fontWeight:600 }}>✓ Account found — logging you in</p>
                  </div>
                )}
              </div>

              <div className={shake ? "shake" : ""}>
                <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:28 }}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { inputRefs.current[i] = el; }}
                      className={"otp-box" + (digit ? " filled" : "")}
                      type="tel"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOTPChange(i, e.target.value)}
                      onKeyDown={e => handleKeyDown(i, e)}
                    />
                  ))}
                </div>
                <button className="btn-main" onClick={() => handleVerify()} disabled={loading || !otpFilled}>
                  {loading ? <span className="loader" /> : <>Verify &amp; Continue <span style={{ fontSize:18 }}>→</span></>}
                </button>
              </div>

              <div style={{ textAlign:"center", marginTop:24 }}>
                {canResend ? (
                  <button onClick={() => { setOtp(["","","","","",""]); setStep("otp"); }} style={{ background:"none", border:"none", color:"#00FFD1", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                    Resend OTP
                  </button>
                ) : (
                  <p style={{ color:"rgba(232,244,255,0.35)", fontSize:13 }}>
                    Resend in <span style={{ color:"#00FFD1", fontWeight:700 }}>{timer}s</span>
                  </p>
                )}
              </div>

              <div style={{ marginTop:24, padding:"14px 18px", borderRadius:14, background:"rgba(0,255,209,0.04)", border:"1px solid rgba(0,255,209,0.12)", display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:18 }}>🔒</span>
                <p style={{ color:"rgba(232,244,255,0.4)", fontSize:12, lineHeight:1.6 }}>
                  OTP is valid for 10 minutes. Never share it with anyone.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3 — ROLE (Only for NEW users) */}
          {step === "role" && (
            <div className="fade-up">
              <div style={{ textAlign:"center", marginBottom:32 }}>
                <div style={{ width:72, height:72, borderRadius:22, background:"linear-gradient(135deg,rgba(0,201,167,0.2),rgba(11,111,204,0.2))", border:"1px solid rgba(0,255,209,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 20px" }}>🎉</div>
                <h2 style={{ fontSize:24, fontWeight:900, marginBottom:8 }}>
                  <span className="shine">Account Created!</span>
                </h2>
                <p style={{ color:"rgba(232,244,255,0.5)", fontSize:14 }}>
                  How will you be using DigiDoc?
                </p>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[
                  { role:"patient", icon:"🧑", title:"I am a Patient", sub:"Consult doctors, get prescriptions and order medicines", color:"#00FFD1" },
                  { role:"doctor", icon:"👨‍⚕️", title:"I am a Doctor", sub:"Manage consultations, patients and prescriptions", color:"#4DB8FF" },
                ].map(r => (
                  <button key={r.role} className="role-card" onClick={() => handleRoleSelect(r.role)}>
                    <div style={{ width:52, height:52, borderRadius:16, background:r.color + "18", border:"1px solid " + r.color + "30", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{r.icon}</div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontWeight:700, fontSize:15, color:"#E8F4FF", marginBottom:4 }}>{r.title}</p>
                      <p style={{ color:"rgba(232,244,255,0.4)", fontSize:12, lineHeight:1.5 }}>{r.sub}</p>
                    </div>
                    <span style={{ color:r.color, fontSize:20, opacity:0.7 }}>→</span>
                  </button>
                ))}
              </div>

              <p style={{ textAlign:"center", color:"rgba(232,244,255,0.25)", fontSize:12, marginTop:20 }}>
                Your role is saved. Next time you login,<br />you will go directly to your dashboard.
              </p>

              {loading && (
                <div style={{ textAlign:"center", marginTop:20 }}>
                  <span className="loader" style={{ margin:"0 auto", display:"block" }} />
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      <div style={{ padding:"14px 20px", textAlign:"center", borderTop:"1px solid rgba(255,255,255,0.05)", position:"relative", zIndex:1 }}>
        <p style={{ color:"rgba(255,255,255,0.15)", fontSize:11 }}>2026 DigiDoc · Safe and Secure · Made in India</p>
      </div>
    </main>
  );
}
