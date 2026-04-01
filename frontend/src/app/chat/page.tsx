"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Msg = { from: "user" | "ai"; text: string; time: string; typing?: boolean };

const QUICK_QUESTIONS = [
  "I have a fever since yesterday",
  "My chest feels tight",
  "I have a severe headache",
  "Stomach pain after eating",
  "Feeling very anxious",
  "Back pain for 3 days",
];

const AI_RESPONSES: Record<string, string> = {
  fever:     "I understand you have a fever. A few important questions: How high is your temperature? Do you have chills or body ache? Based on your symptoms, I recommend consulting with a General Physician. Drink plenty of fluids and rest. Should I connect you with a doctor right now?",
  chest:     "⚠️ Chest tightness can be serious. Please do not ignore this. Is it accompanied by shortness of breath or arm pain? I strongly recommend an immediate consultation with our Cardiologist. Should I connect you right now?",
  headache:  "Headaches can have many causes — stress, dehydration, or neurological. How long have you had it? Is it on one side or both? Light sensitivity? Based on this, I can connect you with a Neurologist. Would you like me to find an available doctor?",
  stomach:   "Stomach pain after eating could indicate gastritis, acidity, or food intolerance. Is the pain sharp or dull? Any nausea? I can connect you with a Gastroenterologist. In the meantime, avoid spicy foods.",
  anxious:   "I hear you — anxiety can feel overwhelming. You are not alone. Can you tell me more about what you are feeling? Deep breaths help: inhale for 4 counts, hold for 4, exhale for 4. I can also connect you with a mental health professional.",
  back:      "Back pain for 3 days needs attention. Is it lower back or upper? Does it radiate to your legs? Any numbness? Our Orthopedic specialist can help you. I also recommend applying a warm compress in the meantime.",
  default:   "Thank you for sharing that with me. I want to make sure you get the right help. Could you describe your symptoms in a bit more detail? The more I know, the better I can match you with the right doctor.",
};

const getResponse = (text: string): string => {
  const t = text.toLowerCase();
  if (t.includes("fever") || t.includes("temperature") || t.includes("chills")) return AI_RESPONSES.fever;
  if (t.includes("chest") || t.includes("heart") || t.includes("tight")) return AI_RESPONSES.chest;
  if (t.includes("head") || t.includes("migraine")) return AI_RESPONSES.headache;
  if (t.includes("stomach") || t.includes("abdomen") || t.includes("nausea")) return AI_RESPONSES.stomach;
  if (t.includes("anxious") || t.includes("anxiety") || t.includes("stress") || t.includes("depress")) return AI_RESPONSES.anxious;
  if (t.includes("back") || t.includes("spine") || t.includes("lower back")) return AI_RESPONSES.back;
  return AI_RESPONSES.default;
};

