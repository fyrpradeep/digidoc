"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const FAQS = [
  { q: "How do I consult a doctor?",           a: "Select your symptoms, our AI finds the right doctor, then start a video or audio call. You can also browse doctors directly from the dashboard." },
  { q: "How does OTP login work?",             a: "Enter your mobile number, receive a 6-digit OTP via SMS, verify it and you are logged in. No password needed — ever." },
  { q: "Are doctors verified?",               a: "Yes. Every doctor on DigiDoc is MCI-registered, background-checked, and manually verified by our admin team before being approved." },
  { q: "How do I get my prescription?",       a: "After consultation, your doctor writes the prescription digitally on the platform. It appears in your dashboard under Prescriptions instantly." },
  { q: "Can I order medicines from the app?", a: "Yes! After getting a prescription, tap 'Order Medicines' and your prescribed medicines are delivered to your doorstep." },
  { q: "What if I am not satisfied?",         a: "We have a full satisfaction guarantee. Contact us within 24 hours of consultation and we will arrange a free follow-up or full refund." },
  { q: "Is my health data private?",          a: "Absolutely. All your data is end-to-end encrypted. We are HIPAA compliant and your data is never sold or shared with third parties." },
  { q: "How much does a consultation cost?",  a: "Consultation fees vary by doctor and specialty — starting from ₹199 to ₹999. You see the exact fee before booking." },
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
  .faq{border-radius:15px;overflow:hidden;margin-bottom:10px;transition:all 0.3s;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.03)}
  .faq:hover{border-color:rgba(0,255,209,0.18)}
  .faq-q{width:100%;display:flex;align-items:center;justify-content:space-between;padding:14px 16px;background:none;border:none;cursor:pointer;font-family:inherit;text-align:left;gap:10px}
  .inp{width:100%;padding:12px 14px;border-radius:13px;font-family:inherit;font-size:13px;outline:none;transition:all 0.3s;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.09);color:#E8F4FF}
  .inp::placeholder{color:rgba(232,244,255,0.28)}
  .inp:focus{border-color:rgba(0,255,209,0.4);background:rgba(0,255,209,0.03);box-shadow:0 0 0 3px rgba(0,255,209,0.07)}
  .bm{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:14px;border-radius:14px;font-family:inherit;font-weight:800;font-size:14px;color:white;border:none;cursor:pointer;transition:all 0.3s;background:linear-gradient(135deg,#00C9A7,#0B6FCC);box-shadow:0 0 20px rgba(0,201,167,0.26)}
  .bm:hover{transform:translateY(-1px);box-shadow:0 0 30px rgba(0,201,167,0.4)}
  .bm:disabled{opacity:0.5;cursor:not-allowed;transform:none}
  .cc{border-radius:16px;padding:16px;cursor:pointer;transition:all 0.25s;display:flex;gap:14px;align-items:center;text-decoration:none}
  .cc:hover{transform:translateY(-2px)}
  .cc:active{transform:scale(0.97)}
  .loader{width:18px;height:18px;border:2.5px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
  .tab-btn{flex:1;padding:10px;border:none;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;transition:all 0.2s;border-bottom:2px solid transparent;background:none}
  .tab-btn.on{border-bottom-color:#00FFD1;color:#00FFD1}
`;

type Tab = "faq" | "contact" | "chat";

export default function SupportPage() {
  const router = useRouter();
  const [tab, setTab]         = useState<Tab>("faq");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [search, setSearch]   = useState("");
  const [form, setForm]       = useState({ subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);

  const filteredFaqs = FAQS.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  );

  const submit = () => {
    if (!form.subject.trim() || !form.message.trim()) return;
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); setForm({ subject: "", message: "" }); }, 1800);
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
      <div style={{flexShrink:0,padding:"13px 18px 0",background:"rgba(2,13,26,0.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <button onClick={()=>router.back()} style={{background:"none",border:"none",color:"#00FFD1",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>← Back</button>
          <h2 style={{flex:1,fontSize:16,fontWeight:800}}>Help & Support</h2>
        </div>
        <div style={{display:"flex"}}>
          {([["faq","❓ FAQ"],["contact","📧 Contact"],["chat","💬 Live Chat"]] as [Tab,string][]).map(([t,l])=>(
            <button key={t} className={"tab-btn"+(tab===t?" on":"")} onClick={()=>setTab(t)} style={{color:tab===t?"#00FFD1":"rgba(232,244,255,0.35)"}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{flex:1,overflowY:"auto",padding:"14px 18px"}} className="noscroll">

        {/* ── FAQ ── */}
        {tab === "faq" && (
          <div className="slide-up">
            <div style={{position:"relative",marginBottom:16}}>
              <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:14}}>🔍</span>
              <input className="inp" style={{paddingLeft:36}} placeholder="Search FAQs..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>

            {filteredFaqs.length === 0 ? (
              <div style={{textAlign:"center",padding:"40px 0"}}>
                <p style={{fontSize:36,marginBottom:10}}>🤷</p>
                <p style={{color:"rgba(232,244,255,0.4)",fontSize:13}}>No results found. Try a different search.</p>
              </div>
            ) : (
              filteredFaqs.map((f, i) => (
                <div key={i} className="faq">
                  <button className="faq-q" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                    <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF",flex:1,lineHeight:1.4}}>{f.q}</p>
                    <span style={{color:"#00FFD1",fontSize:16,flexShrink:0,transform:openFaq===i?"rotate(180deg)":"none",transition:"transform 0.3s"}}>⌄</span>
                  </button>
                  {openFaq === i && (
                    <div style={{padding:"0 16px 14px",animation:"slideUp 0.3s ease"}}>
                      <div style={{height:1,background:"rgba(255,255,255,0.06)",marginBottom:12}}/>
                      <p style={{color:"rgba(232,244,255,0.6)",fontSize:12,lineHeight:1.8}}>{f.a}</p>
                    </div>
                  )}
                </div>
              ))
            )}

            <div style={{marginTop:16,padding:"14px 16px",borderRadius:16,background:"rgba(0,255,209,0.05)",border:"1px solid rgba(0,255,209,0.14)",textAlign:"center"}}>
              <p style={{color:"rgba(232,244,255,0.55)",fontSize:12,marginBottom:8}}>Didn't find your answer?</p>
              <button onClick={()=>setTab("contact")} style={{padding:"7px 18px",borderRadius:100,background:"linear-gradient(135deg,#00C9A7,#0B6FCC)",color:"white",fontWeight:700,fontSize:12,border:"none",cursor:"pointer",fontFamily:"inherit"}}>
                Contact Us →
              </button>
            </div>
          </div>
        )}

        {/* ── CONTACT ── */}
        {tab === "contact" && (
          <div className="slide-up">

            {/* Contact channels */}
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
              {[
                { icon:"📧", label:"Email Support",    sub:"support@digidoc.com",         color:"#4DB8FF", bg:"rgba(77,184,255,0.08)",   bd:"rgba(77,184,255,0.18)"  },
                { icon:"📞", label:"Phone Support",    sub:"+91 1800-XXX-XXXX (9AM–9PM)", color:"#00FFD1", bg:"rgba(0,255,209,0.07)",   bd:"rgba(0,255,209,0.18)"  },
                { icon:"💬", label:"WhatsApp",         sub:"+91 9999-XXX-XXX",            color:"#34D399", bg:"rgba(52,211,153,0.08)",  bd:"rgba(52,211,153,0.18)" },
              ].map(c=>(
                <div key={c.label} className="cc" style={{background:c.bg,border:`1px solid ${c.bd}`}}>
                  <div style={{width:46,height:46,borderRadius:14,background:c.color+"18",border:`1px solid ${c.color}28`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{c.icon}</div>
                  <div>
                    <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF",marginBottom:2}}>{c.label}</p>
                    <p style={{color:c.color,fontSize:12,fontWeight:600}}>{c.sub}</p>
                  </div>
                  <span style={{marginLeft:"auto",color:c.color,fontSize:16,opacity:0.5}}>→</span>
                </div>
              ))}
            </div>

            {/* Ticket form */}
            <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:12}}>Send Us a Message</p>

            {sent ? (
              <div style={{textAlign:"center",padding:"32px 20px",background:"rgba(0,255,209,0.05)",border:"1px solid rgba(0,255,209,0.15)",borderRadius:16,animation:"slideUp 0.4s ease"}}>
                <p style={{fontSize:44,marginBottom:10}}>✅</p>
                <p style={{fontWeight:800,fontSize:16,color:"#E8F4FF",marginBottom:6}}>Message Sent!</p>
                <p style={{color:"rgba(232,244,255,0.45)",fontSize:12,lineHeight:1.7}}>Our team will respond to you within <strong style={{color:"#00FFD1"}}>24 hours</strong> on your registered email and mobile.</p>
                <button onClick={()=>setSent(false)} style={{marginTop:16,padding:"8px 20px",borderRadius:100,background:"rgba(0,255,209,0.08)",border:"1px solid rgba(0,255,209,0.2)",color:"#00FFD1",fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>Send Another</button>
              </div>
            ) : (
              <div>
                <div style={{marginBottom:12}}>
                  <label style={{display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:7}}>Subject</label>
                  <select className="inp" value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))} style={{cursor:"pointer"}}>
                    <option value="">Select a topic</option>
                    <option>Consultation Issue</option>
                    <option>Payment Problem</option>
                    <option>Medicine Order</option>
                    <option>Technical Issue</option>
                    <option>Doctor Complaint</option>
                    <option>Account Problem</option>
                    <option>Other</option>
                  </select>
                </div>
                <div style={{marginBottom:16}}>
                  <label style={{display:"block",fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1.2,marginBottom:7}}>Message</label>
                  <textarea className="inp" rows={5} placeholder="Describe your issue in detail..." value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} style={{resize:"none",lineHeight:1.6}}/>
                </div>
                <button className="bm" onClick={submit} disabled={sending||!form.subject||!form.message.trim()}>
                  {sending?<span className="loader"/>:"📤 Submit Ticket"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── LIVE CHAT ── */}
        {tab === "chat" && (
          <div className="slide-up" style={{textAlign:"center",padding:"24px 12px"}}>
            <div style={{width:80,height:80,borderRadius:24,background:"linear-gradient(135deg,rgba(0,201,167,0.18),rgba(11,111,204,0.18))",border:"1.5px solid rgba(0,255,209,0.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,margin:"0 auto 16px"}}>🤖</div>
            <h3 style={{fontSize:18,fontWeight:800,marginBottom:6}}>Live Chat Support</h3>
            <p style={{color:"rgba(232,244,255,0.45)",fontSize:13,lineHeight:1.8,marginBottom:6}}>Chat with our AI assistant instantly or wait for a human agent.</p>
            <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"5px 14px",borderRadius:100,background:"rgba(0,255,209,0.07)",border:"1px solid rgba(0,255,209,0.18)",marginBottom:24}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:"#00FFD1",display:"inline-block"}}/>
              <span style={{color:"#00FFD1",fontSize:11,fontWeight:700}}>AI Online · Human agents: 9AM–9PM</span>
            </div>

            <button className="bm" onClick={()=>router.push("/chat")} style={{marginBottom:12}}>
              🤖 Chat with AI Now — Instant
            </button>

            <div style={{display:"flex",gap:8,marginBottom:20}}>
              <div style={{flex:1,padding:"14px",borderRadius:14,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",textAlign:"center"}}>
                <p style={{fontSize:20,marginBottom:4}}>⚡</p>
                <p style={{fontWeight:700,fontSize:12,color:"#E8F4FF",marginBottom:2}}>AI Response</p>
                <p style={{color:"rgba(232,244,255,0.35)",fontSize:10}}>Instant, 24/7</p>
              </div>
              <div style={{flex:1,padding:"14px",borderRadius:14,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",textAlign:"center"}}>
                <p style={{fontSize:20,marginBottom:4}}>👤</p>
                <p style={{fontWeight:700,fontSize:12,color:"#E8F4FF",marginBottom:2}}>Human Agent</p>
                <p style={{color:"rgba(232,244,255,0.35)",fontSize:10}}>~5 min wait</p>
              </div>
            </div>

            <p style={{color:"rgba(232,244,255,0.3)",fontSize:11,lineHeight:1.7}}>
              For medical emergencies, please call <strong style={{color:"#FF6B6B"}}>112</strong> or visit your nearest hospital immediately.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
