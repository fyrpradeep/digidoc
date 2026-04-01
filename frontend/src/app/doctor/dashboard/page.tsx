"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const getUser=()=>{try{return JSON.parse(localStorage.getItem("dg_user")||localStorage.getItem("digidoc_user")||"null");}catch{return null;}};
const getRole=()=>localStorage.getItem("dg_role")||localStorage.getItem("digidoc_role")||"";
const getMob=()=>localStorage.getItem("dg_mobile")||localStorage.getItem("digidoc_mobile")||"";

const S=`
  *{box-sizing:border-box;margin:0;padding:0}html,body{height:100%;overflow:hidden}
  @keyframes sh{0%{background-position:-200% center}to{background-position:200% center}}
  @keyframes rp{0%{transform:scale(.8);opacity:1}to{transform:scale(2.2);opacity:0}}
  @keyframes ps{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
  @keyframes fi{from{opacity:0}to{opacity:1}}
  @keyframes su{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  .sh{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:sh 3s linear infinite}
  .gc{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:14px;margin-bottom:11px}
  .bm{display:flex;align-items:center;justify-content:center;gap:8px;padding:12px 18px;border-radius:13px;font-family:inherit;font-weight:700;font-size:13px;color:#fff;border:none;cursor:pointer;background:linear-gradient(135deg,#00C9A7,#0B6FCC)}
  .bg{display:flex;align-items:center;justify-content:center;gap:7px;padding:11px 16px;border-radius:13px;font-family:inherit;font-weight:600;font-size:12px;color:#00FFD1;border:1px solid rgba(0,255,209,.22);background:rgba(0,255,209,.05);cursor:pointer}
  .ni{display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 0;cursor:pointer;border:none;background:none;font-family:inherit;flex:1;border-top:2px solid transparent}
  .ni.on{border-top-color:#00FFD1}
  .ld{width:8px;height:8px;border-radius:50%;background:#00FFD1;display:inline-block;position:relative}
  .ld::after{content:'';position:absolute;inset:-4px;border-radius:50%;background:rgba(0,255,209,.3);animation:rp 1.8s infinite}
  .tg{width:44px;height:24px;border-radius:100px;cursor:pointer;transition:all .3s;position:relative;border:none;flex-shrink:0}
  .tk{position:absolute;top:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:all .3s}
  .rn{position:absolute;width:100%;height:100%;border-radius:50%;border:2px solid rgba(0,255,209,.4);animation:rp 2s infinite}
  .r2{animation-delay:.7s}
  .ns::-webkit-scrollbar{display:none}.ns{-ms-overflow-style:none;scrollbar-width:none}
`;

type Tab="queue"|"prescribe"|"history"|"profile";

