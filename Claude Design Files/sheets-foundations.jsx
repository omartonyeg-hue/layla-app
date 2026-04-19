// LAYLA — Design System, page 1 of 2 (tokens + foundations)

const { DesignCanvas, DCSection, DCArtboard, DCPostIt } = window;
const T = window.LAYLA_TOKENS;
const C = T.color, G = T.gradient;
const { Display, Micro, Body, Button, Chip, Tag, Input, Card,
        VerifiedBadge, CrownBadge, LockedPill, FeatureRow, Avatar } = window.L;

// ───── Shared frame: a "dark surface sheet" that sections sit on ─────
const Sheet = ({ w=900, h=520, children, pad=32, bg=C.bg.base }) => (
  <div style={{
    width: w, height: h, background: bg, color: C.text.primary,
    padding: pad, boxSizing: 'border-box', position: 'relative',
    fontFamily: T.type.family.body, overflow: 'hidden',
  }}>
    {/* grain */}
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5,
      opacity: T.effect.grainOpacity, backgroundImage: T.effect.grain,
    }}/>
    <div style={{ position: 'relative', zIndex: 10, height: '100%' }}>{children}</div>
  </div>
);

const SheetHeader = ({ eyebrow, title }) => (
  <div style={{ marginBottom: 24 }}>
    <Micro size="md" color={C.gold[500]}>{eyebrow}</Micro>
    <Display size="sm" gradient={G.sunset} style={{ marginTop: 4 }}>{title}</Display>
  </div>
);

