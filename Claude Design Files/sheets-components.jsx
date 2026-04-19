// LAYLA — Design System, page 2 of 2 (components + templates)

const T2 = window.LAYLA_TOKENS;
const C2 = T2.color, G2 = T2.gradient;
const { Sheet, SheetHeader } = window;
const { Display, Micro, Body, Button, Chip, Tag, Input, Card,
        VerifiedBadge, CrownBadge, LockedPill, FeatureRow, Avatar } = window.L;

const StateRow = ({ label, children }) => (
  <div>
    <Micro size="xs" color={C2.text.muted} style={{ marginBottom: 8 }}>{label}</Micro>
    <div style={{ display:'flex', gap: 12, alignItems:'center', flexWrap:'wrap' }}>{children}</div>
  </div>
);

// ───── 05 · BUTTONS ───────────────────────────────────────────
function Buttons() {
  return (
    <Sheet w={900} h={720}>
      <SheetHeader eyebrow="05 · BUTTONS" title="PRIMARY GOLD, ALWAYS" />
      <Body style={{ marginBottom: 20, maxWidth: 560 }}>
        Every forward action is <b>gold</b>. Secondary night gradient for party/afterhours contexts,
        teal→gold for valet, outline-on-black for Pro. Press = scale 0.95.
      </Body>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 32, rowGap: 24 }}>
        <StateRow label="GOLD · PRIMARY">
          <div style={{ width: 200 }}><Button variant="gold">Get Started →</Button></div>
          <div style={{ width: 140 }}><Button variant="gold" style={{ padding: '12px 16px' }}>VERIFY</Button></div>
          <div style={{ width: 120 }}><Button variant="gold" disabled>DISABLED</Button></div>
        </StateRow>

        <StateRow label="NIGHT · PARTIES">
          <div style={{ width: 200 }}><Button variant="night">Request to Join</Button></div>
          <div style={{ width: 140 }}><Button variant="night" style={{ padding: '12px 16px' }}>RSVP</Button></div>
        </StateRow>

        <StateRow label="VALET · SAFETY">
          <div style={{ width: 200 }}><Button variant="valet">Book Safe Ride</Button></div>
        </StateRow>

        <StateRow label="SHINE · PRO">
          <div style={{ width: 220 }}><Button variant="shine">Go Pro · 499 EGP/mo</Button></div>
          <div style={{ width: 160 }}><Button variant="outline">Maybe Later</Button></div>
        </StateRow>

        <StateRow label="GHOST · SECONDARY">
          <div style={{ width: 140 }}><Button variant="ghost">Skip</Button></div>
          <div style={{ width: 140 }}><Button variant="ghost" disabled>Disabled</Button></div>
        </StateRow>

        <StateRow label="ICON BUTTON · 40×40">
          {['🔍','🔔','🎟️','ℹ️'].map((e,i) => (
            <button key={i} style={{
              width: 40, height: 40, borderRadius: '50%',
              background: C2.bg.surface, border: '1px solid ' + C2.stroke.soft,
              color: C2.text.primary, fontSize: 14, cursor: 'pointer',
            }}>{e}</button>
          ))}
        </StateRow>

        <StateRow label="FAB · HOST">
          <div style={{
            display:'inline-flex', alignItems:'center', gap: 6, padding: '6px 12px',
            borderRadius: 999, background: 'rgba(212,168,67,0.1)',
            border: '1px solid rgba(212,168,67,0.3)',
          }}>
            <span style={{ color: C2.gold[500], fontWeight: 900 }}>+</span>
            <Micro size="sm" color={C2.gold[500]}>HOST</Micro>
          </div>
        </StateRow>

        <StateRow label="TEXT LINK">
          <Micro size="sm" color={C2.gold[500]}>SEE ALL →</Micro>
          <Micro size="sm" color={C2.gold[500]}>RESEND IN 00:42</Micro>
        </StateRow>
      </div>
    </Sheet>
  );
}

