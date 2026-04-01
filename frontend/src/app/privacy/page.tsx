"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SECTIONS = [
  {
    id: "collect", icon: "📋", title: "Information We Collect",
    items: [
      { h: "Personal Information",   t: "Name, mobile number, email address, date of birth, and location — required to create and manage your account." },
      { h: "Health Information",     t: "Symptoms, medical history, prescriptions, allergies, and existing conditions — used solely to provide healthcare services." },
      { h: "Usage Data",             t: "Pages visited, features used, and time spent — used to improve DigiDoc for everyone." },
      { h: "Device Information",     t: "Device type, OS, IP address, and browser type — collected for security and fraud prevention only." },
    ]
  },
  {
    id: "use", icon: "🎯", title: "How We Use Your Information",
    items: [
      { h: "Healthcare Services",    t: "To connect you with doctors, generate prescriptions, process orders, and provide AI-powered health recommendations." },
      { h: "Platform Improvement",   t: "Anonymised, aggregated usage data helps us improve features and fix bugs." },
      { h: "Communication",          t: "Appointment reminders, order updates, and OTPs. Manage notification preferences in your profile." },
      { h: "Legal Compliance",       t: "To comply with applicable laws, resolve disputes, and enforce our agreements." },
    ]
  },
  {
    id: "share", icon: "🤝", title: "How We Share Your Information",
    items: [
      { h: "With Doctors",           t: "Your health info is shared only with the specific doctor you choose to consult. Nothing more." },
      { h: "Delivery Partners",      t: "For medicine delivery — only your name and address. No health data is ever shared." },
      { h: "We NEVER Sell Your Data",t: "DigiDoc will never sell, rent, or trade your personal or health data. This is an absolute, unconditional commitment." },
      { h: "Legal Requirements",     t: "We may disclose information only when required by law or court order." },
    ]
  },
  {
    id: "security", icon: "🔒", title: "Data Security",
    items: [
      { h: "End-to-End Encryption",  t: "All health data is encrypted using AES-256, both in transit and at rest. Unreadable to anyone without authorisation." },
      { h: "HIPAA Compliance",       t: "DigiDoc is designed to comply with HIPAA standards for healthcare data privacy and security." },
      { h: "Access Controls",        t: "Only authorised personnel with specific roles can access user data. All access is logged and audited." },
      { h: "Breach Protocol",        t: "In case of a data breach, we notify affected users within 72 hours as required by law." },
    ]
  },
  {
    id: "rights", icon: "⚖️", title: "Your Rights",
    items: [
      { h: "Access Your Data",       t: "Request a copy of all personal data we hold about you at any time." },
      { h: "Correct Your Data",      t: "Update or correct your information through profile settings at any time." },
      { h: "Delete Your Account",    t: "Request permanent deletion by emailing privacy@digidoc.com. Processed within 30 days." },
      { h: "Data Portability",       t: "Download your health records and prescription history anytime from your profile." },
    ]
  },
  {
    id: "cookies", icon: "🍪", title: "Cookies",
    items: [
      { h: "Essential Cookies",      t: "Required to keep you logged in. Cannot be disabled — they are necessary for the platform to work." },
      { h: "Analytics Cookies",      t: "Used with your consent to understand usage. You can opt out at any time from settings." },
      { h: "No Ad Tracking",         t: "DigiDoc does not use advertising cookies. We serve no ads and do not let anyone track you here." },
    ]
  },
];

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
  .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .sec{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;margin-bottom:10px;overflow:hidden;transition:border-color 0.3s}
  .sec.open{border-color:rgba(0,255,209,0.22)}
  .sec-hd{width:100%;display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:none;border:none;cursor:pointer;font-family:inherit;text-align:left;gap:10px;transition:background 0.2s}
  .sec-hd:hover{background:rgba(0,255,209,0.03)}
  .sec-body{padding:0 16px 14px;animation:slideDown 0.25s ease}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
