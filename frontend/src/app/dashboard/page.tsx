"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const getToken  = () => { try { return localStorage.getItem("digidoc_token")||""; } catch { return ""; } };
const getUser   = () => { try { return JSON.parse(localStorage.getItem("digidoc_user")||"null"); } catch { return null; } };
const getMobile = () => { try { return localStorage.getItem("digidoc_mobile")||""; } catch { return ""; } };

async function apiFetch(path:string){
  try{
    const r = await fetch(`${API}${path}`,{headers:{Authorization:`Bearer ${getToken()}`}});
    if(!r.ok) return null;
    return await r.json();
  }catch{ return null; }
}

const S = `
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .gc{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:14px;margin-bottom:11px;transition:all 0.3s}
  .bm{display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border-radius:13px;font-family:inherit;font-weight:700;font-size:13px;color:white;border:none;cursor:pointer;background:linear-gradient(135deg,#00C9A7,#0B6FCC);transition:all 0.2s;text-decoration:none}
  .bg{display:flex;align-items:center;justify-content:center;gap:8px;padding:11px;border-radius:13px;font-family:inherit;font-weight:600;font-size:12px;color:#00FFD1;border:1px solid rgba(0,255,209,0.22);background:rgba(0,255,209,0.05);cursor:pointer;text-decoration:none}
  .quick-btn{display:flex;flex-direction:column;align-items:center;gap:7px;padding:16px 10px;border-radius:16px;cursor:pointer;transition:all 0.2s;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.03);text-decoration:none}
  .ni{display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 0;cursor:pointer;border:none;background:none;font-family:inherit;flex:1;border-top:2px solid transparent}
  .ni.on{border-top-color:#00FFD1}
  .livdot{width:7px;height:7px;border-radius:50%;background:#00FFD1;display:inline-block;position:relative;flex-shrink:0}
  .livdot::after{content:'';position:absolute;inset:-3px;border-radius:50%;background:rgba(0,255,209,0.3);animation:ripple 1.8s infinite}
  .loader{width:18px;height:18px;border:2.5px solid rgba(255,255,255,0.2);border-top-color:#00FFD1;border-radius:50%;animation:spin 0.8s linear infinite}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
`;

type Tab = "home"|"doctors"|"prescriptions"|"profile";

// Hardcoded demo doctors for when API not available
const DEMO_DOCTORS = [
  { id:"doc_priya",   name:"Dr. Priya Sharma",  specialty:"General Physician", isOnline:true, fee:299, rating:"4.9", experience:8  },
  { id:"doc_arjun",  name:"Dr. Arjun Mehta",   specialty:"Cardiologist",       isOnline:true, fee:499, rating:"4.8", experience:12 },
  { id:"doc_sneha",  name:"Dr. Sneha Rao",     specialty:"Dermatologist",      isOnline:false,fee:399, rating:"4.7", experience:6  },
];