// ───── 06 · INPUTS & CHIPS ────────────────────────────────────
function Inputs() {
  const vibes = ['Techno','House','Hip-Hop','Arabic','Afrobeats','RnB','Rave','Rooftop','Beach','Underground','VIP','Chill'];
  const selected = new Set(['Techno','Rooftop','Arabic']);
  return (
    <Sheet w={900} h={720}>
      <SheetHeader eyebrow="06 · INPUTS + CHIPS" title="FORMS &amp; SELECTORS" />

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 32, marginBottom: 28 }}>
        <div>
          <Micro size="xs" color={C2.text.muted} style={{ marginBottom: 8 }}>TEXT INPUT · empty / filled / error</Micro>
          <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
            <Input label="NAME" placeholder="How should we call you?" />
            <Input label="NAME" value="Layla Mansour" />
            <Input label="AGE" value="17" mono invalid hint="You must be 18 or older to use LAYLA." />
          </div>
        </div>
        <div>
          <Micro size="xs" color={C2.text.muted} style={{ marginBottom: 8 }}>PHONE · country + number</Micro>
          <div style={{ display:'flex', gap: 8 }}>
            <div style={{
              display:'flex', alignItems:'center', gap: 8, padding:'12px 16px',
              borderRadius: T2.radius.md, background: C2.bg.surface,
              border: '1px solid ' + C2.stroke.gold,
            }}>
              <span style={{ fontSize: 18 }}>🇪🇬</span>
              <span style={{ color: C2.text.primary, fontWeight: 600 }}>+20</span>
            </div>
            <div style={{ flex: 1 }}>
              <Input value="10 234 5678" mono />
            </div>
          </div>

          <Micro size="xs" color={C2.text.muted} style={{ margin:'16px 0 8px' }}>OTP · 6-digit</Micro>
          <div style={{ display:'flex', gap: 8 }}>
            {['4','2','8','','',''].map((d,i) => (
              <div key={i} style={{
                width: 42, height: 52, borderRadius: T2.radius.md,
                background: C2.bg.surface,
                border: '1px solid ' + (d ? C2.gold[500] : C2.stroke.gold),
                display:'grid', placeItems:'center',
                color: C2.text.primary, fontSize: 22, fontWeight: 700,
                fontFamily: T2.type.family.mono,
              }}>{d}</div>
            ))}
          </div>

          <Micro size="xs" color={C2.text.muted} style={{ margin:'16px 0 8px' }}>SEARCH</Micro>
          <div style={{
            display:'flex', alignItems:'center', gap: 8, padding:'10px 12px',
            borderRadius: T2.radius.md, background: C2.bg.surface,
            border: '1px solid ' + C2.stroke.soft,
          }}>
            <span style={{ color: C2.text.muted, fontSize: 12 }}>⌕</span>
            <span style={{ color: C2.text.muted, fontSize: 13 }}>Search events, venues, DJs…</span>
          </div>
        </div>
      </div>

      <Micro size="xs" color={C2.text.muted} style={{ marginBottom: 10 }}>VIBE CHIPS · multi-select</Micro>
      <div style={{ display:'flex', flexWrap:'wrap', gap: 8, marginBottom: 24 }}>
        {vibes.map(v => <Chip key={v} selected={selected.has(v)}>{v}</Chip>)}
      </div>

      <Micro size="xs" color={C2.text.muted} style={{ marginBottom: 10 }}>FILTER CHIPS · single-select (night variant)</Micro>
      <div style={{ display:'flex', gap: 8 }}>
        {['All','Tonight','This Week','Public','Private','Sahel'].map((v,i) => (
          <Chip key={v} accent="night" selected={i===1}>{v}</Chip>
        ))}
      </div>
    </Sheet>
  );
}

