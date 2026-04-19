// LAYLA — Phase 01 Onboarding V2. Gold-led; brand introduction.

const OT = window.LAYLA_TOKENS;
const OC = OT.color, OG = OT.gradient;
const OL = window.L;
const { Display: OD, Micro: OM, Body: OB, Button: OBn, Tag: OTg, Avatar: OAv } = OL;

// ── Phone frame ───────────────────────────────────────────────
const OPhone = ({ children, time='9:41' }) => (
  <div style={{
    width: 375, height: 812, borderRadius: 44, overflow:'hidden',
    background: OC.bg.base, position:'relative',
    boxShadow:'0 40px 80px rgba(0,0,0,0.5), 0 0 0 2px #1a1a22, 0 0 0 3px #333',
  }}>
    <div style={{ position:'absolute', inset: 0, pointerEvents:'none',
      opacity: OT.effect.grainOpacity, backgroundImage: OT.effect.grain, zIndex: 50 }}/>
    <div style={{ position:'absolute', top: 14, left: 20, right: 20, zIndex: 45,
      display:'flex', justifyContent:'space-between', fontSize: 13,
      color: OC.text.primary, fontFamily: OT.type.family.mono, fontWeight: 600 }}>
      <span>{time}</span><span>●●● 100%</span>
    </div>
    <div style={{ position:'absolute', inset: 0, paddingTop: 44 }}>{children}</div>
  </div>
);

// Step indicator
const Steps = ({ total = 4, current = 0 }) => (
  <div style={{ display:'flex', gap: 4 }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} style={{
        flex: i <= current ? 2 : 1, height: 3, borderRadius: 2,
        background: i <= current ? OC.gold[500] : OC.stroke.mid,
        transition:'all 0.4s',
      }}/>
    ))}
  </div>
);

// ── 01 WELCOME ────────────────────────────────────────────────
function Welcome() {
  return (
    <OPhone>
      <div style={{ height:'100%', position:'relative', overflow:'hidden' }}>
        {/* Ambient glow */}
        <div style={{ position:'absolute', top:'-20%', left:'-20%', right:'-20%', height:'70%',
          background:'radial-gradient(circle, rgba(212,168,67,0.28), transparent 60%)' }}/>
        <div style={{ position:'absolute', bottom:'-30%', left:'-30%', right:'-30%', height:'60%',
          background:'radial-gradient(circle, rgba(255,61,107,0.18), transparent 60%)' }}/>

        <div style={{ position:'relative', height:'100%', display:'flex', flexDirection:'column',
          padding:'48px 32px 32px' }}>
          {/* Logo mark */}
          <div style={{ marginBottom: 40 }}>
            <div style={{
              width: 56, height: 56, borderRadius: OT.radius.md,
              background: OG.gold, display:'grid', placeItems:'center',
              fontFamily: OT.type.family.display, fontSize: 30, color: OC.text.inverse,
              fontWeight: 900, letterSpacing:'0.04em', boxShadow: OT.shadow.glowGold,
            }}>L</div>
          </div>

          {/* Big title */}
          <div style={{ marginTop:'auto' }}>
            <OM size="sm" color={OC.gold[500]}>EGYPT'S NIGHTLIFE</OM>
            <div style={{
              fontFamily: OT.type.family.display, fontSize: 88, color: OC.text.primary,
              fontWeight: 900, lineHeight: 0.82, letterSpacing:'0.01em', marginTop: 12, marginBottom: 16,
            }}>
              NIGHT<br/>IS<br/>YOURS.
            </div>
            <OB style={{ fontSize: 15, lineHeight: 1.5, maxWidth: 280 }}>
              Events, private parties, valet — one app, from sunset to sunrise.
            </OB>
          </div>

          {/* CTAs */}
          <div style={{ marginTop: 40, display:'flex', flexDirection:'column', gap: 10 }}>
            <OBn variant="gold">GET STARTED →</OBn>
            <div style={{ textAlign:'center' }}>
              <span style={{ color: OC.text.secondary, fontSize: 13 }}>
                Already have an account? <span style={{ color: OC.gold[500], fontWeight: 700 }}>Sign in</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </OPhone>
  );
}

