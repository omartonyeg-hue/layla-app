// LAYLA — Phase 05 Valet V2. Teal accent rail; "night driver you can trust."

const VT = window.LAYLA_TOKENS;
const VC = VT.color, VG = VT.gradient;
const VL = window.L;
const { Display: VD, Micro: VM, Body: VB, Button: VBn, Tag: VTg, Avatar: VAv } = VL;

// ── Phone ──────────────────────────────────────────────────────
const VPhone = ({ children, time='2:47 AM' }) => (
  <div style={{
    width: 375, height: 812, borderRadius: 44, overflow:'hidden',
    background: VC.bg.base, position:'relative',
    boxShadow:'0 40px 80px rgba(0,0,0,0.5), 0 0 0 2px #1a1a22, 0 0 0 3px #333',
  }}>
    <div style={{ position:'absolute', inset: 0, pointerEvents:'none',
      opacity: VT.effect.grainOpacity, backgroundImage: VT.effect.grain, zIndex: 50 }}/>
    <div style={{ position:'absolute', top: 14, left: 20, right: 20, zIndex: 45,
      display:'flex', justifyContent:'space-between', fontSize: 13,
      color: VC.text.primary, fontFamily: VT.type.family.mono, fontWeight: 600 }}>
      <span>{time}</span><span>●●● 72%</span>
    </div>
    <div style={{ position:'absolute', inset: 0, paddingTop: 44 }}>{children}</div>
  </div>
);

