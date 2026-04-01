"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PENDING_DOCTORS = [
  { id: 1, name: "Dr. Kavya Nair",    spec: "Gynecologist",  exp: "8 yrs",  deg: "MBBS, MD (OBG)",    reg: "MCI-448291", phone: "+91 9876543210", submitted: "30 Mar 2026" },
  { id: 2, name: "Dr. Sanjay Tiwari", spec: "Orthopedic",    exp: "14 yrs", deg: "MBBS, MS (Ortho)",  reg: "MCI-229847", phone: "+91 9765432109", submitted: "31 Mar 2026" },
  { id: 3, name: "Dr. Ritu Verma",    spec: "Pediatrician",  exp: "6 yrs",  deg: "MBBS, DCH",         reg: "MCI-338821", phone: "+91 9654321098", submitted: "31 Mar 2026" },
];

const ACTIVE_DOCTORS = [
  { id: 1, name: "Dr. Priya Sharma",  spec: "General Physician", online: true,  patients: 1240, rating: 4.9, joined: "Jan 2025", avatar: "👩‍⚕️" },
  { id: 2, name: "Dr. Arjun Mehta",   spec: "Cardiologist",      online: true,  patients: 980,  rating: 4.8, joined: "Feb 2025", avatar: "👨‍⚕️" },
  { id: 3, name: "Dr. Sneha Rao",     spec: "Dermatologist",     online: false, patients: 760,  rating: 4.7, joined: "Mar 2025", avatar: "👩‍⚕️" },
  { id: 4, name: "Dr. Rahul Gupta",   spec: "Neurologist",       online: true,  patients: 1100, rating: 4.9, joined: "Jan 2025", avatar: "👨‍⚕️" },
];

const ORDERS = [
  { id: "ORD-9941", patient: "Rahul Verma",  rx: "RX-2041", amount: 3838, items: 4, status: "pending",   date: "31 Mar" },
  { id: "ORD-9940", patient: "Seema Joshi",  rx: "RX-2040", amount: 745,  items: 2, status: "dispatched", date: "31 Mar", tracking: "DGD-TRK-88411" },
  { id: "ORD-9939", patient: "Aditya Kumar", rx: "RX-2039", amount: 1290, items: 3, status: "delivered",  date: "30 Mar", tracking: "DGD-TRK-88410" },
  { id: "ORD-9938", patient: "Meena Singh",  rx: "RX-2038", amount: 580,  items: 2, status: "delivered",  date: "30 Mar", tracking: "DGD-TRK-88409" },
];

const MEDICINES = [
  { id: 1, name: "Paracetamol 500mg",  type: "Tablet",      stock: 2400, price: 35,  status: "in_stock"  },
  { id: 2, name: "Amoxicillin 250mg",  type: "Capsule",     stock: 80,   price: 120, status: "low_stock" },
  { id: 3, name: "Cetirizine 10mg",    type: "Tablet",      stock: 1200, price: 45,  status: "in_stock"  },
  { id: 4, name: "Azithromycin 500mg", type: "Tablet",      stock: 450,  price: 180, status: "in_stock"  },
  { id: 5, name: "Omeprazole 20mg",    type: "Capsule",     stock: 0,    price: 95,  status: "out_stock" },
  { id: 6, name: "Ibuprofen 400mg",    type: "Tablet",      stock: 900,  price: 55,  status: "in_stock"  },
];

const PATIENTS = [
  { id: "PAT-10042", name: "Rahul Verma",  age: 28, phone: "+91 9999999999", consults: 8, joined: "Jan 2026", status: "active" },
  { id: "PAT-10041", name: "Seema Joshi",  age: 45, phone: "+91 9888888888", consults: 3, joined: "Feb 2026", status: "active" },
  { id: "PAT-10040", name: "Aditya Kumar", age: 32, phone: "+91 9777777777", consults: 5, joined: "Jan 2026", status: "active" },
  { id: "PAT-10039", name: "Meena Singh",  age: 55, phone: "+91 9666666666", consults: 12,joined: "Dec 2025", status: "active" },
];

