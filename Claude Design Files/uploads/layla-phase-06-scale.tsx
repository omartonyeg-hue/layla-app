import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Crown, Sparkles, Check, X, Star, Clock, Lock, Unlock, Gift, Zap, Users, MapPin, Calendar, Flame, Shield, Wine, Shirt, Headphones, Coffee, Key, Heart, TrendingUp, Award, Bell, Settings, CreditCard, RefreshCw, LogOut, Info, Ticket } from 'lucide-react';

export default function LaylaScale() {
  const [screen, setScreen] = useState('pro-landing');
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const [isMember, setIsMember] = useState(false);
  const [sahelMode, setSahelMode] = useState(false);
  const [countdown, setCountdown] = useState({ days: 2, hours: 14, minutes: 37, seconds: 12 });
  const [shimmer, setShimmer] = useState(0);

  // Countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(c => {
        let s = c.seconds - 1;
        let m = c.minutes;
        let h = c.hours;
        let d = c.days;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        if (h < 0) { h = 23; d -= 1; }
        return { days: d, hours: h, minutes: m, seconds: s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Shimmer animation
  useEffect(() => {
    const timer = setInterval(() => setShimmer(s => (s + 1) % 100), 50);
    return () => clearInterval(timer);
  }, []);

  // DATA
  const proBenefits = [
    { icon: Zap, title: 'Priority entry', desc: 'Skip lines at partner venues', color: '#D4A843' },
    { icon: Flame, title: 'Exclusive drops', desc: 'Secret parties & hidden events', color: '#FF3D6B' },
    { icon: Shield, title: 'No valet surge', desc: 'Flat-rate rides, any hour', color: '#00E5C8' },
    { icon: Gift, title: 'Partner perks', desc: 'Free drinks, fashion discounts', color: '#8B3FFF' },
    { icon: Star, title: 'Early ticket access', desc: '48h before public release', color: '#D4A843' },
    { icon: Crown, title: 'Pro badge', desc: 'Visible status across the app', color: '#F0C96A' },
  ];

  const exclusiveDrops = [
    { id: 1, name: 'Midnight Warehouse', host: 'Unknown · Verified', neighborhood: 'New Cairo', date: 'Tonight', members: 47, cap: 80, gradient: 'linear-gradient(135deg, #8B3FFF, #07060D)', emoji: '🌑', tag: 'LIVE', fee: 'FREE FOR PRO' },
    { id: 2, name: 'Desert Dawn Rave', host: 'LAYLA Curated', neighborhood: 'Fayoum', date: 'Sat · 4 AM', members: 23, cap: 60, gradient: 'linear-gradient(135deg, #D4A843, #FF3D6B)', emoji: '🏜️', tag: 'LIMITED', fee: '1,200 EGP' },
    { id: 3, name: 'Yacht Afterhours', host: 'Partner · Gouna Marina', neighborhood: 'Gouna', date: 'Next Fri', members: 12, cap: 30, gradient: 'linear-gradient(135deg, #00E5C8, #D4A843)', emoji: '🛥️', tag: 'EXCLUSIVE', fee: '3,500 EGP' },
    { id: 4, name: 'Nubian Lounge Session', host: 'Aguizi & Fahim', neighborhood: 'Private · Zamalek', date: 'Sun · 11 PM', members: 8, cap: 25, gradient: 'linear-gradient(135deg, #FF3D6B, #8B3FFF)', emoji: '🎛️', tag: 'DJ PICK', fee: '800 EGP' },
  ];

  const partners = [
    { name: 'Heineken', type: 'Drinks', offer: '2-for-1 at partner venues', icon: Wine, color: '#00E5C8', tag: 'WEEKLY' },
    { name: 'Daily Dose', type: 'Fashion', offer: '15% off streetwear', icon: Shirt, color: '#FF3D6B', tag: 'ALWAYS' },
    { name: 'Beats', type: 'Tech', offer: 'Studio Pro · 20% off', icon: Headphones, color: '#8B3FFF', tag: 'LIMITED' },
    { name: 'Costa Coffee', type: 'F&B', offer: 'Free iced latte · weekends', icon: Coffee, color: '#D4A843', tag: 'WEEKENDS' },
  ];

  // HELPERS
  const Frame = ({ children, bg = '#07060D', showStatus = true }) => (
    <div className="relative w-full h-full overflow-hidden" style={{ background: sahelMode && screen === 'pro-dashboard' ? 'linear-gradient(180deg, #FFB547 0%, #FF6B9D 50%, #8B3FFF 100%)' : bg }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
      />
      {showStatus && (
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 pt-3 pb-1 z-40" style={{ fontSize: '12px', color: '#F0EDE6', fontFamily: 'ui-monospace, monospace' }}>
          <span className="font-semibold">9:41</span>
          <span className="flex items-center gap-1"><span>●●●</span><span>100%</span></span>
        </div>
      )}
      {children}
    </div>
  );

  const GoldButton = ({ children, onClick, disabled, variant = 'gold' }) => (
    <button onClick={onClick} disabled={disabled}
      className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-30 relative overflow-hidden"
      style={{
        background: !disabled ? (variant === 'black' ? '#07060D' : 'linear-gradient(135deg, #D4A843, #F0C96A, #FFF4D6)') : '#10101E',
        color: !disabled ? (variant === 'black' ? '#D4A843' : '#07060D') : '#6B6880',
        fontSize: '14px', letterSpacing: '0.15em',
        border: variant === 'black' ? '1px solid #D4A843' : (disabled ? '1px solid rgba(255,255,255,0.06)' : 'none')
      }}>
      {!disabled && variant === 'gold' && (
        <div className="absolute inset-0" style={{
          background: `linear-gradient(90deg, transparent ${shimmer}%, rgba(255,255,255,0.4) ${shimmer + 10}%, transparent ${shimmer + 20}%)`,
          pointerEvents: 'none'
        }} />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );

  const CrownBadge = ({ size = 14 }) => (
    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded" style={{
      background: 'linear-gradient(135deg, #D4A843, #F0C96A)',
    }}>
      <Crown size={size - 4} style={{ color: '#07060D' }} fill="#07060D" />
      <span style={{ color: '#07060D', fontSize: size - 5, fontWeight: 900, letterSpacing: '0.15em', fontFamily: 'ui-monospace, monospace' }}>PRO</span>
    </div>
  );

  // ============ SCREENS ============

  // SCREEN: Pro Landing / Upsell
  const ProLandingScreen = () => (
    <Frame>
      <div className="h-full flex flex-col">
        <div className="px-5 pt-12 pb-3 flex items-center justify-between">
          <button><X size={22} style={{ color: '#F0EDE6' }} /></button>
          <div className="flex items-center gap-1">
            <CrownBadge size={14} />
          </div>
          <div className="w-6" />
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-3">
          {/* Hero */}
          <div className="relative py-6 mb-5 text-center">
            {/* Decorative rays */}
            <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.15 }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <line key={i} x1="50%" y1="50%"
                  x2={`${50 + 60 * Math.cos(i * Math.PI / 6)}%`}
                  y2={`${50 + 60 * Math.sin(i * Math.PI / 6)}%`}
                  stroke="#D4A843" strokeWidth="1" />
              ))}
            </svg>

            <div className="relative z-10">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 rounded-full animate-ping" style={{ background: '#D4A843', opacity: 0.2 }} />
                <div className="w-24 h-24 rounded-full flex items-center justify-center relative" style={{
                  background: 'linear-gradient(135deg, #D4A843, #F0C96A, #FFF4D6)',
                  boxShadow: '0 0 60px rgba(212,168,67,0.4)'
                }}>
                  <Crown size={40} style={{ color: '#07060D' }} fill="#07060D" />
                </div>
              </div>

              <div style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.4em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '10px' }}>
                ✦ INTRODUCING ✦
              </div>
              <div style={{
                fontFamily: 'Impact, "Bebas Neue", sans-serif',
                fontSize: '56px',
                fontWeight: 900,
                letterSpacing: '0.03em',
                lineHeight: '0.95',
                background: 'linear-gradient(135deg, #D4A843 0%, #F0C96A 50%, #FFF4D6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '10px'
              }}>
                LAYLA<br/>PRO.
              </div>
              <div style={{ color: '#F0EDE6', fontSize: '14px', lineHeight: '1.5', maxWidth: '280px', margin: '0 auto' }}>
                The key to Egypt's nightlife. Exclusive drops, priority access, zero surge.
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="flex flex-col gap-2 mb-5">
            {proBenefits.map((b, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{
                background: 'linear-gradient(135deg, rgba(212,168,67,0.04), rgba(255,255,255,0.01))',
                border: '1px solid rgba(212,168,67,0.15)'
              }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                  background: `${b.color}15`,
                  border: `1px solid ${b.color}40`
                }}>
                  <b.icon size={16} style={{ color: b.color }} />
                </div>
                <div className="flex-1">
                  <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>{b.title}</div>
                  <div style={{ color: '#9A98B0', fontSize: '11px' }}>{b.desc}</div>
                </div>
                <Check size={14} style={{ color: '#D4A843' }} strokeWidth={3} />
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="p-3 rounded-xl mb-3" style={{ background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.15)' }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex -space-x-2">
                {['#D4A843', '#FF3D6B', '#8B3FFF', '#00E5C8'].map((c, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2" style={{ background: c, borderColor: '#07060D' }} />
                ))}
              </div>
              <span style={{ color: '#F0EDE6', fontSize: '12px', fontWeight: 700 }}>2,400+ Pro members</span>
            </div>
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(i => <Star key={i} size={10} style={{ color: '#D4A843' }} fill="#D4A843" />)}
              <span style={{ color: '#9A98B0', fontSize: '11px', marginLeft: '4px' }}>4.9 · "Worth every pound" — Karim A.</span>
            </div>
          </div>
        </div>

        <div className="px-5 pt-2 pb-5">
          <GoldButton onClick={() => setScreen('pro-checkout')}>
            <Sparkles size={14} /> UNLOCK PRO
          </GoldButton>
          <div className="text-center mt-2">
            <span style={{ color: '#6B6880', fontSize: '10px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.15em' }}>
              CANCEL ANYTIME · FIRST WEEK FREE
            </span>
          </div>
        </div>
      </div>
    </Frame>
  );

  // SCREEN: Pro Checkout
  const ProCheckoutScreen = () => (
    <Frame>
      <div className="h-full flex flex-col px-5 pt-12 pb-6">
        <button onClick={() => setScreen('pro-landing')} className="self-start mb-4">
          <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
        </button>

        <div style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>
          CHOOSE YOUR PLAN
        </div>
        <div style={{
          fontFamily: 'Impact, "Bebas Neue", sans-serif',
          fontSize: '32px',
          fontWeight: 900,
          letterSpacing: '0.03em',
          lineHeight: '1',
          background: 'linear-gradient(135deg, #D4A843, #F0C96A)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '20px'
        }}>
          PICK YOUR ERA.
        </div>

        <div className="flex-1 flex flex-col gap-3">
          {/* Annual */}
          <button onClick={() => setSelectedPlan('annual')} className="relative p-4 rounded-2xl text-left transition-all active:scale-[0.98]" style={{
            background: selectedPlan === 'annual' ? 'linear-gradient(135deg, rgba(212,168,67,0.15), rgba(240,201,106,0.05))' : '#10101E',
            border: `2px solid ${selectedPlan === 'annual' ? '#D4A843' : 'rgba(255,255,255,0.06)'}`,
            overflow: 'hidden'
          }}>
            {selectedPlan === 'annual' && (
              <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl" style={{ background: 'linear-gradient(135deg, #D4A843, #F0C96A)' }}>
                <span style={{ color: '#07060D', fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 900 }}>
                  SAVE 2 MONTHS
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 mb-1 mt-1">
              <CrownBadge size={13} />
              <span style={{ color: '#F0EDE6', fontSize: '15px', fontWeight: 800 }}>Annual</span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span style={{ color: '#D4A843', fontFamily: 'Impact, sans-serif', fontSize: '36px', fontWeight: 900 }}>4,999</span>
              <span style={{ color: '#9A98B0', fontSize: '13px' }}>EGP / year</span>
            </div>
            <div style={{ color: '#9A98B0', fontSize: '11px' }}>
              Just <span style={{ color: '#F0EDE6', fontWeight: 700 }}>416 EGP/month</span> · best value
            </div>
            {selectedPlan === 'annual' && (
              <div className="absolute top-3 left-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#D4A843' }}>
                  <Check size={12} style={{ color: '#07060D' }} strokeWidth={3} />
                </div>
              </div>
            )}
          </button>

          {/* Monthly */}
          <button onClick={() => setSelectedPlan('monthly')} className="relative p-4 rounded-2xl text-left transition-all active:scale-[0.98]" style={{
            background: selectedPlan === 'monthly' ? 'rgba(212,168,67,0.08)' : '#10101E',
            border: `2px solid ${selectedPlan === 'monthly' ? '#D4A843' : 'rgba(255,255,255,0.06)'}`
          }}>
            <div className="flex items-center gap-2 mb-1">
              <CrownBadge size={13} />
              <span style={{ color: '#F0EDE6', fontSize: '15px', fontWeight: 800 }}>Monthly</span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span style={{ color: '#F0EDE6', fontFamily: 'Impact, sans-serif', fontSize: '32px', fontWeight: 900 }}>499</span>
              <span style={{ color: '#9A98B0', fontSize: '13px' }}>EGP / month</span>
            </div>
            <div style={{ color: '#9A98B0', fontSize: '11px' }}>
              No commitment · cancel anytime
            </div>
            {selectedPlan === 'monthly' && (
              <div className="absolute top-3 left-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#D4A843' }}>
                  <Check size={12} style={{ color: '#07060D' }} strokeWidth={3} />
                </div>
              </div>
            )}
          </button>

          {/* First week free banner */}
          <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(0,229,200,0.08), rgba(212,168,67,0.04))', border: '1px solid rgba(0,229,200,0.2)' }}>
            <div className="flex items-center gap-2">
              <Gift size={14} style={{ color: '#00E5C8' }} />
              <span style={{ color: '#00E5C8', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', fontFamily: 'ui-monospace, monospace' }}>
                FIRST 7 DAYS FREE
              </span>
            </div>
            <div style={{ color: '#9A98B0', fontSize: '11px', marginTop: '3px', lineHeight: '1.4' }}>
              Try everything. If you don't love it, cancel before day 7 at no charge.
            </div>
          </div>

          {/* Payment */}
          <div className="p-3 rounded-xl flex items-center gap-3 mt-auto" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,63,255,0.15)' }}>
              <CreditCard size={16} style={{ color: '#8B3FFF' }} />
            </div>
            <div className="flex-1">
              <div style={{ color: '#F0EDE6', fontSize: '12px', fontWeight: 700 }}>Visa •••• 6411</div>
              <div style={{ color: '#9A98B0', fontSize: '10px' }}>First charge in 7 days</div>
            </div>
            <ChevronRight size={14} style={{ color: '#6B6880' }} />
          </div>
        </div>

        <GoldButton onClick={() => { setIsMember(true); setScreen('pro-welcome'); }}>
          START 7-DAY FREE TRIAL
        </GoldButton>
        <div className="text-center mt-2">
          <span style={{ color: '#6B6880', fontSize: '10px' }}>
            Then <span style={{ color: '#D4A843', fontWeight: 700 }}>{selectedPlan === 'annual' ? '4,999 EGP/year' : '499 EGP/month'}</span>. Cancel anytime.
          </span>
        </div>
      </div>
    </Frame>
  );

  // SCREEN: Pro Welcome
  const ProWelcomeScreen = () => (
    <Frame>
      <div className="h-full flex flex-col items-center justify-center px-6 pb-6 relative overflow-hidden">
        {/* Sparkles background */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="absolute" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}>
            <Sparkles size={8 + Math.random() * 12} style={{ color: '#D4A843', opacity: 0.4 }} />
          </div>
        ))}

        <div className="relative mb-6 z-10">
          <div className="absolute inset-0 rounded-full animate-ping" style={{ background: '#D4A843', width: '140px', height: '140px', top: '-20px', left: '-20px', opacity: 0.3 }} />
          <div className="w-28 h-28 rounded-full flex items-center justify-center relative" style={{
            background: 'linear-gradient(135deg, #D4A843, #F0C96A, #FFF4D6)',
            boxShadow: '0 0 80px rgba(212,168,67,0.6)'
          }}>
            <Crown size={48} style={{ color: '#07060D' }} fill="#07060D" />
          </div>
        </div>

        <div style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.4em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '8px' }}>
          ✦ WELCOME TO THE CLUB ✦
        </div>
        <div style={{
          fontFamily: 'Impact, "Bebas Neue", sans-serif',
          fontSize: '48px',
          fontWeight: 900,
          letterSpacing: '0.03em',
          textAlign: 'center',
          lineHeight: '0.95',
          background: 'linear-gradient(135deg, #D4A843 0%, #F0C96A 50%, #FFF4D6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '12px'
        }}>
          YOU'RE IN.
        </div>
        <div style={{ color: '#F0EDE6', fontSize: '14px', textAlign: 'center', maxWidth: '280px', lineHeight: '1.5', marginBottom: '24px' }}>
          Your Pro badge is live. Exclusive drops are unlocked. Concierge is standing by.
        </div>

        {/* Pro card preview */}
        <div className="w-full p-4 rounded-2xl mb-5 relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #1a1a28 0%, #2a2030 100%)',
          border: '1px solid rgba(212,168,67,0.3)'
        }}>
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(212,168,67,0.4), transparent 50%)'
          }} />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>
                LAYLA · MEMBER CARD
              </div>
              <Crown size={18} style={{ color: '#D4A843' }} fill="#D4A843" />
            </div>
            <div style={{ color: '#F0EDE6', fontSize: '18px', fontFamily: 'Impact, sans-serif', fontWeight: 900, letterSpacing: '0.04em', marginBottom: '2px' }}>
              LAYLA M.
            </div>
            <div style={{ color: '#9A98B0', fontSize: '11px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em', marginBottom: '12px' }}>
              MEMBER #002401 · PRO
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div style={{ color: '#6B6880', fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>VALID THRU</div>
                <div style={{ color: '#D4A843', fontSize: '13px', fontWeight: 700, fontFamily: 'ui-monospace, monospace' }}>APR · 2027</div>
              </div>
              <div className="text-right">
                <div style={{ color: '#6B6880', fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>TIER</div>
                <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>ANNUAL</div>
              </div>
            </div>
          </div>
        </div>

        <GoldButton onClick={() => setScreen('pro-dashboard')}>
          EXPLORE YOUR PERKS <ChevronRight size={16} />
        </GoldButton>

        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(0.8); }
            50% { opacity: 0.8; transform: scale(1.2); }
          }
        `}</style>
      </div>
    </Frame>
  );

  // SCREEN: Pro Dashboard
  const ProDashboardScreen = () => (
    <Frame bg={sahelMode ? 'transparent' : '#07060D'}>
      <div className="h-full flex flex-col relative">
        {sahelMode && (
          <>
            {/* Sahel mode overlay */}
            <div className="absolute inset-0 pointer-events-none z-0" style={{
              background: 'linear-gradient(180deg, rgba(255,181,71,0.3) 0%, rgba(255,107,157,0.2) 50%, rgba(7,6,13,0.8) 100%)'
            }} />
            {/* Sun */}
            <div className="absolute top-20 right-8 z-0">
              <div className="w-20 h-20 rounded-full" style={{
                background: 'radial-gradient(circle, #FFB547, transparent 70%)',
                filter: 'blur(4px)'
              }} />
            </div>
          </>
        )}

        <div className="px-5 pt-12 pb-3 flex items-center justify-between relative z-10">
          <button onClick={() => setScreen('pro-landing')}>
            <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setSahelMode(!sahelMode)} className="flex items-center gap-1 px-2.5 py-1 rounded-full transition-all" style={{
              background: sahelMode ? 'linear-gradient(135deg, #FFB547, #FF6B9D)' : 'rgba(255,255,255,0.06)',
              border: sahelMode ? 'none' : '1px solid rgba(255,255,255,0.1)'
            }}>
              <span style={{ fontSize: '12px' }}>{sahelMode ? '🌅' : '🌙'}</span>
              <span style={{ color: sahelMode ? '#07060D' : '#F0EDE6', fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>
                {sahelMode ? 'SAHEL MODE' : 'CITY MODE'}
              </span>
            </button>
            <CrownBadge size={13} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-3 relative z-10">
          {/* Greeting */}
          <div className="mb-5">
            <div style={{ color: sahelMode ? '#07060D' : '#D4A843', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '4px' }}>
              {sahelMode ? '☀️ SAHEL SEASON ACTIVE' : 'WELCOME BACK'}
            </div>
            <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '32px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.02em', lineHeight: '1' }}>
              {sahelMode ? 'SUMMER IS HERE.' : 'Hey Layla 👑'}
            </div>
            {sahelMode && (
              <div style={{ color: 'rgba(240,237,230,0.9)', fontSize: '13px', marginTop: '6px' }}>
                Beach mode on. Sahel drops, yacht parties, and sunrise raves unlocked.
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button onClick={() => setScreen('exclusive-drops')} className="p-3 rounded-xl text-left relative overflow-hidden" style={{
              background: 'linear-gradient(135deg, #FF3D6B, #8B3FFF)',
            }}>
              <Flame size={18} style={{ color: '#F0EDE6', marginBottom: '6px' }} />
              <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 800 }}>Exclusive Drops</div>
              <div style={{ color: 'rgba(240,237,230,0.85)', fontSize: '10px', fontFamily: 'ui-monospace, monospace' }}>4 LIVE</div>
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse" style={{ background: '#F0EDE6' }} />
            </button>
            <button onClick={() => setScreen('partner-perks')} className="p-3 rounded-xl text-left" style={{
              background: 'linear-gradient(135deg, #D4A843, #F0C96A)',
            }}>
              <Gift size={18} style={{ color: '#07060D', marginBottom: '6px' }} />
              <div style={{ color: '#07060D', fontSize: '13px', fontWeight: 800 }}>Partner Perks</div>
              <div style={{ color: 'rgba(7,6,13,0.7)', fontSize: '10px', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>12 ACTIVE</div>
            </button>
          </div>

          {/* Next drop countdown */}
          <div className="p-4 rounded-2xl mb-4" style={{
            background: sahelMode ? 'linear-gradient(135deg, rgba(255,181,71,0.15), rgba(255,107,157,0.1))' : '#10101E',
            border: `1px solid ${sahelMode ? 'rgba(255,181,71,0.4)' : 'rgba(255,61,107,0.3)'}`
          }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock size={12} style={{ color: '#FF3D6B' }} />
                <span style={{ color: '#FF3D6B', fontSize: '9px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>
                  NEXT DROP IN
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#FF3D6B' }} />
                <span style={{ color: '#FF3D6B', fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>LIVE</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              {[
                { val: countdown.days, label: 'DAYS' },
                { val: countdown.hours, label: 'HRS' },
                { val: countdown.minutes, label: 'MIN' },
                { val: countdown.seconds, label: 'SEC' },
              ].map((t, i) => (
                <React.Fragment key={t.label}>
                  <div className="text-center">
                    <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '28px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.02em', lineHeight: '1', fontVariantNumeric: 'tabular-nums' }}>
                      {String(t.val).padStart(2, '0')}
                    </div>
                    <div style={{ color: '#6B6880', fontSize: '8px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>{t.label}</div>
                  </div>
                  {i < 3 && <span style={{ color: '#6B6880', fontSize: '20px', lineHeight: '1' }}>:</span>}
                </React.Fragment>
              ))}
            </div>
            <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700, textAlign: 'center' }}>
              Desert Dawn Rave · Fayoum
            </div>
            <div style={{ color: '#9A98B0', fontSize: '11px', textAlign: 'center' }}>
              Only 37 spots remain
            </div>
          </div>

          {/* Pro stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="p-2.5 rounded-xl text-center" style={{ background: '#10101E', border: '1px solid rgba(212,168,67,0.2)' }}>
              <div style={{ color: '#D4A843', fontFamily: 'Impact, sans-serif', fontSize: '22px', fontWeight: 900 }}>1,240</div>
              <div style={{ color: '#6B6880', fontSize: '8px', letterSpacing: '0.15em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>EGP SAVED</div>
            </div>
            <div className="p-2.5 rounded-xl text-center" style={{ background: '#10101E', border: '1px solid rgba(255,61,107,0.2)' }}>
              <div style={{ color: '#FF3D6B', fontFamily: 'Impact, sans-serif', fontSize: '22px', fontWeight: 900 }}>3</div>
              <div style={{ color: '#6B6880', fontSize: '8px', letterSpacing: '0.15em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>DROPS UNLOCKED</div>
            </div>
            <div className="p-2.5 rounded-xl text-center" style={{ background: '#10101E', border: '1px solid rgba(0,229,200,0.2)' }}>
              <div style={{ color: '#00E5C8', fontFamily: 'Impact, sans-serif', fontSize: '22px', fontWeight: 900 }}>12</div>
              <div style={{ color: '#6B6880', fontSize: '8px', letterSpacing: '0.15em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>VIP RIDES</div>
            </div>
          </div>

          {/* Active benefits */}
          <div style={{ color: sahelMode ? '#F0EDE6' : '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>
            YOUR ACTIVE PERKS
          </div>
          <div className="flex flex-col gap-2 mb-3">
            {proBenefits.slice(0, 4).map((b, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg" style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                  background: `${b.color}15`,
                }}>
                  <b.icon size={14} style={{ color: b.color }} />
                </div>
                <div className="flex-1">
                  <div style={{ color: '#F0EDE6', fontSize: '12px', fontWeight: 700 }}>{b.title}</div>
                </div>
                <div className="px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,229,200,0.15)' }}>
                  <span style={{ color: '#00E5C8', fontSize: '8px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>ACTIVE</span>
                </div>
              </div>
            ))}
          </div>

          {/* Manage */}
          <button onClick={() => setScreen('settings')} className="w-full p-3 rounded-xl flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Settings size={14} style={{ color: '#9A98B0' }} />
            <span style={{ color: '#F0EDE6', fontSize: '12px', fontWeight: 600 }}>Manage membership</span>
            <ChevronRight size={14} style={{ color: '#6B6880', marginLeft: 'auto' }} />
          </button>
        </div>
      </div>
    </Frame>
  );

  // SCREEN: Exclusive Drops
  const ExclusiveDropsScreen = () => (
    <Frame>
      <div className="h-full flex flex-col">
        <div className="px-5 pt-12 pb-3 flex items-center justify-between">
          <button onClick={() => setScreen('pro-dashboard')}>
            <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
          </button>
          <CrownBadge size={13} />
        </div>

        <div className="px-5 mb-3">
          <div style={{ color: '#FF3D6B', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '4px' }}>
            🔥 PRO MEMBERS ONLY
          </div>
          <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '32px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.02em', lineHeight: '1' }}>
            EXCLUSIVE DROPS.
          </div>
          <div style={{ color: '#9A98B0', fontSize: '13px', marginTop: '6px' }}>
            Secret parties curated for Pro. Limited spots. First-come.
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-3">
          <div className="flex flex-col gap-3">
            {exclusiveDrops.map(d => (
              <div key={d.id} className="relative rounded-2xl overflow-hidden cursor-pointer active:scale-[0.99] transition-transform" style={{ background: d.gradient }}>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(7,6,13,0.7))' }} />

                <div className="p-4 relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(7,6,13,0.6)', backdropFilter: 'blur(8px)' }}>
                      {d.tag === 'LIVE' && <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#FF3D6B' }} />}
                      <span style={{ color: d.tag === 'LIVE' ? '#FF3D6B' : '#F0EDE6', fontSize: '9px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>
                        {d.tag === 'LIVE' && '🔥 '}{d.tag}
                      </span>
                    </div>
                    <div className="text-5xl">{d.emoji}</div>
                  </div>

                  <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '24px', color: '#F0EDE6', fontWeight: 900, lineHeight: '1', letterSpacing: '0.02em', marginBottom: '3px' }}>
                    {d.name.toUpperCase()}
                  </div>
                  <div style={{ color: 'rgba(240,237,230,0.9)', fontSize: '11px', marginBottom: '2px' }}>
                    {d.host}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin size={10} style={{ color: 'rgba(240,237,230,0.7)' }} />
                      <span style={{ color: 'rgba(240,237,230,0.8)', fontSize: '10px' }}>{d.neighborhood}</span>
                    </div>
                    <span style={{ color: 'rgba(240,237,230,0.5)' }}>·</span>
                    <span style={{ color: 'rgba(240,237,230,0.8)', fontSize: '10px', fontFamily: 'ui-monospace, monospace' }}>{d.date}</span>
                  </div>

                  {/* Capacity bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ color: 'rgba(240,237,230,0.7)', fontSize: '9px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.15em' }}>
                        {d.members}/{d.cap} MEMBERS
                      </span>
                      <span style={{ color: d.members / d.cap > 0.7 ? '#FF3D6B' : '#00E5C8', fontSize: '9px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em', fontWeight: 700 }}>
                        {Math.round(100 - (d.members / d.cap) * 100)}% LEFT
                      </span>
                    </div>
                    <div className="h-1 rounded-full" style={{ background: 'rgba(7,6,13,0.4)' }}>
                      <div className="h-full rounded-full" style={{
                        background: 'linear-gradient(90deg, #D4A843, #FF3D6B)',
                        width: `${(d.members / d.cap) * 100}%`
                      }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div style={{ color: 'rgba(240,237,230,0.6)', fontSize: '9px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.15em' }}>YOUR PRICE</div>
                      <div style={{ color: d.fee === 'FREE FOR PRO' ? '#00E5C8' : '#F0EDE6', fontSize: '14px', fontWeight: 800 }}>
                        {d.fee}
                      </div>
                    </div>
                    <button className="px-3 py-2 rounded-full text-[10px] font-bold" style={{
                      background: '#F0EDE6',
                      color: '#07060D',
                      letterSpacing: '0.15em'
                    }}>
                      CLAIM SPOT →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl mt-4 flex items-start gap-2" style={{ background: 'rgba(212,168,67,0.05)', border: '1px solid rgba(212,168,67,0.15)' }}>
            <Info size={12} style={{ color: '#D4A843', flexShrink: 0, marginTop: '2px' }} />
            <span style={{ color: '#9A98B0', fontSize: '10px', lineHeight: '1.5' }}>
              Drops are location-hidden until claim. Non-Pro members can't see these events.
            </span>
          </div>
        </div>
      </div>
    </Frame>
  );

  // SCREEN: Partner Perks
  const PartnerPerksScreen = () => (
    <Frame>
      <div className="h-full flex flex-col">
        <div className="px-5 pt-12 pb-3 flex items-center justify-between">
          <button onClick={() => setScreen('pro-dashboard')}>
            <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
          </button>
          <CrownBadge size={13} />
        </div>

        <div className="px-5 mb-3">
          <div style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '4px' }}>
            🎁 MEMBER PERKS
          </div>
          <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '32px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.02em', lineHeight: '1' }}>
            PARTNER LOVE.
          </div>
          <div style={{ color: '#9A98B0', fontSize: '13px', marginTop: '6px' }}>
            Discounts and freebies from Pro-network brands.
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-3">
          <div className="grid grid-cols-2 gap-3 mb-4">
            {partners.map((p, i) => (
              <button key={i} className="p-4 rounded-xl text-left transition-all active:scale-[0.98]" style={{
                background: '#10101E',
                border: `1px solid ${p.color}30`
              }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
                    background: `${p.color}15`,
                    border: `1px solid ${p.color}40`
                  }}>
                    <p.icon size={18} style={{ color: p.color }} />
                  </div>
                  <div className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{
                    background: `${p.color}15`,
                    color: p.color,
                    letterSpacing: '0.15em'
                  }}>
                    {p.tag}
                  </div>
                </div>
                <div style={{ color: '#F0EDE6', fontSize: '14px', fontWeight: 800, marginBottom: '2px' }}>{p.name}</div>
                <div style={{ color: '#6B6880', fontSize: '9px', letterSpacing: '0.15em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '8px' }}>
                  {p.type.toUpperCase()}
                </div>
                <div style={{ color: p.color, fontSize: '11px', fontWeight: 600, lineHeight: '1.3' }}>{p.offer}</div>
              </button>
            ))}
          </div>

          {/* Featured partner */}
          <div className="rounded-2xl p-5 relative overflow-hidden" style={{
            background: 'linear-gradient(135deg, #1a1a28 0%, #2a2030 100%)',
            border: '1px solid rgba(212,168,67,0.3)'
          }}>
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(212,168,67,0.5), transparent 50%)'
            }} />
            <div className="relative">
              <div style={{ color: '#D4A843', fontSize: '9px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '6px' }}>
                ✨ FEATURED THIS WEEK
              </div>
              <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '22px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.02em', marginBottom: '8px' }}>
                HEINEKEN × LAYLA
              </div>
              <div style={{ color: '#9A98B0', fontSize: '12px', lineHeight: '1.5', marginBottom: '12px' }}>
                Show your Pro badge at any partner venue this week. Get 2 Heineken on the house.
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(212,168,67,0.15)' }}>
                  <Clock size={10} style={{ color: '#D4A843' }} />
                  <span style={{ color: '#D4A843', fontSize: '10px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em', fontWeight: 700 }}>ENDS SUN</span>
                </div>
                <button className="ml-auto px-3 py-1.5 rounded-full text-[10px] font-bold" style={{
                  background: 'linear-gradient(135deg, #D4A843, #F0C96A)',
                  color: '#07060D',
                  letterSpacing: '0.1em'
                }}>
                  FIND VENUES →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );

  // SCREEN: Settings / Membership
  const SettingsScreen = () => (
    <Frame>
      <div className="h-full flex flex-col px-5 pt-12 pb-6">
        <button onClick={() => setScreen('pro-dashboard')} className="self-start mb-4">
          <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
        </button>

        <div style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>
          MEMBERSHIP
        </div>
        <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '32px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.02em', lineHeight: '1', marginBottom: '20px' }}>
          YOUR PLAN.
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-3">
          {/* Current plan */}
          <div className="p-4 rounded-2xl relative overflow-hidden" style={{
            background: 'linear-gradient(135deg, #1a1a28 0%, #2a2030 100%)',
            border: '1px solid rgba(212,168,67,0.3)'
          }}>
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(212,168,67,0.4), transparent 50%)'
            }} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <CrownBadge size={14} />
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,229,200,0.15)', border: '1px solid rgba(0,229,200,0.3)' }}>
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00E5C8' }} />
                  <span style={{ color: '#00E5C8', fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>ACTIVE</span>
                </div>
              </div>
              <div style={{ color: '#F0EDE6', fontSize: '18px', fontWeight: 800, fontFamily: 'Impact, sans-serif', letterSpacing: '0.02em', marginBottom: '2px' }}>
                LAYLA PRO · ANNUAL
              </div>
              <div style={{ color: '#9A98B0', fontSize: '11px', marginBottom: '16px' }}>
                Member #002401 · Joined today
              </div>
              <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(212,168,67,0.15)' }}>
                <div>
                  <div style={{ color: '#6B6880', fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>NEXT CHARGE</div>
                  <div style={{ color: '#F0EDE6', fontSize: '12px', fontWeight: 700 }}>Apr 25, 2026</div>
                </div>
                <div className="text-right">
                  <div style={{ color: '#6B6880', fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>AMOUNT</div>
                  <div style={{ color: '#D4A843', fontSize: '14px', fontWeight: 800, fontFamily: 'Impact, sans-serif' }}>4,999 EGP</div>
                </div>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="rounded-2xl overflow-hidden" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { icon: CreditCard, label: 'Payment method', value: 'Visa •••• 6411', color: '#8B3FFF' },
              { icon: RefreshCw, label: 'Billing cycle', value: 'Annual', color: '#00E5C8' },
              { icon: Bell, label: 'Drop alerts', value: 'On · Push + Email', color: '#FF3D6B' },
              { icon: Shield, label: 'Concierge', value: '24/7 · Available', color: '#D4A843' },
            ].map((o, i, arr) => (
              <button key={i} className="w-full p-3 flex items-center gap-3 text-left active:bg-white/5 transition-colors" style={{
                borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none'
              }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${o.color}15` }}>
                  <o.icon size={14} style={{ color: o.color }} />
                </div>
                <div className="flex-1">
                  <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 600 }}>{o.label}</div>
                  <div style={{ color: '#9A98B0', fontSize: '10px' }}>{o.value}</div>
                </div>
                <ChevronRight size={14} style={{ color: '#6B6880' }} />
              </button>
            ))}
          </div>

          <div className="mt-auto">
            <button className="w-full p-3 rounded-xl text-xs" style={{
              background: 'transparent',
              color: '#9A98B0',
              border: '1px solid rgba(255,61,107,0.2)',
              letterSpacing: '0.1em'
            }}>
              PAUSE MEMBERSHIP
            </button>
          </div>
        </div>
      </div>
    </Frame>
  );

  // ============ RENDER ============
  const screens = {
    'pro-landing': ProLandingScreen,
    'pro-checkout': ProCheckoutScreen,
    'pro-welcome': ProWelcomeScreen,
    'pro-dashboard': ProDashboardScreen,
    'exclusive-drops': ExclusiveDropsScreen,
    'partner-perks': PartnerPerksScreen,
    'settings': SettingsScreen,
  };

  const flowLabel = {
    'pro-landing': 'Pro Landing · Upsell',
    'pro-checkout': 'Choose Plan',
    'pro-welcome': 'Welcome to Pro 👑',
    'pro-dashboard': 'Member Dashboard',
    'exclusive-drops': 'Exclusive Drops 🔥',
    'partner-perks': 'Partner Perks 🎁',
    'settings': 'Manage Membership',
  };

  const CurrentScreen = screens[screen];

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4" style={{ background: '#0A0910' }}>
      <div className="mb-6 text-center">
        <div style={{
          fontFamily: 'Impact, "Bebas Neue", sans-serif',
          fontSize: '32px',
          letterSpacing: '0.05em',
          background: 'linear-gradient(135deg, #D4A843, #F0C96A, #FFF4D6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 900
        }}>
          PHASE 06 · SCALE & MONETIZE
        </div>
        <div style={{ color: '#6B6880', fontSize: '11px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginTop: '4px' }}>
          LAYLA PRO · DROPS · PARTNERS · SAHEL MODE
        </div>
      </div>

      <div className="flex gap-8 items-start flex-wrap justify-center">
        {/* Phone */}
        <div className="relative" style={{ width: '340px', height: '700px' }}>
          <div className="absolute inset-0 rounded-[44px] overflow-hidden" style={{
            background: '#000',
            padding: '10px',
            boxShadow: '0 40px 80px rgba(212,168,67,0.2), 0 0 0 2px #1a1a22, 0 0 0 3px #333'
          }}>
            <div className="w-full h-full rounded-[36px] overflow-hidden relative">
              <CurrentScreen />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 rounded-b-2xl z-50" style={{ background: '#000' }} />
            </div>
          </div>
        </div>

        <div className="w-72 p-4 rounded-2xl" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '12px' }}>
            ⚡ JUMP TO SCREEN
          </div>
          <div className="flex flex-col gap-1">
            {Object.keys(screens).map((s, i) => (
              <button key={s} onClick={() => setScreen(s)} className="text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between" style={{
                background: screen === s ? 'rgba(212,168,67,0.15)' : 'transparent',
                color: screen === s ? '#D4A843' : '#9A98B0',
                border: screen === s ? '1px solid rgba(212,168,67,0.3)' : '1px solid transparent',
              }}>
                <span style={{ fontWeight: screen === s ? 700 : 500 }}>
                  {String(i + 1).padStart(2, '0')} · {flowLabel[s]}
                </span>
                {screen === s && <ChevronRight size={12} />}
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>
              ✨ DON'T MISS
            </div>
            <div style={{ color: '#9A98B0', fontSize: '11px', lineHeight: '1.5' }}>
              🪄 <span style={{ color: '#D4A843' }}>Landing</span> → shimmering gold button<br/>
              ⏱️ <span style={{ color: '#FF3D6B' }}>Dashboard</span> → live countdown to next drop<br/>
              🌅 Toggle <span style={{ color: '#FFB547' }}>SAHEL MODE</span> → full UI takeover<br/>
              🔥 <span style={{ color: '#8B3FFF' }}>Drops</span> → capacity bars, LIVE badges
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
