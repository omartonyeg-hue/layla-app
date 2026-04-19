// LAYLA — Phase 06 Pro / Scale V2. Gold accent + holographic sheen.

const ST = window.LAYLA_TOKENS;
const SC = ST.color, SG = ST.gradient;
const SL = window.L;
const { Display: SD, Micro: SM, Body: SB, Button: SBn, Tag: STg, Avatar: SAv } = SL;

// Holographic gradient reused for Pro surfaces
const HOLO = 'linear-gradient(135deg, #D4A843 0%, #F0C96A 30%, #FF3D6B 60%, #8B3FFF 100%)';

// Phone
const SPhone = ({ children, bg = SC.bg.base }) => (
  <div style={{
    width: 375, height: 812, borderRadius: 44, overflow:'hidden',
    background: bg, position:'relative',
    boxShadow:'0 40px 80px rgba(0,0,0,0.5), 0 0 0 2px #1a1a22, 0 0 0 3px #333',
  }}>
    <div style={{ position:'absolute', inset: 0, pointerEvents:'none',
      opacity: ST.effect.grainOpacity, backgroundImage: ST.effect.grain, zIndex: 50 }}/>
    <div style={{ position:'absolute', top: 14, left: 20, right: 20, zIndex: 45,
      display:'flex', justifyContent:'space-between', fontSize: 13,
      color: SC.text.primary, fontFamily: ST.type.family.mono, fontWeight: 600 }}>
      <span>9:41</span><span>●●● 100%</span>
    </div>
    <div style={{ position:'absolute', inset: 0, paddingTop: 44 }}>{children}</div>
  </div>
);

// ── 01 PRO LANDING ────────────────────────────────────────────
function ProLanding() {
  const benefits = [
    { i:'⚡', t:'Priority entry',        d:'Skip lines at partner venues',    c: SC.gold[500] },
    { i:'🔥', t:'Exclusive drops',       d:'Secret parties & hidden events',  c: SC.rose },
    { i:'🛡', t:'No valet surge',        d:'Flat-rate rides, any hour',       c: SC.teal },
    { i:'🎁', t:'Partner perks',         d:'Free drinks, fashion discounts',  c: SC.violet },
  ];
  return (
    <SPhone>
      <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Hero */}
        <div style={{ position:'relative', padding:'36px 24px 28px',
          background:'radial-gradient(ellipse at top, rgba(212,168,67,0.25), transparent 60%)' }}>
          <div style={{ position:'absolute', top: 14, right: 20 }}>
            <button style={{ width: 32, height: 32, borderRadius:'50%', background: SC.bg.surface,
              border:'1px solid '+SC.stroke.soft, color: SC.text.primary, fontSize: 16 }}>×</button>
          </div>

          {/* Card stack */}
          <div style={{ position:'relative', height: 200, marginBottom: 24 }}>
            {/* Back card */}
            <div style={{
              position:'absolute', top: 24, left: 40, right: 40, height: 160,
              borderRadius: 18, background: SC.bg.surface, border:'1px solid '+SC.stroke.mid,
              transform:'rotate(-6deg)', opacity: 0.5,
            }}/>
            {/* Main card */}
            <div style={{
              position:'absolute', top: 10, left: 16, right: 16, height: 180,
              borderRadius: 20, padding: 20,
              background: HOLO,
              boxShadow:'0 20px 50px rgba(212,168,67,0.35)',
              display:'flex', flexDirection:'column', justifyContent:'space-between',
              overflow:'hidden', color: SC.text.inverse,
            }}>
              {/* Sheen */}
              <div style={{ position:'absolute', inset: 0,
                background:'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)',
                mixBlendMode:'overlay' }}/>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', position:'relative' }}>
                <div>
                  <div style={{ fontSize: 9, letterSpacing:'0.2em', fontWeight: 700, opacity: 0.75 }}>MEMBER · LIFETIME</div>
                  <div style={{ fontFamily: ST.type.family.display, fontSize: 36, fontWeight: 900,
                    letterSpacing:'0.02em', lineHeight: 0.95, marginTop: 4 }}>LAYLA<br/>PRO</div>
                </div>
                <div style={{ fontSize: 28 }}>◉</div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', position:'relative' }}>
                <div style={{ fontFamily: ST.type.family.mono, fontSize: 11, letterSpacing:'0.15em', fontWeight: 700 }}>•• •• •• 2847</div>
                <div style={{ fontSize: 9, letterSpacing:'0.15em', fontWeight: 700 }}>EST · 2024</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign:'center', marginBottom: 4 }}>
            <SM size="sm" color={SC.gold[500]}>⌁ MEMBERSHIP · BY INVITATION</SM>
          </div>
          <div style={{ fontFamily: ST.type.family.display, fontSize: 38, color: SC.text.primary,
            fontWeight: 900, letterSpacing:'0.01em', lineHeight: 0.95, textAlign:'center', marginTop: 8 }}>
            NIGHTLIFE, <span style={{
              background: HOLO,
              WebkitBackgroundClip:'text', backgroundClip:'text', color:'transparent',
            }}>UNLOCKED.</span>
          </div>
          <SB style={{ textAlign:'center', fontSize: 13, color: SC.text.secondary, marginTop: 10, lineHeight: 1.45 }}>
            Skip the line. Hear about parties first.<br/>Flat-rate valet. Drinks on partners.
          </SB>
        </div>

        {/* Benefits */}
        <div style={{ flex: 1, padding:'0 20px', overflow:'hidden' }}>
          <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
            {benefits.map(b => (
              <div key={b.t} style={{ display:'flex', alignItems:'center', gap: 12,
                padding:'10px 12px', borderRadius: ST.radius.md,
                background: SC.bg.surface, border:'1px solid '+SC.stroke.soft }}>
                <div style={{ width: 36, height: 36, borderRadius: ST.radius.sm,
                  background: b.c + '22', display:'grid', placeItems:'center',
                  fontSize: 15, color: b.c }}>{b.i}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: SC.text.primary, fontSize: 13, fontWeight: 700 }}>{b.t}</div>
                  <div style={{ color: SC.text.muted, fontSize: 11 }}>{b.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding:'14px 20px 28px', flexShrink: 0 }}>
          <SBn variant="gold">⌁ UNLOCK PRO · 7 DAYS FREE</SBn>
          <div style={{ textAlign:'center', marginTop: 10 }}>
            <SM size="xs" color={SC.text.muted}>THEN 899 EGP / MONTH · CANCEL ANYTIME</SM>
          </div>
        </div>
      </div>
    </SPhone>
  );
}