// ── 02 PHONE + OTP ───────────────────────────────────────────
function PhoneOTP() {
  const digits = ['1','2','3','4','5','6'];
  return (
    <OPhone>
      <div style={{ height:'100%', display:'flex', flexDirection:'column', padding:'16px 24px 24px' }}>
        <div style={{ marginBottom: 24, display:'flex', alignItems:'center', gap: 12 }}>
          <button style={{ width: 36, height: 36, borderRadius:'50%', background: OC.bg.surface,
            border:'1px solid '+OC.stroke.soft, color: OC.text.primary, fontSize: 18 }}>‹</button>
          <div style={{ flex: 1 }}><Steps total={4} current={1}/></div>
          <OM size="xs" color={OC.text.muted}>2/4</OM>
        </div>

        <OM size="sm" color={OC.gold[500]}>VERIFY</OM>
        <div style={{ fontFamily: OT.type.family.display, fontSize: 42, color: OC.text.primary,
          fontWeight: 900, lineHeight: 0.95, letterSpacing:'0.02em', marginTop: 6 }}>
          ENTER THE<br/>CODE.
        </div>
        <OB style={{ marginTop: 10, marginBottom: 28, fontSize: 13 }}>
          Sent a 6-digit code to <span style={{ color: OC.text.primary, fontWeight: 700 }}>+20 122 ••• 8374</span>
        </OB>

        {/* Phone field — read-only summary */}
        <div style={{ padding:'12px 14px', borderRadius: OT.radius.md,
          background: OC.bg.surface, border:'1px solid '+OC.stroke.soft,
          display:'flex', alignItems:'center', gap: 10, marginBottom: 18,
          opacity: 0.6 }}>
          <div style={{ color: OC.text.primary, fontSize: 14, fontWeight: 700 }}>🇪🇬 +20</div>
          <div style={{ flex: 1, color: OC.text.primary, fontSize: 14, fontFamily: OT.type.family.mono }}>122 ••• 8374</div>
          <span style={{ color: OC.gold[500], fontSize: 11, fontWeight: 700 }}>EDIT</span>
        </div>

        {/* OTP boxes */}
        <OM size="sm" color={OC.text.muted} style={{ marginBottom: 10 }}>ENTER 6-DIGIT CODE</OM>
        <div style={{ display:'flex', gap: 8, marginBottom: 16 }}>
          {digits.map((d, i) => (
            <div key={i} style={{
              flex: 1, aspectRatio: '1', borderRadius: OT.radius.md,
              background: OC.bg.surface,
              border: '1.5px solid ' + (i < 5 ? OC.gold[500] : OC.stroke.mid),
              display:'grid', placeItems:'center',
              color: OC.text.primary, fontSize: 26, fontWeight: 800,
              fontFamily: OT.type.family.mono,
              boxShadow: i < 5 ? '0 0 0 3px rgba(212,168,67,0.1)' : 'none',
            }}>{i < 5 ? d : ''}</div>
          ))}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap: 6, marginBottom: 'auto' }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, background: OC.teal, boxShadow: OT.shadow.glowTeal }}/>
          <OM size="xs" color={OC.text.muted}>RESEND IN 00:28</OM>
        </div>

        <OBn variant="gold">VERIFY →</OBn>
      </div>
    </OPhone>
  );
}

