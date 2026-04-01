"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const TERMS = [
  {
    id:"acceptance", icon:"✅", title:"Acceptance of Terms",
    items:[
      { h:"Agreement",          t:"By accessing or using DigiDoc, you agree to be bound by these Terms. If you do not agree, please do not use our platform." },
      { h:"Age Requirement",    t:"You must be at least 18 years old. Minors may use DigiDoc only with explicit consent and supervision of a parent or legal guardian." },
      { h:"Updates to Terms",   t:"We may update these terms. Continued use after changes means you accept the updated terms. We will notify you of major changes." },
    ]
  },
  {
    id:"services", icon:"🏥", title:"Our Services",
    items:[
      { h:"Technology Platform", t:"DigiDoc connects patients with MCI-registered doctors for video and audio consultations. We are a technology intermediary — not a healthcare provider." },
      { h:"⚠️ Not for Emergencies",t:"DigiDoc is NOT suitable for medical emergencies. For life-threatening situations, call 112 or visit the nearest hospital immediately." },
      { h:"Medicine Delivery",  t:"We facilitate ordering and delivery of prescribed medicines. Availability and delivery times depend on third-party partners." },
      { h:"AI Assistant",       t:"Our AI provides general health guidance only. It is not a diagnostic tool and does not replace professional medical advice." },
    ]
  },
  {
    id:"doctors", icon:"🩺", title:"Doctor Standards",
    items:[
      { h:"Verification",       t:"All doctors are verified for valid MCI registration, qualifications, and identity before approval on our platform." },
      { h:"Independent Practice",t:"Doctors practice independently. DigiDoc provides technology but does not direct or control clinical decisions." },
      { h:"Quality Standards",  t:"Doctors must maintain professional standards and respond promptly. We may suspend doctors who fail to meet these standards." },
      { h:"Reviews",            t:"Patient reviews must be genuine. Fake reviews from patients or doctors are prohibited and may cause account suspension." },
    ]
  },
  {
    id:"patient", icon:"👤", title:"Patient Responsibilities",
    items:[
      { h:"Accurate Information",t:"You must provide accurate health information. Providing false information that affects diagnosis or treatment is prohibited." },
      { h:"Prescription Medicines",t:"Prescription medicines must be used only as directed. Misuse, sharing, or reselling prescription medicines is illegal and prohibited." },
      { h:"Account Security",   t:"Keep your account secure. Never share your OTP with anyone — DigiDoc will never ask for your OTP." },
      { h:"Appropriate Use",    t:"Use DigiDoc for legitimate healthcare purposes only. Harassment or fraud will result in immediate account termination." },
    ]
  },
  {
    id:"payment", icon:"💳", title:"Payments & Refunds",
    items:[
      { h:"Consultation Fees",  t:"Fees are shown before booking and vary by doctor, specialty, and session duration." },
      { h:"Refund Policy",      t:"Full refund if doctor fails to connect within 10 minutes. Refunds are processed within 5–7 business days." },
      { h:"Medicine Orders",    t:"Orders can be cancelled before dispatch for a full refund. Prescription medicines cannot be returned once dispensed." },
      { h:"Platform Fee",       t:"DigiDoc charges up to 15% platform fee on consultations, covering technology, verification, and support." },
    ]
  },
  {
    id:"liability", icon:"⚖️", title:"Limitation of Liability",
    items:[
      { h:"Platform Liability", t:"DigiDoc is a technology platform. We are not liable for clinical outcomes — medical decisions are the doctor's sole responsibility." },
      { h:"Service Availability",t:"We aim for 99.9% uptime but cannot guarantee uninterrupted service. We are not liable for losses from temporary unavailability." },
      { h:"Third-Party Services",t:"We use third-party services for payments and delivery. We are not responsible for their failures." },
      { h:"Maximum Liability",  t:"DigiDoc's maximum liability shall not exceed the total amount you paid in the 3 months preceding the claim." },
    ]
  },
  {
    id:"termination", icon:"🚫", title:"Account Termination",
    items:[
      { h:"By You",             t:"Close your account anytime from Profile Settings or by emailing support@digidoc.com." },
      { h:"By DigiDoc",         t:"We may suspend accounts for violation of these terms, fraud, misuse, or behaviour that harms other users." },
      { h:"Effect",             t:"Upon termination, your access ceases. Medical records are retained as required by law (typically 7 years)." },
    ]
  },
];

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
  .sec{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;margin-bottom:10px;overflow:hidden;transition:border-color 0.3s}
  .sec.open{border-color:rgba(77,184,255,0.22)}
  .sec-hd{width:100%;display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:none;border:none;cursor:pointer;font-family:inherit;text-align:left;gap:10px;transition:background 0.2s}
  .sec-hd:hover{background:rgba(77,184,255,0.03)}
  .sec-body{padding:0 16px 14px;animation:slideDown 0.25s ease}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
