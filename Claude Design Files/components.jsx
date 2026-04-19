/* LAYLA — Component primitives extracted from the 6 phase artifacts.
   Globals: window.LAYLA_TOKENS. Consumers read window.L.* */

const T = window.LAYLA_TOKENS;
const C = T.color, G = T.gradient;

// ───── TEXT PRIMITIVES ────────────────────────────────────────
const typeStyle = (name) => {
  const s = T.type.scale[name];
  const fam = s.mono ? T.type.family.mono : (name.startsWith('display') || name.startsWith('title') ? T.type.family.display : T.type.family.body);
  return {
    fontFamily: fam, fontSize: s.size, lineHeight: s.line,
    letterSpacing: s.tracking, fontWeight: s.weight,
    textTransform: s.caps ? 'uppercase' : 'none',
  };
};

const Display = ({ size='md', gradient, color=C.text.primary, children, style={} }) => {
  const base = typeStyle('display-' + size);
  const grad = gradient ? {
    background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  } : { color };
  return <div style={{ ...base, ...grad, ...style }}>{children}</div>;
};

const Micro = ({ size='md', color=C.text.muted, children, style={} }) => (
  <div style={{ ...typeStyle('micro-' + size), color, ...style }}>{children}</div>
);

const Body = ({ size='md', color=C.text.secondary, children, style={} }) => (
  <div style={{ ...typeStyle('body-' + size), color, ...style }}>{children}</div>
);

// ───── BUTTONS ────────────────────────────────────────────────
// Gold (primary), Night (secondary rose→violet), Outline gold (Pro),
// Ghost (surface), Icon (40x40 round).
const Button = ({ variant='gold', children, icon, disabled, full=true, style={}, ...rest }) => {
  const variants = {
    gold:   { bg: G.gold,   fg: C.text.inverse, bd: 'none' },
    night:  { bg: G.night,  fg: C.text.primary, bd: 'none' },
    valet:  { bg: G.valet,  fg: C.text.inverse, bd: 'none' },
    shine:  { bg: G.goldShine, fg: C.text.inverse, bd: 'none' },
    outline:{ bg: C.bg.base, fg: C.gold[500], bd: '1px solid ' + C.gold[500] },
    ghost:  { bg: C.bg.surface, fg: C.text.primary, bd: '1px solid ' + C.stroke.soft },
  };
  const v = variants[variant];
  return (
    <button disabled={disabled} style={{
      width: full ? '100%' : 'auto',
      padding: '16px 20px',
      borderRadius: T.radius.md,
      background: disabled ? C.bg.surface : v.bg,
      color: disabled ? C.text.muted : v.fg,
      border: disabled ? '1px solid ' + C.stroke.soft : v.bd,
      fontFamily: T.type.family.body, fontSize: 14, fontWeight: 800,
      letterSpacing: '0.15em', textTransform: 'uppercase',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'transform 120ms ease-out',
      ...style,
    }} {...rest}>
      {children}{icon}
    </button>
  );
};

// Chip — pill selector. Selected = gold gradient filled, inverse text.
const Chip = ({ selected, accent='gold', children, onClick }) => {
  const grad = accent === 'night' ? G.night : G.gold;
  return (
    <button onClick={onClick} style={{
      padding: '6px 12px', borderRadius: T.radius.pill,
      fontSize: 12, fontWeight: selected ? 700 : 500,
      fontFamily: T.type.family.body,
      background: selected ? grad : 'rgba(255,255,255,0.04)',
      color: selected ? C.text.inverse : C.text.secondary,
      border: selected ? 'none' : '1px solid ' + C.stroke.mid,
      cursor: 'pointer', whiteSpace: 'nowrap',
    }}>{children}</button>
  );
};

// Tag — small uppercase marker on images/cards.
const Tag = ({ bg=C.gold[500], fg=C.text.inverse, children, style={} }) => (
  <span style={{
    padding: '3px 6px', borderRadius: 4,
    background: bg, color: fg,
    fontSize: 9, fontWeight: 800, letterSpacing: '0.15em',
    textTransform: 'uppercase', fontFamily: T.type.family.body,
    ...style,
  }}>{children}</span>
);

