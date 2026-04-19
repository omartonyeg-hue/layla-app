// LAYLA — Phase 04 Community V2. Violet accent; "nightlife graph."

const CT = window.LAYLA_TOKENS;
const CC = CT.color, CG = CT.gradient;
const CL = window.L;
const { Display: CD, Micro: CM, Body: CB, Button: CBn, Tag: CTg, Avatar: CAv } = CL;

// ── Phone ─────────────────────────────────────────────────────
const CPhone = ({ children, time='9:41' }) => (
  <div style={{
    width: 375, height: 812, borderRadius: 44, overflow:'hidden',
    background: CC.bg.base, position:'relative',
    boxShadow:'0 40px 80px rgba(0,0,0,0.5), 0 0 0 2px #1a1a22, 0 0 0 3px #333',
  }}>
    <div style={{ position:'absolute', inset: 0, pointerEvents:'none',
      opacity: CT.effect.grainOpacity, backgroundImage: CT.effect.grain, zIndex: 50 }}/>
    <div style={{ position:'absolute', top: 14, left: 20, right: 20, zIndex: 45,
      display:'flex', justifyContent:'space-between', fontSize: 13,
      color: CC.text.primary, fontFamily: CT.type.family.mono, fontWeight: 600 }}>
      <span>{time}</span><span>●●● 100%</span>
    </div>
    <div style={{ position:'absolute', inset: 0, paddingTop: 44 }}>{children}</div>
  </div>
);

