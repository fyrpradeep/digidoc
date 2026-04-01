"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type NotifType = "all" | "appointment" | "order" | "payment" | "system";

const NOTIFICATIONS = [
  { id: 1,  type: "appointment", icon: "📹", title: "Consultation Completed",        body: "Your video call with Dr. Priya Sharma has ended. View your prescription.",    time: "2 min ago",   read: false, link: "/prescription/RX-2041", urgent: false },
  { id: 2,  type: "order",       icon: "🚚", title: "Order Out for Delivery",        body: "Your medicines (ORD-9941) are out for delivery. Expected by 7 PM today.",     time: "45 min ago",  read: false, link: "/order",                urgent: false },
  { id: 3,  type: "payment",     icon: "💳", title: "Payment Successful",            body: "₹3,838 paid for Order ORD-9941. Invoice has been generated.",                 time: "1 hr ago",    read: false, link: "/prescription/RX-2041", urgent: false },
  { id: 4,  type: "appointment", icon: "⏰", title: "Upcoming Appointment Reminder", body: "You have a follow-up with Dr. Arjun Mehta tomorrow at 11:00 AM.",             time: "3 hrs ago",   read: true,  link: "/dashboard",            urgent: true  },
  { id: 5,  type: "system",      icon: "🤖", title: "AI Health Tip",                 body: "Based on your history, staying hydrated reduces fever recovery time by 40%.",  time: "5 hrs ago",   read: true,  link: "/chat",                 urgent: false },
  { id: 6,  type: "order",       icon: "✅", title: "Order Delivered",               body: "Your medicines for RX-2038 have been delivered. Hope you feel better soon!",  time: "Yesterday",   read: true,  link: "/order",                urgent: false },
  { id: 7,  type: "appointment", icon: "🩺", title: "New Doctor Available",          body: "Dr. Vikram Singh (Orthopedic, 4.9★) is now available for consultation.",      time: "Yesterday",   read: true,  link: "/dashboard",            urgent: false },
  { id: 8,  type: "payment",     icon: "🎁", title: "Referral Bonus Credited",       body: "₹100 bonus credited to your account for referring a friend to DigiDoc.",     time: "2 days ago",  read: true,  link: "/dashboard",            urgent: false },
  { id: 9,  type: "system",      icon: "🔒", title: "Login from New Device",         body: "New login detected on iPhone 15. Was this you? Secure your account if not.", time: "3 days ago",  read: true,  link: "/profile",              urgent: true  },
  { id: 10, type: "system",      icon: "⭐", title: "Rate Your Experience",          body: "How was your consultation with Dr. Priya Sharma? Share your feedback.",       time: "4 days ago",  read: true,  link: "/dashboard",            urgent: false },
];

