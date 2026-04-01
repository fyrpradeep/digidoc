"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const RX = {
  id: "RX-2041",
  date: "31 March 2026",
  time: "11:30 AM",
  doctor: { name: "Dr. Priya Sharma", spec: "General Physician", reg: "MCI-448291", exp: "12 yrs", rating: 4.9, avatar: "👩‍⚕️" },
  patient: { name: "Rahul Verma", age: 28, gender: "Male", id: "PAT-10042", phone: "+91 9999999999" },
  diagnosis: "Acute Upper Respiratory Tract Infection",
  notes: "Patient presented with fever (100.4°F), cough, and runny nose for 2 days. No signs of bacterial infection. Viral etiology suspected. Advised rest and adequate hydration.",
  medicines: [
    { name: "Paracetamol 500mg",  type: "Tablet",       dose: "1-0-1", days: 5,  timing: "After food",    price: 35,  total: 175  },
    { name: "Cetirizine 10mg",    type: "Tablet",       dose: "0-0-1", days: 7,  timing: "Before sleep",  price: 45,  total: 315  },
    { name: "Vitamin C 1000mg",   type: "Effervescent", dose: "1-0-0", days: 10, timing: "Morning",       price: 150, total: 1500 },
    { name: "Amoxicillin 500mg",  type: "Capsule",      dose: "1-1-1", days: 5,  timing: "After food",    price: 120, total: 1800 },
  ],
  advice: [
    "Take complete rest for 2-3 days",
    "Drink at least 8-10 glasses of water daily",
    "Avoid cold drinks and ice cream",
    "If fever exceeds 103°F, visit emergency immediately",
    "Follow up after 5 days if not improving",
  ],
  fees: { consultation: 299, medicines: 3790, delivery: 49 },
  status: "Delivered",
  trackingNo: "DGD-TRK-88412",
};

