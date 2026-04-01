"use client";
import { useState, useRef, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const S = `
  *{box-sizing:border-box;margin:0;padding:0}html,body{height:100%;overflow:hidden}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes sh{0%{background-position:-200% center}to{background-position:200% center}}
  @keyframes fy{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes pop{0%{transform:scale(.85)}60%{transform:scale(1.1)}to{transform:scale(1)}}
  .sh{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:sh 3s linear infinite}
  .inp{width:100%;padding:13px 16px;border-radius:13px;font-family:inherit;font-size:14px;outline:none;background:rgba(255,255,255,.05);border:1.5px solid rgba(255,255,255,.1);color:#E8F4FF;transition:all .3s}
  .inp::placeholder{color:rgba(232,244,255,.3)}.inp:focus{border-color:rgba(0,255,209,.5);background:rgba(0,255,209,.04)}
  .ob{width:46px;height:54px;border-radius:12px;text-align:center;font-family:inherit;font-size:22px;font-weight:900;outline:none;background:rgba(255,255,255,.04);border:2px solid rgba(255,255,255,.1);color:#E8F4FF;transition:all .2s}
  .ob:focus{border-color:rgba(0,255,209,.7);background:rgba(0,255,209,.07);transform:scale(1.05)}.ob.f{border-color:rgba(0,255,209,.5);background:rgba(0,255,209,.08);animation:pop .2s ease}
  .btn{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;padding:15px;border-radius:14px;font-family:inherit;font-weight:800;font-size:14px;color:#fff;border:none;cursor:pointer;background:linear-gradient(135deg,#00C9A7,#0B6FCC);transition:all .3s}
  .btn:disabled{opacity:.5;cursor:not-allowed}
  .rb{flex:1;padding:16px 10px;border-radius:15px;cursor:pointer;font-family:inherit;border:2px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);display:flex;flex-direction:column;align-items:center;gap:5px;transition:all .2s}
  .rb.s{border-color:rgba(0,255,209,.6);background:rgba(0,255,209,.1)}
  .ld{width:20px;height:20px;border:3px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .8s linear infinite;display:inline-block}
  .ns::-webkit-scrollbar{display:none}.ns{-ms-overflow-style:none;scrollbar-width:none}
  .chip{display:flex;align-items:center;justify-content:space-between;padding:12px 15px;border-radius:13px;background:rgba(0,255,209,.06);border:1px solid rgba(0,255,209,.18);margin-bottom:14px;cursor:pointer}
`;

export default function Login(){
  const [step,setStep]=useState<"mobile"|"otp"|"role">("mobile");
  const [mob,setMob]=useState("");
  const [otp,setOtp]=useState(["","","","","",""]);
  const [role,setRole]=useState<"patient"|"doctor"|"">("");
  const [name,setName]=useState("");
  const [pwd,setPwd]=useState("");
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [resend,setResend]=useState(0);
  const [saved,setSaved]=useState("");
  const [hasPwd,setHasPwd]=useState(false);
  const [showPwd,setShowPwd]=useState(false);
  const refs=useRef<(HTMLInputElement|null)[]>([]);

  useEffect(()=>{
    try{
      const sm=localStorage.getItem("dg_mobile")||"";
      const tk=localStorage.getItem("dg_token")||"";
      const rl=localStorage.getItem("dg_role")||"";
      if(sm) setSaved(sm);
      if(tk&&rl){ go(rl); return; }
      if(sm&&localStorage.getItem("dg_pwd_"+sm)) setHasPwd(true);
    }catch{}
  },[]);

  useEffect(()=>{
    if(resend<=0)return;
    const t=setTimeout(()=>setResend(p=>p-1),1000);
    return()=>clearTimeout(t);
  },[resend]);

  useEffect(()=>{
    if(step==="otp") setTimeout(()=>refs.current[0]?.focus(),150);
  },[step]);

  const go=(rl:string)=>{ window.location.href=rl==="doctor"?"/doctor/dashboard":rl==="admin"?"/admin/dashboard":"/dashboard"; };

  const checkMob=()=>{
    const n=mob.replace(/\D/g,"").slice(-10);
    if(n.length<10){setErr("Enter valid 10-digit number");return;}
    setErr("");
    // Check if has saved password
    const sp=localStorage.getItem("dg_pwd_"+n);
    if(sp){ setSaved(n); setStep("otp"); sendOtp(n); } // go to OTP even if has pwd - but prefill
    else sendOtp(n);
  };

  const useSaved=()=>{
    const sp=localStorage.getItem("dg_pwd_"+saved);
    if(sp){ setHasPwd(true); setStep("otp"); sendOtp(saved); }
    else sendOtp(saved);
  };

  const sendOtp=async(num:string)=>{
    const n=num.replace(/\D/g,"").slice(-10);
    setLoading(true);setErr("");
    try{
      let dv="123456";
      try{
        const r=await fetch(`${API}/auth/send-otp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mobile:n})});
        const d=await r.json();
        if(d.dev_otp) dv=String(d.dev_otp);
      }catch{}
      localStorage.setItem("dg_mobile",n);
      setSaved(n); setMob(n);
      setOtp(dv.split("").slice(0,6));
      setStep("otp"); setResend(30);
    }finally{setLoading(false);}
  };

  const verify=async(code:string)=>{
    if(code.length<6)return;
    setLoading(true);setErr("");
    try{
      let res:any=null;
      try{
        const r=await fetch(`${API}/auth/verify-otp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mobile:mob||saved,otp:code})});
        res=await r.json();
        if(!r.ok) throw new Error(res.message||"Invalid OTP");
      }catch(e:any){
        if(e.message==="Invalid OTP") throw e;
        // Offline - check local
        const lc=localStorage.getItem("dg_user_"+(mob||saved));
        if(lc){
          const u=JSON.parse(lc);
          localStorage.setItem("dg_token","local_"+Date.now());
          localStorage.setItem("dg_role",u.role);
          localStorage.setItem("dg_user",JSON.stringify(u));
          go(u.role); return;
        }
        res={isNew:true};
      }
      if(res.isNew){ setStep("role"); }
      else{
        const u=res.user||{};
        localStorage.setItem("dg_token",res.token||"t");
        localStorage.setItem("dg_role",res.role);
        localStorage.setItem("dg_user",JSON.stringify(u));
        localStorage.setItem("dg_user_"+(mob||saved),JSON.stringify({...u,role:res.role}));
        localStorage.setItem("dg_mobile",mob||saved);
        go(res.role);
      }
    }catch(e:any){
      setErr(e.message||"Invalid OTP");
      setOtp(["","","","","",""]);
      setTimeout(()=>refs.current[0]?.focus(),50);
    }finally{setLoading(false);}
  };

  const reg=async()=>{
    if(!role){setErr("Select your role");return;}
    if(!name.trim()){setErr("Enter your name");return;}
    setLoading(true);setErr("");
    try{
      let res:any=null;
      try{
        const r=await fetch(`${API}/auth/complete-registration`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mobile:mob||saved,role,name})});
        res=await r.json();
      }catch{
        res={token:"local_"+Date.now(),role,user:{id:"u_"+Date.now(),name,mobile:mob||saved,role}};
      }
      const u=res.user||{id:"u_"+Date.now(),name,mobile:mob||saved,role};
      localStorage.setItem("dg_token",res.token||"t");
      localStorage.setItem("dg_role",role);
      localStorage.setItem("dg_user",JSON.stringify(u));
      localStorage.setItem("dg_user_"+(mob||saved),JSON.stringify({...u,role}));
      localStorage.setItem("dg_mobile",mob||saved);
      go(role);
    }catch(e:any){setErr(e.message);}
    finally{setLoading(false);}
  };

  const ho=(i:number,v:string)=>{
    const d=v.replace(/\D/g,"").slice(-1);
    const n=[...otp];n[i]=d;setOtp(n);setErr("");
    if(d&&i<5) refs.current[i+1]?.focus();
    if(d&&i===5) verify(n.join(""));
  };
  const hk=(i:number,e:React.KeyboardEvent)=>{
    if(e.key==="Backspace"&&!otp[i]&&i>0){const n=[...otp];n[i-1]="";setOtp(n);refs.current[i-1]?.focus();}
    if(e.key==="Enter") verify(otp.join(""));
  };
  const hp=(e:React.ClipboardEvent)=>{
    e.preventDefault();
    const p=e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    if(p.length===6){setOtp(p.split(""));verify(p);}
  };

  return(
    <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#E8F4FF"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');${S}`}</style>
      <div className="ns" style={{flex:1,overflowY:"auto",padding:"28px 22px",display:"flex",flexDirection:"column",justifyContent:"center"}}>

        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{width:68,height:68,borderRadius:20,background:"linear-gradient(135deg,rgba(0,201,167,.2),rgba(11,111,204,.2))",border:"1.5px solid rgba(0,255,209,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 12px",animation:"fy 4s ease-in-out infinite"}}>
            {step==="role"?"👋":step==="otp"?"🔐":"💊"}
          </div>
          <h1 style={{fontSize:24,fontWeight:900,marginBottom:4}}><span className="sh">DigiDoc</span></h1>
          <p style={{color:"rgba(232,244,255,.4)",fontSize:12}}>
            {step==="mobile"?"Doctor Anywhere, Anytime":step==="otp"?"Enter the 6-digit OTP":"Almost done!"}
          </p>
        </div>

        {step==="mobile"&&(
          <div>
            {saved&&(
              <div className="chip" onClick={useSaved}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:18}}>📱</span>
                  <div><p style={{color:"rgba(232,244,255,.4)",fontSize:10}}>Last used</p><p style={{fontWeight:700,fontSize:14,color:"#E8F4FF"}}>+91 {saved}</p></div>
                </div>
                <span style={{color:"#00FFD1",fontSize:12,fontWeight:700}}>Continue →</span>
              </div>
            )}
            <label style={{display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,.4)",textTransform:"uppercase",letterSpacing:1.4,marginBottom:8}}>Mobile Number</label>
            <div style={{position:"relative",marginBottom:6}}>
              <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",color:"rgba(232,244,255,.5)",fontSize:13,fontWeight:600}}>+91</span>
              <input className="inp" style={{paddingLeft:48}} type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit mobile"
                value={mob} onChange={e=>{setMob(e.target.value.replace(/\D/g,""));setErr("");}} onKeyDown={e=>e.key==="Enter"&&checkMob()} autoFocus={!saved}/>
            </div>
            {err&&<p style={{color:"#FF6B6B",fontSize:12,margin:"6px 0"}}>{err}</p>}
            <button className="btn" style={{marginTop:14}} onClick={checkMob} disabled={loading||mob.length<10}>
              {loading?<span className="ld"/>:"Get OTP →"}
            </button>
            <p style={{color:"rgba(232,244,255,.2)",fontSize:11,textAlign:"center",marginTop:14}}>🔒 OTP via SMS · Secure login</p>
          </div>
        )}

        {step==="otp"&&(
          <div>
            <p style={{textAlign:"center",color:"rgba(232,244,255,.5)",fontSize:13,marginBottom:18,lineHeight:1.7}}>
              OTP sent to <strong style={{color:"#E8F4FF"}}>+91 {mob||saved}</strong><br/>
              <button onClick={()=>{setStep("mobile");setOtp(["","","","","",""]);setErr("");}} style={{background:"none",border:"none",color:"#4DB8FF",fontSize:12,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>← Change</button>
            </p>
            <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:12}} onPaste={hp}>
              {otp.map((d,i)=>(
                <input key={i} ref={el=>{refs.current[i]=el;}} className={"ob"+(d?" f":"")}
                  type="tel" inputMode="numeric" maxLength={1} value={d}
                  onChange={e=>ho(i,e.target.value)} onKeyDown={e=>hk(i,e)}
                  onClick={e=>(e.target as HTMLInputElement).select()} autoComplete="one-time-code" disabled={loading}/>
              ))}
            </div>
            {loading&&<div style={{textAlign:"center",padding:"10px 0"}}><span className="ld" style={{display:"inline-block"}}/><p style={{color:"rgba(232,244,255,.4)",fontSize:12,marginTop:6}}>Verifying...</p></div>}
            {err&&<p style={{color:"#FF6B6B",fontSize:12,textAlign:"center",marginBottom:8}}>{err}</p>}
            {!loading&&<button className="btn" onClick={()=>verify(otp.join(""))} disabled={otp.join("").length<6}>Verify ✓</button>}
            <div style={{textAlign:"center",marginTop:12}}>
              {resend>0?<p style={{color:"rgba(232,244,255,.3)",fontSize:12}}>Resend in <strong style={{color:"#E8F4FF"}}>{resend}s</strong></p>
              :<button onClick={()=>{setOtp(["","","","","",""]);sendOtp(mob||saved);}} style={{background:"none",border:"none",color:"#00FFD1",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🔄 Resend OTP</button>}
            </div>
          </div>
        )}

        {step==="role"&&(
          <div>
            <p style={{textAlign:"center",color:"rgba(232,244,255,.5)",fontSize:13,marginBottom:18,lineHeight:1.7}}>
              🎉 Welcome!<br/><span style={{fontSize:11,color:"rgba(232,244,255,.3)"}}>Select your role to continue</span>
            </p>
            <div style={{display:"flex",gap:10,marginBottom:16}}>
              {([["patient","🧑‍💼","I am a Patient","Book doctors & prescriptions"],["doctor","👨‍⚕️","I am a Doctor","Consult & earn"]] as const).map(([r,ic,ti,su])=>(
                <button key={r} className={"rb"+(role===r?" s":"")} onClick={()=>setRole(r)}>
                  <span style={{fontSize:28}}>{ic}</span>
                  <p style={{fontWeight:700,fontSize:13,color:role===r?"#00FFD1":"#E8F4FF"}}>{ti}</p>
                  <p style={{color:"rgba(232,244,255,.4)",fontSize:10,lineHeight:1.5,textAlign:"center"}}>{su}</p>
                  {role===r&&<span style={{color:"#00FFD1",fontSize:14}}>✓</span>}
                </button>
              ))}
            </div>
            <div style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,.4)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:7}}>Full Name *</label>
              <input className="inp" placeholder={role==="doctor"?"Dr. Full Name":"Your Full Name"} value={name}
                onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&reg()} autoFocus/>
            </div>
            {err&&<p style={{color:"#FF6B6B",fontSize:12,marginBottom:8}}>{err}</p>}
            <button className="btn" onClick={reg} disabled={loading||!role||!name.trim()}>
              {loading?<span className="ld"/>:"Start Using DigiDoc 🚀"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
