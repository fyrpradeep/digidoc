"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const getToken  = () => localStorage.getItem("dg_token")  || localStorage.getItem("digidoc_token")  || "";
const getUser   = () => { try { return JSON.parse(localStorage.getItem("dg_user")||localStorage.getItem("digidoc_user")||"null"); } catch { return null; } };
const getRole   = () => localStorage.getItem("dg_role")   || localStorage.getItem("digidoc_role")   || "";
const getMobile = () => localStorage.getItem("dg_mobile") || localStorage.getItem("digidoc_mobile") || "";

async function api(path: string) {
  try {
    const r = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${getToken()}` } });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

const S = `
  *{box-sizing:border-box;margin:0;padding:0}html,body{height:100%;overflow:hidden}
  @keyframes sh{0%{background-position:-200% center}to{background-position:200% center}}
  @keyframes rp{0%{transform:scale(.8);opacity:1}to{transform:scale(2.2);opacity:0}}
  @keyframes sp{to{transform:rotate(360deg)}}
  @keyframes fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  .sh{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:sh 3s linear infinite}
  .gc{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:14px;margin-bottom:11px;transition:all .3s}
  .bm{display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border-radius:13px;font-weight:700;font-size:13px;color:#fff;border:none;cursor:pointer;background:linear-gradient(135deg,#00C9A7,#0B6FCC);text-decoration:none;font-family:inherit;transition:all .2s}
  .bg{display:flex;align-items:center;justify-content:center;gap:8px;padding:11px;border-radius:13px;font-weight:600;font-size:12px;color:#00FFD1;border:1px solid rgba(0,255,209,.22);background:rgba(0,255,209,.05);cursor:pointer;text-decoration:none;font-family:inherit}
  .qb{display:flex;flex-direction:column;align-items:center;gap:7px;padding:16px 10px;border-radius:16px;cursor:pointer;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.03);text-decoration:none;transition:all .2s}
  .qb:hover{border-color:rgba(0,255,209,.22);transform:translateY(-2px)}
  .ni{display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 0;cursor:pointer;border:none;background:none;font-family:inherit;flex:1;border-top:2px solid transparent}
  .ni.on{border-top-color:#00FFD1}
  .dot{width:7px;height:7px;border-radius:50%;background:#00FFD1;display:inline-block;position:relative;flex-shrink:0}
  .dot::after{content:'';position:absolute;inset:-3px;border-radius:50%;background:rgba(0,255,209,.3);animation:rp 1.8s infinite}
  .sp{width:18px;height:18px;border:2.5px solid rgba(255,255,255,.2);border-top-color:#00FFD1;border-radius:50%;animation:sp .8s linear infinite}
  .ns::-webkit-scrollbar{display:none}.ns{-ms-overflow-style:none;scrollbar-width:none}
`;

type Tab = "home"|"doctors"|"rx"|"profile";

export default function Dashboard() {
  const router = useRouter();
  const [tab, setTab]       = useState<Tab>("home");
  const [user, setUser]     = useState<any>(null);
  const [doctors, setDoctors]   = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const sockRef = useRef<any>(null);

  useEffect(() => {
    const role = getRole();
    if (!getToken()) { router.replace("/login"); return; }
    if (role === "doctor") { router.replace("/doctor/dashboard"); return; }
    if (role === "admin")  { router.replace("/admin/dashboard"); return; }
    const u = getUser(); setUser(u);
    connectSocket(u);
    loadData();
  }, []);

  const connectSocket = (u: any) => {
    const URL = API.replace("/api", "");
    import("socket.io-client").then(({ io }) => {
      const s = io(`${URL}/call`, { transports: ["websocket", "polling"] });
      sockRef.current = s;
      s.on("connect", () => {
        s.emit("register", { userId: u?.id || getMobile(), role: "patient", name: u?.name || "Patient" });
      });
      s.on("call:rejected", () => alert("Doctor is not available. Please try another doctor."));
      s.on("call:doctor-offline", () => alert("Doctor is offline right now."));
    }).catch(() => {});
  };

  const loadData = async () => {
    setLoading(true);
    const [docs, rx, ord] = await Promise.all([
      api("/doctors"),
      api("/prescriptions/my"),
      api("/orders/my"),
    ]);
    if (Array.isArray(docs)) setDoctors(docs.filter((d: any) => d.status === "approved"));
    if (Array.isArray(rx))   setPrescriptions(rx);
    if (Array.isArray(ord))  setOrders(ord);
    setLoading(false);
  };

  const callDoctor = (d: any, type: "video"|"audio") => {
    const u = getUser();
    const pid = u?.id || getMobile();
    const roomId = `room_${pid}_${d.id}_${Date.now()}`;
    if (sockRef.current?.connected) {
      sockRef.current.emit("call:request", { roomId, patientId: pid, patientName: u?.name||"Patient", doctorId: d.id, doctorName: d.name, callType: type });
    }
    router.push(`/call/${roomId}?role=patient&userId=${pid}&userName=${encodeURIComponent(u?.name||"Patient")}&doctorId=${d.id}&doctorName=${encodeURIComponent(d.name)}&callType=${type}`);
  };

  const gr = () => { const h = new Date().getHours(); return h<12?"Good Morning":h<17?"Good Afternoon":"Good Evening"; };
  const firstName = (user?.name||"").split(" ")[0] || "there";

  const DoctorCard = ({ d }: { d: any }) => (
    <div className="gc">
      <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:10}}>
        <div style={{width:46,height:46,borderRadius:14,background:"rgba(0,255,209,.07)",border:"1px solid rgba(0,255,209,.14)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
          {d.photo ? <img src={d.photo} style={{width:"100%",height:"100%",borderRadius:14,objectFit:"cover"}}/> : "👨‍⚕️"}
        </div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
            <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF"}}>{d.name}</p>
            {d.isOnline && <span className="dot"/>}
          </div>
          <p style={{color:"rgba(232,244,255,.45)",fontSize:11}}>{d.specialty||"General Physician"}{d.experience?` · ${d.experience} yrs`:""}{d.rating?` · ⭐${d.rating}`:""}</p>
        </div>
        <p style={{color:"#00FFD1",fontWeight:700,fontSize:13}}>₹{d.fee||299}</p>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button className="bm" style={{flex:2,padding:"10px",fontSize:12}} onClick={() => callDoctor(d, "video")}>📹 Video Call</button>
        <button className="bg"  style={{flex:1,fontSize:11}} onClick={() => callDoctor(d, "audio")}>📞 Audio</button>
      </div>
    </div>
  );

  return (
    <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#E8F4FF"}}>
      <style>{S}</style>

      <div style={{flexShrink:0,padding:"14px 18px 13px",background:"rgba(2,13,26,.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <p style={{color:"rgba(232,244,255,.4)",fontSize:11}}>{gr()},</p>
            <h2 style={{fontSize:18,fontWeight:900}} className="sh">{firstName} 👋</h2>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setTab("profile")} style={{width:36,height:36,borderRadius:11,background:"rgba(0,255,209,.08)",border:"1px solid rgba(0,255,209,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,cursor:"pointer"}}>👤</button>
          </div>
        </div>
      </div>

      <div className="ns" style={{flex:1,overflowY:"auto",padding:"0 18px"}}>

        {tab==="home" && (
          <div style={{paddingTop:16,paddingBottom:16,animation:"fu .5s ease"}}>
            <div style={{display:"flex",gap:10,marginBottom:18}}>
              {[{n:prescriptions.length,l:"Prescriptions",c:"#00FFD1"},{n:orders.length,l:"Orders",c:"#4DB8FF"},{n:doctors.filter((d:any)=>d.isOnline).length,l:"Doctors Live",c:"#A78BFA"}].map(s=>(
                <div key={s.l} style={{flex:1,textAlign:"center",padding:"12px 8px",borderRadius:14,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)"}}>
                  <p style={{fontWeight:900,fontSize:20,color:s.c}}>{s.n}</p>
                  <p style={{fontSize:9,color:"rgba(232,244,255,.35)",marginTop:2}}>{s.l}</p>
                </div>
              ))}
            </div>

            <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,.35)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:12}}>Quick Actions</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9,marginBottom:20}}>
              {[{ic:"🩺",l:"Consult",h:"/symptoms"},{ic:"💊",l:"Medicines",h:"/medicines"},{ic:"📋",l:"Records",h:"/records"},{ic:"💳",l:"Payments",h:"/payments"}].map(q=>(
                <a key={q.l} href={q.h} className="qb">
                  <span style={{fontSize:26}}>{q.ic}</span>
                  <span style={{fontSize:10,fontWeight:600,color:"rgba(232,244,255,.65)"}}>{q.l}</span>
                </a>
              ))}
            </div>

            {prescriptions.length===0 && !loading && (
              <div style={{background:"linear-gradient(135deg,rgba(0,201,167,.12),rgba(11,111,204,.15))",border:"1px solid rgba(0,255,209,.18)",borderRadius:18,padding:18,marginBottom:18}}>
                <p style={{fontSize:13,fontWeight:800,color:"#E8F4FF",marginBottom:4}}>👋 Welcome, {firstName}!</p>
                <p style={{color:"rgba(232,244,255,.5)",fontSize:12,lineHeight:1.7,marginBottom:14}}>Connect to a verified doctor in under 2 minutes.</p>
                <a href="/symptoms" className="bm" style={{display:"flex",justifyContent:"center"}}>🩺 Book First Consultation</a>
              </div>
            )}

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,.35)",textTransform:"uppercase",letterSpacing:1.2}}>Available Doctors</p>
              <button onClick={()=>setTab("doctors")} style={{color:"#00FFD1",fontSize:11,fontWeight:600,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>See all →</button>
            </div>
            {loading ? (
              <div style={{display:"flex",justifyContent:"center",padding:"32px 0"}}><span className="sp"/></div>
            ) : doctors.filter((d:any)=>d.isOnline).length===0 ? (
              <div style={{textAlign:"center",padding:"28px 20px",background:"rgba(255,255,255,.02)",borderRadius:16,border:"1px solid rgba(255,255,255,.06)"}}>
                <p style={{fontSize:32,marginBottom:8}}>🩺</p>
                <p style={{fontWeight:700,fontSize:14,color:"#E8F4FF",marginBottom:4}}>No doctors online right now</p>
                <p style={{color:"rgba(232,244,255,.38)",fontSize:12}}>Check back in a few minutes</p>
              </div>
            ) : (
              doctors.filter((d:any)=>d.isOnline).slice(0,3).map((d:any) => <DoctorCard key={d.id} d={d}/>)
            )}
          </div>
        )}

        {tab==="doctors" && (
          <div style={{paddingTop:16,paddingBottom:16}}>
            <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,.35)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:14}}>All Doctors ({doctors.length})</p>
            {loading ? <div style={{display:"flex",justifyContent:"center",padding:"32px"}}><span className="sp"/></div>
            : doctors.length===0 ? (
              <div style={{textAlign:"center",padding:"40px 20px"}}>
                <p style={{fontSize:36,marginBottom:10}}>🩺</p>
                <p style={{color:"rgba(232,244,255,.38)",fontSize:13}}>No doctors available</p>
              </div>
            ) : doctors.map((d:any) => <DoctorCard key={d.id} d={d}/>)}
          </div>
        )}

        {tab==="rx" && (
          <div style={{paddingTop:16,paddingBottom:16}}>
            <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,.35)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:14}}>My Prescriptions ({prescriptions.length})</p>
            {loading ? <div style={{display:"flex",justifyContent:"center",padding:"32px"}}><span className="sp"/></div>
            : prescriptions.length===0 ? (
              <div style={{textAlign:"center",padding:"40px 20px"}}>
                <p style={{fontSize:40,marginBottom:10}}>📋</p>
                <p style={{fontWeight:700,fontSize:14,color:"#E8F4FF",marginBottom:4}}>No prescriptions yet</p>
                <p style={{color:"rgba(232,244,255,.38)",fontSize:12,marginBottom:16}}>Consult a doctor to get prescriptions</p>
                <a href="/symptoms" className="bm" style={{display:"inline-flex",padding:"11px 22px",width:"auto"}}>🩺 Consult Now</a>
              </div>
            ) : prescriptions.map((rx:any) => (
              <div key={rx.id} className="gc" style={{cursor:"pointer"}} onClick={()=>router.push(`/prescription/${rx.id}`)}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF"}}>RX-{rx.id?.slice(-6)?.toUpperCase()}</p>
                  <span style={{padding:"3px 9px",borderRadius:100,background:"rgba(0,255,209,.08)",color:"#00FFD1",fontSize:10,fontWeight:700}}>✓ Issued</span>
                </div>
                <p style={{color:"rgba(232,244,255,.5)",fontSize:11}}>{rx.diagnosis}</p>
                <p style={{color:"rgba(232,244,255,.3)",fontSize:10,marginTop:3}}>{new Date(rx.createdAt).toLocaleDateString("en-IN")}</p>
              </div>
            ))}
          </div>
        )}

        {tab==="profile" && (
          <div style={{paddingTop:16,paddingBottom:16}}>
            <div style={{background:"linear-gradient(135deg,rgba(0,201,167,.1),rgba(11,111,204,.12))",border:"1px solid rgba(0,255,209,.15)",borderRadius:18,padding:18,marginBottom:16,textAlign:"center"}}>
              <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(0,255,209,.1)",border:"2px solid rgba(0,255,209,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 10px"}}>🧑</div>
              <h3 style={{fontWeight:800,fontSize:17,color:"#E8F4FF",marginBottom:3}}>{user?.name||"Patient"}</h3>
              <p style={{color:"#00FFD1",fontSize:12,fontWeight:600}}>Patient</p>
              <p style={{color:"rgba(232,244,255,.35)",fontSize:11,marginTop:2}}>+91 {user?.mobile||getMobile()}</p>
            </div>
            <div style={{display:"flex",gap:10,marginBottom:14}}>
              {[{n:prescriptions.length,l:"Consults",c:"#00FFD1"},{n:orders.length,l:"Orders",c:"#4DB8FF"}].map(s=>(
                <div key={s.l} style={{flex:1,textAlign:"center",padding:"12px",borderRadius:13,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)"}}>
                  <p style={{fontWeight:900,fontSize:20,color:s.c}}>{s.n}</p>
                  <p style={{fontSize:10,color:"rgba(232,244,255,.38)",marginTop:2}}>{s.l}</p>
                </div>
              ))}
            </div>
            {[{i:"👤",l:"Edit Profile",h:"/profile"},{i:"📋",l:"Medical Records",h:"/records"},{i:"💊",l:"My Orders",h:"/order"},{i:"💳",l:"Payments",h:"/payments"},{i:"❓",l:"Help & Support",h:"/support"}].map(it=>(
              <a key={it.l} href={it.h} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 15px",borderRadius:13,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",marginBottom:9,textDecoration:"none",color:"#E8F4FF"}}>
                <span style={{fontSize:19}}>{it.i}</span>
                <span style={{fontWeight:600,fontSize:13,flex:1}}>{it.l}</span>
                <span style={{color:"rgba(232,244,255,.25)"}}>→</span>
              </a>
            ))}
            <button onClick={()=>{localStorage.clear();window.location.href="/login";}} style={{width:"100%",padding:"13px",borderRadius:13,background:"rgba(255,107,107,.07)",border:"1px solid rgba(255,107,107,.18)",color:"#FF6B6B",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",marginTop:4}}>Sign Out</button>
          </div>
        )}
      </div>

      <div style={{flexShrink:0,display:"flex",background:"rgba(2,13,26,.97)",backdropFilter:"blur(24px)",borderTop:"1px solid rgba(255,255,255,.07)"}}>
        {([["home","🏠","Home"],["doctors","🩺","Doctors"],["rx","📋","Rx"],["profile","👤","Profile"]] as [Tab,string,string][]).map(([t,ic,lb])=>(
          <button key={t} className={"ni"+(tab===t?" on":"")} onClick={()=>setTab(t)} style={{color:tab===t?"#00FFD1":"rgba(232,244,255,.3)"}}>
            <span style={{fontSize:19}}>{ic}</span>
            <span style={{fontSize:9,fontWeight:tab===t?700:500}}>{lb}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