// ── 02 CHECKOUT ───────────────────────────────────────────────
function ProCheckout() {
  const plans = [
    { id:'annual',  label:'Annual',   price:'799', unit:'/mo billed yearly', save:'SAVE 11%', selected: true  },
    { id:'monthly', label:'Monthly',  price:'899', unit:'/month',             selected: false },
  ];
  return (
    <SPhone>
      <div style={{ height:'100%', display:'flex', flexDirection:'column', padding:'14px 22px 28px' }}>
        <div style={{ display:'flex', alignItems:'center', gap: 12, marginBottom: 20 }}>
          <button style={{ width: 36, height: 36, borderRadius:'50%', background: SC.bg.surface,
            border:'1px solid '+SC.stroke.soft, color: SC.text.primary, fontSize: 18 }}>‹</button>
          <div>
            <SM size="sm" color={SC.gold[500]}>CHECKOUT</SM>
            <div style={{ color: SC.text.primary, fontSize: 14, fontWeight: 700 }}>Choose your plan</div>
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap: 10, marginBottom: 18 }}>
          {plans.map(p => (
            <div key={p.id} style={{
              padding:'14px 16px', borderRadius: ST.radius.lg,
              background: p.selected ? 'rgba(212,168,67,0.08)' : SC.bg.surface,
              border: p.selected ? '1.5px solid ' + SC.gold[500] : '1px solid '+SC.stroke.soft,
              display:'flex', alignItems:'center', gap: 12, position:'relative',
              boxShadow: p.selected ? '0 8px 24px rgba(212,168,67,0.15)' : 'none',
            }}>
              <div style={{ width: 20, height: 20, borderRadius:'50%',
                border:'2px solid '+(p.selected ? SC.gold[500] : SC.stroke.mid),
                display:'grid', placeItems:'center',
                background: p.selected ? SC.gold[500] : 'transparent' }}>
                {p.selected && <div style={{ width: 8, height: 8, borderRadius: 4, background: SC.text.inverse }}/>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                  <div style={{ color: SC.text.primary, fontSize: 15, fontWeight: 700 }}>{p.label}</div>
                  {p.save && <span style={{ padding:'2px 7px', borderRadius: ST.radius.pill,
                    background: SC.teal + '22', color: SC.teal, fontSize: 9, fontWeight: 900,
                    letterSpacing:'0.1em', fontFamily: ST.type.family.mono }}>{p.save}</span>}
                </div>
                <SM size="xs" color={SC.text.muted}>{p.unit}</SM>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily: ST.type.family.display, fontSize: 22, color: SC.text.primary,
                  fontWeight: 900, letterSpacing:'0.01em' }}>
                  {p.price} <span style={{ fontSize: 11, color: SC.text.muted, fontWeight: 500, letterSpacing:0 }}>EGP</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trial banner */}
        <div style={{ padding: 14, borderRadius: ST.radius.lg, background: HOLO,
          position:'relative', overflow:'hidden', marginBottom: 18, color: SC.text.inverse }}>
          <div style={{ position:'absolute', inset: 0,
            background:'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)' }}/>
          <div style={{ position:'relative', display:'flex', alignItems:'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius:'50%',
              background:'rgba(7,6,13,0.25)', backdropFilter:'blur(10px)',
              display:'grid', placeItems:'center', fontSize: 20 }}>🎁</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, letterSpacing:'0.18em', fontWeight: 700, opacity: 0.85 }}>
                FIRST-TIME OFFER
              </div>
              <div style={{ fontFamily: ST.type.family.display, fontSize: 20, fontWeight: 900,
                letterSpacing:'0.02em', marginTop: 2 }}>7 DAYS FREE</div>
              <div style={{ fontSize: 11, marginTop: 2, opacity: 0.85 }}>Cancel anytime, no charge</div>
            </div>
          </div>
        </div>

        {/* Payment */}
        <SM size="sm" color={SC.text.muted} style={{ marginBottom: 8 }}>PAYMENT METHOD</SM>
        <div style={{ padding:'12px 14px', borderRadius: ST.radius.md,
          background: SC.bg.surface, border:'1px solid '+SC.stroke.soft,
          display:'flex', alignItems:'center', gap: 12, marginBottom: 18 }}>
          <div style={{ width: 40, height: 28, borderRadius: 6,
            background: SG.sunset, display:'grid', placeItems:'center',
            color: SC.text.primary, fontSize: 9, fontWeight: 900 }}>VISA</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: SC.text.primary, fontSize: 13, fontWeight: 600 }}>•••• 2847</div>
            <div style={{ color: SC.text.muted, fontSize: 11 }}>Expires 08 / 28</div>
          </div>
          <span style={{ color: SC.gold[500], fontSize: 11, fontWeight: 700 }}>CHANGE</span>
        </div>

        <div style={{ marginTop:'auto' }}>
          <SBn variant="gold" style={{ marginBottom: 10 }}>START 7-DAY FREE TRIAL</SBn>
          <div style={{ textAlign:'center' }}>
            <SM size="xs" color={SC.text.muted}>
              TRIAL ENDS MAY 2 · BILLED 799 EGP / MO AFTER
            </SM>
          </div>
        </div>
      </div>
    </SPhone>
  );
}

