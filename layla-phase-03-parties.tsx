import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Lock, Unlock, Shield, Check, X, Clock, Users, Calendar, Home, Eye, EyeOff, Camera, Upload, Scan, UserCheck, Plus, Minus, Star, AlertCircle, Send, Heart, Music, Sparkles, Info, Key, PartyPopper, ChevronDown, CircleCheck } from 'lucide-react';

export default function LaylaHouseParties() {
  const [screen, setScreen] = useState('feed');
  const [mode, setMode] = useState('guest');
  const [partyFilter, setPartyFilter] = useState('all');
  const [selectedParty, setSelectedParty] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [requestStatus, setRequestStatus] = useState(null);
  const [verifyStep, setVerifyStep] = useState(1);
  const [verified, setVerified] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [newParty, setNewParty] = useState({
    title: '', date: 'Sat, Apr 25', time: '10:00 PM', theme: '', dressCode: 'Smart casual',
    neighborhood: 'Zamalek', address: '', capacity: 15, visibility: 'private',
    entryType: 'free', entryAmount: 0, rules: [],
  });
  const [pendingRequests, setPendingRequests] = useState([
    { id: 1, name: 'Layla M.', age: 24, vibes: ['House', 'Techno', 'Rooftop'], message: 'Love your vibe! First time at one of your parties 🌙', avatar: '#D4A843', mutual: 3 },
    { id: 2, name: 'Omar K.', age: 27, vibes: ['Techno', 'Underground'], message: 'Heard about this from Karim. Would love to join!', avatar: '#8B3FFF', mutual: 7 },
    { id: 3, name: 'Salma A.', age: 22, vibes: ['Chill', 'Rooftop', 'Arabic'], message: '', avatar: '#FF3D6B', mutual: 2 },
  ]);

  // DATA
  const parties = [
    {
      id: 1,
      title: 'Rooftop Sunset Session',
      host: { name: 'Karim A.', verified: true, color: '#D4A843', age: 27, rating: 4.9, parties: 12 },
      date: 'Tonight', time: '8:00 PM',
      neighborhood: 'Zamalek', city: 'Cairo',
      exactAddress: '12 Aziz Osman St, Apt 7B, Zamalek',
      visibility: 'public',
      entryType: 'free', entryAmount: 0,
      capacity: 20, attending: 12,
      theme: 'Sunset chill · lounge beats',
      dressCode: 'Smart casual',
      rules: ['No smoking indoors', 'BYOB welcome', 'Respect neighbors after 11 PM', '21+ only'],
      gradient: 'linear-gradient(135deg, #FF3D6B, #D4A843)',
      emoji: '🌅',
      description: 'Rooftop terrace with Nile view. Chill vibes, good music, easy crowd. Sunset cocktails at 7, music starts at 8.',
      tag: 'TONIGHT',
    },
    {
      id: 2,
      title: 'Afterparty Zamalek',
      host: { name: 'Nour H.', verified: true, color: '#8B3FFF', age: 25, rating: 5.0, parties: 28 },
      date: 'Sat, Apr 25', time: '1:00 AM',
      neighborhood: 'Zamalek', city: 'Cairo',
      exactAddress: 'Private location · revealed upon approval',
      visibility: 'private',
      entryType: 'paid', entryAmount: 200,
      capacity: 15, attending: 8,
      theme: 'Techno · underground',
      dressCode: 'All black',
      rules: ['18+ only', 'No phones on the dancefloor', 'Stay until sunrise or leave before 3 AM', 'Guest list only'],
      gradient: 'linear-gradient(135deg, #8B3FFF, #07060D)',
      emoji: '🌙',
      description: 'Curated afterparty. Limited to 15 people. Boiler room energy. Sound system is serious.',
      tag: 'PRIVATE',
    },
    {
      id: 3,
      title: 'Pool Day · Sahel',
      host: { name: 'Yasmin R.', verified: true, color: '#00E5C8', age: 29, rating: 4.8, parties: 6 },
      date: 'Sun, Apr 26', time: '2:00 PM',
      neighborhood: 'Sidi Heneish', city: 'Sahel',
      exactAddress: 'Villa 47, Marassi · revealed upon approval',
      visibility: 'public',
      entryType: 'paid', entryAmount: 500,
      capacity: 40, attending: 22,
      theme: 'Poolside day drinks',
      dressCode: 'Swimwear + cover-up',
      rules: ['Bring towels', 'No glass by the pool', 'Lunch provided', 'DJ starts at 4 PM'],
      gradient: 'linear-gradient(135deg, #00E5C8, #D4A843)',
      emoji: '🏖️',
      description: 'Beach house pool party. 40-person capacity, food & drinks included with entry. Dress to swim.',
      tag: 'POPULAR',
    },
    {
      id: 4,
      title: 'Masr El Gedida Loft',
      host: { name: 'Tarek O.', verified: true, color: '#FF3D6B', age: 31, rating: 4.7, parties: 4 },
      date: 'Fri, May 2', time: '9:00 PM',
      neighborhood: 'Heliopolis', city: 'Cairo',
      exactAddress: 'Private loft · revealed upon approval',
      visibility: 'private',
      entryType: 'free', entryAmount: 0,
      capacity: 25, attending: 14,
      theme: 'House music · rooftop loft',
      dressCode: 'Anything goes',
      rules: ['No hard drugs', 'Respect the art on the walls', 'BYOB'],
      gradient: 'linear-gradient(135deg, #FF3D6B, #8B3FFF)',
      emoji: '🏠',
      description: 'Artist loft with open rooftop. 25 people max. Chill first, dance later.',
      tag: null,
    },
  ];

  const filteredParties = parties.filter(p => partyFilter === 'all' || p.visibility === partyFilter);

  // Helpers
  const goBack = () => {
    const back = {
      'feed': 'feed',
      'party-detail-locked': 'feed',
      'request-join': 'party-detail-locked',
      'request-pending': 'feed',
      'party-detail-unlocked': 'feed',
      'host-home': 'feed',
      'host-verify': 'host-home',
      'host-create-1': 'host-home',
      'host-create-2': 'host-create-1',
      'host-create-3': 'host-create-2',
      'host-create-success': 'host-home',
      'host-requests': 'host-home',
    };
    setScreen(back[screen] || 'feed');
  };

  // Shared Frame
  const Frame = ({ children, bg = '#07060D', showStatus = true }) => (
    <div className="relative w-full h-full overflow-hidden" style={{ background: bg }}>
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

  const PinkButton = ({ children, onClick, disabled, gold = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-30"
      style={{
        background: !disabled ? (gold ? 'linear-gradient(135deg, #D4A843, #F0C96A)' : 'linear-gradient(135deg, #FF3D6B, #8B3FFF)') : '#10101E',
        color: !disabled ? (gold ? '#07060D' : '#F0EDE6') : '#6B6880',
        fontSize: '14px',
        letterSpacing: '0.15em',
        border: disabled ? '1px solid rgba(255,255,255,0.06)' : 'none'
      }}
    >
      {children}
    </button>
  );

  const VerifiedBadge = ({ size = 12 }) => (
    <div className="inline-flex items-center justify-center rounded-full" style={{
      background: 'linear-gradient(135deg, #00E5C8, #D4A843)',
      width: size + 4, height: size + 4
    }}>
      <Check size={size - 4} style={{ color: '#07060D' }} strokeWidth={4} />
    </div>
  );

  // ============ GUEST SCREENS ============

  // SCREEN: Feed
  const FeedScreen = () => (
    <Frame>
      <div className="h-full flex flex-col">
        <div className="px-5 pt-12 pb-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div style={{ color: '#FF3D6B', fontSize: '10px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace' }}>
                <Home size={10} className="inline mr-1" />HOUSE PARTIES
              </div>
              <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '26px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.02em' }}>
                Tonight's Doors
              </div>
            </div>
            <button
              onClick={() => { setMode('host'); setScreen('host-home'); }}
              className="px-3 py-1.5 rounded-full flex items-center gap-1"
              style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)' }}
            >
              <Plus size={12} style={{ color: '#D4A843' }} />
              <span style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.15em', fontWeight: 700, fontFamily: 'ui-monospace, monospace' }}>HOST</span>
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-3">
            {[
              { id: 'all', label: 'All', icon: Sparkles },
              { id: 'public', label: 'Public', icon: Users },
              { id: 'private', label: 'Private', icon: Lock },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setPartyFilter(f.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all"
                style={{
                  background: partyFilter === f.id ? 'linear-gradient(135deg, #FF3D6B, #8B3FFF)' : 'rgba(255,255,255,0.04)',
                  color: partyFilter === f.id ? '#F0EDE6' : '#9A98B0',
                  border: partyFilter === f.id ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  fontWeight: partyFilter === f.id ? 700 : 500
                }}
              >
                <f.icon size={11} /> {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-4">
          <div className="flex flex-col gap-3">
            {filteredParties.map(p => (
              <div
                key={p.id}
                onClick={() => { setSelectedParty(p); setRequestStatus(null); setScreen('party-detail-locked'); }}
                className="rounded-2xl overflow-hidden cursor-pointer active:scale-[0.99] transition-transform"
                style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {/* Hero */}
                <div className="relative" style={{ background: p.gradient, height: '120px' }}>
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(7,6,13,0.4) 100%)' }} />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(7,6,13,0.5)', backdropFilter: 'blur(8px)' }}>
                      {p.visibility === 'private' ? <Lock size={10} style={{ color: '#F0EDE6' }} /> : <Users size={10} style={{ color: '#F0EDE6' }} />}
                      <span style={{ color: '#F0EDE6', fontSize: '9px', letterSpacing: '0.2em', fontWeight: 700, fontFamily: 'ui-monospace, monospace' }}>
                        {p.visibility === 'private' ? 'PRIVATE' : 'PUBLIC'}
                      </span>
                    </div>
                    {p.tag && (
                      <div className="px-2 py-1 rounded-full" style={{ background: '#07060D' }}>
                        <span style={{ color: '#D4A843', fontSize: '9px', letterSpacing: '0.2em', fontWeight: 700, fontFamily: 'ui-monospace, monospace' }}>
                          🔥 {p.tag}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3 text-5xl">{p.emoji}</div>
                </div>

                <div className="p-3">
                  <div style={{ color: '#F0EDE6', fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>
                    {p.title}
                  </div>

                  {/* Host row */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full" style={{ background: p.host.color }} />
                    <span style={{ color: '#9A98B0', fontSize: '11px' }}>
                      by <span style={{ color: '#F0EDE6', fontWeight: 600 }}>{p.host.name}</span>
                    </span>
                    {p.host.verified && <VerifiedBadge size={10} />}
                    <div className="flex items-center gap-0.5 ml-auto">
                      <Star size={10} style={{ color: '#D4A843' }} fill="#D4A843" />
                      <span style={{ color: '#D4A843', fontSize: '10px', fontWeight: 700 }}>{p.host.rating}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex items-center gap-3 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-1">
                      <MapPin size={11} style={{ color: '#6B6880' }} />
                      <span style={{ color: '#9A98B0', fontSize: '11px' }}>{p.neighborhood}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={11} style={{ color: '#6B6880' }} />
                      <span style={{ color: '#9A98B0', fontSize: '11px', fontFamily: 'ui-monospace, monospace' }}>{p.date}</span>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Users size={11} style={{ color: '#6B6880' }} />
                        <span style={{ color: '#9A98B0', fontSize: '11px' }}>{p.attending}/{p.capacity}</span>
                      </div>
                      <div style={{
                        color: p.entryType === 'free' ? '#00E5C8' : '#D4A843',
                        fontSize: '12px',
                        fontWeight: 800
                      }}>
                        {p.entryType === 'free' ? 'FREE' : `${p.entryAmount} EGP`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Safety banner */}
          <div className="mt-4 p-3 rounded-xl flex items-start gap-2" style={{ background: 'rgba(0,229,200,0.05)', border: '1px solid rgba(0,229,200,0.15)' }}>
            <Shield size={14} style={{ color: '#00E5C8', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ color: '#00E5C8', fontSize: '10px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '2px' }}>
                SAFETY FIRST
              </div>
              <div style={{ color: '#9A98B0', fontSize: '11px', lineHeight: '1.4' }}>
                All hosts are ID-verified. Addresses are hidden until the host approves your request.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );

  // SCREEN: Party Detail (Locked)
  const PartyDetailLocked = () => {
    if (!selectedParty) return null;
    const p = selectedParty;
    return (
      <Frame>
        <div className="h-full flex flex-col">
          {/* Hero */}
          <div className="relative" style={{ height: '220px', background: p.gradient }}>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 0%, #07060D 100%)' }} />
            <div className="absolute top-12 left-4 right-4 flex items-center justify-between z-10">
              <button onClick={goBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(7,6,13,0.6)', backdropFilter: 'blur(10px)' }}>
                <ChevronLeft size={20} style={{ color: '#F0EDE6' }} />
              </button>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: 'rgba(7,6,13,0.6)', backdropFilter: 'blur(10px)' }}>
                {p.visibility === 'private' ? <Lock size={12} style={{ color: '#F0EDE6' }} /> : <Users size={12} style={{ color: '#F0EDE6' }} />}
                <span style={{ color: '#F0EDE6', fontSize: '9px', letterSpacing: '0.2em', fontWeight: 700, fontFamily: 'ui-monospace, monospace' }}>
                  {p.visibility.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="absolute bottom-3 right-4 text-7xl">{p.emoji}</div>
            <div className="absolute bottom-3 left-5 z-10">
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '2px' }}>
                {p.date.toUpperCase()} · {p.time}
              </div>
              <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '28px', color: '#F0EDE6', fontWeight: 900, lineHeight: '1', letterSpacing: '0.02em' }}>
                {p.title.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pt-4 pb-28">
            {/* Host card */}
            <div className="p-3 rounded-xl mb-4 flex items-center gap-3" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-11 h-11 rounded-full flex items-center justify-center relative flex-shrink-0" style={{ background: p.host.color }}>
                <span style={{ color: '#07060D', fontFamily: 'Impact, sans-serif', fontSize: '18px', fontWeight: 900 }}>
                  {p.host.name[0]}
                </span>
                {p.host.verified && (
                  <div className="absolute -bottom-1 -right-1">
                    <VerifiedBadge size={12} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>{p.host.name}</span>
                  {p.host.verified && (
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ background: 'rgba(0,229,200,0.15)', color: '#00E5C8', letterSpacing: '0.1em' }}>
                      LAYLA VERIFIED
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-0.5">
                    <Star size={10} style={{ color: '#D4A843' }} fill="#D4A843" />
                    <span style={{ color: '#D4A843', fontSize: '10px', fontWeight: 700 }}>{p.host.rating}</span>
                  </div>
                  <span style={{ color: '#6B6880', fontSize: '10px' }}>·</span>
                  <span style={{ color: '#9A98B0', fontSize: '10px' }}>{p.host.parties} parties hosted</span>
                </div>
              </div>
            </div>

            {/* LOCKED LOCATION */}
            <div className="p-4 rounded-xl mb-4 relative overflow-hidden" style={{
              background: 'rgba(255,61,107,0.04)',
              border: '1px dashed rgba(255,61,107,0.3)'
            }}>
              <div className="absolute top-3 right-3">
                <Lock size={16} style={{ color: '#FF3D6B' }} />
              </div>
              <div style={{ color: '#FF3D6B', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '6px' }}>
                🔒 LOCATION LOCKED
              </div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={14} style={{ color: '#F0EDE6' }} />
                <span style={{ color: '#F0EDE6', fontSize: '15px', fontWeight: 700 }}>{p.neighborhood}</span>
                <span style={{ color: '#9A98B0', fontSize: '12px' }}>· {p.city}</span>
              </div>
              <div className="flex items-center gap-1 mb-3">
                <span style={{ color: '#9A98B0', fontSize: '11px', filter: 'blur(5px)', userSelect: 'none' }}>
                  •••••••••••••••••••••
                </span>
              </div>
              <div style={{ color: '#6B6880', fontSize: '10px', lineHeight: '1.5' }}>
                Exact address revealed <span style={{ color: '#FF3D6B' }}>only after host approval</span>. The day of the party.
              </div>
            </div>

            {/* Quick info */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="p-3 rounded-xl" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Users size={14} style={{ color: '#D4A843', marginBottom: '4px' }} />
                <div style={{ color: '#F0EDE6', fontSize: '12px', fontWeight: 700 }}>{p.attending}/{p.capacity}</div>
                <div style={{ color: '#6B6880', fontSize: '9px', fontFamily: 'ui-monospace, monospace' }}>GOING</div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Music size={14} style={{ color: '#8B3FFF', marginBottom: '4px' }} />
                <div style={{ color: '#F0EDE6', fontSize: '11px', fontWeight: 700, lineHeight: '1.2' }}>{p.theme.split('·')[0].trim()}</div>
                <div style={{ color: '#6B6880', fontSize: '9px', fontFamily: 'ui-monospace, monospace' }}>THEME</div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Sparkles size={14} style={{ color: '#00E5C8', marginBottom: '4px' }} />
                <div style={{ color: '#F0EDE6', fontSize: '11px', fontWeight: 700 }}>{p.dressCode}</div>
                <div style={{ color: '#6B6880', fontSize: '9px', fontFamily: 'ui-monospace, monospace' }}>DRESS CODE</div>
              </div>
            </div>

            {/* About */}
            <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>
              ABOUT THIS PARTY
            </div>
            <div style={{ color: '#9A98B0', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>
              {p.description}
            </div>

            {/* Rules */}
            <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>
              HOUSE RULES
            </div>
            <div className="flex flex-col gap-1.5 mb-5">
              {p.rules.map((r, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(212,168,67,0.15)' }}>
                    <Check size={10} style={{ color: '#D4A843' }} strokeWidth={3} />
                  </div>
                  <span style={{ color: '#F0EDE6', fontSize: '12px', lineHeight: '1.4' }}>{r}</span>
                </div>
              ))}
            </div>

            {/* Approved guests (anonymized) */}
            <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>
              WHO'S GOING · {p.attending} APPROVED
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex -space-x-2">
                {['#D4A843', '#FF3D6B', '#8B3FFF', '#00E5C8', '#F0C96A'].map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2" style={{ background: c, borderColor: '#07060D' }} />
                ))}
              </div>
              <span style={{ color: '#9A98B0', fontSize: '12px' }}>
                +{p.attending - 5} more
              </span>
            </div>
          </div>

          {/* Sticky bottom */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pt-3 pb-4" style={{ background: 'linear-gradient(180deg, transparent, #07060D 30%)' }}>
            <div className="flex items-center gap-3">
              <div>
                <div style={{ color: '#6B6880', fontSize: '9px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.15em' }}>ENTRY</div>
                <div style={{ color: p.entryType === 'free' ? '#00E5C8' : '#D4A843', fontSize: '20px', fontWeight: 900, fontFamily: 'Impact, sans-serif', lineHeight: '1' }}>
                  {p.entryType === 'free' ? 'FREE' : `${p.entryAmount}`}
                  {p.entryType !== 'free' && <span style={{ fontSize: '11px', opacity: 0.7 }}> EGP</span>}
                </div>
              </div>
              <div className="flex-1">
                <PinkButton onClick={() => setScreen('request-join')}>
                  REQUEST TO JOIN <ChevronRight size={16} />
                </PinkButton>
              </div>
            </div>
          </div>
        </div>
      </Frame>
    );
  };

  // SCREEN: Request Join
  const RequestJoinScreen = () => {
    if (!selectedParty) return null;
    const p = selectedParty;
    return (
      <Frame>
        <div className="h-full flex flex-col px-5 pt-12 pb-6">
          <button onClick={goBack} className="self-start mb-4">
            <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
          </button>

          <div style={{ color: '#FF3D6B', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>
            REQUEST TO JOIN
          </div>
          <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '32px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', lineHeight: '1', marginBottom: '24px' }}>
            INTRODUCE<br/>YOURSELF.
          </div>

          {/* Party summary */}
          <div className="p-3 rounded-xl mb-5 flex items-center gap-3" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0" style={{ background: p.gradient }}>
              {p.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>{p.title}</div>
              <div style={{ color: '#9A98B0', fontSize: '11px' }}>Hosted by {p.host.name}</div>
            </div>
            <div style={{ color: p.entryType === 'free' ? '#00E5C8' : '#D4A843', fontSize: '13px', fontWeight: 800 }}>
              {p.entryType === 'free' ? 'FREE' : `${p.entryAmount} EGP`}
            </div>
          </div>

          {/* Message */}
          <div className="flex-1">
            <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>
              MESSAGE TO HOST (OPTIONAL)
            </div>
            <textarea
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value.slice(0, 200))}
              placeholder="Hey! I'd love to come. A bit about me..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl outline-none resize-none"
              style={{ background: '#10101E', border: '1px solid rgba(255,61,107,0.2)', color: '#F0EDE6', fontSize: '13px', lineHeight: '1.5' }}
            />
            <div className="flex items-center justify-between mt-2">
              <span style={{ color: '#6B6880', fontSize: '10px' }}>A short message helps.</span>
              <span style={{ color: '#9A98B0', fontSize: '10px', fontFamily: 'ui-monospace, monospace' }}>{requestMessage.length}/200</span>
            </div>

            {/* Your profile preview */}
            <div className="mt-5 p-3 rounded-xl" style={{ background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.15)' }}>
              <div style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '6px' }}>
                THE HOST WILL SEE
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4A843, #FF3D6B)', color: '#07060D', fontWeight: 900, fontFamily: 'Impact, sans-serif', fontSize: '16px' }}>
                  Y
                </div>
                <div className="flex-1">
                  <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>You · 24</div>
                  <div style={{ color: '#9A98B0', fontSize: '11px' }}>House · Techno · Rooftop</div>
                </div>
                <VerifiedBadge size={14} />
              </div>
            </div>

            {/* Safety note */}
            <div className="mt-4 flex items-start gap-2 p-3 rounded-lg" style={{ background: 'rgba(0,229,200,0.05)', border: '1px solid rgba(0,229,200,0.15)' }}>
              <Shield size={14} style={{ color: '#00E5C8', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ color: '#9A98B0', fontSize: '11px', lineHeight: '1.5' }}>
                Your request is private. Address reveals only if approved. You can cancel anytime.
              </div>
            </div>
          </div>

          <div className="mt-4">
            <PinkButton onClick={() => { setRequestStatus('pending'); setScreen('request-pending'); }}>
              SEND REQUEST <Send size={14} />
            </PinkButton>
          </div>
        </div>
      </Frame>
    );
  };

  // SCREEN: Request Pending
  const RequestPendingScreen = () => {
    if (!selectedParty) return null;
    const p = selectedParty;
    return (
      <Frame>
        <div className="h-full flex flex-col px-5 pt-12 pb-6">
          <button onClick={() => { setScreen('feed'); setRequestStatus(null); }} className="self-start mb-4">
            <X size={24} style={{ color: '#F0EDE6' }} />
          </button>

          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Animated waiting indicator */}
            <div className="relative mb-8">
              <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(255,61,107,0.3)', width: '100px', height: '100px' }} />
              <div className="w-24 h-24 rounded-full flex items-center justify-center relative" style={{
                background: 'rgba(255,61,107,0.1)',
                border: '2px solid rgba(255,61,107,0.4)'
              }}>
                <Clock size={40} style={{ color: '#FF3D6B' }} />
              </div>
            </div>

            <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '36px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', textAlign: 'center', lineHeight: '1', marginBottom: '12px' }}>
              REQUEST<br/>SENT 🚀
            </div>
            <div style={{ color: '#9A98B0', fontSize: '14px', textAlign: 'center', maxWidth: '280px', lineHeight: '1.5', marginBottom: '28px' }}>
              <span style={{ color: '#F0EDE6', fontWeight: 700 }}>{p.host.name}</span> is reviewing your request. You'll get notified as soon as they respond.
            </div>

            <div className="w-full p-4 rounded-xl mb-3" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: p.gradient }}>
                  {p.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>{p.title}</div>
                  <div style={{ color: '#9A98B0', fontSize: '11px' }}>{p.date} · {p.time}</div>
                </div>
              </div>
              <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span style={{ color: '#9A98B0', fontSize: '11px' }}>Status</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#D4A843' }} />
                    <span style={{ color: '#D4A843', fontSize: '11px', fontWeight: 700, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em' }}>PENDING</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: '#9A98B0', fontSize: '11px' }}>Avg response time</span>
                  <span style={{ color: '#F0EDE6', fontSize: '11px', fontWeight: 600 }}>~15 min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Demo approve */}
          <button
            onClick={() => { setRequestStatus('approved'); setScreen('party-detail-unlocked'); }}
            className="w-full py-3 rounded-xl text-xs mb-2"
            style={{
              background: 'linear-gradient(135deg, #00E5C8, #D4A843)',
              color: '#07060D',
              letterSpacing: '0.15em',
              fontWeight: 800
            }}
          >
            ✨ DEMO: SIMULATE HOST APPROVAL
          </button>
          <button
            onClick={() => { setScreen('feed'); setRequestStatus(null); }}
            className="w-full py-3 rounded-xl text-sm"
            style={{ background: 'transparent', color: '#9A98B0', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Browse other parties
          </button>
        </div>
      </Frame>
    );
  };

  // SCREEN: Party Detail (Unlocked)
  const PartyDetailUnlocked = () => {
    if (!selectedParty) return null;
    const p = selectedParty;
    return (
      <Frame>
        <div className="h-full flex flex-col">
          <div className="relative" style={{ height: '220px', background: p.gradient }}>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 0%, #07060D 100%)' }} />
            <div className="absolute top-12 left-4 right-4 flex items-center justify-between z-10">
              <button onClick={() => setScreen('feed')} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(7,6,13,0.6)', backdropFilter: 'blur(10px)' }}>
                <ChevronLeft size={20} style={{ color: '#F0EDE6' }} />
              </button>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full" style={{ background: 'linear-gradient(135deg, #00E5C8, #D4A843)' }}>
                <Check size={12} style={{ color: '#07060D' }} strokeWidth={3} />
                <span style={{ color: '#07060D', fontSize: '9px', letterSpacing: '0.2em', fontWeight: 900, fontFamily: 'ui-monospace, monospace' }}>
                  YOU'RE IN
                </span>
              </div>
            </div>
            <div className="absolute bottom-3 right-4 text-7xl">{p.emoji}</div>
            <div className="absolute bottom-3 left-5 z-10">
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '2px' }}>
                {p.date.toUpperCase()} · {p.time}
              </div>
              <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '28px', color: '#F0EDE6', fontWeight: 900, lineHeight: '1', letterSpacing: '0.02em' }}>
                {p.title.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pt-4 pb-6">
            {/* SUCCESS BANNER */}
            <div className="p-4 rounded-xl mb-4 relative overflow-hidden" style={{
              background: 'linear-gradient(135deg, rgba(0,229,200,0.15), rgba(212,168,67,0.1))',
              border: '1px solid rgba(0,229,200,0.4)'
            }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #00E5C8, #D4A843)' }}>
                  <CircleCheck size={20} style={{ color: '#07060D' }} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <div style={{ color: '#00E5C8', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '2px' }}>
                    APPROVED BY HOST
                  </div>
                  <div style={{ color: '#F0EDE6', fontSize: '14px', fontWeight: 700, marginBottom: '3px' }}>
                    {p.host.name} welcomed you in! 🎉
                  </div>
                  <div style={{ color: '#9A98B0', fontSize: '11px', lineHeight: '1.4' }}>
                    The full address is now unlocked below.
                  </div>
                </div>
              </div>
            </div>

            {/* UNLOCKED LOCATION */}
            <div className="p-4 rounded-xl mb-4 relative overflow-hidden" style={{
              background: 'linear-gradient(135deg, rgba(0,229,200,0.08), rgba(212,168,67,0.04))',
              border: '1px solid rgba(0,229,200,0.3)'
            }}>
              <div className="absolute top-3 right-3">
                <Unlock size={16} style={{ color: '#00E5C8' }} />
              </div>
              <div style={{ color: '#00E5C8', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '8px' }}>
                🔓 LOCATION UNLOCKED
              </div>
              <div className="flex items-start gap-2 mb-2">
                <MapPin size={16} style={{ color: '#F0EDE6', marginTop: '2px' }} />
                <div>
                  <div style={{ color: '#F0EDE6', fontSize: '15px', fontWeight: 700, lineHeight: '1.3' }}>
                    12 Aziz Osman St, Apt 7B
                  </div>
                  <div style={{ color: '#9A98B0', fontSize: '12px' }}>
                    {p.neighborhood}, {p.city}
                  </div>
                </div>
              </div>
              {/* Mini map */}
              <div className="relative rounded-lg overflow-hidden mb-3" style={{ height: '80px', background: 'linear-gradient(180deg, #0A1020, #10101E)' }}>
                <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.15 }}>
                  <defs>
                    <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00E5C8" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid2)" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full animate-ping" style={{ background: '#FF3D6B', width: '24px', height: '24px', opacity: 0.5 }} />
                    <div className="w-6 h-6 rounded-full relative flex items-center justify-center" style={{ background: '#FF3D6B', border: '2px solid #07060D' }}>
                      <Home size={12} style={{ color: '#07060D' }} />
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full py-2 rounded-lg text-xs flex items-center justify-center gap-1" style={{
                background: 'linear-gradient(135deg, #00E5C8, #D4A843)',
                color: '#07060D',
                fontWeight: 800,
                letterSpacing: '0.15em'
              }}>
                OPEN IN MAPS <ChevronRight size={12} />
              </button>
            </div>

            {/* Host info with big verified badge */}
            <div className="p-3 rounded-xl mb-4" style={{ background: '#10101E', border: '1px solid rgba(0,229,200,0.2)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center relative flex-shrink-0" style={{ background: p.host.color }}>
                  <span style={{ color: '#07060D', fontFamily: 'Impact, sans-serif', fontSize: '20px', fontWeight: 900 }}>
                    {p.host.name[0]}
                  </span>
                  <div className="absolute -bottom-1 -right-1">
                    <VerifiedBadge size={14} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span style={{ color: '#F0EDE6', fontSize: '14px', fontWeight: 700 }}>{p.host.name}</span>
                  </div>
                  <div className="px-2 py-0.5 rounded inline-block mt-1" style={{ background: 'rgba(0,229,200,0.15)' }}>
                    <span style={{ color: '#00E5C8', fontSize: '9px', letterSpacing: '0.15em', fontWeight: 700, fontFamily: 'ui-monospace, monospace' }}>
                      ID VERIFIED · {p.host.parties} PARTIES
                    </span>
                  </div>
                </div>
                <button className="px-3 py-1.5 rounded-full text-xs font-bold" style={{
                  background: 'rgba(255,61,107,0.15)',
                  color: '#FF3D6B',
                  border: '1px solid rgba(255,61,107,0.3)'
                }}>
                  MESSAGE
                </button>
              </div>
            </div>

            {/* Rules */}
            <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>
              HOUSE RULES · READ CAREFULLY
            </div>
            <div className="flex flex-col gap-1.5 mb-4">
              {p.rules.map((r, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(212,168,67,0.15)' }}>
                    <Check size={10} style={{ color: '#D4A843' }} strokeWidth={3} />
                  </div>
                  <span style={{ color: '#F0EDE6', fontSize: '12px', lineHeight: '1.4' }}>{r}</span>
                </div>
              ))}
            </div>

            {/* Entry pass */}
            <div className="p-3 rounded-xl mb-3" style={{ background: p.gradient }}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg flex items-center justify-center" style={{ background: 'rgba(7,6,13,0.3)', backdropFilter: 'blur(8px)' }}>
                  <Key size={18} style={{ color: '#07060D' }} />
                </div>
                <div className="flex-1">
                  <div style={{ color: 'rgba(7,6,13,0.7)', fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>
                    YOUR ACCESS PASS
                  </div>
                  <div style={{ color: '#07060D', fontSize: '14px', fontWeight: 800 }}>
                    LYL-HP-{Math.floor(Math.random() * 900000 + 100000)}
                  </div>
                </div>
                <ChevronRight size={18} style={{ color: '#07060D' }} />
              </div>
            </div>
          </div>
        </div>
      </Frame>
    );
  };

  // ============ HOST SCREENS ============

  // SCREEN: Host Home
  const HostHomeScreen = () => (
    <Frame>
      <div className="h-full flex flex-col px-5 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => { setMode('guest'); setScreen('feed'); }}>
            <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
          </button>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)' }}>
            <span style={{ color: '#D4A843', fontSize: '9px', letterSpacing: '0.25em', fontWeight: 700, fontFamily: 'ui-monospace, monospace' }}>
              HOST MODE
            </span>
          </div>
        </div>

        <div style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>
          HOST DASHBOARD
        </div>
        <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '32px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', lineHeight: '1', marginBottom: '20px' }}>
          THROW A<br/>PARTY. 🏠
        </div>

        {/* Verification status */}
        {!verified ? (
          <div className="p-4 rounded-xl mb-4" style={{
            background: 'linear-gradient(135deg, rgba(255,61,107,0.1), rgba(212,168,67,0.05))',
            border: '1px solid rgba(255,61,107,0.3)'
          }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,61,107,0.15)' }}>
                <AlertCircle size={18} style={{ color: '#FF3D6B' }} />
              </div>
              <div className="flex-1">
                <div style={{ color: '#FF3D6B', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '3px' }}>
                  REQUIRED · BEFORE HOSTING
                </div>
                <div style={{ color: '#F0EDE6', fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>
                  Verify your identity
                </div>
                <div style={{ color: '#9A98B0', fontSize: '11px', lineHeight: '1.5', marginBottom: '12px' }}>
                  All hosts must complete ID verification. It's fast, and protects both you and your guests.
                </div>
                <button
                  onClick={() => { setVerifyStep(1); setScreen('host-verify'); }}
                  className="px-4 py-2 rounded-lg text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, #FF3D6B, #8B3FFF)', color: '#F0EDE6', letterSpacing: '0.15em' }}
                >
                  VERIFY NOW <ChevronRight size={12} className="inline" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl mb-4 flex items-center gap-3" style={{
            background: 'rgba(0,229,200,0.08)',
            border: '1px solid rgba(0,229,200,0.3)'
          }}>
            <VerifiedBadge size={16} />
            <div className="flex-1">
              <div style={{ color: '#00E5C8', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>
                LAYLA VERIFIED HOST
              </div>
              <div style={{ color: '#F0EDE6', fontSize: '12px' }}>You can host parties now.</div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-3 rounded-xl" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>REQUESTS</div>
            <div style={{ color: '#F0EDE6', fontFamily: 'Impact, sans-serif', fontSize: '28px', fontWeight: 900, lineHeight: '1', marginTop: '4px' }}>
              {pendingRequests.length}
            </div>
            <div style={{ color: '#9A98B0', fontSize: '10px', marginTop: '2px' }}>pending</div>
          </div>
          <div className="p-3 rounded-xl" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ color: '#00E5C8', fontSize: '10px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>APPROVED</div>
            <div style={{ color: '#F0EDE6', fontFamily: 'Impact, sans-serif', fontSize: '28px', fontWeight: 900, lineHeight: '1', marginTop: '4px' }}>
              12
            </div>
            <div style={{ color: '#9A98B0', fontSize: '10px', marginTop: '2px' }}>guests confirmed</div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-col gap-2 mb-4">
          <button
            onClick={() => verified ? setScreen('host-create-1') : setScreen('host-verify')}
            className="p-3 rounded-xl flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
            style={{ background: 'linear-gradient(135deg, rgba(255,61,107,0.1), rgba(139,63,255,0.1))', border: '1px solid rgba(255,61,107,0.3)' }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,61,107,0.15)' }}>
              <Plus size={18} style={{ color: '#FF3D6B' }} />
            </div>
            <div className="flex-1">
              <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>Create new party</div>
              <div style={{ color: '#9A98B0', fontSize: '11px' }}>Private or public · free or paid</div>
            </div>
            <ChevronRight size={16} style={{ color: '#FF3D6B' }} />
          </button>
          <button
            onClick={() => setScreen('host-requests')}
            className="p-3 rounded-xl flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
            style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,168,67,0.15)' }}>
              <UserCheck size={18} style={{ color: '#D4A843' }} />
            </div>
            <div className="flex-1">
              <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>Manage requests</div>
              <div style={{ color: '#9A98B0', fontSize: '11px' }}>{pendingRequests.length} guests waiting for approval</div>
            </div>
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#FF3D6B' }}>
              <span style={{ color: '#07060D', fontSize: '11px', fontWeight: 900 }}>{pendingRequests.length}</span>
            </div>
          </button>
        </div>

        <div className="mt-auto p-3 rounded-xl flex items-start gap-2" style={{ background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.15)' }}>
          <Info size={12} style={{ color: '#D4A843', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ color: '#9A98B0', fontSize: '10px', lineHeight: '1.5' }}>
            LAYLA takes 0% from free parties. Paid parties: 5% platform fee. Payouts within 48h after party.
          </div>
        </div>
      </div>
    </Frame>
  );

  // SCREEN: Host ID Verify
  const HostVerifyScreen = () => {
    const steps = [
      { title: 'Upload Your ID', desc: 'Egyptian National ID or Passport', icon: Upload },
      { title: 'Take a Selfie', desc: 'Match your face to your ID', icon: Camera },
      { title: 'Quick Review', desc: 'Our team checks in ~2 minutes', icon: Scan },
    ];
    const s = steps[verifyStep - 1];

    return (
      <Frame>
        <div className="h-full flex flex-col px-5 pt-12 pb-6">
          <button onClick={goBack} className="self-start mb-4">
            <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
          </button>

          <div style={{ color: '#FF3D6B', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>
            ID VERIFICATION · STEP {verifyStep} OF 3
          </div>
          <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '32px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', lineHeight: '1', marginBottom: '8px' }}>
            {s.title.toUpperCase()}
          </div>
          <div style={{ color: '#9A98B0', fontSize: '13px', marginBottom: '20px' }}>
            {s.desc}
          </div>

          {/* Progress */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-1 h-1 rounded-full transition-all" style={{
                background: i <= verifyStep ? 'linear-gradient(135deg, #FF3D6B, #D4A843)' : 'rgba(255,255,255,0.1)'
              }} />
            ))}
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Step 1: Upload ID */}
            {verifyStep === 1 && (
              <div className="w-full">
                <div className="relative rounded-2xl p-6 text-center mb-4" style={{
                  background: 'rgba(212,168,67,0.04)',
                  border: '2px dashed rgba(212,168,67,0.3)'
                }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(212,168,67,0.1)' }}>
                    <Upload size={28} style={{ color: '#D4A843' }} />
                  </div>
                  <div style={{ color: '#F0EDE6', fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>
                    Upload front of ID
                  </div>
                  <div style={{ color: '#9A98B0', fontSize: '11px' }}>
                    Tap to take photo or select from gallery
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  {['Clear, well-lit photo', 'All 4 corners visible', 'No glare or reflections'].map((tip, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs" style={{ color: '#9A98B0' }}>
                      <Check size={12} style={{ color: '#00E5C8' }} /> {tip}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Selfie */}
            {verifyStep === 2 && (
              <div className="w-full">
                <div className="relative mx-auto mb-4" style={{ width: '200px', height: '200px' }}>
                  <div className="absolute inset-0 rounded-full" style={{ background: 'rgba(255,61,107,0.05)', border: '2px dashed rgba(255,61,107,0.4)' }} />
                  <div className="absolute inset-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,61,107,0.1)' }}>
                    <Camera size={48} style={{ color: '#FF3D6B' }} />
                  </div>
                  {/* Corners */}
                  {[[0, 0], [100, 0], [0, 100], [100, 100]].map(([t, l], i) => (
                    <div key={i} className="absolute w-6 h-6" style={{
                      top: `${t}%`, left: `${l}%`,
                      borderTop: t === 0 ? '2px solid #FF3D6B' : 'none',
                      borderBottom: t === 100 ? '2px solid #FF3D6B' : 'none',
                      borderLeft: l === 0 ? '2px solid #FF3D6B' : 'none',
                      borderRight: l === 100 ? '2px solid #FF3D6B' : 'none',
                      transform: `translate(${l === 100 ? -100 : 0}%, ${t === 100 ? -100 : 0}%)`
                    }} />
                  ))}
                </div>
                <div className="text-center mb-3">
                  <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>Position your face in the circle</div>
                  <div style={{ color: '#9A98B0', fontSize: '11px', marginTop: '4px' }}>We'll match it to your ID</div>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: 'rgba(0,229,200,0.05)', border: '1px solid rgba(0,229,200,0.15)' }}>
                  <Shield size={12} style={{ color: '#00E5C8', flexShrink: 0 }} />
                  <span style={{ color: '#9A98B0', fontSize: '10px', lineHeight: '1.4' }}>
                    Face data is encrypted and deleted after verification.
                  </span>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {verifyStep === 3 && (
              <div className="w-full text-center">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4" style={{
                  background: 'linear-gradient(135deg, #00E5C8, #D4A843)',
                }}>
                  <VerifiedBadge size={40} />
                </div>
                <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '28px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', marginBottom: '8px' }}>
                  VERIFIED! 🎉
                </div>
                <div style={{ color: '#9A98B0', fontSize: '13px', marginBottom: '16px', maxWidth: '280px', margin: '0 auto 16px' }}>
                  You're now a <span style={{ color: '#00E5C8', fontWeight: 700 }}>LAYLA Verified Host</span>. You can start creating parties.
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(0,229,200,0.1)', border: '1px solid rgba(0,229,200,0.3)' }}>
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00E5C8' }} />
                  <span style={{ color: '#00E5C8', fontSize: '10px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>
                    BADGE UNLOCKED
                  </span>
                </div>
              </div>
            )}
          </div>

          {verifyStep < 3 ? (
            <PinkButton onClick={() => setVerifyStep(verifyStep + 1)}>
              {verifyStep === 1 ? 'UPLOAD ID' : 'TAKE SELFIE'} <ChevronRight size={16} />
            </PinkButton>
          ) : (
            <PinkButton gold onClick={() => { setVerified(true); setScreen('host-home'); }}>
              CONTINUE TO HOSTING <Sparkles size={16} />
            </PinkButton>
          )}
        </div>
      </Frame>
    );
  };

  // SCREEN: Host Create - Step 1 (Basics)
  const HostCreate1 = () => {
    const dressCodes = ['Smart casual', 'All black', 'All white', 'Anything goes', 'Theme/costume'];
    return (
      <Frame>
        <div className="h-full flex flex-col px-5 pt-12 pb-6">
          <button onClick={goBack} className="self-start mb-4">
            <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
          </button>

          <div style={{ color: '#FF3D6B', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>
            NEW PARTY · STEP 1 OF 3
          </div>
          <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '32px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', lineHeight: '1', marginBottom: '20px' }}>
            THE BASICS.
          </div>

          <div className="flex gap-2 mb-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-1 h-1 rounded-full" style={{
                background: i <= 1 ? 'linear-gradient(135deg, #FF3D6B, #D4A843)' : 'rgba(255,255,255,0.1)'
              }} />
            ))}
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-4">
            <div>
              <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>PARTY NAME</div>
              <input
                value={newParty.title}
                onChange={(e) => setNewParty({ ...newParty, title: e.target.value.slice(0, 50) })}
                placeholder="Rooftop Sunset Session"
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ background: '#10101E', border: '1px solid rgba(255,61,107,0.2)', color: '#F0EDE6', fontSize: '14px' }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>DATE</div>
                <button className="w-full px-3 py-3 rounded-xl text-left flex items-center gap-2" style={{ background: '#10101E', border: '1px solid rgba(255,61,107,0.2)', color: '#F0EDE6', fontSize: '13px' }}>
                  <Calendar size={14} style={{ color: '#D4A843' }} /> {newParty.date}
                </button>
              </div>
              <div>
                <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>TIME</div>
                <button className="w-full px-3 py-3 rounded-xl text-left flex items-center gap-2" style={{ background: '#10101E', border: '1px solid rgba(255,61,107,0.2)', color: '#F0EDE6', fontSize: '13px' }}>
                  <Clock size={14} style={{ color: '#FF3D6B' }} /> {newParty.time}
                </button>
              </div>
            </div>

            <div>
              <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>THEME / VIBE</div>
              <input
                value={newParty.theme}
                onChange={(e) => setNewParty({ ...newParty, theme: e.target.value.slice(0, 60) })}
                placeholder="House music · rooftop sunset"
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ background: '#10101E', border: '1px solid rgba(255,61,107,0.2)', color: '#F0EDE6', fontSize: '14px' }}
              />
            </div>

            <div>
              <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>DRESS CODE</div>
              <div className="flex flex-wrap gap-2">
                {dressCodes.map(d => (
                  <button
                    key={d}
                    onClick={() => setNewParty({ ...newParty, dressCode: d })}
                    className="px-3 py-1.5 rounded-full text-xs transition-all"
                    style={{
                      background: newParty.dressCode === d ? 'linear-gradient(135deg, #FF3D6B, #8B3FFF)' : 'rgba(255,255,255,0.04)',
                      color: newParty.dressCode === d ? '#F0EDE6' : '#9A98B0',
                      border: newParty.dressCode === d ? 'none' : '1px solid rgba(255,255,255,0.08)',
                      fontWeight: newParty.dressCode === d ? 700 : 500
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <PinkButton 
            onClick={() => setScreen('host-create-2')}
            disabled={!newParty.title || !newParty.theme}
          >
            CONTINUE <ChevronRight size={16} />
          </PinkButton>
        </div>
      </Frame>
    );
  };

  // SCREEN: Host Create - Step 2 (Location & Access)
  const HostCreate2 = () => {
    const neighborhoods = ['Zamalek', 'Maadi', 'Heliopolis', 'Sheikh Zayed', 'Sidi Heneish (Sahel)', 'Marassi (Sahel)', 'Gouna'];
    return (
      <Frame>
        <div className="h-full flex flex-col px-5 pt-12 pb-6">
          <button onClick={goBack} className="self-start mb-4">
            <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
          </button>

          <div style={{ color: '#FF3D6B', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>
            NEW PARTY · STEP 2 OF 3
          </div>
          <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '32px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', lineHeight: '1', marginBottom: '20px' }}>
            LOCATION<br/>& ACCESS.
          </div>

          <div className="flex gap-2 mb-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-1 h-1 rounded-full" style={{
                background: i <= 2 ? 'linear-gradient(135deg, #FF3D6B, #D4A843)' : 'rgba(255,255,255,0.1)'
              }} />
            ))}
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-4">
            {/* Visibility toggle */}
            <div>
              <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>VISIBILITY</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'public', title: 'Public', desc: 'Anyone can request', icon: Users, color: '#00E5C8' },
                  { id: 'private', title: 'Private', desc: 'Invite link only', icon: Lock, color: '#8B3FFF' },
                ].map(v => (
                  <button
                    key={v.id}
                    onClick={() => setNewParty({ ...newParty, visibility: v.id })}
                    className="p-3 rounded-xl text-left transition-all active:scale-[0.98]"
                    style={{
                      background: newParty.visibility === v.id ? `${v.color}10` : '#10101E',
                      border: `1px solid ${newParty.visibility === v.id ? v.color : 'rgba(255,255,255,0.06)'}`
                    }}
                  >
                    <v.icon size={16} style={{ color: v.color, marginBottom: '4px' }} />
                    <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>{v.title}</div>
                    <div style={{ color: '#9A98B0', fontSize: '10px' }}>{v.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Entry type */}
            <div>
              <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>ENTRY</div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={() => setNewParty({ ...newParty, entryType: 'free', entryAmount: 0 })}
                  className="p-3 rounded-xl text-left transition-all active:scale-[0.98]"
                  style={{
                    background: newParty.entryType === 'free' ? 'rgba(0,229,200,0.1)' : '#10101E',
                    border: `1px solid ${newParty.entryType === 'free' ? '#00E5C8' : 'rgba(255,255,255,0.06)'}`
                  }}
                >
                  <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>Free entry</div>
                  <div style={{ color: '#00E5C8', fontSize: '10px' }}>No charge</div>
                </button>
                <button
                  onClick={() => setNewParty({ ...newParty, entryType: 'paid' })}
                  className="p-3 rounded-xl text-left transition-all active:scale-[0.98]"
                  style={{
                    background: newParty.entryType === 'paid' ? 'rgba(212,168,67,0.1)' : '#10101E',
                    border: `1px solid ${newParty.entryType === 'paid' ? '#D4A843' : 'rgba(255,255,255,0.06)'}`
                  }}
                >
                  <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>Paid entry</div>
                  <div style={{ color: '#D4A843', fontSize: '10px' }}>Charge a cover</div>
                </button>
              </div>
              {newParty.entryType === 'paid' && (
                <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: '#10101E', border: '1px solid rgba(212,168,67,0.3)' }}>
                  <span style={{ color: '#9A98B0', fontSize: '12px' }}>Cover</span>
                  <input
                    type="tel"
                    value={newParty.entryAmount || ''}
                    onChange={(e) => setNewParty({ ...newParty, entryAmount: parseInt(e.target.value.replace(/\D/g, '') || 0) })}
                    placeholder="200"
                    className="flex-1 bg-transparent outline-none text-right"
                    style={{ color: '#D4A843', fontSize: '18px', fontWeight: 800, fontFamily: 'ui-monospace, monospace' }}
                  />
                  <span style={{ color: '#D4A843', fontSize: '13px', fontWeight: 700 }}>EGP</span>
                </div>
              )}
            </div>

            {/* Neighborhood */}
            <div>
              <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>NEIGHBORHOOD</div>
              <div className="flex flex-wrap gap-2">
                {neighborhoods.map(n => (
                  <button
                    key={n}
                    onClick={() => setNewParty({ ...newParty, neighborhood: n })}
                    className="px-3 py-1.5 rounded-full text-xs transition-all"
                    style={{
                      background: newParty.neighborhood === n ? 'linear-gradient(135deg, #FF3D6B, #8B3FFF)' : 'rgba(255,255,255,0.04)',
                      color: newParty.neighborhood === n ? '#F0EDE6' : '#9A98B0',
                      border: newParty.neighborhood === n ? 'none' : '1px solid rgba(255,255,255,0.08)',
                      fontWeight: newParty.neighborhood === n ? 700 : 500
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Capacity */}
            <div>
              <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>CAPACITY</div>
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>Max guests</div>
                  <div style={{ color: '#9A98B0', fontSize: '10px' }}>Including you</div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setNewParty({ ...newParty, capacity: Math.max(5, newParty.capacity - 5) })} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#07060D', border: '1px solid rgba(255,61,107,0.3)' }}>
                    <Minus size={12} style={{ color: '#FF3D6B' }} />
                  </button>
                  <span style={{ color: '#F0EDE6', fontSize: '18px', fontWeight: 900, fontFamily: 'Impact, sans-serif', minWidth: '32px', textAlign: 'center' }}>
                    {newParty.capacity}
                  </span>
                  <button onClick={() => setNewParty({ ...newParty, capacity: Math.min(100, newParty.capacity + 5) })} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#07060D', border: '1px solid rgba(255,61,107,0.3)' }}>
                    <Plus size={12} style={{ color: '#FF3D6B' }} />
                  </button>
                </div>
              </div>
            </div>

            {/* Safety note */}
            <div className="flex items-start gap-2 p-3 rounded-lg" style={{ background: 'rgba(0,229,200,0.05)', border: '1px solid rgba(0,229,200,0.15)' }}>
              <Lock size={14} style={{ color: '#00E5C8', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ color: '#9A98B0', fontSize: '11px', lineHeight: '1.5' }}>
                Only neighborhood is shown publicly. Exact address is revealed <span style={{ color: '#00E5C8', fontWeight: 700 }}>only</span> after you approve guests.
              </div>
            </div>
          </div>

          <PinkButton onClick={() => setScreen('host-create-3')}>
            CONTINUE <ChevronRight size={16} />
          </PinkButton>
        </div>
      </Frame>
    );
  };

  // SCREEN: Host Create - Step 3 (Rules & Review)
  const HostCreate3 = () => {
    const ruleOptions = [
      '18+ only', '21+ only', 'No smoking indoors', 'No hard drugs',
      'BYOB welcome', 'Respect neighbors after 11 PM', 'No phones on dancefloor',
      'Guest list only', 'Dress code enforced', 'Take shoes off at door'
    ];
    const toggleRule = (r) => {
      setNewParty({
        ...newParty,
        rules: newParty.rules.includes(r) ? newParty.rules.filter(x => x !== r) : [...newParty.rules, r]
      });
    };

    return (
      <Frame>
        <div className="h-full flex flex-col px-5 pt-12 pb-6">
          <button onClick={goBack} className="self-start mb-4">
            <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
          </button>

          <div style={{ color: '#FF3D6B', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>
            NEW PARTY · STEP 3 OF 3
          </div>
          <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '32px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', lineHeight: '1', marginBottom: '20px' }}>
            RULES<br/>& REVIEW.
          </div>

          <div className="flex gap-2 mb-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-1 h-1 rounded-full" style={{
                background: 'linear-gradient(135deg, #FF3D6B, #D4A843)'
              }} />
            ))}
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-4">
            <div>
              <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>
                HOUSE RULES · {newParty.rules.length} SELECTED
              </div>
              <div className="flex flex-wrap gap-2">
                {ruleOptions.map(r => (
                  <button
                    key={r}
                    onClick={() => toggleRule(r)}
                    className="px-3 py-1.5 rounded-full text-xs transition-all"
                    style={{
                      background: newParty.rules.includes(r) ? 'linear-gradient(135deg, #D4A843, #F0C96A)' : 'rgba(255,255,255,0.04)',
                      color: newParty.rules.includes(r) ? '#07060D' : '#9A98B0',
                      border: newParty.rules.includes(r) ? 'none' : '1px solid rgba(255,255,255,0.08)',
                      fontWeight: newParty.rules.includes(r) ? 700 : 500
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div>
              <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>PREVIEW</div>
              <div className="rounded-2xl overflow-hidden" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="relative" style={{ background: 'linear-gradient(135deg, #FF3D6B, #8B3FFF)', height: '80px' }}>
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(7,6,13,0.5)', backdropFilter: 'blur(8px)' }}>
                    {newParty.visibility === 'private' ? <Lock size={10} style={{ color: '#F0EDE6' }} /> : <Users size={10} style={{ color: '#F0EDE6' }} />}
                    <span style={{ color: '#F0EDE6', fontSize: '9px', letterSpacing: '0.15em', fontWeight: 700, fontFamily: 'ui-monospace, monospace' }}>
                      {newParty.visibility.toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 text-3xl">🎉</div>
                </div>
                <div className="p-3">
                  <div style={{ color: '#F0EDE6', fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>
                    {newParty.title || 'Your party name'}
                  </div>
                  <div style={{ color: '#9A98B0', fontSize: '11px', marginBottom: '6px' }}>
                    {newParty.theme || 'Your theme'}
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ color: '#9A98B0', fontSize: '11px' }}>
                      <MapPin size={10} className="inline mr-0.5" />{newParty.neighborhood}
                    </span>
                    <span style={{ color: '#9A98B0', fontSize: '11px', fontFamily: 'ui-monospace, monospace' }}>{newParty.date}</span>
                    <span className="ml-auto" style={{ color: newParty.entryType === 'free' ? '#00E5C8' : '#D4A843', fontSize: '12px', fontWeight: 800 }}>
                      {newParty.entryType === 'free' ? 'FREE' : `${newParty.entryAmount || 0} EGP`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Publish note */}
            <div className="p-3 rounded-lg" style={{ background: 'rgba(212,168,67,0.05)', border: '1px solid rgba(212,168,67,0.15)' }}>
              <div style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '4px' }}>
                WHEN YOU PUBLISH
              </div>
              <ul className="flex flex-col gap-1">
                {[
                  'Your party is visible to your target audience',
                  'Guests can request to join',
                  'You approve each one manually',
                  'Address stays hidden until you approve',
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2" style={{ color: '#9A98B0', fontSize: '11px', lineHeight: '1.4' }}>
                    <Check size={11} style={{ color: '#D4A843', marginTop: '3px', flexShrink: 0 }} /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <PinkButton gold onClick={() => setScreen('host-create-success')}>
            PUBLISH PARTY 🎉
          </PinkButton>
        </div>
      </Frame>
    );
  };

  // SCREEN: Host Create Success
  const HostCreateSuccess = () => (
    <Frame>
      <div className="h-full flex flex-col items-center justify-center px-6 pb-6">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{
          background: 'linear-gradient(135deg, #FF3D6B, #D4A843)',
        }}>
          <PartyPopper size={40} style={{ color: '#F0EDE6' }} />
        </div>
        <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '36px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', textAlign: 'center', lineHeight: '1', marginBottom: '12px' }}>
          PARTY<br/>LIVE! 🚀
        </div>
        <div style={{ color: '#9A98B0', fontSize: '14px', textAlign: 'center', maxWidth: '280px', marginBottom: '28px' }}>
          <span style={{ color: '#D4A843', fontWeight: 700 }}>{newParty.title}</span> is now visible. Requests will start coming in.
        </div>

        <div className="w-full flex flex-col gap-2">
          <PinkButton onClick={() => setScreen('host-requests')}>
            VIEW REQUESTS <ChevronRight size={16} />
          </PinkButton>
          <button
            onClick={() => setScreen('host-home')}
            className="w-full py-3 rounded-xl text-sm"
            style={{ background: 'transparent', color: '#9A98B0', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Back to dashboard
          </button>
        </div>
      </div>
    </Frame>
  );

  // SCREEN: Host Manage Requests
  const HostRequestsScreen = () => {
    const approve = (id) => setPendingRequests(pendingRequests.filter(r => r.id !== id));
    const reject = (id) => setPendingRequests(pendingRequests.filter(r => r.id !== id));

    return (
      <Frame>
        <div className="h-full flex flex-col px-5 pt-12 pb-6">
          <button onClick={goBack} className="self-start mb-4">
            <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
          </button>

          <div style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>
            GUEST REQUESTS
          </div>
          <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '32px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', lineHeight: '1', marginBottom: '6px' }}>
            REVIEW<br/>& APPROVE.
          </div>
          <div style={{ color: '#9A98B0', fontSize: '13px', marginBottom: '20px' }}>
            {pendingRequests.length} pending for <span style={{ color: '#D4A843', fontWeight: 700 }}>Rooftop Sunset</span>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-3">
            {pendingRequests.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ background: 'rgba(0,229,200,0.1)', border: '1px solid rgba(0,229,200,0.3)' }}>
                  <Check size={28} style={{ color: '#00E5C8' }} />
                </div>
                <div style={{ color: '#F0EDE6', fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>All caught up!</div>
                <div style={{ color: '#9A98B0', fontSize: '12px', textAlign: 'center' }}>No pending requests right now.</div>
              </div>
            ) : (
              pendingRequests.map(r => (
                <div key={r.id} className="p-4 rounded-xl" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center relative flex-shrink-0" style={{ background: r.avatar }}>
                      <span style={{ color: '#07060D', fontFamily: 'Impact, sans-serif', fontSize: '17px', fontWeight: 900 }}>
                        {r.name[0]}
                      </span>
                      <div className="absolute -bottom-1 -right-1">
                        <VerifiedBadge size={10} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span style={{ color: '#F0EDE6', fontSize: '14px', fontWeight: 700 }}>{r.name}</span>
                        <span style={{ color: '#9A98B0', fontSize: '11px' }}>· {r.age}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {r.vibes.map(v => (
                          <span key={v} className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'rgba(212,168,67,0.1)', color: '#D4A843' }}>
                            {v}
                          </span>
                        ))}
                      </div>
                      {r.mutual > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          <Users size={10} style={{ color: '#00E5C8' }} />
                          <span style={{ color: '#00E5C8', fontSize: '10px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em' }}>
                            {r.mutual} MUTUAL
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {r.message && (
                    <div className="p-2.5 rounded-lg mb-3" style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '2px solid #FF3D6B' }}>
                      <div style={{ color: '#F0EDE6', fontSize: '12px', lineHeight: '1.5', fontStyle: 'italic' }}>
                        "{r.message}"
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => reject(r.id)}
                      className="flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-transform"
                      style={{ background: 'rgba(255,61,107,0.1)', color: '#FF3D6B', border: '1px solid rgba(255,61,107,0.3)', letterSpacing: '0.1em' }}
                    >
                      <X size={12} /> DECLINE
                    </button>
                    <button
                      onClick={() => approve(r.id)}
                      className="flex-1 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-transform"
                      style={{ background: 'linear-gradient(135deg, #00E5C8, #D4A843)', color: '#07060D', letterSpacing: '0.1em' }}
                    >
                      <Check size={12} strokeWidth={3} /> APPROVE
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {pendingRequests.length > 0 && (
            <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg" style={{ background: 'rgba(212,168,67,0.05)', border: '1px solid rgba(212,168,67,0.15)' }}>
              <Info size={12} style={{ color: '#D4A843', flexShrink: 0 }} />
              <span style={{ color: '#9A98B0', fontSize: '10px', lineHeight: '1.4' }}>
                Approved guests will receive the full address automatically.
              </span>
            </div>
          )}
        </div>
      </Frame>
    );
  };

  // ============ RENDER ============

  const screens = {
    'feed': FeedScreen,
    'party-detail-locked': PartyDetailLocked,
    'request-join': RequestJoinScreen,
    'request-pending': RequestPendingScreen,
    'party-detail-unlocked': PartyDetailUnlocked,
    'host-home': HostHomeScreen,
    'host-verify': HostVerifyScreen,
    'host-create-1': HostCreate1,
    'host-create-2': HostCreate2,
    'host-create-3': HostCreate3,
    'host-create-success': HostCreateSuccess,
    'host-requests': HostRequestsScreen,
  };

  const guestScreens = ['feed', 'party-detail-locked', 'request-join', 'request-pending', 'party-detail-unlocked'];
  const hostScreens = ['host-home', 'host-verify', 'host-create-1', 'host-create-2', 'host-create-3', 'host-create-success', 'host-requests'];

  const flowLabel = {
    'feed': 'Browse Parties',
    'party-detail-locked': 'Locked Detail',
    'request-join': 'Request to Join',
    'request-pending': 'Waiting',
    'party-detail-unlocked': 'Approved — Address Revealed',
    'host-home': 'Host Dashboard',
    'host-verify': 'ID Verification',
    'host-create-1': 'Create · Basics',
    'host-create-2': 'Create · Location',
    'host-create-3': 'Create · Rules',
    'host-create-success': 'Published!',
    'host-requests': 'Manage Requests',
  };

  const CurrentScreen = screens[screen];

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4" style={{ background: '#0A0910' }}>
      <div className="mb-6 text-center">
        <div style={{
          fontFamily: 'Impact, "Bebas Neue", sans-serif',
          fontSize: '32px',
          letterSpacing: '0.05em',
          background: 'linear-gradient(135deg, #FF3D6B, #8B3FFF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 900
        }}>
          PHASE 03 · HOUSE PARTIES
        </div>
        <div style={{ color: '#6B6880', fontSize: '11px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginTop: '4px' }}>
          LAYLA · HOSTING SYSTEM
        </div>
      </div>

      <div className="flex gap-8 items-start flex-wrap justify-center">
        {/* Phone */}
        <div className="relative" style={{ width: '340px', height: '700px' }}>
          <div className="absolute inset-0 rounded-[44px] overflow-hidden" style={{
            background: '#000',
            padding: '10px',
            boxShadow: '0 40px 80px rgba(255,61,107,0.15), 0 0 0 2px #1a1a22, 0 0 0 3px #333'
          }}>
            <div className="w-full h-full rounded-[36px] overflow-hidden relative">
              <CurrentScreen />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 rounded-b-2xl z-50" style={{ background: '#000' }} />
            </div>
          </div>
        </div>

        {/* Flow navigator */}
        <div className="w-80 p-4 rounded-2xl" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ color: '#FF3D6B', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '12px' }}>
            ⚡ JUMP TO SCREEN
          </div>

          {/* Guest flow */}
          <div className="mb-3">
            <div style={{ color: '#00E5C8', fontSize: '9px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '6px' }}>
              👤 GUEST JOURNEY
            </div>
            <div className="flex flex-col gap-1">
              {guestScreens.map(s => (
                <button
                  key={s}
                  onClick={() => setScreen(s)}
                  className="text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between"
                  style={{
                    background: screen === s ? 'rgba(255,61,107,0.15)' : 'transparent',
                    color: screen === s ? '#FF3D6B' : '#9A98B0',
                    border: screen === s ? '1px solid rgba(255,61,107,0.3)' : '1px solid transparent',
                  }}
                >
                  <span style={{ fontWeight: screen === s ? 700 : 500 }}>{flowLabel[s]}</span>
                  {screen === s && <ChevronRight size={12} />}
                </button>
              ))}
            </div>
          </div>

          {/* Host flow */}
          <div className="mb-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ color: '#D4A843', fontSize: '9px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '6px' }}>
              🏠 HOST JOURNEY
            </div>
            <div className="flex flex-col gap-1">
              {hostScreens.map(s => (
                <button
                  key={s}
                  onClick={() => setScreen(s)}
                  className="text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between"
                  style={{
                    background: screen === s ? 'rgba(212,168,67,0.15)' : 'transparent',
                    color: screen === s ? '#D4A843' : '#9A98B0',
                    border: screen === s ? '1px solid rgba(212,168,67,0.3)' : '1px solid transparent',
                  }}
                >
                  <span style={{ fontWeight: screen === s ? 700 : 500 }}>{flowLabel[s]}</span>
                  {screen === s && <ChevronRight size={12} />}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>
              KEY MOMENTS
            </div>
            <div style={{ color: '#9A98B0', fontSize: '11px', lineHeight: '1.5' }}>
              👉 <span style={{ color: '#FF3D6B' }}>Locked Detail</span> — address hidden<br/>
              👉 <span style={{ color: '#D4A843' }}>Waiting</span> — tap "simulate approval"<br/>
              👉 <span style={{ color: '#00E5C8' }}>Unlocked</span> — address revealed ✨
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