const VTabBar = ({ active='valet' }) => {
  const tabs = [
    { id:'events',    icon:'◐', label:'EVENTS' },
    { id:'parties',   icon:'▲', label:'PARTIES' },
    { id:'community', icon:'◎', label:'COMMUNITY' },
    { id:'valet',     icon:'▶', label:'VALET' },
    { id:'profile',   icon:'●', label:'PROFILE' },
  ];
  return (
    <div style={{ position:'absolute', bottom: 0, left: 0, right: 0,
      padding:'12px 16px 28px', background:'rgba(7,6,13,0.8)',
      backdropFilter:'blur(20px)', borderTop:'1px solid '+VC.stroke.soft,
      display:'flex', justifyContent:'space-around' }}>
      {tabs.map(t => {
        const on = t.id === active;
        const c = on ? VC.teal : VC.text.muted;
        return (
          <div key={t.id} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 4, flex: 1 }}>
            <span style={{ color: c, fontSize: 18 }}>{t.icon}</span>
            <span style={{ fontSize: 9, letterSpacing:'0.1em', fontFamily: VT.type.family.mono,
              color: c, fontWeight: on ? 700 : 500 }}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
};

// Reusable dark-map backdrop (SVG, roads + blocks)
const DarkMap = ({ children, height='55%' }) => (
  <div style={{ position:'relative', height, overflow:'hidden',
    background:'radial-gradient(ellipse at 50% 50%, #17171f 0%, #0b0b12 70%, #07060D 100%)' }}>
    <svg viewBox="0 0 375 500" preserveAspectRatio="xMidYMid slice"
      style={{ position:'absolute', inset: 0, width:'100%', height:'100%', opacity: 0.6 }}>
      {/* Blocks */}
      {Array.from({length: 28}).map((_, i) => {
        const x = (i*37 % 375), y = ((i*53) % 500);
        return <rect key={i} x={x} y={y} width="60" height="40" fill="#10101E" stroke="#1b1b27" strokeWidth="0.5"/>;
      })}
      {/* Roads */}
      <path d="M 0 260 Q 120 200, 200 220 T 400 260" stroke="#202032" strokeWidth="18" fill="none" strokeLinecap="round"/>
      <path d="M 0 260 Q 120 200, 200 220 T 400 260" stroke="#2a2a40" strokeWidth="2" fill="none" strokeDasharray="4 6"/>
      <path d="M 80 0 L 120 500" stroke="#202032" strokeWidth="14" fill="none"/>
      <path d="M 80 0 L 120 500" stroke="#2a2a40" strokeWidth="1.5" fill="none" strokeDasharray="3 8"/>
      <path d="M 250 0 L 290 500" stroke="#1c1c2a" strokeWidth="10" fill="none"/>
      {/* Nile / water */}
      <path d="M 0 450 Q 120 420, 200 440 T 400 420 L 400 500 L 0 500 Z" fill="#0d1d24"/>
    </svg>
    {children}
  </div>
);

// ── 01 BOOK ───────────────────────────────────────────────────
function Book() {
  return (
    <VPhone>
      <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'14px 20px 10px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <VM size="sm" color={VC.teal}>● LAYLA VALET · CAIRO</VM>
              <VD size="xs" style={{ marginTop: 2 }}>Book a drive</VD>
            </div>
            <button style={{ width: 40, height: 40, borderRadius:'50%',
              background: VC.bg.surface, border:'1px solid '+VC.stroke.soft,
              color: VC.text.primary, fontSize: 16 }}>?</button>
          </div>
        </div>

        <DarkMap height={180}>
          {/* Pickup / drop pins */}
          <div style={{ position:'absolute', top: 54, left: 80 }}>
            <div style={{ width: 16, height: 16, borderRadius:'50%', background: VC.teal,
              boxShadow:'0 0 0 6px rgba(0,229,200,0.2), 0 0 20px rgba(0,229,200,0.6)' }}/>
          </div>
          <div style={{ position:'absolute', bottom: 40, right: 70 }}>
            <div style={{ width: 16, height: 16, borderRadius: 3, background: VC.gold[500],
              boxShadow:'0 0 0 6px rgba(212,168,67,0.2)' }}/>
          </div>
          <svg viewBox="0 0 375 180" style={{ position:'absolute', inset: 0, width:'100%', height:'100%' }}>
            <path d="M 90 62 Q 200 70, 245 100 T 305 140" stroke={VC.teal} strokeWidth="2" fill="none" strokeDasharray="3 4"/>
          </svg>
          <div style={{ position:'absolute', top: 10, right: 12, padding:'6px 10px',
            borderRadius: VT.radius.pill, background: VC.scrim[60], backdropFilter:'blur(10px)',
            fontSize: 10, fontFamily: VT.type.family.mono, color: VC.text.primary, fontWeight: 700, letterSpacing:'0.1em' }}>
            ~ 22 MIN · 14 KM
          </div>
        </DarkMap>

        <div style={{ flex: 1, overflow:'hidden', padding:'14px 20px 100px' }}>
          {/* Route */}
          <div style={{ padding: 14, borderRadius: VT.radius.lg,
            background: VC.bg.surface, border:'1px solid '+VC.stroke.soft, marginBottom: 14 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 12, paddingBottom: 10,
              borderBottom:'1px dashed '+VC.stroke.mid }}>
              <div style={{ width: 10, height: 10, borderRadius:'50%', background: VC.teal,
                boxShadow:'0 0 10px '+VC.teal }}/>
              <div style={{ flex: 1 }}>
                <VM size="xs" color={VC.teal}>PICKUP · NOW</VM>
                <div style={{ color: VC.text.primary, fontSize: 13, fontWeight: 700, marginTop: 2 }}>
                  CJC Zamalek · 26th of July
                </div>
              </div>
              <span style={{ color: VC.text.muted, fontSize: 14 }}>›</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap: 12, paddingTop: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: VC.gold[500] }}/>
              <div style={{ flex: 1 }}>
                <VM size="xs" color={VC.gold[500]}>DROPOFF</VM>
                <div style={{ color: VC.text.primary, fontSize: 13, fontWeight: 700, marginTop: 2 }}>
                  Home · Maadi St. 9
                </div>
              </div>
              <span style={{ color: VC.text.muted, fontSize: 14 }}>›</span>
            </div>
          </div>

          {/* Car */}
          <VM size="sm" color={VC.text.muted} style={{ marginBottom: 8 }}>YOUR CAR</VM>
          <div style={{ padding: 12, borderRadius: VT.radius.md,
            background: VC.bg.surface, border:'1px solid '+VC.stroke.soft,
            display:'flex', alignItems:'center', gap: 12, marginBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: VT.radius.sm,
              background:'rgba(0,229,200,0.15)', border:'1px solid rgba(0,229,200,0.3)',
              display:'grid', placeItems:'center', color: VC.teal, fontSize: 18 }}>🚗</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: VC.text.primary, fontSize: 13, fontWeight: 700 }}>Mercedes C200 · Black</div>
              <div style={{ color: VC.text.muted, fontSize: 10, fontFamily: VT.type.family.mono, letterSpacing:'0.1em', marginTop: 2 }}>
                QAS 4718 · AUTOMATIC
              </div>
            </div>
            <span style={{ color: VC.teal, fontSize: 11, fontWeight: 700, letterSpacing:'0.1em' }}>EDIT</span>
          </div>

          {/* Fare */}
          <div style={{ padding: 14, borderRadius: VT.radius.md,
            background:'rgba(0,229,200,0.06)', border:'1px solid rgba(0,229,200,0.15)',
            display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <VM size="sm" color={VC.teal}>FARE · FLAT</VM>
              <div style={{ color: VC.text.muted, fontSize: 11, marginTop: 2 }}>No surge. Ever.</div>
            </div>
            <div style={{ fontFamily: VT.type.family.display, fontSize: 28, color: VC.teal,
              fontWeight: 900, letterSpacing:'0.02em' }}>
              220 <span style={{ fontSize: 12, fontFamily: VT.type.family.mono }}>EGP</span>
            </div>
          </div>
        </div>

        <div style={{ position:'absolute', bottom: 0, left: 0, right: 0, padding:'14px 20px 28px',
          background:'linear-gradient(180deg, transparent, rgba(7,6,13,0.95) 30%)' }}>
          <VBn variant="valet">ORDER VALET · 220 EGP →</VBn>
        </div>
      </div>
    </VPhone>
  );
}

// ── 02 FINDING (radar) ────────────────────────────────────────
function Finding() {
  return (
    <VPhone>
      <div style={{ height:'100%', display:'flex', flexDirection:'column',
        background:'radial-gradient(circle at 50% 40%, rgba(0,229,200,0.18), transparent 60%), #07060D' }}>
        <div style={{ padding:'14px 20px', textAlign:'center' }}>
          <VM size="sm" color={VC.teal}>FINDING A VALET</VM>
          <div style={{ fontFamily: VT.type.family.display, fontSize: 32, color: VC.text.primary,
            fontWeight: 900, letterSpacing:'0.02em', marginTop: 4 }}>
            SCANNING ZAMALEK…
          </div>
        </div>

        {/* Radar */}
        <div style={{ position:'relative', height: 340, display:'grid', placeItems:'center' }}>
          {/* Rings */}
          {[280, 220, 160, 100, 40].map((d, i) => (
            <div key={d} style={{
              position:'absolute', width: d, height: d, borderRadius:'50%',
              border:'1px solid '+VC.teal+'33',
              background: i === 4 ? 'rgba(0,229,200,0.2)' : 'transparent',
              animation: i === 0 ? 'pulse-ring 2s ease-out infinite' : 'none',
            }}/>
          ))}
          {/* Center chip */}
          <div style={{ position:'absolute', width: 44, height: 44, borderRadius: VT.radius.sm,
            background: VG.gold, display:'grid', placeItems:'center',
            fontFamily: VT.type.family.display, fontSize: 18, color: VC.text.inverse,
            fontWeight: 900, letterSpacing:'0.04em',
            boxShadow: VT.shadow.glowGold }}>L</div>

          {/* Scanned driver blips */}
          {[
            { top: '28%', left: '30%' },
            { top: '22%', right: '26%' },
            { bottom: '24%', left: '22%' },
            { bottom: '30%', right: '28%' },
          ].map((p, i) => (
            <div key={i} style={{
              position:'absolute', ...p, width: 10, height: 10, borderRadius:'50%',
              background: VC.teal, boxShadow:'0 0 12px '+VC.teal,
            }}/>
          ))}
        </div>

        <div style={{ padding:'0 20px', flex: 1, overflow:'hidden' }}>
          {/* Progress */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 6 }}>
              <VM size="xs" color={VC.text.muted}>AVG MATCH TIME · 47S</VM>
              <VM size="xs" color={VC.teal}>00:31</VM>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: VC.stroke.soft, overflow:'hidden' }}>
              <div style={{ width:'65%', height:'100%', background: VG.valet,
                boxShadow:'0 0 10px '+VC.teal }}/>
            </div>
          </div>

          {/* Drivers nearby list */}
          <VM size="sm" color={VC.text.muted} style={{ marginBottom: 8 }}>4 DRIVERS NEARBY · VETTED</VM>
          <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
            {[
              { n:'Ahmed M.', eta:'3 MIN · 1.2 KM', r: 4.9 },
              { n:'Karim H.', eta:'6 MIN · 2.4 KM', r: 5.0 },
              { n:'Tamer S.', eta:'9 MIN · 3.8 KM', r: 4.8 },
            ].map((d, i) => (
              <div key={i} style={{
                padding:'8px 12px', borderRadius: VT.radius.sm,
                background: i === 0 ? 'rgba(0,229,200,0.08)' : VC.bg.surface,
                border:'1px solid ' + (i === 0 ? VC.teal+'4D' : VC.stroke.soft),
                display:'flex', alignItems:'center', gap: 10,
              }}>
                <VAv size={28} color={VC.teal}>{d.n[0]}</VAv>
                <div style={{ flex: 1 }}>
                  <div style={{ color: VC.text.primary, fontSize: 12, fontWeight: 700 }}>{d.n}</div>
                  <div style={{ color: VC.text.muted, fontSize: 9, fontFamily: VT.type.family.mono, letterSpacing:'0.1em' }}>
                    ★ {d.r} · {d.eta}
                  </div>
                </div>
                {i === 0 && <VTg bg={VC.teal}>MATCHING</VTg>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding:'14px 20px 28px' }}>
          <button style={{ width:'100%', padding:'12px', borderRadius: VT.radius.md,
            background:'transparent', color: VC.rose, border:'1px solid '+VC.rose+'4D',
            fontSize: 11, fontWeight: 800, letterSpacing:'0.15em' }}>
            CANCEL SEARCH
          </button>
        </div>
      </div>
    </VPhone>
  );
}

