"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const SYMPTOMS = [
  { id: 1,  label: "Fever / Chills",      icon: "🌡️", category: "general"     },
  { id: 2,  label: "Headache",             icon: "🤕", category: "neuro"       },
  { id: 3,  label: "Chest Pain",           icon: "💔", category: "cardio"      },
  { id: 4,  label: "Cough / Cold",         icon: "🤧", category: "respiratory" },
  { id: 5,  label: "Stomach Pain",         icon: "🫃", category: "gastro"      },
  { id: 6,  label: "Skin Rash / Itching",  icon: "🩹", category: "skin"        },
  { id: 7,  label: "Joint / Bone Pain",    icon: "🦴", category: "ortho"       },
  { id: 8,  label: "Eye Problem",          icon: "👁️", category: "eye"         },
  { id: 9,  label: "Ear Pain",             icon: "👂", category: "ent"         },
  { id: 10, label: "Anxiety / Stress",     icon: "🧠", category: "mental"      },
  { id: 11, label: "Back Pain",            icon: "🔙", category: "ortho"       },
  { id: 12, label: "Breathlessness",       icon: "💨", category: "respiratory" },
  { id: 13, label: "Nausea / Vomiting",   icon: "🤢", category: "gastro"      },
  { id: 14, label: "Fatigue / Weakness",   icon: "😴", category: "general"     },
  { id: 15, label: "High Blood Pressure",  icon: "❤️", category: "cardio"      },
  { id: 16, label: "Diabetes Concern",     icon: "🩸", category: "general"     },
];

const DOCTORS = [
  { id: 1, name: "Dr. Priya Sharma",  spec: "General Physician", rating: 4.9, fee: 299,  online: true,  avatar: "👩‍⚕️", exp: "12 yrs", categories: ["general","gastro","mental"] },
  { id: 2, name: "Dr. Arjun Mehta",   spec: "Cardiologist",      rating: 4.8, fee: 599,  online: true,  avatar: "👨‍⚕️", exp: "18 yrs", categories: ["cardio"]                   },
  { id: 3, name: "Dr. Sneha Rao",     spec: "Dermatologist",     rating: 4.7, fee: 399,  online: false, avatar: "👩‍⚕️", exp: "9 yrs",  categories: ["skin"]                     },
  { id: 4, name: "Dr. Rahul Gupta",   spec: "Neurologist",       rating: 4.9, fee: 699,  online: true,  avatar: "👨‍⚕️", exp: "15 yrs", categories: ["neuro","mental"]           },
  { id: 5, name: "Dr. Anita Patel",   spec: "Pulmonologist",     rating: 4.8, fee: 499,  online: true,  avatar: "👩‍⚕️", exp: "11 yrs", categories: ["respiratory"]              },
  { id: 6, name: "Dr. Vikram Singh",  spec: "Orthopedic",        rating: 4.7, fee: 449,  online: true,  avatar: "👨‍⚕️", exp: "14 yrs", categories: ["ortho"]                    },
  { id: 7, name: "Dr. Meera Nair",    spec: "ENT Specialist",    rating: 4.8, fee: 349,  online: true,  avatar: "👩‍⚕️", exp: "10 yrs", categories: ["ent","eye"]                },
  { id: 8, name: "Dr. Suresh Iyer",   spec: "Gastroenterologist",rating: 4.9, fee: 549,  online: false, avatar: "👨‍⚕️", exp: "16 yrs", categories: ["gastro"]                   },
];

