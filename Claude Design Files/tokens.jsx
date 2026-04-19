// LAYLA Design Tokens — extracted from Phase 01–06 artifacts
// Single source of truth. Mirrored as CSS vars in LAYLA Design System.html.

const LAYLA_TOKENS = {
  color: {
    // Surfaces (night-first)
    bg:       { base: '#07060D', surface: '#10101E', elevated: '#1A1A2A', map: '#0A1020' },

    // Text
    text:     { primary: '#F0EDE6', secondary: '#9A98B0', muted: '#6B6880', inverse: '#07060D' },

    // Brand — Gold (primary)
    gold:     { 600: '#B98E2E', 500: '#D4A843', 400: '#F0C96A', 300: '#FFF4D6' },

    // Accents (each owns a product area)
    rose:     '#FF3D6B',   // Parties / alerts / hot
    violet:   '#8B3FFF',   // Community
    teal:     '#00E5C8',   // Valet / safety / verified

    // Strokes / overlays
    stroke:   { soft: 'rgba(255,255,255,0.06)', mid: 'rgba(255,255,255,0.08)', gold: 'rgba(212,168,67,0.2)', goldStrong: 'rgba(212,168,67,0.4)' },
    scrim:    { 40: 'rgba(7,6,13,0.4)', 60: 'rgba(7,6,13,0.6)', 80: 'rgba(7,6,13,0.8)' },

    // Semantic
    success:  '#00E5C8', warning: '#F0C96A', error: '#FF3D6B', info: '#8B3FFF',
  },

  gradient: {
    gold:       'linear-gradient(135deg, #D4A843 0%, #F0C96A 100%)',
    goldShine:  'linear-gradient(135deg, #D4A843, #F0C96A, #FFF4D6)',
    sunset:     'linear-gradient(135deg, #D4A843 0%, #FF3D6B 100%)',   // brand signature
    night:      'linear-gradient(135deg, #FF3D6B, #8B3FFF)',
    valet:      'linear-gradient(135deg, #00E5C8, #D4A843)',
    community:  'linear-gradient(135deg, #D4A843, #FF3D6B, #8B3FFF)',  // 3-stop story ring
    sahel:      'linear-gradient(180deg, #FFB547 0%, #FF6B9D 50%, #8B3FFF 100%)',
    heroGlow:   'radial-gradient(circle at 50% 50%, rgba(212,168,67,0.15) 0%, transparent 60%)',
  },

  type: {
    family: {
      display: '"Bebas Neue", Impact, "Haettenschweiler", "Arial Narrow Bold", sans-serif',
      body:    '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif',
      mono:    'ui-monospace, "SF Mono", Menlo, monospace',
    },
    scale: {
      // Display — Bebas/Impact, weight 900, tight leading
      'display-xl': { size: 88, line: 0.95, tracking: '0.08em', weight: 900 }, // hero wordmark
      'display-lg': { size: 56, line: 1.00, tracking: '0.04em', weight: 900 }, // welcome headline
      'display-md': { size: 40, line: 1.05, tracking: '0.03em', weight: 900 }, // step H1
      'display-sm': { size: 32, line: 1.05, tracking: '0.03em', weight: 900 }, // section H1
      'display-xs': { size: 26, line: 1.10, tracking: '0.02em', weight: 900 }, // card hero
      // Section / titles
      'title-lg':   { size: 22, line: 1.20, tracking: '0.04em', weight: 900 }, // in-card title
      'title-md':   { size: 18, line: 1.25, tracking: '0.04em', weight: 900 }, // list header
      // Body
      'body-lg':    { size: 15, line: 1.55, tracking: '0',      weight: 500 },
      'body-md':    { size: 13, line: 1.55, tracking: '0',      weight: 500 },
      'body-sm':    { size: 12, line: 1.50, tracking: '0',      weight: 500 },
      // Caption
      'caption':    { size: 11, line: 1.40, tracking: '0',      weight: 500 },
      // Uppercase mono micro-labels (signature)
      'micro-xl':   { size: 14, line: 1.20, tracking: '0.15em', weight: 700, caps: true, mono: true },
      'micro-lg':   { size: 12, line: 1.20, tracking: '0.20em', weight: 700, caps: true, mono: true },
      'micro-md':   { size: 11, line: 1.20, tracking: '0.25em', weight: 700, caps: true, mono: true },
      'micro-sm':   { size: 10, line: 1.20, tracking: '0.30em', weight: 700, caps: true, mono: true },
      'micro-xs':   { size:  9, line: 1.20, tracking: '0.30em', weight: 700, caps: true, mono: true },
    },
  },

  // 4-pt base. Most padding lives on the 12/16/20 steps.
  space: { 0:0, 1:4, 2:8, 3:12, 4:16, 5:20, 6:24, 8:32, 10:40, 12:48, 16:64 },

  radius: { sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, pill: 999, phone: 44 },

  shadow: {
    none:   'none',
    card:   '0 1px 2px rgba(0,0,0,0.3)',
    float:  '0 8px 24px rgba(0,0,0,0.4)',
    phone:  '0 40px 80px rgba(212,168,67,0.1), 0 0 0 2px #1a1a22, 0 0 0 3px #333',
    glowGold:  '0 0 20px rgba(212,168,67,0.6)',
    glowTeal:  '0 0 20px rgba(0,229,200,0.6)',
    glowCrown: '0 0 60px rgba(212,168,67,0.4)',
  },

  motion: {
    duration: { fast: 120, base: 200, slow: 300 },
    easing:   { standard: 'cubic-bezier(.2,.8,.2,1)', press: 'ease-out' },
    press:    'active:scale-95  /* taps compress ~5% */',
    pressSoft:'active:scale-[0.98]',
  },

  effect: {
    grain: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    grainOpacity: 0.04, // applied at z=50 over every screen
  },
};

Object.assign(window, { LAYLA_TOKENS });
