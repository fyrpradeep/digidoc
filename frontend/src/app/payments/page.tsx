"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const HISTORY = [
  { id:"PAY-8841",desc:"Consultation — Dr. Priya Sharma", type:"consult", date:"31 Mar 2026",amount:299, status:"paid"    },
  { id:"PAY-8840",desc:"Medicine Order — ORD-9941",        type:"order",   date:"31 Mar 2026",amount:3838,status:"paid"    },
  { id:"PAY-8839",desc:"Consultation — Dr. Arjun Mehta",  type:"consult", date:"15 Mar 2026",amount:599, status:"paid"    },
  { id:"PAY-8838",desc:"Medicine Order — ORD-9938",        type:"order",   date:"2 Mar 2026", amount:580, status:"paid"    },
  { id:"PAY-8837",desc:"Consultation — Dr. Rahul Gupta",  type:"consult", date:"18 Feb 2026",amount:699, status:"refunded"},
];

const METHODS = [
  { id:1, type:"upi",  label:"Google Pay", detail:"rahul@gpay",          default:true  },
  { id:2, type:"card", label:"Visa Card",  detail:"•••• •••• •••• 4242", default:false },
];

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  .gc{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:15px;padding:14px;margin-bottom:10px;transition:all 0.3s}
  .gc:hover{border-color:rgba(0,255,209,0.15)}
  .badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:100px;font-size:10px;font-weight:700}
  .ni{display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 0;cursor:pointer;border:none;background:none;font-family:inherit;flex:1;border-top:2px solid transparent}
  .ni.on{border-top-color:#00FFD1}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
`;

type Tab = "history" | "methods";
export default function PaymentsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("history");
  const total = HISTORY.filter(p=>p.status==="paid").reduce((s,p)=>s+p.amount,0);

  return (
    <div style={{ position:"fixed",inset:0,display:"flex",flexDirection:"column",background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#E8F4FF",maxWidth:480,margin:"0 auto",left:0,right:0 }}>
      <style>{S}</style>
      <div style={{ flexShrink:0,padding:"13px 18px 12px",background:"rgba(2,13,26,0.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:12 }}>
          <button onClick={()=>router.back()} style={{ background:"none",border:"none",color:"#00FFD1",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>← Back</button>
          <h2 style={{ flex:1,fontSize:16,fontWeight:800 }}>Payments</h2>
        </div>
        {/* Summary card */}
        <div style={{ background:"linear-gradient(135deg,rgba(0,201,167,0.14),rgba(11,111,204,0.18))",border:"1px solid rgba(0,255,209,0.18)",borderRadius:14,padding:"13px 16px",marginBottom:12,display:"flex",justifyContent:"space-between" }}>
          <div><p style={{ color:"rgba(232,244,255,0.45)",fontSize:11,marginBottom:3 }}>Total Spent</p><p style={{ fontWeight:900,fontSize:22,color:"#00FFD1" }}>₹{total.toLocaleString()}</p></div>
          <div style={{ textAlign:"right" }}><p style={{ color:"rgba(232,244,255,0.45)",fontSize:11,marginBottom:3 }}>Transactions</p><p style={{ fontWeight:700,fontSize:16,color:"#4DB8FF" }}>{HISTORY.length}</p></div>
        </div>
        <div style={{ display:"flex" }}>
          {([["history","History"],["methods","Payment Methods"]] as [Tab,string][]).map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{ flex:1,padding:"9px",border:"none",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,background:"none",color:tab===t?"#00FFD1":"rgba(232,244,255,0.35)",borderBottom:`2px solid ${tab===t?"#00FFD1":"transparent"}`,transition:"all 0.2s" }}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{ flex:1,overflowY:"auto",padding:"14px 18px" }} className="noscroll">
        {tab==="history" && (
          <div style={{ animation:"slideUp 0.4s ease" }}>
            {HISTORY.map(p=>(
              <div key={p.id} className="gc">
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6 }}>
                  <div>
                    <p style={{ fontWeight:600,fontSize:13,color:"#E8F4FF",marginBottom:2 }}>{p.desc}</p>
                    <p style={{ color:"rgba(232,244,255,0.35)",fontSize:10 }}>{p.id} · {p.date}</p>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ fontWeight:800,fontSize:14,color:p.status==="refunded"?"#FFB347":"#00FFD1",marginBottom:3 }}>
                      {p.status==="refunded"?"-":""}₹{p.amount}
                    </p>
                    <span className="badge" style={{ background:p.status==="paid"?"rgba(0,255,209,0.08)":"rgba(255,179,71,0.1)",color:p.status==="paid"?"#00FFD1":"#FFB347" }}>
                      {p.status==="paid"?"✓ Paid":"↩ Refunded"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {tab==="methods" && (
          <div style={{ animation:"slideUp 0.4s ease" }}>
            {METHODS.map(m=>(
              <div key={m.id} className="gc" style={{ display:"flex",gap:12,alignItems:"center" }}>
                <div style={{ width:44,height:44,borderRadius:13,background:"rgba(0,255,209,0.08)",border:"1px solid rgba(0,255,209,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>
                  {m.type==="upi"?"📱":"💳"}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontWeight:700,fontSize:13,color:"#E8F4FF",marginBottom:2 }}>{m.label}</p>
                  <p style={{ color:"rgba(232,244,255,0.4)",fontSize:11 }}>{m.detail}</p>
                </div>
                {m.default && <span className="badge" style={{ background:"rgba(0,255,209,0.08)",color:"#00FFD1" }}>Default</span>}
              </div>
            ))}
            <button style={{ width:"100%",marginTop:12,padding:"13px",borderRadius:14,background:"rgba(0,255,209,0.05)",border:"2px dashed rgba(0,255,209,0.2)",color:"#00FFD1",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit" }}>
              + Add Payment Method
            </button>
          </div>
        )}
      </div>
      <div style={{ flexShrink:0,display:"flex",background:"rgba(2,13,26,0.97)",backdropFilter:"blur(24px)",borderTop:"1px solid rgba(255,255,255,0.07)" }}>
        {([["history","📊","History"],["methods","💳","Methods"]] as [Tab,string,string][]).map(([t,icon,label])=>(
          <button key={t} className={"ni"+(tab===t?" on":"")} onClick={()=>setTab(t)} style={{ color:tab===t?"#00FFD1":"rgba(232,244,255,0.3)" }}>
            <span style={{ fontSize:19 }}>{icon}</span>
            <span style={{ fontSize:9,fontWeight:tab===t?700:500 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