// Input — dark field with gold hairline border.
const Input = ({ label, hint, value='', placeholder, mono, invalid, style={} }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
    {label && <Micro size="md" color={C.text.muted}>{label}</Micro>}
    <div style={{
      padding: '12px 16px', borderRadius: T.radius.md,
      background: C.bg.surface,
      border: '1px solid ' + (invalid ? C.rose : C.stroke.gold),
      color: value ? C.text.primary : C.text.muted,
      fontSize: 15,
      fontFamily: mono ? T.type.family.mono : T.type.family.body,
      ...style,
    }}>{value || placeholder}</div>
    {hint && <Body size="sm" color={C.text.muted}>{hint}</Body>}
  </div>
);

// Card — surface with soft stroke.
const Card = ({ children, padding=16, accent, style={} }) => (
  <div style={{
    background: C.bg.surface,
    border: '1px solid ' + (accent || C.stroke.soft),
    borderRadius: T.radius.lg, padding, ...style,
  }}>{children}</div>
);

// VerifiedBadge — teal→gold check disc. Signature trust mark.
const VerifiedBadge = ({ size=14 }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: size + 4, height: size + 4, borderRadius: '50%',
    background: G.valet,
  }}>
    <svg width={size - 4} height={size - 4} viewBox="0 0 24 24" fill="none"
      stroke={C.text.inverse} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  </span>
);

// CrownBadge — Pro membership pill.
const CrownBadge = ({ size=14 }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '2px 6px', borderRadius: 4,
    background: G.gold,
  }}>
    <svg width={size-4} height={size-4} viewBox="0 0 24 24" fill={C.text.inverse}>
      <path d="M2 20h20v-2H2v2zm1.15-4h17.7l1.15-9-5 3-5-6-5 6-5-3 1.15 9z"/>
    </svg>
    <span style={{
      color: C.text.inverse, fontSize: size - 5, fontWeight: 900,
      letterSpacing: '0.15em', fontFamily: T.type.family.mono,
    }}>PRO</span>
  </span>
);

// Locked phase banner — mono caps pill.
const LockedPill = ({ phase, color=C.rose }) => (
  <span style={{
    display: 'inline-block', padding: '4px 12px', borderRadius: T.radius.pill,
    background: color + '1A', border: '1px solid ' + color + '4D',
  }}>
    <Micro size="sm" color={color}>LOCKED · PHASE {phase}</Micro>
  </span>
);

// FeatureRow — icon tile + copy. Pattern used across onboarding & Pro.
const FeatureRow = ({ color=C.gold[500], title, desc, icon }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12, padding: 12,
    borderRadius: T.radius.md,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid ' + C.stroke.soft,
  }}>
    <div style={{
      width: 40, height: 40, borderRadius: T.radius.sm,
      background: color + '33', border: '1px solid ' + color + '66',
      display: 'grid', placeItems: 'center', color, flexShrink: 0,
    }}>{icon || '◆'}</div>
    <div style={{ flex: 1 }}>
      <div style={{ color: C.text.primary, fontSize: 13, fontWeight: 700 }}>{title}</div>
      {desc && <Body size="sm">{desc}</Body>}
    </div>
  </div>
);

// Avatar — letter avatar on solid color.
const Avatar = ({ name='L', color=C.gold[500], size=40, ring }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    background: color, display: 'grid', placeItems: 'center',
    boxShadow: ring ? `0 0 0 2px ${ring}` : 'none', flexShrink: 0,
  }}>
    <span style={{
      color: C.text.inverse, fontFamily: T.type.family.display,
      fontSize: size * 0.42, fontWeight: 900,
    }}>{name[0]?.toUpperCase()}</span>
  </div>
);

Object.assign(window, {
  L: { Display, Micro, Body, Button, Chip, Tag, Input, Card,
       VerifiedBadge, CrownBadge, LockedPill, FeatureRow, Avatar, typeStyle }
});