export default function DoctorDashboard(){
  const router=useRouter();
  const [tab,setTab]=useState<Tab>("queue");
  const [online,setOnline]=useState(false);
  const [user,setUser]=useState<any>(null);
  const [inc,setInc]=useState<any>(null);
  const [sockSt,setSockSt]=useState<"off"|"connecting"|"on"|"fail">("off");
  const sock=useRef<any>(null);

  useEffect(()=>{
    const role=getRole();
    if(!role){ router.replace("/login"); return; }
    if(role==="patient"){ router.replace("/dashboard"); return; }
    setUser(getUser());
  },[]);

  const connect=(u:any)=>{
    if(sock.current?.connected) return;
    setSockSt("connecting");
    const URL=(process.env.NEXT_PUBLIC_API_URL||"http://localhost:4000/api").replace("/api","");
    import("socket.io-client").then(({io})=>{
      const s=io(`${URL}/call`,{transports:["websocket","polling"],reconnectionAttempts:3,timeout:8000});
      sock.current=s;
      // Use the doctor's DB id OR mobile as their unique socket ID
      const doctorId=u?.id||getMob();
      s.on("connect",()=>{
        setSockSt("on");
        s.emit("register",{userId:doctorId,role:"doctor",name:u?.name||"Doctor"});
        console.log("✅ Doctor online, ID:",doctorId);
      });
      s.on("disconnect",()=>setSockSt("fail"));
      s.on("connect_error",()=>setSockSt("fail"));
      s.on("call:incoming",(d:any)=>{
        console.log("📞 Incoming from:",d.patientName);
        setInc(d);
        // Beep
        try{
          const ac=new AudioContext();
          [0,800,1600].forEach(delay=>{
            const osc=ac.createOscillator();
            const g=ac.createGain();
            osc.connect(g);g.connect(ac.destination);
            osc.frequency.value=520;g.gain.value=0.25;
            osc.start(ac.currentTime+delay/1000);
            osc.stop(ac.currentTime+delay/1000+0.35);
          });
        }catch{}
      });
      s.on("call:ended",()=>setInc(null));
      // Timeout fallback
      setTimeout(()=>{ if(!s.connected) setSockSt("fail"); },8000);
    }).catch(()=>setSockSt("fail"));
  };

  const disconnect=()=>{
    sock.current?.disconnect();
    sock.current=null;
    setSockSt("off");
  };

  const toggleOnline=(v:boolean)=>{
    setOnline(v);
    if(v) connect(user||getUser());
    else disconnect();
  };

  const accept=()=>{
    if(!inc) return;
    const u=user||getUser();
    const doctorId=u?.id||getMob();
    sock.current?.emit("call:accept",{roomId:inc.roomId,doctorId,doctorName:u?.name||"Doctor"});
    router.push(`/call/${inc.roomId}?role=doctor&userId=${doctorId}&userName=${encodeURIComponent(u?.name||"Doctor")}&callType=${inc.callType||"video"}`);
    setInc(null);
  };

  const reject=()=>{
    sock.current?.emit("call:reject",{roomId:inc?.roomId,doctorId:user?.id||getMob()});
    setInc(null);
  };

  const dn=user?.name||"Doctor";

  return(
    <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#E8F4FF"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap');${S}`}</style>

      {/* INCOMING CALL */}
      {inc&&(
        <div style={{position:"fixed",inset:0,zIndex:999,background:"rgba(2,13,26,.95)",backdropFilter:"blur(14px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"fi .3s ease"}}>
          <div style={{position:"relative",width:130,height:130,marginBottom:20}}>
            <div className="rn"/><div className="rn r2"/>
            <div style={{position:"relative",zIndex:2,width:130,height:130,borderRadius:"50%",background:"rgba(0,255,209,.1)",border:"2px solid rgba(0,255,209,.4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:56}}>🧑</div>
          </div>
          <p style={{color:"rgba(232,244,255,.5)",fontSize:14,marginBottom:6}}>Incoming {inc.callType||"video"} call</p>
          <h2 style={{fontSize:28,fontWeight:900,marginBottom:6}}>{inc.patientName}</h2>
          <p style={{color:"rgba(232,244,255,.35)",fontSize:12,marginBottom:36}}>Patient • DigiDoc</p>
          <div style={{display:"flex",gap:48}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
              <button onClick={reject} style={{width:68,height:68,borderRadius:"50%",background:"linear-gradient(135deg,#FF4B4B,#CC0000)",border:"none",cursor:"pointer",fontSize:28,display:"flex",alignItems:"center",justifyContent:"center"}}>📵</button>
              <p style={{color:"rgba(232,244,255,.5)",fontSize:12}}>Decline</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
              <button onClick={accept} style={{width:68,height:68,borderRadius:"50%",background:"linear-gradient(135deg,#00C9A7,#0B6FCC)",border:"none",cursor:"pointer",fontSize:28,display:"flex",alignItems:"center",justifyContent:"center",animation:"ps 1.5s infinite"}}>📞</button>
              <p style={{color:"#00FFD1",fontSize:12,fontWeight:700}}>Accept</p>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{flexShrink:0,padding:"13px 18px 12px",background:"rgba(2,13,26,.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <p style={{color:"rgba(232,244,255,.4)",fontSize:11}}>Doctor Portal</p>
            <h2 style={{fontSize:17,fontWeight:800}} className="sh">{dn}</h2>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <p style={{color:online?"#00FFD1":"rgba(232,244,255,.35)",fontSize:11,fontWeight:600}}>{online?"Online":"Offline"}</p>
            <button className="tg" onClick={()=>toggleOnline(!online)} style={{background:online?"#00C9A7":"rgba(255,255,255,.1)"}}>
              <div className="tk" style={{left:online?23:3}}/>
            </button>
            {online&&sockSt==="on"&&<span className="ld"/>}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="ns" style={{flex:1,overflowY:"auto",padding:"0 18px"}}>
        {tab==="queue"&&(
          <div style={{paddingTop:14,animation:"su .4s ease"}}>
            {!online?(
              <div style={{textAlign:"center",padding:"50px 20px"}}>
                <p style={{fontSize:52,marginBottom:12}}>😴</p>
                <p style={{color:"#FF6B6B",fontWeight:700,fontSize:15,marginBottom:8}}>You are Offline</p>
                <p style={{color:"rgba(232,244,255,.4)",fontSize:13,marginBottom:20}}>Toggle Online above to receive calls</p>
                <button className="bm" style={{margin:"0 auto",width:"auto",padding:"12px 24px"}} onClick={()=>toggleOnline(true)}>Go Online →</button>
              </div>
            ):sockSt==="on"?(
              <div style={{background:"rgba(0,255,209,.05)",border:"1px solid rgba(0,255,209,.2)",borderRadius:16,padding:20,textAlign:"center",marginTop:10}}>
                <div style={{display:"flex",justifyContent:"center",marginBottom:10}}>
                  <span className="ld"/>
                </div>
                <p style={{color:"#00FFD1",fontWeight:800,fontSize:16,marginBottom:6}}>You are Live!</p>
                <p style={{color:"rgba(232,244,255,.45)",fontSize:13,lineHeight:1.7,marginBottom:12}}>Patients can now call you.</p>
                <div style={{background:"rgba(255,255,255,.03)",borderRadius:11,padding:"10px 14px",border:"1px solid rgba(255,255,255,.06)"}}>
                  <p style={{color:"rgba(232,244,255,.35)",fontSize:10,marginBottom:3}}>Your ID (for calls)</p>
                  <p style={{color:"#4DB8FF",fontWeight:700,fontSize:12,wordBreak:"break-all"}}>{user?.id||getMob()}</p>
                </div>
              </div>
            ):sockSt==="connecting"?(
              <div style={{textAlign:"center",padding:"40px 20px"}}>
                <p style={{fontSize:36,marginBottom:10}}>🔄</p>
                <p style={{color:"#FFB347",fontWeight:700,fontSize:14}}>Connecting...</p>
                <p style={{color:"rgba(232,244,255,.4)",fontSize:12,marginTop:4}}>Setting up your connection</p>
              </div>
            ):(
              <div style={{textAlign:"center",padding:"36px 20px"}}>
                <p style={{fontSize:36,marginBottom:10}}>⚠️</p>
                <p style={{color:"#FFB347",fontWeight:700,fontSize:14,marginBottom:6}}>Connection issue</p>
                <p style={{color:"rgba(232,244,255,.4)",fontSize:12,lineHeight:1.7,marginBottom:14}}>You are marked online.<br/>Patients can still call you.</p>
                <button className="bm" style={{margin:"0 auto",width:"auto",padding:"10px 20px",fontSize:12}} onClick={()=>connect(user||getUser())}>Retry</button>
              </div>
            )}
          </div>
        )}
        {tab==="prescribe"&&(
          <div style={{paddingTop:14}}>
            <div className="gc">
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>Write Prescription</p>
              {["Patient Name","Diagnosis","Medicines (one per line)","Doctor's Advice"].map(f=>(
                <div key={f} style={{marginBottom:12}}>
                  <label style={{display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,.4)",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{f}</label>
                  <textarea rows={f.includes("Medicines")||f.includes("Advice")?3:1} placeholder={`Enter ${f.toLowerCase()}...`}
                    style={{width:"100%",padding:"10px 12px",borderRadius:11,background:"rgba(255,255,255,.04)",border:"1.5px solid rgba(255,255,255,.08)",color:"#E8F4FF",fontFamily:"inherit",fontSize:12,outline:"none",resize:"none",lineHeight:1.6}}/>
                </div>
              ))}
              <button className="bm" style={{width:"100%"}}>💊 Send Prescription</button>
            </div>
          </div>
        )}
        {tab==="history"&&(
          <div style={{paddingTop:14,textAlign:"center",padding:"50px 20px"}}>
            <p style={{fontSize:36,marginBottom:10}}>📋</p>
            <p style={{fontWeight:700,fontSize:14,color:"#E8F4FF",marginBottom:4}}>No consultations yet</p>
            <p style={{color:"rgba(232,244,255,.38)",fontSize:12}}>History will appear after calls</p>
          </div>
        )}
        {tab==="profile"&&(
          <div style={{paddingTop:14}}>
            <div style={{background:"linear-gradient(135deg,rgba(0,201,167,.1),rgba(11,111,204,.12))",border:"1px solid rgba(0,255,209,.15)",borderRadius:18,padding:18,marginBottom:14,textAlign:"center"}}>
              <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(0,255,209,.1)",border:"2px solid rgba(0,255,209,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 10px"}}>👨‍⚕️</div>
              <h3 style={{fontWeight:800,fontSize:17,color:"#E8F4FF",marginBottom:3}}>{dn}</h3>
              <p style={{color:"#00FFD1",fontSize:12,fontWeight:600}}>Doctor</p>
              <p style={{color:"rgba(232,244,255,.35)",fontSize:11,marginTop:2}}>+91 {user?.mobile||getMob()}</p>
            </div>
            {[{i:"✏️",l:"Edit Profile",h:"/doctor/profile"},{i:"❓",l:"Help & Support",h:"/support"}].map(it=>(
              <a key={it.l} href={it.h} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 15px",borderRadius:13,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",marginBottom:9,textDecoration:"none",color:"#E8F4FF"}}>
                <span style={{fontSize:19}}>{it.i}</span>
                <span style={{fontWeight:600,fontSize:13,flex:1}}>{it.l}</span>
                <span style={{color:"rgba(232,244,255,.25)"}}>→</span>
              </a>
            ))}
            <button onClick={()=>{localStorage.clear();window.location.href="/login";}}
              style={{width:"100%",padding:"13px",borderRadius:13,background:"rgba(255,107,107,.07)",border:"1px solid rgba(255,107,107,.18)",color:"#FF6B6B",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* NAV */}
      <div style={{flexShrink:0,display:"flex",background:"rgba(2,13,26,.97)",backdropFilter:"blur(24px)",borderTop:"1px solid rgba(255,255,255,.07)"}}>
        {([["queue","🏥","Queue"],["prescribe","💊","Prescribe"],["history","📋","History"],["profile","👤","Profile"]] as [Tab,string,string][]).map(([t,ic,lb])=>(
          <button key={t} className={"ni"+(tab===t?" on":"")} onClick={()=>setTab(t)} style={{color:tab===t?"#00FFD1":"rgba(232,244,255,.3)"}}>
            <span style={{fontSize:19}}>{ic}</span>
            <span style={{fontSize:9,fontWeight:tab===t?700:500}}>{lb}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
