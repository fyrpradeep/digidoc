"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

// TURN servers for reliable video calls
const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
  {
    urls: [
      "turn:openrelay.metered.ca:80",
      "turn:openrelay.metered.ca:443",
      "turn:openrelay.metered.ca:443?transport=tcp",
    ],
    username: "openrelayproject",
    credential: "openrelayproject",
  },
];

const S = `
  *{box-sizing:border-box;margin:0;padding:0}html,body{height:100%;overflow:hidden}
  @keyframes rp{0%{transform:scale(1);opacity:.8}to{transform:scale(2.5);opacity:0}}
  @keyframes ps{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
  @keyframes sp{to{transform:rotate(360deg)}}
  .ring{position:absolute;width:100%;height:100%;border-radius:50%;border:2px solid rgba(0,255,209,.4);animation:rp 2s infinite}
  .r2{animation-delay:.7s}
  .ctrl{width:54px;height:54px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;font-size:22px;transition:all .2s}
  .end-btn{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;font-size:26px;background:linear-gradient(135deg,#FF4B4B,#CC0000);box-shadow:0 0 24px rgba(255,75,75,.5)}
  .acc-btn{width:68px;height:68px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;font-size:28px;background:linear-gradient(135deg,#00C9A7,#0B6FCC);box-shadow:0 0 24px rgba(0,201,167,.5);animation:ps 1.5s infinite}
`;

