"use client";
export default function Support() {
  const S = `*{box-sizing:border-box;margin:0;padding:0}html,body{height:100%;overflow:hidden}@keyframes sh{0%{background-position:-200% center}to{background-position:200% center}}.sh{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:sh 3s linear infinite}.ns::-webkit-scrollbar{display:none}.ns{-ms-overflow-style:none;scrollbar-width:none}`;
  return (
    <div style={{position:"fixed",inset:0,background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#E8F4FF",display:"flex",flexDirection:"column"}}>
      <style>{S}</style>
      <div style={{flexShrink:0,padding:"14px 18px",background:"rgba(2,13,26,.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.06)",display:"flex",alignItems:"center",gap:12}}>
        <a href="/dashboard" style={{color:"#00FFD1",fontSize:13,fontWeight:600,textDecoration:"none"}}>← Back</a>
        <h2 style={{fontSize:16,fontWeight:800}} className="sh">Help & Support</h2>
      </div>
      <div className="ns" style={{flex:1,overflowY:"auto",padding:"20px 18px"}}>
        {[{q:"How to consult a doctor?",a:"Go to Doctors tab, select a doctor, tap Video Call or Audio Call."},{q:"How to get prescription?",a:"After consultation, doctor will send prescription to your Rx section."},{q:"How to order medicines?",a:"Go to Medicines section, add to cart, checkout with address."},{q:"Refund policy?",a:"Full refund if doctor doesn't join within 5 minutes."},{q:"Technical issues?",a:"Email us at support@pmcare.org or call +91 9999999999"}].map((f,i)=>(
          <details key={i} style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:13,marginBottom:8,padding:"14px 16px"}}>
            <summary style={{fontWeight:600,fontSize:13,color:"#E8F4FF",cursor:"pointer",listStyle:"none"}}>{f.q}</summary>
            <p style={{color:"rgba(232,244,255,.5)",fontSize:12,lineHeight:1.7,marginTop:10}}>{f.a}</p>
          </details>
        ))}
        <div style={{background:"rgba(0,255,209,.05)",border:"1px solid rgba(0,255,209,.15)",borderRadius:14,padding:16,marginTop:12}}>
          <p style={{fontWeight:700,fontSize:14,color:"#E8F4FF",marginBottom:8}}>Contact Us</p>
          <p style={{color:"rgba(232,244,255,.5)",fontSize:12}}>📧 support@pmcare.org</p>
          <p style={{color:"rgba(232,244,255,.5)",fontSize:12,marginTop:4}}>📱 +91 9999999999</p>
          <p style={{color:"rgba(232,244,255,.5)",fontSize:12,marginTop:4}}>⏰ 9 AM – 9 PM, Mon–Sat</p>
        </div>
      </div>
    </div>
  );
}
