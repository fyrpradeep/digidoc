"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

const S = `
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes ripple{0%{transform:scale(1);opacity:0.8}100%{transform:scale(2.5);opacity:0}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  .ring{position:absolute;width:100%;height:100%;border-radius:50%;border:2px solid rgba(0,255,209,0.4);animation:ripple 2s infinite}
  .ring2{animation-delay:0.7s}
`;

export default function CallPage() {
  const router = useRouter();
  const params = useParams();
  const search = useSearchParams();
  const roomId     = params.roomId as string;
  const role       = search.get("role")||"patient";
  const userId     = search.get("userId")||"u1";
  const userName   = search.get("userName")||"User";
  const doctorId   = search.get("doctorId")||"d1";
  const doctorName = decodeURIComponent(search.get("doctorName")||"Doctor");
  const callType   = search.get("callType")||"video";

  const localRef  = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<any>(null);
  const pcRef     = useRef<RTCPeerConnection|null>(null);
  const streamRef = useRef<MediaStream|null>(null);

  const [status, setStatus]   = useState<"calling"|"incoming"|"connected"|"ended"|"rejected"|"error">(
    role==="doctor"?"incoming":"calling"
  );
  const [duration, setDuration] = useState(0);
  const [muted, setMuted]     = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [incomingData, setIncomingData] = useState<any>(null);

  // ── Connect Socket ──────────────────────────────────────────────
  useEffect(()=>{
    const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL||"http://localhost:4000/api").replace("/api","");
    import("socket.io-client").then(({io})=>{
      const socket = io(`${SOCKET_URL}/call`,{transports:["websocket"]});
      socketRef.current = socket;

      socket.on("connect",()=>{
        socket.emit("register",{userId,role,name:userName});

        if(role==="patient"){
          socket.emit("call:request",{roomId,patientId:userId,patientName:userName,doctorId,doctorName,callType});
        }
      });

      socket.on("call:incoming",(data:any)=>{
        setIncomingData(data);
        setStatus("incoming");
      });

      socket.on("call:accepted",()=>{
        setStatus("connected");
        startWebRTC(true);
      });

      socket.on("call:rejected",()=>setStatus("rejected"));
      socket.on("call:doctor-offline",()=>{ setErrorMsg("Doctor is offline"); setStatus("error"); });
      socket.on("call:ended",()=>{ setStatus("ended"); cleanup(); });

      socket.on("webrtc:offer",async(data:any)=>{
        if(!pcRef.current) await setupPC();
        await pcRef.current!.setRemoteDescription(data.offer);
        const answer = await pcRef.current!.createAnswer();
        await pcRef.current!.setLocalDescription(answer);
        socket.emit("webrtc:answer",{roomId,answer,fromId:userId});
      });

      socket.on("webrtc:answer",async(data:any)=>{
        await pcRef.current?.setRemoteDescription(data.answer);
      });

      socket.on("webrtc:ice",async(data:any)=>{
        try{ await pcRef.current?.addIceCandidate(data.candidate); }catch{}
      });
    }).catch(()=>{
      // No socket — show simple UI
      if(role==="patient") setStatus("calling");
      if(role==="doctor") setStatus("incoming");
    });

    return ()=>{ cleanup(); socketRef.current?.disconnect(); };
  },[]);

  // Duration timer
  useEffect(()=>{
    if(status!=="connected") return;
    const t = setInterval(()=>setDuration(d=>d+1),1000);
    return ()=>clearInterval(t);
  },[status]);

  const setupPC = async()=>{
    const pc = new RTCPeerConnection({iceServers:[{urls:"stun:stun.l.google.com:19302"}]});
    pcRef.current = pc;

    // Get media — video or audio only
    try{
      const stream = await navigator.mediaDevices.getUserMedia(
        callType==="video"?{video:true,audio:true}:{audio:true}
      );
      streamRef.current = stream;
      stream.getTracks().forEach(t=>pc.addTrack(t,stream));
      if(localRef.current&&callType==="video"){
        localRef.current.srcObject = stream;
        localRef.current.muted = true;
      }
    }catch{
      // Camera not available — continue audio only
      try{
        const stream = await navigator.mediaDevices.getUserMedia({audio:true});
        streamRef.current = stream;
        stream.getTracks().forEach(t=>pc.addTrack(t,stream));
      }catch{ /* no mic either */ }
    }

    pc.ontrack = (e)=>{
      if(remoteRef.current) remoteRef.current.srcObject = e.streams[0];
    };

    pc.onicecandidate = (e)=>{
      if(e.candidate) socketRef.current?.emit("webrtc:ice",{roomId,candidate:e.candidate,fromId:userId});
    };

    return pc;
  };

  const startWebRTC = async(isInitiator:boolean)=>{
    await setupPC();
    if(isInitiator){
      const offer = await pcRef.current!.createOffer();
      await pcRef.current!.setLocalDescription(offer);
      socketRef.current?.emit("webrtc:offer",{roomId,offer,fromId:userId});
    }
  };

  const cleanup = ()=>{
    streamRef.current?.getTracks().forEach(t=>t.stop());
    pcRef.current?.close();
    streamRef.current = null;
    pcRef.current = null;
  };

  const acceptCall = async()=>{
    socketRef.current?.emit("call:accept",{roomId:incomingData?.roomId||roomId,doctorId:userId,doctorName:userName});
    setStatus("connected");
    await startWebRTC(false);
  };

  const rejectCall = ()=>{
    socketRef.current?.emit("call:reject",{roomId:incomingData?.roomId||roomId,doctorId:userId});
    router.push("/doctor/dashboard");
  };

  const endCall = ()=>{
    socketRef.current?.emit("call:end",{roomId,userId});
    cleanup();
    setStatus("ended");
  };

  const toggleMute = ()=>{
    const track = streamRef.current?.getAudioTracks()[0];
    if(track){ track.enabled=!track.enabled; setMuted(!track.enabled); }
  };

  const toggleVideo = ()=>{
    const track = streamRef.current?.getVideoTracks()[0];
    if(track){ track.enabled=!track.enabled; setVideoOff(!track.enabled); }
  };

  const fmt=(s:number)=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return(
    <div style={{position:"fixed",inset:0,background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#E8F4FF",display:"flex",flexDirection:"column"}}>
      <style>{S}</style>

      {/* CALLING — Patient waiting */}
      {status==="calling"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,background:"linear-gradient(180deg,#020D1A,#0D2040)"}}>
          <div style={{position:"relative",width:110,height:110,marginBottom:24}}>
            <div className="ring"/><div className="ring ring2"/>
            <div style={{position:"relative",zIndex:2,width:110,height:110,borderRadius:"50%",background:"rgba(0,255,209,0.08)",border:"2px solid rgba(0,255,209,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:48}}>👨‍⚕️</div>
          </div>
          <p style={{color:"rgba(232,244,255,0.5)",fontSize:14,marginBottom:6}}>Calling</p>
          <h2 style={{fontSize:22,fontWeight:900,marginBottom:4}}>{doctorName}</h2>
          <p style={{color:"#00FFD1",fontSize:12,marginBottom:32}}>Waiting for doctor to accept...</p>
          <button onClick={endCall} style={{padding:"12px 28px",borderRadius:100,background:"rgba(255,107,107,0.15)",border:"1px solid rgba(255,107,107,0.3)",color:"#FF6B6B",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Cancel Call</button>
        </div>
      )}

      {/* INCOMING — Doctor */}
      {status==="incoming"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,background:"linear-gradient(180deg,#020D1A,#0D2040)"}}>
          <div style={{position:"relative",width:120,height:120,marginBottom:24}}>
            <div className="ring"/><div className="ring ring2"/>
            <div style={{position:"relative",zIndex:2,width:120,height:120,borderRadius:"50%",background:"rgba(0,255,209,0.08)",border:"2px solid rgba(0,255,209,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:52}}>🧑</div>
          </div>
          <p style={{color:"rgba(232,244,255,0.5)",fontSize:14,marginBottom:6}}>Incoming {callType} call</p>
          <h2 style={{fontSize:24,fontWeight:900,marginBottom:32}}>{incomingData?.patientName||"Patient"}</h2>
          <div style={{display:"flex",gap:40}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
              <button onClick={rejectCall} style={{width:68,height:68,borderRadius:"50%",background:"linear-gradient(135deg,#FF4B4B,#CC0000)",border:"none",cursor:"pointer",fontSize:26,display:"flex",alignItems:"center",justifyContent:"center"}}>📵</button>
              <p style={{color:"rgba(232,244,255,0.5)",fontSize:12}}>Decline</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
              <button onClick={acceptCall} style={{width:68,height:68,borderRadius:"50%",background:"linear-gradient(135deg,#00C9A7,#0B6FCC)",border:"none",cursor:"pointer",fontSize:26,display:"flex",alignItems:"center",justifyContent:"center",animation:"pulse 1.5s infinite"}}>📞</button>
              <p style={{color:"#00FFD1",fontSize:12,fontWeight:700}}>Accept</p>
            </div>
          </div>
        </div>
      )}

      {/* CONNECTED — Video/Audio Call */}
      {status==="connected"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",position:"relative"}}>
          {/* Remote video */}
          {callType==="video"?(
            <video ref={remoteRef} autoPlay playsInline style={{width:"100%",height:"100%",objectFit:"cover",background:"#0D1B35"}}/>
          ):(
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(180deg,#020D1A,#0D2040)"}}>
              <div style={{width:90,height:90,borderRadius:"50%",background:"rgba(0,255,209,0.08)",border:"2px solid rgba(0,255,209,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,marginBottom:12}}>
                {role==="patient"?"👨‍⚕️":"🧑"}
              </div>
              <p style={{fontWeight:700,fontSize:16,marginBottom:4}}>{role==="patient"?doctorName:incomingData?.patientName||"Patient"}</p>
              <p style={{color:"#00FFD1",fontSize:12}}>🎵 Audio call connected</p>
            </div>
          )}

          {/* Local video pip */}
          {callType==="video"&&!videoOff&&(
            <video ref={localRef} autoPlay playsInline muted style={{position:"absolute",top:16,right:16,width:90,height:130,objectFit:"cover",borderRadius:12,border:"2px solid rgba(0,255,209,0.3)",background:"#0D1B35"}}/>
          )}

          {/* Duration */}
          <div style={{position:"absolute",top:16,left:16,display:"flex",alignItems:"center",gap:7,padding:"6px 13px",borderRadius:100,background:"rgba(2,13,26,0.8)",backdropFilter:"blur(10px)"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#FF4B4B",animation:"pulse 1s infinite"}}/>
            <span style={{fontWeight:700,fontSize:12}}>{fmt(duration)}</span>
          </div>

          {/* Controls */}
          <div style={{flexShrink:0,padding:"14px 20px 24px",background:"rgba(2,13,26,0.9)",backdropFilter:"blur(20px)",display:"flex",alignItems:"center",justifyContent:"center",gap:16}}>
            <button onClick={toggleMute} style={{width:54,height:54,borderRadius:"50%",background:muted?"rgba(255,107,107,0.2)":"rgba(255,255,255,0.08)",border:"none",cursor:"pointer",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>
              {muted?"🔇":"🎙️"}
            </button>
            {callType==="video"&&(
              <button onClick={toggleVideo} style={{width:54,height:54,borderRadius:"50%",background:videoOff?"rgba(255,107,107,0.2)":"rgba(255,255,255,0.08)",border:"none",cursor:"pointer",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {videoOff?"📷":"📹"}
              </button>
            )}
            <button onClick={endCall} style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,#FF4B4B,#CC0000)",border:"none",cursor:"pointer",fontSize:26,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 24px rgba(255,75,75,0.5)"}}>📵</button>
          </div>
        </div>
      )}

      {/* ENDED / REJECTED / ERROR */}
      {(status==="ended"||status==="rejected"||status==="error")&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center"}}>
          <div style={{fontSize:56,marginBottom:16}}>{status==="ended"?"📵":status==="rejected"?"😔":"📴"}</div>
          <h2 style={{fontSize:20,fontWeight:800,marginBottom:8}}>
            {status==="ended"?"Call Ended":status==="rejected"?"Call Declined":"Connection Failed"}
          </h2>
          <p style={{color:"rgba(232,244,255,0.45)",fontSize:13,marginBottom:8,lineHeight:1.7}}>
            {status==="ended"?`Duration: ${fmt(duration)}`:status==="rejected"?"Doctor unavailable right now.":errorMsg||"Could not connect."}
          </p>
          <button onClick={()=>window.location.href=role==="doctor"?"/doctor/dashboard":"/dashboard"}
            style={{marginTop:16,padding:"13px 28px",borderRadius:14,background:"linear-gradient(135deg,#00C9A7,#0B6FCC)",color:"white",fontWeight:700,fontSize:14,border:"none",cursor:"pointer",fontFamily:"inherit"}}>
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}