// ───── 07 · CARDS ─────────────────────────────────────────────
const EventRow = () => (
  <Card style={{ display:'flex', alignItems:'center', gap: 12 }}>
    <div style={{ width: 56, height: 56, borderRadius: T2.radius.sm,
      background: G2.sunset, border: '1px solid ' + C2.gold[500] + '99', flexShrink: 0 }}/>
    <div style={{ flex: 1 }}>
      <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 2 }}>
        <div style={{ color: C2.text.primary, fontSize: 14, fontWeight: 700 }}>Cairo Jazz Club</div>
        <Tag bg={C2.rose}>HOT</Tag>
      </div>
      <Body size="sm">Techno Night w/ Aguizi</Body>
      <div style={{ color: C2.text.muted, fontSize: 10, fontFamily: T2.type.family.mono, marginTop: 2 }}>
        Tonight · 11 PM · Zamalek
      </div>
    </div>
    <div style={{ textAlign:'right' }}>
      <div style={{ color: C2.rose, fontSize: 13, fontWeight: 800 }}>600 EGP</div>
      <div style={{ color: C2.text.muted, fontSize: 9, fontFamily: T2.type.family.mono, letterSpacing:'0.1em' }}>FROM</div>
    </div>
  </Card>
);

const HeroCard = () => (
  <div style={{
    position: 'relative', padding: 20, borderRadius: T2.radius.xxl, overflow:'hidden',
    background: G2.sunset,
  }}>
    <div style={{
      position:'absolute', inset:0, opacity: 0.2,
      background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3), transparent 50%)',
    }}/>
    <div style={{ position:'relative' }}>
      <Tag bg={C2.scrim[40]} fg={C2.text.primary}>🔥 FEATURED</Tag>
      <div style={{
        fontFamily: T2.type.family.display, fontSize: 28, color: C2.text.inverse,
        fontWeight: 900, lineHeight: 1, marginTop: 10, letterSpacing:'0.02em',
      }}>SAHEL SUNSET<br/>RAVE 2026</div>
      <div style={{ color: 'rgba(7,6,13,0.8)', fontSize: 12, fontWeight: 600, margin:'6px 0 16px' }}>
        Six Eight · Sahel · Fri, Apr 24
      </div>
      <div style={{ display:'flex', gap: 8 }}>
        <span style={{ padding:'6px 12px', borderRadius: 999, background: C2.bg.base, color: C2.text.primary,
          fontSize: 11, fontWeight: 800, letterSpacing:'0.1em' }}>FROM 500 EGP</span>
        <span style={{ padding:'6px 12px', borderRadius: 999, background: 'rgba(7,6,13,0.3)', color: C2.text.inverse,
          fontSize: 11, fontWeight: 600, backdropFilter:'blur(8px)' }}>127 going</span>
      </div>
    </div>
  </div>
);

