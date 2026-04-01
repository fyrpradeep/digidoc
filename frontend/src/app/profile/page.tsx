"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type Tab = "profile" | "health" | "records" | "settings";

const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];
const ALLERGIES    = ["Penicillin","Sulfa","Aspirin","Ibuprofen","Latex","Peanuts","Shellfish","Dairy","None"];
const CONDITIONS   = ["Diabetes","Hypertension","Asthma","Heart Disease","Thyroid","Arthritis","None"];

const PAST_CONSULTS = [
  { id: "RX-2041", doctor: "Dr. Priya Sharma",  spec: "General Physician", date: "31 Mar 2026", diag: "Upper Respiratory Infection", fee: 299  },
  { id: "RX-2038", doctor: "Dr. Arjun Mehta",   spec: "Cardiologist",      date: "15 Mar 2026", diag: "Routine Heart Checkup",       fee: 599  },
  { id: "RX-2031", doctor: "Dr. Sneha Rao",      spec: "Dermatologist",     date: "2 Mar 2026",  diag: "Skin Allergy",                fee: 399  },
  { id: "RX-2020", doctor: "Dr. Rahul Gupta",    spec: "Neurologist",       date: "18 Feb 2026", diag: "Migraine Consultation",       fee: 699  },
];

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .slide-up{animation:slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both}
  .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .inp{width:100%;padding:12px 14px;border-radius:13px;font-family:inherit;font-size:13px;outline:none;transition:all 0.3s;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.09);color:#E8F4FF}
  .inp::placeholder{color:rgba(232,244,255,0.28)}
  .inp:focus{border-color:rgba(0,255,209,0.4);background:rgba(0,255,209,0.03);box-shadow:0 0 0 3px rgba(0,255,209,0.07)}
  .lbl{display:block;font-size:10px;font-weight:700;color:rgba(232,244,255,0.38);text-transform:uppercase;letter-spacing:1.2px;margin-bottom:6px}
  .gc{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:15px;margin-bottom:13px;transition:all 0.3s}
  .bm{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:14px;border-radius:14px;font-family:inherit;font-weight:800;font-size:14px;color:white;border:none;cursor:pointer;transition:all 0.3s;background:linear-gradient(135deg,#00C9A7,#0B6FCC);box-shadow:0 0 20px rgba(0,201,167,0.26)}
  .bm:hover{transform:translateY(-1px);box-shadow:0 0 30px rgba(0,201,167,0.4)}
  .bg{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:12px;border-radius:14px;font-family:inherit;font-weight:600;font-size:13px;color:#00FFD1;border:1px solid rgba(0,255,209,0.22);background:rgba(0,255,209,0.05);cursor:pointer;transition:all 0.3s}
  .bg:hover{background:rgba(0,255,209,0.09);border-color:rgba(0,255,209,0.42)}
  .chip{padding:6px 13px;border-radius:100px;cursor:pointer;font-family:inherit;font-size:11px;font-weight:600;transition:all 0.2s;border:1.5px solid}
  .chip:active{transform:scale(0.96)}
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
  .row-link{display:flex;align-items:center;gap:12px;padding:13px 15px;border-radius:13px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);margin-bottom:9px;text-decoration:none;transition:all 0.2s;cursor:pointer}
  .row-link:hover{border-color:rgba(0,255,209,0.18);background:rgba(0,255,209,0.03)}
`;

export default function ProfilePage() {
  const router  = useRouter();
  const photoRef = useRef<HTMLInputElement>(null);
  const [tab, setTab]   = useState<Tab>("profile");
  const [photo, setPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  const [profile, setProfile] = useState({
    name: "Rahul Verma", mobile: "+91 9999999999", email: "rahul@email.com",
    dob: "1998-03-15", gender: "Male", city: "Indore", state: "Madhya Pradesh",
  });

  const [health, setHealth] = useState({
    bloodGroup: "B+", weight: "72", height: "175",
    allergies: ["None"] as string[],
    conditions: ["None"] as string[],
    smoking: false, alcohol: false, emergency: "", emergencyPhone: "",
  });

  const [notifs, setNotifs] = useState({
    sms: true, email: true, push: true, reminders: true, offers: false,
  });

  const setP = (k: string, v: any) => setProfile(p => ({ ...p, [k]: v }));
  const setH = (k: string, v: any) => setHealth(p => ({ ...p, [k]: v }));
  const setN = (k: string, v: any) => setNotifs(p => ({ ...p, [k]: v }));

  const toggleChip = (arr: string[], val: string, key: string) => {
    const none = val === "None";
    if (none) { setH(key, ["None"]); return; }
    const without = arr.filter(x => x !== "None");
    const newArr = without.includes(val) ? without.filter(x => x !== val) : [...without, val];
    setH(key, newArr.length === 0 ? ["None"] : newArr);
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const save = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500); }, 1500);
  };

  return (
    <div style={{
      position:"fixed",inset:0,display:"flex",flexDirection:"column",
      background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",
      color:"#E8F4FF",maxWidth:480,margin:"0 auto",
      left:0,right:0,
    }}>
      <style>{S}</style>

      {/* HEADER */}
      <div style={{flexShrink:0,padding:"13px 18px 12px",background:"rgba(2,13,26,0.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <button onClick={()=>router.back()} style={{background:"none",border:"none",color:"#00FFD1",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>← Back</button>
          <h2 style={{flex:1,fontSize:16,fontWeight:800}}>My Profile</h2>
          {saved && <span style={{color:"#00FFD1",fontSize:12,fontWeight:700,animation:"slideUp 0.3s ease"}}>✓ Saved!</span>}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{flex:1,overflowY:"auto",padding:"0 18px"}} className="noscroll">

        {/* ── PROFILE TAB ── */}
        {tab === "profile" && (
          <div className="slide-up" style={{paddingTop:16,paddingBottom:16}}>

            {/* Avatar */}
            <div style={{textAlign:"center",marginBottom:22}}>
              <div onClick={()=>photoRef.current?.click()} style={{width:86,height:86,borderRadius:"50%",margin:"0 auto 10px",cursor:"pointer",background:photo?"transparent":"rgba(0,255,209,0.08)",border:`2.5px dashed ${photo?"rgba(0,255,209,0.5)":"rgba(0,255,209,0.25)"}`,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",transition:"all 0.3s",boxShadow:photo?"0 0 20px rgba(0,255,209,0.18)":"none"}}>
                {photo ? <img src={photo} alt="Profile" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <span style={{fontSize:32}}>🧑</span>}
              </div>
              <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto} style={{display:"none"}}/>
              <button onClick={()=>photoRef.current?.click()} style={{padding:"5px 14px",borderRadius:100,background:"rgba(0,255,209,0.08)",border:"1px solid rgba(0,255,209,0.2)",color:"#00FFD1",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                {photo ? "Change Photo" : "Upload Photo"}
              </button>
              <div style={{marginTop:8}}>
                <p style={{fontWeight:700,fontSize:16,color:"#E8F4FF"}}>{profile.name}</p>
                <p style={{color:"rgba(232,244,255,0.4)",fontSize:12,marginTop:2}}>PAT-10042 · {profile.mobile}</p>
              </div>
            </div>

            {/* Stats */}
            <div style={{display:"flex",gap:9,marginBottom:18}}>
              {[{n:"8",l:"Consults"},{n:"3",l:"Prescriptions"},{n:"12",l:"Medicines"}].map(s=>(
                <div key={s.l} className="gc" style={{flex:1,textAlign:"center",padding:12,margin:0}}>
                  <p style={{fontWeight:900,fontSize:18,color:"#00FFD1"}}>{s.n}</p>
                  <p style={{fontSize:9,color:"rgba(232,244,255,0.38)",marginTop:2}}>{s.l}</p>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="gc">
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:13}}>Personal Information</p>
              <div style={{marginBottom:12}}>
                <label className="lbl">Full Name</label>
                <input className="inp" value={profile.name} onChange={e=>setP("name",e.target.value)} placeholder="Full Name"/>
              </div>
              <div style={{marginBottom:12}}>
                <label className="lbl">Mobile Number</label>
                <input className="inp" value={profile.mobile} disabled style={{opacity:0.5,cursor:"not-allowed"}}/>
                <p style={{color:"rgba(232,244,255,0.25)",fontSize:10,marginTop:3}}>Mobile cannot be changed</p>
              </div>
              <div style={{marginBottom:12}}>
                <label className="lbl">Email Address</label>
                <input className="inp" value={profile.email} onChange={e=>setP("email",e.target.value)} placeholder="email@example.com"/>
              </div>
              <div style={{marginBottom:12}}>
                <label className="lbl">Date of Birth</label>
                <input className="inp" type="date" value={profile.dob} onChange={e=>setP("dob",e.target.value)}/>
              </div>
              <div style={{marginBottom:12}}>
                <label className="lbl">Gender</label>
                <div style={{display:"flex",gap:8}}>
                  {["Male","Female","Other"].map(g=>(
                    <button key={g} onClick={()=>setP("gender",g)} style={{flex:1,padding:"9px",borderRadius:11,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600,border:`1.5px solid ${profile.gender===g?"rgba(0,255,209,0.5)":"rgba(255,255,255,0.08)"}`,background:profile.gender===g?"rgba(0,255,209,0.08)":"rgba(255,255,255,0.03)",color:profile.gender===g?"#00FFD1":"rgba(232,244,255,0.45)"}}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div>
                  <label className="lbl">City</label>
                  <input className="inp" value={profile.city} onChange={e=>setP("city",e.target.value)} placeholder="City"/>
                </div>
                <div>
                  <label className="lbl">State</label>
                  <input className="inp" value={profile.state} onChange={e=>setP("state",e.target.value)} placeholder="State"/>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── HEALTH TAB ── */}
        {tab === "health" && (
          <div className="slide-up" style={{paddingTop:16,paddingBottom:16}}>

            <div className="gc">
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:13}}>Basic Health Info</p>
              <div style={{marginBottom:12}}>
                <label className="lbl">Blood Group</label>
                <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                  {BLOOD_GROUPS.map(b=>(
                    <button key={b} onClick={()=>setH("bloodGroup",b)} className="chip" style={{borderColor:health.bloodGroup===b?"rgba(255,107,107,0.5)":"rgba(255,255,255,0.08)",background:health.bloodGroup===b?"rgba(255,107,107,0.1)":"rgba(255,255,255,0.03)",color:health.bloodGroup===b?"#FF6B6B":"rgba(232,244,255,0.5)"}}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                <div>
                  <label className="lbl">Weight (kg)</label>
                  <input className="inp" value={health.weight} onChange={e=>setH("weight",e.target.value)} placeholder="e.g. 70"/>
                </div>
                <div>
                  <label className="lbl">Height (cm)</label>
                  <input className="inp" value={health.height} onChange={e=>setH("height",e.target.value)} placeholder="e.g. 170"/>
                </div>
              </div>
              {health.weight && health.height && (
                <div style={{background:"rgba(0,255,209,0.05)",border:"1px solid rgba(0,255,209,0.12)",borderRadius:10,padding:"8px 12px"}}>
                  <p style={{color:"rgba(232,244,255,0.4)",fontSize:10}}>BMI</p>
                  <p style={{color:"#00FFD1",fontWeight:700,fontSize:14}}>
                    {(+health.weight / ((+health.height/100)**2)).toFixed(1)}
                    <span style={{color:"rgba(232,244,255,0.4)",fontSize:11,fontWeight:500,marginLeft:6}}>
                      {(+health.weight / ((+health.height/100)**2)) < 18.5 ? "Underweight" :
                       (+health.weight / ((+health.height/100)**2)) < 25 ? "Normal" :
                       (+health.weight / ((+health.height/100)**2)) < 30 ? "Overweight" : "Obese"}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="gc">
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Known Allergies</p>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {ALLERGIES.map(a=>{
                  const sel=health.allergies.includes(a);
                  return <button key={a} onClick={()=>toggleChip(health.allergies,a,"allergies")} className="chip" style={{borderColor:sel?"rgba(255,179,71,0.5)":"rgba(255,255,255,0.08)",background:sel?"rgba(255,179,71,0.1)":"rgba(255,255,255,0.03)",color:sel?"#FFB347":"rgba(232,244,255,0.5)"}}>{a}</button>
                })}
              </div>
            </div>

            <div className="gc">
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Existing Conditions</p>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {CONDITIONS.map(c=>{
                  const sel=health.conditions.includes(c);
                  return <button key={c} onClick={()=>toggleChip(health.conditions,c,"conditions")} className="chip" style={{borderColor:sel?"rgba(167,139,250,0.5)":"rgba(255,255,255,0.08)",background:sel?"rgba(167,139,250,0.1)":"rgba(255,255,255,0.03)",color:sel?"#A78BFA":"rgba(232,244,255,0.5)"}}>{c}</button>
                })}
              </div>
            </div>

            <div className="gc">
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Lifestyle</p>
              {[{k:"smoking",l:"Smoking",icon:"🚬"},{k:"alcohol",l:"Alcohol",icon:"🍺"}].map(item=>(
                <div key={item.k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <span style={{fontSize:18}}>{item.icon}</span>
                    <p style={{fontSize:13,fontWeight:600,color:"#E8F4FF"}}>{item.l}</p>
                  </div>
                  <button className="toggle" onClick={()=>setH(item.k,!health[item.k as keyof typeof health])} style={{background:health[item.k as keyof typeof health]?"#FF6B6B":"rgba(255,255,255,0.1)"}}>
                    <div className="toggle-knob" style={{left:health[item.k as keyof typeof health]?21:3}}/>
                  </button>
                </div>
              ))}
            </div>

            <div className="gc">
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Emergency Contact</p>
              <div style={{marginBottom:10}}>
                <label className="lbl">Contact Name</label>
                <input className="inp" value={health.emergency} onChange={e=>setH("emergency",e.target.value)} placeholder="Parent / Spouse / Friend"/>
              </div>
              <div>
                <label className="lbl">Contact Number</label>
                <input className="inp" value={health.emergencyPhone} onChange={e=>setH("emergencyPhone",e.target.value)} placeholder="+91 XXXXX XXXXX"/>
              </div>
            </div>
          </div>
        )}

        {/* ── RECORDS TAB ── */}
        {tab === "records" && (
          <div className="slide-up" style={{paddingTop:16,paddingBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h3 style={{fontSize:15,fontWeight:800}}>Consultation History</h3>
              <span style={{color:"rgba(232,244,255,0.35)",fontSize:12}}>{PAST_CONSULTS.length} total</span>
            </div>
            {PAST_CONSULTS.map(c=>(
              <div key={c.id} className="gc" style={{padding:"13px 14px",cursor:"pointer"}} onClick={()=>router.push("/prescription/"+c.id)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div>
                    <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF",marginBottom:2}}>{c.doctor}</p>
                    <p style={{color:"#00FFD1",fontSize:11,fontWeight:600}}>{c.spec}</p>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <p style={{color:"rgba(232,244,255,0.35)",fontSize:10}}>{c.date}</p>
                    <p style={{color:"#00FFD1",fontWeight:700,fontSize:12,marginTop:2}}>₹{c.fee}</p>
                  </div>
                </div>
                <p style={{color:"rgba(232,244,255,0.45)",fontSize:11}}>Dx: {c.diag}</p>
                <div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}>
                  <span style={{color:"#4DB8FF",fontSize:11,fontWeight:600}}>View Prescription →</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {tab === "settings" && (
          <div className="slide-up" style={{paddingTop:16,paddingBottom:16}}>

            <div className="gc">
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Notifications</p>
              {[
                {k:"sms",   l:"SMS Alerts",         sub:"Appointment & order updates"},
                {k:"email", l:"Email Notifications", sub:"Reports and summaries"},
                {k:"push",  l:"Push Notifications",  sub:"Real-time alerts on phone"},
                {k:"reminders",l:"Medicine Reminders",sub:"Daily dose reminders"},
                {k:"offers",l:"Offers & Promotions", sub:"Deals and health tips"},
              ].map(n=>(
                <div key={n.k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                  <div>
                    <p style={{fontSize:13,fontWeight:600,color:"#E8F4FF"}}>{n.l}</p>
                    <p style={{color:"rgba(232,244,255,0.35)",fontSize:10,marginTop:1}}>{n.sub}</p>
                  </div>
                  <button className="toggle" onClick={()=>setN(n.k,!notifs[n.k as keyof typeof notifs])} style={{background:notifs[n.k as keyof typeof notifs]?"#00C9A7":"rgba(255,255,255,0.1)"}}>
                    <div className="toggle-knob" style={{left:notifs[n.k as keyof typeof notifs]?21:3}}/>
                  </button>
                </div>
              ))}
            </div>

            <div className="gc">
              <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Account</p>
              {[
                {icon:"🔒",label:"Privacy & Security",  action:()=>{}},
                {icon:"📍",label:"Saved Addresses",     action:()=>{}},
                {icon:"💳",label:"Payment Methods",     action:()=>{}},
                {icon:"❓",label:"Help & Support",      action:()=>router.push("/support")},
                {icon:"📄",label:"Terms of Service",    action:()=>router.push("/terms")},
                {icon:"🔏",label:"Privacy Policy",      action:()=>router.push("/privacy")},
              ].map(item=>(
                <button key={item.label} className="row-link" onClick={item.action} style={{width:"100%",textAlign:"left"}}>
                  <span style={{fontSize:18}}>{item.icon}</span>
                  <span style={{fontWeight:600,fontSize:13,color:"#E8F4FF",flex:1}}>{item.label}</span>
                  <span style={{color:"rgba(232,244,255,0.25)",fontSize:13}}>→</span>
                </button>
              ))}
            </div>

            <button onClick={()=>{localStorage.clear();window.location.href="/login";}} style={{width:"100%",padding:"13px",borderRadius:13,background:"rgba(255,107,107,0.07)",border:"1px solid rgba(255,107,107,0.18)",color:"#FF6B6B",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* SAVE BUTTON — show only on profile and health tabs */}
      {(tab === "profile" || tab === "health") && (
        <div style={{flexShrink:0,padding:"11px 18px 18px",background:"rgba(2,13,26,0.97)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
          <button className="bm" onClick={save} disabled={saving}>
            {saving ? <span className="loader"/> : saved ? "✅ Saved!" : "💾 Save Changes"}
          </button>
        </div>
      )}

      {/* BOTTOM NAV */}
      <div style={{flexShrink:0,display:"flex",background:"rgba(2,13,26,0.97)",backdropFilter:"blur(24px)",borderTop:"1px solid rgba(255,255,255,0.07)"}}>
        {([
          {t:"profile" as Tab, icon:"👤", label:"Profile"},
          {t:"health"  as Tab, icon:"❤️",  label:"Health"},
          {t:"records" as Tab, icon:"📋", label:"Records"},
          {t:"settings"as Tab, icon:"⚙️",  label:"Settings"},
        ]).map(n=>(
          <button key={n.t} className={"ni"+(tab===n.t?" on":"")} onClick={()=>setTab(n.t)}
            style={{color:tab===n.t?"#00FFD1":"rgba(232,244,255,0.3)"}}>
            <span style={{fontSize:19}}>{n.icon}</span>
            <span style={{fontSize:9,fontWeight:tab===n.t?700:500}}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
