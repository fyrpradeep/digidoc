"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const getToken = () => localStorage.getItem("digidoc_token") || localStorage.getItem("dg_token") || "";

function ls(key: string, fb: any) { try { const v=localStorage.getItem(key); return v?JSON.parse(v):fb; } catch { return fb; } }
function setLs(key: string, v: any) { try { localStorage.setItem(key,JSON.stringify(v)); } catch {} }

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}html,body{height:100%;overflow:hidden}
  @keyframes sh{0%{background-position:-200% center}to{background-position:200% center}}
  @keyframes rp{0%{transform:scale(.8);opacity:1}to{transform:scale(2.2);opacity:0}}
  @keyframes su{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fi{from{opacity:0}to{opacity:1}}
  @keyframes sp{to{transform:rotate(360deg)}}
  .sh{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:sh 3s linear infinite}
  .gc{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:14px;margin-bottom:11px}
  .bm{display:flex;align-items:center;justify-content:center;gap:7px;padding:9px 14px;border-radius:11px;font-weight:700;font-size:12px;color:#fff;border:none;cursor:pointer;background:linear-gradient(135deg,#00C9A7,#0B6FCC);font-family:inherit}
  .br{display:flex;align-items:center;justify-content:center;gap:7px;padding:8px 13px;border-radius:11px;font-weight:600;font-size:11px;color:#FF6B6B;border:1px solid rgba(255,107,107,.22);background:rgba(255,107,107,.06);cursor:pointer;font-family:inherit}
  .bg{display:flex;align-items:center;justify-content:center;gap:7px;padding:8px 13px;border-radius:11px;font-weight:600;font-size:11px;color:#00FFD1;border:1px solid rgba(0,255,209,.22);background:rgba(0,255,209,.05);cursor:pointer;font-family:inherit}
  .by{display:flex;align-items:center;justify-content:center;gap:7px;padding:8px 13px;border-radius:11px;font-weight:600;font-size:11px;color:#FFB347;border:1px solid rgba(255,179,71,.22);background:rgba(255,179,71,.06);cursor:pointer;font-family:inherit}
  .badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:100px;font-size:10px;font-weight:700}
  .ni{display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 0;cursor:pointer;border:none;background:none;font-family:inherit;flex:1;border-top:2px solid transparent}
  .ni.on{border-top-color:#00FFD1}
  .dot{width:7px;height:7px;border-radius:50%;background:#00FFD1;display:inline-block;position:relative}
  .dot::after{content:'';position:absolute;inset:-3px;border-radius:50%;background:rgba(0,255,209,.3);animation:rp 1.8s infinite}
  .inp{width:100%;padding:10px 12px;border-radius:11px;font-size:12px;outline:none;font-family:inherit;background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.09);color:#E8F4FF;transition:all .3s}
  .inp::placeholder{color:rgba(232,244,255,.28)}.inp:focus{border-color:rgba(0,255,209,.4)}
  select.inp option{background:#0D1B35;color:#E8F4FF}
  .modal-bg{position:fixed;inset:0;background:rgba(2,13,26,.88);backdrop-filter:blur(8px);z-index:100;display:flex;align-items:flex-end;justify-content:center;animation:fi .2s ease}
  .modal{background:#0D1B35;border:1px solid rgba(0,255,209,.15);border-radius:24px 24px 0 0;padding:22px 20px 30px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto}
  .modal::-webkit-scrollbar{display:none}
  .ns::-webkit-scrollbar{display:none}.ns{-ms-overflow-style:none;scrollbar-width:none}
  .sp{width:18px;height:18px;border:2.5px solid rgba(255,255,255,.2);border-top-color:#00FFD1;border-radius:50%;animation:sp .8s linear infinite}
`;

type Tab = "overview"|"doctors"|"orders"|"medicines"|"patients";
const CATS = ["Fever","Antibiotics","Allergy","Vitamins","Pain Relief","Digestive","Heart","Diabetes","Skin"];
const EMMED = {name:"",brand:"",cat:"Fever",price:"",mrp:"",stock:"",rx:false};

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab]     = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);

  // Real data from API — persisted locally as cache
  const [doctors, setDoctors]   = useState<any[]>(() => ls("adm_doctors", []));
  const [pending, setPending]   = useState<any[]>(() => ls("adm_pending", []));
  const [patients, setPatients] = useState<any[]>(() => ls("adm_patients", []));
  const [orders, setOrders]     = useState<any[]>(() => ls("adm_orders", []));
  const [medicines, setMedicines] = useState<any[]>(() => ls("adm_meds", []));

  const [search, setSearch]       = useState("");
  const [orderFilter, setOF]      = useState("all");
  const [viewOrder, setViewOrder] = useState<any>(null);
  const [editMed, setEditMed]     = useState<any>(null);
  const [viewPatient, setViewPt]  = useState<any>(null);
  const [dispatchId, setDid]      = useState("");
  const [trackInput, setTrack]    = useState("");

  // Persist state
  useEffect(() => { setLs("adm_doctors", doctors); }, [doctors]);
  useEffect(() => { setLs("adm_pending", pending); }, [pending]);
  useEffect(() => { setLs("adm_patients", patients); }, [patients]);
  useEffect(() => { setLs("adm_orders", orders); }, [orders]);
  useEffect(() => { setLs("adm_meds", medicines); }, [medicines]);

  useEffect(() => { loadAll(); }, []);

  const h = { Authorization: `Bearer ${getToken()}` };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [dRes, ptRes, ordRes, medRes] = await Promise.all([
        fetch(`${API}/doctors`, {headers:h}).then(r=>r.ok?r.json():[]).catch(()=>[]),
        fetch(`${API}/patients`, {headers:h}).then(r=>r.ok?r.json():[]).catch(()=>[]),
        fetch(`${API}/orders`, {headers:h}).then(r=>r.ok?r.json():[]).catch(()=>[]),
        fetch(`${API}/medicines`, {headers:h}).then(r=>r.ok?r.json():[]).catch(()=>[]),
      ]);
      if (Array.isArray(dRes)) {
        setDoctors(dRes.filter((d:any) => d.status !== "pending"));
        setPending(dRes.filter((d:any) => d.status === "pending"));
      }
      if (Array.isArray(ptRes)) setPatients(ptRes);
      if (Array.isArray(ordRes)) setOrders(ordRes);
      if (Array.isArray(medRes)) setMedicines(medRes);
    } finally { setLoading(false); }
  };

  const approveDoctor = async (d: any) => {
    try { await fetch(`${API}/admin/approve-doctor/${d.id}`, {method:"POST",headers:h}); } catch {}
    setDoctors(p => [...p, {...d, status:"approved"}]);
    setPending(p => p.filter(x => x.id !== d.id));
  };

  const rejectDoctor = async (id: string) => {
    try { await fetch(`${API}/admin/reject-doctor/${id}`, {method:"POST",headers:h}); } catch {}
    setPending(p => p.filter(d => d.id !== id));
  };

  const toggleBlock = async (id: string, type: "doctor"|"patient") => {
    if (type==="doctor") {
      const d = doctors.find(x=>x.id===id);
      const ns = d?.status==="approved" ? "blocked" : "approved";
      try { await fetch(`${API}/admin/block-doctor/${id}`, {method:"POST",headers:{...h,"Content-Type":"application/json"},body:JSON.stringify({status:ns})}); } catch {}
      setDoctors(p => p.map(x => x.id===id ? {...x,status:ns,isOnline:ns==="blocked"?false:x.isOnline} : x));
    } else {
      const pt = patients.find(x=>x.id===id);
      const ns = (!pt?.status||pt?.status==="active") ? "blocked" : "active";
      try { await fetch(`${API}/admin/block-patient/${id}`, {method:"POST",headers:{...h,"Content-Type":"application/json"},body:JSON.stringify({status:ns})}); } catch {}
      setPatients(p => p.map(x => x.id===id ? {...x,status:ns} : x));
    }
  };

  const dispatchOrder = (id: string) => {
    const tr = trackInput || "DGD-TRK-"+Math.floor(10000+Math.random()*90000);
    setOrders(p => p.map(o => o.id===id ? {...o,status:"dispatched",tracking:tr} : o));
    setTrack(""); setDid("");
  };

  const deliverOrder = (id: string) => setOrders(p => p.map(o => o.id===id ? {...o,status:"delivered"} : o));

  const saveMed = () => {
    if (editMed?.isNew) setMedicines(p => [...p, {...editMed, id:Date.now(), price:+editMed.price, mrp:+editMed.mrp, stock:+editMed.stock}]);
    else setMedicines(p => p.map(m => m.id===editMed.id ? {...editMed} : m));
    setEditMed(null);
  };

  const printInvoice = (o: any) => {
    const w = window.open("","_blank"); if (!w) return;
    w.document.write(`<html><head><title>Invoice ${o.id}</title><style>body{font-family:Arial;padding:30px}h1{color:#0B6FCC}table{width:100%;border-collapse:collapse;margin:16px 0}th,td{border:1px solid #ddd;padding:8px}th{background:#f5f5f5}.tot{font-size:18px;font-weight:bold;color:#0B6FCC}</style></head><body>
    <h1>DigiDoc — Invoice</h1><p><b>Order:</b> ${o.id} &nbsp; <b>Date:</b> ${o.date||""}</p>
    <p><b>Patient:</b> ${o.patient||o.patientName||""} &nbsp; <b>Phone:</b> ${o.phone||o.patientMobile||""}</p>
    <table><tr><th>Medicine</th><th>Qty</th><th>Price</th></tr>${(o.items||[]).map((i:any)=>`<tr><td>${i.name}</td><td>${i.qty}</td><td>₹${i.price}</td></tr>`).join("")}</table>
    <p class="tot">Total: ₹${o.amount||o.total||0}</p><p><b>Status:</b> ${(o.status||"").toUpperCase()}</p></body></html>`);
    w.document.close(); w.print();
  };

  const sc = (s:string) => s==="delivered"?"#00FFD1":s==="dispatched"?"#FFB347":"#FF6B6B";
  const fp = patients.filter(p => (p.name||"").toLowerCase().includes(search.toLowerCase()) || (p.mobile||p.phone||"").includes(search));
  const fo = orders.filter(o => orderFilter==="all" || o.status===orderFilter);

  return (
    <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#E8F4FF"}}>
      <style>{S}</style>

      {/* HEADER */}
      <div style={{flexShrink:0,padding:"12px 18px 11px",background:"rgba(2,13,26,.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <p style={{color:"rgba(232,244,255,.4)",fontSize:10}}>Admin Panel</p>
            <h2 style={{fontSize:16,fontWeight:800}} className="sh">DigiDoc Control</h2>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>router.push("/pharma/login")} style={{padding:"6px 11px",borderRadius:10,background:"rgba(167,139,250,.1)",border:"1px solid rgba(167,139,250,.2)",color:"#A78BFA",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>💊 Pharma</button>
            {pending.length>0&&(<div style={{position:"relative"}}><button onClick={()=>setTab("doctors")} style={{width:34,height:34,borderRadius:10,background:"rgba(255,107,107,.1)",border:"1px solid rgba(255,107,107,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,cursor:"pointer"}}>🔔</button><div style={{position:"absolute",top:-3,right:-3,width:16,height:16,borderRadius:"50%",background:"#FF6B6B",border:"2px solid #020D1A",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,color:"#fff"}}>{pending.length}</div></div>)}
            <button onClick={()=>{localStorage.removeItem("digidoc_token");localStorage.removeItem("dg_token");window.location.href="/admin/login";}} style={{padding:"6px 11px",borderRadius:10,background:"rgba(255,107,107,.08)",border:"1px solid rgba(255,107,107,.18)",color:"#FF6B6B",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Exit</button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="ns" style={{flex:1,overflowY:"auto",padding:"0 18px"}}>

        {/* OVERVIEW */}
        {tab==="overview"&&(
          <div style={{paddingTop:14,paddingBottom:14,animation:"su .4s ease"}}>
            {loading&&<div style={{display:"flex",justifyContent:"center",padding:"20px 0"}}><span className="sp"/></div>}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:16}}>
              {[{n:patients.length,l:"Total Patients",c:"#00FFD1",ic:"👥"},{n:doctors.filter(d=>d.status==="approved").length,l:"Active Doctors",c:"#4DB8FF",ic:"🩺"},{n:pending.length,l:"Pending Approval",c:"#FF6B6B",ic:"⏳"},{n:orders.length,l:"Total Orders",c:"#A78BFA",ic:"📦"}].map(s=>(
                <div key={s.l} style={{borderRadius:15,padding:14,background:`${s.c}12`,border:`1px solid ${s.c}22`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                    <span style={{fontSize:22}}>{s.ic}</span>
                    <span style={{fontSize:18,fontWeight:900,color:s.c}}>{s.n}</span>
                  </div>
                  <p style={{color:"rgba(232,244,255,.45)",fontSize:10}}>{s.l}</p>
                </div>
              ))}
            </div>
            {pending.length>0&&(<div style={{background:"rgba(255,107,107,.06)",border:"1px solid rgba(255,107,107,.2)",borderRadius:13,padding:"12px 14px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{display:"flex",gap:9,alignItems:"center"}}>
                <span style={{fontSize:18}}>⚠️</span>
                <div><p style={{color:"#FF6B6B",fontWeight:700,fontSize:12}}>{pending.length} Doctor{pending.length>1?"s":""} Waiting Approval</p><p style={{color:"rgba(255,107,107,.6)",fontSize:10,marginTop:1}}>Review and approve/reject</p></div>
              </div>
              <button className="br" onClick={()=>setTab("doctors")} style={{padding:"6px 12px",fontSize:11}}>Review →</button>
            </div>)}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
              {(["doctors","orders","medicines","patients"] as Tab[]).map(t=>(
                <button key={t} onClick={()=>setTab(t)} style={{padding:"13px",borderRadius:13,background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:9}}>
                  <span style={{fontSize:20}}>{t==="doctors"?"🩺":t==="orders"?"📦":t==="medicines"?"💊":"👥"}</span>
                  <span style={{fontWeight:600,fontSize:12,color:"#E8F4FF",textTransform:"capitalize"}}>{t}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* DOCTORS */}
        {tab==="doctors"&&(
          <div style={{paddingTop:14,paddingBottom:14,animation:"su .4s ease"}}>
            {pending.length>0&&(<>
              <p style={{fontSize:10,fontWeight:700,color:"#FF6B6B",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>⏳ Pending Approval ({pending.length})</p>
              {pending.map((d:any)=>(
                <div key={d.id||d.mobile} style={{background:"rgba(255,107,107,.05)",border:"1px solid rgba(255,107,107,.18)",borderRadius:15,padding:14,marginBottom:10}}>
                  <div style={{marginBottom:10}}>
                    <p style={{fontWeight:700,fontSize:14,color:"#E8F4FF"}}>{d.name}</p>
                    <p style={{color:"#00FFD1",fontSize:11,fontWeight:600,marginTop:2}}>{d.specialty||"Doctor"}</p>
                    <p style={{color:"rgba(232,244,255,.35)",fontSize:10,marginTop:2}}>📱 +91 {d.mobile}</p>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button className="bm" style={{flex:1}} onClick={()=>approveDoctor(d)}>✅ Approve</button>
                    <button className="br"  style={{flex:1}} onClick={()=>rejectDoctor(d.id||d.mobile)}>❌ Reject</button>
                  </div>
                </div>
              ))}
            </>)}
            <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:10,marginTop:pending.length>0?12:0}}>Active Doctors</p>
            {loading&&<div style={{display:"flex",justifyContent:"center",padding:"20px"}}><span className="sp"/></div>}
            {!loading&&doctors.length===0&&<div style={{textAlign:"center",padding:"32px 20px"}}><p style={{fontSize:36,marginBottom:8}}>🩺</p><p style={{color:"rgba(232,244,255,.38)",fontSize:13}}>No approved doctors yet</p></div>}
            {doctors.map((d:any)=>(
              <div key={d.id} className="gc">
                <div style={{display:"flex",gap:11,alignItems:"flex-start",marginBottom:10}}>
                  <div style={{width:44,height:44,borderRadius:13,background:"rgba(0,255,209,.07)",border:"1px solid rgba(0,255,209,.14)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>👨‍⚕️</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                      <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF"}}>{d.name}</p>
                      {d.isOnline&&d.status==="approved"&&<span className="dot"/>}
                      <span className="badge" style={{background:d.status==="approved"?"rgba(0,255,209,.08)":"rgba(255,107,107,.1)",color:d.status==="approved"?"#00FFD1":"#FF6B6B"}}>{d.status}</span>
                    </div>
                    <p style={{color:"rgba(232,244,255,.4)",fontSize:10}}>{d.specialty||"Doctor"} · +91 {d.mobile}</p>
                  </div>
                </div>
                <button className={d.status==="approved"?"br":"bm"} style={{width:"100%"}} onClick={()=>toggleBlock(d.id,"doctor")}>
                  {d.status==="approved"?"🚫 Block Doctor":"✅ Unblock Doctor"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ORDERS */}
        {tab==="orders"&&(
          <div style={{paddingTop:14,paddingBottom:14,animation:"su .4s ease"}}>
            <div style={{display:"flex",gap:7,overflowX:"auto",marginBottom:14}} className="ns">
              {["all","pending","dispatched","delivered"].map(f=>(
                <button key={f} onClick={()=>setOF(f)} style={{padding:"5px 13px",borderRadius:100,flexShrink:0,cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:600,background:orderFilter===f?"linear-gradient(135deg,#00C9A7,#0B6FCC)":"rgba(255,255,255,.04)",color:orderFilter===f?"#fff":"rgba(232,244,255,.45)",border:orderFilter===f?"none":"1px solid rgba(255,255,255,.08)",textTransform:"capitalize"}}>
                  {f==="all"?`All (${orders.length})`:f==="pending"?`⏳ Pending (${orders.filter(o=>o.status==="pending").length})`:f==="dispatched"?"🚚 Dispatched":"✓ Delivered"}
                </button>
              ))}
            </div>
            {loading&&<div style={{display:"flex",justifyContent:"center",padding:"20px"}}><span className="sp"/></div>}
            {!loading&&fo.length===0&&<div style={{textAlign:"center",padding:"32px 20px"}}><p style={{fontSize:36,marginBottom:8}}>📦</p><p style={{color:"rgba(232,244,255,.38)",fontSize:13}}>No orders found</p></div>}
            {fo.map((o:any)=>(
              <div key={o.id} className="gc">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div>
                    <p style={{fontWeight:700,fontSize:14,color:"#E8F4FF"}}>{o.id}</p>
                    <p style={{color:"rgba(232,244,255,.4)",fontSize:11,marginTop:1}}>{o.patient||o.patientName} · {o.date||""}</p>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <p style={{color:"#00FFD1",fontWeight:800,fontSize:14}}>₹{o.amount||o.total||0}</p>
                    <span className="badge" style={{background:sc(o.status)+"18",color:sc(o.status)}}>{o.status==="pending"?"⏳ Pending":o.status==="dispatched"?"🚚 Dispatched":"✓ Delivered"}</span>
                  </div>
                </div>
                {o.status==="pending"&&(dispatchId===o.id?(
                  <div style={{display:"flex",gap:7,marginBottom:8}}>
                    <input className="inp" style={{flex:1}} placeholder="Tracking no. (optional)" value={trackInput} onChange={e=>setTrack(e.target.value)}/>
                    <button className="bm" onClick={()=>dispatchOrder(o.id)}>Dispatch</button>
                    <button className="br" style={{padding:"8px"}} onClick={()=>setDid("")}>✕</button>
                  </div>
                ):<button className="bm" style={{width:"100%",marginBottom:8}} onClick={()=>setDid(o.id)}>🚚 Mark Dispatched</button>)}
                {o.status==="dispatched"&&(<div style={{display:"flex",gap:7,marginBottom:8}}>
                  <div style={{flex:1,background:"rgba(255,179,71,.07)",border:"1px solid rgba(255,179,71,.18)",borderRadius:9,padding:"7px 11px"}}>
                    <p style={{color:"rgba(232,244,255,.4)",fontSize:9}}>Tracking</p>
                    <p style={{color:"#FFB347",fontWeight:700,fontSize:11}}>{o.tracking}</p>
                  </div>
                  <button className="bm" style={{flex:1}} onClick={()=>deliverOrder(o.id)}>✓ Delivered</button>
                </div>)}
                <div style={{display:"flex",gap:7}}>
                  <button className="bg" style={{flex:1}} onClick={()=>setViewOrder(o)}>👁 View</button>
                  <button className="by" style={{flex:1}} onClick={()=>printInvoice(o)}>🖨️ Invoice</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MEDICINES */}
        {tab==="medicines"&&(
          <div style={{paddingTop:14,paddingBottom:14,animation:"su .4s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h3 style={{fontSize:15,fontWeight:800}}>Medicines</h3>
              <button className="bm" onClick={()=>setEditMed({...EMMED,id:Date.now(),isNew:true})}>+ Add New</button>
            </div>
            {loading&&<div style={{display:"flex",justifyContent:"center",padding:"20px"}}><span className="sp"/></div>}
            {!loading&&medicines.length===0&&<div style={{textAlign:"center",padding:"32px 20px"}}><p style={{fontSize:36,marginBottom:8}}>💊</p><p style={{color:"rgba(232,244,255,.38)",fontSize:13}}>No medicines yet. Add your first.</p></div>}
            {medicines.map((m:any)=>(
              <div key={m.id} className="gc">
                <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                      <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF"}}>{m.name}</p>
                      {m.rx&&<span className="badge" style={{background:"rgba(255,107,107,.1)",color:"#FF6B6B"}}>Rx</span>}
                    </div>
                    <p style={{color:"rgba(232,244,255,.4)",fontSize:10}}>{m.brand} · {m.cat} · ₹{m.price}</p>
                    <p style={{color:m.stock===0?"#FF6B6B":m.stock<100?"#FFB347":"#00FFD1",fontSize:10,fontWeight:600,marginTop:2}}>
                      {m.stock===0?"Out of Stock":m.stock<100?`Low: ${m.stock}`:`Stock: ${m.stock}`}
                    </p>
                  </div>
                  <div style={{display:"flex",gap:6,flexDirection:"column"}}>
                    <button className="bg" style={{padding:"6px 10px",fontSize:10}} onClick={()=>setEditMed({...m,isNew:false})}>✏️ Edit</button>
                    <button className="br" style={{padding:"6px 10px",fontSize:10}} onClick={()=>setMedicines(p=>p.filter(x=>x.id!==m.id))}>🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PATIENTS */}
        {tab==="patients"&&(
          <div style={{paddingTop:14,paddingBottom:14,animation:"su .4s ease"}}>
            <div style={{position:"relative",marginBottom:14}}>
              <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:13}}>🔍</span>
              <input className="inp" style={{paddingLeft:32}} placeholder="Search by name or mobile..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            {loading&&<div style={{display:"flex",justifyContent:"center",padding:"20px"}}><span className="sp"/></div>}
            {!loading&&fp.length===0&&<div style={{textAlign:"center",padding:"32px 20px"}}><p style={{fontSize:36,marginBottom:8}}>👥</p><p style={{color:"rgba(232,244,255,.38)",fontSize:13}}>No patients found</p></div>}
            {fp.map((p:any)=>(
              <div key={p.id} className="gc">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div>
                    <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF",marginBottom:2}}>{p.name}</p>
                    <p style={{color:"rgba(232,244,255,.4)",fontSize:10}}>+91 {p.mobile||p.phone}</p>
                  </div>
                  <span className="badge" style={{background:(!p.status||p.status==="active")?"rgba(0,255,209,.08)":"rgba(255,107,107,.1)",color:(!p.status||p.status==="active")?"#00FFD1":"#FF6B6B"}}>{p.status||"active"}</span>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button className="bg" style={{flex:2}} onClick={()=>setViewPt(p)}>📋 Details</button>
                  <button className={(!p.status||p.status==="active")?"br":"bm"} style={{flex:1}} onClick={()=>toggleBlock(p.id,"patient")}>
                    {(!p.status||p.status==="active")?"🚫 Block":"✅ Unblock"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* NAV */}
      <div style={{flexShrink:0,display:"flex",background:"rgba(2,13,26,.97)",backdropFilter:"blur(24px)",borderTop:"1px solid rgba(255,255,255,.07)"}}>
        {(["overview","doctors","orders","medicines","patients"] as Tab[]).map(t=>(
          <button key={t} className={"ni"+(tab===t?" on":"")} onClick={()=>setTab(t)} style={{color:tab===t?"#00FFD1":"rgba(232,244,255,.3)",position:"relative"}}>
            {t==="doctors"&&pending.length>0&&<div style={{position:"absolute",top:5,right:"18%",width:7,height:7,borderRadius:"50%",background:"#FF6B6B"}}/>}
            <span style={{fontSize:17}}>{t==="overview"?"📊":t==="doctors"?"🩺":t==="orders"?"📦":t==="medicines"?"💊":"👥"}</span>
            <span style={{fontSize:8,fontWeight:tab===t?700:500,textTransform:"capitalize"}}>{t}</span>
          </button>
        ))}
      </div>

      {/* MODALS */}
      {viewOrder&&(<div className="modal-bg" onClick={()=>setViewOrder(null)}><div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><h3 style={{fontWeight:800,fontSize:15}}>{viewOrder.id}</h3><button onClick={()=>setViewOrder(null)} style={{background:"none",border:"none",color:"rgba(232,244,255,.4)",cursor:"pointer",fontSize:18}}>✕</button></div>
        <p style={{fontWeight:600,fontSize:13,color:"#E8F4FF",marginBottom:4}}>{viewOrder.patient||viewOrder.patientName}</p>
        <p style={{color:"rgba(232,244,255,.5)",fontSize:11,marginBottom:14}}>{viewOrder.address||""}</p>
        {(viewOrder.items||[]).map((i:any,idx:number)=>(<div key={idx} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,.05)"}}><p style={{color:"#E8F4FF",fontSize:12}}>{i.name} × {i.qty}</p><p style={{color:"#00FFD1",fontWeight:700,fontSize:12}}>₹{i.price}</p></div>))}
        <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:"1px solid rgba(255,255,255,.08)",marginTop:4}}><p style={{fontWeight:800,fontSize:14}}>Total</p><p style={{fontWeight:900,fontSize:16,color:"#00FFD1"}}>₹{viewOrder.amount||viewOrder.total||0}</p></div>
        <button className="bm" style={{width:"100%",marginTop:12}} onClick={()=>printInvoice(viewOrder)}>🖨️ Print Invoice</button>
      </div></div>)}

      {editMed&&(<div className="modal-bg" onClick={()=>setEditMed(null)}><div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><h3 style={{fontWeight:800,fontSize:15}}>{editMed.isNew?"Add Medicine":"Edit Medicine"}</h3><button onClick={()=>setEditMed(null)} style={{background:"none",border:"none",color:"rgba(232,244,255,.4)",cursor:"pointer",fontSize:18}}>✕</button></div>
        {[{k:"name",l:"Medicine Name",ph:"e.g. Paracetamol 500mg"},{k:"brand",l:"Brand",ph:"e.g. Calpol"},{k:"price",l:"Price (₹)",ph:"35",t:"number"},{k:"mrp",l:"MRP (₹)",ph:"42",t:"number"},{k:"stock",l:"Stock",ph:"500",t:"number"}].map(f=>(
          <div key={f.k} style={{marginBottom:11}}>
            <label style={{display:"block",fontSize:9,fontWeight:700,color:"rgba(232,244,255,.38)",textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>{f.l}</label>
            <input className="inp" type={f.t||"text"} placeholder={f.ph} value={(editMed as any)[f.k]||""} onChange={e=>setEditMed((p:any)=>({...p,[f.k]:e.target.value}))}/>
          </div>
        ))}
        <div style={{marginBottom:11}}>
          <label style={{display:"block",fontSize:9,fontWeight:700,color:"rgba(232,244,255,.38)",textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>Category</label>
          <select className="inp" value={editMed.cat} onChange={e=>setEditMed((p:any)=>({...p,cat:e.target.value}))}>
            {CATS.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <p style={{fontSize:13,fontWeight:600}}>Requires Prescription</p>
          <button onClick={()=>setEditMed((p:any)=>({...p,rx:!p.rx}))} style={{width:38,height:22,borderRadius:100,cursor:"pointer",position:"relative",border:"none",background:editMed.rx?"#00C9A7":"rgba(255,255,255,.1)",transition:"all .3s"}}>
            <div style={{position:"absolute",top:2,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"all .3s",left:editMed.rx?18:2}}/>
          </button>
        </div>
        <button className="bm" style={{width:"100%"}} onClick={saveMed}>{editMed.isNew?"➕ Add":"💾 Save"}</button>
      </div></div>)}

      {viewPatient&&(<div className="modal-bg" onClick={()=>setViewPt(null)}><div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><h3 style={{fontWeight:800,fontSize:15}}>{viewPatient.name}</h3><button onClick={()=>setViewPt(null)} style={{background:"none",border:"none",color:"rgba(232,244,255,.4)",cursor:"pointer",fontSize:18}}>✕</button></div>
        {[{l:"ID",v:viewPatient.id},{l:"Mobile",v:`+91 ${viewPatient.mobile||viewPatient.phone}`},{l:"Status",v:viewPatient.status||"active"},{l:"Joined",v:viewPatient.createdAt?new Date(viewPatient.createdAt).toLocaleDateString("en-IN"):"-"}].map(r=>(
          <div key={r.l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
            <p style={{color:"rgba(232,244,255,.4)",fontSize:12}}>{r.l}</p>
            <p style={{color:"#E8F4FF",fontSize:12,fontWeight:600}}>{r.v}</p>
          </div>
        ))}
      </div></div>)}
    </div>
  );
}
