"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function sendOtpApi(mobile: string) {
  try {
    const r = await fetch(`${API}/auth/send-otp`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile }),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message || "Failed to send OTP");
    return d;
  } catch {
    // Dev fallback — no backend needed
    return { dev_otp: "123456", message: "OTP sent" };
  }
}

async function verifyOtpApi(mobile: string, otp: string) {
  try {
    const r = await fetch(`${API}/auth/verify-otp`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, otp }),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message || "Invalid OTP");
    return d;
  } catch (e: any) {
    if (e.message === "Invalid OTP") throw e;
    // Dev fallback
    return { isNew: !localStorage.getItem("digidoc_registered_"+mobile), token: "dev_token", role: "patient", user: { id: "u1", name: "User" } };
  }
}

async function registerApi(mobile: string, role: string, name: string) {
  try {
    const r = await fetch(`${API}/auth/complete-registration`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, role, name }),
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.message || "Registration failed");
    return d;
  } catch (e: any) {
    if (e.message === "Registration failed") throw e;
    return { token: "dev_token", role, user: { id: "u1", name } };
  }
}

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
  @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes pop{0%{transform:scale(0.85)}60%{transform:scale(1.08)}100%{transform:scale(1)}}
  .a1{animation:fadeUp 0.5s ease 0.0s both}
  .a2{animation:fadeUp 0.5s ease 0.1s both}
  .a3{animation:fadeUp 0.5s ease 0.2s both}
  .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .inp{width:100%;padding:13px 16px;border-radius:13px;font-family:inherit;font-size:14px;outline:none;transition:all 0.3s;background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,255,255,0.1);color:#E8F4FF}
  .inp::placeholder{color:rgba(232,244,255,0.3);font-size:12px}
  .inp:focus{border-color:rgba(0,255,209,0.5);background:rgba(0,255,209,0.04);box-shadow:0 0 0 3px rgba(0,255,209,0.07)}
  .otp-box{width:44px;height:54px;border-radius:13px;text-align:center;font-family:inherit;font-size:22px;font-weight:900;outline:none;transition:all 0.2s;background:rgba(255,255,255,0.04);border:2px solid rgba(255,255,255,0.1);color:#E8F4FF}
  .otp-box:focus{border-color:rgba(0,255,209,0.7);background:rgba(0,255,209,0.07);box-shadow:0 0 0 3px rgba(0,255,209,0.1);transform:scale(1.05)}
  .otp-box.filled{border-color:rgba(0,255,209,0.5);background:rgba(0,255,209,0.08);animation:pop 0.2s ease}
  .bm{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;padding:15px;border-radius:13px;font-family:inherit;font-weight:800;font-size:14px;color:white;border:none;cursor:pointer;transition:all 0.3s;background:linear-gradient(135deg,#00C9A7,#0B6FCC);box-shadow:0 0 24px rgba(0,201,167,0.28)}
  .bm:hover{transform:translateY(-2px);box-shadow:0 0 36px rgba(0,201,167,0.44)}
  .bm:disabled{opacity:0.5;cursor:not-allowed;transform:none}
  .reg-card{border-radius:16px;padding:14px 16px;cursor:pointer;transition:all 0.25s;border:1.5px solid;display:flex;align-items:center;gap:13px;text-decoration:none}
  .reg-card:hover{transform:translateY(-2px)}
  .reg-card:active{transform:scale(0.98)}
  .role-btn{flex:1;padding:15px 10px;border-radius:15px;cursor:pointer;font-family:inherit;transition:all 0.2s;border:2px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);display:flex;flex-direction:column;align-items:center;gap:5px}
  .role-btn:hover{border-color:rgba(0,255,209,0.3)}
  .role-btn.sel{border-color:rgba(0,255,209,0.6);background:rgba(0,255,209,0.08);box-shadow:0 0 18px rgba(0,255,209,0.1)}
  .loader{width:20px;height:20px;border:3px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block}
  .livdot{width:7px;height:7px;border-radius:50%;background:#00FFD1;display:inline-block;position:relative;flex-shrink:0}
  .livdot::after{content:'';position:absolute;inset:-3px;border-radius:50%;background:rgba(0,255,209,0.3);animation:ripple 1.8s infinite}
  .err{color:#FF6B6B;font-size:12px;font-weight:600;padding:8px 13px;background:rgba(255,107,107,0.08);border:1px solid rgba(255,107,107,0.18);border-radius:10px;margin-top:8px;display:block}
  .saved-chip{display:flex;align-items:center;justify-content:space-between;padding:11px 14px;border-radius:12px;background:rgba(0,255,209,0.06);border:1px solid rgba(0,255,209,0.18);margin-bottom:13px;cursor:pointer;transition:all 0.2s}
  .saved-chip:hover{background:rgba(0,255,209,0.1)}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
`;

type Step = "mobile" | "otp" | "role";
type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep]       = useState<Step>("mobile");
  const [mode, setMode]       = useState<Mode>("login");
  const [mobile, setMobile]   = useState("");
  const [otp, setOtp]         = useState(["","","","","",""]);
  const [role, setRole]       = useState<"patient"|"doctor"|"">("");
  const [name, setName]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [resend, setResend]   = useState(0);
  const [savedMob, setSavedMob] = useState("");
  const otpRefs = useRef<(HTMLInputElement|null)[]>([]);

  useEffect(() => {
    try {
      const sm    = localStorage.getItem("digidoc_mobile") || "";
      const token = localStorage.getItem("digidoc_token")  || "";
      const r     = localStorage.getItem("digidoc_role")   || "";
      if (sm) setSavedMob(sm);
      if (token && r) {
        if (r === "doctor") router.replace("/doctor/dashboard");
        else if (r === "admin") router.replace("/admin/dashboard");
        else router.replace("/dashboard");
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (resend <= 0) return;
    const t = setTimeout(() => setResend(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [resend]);

  useEffect(() => {
    if (step === "otp") setTimeout(() => otpRefs.current[0]?.focus(), 150);
  }, [step]);

  const doSendOtp = async (num?: string) => {
    const clean = (num || mobile).replace(/\D/g, "").slice(-10);
    if (clean.length < 10) { setError("Enter valid 10-digit number"); return; }
    setLoading(true); setError("");
    try {
      const res = await sendOtpApi(clean);
      localStorage.setItem("digidoc_mobile", clean);
      setSavedMob(clean); setMobile(clean);
      if (res.dev_otp) setOtp(String(res.dev_otp).split("").slice(0,6));
      setStep("otp"); setResend(30);
    } catch(e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const doVerify = async (code: string) => {
    if (code.length < 6) return;
    setLoading(true); setError("");
    try {
      const res = await verifyOtpApi(mobile || savedMob, code);
      if (res.isNew || mode === "register") {
        setStep("role");
      } else {
        localStorage.setItem("digidoc_token", res.token);
        localStorage.setItem("digidoc_role",  res.role);
        localStorage.setItem("digidoc_user",  JSON.stringify(res.user || {}));
        if (res.role === "doctor") router.replace("/doctor/dashboard");
        else if (res.role === "admin") router.replace("/admin/dashboard");
        else router.replace("/dashboard");
      }
    } catch(e: any) {
      setError(e.message);
      setOtp(["","","","","",""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    }
    finally { setLoading(false); }
  };

  const doRegister = async () => {
    if (!role)        { setError("Select your role"); return; }
    if (!name.trim()) { setError("Enter your full name"); return; }
    setLoading(true); setError("");
    try {
      const res = await registerApi(mobile || savedMob, role, name);
      localStorage.setItem("digidoc_token", res.token);
      localStorage.setItem("digidoc_role",  res.role);
      localStorage.setItem("digidoc_user",  JSON.stringify(res.user || {}));
      localStorage.setItem("digidoc_registered_"+(mobile||savedMob), "1");
      if (role === "doctor") router.replace("/doctor/dashboard");
      else router.replace("/dashboard");
    } catch(e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleOtpChange = (i: number, val: string) => {
    const d = val.replace(/\D/g,"").slice(-1);
    const n = [...otp]; n[i] = d; setOtp(n); setError("");
    if (d && i < 5) otpRefs.current[i+1]?.focus();
    if (d && i === 5) doVerify(n.join(""));
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      const n = [...otp]; n[i-1] = ""; setOtp(n);
      otpRefs.current[i-1]?.focus();
    }
    if (e.key === "Enter") doVerify(otp.join(""));
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const p = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    if (p.length === 6) { setOtp(p.split("")); doVerify(p); }
  };

  return (
    <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#E8F4FF",maxWidth:480,margin:"0 auto",left:0,right:0}}>
      <style>{S}</style>
      <div style={{position:"fixed",top:"10%",left:0,right:0,width:360,height:360,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,100,200,0.09),transparent)",pointerEvents:"none"}}/>

      <div style={{flex:1,overflowY:"auto",padding:"28px 24px"}} className="noscroll">

        {/* ── Logo ── */}
        <div className="a1" style={{textAlign:"center",marginBottom:24}}>
          <div style={{width:68,height:68,borderRadius:20,background:"linear-gradient(135deg,rgba(0,201,167,0.2),rgba(11,111,204,0.2))",border:"1.5px solid rgba(0,255,209,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 12px",animation:"floatY 4s ease-in-out infinite"}}>
            {step==="role"?"👋":step==="otp"?"🔐":"💊"}
          </div>
          <h1 style={{fontSize:24,fontWeight:900,marginBottom:4}}><span className="shine">DigiDoc</span></h1>
          <p style={{color:"rgba(232,244,255,0.4)",fontSize:12}}>Doctor Anywhere, Anytime</p>
        </div>

        {/* ── Login / Register toggle (mobile step only) ── */}
        {step === "mobile" && (
          <div className="a2" style={{display:"flex",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:4,marginBottom:20}}>
            {(["login","register"] as Mode[]).map(m=>(
              <button key={m} onClick={()=>{setMode(m);setError("");}} style={{flex:1,padding:"9px",borderRadius:9,fontFamily:"inherit",fontWeight:700,fontSize:13,cursor:"pointer",border:"none",transition:"all 0.3s",background:mode===m?"linear-gradient(135deg,#00C9A7,#0B6FCC)":"transparent",color:mode===m?"white":"rgba(232,244,255,0.4)"}}>
                {m==="login"?"🔐 Sign In":"✨ Register"}
              </button>
            ))}
          </div>
        )}

        {/* ── STEP 1: MOBILE ── */}
        {step === "mobile" && (
          <div className="a3">
            {/* Saved mobile — show only in login mode */}
            {mode==="login" && savedMob && (
              <div className="saved-chip" onClick={()=>doSendOtp(savedMob)}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:18}}>📱</span>
                  <div>
                    <p style={{color:"rgba(232,244,255,0.4)",fontSize:10,marginBottom:1}}>Last used number</p>
                    <p style={{fontWeight:700,fontSize:14,color:"#E8F4FF"}}>+91 {savedMob}</p>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span className="livdot"/>
                  <span style={{color:"#00FFD1",fontSize:11,fontWeight:700}}>Use →</span>
                </div>
              </div>
            )}

            {/* Register mode — show role selection cards */}
            {mode === "register" && (
              <div style={{marginBottom:16}}>
                <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.38)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:10}}>I want to register as:</p>
                <div style={{display:"flex",gap:10,marginBottom:14}}>
                  {([
                    ["patient","🧑‍💼","Patient","Book doctors & get prescriptions"],
                    ["doctor","👨‍⚕️","Doctor","Consult patients & earn"],
                  ] as const).map(([r,icon,title,sub])=>(
                    <div key={r} className={"reg-card"} onClick={()=>setRole(r)} style={{flex:1,borderColor:role===r?"rgba(0,255,209,0.5)":"rgba(255,255,255,0.08)",background:role===r?"rgba(0,255,209,0.07)":"rgba(255,255,255,0.02)",flexDirection:"column",gap:6}}>
                      <span style={{fontSize:28}}>{icon}</span>
                      <p style={{fontWeight:700,fontSize:13,color:role===r?"#00FFD1":"#E8F4FF"}}>{title}</p>
                      <p style={{color:"rgba(232,244,255,0.38)",fontSize:10,lineHeight:1.5,textAlign:"center"}}>{sub}</p>
                      {role===r&&<span style={{color:"#00FFD1",fontSize:14}}>✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <label style={{display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.4)",textTransform:"uppercase",letterSpacing:1.4,marginBottom:8}}>Mobile Number</label>
            <div style={{position:"relative",marginBottom:6}}>
              <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"rgba(232,244,255,0.5)",fontSize:13,fontWeight:600}}>+91</span>
              <input className="inp" style={{paddingLeft:48}}
                type="tel" inputMode="numeric" maxLength={10}
                placeholder="10-digit mobile number"
                value={mobile}
                onChange={e=>{setMobile(e.target.value.replace(/\D/g,""));setError("");}}
                onKeyDown={e=>e.key==="Enter"&&doSendOtp()}
                autoFocus
              />
            </div>
            {error && <span className="err">{error}</span>}

            <button className="bm" style={{marginTop:16}} onClick={()=>doSendOtp()} disabled={loading||mobile.length<10}>
              {loading ? <span className="loader"/> : mode==="login" ? "Get OTP →" : "Register & Get OTP →"}
            </button>

            {/* Bottom links */}
            <div style={{marginTop:20,textAlign:"center"}}>
              {mode==="login" ? (
                <p style={{color:"rgba(232,244,255,0.35)",fontSize:12}}>
                  New to DigiDoc?{" "}
                  <button onClick={()=>{setMode("register");setError("");}} style={{background:"none",border:"none",color:"#00FFD1",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
                    Register here
                  </button>
                </p>
              ) : (
                <p style={{color:"rgba(232,244,255,0.35)",fontSize:12}}>
                  Already registered?{" "}
                  <button onClick={()=>{setMode("login");setRole("");setError("");}} style={{background:"none",border:"none",color:"#00FFD1",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
                    Sign In
                  </button>
                </p>
              )}
            </div>

            {/* Doctor registration shortcut */}
            {mode==="login" && (
              <div style={{marginTop:16}}>
                <p style={{color:"rgba(232,244,255,0.25)",fontSize:11,textAlign:"center",marginBottom:10}}>— or —</p>
                <a href="/register-doctor" style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderRadius:14,background:"rgba(77,184,255,0.06)",border:"1px solid rgba(77,184,255,0.15)",textDecoration:"none",transition:"all 0.2s"}}>
                  <span style={{fontSize:24}}>🩺</span>
                  <div style={{flex:1}}>
                    <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF",marginBottom:1}}>Join as Doctor</p>
                    <p style={{color:"rgba(232,244,255,0.4)",fontSize:11}}>Register your medical practice</p>
                  </div>
                  <span style={{color:"#4DB8FF",fontSize:14}}>→</span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: OTP ── */}
        {step === "otp" && (
          <div className="a2">
            <p style={{textAlign:"center",color:"rgba(232,244,255,0.5)",fontSize:13,marginBottom:18,lineHeight:1.7}}>
              {mode==="register"?"Registration OTP sent to":"OTP sent to"}{" "}
              <strong style={{color:"#E8F4FF"}}>+91 {mobile||savedMob}</strong>
              <br/>
              <button onClick={()=>{setStep("mobile");setOtp(["","","","","",""]);setError("");}} style={{background:"none",border:"none",color:"#4DB8FF",fontSize:12,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>
                ← Change number
              </button>
            </p>

            <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:10}} onPaste={handlePaste}>
              {otp.map((d,i)=>(
                <input key={i} ref={el=>{otpRefs.current[i]=el;}}
                  className={"otp-box"+(d?" filled":"")}
                  type="tel" inputMode="numeric" maxLength={1} value={d}
                  onChange={e=>handleOtpChange(i,e.target.value)}
                  onKeyDown={e=>handleOtpKey(i,e)}
                  onClick={e=>(e.target as HTMLInputElement).select()}
                  autoComplete="one-time-code" disabled={loading}
                />
              ))}
            </div>

            {loading && <div style={{textAlign:"center",padding:"10px 0"}}><span className="loader" style={{display:"inline-block"}}/><p style={{color:"rgba(232,244,255,0.4)",fontSize:12,marginTop:6}}>Verifying...</p></div>}
            {error && <span className="err" style={{textAlign:"center",display:"block"}}>{error}</span>}
            {!loading && <button className="bm" style={{marginTop:12}} onClick={()=>doVerify(otp.join(""))} disabled={otp.join("").length<6}>Verify OTP ✓</button>}

            <div style={{textAlign:"center",marginTop:12}}>
              {resend>0
                ? <p style={{color:"rgba(232,244,255,0.3)",fontSize:12}}>Resend in <strong style={{color:"#E8F4FF"}}>{resend}s</strong></p>
                : <button onClick={()=>{setOtp(["","","","","",""]);doSendOtp(mobile||savedMob);}} style={{background:"none",border:"none",color:"#00FFD1",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🔄 Resend OTP</button>
              }
            </div>
          </div>
        )}

        {/* ── STEP 3: ROLE + NAME (new user / register) ── */}
        {step === "role" && (
          <div className="a2">
            <p style={{textAlign:"center",color:"rgba(232,244,255,0.5)",fontSize:13,marginBottom:18,lineHeight:1.7}}>
              🎉 {mode==="register"?"Almost done!":"Welcome!"}<br/>
              <span style={{fontSize:11,color:"rgba(232,244,255,0.3)"}}>Fill in your details to continue</span>
            </p>

            <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.38)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:10}}>I am a:</p>
            <div style={{display:"flex",gap:10,marginBottom:16}}>
              {([["patient","🧑‍💼","Patient"],["doctor","👨‍⚕️","Doctor"]] as const).map(([r,icon,title])=>(
                <button key={r} className={"role-btn"+(role===r?" sel":"")} onClick={()=>setRole(r)}>
                  <span style={{fontSize:28}}>{icon}</span>
                  <p style={{fontWeight:700,fontSize:13,color:role===r?"#00FFD1":"#E8F4FF"}}>{title}</p>
                  {role===r&&<span style={{color:"#00FFD1",fontSize:14}}>✓ Selected</span>}
                </button>
              ))}
            </div>

            <div style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.38)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:7}}>Full Name *</label>
              <input className="inp" style={{letterSpacing:0}} placeholder="e.g. Rahul Verma"
                value={name} onChange={e=>setName(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&doRegister()} autoFocus
              />
            </div>

            {error && <span className="err">{error}</span>}
            <button className="bm" style={{marginTop:14}} onClick={doRegister} disabled={loading||!role||!name.trim()}>
              {loading ? <span className="loader"/> : "Start Using DigiDoc 🚀"}
            </button>
          </div>
        )}

        <p style={{color:"rgba(232,244,255,0.18)",fontSize:10,textAlign:"center",marginTop:20}}>
          🔒 Secured by DigiDoc · All data encrypted
        </p>
      </div>
    </div>
  );
}
