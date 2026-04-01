"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const SPECIALTIES = [
  "General Physician","Cardiologist","Neurologist","Dermatologist",
  "Orthopedic","Pulmonologist","Gynecologist","Pediatrician",
  "Gastroenterologist","ENT Specialist","Ophthalmologist","Psychiatrist",
  "Urologist","Endocrinologist","Nephrologist","Oncologist",
];

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

type Step = 1 | 2 | 3 | 4 | 5;

interface UploadedFile {
  name:     string;
  size:     string;
  type:     string;
  preview?: string;
  base64:   string;
}

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes slideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes checkPop{0%{transform:scale(0)}60%{transform:scale(1.2)}100%{transform:scale(1)}}
  @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
  .slide-up{animation:slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both}
  .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .inp{width:100%;padding:12px 14px;border-radius:13px;font-family:inherit;font-size:13px;outline:none;transition:all 0.3s;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.09);color:#E8F4FF}
  .inp::placeholder{color:rgba(232,244,255,0.28)}
  .inp:focus{border-color:rgba(0,255,209,0.45);background:rgba(0,255,209,0.03);box-shadow:0 0 0 3px rgba(0,255,209,0.08)}
  .lbl{display:block;font-size:10px;font-weight:700;color:rgba(232,244,255,0.4);text-transform:uppercase;letter-spacing:1.2px;margin-bottom:7px}
  .bm{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:15px;border-radius:14px;font-family:inherit;font-weight:800;font-size:14px;color:white;border:none;cursor:pointer;transition:all 0.3s;background:linear-gradient(135deg,#00C9A7,#0B6FCC);box-shadow:0 0 22px rgba(0,201,167,0.28)}
  .bm:hover{transform:translateY(-2px);box-shadow:0 0 34px rgba(0,201,167,0.44)}
  .bm:active{transform:scale(0.98)}
  .bm:disabled{opacity:0.45;cursor:not-allowed;transform:none}
  .bg{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:13px;border-radius:14px;font-family:inherit;font-weight:600;font-size:13px;color:#00FFD1;border:1px solid rgba(0,255,209,0.24);background:rgba(0,255,209,0.05);cursor:pointer;transition:all 0.3s}
  .bg:hover{background:rgba(0,255,209,0.1)}
  .chip{padding:6px 13px;border-radius:100px;cursor:pointer;font-family:inherit;font-size:11px;font-weight:600;transition:all 0.2s;border:1.5px solid;flex-shrink:0}
  .day-btn{width:40px;height:40px;border-radius:12px;cursor:pointer;font-family:inherit;font-size:11px;font-weight:700;transition:all 0.2s;border:1.5px solid;display:flex;align-items:center;justify-content:center}
  .upload-area{border:2px dashed rgba(0,255,209,0.25);border-radius:14px;padding:20px 16px;text-align:center;cursor:pointer;transition:all 0.25s;background:rgba(0,255,209,0.03);position:relative;overflow:hidden}
  .upload-area:hover{border-color:rgba(0,255,209,0.5);background:rgba(0,255,209,0.06)}
  .upload-area.uploaded{border-color:rgba(0,255,209,0.5);border-style:solid;background:rgba(0,255,209,0.06)}
  .upload-area.error-border{border-color:rgba(255,107,107,0.5);background:rgba(255,107,107,0.04)}
  .prog{height:4px;border-radius:100px;background:rgba(255,255,255,0.07);overflow:hidden}
  .prog-fill{height:100%;border-radius:100px;background:linear-gradient(90deg,#00C9A7,#0B6FCC);transition:width 0.4s ease}
  .loader{width:20px;height:20px;border:3px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block}
  .err{color:#FF6B6B;font-size:11px;font-weight:600;margin-top:5px;display:block}
  .toggle{width:42px;height:24px;border-radius:100px;cursor:pointer;transition:all 0.3s;position:relative;border:none;flex-shrink:0}
  .toggle-knob{position:absolute;top:3px;width:18px;height:18px;border-radius:50%;background:white;transition:all 0.3s;box-shadow:0 1px 4px rgba(0,0,0,0.3)}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
  select.inp{cursor:pointer}
  select.inp option{background:#0D1B35;color:#E8F4FF}
  .step-dot{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;transition:all 0.3s;flex-shrink:0}
  .photo-circle{width:100px;height:100px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;cursor:pointer;overflow:hidden;transition:all 0.3s;position:relative}
  .photo-circle:hover .photo-overlay{opacity:1}
  .photo-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.2s;border-radius:50%}
`;

export default function RegisterDoctorPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Photo
  const photoRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<UploadedFile | null>(null);

  // Step 1 — Basic Info
  const [form, setForm] = useState({
    name: "", mobile: "", email: "", gender: "",
    dob: "", city: "", state: "", pincode: "",
  });

  // Step 2 — Qualification
  const [qual, setQual] = useState({
    specialty: "", degree: "", college: "", passingYear: "",
    regNo: "", experience: "", fee: "", languages: ["English","Hindi"] as string[],
    bio: "",
  });

  // Step 3 — Schedule
  const [schedule, setSchedule] = useState({
    days: ["Mon","Tue","Wed","Thu","Fri"] as string[],
    slot1Start: "09:00", slot1End: "13:00",
    slot2Start: "17:00", slot2End: "21:00",
    maxPatients: "20",
    instantConsult: true,
  });

  // Step 4 — Documents
  const docTypes = [
    { key: "mci",    label: "MCI Registration Certificate", required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
    { key: "degree", label: "Medical Degree Certificate",   required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
    { key: "govt",   label: "Govt ID (Aadhaar / PAN)",      required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
    { key: "pan",    label: "PAN Card",                     required: true,  accept: ".pdf,.jpg,.jpeg,.png" },
    { key: "clinic", label: "Clinic / Hospital Certificate",required: false, accept: ".pdf,.jpg,.jpeg,.png" },
    { key: "bank",   label: "Cancelled Cheque / Passbook",  required: false, accept: ".pdf,.jpg,.jpeg,.png" },
  ];
  const [docs, setDocs] = useState<Record<string, UploadedFile | null>>({});
  const docRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const LANGS = ["English","Hindi","Marathi","Tamil","Telugu","Kannada","Bengali","Gujarati","Punjabi"];

  const setF = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));
  const setQ = (k: string, v: any) => setQual(p => ({ ...p, [k]: v }));
  const setS = (k: string, v: any) => setSchedule(p => ({ ...p, [k]: v }));

  const toggleDay  = (d: string) => setSchedule(p => ({ ...p, days: p.days.includes(d) ? p.days.filter(x => x !== d) : [...p.days, d] }));
  const toggleLang = (l: string) => setQual(p => ({ ...p, languages: p.languages.includes(l) ? p.languages.filter(x => x !== l) : [...p.languages, l] }));

  // ── File to base64 ──────────────────────────────────────────────
  const toBase64 = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload  = () => res(reader.result as string);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

  const formatSize = (bytes: number) => bytes < 1024 * 1024
    ? (bytes / 1024).toFixed(0) + " KB"
    : (bytes / (1024 * 1024)).toFixed(1) + " MB";

  // ── Handle photo upload ──────────────────────────────────────────
  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setErrors(p => ({ ...p, photo: "Photo must be under 5MB" })); return; }
    if (!file.type.startsWith("image/")) { setErrors(p => ({ ...p, photo: "Only images allowed" })); return; }
    const b64 = await toBase64(file);
    setPhoto({ name: file.name, size: formatSize(file.size), type: file.type, preview: b64, base64: b64 });
    setErrors(p => ({ ...p, photo: "" }));
  };

  // ── Handle document upload ───────────────────────────────────────
  const handleDoc = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setErrors(p => ({ ...p, [key]: "File must be under 10MB" })); return; }
    const allowed = ["image/jpeg","image/jpg","image/png","application/pdf"];
    if (!allowed.includes(file.type)) { setErrors(p => ({ ...p, [key]: "Only PDF, JPG, PNG allowed" })); return; }
    const b64 = await toBase64(file);
    const preview = file.type.startsWith("image/") ? b64 : undefined;
    setDocs(p => ({ ...p, [key]: { name: file.name, size: formatSize(file.size), type: file.type, preview, base64: b64 } }));
    setErrors(p => ({ ...p, [key]: "" }));
  };

  // ── Validation ───────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!form.name.trim())   e.name   = "Full name is required";
      if (!form.mobile.trim() || form.mobile.replace(/\D/g,"").length < 10) e.mobile = "Valid 10-digit mobile required";
      if (!form.email.trim() || !form.email.includes("@")) e.email = "Valid email required";
      if (!form.gender)        e.gender = "Select gender";
      if (!form.dob)           e.dob    = "Date of birth required";
      if (!form.city.trim())   e.city   = "City required";
      if (!form.state.trim())  e.state  = "State required";
      if (!photo)              e.photo  = "Profile photo required";
    }
    if (step === 2) {
      if (!qual.specialty)     e.specialty = "Select specialty";
      if (!qual.degree.trim()) e.degree    = "Degree is required";
      if (!qual.regNo.trim())  e.regNo     = "MCI Registration No. required";
      if (!qual.experience)    e.experience= "Experience required";
      if (!qual.fee)           e.fee       = "Consultation fee required";
    }
    if (step === 3) {
      if (schedule.days.length === 0) e.days = "Select at least one available day";
      if (!schedule.slot1Start)       e.slot1 = "Slot 1 start time required";
      if (!schedule.slot1End)         e.slot1end = "Slot 1 end time required";
    }
    if (step === 4) {
      const required = docTypes.filter(d => d.required);
      required.forEach(d => { if (!docs[d.key]) e[d.key] = `${d.label} is required`; });
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(p => (p + 1) as Step); };

  // ── Submit ───────────────────────────────────────────────────────
  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Build payload
      const payload = {
        ...form, ...qual,
        schedule: { ...schedule },
        photoBase64: photo?.base64,
        documents: Object.fromEntries(
          Object.entries(docs).map(([k, v]) => [k, { name: v?.name, base64: v?.base64, type: v?.type }])
        ),
      };

      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
      // POST to backend
      try {
        await fetch(`${API}/auth/send-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobile: form.mobile, role: "doctor", ...payload }),
        });
      } catch {}

      await new Promise(r => setTimeout(r, 1500));
      setStep(5);
    } finally {
      setSubmitting(false);
    }
  };

  const progress = { 1: 20, 2: 40, 3: 60, 4: 80, 5: 100 }[step];
  const STEPS = ["Basic Info","Qualification","Schedule","Documents","Done"];

  return (
    <div style={{ position:"fixed",inset:0,display:"flex",flexDirection:"column",background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#E8F4FF",maxWidth:480,margin:"0 auto",left:"50%",transform:"translateX(-50%)" }}>
      <style>{S}</style>

      {/* HEADER */}
      {step < 5 && (
        <div style={{ flexShrink:0,padding:"13px 18px 12px",background:"rgba(2,13,26,0.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:10 }}>
            <button onClick={() => step === 1 ? router.back() : setStep(p => (p - 1) as Step)}
              style={{ background:"none",border:"none",color:"#00FFD1",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>← Back</button>
            <div style={{ flex:1 }}>
              <h2 style={{ fontSize:15,fontWeight:800 }}>{STEPS[step - 1]}</h2>
              <p style={{ color:"rgba(232,244,255,0.35)",fontSize:10,marginTop:1 }}>Step {step} of 4</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="prog" style={{ marginBottom:10 }}>
            <div className="prog-fill" style={{ width: progress + "%" }}/>
          </div>

          {/* Step indicators */}
          <div style={{ display:"flex",alignItems:"center",gap:4 }}>
            {STEPS.slice(0,4).map((s, i) => {
              const done    = i + 1 < step;
              const current = i + 1 === step;
              return (
                <div key={s} style={{ display:"flex",alignItems:"center",gap:4,flex:i<3?1:0 }}>
                  <div className="step-dot" style={{ background: done?"linear-gradient(135deg,#00C9A7,#0B6FCC)":current?"rgba(0,255,209,0.15)":"rgba(255,255,255,0.06)", border:`1.5px solid ${done||current?"#00FFD1":"rgba(255,255,255,0.1)"}`, color: done?"white":current?"#00FFD1":"rgba(232,244,255,0.3)" }}>
                    {done ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize:9,color:current?"#00FFD1":"rgba(232,244,255,0.3)",fontWeight:current?700:500,whiteSpace:"nowrap" }}>{s}</span>
                  {i < 3 && <div style={{ flex:1,height:1.5,background:done?"rgba(0,255,209,0.4)":"rgba(255,255,255,0.08)",borderRadius:1 }}/>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div style={{ flex:1,overflowY:"auto",padding: step === 5 ? 0 : "16px 18px" }} className="noscroll">

        {/* ── STEP 1: BASIC INFO ── */}
        {step === 1 && (
          <div className="slide-up">
            {/* Promo */}
            <div style={{ background:"rgba(0,255,209,0.05)",border:"1px solid rgba(0,255,209,0.14)",borderRadius:14,padding:"12px 15px",marginBottom:20,display:"flex",gap:10 }}>
              <span style={{ fontSize:20 }}>🩺</span>
              <p style={{ color:"rgba(232,244,255,0.55)",fontSize:12,lineHeight:1.7 }}>
                Join <strong style={{ color:"#00FFD1" }}>500+ verified doctors</strong> on DigiDoc. Earn up to <strong style={{ color:"#00FFD1" }}>₹1.5L/month</strong> consulting from home.
              </p>
            </div>

            {/* Photo Upload */}
            <div style={{ textAlign:"center",marginBottom:22 }}>
              <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display:"none" }}/>
              <div className="photo-circle" onClick={() => photoRef.current?.click()}
                style={{ background: photo ? "transparent" : "rgba(0,255,209,0.07)", border:`2.5px dashed ${photo?"rgba(0,255,209,0.6)":"rgba(0,255,209,0.25)"}`, boxShadow: photo ? "0 0 24px rgba(0,255,209,0.2)" : "none" }}>
                {photo ? (
                  <>
                    <img src={photo.preview} alt="Photo" style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
                    <div className="photo-overlay"><span style={{ fontSize:22 }}>📷</span></div>
                  </>
                ) : (
                  <div><div style={{ fontSize:32,marginBottom:4 }}>📸</div><p style={{ color:"rgba(0,255,209,0.7)",fontSize:10,fontWeight:600 }}>Add Photo</p></div>
                )}
              </div>
              {photo ? (
                <div style={{ display:"flex",gap:10,justifyContent:"center",marginTop:8 }}>
                  <button onClick={() => photoRef.current?.click()} className="bg" style={{ width:"auto",padding:"5px 14px",fontSize:11 }}>Change Photo</button>
                  <button onClick={() => setPhoto(null)} style={{ padding:"5px 14px",borderRadius:100,background:"rgba(255,107,107,0.08)",border:"1px solid rgba(255,107,107,0.2)",color:"#FF6B6B",fontSize:11,cursor:"pointer",fontFamily:"inherit" }}>Remove</button>
                </div>
              ) : (
                <button onClick={() => photoRef.current?.click()} style={{ marginTop:8,padding:"6px 16px",borderRadius:100,background:"rgba(0,255,209,0.08)",border:"1px solid rgba(0,255,209,0.2)",color:"#00FFD1",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>
                  Upload Profile Photo *
                </button>
              )}
              {errors.photo && <span className="err">{errors.photo}</span>}
              <p style={{ color:"rgba(232,244,255,0.25)",fontSize:10,marginTop:4 }}>JPG, PNG · Max 5MB</p>
            </div>

            {/* Form fields */}
            {[
              { k:"name",   l:"Full Name (as per MCI)",  ph:"Dr. Firstname Lastname",   type:"text" },
              { k:"mobile", l:"Mobile Number",           ph:"+91 XXXXX XXXXX",          type:"tel"  },
              { k:"email",  l:"Email Address",           ph:"doctor@email.com",          type:"email"},
              { k:"dob",    l:"Date of Birth",           ph:"",                         type:"date" },
              { k:"city",   l:"City",                    ph:"e.g. Indore",              type:"text" },
              { k:"state",  l:"State",                   ph:"e.g. Madhya Pradesh",      type:"text" },
              { k:"pincode",l:"Pincode",                 ph:"e.g. 452001",              type:"tel"  },
            ].map(f => (
              <div key={f.k} style={{ marginBottom:13 }}>
                <label className="lbl">{f.l}</label>
                <input className="inp" type={f.type} placeholder={f.ph}
                  value={(form as any)[f.k]}
                  onChange={e => setF(f.k, e.target.value)}
                  style={{ borderColor: errors[f.k] ? "rgba(255,107,107,0.5)" : "" }}
                />
                {errors[f.k] && <span className="err">{errors[f.k]}</span>}
              </div>
            ))}

            {/* Gender */}
            <div style={{ marginBottom:14 }}>
              <label className="lbl">Gender</label>
              <div style={{ display:"flex",gap:8 }}>
                {["Male","Female","Other"].map(g => (
                  <button key={g} onClick={() => setF("gender", g)} style={{ flex:1,padding:"10px",borderRadius:11,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600,border:`1.5px solid ${form.gender===g?"rgba(0,255,209,0.5)":"rgba(255,255,255,0.08)"}`,background:form.gender===g?"rgba(0,255,209,0.08)":"rgba(255,255,255,0.03)",color:form.gender===g?"#00FFD1":"rgba(232,244,255,0.5)" }}>{g}</button>
                ))}
              </div>
              {errors.gender && <span className="err">{errors.gender}</span>}
            </div>
          </div>
        )}

        {/* ── STEP 2: QUALIFICATION ── */}
        {step === 2 && (
          <div className="slide-up">
            {/* Specialty */}
            <div style={{ marginBottom:14 }}>
              <label className="lbl">Specialty *</label>
              <div style={{ display:"flex",gap:7,overflowX:"auto",paddingBottom:4 }} className="noscroll">
                {SPECIALTIES.map(s => (
                  <button key={s} className="chip" onClick={() => setQ("specialty", s)} style={{ borderColor:qual.specialty===s?"rgba(0,255,209,0.5)":"rgba(255,255,255,0.08)",background:qual.specialty===s?"rgba(0,255,209,0.08)":"rgba(255,255,255,0.03)",color:qual.specialty===s?"#00FFD1":"rgba(232,244,255,0.45)" }}>
                    {s}
                  </button>
                ))}
              </div>
              {errors.specialty && <span className="err">{errors.specialty}</span>}
            </div>

            {[
              { k:"degree",     l:"Degree (MBBS, MD etc.)",     ph:"e.g. MBBS, MD (General Medicine)" },
              { k:"college",    l:"Medical College / University",ph:"College name" },
              { k:"passingYear",l:"Passing Year",               ph:"e.g. 2010" },
              { k:"regNo",      l:"MCI Registration Number *",  ph:"MCI-XXXXXXX" },
            ].map(f => (
              <div key={f.k} style={{ marginBottom:13 }}>
                <label className="lbl">{f.l}</label>
                <input className="inp" placeholder={f.ph}
                  value={(qual as any)[f.k]}
                  onChange={e => setQ(f.k, e.target.value)}
                  style={{ borderColor: errors[f.k] ? "rgba(255,107,107,0.5)" : "" }}
                />
                {errors[f.k] && <span className="err">{errors[f.k]}</span>}
              </div>
            ))}

            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:13 }}>
              <div>
                <label className="lbl">Experience (years) *</label>
                <input className="inp" placeholder="e.g. 12" value={qual.experience} onChange={e => setQ("experience", e.target.value)}
                  style={{ borderColor: errors.experience ? "rgba(255,107,107,0.5)" : "" }}/>
                {errors.experience && <span className="err">{errors.experience}</span>}
              </div>
              <div>
                <label className="lbl">Consultation Fee (₹) *</label>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"rgba(232,244,255,0.4)",fontSize:13,fontWeight:700 }}>₹</span>
                  <input className="inp" style={{ paddingLeft:26,borderColor: errors.fee ? "rgba(255,107,107,0.5)" : "" }} placeholder="299" value={qual.fee} onChange={e => setQ("fee", e.target.value)}/>
                </div>
                {errors.fee && <span className="err">{errors.fee}</span>}
              </div>
            </div>

            {/* Languages */}
            <div style={{ marginBottom:13 }}>
              <label className="lbl">Languages Spoken</label>
              <div style={{ display:"flex",gap:7,flexWrap:"wrap" }}>
                {LANGS.map(l => (
                  <button key={l} className="chip" onClick={() => toggleLang(l)} style={{ borderColor:qual.languages.includes(l)?"rgba(77,184,255,0.5)":"rgba(255,255,255,0.08)",background:qual.languages.includes(l)?"rgba(77,184,255,0.1)":"rgba(255,255,255,0.03)",color:qual.languages.includes(l)?"#4DB8FF":"rgba(232,244,255,0.45)" }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div style={{ marginBottom:14 }}>
              <label className="lbl">About You / Bio</label>
              <textarea className="inp" rows={4} placeholder="Brief description about your practice, specialisation, and approach..."
                value={qual.bio} onChange={e => setQ("bio", e.target.value)} style={{ resize:"none",lineHeight:1.7 }}/>
              <p style={{ color:"rgba(232,244,255,0.25)",fontSize:10,marginTop:4 }}>This will be shown to patients on your profile</p>
            </div>
          </div>
        )}

        {/* ── STEP 3: SCHEDULE ── */}
        {step === 3 && (
          <div className="slide-up">
            {/* Available days */}
            <div style={{ marginBottom:16 }}>
              <label className="lbl">Available Days *</label>
              <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                {DAYS.map(d => (
                  <button key={d} className="day-btn" onClick={() => toggleDay(d)} style={{ borderColor:schedule.days.includes(d)?"rgba(0,255,209,0.5)":"rgba(255,255,255,0.1)",background:schedule.days.includes(d)?"rgba(0,255,209,0.1)":"rgba(255,255,255,0.03)",color:schedule.days.includes(d)?"#00FFD1":"rgba(232,244,255,0.4)" }}>
                    {d}
                  </button>
                ))}
              </div>
              {errors.days && <span className="err">{errors.days}</span>}
              <p style={{ color:"rgba(232,244,255,0.3)",fontSize:10,marginTop:6 }}>{schedule.days.length} days selected</p>
            </div>

            {/* Slot 1 */}
            <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:14,marginBottom:12 }}>
              <p style={{ fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.4)",textTransform:"uppercase",letterSpacing:1,marginBottom:12 }}>Time Slot 1 (Morning) *</p>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                <div>
                  <label className="lbl">Start Time</label>
                  <input className="inp" type="time" value={schedule.slot1Start} onChange={e => setS("slot1Start", e.target.value)}
                    style={{ borderColor: errors.slot1 ? "rgba(255,107,107,0.5)" : "" }}/>
                </div>
                <div>
                  <label className="lbl">End Time</label>
                  <input className="inp" type="time" value={schedule.slot1End} onChange={e => setS("slot1End", e.target.value)}
                    style={{ borderColor: errors.slot1end ? "rgba(255,107,107,0.5)" : "" }}/>
                </div>
              </div>
            </div>

            {/* Slot 2 */}
            <div style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:14,marginBottom:12 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
                <p style={{ fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.4)",textTransform:"uppercase",letterSpacing:1 }}>Time Slot 2 (Evening)</p>
                <span style={{ padding:"2px 9px",borderRadius:100,background:"rgba(0,255,209,0.08)",color:"#00FFD1",fontSize:10,fontWeight:700 }}>Optional</span>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                <div>
                  <label className="lbl">Start Time</label>
                  <input className="inp" type="time" value={schedule.slot2Start} onChange={e => setS("slot2Start", e.target.value)}/>
                </div>
                <div>
                  <label className="lbl">End Time</label>
                  <input className="inp" type="time" value={schedule.slot2End} onChange={e => setS("slot2End", e.target.value)}/>
                </div>
              </div>
            </div>

            <div style={{ marginBottom:14 }}>
              <label className="lbl">Max Patients Per Day</label>
              <input className="inp" placeholder="e.g. 20" value={schedule.maxPatients} onChange={e => setS("maxPatients", e.target.value)}/>
            </div>

            <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(0,255,209,0.04)",border:"1px solid rgba(0,255,209,0.12)",borderRadius:13,padding:"13px 15px",marginBottom:14 }}>
              <div>
                <p style={{ fontSize:13,fontWeight:600,color:"#E8F4FF" }}>Enable Instant Consultation</p>
                <p style={{ color:"rgba(232,244,255,0.4)",fontSize:11,marginTop:1 }}>Allow patients to connect immediately</p>
              </div>
              <button className="toggle" onClick={() => setS("instantConsult", !schedule.instantConsult)} style={{ background: schedule.instantConsult ? "#00C9A7" : "rgba(255,255,255,0.1)" }}>
                <div className="toggle-knob" style={{ left: schedule.instantConsult ? 21 : 3 }}/>
              </button>
            </div>

            <div style={{ background:"rgba(77,184,255,0.06)",border:"1px solid rgba(77,184,255,0.14)",borderRadius:12,padding:"11px 14px" }}>
              <p style={{ color:"#4DB8FF",fontWeight:700,fontSize:12,marginBottom:2 }}>💡 Pro Tip</p>
              <p style={{ color:"rgba(77,184,255,0.65)",fontSize:11,lineHeight:1.6 }}>Doctors with 2 time slots get <strong style={{ color:"#4DB8FF" }}>3x more</strong> consultations. You can update your schedule anytime.</p>
            </div>
          </div>
        )}

        {/* ── STEP 4: DOCUMENTS ── */}
        {step === 4 && (
          <div className="slide-up">
            <div style={{ background:"rgba(0,255,209,0.05)",border:"1px solid rgba(0,255,209,0.14)",borderRadius:14,padding:"12px 15px",marginBottom:18,display:"flex",gap:10 }}>
              <span style={{ fontSize:20 }}>🔒</span>
              <div>
                <p style={{ color:"#00FFD1",fontWeight:700,fontSize:12,marginBottom:2 }}>Documents are Safe & Private</p>
                <p style={{ color:"rgba(232,244,255,0.5)",fontSize:11,lineHeight:1.6 }}>All documents are encrypted and used only for verification. Reviewed within <strong style={{ color:"#00FFD1" }}>24–48 hours</strong>.</p>
              </div>
            </div>

            {docTypes.map(doc => {
              const uploaded = docs[doc.key];
              const hasError = errors[doc.key];
              return (
                <div key={doc.key} style={{ marginBottom:12 }}>
                  <input
                    ref={el => { docRefs.current[doc.key] = el; }}
                    type="file" accept={doc.accept}
                    onChange={e => handleDoc(doc.key, e)}
                    style={{ display:"none" }}
                  />

                  <div
                    className={`upload-area ${uploaded ? "uploaded" : ""} ${hasError ? "error-border" : ""}`}
                    onClick={() => docRefs.current[doc.key]?.click()}
                  >
                    {uploaded ? (
                      <div style={{ display:"flex",alignItems:"center",gap:12,textAlign:"left" }}>
                        {/* Preview */}
                        {uploaded.preview ? (
                          <img src={uploaded.preview} alt="doc" style={{ width:50,height:50,objectFit:"cover",borderRadius:9,border:"1px solid rgba(0,255,209,0.3)",flexShrink:0 }}/>
                        ) : (
                          <div style={{ width:50,height:50,borderRadius:9,background:"rgba(77,184,255,0.1)",border:"1px solid rgba(77,184,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0 }}>📄</div>
                        )}
                        <div style={{ flex:1,minWidth:0 }}>
                          <p style={{ fontWeight:700,fontSize:12,color:"#00FFD1",marginBottom:2 }}>✓ {doc.label}</p>
                          <p style={{ color:"rgba(232,244,255,0.5)",fontSize:10,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{uploaded.name}</p>
                          <p style={{ color:"rgba(232,244,255,0.3)",fontSize:10 }}>{uploaded.size} · {uploaded.type.includes("pdf") ? "PDF" : "Image"}</p>
                        </div>
                        <button onClick={e => { e.stopPropagation(); setDocs(p => ({ ...p, [doc.key]: null })); }} style={{ background:"rgba(255,107,107,0.1)",border:"1px solid rgba(255,107,107,0.2)",borderRadius:8,padding:"4px 10px",color:"#FF6B6B",fontSize:11,cursor:"pointer",fontFamily:"inherit",flexShrink:0 }}>✕</button>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize:28,marginBottom:8 }}>
                          {doc.key==="mci"?"📋":doc.key==="degree"?"🎓":doc.key==="govt"?"🪪":doc.key==="pan"?"💳":doc.key==="clinic"?"🏥":"🏦"}
                        </div>
                        <p style={{ fontWeight:600,fontSize:13,color:"#E8F4FF",marginBottom:3 }}>
                          {doc.label}
                          {doc.required && <span style={{ color:"#FF6B6B",marginLeft:4 }}>*</span>}
                        </p>
                        <p style={{ color:"rgba(232,244,255,0.35)",fontSize:11 }}>Tap to upload · PDF, JPG, PNG · Max 10MB</p>
                      </>
                    )}
                  </div>
                  {hasError && <span className="err">{hasError}</span>}
                </div>
              );
            })}

            <div style={{ background:"rgba(255,179,71,0.05)",border:"1px solid rgba(255,179,71,0.14)",borderRadius:12,padding:"11px 14px",marginTop:8 }}>
              <p style={{ color:"#FFB347",fontWeight:700,fontSize:11,marginBottom:2 }}>⚠️ Important</p>
              <p style={{ color:"rgba(255,179,71,0.65)",fontSize:11,lineHeight:1.6 }}>
                Ensure all documents are clear and readable. Blurry or incomplete documents will delay verification.
              </p>
            </div>
          </div>
        )}

        {/* ── STEP 5: SUCCESS ── */}
        {step === 5 && (
          <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 24px",textAlign:"center",animation:"slideUp 0.5s ease" }}>
            <div style={{ width:90,height:90,borderRadius:"50%",overflow:"hidden",border:"3px solid rgba(0,255,209,0.5)",margin:"0 auto 20px",animation:"checkPop 0.5s cubic-bezier(0.22,1,0.36,1)",background:"rgba(0,255,209,0.1)",display:"flex",alignItems:"center",justifyContent:"center" }}>
              {photo ? <img src={photo.preview} style={{ width:"100%",height:"100%",objectFit:"cover" }}/> : <span style={{ fontSize:44 }}>👨‍⚕️</span>}
            </div>

            <h2 style={{ fontSize:24,fontWeight:900,marginBottom:8 }} className="shine">Application Submitted!</h2>
            <p style={{ color:"#00FFD1",fontWeight:700,fontSize:16,marginBottom:4 }}>Welcome, {form.name}!</p>
            <p style={{ color:"rgba(232,244,255,0.45)",fontSize:13,lineHeight:1.8,marginBottom:24,maxWidth:300 }}>
              Our verification team will review your documents and approve your account within <strong style={{ color:"#00FFD1" }}>24–48 hours</strong>.
            </p>

            {/* Status checklist */}
            <div style={{ width:"100%",maxWidth:320,marginBottom:24 }}>
              {[
                { icon:"✅", l:"Application received",    s:"Just now" },
                { icon:"📧", l:"Confirmation email sent", s:form.email },
                { icon:"📱", l:"SMS notification",        s:`+91 ${form.mobile}` },
                { icon:"⏰", l:"Verification time",       s:"24–48 hours" },
              ].map(item => (
                <div key={item.l} style={{ display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:13,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",marginBottom:9,textAlign:"left" }}>
                  <span style={{ fontSize:20 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontWeight:600,fontSize:12,color:"#E8F4FF" }}>{item.l}</p>
                    <p style={{ color:"rgba(232,244,255,0.35)",fontSize:10,marginTop:1 }}>{item.s}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="bm" style={{ marginBottom:10 }} onClick={() => router.push("/")}>🏠 Back to Home</button>
            <button className="bg" onClick={() => router.push("/login")}>🩺 Login as Doctor</button>
          </div>
        )}
      </div>

      {/* BOTTOM BUTTON */}
      {step < 5 && (
        <div style={{ flexShrink:0,padding:"12px 18px 20px",background:"rgba(2,13,26,0.97)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          {step < 4 ? (
            <button className="bm" onClick={next}>Continue →</button>
          ) : (
            <button className="bm" onClick={submit} disabled={submitting}>
              {submitting ? <><span className="loader"/>&nbsp;Submitting...</> : "📤 Submit Application"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
