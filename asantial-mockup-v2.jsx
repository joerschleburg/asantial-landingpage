import { useState, useEffect } from "react";

const msgs = [
  { role:"user", text:"Ich brauche Argumente für die Geschäftsführung. Warum sollten wir in Employer Branding investieren?", delay:0 },
  { role:"assistant", app:"Businessargumente", color:"#c9a227", delay:500,
    text:"Hier sind drei Argumente, die in Ihrer Situation wirken:",
    items:[
      { label:"Rekrutierungskosten", text:"Unbesetzte Stellen kosten im Mittelstand durchschnittlich 14.900 € pro Monat – strukturiertes Employer Branding reduziert Time-to-Hire um 34%." },
      { label:"Bindungseffekt", text:"Unternehmen mit klarer Arbeitgebermarke verlieren 28% weniger Mitarbeitende in den ersten 2 Jahren." },
      { label:"GF-Formulierung", text:"„Wir investieren nicht in Werbung, sondern in Entscheidungssicherheit bei der Personalgewinnung."" },
    ]
  },
  { role:"user", text:"Kannst du das als One-Pager aufbereiten – für das nächste Führungsmeeting?", delay:1400 },
  { role:"assistant", app:"Projektmanager", color:"#7b77e0", delay:2200,
    text:"One-Pager erstellt. Struktur: Ausgangslage → 3 Kernargumente → Empfehlung. PDF-Export verfügbar.",
    tag:"Dokument bereit"
  },
];

function Dot({ color }) {
  return <div style={{ width:5, height:5, borderRadius:"50%", background: color, flexShrink:0 }} />;
}

function TypingBubble() {
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:8 }}>
      <div style={{ width:22, height:22, borderRadius:"50%", background:"#7b77e0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:700, color:"#fff", flexShrink:0 }}>KI</div>
      <div style={{ background:"#f0ece8", borderRadius:"16px 16px 16px 4px", padding:"12px 16px", display:"flex", gap:4 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{
            width:5, height:5, borderRadius:"50%", background:"rgba(37,23,42,0.25)",
            animation:`bounce 1.2s ease-in-out ${i*0.2}s infinite`
          }}/>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [visible, setVisible] = useState([]);
  const [typing, setTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!started) return;
    let ts = [];
    msgs.forEach(m => {
      if (m.role === "assistant") {
        ts.push(setTimeout(() => setTyping(true), m.delay));
        ts.push(setTimeout(() => { setTyping(false); setVisible(v => [...v, m]); }, m.delay + 700));
      } else {
        ts.push(setTimeout(() => setVisible(v => [...v, m]), m.delay));
      }
    });
    ts.push(setTimeout(() => setDone(true), 3400));
    return () => ts.forEach(clearTimeout);
  }, [started]);

  const replay = () => { setVisible([]); setTyping(false); setDone(false); setTimeout(() => setStarted(s => !s), 50); setTimeout(() => setStarted(s => !s), 100); };

  const navItems = [
    { icon:"⊞", label:"App-Bibliothek", box:true },
    { icon:"≡", label:"Projektmanager" },
    { icon:"◈", label:"Start- und Navigations-App", active:true },
    { icon:"↗", label:"Roadmap" },
  ];

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:"#f0ece8", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .qbtn:hover { background: rgba(37,23,42,0.05) !important; }
        .navitem:hover { background: rgba(37,23,42,0.05) !important; }
      `}</style>

      <div style={{ display:"flex", borderRadius:18, overflow:"hidden", width:"100%", maxWidth:840, boxShadow:"0 24px 60px rgba(37,23,42,0.18), 0 0 0 1px rgba(37,23,42,0.08)", minHeight:500 }}>

        {/* Sidebar */}
        <div style={{ width:205, flexShrink:0, background:"#e8e4de", borderRight:"1px solid rgba(37,23,42,0.08)", display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"18px 16px 14px", borderBottom:"1px solid rgba(37,23,42,0.07)" }}>
            <div style={{ fontSize:13, fontWeight:800, letterSpacing:"0.1em", color:"#25172a" }}>ASANTIAL</div>
            <div style={{ fontSize:9, color:"rgba(37,23,42,0.38)", letterSpacing:"0.05em", marginTop:1 }}>by VonVorteil</div>
          </div>
          <div style={{ padding:"10px 16px 6px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:11, fontWeight:600, color:"rgba(37,23,42,0.45)" }}>KI Apps</span>
            <span style={{ fontSize:15, color:"rgba(37,23,42,0.35)", lineHeight:1 }}>+</span>
          </div>
          <div style={{ padding:"4px 8px", flex:1 }}>
            {navItems.map(item => (
              <div key={item.label} className="navitem" style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 8px", borderRadius:8, marginBottom:2, cursor:"pointer", background: item.active ? "rgba(37,23,42,0.09)" : "transparent" }}>
                {item.box
                  ? <div style={{ width:26, height:26, borderRadius:6, background:"rgba(37,23,42,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"rgba(37,23,42,0.55)", flexShrink:0 }}>{item.icon}</div>
                  : <span style={{ fontSize:13, color:"rgba(37,23,42,0.38)", width:18, flexShrink:0, textAlign:"center" }}>{item.icon}</span>
                }
                <span style={{ fontSize:11, flex:1, lineHeight:1.3, color: item.active ? "#25172a" : "rgba(37,23,42,0.5)", fontWeight: item.active ? 500 : 400 }}>{item.label}</span>
                {!item.box && <span style={{ fontSize:10, color:"rgba(37,23,42,0.2)" }}>✏</span>}
              </div>
            ))}
          </div>
          <div style={{ padding:"11px 16px", borderTop:"1px solid rgba(37,23,42,0.08)", display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:26, height:26, borderRadius:"50%", background:"linear-gradient(135deg,#8a6aa4,#a3a0ff)", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:"white" }}>JS</div>
            <span style={{ fontSize:11, color:"#25172a", fontWeight:500 }}>Jörg Schleburg</span>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", background:"#ffffff", overflow:"hidden" }}>
          <div style={{ padding:"0 22px", height:46, borderBottom:"1px solid rgba(37,23,42,0.06)", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
            <span style={{ fontSize:13, fontWeight:600, color:"#25172a" }}>Start- und Navigations-App</span>
            <span style={{ fontSize:17, color:"rgba(37,23,42,0.28)" }}>···</span>
          </div>

          {/* Chat */}
          <div style={{ flex:1, overflowY:"auto", padding:"20px 22px 10px", display:"flex", flexDirection:"column", gap:13 }}>
            {!started ? (
              <div>
                <div style={{ fontSize:20, fontWeight:700, color:"#25172a", marginBottom:4 }}>Hallo, Jörg Schleburg</div>
                <div style={{ fontSize:13, color:"rgba(37,23,42,0.42)", marginBottom:18 }}>Wie kann ich dir heute helfen?</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {["Ich brauche Argumente für die GF","Ich brauche Social Content","Ich brauche eine EVP","Hilfe vom Projektmanager","Ich bin neu hier, wie loslegen?"].map(s => (
                    <button key={s} className="qbtn" onClick={() => setStarted(true)} style={{ padding:"7px 12px", borderRadius:8, border:"1px solid rgba(37,23,42,0.12)", background:"transparent", cursor:"pointer", fontSize:11, color:"#25172a", fontFamily:"inherit", transition:"background 0.15s" }}>{s}</button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {visible.map((m, i) => (
                  <div key={i} style={{ display:"flex", flexDirection: m.role==="user" ? "row-reverse" : "row", alignItems:"flex-end", gap:8, animation:"fadeUp 0.35s ease" }}>
                    {m.role === "assistant" && (
                      <div style={{ width:22, height:22, borderRadius:"50%", background:m.color, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:700, color:"#fff" }}>KI</div>
                    )}
                    <div style={{ maxWidth:"73%", padding:"10px 13px", fontSize:12, lineHeight:1.65, borderRadius: m.role==="user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.role==="user" ? "#25172a" : "#f0ece8", color: m.role==="user" ? "#fcfaf9" : "#25172a" }}>
                      {m.role==="assistant" && (
                        <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.09em", textTransform:"uppercase", marginBottom:7, color:m.color, display:"flex", alignItems:"center", gap:4 }}>
                          <Dot color={m.color}/>{m.app}
                        </div>
                      )}
                      <div>{m.text}</div>
                      {m.items && (
                        <div style={{ marginTop:8, display:"flex", flexDirection:"column", gap:6 }}>
                          {m.items.map((item,j) => (
                            <div key={j} style={{ background:"rgba(37,23,42,0.05)", borderRadius:8, padding:"7px 10px", borderLeft:`2px solid ${m.color}` }}>
                              <div style={{ fontSize:10, fontWeight:700, marginBottom:2 }}>{item.label}</div>
                              <div style={{ fontSize:11, color:"rgba(37,23,42,0.62)", lineHeight:1.5 }}>{item.text}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      {m.tag && (
                        <div style={{ display:"inline-flex", alignItems:"center", gap:4, marginTop:9, padding:"3px 9px", borderRadius:20, background:"rgba(123,119,224,0.12)", fontSize:10, color:"#7b77e0", fontWeight:600 }}>✓ {m.tag}</div>
                      )}
                    </div>
                  </div>
                ))}
                {typing && <TypingBubble/>}
                {done && (
                  <div style={{ display:"flex", justifyContent:"center" }}>
                    <button onClick={replay} style={{ padding:"6px 18px", borderRadius:20, border:"1px solid rgba(37,23,42,0.12)", background:"transparent", cursor:"pointer", fontSize:11, color:"rgba(37,23,42,0.42)", fontFamily:"inherit" }}>↺ Erneut abspielen</button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input */}
          <div style={{ padding:"10px 18px 13px", flexShrink:0, borderTop:"1px solid rgba(37,23,42,0.06)" }}>
            <div style={{ border:"1px solid rgba(37,23,42,0.12)", borderRadius:12, background:"#fff", overflow:"hidden" }}>
              <div style={{ padding:"10px 13px", fontSize:12, color:"rgba(37,23,42,0.3)", minHeight:34 }}>Hier eingeben...</div>
              <div style={{ padding:"6px 10px", display:"flex", alignItems:"center", justifyContent:"space-between", borderTop:"1px solid rgba(37,23,42,0.06)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <span style={{ fontSize:12, color:"rgba(37,23,42,0.45)" }}>◈</span>
                  <span style={{ fontSize:11, fontWeight:500, color:"rgba(37,23,42,0.6)" }}>Start- und Navigations-App</span>
                  <span style={{ fontSize:11, color:"rgba(37,23,42,0.28)" }}>∨</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:13, color:"rgba(37,23,42,0.28)" }}>🎤</span>
                  <div style={{ width:26, height:26, borderRadius:6, background:"rgba(37,23,42,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"rgba(37,23,42,0.4)" }}>▶</div>
                </div>
              </div>
            </div>
            <div style={{ textAlign:"center", marginTop:6, fontSize:9, color:"rgba(37,23,42,0.22)" }}>Die KI kann Fehler machen. Erwäge, wichtige Informationen zu überprüfen.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
