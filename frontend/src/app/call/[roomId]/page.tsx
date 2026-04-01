"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useCall } from "@/hooks/useCall";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes ripple{0%{transform:scale(1);opacity:0.8}100%{transform:scale(2.5);opacity:0}}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
  .ring{position:absolute;width:100%;height:100%;border-radius:50%;border:2px solid rgba(0,255,209,0.4);animation:ripple 2s infinite}
  .ring2{animation-delay:0.6s}
  .ring3{animation-delay:1.2s}
  .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .ctrl-btn{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;font-size:22px;transition:all 0.2s;flex-shrink:0}
  .ctrl-btn:hover{transform:scale(1.1)}
  .ctrl-btn:active{transform:scale(0.95)}
  .end-btn{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;font-size:26px;transition:all 0.2s;background:linear-gradient(135deg,#FF4B4B,#CC0000);box-shadow:0 0 24px rgba(255,75,75,0.5)}
  .end-btn:hover{transform:scale(1.08);box-shadow:0 0 36px rgba(255,75,75,0.7)}
  .accept-btn{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;font-size:26px;transition:all 0.2s;background:linear-gradient(135deg,#00C9A7,#0B6FCC);box-shadow:0 0 24px rgba(0,201,167,0.5)}
  .accept-btn:hover{transform:scale(1.08)}
`;

export default function CallPage() {
  const router       = useRouter();
  const params       = useParams();
  const searchParams = useSearchParams();
  const roomId       = params.roomId as string;

  // URL params
  const role       = searchParams.get("role") || "patient";
  const userId     = searchParams.get("userId") || "user1";
  const userName   = searchParams.get("userName") || "User";
  const doctorId   = searchParams.get("doctorId") || "doc1";
  const doctorName = searchParams.get("doctorName") || "Doctor";
  const callType   = (searchParams.get("callType") || "video") as "video"|"audio";

  const localVideoRef  = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatMsg, setChatMsg]   = useState("");
  const [messages, setMessages] = useState<{from:string;text:string}[]>([]);

  const {
    connect, initiateCall, acceptCall, rejectCall, endCall,
    toggleAudio, toggleVideo,
    callState, incomingCall,
    localStream, remoteStream,
    isVideoMuted, isAudioMuted,
  } = useCall();

  // Connect socket + register
  useEffect(() => {
    connect(userId, role as "patient"|"doctor", userName);

    // Patient: initiate call immediately
    if (role === "patient") {
      setTimeout(() => {
        initiateCall(roomId, userId, userName, doctorId, doctorName, callType);
      }, 500);
    }
  }, []);

  // Attach local stream to video
  useEffect(() => {
    if (localStream.current && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream.current;
    }
  }, [callState]);

  // Attach remote stream
  useEffect(() => {
    if (callState === "connected") {
      const interval = setInterval(() => {
        if (remoteStream.current && remoteVideoRef.current && !remoteVideoRef.current.srcObject) {
          remoteVideoRef.current.srcObject = remoteStream.current;
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [callState]);

  // Call duration timer
  useEffect(() => {
    if (callState !== "connected") return;
    const t = setInterval(() => setDuration(d => d+1), 1000);
    return () => clearInterval(t);
  }, [callState]);

  const fmt = (s:number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const handleEnd = () => { endCall(); router.push("/dashboard"); };

  return (
    <div style={{position:"fixed",inset:0,background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#E8F4FF",maxWidth:480,margin:"0 auto",left:0,right:0,display:"flex",flexDirection:"column"}}>
      <style>{S}</style>

      {/* ── INCOMING CALL (Doctor side) ── */}
      {callState === "incoming" && incomingCall && (
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px",background:"linear-gradient(180deg,#020D1A 0%,#0D2040 100%)"}}>
          <div style={{position:"relative",width:120,height:120,marginBottom:28}}>
            <div className="ring"/>
            <div className="ring ring2"/>
            <div className="ring ring3"/>
            <div style={{position:"relative",zIndex:2,width:120,height:120,borderRadius:"50%",background:"rgba(0,255,209,0.1)",border:"2px solid rgba(0,255,209,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:52}}>🧑</div>
          </div>

          <p style={{color:"rgba(232,244,255,0.5)",fontSize:14,marginBottom:6}}>Incoming {incomingCall.callType} call</p>
          <h2 style={{fontSize:26,fontWeight:900,marginBottom:6}}>{incomingCall.patientName}</h2>
          <span style={{padding:"4px 14px",borderRadius:100,background:"rgba(0,255,209,0.1)",color:"#00FFD1",fontSize:12,fontWeight:600,marginBottom:36}}>Patient</span>

          <div style={{display:"flex",gap:40,alignItems:"center"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
              <button className="end-btn" onClick={()=>{rejectCall(userId);router.push("/doctor/dashboard");}}>📵</button>
              <p style={{color:"rgba(232,244,255,0.5)",fontSize:11}}>Decline</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
              <button className="accept-btn" style={{animation:"pulse 1.5s infinite"}} onClick={()=>acceptCall(userId, userName)}>📞</button>
              <p style={{color:"#00FFD1",fontSize:11,fontWeight:700}}>Accept</p>
            </div>
          </div>
        </div>
      )}

      {/* ── CALLING (Patient waiting) ── */}
      {callState === "calling" && (
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px"}}>
          <div style={{position:"relative",width:110,height:110,marginBottom:28}}>
            <div className="ring"/><div className="ring ring2"/><div className="ring ring3"/>
            <div style={{position:"relative",zIndex:2,width:110,height:110,borderRadius:"50%",background:"rgba(0,255,209,0.08)",border:"2px solid rgba(0,255,209,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:48}}>👨‍⚕️</div>
          </div>
          <p style={{color:"rgba(232,244,255,0.5)",fontSize:14,marginBottom:6}}>Calling</p>
          <h2 style={{fontSize:24,fontWeight:900,marginBottom:4}}>{doctorName}</h2>
          <p style={{color:"#00FFD1",fontSize:12,marginBottom:36}}>Waiting for doctor to accept...</p>
          <button onClick={handleEnd} style={{padding:"12px 28px",borderRadius:100,background:"rgba(255,107,107,0.15)",border:"1px solid rgba(255,107,107,0.3)",color:"#FF6B6B",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
            Cancel Call
          </button>
        </div>
      )}

      {/* ── REJECTED / OFFLINE / ENDED ── */}
      {(callState==="rejected"||callState==="offline"||callState==="ended") && (
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px",textAlign:"center"}}>
          <div style={{fontSize:56,marginBottom:16}}>{callState==="ended"?"📵":callState==="rejected"?"😔":"📴"}</div>
          <h2 style={{fontSize:20,fontWeight:800,marginBottom:8}}>
            {callState==="ended"?"Call Ended":callState==="rejected"?"Call Declined":"Doctor Offline"}
          </h2>
          <p style={{color:"rgba(232,244,255,0.45)",fontSize:13,marginBottom:28,lineHeight:1.7}}>
            {callState==="ended"?"The call has ended.":callState==="rejected"?`${doctorName} is currently unavailable.`:"Doctor is offline. Try again later."}
          </p>
          {callState==="ended"&&duration>0&&<p style={{color:"#00FFD1",fontWeight:700,fontSize:15,marginBottom:20}}>Duration: {fmt(duration)}</p>}
          <button onClick={()=>router.push("/dashboard")} style={{padding:"13px 28px",borderRadius:14,background:"linear-gradient(135deg,#00C9A7,#0B6FCC)",color:"white",fontWeight:700,fontSize:14,border:"none",cursor:"pointer",fontFamily:"inherit"}}>
            Back to Home
          </button>
        </div>
      )}

      {/* ── CONNECTED: Video call ── */}
      {callState === "connected" && (
        <div style={{flex:1,display:"flex",flexDirection:"column",position:"relative"}}>
          {/* Remote video (full screen) */}
          {callType === "video" ? (
            <video ref={remoteVideoRef} autoPlay playsInline style={{width:"100%",height:"100%",objectFit:"cover",background:"#0D1B35"}}/>
          ) : (
            <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(180deg,#020D1A,#0D2040)",flexDirection:"column",gap:14}}>
              <div style={{width:100,height:100,borderRadius:"50%",background:"rgba(0,255,209,0.08)",border:"2px solid rgba(0,255,209,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:44}}>
                {role==="patient"?"👨‍⚕️":"🧑"}
              </div>
              <p style={{fontWeight:700,fontSize:16}}>{role==="patient"?doctorName:userName}</p>
              <p style={{color:"#00FFD1",fontSize:12}}>🎵 Audio call active</p>
            </div>
          )}

          {/* Local video (picture-in-picture) */}
          {callType === "video" && (
            <video ref={localVideoRef} autoPlay playsInline muted
              style={{position:"absolute",top:16,right:16,width:100,height:140,objectFit:"cover",borderRadius:14,border:"2px solid rgba(0,255,209,0.3)",background:"#0D1B35",transform:isVideoMuted?"none":"none"}}
            />
          )}

          {/* Duration */}
          <div style={{position:"absolute",top:16,left:16,display:"flex",alignItems:"center",gap:7,padding:"6px 13px",borderRadius:100,background:"rgba(2,13,26,0.75)",backdropFilter:"blur(10px)",border:"1px solid rgba(255,255,255,0.1)"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#FF4B4B",animation:"pulse 1s infinite"}}/>
            <span style={{fontWeight:700,fontSize:12}}>{fmt(duration)}</span>
          </div>

          {/* In-call chat */}
          {showChat && (
            <div style={{position:"absolute",bottom:100,left:0,right:0,background:"rgba(2,13,26,0.9)",backdropFilter:"blur(16px)",borderTop:"1px solid rgba(255,255,255,0.08)",padding:"10px 14px",maxHeight:200,overflowY:"auto"}}>
              {messages.length===0&&<p style={{color:"rgba(232,244,255,0.3)",fontSize:12,textAlign:"center"}}>No messages yet</p>}
              {messages.map((m,i)=>(
                <p key={i} style={{fontSize:12,color:"#E8F4FF",marginBottom:4}}><strong style={{color:"#00FFD1"}}>{m.from}:</strong> {m.text}</p>
              ))}
              <div style={{display:"flex",gap:8,marginTop:8}}>
                <input value={chatMsg} onChange={e=>setChatMsg(e.target.value)} placeholder="Type a message..." onKeyDown={e=>{ if(e.key==="Enter"&&chatMsg.trim()){setMessages(p=>[...p,{from:userName,text:chatMsg}]);setChatMsg("");}}}
                  style={{flex:1,padding:"8px 11px",borderRadius:10,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",color:"#E8F4FF",fontFamily:"inherit",fontSize:12,outline:"none"}}
                />
                <button onClick={()=>{if(chatMsg.trim()){setMessages(p=>[...p,{from:userName,text:chatMsg}]);setChatMsg("");}}} style={{padding:"8px 14px",borderRadius:10,background:"linear-gradient(135deg,#00C9A7,#0B6FCC)",border:"none",cursor:"pointer",color:"white",fontWeight:700,fontSize:12,fontFamily:"inherit"}}>Send</button>
              </div>
            </div>
          )}

          {/* Controls */}
          <div style={{flexShrink:0,padding:"14px 20px 24px",background:"rgba(2,13,26,0.9)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.07)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16}}>
              <button className="ctrl-btn" onClick={toggleAudio} style={{background:isAudioMuted?"rgba(255,107,107,0.2)":"rgba(255,255,255,0.08)"}}>
                {isAudioMuted?"🔇":"🎙️"}
              </button>
              {callType==="video"&&(
                <button className="ctrl-btn" onClick={toggleVideo} style={{background:isVideoMuted?"rgba(255,107,107,0.2)":"rgba(255,255,255,0.08)"}}>
                  {isVideoMuted?"📷":"📹"}
                </button>
              )}
              <button className="ctrl-btn" onClick={()=>setShowChat(p=>!p)} style={{background:showChat?"rgba(0,255,209,0.15)":"rgba(255,255,255,0.08)"}}>💬</button>
              <button className="end-btn" onClick={handleEnd}>📵</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