const CTabBar = ({ active='community' }) => {
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
      backdropFilter:'blur(20px)', borderTop:'1px solid '+CC.stroke.soft,
      display:'flex', justifyContent:'space-around' }}>
      {tabs.map(t => {
        const on = t.id === active;
        const c = on ? CC.violet : CC.text.muted;
        return (
          <div key={t.id} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 4, flex: 1 }}>
            <span style={{ color: c, fontSize: 18 }}>{t.icon}</span>
            <span style={{ fontSize: 9, letterSpacing:'0.1em', fontFamily: CT.type.family.mono,
              color: c, fontWeight: on ? 700 : 500 }}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
};

// Story ring (gradient border)
const StoryRing = ({ children, viewed=false, me=false, size=60 }) => (
  <div style={{
    width: size, height: size, borderRadius:'50%', padding: 2,
    background: viewed ? CC.stroke.mid
      : me ? CG.valet : 'linear-gradient(135deg, #D4A843, #FF3D6B, #8B3FFF)',
  }}>
    <div style={{
      width:'100%', height:'100%', borderRadius:'50%',
      border:'2px solid '+CC.bg.base, overflow:'hidden',
    }}>{children}</div>
  </div>
);

// ── 01 FEED ───────────────────────────────────────────────────
function CommunityFeed() {
  const stories = [
    { n:'You',     c: CC.gold[500], viewed: false, me: true },
    { n:'Layla',   c: CC.rose,      viewed: false, live: true },
    { n:'Karim',   c: CC.violet,    viewed: false },
    { n:'Nour',    c: CC.teal,      viewed: true  },
    { n:'Tarek',   c: CC.gold[400], viewed: true  },
    { n:'Yasmin',  c: CC.rose,      viewed: true  },
  ];
  return (
    <CPhone>
      <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
        {/* Header */}
        <div style={{ padding:'14px 20px 10px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <CM size="sm" color={CC.violet}>● YOUR CIRCLE</CM>
            <CD size="xs" style={{ marginTop: 2 }}>Community</CD>
          </div>
          <div style={{ display:'flex', gap: 8 }}>
            {['⌕','🔔'].map((i, k) => (
              <button key={k} style={{ position:'relative', width: 38, height: 38, borderRadius:'50%',
                background: CC.bg.surface, border:'1px solid '+CC.stroke.soft,
                color: CC.text.primary, fontSize: 14 }}>
                {i}
                {k === 1 && <span style={{ position:'absolute', top: 8, right: 9, width: 8, height: 8,
                  borderRadius: 4, background: CC.rose, boxShadow:'0 0 0 2px '+CC.bg.surface }}/>}
              </button>
            ))}
          </div>
        </div>

        {/* Stories rail */}
        <div style={{ padding:'4px 16px 10px', display:'flex', gap: 10, overflowX:'hidden' }}>
          {stories.map(s => (
            <div key={s.n} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 4, flexShrink: 0, width: 64 }}>
              <div style={{ position:'relative' }}>
                <StoryRing viewed={s.viewed} me={s.me}>
                  <div style={{ width:'100%', height:'100%', background: s.c,
                    display:'grid', placeItems:'center',
                    color: s.c === CC.gold[500] || s.c === CC.gold[400] ? CC.text.inverse : CC.text.primary,
                    fontFamily: CT.type.family.display, fontSize: 20, fontWeight: 900 }}>
                    {s.n[0]}
                  </div>
                </StoryRing>
                {s.me && <div style={{ position:'absolute', bottom:-1, right:-1, width: 18, height: 18,
                  borderRadius:'50%', background: CC.violet, border:'2px solid '+CC.bg.base,
                  display:'grid', placeItems:'center', color: CC.text.primary, fontSize: 11, fontWeight: 900 }}>+</div>}
                {s.live && <div style={{ position:'absolute', bottom:-2, left:'50%', transform:'translateX(-50%)',
                  padding:'1px 6px', borderRadius: 4, background: CC.rose, color: CC.text.inverse,
                  fontSize: 7, fontWeight: 900, letterSpacing:'0.12em' }}>LIVE</div>}
              </div>
              <div style={{ fontSize: 10, color: CC.text.secondary, fontWeight: 600, maxWidth: 60,
                overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.n}</div>
            </div>
          ))}
        </div>

        {/* Feed */}
        <div style={{ flex: 1, overflow:'hidden', padding:'6px 20px 100px' }}>
          {/* Review post */}
          <div style={{ padding: 14, borderRadius: CT.radius.lg,
            background: CC.bg.surface, border:'1px solid '+CC.stroke.soft, marginBottom: 14 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 12 }}>
              <CAv size={38} color={CC.violet}>N</CAv>
              <div style={{ flex: 1 }}>
                <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
                  <div style={{ color: CC.text.primary, fontSize: 13, fontWeight: 700 }}>Nour H.</div>
                  <span style={{ fontSize: 10, color: CC.teal }}>✓</span>
                  <span style={{ color: CC.text.muted, fontSize: 10 }}>· 2h</span>
                </div>
                <CM size="xs" color={CC.violet}>REVIEWED CJC ZAMALEK</CM>
              </div>
              <span style={{ color: CC.text.muted, fontSize: 18 }}>⋯</span>
            </div>

            {/* Venue card */}
            <div style={{ padding: 12, borderRadius: CT.radius.md,
              background:'rgba(139,63,255,0.06)', border:'1px solid rgba(139,63,255,0.15)',
              display:'flex', alignItems:'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: CT.radius.sm,
                background: CG.night, display:'grid', placeItems:'center',
                color: CC.text.primary, fontSize: 16 }}>◐</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: CC.text.primary, fontSize: 12, fontWeight: 700 }}>CJC · Zamalek</div>
                <div style={{ color: CC.text.muted, fontSize: 10, fontFamily: CT.type.family.mono, letterSpacing:'0.1em' }}>
                  ★ 4.8 · 124 REVIEWS
                </div>
              </div>
              <div style={{ display:'flex', gap: 1 }}>
                {[1,1,1,1,1].map((_, i) => (
                  <span key={i} style={{ color: CC.gold[500], fontSize: 12 }}>★</span>
                ))}
              </div>
            </div>

            <CB style={{ fontSize: 13, lineHeight: 1.5, color: CC.text.primary, marginBottom: 10 }}>
              Sound system is unreal. Door was strict but fair — got in 5 min. Crowd is actually into techno, no phones on the floor.
            </CB>

            <div style={{ display:'flex', gap: 5, flexWrap:'wrap', marginBottom: 10 }}>
              {['Great sound','Strict door','Real crowd'].map(v => (
                <span key={v} style={{
                  padding:'3px 9px', borderRadius: CT.radius.pill,
                  background:'rgba(212,168,67,0.1)', color: CC.gold[500],
                  fontSize: 10, fontWeight: 600,
                }}>#{v}</span>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display:'flex', alignItems:'center', gap: 16, paddingTop: 10,
              borderTop:'1px solid '+CC.stroke.soft }}>
              <div style={{ display:'flex', alignItems:'center', gap: 5 }}>
                <span style={{ color: CC.rose, fontSize: 15 }}>♥</span>
                <span style={{ color: CC.text.primary, fontSize: 11, fontWeight: 700 }}>84</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap: 5 }}>
                <span style={{ color: CC.text.secondary, fontSize: 13 }}>💬</span>
                <span style={{ color: CC.text.secondary, fontSize: 11 }}>12</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap: 5 }}>
                <span style={{ color: CC.text.secondary, fontSize: 13 }}>↗</span>
              </div>
              <span style={{ marginLeft:'auto', color: CC.text.muted, fontSize: 14 }}>🔖</span>
            </div>
          </div>

          {/* Photo post */}
          <div style={{ padding: 14, borderRadius: CT.radius.lg,
            background: CC.bg.surface, border:'1px solid '+CC.stroke.soft }}>
            <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 12 }}>
              <CAv size={38} color={CC.rose}>Y</CAv>
              <div style={{ flex: 1 }}>
                <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
                  <div style={{ color: CC.text.primary, fontSize: 13, fontWeight: 700 }}>Yasmin R.</div>
                  <span style={{ color: CC.text.muted, fontSize: 10 }}>· 5h</span>
                </div>
                <CM size="xs" color={CC.text.muted}>📍 SIX EIGHT · SAHEL</CM>
              </div>
              <span style={{ color: CC.text.muted, fontSize: 18 }}>⋯</span>
            </div>
            <div style={{ height: 200, borderRadius: CT.radius.md,
              background:'linear-gradient(135deg, #FF3D6B, #D4A843)',
              position:'relative', overflow:'hidden', marginBottom: 10 }}>
              <div style={{ position:'absolute', inset: 0,
                background:'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3), transparent 50%)' }}/>
              <div style={{ position:'absolute', bottom: 12, left: 12,
                padding:'4px 8px', borderRadius: CT.radius.pill,
                background: CC.scrim[60], backdropFilter:'blur(10px)',
                color: CC.text.primary, fontSize: 9, fontWeight: 700, letterSpacing:'0.12em' }}>
                SUNSET SESSION · 08:14 PM
              </div>
            </div>
            <CB style={{ fontSize: 13, color: CC.text.primary }}>Nights like these 🌅</CB>
          </div>
        </div>

        <CTabBar active="community"/>
      </div>
    </CPhone>
  );
}