// ── 03 LIVE TRACKING ──────────────────────────────────────────
function Tracking() {
  return (
    <VPhone>
      <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
        <DarkMap height={380}>
          {/* Top bar */}
          <div style={{ position:'absolute', top: 12, left: 16, right: 16, zIndex: 2,
            display:'flex', justifyContent:'space-between' }}>
            <button style={{ width: 40, height: 40, borderRadius:'50%', background: VC.scrim[60],
              backdropFilter:'blur(10px)', color: VC.text.primary, border:'none', fontSize: 18 }}>×</button>
            <div style={{ display:'flex', gap: 8 }}>
              <button style={{ padding:'10px 14px', borderRadius: VT.radius.pill,
                background: VC.scrim[60], backdropFilter:'blur(10px)',
                color: VC.text.primary, border:'none', fontSize: 11, fontWeight: 800, letterSpacing:'0.1em' }}>
                🛡 SOS
              </button>
            </div>
          </div>

          {/* Route path */}
          <svg viewBox="0 0 375 380" style={{ position:'absolute', inset: 0, width:'100%', height:'100%' }}>
            <path d="M 60 60 Q 160 120, 200 200 T 320 330" stroke={VC.teal}
              strokeWidth="3.5" fill="none" strokeLinecap="round"
              style={{ filter:'drop-shadow(0 0 6px '+VC.teal+')' }}/>
          </svg>

          {/* Dest pin */}
          <div style={{ position:'absolute', top: 44, left: 50 }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: VC.gold[500],
              boxShadow:'0 0 0 5px rgba(212,168,67,0.2)' }}/>
          </div>
          {/* Driver car */}
          <div style={{ position:'absolute', top: 150, left: 170 }}>
            <div style={{
              width: 40, height: 40, borderRadius:'50%',
              background: VG.valet, display:'grid', placeItems:'center',
              color: VC.text.inverse, fontSize: 20,
              boxShadow:'0 0 0 6px rgba(0,229,200,0.25), 0 0 20px rgba(0,229,200,0.6)',
            }}>🚗</div>
          </div>
          {/* You pin */}
          <div style={{ position:'absolute', bottom: 40, right: 60 }}>
            <div style={{
              width: 16, height: 16, borderRadius:'50%', background: VC.text.primary,
              border:'3px solid '+VC.teal,
              boxShadow:'0 0 0 6px rgba(0,229,200,0.2)',
            }}/>
          </div>

          {/* ETA pill */}
          <div style={{ position:'absolute', bottom: 12, left: '50%', transform:'translateX(-50%)',
            padding:'10px 18px', borderRadius: VT.radius.pill, background: VC.scrim[60],
            backdropFilter:'blur(20px)', border:'1px solid '+VC.stroke.gold,
            display:'flex', alignItems:'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: VC.teal,
              boxShadow: VT.shadow.glowTeal, animation:'pulse 1.6s infinite' }}/>
            <span style={{ color: VC.text.primary, fontSize: 12, fontWeight: 800, fontFamily: VT.type.family.mono, letterSpacing:'0.12em' }}>
              AHMED ARRIVING IN 3 MIN
            </span>
          </div>
        </DarkMap>

        {/* Bottom sheet */}
        <div style={{ flex: 1, padding:'20px 20px 100px', background: VC.bg.base,
          borderTopLeftRadius: VT.radius.xxl, borderTopRightRadius: VT.radius.xxl,
          marginTop: -24, border:'1px solid '+VC.stroke.soft, borderBottom:'none' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: VC.stroke.mid,
            margin:'0 auto 16px' }}/>

          {/* Driver card */}
          <div style={{ display:'flex', alignItems:'center', gap: 12, marginBottom: 18 }}>
            <div style={{ position:'relative' }}>
              <VAv size={52} color={VC.teal}>A</VAv>
              <div style={{ position:'absolute', bottom:-2, right:-2, width: 18, height: 18, borderRadius:'50%',
                background: VC.teal, border:'2px solid '+VC.bg.base,
                display:'grid', placeItems:'center', fontSize: 10, color: VC.text.inverse, fontWeight: 900 }}>✓</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: VC.text.primary, fontSize: 16, fontWeight: 700 }}>Ahmed M.</div>
              <div style={{ color: VC.text.muted, fontSize: 10, fontFamily: VT.type.family.mono, letterSpacing:'0.1em', marginTop: 2 }}>
                ★ 4.9 · 312 TRIPS · 3 YRS
              </div>
            </div>
            <div style={{ display:'flex', gap: 8 }}>
              {['💬','📞'].map((ic, i) => (
                <button key={i} style={{ width: 42, height: 42, borderRadius:'50%',
                  background:'rgba(0,229,200,0.1)', border:'1px solid '+VC.teal+'4D',
                  color: VC.teal, fontSize: 16 }}>{ic}</button>
              ))}
            </div>
          </div>

          {/* Vehicle pill */}
          <div style={{ padding: 12, borderRadius: VT.radius.md,
            background: VC.bg.surface, border:'1px solid '+VC.stroke.soft,
            display:'flex', alignItems:'center', gap: 12, marginBottom: 14 }}>
            <div style={{ color: VC.teal, fontSize: 18 }}>🚙</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: VC.text.primary, fontSize: 12, fontWeight: 700 }}>Ahmed's VW Polo · White</div>
              <div style={{ color: VC.text.muted, fontSize: 10, fontFamily: VT.type.family.mono, letterSpacing:'0.08em', marginTop: 1 }}>
                HE'LL ARRIVE IN HIS CAR · THEN DRIVE YOURS
              </div>
            </div>
            <div style={{ padding:'4px 10px', borderRadius: VT.radius.pill,
              background: VC.gold[500]+'26', border:'1px solid '+VC.gold[500],
              color: VC.gold[500], fontSize: 10, fontWeight: 800, letterSpacing:'0.1em' }}>B 4291</div>
          </div>
        </div>

        <div style={{ position:'absolute', bottom: 0, left: 0, right: 0, padding:'14px 20px 28px',
          background:'linear-gradient(180deg, transparent, rgba(7,6,13,0.95) 30%)' }}>
          <VBn variant="valet">SHARE LIVE TRIP →</VBn>
        </div>
      </div>
    </VPhone>
  );
}