// ───── COVER ──────────────────────────────────────────────────
function Cover() {
  return (
    <Sheet w={900} h={560} pad={0}>
      <div style={{ position:'absolute', inset:0, background: G.heroGlow }}/>
      <div style={{ position:'relative', height:'100%', padding:48, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <Micro size="md" color={C.gold[500]}>LAYLA · DESIGN SYSTEM</Micro>
          <Micro size="sm" color={C.text.muted}>V1.0 · APR 2026</Micro>
        </div>
        <div>
          <Display size="xl" gradient="linear-gradient(135deg,#D4A843 0%,#F0C96A 40%,#FF3D6B 100%)" style={{ fontSize: 200, lineHeight: 0.85 }}>
            LAYLA
          </Display>
          <div style={{ color: C.gold[500], fontSize: 18, letterSpacing:'0.4em', opacity: 0.7, marginTop: 12 }}>ليلى</div>
          <div style={{ marginTop: 32, display:'flex', gap: 12, flexWrap:'wrap' }}>
            <Tag bg={C.gold[500]}>Nightlife</Tag>
            <Tag bg={C.rose}>Events</Tag>
            <Tag bg={C.violet}>Community</Tag>
            <Tag bg={C.teal}>Valet</Tag>
            <Tag bg={C.bg.surface} fg={C.gold[500]}>Egypt</Tag>
          </div>
        </div>
        <div style={{ display:'flex', gap:40, alignItems:'flex-end' }}>
          <div>
            <Micro size="xs" color={C.text.muted}>SOURCE</Micro>
            <Body size="md" style={{ marginTop: 4, color: C.text.primary }}>
              Extracted from Phase 01 – 06 prototypes.<br/>
              Consistency &gt; novelty. Mirror what's there.
            </Body>
          </div>
          <div style={{ marginLeft:'auto' }}>
            <Micro size="xs" color={C.text.muted}>CONTENTS</Micro>
            <div style={{ marginTop: 4, color: C.text.secondary, fontSize: 12, fontFamily: T.type.family.mono, lineHeight: 1.9 }}>
              01 · COLOR &nbsp;&nbsp; 02 · TYPE &nbsp;&nbsp; 03 · SPACE &amp; RADIUS<br/>
              04 · ELEVATION &nbsp;&nbsp; 05 · BUTTONS &nbsp;&nbsp; 06 · INPUTS &amp; CHIPS<br/>
              07 · CARDS &nbsp;&nbsp; 08 · BADGES &nbsp;&nbsp; 09 · NAV &nbsp;&nbsp; 10 · SCREEN TEMPLATES
            </div>
          </div>
        </div>
      </div>
    </Sheet>
  );
}

// ───── 01 · COLOR ─────────────────────────────────────────────
function Swatch({ name, value, token, light }) {
  const isGrad = typeof value === 'string' && value.includes('gradient');
  return (
    <div style={{ width: 150 }}>
      <div style={{
        height: 88, borderRadius: T.radius.md, background: value,
        border: '1px solid ' + C.stroke.soft,
      }}/>
      <div style={{ marginTop: 8 }}>
        <div style={{ color: C.text.primary, fontSize: 12, fontWeight: 700 }}>{name}</div>
        <div style={{ color: C.text.muted, fontSize: 10, fontFamily: T.type.family.mono, letterSpacing: '0.05em' }}>{token}</div>
        <div style={{ color: light ? C.text.secondary : C.text.muted, fontSize: 10, fontFamily: T.type.family.mono, marginTop: 2 }}>
          {isGrad ? '— gradient —' : value.toUpperCase()}
        </div>
      </div>
    </div>
  );
}

function Color() {
  return (
    <Sheet w={900} h={1280} pad={36}>
      <SheetHeader eyebrow="01 · COLOR" title="NIGHT-FIRST PALETTE" />
      <Body style={{ marginBottom: 24, maxWidth: 560 }}>
        LAYLA lives in the dark. Surfaces are near-black with a cool-violet cast; text is a warm off-white.
        One dominant brand tone — <b style={{color:C.gold[500]}}>gold</b> — carries every primary action,
        with three product-area accents: rose (parties/alerts), violet (community), teal (valet/trust).
      </Body>

      <Micro size="md" color={C.text.muted} style={{ marginBottom: 12 }}>SURFACES</Micro>
      <div style={{ display:'flex', gap: 16, marginBottom: 28 }}>
        <Swatch name="Base"     token="color.bg.base"     value={C.bg.base}/>
        <Swatch name="Surface"  token="color.bg.surface"  value={C.bg.surface}/>
        <Swatch name="Elevated" token="color.bg.elevated" value={C.bg.elevated}/>
        <Swatch name="Map"      token="color.bg.map"      value={C.bg.map}/>
        <Swatch name="Scrim 60" token="color.scrim.60"    value={C.scrim[60]}/>
      </div>

      <Micro size="md" color={C.text.muted} style={{ marginBottom: 12 }}>TEXT</Micro>
      <div style={{ display:'flex', gap: 16, marginBottom: 28 }}>
        <Swatch name="Primary"   token="color.text.primary"   value={C.text.primary} light/>
        <Swatch name="Secondary" token="color.text.secondary" value={C.text.secondary} light/>
        <Swatch name="Muted"     token="color.text.muted"     value={C.text.muted} light/>
        <Swatch name="Inverse"   token="color.text.inverse"   value={C.text.inverse}/>
      </div>

      <Micro size="md" color={C.text.muted} style={{ marginBottom: 12 }}>BRAND · GOLD (PRIMARY)</Micro>
      <div style={{ display:'flex', gap: 16, marginBottom: 28 }}>
        <Swatch name="Gold 600" token="color.gold.600" value={C.gold[600]}/>
        <Swatch name="Gold 500" token="color.gold.500" value={C.gold[500]}/>
        <Swatch name="Gold 400" token="color.gold.400" value={C.gold[400]}/>
        <Swatch name="Gold 300" token="color.gold.300" value={C.gold[300]} light/>
      </div>

      <Micro size="md" color={C.text.muted} style={{ marginBottom: 12 }}>ACCENTS · ONE PER PRODUCT AREA</Micro>
      <div style={{ display:'flex', gap: 16, marginBottom: 28 }}>
        <Swatch name="Rose / Parties"   token="color.rose"   value={C.rose}/>
        <Swatch name="Violet / Community" token="color.violet" value={C.violet}/>
        <Swatch name="Teal / Valet"     token="color.teal"   value={C.teal}/>
      </div>

      <Micro size="md" color={C.text.muted} style={{ marginBottom: 12 }}>SIGNATURE GRADIENTS</Micro>
      <div style={{ display:'flex', gap: 16, flexWrap:'wrap' }}>
        <Swatch name="Gold"      token="gradient.gold"      value={G.gold}/>
        <Swatch name="Sunset"    token="gradient.sunset"    value={G.sunset}/>
        <Swatch name="Night"     token="gradient.night"     value={G.night}/>
        <Swatch name="Valet"     token="gradient.valet"     value={G.valet}/>
        <Swatch name="Community" token="gradient.community" value={G.community}/>
        <Swatch name="Sahel"     token="gradient.sahel"     value={G.sahel}/>
      </div>
    </Sheet>
  );
}

// ───── 02 · TYPE ──────────────────────────────────────────────
const TypeRow = ({ name, sample, usage }) => {
  const s = T.type.scale[name];
  const fam = s.mono ? T.type.family.mono : (name.startsWith('display') || name.startsWith('title') ? T.type.family.display : T.type.family.body);
  return (
    <div style={{
      display:'grid', gridTemplateColumns:'140px 1fr 180px',
      padding:'16px 0', borderTop:'1px solid ' + C.stroke.soft,
      alignItems:'center', gap: 20,
    }}>
      <div>
        <div style={{ color: C.text.primary, fontSize: 12, fontWeight: 700, fontFamily: T.type.family.mono }}>{name}</div>
        <div style={{ color: C.text.muted, fontSize: 10, fontFamily: T.type.family.mono, marginTop: 2 }}>
          {s.size}/{Math.round(s.size * s.line)} · {s.weight} · {s.tracking}
        </div>
      </div>
      <div style={{
        fontFamily: fam, fontSize: Math.min(s.size, 48), lineHeight: 1,
        letterSpacing: s.tracking, fontWeight: s.weight,
        color: C.text.primary, textTransform: s.caps ? 'uppercase' : 'none',
      }}>{sample}</div>
      <Body size="sm" color={C.text.muted}>{usage}</Body>
    </div>
  );
};

function Typography() {
  return (
    <Sheet w={900} h={1040}>
      <SheetHeader eyebrow="02 · TYPE" title="DISPLAY + MONO SYSTEM" />
      <Body style={{ marginBottom: 24, maxWidth: 560 }}>
        Two voices: <b>Bebas Neue / Impact</b> for loud, compressed display, and a <b>monospace</b>
        used for micro-labels with heavy tracking. Body copy sits in the system sans.
      </Body>

      <div style={{ marginBottom: 24 }}>
        <Micro size="md" color={C.text.muted}>DISPLAY · Bebas Neue / Impact · 900</Micro>
        <TypeRow name="display-xl" sample="LAYLA"          usage="Hero wordmark only"/>
        <TypeRow name="display-lg" sample="YOUR CITY"      usage="Welcome / splash headlines"/>
        <TypeRow name="display-md" sample="WHAT'S YOUR"    usage="Step H1 · onboarding"/>
        <TypeRow name="display-sm" sample="YOUR PROFILE"   usage="Section H1 · full screens"/>
        <TypeRow name="display-xs" sample="DISCOVER"       usage="In-header greeting"/>
      </div>

      <div style={{ marginBottom: 24 }}>
        <Micro size="md" color={C.text.muted}>TITLE &amp; BODY</Micro>
        <TypeRow name="title-lg"  sample="HAPPENING NOW"         usage="Card / list group header"/>
        <TypeRow name="title-md"  sample="THIS WEEK"             usage="Inline list section"/>
        <TypeRow name="body-lg"   sample="Discover parties, book tables, host your own." usage="Marketing + hero body"/>
        <TypeRow name="body-md"   sample="We'll send you a verification code." usage="Default body copy"/>
        <TypeRow name="body-sm"   sample="26 July St, Zamalek"   usage="Supporting / metadata"/>
      </div>

      <div>
        <Micro size="md" color={C.text.muted}>MICRO · uppercase mono · 700 · signature</Micro>
        <TypeRow name="micro-xl" sample="GET STARTED" usage="Primary button label"/>
        <TypeRow name="micro-lg" sample="HOT TONIGHT" usage="Tag / pill"/>
        <TypeRow name="micro-md" sample="STEP 2 OF 4" usage="Eyebrow / step indicator"/>
        <TypeRow name="micro-sm" sample="CAIRO · TONIGHT" usage="Tab labels, status"/>
      </div>
    </Sheet>
  );
}

// ───── 03 · SPACE & RADIUS ────────────────────────────────────
function SpaceRadius() {
  return (
    <Sheet w={900} h={600}>
      <SheetHeader eyebrow="03 · SPACE &amp; RADIUS" title="4-POINT GRID" />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 48 }}>
        <div>
          <Micro size="md" color={C.text.muted} style={{ marginBottom: 12 }}>SPACE · multiples of 4</Micro>
          {[1,2,3,4,5,6,8,10,12].map(k => (
            <div key={k} style={{ display:'flex', alignItems:'center', gap: 16, padding:'6px 0' }}>
              <div style={{ width: 60, fontFamily: T.type.family.mono, fontSize: 11, color: C.text.muted }}>
                {k.toString().padStart(2,'0')} · {T.space[k]}px
              </div>
              <div style={{ width: T.space[k] * 3, height: 14, background: C.gold[500], borderRadius: 2 }}/>
            </div>
          ))}
          <Body size="sm" color={C.text.muted} style={{ marginTop: 12 }}>
            Screen padding 24px · Card padding 16px · Section gap 20–24px.
          </Body>
        </div>

        <div>
          <Micro size="md" color={C.text.muted} style={{ marginBottom: 12 }}>RADIUS</Micro>
          {Object.entries(T.radius).map(([k,v]) => (
            <div key={k} style={{ display:'flex', alignItems:'center', gap: 16, padding:'6px 0' }}>
              <div style={{ width: 60, fontFamily: T.type.family.mono, fontSize: 11, color: C.text.muted }}>
                {k} · {v === 999 ? '∞' : v + 'px'}
              </div>
              <div style={{
                width: 56, height: 56, background: C.bg.surface,
                border: '1px solid ' + C.stroke.gold,
                borderRadius: v,
              }}/>
              <Body size="sm" color={C.text.muted}>
                {k==='sm' && 'Tags · icon tiles'}
                {k==='md' && 'Inputs · buttons · feature rows'}
                {k==='lg' && 'Cards · list items'}
                {k==='xl' && 'Hero blocks'}
                {k==='xxl' && 'Party hero images · sheets'}
                {k==='pill' && 'Chips · badges · FABs'}
                {k==='phone' && 'Device frame outer'}
              </Body>
            </div>
          ))}
        </div>
      </div>
    </Sheet>
  );
}