`;

export default function PrivacyPage() {
  const router  = useRouter();
  const [open, setOpen] = useState<string | null>("collect");

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
          <button onClick={()=>router.back()} style={{ background:"none",border:"none",color:"#00FFD1",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>← Back</button>
          <div style={{ flex:1 }}>
            <h2 style={{ fontSize:16,fontWeight:800 }}>Privacy Policy</h2>
            <p style={{ color:"rgba(232,244,255,0.35)",fontSize:10,marginTop:1 }}>Last updated: 1 April 2026 · Version 2.0</p>
          </div>
          <Link href="/terms" style={{ color:"#4DB8FF",fontSize:11,fontWeight:600,textDecoration:"none" }}>Terms →</Link>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex:1, overflowY:"auto", padding:"14px 18px" }} className="noscroll">

        {/* Summary */}
        <div style={{ background:"rgba(0,255,209,0.05)", border:"1px solid rgba(0,255,209,0.15)", borderRadius:16, padding:"14px 16px", marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <span style={{ fontSize:18 }}>🔒</span>
            <p style={{ color:"#00FFD1", fontWeight:800, fontSize:13 }}>Our Promise — Plain English</p>
          </div>
          {[
            "We collect only what is needed to provide healthcare.",
            "We NEVER sell your data to anyone. Ever.",
            "All health data is encrypted end-to-end (AES-256).",
            "You can delete your account and all data anytime.",
            "We are fully HIPAA compliant.",
          ].map((t,i) => (
            <div key={i} style={{ display:"flex", gap:8, marginBottom:i<4?6:0 }}>
              <span style={{ color:"#00FFD1", fontSize:11, flexShrink:0, marginTop:1 }}>✓</span>
              <p style={{ color:"rgba(232,244,255,0.65)", fontSize:12, lineHeight:1.6 }}>{t}</p>
            </div>
          ))}
        </div>

        {/* Accordion */}
        {SECTIONS.map(s => (
          <div key={s.id} className={"sec"+(open===s.id?" open":"")}>
            <button className="sec-hd" onClick={()=>setOpen(open===s.id?null:s.id)}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:20 }}>{s.icon}</span>
                <p style={{ fontWeight:700, fontSize:14, color:"#E8F4FF" }}>{s.title}</p>
              </div>
              <span style={{ color:"#00FFD1", fontSize:18, flexShrink:0, display:"block", transition:"transform 0.3s", transform:open===s.id?"rotate(180deg)":"none" }}>⌄</span>
            </button>

            {open === s.id && (
              <div className="sec-body">
                <div style={{ height:1, background:"rgba(255,255,255,0.06)", marginBottom:12 }}/>
                {s.items.map((item,i) => (
                  <div key={i} style={{ marginBottom:i<s.items.length-1?12:0 }}>
                    <p style={{ fontWeight:700, fontSize:12, color:"#00FFD1", marginBottom:3 }}>{item.h}</p>
                    <p style={{ color:"rgba(232,244,255,0.55)", fontSize:12, lineHeight:1.8 }}>{item.t}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Contact DPO */}
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"14px 16px", marginTop:6, marginBottom:16 }}>
          <p style={{ fontWeight:700, fontSize:13, color:"#E8F4FF", marginBottom:6 }}>📧 Privacy Questions?</p>
          <p style={{ color:"rgba(232,244,255,0.45)", fontSize:12, lineHeight:1.7, marginBottom:6 }}>
            Contact our Data Protection Officer. We respond within 48 business hours.
          </p>
          <p style={{ color:"#4DB8FF", fontSize:12, fontWeight:600 }}>privacy@digidoc.com</p>
        </div>

        <p style={{ color:"rgba(232,244,255,0.2)", fontSize:11, textAlign:"center", lineHeight:1.7, marginBottom:20 }}>
          By using DigiDoc you agree to this Privacy Policy.<br/>
          We will notify you of significant changes via SMS or email.
        </p>
      </div>
    </div>
  );
}