// ── 03 WELCOME (post-purchase celebration) ────────────────────
function ProWelcome() {
  return (
    <SPhone>
      <div style={{ height:'100%', display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', padding:'40px 28px 28px', position:'relative', overflow:'hidden' }}>
        {/* Radial glow */}
        <div style={{ position:'absolute', inset: 0,
          background:'radial-gradient(ellipse at 50% 40%, rgba(212,168,67,0.35), transparent 60%)' }}/>
        {/* Orbiting glyphs */}
        {[
          { l:'⚡', t: 100, l2: 40, r: -8 },
          { l:'🔥', t: 140, l2: 290, r: 12 },
          { l:'🛡', t: 500, l2: 30, r: -15 },
          { l:'🎁', t: 560, l2: 300, r: 20 },
          { l:'★',  t: 250, l2: 20, r: -20, sz: 16, c: SC.gold[500] },
          { l:'★',  t: 310, l2: 330, r: 15, sz: 14, c: SC.rose },
        ].map((g, i) => (
          <div key={i} style={{ position:'absolute', top: g.t, left: g.l2,
            fontSize: g.sz || 22, transform:`rotate(${g.r}deg)`,
            color: g.c, opacity: 0.8 }}>{g.l}</div>
        ))}

        {/* Main badge */}
        <div style={{ position:'relative', marginBottom: 34 }}>
          <div style={{ position:'absolute', inset:-30, borderRadius:'50%',
            background:'radial-gradient(circle, rgba(212,168,67,0.5), transparent 70%)',
            filter:'blur(30px)' }}/>
          <div style={{ width: 160, height: 160, borderRadius:'50%', background: HOLO,
            display:'grid', placeItems:'center',
            boxShadow:'0 20px 60px rgba(212,168,67,0.5)', position:'relative',
          }}>
            <div style={{ position:'absolute', inset: 0, borderRadius:'50%',
              background:'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)' }}/>
            <div style={{ fontFamily: ST.type.family.display, fontSize: 52, fontWeight: 900,
              color: SC.text.inverse, letterSpacing:'0.02em', position:'relative' }}>L</div>
          </div>
          {/* Pro ribbon */}
          <div style={{ position:'absolute', bottom:-10, left:'50%', transform:'translateX(-50%)',
            padding:'4px 14px', borderRadius: ST.radius.pill,
            background: SC.bg.base, border:'2px solid '+SC.gold[500],
            color: SC.gold[500], fontSize: 10, fontWeight: 900, letterSpacing:'0.18em',
            fontFamily: ST.type.family.mono, whiteSpace:'nowrap' }}>
            PRO MEMBER
          </div>
        </div>

        <div style={{ position:'relative', textAlign:'center' }}>
          <SM size="sm" color={SC.gold[500]} style={{ marginBottom: 8 }}>✓ WELCOME ABOARD</SM>
          <div style={{ fontFamily: ST.type.family.display, fontSize: 44, color: SC.text.primary,
            fontWeight: 900, letterSpacing:'0.01em', lineHeight: 0.95, marginBottom: 12 }}>
            YOU'RE IN.
          </div>
          <SB style={{ fontSize: 14, color: SC.text.secondary, lineHeight: 1.5, marginBottom: 24, maxWidth: 280 }}>
            Your Pro perks are active. Check the dashboard for this week's exclusive drops and partner offers.
          </SB>
        </div>

        <div style={{ position:'relative', width:'100%', maxWidth: 280, display:'flex', flexDirection:'column', gap: 8 }}>
          <SBn variant="gold">EXPLORE YOUR PERKS →</SBn>
          <button style={{ padding:'11px', color: SC.text.muted, fontSize: 11,
            background:'none', fontFamily: ST.type.family.mono,
            letterSpacing:'0.15em', fontWeight: 600 }}>
            MAYBE LATER
          </button>
        </div>
      </div>
    </SPhone>
  );
}

// ── 04 DASHBOARD ──────────────────────────────────────────────
function ProDashboard() {
  return (
    <SPhone>
      <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
        {/* Header w/ gold glow */}
        <div style={{ position:'relative', padding:'16px 20px 20px',
          background:'radial-gradient(ellipse at top, rgba(212,168,67,0.18), transparent 70%)' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
            <button style={{ width: 36, height: 36, borderRadius:'50%', background: SC.bg.surface,
              border:'1px solid '+SC.stroke.soft, color: SC.text.primary, fontSize: 18 }}>‹</button>
            <div style={{ flex: 1 }}>
              <SM size="sm" color={SC.gold[500]}>● PRO · ACTIVE</SM>
              <SD size="xs" style={{ marginTop: 2 }}>Your Perks</SD>
            </div>
            <button style={{ width: 36, height: 36, borderRadius:'50%', background: SC.bg.surface,
              border:'1px solid '+SC.stroke.soft, color: SC.text.primary, fontSize: 14 }}>⚙</button>
          </div>
        </div>

        {/* Mini membership card */}
        <div style={{ margin:'0 20px', padding:'14px 18px', borderRadius: ST.radius.lg,
          background: HOLO, position:'relative', overflow:'hidden',
          boxShadow:'0 10px 30px rgba(212,168,67,0.25)', color: SC.text.inverse, marginBottom: 20 }}>
          <div style={{ position:'absolute', inset: 0,
            background:'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)' }}/>
          <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing:'0.18em', fontWeight: 700, opacity: 0.8 }}>MEMBER SINCE · APR 2024</div>
              <div style={{ fontFamily: ST.type.family.display, fontSize: 22, fontWeight: 900,
                letterSpacing:'0.02em', marginTop: 2 }}>MARK · PRO</div>
              <div style={{ fontSize: 10, marginTop: 6, fontFamily: ST.type.family.mono,
                letterSpacing:'0.12em', opacity: 0.9, fontWeight: 700 }}>
                NEXT BILL · MAY 9 · 799 EGP
              </div>
            </div>
            <div style={{ fontSize: 40, lineHeight: 1 }}>◉</div>
          </div>
        </div>

        <div style={{ flex: 1, overflow:'hidden', padding:'0 20px' }}>
          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
            {[
              ['3',   'DROPS UNLOCKED', SC.gold[500]],
              ['1.4K','EGP SAVED',      SC.teal],
              ['12',  'LINES SKIPPED',  SC.rose],
            ].map(([v, l, c]) => (
              <div key={l} style={{ padding: 12, borderRadius: ST.radius.md,
                background: SC.bg.surface, border:'1px solid '+SC.stroke.soft, textAlign:'center' }}>
                <div style={{ fontFamily: ST.type.family.display, fontSize: 22, color: c,
                  fontWeight: 900, letterSpacing:'0.02em' }}>{v}</div>
                <SM size="xs" color={SC.text.muted}>{l}</SM>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 8, marginBottom: 16 }}>
            <div style={{ padding: 14, borderRadius: ST.radius.md,
              background:'linear-gradient(135deg, #FF3D6B, #8B3FFF)',
              position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top: 8, right: 8, width: 8, height: 8,
                borderRadius: 4, background: SC.text.primary,
                boxShadow:'0 0 8px '+SC.text.primary }}/>
              <div style={{ fontSize: 20 }}>🔥</div>
              <div style={{ color: SC.text.primary, fontSize: 13, fontWeight: 700, marginTop: 8 }}>Exclusive drops</div>
              <div style={{ color:'rgba(240,237,230,0.75)', fontSize: 10,
                fontFamily: ST.type.family.mono, letterSpacing:'0.1em', marginTop: 2 }}>4 LIVE NOW</div>
            </div>
            <div style={{ padding: 14, borderRadius: ST.radius.md,
              background:'linear-gradient(135deg, #D4A843, #F0C96A)', color: SC.text.inverse }}>
              <div style={{ fontSize: 20 }}>🎁</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginTop: 8 }}>Partner perks</div>
              <div style={{ fontSize: 10, fontFamily: ST.type.family.mono,
                letterSpacing:'0.1em', marginTop: 2, opacity: 0.75, fontWeight: 700 }}>12 ACTIVE</div>
            </div>
          </div>

          {/* Upcoming drop preview */}
          <SM size="sm" color={SC.gold[500]} style={{ marginBottom: 8 }}>NEXT DROP · TONIGHT</SM>
          <div style={{ padding: 14, borderRadius: ST.radius.md,
            background: SC.bg.surface, border:'1px solid '+SC.stroke.soft,
            display:'flex', alignItems:'center', gap: 12 }}>
            <div style={{ width: 50, height: 50, borderRadius: ST.radius.sm,
              background:'linear-gradient(135deg, #8B3FFF, #07060D)',
              display:'grid', placeItems:'center', fontSize: 22 }}>🌑</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: SC.text.primary, fontSize: 13, fontWeight: 700 }}>Midnight Warehouse</div>
              <div style={{ color: SC.text.muted, fontSize: 11, fontFamily: ST.type.family.mono,
                letterSpacing:'0.08em' }}>NEW CAIRO · 02:00 AM</div>
              <div style={{ color: SC.gold[500], fontSize: 11, fontWeight: 700, marginTop: 3 }}>
                FREE FOR PRO
              </div>
            </div>
            <span style={{ color: SC.gold[500], fontSize: 18 }}>›</span>
          </div>
        </div>
      </div>
    </SPhone>
  );
}