// ── 04 TRIP COMPLETED ─────────────────────────────────────────
function Completed() {
  return (
    <VPhone>
      <div style={{ height:'100%', display:'flex', flexDirection:'column',
        background:'radial-gradient(circle at 50% 10%, rgba(0,229,200,0.15), transparent 60%), #07060D' }}>
        <div style={{ padding:'14px 20px 0', textAlign:'right' }}>
          <button style={{ width: 36, height: 36, borderRadius:'50%', background: VC.bg.surface,
            border:'1px solid '+VC.stroke.soft, color: VC.text.primary, fontSize: 14 }}>×</button>
        </div>

        <div style={{ padding:'12px 24px 100px', flex: 1, overflow:'hidden' }}>
          <div style={{ textAlign:'center', marginBottom: 24 }}>
            <div style={{ width: 72, height: 72, borderRadius:'50%',
              background:'rgba(0,229,200,0.15)', border:'2px solid '+VC.teal,
              boxShadow: VT.shadow.glowTeal, margin:'12px auto',
              display:'grid', placeItems:'center', color: VC.teal, fontSize: 28, fontWeight: 900 }}>✓</div>
            <VM size="sm" color={VC.teal}>DELIVERED · 3:18 AM</VM>
            <div style={{ fontFamily: VT.type.family.display, fontSize: 38, color: VC.text.primary,
              fontWeight: 900, lineHeight: 0.95, letterSpacing:'0.02em', marginTop: 6 }}>
              YOU'RE HOME.
            </div>
          </div>

          {/* Trip receipt */}
          <div style={{ padding: 16, borderRadius: VT.radius.lg,
            background: VC.bg.surface, border:'1px solid '+VC.stroke.soft, marginBottom: 14 }}>
            {/* Route */}
            <div style={{ display:'flex', gap: 10, marginBottom: 12 }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius:'50%', background: VC.teal }}/>
                <div style={{ width: 1.5, flex: 1, background: VC.stroke.mid, margin:'4px 0' }}/>
                <div style={{ width: 8, height: 8, borderRadius: 1.5, background: VC.gold[500] }}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: VC.text.primary, fontSize: 12, fontWeight: 700 }}>CJC Zamalek</div>
                <div style={{ color: VC.text.muted, fontSize: 10, fontFamily: VT.type.family.mono, letterSpacing:'0.1em', marginTop: 1, marginBottom: 16 }}>
                  2:56 AM
                </div>
                <div style={{ color: VC.text.primary, fontSize: 12, fontWeight: 700 }}>Home · Maadi St. 9</div>
                <div style={{ color: VC.text.muted, fontSize: 10, fontFamily: VT.type.family.mono, letterSpacing:'0.1em', marginTop: 1 }}>
                  3:18 AM
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ color: VC.text.primary, fontSize: 14, fontWeight: 800, fontFamily: VT.type.family.mono }}>22 MIN</div>
                <VM size="xs" color={VC.text.muted}>14.2 KM</VM>
              </div>
            </div>

            {/* Breakdown */}
            <div style={{ borderTop:'1px dashed '+VC.stroke.mid, paddingTop: 12,
              display:'flex', flexDirection:'column', gap: 6 }}>
              {[['Flat fare','220 EGP'],['Tip to Ahmed','50 EGP'],['Total paid · Apple Pay','270 EGP']].map((r, i, arr) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between',
                  fontSize: i === arr.length - 1 ? 14 : 12,
                  fontWeight: i === arr.length - 1 ? 800 : 500,
                  color: i === arr.length - 1 ? VC.text.primary : VC.text.secondary,
                  marginTop: i === arr.length - 1 ? 6 : 0,
                  paddingTop: i === arr.length - 1 ? 8 : 0,
                  borderTop: i === arr.length - 1 ? '1px solid '+VC.stroke.soft : 'none' }}>
                  <span>{r[0]}</span>
                  <span style={{ fontFamily: VT.type.family.mono, color: i === arr.length - 1 ? VC.teal : VC.text.primary }}>{r[1]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Driver mini */}
          <div style={{ padding: 12, borderRadius: VT.radius.md,
            background: VC.bg.surface, border:'1px solid '+VC.stroke.soft,
            display:'flex', alignItems:'center', gap: 12 }}>
            <VAv size={40} color={VC.teal}>A</VAv>
            <div style={{ flex: 1 }}>
              <div style={{ color: VC.text.primary, fontSize: 13, fontWeight: 700 }}>Ahmed M.</div>
              <VM size="xs" color={VC.text.muted}>★ 4.9 · YOUR DRIVER TONIGHT</VM>
            </div>
            <button style={{ padding:'8px 12px', borderRadius: VT.radius.pill,
              background:'transparent', border:'1px solid '+VC.stroke.mid,
              color: VC.text.primary, fontSize: 10, fontWeight: 800, letterSpacing:'0.12em' }}>REBOOK</button>
          </div>
        </div>

        <div style={{ position:'absolute', bottom: 0, left: 0, right: 0, padding:'14px 20px 28px',
          background:'linear-gradient(180deg, transparent, rgba(7,6,13,0.95) 30%)' }}>
          <VBn variant="valet">RATE YOUR TRIP ★</VBn>
        </div>
      </div>
    </VPhone>
  );
}

