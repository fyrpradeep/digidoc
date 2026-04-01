"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    try {
      const t = localStorage.getItem("dg_token")||localStorage.getItem("digidoc_token")||"";
      const r = localStorage.getItem("dg_role") ||localStorage.getItem("digidoc_role") ||"";
      if (t && r) { router.replace(r==="doctor"?"/doctor/dashboard":r==="admin"?"/admin/dashboard":"/dashboard"); }
    } catch {}
  }, []);

  const S = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}html,body{height:100%;font-family:'Plus Jakarta Sans',sans-serif}
    @keyframes sh{0%{background-position:-200% center}to{background-position:200% center}}
    @keyframes fy{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    @keyframes rp{0%{transform:scale(.8);opacity:1}to{transform:scale(2.2);opacity:0}}
    .sh{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:sh 3s linear infinite}
    .btn-p{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;padding:16px;border-radius:15px;font-weight:800;font-size:15px;color:#fff;border:none;cursor:pointer;background:linear-gradient(135deg,#00C9A7,#0B6FCC);box-shadow:0 0 28px rgba(0,201,167,.32);transition:all .3s;font-family:inherit;text-decoration:none}
    .btn-s{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;padding:15px;border-radius:15px;font-weight:700;font-size:14px;color:#00FFD1;border:1.5px solid rgba(0,255,209,.3);cursor:pointer;background:rgba(0,255,209,.06);transition:all .3s;font-family:inherit;text-decoration:none}
    .feat{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:16px;transition:all .3s}
    .stat{text-align:center;padding:14px 8px;border-radius:14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07)}
    .spec{padding:7px 13px;border-radius:100px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);white-space:nowrap;font-size:12px;font-weight:500;color:rgba(232,244,255,.65);flex-shrink:0}
    .dot{width:8px;height:8px;border-radius:50%;background:#00FFD1;display:inline-block;position:relative;margin-right:6px;vertical-align:middle}
    .dot::after{content:'';position:absolute;inset:-4px;border-radius:50%;background:rgba(0,255,209,.3);animation:rp 1.8s infinite}
    .ns::-webkit-scrollbar{display:none}.ns{-ms-overflow-style:none;scrollbar-width:none}
    .step-card{display:flex;gap:14px;align-items:flex-start;padding:14px;border-radius:14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);margin-bottom:10px}
    .step-num{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#00C9A7,#0B6FCC);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;color:#fff;flex-shrink:0}
    .faq{padding:14px;border-radius:14px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);margin-bottom:8px;cursor:pointer}
  `;

  const faqs = [
    {q:"Are the doctors verified?", a:"Yes. Every doctor on DigiDoc is verified with their MCI registration number before going live."},
    {q:"Is my health data safe?", a:"Absolutely. All data is encrypted end-to-end. We never share your data with third parties."},
    {q:"How much does a consultation cost?", a:"Consultations start at ₹299. Fees are shown upfront before you connect to any doctor."},
    {q:"What if I'm not satisfied?", a:"We offer a full refund if you're not satisfied with your consultation. No questions asked."},
    {q:"Is this legal in India?", a:"Yes. DigiDoc follows all Telemedicine Practice Guidelines 2020 issued by the Government of India."},
  ];

  const [openFaq, setOpenFaq] = (typeof window === "undefined") ? [null, ()=>{}] : [null, ()=>{}];

  return (
    <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",background:"#020D1A",color:"#E8F4FF",overflowY:"auto"}} className="ns">
      <style>{S}</style>

      {/* Header */}
      <div style={{flexShrink:0,padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(2,13,26,.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.06)",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <span style={{fontSize:22}}>💊</span>
          <span style={{fontWeight:900,fontSize:17}} className="sh">DigiDoc</span>
        </div>
        <div style={{display:"flex",gap:8}}>
          <a href="/register-doctor" style={{padding:"7px 12px",borderRadius:100,background:"rgba(0,255,209,.08)",border:"1px solid rgba(0,255,209,.2)",color:"#00FFD1",fontSize:11,fontWeight:700,textDecoration:"none"}}>Join as Doctor</a>
          <a href="/login" style={{padding:"7px 14px",borderRadius:100,background:"linear-gradient(135deg,#00C9A7,#0B6FCC)",color:"#fff",fontSize:11,fontWeight:700,textDecoration:"none"}}>Login →</a>
        </div>
      </div>

      <div style={{padding:"0 20px 48px"}}>

        {/* Hero */}
        <div style={{textAlign:"center",padding:"32px 0 24px"}}>
          <div style={{width:80,height:80,borderRadius:24,background:"linear-gradient(135deg,rgba(0,201,167,.2),rgba(11,111,204,.2))",border:"1.5px solid rgba(0,255,209,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:38,margin:"0 auto 16px",animation:"fy 4s ease-in-out infinite"}}>💊</div>
          <div style={{display:"inline-flex",alignItems:"center",padding:"5px 13px",borderRadius:100,background:"rgba(0,255,209,.08)",border:"1px solid rgba(0,255,209,.2)",marginBottom:14}}>
            <span className="dot"/><span style={{color:"#00FFD1",fontSize:11,fontWeight:700}}>Doctors Available Now</span>
          </div>
          <h1 style={{fontSize:30,fontWeight:900,lineHeight:1.2,marginBottom:10}}>
            The Future of<br/><span className="sh">Healthcare</span><br/>Is Already Here
          </h1>
          <p style={{color:"rgba(232,244,255,.5)",fontSize:14,lineHeight:1.8,marginBottom:24}}>
            Consult verified doctors via live video call.<br/>Get prescriptions & medicines delivered home.
          </p>
          <a href="/login" className="btn-p" style={{display:"flex",marginBottom:12}}>🩺 Consult a Doctor — Free</a>
          <a href="/register-doctor" className="btn-s" style={{display:"flex"}}>👨‍⚕️ I am a Doctor — Join DigiDoc</a>
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:28}}>
          {[{n:"500+",l:"Verified Doctors",c:"#00FFD1"},{n:"10K+",l:"Happy Patients",c:"#4DB8FF"},{n:"4.9★",l:"Average Rating",c:"#FFB347"}].map(s=>(
            <div key={s.l} className="stat">
              <p style={{fontWeight:900,fontSize:20,color:s.c}}>{s.n}</p>
              <p style={{fontSize:9,color:"rgba(232,244,255,.38)",marginTop:3,lineHeight:1.4}}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,.35)",textTransform:"uppercase",letterSpacing:1.4,marginBottom:14}}>How It Works</p>
        {[{n:1,t:"Open DigiDoc",d:"Visit pmcare.org on any device. No app download needed."},{n:2,t:"Register in 60 seconds",d:"Enter your mobile, verify OTP, create profile."},{n:3,t:"Choose a Doctor",d:"Browse verified doctors by specialty. All available now."},{n:4,t:"Video / Audio Call",d:"Connect instantly via secure video or audio call."},{n:5,t:"Get Prescription",d:"Receive digital prescription directly on your phone."},{n:6,t:"Medicine Delivery",d:"Order medicines online, delivered to your doorstep."}].map(s=>(
          <div key={s.n} className="step-card">
            <div className="step-num">{s.n}</div>
            <div><p style={{fontWeight:700,fontSize:13,color:"#E8F4FF",marginBottom:3}}>{s.t}</p><p style={{color:"rgba(232,244,255,.45)",fontSize:12,lineHeight:1.6}}>{s.d}</p></div>
          </div>
        ))}

        {/* Features */}
        <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,.35)",textTransform:"uppercase",letterSpacing:1.4,marginBottom:14,marginTop:24}}>Why Choose DigiDoc?</p>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
          {[
            {ic:"📹",t:"Live Video Consultation",d:"Crystal clear video calls. Connect with doctors in under 2 minutes."},
            {ic:"🩺",t:"Verified Doctors Only",d:"MCI-registered, background-checked doctors. 100% authentic."},
            {ic:"💊",t:"Digital Prescriptions",d:"Valid e-prescriptions sent to your phone instantly after consultation."},
            {ic:"🏠",t:"Medicine Home Delivery",d:"Order prescribed medicines online. Delivered within 24-48 hours."},
            {ic:"🔒",t:"100% Private & Secure",d:"All consultations are encrypted. Your data is never shared."},
            {ic:"💰",t:"Affordable Pricing",d:"Consultations from ₹299. No hidden charges. Pay after consultation."},
            {ic:"📱",t:"Works on Any Device",d:"Mobile, tablet, laptop — DigiDoc works everywhere."},
            {ic:"⚡",t:"24/7 Availability",d:"Doctors available round the clock. Even on holidays."},
          ].map(f=>(
            <div key={f.t} className="feat" style={{display:"flex",gap:13,alignItems:"flex-start"}}>
              <span style={{fontSize:24,flexShrink:0}}>{f.ic}</span>
              <div><p style={{fontWeight:700,fontSize:13,color:"#E8F4FF",marginBottom:3}}>{f.t}</p><p style={{color:"rgba(232,244,255,.45)",fontSize:12,lineHeight:1.6}}>{f.d}</p></div>
            </div>
          ))}
        </div>

        {/* Specialties */}
        <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,.35)",textTransform:"uppercase",letterSpacing:1.4,marginBottom:12}}>Available Specialties</p>
        <div style={{display:"flex",gap:8,overflowX:"auto",marginBottom:24,paddingBottom:4}} className="ns">
          {["🫀 Cardiology","🧠 Neurology","🦴 Orthopedic","👁️ Ophthalmology","👶 Pediatrics","🦷 Dental","🧬 Dermatology","💊 General","🤰 Gynecology","🫁 Pulmonology","🧪 Pathology","🏋️ Sports Medicine"].map(s=>(
            <span key={s} className="spec">{s}</span>
          ))}
        </div>

        {/* For Doctors */}
        <div style={{background:"linear-gradient(135deg,rgba(77,184,255,.1),rgba(11,111,204,.15))",border:"1px solid rgba(77,184,255,.2)",borderRadius:18,padding:18,marginBottom:24}}>
          <p style={{fontSize:16,fontWeight:800,color:"#E8F4FF",marginBottom:8}}>👨‍⚕️ Are you a Doctor?</p>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
            {["Earn ₹30,000–₹1.5L per month","Work from home, flexible hours","Get patients immediately after approval","Instant payouts twice a week"].map(b=>(
              <p key={b} style={{color:"rgba(232,244,255,.6)",fontSize:12}}><span style={{color:"#4DB8FF",marginRight:6}}>✓</span>{b}</p>
            ))}
          </div>
          <a href="/register-doctor" style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"14px",borderRadius:13,background:"linear-gradient(135deg,#4DB8FF,#0B6FCC)",color:"#fff",fontWeight:700,fontSize:14,textDecoration:"none"}}>Register as Doctor →</a>
        </div>

        {/* FAQ */}
        <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,.35)",textTransform:"uppercase",letterSpacing:1.4,marginBottom:14}}>Frequently Asked Questions</p>
        {faqs.map((f,i) => (
          <details key={i} style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:13,marginBottom:8,padding:"14px 16px"}}>
            <summary style={{fontWeight:600,fontSize:13,color:"#E8F4FF",cursor:"pointer",listStyle:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              {f.q} <span style={{color:"#00FFD1",fontSize:16}}>+</span>
            </summary>
            <p style={{color:"rgba(232,244,255,.5)",fontSize:12,lineHeight:1.7,marginTop:10}}>{f.a}</p>
          </details>
        ))}

        {/* CTA */}
        <div style={{background:"linear-gradient(135deg,rgba(0,201,167,.12),rgba(11,111,204,.15))",border:"1px solid rgba(0,255,209,.2)",borderRadius:20,padding:20,marginTop:24,marginBottom:8,textAlign:"center"}}>
          <p style={{fontSize:18,fontWeight:800,color:"#E8F4FF",marginBottom:6}}>Ready to get started?</p>
          <p style={{color:"rgba(232,244,255,.5)",fontSize:13,lineHeight:1.7,marginBottom:16}}>Your first consultation is free.<br/>No credit card needed.</p>
          <a href="/login" className="btn-p" style={{display:"flex",justifyContent:"center",marginBottom:10}}>Get Started Free 🚀</a>
        </div>

        {/* Footer */}
        <div style={{borderTop:"1px solid rgba(255,255,255,.06)",paddingTop:16,textAlign:"center"}}>
          <p style={{color:"rgba(232,244,255,.25)",fontSize:11,marginBottom:8}}>© 2026 DigiDoc · pmcare.org · All rights reserved</p>
          <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
            {[["Privacy Policy","/privacy"],["Terms of Service","/terms"],["Contact Us","/contact"],["About Us","/about"]].map(([l,h])=>(
              <a key={l} href={h} style={{color:"rgba(232,244,255,.35)",fontSize:11,textDecoration:"none"}}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
