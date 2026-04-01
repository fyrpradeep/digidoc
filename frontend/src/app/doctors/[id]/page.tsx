"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const DOCTOR = {
  id: 1, name: "Dr. Priya Sharma", spec: "General Physician",
  exp: "12 yrs", rating: 4.9, reviews: 342, fee: 299,
  online: true, avatar: "👩‍⚕️", reg: "MCI-448291",
  degree: "MBBS, MD (General Medicine)", college: "AIIMS Delhi",
  languages: ["English", "Hindi", "Marathi"],
  about: "Dr. Priya Sharma is a highly experienced General Physician with over 12 years of practice. She specialises in preventive care, chronic disease management, and acute illness treatment. She is known for her thorough approach and patient-friendly communication style.",
  specialisations: ["Fever & Infections", "Diabetes Management", "Hypertension", "General Health Checkup", "Preventive Care", "Cold & Flu"],
  availability: [
    { day: "Mon – Fri", slots: ["9:00 AM – 1:00 PM", "5:00 PM – 9:00 PM"] },
    { day: "Saturday",  slots: ["10:00 AM – 2:00 PM"] },
    { day: "Sunday",    slots: [] },
  ],
  stats: { consultations: 1240, satisfaction: 97, avgResponse: "2 min", repeat: 78 },
};