`;

export default function TermsPage() {
  const router = useRouter();
  const [open, setOpen] = useState<string | null>("acceptance");

  return (
    <div style={{
      position:"fixed", inset:0, display:"flex", flexDirection:"column",
      background:"#020D1A", fontFamily:"'Plus Jakarta Sans',sans-serif",
      color:"#E8F4FF", maxWidth:480, margin:"0 auto",
      left:"50%", transform:"translateX(-50%)",
    }}>
      <style>{S}</style>

      {/* HEADER */}
      <div style={{ flexShrink:0, padding:"13px 18px 12px", background:"rgba(2,13,26,0.97)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={()=>router.back()} style={{ background:"none",border:"none",color:"#4DB8FF",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>← Back</button>
          <div style={{ flex:1 }}>
            <h2 style={{ fontSize:16,fontWeight:800 }}>Terms of Service</h2>
            <p style={{ color:"rgba(232,244,255,0.35)",fontSize:10,marginTop:1 }}>Last updated: 1 April 2026 · Version 2.0</p>
          </div>
          <Link href="/privacy" style={{ color:"#00FFD1",fontSize:11,fontWeight:600,textDecoration:"none" }}>Privacy →</Link>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex:1, overflowY:"auto", padding:"14px 18px" }} className="noscroll">

        {/* Emergency banner */}
        <div style={{ background:"rgba(255,107,107,0.07)", border:"1px solid rgba(255,107,107,0.2)", borderRadius:14, padding:"12px 15px", marginBottom:14, display:"flex", gap:10 }}>
          <span style={{ fontSize:20, flexShrink:0 }}>🚨</span>
          <div>
            <p style={{ color:"#FF6B6B", fontWeight:700, fontSize:13, marginBottom:2 }}>Medical Emergency?</p>
            <p style={{ color:"rgba(255,107,107,0.7)", fontSize:11, lineHeight:1.6 }}>
              DigiDoc is NOT for emergencies. Call <strong style={{ color:"#FF6B6B" }}>112</strong> or go to the nearest hospital immediately.
            </p>
          </div>
        </div>

        {/* Key points */}
        <div style={{ background:"rgba(77,184,255,0.05)", border:"1px solid rgba(77,184,255,0.15)", borderRadius:16, padding:"14px 16px", marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <span style={{ fontSize:18 }}>📜</span>
            <p style={{ color:"#4DB8FF", fontWeight:800, fontSize:13 }}>Key Points — Plain English</p>
          </div>
          {[
            "DigiDoc is a platform — doctors are independent professionals.",
            "Not for emergencies — call 112 for life-threatening situations.",
            "You must be 18+ or have parental consent to use DigiDoc.",
            "Provide accurate health info — your safety depends on it.",
            "Prescription medicines are for your personal use only.",
          ].map((t,i) => (
            <div key={i} style={{ display:"flex", gap:8, marginBottom:i<4?6:0 }}>
              <span style={{ color:"#4DB8FF", fontSize:11, flexShrink:0, marginTop:1 }}>→</span>
              <p style={{ color:"rgba(232,244,255,0.65)", fontSize:12, lineHeight:1.6 }}>{t}</p>
            </div>
          ))}
        </div>

        {/* Accordion */}
        {TERMS.map(s => (
          <div key={s.id} className={"sec"+(open===s.id?" open":"")}>
            <button className="sec-hd" onClick={()=>setOpen(open===s.id?null:s.id)}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:20 }}>{s.icon}</span>
                <p style={{ fontWeight:700, fontSize:14, color:"#E8F4FF" }}>{s.title}</p>
              </div>
              <span style={{ color:"#4DB8FF", fontSize:18, flexShrink:0, display:"block", transition:"transform 0.3s", transform:open===s.id?"rotate(180deg)":"none" }}>⌄</span>
            </button>

            {open === s.id && (
              <div className="sec-body">
                <div style={{ height:1, background:"rgba(255,255,255,0.06)", marginBottom:12 }}/>
                {s.items.map((item,i) => (
                  <div key={i} style={{ marginBottom:i<s.items.length-1?12:0 }}>
                    <p style={{ fontWeight:700, fontSize:12, color:"#4DB8FF", marginBottom:3 }}>{item.h}</p>
                    <p style={{ color:"rgba(232,244,255,0.55)", fontSize:12, lineHeight:1.8 }}>{item.t}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Governing law + Contact */}
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"14px 16px", marginTop:6, marginBottom:8 }}>
          <p style={{ fontWeight:700, fontSize:13, color:"#E8F4FF", marginBottom:5 }}>⚖️ Governing Law</p>
          <p style={{ color:"rgba(232,244,255,0.45)", fontSize:12, lineHeight:1.7 }}>
            These terms are governed by the laws of India. Disputes are subject to the jurisdiction of courts in Indore, Madhya Pradesh.
          </p>
        </div>

        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"14px 16px", marginBottom:20 }}>
          <p style={{ fontWeight:700, fontSize:13, color:"#E8F4FF", marginBottom:5 }}>📧 Legal Queries</p>
          <p style={{ color:"#4DB8FF", fontSize:12, fontWeight:600 }}>legal@digidoc.com</p>
        </div>

        <p style={{ color:"rgba(232,244,255,0.2)", fontSize:11, textAlign:"center", lineHeight:1.7, marginBottom:20 }}>
          By using DigiDoc you acknowledge you have read,<br/>
          understood, and agree to these Terms of Service.
        </p>
      </div>
    </div>
  );
}