// ───── 04 · EFFECTS ───────────────────────────────────────────
function Effects() {
  return (
    <Sheet w={900} h={460}>
      <SheetHeader eyebrow="04 · EFFECTS" title="GRAIN · GLOW · SCRIM" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 20, marginTop: 12 }}>
        {/* Grain */}
        <div style={{ position:'relative', height: 280, borderRadius: T.radius.lg, background: C.bg.surface, border:'1px solid ' + C.stroke.soft, overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, backgroundImage: T.effect.grain, opacity: 0.12 }}/>
          <div style={{ position:'absolute', bottom: 16, left: 16, right: 16 }}>
            <Micro size="sm" color={C.gold[500]}>SIGNATURE</Micro>
            <div style={{ color: C.text.primary, fontWeight: 700, fontSize: 14, marginTop: 4 }}>Noise grain</div>
            <Body size="sm" color={C.text.muted}>SVG fractalNoise · opacity 0.04 · z=50 over every screen.</Body>
          </div>
        </div>
        {/* Glow */}
        <div style={{ position:'relative', height: 280, borderRadius: T.radius.lg, background: C.bg.surface, border:'1px solid ' + C.stroke.soft, overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, background: G.heroGlow }}/>
          <div style={{
            position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-55%)',
            width: 60, height: 60, borderRadius: 30, background: C.teal,
            boxShadow: T.shadow.glowTeal,
          }}/>
          <div style={{ position:'absolute', bottom: 16, left: 16, right: 16 }}>
            <Micro size="sm" color={C.teal}>TRUST · VALET</Micro>
            <div style={{ color: C.text.primary, fontWeight: 700, fontSize: 14, marginTop: 4 }}>Colored glow</div>
            <Body size="sm" color={C.text.muted}>Radial scrim on heroes · dot-glows on live markers.</Body>
          </div>
        </div>
        {/* Scrim */}
        <div style={{ position:'relative', height: 280, borderRadius: T.radius.lg, background: G.sunset, overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, background: 'linear-gradient(180deg, transparent 0%, #07060D 100%)' }}/>
          <div style={{ position:'absolute', bottom: 16, left: 16, right: 16 }}>
            <Micro size="sm" color={C.gold[300]}>PHOTO HERO</Micro>
            <div style={{ color: C.text.primary, fontWeight: 700, fontSize: 14, marginTop: 4 }}>Bottom scrim</div>
            <Body size="sm" color={C.text.muted}>Gradient → base fade · keeps text legible on any image.</Body>
          </div>
        </div>
      </div>
    </Sheet>
  );
}

Object.assign(window, { Cover, Color, Typography, SpaceRadius, Effects, Sheet, SheetHeader });
