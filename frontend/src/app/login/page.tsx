"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Default passwords — not shown anywhere on UI
const DEFAULT_PASS = { patient: "123456", doctor: "654321" };

const S = `
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes pop{0%{transform:scale(0.85)}60%{transform:scale(1.1)}100%{transform:scale(1)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .inp{width:100%;padding:13px 16px;border-radius:13px;font-family:inherit;font-size:14px;outline:none;transition:all 0.3s;background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,255,255,0.1);color:#E8F4FF;}
  .inp::placeholder{color:rgba(232,244,255,0.3);}
  .inp:focus{border-color:rgba(0,255,209,0.5);background:rgba(0,255,209,0.04);}
  .otp-box{width:44px;height:52px;border-radius:12px;text-align:center;font-family:inherit;font-size:22px;font-weight:900;outline:none;transition:all 0.2s;background:rgba(255,255,255,0.04);border:2px solid rgba(255,255,255,0.1);color:#E8F4FF;}
  .otp-box:focus{border-color:rgba(0,255,209,0.7);background:rgba(0,255,209,0.07);transform:scale(1.05);}
  .otp-box.filled{border-color:rgba(0,255,209,0.5);background:rgba(0,255,209,0.08);animation:pop 0.2s ease;}
  .bm{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;padding:15px;border-radius:14px;font-family:inherit;font-weight:800;font-size:14px;color:white;border:none;cursor:pointer;background:linear-gradient(135deg,#00C9A7,#0B6FCC);}
  .bm:disabled{opacity:0.5;cursor:not-allowed;}
  .role-btn{flex:1;padding:15px 10px;border-radius:15px;cursor:pointer;font-family:inherit;transition:all 0.2s;border:2px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);display:flex;flex-direction:column;align-items:center;gap:5px;}
  .role-btn.sel{border-color:rgba(0,255,209,0.6);background:rgba(0,255,209,0.1);}
  .loader{width:20px;height:20px;border:3px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block;}
  .noscroll::-webkit-scrollbar{display:none;}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none;}
  .err{color:#FF6B6B;font-size:12px;margin-top:6px;padding:8px 12px;background:rgba(255,107,107,0.08);border-radius:9px;border:1px solid rgba(255,107,107,0.2);}
`;