const PartyCard = () => (
  <div style={{ background: C2.bg.surface, borderRadius: T2.radius.lg, overflow:'hidden', border: '1px solid ' + C2.stroke.soft }}>
    <div style={{ height: 120, position:'relative', background: G2.night }}>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, transparent 40%, rgba(7,6,13,0.85) 100%)' }}/>
      <div style={{ position:'absolute', top: 10, left: 10, display:'flex', gap: 6 }}>
        <span style={{ padding:'3px 8px', borderRadius: 999, background: C2.scrim[60], backdropFilter:'blur(8px)' }}>
          <Micro size="xs" color={C2.text.primary}>🔒 PRIVATE</Micro>
        </span>
      </div>
      <div style={{ position:'absolute', top: 10, right: 10 }}>
        <span style={{ padding:'3px 8px', borderRadius: 999, background: C2.bg.base }}>
          <Micro size="xs" color={C2.gold[500]}>🔥 HOT</Micro>
        </span>
      </div>
      <div style={{ position:'absolute', bottom: 10, left: 12, fontSize: 36 }}>🌅</div>
    </div>
    <div style={{ padding: 12 }}>
      <div style={{ color: C2.text.primary, fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Rooftop Sunset Session</div>
      <div style={{ display:'flex', alignItems:'center', gap: 6, marginBottom: 8 }}>
        <Avatar name="K" color={C2.gold[500]} size={20}/>
        <span style={{ color: C2.text.secondary, fontSize: 11 }}>by <b style={{color: C2.text.primary}}>Karim A.</b></span>
        <VerifiedBadge size={10}/>
        <span style={{ marginLeft:'auto', color: C2.gold[500], fontSize: 10, fontWeight: 700 }}>★ 4.9</span>
      </div>
      <div style={{ display:'flex', gap: 10, paddingTop: 8, borderTop: '1px solid ' + C2.stroke.soft, fontSize: 11, color: C2.text.secondary }}>
        <span>📍 Zamalek</span>
        <span style={{ fontFamily: T2.type.family.mono }}>Tonight</span>
        <span style={{ marginLeft:'auto' }}>14/24</span>
        <span style={{ color: C2.gold[500], fontWeight: 800 }}>300 EGP</span>
      </div>
    </div>
  </div>
);

function Cards() {
  return (
    <Sheet w={900} h={820}>
      <SheetHeader eyebrow="07 · CARDS &amp; LIST ITEMS" title="CONTAINERS" />

      <Micro size="xs" color={C2.text.muted} style={{ marginBottom: 10 }}>HERO · FEATURED EVENT</Micro>
      <div style={{ marginBottom: 20 }}><HeroCard/></div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap: 20 }}>
        <div>
          <Micro size="xs" color={C2.text.muted} style={{ marginBottom: 10 }}>EVENT ROW</Micro>
          <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
            <EventRow/><EventRow/><EventRow/>
          </div>

          <Micro size="xs" color={C2.text.muted} style={{ margin:'20px 0 10px' }}>FEATURE ROW · onboarding &amp; pro</Micro>
          <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
            <FeatureRow color={C2.gold[500]} title="Events &amp; tickets across Egypt" desc="Book tables, get QR tickets." icon="◆"/>
            <FeatureRow color={C2.rose} title="Host or join house parties" desc="Private, ID-verified only." icon="♦"/>
            <FeatureRow color={C2.teal} title="Safe-ride valet service" desc="We drive your car home." icon="▲"/>
          </div>
        </div>
        <div>
          <Micro size="xs" color={C2.text.muted} style={{ marginBottom: 10 }}>PARTY CARD</Micro>
          <PartyCard/>
        </div>
      </div>
    </Sheet>
  );
}

