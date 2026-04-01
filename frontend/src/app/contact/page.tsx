"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .inp{width:100%;padding:12px 14px;border-radius:13px;font-family:inherit;font-size:13px;outline:none;transition:all 0.3s;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.09);color:#E8F4FF}
  .inp::placeholder{color:rgba(232,244,255,0.28)}
  .inp:focus{border-color:rgba(0,255,209,0.4);background:rgba(0,255,209,0.03);box-shadow:0 0 0 3px rgba(0,255,209,0.07)}
  .bm{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:14px;border-radius:14px;font-family:inherit;font-weight:800;font-size:14px;color:white;border:none;cursor:pointer;transition:all 0.3s;background:linear-gradient(135deg,#00C9A7,#0B6FCC);box-shadow:0 0 20px rgba(0,201,167,0.26)}
  .bm:hover{transform:translateY(-1px);box-shadow:0 0 30px rgba(0,201,167,0.4)}
  .bm:disabled{opacity:0.5;cursor:not-allowed;transform:none}
  .cc{border-radius:15px;padding:14px 16px;display:flex;gap:12px;align-items:center;cursor:pointer;transition:all 0.25s;text-decoration:none}
  .cc:hover{transform:translateY(-2px)}
  .loader{width:18px;height:18px;border:2.5px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block}
`;

export default function ContactPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name:"",email:"",phone:"",subject:"",message:"" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!form.name||!form.email||!form.message) return;
    setSending(true);
    setTimeout(()=>{ setSending(false); setSent(true); },1800);
  };

  return (
    <main style={{ fontFamily:"'Plus Jakarta Sans',sans-serif",background:"#020D1A",color:"#E8F4FF",minHeight:"100vh" }}>
      <style>{S}</style>
      <nav style={{ position:"sticky",top:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 20px",background:"rgba(2,13,26,0.95)",backdropFilter:"blur(24px)",borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={()=>router.back()} style={{ background:"none",border:"none",color:"#00FFD1",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>← Back</button>
        <Link href="/"><Image src="/logo.png" alt="DigiDoc" width={100} height={34} style={{ height:28,width:"auto",filter:"brightness(1.1)" }}/></Link>
        <div style={{ width:60 }}/>
      </nav>
      <div style={{ padding:"28px 20px 48px",maxWidth:480,margin:"0 auto" }}>
        <div style={{ textAlign:"center",marginBottom:28 }}>
          <div style={{ width:64,height:64,borderRadius:20,background:"linear-gradient(135deg,rgba(0,201,167,0.18),rgba(11,111,204,0.18))",border:"1.5px solid rgba(0,255,209,0.22)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 14px" }}>📞</div>
          <h1 style={{ fontSize:24,fontWeight:900,marginBottom:8 }}><span className="shine">Contact Us</span></h1>
          <p style={{ color:"rgba(232,244,255,0.45)",fontSize:13,lineHeight:1.7 }}>We are here to help. Reach out through any channel below.</p>
        </div>

        {[
          { icon:"📧",label:"Email Support",   value:"support@digidoc.com",     sub:"We respond within 24 hours",    c:"#4DB8FF",bg:"rgba(77,184,255,0.07)",bd:"rgba(77,184,255,0.16)"  },
          { icon:"📞",label:"Phone Support",   value:"+91 1800-XXX-XXXX",       sub:"Monday to Saturday, 9AM – 9PM", c:"#00FFD1",bg:"rgba(0,255,209,0.06)",bd:"rgba(0,255,209,0.15)"  },
          { icon:"💬",label:"WhatsApp",        value:"+91 9999-XXX-XXX",        sub:"Quick replies during business hours",c:"#34D399",bg:"rgba(52,211,153,0.07)",bd:"rgba(52,211,153,0.16)" },
          { icon:"🏢",label:"Head Office",     value:"Indore, Madhya Pradesh",  sub:"India — 452001",                c:"#A78BFA",bg:"rgba(167,139,250,0.07)",bd:"rgba(167,139,250,0.16)"},
        ].map(c=>(
          <div key={c.label} className="cc" style={{ background:c.bg,border:`1px solid ${c.bd}`,marginBottom:10 }}>
            <div style={{ width:46,height:46,borderRadius:14,background:c.c+"18",border:`1px solid ${c.c}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{c.icon}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontWeight:700,fontSize:13,color:"#E8F4FF",marginBottom:2 }}>{c.label}</p>
              <p style={{ color:c.c,fontSize:12,fontWeight:600,marginBottom:1 }}>{c.value}</p>
              <p style={{ color:"rgba(232,244,255,0.35)",fontSize:10 }}>{c.sub}</p>
            </div>
          </div>
        ))}

        <div style={{ height:1,background:"rgba(255,255,255,0.06)",margin:"20px 0" }}/>
        <p style={{ fontSize:14,fontWeight:700,color:"#E8F4FF",marginBottom:16 }}>Send Us a Message</p>

        {sent ? (
          <div style={{ textAlign:"center",padding:"32px",background:"rgba(0,255,209,0.05)",border:"1px solid rgba(0,255,209,0.15)",borderRadius:16,animation:"slideUp 0.4s ease" }}>
            <p style={{ fontSize:44,marginBottom:10 }}>✅</p>
            <p style={{ fontWeight:800,fontSize:16,color:"#E8F4FF",marginBottom:6 }}>Message Sent!</p>
            <p style={{ color:"rgba(232,244,255,0.45)",fontSize:13,lineHeight:1.7 }}>We'll get back to you within 24 hours on <strong style={{ color:"#00FFD1" }}>{form.email}</strong></p>
          </div>
        ) : (
          <div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12 }}>
              <div><label style={{ display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.38)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:6 }}>Name *</label><input className="inp" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Full Name"/></div>
              <div><label style={{ display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.38)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:6 }}>Phone</label><input className="inp" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="+91 XXXXX"/></div>
            </div>
            <div style={{ marginBottom:12 }}><label style={{ display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.38)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:6 }}>Email *</label><input className="inp" type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="your@email.com"/></div>
            <div style={{ marginBottom:12 }}><label style={{ display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.38)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:6 }}>Subject</label>
              <select className="inp" value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))} style={{ cursor:"pointer" }}>
                <option value="">Select topic</option>
                <option>General Inquiry</option><option>Doctor Partnership</option><option>Technical Issue</option><option>Billing Query</option><option>Press & Media</option>
              </select>
            </div>
            <div style={{ marginBottom:16 }}><label style={{ display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.38)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:6 }}>Message *</label><textarea className="inp" rows={5} value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} placeholder="How can we help you?" style={{ resize:"none",lineHeight:1.6 }}/></div>
            <button className="bm" onClick={submit} disabled={sending||!form.name||!form.email||!form.message.trim()}>
              {sending?<span className="loader"/>:"📤 Send Message"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
