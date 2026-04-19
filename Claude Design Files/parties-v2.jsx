// LAYLA — Phase 03 Parties V2. Violet/rose accent rail; address-locked mechanic.

const PT = window.LAYLA_TOKENS;
const PC = PT.color, PG = PT.gradient;
const PL = window.L;
const { Display: PDisplay, Micro: PMicro, Body: PBody, Button: PButton, Tag: PTag, VerifiedBadge: PVB, Avatar: PAv } = PL;

// ── Phone ──────────────────────────────────────────────────────
const PPhone = ({ children, time='9:41' }) => (
  <div style={{
    width: 375, height: 812, borderRadius: 44, overflow:'hidden',
    background: PC.bg.base, position:'relative',
    boxShadow:'0 40px 80px rgba(0,0,0,0.5), 0 0 0 2px #1a1a22, 0 0 0 3px #333',
  }}>
    <div style={{ position:'absolute', inset: 0, pointerEvents:'none',
      opacity: PT.effect.grainOpacity, backgroundImage: PT.effect.grain, zIndex: 50 }}/>
    <div style={{ position:'absolute', top: 14, left: 20, right: 20, zIndex: 45,
      display:'flex', justifyContent:'space-between', fontSize: 13,
      color: PC.text.primary, fontFamily: PT.type.family.mono, fontWeight: 600 }}>
      <span>{time}</span><span>●●● 100%</span>
    </div>
    <div style={{ position:'absolute', inset: 0, paddingTop: 44 }}>{children}</div>
  </div>
);