const TRACK_STEPS = [
  { label: "Order Placed",      done: true,  time: "11:35 AM" },
  { label: "Payment Confirmed", done: true,  time: "11:36 AM" },
  { label: "Dispatched",        done: true,  time: "2:15 PM"  },
  { label: "Out for Delivery",  done: true,  time: "5:40 PM"  },
  { label: "Delivered",         done: true,  time: "6:22 PM"  },
];

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes slideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  .slide-up{animation:slideUp 0.45s cubic-bezier(0.22,1,0.36,1) both}
  .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .gc{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:18px;padding:16px;margin-bottom:14px}
  .bm{display:flex;align-items:center;justify-content:center;gap:8px;padding:14px;border-radius:14px;font-family:inherit;font-weight:700;font-size:14px;color:white;border:none;cursor:pointer;transition:all 0.3s;background:linear-gradient(135deg,#00C9A7,#0B6FCC);box-shadow:0 0 20px rgba(0,201,167,0.28);text-decoration:none}
  .bm:hover{transform:translateY(-1px);box-shadow:0 0 30px rgba(0,201,167,0.42)}
  .bg{display:flex;align-items:center;justify-content:center;gap:8px;padding:13px;border-radius:14px;font-family:inherit;font-weight:600;font-size:13px;color:#00FFD1;border:1px solid rgba(0,255,209,0.25);background:rgba(0,255,209,0.05);cursor:pointer;transition:all 0.3s;text-decoration:none}
  .bg:hover{background:rgba(0,255,209,0.1);border-color:rgba(0,255,209,0.45)}
  .badge{display:inline-flex;align-items:center;padding:4px 10px;border-radius:100px;font-size:10px;font-weight:700}
  .divider{height:1px;background:rgba(255,255,255,0.06);margin:12px 0}
  .tab-btn{flex:1;padding:10px;border:none;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;transition:all 0.2s;border-bottom:2px solid transparent}
  .tab-btn.on{border-bottom-color:#00FFD1;color:#00FFD1}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
  .livdot{width:7px;height:7px;border-radius:50%;background:#00FFD1;display:inline-block;position:relative}
  .livdot::after{content:'';position:absolute;inset:-3px;border-radius:50%;background:rgba(0,255,209,0.3);animation:ripple 1.8s infinite}
`;

type Tab = "rx" | "order" | "invoice";

export default function PrescriptionPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("rx");

  const medTotal  = RX.medicines.reduce((s, m) => s + m.total, 0);
  const grandTotal = RX.fees.consultation + RX.fees.delivery + medTotal;

  return (
    <div style={{
      position: "fixed", inset: 0, display: "flex", flexDirection: "column",
      background: "#020D1A", fontFamily: "'Plus Jakarta Sans',sans-serif",
      color: "#E8F4FF", maxWidth: 480, margin: "0 auto",
      left:0, right:0,
    }}>
      <style>{S}</style>

      {/* HEADER */}
      <div style={{ flexShrink: 0, padding: "13px 18px 0", background: "rgba(2,13,26,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#00FFD1", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>← Back</button>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800 }}>{RX.id}</h2>
            <p style={{ color: "rgba(232,244,255,0.4)", fontSize: 11, marginTop: 1 }}>{RX.date} · {RX.time}</p>
          </div>
          <span className="badge" style={{ background: "rgba(0,255,209,0.1)", color: "#00FFD1" }}>✓ {RX.status}</span>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex" }}>
          {([["rx","📋 Prescription"],["order","📦 Order"],["invoice","💳 Invoice"]] as [Tab,string][]).map(([t,l]) => (
            <button key={t} className={"tab-btn" + (tab === t ? " on" : "")}
              onClick={() => setTab(t)}
              style={{ color: tab === t ? "#00FFD1" : "rgba(232,244,255,0.35)", background: "none" }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px" }} className="noscroll">

        {/* ── PRESCRIPTION TAB ── */}
        {tab === "rx" && (
          <div className="slide-up">
            {/* DigiDoc Header */}
            <div style={{ background: "linear-gradient(135deg,rgba(0,201,167,0.12),rgba(11,111,204,0.15))", border: "1px solid rgba(0,255,209,0.18)", borderRadius: 18, padding: 18, marginBottom: 14, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(0,255,209,0.05)", pointerEvents: "none" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 900 }} className="shine">DigiDoc</p>
                  <p style={{ color: "rgba(232,244,255,0.4)", fontSize: 11 }}>Digital Health Platform</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: "rgba(232,244,255,0.4)", fontSize: 10 }}>Prescription ID</p>
                  <p style={{ color: "#00FFD1", fontWeight: 700, fontSize: 13 }}>{RX.id}</p>
                  <p style={{ color: "rgba(232,244,255,0.35)", fontSize: 10, marginTop: 2 }}>{RX.date}</p>
                </div>
              </div>

              {/* Doctor + Patient */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 12, padding: "10px 12px" }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(232,244,255,0.35)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Doctor</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                    <span style={{ fontSize: 18 }}>{RX.doctor.avatar}</span>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 11, color: "#E8F4FF" }}>{RX.doctor.name}</p>
                      <p style={{ color: "#00FFD1", fontSize: 9, fontWeight: 600 }}>{RX.doctor.spec}</p>
                    </div>
                  </div>
                  <p style={{ color: "rgba(232,244,255,0.35)", fontSize: 9 }}>Reg: {RX.doctor.reg}</p>
                </div>
                <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 12, padding: "10px 12px" }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(232,244,255,0.35)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>Patient</p>
                  <p style={{ fontWeight: 700, fontSize: 11, color: "#E8F4FF", marginBottom: 2 }}>{RX.patient.name}</p>
                  <p style={{ color: "rgba(232,244,255,0.45)", fontSize: 9 }}>Age: {RX.patient.age} · {RX.patient.gender}</p>
                  <p style={{ color: "rgba(232,244,255,0.35)", fontSize: 9, marginTop: 2 }}>ID: {RX.patient.id}</p>
                </div>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="gc">
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(232,244,255,0.35)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Diagnosis</p>
              <p style={{ fontWeight: 700, color: "#E8F4FF", fontSize: 14, marginBottom: 8 }}>Dx: {RX.diagnosis}</p>
              <p style={{ color: "rgba(232,244,255,0.5)", fontSize: 12, lineHeight: 1.7 }}>{RX.notes}</p>
            </div>

            {/* Medicines */}
            <div className="gc">
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(232,244,255,0.35)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Medicines Prescribed</p>
              {RX.medicines.map((m, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: 13, color: "#E8F4FF", marginBottom: 3 }}>{m.name}</p>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ padding: "2px 8px", borderRadius: 100, background: "rgba(77,184,255,0.1)", border: "1px solid rgba(77,184,255,0.2)", color: "#4DB8FF", fontSize: 10, fontWeight: 600 }}>{m.type}</span>
                        <span style={{ padding: "2px 8px", borderRadius: 100, background: "rgba(0,255,209,0.08)", border: "1px solid rgba(0,255,209,0.15)", color: "#00FFD1", fontSize: 10, fontWeight: 600 }}>{m.dose}</span>
                        <span style={{ padding: "2px 8px", borderRadius: 100, background: "rgba(255,179,71,0.08)", border: "1px solid rgba(255,179,71,0.15)", color: "#FFB347", fontSize: 10, fontWeight: 600 }}>{m.days} days</span>
                      </div>
                      <p style={{ color: "rgba(232,244,255,0.35)", fontSize: 10, marginTop: 3 }}>{m.timing}</p>
                    </div>
                    <p style={{ color: "#00FFD1", fontWeight: 700, fontSize: 13 }}>₹{m.price}</p>
                  </div>
                  {i < RX.medicines.length - 1 && <div className="divider" />}
                </div>
              ))}
            </div>

            {/* Advice */}
            <div className="gc">
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(232,244,255,0.35)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Doctor's Advice</p>
              {RX.advice.map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: i < RX.advice.length - 1 ? 8 : 0 }}>
                  <span style={{ color: "#00FFD1", fontSize: 12, marginTop: 1, flexShrink: 0 }}>•</span>
                  <p style={{ color: "rgba(232,244,255,0.65)", fontSize: 12, lineHeight: 1.6 }}>{a}</p>
                </div>
              ))}
            </div>

            {/* Digital signature */}
            <div style={{ background: "rgba(0,255,209,0.04)", border: "1px solid rgba(0,255,209,0.12)", borderRadius: 14, padding: "12px 16px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ color: "rgba(232,244,255,0.4)", fontSize: 10, marginBottom: 2 }}>Digitally Signed by</p>
                <p style={{ fontWeight: 700, fontSize: 13, color: "#E8F4FF" }}>{RX.doctor.name}</p>
                <p style={{ color: "#00FFD1", fontSize: 10, fontWeight: 600 }}>{RX.doctor.spec} · Reg: {RX.doctor.reg}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span className="badge" style={{ background: "rgba(0,255,209,0.1)", color: "#00FFD1" }}>✓ Verified</span>
                <p style={{ color: "rgba(232,244,255,0.3)", fontSize: 9, marginTop: 4 }}>{RX.date} · {RX.time}</p>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <button className="bm" style={{ flex: 1 }} onClick={() => setTab("order")}>📦 Track Order</button>
              <button className="bg" style={{ flex: 1 }} onClick={() => setTab("invoice")}>💳 Invoice</button>
            </div>
          </div>
        )}

        {/* ── ORDER TRACKING TAB ── */}
        {tab === "order" && (
          <div className="slide-up">
            {/* Tracking number */}
            <div style={{ background: "rgba(0,255,209,0.06)", border: "1px solid rgba(0,255,209,0.18)", borderRadius: 16, padding: "14px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ color: "rgba(232,244,255,0.4)", fontSize: 11, marginBottom: 2 }}>Tracking Number</p>
                <p style={{ color: "#00FFD1", fontWeight: 800, fontSize: 15 }}>{RX.trackingNo}</p>
              </div>
              <span className="badge" style={{ background: "rgba(0,255,209,0.1)", color: "#00FFD1", fontSize: 12 }}>✓ Delivered</span>
            </div>

            {/* Timeline */}
            <div className="gc" style={{ padding: "18px 16px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(232,244,255,0.35)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Delivery Timeline</p>
              {TRACK_STEPS.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 14, position: "relative" }}>
                  {/* Line connector */}
                  {i < TRACK_STEPS.length - 1 && (
                    <div style={{ position: "absolute", left: 10, top: 22, width: 2, height: 36, background: s.done ? "rgba(0,255,209,0.4)" : "rgba(255,255,255,0.08)" }} />
                  )}
                  {/* Dot */}
                  <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, background: s.done ? "linear-gradient(135deg,#00C9A7,#0B6FCC)" : "rgba(255,255,255,0.06)", border: `1.5px solid ${s.done ? "rgba(0,255,209,0.5)" : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "white", fontWeight: 700 }}>
                    {s.done ? "✓" : ""}
                  </div>
                  <div style={{ paddingBottom: i < TRACK_STEPS.length - 1 ? 22 : 0, flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 13, color: s.done ? "#E8F4FF" : "rgba(232,244,255,0.3)" }}>{s.label}</p>
                    {s.done && <p style={{ color: "#00FFD1", fontSize: 10, marginTop: 2 }}>{s.time} · {RX.date}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Medicines ordered */}
            <div className="gc">
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(232,244,255,0.35)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Medicines Ordered</p>
              {RX.medicines.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: i < RX.medicines.length - 1 ? 10 : 0, marginBottom: i < RX.medicines.length - 1 ? 10 : 0, borderBottom: i < RX.medicines.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 12, color: "#E8F4FF" }}>{m.name}</p>
                    <p style={{ color: "rgba(232,244,255,0.35)", fontSize: 10, marginTop: 1 }}>{m.days} days supply · ₹{m.price}/unit</p>
                  </div>
                  <p style={{ color: "#00FFD1", fontWeight: 700, fontSize: 12 }}>₹{m.total}</p>
                </div>
              ))}
            </div>

            <button className="bm" style={{ width: "100%" }} onClick={() => setTab("rx")}>📋 View Prescription</button>
          </div>
        )}

        {/* ── INVOICE TAB ── */}
        {tab === "invoice" && (
          <div className="slide-up">
            {/* Invoice header */}
            <div style={{ background: "linear-gradient(135deg,rgba(0,201,167,0.1),rgba(11,111,204,0.14))", border: "1px solid rgba(0,255,209,0.15)", borderRadius: 18, padding: 18, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 900 }} className="shine">DigiDoc</p>
                  <p style={{ color: "rgba(232,244,255,0.4)", fontSize: 11 }}>Tax Invoice</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: "#00FFD1", fontWeight: 700, fontSize: 13 }}>INV-{RX.id}</p>
                  <p style={{ color: "rgba(232,244,255,0.35)", fontSize: 10 }}>{RX.date}</p>
                </div>
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 10 }}>
                <p style={{ color: "rgba(232,244,255,0.4)", fontSize: 10, marginBottom: 2 }}>Billed to</p>
                <p style={{ fontWeight: 700, fontSize: 13, color: "#E8F4FF" }}>{RX.patient.name}</p>
                <p style={{ color: "rgba(232,244,255,0.4)", fontSize: 11 }}>{RX.patient.phone} · ID: {RX.patient.id}</p>
              </div>
            </div>

            {/* Line items */}
            <div className="gc">
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(232,244,255,0.35)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Itemized Bill</p>

              {/* Consultation */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 12, color: "#E8F4FF" }}>Consultation Fee</p>
                  <p style={{ color: "rgba(232,244,255,0.35)", fontSize: 10, marginTop: 1 }}>{RX.doctor.name} · {RX.doctor.spec}</p>
                </div>
                <p style={{ color: "#E8F4FF", fontWeight: 600, fontSize: 12 }}>₹{RX.fees.consultation}</p>
              </div>

              <div className="divider" />

              {/* Medicines */}
              {RX.medicines.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: 12, color: "rgba(232,244,255,0.75)" }}>{m.name}</p>
                    <p style={{ color: "rgba(232,244,255,0.3)", fontSize: 10 }}>{m.type} · {m.days} days · ₹{m.price}/unit</p>
                  </div>
                  <p style={{ color: "rgba(232,244,255,0.65)", fontSize: 12 }}>₹{m.total}</p>
                </div>
              ))}

              <div className="divider" />

              {/* Delivery */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <p style={{ color: "rgba(232,244,255,0.5)", fontSize: 12 }}>Delivery Charges</p>
                <p style={{ color: "rgba(232,244,255,0.5)", fontSize: 12 }}>₹{RX.fees.delivery}</p>
              </div>

              <div className="divider" />

              {/* Total */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <p style={{ fontWeight: 800, fontSize: 15, color: "#E8F4FF" }}>Total Amount</p>
                <p style={{ fontWeight: 900, fontSize: 18, color: "#00FFD1" }}>₹{grandTotal.toLocaleString()}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <p style={{ color: "rgba(232,244,255,0.35)", fontSize: 11 }}>Payment Status</p>
                <span className="badge" style={{ background: "rgba(0,255,209,0.1)", color: "#00FFD1" }}>✓ Paid</span>
              </div>
            </div>

            {/* Download */}
            <button className="bm" style={{ width: "100%", marginBottom: 10 }}>⬇️ Download Invoice PDF</button>
            <button className="bg" style={{ width: "100%", display: "flex" }} onClick={() => setTab("rx")}>📋 View Prescription</button>
          </div>
        )}

      </div>
    </div>
  );
}
