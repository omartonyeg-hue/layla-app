import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Search, Calendar, Clock, Music, Users, Star, Heart, Share2, Check, CreditCard, Smartphone, Banknote, Apple, Filter, List, Map as MapIcon, Ticket, QrCode, Shield, ShieldAlert, X, Minus, Plus, ChevronDown, Eye, EyeOff, Lock } from 'lucide-react';

export default function LaylaEvents() {
  const [screen, setScreen] = useState('discover');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [cityFilter, setCityFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState(null);
  const [myTickets, setMyTickets] = useState([]);
  const [qrTicket, setQrTicket] = useState(null);
  const [screenshotBlocked, setScreenshotBlocked] = useState(false);
  const [secureMode, setSecureMode] = useState(true);
  const [qrRefreshCount, setQrRefreshCount] = useState(0);

  // Anti-screenshot detection — listens for focus loss (approximates screenshot behavior)
  // In production (React Native) this is enforced via FLAG_SECURE on Android and
  // UIScreen.isCaptured / expo-screen-capture on iOS for true OS-level blocking.
  useEffect(() => {
    if (screen !== 'ticket-qr' || !secureMode) return;

    const triggerBlock = () => {
      setScreenshotBlocked(true);
      setTimeout(() => setScreenshotBlocked(false), 3000);
    };

    const handleVisChange = () => { if (document.hidden) triggerBlock(); };
    const handleKeyDown = (e) => {
      // Block common screenshot/print shortcuts
      if ((e.metaKey || e.ctrlKey) && (e.key === 'p' || e.key === 's' || e.key === 'P' || e.key === 'S')) {
        e.preventDefault();
        triggerBlock();
      }
      // PrintScreen key
      if (e.key === 'PrintScreen') { e.preventDefault(); triggerBlock(); }
    };

    window.addEventListener('blur', triggerBlock);
    document.addEventListener('visibilitychange', handleVisChange);
    window.addEventListener('keydown', handleKeyDown);

    // QR rotation — refresh code every 60 seconds
    const rotationTimer = setInterval(() => setQrRefreshCount(c => c + 1), 60000);

    return () => {
      window.removeEventListener('blur', triggerBlock);
      document.removeEventListener('visibilitychange', handleVisChange);
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(rotationTimer);
    };
  }, [screen, secureMode]);

  // DATA
  const cities = [
    { id: 'all', name: 'All', icon: '🌙' },
    { id: 'cairo', name: 'Cairo', icon: '🏙️' },
    { id: 'sahel', name: 'Sahel', icon: '🏖️' },
    { id: 'gouna', name: 'Gouna', icon: '🌊' },
  ];

  const events = [
    {
      id: 1, name: 'Sahel Sunset Rave', venue: 'Six Eight', city: 'sahel', cityName: 'Sahel',
      date: 'Fri, Apr 24', time: '9:00 PM', genre: 'Techno',
      lineup: ['Aguizi & Fahim', 'Misty', 'Ahmed Samy'],
      color: '#D4A843', gradient: 'linear-gradient(135deg, #D4A843, #FF3D6B)',
      price: 500, featured: true, tag: 'FEATURED',
      description: 'The biggest beach rave of the season. Three stages, sunset to sunrise.',
      tiers: [
        { id: 'std', name: 'Standard', price: 500, desc: 'General admission', available: 127 },
        { id: 'vip', name: 'VIP', price: 1200, desc: 'Priority entry + VIP bar access', available: 34 },
        { id: 'table', name: 'Table (4 pax)', price: 6000, desc: 'Reserved table, min spend 6,000 EGP', available: 8 },
        { id: 'guest', name: 'Guestlist', price: 0, desc: 'Invite only · limited', available: 3 },
      ]
    },
    {
      id: 2, name: 'Techno Night', venue: 'Cairo Jazz Club', city: 'cairo', cityName: 'Cairo',
      date: 'Sat, Apr 25', time: '11:00 PM', genre: 'Techno',
      lineup: ['Aguizi', 'Disco Misr'],
      color: '#FF3D6B', gradient: 'linear-gradient(135deg, #FF3D6B, #8B3FFF)',
      price: 350, featured: false, tag: 'HOT',
      description: 'Underground techno night in the heart of Zamalek.',
      tiers: [
        { id: 'std', name: 'Standard', price: 350, desc: 'General admission', available: 89 },
        { id: 'vip', name: 'VIP', price: 800, desc: 'VIP area + priority bar', available: 22 },
        { id: 'table', name: 'Table (4 pax)', price: 4000, desc: 'Reserved table', available: 5 },
        { id: 'guest', name: 'Guestlist', price: 0, desc: 'Invite only', available: 2 },
      ]
    },
    {
      id: 3, name: 'Sunset Sessions', venue: 'Sachi Rooftop', city: 'cairo', cityName: 'Cairo',
      date: 'Sat, Apr 25', time: '7:00 PM', genre: 'House',
      lineup: ['DJ Feedo', 'Ouzo'],
      color: '#8B3FFF', gradient: 'linear-gradient(135deg, #8B3FFF, #00E5C8)',
      price: 450, featured: false, tag: null,
      description: 'Rooftop house music with a Nile view. Dress code: smart casual.',
      tiers: [
        { id: 'std', name: 'Standard', price: 450, desc: 'General admission', available: 56 },
        { id: 'vip', name: 'VIP', price: 1000, desc: 'Reserved lounge seating', available: 12 },
        { id: 'table', name: 'Table (4 pax)', price: 5000, desc: 'Terrace table', available: 4 },
        { id: 'guest', name: 'Guestlist', price: 0, desc: 'Invite only', available: 1 },
      ]
    },
    {
      id: 4, name: 'Gouna Beach Party', venue: 'Smokery', city: 'gouna', cityName: 'Gouna',
      date: 'Fri, Apr 24', time: '8:00 PM', genre: 'Afrobeats',
      lineup: ['Nubian Soul', 'DJ Adam'],
      color: '#00E5C8', gradient: 'linear-gradient(135deg, #00E5C8, #D4A843)',
      price: 600, featured: false, tag: 'NEW',
      description: 'Beachside afrobeats & amapiano. Sunset to 2 AM.',
      tiers: [
        { id: 'std', name: 'Standard', price: 600, desc: 'General admission', available: 72 },
        { id: 'vip', name: 'VIP', price: 1400, desc: 'Beach VIP cabana access', available: 18 },
        { id: 'table', name: 'Table (4 pax)', price: 7000, desc: 'Beachfront table', available: 6 },
        { id: 'guest', name: 'Guestlist', price: 0, desc: 'Invite only', available: 4 },
      ]
    },
    {
      id: 5, name: 'House Grooves', venue: 'The Tap East', city: 'cairo', cityName: 'Cairo',
      date: 'Thu, Apr 23', time: '10:00 PM', genre: 'House',
      lineup: ['Ramy Nagy', 'Warda'],
      color: '#FF3D6B', gradient: 'linear-gradient(135deg, #FF3D6B, #D4A843)',
      price: 250, featured: false, tag: null,
      description: 'Weekly house night. Casual vibe, good drinks.',
      tiers: [
        { id: 'std', name: 'Standard', price: 250, desc: 'General admission', available: 112 },
        { id: 'vip', name: 'VIP', price: 600, desc: 'VIP section', available: 28 },
        { id: 'table', name: 'Table (4 pax)', price: 3000, desc: 'Reserved table', available: 9 },
        { id: 'guest', name: 'Guestlist', price: 0, desc: 'Invite only', available: 5 },
      ]
    },
  ];

  const filteredEvents = events.filter(e => {
    if (cityFilter !== 'all' && e.city !== cityFilter) return false;
    return true;
  });

  const paymentMethods = [
    { id: 'paymob', name: 'Card', desc: 'Visa, Mastercard, Meeza via Paymob', icon: CreditCard, color: '#D4A843' },
    { id: 'fawry', name: 'Fawry', desc: 'Pay cash at any Fawry kiosk', icon: Banknote, color: '#FF3D6B' },
    { id: 'vodafone', name: 'Vodafone Cash', desc: 'Mobile wallet payment', icon: Smartphone, color: '#FF3D6B' },
    { id: 'applepay', name: 'Apple Pay', desc: 'One-tap secure payment', icon: Apple, color: '#F0EDE6' },
  ];

  // Helpers
  const goBack = () => {
    const back = { 
      'event-detail': 'discover', 
      'ticket-select': 'event-detail', 
      'payment-method': 'ticket-select', 
      'payment-card': 'payment-method',
      'payment-vodafone': 'payment-method',
      'payment-fawry': 'payment-method',
      'processing': 'payment-method',
      'success': 'discover',
      'my-tickets': 'discover',
      'ticket-qr': 'my-tickets',
    };
    setScreen(back[screen] || 'discover');
  };

  const completeOrder = () => {
    const ticket = {
      id: `LYL-${Date.now().toString().slice(-8)}`,
      event: selectedEvent,
      tier: selectedTier,
      quantity,
      purchased: new Date().toISOString(),
      method: paymentMethod,
    };
    setMyTickets([...myTickets, ticket]);
    setScreen('success');
  };

  // Phone frame wrapper
  const Frame = ({ children, showStatus = true, bg = '#07060D' }) => (
    <div className="relative w-full h-full overflow-hidden" style={{ background: bg }}>
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

  const GoldButton = ({ children, onClick, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-30"
      style={{
        background: !disabled ? 'linear-gradient(135deg, #D4A843 0%, #F0C96A 100%)' : '#10101E',
        color: !disabled ? '#07060D' : '#6B6880',
        fontSize: '14px',
        letterSpacing: '0.15em',
        border: disabled ? '1px solid rgba(255,255,255,0.06)' : 'none'
      }}
    >
      {children}
    </button>
  );

  // SCREEN: Discover
  const DiscoverScreen = () => (
    <Frame>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-5 pt-12 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div style={{ color: '#9A98B0', fontSize: '10px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace' }}>
                <MapPin size={10} className="inline mr-1" />TONIGHT IN EGYPT
              </div>
              <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '26px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.02em' }}>
                Discover
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setScreen('my-tickets')}
                className="relative w-10 h-10 rounded-full flex items-center justify-center" 
                style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <Ticket size={16} style={{ color: '#D4A843' }} />
                {myTickets.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#FF3D6B', color: '#07060D', fontSize: '9px', fontWeight: 900 }}>
                    {myTickets.length}
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Search size={14} style={{ color: '#6B6880' }} />
            <input 
              placeholder="Search events, venues, DJs..." 
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: '#F0EDE6' }}
            />
          </div>

          {/* City pills */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {cities.map(c => (
              <button
                key={c.id}
                onClick={() => setCityFilter(c.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all flex-shrink-0"
                style={{
                  background: cityFilter === c.id ? 'linear-gradient(135deg, #D4A843, #F0C96A)' : 'rgba(255,255,255,0.04)',
                  color: cityFilter === c.id ? '#07060D' : '#9A98B0',
                  border: cityFilter === c.id ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  fontWeight: cityFilter === c.id ? 700 : 500
                }}
              >
                <span>{c.icon}</span> {c.name}
              </button>
            ))}
          </div>

          {/* View toggle + filter */}
          <div className="flex items-center justify-between">
            <div className="flex rounded-lg p-0.5" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                onClick={() => setViewMode('list')}
                className="flex items-center gap-1 px-3 py-1 rounded-md text-xs"
                style={{
                  background: viewMode === 'list' ? '#D4A843' : 'transparent',
                  color: viewMode === 'list' ? '#07060D' : '#9A98B0',
                  fontWeight: 700
                }}
              >
                <List size={12} /> List
              </button>
              <button
                onClick={() => setViewMode('map')}
                className="flex items-center gap-1 px-3 py-1 rounded-md text-xs"
                style={{
                  background: viewMode === 'map' ? '#D4A843' : 'transparent',
                  color: viewMode === 'map' ? '#07060D' : '#9A98B0',
                  fontWeight: 700
                }}
              >
                <MapIcon size={12} /> Map
              </button>
            </div>
            <button className="flex items-center gap-1 text-xs" style={{ color: '#D4A843', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em' }}>
              <Filter size={12} /> FILTERS
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-4">
          {viewMode === 'list' ? (
            <>
              {/* Featured */}
              {cityFilter === 'all' && (
                <div 
                  onClick={() => { setSelectedEvent(events[0]); setScreen('event-detail'); }}
                  className="relative rounded-2xl p-5 mb-4 overflow-hidden cursor-pointer active:scale-[0.99] transition-transform" 
                  style={{
                    background: events[0].gradient,
                    minHeight: '160px'
                  }}
                >
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3), transparent 50%)'
                  }} />
                  <div className="relative z-10">
                    <div className="inline-block px-2 py-0.5 rounded text-[9px] font-bold mb-2" style={{ background: 'rgba(7,6,13,0.4)', color: '#F0EDE6', letterSpacing: '0.2em', backdropFilter: 'blur(8px)' }}>
                      🔥 FEATURED
                    </div>
                    <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '28px', color: '#07060D', fontWeight: 900, lineHeight: '1', marginBottom: '6px' }}>
                      SAHEL SUNSET<br/>RAVE 2026
                    </div>
                    <div style={{ color: 'rgba(7,6,13,0.8)', fontSize: '12px', marginBottom: '16px', fontWeight: 600 }}>
                      Six Eight · Sahel · Fri, Apr 24
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: '#07060D', color: '#F0EDE6', letterSpacing: '0.1em' }}>
                        FROM 500 EGP
                      </div>
                      <div className="px-3 py-1.5 rounded-full text-xs" style={{ background: 'rgba(7,6,13,0.3)', color: '#07060D', backdropFilter: 'blur(8px)', fontWeight: 600 }}>
                        127 going
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section header */}
              <div className="flex items-center justify-between mb-3 mt-1">
                <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '16px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.04em' }}>
                  {cityFilter === 'all' ? 'THIS WEEK' : `${cities.find(c => c.id === cityFilter)?.name.toUpperCase()} EVENTS`}
                </div>
                <div style={{ color: '#6B6880', fontSize: '10px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.15em' }}>
                  {filteredEvents.length} EVENTS
                </div>
              </div>

              {/* Event list */}
              <div className="flex flex-col gap-3">
                {filteredEvents.filter(e => !(cityFilter === 'all' && e.id === 1)).map(e => (
                  <div 
                    key={e.id}
                    onClick={() => { setSelectedEvent(e); setScreen('event-detail'); }}
                    className="p-3 rounded-xl flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform"
                    style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div className="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: e.gradient }}>
                      <Music size={20} style={{ color: '#07060D' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <div style={{ color: '#F0EDE6', fontSize: '14px', fontWeight: 700 }}>{e.name}</div>
                        {e.tag && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ background: e.color, color: '#07060D', letterSpacing: '0.15em' }}>
                            {e.tag}
                          </span>
                        )}
                      </div>
                      <div style={{ color: '#9A98B0', fontSize: '11px', marginBottom: '3px' }}>
                        {e.venue} · {e.cityName}
                      </div>
                      <div className="flex items-center gap-2">
                        <div style={{ color: '#6B6880', fontSize: '10px', fontFamily: 'ui-monospace, monospace' }}>
                          {e.date} · {e.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div style={{ color: e.color, fontSize: '13px', fontWeight: 800 }}>
                        {e.price} EGP
                      </div>
                      <div style={{ color: '#6B6880', fontSize: '9px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em' }}>
                        FROM
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <MapView />
          )}
        </div>
      </div>
    </Frame>
  );

  // Map view
  const MapView = () => (
    <div className="relative rounded-2xl overflow-hidden" style={{ 
      background: 'linear-gradient(180deg, #0A1020 0%, #10101E 100%)',
      height: '500px',
      border: '1px solid rgba(255,255,255,0.06)'
    }}>
      {/* Map grid pattern */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.15 }}>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D4A843" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Faux roads */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.25 }}>
        <path d="M 20 180 Q 150 100 280 220" stroke="#D4A843" strokeWidth="2" fill="none" />
        <path d="M 280 60 Q 200 200 50 350" stroke="#D4A843" strokeWidth="2" fill="none" />
        <path d="M 0 280 L 300 320" stroke="#D4A843" strokeWidth="1" fill="none" />
      </svg>

      {/* Pins */}
      {filteredEvents.slice(0, 5).map((e, i) => {
        const positions = [
          { top: '25%', left: '40%' }, { top: '45%', left: '65%' },
          { top: '35%', left: '20%' }, { top: '60%', left: '50%' }, { top: '20%', left: '70%' }
        ];
        return (
          <button
            key={e.id}
            onClick={() => { setSelectedEvent(e); setScreen('event-detail'); }}
            className="absolute transition-transform active:scale-90"
            style={positions[i]}
          >
            <div className="relative flex flex-col items-center">
              <div 
                className="px-2 py-1 rounded-lg mb-1 whitespace-nowrap" 
                style={{ 
                  background: '#07060D', 
                  border: `1px solid ${e.color}`,
                  boxShadow: `0 0 20px ${e.color}40`
                }}
              >
                <div style={{ color: '#F0EDE6', fontSize: '10px', fontWeight: 700 }}>{e.name}</div>
              </div>
              <div className="relative">
                <div className="w-8 h-8 rounded-full flex items-center justify-center animate-pulse" style={{ 
                  background: e.color,
                  boxShadow: `0 0 0 4px ${e.color}30, 0 0 20px ${e.color}80`
                }}>
                  <MapPin size={14} style={{ color: '#07060D' }} fill="#07060D" />
                </div>
              </div>
            </div>
          </button>
        );
      })}

      {/* Location dot (user) */}
      <div className="absolute" style={{ top: '50%', left: '45%' }}>
        <div className="relative">
          <div className="absolute inset-0 rounded-full animate-ping" style={{ background: '#00E5C8', width: '20px', height: '20px', opacity: 0.5 }} />
          <div className="w-5 h-5 rounded-full relative" style={{ background: '#00E5C8', border: '2px solid #07060D' }} />
        </div>
      </div>

      {/* Corner info */}
      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(7,6,13,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212,168,67,0.2)' }}>
        <div style={{ color: '#D4A843', fontSize: '10px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.15em', fontWeight: 700 }}>
          {filteredEvents.length} EVENTS NEARBY
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl" style={{ background: 'rgba(7,6,13,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ color: '#9A98B0', fontSize: '10px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.15em', marginBottom: '4px' }}>
          TAP ANY PIN TO VIEW
        </div>
        <div style={{ color: '#F0EDE6', fontSize: '12px' }}>
          Live events across {cityFilter === 'all' ? '3 cities' : cities.find(c => c.id === cityFilter)?.name}
        </div>
      </div>
    </div>
  );

  // SCREEN: Event detail
  const EventDetailScreen = () => {
    if (!selectedEvent) return null;
    const e = selectedEvent;
    return (
      <Frame>
        <div className="h-full flex flex-col">
          {/* Hero */}
          <div className="relative" style={{ height: '260px', background: e.gradient }}>
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.4), transparent 50%)'
            }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 0%, transparent 50%, #07060D 100%)' }} />
            
            <div className="absolute top-12 left-4 right-4 flex items-center justify-between z-10">
              <button onClick={goBack} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(7,6,13,0.6)', backdropFilter: 'blur(10px)' }}>
                <ChevronLeft size={20} style={{ color: '#F0EDE6' }} />
              </button>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(7,6,13,0.6)', backdropFilter: 'blur(10px)' }}>
                  <Heart size={16} style={{ color: '#F0EDE6' }} />
                </button>
                <button className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(7,6,13,0.6)', backdropFilter: 'blur(10px)' }}>
                  <Share2 size={16} style={{ color: '#F0EDE6' }} />
                </button>
              </div>
            </div>

            <div className="absolute bottom-4 left-5 right-5 z-10">
              {e.tag && (
                <div className="inline-block px-2 py-0.5 rounded text-[9px] font-bold mb-2" style={{ background: 'rgba(7,6,13,0.7)', color: '#F0EDE6', letterSpacing: '0.2em', backdropFilter: 'blur(8px)' }}>
                  🔥 {e.tag}
                </div>
              )}
              <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '32px', color: '#F0EDE6', fontWeight: 900, lineHeight: '1', marginBottom: '4px' }}>
                {e.name.toUpperCase()}
              </div>
              <div style={{ color: '#F0EDE6', fontSize: '13px', opacity: 0.9 }}>
                {e.venue} · {e.cityName}
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 pt-4 pb-32">
            {/* Info row */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              <div className="p-3 rounded-xl" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Calendar size={14} style={{ color: '#D4A843', marginBottom: '6px' }} />
                <div style={{ color: '#F0EDE6', fontSize: '11px', fontWeight: 700 }}>{e.date}</div>
                <div style={{ color: '#6B6880', fontSize: '9px', fontFamily: 'ui-monospace, monospace' }}>DATE</div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Clock size={14} style={{ color: '#FF3D6B', marginBottom: '6px' }} />
                <div style={{ color: '#F0EDE6', fontSize: '11px', fontWeight: 700 }}>{e.time}</div>
                <div style={{ color: '#6B6880', fontSize: '9px', fontFamily: 'ui-monospace, monospace' }}>START</div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Music size={14} style={{ color: '#8B3FFF', marginBottom: '6px' }} />
                <div style={{ color: '#F0EDE6', fontSize: '11px', fontWeight: 700 }}>{e.genre}</div>
                <div style={{ color: '#6B6880', fontSize: '9px', fontFamily: 'ui-monospace, monospace' }}>GENRE</div>
              </div>
            </div>

            {/* About */}
            <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>
              ABOUT
            </div>
            <div style={{ color: '#9A98B0', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>
              {e.description}
            </div>

            {/* Lineup */}
            <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>
              LINEUP
            </div>
            <div className="flex flex-col gap-2 mb-5">
              {e.lineup.map((artist, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: e.gradient }}>
                    <span style={{ color: '#07060D', fontWeight: 900, fontSize: '12px' }}>
                      {artist.split(' ')[0][0]}
                    </span>
                  </div>
                  <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 600 }}>{artist}</div>
                  {i === 0 && <Star size={12} style={{ color: '#D4A843', marginLeft: 'auto' }} fill="#D4A843" />}
                </div>
              ))}
            </div>

            {/* Venue */}
            <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>
              VENUE
            </div>
            <div className="p-3 rounded-xl flex items-center gap-3 mb-5" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.3)' }}>
                <MapPin size={16} style={{ color: '#D4A843' }} />
              </div>
              <div className="flex-1">
                <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>{e.venue}</div>
                <div style={{ color: '#9A98B0', fontSize: '11px' }}>{e.cityName} · Tap for directions</div>
              </div>
              <ChevronRight size={16} style={{ color: '#6B6880' }} />
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 p-3 rounded-xl mb-5" style={{ background: 'rgba(212,168,67,0.05)', border: '1px solid rgba(212,168,67,0.15)' }}>
              <div className="flex -space-x-2">
                {['#D4A843', '#FF3D6B', '#8B3FFF'].map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2" style={{ background: c, borderColor: '#07060D' }} />
                ))}
              </div>
              <div style={{ color: '#F0EDE6', fontSize: '12px' }}>
                <span style={{ fontWeight: 700 }}>127 going</span>
                <span style={{ color: '#9A98B0' }}> · 42 from your vibe</span>
              </div>
            </div>
          </div>

          {/* Sticky bottom CTA */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pt-3 pb-4" style={{ background: 'linear-gradient(180deg, transparent, #07060D 30%)' }}>
            <div className="flex items-center gap-3">
              <div>
                <div style={{ color: '#6B6880', fontSize: '9px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.15em' }}>FROM</div>
                <div style={{ color: e.color, fontSize: '20px', fontWeight: 900, fontFamily: 'Impact, sans-serif', lineHeight: '1' }}>
                  {e.price} <span style={{ fontSize: '12px', opacity: 0.7 }}>EGP</span>
                </div>
              </div>
              <div className="flex-1">
                <GoldButton onClick={() => setScreen('ticket-select')}>
                  GET TICKETS <ChevronRight size={16} />
                </GoldButton>
              </div>
            </div>
          </div>
        </div>
      </Frame>
    );
  };

  // SCREEN: Ticket select
  const TicketSelectScreen = () => {
    if (!selectedEvent) return null;
    const e = selectedEvent;
    const total = selectedTier ? selectedTier.price * quantity : 0;

    return (
      <Frame>
        <div className="h-full flex flex-col px-5 pt-12 pb-6">
          <button onClick={goBack} className="self-start mb-4">
            <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
          </button>

          <div style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>
            SELECT TICKET · {e.name.toUpperCase()}
          </div>
          <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '32px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', lineHeight: '1', marginBottom: '20px' }}>
            CHOOSE YOUR<br/>TIER.
          </div>

          {/* Tier cards */}
          <div className="flex flex-col gap-2 mb-4 flex-1 overflow-y-auto">
            {e.tiers.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTier(t)}
                disabled={t.available === 0}
                className="p-3 rounded-xl text-left transition-all active:scale-[0.98] disabled:opacity-40"
                style={{
                  background: selectedTier?.id === t.id ? `${e.color}10` : '#10101E',
                  border: `1px solid ${selectedTier?.id === t.id ? e.color : 'rgba(255,255,255,0.06)'}`
                }}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div style={{ color: '#F0EDE6', fontSize: '14px', fontWeight: 700 }}>{t.name}</div>
                    {t.id === 'vip' && <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ background: '#D4A843', color: '#07060D', letterSpacing: '0.1em' }}>VIP</span>}
                    {t.id === 'guest' && <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ background: '#8B3FFF', color: '#F0EDE6', letterSpacing: '0.1em' }}>FREE</span>}
                  </div>
                  <div style={{ color: t.price === 0 ? '#8B3FFF' : e.color, fontSize: '14px', fontWeight: 900 }}>
                    {t.price === 0 ? 'FREE' : `${t.price.toLocaleString()} EGP`}
                  </div>
                </div>
                <div style={{ color: '#9A98B0', fontSize: '11px', marginBottom: '4px' }}>{t.desc}</div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: t.available > 10 ? '#00E5C8' : '#FF3D6B' }} />
                  <span style={{ color: '#6B6880', fontSize: '10px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em' }}>
                    {t.available > 10 ? `${t.available} LEFT` : t.available === 0 ? 'SOLD OUT' : `ONLY ${t.available} LEFT`}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Quantity */}
          {selectedTier && (
            <div className="p-3 rounded-xl mb-3 flex items-center justify-between" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>Quantity</div>
                <div style={{ color: '#9A98B0', fontSize: '11px' }}>Max 4 per order</div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30"
                  style={{ background: '#07060D', border: '1px solid rgba(212,168,67,0.3)' }}
                  disabled={quantity === 1}
                >
                  <Minus size={14} style={{ color: '#D4A843' }} />
                </button>
                <span style={{ color: '#F0EDE6', fontSize: '16px', fontWeight: 900, minWidth: '20px', textAlign: 'center' }}>{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(4, quantity + 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30"
                  style={{ background: '#07060D', border: '1px solid rgba(212,168,67,0.3)' }}
                  disabled={quantity === 4}
                >
                  <Plus size={14} style={{ color: '#D4A843' }} />
                </button>
              </div>
            </div>
          )}

          {/* Total */}
          {selectedTier && (
            <div className="flex items-center justify-between mb-3 px-1">
              <div style={{ color: '#9A98B0', fontSize: '12px' }}>
                {quantity}× {selectedTier.name}
              </div>
              <div style={{ color: '#F0EDE6', fontSize: '20px', fontWeight: 900, fontFamily: 'Impact, sans-serif' }}>
                {total === 0 ? 'FREE' : `${total.toLocaleString()} EGP`}
              </div>
            </div>
          )}

          <GoldButton onClick={() => setScreen('payment-method')} disabled={!selectedTier}>
            CONTINUE TO PAYMENT <ChevronRight size={16} />
          </GoldButton>
        </div>
      </Frame>
    );
  };

  // SCREEN: Payment method
  const PaymentMethodScreen = () => {
    const total = selectedTier ? selectedTier.price * quantity : 0;
    return (
      <Frame>
        <div className="h-full flex flex-col px-5 pt-12 pb-6">
          <button onClick={goBack} className="self-start mb-4">
            <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
          </button>

          <div style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>
            PAYMENT
          </div>
          <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '32px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', lineHeight: '1', marginBottom: '6px' }}>
            HOW ARE YOU<br/>PAYING?
          </div>
          <div style={{ color: '#9A98B0', fontSize: '13px', marginBottom: '20px' }}>
            Total: <span style={{ color: '#D4A843', fontWeight: 700 }}>{total.toLocaleString()} EGP</span>
          </div>

          <div className="flex flex-col gap-2 mb-4 flex-1">
            {paymentMethods.map(m => (
              <button
                key={m.id}
                onClick={() => setPaymentMethod(m)}
                className="p-3 rounded-xl flex items-center gap-3 transition-all active:scale-[0.98] text-left"
                style={{
                  background: paymentMethod?.id === m.id ? `${m.color}10` : '#10101E',
                  border: `1px solid ${paymentMethod?.id === m.id ? m.color : 'rgba(255,255,255,0.06)'}`
                }}
              >
                <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                  background: `${m.color}20`,
                  border: `1px solid ${m.color}40`
                }}>
                  <m.icon size={18} style={{ color: m.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ color: '#F0EDE6', fontSize: '14px', fontWeight: 700, marginBottom: '2px' }}>{m.name}</div>
                  <div style={{ color: '#9A98B0', fontSize: '11px' }}>{m.desc}</div>
                </div>
                {paymentMethod?.id === m.id && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: m.color }}>
                    <Check size={14} style={{ color: '#07060D' }} strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-3 p-2 rounded-lg" style={{ background: 'rgba(0,229,200,0.05)', border: '1px solid rgba(0,229,200,0.15)' }}>
            <Shield size={12} style={{ color: '#00E5C8', flexShrink: 0 }} />
            <span style={{ color: '#9A98B0', fontSize: '10px', lineHeight: '1.4' }}>
              Your payment is encrypted and secured via industry-standard protocols.
            </span>
          </div>

          <GoldButton 
            onClick={() => {
              if (paymentMethod?.id === 'paymob') setScreen('payment-card');
              else if (paymentMethod?.id === 'vodafone') setScreen('payment-vodafone');
              else if (paymentMethod?.id === 'fawry') setScreen('payment-fawry');
              else { setScreen('processing'); setTimeout(completeOrder, 2000); }
            }} 
            disabled={!paymentMethod}
          >
            CONTINUE <ChevronRight size={16} />
          </GoldButton>
        </div>
      </Frame>
    );
  };

  // SCREEN: Card payment
  const CardPaymentScreen = () => {
    const total = selectedTier ? selectedTier.price * quantity : 0;
    const canPay = cardNumber.length >= 16 && cardName && cardExp.length === 5 && cardCvv.length === 3;
    return (
      <Frame>
        <div className="h-full flex flex-col px-5 pt-12 pb-6">
          <button onClick={goBack} className="self-start mb-4">
            <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
          </button>

          <div style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>
            PAYMOB · CARD PAYMENT
          </div>
          <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '32px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', lineHeight: '1', marginBottom: '20px' }}>
            CARD DETAILS
          </div>

          {/* Virtual card */}
          <div className="relative rounded-2xl p-5 mb-5 overflow-hidden" style={{
            background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
            border: '1px solid rgba(212,168,67,0.3)',
            height: '160px'
          }}>
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #D4A843, transparent 70%)', transform: 'translate(30%, -30%)' }} />
            <div className="flex justify-between items-start mb-8">
              <div style={{ color: '#D4A843', fontSize: '9px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace' }}>
                LAYLA PAY
              </div>
              <div className="flex gap-1">
                <div className="w-6 h-6 rounded-full" style={{ background: '#EB001B' }} />
                <div className="w-6 h-6 rounded-full -ml-3" style={{ background: '#F79E1B', opacity: 0.9 }} />
              </div>
            </div>
            <div style={{ color: '#F0EDE6', fontSize: '18px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em', marginBottom: '16px' }}>
              {cardNumber.padEnd(16, '•').match(/.{1,4}/g)?.join(' ')}
            </div>
            <div className="flex justify-between">
              <div>
                <div style={{ color: '#6B6880', fontSize: '8px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.2em' }}>CARDHOLDER</div>
                <div style={{ color: '#F0EDE6', fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{cardName || 'YOUR NAME'}</div>
              </div>
              <div>
                <div style={{ color: '#6B6880', fontSize: '8px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.2em' }}>EXPIRES</div>
                <div style={{ color: '#F0EDE6', fontSize: '11px', fontFamily: 'ui-monospace, monospace' }}>{cardExp || 'MM/YY'}</div>
              </div>
            </div>
          </div>

          {/* Inputs */}
          <div className="flex-1 flex flex-col gap-3">
            <div>
              <div style={{ color: '#6B6880', fontSize: '9px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>CARD NUMBER</div>
              <input
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ background: '#10101E', border: '1px solid rgba(212,168,67,0.2)', color: '#F0EDE6', fontSize: '14px', fontFamily: 'ui-monospace, monospace' }}
              />
            </div>
            <div>
              <div style={{ color: '#6B6880', fontSize: '9px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>NAME ON CARD</div>
              <input
                value={cardName}
                onChange={e => setCardName(e.target.value.toUpperCase().slice(0, 30))}
                placeholder="YOUR FULL NAME"
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ background: '#10101E', border: '1px solid rgba(212,168,67,0.2)', color: '#F0EDE6', fontSize: '14px' }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div style={{ color: '#6B6880', fontSize: '9px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>EXPIRES</div>
                <input
                  value={cardExp}
                  onChange={e => {
                    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                    if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
                    setCardExp(v);
                  }}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{ background: '#10101E', border: '1px solid rgba(212,168,67,0.2)', color: '#F0EDE6', fontSize: '14px', fontFamily: 'ui-monospace, monospace' }}
                />
              </div>
              <div>
                <div style={{ color: '#6B6880', fontSize: '9px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>CVV</div>
                <input
                  value={cardCvv}
                  onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="123"
                  type="password"
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{ background: '#10101E', border: '1px solid rgba(212,168,67,0.2)', color: '#F0EDE6', fontSize: '14px', fontFamily: 'ui-monospace, monospace' }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <GoldButton 
              onClick={() => { setScreen('processing'); setTimeout(completeOrder, 2200); }}
              disabled={!canPay}
            >
              PAY {total.toLocaleString()} EGP
            </GoldButton>
          </div>
        </div>
      </Frame>
    );
  };

  // SCREEN: Vodafone Cash
  const VodafonePaymentScreen = () => {
    const total = selectedTier ? selectedTier.price * quantity : 0;
    return (
      <Frame>
        <div className="h-full flex flex-col px-5 pt-12 pb-6">
          <button onClick={goBack} className="self-start mb-4">
            <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
          </button>
          <div style={{ color: '#FF3D6B', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>
            VODAFONE CASH
          </div>
          <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '32px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', lineHeight: '1', marginBottom: '20px' }}>
            CONFIRM IN APP
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-28 h-28 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(255,61,107,0.1)', border: '2px solid rgba(255,61,107,0.3)' }}>
              <Smartphone size={48} style={{ color: '#FF3D6B' }} />
            </div>
            <div style={{ color: '#F0EDE6', fontSize: '16px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>
              Push notification sent
            </div>
            <div style={{ color: '#9A98B0', fontSize: '13px', textAlign: 'center', maxWidth: '280px', lineHeight: '1.5', marginBottom: '24px' }}>
              Open your Vodafone Cash app and approve the payment of <span style={{ color: '#FF3D6B', fontWeight: 700 }}>{total.toLocaleString()} EGP</span> to LAYLA.
            </div>

            <div className="p-4 rounded-xl w-full" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex justify-between items-center mb-2">
                <span style={{ color: '#9A98B0', fontSize: '11px' }}>Reference</span>
                <span style={{ color: '#F0EDE6', fontSize: '12px', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>LYL{Date.now().toString().slice(-8)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span style={{ color: '#9A98B0', fontSize: '11px' }}>Amount</span>
                <span style={{ color: '#FF3D6B', fontSize: '13px', fontWeight: 800 }}>{total.toLocaleString()} EGP</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: '#9A98B0', fontSize: '11px' }}>Expires in</span>
                <span style={{ color: '#D4A843', fontSize: '11px', fontFamily: 'ui-monospace, monospace' }}>4:58</span>
              </div>
            </div>
          </div>

          <GoldButton onClick={() => { setScreen('processing'); setTimeout(completeOrder, 2000); }}>
            I'VE PAID — CONFIRM
          </GoldButton>
        </div>
      </Frame>
    );
  };

  // SCREEN: Fawry
  const FawryPaymentScreen = () => {
    const total = selectedTier ? selectedTier.price * quantity : 0;
    const ref = `LYL${Date.now().toString().slice(-8)}`;
    return (
      <Frame>
        <div className="h-full flex flex-col px-5 pt-12 pb-6">
          <button onClick={goBack} className="self-start mb-4">
            <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
          </button>
          <div style={{ color: '#FF3D6B', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>
            FAWRY PAY · CASH
          </div>
          <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '32px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', lineHeight: '1', marginBottom: '20px' }}>
            YOUR CODE
          </div>

          <div className="flex-1 flex flex-col items-center">
            <div className="p-6 rounded-2xl w-full mb-5" style={{ background: 'linear-gradient(135deg, #FF3D6B, #8B3FFF)', textAlign: 'center' }}>
              <div style={{ color: 'rgba(7,6,13,0.7)', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px', fontWeight: 700 }}>
                REFERENCE CODE
              </div>
              <div style={{ color: '#07060D', fontSize: '38px', fontWeight: 900, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.05em' }}>
                {ref}
              </div>
              <div style={{ color: '#07060D', fontSize: '12px', marginTop: '8px', fontWeight: 700 }}>
                Amount: {total.toLocaleString()} EGP
              </div>
            </div>

            <div className="w-full">
              <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '10px' }}>HOW TO PAY</div>
              <div className="flex flex-col gap-2">
                {[
                  'Visit any Fawry outlet (supermarkets, pharmacies, kiosks)',
                  'Give the cashier your reference code',
                  'Pay the exact amount in cash',
                  'Your tickets will be activated automatically',
                ].map((step, i) => (
                  <div key={i} className="flex gap-3 p-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,168,67,0.15)', color: '#D4A843', fontSize: '11px', fontWeight: 900 }}>
                      {i + 1}
                    </div>
                    <div style={{ color: '#F0EDE6', fontSize: '12px', lineHeight: '1.4' }}>{step}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 p-2 rounded-lg mb-3" style={{ background: 'rgba(212,168,67,0.05)', border: '1px solid rgba(212,168,67,0.15)' }}>
            <Clock size={12} style={{ color: '#D4A843', flexShrink: 0 }} />
            <span style={{ color: '#9A98B0', fontSize: '10px' }}>
              Code valid for 48 hours. Tickets issued on payment confirmation.
            </span>
          </div>

          <GoldButton onClick={() => { setScreen('processing'); setTimeout(completeOrder, 2000); }}>
            I'LL PAY AT FAWRY — HOLD TICKETS
          </GoldButton>
        </div>
      </Frame>
    );
  };

  // SCREEN: Processing
  const ProcessingScreen = () => (
    <Frame>
      <div className="h-full flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{
          background: 'rgba(212,168,67,0.1)',
          border: '2px solid rgba(212,168,67,0.3)',
          animation: 'spin 1.5s linear infinite'
        }}>
          <div className="w-12 h-12 rounded-full border-t-2 border-r-2" style={{ borderColor: '#D4A843', animation: 'spin 1s linear infinite' }} />
        </div>
        <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '28px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', marginBottom: '8px' }}>
          PROCESSING...
        </div>
        <div style={{ color: '#9A98B0', fontSize: '13px', textAlign: 'center' }}>
          Securing your spot at {selectedEvent?.name}
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Frame>
  );

  // SCREEN: Success
  const SuccessScreen = () => {
    const latestTicket = myTickets[myTickets.length - 1];
    return (
      <Frame>
        <div className="h-full flex flex-col px-6 pt-12 pb-6">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{
              background: 'linear-gradient(135deg, #00E5C8, #D4A843)',
            }}>
              <Check size={40} style={{ color: '#07060D' }} strokeWidth={3} />
            </div>
            <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '36px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', textAlign: 'center', lineHeight: '1', marginBottom: '12px' }}>
              YOU'RE<br/>IN! 🎉
            </div>
            <div style={{ color: '#9A98B0', fontSize: '14px', textAlign: 'center', maxWidth: '280px', marginBottom: '28px' }}>
              Your tickets are ready. See you at <span style={{ color: '#D4A843', fontWeight: 700 }}>{selectedEvent?.name}</span>.
            </div>

            {latestTicket && (
              <div className="w-full p-4 rounded-xl" style={{ background: '#10101E', border: '1px solid rgba(212,168,67,0.3)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: selectedEvent?.gradient }}>
                    <Ticket size={18} style={{ color: '#07060D' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>{selectedEvent?.name}</div>
                    <div style={{ color: '#9A98B0', fontSize: '11px' }}>
                      {quantity}× {selectedTier?.name} · {latestTicket.id}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <GoldButton onClick={() => { setQrTicket(latestTicket); setScreen('ticket-qr'); }}>
              VIEW TICKET <QrCode size={16} />
            </GoldButton>
            <button 
              onClick={() => { 
                setScreen('discover'); 
                setSelectedEvent(null); 
                setSelectedTier(null); 
                setQuantity(1); 
                setPaymentMethod(null);
                setCardNumber(''); setCardName(''); setCardExp(''); setCardCvv('');
              }} 
              className="w-full py-3 rounded-xl text-sm" 
              style={{ background: 'transparent', color: '#9A98B0', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Browse more events
            </button>
          </div>
        </div>
      </Frame>
    );
  };

  // SCREEN: My Tickets
  const MyTicketsScreen = () => (
    <Frame>
      <div className="h-full flex flex-col px-5 pt-12 pb-6">
        <button onClick={() => setScreen('discover')} className="self-start mb-4">
          <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
        </button>

        <div style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>
          YOUR WALLET
        </div>
        <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '36px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', lineHeight: '1', marginBottom: '20px' }}>
          MY TICKETS
        </div>

        {myTickets.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.2)' }}>
              <Ticket size={32} style={{ color: '#D4A843' }} />
            </div>
            <div style={{ color: '#F0EDE6', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>
              No tickets yet
            </div>
            <div style={{ color: '#9A98B0', fontSize: '13px', textAlign: 'center', marginBottom: '24px' }}>
              Your tickets will appear here after purchase
            </div>
            <button 
              onClick={() => setScreen('discover')}
              className="px-5 py-2 rounded-full text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #D4A843, #F0C96A)', color: '#07060D', letterSpacing: '0.1em' }}
            >
              DISCOVER EVENTS
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col gap-3">
            {myTickets.map(t => (
              <button
                key={t.id}
                onClick={() => { setQrTicket(t); setScreen('ticket-qr'); }}
                className="p-0 rounded-2xl overflow-hidden text-left active:scale-[0.98] transition-transform"
                style={{ background: t.event.gradient }}
              >
                <div className="p-4" style={{ background: 'rgba(7,6,13,0.3)', backdropFilter: 'blur(2px)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div style={{ color: 'rgba(7,6,13,0.7)', fontSize: '9px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '4px' }}>
                        {t.event.cityName.toUpperCase()} · {t.event.date.toUpperCase()}
                      </div>
                      <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '22px', color: '#07060D', fontWeight: 900, lineHeight: '1', letterSpacing: '0.02em' }}>
                        {t.event.name.toUpperCase()}
                      </div>
                      <div style={{ color: '#07060D', fontSize: '11px', opacity: 0.8, marginTop: '2px', fontWeight: 600 }}>
                        {t.event.venue}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div style={{ color: '#07060D', fontSize: '10px', letterSpacing: '0.15em', fontWeight: 800 }}>
                        {t.quantity}× {t.tier.name.toUpperCase()}
                      </div>
                      <div style={{ color: 'rgba(7,6,13,0.7)', fontSize: '9px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em' }}>
                        #{t.id}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-dashed" style={{ borderColor: 'rgba(7,6,13,0.3)', paddingTop: '10px' }}>
                    <div className="flex items-center justify-between">
                      <span style={{ color: 'rgba(7,6,13,0.7)', fontSize: '10px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.15em', fontWeight: 700 }}>
                        TAP TO VIEW QR →
                      </span>
                      <QrCode size={18} style={{ color: '#07060D' }} />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Frame>
  );

  // SCREEN: QR ticket
  const QrTicketScreen = () => {
    if (!qrTicket) return null;
    const t = qrTicket;
    // QR regenerates with refresh count — simulating rotating codes
    const seed = qrRefreshCount;
    const rand = (i, j) => {
      const x = Math.sin((i * 31 + j * 7 + seed * 13)) * 10000;
      return (x - Math.floor(x)) > 0.5 ? 1 : 0;
    };
    const qrGrid = Array(21).fill(0).map((_, i) => Array(21).fill(0).map((_, j) => rand(i, j)));
    // Add finder patterns (fixed)
    for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) {
      const isRing = (i === 0 || i === 6 || j === 0 || j === 6) || (i >= 2 && i <= 4 && j >= 2 && j <= 4);
      qrGrid[i][j] = isRing ? 1 : 0;
      qrGrid[i][20-j] = isRing ? 1 : 0;
      qrGrid[20-i][j] = isRing ? 1 : 0;
    }

    return (
      <Frame>
        <div 
          className="h-full flex flex-col px-5 pt-12 pb-6"
          style={{ userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
          onContextMenu={(e) => { e.preventDefault(); setScreenshotBlocked(true); setTimeout(() => setScreenshotBlocked(false), 3000); }}
        >
          <div className="flex items-center justify-between mb-4">
            <button onClick={goBack}>
              <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
            </button>
            <button
              onClick={() => setSecureMode(!secureMode)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{
                background: secureMode ? 'rgba(0,229,200,0.1)' : 'rgba(255,61,107,0.1)',
                border: `1px solid ${secureMode ? 'rgba(0,229,200,0.3)' : 'rgba(255,61,107,0.3)'}`
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: secureMode ? '#00E5C8' : '#FF3D6B' }} />
              <span style={{ color: secureMode ? '#00E5C8' : '#FF3D6B', fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>
                {secureMode ? 'SECURE' : 'EXPOSED'}
              </span>
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center relative">
            {/* Screenshot blocked overlay */}
            {screenshotBlocked && (
              <div 
                className="absolute inset-0 z-40 flex flex-col items-center justify-center rounded-2xl"
                style={{ 
                  background: 'rgba(7,6,13,0.96)', 
                  backdropFilter: 'blur(20px)',
                  border: '2px solid #FF3D6B',
                  animation: 'pulse-red 0.6s ease-out'
                }}
              >
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{
                  background: 'rgba(255,61,107,0.15)',
                  border: '2px solid #FF3D6B'
                }}>
                  <ShieldAlert size={36} style={{ color: '#FF3D6B' }} />
                </div>
                <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '26px', color: '#FF3D6B', fontWeight: 900, letterSpacing: '0.05em', marginBottom: '8px', textAlign: 'center' }}>
                  SCREENSHOT<br/>BLOCKED
                </div>
                <div style={{ color: '#F0EDE6', fontSize: '12px', textAlign: 'center', maxWidth: '260px', lineHeight: '1.5', padding: '0 20px' }}>
                  This ticket is protected. Capture attempts are logged and invalidated.
                </div>
                <div className="mt-4 px-3 py-1 rounded" style={{ background: 'rgba(255,61,107,0.1)' }}>
                  <span style={{ color: '#FF3D6B', fontSize: '9px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>
                    EVENT: CAPTURE_ATTEMPT · LOGGED
                  </span>
                </div>
              </div>
            )}

            {/* Ticket stub */}
            <div 
              className="w-full rounded-2xl overflow-hidden transition-all" 
              style={{ 
                background: t.event.gradient,
                filter: screenshotBlocked ? 'blur(12px)' : 'none'
              }}
            >
              {/* Header */}
              <div className="p-4" style={{ background: 'rgba(7,6,13,0.2)' }}>
                <div className="flex items-center justify-between mb-1">
                  <div style={{ color: 'rgba(7,6,13,0.7)', fontSize: '9px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>
                    LAYLA · ENTRY PASS
                  </div>
                  <Lock size={11} style={{ color: '#07060D' }} />
                </div>
                <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '22px', color: '#07060D', fontWeight: 900, lineHeight: '1' }}>
                  {t.event.name.toUpperCase()}
                </div>
                <div style={{ color: '#07060D', fontSize: '11px', opacity: 0.8, fontWeight: 600, marginTop: '2px' }}>
                  {t.event.venue} · {t.event.cityName}
                </div>
              </div>

              {/* QR */}
              <div className="bg-white p-5 flex flex-col items-center relative" style={{ borderTop: '2px dashed #07060D20', borderBottom: '2px dashed #07060D20' }}>
                {/* Rotation indicator */}
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00E5C8' }} />
                  <span style={{ color: '#07060D', fontSize: '8px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.15em', fontWeight: 700 }}>
                    LIVE · ROTATES 60s
                  </span>
                </div>
                <div className="relative mb-3 mt-3">
                  <svg width="180" height="180" viewBox="0 0 21 21" style={{ imageRendering: 'pixelated' }}>
                    {qrGrid.map((row, i) => row.map((v, j) => v ? <rect key={`${i}-${j}`} x={j} y={i} width="1" height="1" fill="#07060D" /> : null))}
                  </svg>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#07060D' }}>
                    <span style={{ fontFamily: 'Impact, sans-serif', color: '#D4A843', fontSize: '14px', fontWeight: 900, letterSpacing: '0.02em' }}>LYL</span>
                  </div>
                </div>
                <div style={{ color: '#07060D', fontSize: '11px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.15em', fontWeight: 700 }}>
                  {t.id}
                </div>
                <div style={{ color: '#07060D60', fontSize: '9px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em', marginTop: '2px' }}>
                  REFRESH #{qrRefreshCount.toString().padStart(3, '0')}
                </div>
              </div>

              {/* Details */}
              <div className="p-4 grid grid-cols-2 gap-3" style={{ background: 'rgba(7,6,13,0.2)' }}>
                <div>
                  <div style={{ color: 'rgba(7,6,13,0.6)', fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>DATE</div>
                  <div style={{ color: '#07060D', fontSize: '13px', fontWeight: 800 }}>{t.event.date}</div>
                </div>
                <div>
                  <div style={{ color: 'rgba(7,6,13,0.6)', fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>TIME</div>
                  <div style={{ color: '#07060D', fontSize: '13px', fontWeight: 800 }}>{t.event.time}</div>
                </div>
                <div>
                  <div style={{ color: 'rgba(7,6,13,0.6)', fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>TIER</div>
                  <div style={{ color: '#07060D', fontSize: '13px', fontWeight: 800 }}>{t.tier.name}</div>
                </div>
                <div>
                  <div style={{ color: 'rgba(7,6,13,0.6)', fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>QTY</div>
                  <div style={{ color: '#07060D', fontSize: '13px', fontWeight: 800 }}>{t.quantity}</div>
                </div>
              </div>
            </div>

            {/* Security details */}
            <div className="w-full mt-4 p-3 rounded-xl" style={{ background: 'rgba(0,229,200,0.05)', border: '1px solid rgba(0,229,200,0.2)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Shield size={14} style={{ color: '#00E5C8' }} />
                <span style={{ color: '#00E5C8', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', fontFamily: 'ui-monospace, monospace' }}>
                  SCREENSHOT PROTECTED
                </span>
              </div>
              <div style={{ color: '#9A98B0', fontSize: '10px', lineHeight: '1.5' }}>
                Device screen capture is disabled. QR rotates every 60 seconds. Only live, on-device codes work at the door.
              </div>
            </div>

            {/* Demo test button */}
            <button
              onClick={() => { setScreenshotBlocked(true); setTimeout(() => setScreenshotBlocked(false), 3000); }}
              className="mt-3 text-[10px] px-3 py-1.5 rounded-full"
              style={{ color: '#6B6880', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.15em' }}
            >
              ▸ SIMULATE CAPTURE ATTEMPT
            </button>
          </div>

          <style>{`
            @keyframes pulse-red {
              0% { transform: scale(0.96); opacity: 0; }
              50% { transform: scale(1.02); }
              100% { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      </Frame>
    );
  };

  const screens = {
    'discover': DiscoverScreen,
    'event-detail': EventDetailScreen,
    'ticket-select': TicketSelectScreen,
    'payment-method': PaymentMethodScreen,
    'payment-card': CardPaymentScreen,
    'payment-vodafone': VodafonePaymentScreen,
    'payment-fawry': FawryPaymentScreen,
    'processing': ProcessingScreen,
    'success': SuccessScreen,
    'my-tickets': MyTicketsScreen,
    'ticket-qr': QrTicketScreen,
  };

  const CurrentScreen = screens[screen];
  const flowLabel = {
    'discover': 'Discover Feed',
    'event-detail': 'Event Detail',
    'ticket-select': 'Select Tier',
    'payment-method': 'Payment Method',
    'payment-card': 'Card Payment',
    'payment-vodafone': 'Vodafone Cash',
    'payment-fawry': 'Fawry Cash',
    'processing': 'Processing',
    'success': 'Success',
    'my-tickets': 'My Wallet',
    'ticket-qr': 'QR Ticket',
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4" style={{ background: '#0A0910' }}>
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
          PHASE 02 · EVENTS & TICKETS
        </div>
        <div style={{ color: '#6B6880', fontSize: '11px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginTop: '4px' }}>
          LAYLA · CAIRO · SAHEL · GOUNA
        </div>
      </div>

      <div className="flex gap-8 items-start flex-wrap justify-center">
        {/* Phone */}
        <div className="relative" style={{ width: '340px', height: '700px' }}>
          <div className="absolute inset-0 rounded-[44px] overflow-hidden" style={{
            background: '#000',
            padding: '10px',
            boxShadow: '0 40px 80px rgba(212,168,67,0.15), 0 0 0 2px #1a1a22, 0 0 0 3px #333'
          }}>
            <div className="w-full h-full rounded-[36px] overflow-hidden relative">
              <CurrentScreen />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 rounded-b-2xl z-50" style={{ background: '#000' }} />
            </div>
          </div>
        </div>

        {/* Flow navigator */}
        <div className="w-72 p-4 rounded-2xl" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ color: '#D4A843', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '12px' }}>
            ⚡ JUMP TO SCREEN
          </div>
          <div className="flex flex-col gap-1">
            {Object.keys(screens).map((s, i) => (
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
                <span style={{ fontWeight: screen === s ? 700 : 500 }}>
                  {String(i + 1).padStart(2, '0')} · {flowLabel[s]}
                </span>
                {screen === s && <ChevronRight size={12} />}
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>
              DEMO TIP
            </div>
            <div style={{ color: '#9A98B0', fontSize: '11px', lineHeight: '1.5' }}>
              Start at <span style={{ color: '#D4A843' }}>Discover</span> → tap a card → pick a tier → try each payment method 💳
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
