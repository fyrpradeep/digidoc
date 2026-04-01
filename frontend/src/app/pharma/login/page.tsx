"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  .shine{background:linear-gradient(90deg,#A78BFA,#4DB8FF,#A78BFA);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .inp{width:100%;padding:13px 16px;border-radius:13px;font-family:inherit;font-size:14px;outline:none;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.09);color:#E8F4FF;transition:all 0.3s}
  .inp::placeholder{color:rgba(232,244,255,0.28)}
  .inp:focus{border-color:rgba(167,139,250,0.5);box-shadow:0 0 0 3px rgba(167,139,250,0.08)}
  .bm{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:15px;border-radius:13px;font-family:inherit;font-weight:800;font-size:14px;color:white;border:none;cursor:pointer;transition:all 0.3s;background:linear-gradient(135deg,#A78BFA,#4DB8FF)}
  .bm:hover{transform:translateY(-2px);filter:brightness(1.1)}
  .bm:disabled{opacity:0.5;cursor:not-allowed;transform:none}
  .loader{width:20px;height:20px;border:3px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite}
`;

export default function PharmaLogin() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const login = () => {
    if (email === "pharma@digidoc.com" && password === "Pharma@2026") {
      setLoading(true);
      setTimeout(() => router.push("/pharma/dashboard"), 1200);
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#E8F4FF",padding:"28px 24px",maxWidth:480,margin:"0 auto",left:0,right:0}}>
      <style>{S}</style>
      <div style={{width:"100%",maxWidth:340}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:72,height:72,borderRadius:22,background:"linear-gradient(135deg,rgba(167,139,250,0.2),rgba(77,184,255,0.2))",border:"1.5px solid rgba(167,139,250,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,margin:"0 auto 14px",animation:"floatY 4s ease-in-out infinite"}}>💊</div>
          <h1 style={{fontSize:24,fontWeight:900,marginBottom:4}}><span className="shine">Pharma Portal</span></h1>
          <p style={{color:"rgba(232,244,255,0.45)",fontSize:13}}>Medicine order management</p>
        </div>
        <div style={{marginBottom:12}}>
          <label style={{display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.38)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:7}}>Email</label>
          <input className="inp" type="email" placeholder="pharma@digidoc.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()}/>
        </div>
        <div style={{marginBottom:6}}>
          <label style={{display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.38)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:7}}>Password</label>
          <div style={{position:"relative"}}>
            <input className="inp" type={showPass?"text":"password"} placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={{paddingRight:44}} onKeyDown={e=>e.key==="Enter"&&login()}/>
            <button onClick={()=>setShowPass(p=>!p)} style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16,opacity:0.6}}>
              {showPass?"🙈":"👁️"}
            </button>
          </div>
        </div>
        {error&&<p style={{color:"#FF6B6B",fontSize:12,fontWeight:600,marginBottom:10}}>{error}</p>}
        <button className="bm" style={{marginTop:18}} onClick={login} disabled={loading}>
          {loading?<span className="loader"/>:"💊 Login to Pharma Portal"}
        </button>
        <div style={{marginTop:16,padding:"10px 14px",borderRadius:12,background:"rgba(167,139,250,0.05)",border:"1px solid rgba(167,139,250,0.14)"}}>
          <p style={{color:"rgba(167,139,250,0.6)",fontSize:10}}>Test: pharma@digidoc.com / Pharma@2026</p>
        </div>
      </div>
    </div>
  );
}