// ── 02 STORY VIEWER ───────────────────────────────────────────
function Story() {
  return (
    <CPhone>
      <div style={{ height:'100%', position:'relative',
        background:'linear-gradient(180deg, #FF3D6B 0%, #8B3FFF 50%, #07060D 100%)' }}>
        {/* Noise + scrim */}
        <div style={{ position:'absolute', inset: 0,
          background:'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.2), transparent 50%)' }}/>

        {/* Progress bars */}
        <div style={{ position:'absolute', top: 48, left: 12, right: 12,
          display:'flex', gap: 4, zIndex: 3 }}>
          {[100, 100, 60, 0, 0].map((p, i) => (
            <div key={i} style={{ flex: 1, height: 2.5, borderRadius: 2,
              background:'rgba(255,255,255,0.3)', overflow:'hidden' }}>
              <div style={{ width: p+'%', height:'100%', background: CC.text.primary }}/>
            </div>
          ))}
        </div>

        {/* Header */}
        <div style={{ position:'absolute', top: 60, left: 16, right: 16, zIndex: 3,
          display:'flex', alignItems:'center', gap: 10 }}>
          <StoryRing size={40}>
            <div style={{ width:'100%', height:'100%', background: CC.rose,
              display:'grid', placeItems:'center', color: CC.text.primary,
              fontFamily: CT.type.family.display, fontSize: 16, fontWeight: 900 }}>L</div>
          </StoryRing>
          <div style={{ flex: 1 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
              <span style={{ color: CC.text.primary, fontSize: 13, fontWeight: 700 }}>Layla M.</span>
              <span style={{ fontSize: 10, color: CC.teal }}>✓</span>
              <span style={{ color:'rgba(240,237,230,0.7)', fontSize: 11 }}>· 2h</span>
            </div>
            <CM size="xs" color="rgba(240,237,230,0.7)">📍 KIVA · NILE ROOFTOP</CM>
          </div>
          <button style={{ color: CC.text.primary, fontSize: 22, background:'none' }}>×</button>
        </div>

        {/* Event sticker */}
        <div style={{ position:'absolute', top:'38%', left: 32, right: 32,
          padding: 16, borderRadius: CT.radius.lg,
          background: CC.scrim[60], backdropFilter:'blur(20px)',
          border:'1px solid rgba(255,255,255,0.15)' }}>
          <CM size="xs" color={CC.gold[500]}>TAPPING INTO · EVENT</CM>
          <div style={{ fontFamily: CT.type.family.display, fontSize: 22, color: CC.text.primary,
            fontWeight: 900, lineHeight: 0.95, letterSpacing:'0.02em', marginTop: 6 }}>
            SUNSET AT<br/>KIVA ROOFTOP
          </div>
          <div style={{ display:'flex', alignItems:'center', gap: 8, marginTop: 10,
            paddingTop: 10, borderTop:'1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ display:'flex' }}>
              {['#D4A843','#FF3D6B','#8B3FFF'].map((c, i) => (
                <div key={i} style={{ width: 22, height: 22, borderRadius:'50%', background: c,
                  border:'2px solid '+CC.bg.base, marginLeft: i === 0 ? 0 : -6 }}/>
              ))}
            </div>
            <span style={{ color: CC.text.primary, fontSize: 11, fontWeight: 600 }}>Karim & 3 friends going</span>
          </div>
          <button style={{ width:'100%', marginTop: 12, padding:'10px',
            borderRadius: CT.radius.sm, background: CC.gold[500], color: CC.text.inverse,
            fontSize: 11, fontWeight: 900, letterSpacing:'0.15em', border:'none' }}>
            GET TICKETS →
          </button>
        </div>

        {/* Reply bar */}
        <div style={{ position:'absolute', bottom: 28, left: 16, right: 16, zIndex: 3,
          display:'flex', gap: 10, alignItems:'center' }}>
          <div style={{ flex: 1, padding:'10px 14px', borderRadius: CT.radius.pill,
            background:'rgba(255,255,255,0.15)', backdropFilter:'blur(20px)',
            border:'1px solid rgba(255,255,255,0.25)',
            color:'rgba(240,237,230,0.7)', fontSize: 12 }}>
            Reply to Layla…
          </div>
          <button style={{ width: 42, height: 42, borderRadius:'50%',
            background:'rgba(255,255,255,0.15)', backdropFilter:'blur(20px)',
            color: CC.text.primary, fontSize: 16 }}>♥</button>
          <button style={{ width: 42, height: 42, borderRadius:'50%',
            background:'rgba(255,255,255,0.15)', backdropFilter:'blur(20px)',
            color: CC.text.primary, fontSize: 16 }}>↗</button>
        </div>
      </div>
    </CPhone>
  );
}

// ── 03 PUBLIC PROFILE ─────────────────────────────────────────
function ProfileOther() {
  return (
    <CPhone>
      <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
        {/* Cover */}
        <div style={{ position:'relative', height: 180, background: CG.night, flexShrink: 0 }}>
          <div style={{ position:'absolute', inset: 0,
            background:'radial-gradient(circle at 80% 30%, rgba(139,63,255,0.5), transparent 60%)' }}/>
          <div style={{ position:'absolute', inset: 0,
            background:'linear-gradient(180deg, transparent 40%, #07060D)' }}/>
          <div style={{ position:'absolute', top: 12, left: 16, right: 16,
            display:'flex', justifyContent:'space-between' }}>
            <button style={{ width: 36, height: 36, borderRadius:'50%', background: CC.scrim[60],
              backdropFilter:'blur(10px)', color: CC.text.primary, border:'none', fontSize: 18 }}>‹</button>
            <button style={{ width: 36, height: 36, borderRadius:'50%', background: CC.scrim[60],
              backdropFilter:'blur(10px)', color: CC.text.primary, border:'none', fontSize: 14 }}>⋯</button>
          </div>
        </div>

        <div style={{ flex: 1, overflow:'hidden', padding:'0 20px 100px', marginTop: -50 }}>
          {/* Avatar + name */}
          <div style={{ display:'flex', alignItems:'flex-end', gap: 14, marginBottom: 14 }}>
            <div style={{ position:'relative' }}>
              <div style={{ width: 100, height: 100, borderRadius:'50%',
                background: CC.violet, border:'4px solid '+CC.bg.base,
                display:'grid', placeItems:'center',
                color: CC.text.primary, fontFamily: CT.type.family.display,
                fontSize: 40, fontWeight: 900 }}>N</div>
              <div style={{ position:'absolute', bottom: 4, right: 4, width: 24, height: 24, borderRadius:'50%',
                background: CC.teal, border:'3px solid '+CC.bg.base,
                display:'grid', placeItems:'center', fontSize: 11, color: CC.text.inverse, fontWeight: 900 }}>✓</div>
            </div>
            <div style={{ flex: 1, paddingBottom: 8 }}>
              <div style={{ fontFamily: CT.type.family.display, fontSize: 26, color: CC.text.primary,
                fontWeight: 900, letterSpacing:'0.02em', lineHeight: 1 }}>NOUR H.</div>
              <div style={{ color: CC.violet, fontSize: 11, fontFamily: CT.type.family.mono,
                letterSpacing:'0.1em', fontWeight: 700, marginTop: 4 }}>
                @NOUR · HOST · VERIFIED
              </div>
            </div>
          </div>

          <CB style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 14 }}>
            Throwing parties in Zamalek since 2022. Techno, no phones, strict door. Stay until sunrise.
          </CB>

          {/* Stats */}
          <div style={{ display:'flex', padding: 12, borderRadius: CT.radius.md,
            background: CC.bg.surface, border:'1px solid '+CC.stroke.soft, marginBottom: 14 }}>
            {[['28','PARTIES'],['1.2K','FOLLOWERS'],['5.0','★ RATING']].map(([v,l], i) => (
              <div key={l} style={{ flex: 1, textAlign:'center',
                borderRight: i < 2 ? '1px solid '+CC.stroke.soft : 'none' }}>
                <div style={{ fontFamily: CT.type.family.display, fontSize: 20, color: CC.text.primary,
                  fontWeight: 900, letterSpacing:'0.02em' }}>{v}</div>
                <CM size="xs" color={CC.text.muted}>{l}</CM>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display:'flex', gap: 8, marginBottom: 16 }}>
            <button style={{ flex: 1, padding:'11px', borderRadius: CT.radius.md,
              background: CG.night, color: CC.text.primary, border:'none',
              fontSize: 11, fontWeight: 900, letterSpacing:'0.15em' }}>
              + ADD FRIEND
            </button>
            <button style={{ flex: 1, padding:'11px', borderRadius: CT.radius.md,
              background: CC.bg.surface, color: CC.text.primary, border:'1px solid '+CC.stroke.mid,
              fontSize: 11, fontWeight: 900, letterSpacing:'0.15em' }}>
              MESSAGE
            </button>
          </div>

          {/* Mutual friends */}
          <div style={{ display:'flex', alignItems:'center', gap: 8, padding: 10,
            borderRadius: CT.radius.md, background:'rgba(139,63,255,0.06)',
            border:'1px solid rgba(139,63,255,0.15)', marginBottom: 16 }}>
            <div style={{ display:'flex' }}>
              {['#D4A843','#FF3D6B','#00E5C8'].map((c, i) => (
                <div key={i} style={{ width: 22, height: 22, borderRadius:'50%', background: c,
                  border:'2px solid '+CC.bg.surface, marginLeft: i === 0 ? 0 : -6 }}/>
              ))}
            </div>
            <span style={{ color: CC.text.primary, fontSize: 11, fontWeight: 600 }}>
              <span style={{ color: CC.violet, fontWeight: 700 }}>3 mutual friends</span>
              <span style={{ color: CC.text.secondary }}> · Karim, Yasmin +1</span>
            </span>
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', gap: 20, borderBottom:'1px solid '+CC.stroke.soft, marginBottom: 14 }}>
            {[{l:'PARTIES', on:true},{l:'REVIEWS'},{l:'GOING'}].map((t, i) => (
              <div key={i} style={{
                paddingBottom: 10, fontSize: 10, letterSpacing:'0.15em',
                fontFamily: CT.type.family.mono, fontWeight: 700,
                color: t.on ? CC.violet : CC.text.muted,
                borderBottom: t.on ? '2px solid '+CC.violet : 'none',
                marginBottom: -1,
              }}>{t.l}</div>
            ))}
          </div>

          {/* Party list preview */}
          <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
            {[
              { n:'Afterparty Zamalek',  d:'Sat · Apr 25', grad: CG.night, people: 22 },
              { n:'Secret Set — Techno', d:'Last week · 41 went', grad:'linear-gradient(135deg, #8B3FFF, #D4A843)', past: true },
            ].map((p, i) => (
              <div key={i} style={{ padding: 10, borderRadius: CT.radius.md,
                background: CC.bg.surface, border:'1px solid '+CC.stroke.soft,
                display:'flex', alignItems:'center', gap: 12, opacity: p.past ? 0.7 : 1 }}>
                <div style={{ width: 44, height: 44, borderRadius: CT.radius.sm, background: p.grad,
                  display:'grid', placeItems:'center', fontSize: 18 }}>🌙</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: CC.text.primary, fontSize: 13, fontWeight: 700 }}>{p.n}</div>
                  <CM size="xs" color={CC.text.muted}>{p.d}</CM>
                </div>
                {!p.past && <CTg bg={CC.violet}>OPEN</CTg>}
              </div>
            ))}
          </div>
        </div>

        <CTabBar active="community"/>
      </div>
    </CPhone>
  );
}

// ── 04 DM CONVERSATION ────────────────────────────────────────
function DM() {
  const msgs = [
    { from:'them', t:'yo did you get in tonight?', ts:'2:47 AM' },
    { from:'me',   t:'yeah just walked in, door took 5 min 😅', ts:'2:48 AM' },
    { from:'them', t:'crowd?', ts:'2:48 AM' },
    { from:'me',   t:'actually good. techno all night, aguizi is on at 3', ts:'2:49 AM' },
    { from:'them', t:'coming. save me from the door pls', ts:'2:50 AM' },
    { from:'event' },
    { from:'me',   t:'added you to my +1 — show the QR', ts:'2:51 AM' },
  ];
  return (
    <CPhone time="2:52 AM">
      <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
        {/* Header */}
        <div style={{ padding:'10px 16px', display:'flex', alignItems:'center', gap: 10,
          borderBottom:'1px solid '+CC.stroke.soft }}>
          <button style={{ width: 32, height: 32, color: CC.text.primary, fontSize: 20, background:'none' }}>‹</button>
          <CAv size={36} color={CC.rose}>L</CAv>
          <div style={{ flex: 1 }}>
            <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
              <div style={{ color: CC.text.primary, fontSize: 13, fontWeight: 700 }}>Layla M.</div>
              <span style={{ fontSize: 9, color: CC.teal }}>✓</span>
            </div>
            <div style={{ color: CC.teal, fontSize: 10, fontFamily: CT.type.family.mono, letterSpacing:'0.1em' }}>
              ● ACTIVE NOW
            </div>
          </div>
          <button style={{ width: 36, height: 36, color: CC.violet, fontSize: 16, background:'none' }}>📞</button>
          <button style={{ width: 36, height: 36, color: CC.violet, fontSize: 16, background:'none' }}>⋯</button>
        </div>

        {/* Thread */}
        <div style={{ flex: 1, overflow:'hidden', padding:'16px 14px 12px',
          display:'flex', flexDirection:'column', gap: 6 }}>
          <div style={{ textAlign:'center', margin:'4px 0 10px' }}>
            <CM size="xs" color={CC.text.muted}>TUESDAY · 2:47 AM</CM>
          </div>
          {msgs.map((m, i) => {
            if (m.from === 'event') {
              return (
                <div key={i} style={{ alignSelf:'flex-start', maxWidth: '78%',
                  padding: 10, borderRadius: CT.radius.md,
                  background:'rgba(139,63,255,0.08)', border:'1px solid rgba(139,63,255,0.2)',
                  display:'flex', alignItems:'center', gap: 10, marginTop: 4 }}>
                  <div style={{ width: 36, height: 36, borderRadius: CT.radius.sm,
                    background: CG.sunset, display:'grid', placeItems:'center', fontSize: 16 }}>🎟</div>
                  <div style={{ flex: 1 }}>
                    <CM size="xs" color={CC.violet}>SHARED · TICKET</CM>
                    <div style={{ color: CC.text.primary, fontSize: 11, fontWeight: 700, marginTop: 1 }}>
                      CJC Zamalek · VIP · tonight
                    </div>
                  </div>
                  <span style={{ color: CC.violet, fontSize: 14 }}>›</span>
                </div>
              );
            }
            const me = m.from === 'me';
            return (
              <div key={i} style={{
                alignSelf: me ? 'flex-end' : 'flex-start', maxWidth:'75%',
                padding:'9px 13px', borderRadius: 18,
                background: me ? CG.night : 'rgba(255,255,255,0.06)',
                color: CC.text.primary, fontSize: 13, lineHeight: 1.4,
                borderBottomLeftRadius: me ? 18 : 4, borderBottomRightRadius: me ? 4 : 18,
              }}>
                {m.t}
              </div>
            );
          })}
          {/* Typing */}
          <div style={{ alignSelf:'flex-start', display:'flex', gap: 4, padding:'10px 14px',
            borderRadius: 18, background:'rgba(255,255,255,0.06)' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: 3,
                background: CC.text.secondary,
                animation:`blink 1.2s ${i*0.2}s infinite` }}/>
            ))}
          </div>
        </div>

        {/* Composer */}
        <div style={{ padding:'10px 14px 28px', borderTop:'1px solid '+CC.stroke.soft,
          display:'flex', alignItems:'center', gap: 8 }}>
          <button style={{ width: 36, height: 36, borderRadius:'50%',
            background: CC.bg.surface, color: CC.violet, fontSize: 18 }}>+</button>
          <div style={{ flex: 1, padding:'10px 14px', borderRadius: CT.radius.pill,
            background: CC.bg.surface, border:'1px solid '+CC.stroke.soft,
            color: CC.text.muted, fontSize: 13 }}>Message…</div>
          <button style={{ width: 36, height: 36, borderRadius:'50%',
            background: CG.night, color: CC.text.primary, fontSize: 14 }}>➤</button>
        </div>
      </div>
    </CPhone>
  );
}