// ───── 08 · BADGES, AVATARS, STATES ───────────────────────────
function Badges() {
  return (
    <Sheet w={900} h={620}>
      <SheetHeader eyebrow="08 · BADGES + AVATARS" title="IDENTITY &amp; TRUST" />

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 32 }}>
        <div>
          <StateRow label="AVATARS · letter on brand color">
            <Avatar name="Layla" color={C2.gold[500]} size={56}/>
            <Avatar name="Omar" color={C2.rose} size={56}/>
            <Avatar name="Nour" color={C2.violet} size={56}/>
            <Avatar name="Karim" color={C2.teal} size={56}/>
          </StateRow>

          <div style={{ marginTop: 24 }}>
            <StateRow label="STORY RING · community gradient">
              <div style={{ padding: 2, borderRadius:'50%', background: G2.community }}>
                <div style={{ background: C2.bg.base, padding: 2, borderRadius:'50%' }}>
                  <Avatar name="Yasmin" color={C2.gold[500]} size={56}/>
                </div>
              </div>
            </StateRow>
          </div>

          <div style={{ marginTop: 24 }}>
            <StateRow label="TRUST MARKS">
              <VerifiedBadge size={16}/>
              <VerifiedBadge size={20}/>
              <CrownBadge size={14}/>
              <CrownBadge size={18}/>
            </StateRow>
          </div>
        </div>

        <div>
          <StateRow label="TAGS · on hero images">
            <Tag bg={C2.rose}>HOT</Tag>
            <Tag bg={C2.gold[500]}>NEW</Tag>
            <Tag bg={C2.violet}>FEATURED</Tag>
            <Tag bg={C2.teal}>VERIFIED</Tag>
          </StateRow>

          <div style={{ marginTop: 24 }}>
            <StateRow label="STATUS PILLS · locked phases">
              <LockedPill phase="3" color={C2.rose}/>
              <LockedPill phase="4" color={C2.violet}/>
              <LockedPill phase="5" color={C2.teal}/>
            </StateRow>
          </div>

          <div style={{ marginTop: 24 }}>
            <StateRow label="INFO BANNER · safety / privacy">
              <div style={{
                display:'flex', gap: 10, padding: 12, borderRadius: T2.radius.md,
                background: 'rgba(0,229,200,0.06)', border: '1px solid rgba(0,229,200,0.15)',
                width: '100%',
              }}>
                <div style={{ color: C2.teal, fontSize: 14 }}>🛡</div>
                <div>
                  <Micro size="sm" color={C2.teal}>SAFETY FIRST</Micro>
                  <Body size="sm" style={{ marginTop: 2 }}>All hosts are ID-verified. Addresses stay hidden until approved.</Body>
                </div>
              </div>
            </StateRow>
          </div>

          <div style={{ marginTop: 24 }}>
            <StateRow label="NOTIFICATION DOT">
              <button style={{
                position:'relative', width: 40, height: 40, borderRadius: '50%',
                background: C2.bg.surface, border: '1px solid ' + C2.stroke.soft, color: C2.text.primary, fontSize: 14,
              }}>🔔
                <span style={{ position:'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, background: C2.rose }}/>
              </button>
              <button style={{
                position:'relative', width: 40, height: 40, borderRadius: '50%',
                background: C2.bg.surface, border: '1px solid ' + C2.stroke.soft, color: C2.gold[500], fontSize: 14,
              }}>🎟
                <span style={{ position:'absolute', top:-4, right:-4, minWidth: 16, height: 16, padding:'0 4px',
                  borderRadius: 8, background: C2.rose, color: C2.text.inverse,
                  fontSize: 9, fontWeight: 900, display:'grid', placeItems:'center' }}>2</span>
              </button>
            </StateRow>
          </div>
        </div>
      </div>
    </Sheet>
  );
}