const PTabBar = ({ active='parties' }) => {
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
      padding:'12px 16px 28px', background:'rgba(7,6,13,0.8)',
      backdropFilter:'blur(20px)', borderTop:'1px solid '+PC.stroke.soft,
      display:'flex', justifyContent:'space-around',
    }}>
      {tabs.map(t => {
        const on = t.id === active;
        const c = on ? PC.rose : PC.text.muted;
        return (
          <div key={t.id} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 4, flex: 1 }}>
            <span style={{ color: c, fontSize: 18 }}>{t.icon}</span>
            <span style={{ fontSize: 9, letterSpacing:'0.1em', fontFamily: PT.type.family.mono,
              color: c, fontWeight: on ? 700 : 500 }}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
};

// ── Party data ────────────────────────────────────────────────
const parties = [
  { id:1, title:'Rooftop Sunset', host:'Karim A.', hostColor: PC.gold[500], rating:4.9, parties:12,
    when:'Tonight · 8 PM', hood:'Zamalek · Cairo', theme:'Sunset chill · lounge',
    emoji:'🌅', grad: PG.sunset, cap:15, approved:9, tag:'TONIGHT', tagBg: PC.rose },
  { id:2, title:'Afterparty Zamalek', host:'Nour H.', hostColor: PC.violet, rating:5.0, parties:28,
    when:'Sat · 1 AM', hood:'Zamalek · Cairo', theme:'Techno · underground',
    emoji:'🌙', grad:'linear-gradient(135deg, #8B3FFF, #07060D)', cap:30, approved:22, tag:'STRICT DOOR', tagBg: PC.violet },
  { id:3, title:'Pool Day · Sahel', host:'Yasmin R.', hostColor: PC.teal, rating:4.8, parties:6,
    when:'Sun · 2 PM', hood:'Sidi Heneish · Sahel', theme:'Poolside day drinks',
    emoji:'🏖️', grad:'linear-gradient(135deg, #00E5C8, #D4A843)', cap:20, approved:14, tag:null },
  { id:4, title:'Masr El Gedida Loft', host:'Tarek O.', hostColor: PC.rose, rating:4.7, parties:4,
    when:'Fri · 9 PM', hood:'Heliopolis · Cairo', theme:'House music loft',
    emoji:'🏠', grad:'linear-gradient(135deg, #FF3D6B, #8B3FFF)', cap:25, approved:11, tag:'NEW HOST', tagBg: PC.teal },
];

// ── 01 FEED ───────────────────────────────────────────────────
function PartiesFeed() {
  return (
    <PPhone>
      <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'16px 20px 12px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 14 }}>
            <div>
              <PMicro size="sm" color={PC.rose}>● INVITE-ONLY · CAIRO</PMicro>
              <PDisplay size="xs" style={{ marginTop: 2 }}>Parties</PDisplay>
            </div>
            <button style={{ width: 40, height: 40, borderRadius:'50%',
              background: PG.night, border:'1px solid '+PC.stroke.soft,
              color: PC.text.primary, fontSize: 18, fontWeight: 300 }}>+</button>
          </div>
          <div style={{ display:'flex', gap: 8 }}>
            {['All','Tonight','This Week','Hosted by friends'].map((f, i) => (
              <div key={f} style={{
                padding:'6px 12px', borderRadius: PT.radius.pill,
                fontSize: 11, fontWeight: i===0 ? 700 : 500,
                background: i===0 ? PG.night : 'rgba(255,255,255,0.04)',
                color: i===0 ? PC.text.primary : PC.text.secondary,
                border: i===0 ? '1px solid '+PC.stroke.mid : '1px solid '+PC.stroke.soft,
                whiteSpace:'nowrap',
              }}>{f}</div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflow:'hidden', padding:'4px 20px 100px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap: 14 }}>
            {parties.map(p => (
              <div key={p.id} style={{
                borderRadius: PT.radius.xl, overflow:'hidden',
                background: PC.bg.surface, border:'1px solid '+PC.stroke.soft,
              }}>
                {/* Hero band */}
                <div style={{ position:'relative', height: 120, background: p.grad }}>
                  <div style={{ position:'absolute', inset: 0,
                    background:'linear-gradient(180deg, transparent 40%, rgba(7,6,13,0.7))' }}/>
                  <div style={{ position:'absolute', top: 10, left: 12, display:'flex', gap: 6 }}>
                    {p.tag && <PTag bg={p.tagBg}>{p.tag}</PTag>}
                    <PTag bg={PC.scrim[60]} fg={PC.text.primary}>🔒 ADDRESS LOCKED</PTag>
                  </div>
                  <div style={{ position:'absolute', top: 8, right: 12, fontSize: 32 }}>{p.emoji}</div>
                  <div style={{ position:'absolute', bottom: 10, left: 14, right: 14 }}>
                    <div style={{ fontFamily: PT.type.family.display, fontSize: 22,
                      color: PC.text.primary, fontWeight: 900, lineHeight: 1, letterSpacing:'0.02em' }}>
                      {p.title.toUpperCase()}
                    </div>
                    <div style={{ color: PC.text.secondary, fontSize: 10, fontFamily: PT.type.family.mono,
                      letterSpacing:'0.12em', marginTop: 4 }}>
                      {p.when.toUpperCase()} · {p.hood.toUpperCase()}
                    </div>
                  </div>
                </div>
                {/* Host row */}
                <div style={{ padding:'12px 14px', display:'flex', alignItems:'center', gap: 10 }}>
                  <div style={{ position:'relative' }}>
                    <PAv size={34} color={p.hostColor}>{p.host[0]}</PAv>
                    <div style={{ position:'absolute', bottom:-2, right:-2, width: 14, height: 14, borderRadius:'50%',
                      background: PC.teal, border:'2px solid '+PC.bg.surface,
                      display:'grid', placeItems:'center', fontSize: 8, color: PC.text.inverse, fontWeight: 900 }}>✓</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: PC.text.primary, fontSize: 12, fontWeight: 700 }}>
                      HOST · {p.host}
                    </div>
                    <div style={{ color: PC.text.muted, fontSize: 10, fontFamily: PT.type.family.mono, letterSpacing:'0.08em', marginTop: 1 }}>
                      ★ {p.rating} · {p.parties} PARTIES HOSTED
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ color: PC.text.primary, fontSize: 11, fontWeight: 700 }}>
                      {p.approved}<span style={{ color: PC.text.muted }}>/{p.cap}</span>
                    </div>
                    <PMicro size="xs" color={PC.text.muted}>APPROVED</PMicro>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <PTabBar active="parties"/>
      </div>
    </PPhone>
  );
}

// ── 02 LOCKED DETAIL ──────────────────────────────────────────
function PartyDetail() {
  const p = parties[1]; // Afterparty Zamalek — violet
  const rules = ['18+ only','No phones on the dancefloor','Stay until sunrise or leave before 3 AM','Guest list only'];
  return (
    <PPhone>
      <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
        {/* Hero */}
        <div style={{ position:'relative', height: 240, background: p.grad, flexShrink: 0 }}>
          <div style={{ position:'absolute', inset: 0,
            background:'radial-gradient(circle at 70% 30%, rgba(139,63,255,0.4), transparent 60%)' }}/>
          <div style={{ position:'absolute', inset: 0,
            background:'linear-gradient(180deg, transparent 30%, #07060D)' }}/>
          <div style={{ position:'absolute', top: 12, left: 16, right: 16, display:'flex', justifyContent:'space-between' }}>
            <button style={{ width: 36, height: 36, borderRadius:'50%', background: PC.scrim[60],
              backdropFilter:'blur(10px)', color: PC.text.primary, border:'none', fontSize: 18 }}>‹</button>
            <button style={{ width: 36, height: 36, borderRadius:'50%', background: PC.scrim[60],
              backdropFilter:'blur(10px)', color: PC.text.primary, border:'none', fontSize: 14 }}>↗</button>
          </div>
          <div style={{ position:'absolute', bottom: 20, left: 20, right: 20 }}>
            <div style={{ display:'flex', gap: 6, marginBottom: 10 }}>
              <PTag bg={PC.violet}>STRICT DOOR</PTag>
              <PTag bg={PC.scrim[60]} fg={PC.text.primary}>🔒 LOCKED</PTag>
            </div>
            <div style={{ fontFamily: PT.type.family.display, fontSize: 36, color: PC.text.primary,
              fontWeight: 900, lineHeight: 0.95, letterSpacing:'0.02em' }}>
              AFTERPARTY<br/>ZAMALEK
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflow:'hidden', padding:'14px 20px 100px' }}>
          {/* Host card */}
          <div style={{ padding: 14, borderRadius: PT.radius.md,
            background: PC.bg.surface, border:'1px solid '+PC.stroke.soft,
            display:'flex', alignItems:'center', gap: 12, marginBottom: 16 }}>
            <div style={{ position:'relative' }}>
              <PAv size={44} color={PC.violet}>N</PAv>
              <div style={{ position:'absolute', bottom:-2, right:-2, width: 16, height: 16, borderRadius:'50%',
                background: PC.teal, border:'2px solid '+PC.bg.surface,
                display:'grid', placeItems:'center', fontSize: 9, color: PC.text.inverse, fontWeight: 900 }}>✓</div>
            </div>
            <div style={{ flex: 1 }}>
              <PMicro size="xs" color={PC.violet}>HOST · VERIFIED</PMicro>
              <div style={{ color: PC.text.primary, fontSize: 15, fontWeight: 700, marginTop: 2 }}>Nour H., 25</div>
              <div style={{ color: PC.text.muted, fontSize: 10, fontFamily: PT.type.family.mono, letterSpacing:'0.1em', marginTop: 2 }}>
                ★ 5.0 · 28 PARTIES · RESPONDS IN 12 MIN
              </div>
            </div>
            <button style={{ padding:'8px 12px', borderRadius: PT.radius.pill,
              background:'transparent', border:'1px solid '+PC.stroke.mid,
              color: PC.text.primary, fontSize: 10, fontWeight: 700, letterSpacing:'0.1em' }}>VIEW</button>
          </div>

          {/* Meta rows */}
          <div style={{ display:'flex', flexDirection:'column', gap: 8, marginBottom: 18 }}>
            {[
              { i:'📅', k:'SATURDAY · APR 25', v:'1:00 AM — 6:00 AM', c: PC.violet },
              { i:'📍', k:'ZAMALEK · CAIRO', v:'Exact address revealed on approval', c: PC.rose, locked: true },
              { i:'♪',  k:'THEME · TECHNO',   v:'All black · no phones on floor', c: PC.gold[500] },
            ].map((r, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap: 12,
                padding: 10, borderRadius: PT.radius.sm,
                background: r.locked ? 'rgba(255,61,107,0.06)' : 'transparent',
                border: r.locked ? '1px dashed '+PC.rose+'4D' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: PT.radius.sm,
                  background: r.c + '26', border:'1px solid '+r.c+'4D',
                  display:'grid', placeItems:'center', color: r.c, fontSize: 14 }}>{r.locked ? '🔒' : r.i}</div>
                <div style={{ flex: 1 }}>
                  <PMicro size="xs" color={r.c}>{r.k}</PMicro>
                  <div style={{ color: PC.text.primary, fontSize: 12, fontWeight: 600, marginTop: 2 }}>{r.v}</div>
                </div>
              </div>
            ))}
          </div>

          {/* House rules */}
          <PMicro size="sm" color={PC.text.muted} style={{ marginBottom: 10 }}>HOUSE RULES · READ CAREFULLY</PMicro>
          <div style={{ display:'flex', flexDirection:'column', gap: 6, marginBottom: 18 }}>
            {rules.map((r, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap: 10,
                padding: 10, borderRadius: PT.radius.sm,
                background:'rgba(255,255,255,0.03)' }}>
                <div style={{ width: 20, height: 20, borderRadius:'50%',
                  background:'rgba(139,63,255,0.15)',
                  display:'grid', placeItems:'center', color: PC.violet,
                  fontSize: 10, fontWeight: 900 }}>{i+1}</div>
                <PBody size="sm" style={{ color: PC.text.primary }}>{r}</PBody>
              </div>
            ))}
          </div>

          {/* Who's going (anon) */}
          <PMicro size="sm" color={PC.text.muted} style={{ marginBottom: 10 }}>WHO'S GOING · 22 APPROVED</PMicro>
          <div style={{ display:'flex', gap: -8, marginBottom: 14 }}>
            {['#D4A843','#FF3D6B','#8B3FFF','#00E5C8','#D4A843','#FF3D6B','#8B3FFF'].map((c, i) => (
              <div key={i} style={{
                width: 32, height: 32, borderRadius:'50%', background: c,
                border: '2px solid '+PC.bg.base, marginLeft: i===0 ? 0 : -10,
                display:'grid', placeItems:'center', color: PC.text.inverse, fontSize: 11, fontWeight: 800,
              }}>{['A','B','C','D','E','F','G'][i]}</div>
            ))}
            <div style={{
              width: 32, height: 32, borderRadius:'50%', background: PC.bg.surface,
              border:'2px solid '+PC.bg.base, marginLeft: -10,
              display:'grid', placeItems:'center',
              color: PC.text.secondary, fontSize: 10, fontWeight: 700, fontFamily: PT.type.family.mono,
            }}>+15</div>
          </div>
        </div>

        <div style={{ position:'absolute', bottom: 0, left: 0, right: 0, padding:'16px 20px 28px',
          background:'linear-gradient(180deg, transparent, rgba(7,6,13,0.95) 30%)' }}>
          <PButton variant="night">REQUEST TO JOIN →</PButton>
          <div style={{ textAlign:'center', marginTop: 6 }}>
            <PMicro size="xs" color={PC.text.muted}>HOST APPROVES EACH GUEST MANUALLY</PMicro>
          </div>
        </div>
      </div>
    </PPhone>
  );
}