const now = () => new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes slideRight{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
  @keyframes slideLeft{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
  .msg-ai{animation:slideRight 0.35s cubic-bezier(0.22,1,0.36,1) both}
  .msg-user{animation:slideLeft 0.35s cubic-bezier(0.22,1,0.36,1) both}
  .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .qq{padding:8px 14px;border-radius:100px;cursor:pointer;transition:all 0.2s;font-family:inherit;font-size:12px;font-weight:600;white-space:nowrap;flex-shrink:0;border:1px solid rgba(0,255,209,0.2);background:rgba(0,255,209,0.06);color:#00FFD1}
  .qq:hover{background:rgba(0,255,209,0.12);border-color:rgba(0,255,209,0.4);transform:translateY(-1px)}
  .qq:active{transform:scale(0.97)}
  .bm{display:flex;align-items:center;justify-content:center;gap:8px;padding:13px 20px;border-radius:14px;font-family:inherit;font-weight:700;font-size:13px;color:white;border:none;cursor:pointer;transition:all 0.3s;background:linear-gradient(135deg,#00C9A7,#0B6FCC);box-shadow:0 0 20px rgba(0,201,167,0.28);text-decoration:none}
  .bm:hover{transform:translateY(-1px);box-shadow:0 0 30px rgba(0,201,167,0.42)}
  .livdot{width:8px;height:8px;border-radius:50%;background:#00FFD1;display:inline-block;position:relative}
  .livdot::after{content:'';position:absolute;inset:-3px;border-radius:50%;background:rgba(0,255,209,0.3);animation:ripple 1.8s infinite}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
  .send-btn{width:44px;height:44px;border-radius:13px;border:none;cursor:pointer;font-size:18px;transition:all 0.2s;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#00C9A7,#0B6FCC);box-shadow:0 0 16px rgba(0,201,167,0.3);flex-shrink:0}
  .send-btn:hover{transform:scale(1.06);box-shadow:0 0 24px rgba(0,201,167,0.5)}
  .send-btn:active{transform:scale(0.95)}
  .send-btn:disabled{opacity:0.4;cursor:not-allowed;transform:none}
  .typing-dot{width:7px;height:7px;border-radius:50%;background:#00FFD1;animation:blink 1.2s infinite}
`;

export default function ChatPage() {
  const router  = useRouter();
  const [msgs, setMsgs]     = useState<Msg[]>([
    {
      from: "ai",
      text: "Hi! I am DigiDoc AI — your 24/7 health assistant. Tell me how you are feeling, describe your symptoms, or ask me anything about your health. I am here to help you anytime.",
      time: now(),
    },
  ]);
  const [input, setInput]   = useState("");
  const [typing, setTyping] = useState(false);
  const [showDr, setShowDr] = useState(false);
  const bottomRef           = useRef<HTMLDivElement>(null);
  const inputRef            = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  const send = (text = input) => {
    if (!text.trim()) return;
    const userMsg: Msg = { from: "user", text: text.trim(), time: now() };
    setMsgs(p => [...p, userMsg]);
    setInput("");
    setTyping(true);

    const delay = 1200 + Math.random() * 800;
    setTimeout(() => {
      const reply = getResponse(text);
      setTyping(false);
      setMsgs(p => [...p, { from: "ai", text: reply, time: now() }]);
      // Show doctor button after 2nd AI message
      if (msgs.filter(m => m.from === "ai").length >= 1) setShowDr(true);
    }, delay);
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      display: "flex", flexDirection: "column",
      background: "#020D1A", fontFamily: "'Plus Jakarta Sans',sans-serif",
      color: "#E8F4FF", maxWidth: 480, margin: "0 auto",
      left:0, right:0,
    }}>
      <style>{S}</style>

      {/* HEADER */}
      <div style={{ flexShrink: 0, padding: "13px 18px 12px", background: "rgba(2,13,26,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#00FFD1", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>←</button>

          {/* AI Avatar */}
          <div style={{ width: 40, height: 40, borderRadius: 13, background: "linear-gradient(135deg,rgba(0,201,167,0.2),rgba(11,111,204,0.2))", border: "1px solid rgba(0,255,209,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🤖</div>

          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "#E8F4FF" }}>DigiDoc AI</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span className="livdot" style={{ width: 6, height: 6 }} />
              <span style={{ color: "#00FFD1", fontSize: 10, fontWeight: 600 }}>Online · Always available</span>
            </div>
          </div>

          <button onClick={() => router.push("/symptoms")} style={{ padding: "6px 12px", borderRadius: 100, background: "rgba(0,255,209,0.08)", border: "1px solid rgba(0,255,209,0.2)", color: "#00FFD1", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            🩺 Quiz
          </button>
        </div>
      </div>

      {/* MESSAGES */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px 6px" }} className="noscroll">

        {/* Quick questions — show at top */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: "rgba(232,244,255,0.3)", fontSize: 11, marginBottom: 8, textAlign: "center" }}>Quick questions</p>
          <div style={{ display: "flex", gap: 8, overflowX: "auto" }} className="noscroll">
            {QUICK_QUESTIONS.map(q => (
              <button key={q} className="qq" onClick={() => send(q)}>{q}</button>
            ))}
          </div>
        </div>

        {/* Messages */}
        {msgs.map((m, i) => (
          <div key={i} className={m.from === "ai" ? "msg-ai" : "msg-user"} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", marginBottom: 12, gap: 8, alignItems: "flex-end" }}>

            {/* AI avatar */}
            {m.from === "ai" && (
              <div style={{ width: 30, height: 30, borderRadius: 10, background: "linear-gradient(135deg,rgba(0,201,167,0.2),rgba(11,111,204,0.2))", border: "1px solid rgba(0,255,209,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginBottom: 2 }}>🤖</div>
            )}

            <div style={{ maxWidth: "78%" }}>
              <div style={{
                padding: "11px 14px",
                borderRadius: m.from === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                background: m.from === "user" ? "linear-gradient(135deg,#00C9A7,#0B6FCC)" : "rgba(255,255,255,0.05)",
                border: m.from === "ai" ? "1px solid rgba(255,255,255,0.08)" : "none",
                color: "#E8F4FF", fontSize: 13, lineHeight: 1.65,
              }}>
                {m.text}
              </div>
              <p style={{ color: "rgba(232,244,255,0.22)", fontSize: 10, marginTop: 4, textAlign: m.from === "user" ? "right" : "left" }}>{m.time}</p>
            </div>

            {/* User avatar */}
            {m.from === "user" && (
              <div style={{ width: 30, height: 30, borderRadius: 10, background: "rgba(0,255,209,0.1)", border: "1px solid rgba(0,255,209,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginBottom: 2 }}>🧑</div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="msg-ai" style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 30, height: 30, borderRadius: 10, background: "linear-gradient(135deg,rgba(0,201,167,0.2),rgba(11,111,204,0.2))", border: "1px solid rgba(0,255,209,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
            <div style={{ padding: "12px 16px", borderRadius: "4px 16px 16px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: 5, alignItems: "center" }}>
              {[0, 1, 2].map(i => (
                <div key={i} className="typing-dot" style={{ animationDelay: i * 0.2 + "s" }} />
              ))}
            </div>
          </div>
        )}

        {/* Connect to doctor button */}
        {showDr && !typing && (
          <div style={{ margin: "8px 0 12px", animation: "fadeUp 0.5s ease" }}>
            <div style={{ background: "rgba(0,255,209,0.05)", border: "1px solid rgba(0,255,209,0.15)", borderRadius: 16, padding: "14px 16px" }}>
              <p style={{ color: "#00FFD1", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>Ready to consult a real doctor?</p>
              <p style={{ color: "rgba(232,244,255,0.45)", fontSize: 11, marginBottom: 12, lineHeight: 1.5 }}>Based on our conversation, I can connect you with the right specialist immediately.</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="bm" style={{ flex: 1, fontSize: 12, padding: "10px" }} onClick={() => router.push("/symptoms")}>
                  🤖 Check Symptoms
                </button>
                <button className="bm" style={{ flex: 1, fontSize: 12, padding: "10px" }} onClick={() => router.push("/dashboard")}>
                  🩺 Find Doctor
                </button>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT AREA */}
      <div style={{ flexShrink: 0, padding: "10px 16px 20px", background: "rgba(2,13,26,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Disclaimer */}
        <p style={{ color: "rgba(232,244,255,0.2)", fontSize: 10, textAlign: "center", marginBottom: 10 }}>
          AI responses are for guidance only — not a substitute for medical advice
        </p>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {/* Symptom shortcut */}
          <button onClick={() => router.push("/symptoms")} style={{ width: 44, height: 44, borderRadius: 13, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
            🩺
          </button>

          {/* Text input */}
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !typing && send()}
            placeholder="Describe your symptoms..."
            style={{ flex: 1, padding: "11px 14px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)", color: "#E8F4FF", fontFamily: "inherit", fontSize: 13, outline: "none", transition: "border 0.2s" }}
          />

          {/* Send */}
          <button className="send-btn" onClick={() => send()} disabled={!input.trim() || typing}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
