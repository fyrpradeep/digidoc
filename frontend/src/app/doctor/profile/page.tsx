"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const SPECIALTIES = [
  "General Physician","Cardiologist","Neurologist","Dermatologist",
  "Orthopedic","Pulmonologist","Gynecologist","Pediatrician",
  "Gastroenterologist","ENT Specialist","Ophthalmologist","Psychiatrist",
];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const LANGUAGES = ["English","Hindi","Marathi","Tamil","Telugu","Kannada","Bengali","Gujarati"];

type Tab = "profile" | "schedule" | "bank" | "stats";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
  .slide-up{animation:slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both}
  .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .inp{width:100%;padding:12px 14px;border-radius:13px;font-family:inherit;font-size:13px;outline:none;transition:all 0.3s;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.09);color:#E8F4FF}
  .inp::placeholder{color:rgba(232,244,255,0.28)}
  .inp:focus{border-color:rgba(0,255,209,0.4);background:rgba(0,255,209,0.03);box-shadow:0 0 0 3px rgba(0,255,209,0.07)}
  .lbl{display:block;font-size:10px;font-weight:700;color:rgba(232,244,255,0.38);text-transform:uppercase;letter-spacing:1.2px;margin-bottom:7px}
  .gc{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:15px;margin-bottom:13px;transition:all 0.3s}
  .bm{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:14px;border-radius:14px;font-family:inherit;font-weight:800;font-size:14px;color:white;border:none;cursor:pointer;transition:all 0.3s;background:linear-gradient(135deg,#00C9A7,#0B6FCC);box-shadow:0 0 20px rgba(0,201,167,0.26)}
  .bm:hover{transform:translateY(-1px);box-shadow:0 0 30px rgba(0,201,167,0.4)}
  .bm:disabled{opacity:0.5;cursor:not-allowed;transform:none}
  .chip{padding:7px 13px;border-radius:100px;cursor:pointer;font-family:inherit;font-size:11px;font-weight:600;transition:all 0.2s;border:1.5px solid;flex-shrink:0}
  .chip:active{transform:scale(0.95)}
  .day-btn{width:40px;height:40px;border-radius:12px;cursor:pointer;font-family:inherit;font-size:11px;font-weight:700;transition:all 0.2s;border:1.5px solid;display:flex;align-items:center;justify-content:center}
  .toggle{width:42px;height:24px;border-radius:100px;cursor:pointer;transition:all 0.3s;position:relative;border:none;flex-shrink:0}
  .toggle-knob{position:absolute;top:3px;width:18px;height:18px;border-radius:50%;background:white;transition:all 0.3s;box-shadow:0 1px 4px rgba(0,0,0,0.3)}
  .badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:100px;font-size:10px;font-weight:700}
  .ni{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:10px 0;cursor:pointer;border:none;background:none;font-family:inherit;flex:1;border-top:2px solid transparent;transition:all 0.2s}
  .ni.on{border-top-color:#00FFD1}
  .loader{width:18px;height:18px;border:2.5px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
  .livdot{width:7px;height:7px;border-radius:50%;background:#00FFD1;display:inline-block;position:relative}
  .livdot::after{content:'';position:absolute;inset:-3px;border-radius:50%;background:rgba(0,255,209,0.3);animation:ripple 1.8s infinite}
  select.inp{cursor:pointer}
  select.inp option{background:#0D1B35;color:#E8F4FF}
  .star{cursor:pointer;font-size:26px;transition:transform 0.15s}
  .star:hover{transform:scale(1.2)}
`;

const MONTHLY_DATA = [65,78,82,91,88,95,72,84,90,96,88,102];
const MONTHS       = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function DoctorProfilePage() {
  const router   = useRouter();
  const photoRef = useRef<HTMLInputElement>(null);
  const [tab, setTab]     = useState<Tab>("profile");
  const [photo, setPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  const [info, setInfo] = useState({
    name: "Dr. Priya Sharma", mobile: "+91 9876543210", email: "priya@email.com",
    specialty: "General Physician", degree: "MBBS, MD (General Medicine)",
    experience: "12", fee: "299", bio: "Experienced general physician with 12 years of practice. Specializing in preventive care and chronic disease management.",
    languages: ["English","Hindi"] as string[],
    college: "AIIMS Delhi", regNo: "MCI-448291",
  });

  const [schedule, setSchedule] = useState({
    days: ["Mon","Tue","Wed","Thu","Fri"] as string[],
    slot1Start: "09:00", slot1End: "13:00",
    slot2Start: "17:00", slot2End: "21:00",
    maxPerDay: "20", breakTime: "10",
    instantConsult: true,
  });

  const [bank, setBank] = useState({
    accountName: "Dr. Priya Sharma", accountNo: "", ifsc: "",
    bankName: "", upiId: "", panNo: "",
  });

  const setI = (k: string, v: any) => setInfo(p => ({ ...p, [k]: v }));
  const setS = (k: string, v: any) => setSchedule(p => ({ ...p, [k]: v }));
  const setB = (k: string, v: any) => setBank(p => ({ ...p, [k]: v }));

  const toggleDay  = (d: string) => setSchedule(p => ({ ...p, days: p.days.includes(d) ? p.days.filter(x => x !== d) : [...p.days, d] }));
  const toggleLang = (l: string) => setInfo(p => ({ ...p, languages: p.languages.includes(l) ? p.languages.filter(x => x !== l) : [...p.languages, l] }));

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const save = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500); }, 1400);
  };

  const maxBar = Math.max(...MONTHLY_DATA);

  return (
    <div style={{ position:"fixed",inset:0,display:"flex",flexDirection:"column", background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#E8F4FF",maxWidth:480,margin:"0 auto", left:0,right:0 }}>
      <style>{S}</style>

      {/* HEADER */}
      <div style={{flexShrink:0,padding:"13px 18px 12px",background:"rgba(2,13,26,0.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>router.back()} style={{background:"none",border:"none",color:"#00FFD1",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>← Back</button>
          <h2 style={{flex:1,fontSize:16,fontWeight:800}}>Doctor Profile</h2>
          {saved && <span style={{color:"#00FFD1",fontSize:12,fontWeight:700}}>✓ Saved!</span>}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{flex:1,overflowY:"auto",padding:"0 18px"}} className="noscroll">

        {/* ── PROFILE ── */}
        {tab === "profile" && (
          <div className="slide-up" style={{paddingTop:16,paddingBottom:16}}>

            {/* Photo + Name */}
            <div style={{textAlign:"center",marginBottom:22}}>
              <div onClick={()=>photoRef.current?.click()} style={{width:90,height:90,borderRadius:"50%",margin:"0 auto 10px",cursor:"pointer",background:photo?"transparent":"rgba(0,255,209,0.07)",border:`2.5px dashed ${photo?"rgba(0,255,209,0.5)":"rgba(0,255,209,0.22)"}`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",transition:"all 0.3s",boxShadow:photo?"0 0 20px rgba(0,255,209,0.2)":"none"}}>
                {photo ? <img src={photo} alt="Doctor" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <span style={{fontSize:36}}>👩‍⚕️</span>}
              </div>
              <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto} style={{display:"none"}}/>
              <button onClick={()=>photoRef.current?.click()} style={{padding:"5px 14px",borderRadius:100,background:"rgba(0,255,209,0.08)",border:"1px solid rgba(0,255,209,0.2)",color:"#00FFD1",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                {photo?"Change Photo":"Upload Photo"}
              </button>
              <div style={{marginTop:8}}>
                <p style={{fontWeight:700,fontSize:16,color:"#E8F4FF"}}>{info.name}</p>
                <p style={{color:"#00FFD1",fontSize:12,marginTop:1,fontWeight:600}}>{info.specialty}</p>
                <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:5}}>
                  <span className="badge" style={{background:"rgba(0,255,209,0.08)",color:"#00FFD1"}}>✓ MCI Verified</span>
                  <span className="badge" style={{background:"rgba(255,179,71,0.1)",color:"#FFB347"}}>⭐ 4.9</span>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div className="gc">
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:13}}>Personal Information</p>
              <div style={{marginBottom:12}}>
                <label className="lbl">Full Name</label>
                <input className="inp" value={info.name} onChange={e=>setI("name",e.target.value)}/>
              </div>
              <div style={{marginBottom:12}}>
                <label className="lbl">Email</label>
                <input className="inp" type="email" value={info.email} onChange={e=>setI("email",e.target.value)}/>
              </div>
              <div style={{marginBottom:12}}>
                <label className="lbl">Mobile</label>
                <input className="inp" value={info.mobile} disabled style={{opacity:0.5,cursor:"not-allowed"}}/>
                <p style={{color:"rgba(232,244,255,0.22)",fontSize:10,marginTop:3}}>Mobile cannot be changed</p>
              </div>
            </div>

            {/* Professional */}
            <div className="gc">
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:13}}>Professional Details</p>
              <div style={{marginBottom:12}}>
                <label className="lbl">Specialty</label>
                <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:4}} className="noscroll">
                  {SPECIALTIES.map(s=>(
                    <button key={s} className="chip" onClick={()=>setI("specialty",s)} style={{borderColor:info.specialty===s?"rgba(0,255,209,0.5)":"rgba(255,255,255,0.08)",background:info.specialty===s?"rgba(0,255,209,0.08)":"rgba(255,255,255,0.03)",color:info.specialty===s?"#00FFD1":"rgba(232,244,255,0.45)"}}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:12}}>
                <label className="lbl">Degree</label>
                <input className="inp" value={info.degree} onChange={e=>setI("degree",e.target.value)} placeholder="MBBS, MD..."/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                <div>
                  <label className="lbl">Experience (yrs)</label>
                  <input className="inp" value={info.experience} onChange={e=>setI("experience",e.target.value)}/>
                </div>
                <div>
                  <label className="lbl">Fee (₹)</label>
                  <input className="inp" value={info.fee} onChange={e=>setI("fee",e.target.value)}/>
                </div>
              </div>
              <div style={{marginBottom:12}}>
                <label className="lbl">MCI Registration No.</label>
                <input className="inp" value={info.regNo} onChange={e=>setI("regNo",e.target.value)}/>
              </div>
              <div style={{marginBottom:12}}>
                <label className="lbl">Languages Spoken</label>
                <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                  {LANGUAGES.map(l=>(
                    <button key={l} className="chip" onClick={()=>toggleLang(l)} style={{borderColor:info.languages.includes(l)?"rgba(77,184,255,0.5)":"rgba(255,255,255,0.08)",background:info.languages.includes(l)?"rgba(77,184,255,0.1)":"rgba(255,255,255,0.03)",color:info.languages.includes(l)?"#4DB8FF":"rgba(232,244,255,0.45)"}}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="lbl">About / Bio</label>
                <textarea className="inp" rows={4} value={info.bio} onChange={e=>setI("bio",e.target.value)} style={{resize:"none",lineHeight:1.6}}/>
              </div>
            </div>
          </div>
        )}

        {/* ── SCHEDULE ── */}
        {tab === "schedule" && (
          <div className="slide-up" style={{paddingTop:16,paddingBottom:16}}>
            <div className="gc">
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:13}}>Available Days</p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:4}}>
                {DAYS.map(d=>(
                  <button key={d} className="day-btn" onClick={()=>toggleDay(d)} style={{borderColor:schedule.days.includes(d)?"rgba(0,255,209,0.5)":"rgba(255,255,255,0.1)",background:schedule.days.includes(d)?"rgba(0,255,209,0.1)":"rgba(255,255,255,0.03)",color:schedule.days.includes(d)?"#00FFD1":"rgba(232,244,255,0.4)"}}>
                    {d}
                  </button>
                ))}
              </div>
              <p style={{color:"rgba(232,244,255,0.3)",fontSize:10,marginTop:6}}>{schedule.days.length} days selected</p>
            </div>

            <div className="gc">
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Time Slot 1 (Morning)</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><label className="lbl">Start</label><input className="inp" type="time" value={schedule.slot1Start} onChange={e=>setS("slot1Start",e.target.value)}/></div>
                <div><label className="lbl">End</label><input className="inp" type="time" value={schedule.slot1End} onChange={e=>setS("slot1End",e.target.value)}/></div>
              </div>
            </div>

            <div className="gc">
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Time Slot 2 (Evening)</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><label className="lbl">Start</label><input className="inp" type="time" value={schedule.slot2Start} onChange={e=>setS("slot2Start",e.target.value)}/></div>
                <div><label className="lbl">End</label><input className="inp" type="time" value={schedule.slot2End} onChange={e=>setS("slot2End",e.target.value)}/></div>
              </div>
            </div>

            <div className="gc">
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Capacity & Settings</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                <div><label className="lbl">Max Patients/Day</label><input className="inp" value={schedule.maxPerDay} onChange={e=>setS("maxPerDay",e.target.value)}/></div>
                <div><label className="lbl">Break Time (min)</label><input className="inp" value={schedule.breakTime} onChange={e=>setS("breakTime",e.target.value)}/></div>
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div>
                  <p style={{fontSize:13,fontWeight:600,color:"#E8F4FF"}}>Instant Consult</p>
                  <p style={{color:"rgba(232,244,255,0.35)",fontSize:10,marginTop:1}}>Allow patients to connect immediately</p>
                </div>
                <button className="toggle" onClick={()=>setS("instantConsult",!schedule.instantConsult)} style={{background:schedule.instantConsult?"#00C9A7":"rgba(255,255,255,0.1)"}}>
                  <div className="toggle-knob" style={{left:schedule.instantConsult?21:3}}/>
                </button>
              </div>
            </div>

            {/* Weekly preview */}
            <div className="gc">
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Schedule Preview</p>
              {schedule.days.length > 0 ? (
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {schedule.days.map(d=>(
                    <div key={d} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",borderRadius:10,background:"rgba(0,255,209,0.05)",border:"1px solid rgba(0,255,209,0.12)"}}>
                      <span style={{fontWeight:600,fontSize:12,color:"#E8F4FF"}}>{d}</span>
                      <span style={{color:"#00FFD1",fontSize:11,fontWeight:600}}>
                        {schedule.slot1Start}–{schedule.slot1End}
                        {schedule.slot2Start && ` · ${schedule.slot2Start}–${schedule.slot2End}`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{color:"rgba(232,244,255,0.28)",fontSize:12,textAlign:"center"}}>No days selected</p>
              )}
            </div>
          </div>
        )}

        {/* ── BANK ── */}
        {tab === "bank" && (
          <div className="slide-up" style={{paddingTop:16,paddingBottom:16}}>
            <div style={{background:"rgba(0,255,209,0.05)",border:"1px solid rgba(0,255,209,0.14)",borderRadius:14,padding:"12px 15px",marginBottom:16,display:"flex",gap:10}}>
              <span style={{fontSize:20}}>💡</span>
              <p style={{color:"rgba(232,244,255,0.55)",fontSize:12,lineHeight:1.7}}>Earnings are settled <strong style={{color:"#00FFD1"}}>every Monday</strong> directly to your bank account. Minimum payout: ₹500.</p>
            </div>

            <div className="gc">
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:13}}>Bank Account</p>
              {[
                {k:"accountName",l:"Account Holder Name",ph:"Full name as per bank"},
                {k:"accountNo",  l:"Account Number",     ph:"XXXX XXXX XXXX XXXX"},
                {k:"ifsc",       l:"IFSC Code",          ph:"e.g. SBIN0001234"},
                {k:"bankName",   l:"Bank Name",          ph:"e.g. State Bank of India"},
              ].map(f=>(
                <div key={f.k} style={{marginBottom:12}}>
                  <label className="lbl">{f.l}</label>
                  <input className="inp" value={bank[f.k as keyof typeof bank]} onChange={e=>setB(f.k,e.target.value)} placeholder={f.ph}/>
                </div>
              ))}
            </div>

            <div className="gc">
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:13}}>UPI & PAN</p>
              <div style={{marginBottom:12}}>
                <label className="lbl">UPI ID</label>
                <input className="inp" value={bank.upiId} onChange={e=>setB("upiId",e.target.value)} placeholder="yourname@upi"/>
              </div>
              <div>
                <label className="lbl">PAN Number</label>
                <input className="inp" value={bank.panNo} onChange={e=>setB("panNo",e.target.value)} placeholder="ABCDE1234F" style={{textTransform:"uppercase"}}/>
                <p style={{color:"rgba(232,244,255,0.22)",fontSize:10,marginTop:3}}>Required for TDS deduction as per IT rules</p>
              </div>
            </div>

            {/* Earnings summary */}
            <div className="gc">
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Pending Payout</p>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <p style={{color:"rgba(232,244,255,0.4)",fontSize:11}}>Available Balance</p>
                  <p style={{fontWeight:900,fontSize:24,color:"#00FFD1",marginTop:2}}>₹4,788</p>
                  <p style={{color:"rgba(232,244,255,0.28)",fontSize:10,marginTop:2}}>Next payout: Monday, 7 Apr</p>
                </div>
                <div style={{textAlign:"right"}}>
                  <p style={{color:"rgba(232,244,255,0.4)",fontSize:11}}>This month</p>
                  <p style={{fontWeight:700,fontSize:16,color:"#4DB8FF",marginTop:2}}>₹32,100</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STATS ── */}
        {tab === "stats" && (
          <div className="slide-up" style={{paddingTop:16,paddingBottom:16}}>
            {/* KPIs */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
              {[
                {n:"342",    l:"Total Consultations", c:"#00FFD1", icon:"🩺"},
                {n:"₹1.02L", l:"Total Earned",        c:"#4DB8FF", icon:"💰"},
                {n:"4.9 ★",  l:"Avg. Rating",         c:"#FFB347", icon:"⭐"},
                {n:"94%",    l:"Satisfaction Rate",   c:"#34D399", icon:"💚"},
              ].map(s=>(
                <div key={s.l} className="gc" style={{padding:"14px",textAlign:"center"}}>
                  <span style={{fontSize:24,display:"block",marginBottom:6}}>{s.icon}</span>
                  <p style={{fontWeight:900,fontSize:20,color:s.c}}>{s.n}</p>
                  <p style={{fontSize:10,color:"rgba(232,244,255,0.38)",marginTop:3}}>{s.l}</p>
                </div>
              ))}
            </div>

            {/* Monthly chart */}
            <div className="gc">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1}}>Monthly Consultations (2025–26)</p>
              </div>
              <div style={{display:"flex",alignItems:"flex-end",gap:4,height:80}}>
                {MONTHLY_DATA.map((v,i)=>(
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <div style={{width:"100%",borderRadius:"4px 4px 0 0",background:`linear-gradient(to top, #00C9A7, #0B6FCC)`,height:`${(v/maxBar)*68}px`,opacity: i === MONTHLY_DATA.length-1 ? 1 : 0.65,transition:"height 0.5s ease"}}/>
                    <p style={{fontSize:7,color:"rgba(232,244,255,0.3)",writingMode:"vertical-lr",transform:"rotate(180deg)"}}>{MONTHS[i]}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent reviews */}
            <div className="gc">
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Recent Patient Reviews</p>
              {[
                {name:"Rahul V.", stars:5, text:"Dr. Priya was very thorough and patient. Highly recommend!", date:"31 Mar"},
                {name:"Seema J.", stars:5, text:"Excellent doctor! Diagnosed my issue quickly and explained everything clearly.", date:"30 Mar"},
                {name:"Aditya K.",stars:4, text:"Good consultation. Could have spent a bit more time on my questions.", date:"29 Mar"},
              ].map((r,i)=>(
                <div key={i} style={{paddingBottom:i<2?12:0,marginBottom:i<2?12:0,borderBottom:i<2?"1px solid rgba(255,255,255,0.05)":"none"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <div style={{display:"flex",gap:4}}>
                      {Array.from({length:5}).map((_,j)=>(
                        <span key={j} style={{color:j<r.stars?"#FFB347":"rgba(255,255,255,0.12)",fontSize:12}}>★</span>
                      ))}
                    </div>
                    <p style={{color:"rgba(232,244,255,0.28)",fontSize:10}}>{r.date}</p>
                  </div>
                  <p style={{color:"rgba(232,244,255,0.6)",fontSize:11,lineHeight:1.6,marginBottom:2}}>{r.text}</p>
                  <p style={{color:"rgba(232,244,255,0.35)",fontSize:10}}>— {r.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SAVE BUTTON */}
      {tab !== "stats" && (
        <div style={{flexShrink:0,padding:"11px 18px 16px",background:"rgba(2,13,26,0.97)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
          <button className="bm" onClick={save} disabled={saving}>
            {saving?<span className="loader"/>:saved?"✅ Saved!":"💾 Save Changes"}
          </button>
        </div>
      )}

      {/* BOTTOM NAV */}
      <div style={{flexShrink:0,display:"flex",background:"rgba(2,13,26,0.97)",backdropFilter:"blur(24px)",borderTop:"1px solid rgba(255,255,255,0.07)"}}>
        {([
          {t:"profile" as Tab,icon:"👩‍⚕️",label:"Profile"},
          {t:"schedule"as Tab,icon:"📅",  label:"Schedule"},
          {t:"bank"    as Tab,icon:"🏦",  label:"Bank"},
          {t:"stats"   as Tab,icon:"📊",  label:"Stats"},
        ]).map(n=>(
          <button key={n.t} className={"ni"+(tab===n.t?" on":"")} onClick={()=>setTab(n.t)} style={{color:tab===n.t?"#00FFD1":"rgba(232,244,255,0.3)"}}>
            <span style={{fontSize:18}}>{n.icon}</span>
            <span style={{fontSize:9,fontWeight:tab===n.t?700:500}}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
