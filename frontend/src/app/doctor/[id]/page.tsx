"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type CallType = "video" | "audio";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.4);opacity:0}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
  @keyframes waveBar{0%,100%{transform:scaleY(0.3)}50%{transform:scaleY(1)}}
  @keyframes ping{0%{transform:scale(1);opacity:0.8}100%{transform:scale(2.2);opacity:0}}
  .fade-up{animation:fadeUp 0.5s ease both}
  .slide-up{animation:slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both}
  .cb{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;width:58px;height:58px;border-radius:18px;border:none;cursor:pointer;transition:all 0.25s;font-family:inherit}
  .cb:active{transform:scale(0.92)}
  .cb:hover{transform:translateY(-2px)}
  .end-btn{width:68px;height:68px;border-radius:50%;border:none;cursor:pointer;transition:all 0.3s;display:flex;align-items:center;justify-content:center;background:#FF3B30;box-shadow:0 0 28px rgba(255,59,48,0.5)}
  .end-btn:hover{transform:scale(1.08);box-shadow:0 0 40px rgba(255,59,48,0.7)}
  .end-btn:active{transform:scale(0.95)}
  .livdot{width:8px;height:8px;border-radius:50%;background:#00FFD1;display:inline-block;position:relative}
  .livdot::after{content:'';position:absolute;inset:-4px;border-radius:50%;background:rgba(0,255,209,0.3);animation:ripple 1.8s infinite}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
`;

export default function CallPage() {
  const router = useRouter();
  const [callType, setCallType]   = useState<CallType>("video");
  const [muted, setMuted]         = useState(false);
  const [camOff, setCamOff]       = useState(false);
  const [speaker, setSpeaker]     = useState(true);
  const [seconds, setSeconds]     = useState(0);
  const [phase, setPhase]         = useState<"connecting"|"ringing"|"connected">("connecting");
  const [showChat, setShowChat]   = useState(false);
  const [chatMsg, setChatMsg]     = useState("");
  const [messages, setMessages]   = useState([
    { from: "doctor", text: "Hello! I can see you clearly. How are you feeling today?" }
  ]);
  const chatRef = useRef<HTMLDivElement>(null);

  // Simulate call phases
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("ringing"),   1500);
    const t2 = setTimeout(() => setPhase("connected"), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Timer
  useEffect(() => {
    if (phase !== "connected") return;
    const t = setInterval(() => setSeconds(p => p + 1), 1000);
    return () => clearInterval(t);
  }, [phase]);

  // Auto scroll chat
  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const sendMsg = () => {
    if (!chatMsg.trim()) return;
    setMessages(p => [...p, { from: "patient", text: chatMsg }]);
    setChatMsg("");
    setTimeout(() => {
      setMessages(p => [...p, { from: "doctor", text: "I understand. Let me note that down. Please continue." }]);
    }, 2000);
  };

  const endCall = () => router.back();

  return (
    <div style={{
      position: "fixed", inset: 0,
      display: "flex", flexDirection: "column",
      background: "#020D1A", fontFamily: "'Plus Jakarta Sans',sans-serif",
      color: "#E8F4FF", maxWidth: 480, margin: "0 auto",
      left: "50%", transform: "translateX(-50%)",
    }}>
      <style>{S}</style>

      {/* ════════════════════════════════
          CONNECTING PHASE
      ════════════════════════════════ */}
      {phase === "connecting" && (
        <div className="fade-up" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
          <div style={{ position: "relative", marginBottom: 32 }}>
            {/* Ping rings */}
            {[0, 1, 2].map(i => (
              <div key={i} style={{ position: "absolute", inset: -20 - i * 20, borderRadius: "50%", border: "1.5px solid rgba(0,255,209,0.2)", animation: `ping 2s ${i * 0.4}s ease-out infinite` }} />
            ))}
            <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg,rgba(0,201,167,0.2),rgba(11,111,204,0.2))", border: "2px solid rgba(0,255,209,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46 }}>👩‍⚕️</div>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Dr. Priya Sharma</h2>
          <p style={{ color: "#00FFD1", fontSize: 13, fontWeight: 600, marginBottom: 32 }}>General Physician</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#00FFD1", animation: `blink 1.2s ${i * 0.2}s infinite` }} />
              ))}
            </div>
            <p style={{ color: "rgba(232,244,255,0.5)", fontSize: 13 }}>Connecting...</p>
          </div>
        </div>
      )}

      {/* ════════════════════════════════
          RINGING PHASE
      ════════════════════════════════ */}
      {phase === "ringing" && (
        <div className="fade-up" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
          <div style={{ position: "relative", marginBottom: 32 }}>
            {[0, 1].map(i => (
              <div key={i} style={{ position: "absolute", inset: -16 - i * 16, borderRadius: "50%", border: "2px solid rgba(0,255,209,0.25)", animation: `ping 1.5s ${i * 0.3}s ease-out infinite` }} />
            ))}
            <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg,rgba(0,201,167,0.25),rgba(11,111,204,0.25))", border: "2px solid rgba(0,255,209,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46 }}>👩‍⚕️</div>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Dr. Priya Sharma</h2>
          <p style={{ color: "#00FFD1", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>General Physician</p>
          <p style={{ color: "rgba(232,244,255,0.5)", fontSize: 13, marginBottom: 32, animation: "pulse 1.5s infinite" }}>Ringing...</p>
          <button onClick={endCall} className="end-btn" style={{ width: 56, height: 56 }}>
            <span style={{ fontSize: 24 }}>📵</span>
          </button>
          <p style={{ color: "rgba(232,244,255,0.3)", fontSize: 12, marginTop: 12 }}>Tap to cancel</p>
        </div>
      )}

      {/* ════════════════════════════════
          CONNECTED PHASE
      ════════════════════════════════ */}
      {phase === "connected" && !showChat && (
        <div className="fade-up" style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>

          {/* VIDEO AREA */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden", background: callType === "video" ? "linear-gradient(160deg,#030f20,#071828)" : "#020D1A" }}>

            {callType === "video" && !camOff ? (
              <>
                {/* Doctor video (main) */}
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 80, marginBottom: 8 }}>👩‍⚕️</div>
                    <p style={{ color: "rgba(232,244,255,0.6)", fontSize: 13 }}>Dr. Priya Sharma</p>
                  </div>
                </div>
                {/* Patient self-view */}
                <div style={{ position: "absolute", bottom: 16, right: 16, width: 80, height: 100, borderRadius: 14, background: "rgba(0,255,209,0.08)", border: "2px solid rgba(0,255,209,0.3)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <span style={{ fontSize: 32 }}>🧑</span>
                </div>
              </>
            ) : callType === "audio" ? (
              /* AUDIO UI */
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ position: "relative", marginBottom: 20 }}>
                  <div style={{ width: 110, height: 110, borderRadius: "50%", background: "linear-gradient(135deg,rgba(0,201,167,0.2),rgba(11,111,204,0.2))", border: "2px solid rgba(0,255,209,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, animation: muted ? "none" : "pulse 2s infinite" }}>👩‍⚕️</div>
                </div>
                {/* Sound wave bars */}
                {!muted && (
                  <div style={{ display: "flex", gap: 5, alignItems: "center", height: 32 }}>
                    {[0.3, 0.6, 1, 0.8, 0.5, 0.9, 0.4, 0.7, 0.3].map((h, i) => (
                      <div key={i} style={{ width: 4, borderRadius: 2, background: "#00FFD1", animation: `waveBar 0.8s ${i * 0.1}s ease-in-out infinite`, height: `${h * 28}px` }} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Camera Off */
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, marginBottom: 12 }}>👩‍⚕️</div>
                <p style={{ color: "rgba(232,244,255,0.45)", fontSize: 13 }}>Camera is off</p>
              </div>
            )}

            {/* TOP BAR */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(to bottom,rgba(2,13,26,0.8),transparent)" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span className="livdot" />
                  <span style={{ color: "#00FFD1", fontSize: 11, fontWeight: 700 }}>Connected</span>
                </div>
                <p style={{ color: "rgba(232,244,255,0.7)", fontSize: 12 }}>Dr. Priya Sharma</p>
              </div>
              <div style={{ background: "rgba(2,13,26,0.7)", backdropFilter: "blur(10px)", borderRadius: 20, padding: "6px 14px", border: "1px solid rgba(0,255,209,0.2)" }}>
                <span style={{ color: "#00FFD1", fontWeight: 800, fontSize: 14, fontVariantNumeric: "tabular-nums" }}>{fmt(seconds)}</span>
              </div>
            </div>

            {/* CALL TYPE SWITCHER */}
            <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", display: "flex", background: "rgba(2,13,26,0.7)", backdropFilter: "blur(10px)", borderRadius: 20, padding: 3, gap: 2 }}>
              {(["video", "audio"] as CallType[]).map(t => (
                <button key={t} onClick={() => setCallType(t)} style={{ padding: "5px 14px", borderRadius: 17, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 700, transition: "all 0.2s", background: callType === t ? "linear-gradient(135deg,#00C9A7,#0B6FCC)" : "transparent", color: callType === t ? "white" : "rgba(232,244,255,0.45)" }}>
                  {t === "video" ? "📹 Video" : "📞 Audio"}
                </button>
              ))}
            </div>
          </div>

          {/* CONTROLS BAR */}
          <div className="slide-up" style={{ padding: "20px 16px 28px", background: "rgba(2,13,26,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 16 }}>

              {/* Mute */}
              <button className="cb" onClick={() => setMuted(p => !p)} style={{ background: muted ? "rgba(255,107,107,0.15)" : "rgba(255,255,255,0.06)", border: `1px solid ${muted ? "rgba(255,107,107,0.3)" : "rgba(255,255,255,0.1)"}` }}>
                <span style={{ fontSize: 22 }}>{muted ? "🔇" : "🎤"}</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: muted ? "#FF6B6B" : "rgba(232,244,255,0.55)" }}>{muted ? "Unmute" : "Mute"}</span>
              </button>

              {/* Camera */}
              <button className="cb" onClick={() => setCamOff(p => !p)} style={{ background: camOff ? "rgba(255,107,107,0.15)" : "rgba(255,255,255,0.06)", border: `1px solid ${camOff ? "rgba(255,107,107,0.3)" : "rgba(255,255,255,0.1)"}` }}>
                <span style={{ fontSize: 22 }}>{camOff ? "📷" : "📸"}</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: camOff ? "#FF6B6B" : "rgba(232,244,255,0.55)" }}>{camOff ? "Start Cam" : "Stop Cam"}</span>
              </button>

              {/* END CALL */}
              <button className="end-btn" onClick={endCall}>
                <span style={{ fontSize: 26, filter: "brightness(0) invert(1)" }}>📵</span>
              </button>

              {/* Speaker */}
              <button className="cb" onClick={() => setSpeaker(p => !p)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ fontSize: 22 }}>{speaker ? "🔊" : "🔈"}</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: "rgba(232,244,255,0.55)" }}>{speaker ? "Speaker" : "Earpiece"}</span>
              </button>

              {/* Chat */}
              <button className="cb" onClick={() => setShowChat(true)} style={{ background: "rgba(77,184,255,0.1)", border: "1px solid rgba(77,184,255,0.2)", position: "relative" }}>
                <span style={{ fontSize: 22 }}>💬</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: "#4DB8FF" }}>Chat</span>
                {messages.length > 0 && (
                  <div style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, borderRadius: "50%", background: "#00FFD1" }} />
                )}
              </button>
            </div>

            {/* Encryption badge */}
            <div style={{ textAlign: "center" }}>
              <span style={{ color: "rgba(232,244,255,0.25)", fontSize: 10 }}>🔒 End-to-end encrypted · Secure WebRTC · No third party</span>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════
          IN-CALL CHAT
      ════════════════════════════════ */}
      {phase === "connected" && showChat && (
        <div className="slide-up" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Chat header */}
          <div style={{ flexShrink: 0, padding: "14px 18px", background: "rgba(2,13,26,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setShowChat(false)} style={{ background: "none", border: "none", color: "#00FFD1", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>← Back</button>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#E8F4FF" }}>In-call Chat</p>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span className="livdot" style={{ width: 6, height: 6 }} />
                <p style={{ color: "#00FFD1", fontSize: 10, fontWeight: 600 }}>{fmt(seconds)}</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }} className="noscroll">
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.from === "patient" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "75%", padding: "10px 14px", borderRadius: m.from === "patient" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.from === "patient" ? "linear-gradient(135deg,#00C9A7,#0B6FCC)" : "rgba(255,255,255,0.06)", border: m.from !== "patient" ? "1px solid rgba(255,255,255,0.08)" : "none", color: "#E8F4FF", fontSize: 13, lineHeight: 1.5 }}>
                  {m.from === "doctor" && <p style={{ color: "#00FFD1", fontSize: 10, fontWeight: 700, marginBottom: 4 }}>Dr. Priya Sharma</p>}
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ flexShrink: 0, padding: "12px 16px 20px", background: "rgba(2,13,26,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: 10 }}>
            <input
              value={chatMsg}
              onChange={e => setChatMsg(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMsg()}
              placeholder="Type a message..."
              style={{ flex: 1, padding: "11px 14px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)", color: "#E8F4FF", fontFamily: "inherit", fontSize: 13, outline: "none" }}
            />
            <button onClick={sendMsg} style={{ padding: "11px 16px", borderRadius: 14, background: "linear-gradient(135deg,#00C9A7,#0B6FCC)", border: "none", color: "white", fontSize: 16, cursor: "pointer" }}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
}
