"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// ── TODO: Replace with your Razorpay Key ID when ready ──
// const RAZORPAY_KEY_ID = "rzp_test_XXXXXXXXXX";

const CART_MEDICINES = [
  { id: 1, name: "Paracetamol 500mg",  type: "Tablet",       dose: "1-0-1", days: 5,  price: 35,  qty: 10, prescribed: true  },
  { id: 2, name: "Cetirizine 10mg",    type: "Tablet",       dose: "0-0-1", days: 7,  price: 45,  qty: 7,  prescribed: true  },
  { id: 3, name: "Vitamin C 1000mg",   type: "Effervescent", dose: "1-0-0", days: 10, price: 150, qty: 10, prescribed: true  },
  { id: 4, name: "Amoxicillin 500mg",  type: "Capsule",      dose: "1-1-1", days: 5,  price: 120, qty: 15, prescribed: true  },
];

const ADDRESSES = [
  { id: 1, label: "Home",   address: "42, Shanti Nagar, Near Bus Stand, Indore, MP - 452001",  default: true  },
  { id: 2, label: "Office", address: "Plot 12, IT Park, Sector 5, Indore, MP - 452010",         default: false },
];

type Step = "cart" | "address" | "payment" | "success";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes checkPop{0%{transform:scale(0)}60%{transform:scale(1.2)}100%{transform:scale(1)}}
  @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
  .slide-up{animation:slideUp 0.45s cubic-bezier(0.22,1,0.36,1) both}
  .shine{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmerH 3s linear infinite}
  .gc{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;transition:all 0.3s}
  .gc:hover{border-color:rgba(0,255,209,0.15)}
  .bm{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:15px;border-radius:14px;font-family:inherit;font-weight:800;font-size:15px;color:white;border:none;cursor:pointer;transition:all 0.3s;background:linear-gradient(135deg,#00C9A7,#0B6FCC);box-shadow:0 0 24px rgba(0,201,167,0.3)}
  .bm:hover{transform:translateY(-2px);box-shadow:0 0 36px rgba(0,201,167,0.45)}
  .bm:active{transform:scale(0.98)}
  .bm:disabled{opacity:0.5;cursor:not-allowed;transform:none}
  .bg{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:13px;border-radius:14px;font-family:inherit;font-weight:600;font-size:13px;color:#00FFD1;border:1px solid rgba(0,255,209,0.25);background:rgba(0,255,209,0.05);cursor:pointer;transition:all 0.3s}
  .bg:hover{background:rgba(0,255,209,0.1);border-color:rgba(0,255,209,0.45)}
  .addr-card{border-radius:15px;padding:14px 16px;cursor:pointer;transition:all 0.2s;border:1.5px solid}
  .addr-card:active{transform:scale(0.98)}
  .pay-card{border-radius:15px;padding:14px 16px;cursor:pointer;transition:all 0.2s;border:1.5px solid;display:flex;align-items:center;gap:12px}
  .pay-card:active{transform:scale(0.97)}
  .loader{width:22px;height:22px;border:3px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;animation:spin 0.8s linear infinite;display:inline-block}
  .badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:100px;font-size:10px;font-weight:700}
  .prog{height:4px;border-radius:100px;background:rgba(255,255,255,0.07);overflow:hidden}
  .prog-fill{height:100%;border-radius:100px;background:linear-gradient(90deg,#00C9A7,#0B6FCC);transition:width 0.5s ease}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
  .check-pop{animation:checkPop 0.5s cubic-bezier(0.22,1,0.36,1) both}
  .livdot{width:7px;height:7px;border-radius:50%;background:#00FFD1;display:inline-block;position:relative}
  .livdot::after{content:'';position:absolute;inset:-3px;border-radius:50%;background:rgba(0,255,209,0.3);animation:ripple 1.8s infinite}
`;

export default function OrderPage() {
  const router = useRouter();
  const [step, setStep]         = useState<Step>("cart");
  const [cart, setCart]         = useState(CART_MEDICINES);
  const [selAddr, setSelAddr]   = useState(1);
  const [selPay, setSelPay]     = useState("upi");
  const [upiId, setUpiId]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [orderId, setOrderId]   = useState("");

  const subtotal  = cart.reduce((s, m) => s + m.price * m.qty, 0);
  const delivery  = subtotal > 500 ? 0 : 49;
  const discount  = Math.floor(subtotal * 0.05);
  const total     = subtotal + delivery - discount;

  const removeItem = (id: number) => setCart(p => p.filter(m => m.id !== id));

  const progress = step === "cart" ? 33 : step === "address" ? 66 : step === "payment" ? 90 : 100;

  // ── TODO: Replace this mock with real Razorpay payment ──
  // When Razorpay key is ready:
  // 1. Load Razorpay script: const script = document.createElement("script"); script.src = "https://checkout.razorpay.com/v1/checkout.js";
  // 2. Create order on backend: POST /api/payment/create-order { amount: total * 100 }
  // 3. Open Razorpay checkout with options
  // 4. On success: verify payment signature on backend
  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      const id = "ORD-" + Math.floor(9000 + Math.random() * 1000);
      setOrderId(id);
      setLoading(false);
      setStep("success");
    }, 2500);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, display: "flex", flexDirection: "column",
      background: "#020D1A", fontFamily: "'Plus Jakarta Sans',sans-serif",
      color: "#E8F4FF", maxWidth: 480, margin: "0 auto",
      left:0, right:0,
    }}>
      <style>{S}</style>

      {/* HEADER */}
      {step !== "success" && (
        <div style={{ flexShrink: 0, padding: "13px 18px 12px", background: "rgba(2,13,26,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <button onClick={() => step === "cart" ? router.back() : setStep(step === "address" ? "cart" : "address")}
              style={{ background: "none", border: "none", color: "#00FFD1", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>← Back</button>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800 }}>
                {step === "cart" ? "Your Cart" : step === "address" ? "Delivery Address" : "Payment"}
              </h2>
            </div>
            <span style={{ color: "rgba(232,244,255,0.35)", fontSize: 11 }}>
              {step === "cart" ? "1/3" : step === "address" ? "2/3" : "3/3"}
            </span>
          </div>
          <div className="prog"><div className="prog-fill" style={{ width: progress + "%" }} /></div>
        </div>
      )}

      {/* CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", padding: step === "success" ? 0 : "14px 18px" }} className="noscroll">

        {/* ── STEP 1: CART ── */}
        {step === "cart" && (
          <div className="slide-up">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <span className="livdot" />
              <p style={{ color: "#00FFD1", fontSize: 12, fontWeight: 600 }}>Prescription: RX-2041 · Dr. Priya Sharma</p>
            </div>

            {cart.map(m => (
              <div key={m.id} className="gc" style={{ padding: "13px 14px", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <p style={{ fontWeight: 700, fontSize: 13, color: "#E8F4FF" }}>{m.name}</p>
                      {m.prescribed && <span className="badge" style={{ background: "rgba(0,255,209,0.08)", color: "#00FFD1" }}>Rx</span>}
                    </div>
                    <p style={{ color: "rgba(232,244,255,0.4)", fontSize: 11 }}>{m.type} · {m.dose} · {m.days} days</p>
                    <p style={{ color: "#00FFD1", fontWeight: 700, fontSize: 12, marginTop: 4 }}>₹{m.price} × {m.qty} = ₹{m.price * m.qty}</p>
                  </div>
                  <button onClick={() => removeItem(m.id)} style={{ background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.18)", borderRadius: 8, padding: "4px 8px", color: "#FF6B6B", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Remove</button>
                </div>
              </div>
            ))}

            {/* Price summary */}
            <div className="gc" style={{ padding: 16, marginBottom: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(232,244,255,0.35)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Price Summary</p>
              {[
                { l: "Subtotal",      v: `₹${subtotal}`,            c: "rgba(232,244,255,0.65)" },
                { l: "Delivery",      v: delivery === 0 ? "FREE" : `₹${delivery}`, c: delivery === 0 ? "#00FFD1" : "rgba(232,244,255,0.65)" },
                { l: "Discount (5%)", v: `-₹${discount}`,           c: "#00FFD1" },
              ].map(r => (
                <div key={r.l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <p style={{ color: "rgba(232,244,255,0.45)", fontSize: 12 }}>{r.l}</p>
                  <p style={{ color: r.c, fontSize: 12, fontWeight: 600 }}>{r.v}</p>
                </div>
              ))}
              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "8px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontWeight: 800, fontSize: 15, color: "#E8F4FF" }}>Total</p>
                <p style={{ fontWeight: 900, fontSize: 18, color: "#00FFD1" }}>₹{total}</p>
              </div>
              {delivery === 0 && <p style={{ color: "#00FFD1", fontSize: 10, marginTop: 5 }}>🎉 Free delivery on orders above ₹500</p>}
            </div>

            {/* Delivery estimate */}
            <div style={{ background: "rgba(77,184,255,0.06)", border: "1px solid rgba(77,184,255,0.15)", borderRadius: 12, padding: "11px 14px", marginBottom: 14, display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 20 }}>🚚</span>
              <div>
                <p style={{ color: "#4DB8FF", fontWeight: 700, fontSize: 12 }}>Estimated Delivery: Tomorrow</p>
                <p style={{ color: "rgba(77,184,255,0.6)", fontSize: 11 }}>Order before 6 PM for next-day delivery</p>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: ADDRESS ── */}
        {step === "address" && (
          <div className="slide-up">
            <p style={{ color: "rgba(232,244,255,0.45)", fontSize: 13, marginBottom: 18, lineHeight: 1.6 }}>
              Select where you want your medicines delivered.
            </p>

            {ADDRESSES.map(a => (
              <div key={a.id} className="addr-card" onClick={() => setSelAddr(a.id)} style={{ marginBottom: 12, borderColor: selAddr === a.id ? "rgba(0,255,209,0.5)" : "rgba(255,255,255,0.08)", background: selAddr === a.id ? "rgba(0,255,209,0.06)" : "rgba(255,255,255,0.03)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{a.label === "Home" ? "🏠" : "🏢"}</span>
                    <p style={{ fontWeight: 700, fontSize: 14, color: "#E8F4FF" }}>{a.label}</p>
                    {a.default && <span className="badge" style={{ background: "rgba(0,255,209,0.08)", color: "#00FFD1" }}>Default</span>}
                  </div>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selAddr === a.id ? "#00FFD1" : "rgba(255,255,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {selAddr === a.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00FFD1" }} />}
                  </div>
                </div>
                <p style={{ color: "rgba(232,244,255,0.5)", fontSize: 12, lineHeight: 1.6 }}>{a.address}</p>
              </div>
            ))}

            <button className="bg" style={{ marginTop: 4 }}>+ Add New Address</button>

            {/* Order summary */}
            <div className="gc" style={{ padding: 14, marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ color: "rgba(232,244,255,0.4)", fontSize: 11, marginBottom: 2 }}>Order Total</p>
                  <p style={{ fontWeight: 900, fontSize: 18, color: "#00FFD1" }}>₹{total}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: "rgba(232,244,255,0.4)", fontSize: 11, marginBottom: 2 }}>Items</p>
                  <p style={{ fontWeight: 700, fontSize: 14, color: "#E8F4FF" }}>{cart.length} medicines</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: PAYMENT ── */}
        {step === "payment" && (
          <div className="slide-up">
            <p style={{ color: "rgba(232,244,255,0.45)", fontSize: 13, marginBottom: 18 }}>
              Choose your payment method.
            </p>

            {/* Payment options */}
            {[
              { id: "upi",  icon: "📱", label: "UPI",         sub: "Google Pay, PhonePe, BHIM"     },
              { id: "card", icon: "💳", label: "Card",         sub: "Credit / Debit card"           },
              { id: "nb",   icon: "🏦", label: "Net Banking",  sub: "All major banks supported"     },
              { id: "cod",  icon: "💵", label: "Cash on Delivery", sub: "Pay when medicines arrive" },
            ].map(p => (
              <div key={p.id} className="pay-card" onClick={() => setSelPay(p.id)} style={{ marginBottom: 10, borderColor: selPay === p.id ? "rgba(0,255,209,0.5)" : "rgba(255,255,255,0.08)", background: selPay === p.id ? "rgba(0,255,209,0.06)" : "rgba(255,255,255,0.03)" }}>
                <span style={{ fontSize: 24 }}>{p.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: "#E8F4FF" }}>{p.label}</p>
                  <p style={{ color: "rgba(232,244,255,0.4)", fontSize: 11, marginTop: 1 }}>{p.sub}</p>
                </div>
                <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selPay === p.id ? "#00FFD1" : "rgba(255,255,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {selPay === p.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00FFD1" }} />}
                </div>
              </div>
            ))}

            {/* UPI input */}
            {selPay === "upi" && (
              <div style={{ marginTop: 8, marginBottom: 4 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(232,244,255,0.4)", marginBottom: 8 }}>Enter UPI ID</p>
                <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi"
                  style={{ width: "100%", padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)", color: "#E8F4FF", fontFamily: "inherit", fontSize: 13, outline: "none" }} />
              </div>
            )}

            {/* Final amount */}
            <div style={{ background: "rgba(0,255,209,0.06)", border: "1px solid rgba(0,255,209,0.15)", borderRadius: 14, padding: "14px 16px", marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <p style={{ color: "rgba(232,244,255,0.5)", fontSize: 12 }}>Medicines ({cart.length} items)</p>
                <p style={{ color: "rgba(232,244,255,0.65)", fontSize: 12 }}>₹{subtotal}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <p style={{ color: "rgba(232,244,255,0.5)", fontSize: 12 }}>Delivery</p>
                <p style={{ color: delivery === 0 ? "#00FFD1" : "rgba(232,244,255,0.65)", fontSize: 12 }}>{delivery === 0 ? "FREE" : `₹${delivery}`}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <p style={{ color: "#00FFD1", fontSize: 12 }}>Discount</p>
                <p style={{ color: "#00FFD1", fontSize: 12 }}>-₹{discount}</p>
              </div>
              <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "8px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontWeight: 800, fontSize: 15, color: "#E8F4FF" }}>Pay Now</p>
                <p style={{ fontWeight: 900, fontSize: 18, color: "#00FFD1" }}>₹{total}</p>
              </div>
            </div>

            {/* TODO comment for Razorpay */}
            <div style={{ background: "rgba(255,179,71,0.05)", border: "1px solid rgba(255,179,71,0.15)", borderRadius: 12, padding: "10px 14px", marginTop: 12 }}>
              <p style={{ color: "#FFB347", fontSize: 11, fontWeight: 600 }}>🔌 Razorpay Integration Pending</p>
              <p style={{ color: "rgba(255,179,71,0.6)", fontSize: 10, marginTop: 2 }}>Add your Razorpay Key ID in the TODO comment to activate real payments.</p>
            </div>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {step === "success" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px", textAlign: "center", animation: "slideUp 0.5s ease" }}>
            <div className="check-pop" style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg,rgba(0,201,167,0.2),rgba(11,111,204,0.2))", border: "2px solid rgba(0,255,209,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, marginBottom: 20 }}>✅</div>

            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }} className="shine">Order Placed!</h2>
            <p style={{ color: "#00FFD1", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{orderId}</p>
            <p style={{ color: "rgba(232,244,255,0.45)", fontSize: 13, lineHeight: 1.7, marginBottom: 24 }}>
              Your medicines are being prepared.<br />Expected delivery: <strong style={{ color: "#E8F4FF" }}>Tomorrow</strong>
            </p>

            {/* Order summary */}
            <div style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 16, marginBottom: 20 }}>
              {cart.map((m, i) => (
                <div key={m.id} style={{ display: "flex", justifyContent: "space-between", paddingBottom: i < cart.length - 1 ? 8 : 0, marginBottom: i < cart.length - 1 ? 8 : 0, borderBottom: i < cart.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <p style={{ color: "rgba(232,244,255,0.65)", fontSize: 12 }}>{m.name}</p>
                  <p style={{ color: "#00FFD1", fontSize: 12, fontWeight: 600 }}>₹{m.price * m.qty}</p>
                </div>
              ))}
              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "10px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontWeight: 700, color: "#E8F4FF", fontSize: 14 }}>Total Paid</p>
                <p style={{ fontWeight: 900, color: "#00FFD1", fontSize: 16 }}>₹{total}</p>
              </div>
            </div>

            {/* Delivery info */}
            <div style={{ width: "100%", background: "rgba(77,184,255,0.06)", border: "1px solid rgba(77,184,255,0.15)", borderRadius: 14, padding: "12px 16px", marginBottom: 24, display: "flex", gap: 10, alignItems: "center", textAlign: "left" }}>
              <span style={{ fontSize: 24 }}>📍</span>
              <div>
                <p style={{ color: "#4DB8FF", fontWeight: 700, fontSize: 12, marginBottom: 2 }}>Delivering to: Home</p>
                <p style={{ color: "rgba(77,184,255,0.6)", fontSize: 11 }}>42, Shanti Nagar, Indore, MP - 452001</p>
              </div>
            </div>

            <button className="bm" onClick={() => router.push("/dashboard")} style={{ marginBottom: 10 }}>🏠 Back to Home</button>
            <button className="bg" onClick={() => router.push("/prescription/RX-2041")}>📋 View Prescription</button>
          </div>
        )}
      </div>

      {/* BOTTOM BUTTON */}
      {step !== "success" && (
        <div style={{ flexShrink: 0, padding: "12px 18px 20px", background: "rgba(2,13,26,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {step === "cart" && (
            <button className="bm" disabled={cart.length === 0} onClick={() => setStep("address")}>
              Continue to Address →
            </button>
          )}
          {step === "address" && (
            <button className="bm" onClick={() => setStep("payment")}>
              Continue to Payment →
            </button>
          )}
          {step === "payment" && (
            <button className="bm" onClick={handlePayment} disabled={loading}>
              {loading ? <span className="loader" /> : `🔒 Pay ₹${total} Securely`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