// ── 03 PROFILE + VIBES ────────────────────────────────────────
function Profile() {
  const vibes = [
    { v:'House',       on: true  }, { v:'Techno',      on: true  },
    { v:'Afro',        on: false }, { v:'Arabic',      on: false },
    { v:'Rooftop',     on: true  }, { v:'Underground', on: false },
    { v:'Beach',       on: false }, { v:'Pool',        on: true  },
    { v:'Lounge',      on: false }, { v:'Chill',       on: false },
    { v:'Hip-Hop',     on: false }, { v:'R&B',         on: false },
  ];
  const selected = vibes.filter(v => v.on).length;
  return (
    <OPhone>
      <div style={{ height:'100%', display:'flex', flexDirection:'column', padding:'16px 24px 24px' }}>
        <div style={{ marginBottom: 20, display:'flex', alignItems:'center', gap: 12 }}>
          <button style={{ width: 36, height: 36, borderRadius:'50%', background: OC.bg.surface,
            border:'1px solid '+OC.stroke.soft, color: OC.text.primary, fontSize: 18 }}>‹</button>
          <div style={{ flex: 1 }}><Steps total={4} current={2}/></div>
          <OM size="xs" color={OC.text.muted}>3/4</OM>
        </div>

        <OM size="sm" color={OC.gold[500]}>YOUR PROFILE</OM>
        <div style={{ fontFamily: OT.type.family.display, fontSize: 36, color: OC.text.primary,
          fontWeight: 900, lineHeight: 0.95, letterSpacing:'0.02em', marginTop: 6, marginBottom: 20 }}>
          WHO ARE<br/>YOU?
        </div>

        {/* Name */}
        <OM size="sm" color={OC.text.muted} style={{ marginBottom: 6 }}>NAME</OM>
        <div style={{ padding:'12px 14px', borderRadius: OT.radius.md,
          background: OC.bg.surface, border:'1.5px solid '+OC.gold[500],
          color: OC.text.primary, fontSize: 15, fontWeight: 600, marginBottom: 14 }}>
          Yasmin R.
          <span style={{ marginLeft: 4, borderLeft:'2px solid '+OC.gold[500], paddingLeft: 1,
            animation:'caret 0.9s step-end infinite' }}/>
        </div>

        {/* Age */}
        <div style={{ display:'flex', gap: 10, marginBottom: 18 }}>
          <div style={{ flex: 1 }}>
            <OM size="sm" color={OC.text.muted} style={{ marginBottom: 6 }}>AGE</OM>
            <div style={{ padding:'12px 14px', borderRadius: OT.radius.md,
              background: OC.bg.surface, border:'1px solid '+OC.stroke.soft,
              color: OC.text.primary, fontSize: 15, fontWeight: 700, fontFamily: OT.type.family.mono }}>
              24
            </div>
          </div>
          <div style={{ flex: 1.3 }}>
            <OM size="sm" color={OC.text.muted} style={{ marginBottom: 6 }}>CITY</OM>
            <div style={{ padding:'12px 14px', borderRadius: OT.radius.md,
              background: OC.bg.surface, border:'1px solid '+OC.stroke.soft,
              color: OC.text.primary, fontSize: 15, fontWeight: 600, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span>🏙️ Cairo</span>
              <span style={{ color: OC.text.muted }}>⌄</span>
            </div>
          </div>
        </div>

        {/* Vibes */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 10 }}>
          <OM size="sm" color={OC.gold[500]}>YOUR VIBE</OM>
          <OM size="xs" color={OC.text.muted}>{selected} SELECTED · MIN 3</OM>
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap: 6, marginBottom: 'auto' }}>
          {vibes.map(({ v, on }) => (
            <div key={v} style={{
              padding:'7px 12px', borderRadius: OT.radius.pill,
              background: on ? OG.gold : 'rgba(255,255,255,0.04)',
              color: on ? OC.text.inverse : OC.text.secondary,
              border: on ? 'none' : '1px solid '+OC.stroke.soft,
              fontSize: 12, fontWeight: on ? 800 : 500,
            }}>{v}</div>
          ))}
        </div>

        <OBn variant="gold" style={{ marginTop: 20 }}>CONTINUE →</OBn>
      </div>
    </OPhone>
  );
}

