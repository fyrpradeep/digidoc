"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Tab = "overview" | "doctors" | "orders" | "medicines" | "patients";

const DOCTORS = [
  { id:1, name:"Dr. Priya Sharma",  spec:"General Physician", online:true,  patients:1240, rating:4.9, joined:"Jan 2025", avatar:"👩‍⚕️", status:"approved", earnings:32100, pending:4788, phone:"+91 9876543210", docs:["MCI Certificate","Degree","Aadhaar"] },
  { id:2, name:"Dr. Arjun Mehta",   spec:"Cardiologist",      online:true,  patients:980,  rating:4.8, joined:"Feb 2025", avatar:"👨‍⚕️", status:"approved", earnings:58900, pending:8200, phone:"+91 9765432109", docs:["MCI Certificate","Degree","PAN"] },
  { id:3, name:"Dr. Sneha Rao",     spec:"Dermatologist",     online:false, patients:760,  rating:4.7, joined:"Mar 2025", avatar:"👩‍⚕️", status:"blocked",   earnings:21400, pending:0,    phone:"+91 9654321098", docs:["MCI Certificate","Degree"] },
  { id:4, name:"Dr. Rahul Gupta",   spec:"Neurologist",       online:true,  patients:1100, rating:4.9, joined:"Jan 2025", avatar:"👨‍⚕️", status:"approved", earnings:74200, pending:9100, phone:"+91 9543210987", docs:["MCI Certificate","Degree","Aadhaar","PAN"] },
];

const PENDING_DOCTORS = [
  { id:5, name:"Dr. Kavya Nair",    spec:"Gynecologist",  exp:"8 yrs",  deg:"MBBS, MD (OBG)",   reg:"MCI-448291", phone:"+91 9432109876", submitted:"30 Mar 2026", docs:["MCI Certificate","Degree","Aadhaar"] },
  { id:6, name:"Dr. Sanjay Tiwari", spec:"Orthopedic",    exp:"14 yrs", deg:"MBBS, MS (Ortho)", reg:"MCI-229847", phone:"+91 9321098765", submitted:"31 Mar 2026", docs:["MCI Certificate","Degree"] },
];

const ORDERS = [
  { id:"ORD-9941", patient:"Rahul Verma",  phone:"+91 9999999999", rx:"RX-2041", amount:3838, items:[{name:"Paracetamol 500mg",qty:10,price:350},{name:"Cetirizine 10mg",qty:7,price:315},{name:"Vitamin C 1000mg",qty:10,price:1500},{name:"Amoxicillin 500mg",qty:15,price:1800}], address:"42 Shanti Nagar, Indore MP 452001", status:"pending",    date:"31 Mar 2026", time:"11:35 AM" },
  { id:"ORD-9940", patient:"Seema Joshi",  phone:"+91 9888888888", rx:"RX-2040", amount:745,  items:[{name:"Metformin 500mg",qty:20,price:400},{name:"Atorvastatin 10mg",qty:10,price:345}], address:"12 MG Road, Indore MP 452010", status:"dispatched", date:"31 Mar 2026", time:"9:20 AM",  tracking:"DGD-TRK-88411" },
  { id:"ORD-9939", patient:"Aditya Kumar", phone:"+91 9777777777", rx:"RX-2039", amount:1290, items:[{name:"Azithromycin 500mg",qty:3,price:540},{name:"Ibuprofen 400mg",qty:15,price:825}], address:"78 Vijay Nagar, Indore MP 452010", status:"delivered",  date:"30 Mar 2026", time:"2:10 PM",  tracking:"DGD-TRK-88410" },
  { id:"ORD-9938", patient:"Meena Singh",  phone:"+91 9666666666", rx:"RX-2038", amount:580,  items:[{name:"Cetirizine 10mg",qty:7,price:315},{name:"Vitamin C 1000mg",qty:10,price:265}], address:"55 Scheme 54, Indore MP 452010", status:"delivered",  date:"30 Mar 2026", time:"11:00 AM", tracking:"DGD-TRK-88409" },
];

const MEDICINES_DATA = [
  { id:1, name:"Paracetamol 500mg",  brand:"Calpol",    cat:"Fever",      price:35,  mrp:42,  stock:2400, rx:false },
  { id:2, name:"Amoxicillin 500mg",  brand:"Amoxil",    cat:"Antibiotics",price:120, mrp:145, stock:80,   rx:true  },
  { id:3, name:"Cetirizine 10mg",    brand:"Zyrtec",    cat:"Allergy",    price:45,  mrp:55,  stock:1200, rx:false },
  { id:4, name:"Omeprazole 20mg",    brand:"Omez",      cat:"Digestive",  price:95,  mrp:110, stock:0,    rx:false },
  { id:5, name:"Azithromycin 500mg", brand:"Zithromax", cat:"Antibiotics",price:180, mrp:210, stock:450,  rx:true  },
  { id:6, name:"Metformin 500mg",    brand:"Glycomet",  cat:"Diabetes",   price:85,  mrp:100, stock:960,  rx:true  },
];

