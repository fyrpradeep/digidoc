"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const getUser  = () => { try { return JSON.parse(localStorage.getItem("digidoc_user")||"null"); } catch { return null; } };
const getToken = () => { try { return localStorage.getItem("digidoc_token")||""; } catch { return ""; } };

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
  @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .gc{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:14px;margin-bottom:11px}
  .bm{display:flex;align-items:center;justify-content:center;gap:8px;padding:12px 18px;border-radius:13px;font-family:inherit;font-weight:700;font-size:13px;color:white;border:none;cursor:pointer;background:linear-gradient(135deg,#00C9A7,#0B6FCC);transition:all 0.2s}
  .bm:hover{filter:brightness(1.1)}
  .bg{display:flex;align-items:center;justify-content:center;gap:7px;padding:11px 16px;border-radius:13px;font-family:inherit;font-weight:600;font-size:12px;color:#00FFD1;border:1px solid rgba(0,255,209,0.22);background:rgba(0,255,209,0.05);cursor:pointer}
  .ni{display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 0;cursor:pointer;border:none;background:none;font-family:inherit;flex:1;border-top:2px solid transparent}
  .ni.on{border-top-color:#00FFD1}
  .livdot{width:8px;height:8px;border-radius:50%;background:#00FFD1;display:inline-block;position:relative}
  .livdot::after{content:'';position:absolute;inset:-4px;border-radius:50%;background:rgba(0,255,209,0.3);animation:ripple 1.8s infinite}
  .toggle{width:44px;height:24px;border-radius:100px;cursor:pointer;transition:all 0.3s;position:relative;border:none;flex-shrink:0}
  .toggle-knob{position:absolute;top:3px;width:18px;height:18px;border-radius:50%;background:white;transition:all 0.3s}
  .ring{position:absolute;width:100%;height:100%;border-radius:50%;border:2px solid rgba(0,255,209,0.4);animation:ripple 2s infinite}
  .ring2{animation-delay:0.7s}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
`;

type Tab = "queue"|"prescribe"|"history"|"profile";

export default function DoctorDashboard() {
  const router = useRouter();
  const [tab, setTab]       = useState<Tab>("queue");
  const [isOnline, setIsOnline] = useState(false);
  const [user, setUser]     = useState<any>(null);
  const [incoming, setIncoming] = useState<any>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const token = getToken();
    const role  = localStorage.getItem("digidoc_role");
    if (!token) { router.replace("/login"); return; }
    if (role === "patient") { router.replace("/dashboard"); return; }
    const u = getUser();
    setUser(u);
    if (u?.id) connectSocket(u);
  }, []);

  const connectSocket = (u: any) => {
    const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL||"http://localhost:4000/api").replace("/api","");
    // Dynamic import to avoid SSR issues
    import("socket.io-client").then(({ io }) => {
      const socket = io(`${SOCKET_URL}/call`, { transports: ["websocket"] });
      socketRef.current = socket;
      socket.on("connect", () => {
        socket.emit("register", { userId: u.id, role: "doctor", name: u.name || "Doctor" });
        console.log("🔌 Doctor socket connected");
      });
      socket.on("call:incoming", (data: any) => {
        setIncoming(data);
      });
      socket.on("call:ended", () => setIncoming(null));
    }).catch(() => console.log("Socket not available"));
  };

  const handleAccept = () => {
    if (!incoming || !socketRef.current) return;
    socketRef.current.emit("call:accept", {
      roomId: incoming.roomId,
      doctorId: user?.id || "doc1",
      doctorName: user?.name || "Doctor",
    });
    setIncoming(null);
    router.push(`/call/${incoming.roomId}?role=doctor&userId=${user?.id||'doc1'}&userName=${encodeURIComponent(user?.name||'Doctor')}&callType=${incoming.callType||'video'}`);
  };

  const handleReject = () => {
    if (!incoming || !socketRef.current) return;
    socketRef.current.emit("call:reject", { roomId: incoming.roomId, doctorId: user?.id });
    setIncoming(null);
  };

  const toggleOnline = async (val: boolean) => {
    setIsOnline(val);
    // Update online status in backend
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL||"http://localhost:4000/api"}/doctors/me/online`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` },
        body: JSON.stringify({ isOnline: val }),
      });
    } catch {}
    // Register/unregister with socket
    if (socketRef.current && user?.id) {
      if (val) socketRef.current.emit("register", { userId: user.id, role: "doctor", name: user.name });
    }
  };

  const displayName = user?.name || "Doctor";

  return (
    <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#E8F4FF"}}>
      <style>{S}</style>

      {/* INCOMING CALL OVERLAY */}
      {incoming && (
        <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(2,13,26,0.94)",backdropFilter:"blur(14px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"fadeIn 0.3s ease"}}>
          <div style={{position:"relative",width:130,height:130,marginBottom:20}}>
            <div className="ring"/><div className="ring ring2"/>
            <div style={{position:"relative",zIndex:2,width:130,height:130,borderRadius:"50%",background:"linear-gradient(135deg,rgba(0,201,167,0.2),rgba(11,111,204,0.2))",border:"2px solid rgba(0,255,209,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:56}}>🧑</div>
          </div>
          <p style={{color:"rgba(232,244,255,0.5)",fontSize:14,marginBottom:6}}>Incoming {incoming.callType||"video"} call</p>
          <h2 style={{fontSize:28,fontWeight:900,marginBottom:36}}>{incoming.patientName||"Patient"}</h2>
          <div style={{display:"flex",gap:48}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
              <button onClick={handleReject} style={{width:68,height:68,borderRadius:"50%",background:"linear-gradient(135deg,#FF4B4B,#CC0000)",border:"none",cursor:"pointer",fontSize:28,display:"flex",alignItems:"center",justifyContent:"center"}}>📵</button>
              <p style={{color:"rgba(232,244,255,0.5)",fontSize:12}}>Decline</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
              <button onClick={handleAccept} style={{width:68,height:68,borderRadius:"50%",background:"linear-gradient(135deg,#00C9A7,#0B6FCC)",border:"none",cursor:"pointer",fontSize:28,display:"flex",alignItems:"center",justifyContent:"center",animation:"pulse 1.5s infinite"}}>📞</button>
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
            <h2 style={{fontSize:17,fontWeight:800}} className="shine">{displayName}</h2>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <p style={{color:isOnline?"#00FFD1":"rgba(232,244,255,0.35)",fontSize:11,fontWeight:600}}>{isOnline?"Online":"Offline"}</p>
            <button className="toggle" onClick={()=>toggleOnline(!isOnline)} style={{background:isOnline?"#00C9A7":"rgba(255,255,255,0.1)"}}>
              <div className="toggle-knob" style={{left:isOnline?23:3}}/>
            </button>
            {isOnline&&<span className="livdot"/>}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{flex:1,overflowY:"auto",padding:"0 18px"}} className="noscroll">
        {tab==="queue"&&(
          <div style={{paddingTop:14,animation:"slideUp 0.4s ease"}}>
            <div style={{display:"flex",gap:9,marginBottom:14}}>
              {[{n:"0",l:"In Queue",c:"#00FFD1"},{n:"0",l:"Today",c:"#4DB8FF"},{n:"—",l:"Rating",c:"#FFB347"}].map(s=>(
                <div key={s.l} style={{flex:1,textAlign:"center",padding:"11px 8px",borderRadius:13,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}>
                  <p style={{fontWeight:900,fontSize:18,color:s.c}}>{s.n}</p>
                  <p style={{fontSize:9,color:"rgba(232,244,255,0.38)",marginTop:2}}>{s.l}</p>
                </div>
              ))}
            </div>
            {!isOnline?(
              <div style={{background:"rgba(255,107,107,0.07)",border:"1px solid rgba(255,107,107,0.2)",borderRadius:13,padding:"16px",textAlign:"center",marginTop:20}}>
                <p style={{fontSize:32,marginBottom:8}}>😴</p>
                <p style={{color:"#FF6B6B",fontWeight:700,fontSize:14}}>You are Offline</p>
                <p style={{color:"rgba(255,107,107,0.6)",fontSize:12,marginTop:4}}>Toggle Online above to receive patient calls</p>
              </div>
            ):(
              <div style={{background:"rgba(0,255,209,0.05)",border:"1px solid rgba(0,255,209,0.15)",borderRadius:14,padding:"16px",textAlign:"center",marginTop:10}}>
                <div className="livdot" style={{margin:"0 auto 10px"}}/>
                <p style={{color:"#00FFD1",fontWeight:700,fontSize:14,marginBottom:4}}>You are Online</p>
                <p style={{color:"rgba(232,244,255,0.45)",fontSize:12}}>Waiting for patient calls...</p>
                <p style={{color:"rgba(232,244,255,0.3)",fontSize:11,marginTop:6}}>Incoming call will appear as popup</p>
              </div>
            )}
          </div>
        )}
        {tab==="prescribe"&&(
          <div style={{paddingTop:14}}>
            <div className="gc">
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>Write Prescription</p>
              {["Patient Name","Diagnosis","Medicines","Advice"].map(f=>(
                <div key={f} style={{marginBottom:12}}>
                  <label style={{display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.4)",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{f}</label>
                  <textarea rows={f==="Medicines"||f==="Advice"?3:1} placeholder={`Enter ${f.toLowerCase()}...`}
                    style={{width:"100%",padding:"10px 12px",borderRadius:11,background:"rgba(255,255,255,0.04)",border:"1.5px solid rgba(255,255,255,0.08)",color:"#E8F4FF",fontFamily:"inherit",fontSize:12,outline:"none",resize:"none",lineHeight:1.6}}/>
                </div>
              ))}
              <button className="bm" style={{width:"100%"}}>💊 Send Prescription</button>
            </div>
          </div>
        )}
        {tab==="history"&&(
          <div style={{paddingTop:14}}>
            <div style={{textAlign:"center",padding:"40px 20px"}}>
              <p style={{fontSize:36,marginBottom:10}}>📋</p>
              <p style={{fontWeight:700,fontSize:14,color:"#E8F4FF",marginBottom:4}}>No consultations yet</p>
              <p style={{color:"rgba(232,244,255,0.38)",fontSize:12}}>Your consultation history will appear here</p>
            </div>
          </div>
        )}
        {tab==="profile"&&(
          <div style={{paddingTop:14}}>
            <div style={{background:"linear-gradient(135deg,rgba(0,201,167,0.1),rgba(11,111,204,0.12))",border:"1px solid rgba(0,255,209,0.15)",borderRadius:18,padding:18,marginBottom:14,textAlign:"center"}}>
              <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(0,255,209,0.1)",border:"2px solid rgba(0,255,209,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 10px"}}>👨‍⚕️</div>
              <h3 style={{fontWeight:800,fontSize:17,color:"#E8F4FF",marginBottom:3}}>{displayName}</h3>
              <p style={{color:"#00FFD1",fontSize:12,fontWeight:600}}>Doctor</p>
              <p style={{color:"rgba(232,244,255,0.35)",fontSize:11,marginTop:2}}>{user?.mobile?`+91 ${user.mobile}`:""}</p>
            </div>
            {[{icon:"✏️",l:"Edit Profile",h:"/doctor/profile"},{icon:"❓",l:"Help",h:"/support"}].map(item=>(
              <a key={item.l} href={item.h} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 15px",borderRadius:13,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",marginBottom:9,textDecoration:"none",color:"#E8F4FF"}}>
                <span style={{fontSize:19}}>{item.icon}</span>
                <span style={{fontWeight:600,fontSize:13,flex:1}}>{item.l}</span>
                <span style={{color:"rgba(232,244,255,0.25)"}}>→</span>
              </a>
            ))}
            <button onClick={()=>{localStorage.clear();window.location.href="/login";}}
              style={{width:"100%",padding:"13px",borderRadius:13,background:"rgba(255,107,107,0.07)",border:"1px solid rgba(255,107,107,0.18)",color:"#FF6B6B",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
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
