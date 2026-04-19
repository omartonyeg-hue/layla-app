import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Phone, Camera, Sparkles, Music, Users, Calendar, Car, Home, Search, Bell, User, MapPin, Check, Shield } from 'lucide-react';

export default function LaylaOnboarding() {
  const [screen, setScreen] = useState('splash');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [vibes, setVibes] = useState([]);
  const [role, setRole] = useState(null);
  const [homeTab, setHomeTab] = useState('events');
  const otpRefs = useRef([]);

  // Auto-advance from splash
  useEffect(() => {
    if (screen === 'splash') {
      const t = setTimeout(() => setScreen('welcome'), 2400);
      return () => clearTimeout(t);
    }
  }, [screen]);

  const vibeOptions = ['Techno', 'House', 'Hip-Hop', 'Arabic', 'Afrobeats', 'RnB', 'Rave', 'Rooftop', 'Beach', 'Underground', 'VIP', 'Chill'];

  const toggleVibe = (v) => {
    setVibes(vibes.includes(v) ? vibes.filter(x => x !== v) : [...vibes, v]);
  };

  const handleOtpChange = (i, val) => {
    if (val.length > 1) return;
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const otpComplete = otp.every(d => d !== '');

  // Phone frame wrapper
  const Frame = ({ children, showStatus = true }) => (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#07060D' }}>
      {/* Grain overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04] z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
      />
      {showStatus && (
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 pt-3 pb-1 z-40" style={{ fontSize: '12px', color: '#F0EDE6', fontFamily: 'ui-monospace, monospace' }}>
          <span className="font-semibold">9:41</span>
          <span className="flex items-center gap-1">
            <span>●●●</span>
            <span>100%</span>
          </span>
        </div>
      )}
      {children}
    </div>
  );

  // SCREEN: Splash
  const SplashScreen = () => (
    <Frame showStatus={false}>
      <div className="h-full flex flex-col items-center justify-center px-8">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(212,168,67,0.15) 0%, transparent 60%)'
        }} />
        <div className="relative z-10 text-center">
          <div 
            className="mb-3 animate-pulse"
            style={{
              fontFamily: 'Impact, "Bebas Neue", sans-serif',
              fontSize: '88px',
              letterSpacing: '0.08em',
              lineHeight: '1',
              background: 'linear-gradient(135deg, #D4A843 0%, #F0C96A 40%, #FF3D6B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 900
            }}
          >
            LAYLA
          </div>
          <div style={{ color: '#D4A843', fontSize: '14px', letterSpacing: '0.4em', opacity: 0.7 }}>ليلى</div>
          <div className="mt-8" style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.35em', fontFamily: 'ui-monospace, monospace' }}>
            EGYPT'S NIGHTLIFE
          </div>
        </div>
        <div className="absolute bottom-10 left-0 right-0 text-center" style={{ color: '#6B6880', fontSize: '10px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.25em' }}>
          v1.0 · LOADING
        </div>
      </div>
    </Frame>
  );

  // SCREEN: Welcome
  const WelcomeScreen = () => (
    <Frame>
      <div className="h-full flex flex-col px-6 pt-16 pb-6">
        <div className="flex-1 flex flex-col justify-center">
          <div style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '16px' }}>
            WELCOME TO
          </div>
          <div style={{
            fontFamily: 'Impact, "Bebas Neue", sans-serif',
            fontSize: '56px',
            letterSpacing: '0.04em',
            lineHeight: '1',
            background: 'linear-gradient(135deg, #F0EDE6 0%, #D4A843 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 900,
            marginBottom: '20px'
          }}>
            YOUR CITY<br/>AFTER DARK.
          </div>
          <div style={{ color: '#9A98B0', fontSize: '14px', lineHeight: '1.6', marginBottom: '40px' }}>
            Discover parties, book tables, host your own nights, and get home safe. All across Egypt.
          </div>

          <div className="space-y-3 mb-8">
            {[
              { icon: Calendar, text: 'Events & tickets across Egypt', color: '#D4A843' },
              { icon: Home, text: 'Host or join house parties', color: '#FF3D6B' },
              { icon: Car, text: 'Safe-ride valet service', color: '#00E5C8' },
              { icon: Users, text: 'Your nightlife community', color: '#8B3FFF' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${f.color}20`, border: `1px solid ${f.color}40` }}>
                  <f.icon size={18} style={{ color: f.color }} />
                </div>
                <span style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 500 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setScreen('phone')}
          className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #D4A843 0%, #F0C96A 100%)',
            color: '#07060D',
            fontSize: '14px',
            letterSpacing: '0.15em'
          }}
        >
          GET STARTED <ChevronRight size={18} />
        </button>
        <div className="text-center mt-4" style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace' }}>
          BY CONTINUING YOU AGREE TO OUR TERMS
        </div>
      </div>
    </Frame>
  );

  // SCREEN: Phone input
  const PhoneScreen = () => (
    <Frame>
      <div className="h-full flex flex-col px-6 pt-16 pb-6">
        <button onClick={() => setScreen('welcome')} className="self-start mb-8">
          <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
        </button>

        <div style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '12px' }}>
          STEP 1 OF 4
        </div>
        <div style={{
          fontFamily: 'Impact, "Bebas Neue", sans-serif',
          fontSize: '40px',
          letterSpacing: '0.03em',
          lineHeight: '1.05',
          color: '#F0EDE6',
          fontWeight: 900,
          marginBottom: '12px'
        }}>
          WHAT'S YOUR<br/>NUMBER?
        </div>
        <div style={{ color: '#9A98B0', fontSize: '13px', marginBottom: '40px' }}>
          We'll send you a verification code.
        </div>

        <div className="flex gap-2 mb-6">
          <div className="flex items-center gap-2 px-4 py-4 rounded-xl" style={{ background: '#10101E', border: '1px solid rgba(212,168,67,0.2)' }}>
            <span style={{ fontSize: '20px' }}>🇪🇬</span>
            <span style={{ color: '#F0EDE6', fontWeight: 600 }}>+20</span>
          </div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="1X XXX XXXX"
            className="flex-1 px-4 rounded-xl outline-none"
            style={{
              background: '#10101E',
              border: '1px solid rgba(212,168,67,0.2)',
              color: '#F0EDE6',
              fontSize: '16px',
              fontFamily: 'ui-monospace, monospace'
            }}
          />
        </div>

        <div className="flex items-start gap-2 p-3 rounded-lg mb-auto" style={{ background: 'rgba(0,229,200,0.06)', border: '1px solid rgba(0,229,200,0.15)' }}>
          <Shield size={14} style={{ color: '#00E5C8', marginTop: '2px', flexShrink: 0 }} />
          <span style={{ color: '#9A98B0', fontSize: '11px', lineHeight: '1.5' }}>
            Your number stays private. We use it only for login and verification.
          </span>
        </div>

        <button
          onClick={() => phone.length >= 9 && setScreen('otp')}
          disabled={phone.length < 9}
          className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-30 mt-6"
          style={{
            background: phone.length >= 9 ? 'linear-gradient(135deg, #D4A843 0%, #F0C96A 100%)' : '#10101E',
            color: phone.length >= 9 ? '#07060D' : '#6B6880',
            fontSize: '14px',
            letterSpacing: '0.15em',
            border: phone.length >= 9 ? 'none' : '1px solid rgba(255,255,255,0.06)'
          }}
        >
          SEND CODE <ChevronRight size={18} />
        </button>
      </div>
    </Frame>
  );

  // SCREEN: OTP
  const OtpScreen = () => (
    <Frame>
      <div className="h-full flex flex-col px-6 pt-16 pb-6">
        <button onClick={() => setScreen('phone')} className="self-start mb-8">
          <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
        </button>

        <div style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '12px' }}>
          STEP 2 OF 4
        </div>
        <div style={{
          fontFamily: 'Impact, "Bebas Neue", sans-serif',
          fontSize: '40px',
          letterSpacing: '0.03em',
          lineHeight: '1.05',
          color: '#F0EDE6',
          fontWeight: 900,
          marginBottom: '12px'
        }}>
          ENTER THE<br/>CODE.
        </div>
        <div style={{ color: '#9A98B0', fontSize: '13px', marginBottom: '40px' }}>
          Sent to +20 {phone || '1X XXX XXXX'}
        </div>

        <div className="flex gap-2 mb-6 justify-center">
          {otp.map((d, i) => (
            <input
              key={i}
              ref={el => otpRefs.current[i] = el}
              type="tel"
              value={d}
              maxLength={1}
              onChange={(e) => handleOtpChange(i, e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !d && i > 0) otpRefs.current[i - 1]?.focus();
              }}
              className="w-12 h-14 rounded-xl text-center outline-none"
              style={{
                background: '#10101E',
                border: `1px solid ${d ? '#D4A843' : 'rgba(212,168,67,0.2)'}`,
                color: '#F0EDE6',
                fontSize: '22px',
                fontWeight: 700,
                fontFamily: 'ui-monospace, monospace'
              }}
            />
          ))}
        </div>

        <div className="text-center mb-auto">
          <button style={{ color: '#D4A843', fontSize: '12px', letterSpacing: '0.1em', fontFamily: 'ui-monospace, monospace' }}>
            RESEND IN 00:42
          </button>
        </div>

        <button
          onClick={() => otpComplete && setScreen('profile')}
          disabled={!otpComplete}
          className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-30 mt-6"
          style={{
            background: otpComplete ? 'linear-gradient(135deg, #D4A843 0%, #F0C96A 100%)' : '#10101E',
            color: otpComplete ? '#07060D' : '#6B6880',
            fontSize: '14px',
            letterSpacing: '0.15em',
            border: otpComplete ? 'none' : '1px solid rgba(255,255,255,0.06)'
          }}
        >
          VERIFY <ChevronRight size={18} />
        </button>
      </div>
    </Frame>
  );

  // SCREEN: Profile
  const ProfileScreen = () => (
    <Frame>
      <div className="h-full flex flex-col px-6 pt-16 pb-6 overflow-y-auto">
        <button onClick={() => setScreen('otp')} className="self-start mb-6">
          <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
        </button>

        <div style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '12px' }}>
          STEP 3 OF 4
        </div>
        <div style={{
          fontFamily: 'Impact, "Bebas Neue", sans-serif',
          fontSize: '36px',
          letterSpacing: '0.03em',
          lineHeight: '1.05',
          color: '#F0EDE6',
          fontWeight: 900,
          marginBottom: '24px'
        }}>
          YOUR PROFILE.
        </div>

        {/* Photo */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 rounded-full flex items-center justify-center" style={{
            background: 'linear-gradient(135deg, rgba(212,168,67,0.15), rgba(255,61,107,0.15))',
            border: '2px dashed rgba(212,168,67,0.4)'
          }}>
            <Camera size={28} style={{ color: '#D4A843' }} />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#D4A843' }}>
              <span style={{ color: '#07060D', fontWeight: 900, fontSize: '16px' }}>+</span>
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="mb-4">
          <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>NAME</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="How should we call you?"
            className="w-full px-4 py-3 rounded-xl outline-none"
            style={{
              background: '#10101E',
              border: '1px solid rgba(212,168,67,0.2)',
              color: '#F0EDE6',
              fontSize: '15px'
            }}
          />
        </div>

        {/* Age */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace' }}>AGE</div>
            <div style={{ color: '#FF3D6B', fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace' }}>18+ ONLY</div>
          </div>
          <input
            type="tel"
            value={age}
            onChange={(e) => setAge(e.target.value.replace(/\D/g, '').slice(0, 2))}
            placeholder="Must be 18 or older"
            className="w-full px-4 py-3 rounded-xl outline-none"
            style={{
              background: '#10101E',
              border: `1px solid ${age && parseInt(age) < 18 ? '#FF3D6B' : 'rgba(212,168,67,0.2)'}`,
              color: '#F0EDE6',
              fontSize: '15px',
              fontFamily: 'ui-monospace, monospace'
            }}
          />
          {age && parseInt(age) < 18 && (
            <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,61,107,0.1)', border: '1px solid rgba(255,61,107,0.3)' }}>
              <Shield size={12} style={{ color: '#FF3D6B', flexShrink: 0 }} />
              <span style={{ color: '#FF3D6B', fontSize: '11px' }}>You must be 18 or older to use LAYLA.</span>
            </div>
          )}
        </div>

        {/* Vibes */}
        <div className="mb-6">
          <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '10px' }}>
            YOUR VIBE · {vibes.length} SELECTED
          </div>
          <div className="flex flex-wrap gap-2">
            {vibeOptions.map(v => (
              <button
                key={v}
                onClick={() => toggleVibe(v)}
                className="px-3 py-1.5 rounded-full text-xs transition-all active:scale-95"
                style={{
                  background: vibes.includes(v) ? 'linear-gradient(135deg, #D4A843, #F0C96A)' : 'rgba(255,255,255,0.04)',
                  color: vibes.includes(v) ? '#07060D' : '#9A98B0',
                  border: vibes.includes(v) ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  fontWeight: vibes.includes(v) ? 700 : 500
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => name && age && parseInt(age) >= 18 && setScreen('role')}
          disabled={!name || !age || parseInt(age) < 18}
          className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-30 mt-auto"
          style={{
            background: (name && age && parseInt(age) >= 18) ? 'linear-gradient(135deg, #D4A843 0%, #F0C96A 100%)' : '#10101E',
            color: (name && age && parseInt(age) >= 18) ? '#07060D' : '#6B6880',
            fontSize: '14px',
            letterSpacing: '0.15em',
            border: (name && age && parseInt(age) >= 18) ? 'none' : '1px solid rgba(255,255,255,0.06)'
          }}
        >
          CONTINUE <ChevronRight size={18} />
        </button>
      </div>
    </Frame>
  );

  // SCREEN: Role
  const RoleScreen = () => {
    const roles = [
      { id: 'partygoer', icon: Sparkles, title: 'Partygoer', desc: 'Discover events, parties, and your scene', color: '#D4A843' },
      { id: 'host', icon: Home, title: 'Host', desc: 'Throw house parties and private events', color: '#FF3D6B' },
      { id: 'venue', icon: Music, title: 'Venue', desc: 'Bar, club, or rooftop — list your spot', color: '#8B3FFF' },
      { id: 'promoter', icon: Users, title: 'Promoter', desc: 'Run events and manage guestlists', color: '#00E5C8' },
    ];

    return (
      <Frame>
        <div className="h-full flex flex-col px-6 pt-16 pb-6">
          <button onClick={() => setScreen('profile')} className="self-start mb-6">
            <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
          </button>

          <div style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '12px' }}>
            STEP 4 OF 4
          </div>
          <div style={{
            fontFamily: 'Impact, "Bebas Neue", sans-serif',
            fontSize: '36px',
            letterSpacing: '0.03em',
            lineHeight: '1.05',
            color: '#F0EDE6',
            fontWeight: 900,
            marginBottom: '8px'
          }}>
            WHO ARE<br/>YOU?
          </div>
          <div style={{ color: '#9A98B0', fontSize: '13px', marginBottom: '24px' }}>
            You can change this later.
          </div>

          <div className="flex flex-col gap-3 mb-6">
            {roles.map(r => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className="flex items-center gap-4 p-4 rounded-xl transition-all active:scale-[0.98]"
                style={{
                  background: role === r.id ? `${r.color}15` : '#10101E',
                  border: `1px solid ${role === r.id ? r.color : 'rgba(255,255,255,0.06)'}`
                }}
              >
                <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                  background: `${r.color}20`,
                  border: `1px solid ${r.color}40`
                }}>
                  <r.icon size={20} style={{ color: r.color }} />
                </div>
                <div className="flex-1 text-left">
                  <div style={{ color: '#F0EDE6', fontSize: '15px', fontWeight: 700, marginBottom: '2px' }}>{r.title}</div>
                  <div style={{ color: '#9A98B0', fontSize: '12px' }}>{r.desc}</div>
                </div>
                {role === r.id && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: r.color }}>
                    <Check size={14} style={{ color: '#07060D' }} strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => role && setScreen('home')}
            disabled={!role}
            className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-30 mt-auto"
            style={{
              background: role ? 'linear-gradient(135deg, #D4A843 0%, #F0C96A 100%)' : '#10101E',
              color: role ? '#07060D' : '#6B6880',
              fontSize: '14px',
              letterSpacing: '0.15em',
              border: role ? 'none' : '1px solid rgba(255,255,255,0.06)'
            }}
          >
            ENTER LAYLA <Sparkles size={16} />
          </button>
        </div>
      </Frame>
    );
  };

  // SCREEN: Home shell
  const HomeScreen = () => {
    const tabs = [
      { id: 'events', icon: Calendar, label: 'Events' },
      { id: 'parties', icon: Home, label: 'Parties' },
      { id: 'community', icon: Users, label: 'Community' },
      { id: 'valet', icon: Car, label: 'Valet' },
      { id: 'profile', icon: User, label: 'Profile' },
    ];

    const mockEvents = [
      { name: 'Cairo Jazz Club', sub: 'Techno Night w/ Aguizi', time: 'Tonight · 11 PM', price: '600 EGP', color: '#FF3D6B', tag: 'HOT' },
      { name: 'Sachi Rooftop', sub: 'Sunset Sessions', time: 'Sat · 9 PM', price: '450 EGP', color: '#D4A843', tag: 'NEW' },
      { name: 'The Tap East', sub: 'House Grooves', time: 'Fri · 10 PM', price: '350 EGP', color: '#8B3FFF', tag: null },
    ];

    return (
      <Frame>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 pt-12 pb-3 flex items-center justify-between">
            <div>
              <div style={{ color: '#9A98B0', fontSize: '11px', letterSpacing: '0.15em', fontFamily: 'ui-monospace, monospace' }}>
                <MapPin size={10} className="inline mr-1" />CAIRO · TONIGHT
              </div>
              <div style={{
                fontFamily: 'Impact, "Bebas Neue", sans-serif',
                fontSize: '26px',
                color: '#F0EDE6',
                fontWeight: 900,
                letterSpacing: '0.02em'
              }}>
                Hey {name || 'there'} 🌙
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Search size={16} style={{ color: '#F0EDE6' }} />
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center relative" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Bell size={16} style={{ color: '#F0EDE6' }} />
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: '#FF3D6B' }} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-4">
            {homeTab === 'events' && (
              <>
                {/* Hero card */}
                <div className="relative rounded-2xl p-5 mb-5 overflow-hidden" style={{
                  background: 'linear-gradient(135deg, rgba(212,168,67,0.15), rgba(255,61,107,0.15))',
                  border: '1px solid rgba(212,168,67,0.3)'
                }}>
                  <div style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>FEATURED TONIGHT</div>
                  <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '22px', color: '#F0EDE6', fontWeight: 900, lineHeight: '1.1', marginBottom: '6px' }}>
                    SAHEL SUNSET<br/>RAVE 2026
                  </div>
                  <div style={{ color: '#9A98B0', fontSize: '12px', marginBottom: '12px' }}>Six Eight · Friday · 9 PM</div>
                  <button className="px-4 py-2 rounded-full text-xs font-bold" style={{ background: '#D4A843', color: '#07060D', letterSpacing: '0.1em' }}>
                    BOOK TABLE
                  </button>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '18px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.04em' }}>
                    HAPPENING NOW
                  </div>
                  <button style={{ color: '#D4A843', fontSize: '11px', letterSpacing: '0.1em', fontFamily: 'ui-monospace, monospace' }}>SEE ALL →</button>
                </div>

                <div className="flex flex-col gap-3">
                  {mockEvents.map((e, i) => (
                    <div key={i} className="p-4 rounded-xl flex items-center gap-3" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="w-12 h-12 rounded-lg flex-shrink-0" style={{ background: `linear-gradient(135deg, ${e.color}40, ${e.color}10)`, border: `1px solid ${e.color}60` }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <div style={{ color: '#F0EDE6', fontSize: '14px', fontWeight: 700 }}>{e.name}</div>
                          {e.tag && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: e.color, color: '#07060D', letterSpacing: '0.1em' }}>{e.tag}</span>
                          )}
                        </div>
                        <div style={{ color: '#9A98B0', fontSize: '11px', marginBottom: '2px' }}>{e.sub}</div>
                        <div style={{ color: '#6B6880', fontSize: '10px', fontFamily: 'ui-monospace, monospace' }}>{e.time}</div>
                      </div>
                      <div style={{ color: e.color, fontSize: '13px', fontWeight: 800 }}>{e.price}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {homeTab === 'parties' && (
              <div className="pt-12 text-center">
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏠</div>
                <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '24px', color: '#F0EDE6', fontWeight: 900, marginBottom: '8px' }}>
                  HOUSE PARTIES
                </div>
                <div style={{ color: '#9A98B0', fontSize: '13px', marginBottom: '24px', maxWidth: '240px', margin: '0 auto 24px' }}>
                  Host or join private parties. Coming in Phase 3.
                </div>
                <div className="inline-block px-3 py-1 rounded-full" style={{ background: 'rgba(255,61,107,0.1)', border: '1px solid rgba(255,61,107,0.3)' }}>
                  <span style={{ color: '#FF3D6B', fontSize: '10px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace' }}>LOCKED · PHASE 3</span>
                </div>
              </div>
            )}

            {homeTab === 'community' && (
              <div className="pt-12 text-center">
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
                <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '24px', color: '#F0EDE6', fontWeight: 900, marginBottom: '8px' }}>
                  COMMUNITY
                </div>
                <div style={{ color: '#9A98B0', fontSize: '13px', marginBottom: '24px' }}>
                  Connect with your scene. Phase 4.
                </div>
                <div className="inline-block px-3 py-1 rounded-full" style={{ background: 'rgba(139,63,255,0.1)', border: '1px solid rgba(139,63,255,0.3)' }}>
                  <span style={{ color: '#8B3FFF', fontSize: '10px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace' }}>LOCKED · PHASE 4</span>
                </div>
              </div>
            )}

            {homeTab === 'valet' && (
              <div className="pt-12 text-center">
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🚗</div>
                <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '24px', color: '#F0EDE6', fontWeight: 900, marginBottom: '8px' }}>
                  SAFE RIDE
                </div>
                <div style={{ color: '#9A98B0', fontSize: '13px', marginBottom: '24px', maxWidth: '240px', margin: '0 auto 24px' }}>
                  Valets drive you and your car home. Phase 5.
                </div>
                <div className="inline-block px-3 py-1 rounded-full" style={{ background: 'rgba(0,229,200,0.1)', border: '1px solid rgba(0,229,200,0.3)' }}>
                  <span style={{ color: '#00E5C8', fontSize: '10px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace' }}>LOCKED · PHASE 5</span>
                </div>
              </div>
            )}

            {homeTab === 'profile' && (
              <div className="pt-8">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 rounded-full mb-3 flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, #D4A843, #FF3D6B)',
                    fontFamily: 'Impact, sans-serif',
                    fontSize: '32px',
                    color: '#07060D',
                    fontWeight: 900
                  }}>
                    {(name || 'U')[0].toUpperCase()}
                  </div>
                  <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '22px', color: '#F0EDE6', fontWeight: 900 }}>
                    {name || 'Your Name'}
                  </div>
                  <div style={{ color: '#9A98B0', fontSize: '12px', marginBottom: '8px' }}>
                    {age ? `${age} · ` : ''}+20 {phone || '—'}
                  </div>
                  <div className="px-3 py-1 rounded-full" style={{ background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.3)' }}>
                    <span style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', textTransform: 'uppercase' }}>
                      {role || 'no role'}
                    </span>
                  </div>
                </div>
                {vibes.length > 0 && (
                  <div>
                    <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '10px' }}>MY VIBES</div>
                    <div className="flex flex-wrap gap-2">
                      {vibes.map(v => (
                        <span key={v} className="px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(212,168,67,0.1)', color: '#D4A843', border: '1px solid rgba(212,168,67,0.3)' }}>
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  onClick={() => { setScreen('splash'); setPhone(''); setOtp(['','','','','','']); setName(''); setAge(''); setVibes([]); setRole(null); setHomeTab('events'); }}
                  className="w-full mt-8 py-3 rounded-xl text-sm font-semibold"
                  style={{ background: 'rgba(255,61,107,0.1)', color: '#FF3D6B', border: '1px solid rgba(255,61,107,0.3)' }}
                >
                  Restart demo
                </button>
              </div>
            )}
          </div>

          {/* Bottom Nav */}
          <div className="px-3 pt-2 pb-4 border-t" style={{ background: '#07060D', borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-around">
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setHomeTab(t.id)}
                  className="flex flex-col items-center gap-1 py-1 px-2 flex-1"
                >
                  <t.icon size={20} style={{ color: homeTab === t.id ? '#D4A843' : '#6B6880' }} />
                  <span style={{
                    fontSize: '9px',
                    letterSpacing: '0.1em',
                    fontFamily: 'ui-monospace, monospace',
                    color: homeTab === t.id ? '#D4A843' : '#6B6880',
                    fontWeight: homeTab === t.id ? 700 : 500
                  }}>
                    {t.label.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Frame>
    );
  };

  const screens = {
    splash: SplashScreen,
    welcome: WelcomeScreen,
    phone: PhoneScreen,
    otp: OtpScreen,
    profile: ProfileScreen,
    role: RoleScreen,
    home: HomeScreen,
  };

  const CurrentScreen = screens[screen];
  const flow = ['splash', 'welcome', 'phone', 'otp', 'profile', 'role', 'home'];
  const currentIdx = flow.indexOf(screen);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4" style={{ background: '#0A0910' }}>
      {/* Title */}
      <div className="mb-6 text-center">
        <div style={{
          fontFamily: 'Impact, "Bebas Neue", sans-serif',
          fontSize: '32px',
          letterSpacing: '0.05em',
          background: 'linear-gradient(135deg, #D4A843, #FF3D6B)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 900
        }}>
          PHASE 01 · ONBOARDING
        </div>
        <div style={{ color: '#6B6880', fontSize: '11px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginTop: '4px' }}>
          LAYLA · INTERACTIVE PROTOTYPE
        </div>
      </div>

      {/* Phone */}
      <div className="relative" style={{ width: '340px', height: '700px' }}>
        {/* Phone frame */}
        <div className="absolute inset-0 rounded-[44px] overflow-hidden" style={{
          background: '#000',
          padding: '10px',
          boxShadow: '0 40px 80px rgba(212,168,67,0.1), 0 0 0 2px #1a1a22, 0 0 0 3px #333'
        }}>
          <div className="w-full h-full rounded-[36px] overflow-hidden relative">
            <CurrentScreen />
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 rounded-b-2xl z-50" style={{ background: '#000' }} />
          </div>
        </div>
      </div>

      {/* Screen indicator */}
      <div className="mt-6 flex items-center gap-2">
        {flow.map((s, i) => (
          <button
            key={s}
            onClick={() => setScreen(s)}
            className="transition-all"
            style={{
              width: i === currentIdx ? '24px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: i === currentIdx ? '#D4A843' : (i < currentIdx ? 'rgba(212,168,67,0.4)' : 'rgba(255,255,255,0.1)')
            }}
          />
        ))}
      </div>
      <div className="mt-2" style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace' }}>
        {screen.toUpperCase()} · {currentIdx + 1}/{flow.length}
      </div>
    </div>
  );
}
