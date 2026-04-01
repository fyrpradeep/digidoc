"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const getToken = () => typeof window !== "undefined" ? localStorage.getItem("digidoc_token") : null;
const getUser  = () => {
  try { return JSON.parse(localStorage.getItem("digidoc_user") || "null"); } catch { return null; }
};

async function apiFetch(path: string) {
  try {
    const r = await fetch(`${API}${path}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .fade-up{animation:fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both}
  .gc{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:14px;margin-bottom:11px;transition:all 0.3s;cursor:pointer}
  .gc:hover{border-color:rgba(0,255,209,0.18);background:rgba(0,255,209,0.03)}
  .bm{display:flex;align-items:center;justify-content:center;gap:8px;padding:14px;border-radius:13px;font-family:inherit;font-weight:700;font-size:14px;color:white;border:none;cursor:pointer;transition:all 0.3s;background:linear-gradient(135deg,#00C9A7,#0B6FCC);box-shadow:0 0 20px rgba(0,201,167,0.26);text-decoration:none}
  .bm:hover{transform:translateY(-1px);box-shadow:0 0 30px rgba(0,201,167,0.4)}
  .bg{display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;border-radius:13px;font-family:inherit;font-weight:600;font-size:13px;color:#00FFD1;border:1px solid rgba(0,255,209,0.22);background:rgba(0,255,209,0.05);cursor:pointer;transition:all 0.2s;text-decoration:none}
  .bg:hover{background:rgba(0,255,209,0.1)}
  .quick-btn{display:flex;flex-direction:column;align-items:center;gap:7px;padding:16px 10px;border-radius:16px;cursor:pointer;transition:all 0.2s;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.03);text-decoration:none}
  .quick-btn:hover{border-color:rgba(0,255,209,0.22);background:rgba(0,255,209,0.04);transform:translateY(-2px)}
  .quick-btn:active{transform:scale(0.97)}
  .badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:100px;font-size:10px;font-weight:700}
  .ni{display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 0;cursor:pointer;border:none;background:none;font-family:inherit;flex:1;border-top:2px solid transparent}
  .ni.on{border-top-color:#00FFD1}
  .livdot{width:7px;height:7px;border-radius:50%;background:#00FFD1;display:inline-block;position:relative}
  .livdot::after{content:'';position:absolute;inset:-3px;border-radius:50%;background:rgba(0,255,209,0.3);animation:ripple 1.8s infinite}
  .loader{width:18px;height:18px;border:2.5px solid rgba(255,255,255,0.2);border-top-color:#00FFD1;border-radius:50%;animation:spin 0.8s linear infinite}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
  .empty{text-align:center;padding:36px 20px}
`;

type Tab = "home" | "doctors" | "prescriptions" | "profile";

export default function PatientDashboard() {
  const router = useRouter();
  const [tab, setTab]           = useState<Tab>("home");
  const [user, setUser]         = useState<any>(null);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [orders, setOrders]     = useState<any[]>([]);
  const [doctors, setDoctors]   = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const u = getUser();
    const token = getToken();
    const role  = localStorage.getItem("digidoc_role");

    if (!token) { router.replace("/login"); return; }
    if (role === "doctor") { router.replace("/doctor/dashboard"); return; }

    setUser(u);
    loadData();
  }, []);

  const loadData = async () => {
    setLoadingData(true);
    const [rxData, orderData, docData] = await Promise.all([
      apiFetch("/prescriptions/my"),
      apiFetch("/orders/my"),
      apiFetch("/doctors"),
    ]);
    if (Array.isArray(rxData))    setPrescriptions(rxData);
    if (Array.isArray(orderData)) setOrders(orderData);
    if (Array.isArray(docData))   setDoctors(docData);
    setLoadingData(false);
  };

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening";
  };

  const displayName = user?.name || "Patient";
  const firstName   = displayName.split(" ")[0];

  return (
    <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#E8F4FF",maxWidth:480,margin:"0 auto",left:"50%",transform:"translateX(-50%)"}}>
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
            <button onClick={()=>router.push("/profile")} style={{width:36,height:36,borderRadius:11,background:"rgba(0,255,209,0.08)",border:"1px solid rgba(0,255,209,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,cursor:"pointer"}}>👤</button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{flex:1,overflowY:"auto",padding:"0 18px"}} className="noscroll">

        {/* ── HOME TAB ── */}
        {tab === "home" && (
          <div className="fade-up" style={{paddingTop:16,paddingBottom:16}}>

            {/* Stats — real numbers */}
            <div style={{display:"flex",gap:10,marginBottom:18}}>
              {[
                {n:prescriptions.length, l:"Prescriptions", c:"#00FFD1"},
                {n:orders.length,        l:"Orders",        c:"#4DB8FF"},
                {n:doctors.length,       l:"Doctors",       c:"#A78BFA"},
              ].map(s=>(
                <div key={s.l} style={{flex:1,textAlign:"center",padding:"12px 8px",borderRadius:14,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}>
                  <p style={{fontWeight:900,fontSize:20,color:s.c}}>{s.n}</p>
                  <p style={{fontSize:9,color:"rgba(232,244,255,0.35)",marginTop:2}}>{s.l}</p>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:12}}>Quick Actions</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9,marginBottom:20}}>
              {[
                {icon:"🩺",label:"Consult",   href:"/symptoms"},
                {icon:"💊",label:"Medicines", href:"/medicines"},
                {icon:"🤖",label:"AI Chat",   href:"/chat"},
                {icon:"📋",label:"Records",   href:"/records"},
              ].map(q=>(
                <a key={q.label} href={q.href} className="quick-btn">
                  <span style={{fontSize:26}}>{q.icon}</span>
                  <span style={{fontSize:10,fontWeight:600,color:"rgba(232,244,255,0.65)"}}>{q.label}</span>
                </a>
              ))}
            </div>

            {/* CTA — Book first consultation */}
            {prescriptions.length === 0 && !loadingData && (
              <div style={{background:"linear-gradient(135deg,rgba(0,201,167,0.12),rgba(11,111,204,0.15))",border:"1px solid rgba(0,255,209,0.18)",borderRadius:18,padding:"18px 18px",marginBottom:18}}>
                <p style={{fontSize:13,fontWeight:800,color:"#E8F4FF",marginBottom:4}}>👋 Welcome, {firstName}!</p>
                <p style={{color:"rgba(232,244,255,0.5)",fontSize:12,lineHeight:1.7,marginBottom:14}}>
                  Book your first consultation and get connected to a verified doctor in under 2 minutes.
                </p>
                <a href="/symptoms" className="bm" style={{display:"flex",justifyContent:"center"}}>
                  🩺 Book First Consultation
                </a>
              </div>
            )}

            {/* Online doctors */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1.2}}>
                Available Doctors
              </p>
              {doctors.length > 0 && <a href="/doctors" style={{color:"#00FFD1",fontSize:11,fontWeight:600,textDecoration:"none"}}>See all →</a>}
            </div>

            {loadingData ? (
              <div style={{display:"flex",justifyContent:"center",padding:"24px 0"}}>
                <span className="loader"/>
              </div>
            ) : doctors.length === 0 ? (
              <div className="empty">
                <p style={{fontSize:36,marginBottom:8}}>🩺</p>
                <p style={{fontWeight:700,fontSize:14,color:"#E8F4FF",marginBottom:4}}>No doctors online right now</p>
                <p style={{color:"rgba(232,244,255,0.38)",fontSize:12}}>Check back soon or use AI chat for guidance</p>
              </div>
            ) : (
              doctors.filter(d=>d.isOnline).slice(0,3).map((d:any)=>(
                <div key={d.id} className="gc" onClick={()=>router.push(`/doctors/${d.id}`)}>
                  <div style={{display:"flex",gap:12,alignItems:"center"}}>
                    <div style={{width:46,height:46,borderRadius:14,background:"rgba(0,255,209,0.07)",border:"1px solid rgba(0,255,209,0.14)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>👨‍⚕️</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                        <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF"}}>{d.name}</p>
                        <span className="livdot"/>
                      </div>
                      <p style={{color:"rgba(232,244,255,0.45)",fontSize:11}}>{d.specialty} · ⭐ {d.rating||"4.9"}</p>
                    </div>
                    <p style={{color:"#00FFD1",fontWeight:700,fontSize:13}}>₹{d.fee||299}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── DOCTORS TAB ── */}
        {tab === "doctors" && (
          <div className="fade-up" style={{paddingTop:16,paddingBottom:16}}>
            <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:14}}>
              All Doctors ({doctors.length})
            </p>
            {loadingData ? (
              <div style={{display:"flex",justifyContent:"center",padding:"32px 0"}}><span className="loader"/></div>
            ) : doctors.length === 0 ? (
              <div className="empty">
                <p style={{fontSize:40,marginBottom:10}}>🩺</p>
                <p style={{fontWeight:700,fontSize:15,color:"#E8F4FF",marginBottom:4}}>No doctors yet</p>
                <p style={{color:"rgba(232,244,255,0.38)",fontSize:12}}>Doctors will appear here once approved</p>
              </div>
            ) : (
              doctors.map((d:any)=>(
                <div key={d.id} className="gc" onClick={()=>router.push(`/doctors/${d.id}`)}>
                  <div style={{display:"flex",gap:12,alignItems:"center"}}>
                    <div style={{width:46,height:46,borderRadius:14,background:"rgba(0,255,209,0.07)",border:"1px solid rgba(0,255,209,0.14)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>👨‍⚕️</div>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF"}}>{d.name}</p>
                        {d.isOnline&&<span className="livdot"/>}
                      </div>
                      <p style={{color:"rgba(232,244,255,0.45)",fontSize:11,marginTop:1}}>{d.specialty} · {d.experience} yrs</p>
                    </div>
                    <p style={{color:"#00FFD1",fontWeight:700,fontSize:13}}>₹{d.fee||299}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── PRESCRIPTIONS TAB ── */}
        {tab === "prescriptions" && (
          <div className="fade-up" style={{paddingTop:16,paddingBottom:16}}>
            <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:14}}>
              My Prescriptions ({prescriptions.length})
            </p>
            {loadingData ? (
              <div style={{display:"flex",justifyContent:"center",padding:"32px 0"}}><span className="loader"/></div>
            ) : prescriptions.length === 0 ? (
              <div className="empty">
                <p style={{fontSize:40,marginBottom:10}}>📋</p>
                <p style={{fontWeight:700,fontSize:15,color:"#E8F4FF",marginBottom:4}}>No prescriptions yet</p>
                <p style={{color:"rgba(232,244,255,0.38)",fontSize:12,marginBottom:18}}>
                  Book a consultation to get your first prescription
                </p>
                <a href="/symptoms" className="bm" style={{display:"inline-flex",padding:"12px 22px",width:"auto"}}>
                  🩺 Book Consultation
                </a>
              </div>
            ) : (
              prescriptions.map((rx:any)=>(
                <div key={rx.id} className="gc" onClick={()=>router.push(`/prescription/${rx.id}`)}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF"}}>
                      {rx.id?.substring(0,8).toUpperCase() || "RX-"+rx.id?.slice(-6)}
                    </p>
                    <span className="badge" style={{background:"rgba(0,255,209,0.08)",color:"#00FFD1"}}>✓ Issued</span>
                  </div>
                  <p style={{color:"rgba(232,244,255,0.5)",fontSize:11}}>Dx: {rx.diagnosis}</p>
                  <p style={{color:"rgba(232,244,255,0.3)",fontSize:10,marginTop:3}}>
                    {new Date(rx.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {tab === "profile" && (
          <div className="fade-up" style={{paddingTop:16,paddingBottom:16}}>
            {/* User card */}
            <div style={{background:"linear-gradient(135deg,rgba(0,201,167,0.1),rgba(11,111,204,0.12))",border:"1px solid rgba(0,255,209,0.15)",borderRadius:18,padding:18,marginBottom:16,textAlign:"center"}}>
              <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(0,255,209,0.1)",border:"2px solid rgba(0,255,209,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 10px"}}>🧑</div>
              <h3 style={{fontWeight:800,fontSize:17,color:"#E8F4FF",marginBottom:3}}>{displayName}</h3>
              <p style={{color:"#00FFD1",fontSize:12,fontWeight:600,marginBottom:2}}>Patient</p>
              <p style={{color:"rgba(232,244,255,0.35)",fontSize:11}}>{user?.mobile ? `+91 ${user.mobile}` : localStorage.getItem("digidoc_mobile") ? `+91 ${localStorage.getItem("digidoc_mobile")}` : ""}</p>
            </div>

            <div style={{display:"flex",gap:10,marginBottom:14}}>
              {[
                {n:prescriptions.length, l:"Consults",  c:"#00FFD1"},
                {n:orders.length,        l:"Orders",    c:"#4DB8FF"},
              ].map(s=>(
                <div key={s.l} style={{flex:1,textAlign:"center",padding:"12px",borderRadius:13,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)"}}>
                  <p style={{fontWeight:900,fontSize:20,color:s.c}}>{s.n}</p>
                  <p style={{fontSize:10,color:"rgba(232,244,255,0.38)",marginTop:2}}>{s.l}</p>
                </div>
              ))}
            </div>

            {[
              {icon:"👤",label:"Edit Profile",      href:"/profile"},
              {icon:"📋",label:"Medical Records",   href:"/records"},
              {icon:"💊",label:"My Orders",         href:"/order"},
              {icon:"💳",label:"Payment History",   href:"/payments"},
              {icon:"🔔",label:"Notifications",     href:"/notifications"},
              {icon:"❓",label:"Help & Support",    href:"/support"},
            ].map(item=>(
              <a key={item.label} href={item.href} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 15px",borderRadius:13,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",marginBottom:9,textDecoration:"none",color:"#E8F4FF",transition:"all 0.2s"}}>
                <span style={{fontSize:19}}>{item.icon}</span>
                <span style={{fontWeight:600,fontSize:13,flex:1}}>{item.label}</span>
                <span style={{color:"rgba(232,244,255,0.25)",fontSize:13}}>→</span>
              </a>
            ))}

            <button onClick={()=>{localStorage.clear();window.location.href="/login";}} style={{width:"100%",marginTop:6,padding:"13px",borderRadius:13,background:"rgba(255,107,107,0.07)",border:"1px solid rgba(255,107,107,0.18)",color:"#FF6B6B",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
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