// ── 03 REQUEST TO JOIN ────────────────────────────────────────
function RequestJoin() {
  const msg = 'Love your vibe! First time at one of your parties — friend of Karim. Promise to respect the rules 🌙';
  return (
    <PPhone>
      <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'14px 20px 0' }}>
          <button style={{ width: 36, height: 36, borderRadius:'50%', background: PC.bg.surface,
            border:'1px solid '+PC.stroke.soft, color: PC.text.primary, fontSize: 18 }}>×</button>
        </div>

        <div style={{ flex: 1, overflow:'hidden', padding:'14px 24px 100px' }}>
          <PMicro size="sm" color={PC.rose}>REQUEST TO JOIN</PMicro>
          <div style={{ fontFamily: PT.type.family.display, fontSize: 36, color: PC.text.primary,
            fontWeight: 900, lineHeight: 0.95, letterSpacing:'0.02em', marginTop: 6, marginBottom: 20 }}>
            INTRO YOURSELF<br/>TO NOUR.
          </div>

          {/* Host reminder */}
          <div style={{ padding: 12, borderRadius: PT.radius.md,
            background: PC.bg.surface, border:'1px solid '+PC.stroke.soft,
            display:'flex', alignItems:'center', gap: 12, marginBottom: 20 }}>
            <PAv size={36} color={PC.violet}>N</PAv>
            <div style={{ flex: 1 }}>
              <div style={{ color: PC.text.primary, fontSize: 13, fontWeight: 700 }}>Afterparty Zamalek</div>
              <PBody size="sm">Nour H. · Sat, Apr 25 · 1 AM</PBody>
            </div>
          </div>

          {/* Profile preview card */}
          <PMicro size="sm" color={PC.text.muted} style={{ marginBottom: 8 }}>SHE'LL SEE</PMicro>
          <div style={{ padding: 14, borderRadius: PT.radius.md,
            background: PC.bg.surface, border:'1px solid '+PC.stroke.soft, marginBottom: 16 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 12, marginBottom: 10 }}>
              <PAv size={44} color={PC.gold[500]}>Y</PAv>
              <div style={{ flex: 1 }}>
                <div style={{ color: PC.text.primary, fontSize: 14, fontWeight: 700, display:'flex', alignItems:'center', gap: 6 }}>
                  You, 24
                  <span style={{ fontSize: 10, color: PC.teal }}>✓</span>
                </div>
                <PBody size="sm">Zamalek · 3 mutual friends · House, Techno</PBody>
              </div>
            </div>
            <div style={{ display:'flex', gap: 6, flexWrap:'wrap' }}>
              {['House','Techno','Rooftop','Chill'].map(v => (
                <span key={v} style={{
                  padding:'3px 8px', borderRadius: PT.radius.pill,
                  background:'rgba(212,168,67,0.1)', color: PC.gold[500],
                  fontSize: 10, fontWeight: 600,
                }}>{v}</span>
              ))}
            </div>
          </div>

          {/* Message */}
          <PMicro size="sm" color={PC.text.muted} style={{ marginBottom: 8 }}>YOUR MESSAGE · OPTIONAL</PMicro>
          <div style={{ padding: 12, borderRadius: PT.radius.md,
            background: PC.bg.surface, border:'1.5px solid '+PC.rose, minHeight: 100 }}>
            <div style={{ color: PC.text.primary, fontSize: 13, lineHeight: 1.5 }}>{msg}</div>
            <div style={{ textAlign:'right', marginTop: 8,
              color: PC.text.muted, fontSize: 9, fontFamily: PT.type.family.mono, letterSpacing:'0.1em' }}>
              {msg.length}/240
            </div>
          </div>
        </div>

        <div style={{ position:'absolute', bottom: 0, left: 0, right: 0, padding:'16px 20px 28px',
          background:'linear-gradient(180deg, transparent, rgba(7,6,13,0.95) 30%)' }}>
          <PButton variant="night">SEND REQUEST →</PButton>
          <div style={{ textAlign:'center', marginTop: 6 }}>
            <PMicro size="xs" color={PC.text.muted}>NOUR TYPICALLY RESPONDS IN 12 MIN</PMicro>
          </div>
        </div>
      </div>
    </PPhone>
  );
}