const AI_TIPS: Record<string, string[]> = {
  general:     ["Stay hydrated — drink 8+ glasses of water daily", "Rest is crucial — avoid strenuous activity", "Monitor your temperature every 4 hours"],
  cardio:      ["⚠️ Chest pain needs immediate attention", "Sit down and stay calm", "Avoid any physical exertion right now"],
  respiratory: ["Breathe slowly and steadily", "Sit upright to ease breathing", "Avoid cold air and dust"],
  neuro:       ["Rest in a dark, quiet room", "Avoid screens if headache is severe", "Stay hydrated — dehydration worsens headaches"],
  skin:        ["Avoid scratching the affected area", "Apply cold compress for relief", "Note if rash is spreading"],
  ortho:       ["Apply ice pack for 15 mins", "Avoid putting weight on the area", "Rest the affected joint"],
  gastro:      ["Avoid spicy and oily food", "Try small sips of water", "Rest in a comfortable position"],
  ent:         ["Avoid inserting anything in the ear", "Warm compress may help", "Keep area clean and dry"],
  eye:         ["Avoid rubbing your eyes", "Rinse with clean water if irritated", "Reduce screen time"],
  mental:      ["Practice deep breathing: 4 in, hold 4, out 4", "Take a short walk if possible", "Talk to someone you trust"],
};