// ── 04 ROLE ───────────────────────────────────────────────────
function Role() {
  const roles = [
    { id:'guest', n:'I want to go out',
      d:'Discover events, join parties, book valet',
      i:'🌙', c: OC.gold[500], grad: OG.gold, on: true },
    { id:'host',  n:'I want to host',
      d:'Throw private parties, curate your guest list',
      i:'▲', c: OC.violet, grad: OG.night, on: false },
    { id:'pro',   n:"I'm a venue / DJ / promoter",
      d:'Sell tickets, promote events, grow your crowd',
      i:'◆', c: OC.gold[400], grad: OG.goldShine, on: false, pro: true },
  ];
  return (
    <OPhone>
      <div style={{ height:'100%', display:'flex', flexDirection:'column', padding:'16px 24px 24px' }}>
        <div style={{ marginBottom: 20, display:'flex', alignItems:'center', gap: 12 }}>
          <button style={{ width: 36, height: 36, borderRadius:'50%', background: OC.bg.surface,
            border:'1px solid '+OC.stroke.soft, color: OC.text.primary, fontSize: 18 }}>‹</button>
          <div style={{ flex: 1 }}><Steps total={4} current={3}/></div>
          <OM size="xs" color={OC.text.muted}>4/4</OM>
        </div>

        <OM size="sm" color={OC.gold[500]}>ONE LAST THING</OM>
        <div style={{ fontFamily: OT.type.family.display, fontSize: 36, color: OC.text.primary,
          fontWeight: 900, lineHeight: 0.95, letterSpacing:'0.02em', marginTop: 6, marginBottom: 6 }}>
          WHAT BRINGS<br/>YOU HERE?
        </div>
        <OB style={{ marginBottom: 24 }}>You can switch later.</OB>

        <div style={{ display:'flex', flexDirection:'column', gap: 10, marginBottom: 'auto' }}>
          {roles.map(r => (
            <div key={r.id} style={{
              position:'relative', padding: 16, borderRadius: OT.radius.lg,
              background: r.on ? 'rgba(212,168,67,0.08)' : OC.bg.surface,
              border: '1.5px solid ' + (r.on ? OC.gold[500] : OC.stroke.soft),
              display:'flex', alignItems:'center', gap: 14,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: OT.radius.md, background: r.grad,
                display:'grid', placeItems:'center',
                color: r.id === 'guest' ? OC.text.inverse : OC.text.primary,
                fontSize: 22, fontWeight: 900, flexShrink: 0,
                boxShadow: r.on ? OT.shadow.glowGold : 'none',
              }}>{r.i}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
                  <div style={{ color: OC.text.primary, fontSize: 14, fontWeight: 700 }}>{r.n}</div>
                  {r.pro && <OTg bg={OC.gold[500]}>PRO</OTg>}
                </div>
                <OB size="sm" style={{ marginTop: 2 }}>{r.d}</OB>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius:'50%',
                border:'1.5px solid '+ (r.on ? OC.gold[500] : OC.stroke.mid),
                background: r.on ? OC.gold[500] : 'transparent',
                display:'grid', placeItems:'center',
              }}>{r.on && <span style={{ color: OC.text.inverse, fontSize: 11, fontWeight: 900 }}>✓</span>}</div>
            </div>
          ))}
        </div>

        <OBn variant="gold" style={{ marginTop: 20 }}>ENTER LAYLA →</OBn>
      </div>
    </OPhone>
  );
}

