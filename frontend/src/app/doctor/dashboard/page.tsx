"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const getUser  = () => { try { return JSON.parse(localStorage.getItem("digidoc_user")||"null"); } catch { return null; } };
const getToken = () => { try { return localStorage.getItem("digidoc_token")||""; } catch { return ""; } };
const getMobile = () => { try { return localStorage.getItem("digidoc_mobile")||""; } catch { return ""; } };

const S = `
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
  @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
  .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .gc{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:14px;margin-bottom:11px}
  .bm{display:flex;align-items:center;justify-content:center;gap:8px;padding:12px 18px;border-radius:13px;font-family:inherit;font-weight:700;font-size:13px;color:white;border:none;cursor:pointer;background:linear-gradient(135deg,#00C9A7,#0B6FCC);transition:all 0.2s}
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
  const [socketStatus, setSocketStatus] = useState("disconnected");
  const socketRef = useRef<any>(null);

  useEffect(()=>{
    const token = getToken();
    const role  = localStorage.getItem("digidoc_role");
    if(!token){ router.replace("/login"); return; }
    if(role==="patient"){ router.replace("/dashboard"); return; }
    const u = getUser();
    setUser(u);
  },[]);

  // Connect socket when going online
  const connectSocket = (u: any) => {
    if(socketRef.current?.connected) return;

    const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL||"http://localhost:4000/api").replace("/api","");

    import("socket.io-client").then(({io})=>{
      const socket = io(`${SOCKET_URL}/call`,{
        transports:["websocket","polling"],
        reconnection: true,
        reconnectionAttempts: 5,
      });
      socketRef.current = socket;

      socket.on("connect",()=>{
        setSocketStatus("connected");
        // Register with mobile number as ID — this is what patient will use to call
        const doctorId = u?.id || u?.mobile || getMobile();
        socket.emit("register",{
          userId: doctorId,
          role: "doctor",
          name: u?.name||"Doctor",
        });
        console.log("✅ Doctor registered with ID:", doctorId);
      });

      socket.on("disconnect",()=>setSocketStatus("disconnected"));

      socket.on("call:incoming",(data:any)=>{
        console.log("📞 Incoming call from:", data.patientName);
        setIncoming(data);
        // Play sound
        try{
          const ctx = new AudioContext();
          [0,700,1400].forEach(delay=>{
            setTimeout(()=>{
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain); gain.connect(ctx.destination);
              osc.frequency.value = 440;
              gain.gain.setValueAtTime(0.3,ctx.currentTime);
              osc.start(); osc.stop(ctx.currentTime+0.4);
            },delay);
          });
        }catch{}
      });

      socket.on("call:ended",()=>setIncoming(null));
    }).catch(err=>console.log("Socket error:",err));
  };

  const disconnectSocket = () => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    setSocketStatus("disconnected");
  };

  const toggleOnline = (val: boolean) => {
    setIsOnline(val);
    if(val){
      connectSocket(user);
    } else {
      disconnectSocket();
    }
  };

  const handleAccept = () => {
    if(!incoming) return;
    const u = user;
    socketRef.current?.emit("call:accept",{
      roomId: incoming.roomId,
      doctorId: u?.id||u?.mobile||getMobile(),
      doctorName: u?.name||"Doctor",
    });
    const roomId = incoming.roomId;
    const doctorName = encodeURIComponent(u?.name||"Doctor");
    setIncoming(null);
    router.push(`/call/${roomId}?role=doctor&userId=${u?.id||getMobile()}&userName=${doctorName}&callType=${incoming.callType||"video"}`);
  };

  const handleReject = () => {
    socketRef.current?.emit("call:reject",{
      roomId: incoming?.roomId,
      doctorId: user?.id||getMobile(),
    });
    setIncoming(null);
  };

  const displayName = user?.name||"Doctor";

  return(
    <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#E8F4FF"}}>
      <style>{S}</style>

      {/* INCOMING CALL OVERLAY */}
      {incoming&&(
        <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(2,13,26,0.94)",backdropFilter:"blur(14px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"fadeIn 0.3s ease"}}>
          <div style={{position:"relative",width:130,height:130,marginBottom:20}}>
            <div className="ring"/><div className="ring ring2"/>
            <div style={{position:"relative",zIndex:2,width:130,height:130,borderRadius:"50%",background:"linear-gradient(135deg,rgba(0,201,167,0.2),rgba(11,111,204,0.2))",border:"2px solid rgba(0,255,209,0.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:56}}>🧑</div>
          </div>
          <p style={{color:"rgba(232,244,255,0.5)",fontSize:14,marginBottom:6}}>Incoming {incoming.callType||"video"} call</p>
          <h2 style={{fontSize:28,fontWeight:900,marginBottom:6}}>{incoming.patientName}</h2>
          <p style={{color:"rgba(232,244,255,0.35)",fontSize:12,marginBottom:36}}>Patient</p>
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
            {isOnline&&socketStatus==="connected"&&<span className="livdot"/>}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{flex:1,overflowY:"auto",padding:"0 18px"}} className="noscroll">
        {tab==="queue"&&(
          <div style={{paddingTop:14,animation:"slideUp 0.4s ease"}}>
            {!isOnline?(
              <div style={{textAlign:"center",padding:"40px 20px"}}>
                <p style={{fontSize:48,marginBottom:12}}>😴</p>
                <p style={{color:"#FF6B6B",fontWeight:700,fontSize:15,marginBottom:6}}>You are Offline</p>
                <p style={{color:"rgba(232,244,255,0.4)",fontSize:13,marginBottom:20}}>Toggle Online above to receive patient calls</p>
                <button className="bm" style={{width:"auto",padding:"12px 24px"}} onClick={()=>toggleOnline(true)}>Go Online</button>
              </div>
            ):(
              <div>
                {socketStatus==="connected"?(
                  <div style={{background:"rgba(0,255,209,0.05)",border:"1px solid rgba(0,255,209,0.2)",borderRadius:16,padding:20,textAlign:"center",marginTop:10}}>
                    <div style={{display:"flex",justifyContent:"center",marginBottom:10}}>
                      <span className="livdot"/>
                    </div>
                    <p style={{color:"#00FFD1",fontWeight:800,fontSize:16,marginBottom:6}}>You are Live!</p>
                    <p style={{color:"rgba(232,244,255,0.45)",fontSize:13,lineHeight:1.7}}>
                      Patients can now call you.<br/>
                      Incoming call will appear as a popup.
                    </p>
                    <div style={{marginTop:14,padding:"10px 14px",borderRadius:12,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)"}}>
                      <p style={{color:"rgba(232,244,255,0.35)",fontSize:11}}>Your Doctor ID</p>
                      <p style={{color:"#4DB8FF",fontWeight:700,fontSize:13,marginTop:2}}>{user?.id||getMobile()}</p>
                    </div>
                  </div>
                ):(
                  <div style={{textAlign:"center",padding:"32px 20px"}}>
                    <p style={{fontSize:32,marginBottom:8}}>🔄</p>
                    <p style={{color:"#FFB347",fontWeight:700,fontSize:14}}>Connecting...</p>
                    <p style={{color:"rgba(232,244,255,0.4)",fontSize:12,marginTop:4}}>Setting up your connection</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab==="prescribe"&&(
          <div style={{paddingTop:14}}>
            <div className="gc">
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>Write Prescription</p>
              {["Patient Name","Diagnosis","Medicines (one per line)","Doctor's Advice"].map(f=>(
                <div key={f} style={{marginBottom:12}}>
                  <label style={{display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.4)",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{f}</label>
                  <textarea rows={f.includes("Medicines")||f.includes("Advice")?3:1} placeholder={`Enter ${f.toLowerCase()}...`}
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
              <p style={{color:"rgba(232,244,255,0.38)",fontSize:12}}>History will appear here after calls</p>
            </div>
          </div>
        )}

        {tab==="profile"&&(
          <div style={{paddingTop:14}}>
            <div style={{background:"linear-gradient(135deg,rgba(0,201,167,0.1),rgba(11,111,204,0.12))",border:"1px solid rgba(0,255,209,0.15)",borderRadius:18,padding:18,marginBottom:14,textAlign:"center"}}>
              <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(0,255,209,0.1)",border:"2px solid rgba(0,255,209,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 10px"}}>👨‍⚕️</div>
              <h3 style={{fontWeight:800,fontSize:17,color:"#E8F4FF",marginBottom:3}}>{displayName}</h3>
              <p style={{color:"#00FFD1",fontSize:12,fontWeight:600}}>Doctor</p>
              <p style={{color:"rgba(232,244,255,0.35)",fontSize:11,marginTop:2}}>+91 {user?.mobile||getMobile()}</p>
            </div>
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
