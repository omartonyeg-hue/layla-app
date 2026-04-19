// LAYLA — Phase 02 Events V2. Polished screens on the new design system.

const T = window.LAYLA_TOKENS;
const C = T.color, G = T.gradient;
const L = window.L;
const { Display, Micro, Body, Button, Chip, Tag, VerifiedBadge, Avatar } = L;

// ───── Phone frame ─────────────────────────────────────────────
const Phone = ({ children, time = '9:41' }) => (
  <div style={{
    width: 375, height: 812, borderRadius: 44, overflow: 'hidden',
    background: C.bg.base, position: 'relative',
    boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 2px #1a1a22, 0 0 0 3px #333',
  }}>
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      opacity: T.effect.grainOpacity, backgroundImage: T.effect.grain, zIndex: 50,
    }}/>
    {/* Dynamic island / status */}
    <div style={{
      position: 'absolute', top: 14, left: 20, right: 20, zIndex: 45,
      display: 'flex', justifyContent: 'space-between',
      fontSize: 13, color: C.text.primary, fontFamily: T.type.family.mono, fontWeight: 600,
    }}>
      <span>{time}</span>
      <span>●●● 100%</span>
    </div>
    <div style={{ position: 'absolute', inset: 0, paddingTop: 44 }}>{children}</div>
  </div>
);