const FILTERS: { key: NotifType; label: string }[] = [
  { key: "all",         label: "All"         },
  { key: "appointment", label: "Appointments"},
  { key: "order",       label: "Orders"      },
  { key: "payment",     label: "Payments"    },
  { key: "system",      label: "System"      },
];

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  .slide-up{animation:slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both}
  .nc{border-radius:16px;padding:14px 16px;cursor:pointer;transition:all 0.25s;display:flex;gap:13px;align-items:flex-start;margin-bottom:10px}
  .nc:hover{transform:translateX(3px)}
  .nc:active{transform:scale(0.98)}
  .bm{display:flex;align-items:center;justify-content:center;gap:8px;padding:11px 18px;border-radius:100px;font-family:inherit;font-weight:700;font-size:12px;color:white;border:none;cursor:pointer;transition:all 0.3s;background:linear-gradient(135deg,#00C9A7,#0B6FCC)}
  .bm:hover{transform:translateY(-1px);box-shadow:0 0 20px rgba(0,201,167,0.35)}
  .bg{display:flex;align-items:center;justify-content:center;gap:8px;padding:10px 16px;border-radius:100px;font-family:inherit;font-weight:600;font-size:12px;color:#00FFD1;border:1px solid rgba(0,255,209,0.22);background:rgba(0,255,209,0.05);cursor:pointer;transition:all 0.3s}
  .bg:hover{background:rgba(0,255,209,0.1)}
  .livdot{width:8px;height:8px;border-radius:50%;background:#00FFD1;display:inline-block;position:relative;flex-shrink:0}
  .livdot::after{content:'';position:absolute;inset:-3px;border-radius:50%;background:rgba(0,255,209,0.3);animation:ripple 1.8s infinite}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
  .filter-chip{padding:6px 14px;border-radius:100px;cursor:pointer;font-family:inherit;font-size:11px;font-weight:600;transition:all 0.2s;flex-shrink:0;border:1.5px solid}
`;

export default function NotificationsPage() {
  const router = useRouter();
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState<NotifType>("all");

  const unread = notifs.filter(n => !n.read).length;

  const filtered = filter === "all" ? notifs : notifs.filter(n => n.type === filter);

  const markRead     = (id: number) => setNotifs(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead  = () => setNotifs(p => p.map(n => ({ ...n, read: true })));
  const deleteNotif  = (id: number) => setNotifs(p => p.filter(n => n.id !== id));

  const iconBg = (type: string) => ({
    appointment: "rgba(0,255,209,0.1)",
    order:       "rgba(77,184,255,0.1)",
    payment:     "rgba(0,201,167,0.1)",
    system:      "rgba(167,139,250,0.1)",
  }[type] || "rgba(255,255,255,0.05)");

  const iconBorder = (type: string) => ({
    appointment: "rgba(0,255,209,0.2)",
    order:       "rgba(77,184,255,0.2)",
    payment:     "rgba(0,201,167,0.2)",
    system:      "rgba(167,139,250,0.2)",
  }[type] || "rgba(255,255,255,0.08)");

  return (
    <div style={{
      position:"fixed",inset:0,display:"flex",flexDirection:"column",
      background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",
      color:"#E8F4FF",maxWidth:480,margin:"0 auto",
      left:"50%",transform:"translateX(-50%)",
    }}>
      <style>{S}</style>

      {/* HEADER */}
      <div style={{flexShrink:0,padding:"13px 18px 12px",background:"rgba(2,13,26,0.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <button onClick={()=>router.back()} style={{background:"none",border:"none",color:"#00FFD1",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>← Back</button>
          <div style={{flex:1,display:"flex",alignItems:"center",gap:8}}>
            <h2 style={{fontSize:16,fontWeight:800}}>Notifications</h2>
            {unread > 0 && (
              <span style={{padding:"2px 9px",borderRadius:100,background:"rgba(255,107,107,0.15)",border:"1px solid rgba(255,107,107,0.25)",color:"#FF6B6B",fontSize:11,fontWeight:700}}>
                {unread} new
              </span>
            )}
          </div>
          {unread > 0 && (
            <button onClick={markAllRead} className="bg" style={{padding:"5px 12px",fontSize:11}}>
              Mark all read
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div style={{display:"flex",gap:7,overflowX:"auto"}} className="noscroll">
          {FILTERS.map(f=>{
            const count = f.key === "all" ? notifs.filter(n=>!n.read).length : notifs.filter(n=>n.type===f.key && !n.read).length;
            return (
              <button key={f.key} className="filter-chip" onClick={()=>setFilter(f.key)} style={{borderColor:filter===f.key?"rgba(0,255,209,0.5)":"rgba(255,255,255,0.08)",background:filter===f.key?"rgba(0,255,209,0.08)":"rgba(255,255,255,0.03)",color:filter===f.key?"#00FFD1":"rgba(232,244,255,0.45)"}}>
                {f.label}{count > 0 && <span style={{marginLeft:4,background:"rgba(255,107,107,0.2)",color:"#FF6B6B",borderRadius:100,padding:"0px 5px",fontSize:9}}>{count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* NOTIFICATIONS LIST */}
      <div style={{flex:1,overflowY:"auto",padding:"12px 18px"}} className="noscroll">

        {filtered.length === 0 ? (
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <p style={{fontSize:48,marginBottom:12}}>🔔</p>
            <p style={{fontWeight:700,fontSize:15,color:"#E8F4FF",marginBottom:6}}>All caught up!</p>
            <p style={{color:"rgba(232,244,255,0.35)",fontSize:13}}>No notifications in this category.</p>
          </div>
        ) : (
          <>
            {/* Unread section */}
            {filtered.some(n => !n.read) && (
              <>
                <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1.5,marginBottom:10}}>New</p>
                {filtered.filter(n=>!n.read).map(n=>(
                  <NotifCard key={n.id} n={n} onRead={markRead} onDelete={deleteNotif} iconBg={iconBg} iconBorder={iconBorder} router={router}/>
                ))}
              </>
            )}

            {/* Read section */}
            {filtered.some(n => n.read) && (
              <>
                <p style={{fontSize:10,fontWeight:700,color:"rgba(232,244,255,0.35)",textTransform:"uppercase",letterSpacing:1.5,marginTop:16,marginBottom:10}}>Earlier</p>
                {filtered.filter(n=>n.read).map(n=>(
                  <NotifCard key={n.id} n={n} onRead={markRead} onDelete={deleteNotif} iconBg={iconBg} iconBorder={iconBorder} router={router}/>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function NotifCard({ n, onRead, onDelete, iconBg, iconBorder, router }: any) {
  const [swiped, setSwiped] = useState(false);

  return (
    <div className="nc" style={{background:n.read?"rgba(255,255,255,0.02)":"rgba(0,255,209,0.04)",border:`1px solid ${n.read?"rgba(255,255,255,0.06)":n.urgent?"rgba(255,107,107,0.2)":"rgba(0,255,209,0.12)"}`,opacity:swiped?0:1,transform:swiped?"translateX(100%)":"none",transition:"all 0.3s"}}
      onClick={()=>{onRead(n.id); router.push(n.link);}}>

      {/* Icon */}
      <div style={{width:44,height:44,borderRadius:14,flexShrink:0,background:iconBg(n.type),border:`1px solid ${iconBorder(n.type)}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>
        {n.icon}
      </div>

      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:4}}>
          <div style={{display:"flex",alignItems:"center",gap:6,flex:1,minWidth:0}}>
            <p style={{fontWeight:n.read?600:800,fontSize:13,color:"#E8F4FF",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{n.title}</p>
            {!n.read && <span className="livdot" style={{width:6,height:6,flexShrink:0}}/>}
            {n.urgent && <span style={{padding:"1px 7px",borderRadius:100,background:"rgba(255,107,107,0.12)",color:"#FF6B6B",fontSize:9,fontWeight:700,flexShrink:0}}>!</span>}
          </div>
          <button onClick={e=>{e.stopPropagation();setSwiped(true);setTimeout(()=>onDelete(n.id),300);}} style={{background:"none",border:"none",color:"rgba(232,244,255,0.2)",cursor:"pointer",fontSize:14,padding:"0 0 0 8px",flexShrink:0}}>✕</button>
        </div>
        <p style={{color:"rgba(232,244,255,0.5)",fontSize:11,lineHeight:1.6,marginBottom:5}}>{n.body}</p>
        <p style={{color:"rgba(232,244,255,0.28)",fontSize:10}}>{n.time}</p>
      </div>
    </div>
  );
}