// ── 05 RATE ───────────────────────────────────────────────────
function Rate() {
  const tags = [
    { t:'Smooth driver',     on: true  },
    { t:'Felt safe',         on: true  },
    { t:'On time',           on: true  },
    { t:'Friendly',          on: false },
    { t:'Professional',      on: false },
    { t:'Careful with car',  on: true  },
    { t:'Clean & respectful',on: false },
    { t:'Would book again',  on: false },
  ];
  return (
    <VPhone>
      <div style={{ height:'100%', display:'flex', flexDirection:'column', padding:'16px 24px 28px' }}>
        <button style={{ width: 36, height: 36, borderRadius:'50%', background: VC.bg.surface,
          border:'1px solid '+VC.stroke.soft, color: VC.text.primary, fontSize: 18, alignSelf:'flex-start' }}>‹</button>

        <div style={{ marginTop: 16, marginBottom: 24 }}>
          <VM size="sm" color={VC.teal}>RATE YOUR TRIP</VM>
          <div style={{ fontFamily: VT.type.family.display, fontSize: 36, color: VC.text.primary,
            fontWeight: 900, lineHeight: 0.95, letterSpacing:'0.02em', marginTop: 6 }}>
            HOW WAS<br/>AHMED?
          </div>
        </div>

        {/* Driver card */}
        <div style={{ padding: 14, borderRadius: VT.radius.lg,
          background: VC.bg.surface, border:'1px solid '+VC.stroke.soft,
          display:'flex', alignItems:'center', gap: 12, marginBottom: 20 }}>
          <VAv size={48} color={VC.teal}>A</VAv>
          <div style={{ flex: 1 }}>
            <div style={{ color: VC.text.primary, fontSize: 14, fontWeight: 700 }}>Ahmed M.</div>
            <VB size="sm">VW Polo · 14.2 km · 22 min</VB>
          </div>
        </div>

        {/* Stars */}
        <div style={{ display:'flex', justifyContent:'center', gap: 14, marginBottom: 10 }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{
              fontSize: 40, color: i <= 5 ? VC.gold[500] : VC.stroke.mid,
              textShadow: i <= 5 ? '0 0 20px rgba(212,168,67,0.35)' : 'none',
            }}>★</div>
          ))}
        </div>
        <div style={{ textAlign:'center', marginBottom: 24 }}>
          <VM size="sm" color={VC.gold[500]}>PERFECT · 5 STARS</VM>
        </div>

        {/* Tags */}
        <VM size="sm" color={VC.text.muted} style={{ marginBottom: 10 }}>WHAT WENT WELL · TAP ALL THAT APPLY</VM>
        <div style={{ display:'flex', flexWrap:'wrap', gap: 6, marginBottom:'auto' }}>
          {tags.map(({ t, on }) => (
            <div key={t} style={{
              padding:'7px 12px', borderRadius: VT.radius.pill,
              background: on ? 'rgba(0,229,200,0.1)' : 'rgba(255,255,255,0.04)',
              color: on ? VC.teal : VC.text.secondary,
              border: '1px solid ' + (on ? VC.teal+'4D' : VC.stroke.soft),
              fontSize: 12, fontWeight: on ? 700 : 500,
            }}>{on && '✓ '}{t}</div>
          ))}
        </div>

        <VBn variant="gold" style={{ marginTop: 18 }}>SUBMIT · TIP 50 EGP</VBn>
      </div>
    </VPhone>
  );
}