// ── 05 EXCLUSIVE DROPS ────────────────────────────────────────
function ExclusiveDrops() {
  const drops = [
    { n:'Midnight Warehouse', h:'Unknown · Verified',      loc:'New Cairo',       d:'Tonight',  m: 47, cap: 80, g:'linear-gradient(135deg, #8B3FFF, #07060D)', em:'🌑', tag:'LIVE',       fee:'FREE FOR PRO', tagColor: SC.teal },
    { n:'Desert Dawn Rave',   h:'LAYLA Curated',           loc:'Fayoum',          d:'Sat · 4AM',m: 23, cap: 60, g:'linear-gradient(135deg, #D4A843, #FF3D6B)', em:'🏜',  tag:'LIMITED',    fee:'1,200 EGP',    tagColor: SC.gold[500] },
    { n:'Yacht Afterhours',   h:'Partner · Gouna Marina',  loc:'Gouna',           d:'Next Fri', m: 12, cap: 30, g:'linear-gradient(135deg, #00E5C8, #D4A843)', em:'🛥',  tag:'EXCLUSIVE',  fee:'3,500 EGP',    tagColor: SC.rose },
  ];
  return (
    <SPhone>
      <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
        {/* Header */}
        <div style={{ padding:'14px 20px 10px', display:'flex', alignItems:'center', gap: 12 }}>
          <button style={{ width: 36, height: 36, borderRadius:'50%', background: SC.bg.surface,
            border:'1px solid '+SC.stroke.soft, color: SC.text.primary, fontSize: 18 }}>‹</button>
          <div style={{ flex: 1 }}>
            <SM size="sm" color={SC.gold[500]}>🔥 DROPS · PRO ONLY</SM>
            <SD size="xs" style={{ marginTop: 2 }}>Exclusive</SD>
          </div>
          <div style={{ padding:'6px 10px', borderRadius: ST.radius.pill,
            background: SC.gold[500] + '22', color: SC.gold[500],
            fontSize: 9, fontFamily: ST.type.family.mono, fontWeight: 900,
            letterSpacing:'0.15em' }}>3 LIVE</div>
        </div>

        {/* Countdown */}
        <div style={{ margin:'6px 20px 16px', padding:'10px 14px', borderRadius: ST.radius.md,
          background:'rgba(212,168,67,0.08)', border:'1px solid rgba(212,168,67,0.25)',
          display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <SM size="xs" color={SC.gold[500]}>NEXT DROP REVEAL</SM>
            <div style={{ color: SC.text.primary, fontSize: 12, fontWeight: 700, marginTop: 2 }}>Friday · 11:00 PM</div>
          </div>
          <div style={{ display:'flex', gap: 6 }}>
            {[['02','D'],['14','H'],['37','M']].map(([v, l]) => (
              <div key={l} style={{ textAlign:'center', minWidth: 30 }}>
                <div style={{ fontFamily: ST.type.family.mono, fontSize: 16, color: SC.gold[500],
                  fontWeight: 900, letterSpacing:'0.05em' }}>{v}</div>
                <SM size="xs" color={SC.text.muted}>{l}</SM>
              </div>
            ))}
          </div>
        </div>

        {/* Drops list */}
        <div style={{ flex: 1, overflow:'hidden', padding:'0 20px 24px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
            {drops.map(p => (
              <div key={p.n} style={{ borderRadius: ST.radius.lg,
                background: SC.bg.surface, border:'1px solid '+SC.stroke.soft, overflow:'hidden' }}>
                {/* Art */}
                <div style={{ height: 110, background: p.g, position:'relative' }}>
                  <div style={{ position:'absolute', inset: 0,
                    background:'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2), transparent 50%)' }}/>
                  <div style={{ position:'absolute', top: 10, left: 12,
                    padding:'3px 8px', borderRadius: ST.radius.pill,
                    background: SC.scrim[60], backdropFilter:'blur(10px)',
                    color: p.tagColor, fontSize: 8, fontWeight: 900, letterSpacing:'0.15em',
                    fontFamily: ST.type.family.mono }}>
                    {p.tag === 'LIVE' && <span style={{ display:'inline-block', width: 5, height: 5,
                      borderRadius: 3, background: SC.teal, marginRight: 4 }}/>}
                    {p.tag}
                  </div>
                  <div style={{ position:'absolute', bottom: 10, right: 12, fontSize: 38 }}>{p.em}</div>
                </div>
                {/* Info */}
                <div style={{ padding: 12 }}>
                  <div style={{ color: SC.text.primary, fontSize: 14, fontWeight: 700 }}>{p.n}</div>
                  <SM size="xs" color={SC.text.muted} style={{ marginTop: 2 }}>{p.h.toUpperCase()}</SM>

                  <div style={{ display:'flex', alignItems:'center', gap: 10, marginTop: 8,
                    paddingTop: 8, borderTop:'1px solid '+SC.stroke.soft }}>
                    <span style={{ color: SC.text.secondary, fontSize: 11 }}>📍 {p.loc}</span>
                    <span style={{ color: SC.text.muted }}>·</span>
                    <span style={{ color: SC.text.secondary, fontSize: 11 }}>⏱ {p.d}</span>
                    <div style={{ flex: 1 }}/>
                    <span style={{ color: p.fee.includes('FREE') ? SC.teal : SC.text.primary,
                      fontSize: 12, fontWeight: 700 }}>{p.fee}</span>
                  </div>

                  {/* Members progress */}
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 4 }}>
                      <div style={{ display:'flex' }}>
                        {[SC.rose, SC.violet, SC.teal].map((c, i) => (
                          <div key={i} style={{ width: 18, height: 18, borderRadius:'50%', background: c,
                            border:'2px solid '+SC.bg.surface, marginLeft: i === 0 ? 0 : -5 }}/>
                        ))}
                      </div>
                      <SM size="xs" color={SC.text.muted}>{p.m}/{p.cap} SPOTS</SM>
                    </div>
                    <div style={{ height: 3, borderRadius: 2, background: SC.stroke.soft, overflow:'hidden' }}>
                      <div style={{ width:`${(p.m/p.cap)*100}%`, height:'100%',
                        background: p.tagColor }}/>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SPhone>
  );
}

// ── Mount ─────────────────────────────────────────────────────
const { DesignCanvas: SDC, DCSection: SDCS, DCArtboard: SDCA, DCPostIt: SDCP } = window;

function ScaleApp() {
  return (
    <SDC>
      <SDCS title="Pro / Scale V2"
        subtitle="Phase 06, redrawn on the LAYLA design system. Gold accent + holographic sheen — the premium membership that connects Events, Parties, Valet, Community.">
        <SDCA label="01 · Pro landing · upsell"><ProLanding/></SDCA>
        <SDCA label="02 · Checkout · plans"><ProCheckout/></SDCA>
        <SDCA label="03 · Welcome · post-purchase"><ProWelcome/></SDCA>
        <SDCA label="04 · Dashboard · perks"><ProDashboard/></SDCA>
        <SDCA label="05 · Exclusive drops · Pro-only"><ExclusiveDrops/></SDCA>

        <SDCP top={-20} left={2020} rotate={3} width={240}>
          Pro card uses a 4-stop holographic gradient (gold→peach→rose→violet) + sheen overlay — the only surface in the system that uses every accent at once. Luxury without being gaudy.
        </SDCP>
        <SDCP bottom={-40} left={80} rotate={-3} width={240}>
          Exclusive drops card a mini-event primitive from Phase 03, reskinned with Pro-only tags, countdown + fee badge. Same grammar, elevated context.
        </SDCP>
      </SDCS>
    </SDC>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ScaleApp/>);