type Step = "mobile"|"password"|"otp"|"role";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep]       = useState<Step>("mobile");
  const [mobile, setMobile]   = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp]         = useState(["","","","","",""]);
  const [role, setRole]       = useState<"patient"|"doctor"|"">("");
  const [name, setName]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [resend, setResend]   = useState(0);
  const [savedMob, setSavedMob] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const otpRefs = useRef<(HTMLInputElement|null)[]>([]);

  useEffect(()=>{
    try{
      const sm = localStorage.getItem("digidoc_mobile")||"";
      const tk = localStorage.getItem("digidoc_token")||"";
      const rl = localStorage.getItem("digidoc_role")||"";
      if(sm) setSavedMob(sm);
      if(tk && rl){
        redirect(rl);
        return;
      }
      // Check if this mobile is registered
      if(sm){
        const reg = localStorage.getItem("digidoc_reg_"+sm);
        if(reg) setIsRegistered(true);
      }
    }catch{}
  },[]);

  useEffect(()=>{
    if(resend<=0) return;
    const t = setTimeout(()=>setResend(p=>p-1),1000);
    return ()=>clearTimeout(t);
  },[resend]);

  useEffect(()=>{
    if(step==="otp") setTimeout(()=>otpRefs.current[0]?.focus(),150);
  },[step]);

  const redirect = (rl:string) => {
    if(rl==="doctor") window.location.href="/doctor/dashboard";
    else if(rl==="admin") window.location.href="/admin/dashboard";
    else window.location.href="/dashboard";
  };

  // Check if mobile is already registered
  const checkMobile = () => {
    const clean = mobile.replace(/\D/g,"").slice(-10);
    if(clean.length<10){ setError("Enter valid 10-digit number"); return; }
    setError("");
    const reg = localStorage.getItem("digidoc_reg_"+clean);
    if(reg){
      // Already registered — ask for password
      setSavedMob(clean);
      setIsRegistered(true);
      setStep("password");
    } else {
      // New user — send OTP
      sendOtp(clean);
    }
  };

  const useSavedMobile = () => {
    const reg = localStorage.getItem("digidoc_reg_"+savedMob);
    if(reg){
      setIsRegistered(true);
      setStep("password");
    } else {
      sendOtp(savedMob);
    }
  };

  // Password login — no OTP needed
  const loginWithPassword = () => {
    const clean = (mobile||savedMob).replace(/\D/g,"").slice(-10);
    const reg = localStorage.getItem("digidoc_reg_"+clean);
    if(!reg){ setError("Number not registered. Use OTP."); return; }
    const userData = JSON.parse(reg);
    const expectedPass = userData.role==="doctor" ? DEFAULT_PASS.doctor : DEFAULT_PASS.patient;
    if(password !== expectedPass){ setError("Wrong password. Try again."); return; }
    // Login success
    localStorage.setItem("digidoc_token","dev_token_"+clean);
    localStorage.setItem("digidoc_role",userData.role);
    localStorage.setItem("digidoc_user",JSON.stringify(userData));
    localStorage.setItem("digidoc_mobile",clean);
    redirect(userData.role);
  };

  const sendOtp = async(num:string) => {
    const clean = num.replace(/\D/g,"").slice(-10);
    if(clean.length<10){ setError("Enter valid 10-digit number"); return; }
    setLoading(true); setError("");
    try{
      let devOtp = "123456";
      try{
        const r = await fetch(`${API}/auth/send-otp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mobile:clean})});
        const d = await r.json();
        if(d.dev_otp) devOtp = String(d.dev_otp);
      }catch{}
      localStorage.setItem("digidoc_mobile",clean);
      setSavedMob(clean); setMobile(clean);
      setOtp(devOtp.split("").slice(0,6));
      setStep("otp"); setResend(30);
    }finally{ setLoading(false); }
  };

  const verify = async(code:string) => {
    if(code.length<6) return;
    setLoading(true); setError("");
    try{
      let res:any = null;
      try{
        const r = await fetch(`${API}/auth/verify-otp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mobile:mobile||savedMob,otp:code})});
        res = await r.json();
        if(!r.ok) throw new Error(res.message||"Invalid OTP");
      }catch(e:any){
        if(e.message==="Invalid OTP") throw e;
        res = {isNew:true};
      }
      if(res.isNew){
        setStep("role");
      } else {
        const userData = res.user||{};
        localStorage.setItem("digidoc_token",res.token||"dev_token");
        localStorage.setItem("digidoc_role",res.role);
        localStorage.setItem("digidoc_user",JSON.stringify(userData));
        localStorage.setItem("digidoc_reg_"+(mobile||savedMob),JSON.stringify({...userData,role:res.role}));
        redirect(res.role);
      }
    }catch(e:any){
      setError(e.message||"Invalid OTP");
      setOtp(["","","","","",""]);
      setTimeout(()=>otpRefs.current[0]?.focus(),50);
    }finally{ setLoading(false); }
  };

  const register = async() => {
    if(!role){ setError("Select your role"); return; }
    if(!name.trim()){ setError("Enter your name"); return; }
    setLoading(true); setError("");
    try{
      let res:any = null;
      try{
        const r = await fetch(`${API}/auth/complete-registration`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mobile:mobile||savedMob,role,name})});
        res = await r.json();
      }catch{
        res = {token:"dev_token",role,user:{id:Date.now().toString(),name,mobile:mobile||savedMob,role}};
      }
      const userData = res.user||{id:Date.now().toString(),name,mobile:mobile||savedMob,role};
      localStorage.setItem("digidoc_token",res.token||"dev_token");
      localStorage.setItem("digidoc_role",role);
      localStorage.setItem("digidoc_user",JSON.stringify(userData));
      localStorage.setItem("digidoc_reg_"+(mobile||savedMob),JSON.stringify({...userData,role}));
      localStorage.setItem("digidoc_mobile",mobile||savedMob);
      redirect(role);
    }catch(e:any){ setError(e.message); }
    finally{ setLoading(false); }
  };

  const handleOtp=(i:number,val:string)=>{
    const d=val.replace(/\D/g,"").slice(-1);
    const n=[...otp];n[i]=d;setOtp(n);setError("");
    if(d&&i<5) otpRefs.current[i+1]?.focus();
    if(d&&i===5) verify(n.join(""));
  };
  const handleKey=(i:number,e:React.KeyboardEvent)=>{
    if(e.key==="Backspace"&&!otp[i]&&i>0){const n=[...otp];n[i-1]="";setOtp(n);otpRefs.current[i-1]?.focus();}
    if(e.key==="Enter") verify(otp.join(""));
  };
  const handlePaste=(e:React.ClipboardEvent)=>{
    e.preventDefault();
    const p=e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    if(p.length===6){setOtp(p.split(""));verify(p);}
  };

  return(
    <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#E8F4FF"}}>
      <style>{S}</style>
      <div style={{flex:1,overflowY:"auto",padding:"28px 22px",display:"flex",flexDirection:"column",justifyContent:"center"}} className="noscroll">

        {/* LOGO */}
        <div style={{textAlign:"center",marginBottom:24,animation:"fadeUp 0.5s ease"}}>
          <div style={{width:68,height:68,borderRadius:20,background:"linear-gradient(135deg,rgba(0,201,167,0.2),rgba(11,111,204,0.2))",border:"1.5px solid rgba(0,255,209,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 12px",animation:"floatY 4s ease-in-out infinite"}}>
            {step==="role"?"👋":step==="otp"?"🔐":step==="password"?"🔑":"💊"}
          </div>
          <h1 style={{fontSize:24,fontWeight:900,marginBottom:4}}><span className="shine">DigiDoc</span></h1>
          <p style={{color:"rgba(232,244,255,0.4)",fontSize:12}}>
            {step==="mobile"?"Doctor Anywhere, Anytime":step==="password"?"Welcome back! Enter password":step==="otp"?"Enter the OTP":"One last step!"}
          </p>
        </div>

        {/* STEP 1: MOBILE */}
        {step==="mobile"&&(
          <div style={{animation:"fadeUp 0.4s ease"}}>
            {savedMob&&(
              <div onClick={useSavedMobile} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 15px",borderRadius:13,background:"rgba(0,255,209,0.06)",border:"1px solid rgba(0,255,209,0.18)",marginBottom:14,cursor:"pointer"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:18}}>📱</span>
                  <div>
                    <p style={{color:"rgba(232,244,255,0.4)",fontSize:10}}>Last used</p>
                    <p style={{fontWeight:700,fontSize:14,color:"#E8F4FF"}}>+91 {savedMob}</p>
                  </div>
                </div>
                <span style={{color:"#00FFD1",fontSize:12,fontWeight:700}}>{isRegistered?"Login →":"Continue →"}</span>
              </div>
            )}
            <label style={{display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.4)",textTransform:"uppercase",letterSpacing:1.4,marginBottom:8}}>Mobile Number</label>
            <div style={{position:"relative",marginBottom:6}}>
              <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"rgba(232,244,255,0.5)",fontSize:13,fontWeight:600}}>+91</span>
              <input className="inp" style={{paddingLeft:48}} type="tel" inputMode="numeric" maxLength={10}
                placeholder="10-digit mobile" value={mobile}
                onChange={e=>{setMobile(e.target.value.replace(/\D/g,""));setError("");}}
                onKeyDown={e=>e.key==="Enter"&&checkMobile()} autoFocus={!savedMob}/>
            </div>
            {error&&<p className="err">{error}</p>}
            <button className="bm" style={{marginTop:14}} onClick={checkMobile} disabled={loading||mobile.length<10}>
              {loading?<span className="loader"/>:"Continue →"}
            </button>
            <p style={{color:"rgba(232,244,255,0.22)",fontSize:11,textAlign:"center",marginTop:14}}>🔒 Secure login · No spam</p>
          </div>
        )}

        {/* STEP 2: PASSWORD (returning users) */}
        {step==="password"&&(
          <div style={{animation:"fadeUp 0.4s ease"}}>
            <p style={{textAlign:"center",color:"rgba(232,244,255,0.5)",fontSize:13,marginBottom:20,lineHeight:1.7}}>
              Logging in as <strong style={{color:"#E8F4FF"}}>+91 {mobile||savedMob}</strong><br/>
              <button onClick={()=>{setStep("mobile");setPassword("");setError("");}} style={{background:"none",border:"none",color:"#4DB8FF",fontSize:12,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>← Change number</button>
            </p>
            <label style={{display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.4)",textTransform:"uppercase",letterSpacing:1.4,marginBottom:8}}>Password</label>
            <div style={{position:"relative",marginBottom:6}}>
              <input className="inp" type={showPass?"text":"password"} placeholder="Enter your password"
                value={password} style={{paddingRight:44}}
                onChange={e=>{setPassword(e.target.value);setError("");}}
                onKeyDown={e=>e.key==="Enter"&&loginWithPassword()} autoFocus/>
              <button onClick={()=>setShowPass(p=>!p)} style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16,opacity:0.6}}>
                {showPass?"🙈":"👁️"}
              </button>
            </div>
            {error&&<p className="err">{error}</p>}
            <button className="bm" style={{marginTop:14}} onClick={loginWithPassword} disabled={!password}>
              🔓 Login
            </button>
            {/* Forgot password — use OTP */}
            <button onClick={()=>sendOtp(mobile||savedMob)} style={{width:"100%",marginTop:12,padding:"12px",borderRadius:13,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(232,244,255,0.5)",fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
              Use OTP instead
            </button>
          </div>
        )}

        {/* STEP 3: OTP */}
        {step==="otp"&&(
          <div style={{animation:"fadeUp 0.4s ease"}}>
            <p style={{textAlign:"center",color:"rgba(232,244,255,0.5)",fontSize:13,marginBottom:18,lineHeight:1.7}}>
              OTP sent to <strong style={{color:"#E8F4FF"}}>+91 {mobile||savedMob}</strong><br/>
              <button onClick={()=>{setStep("mobile");setOtp(["","","","","",""]);setError("");}} style={{background:"none",border:"none",color:"#4DB8FF",fontSize:12,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>← Change number</button>
            </p>
            <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:10}} onPaste={handlePaste}>
              {otp.map((d,i)=>(
                <input key={i} ref={el=>{otpRefs.current[i]=el;}} className={"otp-box"+(d?" filled":"")}
                  type="tel" inputMode="numeric" maxLength={1} value={d}
                  onChange={e=>handleOtp(i,e.target.value)} onKeyDown={e=>handleKey(i,e)}
                  onClick={e=>(e.target as HTMLInputElement).select()} autoComplete="one-time-code" disabled={loading}/>
              ))}
            </div>
            {loading&&<div style={{textAlign:"center",padding:"10px 0"}}><span className="loader" style={{display:"inline-block"}}/><p style={{color:"rgba(232,244,255,0.4)",fontSize:12,marginTop:6}}>Verifying...</p></div>}
            {error&&<p className="err" style={{textAlign:"center"}}>{error}</p>}
            {!loading&&<button className="bm" style={{marginTop:12}} onClick={()=>verify(otp.join(""))} disabled={otp.join("").length<6}>Verify OTP ✓</button>}
            <div style={{textAlign:"center",marginTop:12}}>
              {resend>0?<p style={{color:"rgba(232,244,255,0.3)",fontSize:12}}>Resend in <strong style={{color:"#E8F4FF"}}>{resend}s</strong></p>
              :<button onClick={()=>{setOtp(["","","","","",""]);sendOtp(mobile||savedMob);}} style={{background:"none",border:"none",color:"#00FFD1",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🔄 Resend OTP</button>}
            </div>
          </div>
        )}

        {/* STEP 4: ROLE (new users only) */}
        {step==="role"&&(
          <div style={{animation:"fadeUp 0.4s ease"}}>
            <p style={{textAlign:"center",color:"rgba(232,244,255,0.5)",fontSize:13,marginBottom:18,lineHeight:1.7}}>
              🎉 Welcome!<br/><span style={{fontSize:11,color:"rgba(232,244,255,0.3)"}}>First time? Tell us who you are</span>
            </p>
            <div style={{display:"flex",gap:10,marginBottom:16}}>
              {([["patient","🧑‍💼","Patient","Book doctors & get prescriptions"],["doctor","👨‍⚕️","Doctor","Consult patients & earn"]] as const).map(([r,icon,title,sub])=>(
                <button key={r} className={"role-btn"+(role===r?" sel":"")} onClick={()=>setRole(r)}>
                  <span style={{fontSize:28}}>{icon}</span>
                  <p style={{fontWeight:700,fontSize:13,color:role===r?"#00FFD1":"#E8F4FF"}}>{title}</p>
                  <p style={{color:"rgba(232,244,255,0.4)",fontSize:10,lineHeight:1.5,textAlign:"center"}}>{sub}</p>
                  {role===r&&<span style={{color:"#00FFD1",fontSize:14}}>✓</span>}
                </button>
              ))}
            </div>
            <div style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.4)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:7}}>Full Name *</label>
              <input className="inp" style={{letterSpacing:0}} placeholder="e.g. Dr. Priya Sharma"
                value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&register()} autoFocus/>
            </div>
            {error&&<p className="err">{error}</p>}
            <button className="bm" onClick={register} disabled={loading||!role||!name.trim()}>
              {loading?<span className="loader"/>:"Start Using DigiDoc 🚀"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