const REVIEWS = [
  { name: "Rahul V.", stars: 5, date: "31 Mar", text: "Very thorough and patient. Diagnosed my issue correctly and explained everything clearly. Highly recommend!" },
  { name: "Seema J.", stars: 5, date: "28 Mar", text: "Excellent doctor! She took time to understand my history and gave very practical advice." },
  { name: "Aditya K.",stars: 4, date: "25 Mar", text: "Good consultation. Would have preferred a bit more time for questions but overall satisfied." },
  { name: "Meena S.", stars: 5, date: "20 Mar", text: "Best doctor on DigiDoc! She remembered my previous consultation and followed up proactively." },
];

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .bm{display:flex;align-items:center;justify-content:center;gap:8px;padding:15px;border-radius:14px;font-family:inherit;font-weight:800;font-size:14px;color:white;border:none;cursor:pointer;transition:all 0.3s;background:linear-gradient(135deg,#00C9A7,#0B6FCC);box-shadow:0 0 22px rgba(0,201,167,0.28)}
  .bm:hover{transform:translateY(-2px);box-shadow:0 0 34px rgba(0,201,167,0.44)}
  .bg{display:flex;align-items:center;justify-content:center;gap:8px;padding:14px;border-radius:14px;font-family:inherit;font-weight:600;font-size:13px;color:#00FFD1;border:1px solid rgba(0,255,209,0.24);background:rgba(0,255,209,0.05);cursor:pointer;transition:all 0.3s}
  .bg:hover{background:rgba(0,255,209,0.1);border-color:rgba(0,255,209,0.44)}
  .tab-btn{flex:1;padding:11px;border:none;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;transition:all 0.2s;border-bottom:2px solid transparent;background:none}
  .tab-btn.on{border-bottom-color:#00FFD1;color:#00FFD1}
  .gc{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:16px;margin-bottom:13px}
  .livdot{width:8px;height:8px;border-radius:50%;background:#00FFD1;display:inline-block;position:relative;flex-shrink:0}
  .livdot::after{content:'';position:absolute;inset:-3px;border-radius:50%;background:rgba(0,255,209,0.3);animation:ripple 1.8s infinite}
  .badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:100px;font-size:10px;font-weight:700}
  .spec-chip{padding:6px 12px;border-radius:100px;background:rgba(0,255,209,0.07);border:1px solid rgba(0,255,209,0.15);color:rgba(232,244,255,0.65);font-family:inherit;font-size:11px;font-weight:600;flex-shrink:0}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
`;

type Tab = "about" | "slots" | "reviews";

export default function DoctorDetailPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("about");
  const [liked, setLiked] = useState(false);

  return (
    <div style={{ position:"fixed",inset:0,display:"flex",flexDirection:"column", background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#E8F4FF",maxWidth:480,margin:"0 auto", left:0,right:0 }}>
      <style>{S}</style>

      {/* HEADER */}
      <div style={{ flexShrink:0, padding:"13px 18px 0", background:"rgba(2,13,26,0.97)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:14 }}>
          <button onClick={()=>router.back()} style={{ background:"none",border:"none",color:"#00FFD1",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>← Back</button>
          <h2 style={{ flex:1,fontSize:15,fontWeight:800 }}>Doctor Profile</h2>
          <button onClick={()=>setLiked(p=>!p)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:22 }}>
            {liked ? "❤️" : "🤍"}
          </button>
        </div>

        {/* Doctor card */}
        <div style={{ display:"flex",gap:14,alignItems:"flex-start",marginBottom:14 }}>
          <div style={{ width:68,height:68,borderRadius:20,background:"rgba(0,255,209,0.08)",border:"1.5px solid rgba(0,255,209,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,flexShrink:0 }}>
            {DOCTOR.avatar}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:3 }}>
              <h1 style={{ fontSize:16,fontWeight:800,color:"#E8F4FF" }}>{DOCTOR.name}</h1>
              {DOCTOR.online && <span className="livdot"/>}
            </div>
            <p style={{ color:"#00FFD1",fontSize:12,fontWeight:600,marginBottom:5 }}>{DOCTOR.spec} · {DOCTOR.exp}</p>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
              <span className="badge" style={{ background:"rgba(255,179,71,0.1)",color:"#FFB347" }}>⭐ {DOCTOR.rating}</span>
              <span className="badge" style={{ background:"rgba(0,255,209,0.08)",color:"#00FFD1" }}>✓ MCI Verified</span>
              <span className="badge" style={{ background:"rgba(77,184,255,0.08)",color:"#4DB8FF" }}>{DOCTOR.reviews} reviews</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex" }}>
          {([["about","ℹ️ About"],["slots","📅 Availability"],["reviews","⭐ Reviews"]] as [Tab,string][]).map(([t,l])=>(
            <button key={t} className={"tab-btn"+(tab===t?" on":"")} onClick={()=>setTab(t)} style={{ color:tab===t?"#00FFD1":"rgba(232,244,255,0.35)" }}>{l}</button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex:1,overflowY:"auto",padding:"14px 18px"}} className="noscroll">

        {/* ABOUT TAB */}
        {tab === "about" && (
          <div style={{ animation:"slideUp 0.4s ease" }}>
            {/* Stats */}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9,marginBottom:16 }}>
              {[
                { n: DOCTOR.stats.consultations.toLocaleString(), l:"Consultations", c:"#00FFD1" },
                { n: DOCTOR.stats.satisfaction+"%",               l:"Satisfaction",  c:"#4DB8FF" },
                { n: DOCTOR.stats.avgResponse,                    l:"Avg Response",  c:"#FFB347" },
                { n: DOCTOR.stats.repeat+"%",                     l:"Repeat Patients",c:"#A78BFA" },
              ].map(s=>(
                <div key={s.l} style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:13,padding:"10px 6px",textAlign:"center" }}>
                  <p style={{ fontWeight:800,fontSize:13,color:s.c }}>{s.n}</p>
                  <p style={{ fontSize:8,color:"rgba(232,244,255,0.35)",marginTop:2,lineHeight:1.3 }}>{s.l}</p>
                </div>
              ))}
            </div>

            {/* About */}
            <div className="gc">
              <p style={{ fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:10 }}>About</p>
              <p style={{ color:"rgba(232,244,255,0.6)",fontSize:12,lineHeight:1.8 }}>{DOCTOR.about}</p>
            </div>

            {/* Education */}
            <div className="gc">
              <p style={{ fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:12 }}>Education & Credentials</p>
              {[
                { icon:"🎓",label:"Degree",     value:DOCTOR.degree  },
                { icon:"🏫",label:"College",    value:DOCTOR.college  },
                { icon:"📋",label:"Reg. Number",value:DOCTOR.reg      },
                { icon:"💬",label:"Languages",  value:DOCTOR.languages.join(" · ") },
              ].map(item=>(
                <div key={item.label} style={{ display:"flex",gap:10,marginBottom:10,alignItems:"flex-start" }}>
                  <span style={{ fontSize:18,flexShrink:0 }}>{item.icon}</span>
                  <div>
                    <p style={{ color:"rgba(232,244,255,0.35)",fontSize:10,marginBottom:2 }}>{item.label}</p>
                    <p style={{ color:"#E8F4FF",fontSize:12,fontWeight:600 }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Specialisations */}
            <div className="gc">
              <p style={{ fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:10 }}>Treats / Specialises in</p>
              <div style={{ display:"flex",gap:7,flexWrap:"wrap" }}>
                {DOCTOR.specialisations.map(s=>(
                  <span key={s} className="spec-chip">{s}</span>
                ))}
              </div>
            </div>

            {/* Fee */}
            <div style={{ background:"rgba(0,255,209,0.06)",border:"1px solid rgba(0,255,209,0.16)",borderRadius:14,padding:"13px 16px",marginBottom:13,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <div>
                <p style={{ color:"rgba(232,244,255,0.4)",fontSize:11,marginBottom:2 }}>Consultation Fee</p>
                <p style={{ fontWeight:900,fontSize:22,color:"#00FFD1" }}>₹{DOCTOR.fee}</p>
              </div>
              <div style={{ textAlign:"right" }}>
                <p style={{ color:"rgba(232,244,255,0.4)",fontSize:11 }}>Duration</p>
                <p style={{ color:"#E8F4FF",fontWeight:600,fontSize:13 }}>20–30 min</p>
              </div>
            </div>
          </div>
        )}

        {/* SLOTS TAB */}
        {tab === "slots" && (
          <div style={{ animation:"slideUp 0.4s ease" }}>
            <p style={{ color:"rgba(232,244,255,0.45)",fontSize:13,marginBottom:18,lineHeight:1.7 }}>
              {DOCTOR.name} is currently{" "}
              <span style={{ color:DOCTOR.online?"#00FFD1":"rgba(232,244,255,0.3)", fontWeight:700 }}>{DOCTOR.online?"Online":"Offline"}</span>.
              {DOCTOR.online && " You can consult right now!"}
            </p>

            {/* Instant consult */}
            {DOCTOR.online && (
              <div style={{ background:"rgba(0,255,209,0.07)",border:"1px solid rgba(0,255,209,0.2)",borderRadius:16,padding:"15px 17px",marginBottom:16,display:"flex",gap:12,alignItems:"center" }}>
                <span className="livdot" style={{ width:10,height:10 }}/>
                <div>
                  <p style={{ color:"#00FFD1",fontWeight:700,fontSize:13 }}>Available for Instant Consultation</p>
                  <p style={{ color:"rgba(0,255,209,0.6)",fontSize:11,marginTop:2 }}>Expected wait: under 2 minutes</p>
                </div>
              </div>
            )}

            {/* Weekly schedule */}
            <p style={{ fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:12 }}>Weekly Schedule</p>
            {DOCTOR.availability.map((a,i)=>(
              <div key={i} style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"13px 15px",marginBottom:9 }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                  <p style={{ fontWeight:700,fontSize:13,color:"#E8F4FF",marginBottom:6 }}>{a.day}</p>
                  {a.slots.length === 0 && <span className="badge" style={{ background:"rgba(255,255,255,0.06)",color:"rgba(232,244,255,0.3)" }}>Off</span>}
                </div>
                {a.slots.length > 0 ? (
                  <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                    {a.slots.map((slot,si)=>(
                      <span key={si} style={{ padding:"5px 12px",borderRadius:100,background:"rgba(0,255,209,0.08)",border:"1px solid rgba(0,255,209,0.2)",color:"#00FFD1",fontSize:11,fontWeight:600 }}>{slot}</span>
                    ))}
                  </div>
                ) : (
                  <p style={{ color:"rgba(232,244,255,0.28)",fontSize:11 }}>Not available</p>
                )}
              </div>
            ))}

            <div style={{ background:"rgba(255,179,71,0.06)",border:"1px solid rgba(255,179,71,0.15)",borderRadius:12,padding:"10px 14px" }}>
              <p style={{ color:"rgba(255,179,71,0.8)",fontSize:11,lineHeight:1.6 }}>
                ⚠️ Schedules may vary. Instant consultation is available when the doctor is online regardless of scheduled slots.
              </p>
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {tab === "reviews" && (
          <div style={{ animation:"slideUp 0.4s ease" }}>
            {/* Rating summary */}
            <div style={{ background:"rgba(255,179,71,0.06)",border:"1px solid rgba(255,179,71,0.14)",borderRadius:16,padding:"16px",marginBottom:16,display:"flex",gap:16,alignItems:"center" }}>
              <div style={{ textAlign:"center",flexShrink:0 }}>
                <p style={{ fontWeight:900,fontSize:40,color:"#FFB347",lineHeight:1 }}>{DOCTOR.rating}</p>
                <div style={{ display:"flex",gap:2,justifyContent:"center",margin:"5px 0 2px" }}>
                  {Array.from({length:5}).map((_,i)=><span key={i} style={{ color:"#FFB347",fontSize:14 }}>★</span>)}
                </div>
                <p style={{ color:"rgba(232,244,255,0.35)",fontSize:10 }}>{DOCTOR.reviews} reviews</p>
              </div>
              <div style={{ flex:1 }}>
                {[5,4,3,2,1].map(n=>{
                  const pct = n===5?70:n===4?20:n===3?7:n===2?2:1;
                  return (
                    <div key={n} style={{ display:"flex",alignItems:"center",gap:7,marginBottom:4 }}>
                      <span style={{ color:"#FFB347",fontSize:10,width:8 }}>{n}</span>
                      <span style={{ color:"#FFB347",fontSize:10 }}>★</span>
                      <div style={{ flex:1,height:5,borderRadius:100,background:"rgba(255,255,255,0.07)",overflow:"hidden" }}>
                        <div style={{ width:pct+"%",height:"100%",borderRadius:100,background:"#FFB347" }}/>
                      </div>
                      <span style={{ color:"rgba(232,244,255,0.35)",fontSize:9,width:24 }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {REVIEWS.map((r,i)=>(
              <div key={i} style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:15,padding:"14px",marginBottom:10 }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                  <div style={{ display:"flex",gap:3 }}>
                    {Array.from({length:5}).map((_,j)=><span key={j} style={{ color:j<r.stars?"#FFB347":"rgba(255,255,255,0.12)",fontSize:13 }}>★</span>)}
                  </div>
                  <p style={{ color:"rgba(232,244,255,0.28)",fontSize:10 }}>{r.date}</p>
                </div>
                <p style={{ color:"rgba(232,244,255,0.65)",fontSize:12,lineHeight:1.7,marginBottom:6 }}>{r.text}</p>
                <p style={{ color:"rgba(232,244,255,0.35)",fontSize:10,fontWeight:600 }}>— {r.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM BOOK BUTTONS */}
      <div style={{ flexShrink:0,padding:"12px 18px 18px",background:"rgba(2,13,26,0.97)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display:"flex",gap:10,marginBottom:8 }}>
          <button className="bm" style={{ flex:2 }} onClick={()=>router.push("/call/1")}>
            📹 Video Consult — ₹{DOCTOR.fee}
          </button>
          <button className="bg" style={{ flex:1 }} onClick={()=>router.push("/call/1")}>
            📞 Audio
          </button>
        </div>
        <p style={{ color:"rgba(232,244,255,0.25)",fontSize:10,textAlign:"center" }}>
          🔒 Secure · Encrypted · No third-party
        </p>
      </div>
    </div>
  );
}