// ── 05 WRITE REVIEW ───────────────────────────────────────────
function WriteReview() {
  const vibes = [
    { t:'Great sound',     on: true  },
    { t:'Real crowd',      on: true  },
    { t:'Strict door',     on: true  },
    { t:'Packed',          on: false },
    { t:'Expensive drinks',on: false },
    { t:'Worth it',        on: true  },
    { t:'Stayed late',     on: false },
    { t:'Clean space',     on: false },
  ];
  return (
    <CPhone>
      <div style={{ height:'100%', display:'flex', flexDirection:'column', padding:'14px 22px 28px' }}>
        <div style={{ display:'flex', alignItems:'center', gap: 12, marginBottom: 20 }}>
          <button style={{ width: 36, height: 36, borderRadius:'50%', background: CC.bg.surface,
            border:'1px solid '+CC.stroke.soft, color: CC.text.primary, fontSize: 18 }}>‹</button>
          <div style={{ flex: 1 }}>
            <CM size="sm" color={CC.violet}>WRITE A REVIEW</CM>
            <div style={{ color: CC.text.primary, fontSize: 14, fontWeight: 700 }}>Public · to your circle</div>
          </div>
        </div>

        {/* Venue card */}
        <div style={{ padding: 14, borderRadius: CT.radius.lg,
          background: CG.night, marginBottom: 20,
          display:'flex', alignItems:'center', gap: 12 }}>
          <div style={{ width: 52, height: 52, borderRadius: CT.radius.md,
            background: CC.scrim[60], backdropFilter:'blur(10px)',
            display:'grid', placeItems:'center', color: CC.text.primary, fontSize: 22 }}>◐</div>
          <div style={{ flex: 1 }}>
            <CM size="xs" color={CC.gold[500]}>LAST NIGHT · VENUE</CM>
            <div style={{ fontFamily: CT.type.family.display, fontSize: 22, color: CC.text.primary,
              fontWeight: 900, letterSpacing:'0.02em', marginTop: 2 }}>CJC · ZAMALEK</div>
          </div>
        </div>

        {/* Rating */}
        <CM size="sm" color={CC.text.muted} style={{ marginBottom: 10 }}>YOUR RATING</CM>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 24,
          padding:'14px 18px', borderRadius: CT.radius.lg,
          background: CC.bg.surface, border:'1px solid '+CC.stroke.soft }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{
              fontSize: 32,
              color: i <= 4 ? CC.gold[500] : CC.stroke.mid,
              textShadow: i <= 4 ? '0 0 14px rgba(212,168,67,0.4)' : 'none',
            }}>★</div>
          ))}
        </div>

        {/* Vibes */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom: 10 }}>
          <CM size="sm" color={CC.violet}>WHAT WAS THE VIBE?</CM>
          <CM size="xs" color={CC.text.muted}>3 SELECTED</CM>
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap: 6, marginBottom: 20 }}>
          {vibes.map(({ t, on }) => (
            <div key={t} style={{
              padding:'7px 11px', borderRadius: CT.radius.pill,
              background: on ? 'rgba(139,63,255,0.12)' : 'rgba(255,255,255,0.04)',
              color: on ? CC.violet : CC.text.secondary,
              border: '1px solid ' + (on ? CC.violet+'66' : CC.stroke.soft),
              fontSize: 12, fontWeight: on ? 700 : 500,
            }}>{on && '✓ '}{t}</div>
          ))}
        </div>

        {/* Note */}
        <CM size="sm" color={CC.text.muted} style={{ marginBottom: 8 }}>YOUR NOTE · OPTIONAL</CM>
        <div style={{ padding: 14, borderRadius: CT.radius.md,
          background: CC.bg.surface, border:'1.5px solid '+CC.violet,
          minHeight: 80, marginBottom:'auto' }}>
          <div style={{ color: CC.text.primary, fontSize: 13, lineHeight: 1.5 }}>
            Sound system is unreal. Door was strict but fair — got in 5 min. Crowd is actually into techno.
          </div>
        </div>

        <CBn variant="gold" style={{ marginTop: 18 }}>POST REVIEW ★</CBn>
      </div>
    </CPhone>
  );
}

