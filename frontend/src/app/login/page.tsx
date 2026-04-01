"use client";
import { useState, useRef, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

function save(mobile: string, data: any) {
  try {
    localStorage.setItem(`dg_u_${mobile}`, JSON.stringify(data));
    localStorage.setItem("dg_mobile", mobile);
  } catch {}
}
function load(mobile: string) {
  try { const d = localStorage.getItem(`dg_u_${mobile}`); return d ? JSON.parse(d) : null; } catch { return null; }
}
function savePwd(mobile: string, pwd: string) {
  try { localStorage.setItem(`dg_p_${mobile}`, btoa(unescape(encodeURIComponent(pwd)))); } catch {}
}
function checkPwd(mobile: string, pwd: string) {
  try {
    const stored = localStorage.getItem(`dg_p_${mobile}`);
    return stored === btoa(unescape(encodeURIComponent(pwd)));
  } catch { return false; }
}
function hasPwd(mobile: string) {
  return !!localStorage.getItem(`dg_p_${mobile}`);
}

const S = `
  *{box-sizing:border-box;margin:0;padding:0}html,body{height:100%;overflow:hidden}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes sh{0%{background-position:-200% center}to{background-position:200% center}}
  @keyframes fy{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes pop{0%{transform:scale(.85)}60%{transform:scale(1.1)}to{transform:scale(1)}}
  @keyframes fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  .sh{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:sh 3s linear infinite}
  .inp{width:100%;padding:13px 16px;border-radius:13px;font-size:14px;outline:none;transition:all .3s;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.1);color:#E8F4FF;font-family:inherit}
  .inp::placeholder{color:rgba(232,244,255,.3)}.inp:focus{border-color:rgba(0,255,209,.5);background:rgba(0,255,209,.04)}
  .ob{width:46px;height:54px;border-radius:12px;text-align:center;font-size:22px;font-weight:900;outline:none;background:rgba(255,255,255,.04);border:2px solid rgba(255,255,255,.1);color:#E8F4FF;transition:all .2s;font-family:inherit}
  .ob:focus{border-color:rgba(0,255,209,.7);background:rgba(0,255,209,.07);transform:scale(1.05)}.ob.f{border-color:rgba(0,255,209,.5);background:rgba(0,255,209,.08);animation:pop .2s ease}
  .btn{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;padding:15px;border-radius:14px;font-weight:800;font-size:14px;color:#fff;border:none;cursor:pointer;background:linear-gradient(135deg,#00C9A7,#0B6FCC);transition:all .3s;font-family:inherit}
  .btn:disabled{opacity:.5;cursor:not-allowed}
  .btn2{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;padding:13px;border-radius:14px;font-weight:600;font-size:13px;color:rgba(232,244,255,.6);border:1.5px solid rgba(255,255,255,.1);cursor:pointer;background:rgba(255,255,255,.04);font-family:inherit;margin-top:10px}
  .rb{flex:1;padding:16px 10px;border-radius:15px;cursor:pointer;font-family:inherit;border:2px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);display:flex;flex-direction:column;align-items:center;gap:5px;transition:all .2s}
  .rb.s{border-color:rgba(0,255,209,.6);background:rgba(0,255,209,.1)}
  .ld{width:20px;height:20px;border:3px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .8s linear infinite;display:inline-block}
  .err{color:#FF6B6B;font-size:12px;margin-top:7px;padding:8px 12px;background:rgba(255,107,107,.08);border-radius:9px;border:1px solid rgba(255,107,107,.2);display:block}
  .chip{display:flex;align-items:center;justify-content:space-between;padding:12px 15px;border-radius:13px;background:rgba(0,255,209,.06);border:1px solid rgba(0,255,209,.18);margin-bottom:14px;cursor:pointer;transition:all .2s}
  .chip:hover{background:rgba(0,255,209,.1)}
  .ns::-webkit-scrollbar{display:none}.ns{-ms-overflow-style:none;scrollbar-width:none}
  .pending-card{background:rgba(255,179,71,.07);border:1px solid rgba(255,179,71,.25);border-radius:16px;padding:20px;text-align:center;margin-bottom:16px}
`;

type Step = "mobile"|"otp"|"password"|"role"|"setpwd"|"pending";

export default function Login() {
  const [step, setStep]         = useState<Step>("mobile");
  const [mobile, setMobile]     = useState("");
  const [otp, setOtp]           = useState(["","","","","",""]);
  const [role, setRole]         = useState<"patient"|"doctor"|"">("");
  const [name, setName]         = useState("");
  const [pwd, setPwd]           = useState("");
  const [pwd2, setPwd2]         = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [err, setErr]           = useState("");
  const [resend, setResend]     = useState(0);
  const [savedMob, setSavedMob] = useState("");
  const refs = useRef<(HTMLInputElement|null)[]>([]);

  useEffect(() => {
    try {
      const sm = localStorage.getItem("dg_mobile") || "";
      const tk = localStorage.getItem("dg_token") || localStorage.getItem("digidoc_token") || "";
      const rl = localStorage.getItem("dg_role")  || localStorage.getItem("digidoc_role")  || "";
      if (sm) setSavedMob(sm);
      if (tk && rl) { redirect(rl); return; }
    } catch {}
  }, []);

  useEffect(() => {
    if (resend <= 0) return;
    const t = setTimeout(() => setResend(p=>p-1), 1000);
    return () => clearTimeout(t);
  }, [resend]);

  useEffect(() => {
    if (step === "otp") setTimeout(() => refs.current[0]?.focus(), 150);
  }, [step]);

  const redirect = (rl: string) => {
    window.location.href = rl==="doctor" ? "/doctor/dashboard" : rl==="admin" ? "/admin/dashboard" : "/dashboard";
  };

  const proceed = () => {
    const n = mobile.replace(/\D/g,"").slice(-10);
    if (n.length < 10) { setErr("Enter valid 10-digit number"); return; }
    setErr("");
    const existing = load(n);
    if (existing && hasPwd(n)) {
      setSavedMob(n);
      setStep("password");
    } else {
      doSendOtp(n);
    }
  };

  const useSaved = () => {
    if (hasPwd(savedMob)) setStep("password");
    else doSendOtp(savedMob);
  };

  const doSendOtp = async (num: string) => {
    const n = num.replace(/\D/g,"").slice(-10);
    setLoading(true); setErr("");
    try {
      let devOtp = "";
      try {
        const r = await fetch(`${API}/auth/send-otp`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mobile:n})});
        const d = await r.json();
        if (d.dev_otp) devOtp = String(d.dev_otp);
      } catch { devOtp = "123456"; }
      localStorage.setItem("dg_mobile", n);
      setSavedMob(n); setMobile(n);
      if (devOtp) setOtp(devOtp.split("").slice(0,6));
      setStep("otp"); setResend(30);
    } finally { setLoading(false); }
  };

  const loginWithPwd = () => {
    const n = (mobile || savedMob).replace(/\D/g,"").slice(-10);
    if (!checkPwd(n, pwd)) { setErr("Wrong password. Use OTP to reset."); return; }
    const u = load(n);
    if (!u) { setErr("User not found"); return; }
    localStorage.setItem("dg_token", "local_" + Date.now());
    localStorage.setItem("dg_role", u.role);
    localStorage.setItem("dg_user", JSON.stringify(u));
    redirect(u.role);
  };

  const doVerify = async (code: string) => {
    if (code.length < 6) return;
    setLoading(true); setErr("");
    try {
      let res: any = null;
      try {
        const r = await fetch(`${API}/auth/verify-otp`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mobile:mobile||savedMob,otp:code})});
        res = await r.json();
        if (!r.ok) throw new Error(res.message || "Invalid OTP");
      } catch(e: any) {
        if (e.message?.includes("OTP") || e.message?.includes("blocked")) throw e;
        const u = load(mobile||savedMob);
        if (u) { localStorage.setItem("dg_token","local_"+Date.now()); localStorage.setItem("dg_role",u.role); localStorage.setItem("dg_user",JSON.stringify(u)); redirect(u.role); return; }
        res = { isNew: true };
      }
      if (res.isNew) {
        setStep("role");
      } else {
        const u = res.user || {};
        save(mobile||savedMob, {...u, role:res.role});
        localStorage.setItem("dg_token", res.token||"t");
        localStorage.setItem("dg_role", res.role);
        localStorage.setItem("dg_user", JSON.stringify(u));
        redirect(res.role);
      }
    } catch(e: any) {
      setErr(e.message || "Invalid OTP");
      setOtp(["","","","","",""]);
      setTimeout(() => refs.current[0]?.focus(), 50);
    } finally { setLoading(false); }
  };

  const doRegister = async () => {
    if (!role) { setErr("Select your role"); return; }
    if (!name.trim()) { setErr("Enter your full name"); return; }
    setLoading(true); setErr("");
    try {
      let res: any = null;
      try {
        const r = await fetch(`${API}/auth/complete-registration`, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mobile:mobile||savedMob,role,name})});
        res = await r.json();
        if (!r.ok) throw new Error(res.message);
      } catch(e: any) {
        if (e.message && !e.message.includes("fetch")) throw e;
        res = { token:"local_"+Date.now(), role, user:{id:"u_"+Date.now(), name, mobile:mobile||savedMob, role} };
      }
      const u = res.user || {id:"u_"+Date.now(), name, mobile:mobile||savedMob, role};
      save(mobile||savedMob, {...u, role});
      localStorage.setItem("dg_token", res.token||"t");
      localStorage.setItem("dg_role", role);
      localStorage.setItem("dg_user", JSON.stringify(u));
      setStep("setpwd");
    } catch(e: any) { setErr(e.message); }
    finally { setLoading(false); }
  };

  const doSetPwd = () => {
    if (pwd.length < 6) { setErr("Password must be at least 6 characters"); return; }
    if (pwd !== pwd2)   { setErr("Passwords do not match"); return; }
    savePwd(mobile||savedMob, pwd);
    const rl = localStorage.getItem("dg_role") || role;
    if (rl === "doctor") setStep("pending");
    else redirect(rl);
  };

  const skipPwd = () => {
    const rl = localStorage.getItem("dg_role") || role;
    if (rl === "doctor") setStep("pending");
    else redirect(rl);
  };

  const ho = (i: number, v: string) => {
    const d = v.replace(/\D/g,"").slice(-1);
    const n = [...otp]; n[i]=d; setOtp(n); setErr("");
    if (d && i < 5) refs.current[i+1]?.focus();
    if (d && i === 5) doVerify(n.join(""));
  };
  const hk = (i: number, e: React.KeyboardEvent) => {
    if (e.key==="Backspace"&&!otp[i]&&i>0) { const n=[...otp];n[i-1]="";setOtp(n);refs.current[i-1]?.focus(); }
    if (e.key==="Enter") doVerify(otp.join(""));
  };
  const hp = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const p = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    if (p.length===6) { setOtp(p.split("")); doVerify(p); }
  };

  return (
    <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#E8F4FF"}}>
      <style>{S}</style>
      <div className="ns" style={{flex:1,overflowY:"auto",padding:"28px 22px",display:"flex",flexDirection:"column",justifyContent:"center"}}>

        {step !== "pending" && (
          <div style={{textAlign:"center",marginBottom:24,animation:"fu .5s ease"}}>
            <div style={{width:68,height:68,borderRadius:20,background:"linear-gradient(135deg,rgba(0,201,167,.2),rgba(11,111,204,.2))",border:"1.5px solid rgba(0,255,209,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 12px",animation:"fy 4s ease-in-out infinite"}}>
              {step==="setpwd"?"🔑":step==="role"?"👋":step==="otp"?"🔐":step==="password"?"🔒":"💊"}
            </div>
            <h1 style={{fontSize:24,fontWeight:900,marginBottom:4}}><span className="sh">DigiDoc</span></h1>
            <p style={{color:"rgba(232,244,255,.4)",fontSize:12}}>
              {step==="mobile"?"Doctor Anywhere, Anytime":step==="password"?"Welcome back!":step==="otp"?"Enter your OTP":step==="role"?"Almost there!":"Create a password"}
            </p>
          </div>
        )}

        {/* MOBILE */}
        {step === "mobile" && (
          <div style={{animation:"fu .4s ease"}}>
            {savedMob && (
              <div className="chip" onClick={useSaved}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:18}}>📱</span>
                  <div>
                    <p style={{color:"rgba(232,244,255,.4)",fontSize:10}}>Last used</p>
                    <p style={{fontWeight:700,fontSize:14,color:"#E8F4FF"}}>+91 {savedMob}</p>
                  </div>
                </div>
                <span style={{color:"#00FFD1",fontSize:12,fontWeight:700}}>Continue →</span>
              </div>
            )}
            <label style={{display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,.4)",textTransform:"uppercase",letterSpacing:1.4,marginBottom:8}}>Mobile Number</label>
            <div style={{position:"relative",marginBottom:6}}>
              <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"rgba(232,244,255,.5)",fontSize:13,fontWeight:600}}>+91</span>
              <input className="inp" style={{paddingLeft:48}} type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit mobile number"
                value={mobile} onChange={e=>{setMobile(e.target.value.replace(/\D/g,""));setErr("");}} onKeyDown={e=>e.key==="Enter"&&proceed()} autoFocus={!savedMob}/>
            </div>
            {err && <span className="err">{err}</span>}
            <button className="btn" style={{marginTop:16}} onClick={proceed} disabled={loading||mobile.length<10}>
              {loading ? <span className="ld"/> : "Continue →"}
            </button>
            <p style={{color:"rgba(232,244,255,.2)",fontSize:11,textAlign:"center",marginTop:14}}>🔒 OTP verification · No spam · Secure</p>
          </div>
        )}

        {/* PASSWORD */}
        {step === "password" && (
          <div style={{animation:"fu .4s ease"}}>
            <p style={{textAlign:"center",color:"rgba(232,244,255,.5)",fontSize:13,marginBottom:20,lineHeight:1.7}}>
              Welcome back!<br/><strong style={{color:"#E8F4FF"}}>+91 {mobile||savedMob}</strong><br/>
              <button onClick={()=>{setStep("mobile");setPwd("");setErr("");}} style={{background:"none",border:"none",color:"#4DB8FF",fontSize:12,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>← Change number</button>
            </p>
            <label style={{display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,.4)",textTransform:"uppercase",letterSpacing:1.4,marginBottom:8}}>Password</label>
            <div style={{position:"relative",marginBottom:6}}>
              <input className="inp" type={showPwd?"text":"password"} placeholder="Enter your password" value={pwd} style={{paddingRight:44}}
                onChange={e=>{setPwd(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&loginWithPwd()} autoFocus/>
              <button onClick={()=>setShowPwd(p=>!p)} style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16,opacity:.6}}>{showPwd?"🙈":"👁️"}</button>
            </div>
            {err && <span className="err">{err}</span>}
            <button className="btn" style={{marginTop:14}} onClick={loginWithPwd} disabled={!pwd.trim()}>🔓 Login</button>
            <button className="btn2" onClick={()=>doSendOtp(mobile||savedMob)}>Use OTP instead</button>
          </div>
        )}

        {/* OTP */}
        {step === "otp" && (
          <div style={{animation:"fu .4s ease"}}>
            <p style={{textAlign:"center",color:"rgba(232,244,255,.5)",fontSize:13,marginBottom:18,lineHeight:1.7}}>
              OTP sent to <strong style={{color:"#E8F4FF"}}>+91 {mobile||savedMob}</strong><br/>
              <button onClick={()=>{setStep("mobile");setOtp(["","","","","",""]);setErr("");}} style={{background:"none",border:"none",color:"#4DB8FF",fontSize:12,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>← Change number</button>
            </p>
            <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:12}} onPaste={hp}>
              {otp.map((d,i) => (
                <input key={i} ref={el=>{refs.current[i]=el;}} className={"ob"+(d?" f":"")} type="tel" inputMode="numeric" maxLength={1} value={d}
                  onChange={e=>ho(i,e.target.value)} onKeyDown={e=>hk(i,e)} onClick={e=>(e.target as HTMLInputElement).select()} autoComplete="one-time-code" disabled={loading}/>
              ))}
            </div>
            {loading && <div style={{textAlign:"center",padding:"10px 0"}}><span className="ld" style={{display:"inline-block"}}/><p style={{color:"rgba(232,244,255,.4)",fontSize:12,marginTop:6}}>Verifying...</p></div>}
            {err && <span className="err" style={{display:"block",textAlign:"center"}}>{err}</span>}
            {!loading && <button className="btn" onClick={()=>doVerify(otp.join(""))} disabled={otp.join("").length<6}>Verify OTP ✓</button>}
            <div style={{textAlign:"center",marginTop:12}}>
              {resend>0 ? <p style={{color:"rgba(232,244,255,.3)",fontSize:12}}>Resend in <strong style={{color:"#E8F4FF"}}>{resend}s</strong></p>
              : <button onClick={()=>{setOtp(["","","","","",""]);doSendOtp(mobile||savedMob);}} style={{background:"none",border:"none",color:"#00FFD1",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🔄 Resend OTP</button>}
            </div>
          </div>
        )}

        {/* ROLE */}
        {step === "role" && (
          <div style={{animation:"fu .4s ease"}}>
            <p style={{textAlign:"center",color:"rgba(232,244,255,.5)",fontSize:13,marginBottom:18,lineHeight:1.7}}>
              🎉 Welcome to DigiDoc!<br/><span style={{fontSize:11,color:"rgba(232,244,255,.3)"}}>First time? Tell us who you are</span>
            </p>
            <div style={{display:"flex",gap:10,marginBottom:16}}>
              {(["patient","doctor"] as const).map(r => (
                <button key={r} className={"rb"+(role===r?" s":"")} onClick={()=>setRole(r)}>
                  <span style={{fontSize:30}}>{r==="patient"?"🧑‍💼":"👨‍⚕️"}</span>
                  <p style={{fontWeight:700,fontSize:13,color:role===r?"#00FFD1":"#E8F4FF"}}>{r==="patient"?"I am a Patient":"I am a Doctor"}</p>
                  <p style={{color:"rgba(232,244,255,.4)",fontSize:10,lineHeight:1.5,textAlign:"center"}}>{r==="patient"?"Book doctors & get prescriptions":"Consult patients online & earn"}</p>
                  {role===r&&<span style={{color:"#00FFD1",fontSize:14}}>✓ Selected</span>}
                </button>
              ))}
            </div>
            <div style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,.4)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:7}}>Full Name *</label>
              <input className="inp" placeholder={role==="doctor"?"Dr. Full Name":"Your Full Name"} value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doRegister()} autoFocus/>
            </div>
            {err && <span className="err">{err}</span>}
            <button className="btn" onClick={doRegister} disabled={loading||!role||!name.trim()}>
              {loading ? <span className="ld"/> : "Continue →"}
            </button>
          </div>
        )}

        {/* SET PASSWORD */}
        {step === "setpwd" && (
          <div style={{animation:"fu .4s ease"}}>
            <p style={{textAlign:"center",color:"rgba(232,244,255,.5)",fontSize:13,marginBottom:20,lineHeight:1.7}}>
              Set a password for quick login<br/><span style={{fontSize:11,color:"rgba(232,244,255,.3)"}}>Next time no OTP needed!</span>
            </p>
            <div style={{marginBottom:12}}>
              <label style={{display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,.4)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:7}}>New Password (min 6)</label>
              <div style={{position:"relative"}}>
                <input className="inp" type={showPwd?"text":"password"} placeholder="Create a strong password" value={pwd} style={{paddingRight:44}}
                  onChange={e=>{setPwd(e.target.value);setErr("");}} autoFocus/>
                <button onClick={()=>setShowPwd(p=>!p)} style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16,opacity:.6}}>{showPwd?"🙈":"👁️"}</button>
              </div>
            </div>
            <div style={{marginBottom:8}}>
              <label style={{display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,.4)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:7}}>Confirm Password</label>
              <input className="inp" type="password" placeholder="Re-enter password" value={pwd2} onChange={e=>{setPwd2(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&doSetPwd()}/>
            </div>
            {err && <span className="err">{err}</span>}
            <button className="btn" style={{marginTop:14}} onClick={doSetPwd} disabled={!pwd.trim()||!pwd2.trim()}>🔒 Set Password & Continue</button>
            <button className="btn2" onClick={skipPwd}>Skip for now</button>
          </div>
        )}

        {/* PENDING APPROVAL */}
        {step === "pending" && (
          <div style={{animation:"fu .4s ease",textAlign:"center"}}>
            <div style={{fontSize:56,marginBottom:16,animation:"fy 3s ease-in-out infinite"}}>⏳</div>
            <h2 style={{fontSize:22,fontWeight:900,marginBottom:8}}>Registration Submitted!</h2>
            <div className="pending-card">
              <p style={{color:"#FFB347",fontWeight:700,fontSize:14,marginBottom:8}}>Pending Admin Approval</p>
              <p style={{color:"rgba(232,244,255,.55)",fontSize:13,lineHeight:1.8}}>
                Your doctor account is under review.<br/>
                You'll be notified once approved.<br/>
                <strong style={{color:"#E8F4FF"}}>Usually within 24 hours.</strong>
              </p>
            </div>
            {[{l:"Mobile",v:`+91 ${mobile||savedMob}`},{l:"Name",v:name||"—"},{l:"Role",v:"Doctor"},{l:"Status",v:"⏳ Pending Approval"}].map(r=>(
              <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"9px 14px",borderRadius:11,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",marginBottom:8}}>
                <span style={{color:"rgba(232,244,255,.45)",fontSize:12}}>{r.l}</span>
                <span style={{color:"#E8F4FF",fontWeight:600,fontSize:12}}>{r.v}</span>
              </div>
            ))}
            <button className="btn" style={{marginTop:16}} onClick={()=>window.location.href="/"}>🏠 Go to Home</button>
          </div>
        )}
      </div>
    </div>
  );
}
