"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CONSULTATIONS = [
  { id:"RX-2041",doc:"Dr. Priya Sharma", spec:"General Physician",  date:"31 Mar 2026",diag:"Upper Respiratory Infection",   fee:299, status:"completed" },
  { id:"RX-2038",doc:"Dr. Arjun Mehta",  spec:"Cardiologist",       date:"15 Mar 2026",diag:"Routine Heart Checkup",          fee:599, status:"completed" },
  { id:"RX-2031",doc:"Dr. Sneha Rao",    spec:"Dermatologist",      date:"2 Mar 2026", diag:"Skin Allergy — Contact Dermatitis",fee:399, status:"completed" },
  { id:"RX-2020",doc:"Dr. Rahul Gupta",  spec:"Neurologist",        date:"18 Feb 2026",diag:"Migraine — Tension Type",        fee:699, status:"completed" },
  { id:"RX-2010",doc:"Dr. Anita Patel",  spec:"Pulmonologist",      date:"5 Feb 2026", diag:"Asthma Follow-up",              fee:499, status:"completed" },
];

const VITALS = [
  { label:"Blood Group",     value:"B+",        icon:"🩸", color:"#FF6B6B" },
  { label:"Weight",          value:"72 kg",     icon:"⚖️",  color:"#4DB8FF" },
  { label:"Height",          value:"175 cm",    icon:"📏",  color:"#00FFD1" },
  { label:"BMI",             value:"23.5",      icon:"💚",  color:"#34D399" },
  { label:"Blood Pressure",  value:"120/80",    icon:"❤️",  color:"#FF6B6B" },
  { label:"Blood Sugar",     value:"Normal",    icon:"🩺",  color:"#00FFD1" },
];

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  .gc{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:14px;margin-bottom:12px;cursor:pointer;transition:all 0.3s}
  .gc:hover{border-color:rgba(0,255,209,0.2);background:rgba(0,255,209,0.03);transform:translateX(3px)}
  .badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:100px;font-size:10px;font-weight:700}
  .ni{display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 0;cursor:pointer;border:none;background:none;font-family:inherit;flex:1;border-top:2px solid transparent}
  .ni.on{border-top-color:#00FFD1}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
`;

type Tab = "history" | "vitals" | "docs";
export default function RecordsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("history");
  return (
    <div style={{ position:"fixed",inset:0,display:"flex",flexDirection:"column", background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#E8F4FF",maxWidth:480,margin:"0 auto",left:0,right:0 }}>
      <style>{S}</style>
      <div style={{ flexShrink:0,padding:"13px 18px 12px",background:"rgba(2,13,26,0.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <button onClick={()=>router.back()} style={{ background:"none",border:"none",color:"#00FFD1",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>← Back</button>
          <h2 style={{ flex:1,fontSize:16,fontWeight:800 }}>Medical Records</h2>
        </div>
      </div>
      <div style={{ flex:1,overflowY:"auto",padding:"14px 18px"}} className="noscroll">
        {tab==="history" && (
          <div style={{ animation:"slideUp 0.4s ease" }}>
            <p style={{ fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:14 }}>Consultation History ({CONSULTATIONS.length})</p>
            {CONSULTATIONS.map(c=>(
              <div key={c.id} className="gc" onClick={()=>router.push("/prescription/"+c.id)}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                  <div>
                    <p style={{ fontWeight:700,fontSize:13,color:"#E8F4FF",marginBottom:2 }}>{c.doc}</p>
                    <p style={{ color:"#00FFD1",fontSize:11,fontWeight:600 }}>{c.spec}</p>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ color:"rgba(232,244,255,0.35)",fontSize:10 }}>{c.date}</p>
                    <p style={{ color:"#00FFD1",fontWeight:700,fontSize:12,marginTop:2 }}>₹{c.fee}</p>
                  </div>
                </div>
                <p style={{ color:"rgba(232,244,255,0.5)",fontSize:11,marginBottom:6 }}>Dx: {c.diag}</p>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <span className="badge" style={{ background:"rgba(0,255,209,0.08)",color:"#00FFD1" }}>✓ Completed</span>
                  <span style={{ color:"#4DB8FF",fontSize:11,fontWeight:600 }}>View Prescription →</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab==="vitals" && (
          <div style={{ animation:"slideUp 0.4s ease" }}>
            <p style={{ fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:14 }}>Health Vitals</p>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16 }}>
              {VITALS.map(v=>(
                <div key={v.label} style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"14px",textAlign:"center" }}>
                  <span style={{ fontSize:26,display:"block",marginBottom:6 }}>{v.icon}</span>
                  <p style={{ fontWeight:800,fontSize:16,color:v.color,marginBottom:3 }}>{v.value}</p>
                  <p style={{ color:"rgba(232,244,255,0.38)",fontSize:10 }}>{v.label}</p>
                </div>
              ))}
            </div>
            <div style={{ background:"rgba(0,255,209,0.05)",border:"1px solid rgba(0,255,209,0.14)",borderRadius:14,padding:"12px 15px" }}>
              <p style={{ color:"rgba(232,244,255,0.5)",fontSize:11,lineHeight:1.7 }}>
                💡 Vitals are updated from your health profile. Go to <strong style={{ color:"#00FFD1" }}>Profile → Health</strong> to update your information.
              </p>
            </div>
          </div>
        )}
        {tab==="docs" && (
          <div style={{ animation:"slideUp 0.4s ease" }}>
            <p style={{ fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:14 }}>Documents & Reports</p>
            {["Blood Test Report — Feb 2026","X-Ray Report — Jan 2026","ECG Report — Mar 2026"].map((d,i)=>(
              <div key={i} style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"13px 15px",marginBottom:10,display:"flex",alignItems:"center",gap:12 }}>
                <span style={{ fontSize:22 }}>📄</span>
                <p style={{ flex:1,fontWeight:600,fontSize:13,color:"#E8F4FF" }}>{d}</p>
                <span style={{ color:"#4DB8FF",fontSize:12,fontWeight:600 }}>⬇️</span>
              </div>
            ))}
            <div style={{ border:"2px dashed rgba(0,255,209,0.2)",borderRadius:14,padding:"20px",textAlign:"center" }}>
              <p style={{ fontSize:28,marginBottom:8 }}>📤</p>
              <p style={{ color:"#00FFD1",fontWeight:700,fontSize:13,marginBottom:3 }}>Upload a Document</p>
              <p style={{ color:"rgba(232,244,255,0.35)",fontSize:11 }}>PDF, JPG, PNG up to 10MB</p>
            </div>
          </div>
        )}
      </div>
      <div style={{ flexShrink:0,display:"flex",background:"rgba(2,13,26,0.97)",backdropFilter:"blur(24px)",borderTop:"1px solid rgba(255,255,255,0.07)" }}>
        {([["history","📋","History"],["vitals","❤️","Vitals"],["docs","📄","Documents"]] as [Tab,string,string][]).map(([t,icon,label])=>(
          <button key={t} className={"ni"+(tab===t?" on":"")} onClick={()=>setTab(t)} style={{ color:tab===t?"#00FFD1":"rgba(232,244,255,0.3)" }}>
            <span style={{ fontSize:19 }}>{icon}</span>
            <span style={{ fontSize:9,fontWeight:tab===t?700:500 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