export default function CallPage() {
  const p = useParams();
  const s = useSearchParams();
  const roomId     = p.roomId as string;
  const role       = s.get("role") || "patient";
  const userId     = s.get("userId") || "u1";
  const userName   = decodeURIComponent(s.get("userName") || "User");
  const doctorId   = s.get("doctorId") || "d1";
  const doctorName = decodeURIComponent(s.get("doctorName") || "Doctor");
  const callType   = s.get("callType") || "video";

  const localRef   = useRef<HTMLVideoElement>(null);
  const remoteRef  = useRef<HTMLVideoElement>(null);
  const sockRef    = useRef<any>(null);
  const pcRef      = useRef<RTCPeerConnection|null>(null);
  const streamRef  = useRef<MediaStream|null>(null);

  const [status, setStatus]   = useState<"calling"|"incoming"|"connected"|"ended"|"rejected"|"error">(role==="doctor"?"incoming":"calling");
  const [inc, setInc]         = useState<any>(null);
  const [dur, setDur]         = useState(0);
  const [muted, setMuted]     = useState(false);
  const [vidOff, setVidOff]   = useState(false);
  const [errMsg, setErrMsg]   = useState("");
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api").replace("/api","");
    import("socket.io-client").then(({ io }) => {
      const sk = io(`${URL}/call`, { transports: ["websocket","polling"] });
      sockRef.current = sk;

      sk.on("connect", () => {
        sk.emit("register", { userId, role, name: userName });
        if (role === "patient") {
          sk.emit("call:request", { roomId, patientId: userId, patientName: userName, doctorId, doctorName, callType });
        }
      });

      sk.on("call:incoming", (d: any) => { setInc(d); setStatus("incoming"); });
      sk.on("call:accepted", async () => { setConnecting(true); setStatus("connected"); await startWebRTC(true); setConnecting(false); });
      sk.on("call:rejected", () => setStatus("rejected"));
      sk.on("call:doctor-offline", () => { setStatus("error"); setErrMsg("Doctor is offline"); });
      sk.on("call:ended", () => { setStatus("ended"); cleanup(); });

      sk.on("webrtc:offer", async (d: any) => {
        if (!pcRef.current) await setupPC();
        await pcRef.current!.setRemoteDescription(d.offer);
        const ans = await pcRef.current!.createAnswer();
        await pcRef.current!.setLocalDescription(ans);
        sk.emit("webrtc:answer", { roomId, answer: ans, fromId: userId });
      });
      sk.on("webrtc:answer", async (d: any) => { await pcRef.current?.setRemoteDescription(d.answer); });
      sk.on("webrtc:ice", async (d: any) => { try { await pcRef.current?.addIceCandidate(d.candidate); } catch {} });
    }).catch(() => {});

    return () => { cleanup(); sockRef.current?.disconnect(); };
  }, []);

  useEffect(() => {
    if (status !== "connected") return;
    const t = setInterval(() => setDur(d => d+1), 1000);
    return () => clearInterval(t);
  }, [status]);

  const setupPC = async () => {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    pcRef.current = pc;

    // Get media stream
    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia(callType==="video" ? { video: { width:640,height:480 }, audio: true } : { audio: true });
    } catch {
      try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch {}
    }
    if (stream) {
      streamRef.current = stream;
      stream.getTracks().forEach(t => pc.addTrack(t, stream!));
      if (localRef.current && callType==="video") { localRef.current.srcObject = stream; localRef.current.muted = true; }
    }

    pc.ontrack = (e) => {
      if (remoteRef.current) { remoteRef.current.srcObject = e.streams[0]; }
    };
    pc.onicecandidate = (e) => {
      if (e.candidate) sockRef.current?.emit("webrtc:ice", { roomId, candidate: e.candidate, fromId: userId });
    };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed") { setErrMsg("Connection failed. Please retry."); }
    };
    return pc;
  };

  const startWebRTC = async (initiator: boolean) => {
    await setupPC();
    if (initiator) {
      const offer = await pcRef.current!.createOffer();
      await pcRef.current!.setLocalDescription(offer);
      sockRef.current?.emit("webrtc:offer", { roomId, offer, fromId: userId });
    }
  };

  const cleanup = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    pcRef.current?.close();
    streamRef.current = null; pcRef.current = null;
  };

  const acceptCall = async () => {
    setConnecting(true);
    sockRef.current?.emit("call:accept", { roomId: inc?.roomId||roomId, doctorId: userId, doctorName: userName });
    setStatus("connected");
    await startWebRTC(false);
    setConnecting(false); setInc(null);
  };

  const rejectCall = () => {
    sockRef.current?.emit("call:reject", { roomId: inc?.roomId||roomId, doctorId: userId });
    window.location.href = "/doctor/dashboard";
  };

  const endCall = () => { sockRef.current?.emit("call:end", { roomId, userId }); cleanup(); setStatus("ended"); };
  const toggleMic = () => { const t = streamRef.current?.getAudioTracks()[0]; if(t) { t.enabled=!t.enabled; setMuted(!t.enabled); } };
  const toggleCam = () => { const t = streamRef.current?.getVideoTracks()[0]; if(t) { t.enabled=!t.enabled; setVidOff(!t.enabled); } };
  const fmt = (n: number) => `${String(Math.floor(n/60)).padStart(2,"0")}:${String(n%60).padStart(2,"0")}`;

  return (
    <div style={{position:"fixed",inset:0,background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#E8F4FF",display:"flex",flexDirection:"column"}}>
      <style>{S}</style>

      {/* CALLING */}
      {status==="calling" && (
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,background:"linear-gradient(180deg,#020D1A,#0D2040)"}}>
          <div style={{position:"relative",width:110,height:110,marginBottom:24}}>
            <div className="ring"/><div className="ring r2"/>
            <div style={{position:"relative",zIndex:2,width:110,height:110,borderRadius:"50%",background:"rgba(0,255,209,.08)",border:"2px solid rgba(0,255,209,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:48}}>👨‍⚕️</div>
          </div>
          <p style={{color:"rgba(232,244,255,.5)",fontSize:14,marginBottom:6}}>Calling</p>
          <h2 style={{fontSize:22,fontWeight:900,marginBottom:4}}>{doctorName}</h2>
          <p style={{color:"#00FFD1",fontSize:12,marginBottom:32}}>Waiting for doctor to accept...</p>
          <button onClick={endCall} style={{padding:"12px 28px",borderRadius:100,background:"rgba(255,107,107,.15)",border:"1px solid rgba(255,107,107,.3)",color:"#FF6B6B",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>Cancel Call</button>
        </div>
      )}

      {/* INCOMING (doctor side) */}
      {status==="incoming" && (
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,background:"linear-gradient(180deg,#020D1A,#0D2040)"}}>
          <div style={{position:"relative",width:120,height:120,marginBottom:24}}>
            <div className="ring"/><div className="ring r2"/>
            <div style={{position:"relative",zIndex:2,width:120,height:120,borderRadius:"50%",background:"rgba(0,255,209,.08)",border:"2px solid rgba(0,255,209,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:52}}>🧑</div>
          </div>
          <p style={{color:"rgba(232,244,255,.5)",fontSize:14,marginBottom:6}}>Incoming {callType} call</p>
          <h2 style={{fontSize:24,fontWeight:900,marginBottom:32}}>{inc?.patientName || "Patient"}</h2>
          {connecting ? (
            <div style={{textAlign:"center"}}>
              <p style={{color:"#00FFD1",fontSize:13,marginBottom:8}}>Connecting...</p>
            </div>
          ) : (
            <div style={{display:"flex",gap:40}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                <button onClick={rejectCall} className="end-btn">📵</button>
                <p style={{color:"rgba(232,244,255,.5)",fontSize:12}}>Decline</p>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                <button onClick={acceptCall} className="acc-btn">📞</button>
                <p style={{color:"#00FFD1",fontSize:12,fontWeight:700}}>Accept</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CONNECTED */}
      {status==="connected" && (
        <div style={{flex:1,display:"flex",flexDirection:"column",position:"relative"}}>
          {callType==="video" ? (
            <video ref={remoteRef} autoPlay playsInline style={{width:"100%",height:"100%",objectFit:"cover",background:"#0D1B35"}}/>
          ) : (
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(180deg,#020D1A,#0D2040)"}}>
              <div style={{width:90,height:90,borderRadius:"50%",background:"rgba(0,255,209,.08)",border:"2px solid rgba(0,255,209,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,marginBottom:12}}>
                {role==="patient" ? "👨‍⚕️" : "🧑"}
              </div>
              <p style={{fontWeight:700,fontSize:16,marginBottom:4}}>{role==="patient" ? doctorName : inc?.patientName||"Patient"}</p>
              <p style={{color:"#00FFD1",fontSize:12}}>🎵 Audio call connected</p>
            </div>
          )}

          {/* Local video pip */}
          {callType==="video" && !vidOff && (
            <video ref={localRef} autoPlay playsInline muted
              style={{position:"absolute",top:16,right:16,width:90,height:130,objectFit:"cover",borderRadius:12,border:"2px solid rgba(0,255,209,.3)",background:"#0D1B35"}}/>
          )}

          {/* Duration */}
          <div style={{position:"absolute",top:16,left:16,display:"flex",alignItems:"center",gap:7,padding:"6px 13px",borderRadius:100,background:"rgba(2,13,26,.85)"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#FF4B4B"}}/>
            <span style={{fontWeight:700,fontSize:12}}>{fmt(dur)}</span>
          </div>

          {/* Controls */}
          <div style={{flexShrink:0,padding:"14px 20px 24px",background:"rgba(2,13,26,.9)",backdropFilter:"blur(20px)",display:"flex",alignItems:"center",justifyContent:"center",gap:16}}>
            <button className="ctrl" onClick={toggleMic} style={{background:muted?"rgba(255,107,107,.2)":"rgba(255,255,255,.08)"}}>
              {muted ? "🔇" : "🎙️"}
            </button>
            {callType==="video" && (
              <button className="ctrl" onClick={toggleCam} style={{background:vidOff?"rgba(255,107,107,.2)":"rgba(255,255,255,.08)"}}>
                {vidOff ? "📷" : "📹"}
              </button>
            )}
            <button className="end-btn" onClick={endCall}>📵</button>
          </div>
        </div>
      )}

      {/* ENDED / REJECTED / ERROR */}
      {(status==="ended"||status==="rejected"||status==="error") && (
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center"}}>
          <div style={{fontSize:56,marginBottom:16}}>{status==="ended"?"📵":status==="rejected"?"😔":"📴"}</div>
          <h2 style={{fontSize:20,fontWeight:800,marginBottom:8}}>
            {status==="ended"?"Call Ended":status==="rejected"?"Call Declined":"Connection Failed"}
          </h2>
          <p style={{color:"rgba(232,244,255,.45)",fontSize:13,marginBottom:8}}>
            {status==="ended"?`Duration: ${fmt(dur)}`:status==="rejected"?"Doctor is unavailable":errMsg||"Could not connect"}
          </p>
          <button onClick={()=>window.location.href=role==="doctor"?"/doctor/dashboard":"/dashboard"}
            style={{marginTop:16,padding:"13px 28px",borderRadius:14,background:"linear-gradient(135deg,#00C9A7,#0B6FCC)",color:"#fff",fontWeight:700,fontSize:14,border:"none",cursor:"pointer",fontFamily:"inherit"}}>
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}