const PATIENTS = [
  { id:"PAT-10042", name:"Rahul Verma",  age:28, phone:"+91 9999999999", consults:8,  joined:"Jan 2026", status:"active",  lastVisit:"31 Mar" },
  { id:"PAT-10041", name:"Seema Joshi",  age:45, phone:"+91 9888888888", consults:3,  joined:"Feb 2026", status:"active",  lastVisit:"31 Mar" },
  { id:"PAT-10040", name:"Aditya Kumar", age:32, phone:"+91 9777777777", consults:5,  joined:"Jan 2026", status:"active",  lastVisit:"30 Mar" },
  { id:"PAT-10039", name:"Meena Singh",  age:55, phone:"+91 9666666666", consults:12, joined:"Dec 2025", status:"active",  lastVisit:"30 Mar" },
  { id:"PAT-10038", name:"Vikram Patel", age:40, phone:"+91 9555555555", consults:2,  joined:"Mar 2026", status:"blocked", lastVisit:"20 Mar" },
];

const EMPTY_MED = { name:"", brand:"", cat:"Fever", price:"", mrp:"", stock:"", rx:false };
const CATS = ["Fever","Antibiotics","Allergy","Vitamins","Pain Relief","Digestive","Heart","Diabetes","Skin"];

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .slide-up{animation:slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both}
  .gc{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;transition:all 0.3s}
  .bm{display:flex;align-items:center;justify-content:center;gap:7px;padding:9px 14px;border-radius:11px;font-family:inherit;font-weight:700;font-size:12px;color:white;border:none;cursor:pointer;transition:all 0.2s;background:linear-gradient(135deg,#00C9A7,#0B6FCC)}
  .bm:hover{transform:translateY(-1px);filter:brightness(1.1)}
  .bm:active{transform:scale(0.97)}
  .bg{display:flex;align-items:center;justify-content:center;gap:7px;padding:8px 13px;border-radius:11px;font-family:inherit;font-weight:600;font-size:11px;color:#00FFD1;border:1px solid rgba(0,255,209,0.22);background:rgba(0,255,209,0.05);cursor:pointer;transition:all 0.2s}
  .bg:hover{background:rgba(0,255,209,0.1)}
  .br{display:flex;align-items:center;justify-content:center;gap:7px;padding:8px 13px;border-radius:11px;font-family:inherit;font-weight:600;font-size:11px;color:#FF6B6B;border:1px solid rgba(255,107,107,0.22);background:rgba(255,107,107,0.06);cursor:pointer;transition:all 0.2s}
  .br:hover{background:rgba(255,107,107,0.1)}
  .by{display:flex;align-items:center;justify-content:center;gap:7px;padding:8px 13px;border-radius:11px;font-family:inherit;font-weight:600;font-size:11px;color:#FFB347;border:1px solid rgba(255,179,71,0.22);background:rgba(255,179,71,0.06);cursor:pointer;transition:all 0.2s}
  .by:hover{background:rgba(255,179,71,0.1)}
  .badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:100px;font-size:10px;font-weight:700}
  .ni{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:10px 0;cursor:pointer;border:none;background:none;font-family:inherit;flex:1;border-top:2px solid transparent;transition:all 0.2s}
  .ni.on{border-top-color:#00FFD1}
  .livdot{width:7px;height:7px;border-radius:50%;background:#00FFD1;display:inline-block;position:relative}
  .livdot::after{content:'';position:absolute;inset:-3px;border-radius:50%;background:rgba(0,255,209,0.3);animation:ripple 1.8s infinite}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
  .inp{width:100%;padding:10px 12px;border-radius:11px;font-family:inherit;font-size:12px;outline:none;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.09);color:#E8F4FF;transition:all 0.3s}
  .inp::placeholder{color:rgba(232,244,255,0.28)}
  .inp:focus{border-color:rgba(0,255,209,0.4);background:rgba(0,255,209,0.03)}
  .modal-bg{position:fixed;inset:0;background:rgba(2,13,26,0.85);backdropFilter:blur(8px);z-index:100;display:flex;align-items:flex-end;justify-content:center;animation:fadeIn 0.2s ease}
  .modal{background:#0D1B35;border:1px solid rgba(0,255,209,0.15);border-radius:24px 24px 0 0;padding:22px 20px 30px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto}
  .modal::-webkit-scrollbar{display:none}
  .toggle{width:38px;height:22px;border-radius:100px;cursor:pointer;transition:all 0.3s;position:relative;border:none;flex-shrink:0}
  .toggle-knob{position:absolute;top:2px;width:18px;height:18px;border-radius:50%;background:white;transition:all 0.3s}
  select.inp{cursor:pointer}
  select.inp option{background:#0D1B35;color:#E8F4FF}
`;

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab]   = useState<Tab>("overview");
  const [doctors, setDoctors]     = useState(DOCTORS);
  const [pendingDrs, setPendingDrs] = useState(PENDING_DOCTORS);
  const [orders, setOrders]       = useState(ORDERS);
  const [medicines, setMedicines] = useState(MEDICINES_DATA);
  const [patients, setPatients]   = useState(PATIENTS);
  const [search, setSearch]       = useState("");
  const [orderFilter, setOrderFilter] = useState("all");

  // Modals
  const [viewOrder, setViewOrder]   = useState<any>(null);
  const [viewDoc, setViewDoc]       = useState<any>(null);
  const [editMed, setEditMed]       = useState<any>(null);
  const [addingMed, setAddingMed]   = useState(false);
  const [newMed, setNewMed]         = useState({...EMPTY_MED});
  const [viewPatient, setViewPatient] = useState<any>(null);
  const [viewPayout, setViewPayout]  = useState<any>(null);
  const [dispatchId, setDispatchId]  = useState<string>("");
  const [trackingInput, setTrackingInput] = useState("");

  // Helpers
  const statusColor = (s:string) => s==="delivered"?"#00FFD1":s==="dispatched"?"#FFB347":s==="pending"?"#FF6B6B":"#4DB8FF";

  const toggleDoctorStatus = (id:number) => {
    setDoctors(p => p.map(d => d.id===id ? {...d, status: d.status==="approved"?"blocked":"approved", online: d.status==="approved"?false:d.online} : d));
  };

  const approveDoctor = (id:number) => setPendingDrs(p => p.filter(d => d.id!==id));
  const rejectDoctor  = (id:number) => setPendingDrs(p => p.filter(d => d.id!==id));

  const dispatchOrder = (id:string) => {
    const tracking = trackingInput || "DGD-TRK-" + Math.floor(10000+Math.random()*90000);
    setOrders(p => p.map(o => o.id===id ? {...o, status:"dispatched", tracking} : o));
    setTrackingInput(""); setDispatchId("");
  };

  const deliverOrder = (id:string) => setOrders(p => p.map(o => o.id===id ? {...o, status:"delivered"} : o));

  const deleteMed = (id:number) => setMedicines(p => p.filter(m => m.id!==id));
  const saveMed = () => {
    if (editMed?.isNew) {
      setMedicines(p => [...p, {...newMed, id: Date.now(), price:+newMed.price, mrp:+newMed.mrp, stock:+newMed.stock}]);
    } else {
      setMedicines(p => p.map(m => m.id===editMed.id ? {...editMed} : m));
    }
    setEditMed(null); setAddingMed(false); setNewMed({...EMPTY_MED});
  };

  const blockPatient = (id:string) => setPatients(p => p.map(pt => pt.id===id ? {...pt, status: pt.status==="active"?"blocked":"active"} : pt));

  const filteredOrders = orders.filter(o => orderFilter==="all" || o.status===orderFilter);
  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search) ||
    p.id.includes(search)
  );

  const printInvoice = (order:any) => {
    const win = window.open('','_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>Invoice ${order.id}</title>
      <style>body{font-family:Arial;padding:30px;color:#111}h1{color:#0B6FCC}table{width:100%;border-collapse:collapse;margin:16px 0}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5}.total{font-size:18px;font-weight:bold;color:#0B6FCC}</style>
      </head><body>
      <h1>DigiDoc — Invoice</h1>
      <p><b>Order ID:</b> ${order.id} &nbsp; <b>Date:</b> ${order.date} ${order.time}</p>
      <p><b>Patient:</b> ${order.patient} &nbsp; <b>Phone:</b> ${order.phone}</p>
      <p><b>Address:</b> ${order.address}</p>
      <table><tr><th>Medicine</th><th>Qty</th><th>Price</th></tr>
      ${order.items.map((i:any)=>`<tr><td>${i.name}</td><td>${i.qty}</td><td>₹${i.price}</td></tr>`).join('')}
      </table>
      <p class="total">Total: ₹${order.amount}</p>
      <p><b>Status:</b> ${order.status.toUpperCase()}</p>
      <br><p style="color:#888;font-size:12px">Generated by DigiDoc Admin Panel</p>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#E8F4FF",maxWidth:480,margin:"0 auto",left:0,right:0}}>
      <style>{S}</style>

      {/* HEADER */}
      <div style={{flexShrink:0,padding:"12px 18px 11px",background:"rgba(2,13,26,0.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <p style={{color:"rgba(232,244,255,0.4)",fontSize:10,marginBottom:1}}>Admin Panel</p>
            <h2 style={{fontSize:16,fontWeight:800}} className="shine">DigiDoc Control</h2>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>router.push("/pharma/login")} style={{padding:"6px 11px",borderRadius:10,background:"rgba(167,139,250,0.1)",border:"1px solid rgba(167,139,250,0.2)",color:"#A78BFA",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>💊 Pharma</button>
            {pendingDrs.length>0&&<div style={{position:"relative"}}><button onClick={()=>setTab("doctors")} style={{width:34,height:34,borderRadius:10,background:"rgba(255,107,107,0.1)",border:"1px solid rgba(255,107,107,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,cursor:"pointer"}}>🔔</button><div style={{position:"absolute",top:-3,right:-3,width:16,height:16,borderRadius:"50%",background:"#FF6B6B",border:"2px solid #020D1A",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,color:"white"}}>{pendingDrs.length}</div></div>}
            <button onClick={()=>router.push("/login")} style={{padding:"6px 11px",borderRadius:10,background:"rgba(255,107,107,0.08)",border:"1px solid rgba(255,107,107,0.18)",color:"#FF6B6B",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Sign Out</button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{flex:1,overflowY:"auto",padding:"0 18px"}} className="noscroll">

        {/* ── OVERVIEW ── */}
        {tab==="overview"&&(
          <div className="slide-up" style={{paddingTop:14,paddingBottom:14}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:16}}>
              {[
                {n:patients.length,l:"Total Patients",c:"#00FFD1",bg:"rgba(0,255,209,0.07)",icon:"👥"},
                {n:doctors.filter(d=>d.status==="approved").length,l:"Active Doctors",c:"#4DB8FF",bg:"rgba(77,184,255,0.07)",icon:"🩺"},
                {n:"₹1.24L",l:"Month Revenue",c:"#A78BFA",bg:"rgba(167,139,250,0.07)",icon:"💰"},
                {n:pendingDrs.length,l:"Pending Approval",c:"#FF6B6B",bg:"rgba(255,107,107,0.07)",icon:"⏳"},
              ].map(s=>(
                <div key={s.l} style={{borderRadius:15,padding:14,background:s.bg,border:`1px solid ${s.c}22`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
                    <span style={{fontSize:22}}>{s.icon}</span>
                    <span style={{fontSize:18,fontWeight:900,color:s.c}}>{s.n}</span>
                  </div>
                  <p style={{color:"rgba(232,244,255,0.45)",fontSize:10}}>{s.l}</p>
                </div>
              ))}
            </div>
            <div className="gc" style={{padding:14,marginBottom:12}}>
              <p style={{fontSize:9,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Today</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9}}>
                {[{n:"42",l:"Consults",c:"#00FFD1"},{n:"18",l:"Orders",c:"#4DB8FF"},{n:"₹12K",l:"Revenue",c:"#A78BFA"}].map(s=>(
                  <div key={s.l} style={{textAlign:"center",padding:"10px 6px",borderRadius:11,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)"}}>
                    <p style={{fontWeight:900,fontSize:18,color:s.c}}>{s.n}</p>
                    <p style={{fontSize:9,color:"rgba(232,244,255,0.38)",marginTop:2}}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
            {orders.filter(o=>o.status==="pending").length>0&&(
              <div style={{background:"rgba(255,107,107,0.06)",border:"1px solid rgba(255,107,107,0.2)",borderRadius:13,padding:"12px 14px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",gap:9,alignItems:"center"}}>
                  <span style={{fontSize:18}}>⚠️</span>
                  <div>
                    <p style={{color:"#FF6B6B",fontWeight:700,fontSize:12}}>{orders.filter(o=>o.status==="pending").length} Pending Orders</p>
                    <p style={{color:"rgba(255,107,107,0.6)",fontSize:10,marginTop:1}}>Needs dispatch</p>
                  </div>
                </div>
                <button className="br" onClick={()=>setTab("orders")} style={{padding:"6px 12px",fontSize:11}}>View →</button>
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
              {([["overview","doctors","🩺","Doctors"],["overview","orders","📦","Orders"],["overview","medicines","💊","Medicines"],["overview","patients","👥","Patients"]] as [Tab,Tab,string,string][]).map(([,t,icon,label])=>(
                <button key={t} onClick={()=>setTab(t)} style={{padding:"13px",borderRadius:13,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:9,transition:"all 0.2s"}}>
                  <span style={{fontSize:20}}>{icon}</span>
                  <span style={{fontWeight:600,fontSize:12,color:"#E8F4FF"}}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── DOCTORS ── */}
        {tab==="doctors"&&(
          <div className="slide-up" style={{paddingTop:14,paddingBottom:14}}>
            {pendingDrs.length>0&&(
              <>
                <p style={{fontSize:10,fontWeight:700,color:"#FF6B6B",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>⏳ Pending Approval ({pendingDrs.length})</p>
                {pendingDrs.map(d=>(
                  <div key={d.id} style={{background:"rgba(255,107,107,0.05)",border:"1px solid rgba(255,107,107,0.18)",borderRadius:15,padding:14,marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                      <div>
                        <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF"}}>{d.name}</p>
                        <p style={{color:"#00FFD1",fontSize:11,fontWeight:600}}>{d.spec} · {d.exp}</p>
                        <p style={{color:"rgba(232,244,255,0.35)",fontSize:10,marginTop:2}}>{d.deg} · {d.reg}</p>
                      </div>
                      <p style={{color:"rgba(232,244,255,0.3)",fontSize:10}}>{d.submitted}</p>
                    </div>
                    {/* Docs */}
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                      {d.docs.map(doc=>(
                        <button key={doc} onClick={()=>setViewDoc({name:doc,doctor:d.name})} style={{padding:"3px 9px",borderRadius:100,background:"rgba(77,184,255,0.08)",border:"1px solid rgba(77,184,255,0.2)",color:"#4DB8FF",fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>
                          📄 {doc}
                        </button>
                      ))}
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button className="bm" style={{flex:1}} onClick={()=>approveDoctor(d.id)}>✅ Approve</button>
                      <button className="br"  style={{flex:1}} onClick={()=>rejectDoctor(d.id)}>❌ Reject</button>
                    </div>
                  </div>
                ))}
              </>
            )}

            <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:10,marginTop:pendingDrs.length>0?10:0}}>✅ Active Doctors</p>
            {doctors.map(d=>(
              <div key={d.id} className="gc" style={{padding:13,marginBottom:10}}>
                <div style={{display:"flex",gap:11,alignItems:"flex-start",marginBottom:10}}>
                  <div style={{width:44,height:44,borderRadius:13,background:"rgba(0,255,209,0.07)",border:"1px solid rgba(0,255,209,0.14)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{d.avatar}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                      <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF"}}>{d.name}</p>
                      {d.online&&d.status==="approved"&&<span className="livdot"/>}
                      <span className="badge" style={{background:d.status==="approved"?"rgba(0,255,209,0.08)":"rgba(255,107,107,0.1)",color:d.status==="approved"?"#00FFD1":"#FF6B6B"}}>{d.status}</span>
                    </div>
                    <p style={{color:"rgba(232,244,255,0.4)",fontSize:10}}>{d.spec} · ⭐ {d.rating} · {d.patients} patients</p>
                    <p style={{color:"rgba(232,244,255,0.3)",fontSize:10,marginTop:1}}>Earned: ₹{d.earnings.toLocaleString()} · Pending: ₹{d.pending.toLocaleString()}</p>
                  </div>
                </div>
                {/* Action buttons */}
                <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                  <button className="bg"  style={{flex:1}} onClick={()=>setViewDoc({name:"Documents",doctor:d.name,docs:d.docs})}>📄 Docs</button>
                  <button className="by"  style={{flex:1}} onClick={()=>setViewPayout(d)}>💰 Payout</button>
                  <button className={d.status==="approved"?"br":"bm"} style={{flex:1}} onClick={()=>toggleDoctorStatus(d.id)}>
                    {d.status==="approved"?"🚫 Block":"✅ Unblock"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab==="orders"&&(
          <div className="slide-up" style={{paddingTop:14,paddingBottom:14}}>
            {/* Filter chips */}
            <div style={{display:"flex",gap:7,overflowX:"auto",marginBottom:14}} className="noscroll">
              {["all","pending","dispatched","delivered"].map(f=>(
                <button key={f} onClick={()=>setOrderFilter(f)} style={{padding:"5px 13px",borderRadius:100,flexShrink:0,cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:600,background:orderFilter===f?"linear-gradient(135deg,#00C9A7,#0B6FCC)":"rgba(255,255,255,0.04)",color:orderFilter===f?"white":"rgba(232,244,255,0.45)",border:orderFilter===f?"none":"1px solid rgba(255,255,255,0.08)",textTransform:"capitalize"}}>
                  {f==="all"?`All (${orders.length})`:f==="pending"?`⏳ Pending (${orders.filter(o=>o.status==="pending").length})`:f==="dispatched"?`🚚 Dispatched`:f==="delivered"?`✓ Delivered`:""}
                </button>
              ))}
            </div>

            {filteredOrders.map(o=>(
              <div key={o.id} className="gc" style={{padding:14,marginBottom:11}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div>
                    <p style={{fontWeight:700,fontSize:14,color:"#E8F4FF"}}>{o.id}</p>
                    <p style={{color:"rgba(232,244,255,0.4)",fontSize:11,marginTop:1}}>{o.patient} · {o.date} {o.time}</p>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <p style={{color:"#00FFD1",fontWeight:800,fontSize:14}}>₹{o.amount}</p>
                    <span className="badge" style={{background:statusColor(o.status)+"18",color:statusColor(o.status)}}>
                      {o.status==="pending"?"⏳ Pending":o.status==="dispatched"?"🚚 Dispatched":"✓ Delivered"}
                    </span>
                  </div>
                </div>

                {/* Items summary */}
                <p style={{color:"rgba(232,244,255,0.35)",fontSize:10,marginBottom:8}}>{o.items.length} items · {o.address.split(',')[0]}</p>

                {/* Dispatch input */}
                {o.status==="pending"&&(
                  <div style={{marginBottom:8}}>
                    {dispatchId===o.id?(
                      <div style={{display:"flex",gap:7}}>
                        <input className="inp" style={{flex:1}} placeholder="Tracking no. (optional)" value={trackingInput} onChange={e=>setTrackingInput(e.target.value)}/>
                        <button className="bm" onClick={()=>dispatchOrder(o.id)}>🚚 Dispatch</button>
                        <button className="br" style={{padding:"8px"}} onClick={()=>setDispatchId("")}>✕</button>
                      </div>
                    ):(
                      <button className="bm" style={{width:"100%"}} onClick={()=>setDispatchId(o.id)}>🚚 Mark Dispatched</button>
                    )}
                  </div>
                )}

                {o.status==="dispatched"&&(
                  <div style={{display:"flex",gap:7,marginBottom:8}}>
                    <div style={{flex:1,background:"rgba(255,179,71,0.07)",border:"1px solid rgba(255,179,71,0.18)",borderRadius:9,padding:"7px 11px"}}>
                      <p style={{color:"rgba(232,244,255,0.4)",fontSize:9}}>Tracking</p>
                      <p style={{color:"#FFB347",fontWeight:700,fontSize:11}}>{o.tracking}</p>
                    </div>
                    <button className="bm" style={{flex:1}} onClick={()=>deliverOrder(o.id)}>✓ Mark Delivered</button>
                  </div>
                )}

                {/* Action buttons */}
                <div style={{display:"flex",gap:7}}>
                  <button className="bg" style={{flex:1}} onClick={()=>setViewOrder(o)}>👁 View Order</button>
                  <button className="by" style={{flex:1}} onClick={()=>printInvoice(o)}>🖨️ Print Invoice</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── MEDICINES ── */}
        {tab==="medicines"&&(
          <div className="slide-up" style={{paddingTop:14,paddingBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h3 style={{fontSize:15,fontWeight:800}}>Medicine Catalog</h3>
              <button className="bm" onClick={()=>{setNewMed({...EMPTY_MED});setEditMed({...EMPTY_MED,id:Date.now(),isNew:true});setAddingMed(true);}}>+ Add New</button>
            </div>

            {/* Stock alerts */}
            {medicines.some(m=>m.stock<100)&&(
              <div style={{background:"rgba(255,107,107,0.06)",border:"1px solid rgba(255,107,107,0.18)",borderRadius:12,padding:"10px 13px",marginBottom:12}}>
                <p style={{color:"#FF6B6B",fontWeight:700,fontSize:11,marginBottom:3}}>⚠️ Stock Alerts</p>
                {medicines.filter(m=>m.stock===0).map(m=><p key={m.id} style={{color:"rgba(255,107,107,0.7)",fontSize:10}}>• {m.name} — OUT OF STOCK</p>)}
                {medicines.filter(m=>m.stock>0&&m.stock<100).map(m=><p key={m.id} style={{color:"rgba(255,179,71,0.7)",fontSize:10}}>• {m.name} — Low: {m.stock} units</p>)}
              </div>
            )}

            {medicines.map(m=>(
              <div key={m.id} className="gc" style={{padding:"12px 13px",marginBottom:9}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                      <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF"}}>{m.name}</p>
                      {m.rx&&<span className="badge" style={{background:"rgba(255,107,107,0.1)",color:"#FF6B6B"}}>Rx</span>}
                    </div>
                    <p style={{color:"rgba(232,244,255,0.4)",fontSize:10}}>{m.brand} · {m.cat} · ₹{m.price}</p>
                    <p style={{color:m.stock===0?"#FF6B6B":m.stock<100?"#FFB347":"#00FFD1",fontSize:10,fontWeight:600,marginTop:2}}>
                      {m.stock===0?"Out of Stock":m.stock<100?`Low Stock: ${m.stock}`:`In Stock: ${m.stock}`}
                    </p>
                  </div>
                  <div style={{display:"flex",gap:6,flexDirection:"column"}}>
                    <button className="bg" style={{padding:"6px 10px",fontSize:10}} onClick={()=>setEditMed({...m,isNew:false})}>✏️ Edit</button>
                    <button className="br" style={{padding:"6px 10px",fontSize:10}} onClick={()=>deleteMed(m.id)}>🗑️ Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── PATIENTS ── */}
        {tab==="patients"&&(
          <div className="slide-up" style={{paddingTop:14,paddingBottom:14}}>
            <div style={{position:"relative",marginBottom:14}}>
              <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:13}}>🔍</span>
              <input className="inp" style={{paddingLeft:32}} placeholder="Search by name, mobile or ID..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>

            <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>All Patients ({filteredPatients.length})</p>

            {filteredPatients.map(p=>(
              <div key={p.id} className="gc" style={{padding:13,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div>
                    <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF",marginBottom:2}}>{p.name}</p>
                    <p style={{color:"rgba(232,244,255,0.4)",fontSize:10}}>Age {p.age} · {p.phone}</p>
                    <p style={{color:"rgba(232,244,255,0.3)",fontSize:10,marginTop:1}}>{p.id} · Last: {p.lastVisit}</p>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <span className="badge" style={{background:p.status==="active"?"rgba(0,255,209,0.08)":"rgba(255,107,107,0.1)",color:p.status==="active"?"#00FFD1":"#FF6B6B",display:"block",marginBottom:3}}>{p.status}</span>
                    <p style={{color:"#4DB8FF",fontSize:11,fontWeight:600}}>{p.consults} consults</p>
                  </div>
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button className="bg" style={{flex:2}} onClick={()=>setViewPatient(p)}>📋 View Reports</button>
                  <button className={p.status==="active"?"br":"bm"} style={{flex:1}} onClick={()=>blockPatient(p.id)}>
                    {p.status==="active"?"🚫 Block":"✅ Unblock"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div style={{flexShrink:0,display:"flex",background:"rgba(2,13,26,0.97)",backdropFilter:"blur(24px)",borderTop:"1px solid rgba(255,255,255,0.07)"}}>
        {([["overview","📊","Overview"],["doctors","🩺","Doctors"],["orders","📦","Orders"],["medicines","💊","Medicines"],["patients","👥","Patients"]] as [Tab,string,string][]).map(([t,icon,label])=>(
          <button key={t} className={"ni"+(tab===t?" on":"")} onClick={()=>setTab(t)} style={{color:tab===t?"#00FFD1":"rgba(232,244,255,0.3)",position:"relative"}}>
            {t==="doctors"&&pendingDrs.length>0&&<div style={{position:"absolute",top:5,right:"18%",width:7,height:7,borderRadius:"50%",background:"#FF6B6B"}}/>}
            {t==="orders"&&orders.filter(o=>o.status==="pending").length>0&&<div style={{position:"absolute",top:5,right:"18%",width:7,height:7,borderRadius:"50%",background:"#FF6B6B"}}/>}
            <span style={{fontSize:17}}>{icon}</span>
            <span style={{fontSize:8,fontWeight:tab===t?700:500}}>{label}</span>
          </button>
        ))}
      </div>

      {/* ── MODAL: View Order ── */}
      {viewOrder&&(
        <div className="modal-bg" onClick={()=>setViewOrder(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h3 style={{fontWeight:800,fontSize:15,color:"#E8F4FF"}}>{viewOrder.id}</h3>
              <button onClick={()=>setViewOrder(null)} style={{background:"none",border:"none",color:"rgba(232,244,255,0.4)",cursor:"pointer",fontSize:18}}>✕</button>
            </div>
            <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"12px 14px",marginBottom:12}}>
              <p style={{color:"rgba(232,244,255,0.4)",fontSize:10,marginBottom:4}}>Patient Details</p>
              <p style={{fontWeight:600,fontSize:13,color:"#E8F4FF"}}>{viewOrder.patient}</p>
              <p style={{color:"rgba(232,244,255,0.5)",fontSize:11,marginTop:2}}>{viewOrder.phone}</p>
              <p style={{color:"rgba(232,244,255,0.5)",fontSize:11,marginTop:2}}>{viewOrder.address}</p>
            </div>
            <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Items Ordered</p>
            {viewOrder.items.map((item:any,i:number)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                <p style={{color:"#E8F4FF",fontSize:12}}>{item.name} × {item.qty}</p>
                <p style={{color:"#00FFD1",fontWeight:700,fontSize:12}}>₹{item.price}</p>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderTop:"1px solid rgba(255,255,255,0.08)",marginTop:4}}>
              <p style={{fontWeight:800,fontSize:14,color:"#E8F4FF"}}>Total</p>
              <p style={{fontWeight:900,fontSize:16,color:"#00FFD1"}}>₹{viewOrder.amount}</p>
            </div>
            {viewOrder.tracking&&<p style={{color:"#FFB347",fontSize:11,marginTop:4}}>Tracking: {viewOrder.tracking}</p>}
            <button className="bm" style={{width:"100%",marginTop:14}} onClick={()=>printInvoice(viewOrder)}>🖨️ Print Invoice</button>
          </div>
        </div>
      )}

      {/* ── MODAL: View Docs ── */}
      {viewDoc&&(
        <div className="modal-bg" onClick={()=>setViewDoc(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h3 style={{fontWeight:800,fontSize:15}}>Documents — {viewDoc.doctor}</h3>
              <button onClick={()=>setViewDoc(null)} style={{background:"none",border:"none",color:"rgba(232,244,255,0.4)",cursor:"pointer",fontSize:18}}>✕</button>
            </div>
            {(viewDoc.docs||[viewDoc.name]).map((d:string,i:number)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:12,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",marginBottom:9}}>
                <span style={{fontSize:22}}>📄</span>
                <div style={{flex:1}}>
                  <p style={{fontWeight:600,fontSize:13,color:"#E8F4FF"}}>{d}</p>
                  <p style={{color:"#00FFD1",fontSize:10,marginTop:1}}>✓ Uploaded · Verified</p>
                </div>
                <button className="bg" style={{padding:"5px 10px",fontSize:10}}>⬇️ View</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODAL: Payout ── */}
      {viewPayout&&(
        <div className="modal-bg" onClick={()=>setViewPayout(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h3 style={{fontWeight:800,fontSize:15}}>Payout — {viewPayout.name}</h3>
              <button onClick={()=>setViewPayout(null)} style={{background:"none",border:"none",color:"rgba(232,244,255,0.4)",cursor:"pointer",fontSize:18}}>✕</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              {[{l:"Total Earned",v:`₹${viewPayout.earnings.toLocaleString()}`,c:"#00FFD1"},{l:"Pending Payout",v:`₹${viewPayout.pending.toLocaleString()}`,c:"#FFB347"},{l:"Platform Fee (15%)",v:`₹${Math.floor(viewPayout.earnings*0.15).toLocaleString()}`,c:"#FF6B6B"},{l:"Total Consults",v:viewPayout.patients,c:"#4DB8FF"}].map(s=>(
                <div key={s.l} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"12px",textAlign:"center"}}>
                  <p style={{fontWeight:900,fontSize:18,color:s.c}}>{s.v}</p>
                  <p style={{fontSize:9,color:"rgba(232,244,255,0.38)",marginTop:2}}>{s.l}</p>
                </div>
              ))}
            </div>
            <div style={{background:"rgba(255,179,71,0.06)",border:"1px solid rgba(255,179,71,0.15)",borderRadius:12,padding:"11px 14px",marginBottom:14}}>
              <p style={{color:"#FFB347",fontWeight:700,fontSize:12,marginBottom:2}}>Next Payout</p>
              <p style={{color:"rgba(255,179,71,0.7)",fontSize:11}}>₹{viewPayout.pending.toLocaleString()} — Monday, 7 April 2026</p>
            </div>
            <button className="bm" style={{width:"100%"}} onClick={()=>{alert(`Payout of ₹${viewPayout.pending} initiated for ${viewPayout.name}`);setViewPayout(null);}}>💰 Release Payout Now</button>
          </div>
        </div>
      )}

      {/* ── MODAL: Edit/Add Medicine ── */}
      {editMed&&(
        <div className="modal-bg" onClick={()=>{setEditMed(null);setAddingMed(false);}}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h3 style={{fontWeight:800,fontSize:15}}>{editMed.isNew?"Add New Medicine":"Edit Medicine"}</h3>
              <button onClick={()=>{setEditMed(null);setAddingMed(false);}} style={{background:"none",border:"none",color:"rgba(232,244,255,0.4)",cursor:"pointer",fontSize:18}}>✕</button>
            </div>
            {[{k:"name",l:"Medicine Name",ph:"e.g. Paracetamol 500mg"},{k:"brand",l:"Brand",ph:"e.g. Calpol"},{k:"price",l:"Price (₹)",ph:"35",type:"number"},{k:"mrp",l:"MRP (₹)",ph:"42",type:"number"},{k:"stock",l:"Stock (units)",ph:"500",type:"number"}].map(f=>(
              <div key={f.k} style={{marginBottom:11}}>
                <label style={{display:"block",fontSize:9,fontWeight:700,color:"rgba(232,244,255,0.38)",textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>{f.l}</label>
                <input className="inp" type={f.type||"text"} placeholder={f.ph}
                  value={(editMed)[f.k]||""}
                  onChange={e=>setEditMed((p:any)=>({...p,[f.k]:e.target.value}))}
                />
              </div>
            ))}
            <div style={{marginBottom:11}}>
              <label style={{display:"block",fontSize:9,fontWeight:700,color:"rgba(232,244,255,0.38)",textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>Category</label>
              <select className="inp" value={editMed.cat} onChange={e=>setEditMed((p:any)=>({...p,cat:e.target.value}))}>
                {CATS.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <p style={{fontSize:13,fontWeight:600,color:"#E8F4FF"}}>Requires Prescription (Rx)</p>
              <button className="toggle" onClick={()=>setEditMed((p:any)=>({...p,rx:!p.rx}))} style={{background:editMed.rx?"#00C9A7":"rgba(255,255,255,0.1)"}}>
                <div className="toggle-knob" style={{left:editMed.rx?18:2}}/>
              </button>
            </div>
            <button className="bm" style={{width:"100%"}} onClick={saveMed}>
              {editMed.isNew?"➕ Add Medicine":"💾 Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL: View Patient Reports ── */}
      {viewPatient&&(
        <div className="modal-bg" onClick={()=>setViewPatient(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h3 style={{fontWeight:800,fontSize:15}}>{viewPatient.name}</h3>
              <button onClick={()=>setViewPatient(null)} style={{background:"none",border:"none",color:"rgba(232,244,255,0.4)",cursor:"pointer",fontSize:18}}>✕</button>
            </div>
            <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"12px 14px",marginBottom:12}}>
              {[{l:"Patient ID",v:viewPatient.id},{l:"Age",v:viewPatient.age},{l:"Phone",v:viewPatient.phone},{l:"Joined",v:viewPatient.joined},{l:"Status",v:viewPatient.status},{l:"Total Consults",v:viewPatient.consults},{l:"Last Visit",v:viewPatient.lastVisit}].map(r=>(
                <div key={r.l} style={{display:"flex",justifyContent:"space-between",paddingBottom:7,marginBottom:7,borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                  <p style={{color:"rgba(232,244,255,0.4)",fontSize:12}}>{r.l}</p>
                  <p style={{color:"#E8F4FF",fontSize:12,fontWeight:600}}>{r.v}</p>
                </div>
              ))}
            </div>
            <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Consultation History</p>
            {[{rx:"RX-2041",doc:"Dr. Priya Sharma",date:"31 Mar",diag:"Upper Respiratory Infection"},{rx:"RX-2038",doc:"Dr. Arjun Mehta",date:"15 Mar",diag:"Heart Checkup"}].slice(0,viewPatient.consults).map((c,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:11,padding:"10px 12px",marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <p style={{fontWeight:600,fontSize:12,color:"#E8F4FF"}}>{c.doc}</p>
                  <p style={{color:"rgba(232,244,255,0.35)",fontSize:10}}>{c.date}</p>
                </div>
                <p style={{color:"rgba(232,244,255,0.45)",fontSize:10,marginTop:2}}>{c.rx} · {c.diag}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
