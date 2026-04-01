"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIES = ["All","Fever","Antibiotics","Allergy","Vitamins","Pain Relief","Digestive","Heart","Diabetes","Skin"];

const MEDICINES = [
  { id:1,  name:"Paracetamol 500mg",   brand:"Calpol",    cat:"Fever",      price:35,  mrp:42,  qty:"10 Tablets",   rx:false, inStock:true,  rating:4.8, sold:12400 },
  { id:2,  name:"Amoxicillin 500mg",   brand:"Amoxil",    cat:"Antibiotics",price:120, mrp:145, qty:"10 Capsules",  rx:true,  inStock:true,  rating:4.7, sold:8200  },
  { id:3,  name:"Cetirizine 10mg",     brand:"Zyrtec",    cat:"Allergy",    price:45,  mrp:55,  qty:"10 Tablets",   rx:false, inStock:true,  rating:4.6, sold:9800  },
  { id:4,  name:"Vitamin C 1000mg",    brand:"Limcee",    cat:"Vitamins",   price:150, mrp:175, qty:"10 Tablets",   rx:false, inStock:true,  rating:4.9, sold:21000 },
  { id:5,  name:"Ibuprofen 400mg",     brand:"Brufen",    cat:"Pain Relief",price:55,  mrp:65,  qty:"15 Tablets",   rx:false, inStock:true,  rating:4.5, sold:7600  },
  { id:6,  name:"Omeprazole 20mg",     brand:"Omez",      cat:"Digestive",  price:95,  mrp:110, qty:"10 Capsules",  rx:false, inStock:false, rating:4.7, sold:6100  },
  { id:7,  name:"Azithromycin 500mg",  brand:"Zithromax", cat:"Antibiotics",price:180, mrp:210, qty:"3 Tablets",    rx:true,  inStock:true,  rating:4.8, sold:5400  },
  { id:8,  name:"Metformin 500mg",     brand:"Glycomet",  cat:"Diabetes",   price:85,  mrp:100, qty:"20 Tablets",   rx:true,  inStock:true,  rating:4.6, sold:4800  },
  { id:9,  name:"Atorvastatin 10mg",   brand:"Lipitor",   cat:"Heart",      price:140, mrp:165, qty:"10 Tablets",   rx:true,  inStock:true,  rating:4.7, sold:3900  },
  { id:10, name:"Clotrimazole Cream",  brand:"Canesten",  cat:"Skin",       price:110, mrp:130, qty:"15g Tube",     rx:false, inStock:true,  rating:4.5, sold:6700  },
  { id:11, name:"Montelukast 10mg",    brand:"Singulair", cat:"Allergy",    price:220, mrp:260, qty:"10 Tablets",   rx:true,  inStock:true,  rating:4.8, sold:4200  },
  { id:12, name:"Vitamin D3 60000IU",  brand:"Calcirol",  cat:"Vitamins",   price:95,  mrp:115, qty:"4 Capsules",   rx:false, inStock:true,  rating:4.9, sold:15800 },
];

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  html,body{height:100%;overflow:hidden;}
  @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes ripple{0%{transform:scale(0.8);opacity:1}100%{transform:scale(2.2);opacity:0}}
  @keyframes shimmerH{0%{background-position:-200% center}100%{background-position:200% center}}
  .slide-up{animation:slideUp 0.4s cubic-bezier(0.22,1,0.36,1) both}
  .mc{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:14px;transition:all 0.3s;cursor:pointer}
  .mc:hover{border-color:rgba(0,255,209,0.2);background:rgba(0,255,209,0.04);transform:translateY(-2px)}
  .mc:active{transform:scale(0.98)}
  .bm{display:flex;align-items:center;justify-content:center;gap:7px;padding:9px 14px;border-radius:11px;font-family:inherit;font-weight:700;font-size:12px;color:white;border:none;cursor:pointer;transition:all 0.3s;background:linear-gradient(135deg,#00C9A7,#0B6FCC);box-shadow:0 0 14px rgba(0,201,167,0.22)}
  .bm:hover{transform:translateY(-1px);box-shadow:0 0 22px rgba(0,201,167,0.38)}
  .bm:disabled{opacity:0.5;cursor:not-allowed;transform:none}
  .bg{display:flex;align-items:center;justify-content:center;gap:7px;padding:9px 14px;border-radius:11px;font-family:inherit;font-weight:600;font-size:12px;color:#00FFD1;border:1px solid rgba(0,255,209,0.22);background:rgba(0,255,209,0.05);cursor:pointer;transition:all 0.3s}
  .bg:hover{background:rgba(0,255,209,0.1);border-color:rgba(0,255,209,0.42)}
  .filter-chip{padding:6px 14px;border-radius:100px;cursor:pointer;font-family:inherit;font-size:11px;font-weight:600;transition:all 0.2s;flex-shrink:0;border:1.5px solid}
  .badge{display:inline-flex;align-items:center;padding:2px 8px;border-radius:100px;font-size:9px;font-weight:700}
  .inp{width:100%;padding:11px 14px 11px 38px;border-radius:13px;font-family:inherit;font-size:13px;outline:none;transition:all 0.3s;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.08);color:#E8F4FF}
  .inp::placeholder{color:rgba(232,244,255,0.28)}
  .inp:focus{border-color:rgba(0,255,209,0.4);background:rgba(0,255,209,0.03)}
  .cart-btn{position:relative;width:36px;height:36px;border-radius:11px;background:rgba(0,255,209,0.08);border:1px solid rgba(0,255,209,0.2);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;transition:all 0.2s;flex-shrink:0}
  .cart-btn:hover{background:rgba(0,255,209,0.14);border-color:rgba(0,255,209,0.4)}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
`;

export default function MedicinesPage() {
  const router = useRouter();
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart]         = useState<number[]>([]);
  const [sort, setSort]         = useState("popular");

  const addToCart = (id: number) => {
    if (!cart.includes(id)) setCart(p => [...p, id]);
  };

  const filtered = MEDICINES
    .filter(m => category === "All" || m.cat === category)
    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.brand.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "popular" ? b.sold - a.sold : sort === "price_low" ? a.price - b.price : sort === "price_high" ? b.price - a.price : b.rating - a.rating);

  const discount = (m: typeof MEDICINES[0]) => Math.round((1 - m.price / m.mrp) * 100);

  return (
    <div style={{ position:"fixed",inset:0,display:"flex",flexDirection:"column", background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#E8F4FF",maxWidth:480,margin:"0 auto", left:0,right:0 }}>
      <style>{S}</style>

      {/* HEADER */}
      <div style={{flexShrink:0,padding:"13px 18px 12px",background:"rgba(2,13,26,0.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <button onClick={()=>router.back()} style={{background:"none",border:"none",color:"#00FFD1",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>← Back</button>
          <h2 style={{flex:1,fontSize:16,fontWeight:800}}>Medicines</h2>
          <button className="cart-btn" onClick={()=>router.push("/order")}>
            🛒
            {cart.length > 0 && <span style={{position:"absolute",top:-4,right:-4,width:16,height:16,borderRadius:"50%",background:"#FF6B6B",border:"2px solid #020D1A",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800,color:"white"}}>{cart.length}</span>}
          </button>
        </div>

        {/* Search */}
        <div style={{position:"relative",marginBottom:12}}>
          <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:14,pointerEvents:"none"}}>🔍</span>
          <input className="inp" placeholder="Search medicines or brands..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>

        {/* Category filter */}
        <div style={{display:"flex",gap:7,overflowX:"auto"}} className="noscroll">
          {CATEGORIES.map(c=>(
            <button key={c} className="filter-chip" onClick={()=>setCategory(c)} style={{borderColor:category===c?"rgba(0,255,209,0.5)":"rgba(255,255,255,0.08)",background:category===c?"rgba(0,255,209,0.08)":"rgba(255,255,255,0.03)",color:category===c?"#00FFD1":"rgba(232,244,255,0.45)"}}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{flex:1,overflowY:"auto",padding:"12px 18px"}} className="noscroll">

        {/* Sort + count row */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <p style={{color:"rgba(232,244,255,0.4)",fontSize:12}}>{filtered.length} medicines</p>
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{padding:"5px 10px",borderRadius:9,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(232,244,255,0.7)",fontFamily:"inherit",fontSize:11,outline:"none",cursor:"pointer"}}>
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>

        {/* Prescription notice */}
        <div style={{background:"rgba(255,179,71,0.06)",border:"1px solid rgba(255,179,71,0.15)",borderRadius:12,padding:"9px 13px",marginBottom:14,display:"flex",gap:8,alignItems:"center"}}>
          <span style={{fontSize:16}}>⚠️</span>
          <p style={{color:"rgba(255,179,71,0.8)",fontSize:11,lineHeight:1.5}}>
            <strong style={{color:"#FFB347"}}>Rx medicines</strong> require a valid prescription. Order from your prescription page for faster checkout.
          </p>
        </div>

        {/* Medicine list */}
        {filtered.length === 0 ? (
          <div style={{textAlign:"center",padding:"48px 0"}}>
            <p style={{fontSize:44,marginBottom:10}}>💊</p>
            <p style={{fontWeight:700,fontSize:15,color:"#E8F4FF",marginBottom:4}}>No medicines found</p>
            <p style={{color:"rgba(232,244,255,0.35)",fontSize:12}}>Try a different search or category</p>
          </div>
        ) : (
          filtered.map(m => (
            <div key={m.id} className="mc">
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                {/* Icon */}
                <div style={{width:50,height:50,borderRadius:14,background:"rgba(0,255,209,0.07)",border:"1px solid rgba(0,255,209,0.14)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>💊</div>

                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:3}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap",marginBottom:2}}>
                        <p style={{fontWeight:700,fontSize:13,color:"#E8F4FF"}}>{m.name}</p>
                        {m.rx && <span className="badge" style={{background:"rgba(255,107,107,0.12)",color:"#FF6B6B"}}>Rx</span>}
                        {!m.inStock && <span className="badge" style={{background:"rgba(255,255,255,0.07)",color:"rgba(232,244,255,0.4)"}}>Out of Stock</span>}
                      </div>
                      <p style={{color:"rgba(232,244,255,0.38)",fontSize:10}}>{m.brand} · {m.qty} · ⭐ {m.rating}</p>
                    </div>
                  </div>

                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <p style={{fontWeight:800,fontSize:15,color:"#00FFD1"}}>₹{m.price}</p>
                      <p style={{color:"rgba(232,244,255,0.28)",fontSize:11,textDecoration:"line-through"}}>₹{m.mrp}</p>
                      <span style={{padding:"2px 7px",borderRadius:100,background:"rgba(0,255,209,0.1)",color:"#00FFD1",fontSize:10,fontWeight:700}}>{discount(m)}% off</span>
                    </div>
                    <div style={{display:"flex",gap:7}}>
                      {cart.includes(m.id) ? (
                        <button className="bg" style={{padding:"6px 12px",fontSize:11}} onClick={()=>router.push("/order")}>
                          ✓ In Cart
                        </button>
                      ) : (
                        <button className="bm" disabled={!m.inStock} onClick={()=>addToCart(m.id)} style={{padding:"7px 14px",fontSize:11}}>
                          {m.inStock ? "+ Add" : "Unavailable"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CART FOOTER */}
      {cart.length > 0 && (
        <div style={{flexShrink:0,padding:"11px 18px 16px",background:"rgba(2,13,26,0.97)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
          <button className="bm" style={{width:"100%",padding:"13px",fontSize:14}} onClick={()=>router.push("/order")}>
            🛒 View Cart · {cart.length} items · ₹{cart.reduce((s,id)=>{const m=MEDICINES.find(x=>x.id===id);return s+(m?.price||0);},0)}
          </button>
        </div>
      )}
    </div>
  );
}