type Step = "symptoms" | "details" | "result";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
  @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  .fade-up{animation:fadeUp 0.5s ease both}
  .slide-up{animation:slideUp 0.45s cubic-bezier(0.22,1,0.36,1) both}
  .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .sc{border-radius:14px;padding:13px 12px;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:10px;border:1.5px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.03)}
  .sc:hover{border-color:rgba(0,255,209,0.25);background:rgba(0,255,209,0.04)}
  .sc.sel{border-color:rgba(0,255,209,0.5);background:rgba(0,255,209,0.08);box-shadow:0 0 16px rgba(0,255,209,0.1)}
  .sc:active{transform:scale(0.97)}
  .bm{display:flex;align-items:center;justify-content:center;gap:8px;padding:15px;border-radius:14px;font-family:inherit;font-weight:700;font-size:14px;color:white;border:none;cursor:pointer;transition:all 0.3s;background:linear-gradient(135deg,#00C9A7,#0B6FCC);box-shadow:0 0 24px rgba(0,201,167,0.3);width:100%}
  .bm:hover{transform:translateY(-2px);box-shadow:0 0 36px rgba(0,201,167,0.45)}
  .bm:disabled{opacity:0.4;cursor:not-allowed;transform:none}
  .bg{display:flex;align-items:center;justify-content:center;gap:8px;padding:13px;border-radius:14px;font-family:inherit;font-weight:600;font-size:13px;color:#00FFD1;border:1px solid rgba(0,255,209,0.25);background:rgba(0,255,209,0.05);cursor:pointer;transition:all 0.3s;width:100%;text-decoration:none}
  .bg:hover{background:rgba(0,255,209,0.1);border-color:rgba(0,255,209,0.45)}
  .dc{border-radius:18px;padding:16px;transition:all 0.3s;cursor:pointer;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07)}
  .dc:hover{background:rgba(0,255,209,0.05);border-color:rgba(0,255,209,0.2);transform:translateY(-2px)}
  .livdot{width:8px;height:8px;border-radius:50%;background:#00FFD1;display:inline-block;position:relative;flex-shrink:0}
  .livdot::after{content:'';position:absolute;inset:-3px;border-radius:50%;background:rgba(0,255,209,0.3);animation:ripple 1.8s infinite}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
  .prog{height:4px;border-radius:100px;background:rgba(255,255,255,0.07);overflow:hidden;margin-bottom:20px}
  .prog-fill{height:100%;border-radius:100px;background:linear-gradient(90deg,#00C9A7,#0B6FCC);transition:width 0.4s ease}
  .tip-card{background:rgba(0,255,209,0.05);border:1px solid rgba(0,255,209,0.14);border-radius:12px;padding:10px 13px;display:flex;align-items:flex-start;gap:8px;margin-bottom:8px}
`;

export default function SymptomsPage() {
  const router = useRouter();
  const [step, setStep]         = useState<Step>("symptoms");
  const [selected, setSelected] = useState<number[]>([]);
  const [severity, setSeverity] = useState(3);
  const [duration, setDuration] = useState("");
  const [loading, setLoading]   = useState(false);
  const [matched, setMatched]   = useState<typeof DOCTORS[0] | null>(null);
  const [tips, setTips]         = useState<string[]>([]);

  const toggle = (id: number) =>
    setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const findDoctor = () => {
    setLoading(true);
    const cats = selected.map(id => SYMPTOMS.find(s => s.id === id)?.category || "");
    const uniqueCats = [...new Set(cats)];

    // AI matching logic
    let best = DOCTORS.find(d => d.online && uniqueCats.some(c => d.categories.includes(c)));
    if (!best) best = DOCTORS.find(d => d.online) || DOCTORS[0];
    
    // Get tips for matched categories
    const allTips: string[] = [];
    uniqueCats.forEach(c => { if (AI_TIPS[c]) allTips.push(...AI_TIPS[c].slice(0, 1)); });
    
    setTimeout(() => {
      setMatched(best!);
      setTips(allTips.slice(0, 3));
      setLoading(false);
      setStep("result");
    }, 2000);
  };

  const progress = step === "symptoms" ? 33 : step === "details" ? 66 : 100;

  return (
    <div style={{
      position: "fixed", inset: 0,
      display: "flex", flexDirection: "column",
      background: "#020D1A", fontFamily: "'Plus Jakarta Sans',sans-serif",
      color: "#E8F4FF", maxWidth: 480, margin: "0 auto",
      left: "50%", transform: "translateX(-50%)",
    }}>
      <style>{S}</style>

      {/* HEADER */}
      <div style={{ flexShrink: 0, padding: "14px 18px 12px", background: "rgba(2,13,26,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <button onClick={() => step === "symptoms" ? router.back() : setStep(step === "details" ? "symptoms" : "details")}
            style={{ background: "none", border: "none", color: "#00FFD1", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>← Back</button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#E8F4FF" }}>
              {step === "symptoms" ? "Select Symptoms" : step === "details" ? "More Details" : "AI Match Result"}
            </h2>
          </div>
          <span style={{ color: "rgba(232,244,255,0.35)", fontSize: 11 }}>
            {step === "symptoms" ? "1/3" : step === "details" ? "2/3" : "3/3"}
          </span>
        </div>
        {/* Progress bar */}
        <div className="prog">
          <div className="prog-fill" style={{ width: progress + "%" }} />
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 18px" }} className="noscroll">

        {/* ── STEP 1: SELECT SYMPTOMS ── */}
        {step === "symptoms" && (
          <div className="slide-up" style={{ paddingTop: 16, paddingBottom: 16 }}>
            <p style={{ color: "rgba(232,244,255,0.45)", fontSize: 13, marginBottom: 18, lineHeight: 1.6 }}>
              Select all symptoms you are experiencing right now. Our AI will find the best doctor for you.
            </p>

            {selected.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, padding: "8px 14px", borderRadius: 100, background: "rgba(0,255,209,0.08)", border: "1px solid rgba(0,255,209,0.2)", width: "fit-content" }}>
                <span className="livdot" />
                <span style={{ color: "#00FFD1", fontSize: 12, fontWeight: 700 }}>{selected.length} symptom{selected.length > 1 ? "s" : ""} selected</span>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
              {SYMPTOMS.map(s => (
                <div key={s.id} className={"sc" + (selected.includes(s.id) ? " sel" : "")} onClick={() => toggle(s.id)}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{s.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: selected.includes(s.id) ? 700 : 500, color: selected.includes(s.id) ? "#00FFD1" : "rgba(232,244,255,0.75)", lineHeight: 1.3 }}>{s.label}</span>
                  {selected.includes(s.id) && <span style={{ marginLeft: "auto", color: "#00FFD1", fontSize: 14, flexShrink: 0 }}>✓</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: MORE DETAILS ── */}
        {step === "details" && (
          <div className="slide-up" style={{ paddingTop: 16, paddingBottom: 16 }}>
            {/* Selected symptoms summary */}
            <div style={{ background: "rgba(0,255,209,0.05)", border: "1px solid rgba(0,255,209,0.15)", borderRadius: 14, padding: "12px 14px", marginBottom: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(232,244,255,0.4)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Selected Symptoms</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {selected.map(id => {
                  const s = SYMPTOMS.find(x => x.id === id);
                  return s ? (
                    <span key={id} style={{ padding: "4px 10px", borderRadius: 100, background: "rgba(0,255,209,0.1)", border: "1px solid rgba(0,255,209,0.2)", color: "#00FFD1", fontSize: 11, fontWeight: 600 }}>
                      {s.icon} {s.label}
                    </span>
                  ) : null;
                })}
              </div>
            </div>

            {/* Severity */}
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(232,244,255,0.4)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12 }}>How severe is it?</p>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ color: "rgba(232,244,255,0.45)", fontSize: 12 }}>Mild</span>
                <span style={{ color: severity >= 4 ? "#FF6B6B" : severity >= 3 ? "#FFB347" : "#00FFD1", fontWeight: 800, fontSize: 16 }}>
                  {severity === 1 ? "Very Mild" : severity === 2 ? "Mild" : severity === 3 ? "Moderate" : severity === 4 ? "Severe" : "Very Severe"}
                </span>
                <span style={{ color: "rgba(232,244,255,0.45)", fontSize: 12 }}>Severe</span>
              </div>
              <input type="range" min={1} max={5} value={severity} onChange={e => setSeverity(+e.target.value)}
                style={{ width: "100%", accentColor: severity >= 4 ? "#FF6B6B" : severity >= 3 ? "#FFB347" : "#00FFD1", cursor: "pointer" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                {[1,2,3,4,5].map(n => (
                  <div key={n} style={{ width: 20, height: 20, borderRadius: "50%", background: n <= severity ? (severity >= 4 ? "rgba(255,107,107,0.2)" : severity >= 3 ? "rgba(255,179,71,0.2)" : "rgba(0,255,209,0.15)") : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: n <= severity ? (severity >= 4 ? "#FF6B6B" : "#00FFD1") : "rgba(232,244,255,0.2)", fontWeight: 700 }}>
                    {n}
                  </div>
                ))}
              </div>
            </div>

            {/* Duration */}
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(232,244,255,0.4)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12 }}>How long have you had these symptoms?</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
              {["Today only", "2-3 days", "About a week", "More than a week"].map(d => (
                <button key={d} onClick={() => setDuration(d)} style={{
                  padding: "12px 10px", borderRadius: 12, cursor: "pointer", fontFamily: "inherit",
                  fontSize: 12, fontWeight: 600, textAlign: "center", transition: "all 0.2s", border: "1.5px solid",
                  borderColor: duration === d ? "rgba(0,255,209,0.5)" : "rgba(255,255,255,0.07)",
                  background: duration === d ? "rgba(0,255,209,0.08)" : "rgba(255,255,255,0.03)",
                  color: duration === d ? "#00FFD1" : "rgba(232,244,255,0.6)",
                }}>{d}</button>
              ))}
            </div>

            {/* Urgent warning */}
            {severity >= 4 && (
              <div style={{ background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.25)", borderRadius: 14, padding: "13px 15px", marginBottom: 16, display: "flex", gap: 10 }}>
                <span style={{ fontSize: 20 }}>⚠️</span>
                <div>
                  <p style={{ color: "#FF6B6B", fontWeight: 700, fontSize: 13 }}>High Severity Detected</p>
                  <p style={{ color: "rgba(255,107,107,0.7)", fontSize: 11, marginTop: 3, lineHeight: 1.5 }}>Your symptoms appear severe. We will prioritize your consultation and connect you with a doctor immediately.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 3: AI RESULT ── */}
        {step === "result" && matched && (
          <div className="slide-up" style={{ paddingTop: 16, paddingBottom: 16 }}>

            {/* AI Match banner */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🤖</div>
              <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>
                <span className="shine">AI Match Found!</span>
              </h2>
              <p style={{ color: "rgba(232,244,255,0.45)", fontSize: 13 }}>
                Based on {selected.length} symptoms · Severity: {severity}/5
              </p>
            </div>

            {/* Matched doctor card */}
            <div style={{ background: "rgba(0,255,209,0.05)", border: "1px solid rgba(0,255,209,0.2)", borderRadius: 20, padding: 18, marginBottom: 16, boxShadow: "0 0 28px rgba(0,255,209,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <div style={{ width: 56, height: 56, borderRadius: 17, background: "rgba(0,255,209,0.1)", border: "1px solid rgba(0,255,209,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{matched.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <p style={{ fontWeight: 800, fontSize: 15, color: "#E8F4FF" }}>{matched.name}</p>
                    {matched.online && <span className="livdot" />}
                  </div>
                  <p style={{ color: "#00FFD1", fontSize: 12, fontWeight: 600 }}>{matched.spec} · {matched.exp}</p>
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <span style={{ color: "#FFB347", fontSize: 11 }}>★ {matched.rating}</span>
                    <span style={{ color: "#00FFD1", fontSize: 11, fontWeight: 700 }}>₹{matched.fee}/consult</span>
                    <span className="livdot" style={{ width: 6, height: 6, marginTop: 3 }} />
                    <span style={{ color: "#00FFD1", fontSize: 11 }}>Available now</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="bm" style={{ flex: 1 }} onClick={() => router.push("/call/" + matched.id)}>
                  📹 Video Consult Now
                </button>
                <button className="bg" style={{ flex: 1 }} onClick={() => router.push("/call/" + matched.id)}>
                  📞 Audio Call
                </button>
              </div>
            </div>

            {/* AI Health Tips */}
            {tips.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(232,244,255,0.4)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>AI Health Tips While You Wait</p>
                {tips.map((t, i) => (
                  <div key={i} className="tip-card">
                    <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
                    <p style={{ color: "rgba(232,244,255,0.75)", fontSize: 12, lineHeight: 1.6 }}>{t}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Other available doctors */}
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(232,244,255,0.4)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>Other Available Doctors</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {DOCTORS.filter(d => d.online && d.id !== matched.id).slice(0, 2).map(d => (
                <div key={d.id} className="dc" style={{ display: "flex", alignItems: "center", gap: 12 }} onClick={() => router.push("/call/" + d.id)}>
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: "rgba(0,255,209,0.06)", border: "1px solid rgba(0,255,209,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{d.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 13, color: "#E8F4FF" }}>{d.name}</p>
                    <p style={{ color: "rgba(232,244,255,0.4)", fontSize: 11, marginTop: 1 }}>{d.spec} · ★ {d.rating}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "#00FFD1", fontWeight: 700, fontSize: 13 }}>₹{d.fee}</p>
                    <span className="livdot" style={{ width: 6, height: 6 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Loading */}
        {loading && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(2,13,26,0.85)", backdropFilter: "blur(8px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 99 }}>
            <div style={{ fontSize: 56, marginBottom: 20, animation: "pulse 1s infinite" }}>🤖</div>
            <p style={{ fontSize: 16, fontWeight: 800, color: "#E8F4FF", marginBottom: 6 }}>AI Analyzing Symptoms</p>
            <p style={{ color: "rgba(232,244,255,0.45)", fontSize: 13, marginBottom: 24 }}>Finding the best doctor for you...</p>
            <div style={{ display: "flex", gap: 6 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#00FFD1", animation: `pulse 1s ${i*0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM BUTTON */}
      {!loading && step !== "result" && (
        <div style={{ flexShrink: 0, padding: "14px 18px 20px", background: "rgba(2,13,26,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {step === "symptoms" ? (
            <button className="bm" disabled={selected.length === 0} onClick={() => setStep("details")}>
              Continue → &nbsp;{selected.length > 0 && `(${selected.length} selected)`}
            </button>
          ) : (
            <button className="bm" disabled={!duration} onClick={findDoctor}>
              🤖 Find My Doctor with AI
            </button>
          )}
        </div>
      )}

      {step === "result" && (
        <div style={{ flexShrink: 0, padding: "10px 18px 16px", background: "rgba(2,13,26,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button className="bg" style={{ width: "100%" }} onClick={() => { setStep("symptoms"); setSelected([]); setDuration(""); }}>
            ← Start Over
          </button>
        </div>
      )}
    </div>
  );
}