// ───── 09 · NAV + STATUS ──────────────────────────────────────
function Nav() {
  const tabs = [
    { label: 'EVENTS',    icon:'◐', active: true,  color: C2.gold[500] },
    { label: 'PARTIES',   icon:'▲', active: false, color: C2.text.muted },
    { label: 'COMMUNITY', icon:'◎', active: false, color: C2.text.muted },
    { label: 'VALET',     icon:'▶', active: false, color: C2.text.muted },
    { label: 'PROFILE',   icon:'●', active: false, color: C2.text.muted },
  ];
  return (
    <Sheet w={900} h={500}>
      <SheetHeader eyebrow="09 · NAVIGATION" title="TAB BAR &amp; HEADERS" />

      <Micro size="xs" color={C2.text.muted} style={{ marginBottom: 10 }}>BOTTOM TAB BAR · 5 tabs · active = gold</Micro>
      <div style={{
        width: 340, padding: '12px 12px 16px', background: C2.bg.base,
        borderTop: '1px solid ' + C2.stroke.soft, borderRadius: T2.radius.xl,
        border: '1px solid ' + C2.stroke.soft, marginBottom: 28,
      }}>
        <div style={{ display:'flex', justifyContent:'space-around' }}>
          {tabs.map(t => (
            <div key={t.label} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 4, flex: 1 }}>
              <span style={{ color: t.color, fontSize: 18 }}>{t.icon}</span>
              <span style={{
                fontSize: 9, letterSpacing:'0.1em', fontFamily: T2.type.family.mono,
                color: t.color, fontWeight: t.active ? 700 : 500,
              }}>{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      <Micro size="xs" color={C2.text.muted} style={{ marginBottom: 10 }}>SCREEN HEADER · eyebrow + greeting + actions</Micro>
      <div style={{ width: 340, padding: 20, background: C2.bg.base,
        border: '1px solid ' + C2.stroke.soft, borderRadius: T2.radius.xl }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <Micro size="sm" color={C2.text.secondary}>📍 CAIRO · TONIGHT</Micro>
            <Display size="xs" style={{ marginTop: 2 }}>Hey Layla 🌙</Display>
          </div>
          <div style={{ display:'flex', gap: 8 }}>
            <button style={{ width: 36, height: 36, borderRadius:'50%',
              background: C2.bg.surface, border: '1px solid ' + C2.stroke.soft, color: C2.text.primary }}>⌕</button>
            <button style={{ width: 36, height: 36, borderRadius:'50%',
              background: C2.bg.surface, border: '1px solid ' + C2.stroke.soft, color: C2.text.primary }}>🔔</button>
          </div>
        </div>
      </div>

      <Micro size="xs" color={C2.text.muted} style={{ margin:'20px 0 10px' }}>STEP INDICATOR · onboarding</Micro>
      <div style={{ display:'flex', gap: 6 }}>
        {[0,1,2,3,4,5,6].map(i => (
          <div key={i} style={{
            width: i === 3 ? 24 : 6, height: 6, borderRadius: 3,
            background: i === 3 ? C2.gold[500] : (i < 3 ? 'rgba(212,168,67,0.4)' : 'rgba(255,255,255,0.1)'),
            transition: 'width 200ms',
          }}/>
        ))}
        <Micro size="sm" color={C2.text.muted} style={{ marginLeft: 12 }}>STEP 04 · 4/7</Micro>
      </div>
    </Sheet>
  );
}

// ───── 10 · SCREEN TEMPLATES ──────────────────────────────────
// A 340×700 phone-shaped artboard with the system applied.
const PhoneMock = ({ children }) => (
  <div style={{ width: 340, height: 700, borderRadius: 36, overflow:'hidden',
    background: C2.bg.base, border: '1px solid ' + C2.stroke.soft, position:'relative' }}>
    <div style={{ position:'absolute', inset:0, backgroundImage: T2.effect.grain, opacity: 0.04, pointerEvents:'none', zIndex: 50 }}/>
    <div style={{
      position:'absolute', top: 10, left: 24, right: 24,
      display:'flex', justifyContent:'space-between',
      color: C2.text.primary, fontSize: 11, fontFamily: T2.type.family.mono, zIndex: 40,
    }}>
      <span style={{ fontWeight: 700 }}>9:41</span>
      <span>●●● 100%</span>
    </div>
    <div style={{ padding: '36px 24px 24px', height:'100%', boxSizing:'border-box', overflow:'hidden' }}>{children}</div>
  </div>
);

function Templates() {
  return (
    <Sheet w={1400} h={820}>
      <SheetHeader eyebrow="10 · SCREEN TEMPLATES" title="HOW A SCREEN IS BUILT" />
      <Body style={{ marginBottom: 24, maxWidth: 560 }}>
        Every screen is a stack of four zones. Top: mono eyebrow + display title. Middle: content.
        Bottom: gold CTA. Screen padding 24px · gap 16–24px · CTA pinned to the bottom.
      </Body>

      <div style={{ display:'flex', gap: 28 }}>
        {/* Template A: Step */}
        <div>
          <Micro size="xs" color={C2.text.muted} style={{ marginBottom: 8 }}>A · STEP · onboarding</Micro>
          <PhoneMock>
            <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
              <div style={{ color: C2.text.primary, fontSize: 20, marginBottom: 24 }}>‹</div>
              <Micro size="md" color={C2.gold[500]}>STEP 1 OF 4</Micro>
              <Display size="md" style={{ margin:'8px 0 12px' }}>WHAT'S YOUR<br/>NUMBER?</Display>
              <Body>We'll send you a verification code.</Body>
              <div style={{ marginTop: 28, display:'flex', gap: 8 }}>
                <div style={{ padding:'12px 14px', background: C2.bg.surface, borderRadius: T2.radius.md,
                  border: '1px solid ' + C2.stroke.gold, display:'flex', gap:8 }}>
                  <span>🇪🇬</span>
                  <span style={{ color: C2.text.primary, fontWeight: 600 }}>+20</span>
                </div>
                <div style={{ flex:1, padding:'12px 14px', background: C2.bg.surface,
                  borderRadius: T2.radius.md, border: '1px solid ' + C2.stroke.gold,
                  color: C2.text.muted, fontFamily: T2.type.family.mono }}>1X XXX XXXX</div>
              </div>
              <div style={{ marginTop:'auto' }}>
                <Button variant="gold">SEND CODE →</Button>
              </div>
            </div>
          </PhoneMock>
        </div>

        {/* Template B: List + hero */}
        <div>
          <Micro size="xs" color={C2.text.muted} style={{ marginBottom: 8 }}>B · DISCOVER · events/parties</Micro>
          <PhoneMock>
            <div style={{ height:'100%', display:'flex', flexDirection:'column', gap: 12 }}>
              <div>
                <Micro size="sm" color={C2.text.secondary}>📍 TONIGHT IN EGYPT</Micro>
                <Display size="xs" style={{ marginTop: 2 }}>Discover</Display>
              </div>
              <HeroCard/>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ fontFamily: T2.type.family.display, fontSize: 16, color: C2.text.primary, fontWeight: 900, letterSpacing:'0.04em' }}>
                  THIS WEEK
                </div>
                <Micro size="sm" color={C2.gold[500]}>SEE ALL →</Micro>
              </div>
              <EventRow/>
              <EventRow/>
            </div>
          </PhoneMock>
        </div>

        {/* Template C: Sheet / Detail */}
        <div>
          <Micro size="xs" color={C2.text.muted} style={{ marginBottom: 8 }}>C · DETAIL · hero + meta + CTA</Micro>
          <PhoneMock>
            <div style={{ margin: -24, height: 'calc(100% + 48px)', display:'flex', flexDirection:'column' }}>
              <div style={{ position:'relative', height: 220, background: G2.night }}>
                <div style={{ position:'absolute', inset:0, background: 'linear-gradient(180deg, transparent 0%, #07060D 100%)' }}/>
                <div style={{ position:'absolute', top: 36, left: 14, right: 14, display:'flex', justifyContent:'space-between' }}>
                  <div style={{ width: 36, height: 36, borderRadius:'50%', background: C2.scrim[60], display:'grid', placeItems:'center', color: C2.text.primary, backdropFilter:'blur(10px)' }}>‹</div>
                  <div style={{ padding:'4px 10px', borderRadius: 999, background: C2.scrim[60], backdropFilter:'blur(10px)' }}>
                    <Micro size="xs" color={C2.text.primary}>🔒 PRIVATE</Micro>
                  </div>
                </div>
                <div style={{ position:'absolute', bottom: 16, left: 16, fontSize: 48 }}>🌙</div>
              </div>
              <div style={{ padding: 20, flex: 1, display:'flex', flexDirection:'column', gap: 12 }}>
                <Display size="xs">Afterparty Zamalek</Display>
                <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
                  <Avatar name="Nour" color={C2.violet} size={24}/>
                  <Body size="sm" color={C2.text.primary}>Nour H.</Body>
                  <VerifiedBadge size={10}/>
                  <span style={{ marginLeft:'auto', color: C2.gold[500], fontSize: 11, fontWeight: 700 }}>★ 5.0</span>
                </div>
                <div style={{ display:'flex', gap: 12, fontSize: 11, color: C2.text.secondary }}>
                  <span>📍 Zamalek</span>
                  <span style={{ fontFamily: T2.type.family.mono }}>Sat · 1 AM</span>
                  <span style={{ marginLeft:'auto' }}>8/15</span>
                </div>
                <div style={{ marginTop:'auto' }}>
                  <Button variant="night">REQUEST TO JOIN</Button>
                </div>
              </div>
            </div>
          </PhoneMock>
        </div>

        {/* Template D: Pro / Upsell */}
        <div>
          <Micro size="xs" color={C2.text.muted} style={{ marginBottom: 8 }}>D · UPSELL · pro/subscription</Micro>
          <PhoneMock>
            <div style={{ height:'100%', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>
              <div style={{ color: C2.text.primary, fontSize: 20, alignSelf:'flex-start' }}>✕</div>
              <div style={{ marginTop: 12 }}>
                <div style={{ width: 72, height: 72, borderRadius:'50%', background: G2.goldShine,
                  display:'grid', placeItems:'center', boxShadow: T2.shadow.glowCrown }}>
                  <span style={{ color: C2.text.inverse, fontSize: 32 }}>♛</span>
                </div>
              </div>
              <Micro size="md" color={C2.gold[500]} style={{ marginTop: 18 }}>✦ INTRODUCING ✦</Micro>
              <Display size="lg" gradient={G2.goldShine} style={{ marginTop: 8, fontSize: 44 }}>LAYLA<br/>PRO.</Display>
              <Body style={{ marginTop: 10 }}>The key to Egypt's nightlife.<br/>Zero surge. Zero queue.</Body>
              <div style={{ marginTop: 16, display:'flex', flexDirection:'column', gap: 8, width:'100%' }}>
                <FeatureRow color={C2.gold[500]} title="Priority entry" desc="Skip lines at partners" icon="⚡"/>
                <FeatureRow color={C2.rose} title="Exclusive drops" desc="Hidden events" icon="🔥"/>
              </div>
              <div style={{ marginTop:'auto', width:'100%' }}>
                <Button variant="shine">GO PRO →</Button>
              </div>
            </div>
          </PhoneMock>
        </div>
      </div>
    </Sheet>
  );
}

// ───── USAGE RULES ────────────────────────────────────────────
function Rules() {
  return (
    <Sheet w={900} h={600}>
      <SheetHeader eyebrow="11 · RULES OF ENGAGEMENT" title="HOW TO STAY ON-SYSTEM" />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 24 }}>
        {[
          { t:'Night-first always', d:'Surfaces are #07060D and #10101E. Never light mode. Add grain over every screen at 0.04 opacity.' },
          { t:'One gold, one action', d:'Every primary CTA is the gold gradient. Don\'t introduce a second primary color on a single screen.' },
          { t:'Product areas own accents', d:'Rose = parties. Violet = community. Teal = valet / trust. Don\'t mix accents within a feature.' },
          { t:'Mono caps carry the eyebrow', d:'Every screen opens with an ui-monospace micro-label tracked 0.20–0.30em above the display title.' },
          { t:'Display is Bebas / Impact', d:'Every H1 through hero. Weight 900, line-height 0.95–1.05. Never use display for body copy.' },
          { t:'Gradients are earned', d:'Use signature gradients for heroes, buttons, trust marks. Not for small chrome or body text.' },
          { t:'Radius scale is discrete', d:'sm-8 for tags, md-12 for inputs/buttons, lg-16 for cards, xxl-24 for hero media, pill for chips.' },
          { t:'Press = scale 0.95', d:'Every tappable primitive shrinks on press. Smaller cards use 0.98. Never use hover states on phone.' },
          { t:'Trust is the teal check', d:'Verified users get the teal→gold disc badge. Pro members get the gold crown pill. Never recolor.' },
          { t:'Every CTA has a mono hint', d:'Under a primary CTA, a mono caption explains the commitment (e.g. "BY CONTINUING…" / "CANCEL ANYTIME").' },
        ].map((r,i) => (
          <div key={i} style={{ display:'flex', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: T2.radius.sm,
              background: C2.gold[500] + '26', border: '1px solid ' + C2.gold[500] + '66',
              color: C2.gold[500], display:'grid', placeItems:'center', fontFamily: T2.type.family.mono,
              fontSize: 11, fontWeight: 900, flexShrink: 0 }}>{String(i+1).padStart(2,'0')}</div>
            <div>
              <div style={{ color: C2.text.primary, fontSize: 14, fontWeight: 800, marginBottom: 4 }}>{r.t}</div>
              <Body size="sm">{r.d}</Body>
            </div>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

Object.assign(window, { Buttons, Inputs, Cards, Badges, Nav, Templates, Rules });