// ───── Tab bar ─────────────────────────────────────────────────
const TabBar = ({ active = 'events' }) => {
  const tabs = [
    { id:'events',    icon:'◐', label:'EVENTS' },
    { id:'parties',   icon:'▲', label:'PARTIES' },
    { id:'community', icon:'◎', label:'COMMUNITY' },
    { id:'valet',     icon:'▶', label:'VALET' },
    { id:'profile',   icon:'●', label:'PROFILE' },
  ];
  return (
    <div style={{
      position:'absolute', bottom: 0, left: 0, right: 0,
      padding: '12px 16px 28px', background: 'rgba(7,6,13,0.8)',
      backdropFilter:'blur(20px)', borderTop:'1px solid '+C.stroke.soft,
      display:'flex', justifyContent:'space-around',
    }}>
      {tabs.map(t => {
        const on = t.id === active;
        return (
          <div key={t.id} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 4, flex: 1 }}>
            <span style={{ color: on ? C.gold[500] : C.text.muted, fontSize: 18 }}>{t.icon}</span>
            <span style={{
              fontSize: 9, letterSpacing:'0.1em', fontFamily: T.type.family.mono,
              color: on ? C.gold[500] : C.text.muted, fontWeight: on ? 700 : 500,
            }}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
};

// ───── 01 DISCOVER ─────────────────────────────────────────────
function Discover() {
  const cities = [
    { id:'all', name:'All', icon:'🌙', on:true },
    { id:'cairo', name:'Cairo', icon:'🏙️' },
    { id:'sahel', name:'Sahel', icon:'🏖️' },
    { id:'gouna', name:'Gouna', icon:'🌊' },
  ];
  const events = [
    { name:'Underground · 180BPM', venue:'CJC · Zamalek', when:'Sat · 11 PM', price: 350, tag:'HOT',   grad: G.night },
    { name:'Rooftop House',        venue:'Kiva · Nile',    when:'Sat · 7 PM',  price: 450, tag:null,    grad: G.valet },
    { name:'Afro Nights',          venue:'Scene · Sahel',  when:'Fri · 8 PM',  price: 600, tag:'NEW',   grad: G.community },
    { name:'Sunset Sessions',      venue:'Six Eight',      when:'Thu · 10 PM', price: 250, tag:null,    grad: G.sunset },
  ];
  return (
    <Phone>
      <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
        {/* header */}
        <div style={{ padding: '16px 20px 12px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 14 }}>
            <div>
              <Micro size="sm" color={C.text.muted}>📍 TONIGHT IN EGYPT</Micro>
              <Display size="xs" style={{ marginTop: 2 }}>Discover</Display>
            </div>
            <div style={{ display:'flex', gap: 8 }}>
              <button style={{ position:'relative', width: 40, height: 40, borderRadius:'50%',
                background: C.bg.surface, border:'1px solid '+C.stroke.soft, color: C.gold[500], fontSize: 14 }}>
                🎟
                <span style={{ position:'absolute', top:-4, right:-4, minWidth: 16, height: 16, padding:'0 4px',
                  borderRadius: 8, background: C.rose, color: C.text.inverse,
                  fontSize: 9, fontWeight: 900, display:'grid', placeItems:'center' }}>2</span>
              </button>
            </div>
          </div>
          {/* search */}
          <div style={{
            display:'flex', alignItems:'center', gap: 8, padding:'10px 12px',
            borderRadius: T.radius.md, background: C.bg.surface, border:'1px solid '+C.stroke.soft,
            marginBottom: 12,
          }}>
            <span style={{ color: C.text.muted, fontSize: 12 }}>⌕</span>
            <span style={{ color: C.text.muted, fontSize: 13 }}>Search events, venues, DJs…</span>
          </div>
          {/* cities */}
          <div style={{ display:'flex', gap: 8, overflowX:'hidden' }}>
            {cities.map(c => (
              <div key={c.id} style={{
                padding: '6px 12px', borderRadius: T.radius.pill,
                fontSize: 12, fontWeight: c.on ? 700 : 500,
                background: c.on ? G.gold : 'rgba(255,255,255,0.04)',
                color: c.on ? C.text.inverse : C.text.secondary,
                border: c.on ? 'none' : '1px solid '+C.stroke.mid,
                whiteSpace:'nowrap', display:'flex', gap: 6, alignItems:'center',
              }}>
                <span>{c.icon}</span>{c.name}
              </div>
            ))}
          </div>
        </div>

        {/* feed */}
        <div style={{ flex: 1, overflow:'hidden', padding: '4px 20px 100px' }}>
          {/* Featured hero */}
          <div style={{
            position:'relative', padding: 20, borderRadius: T.radius.xxl, overflow:'hidden',
            background: G.sunset, marginBottom: 20,
          }}>
            <div style={{ position:'absolute', inset:0, opacity: 0.2,
              background:'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.35), transparent 50%)' }}/>
            <div style={{ position:'relative' }}>
              <Tag bg={C.scrim[40]} fg={C.text.primary}>🔥 FEATURED</Tag>
              <div style={{
                fontFamily: T.type.family.display, fontSize: 34, color: C.text.inverse,
                fontWeight: 900, lineHeight: 1, marginTop: 12, letterSpacing:'0.02em',
              }}>SAHEL SUNSET<br/>RAVE 2026</div>
              <div style={{ color:'rgba(7,6,13,0.8)', fontSize: 12, fontWeight: 600, margin:'6px 0 16px' }}>
                Six Eight · Sahel · Fri, Apr 24
              </div>
              <div style={{ display:'flex', gap: 8 }}>
                <span style={{ padding:'6px 12px', borderRadius: 999, background: C.bg.base, color: C.text.primary,
                  fontSize: 11, fontWeight: 800, letterSpacing:'0.1em' }}>FROM 500 EGP</span>
                <span style={{ padding:'6px 12px', borderRadius: 999, background:'rgba(7,6,13,0.3)',
                  color: C.text.inverse, fontSize: 11, fontWeight: 700, backdropFilter:'blur(8px)' }}>127 going</span>
              </div>
            </div>
          </div>

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 10 }}>
            <div style={{ fontFamily: T.type.family.display, fontSize: 18, color: C.text.primary, fontWeight: 900, letterSpacing:'0.04em' }}>
              THIS WEEK
            </div>
            <Micro size="sm" color={C.gold[500]}>SEE ALL →</Micro>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
            {events.map((e, i) => (
              <div key={i} style={{
                padding: 12, borderRadius: T.radius.md, background: C.bg.surface,
                border:'1px solid '+C.stroke.soft, display:'flex', alignItems:'center', gap: 12,
              }}>
                <div style={{ width: 56, height: 56, borderRadius: T.radius.sm, background: e.grad, flexShrink: 0,
                  display:'grid', placeItems:'center', color: C.text.inverse, fontSize: 20 }}>♪</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 2 }}>
                    <div style={{ color: C.text.primary, fontSize: 14, fontWeight: 700 }}>{e.name}</div>
                    {e.tag && <Tag bg={C.rose}>{e.tag}</Tag>}
                  </div>
                  <Body size="sm">{e.venue}</Body>
                  <div style={{ color: C.text.muted, fontSize: 10, fontFamily: T.type.family.mono, marginTop: 2 }}>{e.when}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ color: C.gold[500], fontSize: 14, fontWeight: 800 }}>{e.price} EGP</div>
                  <div style={{ color: C.text.muted, fontSize: 9, fontFamily: T.type.family.mono, letterSpacing:'0.1em' }}>FROM</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <TabBar active="events"/>
      </div>
    </Phone>
  );
}

// ───── 02 EVENT DETAIL ─────────────────────────────────────────
function Detail() {
  return (
    <Phone>
      <div style={{ height:'100%', overflow:'hidden', display:'flex', flexDirection:'column' }}>
        {/* Hero */}
        <div style={{ position:'relative', height: 280, background: G.sunset, flexShrink: 0 }}>
          <div style={{ position:'absolute', inset:0, opacity: 0.25,
            background:'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.4), transparent 60%)' }}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, transparent 40%, #07060D 100%)' }}/>
          <div style={{ position:'absolute', top: 12, left: 16, right: 16, display:'flex', justifyContent:'space-between' }}>
            <button style={{ width: 36, height: 36, borderRadius:'50%', background: C.scrim[60],
              backdropFilter:'blur(10px)', color: C.text.primary, border:'none', fontSize: 18 }}>‹</button>
            <div style={{ display:'flex', gap: 8 }}>
              <button style={{ width: 36, height: 36, borderRadius:'50%', background: C.scrim[60],
                backdropFilter:'blur(10px)', color: C.text.primary, border:'none', fontSize: 14 }}>♡</button>
              <button style={{ width: 36, height: 36, borderRadius:'50%', background: C.scrim[60],
                backdropFilter:'blur(10px)', color: C.text.primary, border:'none', fontSize: 14 }}>↗</button>
            </div>
          </div>
          <div style={{ position:'absolute', bottom: 20, left: 20, right: 20 }}>
            <Tag bg={C.bg.base} fg={C.gold[500]}>🔥 FEATURED · TECHNO</Tag>
            <div style={{ fontFamily: T.type.family.display, fontSize: 40, color: C.text.primary,
              fontWeight: 900, lineHeight: 0.95, marginTop: 8, letterSpacing:'0.02em' }}>
              SAHEL SUNSET<br/>RAVE 2026
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflow:'hidden', padding: '16px 20px 100px' }}>
          {/* Meta rows */}
          <div style={{ display:'flex', flexDirection:'column', gap: 10, marginBottom: 18 }}>
            {[
              { i:'📅', k:'FRIDAY, APR 24', v:'9:00 PM — sunrise', c: C.gold[500] },
              { i:'📍', k:'SIX EIGHT · SAHEL', v:'Sidi Heneish · 120km west', c: C.rose },
              { i:'♪',  k:'LINEUP · 3 STAGES', v:'Aguizi & Fahim · Misty · Ahmed Samy', c: C.violet },
            ].map((r, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: T.radius.sm,
                  background: r.c + '26', border:'1px solid '+r.c+'4D',
                  display:'grid', placeItems:'center', color: r.c, fontSize: 14 }}>{r.i}</div>
                <div style={{ flex: 1 }}>
                  <Micro size="xs" color={r.c}>{r.k}</Micro>
                  <div style={{ color: C.text.primary, fontSize: 13, fontWeight: 600, marginTop: 2 }}>{r.v}</div>
                </div>
              </div>
            ))}
          </div>

          {/* About */}
          <Micro size="sm" color={C.text.muted} style={{ marginBottom: 8 }}>ABOUT</Micro>
          <Body style={{ marginBottom: 20, lineHeight: 1.6 }}>
            The biggest beach rave of the season. Three stages, sunset to sunrise.
            Sound by Funktion-One. Strict 21+ door. Government ID required.
          </Body>

          {/* Tiers */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 10 }}>
            <Micro size="sm" color={C.gold[500]}>SELECT TIER</Micro>
            <Micro size="xs" color={C.text.muted}>4 OPTIONS</Micro>
          </div>
          {[
            { n:'Standard',      d:'General admission',                  p:500,  left:127, on:false },
            { n:'VIP',           d:'Priority entry + VIP bar',           p:1200, left:34,  on:true  },
            { n:'Table (4 pax)', d:'Reserved table · 6,000 min spend',   p:6000, left:8,   on:false },
          ].map((t, i) => (
            <div key={i} style={{
              padding: 14, borderRadius: T.radius.md, marginBottom: 8,
              background: t.on ? 'rgba(212,168,67,0.08)' : C.bg.surface,
              border: '1.5px solid ' + (t.on ? C.gold[500] : C.stroke.soft),
              display:'flex', alignItems:'center', gap: 12,
            }}>
              <div style={{
                width: 22, height: 22, borderRadius:'50%',
                border:'1.5px solid '+ (t.on ? C.gold[500] : C.stroke.mid),
                background: t.on ? C.gold[500] : 'transparent',
                display:'grid', placeItems:'center',
              }}>{t.on && <span style={{ color: C.text.inverse, fontSize: 11, fontWeight: 900 }}>✓</span>}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: C.text.primary, fontSize: 14, fontWeight: 700 }}>{t.n}</div>
                <Body size="sm">{t.d}</Body>
                <div style={{ color: t.left < 20 ? C.rose : C.teal,
                  fontSize: 10, fontFamily: T.type.family.mono, letterSpacing:'0.15em',
                  fontWeight: 700, marginTop: 4 }}>
                  {t.left < 20 ? `ONLY ${t.left} LEFT` : `${t.left} AVAILABLE`}
                </div>
              </div>
              <div style={{ color: C.gold[500], fontSize: 16, fontWeight: 800 }}>
                {t.p.toLocaleString()} <span style={{ fontSize: 10, fontFamily: T.type.family.mono }}>EGP</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA dock */}
        <div style={{
          position:'absolute', bottom: 0, left: 0, right: 0, padding:'16px 20px 28px',
          background:'linear-gradient(180deg, transparent, rgba(7,6,13,0.95) 30%)',
        }}>
          <Button variant="gold">CHECKOUT · 1,200 EGP →</Button>
        </div>
      </div>
    </Phone>
  );
}

