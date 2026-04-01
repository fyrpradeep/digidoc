"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ORDERS = [
  { id:"ORD-9941", patient:"Rahul Verma",  phone:"+91 9999999999", rx:"RX-2041", amount:3838, items:[{name:"Paracetamol 500mg",qty:10,price:350},{name:"Cetirizine 10mg",qty:7,price:315},{name:"Vitamin C 1000mg",qty:10,price:1500},{name:"Amoxicillin 500mg",qty:15,price:1800}], address:"42 Shanti Nagar, Indore MP 452001", status:"pending",    date:"31 Mar", time:"11:35 AM" },
  { id:"ORD-9940", patient:"Seema Joshi",  phone:"+91 9888888888", rx:"RX-2040", amount:745,  items:[{name:"Metformin 500mg",qty:20,price:400},{name:"Atorvastatin 10mg",qty:10,price:345}], address:"12 MG Road, Indore", status:"packed",     date:"31 Mar", time:"9:20 AM"  },
  { id:"ORD-9939", patient:"Aditya Kumar", phone:"+91 9777777777", rx:"RX-2039", amount:1290, items:[{name:"Azithromycin 500mg",qty:3,price:540},{name:"Ibuprofen 400mg",qty:15,price:825}], address:"78 Vijay Nagar, Indore", status:"dispatched", date:"30 Mar", time:"2:10 PM", tracking:"DGD-TRK-88410"  },
];

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0.4}}
  .shine{background:linear-gradient(90deg,#A78BFA,#4DB8FF,#A78BFA);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .gc{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:14px;margin-bottom:11px;transition:all 0.3s}
  .bm{display:flex;align-items:center;justify-content:center;gap:7px;padding:9px 14px;border-radius:11px;font-family:inherit;font-weight:700;font-size:12px;color:white;border:none;cursor:pointer;transition:all 0.2s;background:linear-gradient(135deg,#A78BFA,#4DB8FF)}
  .bm:hover{filter:brightness(1.1)}
  .bg{display:flex;align-items:center;justify-content:center;gap:7px;padding:8px 13px;border-radius:11px;font-family:inherit;font-weight:600;font-size:11px;color:#A78BFA;border:1px solid rgba(167,139,250,0.22);background:rgba(167,139,250,0.06);cursor:pointer;transition:all 0.2s}
  .bg:hover{background:rgba(167,139,250,0.12)}
  .badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:100px;font-size:10px;font-weight:700}
  .livdot{width:7px;height:7px;border-radius:50%;background:#A78BFA;display:inline-block;animation:blink 1.5s infinite}
  .inp{width:100%;padding:9px 12px;border-radius:10px;font-family:inherit;font-size:12px;outline:none;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.08);color:#E8F4FF;transition:all 0.3s}
  .inp:focus{border-color:rgba(167,139,250,0.4)}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
`;

type Status = "pending"|"packed"|"dispatched";
const statusColor = (s:Status|string) => s==="dispatched"?"#00FFD1":s==="packed"?"#FFB347":"#A78BFA";

export default function PharmaDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState(ORDERS);
  const [filter, setFilter] = useState("all");
  const [trackInputs, setTrackInputs] = useState<Record<string,string>>({});

  const packOrder     = (id:string) => setOrders(p=>p.map(o=>o.id===id?{...o,status:"packed"}:o));
  const dispatchOrder = (id:string) => {
    const tr = trackInputs[id]||"DGD-TRK-"+Math.floor(10000+Math.random()*90000);
    setOrders(p=>p.map(o=>o.id===id?{...o,status:"dispatched",tracking:tr}:o));
  };

  const filtered = filter==="all"?orders:orders.filter(o=>o.status===filter);
  const pending   = orders.filter(o=>o.status==="pending").length;

  return (
    <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#E8F4FF",maxWidth:480,margin:"0 auto",left:0,right:0}}>
      <style>{S}</style>

      {/* HEADER */}
      <div style={{flexShrink:0,padding:"13px 18px 12px",background:"rgba(2,13,26,0.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div>
            <p style={{color:"rgba(232,244,255,0.4)",fontSize:10}}>Pharma Portal</p>
            <h2 style={{fontSize:16,fontWeight:800}} className="shine">Medicine Orders</h2>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {pending>0&&<div style={{display:"flex",alignItems:"center",gap:5,padding:"5px 11px",borderRadius:100,background:"rgba(167,139,250,0.1)",border:"1px solid rgba(167,139,250,0.2)"}}>
              <span className="livdot"/>
              <span style={{color:"#A78BFA",fontSize:11,fontWeight:700}}>{pending} new</span>
            </div>}
            <button onClick={()=>router.push("/pharma/login")} style={{padding:"6px 11px",borderRadius:10,background:"rgba(255,107,107,0.08)",border:"1px solid rgba(255,107,107,0.18)",color:"#FF6B6B",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Logout</button>
          </div>
        </div>
        {/* Stats */}
        <div style={{display:"flex",gap:8}}>
          {[{n:orders.length,l:"Total",c:"#A78BFA"},{n:orders.filter(o=>o.status==="pending").length,l:"Pending",c:"#FF6B6B"},{n:orders.filter(o=>o.status==="packed").length,l:"Packed",c:"#FFB347"},{n:orders.filter(o=>o.status==="dispatched").length,l:"Sent",c:"#00FFD1"}].map(s=>(
            <div key={s.l} style={{flex:1,textAlign:"center",padding:"7px 4px",borderRadius:10,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)"}}>
              <p style={{fontWeight:800,fontSize:16,color:s.c}}>{s.n}</p>
              <p style={{fontSize:9,color:"rgba(232,244,255,0.35)",marginTop:1}}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{flex:1,overflowY:"auto",padding:"12px 18px"}} className="noscroll">
        {/* Filters */}
        <div style={{display:"flex",gap:7,marginBottom:14,overflowX:"auto"}} className="noscroll">
          {["all","pending","packed","dispatched"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{padding:"5px 13px",borderRadius:100,flexShrink:0,cursor:"pointer",fontFamily:"inherit",fontSize:11,fontWeight:600,background:filter===f?"linear-gradient(135deg,#A78BFA,#4DB8FF)":"rgba(255,255,255,0.04)",color:filter===f?"white":"rgba(232,244,255,0.45)",border:filter===f?"none":"1px solid rgba(255,255,255,0.08)",textTransform:"capitalize"}}>
              {f==="all"?"All Orders":f==="pending"?"⚡ New Orders":f==="packed"?"📦 Packed":f==="dispatched"?"🚚 Dispatched":""}
            </button>
          ))}
        </div>

        {filtered.map(o=>(
          <div key={o.id} className="gc" style={{borderColor:o.status==="pending"?"rgba(167,139,250,0.2)":"rgba(255,255,255,0.07)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div>
                <p style={{fontWeight:700,fontSize:14,color:"#E8F4FF"}}>{o.id}</p>
                <p style={{color:"rgba(232,244,255,0.4)",fontSize:11,marginTop:1}}>{o.patient} · {o.phone}</p>
                <p style={{color:"rgba(232,244,255,0.3)",fontSize:10,marginTop:1}}>{o.date} {o.time} · Rx: {o.rx}</p>
              </div>
              <div style={{textAlign:"right"}}>
                <p style={{color:"#A78BFA",fontWeight:800,fontSize:14}}>₹{o.amount}</p>
                <span className="badge" style={{background:statusColor(o.status)+"18",color:statusColor(o.status),marginTop:3,display:"inline-flex"}}>
                  {o.status==="pending"?"⚡ New":o.status==="packed"?"📦 Packed":"🚚 Dispatched"}
                </span>
              </div>
            </div>

            {/* Items */}
            <div style={{background:"rgba(255,255,255,0.02)",borderRadius:10,padding:"8px 11px",marginBottom:10}}>
              {o.items.map((item,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:i<o.items.length-1?4:0}}>
                  <p style={{color:"rgba(232,244,255,0.6)",fontSize:11}}>{item.name} × {item.qty}</p>
                  <p style={{color:"#A78BFA",fontSize:11,fontWeight:600}}>₹{item.price}</p>
                </div>
              ))}
            </div>

            <p style={{color:"rgba(232,244,255,0.35)",fontSize:10,marginBottom:8}}>📍 {o.address}</p>

            {/* Actions */}
            {o.status==="pending"&&(
              <button className="bm" style={{width:"100%"}} onClick={()=>packOrder(o.id)}>📦 Mark as Packed</button>
            )}
            {o.status==="packed"&&(
              <div>
                <input className="inp" style={{marginBottom:8}} placeholder="Tracking number (optional)"
                  value={trackInputs[o.id]||""} onChange={e=>setTrackInputs(p=>({...p,[o.id]:e.target.value}))}/>
                <button className="bm" style={{width:"100%"}} onClick={()=>dispatchOrder(o.id)}>🚚 Dispatch to Customer</button>
              </div>
            )}
            {o.status==="dispatched"&&(
              <div style={{background:"rgba(0,255,209,0.06)",border:"1px solid rgba(0,255,209,0.15)",borderRadius:10,padding:"9px 12px",display:"flex",justifyContent:"space-between"}}>
                <span style={{color:"rgba(232,244,255,0.4)",fontSize:11}}>Tracking:</span>
                <span style={{color:"#00FFD1",fontWeight:700,fontSize:11}}>{(o as any).tracking}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