// ── Mount ─────────────────────────────────────────────────────
const { DesignCanvas: VDC, DCSection: VDCS, DCArtboard: VDCA, DCPostIt: VDCP } = window;

function ValetApp() {
  return (
    <VDC>
      <VDCS title="Valet V2" subtitle="Phase 05, redrawn on the LAYLA design system. Teal accent rail — the 'safe driver home' product.">
        <VDCA label="01 · Book a drive"><Book/></VDCA>
        <VDCA label="02 · Finding a valet"><Finding/></VDCA>
        <VDCA label="03 · Live tracking"><Tracking/></VDCA>
        <VDCA label="04 · Trip completed"><Completed/></VDCA>
        <VDCA label="05 · Rate your trip"><Rate/></VDCA>
        <VDCP top={-20} left={2020} rotate={3} width={220}>
          Flat fare, no surge — single strongest product promise. Teal "FARE" card anchors the book screen.
        </VDCP>
        <VDCP bottom={-40} left={80} rotate={-3} width={240}>
          Tracking keeps SOS in the top-right at all times. Glowing teal route = safety-first visual grammar.
        </VDCP>
      </VDCS>
    </VDC>
  );
}

// radar + pulse keyframes
const vStyle = document.createElement('style');
vStyle.textContent = `
  @keyframes pulse-ring { 0% { transform: scale(0.4); opacity: 1 } 100% { transform: scale(1.1); opacity: 0 } }
  @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.3 } }
`;
document.head.appendChild(vStyle);

ReactDOM.createRoot(document.getElementById('root')).render(<ValetApp/>);