// ── 05 WELCOME HOME ───────────────────────────────────────────
function Done() {
  return (
    <OPhone>
      <div style={{ height:'100%', position:'relative', overflow:'hidden' }}>
        {/* Burst glow */}
        <div style={{ position:'absolute', top:'20%', left:'50%', transform:'translate(-50%,-50%)',
          width: 500, height: 500,
          background:'radial-gradient(circle, rgba(212,168,67,0.35), transparent 60%)' }}/>

        <div style={{ position:'relative', height:'100%', display:'flex', flexDirection:'column',
          padding:'40px 32px 28px', textAlign:'center' }}>
          {/* Check chip */}
          <div style={{
            width: 80, height: 80, borderRadius:'50%', background: OG.gold,
            display:'grid', placeItems:'center', color: OC.text.inverse,
            fontSize: 36, fontWeight: 900, margin:'20px auto 28px',
            boxShadow: OT.shadow.glowGold,
          }}>✓</div>

          <OM size="sm" color={OC.gold[500]}>AHLAN WA SAHLAN</OM>
          <div style={{
            fontFamily: OT.type.family.display, fontSize: 52, color: OC.text.primary,
            fontWeight: 900, lineHeight: 0.88, letterSpacing:'0.02em', marginTop: 8, marginBottom: 14,
          }}>
            WELCOME<br/>TO LAYLA,<br/><span style={{ color: OC.gold[500] }}>YASMIN.</span>
          </div>
          <OB style={{ fontSize: 14, lineHeight: 1.5, maxWidth: 280, margin:'0 auto' }}>
            4 events tonight match your vibe. 2 parties open for requests.
          </OB>

          {/* Preview chips */}
          <div style={{ marginTop: 28, marginBottom:'auto',
            display:'flex', flexDirection:'column', gap: 10 }}>
            {[
              { i:'◐', c: OC.gold[500], l:'EVENTS',     d:'4 tonight · 12 this week' },
              { i:'▲', c: OC.rose,      l:'PARTIES',    d:'2 open · 1 friend hosting' },
              { i:'▶', c: OC.teal,      l:'VALET',      d:'Active in Zamalek & Sahel' },
            ].map(r => (
              <div key={r.l} style={{
                padding: 12, borderRadius: OT.radius.md,
                background: OC.bg.surface, border:'1px solid '+OC.stroke.soft,
                display:'flex', alignItems:'center', gap: 12,
                textAlign:'left',
              }}>
                <div style={{ width: 36, height: 36, borderRadius: OT.radius.sm,
                  background: r.c + '26', border:'1px solid '+r.c+'4D',
                  display:'grid', placeItems:'center', color: r.c, fontSize: 14, fontWeight: 900 }}>{r.i}</div>
                <div style={{ flex: 1 }}>
                  <OM size="xs" color={r.c}>{r.l}</OM>
                  <div style={{ color: OC.text.primary, fontSize: 13, fontWeight: 600, marginTop: 2 }}>{r.d}</div>
                </div>
                <span style={{ color: OC.text.muted, fontSize: 16 }}>›</span>
              </div>
            ))}
          </div>

          <OBn variant="gold" style={{ marginTop: 20 }}>START EXPLORING →</OBn>
        </div>
      </div>
    </OPhone>
  );
}

// ── Mount ─────────────────────────────────────────────────────
const { DesignCanvas: ODC, DCSection: ODCS, DCArtboard: ODCA, DCPostIt: ODCP } = window;

function OnboardingApp() {
  return (
    <ODC>
      <ODCS title="Onboarding V2" subtitle="Phase 01, redrawn on the LAYLA design system. Brand-led entry: splash → verify → profile → role → welcome home.">
        <ODCA label="01 · Welcome · brand"><Welcome/></ODCA>
        <ODCA label="02 · Phone · OTP verify"><PhoneOTP/></ODCA>
        <ODCA label="03 · Profile · vibes"><Profile/></ODCA>
        <ODCA label="04 · Role picker"><Role/></ODCA>
        <ODCA label="05 · Welcome home"><Done/></ODCA>
        <ODCP top={-20} left={2020} rotate={3} width={220}>
          Ahlan wa sahlan — Arabic welcome. Localizes the brand without losing the Bebas display voice.
        </ODCP>
        <ODCP bottom={-40} left={80} rotate={-3} width={240}>
          Step indicator top-right, gold progress fill. Min 3 vibes = personalization kicks in on the home feed.
        </ODCP>
      </ODCS>
    </ODC>
  );
}

// caret blink for the name field
const oStyle = document.createElement('style');
oStyle.textContent = '@keyframes caret { 50% { opacity: 0 } }';
document.head.appendChild(oStyle);

ReactDOM.createRoot(document.getElementById('root')).render(<OnboardingApp/>);
