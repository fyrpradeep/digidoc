"use client";
export default function About() {
  const S = `*{box-sizing:border-box;margin:0;padding:0}html,body{height:100%;overflow:hidden}@keyframes sh{0%{background-position:-200% center}to{background-position:200% center}}.sh{background:linear-gradient(90deg,#00FFD1,#4DB8FF,#00FFD1);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:sh 3s linear infinite}.ns::-webkit-scrollbar{display:none}.ns{-ms-overflow-style:none;scrollbar-width:none}`;
  return (
    <div style={{position:"fixed",inset:0,background:"#020D1A",fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#E8F4FF",display:"flex",flexDirection:"column"}}>
      <style>{S}</style>
      <div style={{flexShrink:0,padding:"14px 18px",background:"rgba(2,13,26,.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.06)",display:"flex",alignItems:"center",gap:12}}>
        <a href="/" style={{color:"#00FFD1",fontSize:13,fontWeight:600,textDecoration:"none"}}>← Back</a>
        <h2 style={{fontSize:16,fontWeight:800}} className="sh">About DigiDoc</h2>
      </div>
      <div className="ns" style={{flex:1,overflowY:"auto",padding:"20px 18px"}}>
        <div style={{textAlign:"center",padding:"20px 0 24px"}}>
          <div style={{fontSize:48,marginBottom:12}}>💊</div>
          <h1 style={{fontSize:22,fontWeight:900,marginBottom:8}} className="sh">DigiDoc</h1>
          <p style={{color:"rgba(232,244,255,.5)",fontSize:13,lineHeight:1.8}}>Bringing quality healthcare to every Indian household through technology.</p>
        </div>
        {[{t:"Our Mission",c:"Make quality healthcare accessible and affordable for every Indian, regardless of location."},{t:"Who We Are",c:"DigiDoc is a telemedicine platform connecting verified doctors with patients via live video consultations."},{t:"Our Promise",c:"Every doctor on DigiDoc is MCI-verified. We ensure the highest standards of medical care."},{t:"Privacy First",c:"Your health data is encrypted and never shared with third parties. We follow all data protection laws."},{t:"Compliance",c:"DigiDoc follows Telemedicine Practice Guidelines 2020 by the Government of India."}].map(s=>(
          <div key={s.t} style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:14,padding:16,marginBottom:10}}>
            <p style={{fontWeight:700,fontSize:14,color:"#E8F4FF",marginBottom:6}}>{s.t}</p>
            <p style={{color:"rgba(232,244,255,.5)",fontSize:12,lineHeight:1.7}}>{s.c}</p>
          </div>
        ))}
        <p style={{color:"rgba(232,244,255,.2)",fontSize:11,textAlign:"center",marginTop:16}}>© 2026 DigiDoc · pmcare.org</p>
      </div>
    </div>
  );
}
