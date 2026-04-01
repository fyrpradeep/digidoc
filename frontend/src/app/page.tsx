"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    try {
      const token = localStorage.getItem("dg_token") || localStorage.getItem("digidoc_token");
      const role  = localStorage.getItem("dg_role")  || localStorage.getItem("digidoc_role");
      if (token && role) {
        if (role === "doctor") { router.replace("/doctor/dashboard"); return; }
        if (role === "admin")  { router.replace("/admin/dashboard");  return; }
        router.replace("/dashboard");
      }
    } catch {}
  }, []);

  const S = `
    @keyframes sh{0%{background-position:-200% center}to{background-position:200% center}}
    @keyframes fy{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    @keyframes fu{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:sh 3s linear infinite}
    .rp{width:8px;height:8px;border-radius:50%;background:#00FFD1;display:inline-block;position:relative;margin-right:6px}
    .rp::after{content:'';position:absolute;inset:-4px;border-radius:50%;background:rgba(0,255,209,.3);animation:ripple 1.8s infinite}
    @keyframes ripple{0%{transform:scale(.8);opacity:1}to{transform:scale(2.2);opacity:0}}
    .btn-p{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;padding:16px;border-radius:15px;
      font-weight:800;font-size:15px;color:#fff;border:none;cursor:pointer;
      background:linear-gradient(135deg,#00C9A7,#0B6FCC);box-shadow:0 0 28px rgba(0,201,167,.32);transition:all .3s;font-family:inherit}
    .btn-p:hover{transform:translateY(-2px);box-shadow:0 0 40px rgba(0,201,167,.48)}
    .btn-s{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;padding:15px;border-radius:15px;
      font-weight:700;font-size:14px;color:#00FFD1;border:1.5px solid rgba(0,255,209,.3);cursor:pointer;
      background:rgba(0,255,209,.06);transition:all .3s;font-family:inherit}
    .btn-s:hover{background:rgba(0,255,209,.1)}
    .feat{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:16px;transition:all .3s}
    .stat{text-align:center;padding:14px 8px;border-radius:14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07)}
  `;

  return (
    <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#E8F4FF"}}>
      <style>{S}</style>

      {/* Header */}
      <div style={{flexShrink:0,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(2,13,26,.9)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <span style={{fontSize:22}}>💊</span>
          <span style={{fontWeight:900,fontSize:17}} className="shine">DigiDoc</span>
        </div>
        <a href="/login" style={{padding:"8px 16px",borderRadius:100,background:"rgba(0,255,209,.1)",border:"1px solid rgba(0,255,209,.25)",color:"#00FFD1",fontSize:12,fontWeight:700,textDecoration:"none"}}>Login →</a>
      </div>

      {/* Content */}
      <div style={{flex:1,overflowY:"auto",padding:"0 20px 30px"}}>

        {/* Hero */}
        <div style={{textAlign:"center",padding:"32px 0 28px",animation:"fu .6s ease"}}>
          <div style={{width:80,height:80,borderRadius:24,background:"linear-gradient(135deg,rgba(0,201,167,.2),rgba(11,111,204,.2))",border:"1.5px solid rgba(0,255,209,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:38,margin:"0 auto 16px",animation:"fy 4s ease-in-out infinite"}}>💊</div>
          <div style={{display:"inline-flex",alignItems:"center",padding:"5px 13px",borderRadius:100,background:"rgba(0,255,209,.08)",border:"1px solid rgba(0,255,209,.2)",marginBottom:14}}>
            <span className="rp"/>
            <span style={{color:"#00FFD1",fontSize:11,fontWeight:700}}>Doctors Available Now</span>
          </div>
          <h1 style={{fontSize:28,fontWeight:900,lineHeight:1.2,marginBottom:10}}>
            The Future of<br/><span className="shine">Healthcare</span><br/>Is Already Here
          </h1>
          <p style={{color:"rgba(232,244,255,.5)",fontSize:14,lineHeight:1.8,marginBottom:24}}>
            Consult verified doctors via video call.<br/>Get prescriptions & medicines delivered.
          </p>
          <a href="/login" className="btn-p" style={{display:"flex",marginBottom:12}}>🩺 Consult a Doctor — Free</a>
          <a href="/register-doctor" className="btn-s" style={{display:"flex"}}>👨‍⚕️ I am a Doctor — Join DigiDoc</a>
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:24}}>
          {[{n:"500+",l:"Doctors",c:"#00FFD1"},{n:"10K+",l:"Patients",c:"#4DB8FF"},{n:"4.9★",l:"Rating",c:"#FFB347"}].map(s=>(
            <div key={s.l} className="stat">
              <p style={{fontWeight:900,fontSize:20,color:s.c}}>{s.n}</p>
              <p style={{fontSize:10,color:"rgba(232,244,255,.38)",marginTop:3}}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,.35)",textTransform:"uppercase",letterSpacing:1.4,marginBottom:12}}>Why DigiDoc?</p>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
          {[
            {ic:"📹",t:"Instant Video Consultation",d:"Connect with a doctor in under 2 minutes, from anywhere"},
            {ic:"💊",t:"Digital Prescriptions",d:"Get e-prescriptions sent directly to your phone"},
            {ic:"🏠",t:"Medicine Delivery",d:"Order prescribed medicines, delivered to your door"},
            {ic:"🔒",t:"100% Secure & Private",d:"Your health data is encrypted and never shared"},
            {ic:"🩺",t:"Verified Doctors Only",d:"All doctors verified with MCI registration"},
            {ic:"💰",t:"Affordable Care",d:"Consultations starting at ₹299. No hidden charges"},
          ].map(f=>(
            <div key={f.t} className="feat" style={{display:"flex",gap:13,alignItems:"flex-start"}}>
              <span style={{fontSize:24,flexShrink:0}}>{f.ic}</span>
              <div>
                <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF",marginBottom:3}}>{f.t}</p>
                <p style={{color:"rgba(232,244,255,.45)",fontSize:12,lineHeight:1.6}}>{f.d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Specialties */}
        <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,.35)",textTransform:"uppercase",letterSpacing:1.4,marginBottom:12}}>Available Specialties</p>
        <div style={{display:"flex",gap:8,overflowX:"auto",marginBottom:24,paddingBottom:4}}>
          {["🫀 Cardiology","🧠 Neurology","🦷 Dental","👁️ Eye","👶 Pediatrics","🦴 Orthopedic","🧬 Dermatology","💊 General"].map(s=>(
            <div key={s} style={{padding:"7px 13px",borderRadius:100,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.08)",whiteSpace:"nowrap",fontSize:12,fontWeight:500,color:"rgba(232,244,255,.65)",flexShrink:0}}>{s}</div>
          ))}
        </div>

        {/* CTA */}
        <div style={{background:"linear-gradient(135deg,rgba(0,201,167,.12),rgba(11,111,204,.15))",border:"1px solid rgba(0,255,209,.2)",borderRadius:20,padding:20,marginBottom:16,textAlign:"center"}}>
          <p style={{fontSize:16,fontWeight:800,color:"#E8F4FF",marginBottom:6}}>Ready to get started?</p>
          <p style={{color:"rgba(232,244,255,.5)",fontSize:13,lineHeight:1.7,marginBottom:16}}>Your first consultation is free. No credit card needed.</p>
          <a href="/login" className="btn-p" style={{display:"flex",justifyContent:"center"}}>Get Started — It's Free 🚀</a>
        </div>

        <p style={{color:"rgba(232,244,255,.2)",fontSize:11,textAlign:"center"}}>© 2026 DigiDoc · pmcare.org · All rights reserved</p>
      </div>
    </div>
  );
}