export default function PatientDashboard(){
  const router = useRouter();
  const [tab, setTab]         = useState<Tab>("home");
  const [user, setUser]       = useState<any>(null);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [orders, setOrders]   = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>(DEMO_DOCTORS);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<any>(null);

  useEffect(()=>{
    const token = getToken();
    const role  = localStorage.getItem("digidoc_role");
    if(!token){ router.replace("/login"); return; }
    if(role==="doctor"){ router.replace("/doctor/dashboard"); return; }
    const u = getUser();
    setUser(u);
    connectSocket(u);
    loadData();
  },[]);

  const connectSocket = (u:any) => {
    const SOCKET_URL = API.replace("/api","");
    import("socket.io-client").then(({io})=>{
      const socket = io(`${SOCKET_URL}/call`,{transports:["websocket","polling"]});
      socketRef.current = socket;
      socket.on("connect",()=>{
        const patientId = u?.id||u?.mobile||getMobile();
        socket.emit("register",{userId:patientId,role:"patient",name:u?.name||"Patient"});
      });
      // If doctor rejects
      socket.on("call:rejected",()=>{
        alert("Doctor is unavailable right now. Please try again.");
      });
      socket.on("call:doctor-offline",()=>{
        alert("Doctor is offline. Please try another doctor.");
      });
    }).catch(()=>{});
  };

  const loadData = async()=>{
    setLoading(true);
    const [rx, ord, doc] = await Promise.all([
      apiFetch("/prescriptions/my"),
      apiFetch("/orders/my"),
      apiFetch("/doctors"),
    ]);
    if(Array.isArray(rx))  setPrescriptions(rx);
    if(Array.isArray(ord)) setOrders(ord);
    // Use API doctors if available, else keep demo
    if(Array.isArray(doc)&&doc.length>0) setDoctors(doc);
    setLoading(false);
  };

  const callDoctor = (doctor:any, type:"video"|"audio") => {
    const u = getUser();
    const patientId   = u?.id||u?.mobile||getMobile();
    const patientName = u?.name||"Patient";
    // Doctor ID — use their ID or mobile
    const doctorId    = doctor.id||doctor.mobile;
    const roomId      = `room_${patientId}_${doctorId}_${Date.now()}`;

    // Emit call request
    if(socketRef.current?.connected){
      socketRef.current.emit("call:request",{
        roomId,
        patientId,
        patientName,
        doctorId,
        doctorName: doctor.name,
        callType: type,
      });
      console.log(`📞 Calling doctor: ${doctor.name} (ID: ${doctorId})`);
    } else {
      console.log("Socket not connected — trying anyway");
    }

    // Navigate to call page
    router.push(`/call/${roomId}?role=patient&userId=${patientId}&userName=${encodeURIComponent(patientName)}&doctorId=${doctorId}&doctorName=${encodeURIComponent(doctor.name)}&callType=${type}`);
  };

  const greeting=()=>{const h=new Date().getHours();return h<12?"Good Morning":h<17?"Good Afternoon":"Good Evening";};
  const firstName=(user?.name||"Patient").split(" ")[0];

  const DoctorCard = ({d}:{d:any}) => (
    <div className="gc">
      <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:10}}>
        <div style={{width:46,height:46,borderRadius:14,background:"rgba(0,255,209,0.07)",border:"1px solid rgba(0,255,209,0.14)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>👨‍⚕️</div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
            <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF"}}>{d.name}</p>
            {d.isOnline&&<span className="livdot"/>}
          </div>
          <p style={{color:"rgba(232,244,255,0.45)",fontSize:11}}>{d.specialty||"General Physician"} · ⭐ {d.rating||"4.9"}</p>
        </div>
        <p style={{color:"#00FFD1",fontWeight:700,fontSize:13}}>₹{d.fee||299}</p>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button className="bm" style={{flex:2,padding:"10px",fontSize:12}} onClick={()=>callDoctor(d,"video")}>📹 Video Call</button>
        <button className="bg" style={{flex:1,fontSize:11}} onClick={()=>callDoctor(d,"audio")}>📞 Audio</button>
      </div>
    </div>
  );

  return(
    <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#E8F4FF"}}>
      <style>{S}</style>

      {/* HEADER */}
      <div style={{flexShrink:0,padding:"14px 18px 13px",background:"rgba(2,13,26,0.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <p style={{color:"rgba(232,244,255,0.4)",fontSize:11}}>{greeting()},</p>
            <h2 style={{fontSize:18,fontWeight:900}} className="shine">{firstName} 👋</h2>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>router.push("/notifications")} style={{width:36,height:36,borderRadius:11,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,cursor:"pointer"}}>🔔</button>
            <button onClick={()=>setTab("profile")} style={{width:36,height:36,borderRadius:11,background:"rgba(0,255,209,0.08)",border:"1px solid rgba(0,255,209,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,cursor:"pointer"}}>👤</button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{flex:1,overflowY:"auto",padding:"0 18px"}} className="noscroll">
        {tab==="home"&&(
          <div style={{paddingTop:16,paddingBottom:16,animation:"fadeUp 0.5s ease"}}>
            <div style={{display:"flex",gap:10,marginBottom:18}}>
              {[{n:prescriptions.length,l:"Prescriptions",c:"#00FFD1"},{n:orders.length,l:"Orders",c:"#4DB8FF"},{n:doctors.filter((d:any)=>d.isOnline).length,l:"Online Drs",c:"#A78BFA"}].map(s=>(
                <div key={s.l} style={{flex:1,textAlign:"center",padding:"12px 8px",borderRadius:14,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}>
                  <p style={{fontWeight:900,fontSize:20,color:s.c}}>{s.n}</p>
                  <p style={{fontSize:9,color:"rgba(232,244,255,0.35)",marginTop:2}}>{s.l}</p>
                </div>
              ))}
            </div>
            <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:12}}>Quick Actions</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9,marginBottom:20}}>
              {[{icon:"🩺",l:"Consult",h:"/symptoms"},{icon:"💊",l:"Medicines",h:"/medicines"},{icon:"🤖",l:"AI Chat",h:"/chat"},{icon:"📋",l:"Records",h:"/records"}].map(q=>(
                <a key={q.l} href={q.h} className="quick-btn">
                  <span style={{fontSize:26}}>{q.icon}</span>
                  <span style={{fontSize:10,fontWeight:600,color:"rgba(232,244,255,0.65)"}}>{q.l}</span>
                </a>
              ))}
            </div>

            {prescriptions.length===0&&!loading&&(
              <div style={{background:"linear-gradient(135deg,rgba(0,201,167,0.12),rgba(11,111,204,0.15))",border:"1px solid rgba(0,255,209,0.18)",borderRadius:18,padding:18,marginBottom:18}}>
                <p style={{fontSize:13,fontWeight:800,color:"#E8F4FF",marginBottom:4}}>👋 Welcome, {firstName}!</p>
                <p style={{color:"rgba(232,244,255,0.5)",fontSize:12,lineHeight:1.7,marginBottom:14}}>Connect to a verified doctor in under 2 minutes.</p>
                <a href="/symptoms" className="bm" style={{display:"flex",justifyContent:"center"}}>🩺 Book Consultation</a>
              </div>
            )}

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1.2}}>Available Doctors</p>
              <button onClick={()=>setTab("doctors")} style={{color:"#00FFD1",fontSize:11,fontWeight:600,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>See all →</button>
            </div>
            {loading?<div style={{display:"flex",justifyContent:"center",padding:"24px 0"}}><span className="loader"/></div>
            :doctors.filter((d:any)=>d.isOnline).slice(0,3).map((d:any)=><DoctorCard key={d.id} d={d}/>)}
          </div>
        )}

        {tab==="doctors"&&(
          <div style={{paddingTop:16,paddingBottom:16}}>
            <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:14}}>All Doctors</p>
            {doctors.map((d:any)=><DoctorCard key={d.id} d={d}/>)}
          </div>
        )}

        {tab==="prescriptions"&&(
          <div style={{paddingTop:16,paddingBottom:16}}>
            <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:14}}>My Prescriptions</p>
            {prescriptions.length===0?(
              <div style={{textAlign:"center",padding:"32px 20px"}}>
                <p style={{fontSize:40,marginBottom:10}}>📋</p>
                <p style={{fontWeight:700,fontSize:14,color:"#E8F4FF",marginBottom:4}}>No prescriptions yet</p>
                <a href="/symptoms" className="bm" style={{display:"inline-flex",padding:"12px 22px",marginTop:14,width:"auto"}}>🩺 Book Consultation</a>
              </div>
            ):prescriptions.map((rx:any)=>(
              <div key={rx.id} className="gc" onClick={()=>router.push(`/prescription/${rx.id}`)}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF"}}>RX-{rx.id?.slice(-6)?.toUpperCase()}</p>
                  <span style={{padding:"3px 9px",borderRadius:100,background:"rgba(0,255,209,0.08)",color:"#00FFD1",fontSize:10,fontWeight:700}}>✓ Issued</span>
                </div>
                <p style={{color:"rgba(232,244,255,0.5)",fontSize:11}}>Dx: {rx.diagnosis}</p>
              </div>
            ))}
          </div>
        )}

        {tab==="profile"&&(
          <div style={{paddingTop:16,paddingBottom:16}}>
            <div style={{background:"linear-gradient(135deg,rgba(0,201,167,0.1),rgba(11,111,204,0.12))",border:"1px solid rgba(0,255,209,0.15)",borderRadius:18,padding:18,marginBottom:16,textAlign:"center"}}>
              <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(0,255,209,0.1)",border:"2px solid rgba(0,255,209,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 10px"}}>🧑</div>
              <h3 style={{fontWeight:800,fontSize:17,color:"#E8F4FF",marginBottom:3}}>{user?.name||"Patient"}</h3>
              <p style={{color:"#00FFD1",fontSize:12,fontWeight:600}}>Patient</p>
              <p style={{color:"rgba(232,244,255,0.35)",fontSize:11,marginTop:2}}>+91 {user?.mobile||getMobile()}</p>
            </div>
            {[{icon:"👤",l:"Edit Profile",h:"/profile"},{icon:"📋",l:"Records",h:"/records"},{icon:"💊",l:"Orders",h:"/order"},{icon:"💳",l:"Payments",h:"/payments"},{icon:"❓",l:"Help",h:"/support"}].map(item=>(
              <a key={item.l} href={item.h} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 15px",borderRadius:13,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",marginBottom:9,textDecoration:"none",color:"#E8F4FF"}}>
                <span style={{fontSize:19}}>{item.icon}</span>
                <span style={{fontWeight:600,fontSize:13,flex:1}}>{item.l}</span>
                <span style={{color:"rgba(232,244,255,0.25)"}}>→</span>
              </a>
            ))}
            <button onClick={()=>{localStorage.clear();window.location.href="/login";}} style={{width:"100%",padding:"13px",borderRadius:13,background:"rgba(255,107,107,0.07)",border:"1px solid rgba(255,107,107,0.18)",color:"#FF6B6B",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>Sign Out</button>
          </div>
        )}
      </div>

      <div style={{flexShrink:0,display:"flex",background:"rgba(2,13,26,0.97)",backdropFilter:"blur(24px)",borderTop:"1px solid rgba(255,255,255,0.07)"}}>
        {([["home","🏠","Home"],["doctors","🩺","Doctors"],["prescriptions","📋","Rx"],["profile","👤","Profile"]] as [Tab,string,string][]).map(([t,icon,label])=>(
          <button key={t} className={"ni"+(tab===t?" on":"")} onClick={()=>setTab(t)} style={{color:tab===t?"#00FFD1":"rgba(232,244,255,0.3)"}}>
            <span style={{fontSize:19}}>{icon}</span>
            <span style={{fontSize:9,fontWeight:tab===t?700:500}}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