// ── Mount ─────────────────────────────────────────────────────
const { DesignCanvas: CDC, DCSection: CDCS, DCArtboard: CDCA, DCPostIt: CDCP } = window;

function CommunityApp() {
  return (
    <CDC>
      <CDCS title="Community V2" subtitle="Phase 04, redrawn on the LAYLA design system. Violet accent — the social graph that powers discovery for Events and Parties.">
        <CDCA label="01 · Feed · stories + review"><CommunityFeed/></CDCA>
        <CDCA label="02 · Story viewer · ticket sticker"><Story/></CDCA>
        <CDCA label="03 · Public profile · host"><ProfileOther/></CDCA>
        <CDCA label="04 · DM · shared ticket"><DM/></CDCA>
        <CDCA label="05 · Write review"><WriteReview/></CDCA>
        <CDCP top={-20} left={2020} rotate={3} width={220}>
          Story ring uses the full 3-color gradient (gold→rose→violet) — the only place all three accents appear together.
        </CDCP>
        <CDCP bottom={-40} left={80} rotate={-3} width={240}>
          Reviews are structured (rating + vibe chips + note). Feeds the discovery ranking for Events/Parties.
        </CDCP>
      </CDCS>
    </CDC>
  );
}

// Typing blink
const cStyle = document.createElement('style');
cStyle.textContent = `@keyframes blink { 0%, 60%, 100% { opacity: 0.3 } 30% { opacity: 1 } }`;
document.head.appendChild(cStyle);

ReactDOM.createRoot(document.getElementById('root')).render(<CommunityApp/>);