type Tab = "overview" | "doctors" | "orders" | "medicines" | "patients";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes countUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .slide-up{animation:slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both}
  .gc{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;transition:all 0.3s}
  .gc:hover{border-color:rgba(0,255,209,0.15)}
  .bm{display:flex;align-items:center;justify-content:center;gap:7px;padding:10px 16px;border-radius:12px;font-family:inherit;font-weight:700;font-size:12px;color:white;border:none;cursor:pointer;transition:all 0.3s;background:linear-gradient(135deg,#00C9A7,#0B6FCC);box-shadow:0 0 16px rgba(0,201,167,0.22)}
  .bm:hover{transform:translateY(-1px);box-shadow:0 0 24px rgba(0,201,167,0.38)}
  .bg{display:flex;align-items:center;justify-content:center;gap:7px;padding:9px 14px;border-radius:12px;font-family:inherit;font-weight:600;font-size:11px;color:#00FFD1;border:1px solid rgba(0,255,209,0.22);background:rgba(0,255,209,0.05);cursor:pointer;transition:all 0.3s}
  .bg:hover{background:rgba(0,255,209,0.1);border-color:rgba(0,255,209,0.45)}
  .br{display:flex;align-items:center;justify-content:center;gap:7px;padding:9px 14px;border-radius:12px;font-family:inherit;font-weight:600;font-size:11px;color:#FF6B6B;border:1px solid rgba(255,107,107,0.22);background:rgba(255,107,107,0.06);cursor:pointer;transition:all 0.3s}
  .br:hover{background:rgba(255,107,107,0.1);border-color:rgba(255,107,107,0.4)}
  .badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:100px;font-size:10px;font-weight:700}
  .stat-card{border-radius:16px;padding:14px;transition:all 0.3s;cursor:default}
  .stat-card:hover{transform:translateY(-2px)}
  .ni{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:10px 0;cursor:pointer;transition:all 0.2s;border:none;background:none;font-family:inherit;flex:1;border-top:2px solid transparent}
  .ni.on{border-top-color:#00FFD1}
  .livdot{width:7px;height:7px;border-radius:50%;background:#00FFD1;display:inline-block;position:relative;flex-shrink:0}
  .livdot::after{content:'';position:absolute;inset:-3px;border-radius:50%;background:rgba(0,255,209,0.3);animation:ripple 1.8s infinite}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
  .divider{height:1px;background:rgba(255,255,255,0.05);margin:10px 0}
  .si{width:100%;padding:9px 12px 9px 36px;border-radius:11px;font-family:inherit;font-size:12px;outline:none;transition:all 0.3s;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.07);color:#E8F4FF}
  .si::placeholder{color:rgba(232,244,255,0.28)}
  .si:focus{border-color:rgba(0,255,209,0.35)}
`;

export default function AdminDashboard() {
  const router  = useRouter();
  const [tab, setTab]           = useState<Tab>("overview");
  const [pendingDrs, setPendingDrs] = useState(PENDING_DOCTORS);
  const [orders, setOrders]     = useState(ORDERS);
  const [searchQ, setSearchQ]   = useState("");
  const [dispatchInput, setDispatchInput] = useState<Record<string,string>>({});

  const approveDoctor = (id: number) => setPendingDrs(p => p.filter(d => d.id !== id));
  const rejectDoctor  = (id: number) => setPendingDrs(p => p.filter(d => d.id !== id));

  const dispatchOrder = (orderId: string) => {
    const tracking = dispatchInput[orderId] || "DGD-TRK-" + Math.floor(10000 + Math.random() * 90000);
    setOrders(p => p.map(o => o.id === orderId ? { ...o, status: "dispatched", tracking } : o));
  };

  const statusColor = (s: string) =>
    s === "delivered" ? "#00FFD1" : s === "dispatched" ? "#FFB347" : s === "pending" ? "#FF6B6B" : "#4DB8FF";

  return (
    <div style={{
      position: "fixed", inset: 0, display: "flex", flexDirection: "column",
      background: "#020D1A", fontFamily: "'Plus Jakarta Sans',sans-serif",
      color: "#E8F4FF", maxWidth: 480, margin: "0 auto",
      left: "50%", transform: "translateX(-50%)",
    }}>
      <style>{S}</style>

      {/* HEADER */}
      <div style={{ flexShrink: 0, padding: "13px 18px 12px", background: "rgba(2,13,26,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "rgba(232,244,255,0.4)", fontSize: 11, marginBottom: 1 }}>Admin Panel</p>
            <h2 style={{ fontSize: 17, fontWeight: 800 }} className="shine">DigiDoc Control</h2>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {pendingDrs.length > 0 && (
              <div style={{ position: "relative" }}>
                <button onClick={() => setTab("doctors")} style={{ width: 36, height: 36, borderRadius: 11, background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer" }}>🔔</button>
                <div style={{ position: "absolute", top: -3, right: -3, width: 16, height: 16, borderRadius: "50%", background: "#FF6B6B", border: "2px solid #020D1A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "white" }}>{pendingDrs.length}</div>
              </div>
            )}
            <button onClick={() => router.push("/login")} style={{ padding: "7px 12px", borderRadius: 11, background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.18)", color: "#FF6B6B", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Sign Out</button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 18px" }} className="noscroll">

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="slide-up" style={{ paddingTop: 16, paddingBottom: 16 }}>

            {/* KPI Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
              {[
                { n: "248",    l: "Total Patients",  c: "#00FFD1", bg: "rgba(0,255,209,0.07)",  icon: "👥" },
                { n: "32",     l: "Active Doctors",  c: "#4DB8FF", bg: "rgba(77,184,255,0.07)", icon: "🩺" },
                { n: "₹1.24L", l: "Month Revenue",   c: "#A78BFA", bg: "rgba(167,139,250,0.07)",icon: "💰" },
                { n: "3",      l: "Pending Approval",c: "#FF6B6B", bg: "rgba(255,107,107,0.07)",icon: "⏳" },
              ].map(s => (
                <div key={s.l} className="stat-card" style={{ background: s.bg, border: `1px solid ${s.c}22` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <span style={{ fontSize: 22 }}>{s.icon}</span>
                    <span style={{ fontSize: 18, fontWeight: 900, color: s.c }}>{s.n}</span>
                  </div>
                  <p style={{ color: "rgba(232,244,255,0.5)", fontSize: 11 }}>{s.l}</p>
                </div>
              ))}
            </div>

            {/* Today stats */}
            <div className="gc" style={{ padding: 16, marginBottom: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(232,244,255,0.35)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Today at a Glance</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                {[
                  { n: "42",   l: "Consultations", c: "#00FFD1" },
                  { n: "18",   l: "Orders",         c: "#4DB8FF" },
                  { n: "₹12K", l: "Revenue",        c: "#A78BFA" },
                ].map(s => (
                  <div key={s.l} style={{ textAlign: "center", padding: "10px 6px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p style={{ fontWeight: 900, fontSize: 18, color: s.c }}>{s.n}</p>
                    <p style={{ fontSize: 9, color: "rgba(232,244,255,0.38)", marginTop: 2 }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending approvals alert */}
            {pendingDrs.length > 0 && (
              <div style={{ background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: 14, padding: "13px 15px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 20 }}>⚠️</span>
                  <div>
                    <p style={{ color: "#FF6B6B", fontWeight: 700, fontSize: 13 }}>{pendingDrs.length} Doctor Approvals Pending</p>
                    <p style={{ color: "rgba(255,107,107,0.6)", fontSize: 11, marginTop: 1 }}>Review and approve new doctors</p>
                  </div>
                </div>
                <button className="br" onClick={() => setTab("doctors")} style={{ padding: "6px 12px", fontSize: 11 }}>Review →</button>
              </div>
            )}

            {/* Pending orders */}
            <div className="gc" style={{ padding: 16, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(232,244,255,0.35)", textTransform: "uppercase", letterSpacing: 1 }}>Pending Orders</p>
                <button onClick={() => setTab("orders")} style={{ color: "#00FFD1", fontSize: 11, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>View All →</button>
              </div>
              {orders.filter(o => o.status === "pending").map(o => (
                <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 12, color: "#E8F4FF" }}>{o.id}</p>
                    <p style={{ color: "rgba(232,244,255,0.38)", fontSize: 10 }}>{o.patient} · ₹{o.amount}</p>
                  </div>
                  <button className="bm" style={{ padding: "6px 12px", fontSize: 11 }} onClick={() => setTab("orders")}>Dispatch</button>
                </div>
              ))}
              {orders.filter(o => o.status === "pending").length === 0 && (
                <p style={{ color: "rgba(232,244,255,0.28)", fontSize: 12, textAlign: "center", padding: "10px 0" }}>All orders dispatched ✓</p>
              )}
            </div>

            {/* Quick links */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { icon: "🩺", label: "Manage Doctors",   tab: "doctors"   as Tab },
                { icon: "📦", label: "Manage Orders",    tab: "orders"    as Tab },
                { icon: "💊", label: "Medicine Catalog", tab: "medicines" as Tab },
                { icon: "👥", label: "All Patients",     tab: "patients"  as Tab },
              ].map(q => (
                <button key={q.label} onClick={() => setTab(q.tab)} style={{ padding: "14px", borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{q.icon}</span>
                  <span style={{ fontWeight: 600, fontSize: 12, color: "#E8F4FF" }}>{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── DOCTORS ── */}
        {tab === "doctors" && (
          <div className="slide-up" style={{ paddingTop: 16, paddingBottom: 16 }}>
            {pendingDrs.length > 0 && (
              <>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#FF6B6B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>⏳ Pending Approval ({pendingDrs.length})</p>
                {pendingDrs.map(d => (
                  <div key={d.id} style={{ background: "rgba(255,107,107,0.05)", border: "1px solid rgba(255,107,107,0.18)", borderRadius: 16, padding: 16, marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 14, color: "#E8F4FF" }}>{d.name}</p>
                        <p style={{ color: "#00FFD1", fontSize: 12, fontWeight: 600 }}>{d.spec} · {d.exp}</p>
                      </div>
                      <p style={{ color: "rgba(232,244,255,0.3)", fontSize: 10 }}>Applied {d.submitted}</p>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                      {[d.deg, d.reg, d.phone].map(v => (
                        <span key={v} style={{ padding: "3px 10px", borderRadius: 100, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(232,244,255,0.6)", fontSize: 10 }}>{v}</span>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="bm" style={{ flex: 1 }} onClick={() => approveDoctor(d.id)}>✅ Approve</button>
                      <button className="br" style={{ flex: 1 }} onClick={() => rejectDoctor(d.id)}>❌ Reject</button>
                      <button className="bg" style={{ padding: "9px 14px" }}>📄 Docs</button>
                    </div>
                  </div>
                ))}
              </>
            )}

            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(232,244,255,0.35)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, marginTop: pendingDrs.length > 0 ? 8 : 0 }}>✅ Active Doctors (32)</p>
            {ACTIVE_DOCTORS.map(d => (
              <div key={d.id} className="gc" style={{ padding: "13px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, background: "rgba(0,255,209,0.07)", border: "1px solid rgba(0,255,209,0.14)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{d.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <p style={{ fontWeight: 700, fontSize: 13, color: "#E8F4FF" }}>{d.name}</p>
                    {d.online ? <span className="livdot" /> : <span style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "inline-block" }} />}
                  </div>
                  <p style={{ color: "rgba(232,244,255,0.4)", fontSize: 11 }}>{d.spec} · ⭐ {d.rating}</p>
                  <p style={{ color: "rgba(232,244,255,0.28)", fontSize: 10, marginTop: 1 }}>{d.patients} patients · Since {d.joined}</p>
                </div>
                <button className="br" style={{ padding: "5px 10px", fontSize: 10 }}>Block</button>
              </div>
            ))}
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === "orders" && (
          <div className="slide-up" style={{ paddingTop: 16, paddingBottom: 16 }}>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 16 }} className="noscroll">
              {["All", "Pending", "Dispatched", "Delivered"].map((f, fi) => (
                <button key={f} style={{ padding: "5px 14px", borderRadius: 100, flexShrink: 0, cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 600, background: fi === 0 ? "linear-gradient(135deg,#00C9A7,#0B6FCC)" : "rgba(255,255,255,0.04)", color: fi === 0 ? "white" : "rgba(232,244,255,0.45)", border: fi === 0 ? "none" : "1px solid rgba(255,255,255,0.08)" }}>{f}</button>
              ))}
            </div>

            {orders.map(o => (
              <div key={o.id} className="gc" style={{ padding: 16, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: "#E8F4FF" }}>{o.id}</p>
                    <p style={{ color: "rgba(232,244,255,0.4)", fontSize: 11, marginTop: 1 }}>{o.patient} · {o.items} items · {o.date}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "#00FFD1", fontWeight: 800, fontSize: 14 }}>₹{o.amount}</p>
                    <span className="badge" style={{ background: statusColor(o.status) + "18", color: statusColor(o.status), marginTop: 4, display: "inline-flex" }}>
                      {o.status === "pending" ? "⏳ Pending" : o.status === "dispatched" ? "🚚 Dispatched" : "✓ Delivered"}
                    </span>
                  </div>
                </div>

                {o.status === "pending" && (
                  <div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <input
                        placeholder="Enter tracking number (optional)"
                        value={dispatchInput[o.id] || ""}
                        onChange={e => setDispatchInput(p => ({ ...p, [o.id]: e.target.value }))}
                        style={{ flex: 1, padding: "9px 12px", borderRadius: 11, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)", color: "#E8F4FF", fontFamily: "inherit", fontSize: 12, outline: "none" }}
                      />
                    </div>
                    <button className="bm" style={{ width: "100%" }} onClick={() => dispatchOrder(o.id)}>
                      🚚 Mark as Dispatched
                    </button>
                  </div>
                )}

                {o.status === "dispatched" && (
                  <div style={{ background: "rgba(255,179,71,0.07)", border: "1px solid rgba(255,179,71,0.18)", borderRadius: 10, padding: "8px 12px", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "rgba(232,244,255,0.45)", fontSize: 11 }}>Tracking:</span>
                    <span style={{ color: "#FFB347", fontWeight: 700, fontSize: 11 }}>{o.tracking}</span>
                  </div>
                )}

                {o.status === "delivered" && o.tracking && (
                  <div style={{ background: "rgba(0,255,209,0.05)", border: "1px solid rgba(0,255,209,0.12)", borderRadius: 10, padding: "8px 12px", display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "rgba(232,244,255,0.45)", fontSize: 11 }}>Tracking:</span>
                    <span style={{ color: "#00FFD1", fontWeight: 700, fontSize: 11 }}>{o.tracking}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── MEDICINES ── */}
        {tab === "medicines" && (
          <div className="slide-up" style={{ paddingTop: 16, paddingBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800 }}>Medicine Catalog</h3>
              <button className="bm" style={{ padding: "7px 14px" }}>+ Add New</button>
            </div>

            {/* Stock alerts */}
            {MEDICINES.filter(m => m.status !== "in_stock").length > 0 && (
              <div style={{ background: "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.18)", borderRadius: 13, padding: "11px 14px", marginBottom: 14 }}>
                <p style={{ color: "#FF6B6B", fontWeight: 700, fontSize: 12, marginBottom: 4 }}>⚠️ Stock Alerts</p>
                {MEDICINES.filter(m => m.status !== "in_stock").map(m => (
                  <p key={m.id} style={{ color: "rgba(255,107,107,0.7)", fontSize: 11 }}>
                    {m.name} — {m.status === "out_stock" ? "OUT OF STOCK" : `Low: ${m.stock} units`}
                  </p>
                ))}
              </div>
            )}

            {MEDICINES.map(m => (
              <div key={m.id} className="gc" style={{ padding: "13px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: "#E8F4FF", marginBottom: 3 }}>{m.name}</p>
                  <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                    <span style={{ padding: "2px 8px", borderRadius: 100, background: "rgba(77,184,255,0.1)", border: "1px solid rgba(77,184,255,0.18)", color: "#4DB8FF", fontSize: 10, fontWeight: 600 }}>{m.type}</span>
                    <span style={{ color: "rgba(232,244,255,0.4)", fontSize: 11 }}>₹{m.price}</span>
                    <span style={{ color: m.status === "in_stock" ? "#00FFD1" : m.status === "low_stock" ? "#FFB347" : "#FF6B6B", fontSize: 10, fontWeight: 600 }}>
                      {m.status === "in_stock" ? `${m.stock} in stock` : m.status === "low_stock" ? `Low: ${m.stock}` : "Out of stock"}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="bg" style={{ padding: "6px 10px", fontSize: 10 }}>✏️</button>
                  <button className="br" style={{ padding: "6px 10px", fontSize: 10 }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── PATIENTS ── */}
        {tab === "patients" && (
          <div className="slide-up" style={{ paddingTop: 16, paddingBottom: 16 }}>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none" }}>🔍</span>
              <input className="si" placeholder="Search patient by name or ID..." value={searchQ} onChange={e => setSearchQ(e.target.value)} />
            </div>

            {PATIENTS.filter(p => p.name.toLowerCase().includes(searchQ.toLowerCase()) || p.id.includes(searchQ)).map(p => (
              <div key={p.id} className="gc" style={{ padding: 14, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13, color: "#E8F4FF" }}>{p.name}</p>
                    <p style={{ color: "rgba(232,244,255,0.4)", fontSize: 11, marginTop: 1 }}>Age {p.age} · {p.phone}</p>
                    <p style={{ color: "rgba(232,244,255,0.28)", fontSize: 10, marginTop: 1 }}>{p.id} · Joined {p.joined}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className="badge" style={{ background: "rgba(0,255,209,0.08)", color: "#00FFD1", marginBottom: 4, display: "block" }}>Active</span>
                    <p style={{ color: "#4DB8FF", fontSize: 11, fontWeight: 600 }}>{p.consults} consults</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="bg" style={{ flex: 1 }}>📋 View Records</button>
                  <button className="br" style={{ flex: 1 }}>Block</button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* BOTTOM NAV */}
      <div style={{ flexShrink: 0, display: "flex", background: "rgba(2,13,26,0.97)", backdropFilter: "blur(24px)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        {([
          { t: "overview"  as Tab, icon: "📊", label: "Overview"  },
          { t: "doctors"   as Tab, icon: "🩺", label: "Doctors"   },
          { t: "orders"    as Tab, icon: "📦", label: "Orders"    },
          { t: "medicines" as Tab, icon: "💊", label: "Medicines" },
          { t: "patients"  as Tab, icon: "👥", label: "Patients"  },
        ] as {t:Tab,icon:string,label:string}[]).map(n => (
          <button key={n.t} className={"ni" + (tab === n.t ? " on" : "")} onClick={() => setTab(n.t)}
            style={{ color: tab === n.t ? "#00FFD1" : "rgba(232,244,255,0.3)", position: "relative" }}>
            {n.t === "doctors" && pendingDrs.length > 0 && (
              <div style={{ position: "absolute", top: 6, right: "20%", width: 8, height: 8, borderRadius: "50%", background: "#FF6B6B" }} />
            )}
            <span style={{ fontSize: 17 }}>{n.icon}</span>
            <span style={{ fontSize: 8, fontWeight: tab === n.t ? 700 : 500 }}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
