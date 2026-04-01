"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Inline helpers — no external imports needed
const getUser  = () => { try { return JSON.parse(localStorage.getItem("digidoc_user") || "null"); } catch { return null; } };
const getToken = () => localStorage.getItem("digidoc_token");

const QUEUE = [
  { id:1, name:"Rahul Verma",  age:28, symptoms:"Fever, Cough", wait:"2 min", urgent:false },
  { id:2, name:"Seema Joshi",  age:45, symptoms:"Chest Pain",   wait:"5 min", urgent:true  },
  { id:3, name:"Aditya Kumar", age:32, symptoms:"Back Pain",    wait:"8 min", urgent:false },
];

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
  .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .gc{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:14px;margin-bottom:11px;transition:all 0.3s}
  .bm{display:flex;align-items:center;justify-content:center;gap:8px;padding:12px 18px;border-radius:13px;font-family:inherit;font-weight:700;font-size:13px;color:white;border:none;cursor:pointer;transition:all 0.3s;background:linear-gradient(135deg,#00C9A7,#0B6FCC);box-shadow:0 0 18px rgba(0,201,167,0.25)}
  .bm:hover{transform:translateY(-1px);filter:brightness(1.1)}
  .bg{display:flex;align-items:center;justify-content:center;gap:7px;padding:11px 16px;border-radius:13px;font-family:inherit;font-weight:600;font-size:12px;color:#00FFD1;border:1px solid rgba(0,255,209,0.22);background:rgba(0,255,209,0.05);cursor:pointer;transition:all 0.2s}
  .bg:hover{background:rgba(0,255,209,0.1)}
  .ni{display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 0;cursor:pointer;border:none;background:none;font-family:inherit;flex:1;border-top:2px solid transparent}
  .ni.on{border-top-color:#00FFD1}
  .livdot{width:8px;height:8px;border-radius:50%;background:#00FFD1;display:inline-block;position:relative}
  .livdot::after{content:'';position:absolute;inset:-4px;border-radius:50%;background:rgba(0,255,209,0.3);animation:ripple 1.8s infinite}
  .toggle{width:44px;height:24px;border-radius:100px;cursor:pointer;transition:all 0.3s;position:relative;border:none;flex-shrink:0}
  .toggle-knob{position:absolute;top:3px;width:18px;height:18px;border-radius:50%;background:white;transition:all 0.3s}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
  .ring{position:absolute;width:100%;height:100%;border-radius:50%;border:2px solid rgba(0,255,209,0.4);animation:ripple 2s infinite}
  .ring2{animation-delay:0.7s}
`;

type Tab = "queue"|"prescribe"|"history"|"profile";

export default function DoctorDashboard() {
  const router = useRouter();
  const [tab, setTab]       = useState<Tab>("queue");
  const [isOnline, setIsOnline] = useState(true);
  const [user, setUser]     = useState<any>(null);

  // Incoming call state (simple — no socket import)
  const [incomingCall, setIncomingCall] = useState<any>(null);

  useEffect(() => {
    const token = getToken();
    const role  = localStorage.getItem("digidoc_role");

    // Redirect if not logged in or wrong role
    if (!token) { router.replace("/login"); return; }
    if (role === "patient") { router.replace("/dashboard"); return; }

    const u = getUser();
    setUser(u);
  }, []);

  const handleAccept = () => {
    if (!incomingCall) return;
    router.push(`/call/${incomingCall.roomId}?role=doctor&userId=${user?.id||'doc1'}&userName=${encodeURIComponent(user?.name||'Doctor')}&callType=${incomingCall.callType}`);
    setIncomingCall(null);
  };

  const displayName = user?.name || "Doctor";
  const firstName   = displayName.split(" ").slice(0,2).join(" ").replace(/^Dr\.\s*/i, "Dr. ");

  return (
    <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#E8F4FF",maxWidth:480,margin:"0 auto",left:0,right:0}}>
      <style>{S}</style>

      {/* INCOMING CALL OVERLAY */}
      {incomingCall && (
        <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(2,13,26,0.92)",backdropFilter:"blur(12px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"fadeIn 0.3s ease"}}>
          <div style={{position:"relative",width:130,height:130,marginBottom:24}}>
            <div className="ring"/><div className="ring ring2"/>
            <div style={{position:"relative",zIndex:2,width:130,height:130,borderRadius:"50%",background:"linear-gradient(135deg,rgba(0,201,167,0.2),rgba(11,111,204,0.2))",border:"2px solid rgba(0,255,209,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:56}}>🧑</div>
          </div>
          <p style={{color:"rgba(232,244,255,0.5)",fontSize:14,marginBottom:6}}>Incoming {incomingCall.callType} call</p>
          <h2 style={{fontSize:28,fontWeight:900,marginBottom:36}}>{incomingCall.patientName}</h2>
          <div style={{display:"flex",gap:48,alignItems:"center"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
              <button onClick={()=>setIncomingCall(null)} style={{width:68,height:68,borderRadius:"50%",background:"linear-gradient(135deg,#FF4B4B,#CC0000)",border:"none",cursor:"pointer",fontSize:28,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 24px rgba(255,75,75,0.45)"}}>📵</button>
              <p style={{color:"rgba(232,244,255,0.5)",fontSize:12}}>Decline</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
              <button onClick={handleAccept} style={{width:68,height:68,borderRadius:"50%",background:"linear-gradient(135deg,#00C9A7,#0B6FCC)",border:"none",cursor:"pointer",fontSize:28,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 24px rgba(0,201,167,0.5)",animation:"pulse 1.5s infinite"}}>📞</button>
              <p style={{color:"#00FFD1",fontSize:12,fontWeight:700}}>Accept</p>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{flexShrink:0,padding:"13px 18px 12px",background:"rgba(2,13,26,0.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <p style={{color:"rgba(232,244,255,0.4)",fontSize:11}}>Doctor Portal</p>
            <h2 style={{fontSize:17,fontWeight:800}} className="shine">{firstName}</h2>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}>
              <p style={{color:isOnline?"#00FFD1":"rgba(232,244,255,0.35)",fontSize:11,fontWeight:600}}>{isOnline?"Online":"Offline"}</p>
              <button className="toggle" onClick={()=>setIsOnline(p=>!p)} style={{background:isOnline?"#00C9A7":"rgba(255,255,255,0.1)"}}>
                <div className="toggle-knob" style={{left:isOnline?23:3}}/>
              </button>
            </div>
            {isOnline && <span className="livdot"/>}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{flex:1,overflowY:"auto",padding:"0 18px"}} className="noscroll">

        {/* ── QUEUE ── */}
        {tab==="queue" && (
          <div style={{paddingTop:14,paddingBottom:14,animation:"slideUp 0.4s ease"}}>
            <div style={{display:"flex",gap:9,marginBottom:16}}>
              {[{n:QUEUE.length,l:"In Queue",c:"#00FFD1"},{n:"42",l:"Today",c:"#4DB8FF"},{n:"4.9★",l:"Rating",c:"#FFB347"}].map(s=>(
                <div key={s.l} style={{flex:1,textAlign:"center",padding:"11px 8px",borderRadius:13,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}>
                  <p style={{fontWeight:900,fontSize:18,color:s.c}}>{s.n}</p>
                  <p style={{fontSize:9,color:"rgba(232,244,255,0.38)",marginTop:2}}>{s.l}</p>
                </div>
              ))}
            </div>

            {!isOnline ? (
              <div style={{background:"rgba(255,107,107,0.07)",border:"1px solid rgba(255,107,107,0.2)",borderRadius:13,padding:"14px 16px",textAlign:"center"}}>
                <p style={{color:"#FF6B6B",fontWeight:700,fontSize:13}}>You are Offline</p>
                <p style={{color:"rgba(255,107,107,0.6)",fontSize:11,marginTop:3}}>Toggle Online above to accept patients</p>
              </div>
            ) : (
              <>
                <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Patient Queue</p>
                {QUEUE.map(p=>(
                  <div key={p.id} className="gc" style={{borderColor:p.urgent?"rgba(255,107,107,0.25)":"rgba(255,255,255,0.07)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}>
                          <p style={{fontWeight:700,fontSize:14,color:"#E8F4FF"}}>{p.name}</p>
                          {p.urgent&&<span style={{padding:"2px 8px",borderRadius:100,background:"rgba(255,107,107,0.12)",color:"#FF6B6B",fontSize:10,fontWeight:700}}>URGENT</span>}
                        </div>
                        <p style={{color:"rgba(232,244,255,0.45)",fontSize:11}}>Age {p.age} · {p.symptoms}</p>
                      </div>
                      <p style={{color:"rgba(232,244,255,0.3)",fontSize:11}}>⏳ {p.wait}</p>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button className="bm" style={{flex:1,padding:"10px"}} onClick={()=>{
                        router.push(`/call/room_${p.id}?role=doctor&userId=${user?.id||'doc1'}&userName=${encodeURIComponent(displayName)}&callType=video`);
                      }}>📹 Video</button>
                      <button className="bg" style={{flex:1}} onClick={()=>{
                        router.push(`/call/room_${p.id}?role=doctor&userId=${user?.id||'doc1'}&userName=${encodeURIComponent(displayName)}&callType=audio`);
                      }}>📞 Audio</button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* ── PRESCRIBE ── */}
        {tab==="prescribe" && (
          <div style={{paddingTop:14,animation:"slideUp 0.4s ease"}}>
            <div className="gc">
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>Write Prescription</p>
              {["Patient Name","Diagnosis","Medicines (one per line)","Doctor's Advice"].map(f=>(
                <div key={f} style={{marginBottom:12}}>
                  <label style={{display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.4)",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{f}</label>
                  <textarea rows={f.includes("Medicines")||f.includes("Advice")?3:1}
                    placeholder={`Enter ${f.toLowerCase()}...`}
                    style={{width:"100%",padding:"10px 12px",borderRadius:11,background:"rgba(255,255,255,0.04)",border:"1.5px solid rgba(255,255,255,0.08)",color:"#E8F4FF",fontFamily:"inherit",fontSize:12,outline:"none",resize:"none",lineHeight:1.6}}/>
                </div>
              ))}
              <button className="bm" style={{width:"100%"}}>💊 Send Prescription</button>
            </div>
          </div>
        )}

        {/* ── HISTORY ── */}
        {tab==="history" && (
          <div style={{paddingTop:14,animation:"slideUp 0.4s ease"}}>
            <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Recent Consultations</p>
            {[{id:"RX-2041",name:"Rahul Verma",diag:"Upper Respiratory Infection",date:"31 Mar",fee:299},{id:"RX-2040",name:"Seema Joshi",diag:"Hypertension Checkup",date:"30 Mar",fee:299}].map(c=>(
              <div key={c.id} className="gc" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF",marginBottom:2}}>{c.name}</p>
                  <p style={{color:"rgba(232,244,255,0.4)",fontSize:11}}>{c.diag}</p>
                  <p style={{color:"rgba(232,244,255,0.28)",fontSize:10,marginTop:1}}>{c.id} · {c.date}</p>
                </div>
                <p style={{color:"#00FFD1",fontWeight:700,fontSize:13}}>₹{c.fee}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── PROFILE ── */}
        {tab==="profile" && (
          <div style={{paddingTop:14,animation:"slideUp 0.4s ease"}}>
            {/* Doctor card */}
            <div style={{background:"linear-gradient(135deg,rgba(0,201,167,0.1),rgba(11,111,204,0.12))",border:"1px solid rgba(0,255,209,0.15)",borderRadius:18,padding:18,marginBottom:16,textAlign:"center"}}>
              <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(0,255,209,0.1)",border:"2px solid rgba(0,255,209,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 10px"}}>👨‍⚕️</div>
              <h3 style={{fontWeight:800,fontSize:17,color:"#E8F4FF",marginBottom:3}}>{displayName}</h3>
              <p style={{color:"#00FFD1",fontSize:12,fontWeight:600,marginBottom:2}}>Doctor</p>
              <p style={{color:"rgba(232,244,255,0.35)",fontSize:11}}>
                {user?.mobile ? `+91 ${user.mobile}` : localStorage.getItem("digidoc_mobile") ? `+91 ${localStorage.getItem("digidoc_mobile")}` : ""}
              </p>
            </div>

            {[
              {icon:"✏️",label:"Edit Profile",      href:"/doctor/profile"},
              {icon:"📅",label:"My Schedule",       href:"/doctor/profile"},
              {icon:"🏦",label:"Bank & Payouts",    href:"/doctor/profile"},
              {icon:"📊",label:"Stats & Reviews",   href:"/doctor/profile"},
              {icon:"❓",label:"Help & Support",    href:"/support"},
            ].map(item=>(
              <a key={item.label} href={item.href} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 15px",borderRadius:13,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",marginBottom:9,textDecoration:"none",color:"#E8F4FF",transition:"all 0.2s"}}>
                <span style={{fontSize:19}}>{item.icon}</span>
                <span style={{fontWeight:600,fontSize:13,flex:1}}>{item.label}</span>
                <span style={{color:"rgba(232,244,255,0.25)",fontSize:13}}>→</span>
              </a>
            ))}

            <button onClick={()=>{localStorage.clear();window.location.href="/login";}}
              style={{width:"100%",padding:"13px",borderRadius:13,background:"rgba(255,107,107,0.07)",border:"1px solid rgba(255,107,107,0.18)",color:"#FF6B6B",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{flexShrink:0,display:"flex",background:"rgba(2,13,26,0.97)",backdropFilter:"blur(24px)",borderTop:"1px solid rgba(255,255,255,0.07)"}}>
        {([["queue","🏥","Queue"],["prescribe","💊","Prescribe"],["history","📋","History"],["profile","👤","Profile"]] as [Tab,string,string][]).map(([t,icon,label])=>(
          <button key={t} className={"ni"+(tab===t?" on":"")} onClick={()=>setTab(t)} style={{color:tab===t?"#00FFD1":"rgba(232,244,255,0.3)"}}>
            <span style={{fontSize:19}}>{icon}</span>
            <span style={{fontSize:9,fontWeight:tab===t?700:500}}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
