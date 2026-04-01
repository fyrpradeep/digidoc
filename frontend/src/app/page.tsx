"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    try {
      const t = localStorage.getItem("dg_token") || localStorage.getItem("digidoc_token") || "";
      const r = localStorage.getItem("dg_role")  || localStorage.getItem("digidoc_role")  || "";
      if (t && r) { router.replace(r==="doctor"?"/doctor/dashboard":r==="admin"?"/admin/dashboard":"/dashboard"); }
    } catch {}
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{background:"#020D1A",color:"#E8F4FF",fontFamily:"'Plus Jakarta Sans',sans-serif",minHeight:"100vh",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#020D1A}::-webkit-scrollbar-thumb{background:#00FFD1;border-radius:4px}
        @keyframes sh{0%{background-position:-200% center}to{background-position:200% center}}
        @keyframes fy{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes rp{0%{transform:scale(.8);opacity:1}to{transform:scale(2.4);opacity:0}}
        .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#A78BFA,#00FFD1);background-size:300% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:sh 4s linear infinite}
        .shine2{background:linear-gradient(90deg,#4DB8FF,#00FFD1,#4DB8FF);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:sh 3s linear infinite}
        .btn-p{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:16px 28px;border-radius:14px;font-weight:800;font-size:15px;color:#fff;border:none;cursor:pointer;background:linear-gradient(135deg,#00C9A7,#0B6FCC);box-shadow:0 8px 32px rgba(0,201,167,.35);transition:all .3s;font-family:inherit;text-decoration:none}
        .btn-p:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(0,201,167,.5)}
        .btn-o{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:15px 26px;border-radius:14px;font-weight:700;font-size:14px;color:#00FFD1;border:1.5px solid rgba(0,255,209,.35);cursor:pointer;background:rgba(0,255,209,.06);transition:all .3s;font-family:inherit;text-decoration:none}
        .btn-o:hover{background:rgba(0,255,209,.12)}
        .card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:20px;transition:all .3s}
        .card:hover{background:rgba(255,255,255,.05);border-color:rgba(0,255,209,.25);transform:translateY(-3px)}
        .tag{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:100px;background:rgba(0,255,209,.08);border:1px solid rgba(0,255,209,.2);font-size:12px;font-weight:700;color:#00FFD1}
        .ldot{width:7px;height:7px;border-radius:50%;background:#00FFD1;flex-shrink:0;position:relative}
        .ldot::after{content:'';position:absolute;inset:-4px;border-radius:50%;background:rgba(0,255,209,.3);animation:rp 1.8s infinite}
        .chip{display:inline-flex;align-items:center;gap:7px;padding:9px 16px;border-radius:100px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);font-size:12px;font-weight:600;color:rgba(232,244,255,.7);white-space:nowrap;transition:all .2s;text-decoration:none}
        .chip:hover{background:rgba(0,255,209,.08);border-color:rgba(0,255,209,.25);color:#00FFD1}
        .step-num{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#00C9A7,#0B6FCC);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;box-shadow:0 0 20px rgba(0,201,167,.4)}
        .faq-item{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:14px;margin-bottom:10px;overflow:hidden;transition:all .3s}
        .faq-item:hover{border-color:rgba(0,255,209,.2)}
        .fl{color:rgba(232,244,255,.4);font-size:13px;text-decoration:none;transition:color .2s;display:block;margin-bottom:8px}
        .fl:hover{color:#00FFD1}
        .orb{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;z-index:0}
        .testi{background:linear-gradient(135deg,rgba(255,255,255,.04),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:20px}
        .pcard{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:22px;position:relative;transition:all .3s}
        .pcard.pop{background:linear-gradient(135deg,rgba(0,201,167,.1),rgba(11,111,204,.12));border-color:rgba(0,255,209,.35);box-shadow:0 0 40px rgba(0,255,209,.1)}
        @media(max-width:600px){.hide-mob{display:none!important}.grid2{grid-template-columns:1fr!important}.grid4{grid-template-columns:1fr 1fr!important}.grid3{grid-template-columns:1fr!important}}
      `}</style>

      {/* HEADER */}
      <header style={{position:"sticky",top:0,zIndex:100,padding:"14px 24px",background:scrolled?"rgba(2,13,26,.97)":"transparent",backdropFilter:scrolled?"blur(24px)":"none",borderBottom:scrolled?"1px solid rgba(255,255,255,.07)":"none",transition:"all .4s",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#00C9A7,#0B6FCC)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>💊</div>
          <span style={{fontWeight:900,fontSize:20}} className="shine">DigiDoc</span>
        </div>
        <nav style={{display:"flex",alignItems:"center",gap:8}}>
          <a href="#features" style={{color:"rgba(232,244,255,.6)",fontSize:13,fontWeight:600,textDecoration:"none",padding:"6px 12px"}} className="hide-mob">Features</a>
          <a href="#how"      style={{color:"rgba(232,244,255,.6)",fontSize:13,fontWeight:600,textDecoration:"none",padding:"6px 12px"}} className="hide-mob">How it works</a>
          <a href="#pricing"  style={{color:"rgba(232,244,255,.6)",fontSize:13,fontWeight:600,textDecoration:"none",padding:"6px 12px"}} className="hide-mob">Pricing</a>
          <a href="/register-doctor" className="btn-o" style={{padding:"8px 14px",fontSize:12}}>For Doctors</a>
          <a href="/login"            className="btn-p" style={{padding:"9px 18px",fontSize:13}}>Login →</a>
        </nav>
      </header>

      {/* HERO */}
      <section style={{position:"relative",padding:"70px 24px 80px",textAlign:"center",overflow:"hidden"}}>
        <div className="orb" style={{width:600,height:600,background:"rgba(0,201,167,.07)",top:-250,left:"50%",transform:"translateX(-50%)"}}/>
        <div className="orb" style={{width:300,height:300,background:"rgba(11,111,204,.1)",bottom:-100,right:-50}}/>
        <div style={{position:"relative",zIndex:1,maxWidth:620,margin:"0 auto"}}>
          <div className="tag" style={{marginBottom:22}}><span className="ldot"/>Doctors Available 24/7</div>
          <h1 style={{fontSize:40,fontWeight:900,lineHeight:1.15,marginBottom:20}}>
            India ka Sabse<br/><span className="shine">Trusted</span><br/>Telemedicine Platform
          </h1>
          <p style={{fontSize:15,color:"rgba(232,244,255,.55)",lineHeight:1.85,marginBottom:32,maxWidth:480,margin:"0 auto 32px"}}>
            Ghar baithe verified doctors se live video call pe consult karo. E-prescription pao aur medicines ghar pe mangao. Sirf ₹299 se shuru.
          </p>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginBottom:36}}>
            <a href="/login"            className="btn-p">🩺 Free Consultation Book Karo</a>
            <a href="/register-doctor"  className="btn-o">👨‍⚕️ Doctor ke roop mein Join Karo</a>
          </div>
          <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
            {["🔒 100% Secure","✅ MCI Verified","⚡ 2 Min Connect","💯 Money Back"].map(b=>(
              <span key={b} style={{fontSize:11,color:"rgba(232,244,255,.4)",fontWeight:600}}>{b}</span>
            ))}
          </div>
        </div>
        {/* Doctor preview cards */}
        <div style={{position:"relative",zIndex:1,maxWidth:480,margin:"48px auto 0",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {[{name:"Dr. Priya Sharma",spec:"General Physician",r:"4.9",ic:"👩‍⚕️",on:true},{name:"Dr. Arjun Mehta",spec:"Cardiologist",r:"4.8",ic:"👨‍⚕️",on:true},{name:"Dr. Sneha Rao",spec:"Dermatologist",r:"4.7",ic:"👩‍⚕️",on:false}].map(d=>(
            <div key={d.name} className="card" style={{padding:14,textAlign:"center"}}>
              <div style={{width:44,height:44,borderRadius:"50%",background:"rgba(0,255,209,.1)",border:"2px solid rgba(0,255,209,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 8px",position:"relative"}}>
                {d.ic}
                {d.on&&<span style={{position:"absolute",bottom:0,right:0,width:10,height:10,borderRadius:"50%",background:"#00FFD1",border:"2px solid #020D1A"}}/>}
              </div>
              <p style={{fontWeight:700,fontSize:9,color:"#E8F4FF",marginBottom:2}}>{d.name}</p>
              <p style={{fontSize:9,color:"rgba(232,244,255,.4)"}}>{d.spec}</p>
              <p style={{fontSize:10,color:"#FFB347",marginTop:3}}>⭐ {d.r}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{padding:"0 24px 60px"}}>
        <div style={{maxWidth:800,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}} className="grid4">
          {[{n:"500+",l:"Verified Doctors",c:"#00FFD1",ic:"🩺"},{n:"10K+",l:"Happy Patients",c:"#4DB8FF",ic:"👥"},{n:"4.9★",l:"Avg Rating",c:"#FFB347",ic:"⭐"},{n:"99%",l:"Satisfaction",c:"#A78BFA",ic:"💯"}].map(s=>(
            <div key={s.l} style={{textAlign:"center",padding:"18px 10px",borderRadius:18,background:`${s.c}10`,border:`1px solid ${s.c}22`}}>
              <p style={{fontSize:22,marginBottom:4}}>{s.ic}</p>
              <p style={{fontWeight:900,fontSize:22,color:s.c}}>{s.n}</p>
              <p style={{fontSize:10,color:"rgba(232,244,255,.4)",marginTop:3,lineHeight:1.4}}>{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{padding:"60px 24px",background:"rgba(255,255,255,.01)"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:40}}>
            <div className="tag" style={{marginBottom:12}}>Simple Process</div>
            <h2 style={{fontSize:28,fontWeight:900,marginBottom:10}}>Kaise Kaam Karta Hai <span className="shine2">DigiDoc?</span></h2>
            <p style={{color:"rgba(232,244,255,.45)",fontSize:14,lineHeight:1.7}}>Sirf 2 minute mein doctor se connect ho jao</p>
          </div>
          <div style={{position:"relative"}}>
            {[{ic:"📱",t:"Register Karo",d:"Mobile number se signup karo. OTP verify karo. Poora ek minute nahi lagega."},{ic:"🩺",t:"Doctor Chuno",d:"Apni bimari ke according specialty choose karo. Saare doctors online hain."},{ic:"📹",t:"Video Call Karo",d:"Ek tap mein doctor se live video ya audio call pe connect ho jao."},{ic:"💊",t:"Prescription Pao",d:"Doctor digital prescription bhejega seedha aapke phone pe instantly."},{ic:"🏠",t:"Medicines Order Karo",d:"Prescription ke saath medicines order karo. Ghar pe delivery milegi."},{ic:"✅",t:"Swasth Raho",d:"Follow-up calls free hain. Aapki health hamesha hamare saath safe hai."}].map((s,i)=>(
              <div key={i} style={{display:"flex",gap:16,alignItems:"flex-start",marginBottom:28,position:"relative"}}>
                {i<5&&<div style={{position:"absolute",left:19,top:44,bottom:-10,width:2,background:"linear-gradient(to bottom,rgba(0,255,209,.3),rgba(0,255,209,0))"}}/>}
                <div className="step-num">{s.ic}</div>
                <div style={{flex:1,paddingTop:4}}>
                  <p style={{fontWeight:800,fontSize:15,color:"#E8F4FF",marginBottom:4}}>{s.t}</p>
                  <p style={{color:"rgba(232,244,255,.5)",fontSize:13,lineHeight:1.7}}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{padding:"60px 24px"}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:36}}>
            <div className="tag" style={{marginBottom:12}}>Why DigiDoc</div>
            <h2 style={{fontSize:28,fontWeight:900,marginBottom:8}}>Kyun Chunte Hain Log <span className="shine2">DigiDoc?</span></h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}} className="grid2">
            {[{ic:"📹",t:"Live HD Video Call",d:"Crystal clear video calls on any network. Doctor aapka chehra dekh ke diagnose karta hai."},{ic:"🩺",t:"Verified Doctors Only",d:"Har doctor MCI registered aur background verified hai. Fake doctors ka koi chance nahi."},{ic:"💊",t:"Digital Prescription",d:"Valid e-prescription instantly phone pe. Kisi bhi registered chemist pe use karo."},{ic:"🚀",t:"2 Min Connect",d:"Average wait sirf 2 minutes. Emergency mein bhi doctor available rahega."},{ic:"🔒",t:"100% Private & Secure",d:"End-to-end encrypted calls. Data kabhi share nahi hoga. HIPAA compliant."},{ic:"💰",t:"Affordable Pricing",d:"₹299 se shuru. Koi hidden charges nahi. Consultation ke baad pay karo."},{ic:"📱",t:"Koi bhi Device pe Chalaye",d:"Mobile, tablet, laptop — browser pe kaam karta hai. App download ki zaroorat nahi."},{ic:"⚡",t:"24/7 Available",d:"Raat ke 3 baje bhi doctor available. Sundays aur holidays pe bhi."},{ic:"🏥",t:"12+ Specialties",d:"General Physician se Cardiologist tak, Dermatologist se Pediatrician tak sab available."},{ic:"📋",t:"Medical Records",d:"Saari prescriptions aur consultation history ek jagah. Kabhi bhi access karo."},{ic:"🚚",t:"Medicine Delivery",d:"Prescription ke baad seedha medicines order karo. 24-48 hrs mein delivery milegi."},{ic:"🌟",t:"Free Follow-up",d:"Consultation ke 24 ghante baad follow-up call bilkul free hai."}].map(f=>(
              <div key={f.t} className="card" style={{padding:18}}>
                <span style={{fontSize:28,display:"block",marginBottom:10}}>{f.ic}</span>
                <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF",marginBottom:5}}>{f.t}</p>
                <p style={{color:"rgba(232,244,255,.45)",fontSize:12,lineHeight:1.6}}>{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPECIALTIES */}
      <section style={{padding:"60px 0",background:"rgba(255,255,255,.01)"}}>
        <div style={{maxWidth:800,margin:"0 auto",padding:"0 24px"}}>
          <div style={{textAlign:"center",marginBottom:28}}>
            <div className="tag" style={{marginBottom:12}}>12+ Specialties</div>
            <h2 style={{fontSize:28,fontWeight:900}}>Kaunsi <span className="shine2">Specialty</span> Chahiye?</h2>
          </div>
        </div>
        <div style={{display:"flex",gap:10,overflowX:"auto",padding:"0 24px 12px",WebkitOverflowScrolling:"touch"}}>
          {[{ic:"🫀",l:"Cardiology"},{ic:"🧠",l:"Neurology"},{ic:"🦴",l:"Orthopedics"},{ic:"👁️",l:"Ophthalmology"},{ic:"👶",l:"Pediatrics"},{ic:"🦷",l:"Dental"},{ic:"🧬",l:"Dermatology"},{ic:"💊",l:"General"},{ic:"🤰",l:"Gynecology"},{ic:"🫁",l:"Pulmonology"},{ic:"🧪",l:"Pathology"},{ic:"🏋️",l:"Sports Med"},{ic:"🧓",l:"Geriatrics"},{ic:"🧠",l:"Psychiatry"},{ic:"🦻",l:"ENT"}].map(s=>(
            <a key={s.l} href="/login" className="chip" style={{flexShrink:0}}>
              <span style={{fontSize:16}}>{s.ic}</span>{s.l}
            </a>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{padding:"60px 24px"}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:36}}>
            <div className="tag" style={{marginBottom:12}}>Real Reviews</div>
            <h2 style={{fontSize:28,fontWeight:900}}>Logon Ka <span className="shine2">Experience</span></h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}} className="grid2">
            {[{name:"Rahul Verma",city:"Mumbai",t:"Raat 2 baje fever tha, doctor ne 5 min mein call ki aur prescription di. Kamaal hai! Pehle emergency pe jaata tha."},{name:"Priya Singh",city:"Delhi",t:"Pregnancy mein doctor ke paas jaana mushkil tha. DigiDoc ne bahut help ki. Gynecologist se ghar pe baat ki."},{name:"Amit Kumar",city:"Bangalore",t:"Cardiologist se ghar pe appointment lena impossible tha. DigiDoc pe instantly call kiya. Amazing service!"},{name:"Sunita Devi",city:"Jaipur",t:"Bache ko raat ko doctor dikhana tha. DigiDoc pe pediatrician se seedha baat ki. Highly recommend!"}].map(t=>(
              <div key={t.name} className="testi">
                <div style={{display:"flex",gap:3,marginBottom:10}}>
                  {Array(5).fill(0).map((_,i)=><span key={i} style={{color:"#FFB347",fontSize:13}}>★</span>)}
                </div>
                <p style={{color:"rgba(232,244,255,.65)",fontSize:12,lineHeight:1.7,marginBottom:12,fontStyle:"italic"}}>"{t.t}"</p>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#00C9A7,#0B6FCC)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#fff"}}>{t.name[0]}</div>
                  <div>
                    <p style={{fontWeight:700,fontSize:12,color:"#E8F4FF"}}>{t.name}</p>
                    <p style={{fontSize:10,color:"rgba(232,244,255,.35)"}}>{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{padding:"60px 24px",background:"rgba(255,255,255,.01)"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:36}}>
            <div className="tag" style={{marginBottom:12}}>Transparent Pricing</div>
            <h2 style={{fontSize:28,fontWeight:900,marginBottom:8}}>Simple <span className="shine2">Pricing</span></h2>
            <p style={{color:"rgba(232,244,255,.45)",fontSize:14}}>Koi hidden charges nahi. Jo dikhta hai wahi lagta hai.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}} className="grid3">
            {[{name:"Basic",price:"₹299",per:"per consult",ic:"💊",features:["General Physician","15 min call","Digital Prescription","Chat Support"],pop:false},{name:"Standard",price:"₹499",per:"per consult",ic:"🩺",features:["Specialist Doctor","30 min call","Digital Prescription","Free Follow-up","Priority Queue"],pop:true},{name:"Family",price:"₹999",per:"per month",ic:"👨‍👩‍👧",features:["Unlimited Consults","All Specialties","4 Family Members","Medicine Discounts","24/7 Priority"],pop:false}].map(p=>(
              <div key={p.name} className={`pcard${p.pop?" pop":""}`}>
                {p.pop&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",padding:"3px 14px",borderRadius:100,background:"linear-gradient(135deg,#00C9A7,#0B6FCC)",fontSize:10,fontWeight:700,color:"#fff",whiteSpace:"nowrap"}}>Most Popular</div>}
                <span style={{fontSize:28,display:"block",marginBottom:10}}>{p.ic}</span>
                <p style={{fontWeight:800,fontSize:13,color:"#E8F4FF",marginBottom:4}}>{p.name}</p>
                <p style={{fontWeight:900,fontSize:24,color:p.pop?"#00FFD1":"#E8F4FF"}}>{p.price}</p>
                <p style={{fontSize:10,color:"rgba(232,244,255,.35)",marginBottom:14}}>{p.per}</p>
                {p.features.map(f=>(<p key={f} style={{color:"rgba(232,244,255,.55)",fontSize:11,marginBottom:6}}><span style={{color:"#00FFD1",marginRight:6}}>✓</span>{f}</p>))}
                <a href="/login" className={p.pop?"btn-p":"btn-o"} style={{display:"flex",marginTop:14,padding:"11px",fontSize:12}}>Book Now</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOR DOCTORS */}
      <section style={{padding:"60px 24px"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <div style={{background:"linear-gradient(135deg,rgba(77,184,255,.1),rgba(11,111,204,.15))",border:"1px solid rgba(77,184,255,.25)",borderRadius:24,padding:"32px 24px"}}>
            <div className="tag" style={{marginBottom:16,background:"rgba(77,184,255,.1)",borderColor:"rgba(77,184,255,.25)",color:"#4DB8FF"}}>For Doctors</div>
            <h2 style={{fontSize:24,fontWeight:900,marginBottom:16}}>Ghar Se Karo<br/><span className="shine2">₹30K–₹1.5L/Month</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:24}} className="grid2">
              {[{ic:"💰",t:"High Earnings",d:"Apni fee khud set karo. ₹299–₹999 per consult"},{ic:"🕐",t:"Flexible Hours",d:"Jab chaaho kaam karo. Part-time ya full-time"},{ic:"⚡",t:"Instant Patients",d:"Approval ke baad immediately patients milenge"},{ic:"💳",t:"Fast Payouts",d:"Weekly payout seedha bank account mein"},{ic:"🛡️",t:"MCI Compliant",d:"Govt. Telemedicine Guidelines 2020 follow karte hain"},{ic:"📱",t:"Easy Platform",d:"Simple dashboard. Koi technical knowledge nahi chahiye"}].map(b=>(
                <div key={b.t} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <span style={{fontSize:20,flexShrink:0}}>{b.ic}</span>
                  <div><p style={{fontWeight:700,fontSize:13,color:"#E8F4FF"}}>{b.t}</p><p style={{fontSize:11,color:"rgba(232,244,255,.45)",marginTop:2}}>{b.d}</p></div>
                </div>
              ))}
            </div>
            <a href="/register-doctor" className="btn-p" style={{display:"inline-flex"}}>👨‍⚕️ Doctor ke roop mein Apply Karo →</a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{padding:"60px 24px",background:"rgba(255,255,255,.01)"}}>
        <div style={{maxWidth:700,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:36}}>
            <div className="tag" style={{marginBottom:12}}>FAQ</div>
            <h2 style={{fontSize:28,fontWeight:900}}>Aksar Pooche Jaane Wale <span className="shine2">Sawaal</span></h2>
          </div>
          {[{q:"Kya DigiDoc ke doctors verified hain?",a:"Haan. Har doctor MCI (Medical Council of India) registration ke saath verify kiya jata hai. Fake doctors ka koi chance nahi hai."},{q:"Meri health information safe rahegi?",a:"100%. Saari consultations end-to-end encrypted hain. Aapka data kabhi bhi kisi third party ke saath share nahi kiya jata."},{q:"Ek consultation kitne ka hai?",a:"General physician ke liye ₹299 se shuru. Specialist ₹499 se. Fee doctor ke profile pe clearly show hoti hai — koi hidden charges nahi."},{q:"Agar doctor call accept nahi karta toh?",a:"5 minute mein doctor join nahi kiya toh full refund milega. No questions asked."},{q:"Kya yeh India mein legal hai?",a:"Bilkul. DigiDoc Government of India ki Telemedicine Practice Guidelines 2020 ke according fully compliant hai."},{q:"Prescription valid hai kya?",a:"Haan. DigiDoc ki e-prescriptions legally valid hain. Kisi bhi registered pharmacy pe use kar sakte ho."},{q:"Internet slow hai toh kya audio call ho sakta hai?",a:"Bilkul! Video nahi banta toh audio call ka option hai. Low bandwidth pe bhi achhe se kaam karta hai."},{q:"Kya family ke liye bhi use kar sakte hain?",a:"Haan! Family plan mein 4 members ke liye unlimited consultations milti hain sirf ₹999/month mein."}].map((f,i)=>(
            <details key={i} className="faq-item">
              <summary style={{padding:"16px 20px",fontWeight:700,fontSize:14,color:"#E8F4FF",cursor:"pointer",listStyle:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                {f.q}<span style={{color:"#00FFD1",fontSize:20,flexShrink:0,marginLeft:12}}>+</span>
              </summary>
              <p style={{padding:"0 20px 16px",color:"rgba(232,244,255,.55)",fontSize:13,lineHeight:1.7}}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"60px 24px"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <div style={{background:"linear-gradient(135deg,rgba(0,201,167,.12),rgba(11,111,204,.18))",border:"1px solid rgba(0,255,209,.25)",borderRadius:28,padding:"44px 28px",textAlign:"center",position:"relative",overflow:"hidden"}}>
            <div className="orb" style={{width:300,height:300,background:"rgba(0,255,209,.06)",top:-150,left:"50%",transform:"translateX(-50%)"}}/>
            <div style={{position:"relative",zIndex:1}}>
              <div style={{fontSize:48,marginBottom:16}}>🚀</div>
              <h2 style={{fontSize:28,fontWeight:900,marginBottom:12}}>Aaj Hi Shuru Karo!</h2>
              <p style={{color:"rgba(232,244,255,.5)",fontSize:14,lineHeight:1.8,marginBottom:28}}>Pehli consultation bilkul free hai.<br/>No credit card. No subscription. Register karo aur doctor se baat karo.</p>
              <a href="/login" className="btn-p" style={{display:"inline-flex",padding:"16px 36px",fontSize:16}}>🩺 Free Mein Start Karo</a>
              <p style={{color:"rgba(232,244,255,.3)",fontSize:11,marginTop:14}}>10,000+ patients already use kar rahe hain DigiDoc ko</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:"48px 24px 32px",borderTop:"1px solid rgba(255,255,255,.07)"}}>
        <div style={{maxWidth:800,margin:"0 auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:28,marginBottom:36}} className="grid2">
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#00C9A7,#0B6FCC)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>💊</div>
                <span style={{fontWeight:900,fontSize:18}} className="shine">DigiDoc</span>
              </div>
              <p style={{color:"rgba(232,244,255,.4)",fontSize:12,lineHeight:1.7,maxWidth:220,marginBottom:12}}>India ka sabse trusted telemedicine platform. Ghar baithe doctor se milo.</p>
              <p style={{color:"rgba(232,244,255,.3)",fontSize:12}}>🌐 pmcare.org</p>
              <p style={{color:"rgba(232,244,255,.3)",fontSize:12,marginTop:4}}>📧 support@pmcare.org</p>
              <p style={{color:"rgba(232,244,255,.3)",fontSize:12,marginTop:4}}>📱 +91 99999 99999</p>
            </div>
            <div>
              <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF",marginBottom:14}}>Patients</p>
              {[["Consult Doctor","/login"],["Find Specialist","/login"],["Order Medicines","/login"],["My Records","/dashboard"],["Prescriptions","/dashboard"]].map(([l,h])=>(<a key={l} href={h} className="fl">{l}</a>))}
            </div>
            <div>
              <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF",marginBottom:14}}>Doctors</p>
              {[["Join DigiDoc","/register-doctor"],["Doctor Login","/login"],["My Dashboard","/doctor/dashboard"],["Earnings","/doctor/dashboard"],["Support","/support"]].map(([l,h])=>(<a key={l} href={h} className="fl">{l}</a>))}
            </div>
            <div>
              <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF",marginBottom:14}}>Company</p>
              {[["About Us","/about"],["Privacy Policy","/privacy"],["Terms of Service","/terms"],["Contact Us","/support"],["Admin Login","/admin/login"]].map(([l,h])=>(<a key={l} href={h} className="fl">{l}</a>))}
            </div>
          </div>
          <div style={{borderTop:"1px solid rgba(255,255,255,.06)",paddingTop:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
            <p style={{color:"rgba(232,244,255,.25)",fontSize:12}}>© 2026 DigiDoc (pmcare.org) · All rights reserved</p>
            <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
              {["🏥 NABH Compliant","🔒 SSL Secured","📋 MCI Registered","⚖️ Govt. Compliant"].map(b=>(<span key={b} style={{color:"rgba(232,244,255,.25)",fontSize:10,fontWeight:600}}>{b}</span>))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