// ───── 03 CHECKOUT ─────────────────────────────────────────────
function Checkout() {
  const methods = [
    { id:'card',    n:'Card',          d:'Visa · Mastercard · Meeza', c: C.gold[500], i:'💳', on:true },
    { id:'apple',   n:'Apple Pay',     d:'One-tap secure payment',     c: C.text.primary, i:'',  on:false },
    { id:'vodafone',n:'Vodafone Cash', d:'Mobile wallet',              c: C.rose,      i:'📱', on:false },
    { id:'fawry',   n:'Fawry',         d:'Pay cash at any kiosk',      c: C.violet,    i:'🏪', on:false },
  ];
  return (
    <Phone>
      <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
        <div style={{ padding: '14px 20px 4px', display:'flex', alignItems:'center', gap: 12 }}>
          <button style={{ width: 36, height: 36, borderRadius:'50%', background: C.bg.surface,
            border:'1px solid '+C.stroke.soft, color: C.text.primary, fontSize: 16 }}>‹</button>
          <div>
            <Micro size="sm" color={C.gold[500]}>CHECKOUT</Micro>
            <div style={{ color: C.text.primary, fontSize: 16, fontWeight: 700 }}>1 of 1 step</div>
          </div>
        </div>

        <div style={{ flex: 1, overflow:'hidden', padding: '16px 20px 100px' }}>
          {/* Order summary */}
          <div style={{ padding: 16, borderRadius: T.radius.lg, background: C.bg.surface,
            border:'1px solid '+C.stroke.soft, marginBottom: 20 }}>
            <div style={{ display:'flex', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 60, height: 60, borderRadius: T.radius.sm, background: G.sunset, flexShrink: 0 }}/>
              <div style={{ flex: 1 }}>
                <Micro size="xs" color={C.gold[500]}>FRI · APR 24</Micro>
                <div style={{ color: C.text.primary, fontSize: 14, fontWeight: 700, margin:'2px 0' }}>Sahel Sunset Rave</div>
                <Body size="sm">Six Eight · Sahel</Body>
              </div>
            </div>
            <div style={{ borderTop: '1px dashed '+C.stroke.mid, paddingTop: 12,
              display:'flex', flexDirection:'column', gap: 6 }}>
              {[['VIP × 1','1,200 EGP'],['Platform fee','24 EGP'],['Insurance','free']].map((r, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between',
                  color: C.text.secondary, fontSize: 12 }}>
                  <span>{r[0]}</span>
                  <span style={{ fontFamily: T.type.family.mono, color: C.text.primary }}>{r[1]}</span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', marginTop: 6, paddingTop: 10,
                borderTop: '1px solid '+C.stroke.soft }}>
                <span style={{ color: C.text.primary, fontSize: 14, fontWeight: 800 }}>TOTAL</span>
                <span style={{ color: C.gold[500], fontSize: 20, fontWeight: 900, fontFamily: T.type.family.display, letterSpacing:'0.02em' }}>1,224 EGP</span>
              </div>
            </div>
          </div>

          {/* Methods */}
          <Micro size="sm" color={C.text.muted} style={{ marginBottom: 10 }}>PAYMENT METHOD</Micro>
          <div style={{ display:'flex', flexDirection:'column', gap: 8, marginBottom: 18 }}>
            {methods.map(m => (
              <div key={m.id} style={{
                padding: 12, borderRadius: T.radius.md,
                background: m.on ? 'rgba(212,168,67,0.08)' : C.bg.surface,
                border:'1.5px solid '+ (m.on ? C.gold[500] : C.stroke.soft),
                display:'flex', alignItems:'center', gap: 12,
              }}>
                <div style={{ width: 36, height: 36, borderRadius: T.radius.sm,
                  background: m.c + '26', border:'1px solid '+m.c+'4D',
                  display:'grid', placeItems:'center', color: m.c, fontSize: 16 }}>{m.i || '◆'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: C.text.primary, fontSize: 13, fontWeight: 700 }}>{m.n}</div>
                  <Body size="sm">{m.d}</Body>
                </div>
                <div style={{ width: 18, height: 18, borderRadius:'50%',
                  border:'1.5px solid '+ (m.on ? C.gold[500] : C.stroke.mid),
                  background: m.on ? C.gold[500] : 'transparent',
                  display:'grid', placeItems:'center' }}>
                  {m.on && <span style={{ width: 6, height: 6, borderRadius: 3, background: C.text.inverse }}/>}
                </div>
              </div>
            ))}
          </div>

          {/* Safety banner */}
          <div style={{ display:'flex', gap: 10, padding: 12, borderRadius: T.radius.md,
            background:'rgba(0,229,200,0.06)', border:'1px solid rgba(0,229,200,0.15)' }}>
            <div style={{ color: C.teal, fontSize: 14 }}>🛡</div>
            <div>
              <Micro size="sm" color={C.teal}>SECURE · PAYMOB</Micro>
              <Body size="sm" style={{ marginTop: 2 }}>
                Card data never touches LAYLA. Full refund if event cancels.
              </Body>
            </div>
          </div>
        </div>

        {/* CTA dock */}
        <div style={{
          position:'absolute', bottom: 0, left: 0, right: 0, padding:'16px 20px 28px',
          background:'linear-gradient(180deg, transparent, rgba(7,6,13,0.95) 30%)',
        }}>
          <Button variant="gold">PAY 1,224 EGP →</Button>
          <div style={{ textAlign:'center', marginTop: 6 }}>
            <Micro size="xs" color={C.text.muted}>BY CONTINUING · TERMS · REFUND POLICY</Micro>
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ───── 04 SECURE QR TICKET ─────────────────────────────────────
function QRTicket() {
  // Draw a pseudo-QR pattern as a grid of dots.
  const grid = Array.from({ length: 21 }, (_, r) =>
    Array.from({ length: 21 }, (_, c) => {
      // Finder squares
      const finder = (r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7);
      if (finder) {
        const isEdge = r===0 || c===0 || r===6 || c===6 || (c>13 && (c===14 || c===20));
        const isCore = (r>=2 && r<=4 && c>=2 && c<=4) || (r>=2 && r<=4 && c>=16 && c<=18) || (r>=16 && r<=18 && c>=2 && c<=4);
        return isEdge || isCore;
      }
      const seed = (r * 31 + c * 17) % 7;
      return seed < 3;
    })
  );
  return (
    <Phone time="2:34 AM">
      <div style={{ height:'100%', display:'flex', flexDirection:'column',
        background:'linear-gradient(180deg, #07060D 0%, #10101E 60%, #07060D 100%)' }}>
        {/* Header */}
        <div style={{ padding: '14px 20px 4px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <button style={{ width: 36, height: 36, borderRadius:'50%', background: C.bg.surface,
            border:'1px solid '+C.stroke.soft, color: C.text.primary, fontSize: 16 }}>‹</button>
          <div style={{ textAlign:'center' }}>
            <Micro size="sm" color={C.teal}>🛡 SECURE · LIVE</Micro>
            <div style={{ fontFamily: T.type.family.display, fontSize: 16, color: C.text.primary,
              fontWeight: 900, letterSpacing:'0.04em' }}>YOUR TICKET</div>
          </div>
          <button style={{ width: 36, height: 36, borderRadius:'50%', background: C.bg.surface,
            border:'1px solid '+C.stroke.soft, color: C.text.primary, fontSize: 14 }}>ⓘ</button>
        </div>

        <div style={{ flex: 1, padding:'12px 24px 24px', display:'flex', flexDirection:'column' }}>
          {/* Ticket card */}
          <div style={{
            borderRadius: T.radius.xxl, overflow:'hidden',
            background: C.bg.surface, border:'1px solid '+C.stroke.gold,
            boxShadow: '0 20px 60px rgba(0,229,200,0.1)',
          }}>
            {/* Header band */}
            <div style={{ padding:'16px 20px', background: G.sunset }}>
              <Micro size="xs" color={C.text.inverse}>ADMIT ONE · VIP</Micro>
              <div style={{ fontFamily: T.type.family.display, fontSize: 22, color: C.text.inverse,
                fontWeight: 900, lineHeight: 1, letterSpacing:'0.02em', marginTop: 4 }}>
                SAHEL SUNSET RAVE
              </div>
              <div style={{ color:'rgba(7,6,13,0.75)', fontSize: 11, fontWeight: 600, marginTop: 4,
                fontFamily: T.type.family.mono, letterSpacing:'0.1em' }}>
                FRI · APR 24 · 9:00 PM · SIX EIGHT
              </div>
            </div>
            {/* Perforation */}
            <div style={{ position:'relative', height: 16, background: C.bg.surface }}>
              <div style={{ position:'absolute', left: -8, top: 0, bottom: 0, width: 16, borderRadius:'50%', background: C.bg.base }}/>
              <div style={{ position:'absolute', right: -8, top: 0, bottom: 0, width: 16, borderRadius:'50%', background: C.bg.base }}/>
              <div style={{ position:'absolute', left: 16, right: 16, top: '50%', borderTop:'1px dashed '+C.stroke.mid }}/>
            </div>
            {/* QR */}
            <div style={{ padding: 20, display:'flex', flexDirection:'column', alignItems:'center', gap: 12 }}>
              <div style={{
                position:'relative', padding: 16, borderRadius: T.radius.md,
                background: C.text.primary,
              }}>
                <div style={{ width: 168, height: 168, display:'grid',
                  gridTemplateColumns:`repeat(21, 1fr)`, gap: 1 }}>
                  {grid.flat().map((on, i) => (
                    <div key={i} style={{
                      width:'100%', aspectRatio: 1,
                      background: on ? C.bg.base : 'transparent',
                    }}/>
                  ))}
                </div>
                {/* Center logo chip */}
                <div style={{
                  position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
                  width: 36, height: 36, borderRadius: T.radius.sm,
                  background: G.gold, display:'grid', placeItems:'center',
                  fontFamily: T.type.family.display, fontSize: 14, color: C.text.inverse,
                  fontWeight: 900, letterSpacing:'0.05em', boxShadow: '0 0 0 4px '+C.text.primary,
                }}>L</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, background: C.teal,
                  boxShadow: T.shadow.glowTeal, animation:'pulse 1.6s infinite' }}/>
                <Micro size="xs" color={C.teal}>REFRESHES EVERY 60s · ROTATES 00:47</Micro>
              </div>
            </div>

            {/* Meta */}
            <div style={{ padding:'0 20px 20px', display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12 }}>
              {[['GUEST','Layla M.'],['TIER','VIP · 1,200 EGP'],['GATE','B · PRIORITY'],['ORDER','#LYL-8AF-24']].map(([k,v]) => (
                <div key={k}>
                  <Micro size="xs" color={C.text.muted}>{k}</Micro>
                  <div style={{ color: C.text.primary, fontSize: 13, fontWeight: 700, fontFamily: T.type.family.mono, marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Anti-screenshot note */}
          <div style={{ display:'flex', gap: 10, padding: 12, marginTop: 16,
            borderRadius: T.radius.md,
            background:'rgba(255,61,107,0.06)', border:'1px solid rgba(255,61,107,0.15)' }}>
            <div style={{ color: C.rose, fontSize: 14 }}>⚠</div>
            <div>
              <Micro size="sm" color={C.rose}>ANTI-SCREENSHOT ON</Micro>
              <Body size="sm" style={{ marginTop: 2 }}>
                Screenshots are voided. Only the live code in this app is valid at the gate.
              </Body>
            </div>
          </div>
          <div style={{ marginTop:'auto' }}>
            <Button variant="ghost">ADD TO APPLE WALLET</Button>
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ───── MOUNT ───────────────────────────────────────────────────
const { DesignCanvas, DCSection, DCArtboard, DCPostIt } = window;

function App() {
  return (
    <DesignCanvas>
      <DCSection title="Events V2" subtitle="Phase 02, redrawn on the LAYLA design system. Four screens, left to right: discovery → detail → checkout → secure ticket.">
        <DCArtboard label="01 · Discover"><Discover/></DCArtboard>
        <DCArtboard label="02 · Event detail · tiers"><Detail/></DCArtboard>
        <DCArtboard label="03 · Checkout · payment"><Checkout/></DCArtboard>
        <DCArtboard label="04 · Secure QR ticket"><QRTicket/></DCArtboard>
        <DCPostIt top={-20} left={1620} rotate={3} width={200}>
          QR rotates every 60s and voids on screenshot — investors love this slide. "Tickets that can't be resold."
        </DCPostIt>
        <DCPostIt bottom={-40} left={80} rotate={-3} width={220}>
          Every screen opens with mono eyebrow + Bebas title. One gold CTA at the bottom, pinned to a scrim.
        </DCPostIt>
      </DCSection>
    </DesignCanvas>
  );
}

// keyframes for the live-dot
const style = document.createElement('style');
style.textContent = '@keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.3 } }';
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