// ── 04 APPROVED · ADDRESS UNLOCKED ────────────────────────────
function Approved() {
  return (
    <PPhone>
      <div style={{ height:'100%', display:'flex', flexDirection:'column',
        background:'radial-gradient(circle at 50% 0%, rgba(0,229,200,0.15), transparent 60%), #07060D' }}>
        <div style={{ padding:'14px 20px 0', textAlign:'right' }}>
          <button style={{ width: 36, height: 36, borderRadius:'50%', background: PC.bg.surface,
            border:'1px solid '+PC.stroke.soft, color: PC.text.primary, fontSize: 14 }}>×</button>
        </div>

        <div style={{ flex: 1, padding:'16px 24px 100px', overflow:'hidden' }}>
          {/* Celebration header */}
          <div style={{ textAlign:'center', marginTop: 16, marginBottom: 24 }}>
            <div style={{
              display:'inline-grid', placeItems:'center', width: 72, height: 72, borderRadius:'50%',
              background:'rgba(0,229,200,0.15)', border:'2px solid '+PC.teal,
              boxShadow: PT.shadow.glowTeal, marginBottom: 16,
              color: PC.teal, fontSize: 28, fontWeight: 900,
            }}>✓</div>
            <PMicro size="sm" color={PC.teal}>YOU'RE IN</PMicro>
            <div style={{ fontFamily: PT.type.family.display, fontSize: 40, color: PC.text.primary,
              fontWeight: 900, lineHeight: 0.95, letterSpacing:'0.02em', marginTop: 6 }}>
              NOUR APPROVED<br/>YOUR REQUEST.
            </div>
          </div>

          {/* Unlocked address card */}
          <div style={{ padding: 16, borderRadius: PT.radius.lg,
            background: PC.bg.surface, border:'1.5px solid '+PC.teal,
            boxShadow:'0 10px 40px rgba(0,229,200,0.15)', marginBottom: 14 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius:'50%',
                background: PC.teal, display:'grid', placeItems:'center',
                color: PC.text.inverse, fontSize: 11, fontWeight: 900 }}>🔓</div>
              <PMicro size="sm" color={PC.teal}>ADDRESS UNLOCKED</PMicro>
            </div>
            <div style={{ fontFamily: PT.type.family.display, fontSize: 18, color: PC.text.primary,
              fontWeight: 900, letterSpacing:'0.02em' }}>
              14 ABU EL FEDA ST., APT 8
            </div>
            <div style={{ color: PC.text.secondary, fontSize: 12, fontWeight: 500, marginTop: 2 }}>
              Zamalek · Cairo · Building with blue door
            </div>
            <div style={{ display:'flex', gap: 8, marginTop: 14 }}>
              <button style={{ flex: 1, padding:'10px', borderRadius: PT.radius.sm,
                background:'rgba(0,229,200,0.12)', border:'1px solid '+PC.teal+'4D',
                color: PC.teal, fontSize: 11, fontWeight: 800, letterSpacing:'0.1em' }}>OPEN IN MAPS</button>
              <button style={{ flex: 1, padding:'10px', borderRadius: PT.radius.sm,
                background:'transparent', border:'1px solid '+PC.stroke.mid,
                color: PC.text.primary, fontSize: 11, fontWeight: 800, letterSpacing:'0.1em' }}>BOOK VALET</button>
            </div>
          </div>

          {/* Party summary strip */}
          <div style={{ padding: 12, borderRadius: PT.radius.md,
            background: PC.bg.surface, border:'1px solid '+PC.stroke.soft,
            display:'flex', alignItems:'center', gap: 12, marginBottom: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: PT.radius.sm,
              background:'linear-gradient(135deg, #8B3FFF, #07060D)', flexShrink: 0,
              display:'grid', placeItems:'center', fontSize: 22 }}>🌙</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: PC.text.primary, fontSize: 13, fontWeight: 700 }}>Afterparty Zamalek</div>
              <div style={{ color: PC.text.muted, fontSize: 10, fontFamily: PT.type.family.mono, letterSpacing:'0.1em', marginTop: 2 }}>
                SAT · APR 25 · 1:00 AM
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ color: PC.rose, fontSize: 14, fontWeight: 800, fontFamily: PT.type.family.mono }}>04D 12H</div>
              <PMicro size="xs" color={PC.text.muted}>COUNTDOWN</PMicro>
            </div>
          </div>

          {/* Reminders */}
          <PMicro size="sm" color={PC.text.muted} style={{ marginBottom: 8 }}>REMEMBER</PMicro>
          <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
            {['All black dress code', 'No phones on the dancefloor', '18+ only · ID at door'].map((r, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap: 10,
                padding: 10, borderRadius: PT.radius.sm, background:'rgba(255,255,255,0.03)' }}>
                <div style={{ width: 6, height: 6, borderRadius: 3, background: PC.violet }}/>
                <PBody size="sm" style={{ color: PC.text.primary }}>{r}</PBody>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position:'absolute', bottom: 0, left: 0, right: 0, padding:'16px 20px 28px',
          background:'linear-gradient(180deg, transparent, rgba(7,6,13,0.95) 30%)' }}>
          <PButton variant="gold">ADD TO CALENDAR</PButton>
        </div>
      </div>
    </PPhone>
  );
}

// ── Mount ─────────────────────────────────────────────────────
const { DesignCanvas: PDC, DCSection: PDCS, DCArtboard: PDCA, DCPostIt: PDCP } = window;

function PartiesApp() {
  return (
    <PDC>
      <PDCS title="Parties V2" subtitle="Phase 03, redrawn on the LAYLA design system. The differentiator: address stays locked until the host approves you.">
        <PDCA label="01 · Feed · invite-only"><PartiesFeed/></PDCA>
        <PDCA label="02 · Locked detail · house rules"><PartyDetail/></PDCA>
        <PDCA label="03 · Request to join · intro"><RequestJoin/></PDCA>
        <PDCA label="04 · Approved · address unlocked"><Approved/></PDCA>
        <PDCP top={-20} left={1620} rotate={3} width={220}>
          Rose accents replace gold here — signals "social/private" vs Events' "commercial/public."
        </PDCP>
        <PDCP bottom={-40} left={80} rotate={-3} width={240}>
          The 🔒→🔓 moment (screen 4) is the investor slide. Hosts control the address; platform earns trust.
        </PDCP>
      </PDCS>
    </PDC>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<PartiesApp/>);
