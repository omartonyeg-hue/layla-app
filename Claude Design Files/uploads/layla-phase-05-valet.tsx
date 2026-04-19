import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Navigation, Shield, ShieldAlert, Phone, MessageCircle, Car, Clock, Star, Check, X, AlertTriangle, Home, Users, Lock, Camera, Share2, ChevronUp, Info, Zap, Sparkles, UserCheck, Heart, DollarSign, ArrowRight, Wifi, Bluetooth, Battery } from 'lucide-react';

export default function LaylaValet() {
  const [screen, setScreen] = useState('home');
  const [carInfo, setCarInfo] = useState({ make: 'Hyundai', model: 'Elantra', plate: 'ص ب ط 1234', color: 'Silver' });
  const [destination, setDestination] = useState('Home · Zamalek');
  const [emergencyContacts, setEmergencyContacts] = useState(['Mom', 'Karim A.']);
  const [searchProgress, setSearchProgress] = useState(0);
  const [driverEta, setDriverEta] = useState(8);
  const [tripProgress, setTripProgress] = useState(0);
  const [showSOS, setShowSOS] = useState(false);
  const [locationShared, setLocationShared] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingTags, setRatingTags] = useState([]);

  // Animated search progress
  useEffect(() => {
    if (screen !== 'finding') return;
    const timer = setInterval(() => {
      setSearchProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => setScreen('assigned'), 500);
          return 100;
        }
        return p + 4;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [screen]);

  // Animated driver ETA countdown
  useEffect(() => {
    if (screen !== 'tracking-pickup') return;
    const timer = setInterval(() => {
      setDriverEta(e => Math.max(0, e - 1));
    }, 1200);
    return () => clearInterval(timer);
  }, [screen]);

  // Trip progress animation
  useEffect(() => {
    if (screen !== 'on-trip') return;
    const timer = setInterval(() => {
      setTripProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          return 100;
        }
        return p + 1.5;
      });
    }, 300);
    return () => clearInterval(timer);
  }, [screen]);

  // DATA
  const driver = {
    name: 'Mahmoud H.',
    rating: 4.97,
    trips: 847,
    verified: true,
    photo: '#D4A843',
    vehicle: 'Honda 125 scooter',
    languages: ['Arabic', 'English'],
    years: 3,
  };

  const pricing = {
    base: 150,
    distance: 5.8,
    perKm: 8,
    surge: 1.3,
    get subtotal() { return Math.round(this.base + (this.distance * this.perKm)); },
    get total() { return Math.round(this.subtotal * this.surge); }
  };

  const ratingTagOptions = ['Smooth driver', 'Felt safe', 'Friendly', 'On time', 'Professional', 'Careful with car', 'Clean & respectful', 'Would book again'];

  // HELPERS
  const Frame = ({ children, bg = '#07060D', showStatus = true }) => (
    <div className="relative w-full h-full overflow-hidden" style={{ background: bg }}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
      />
      {showStatus && (
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 pt-3 pb-1 z-40" style={{ fontSize: '12px', color: '#F0EDE6', fontFamily: 'ui-monospace, monospace' }}>
          <span className="font-semibold">2:34 AM</span>
          <span className="flex items-center gap-1"><span>●●●</span><span>47%</span></span>
        </div>
      )}
      {children}
    </div>
  );

  const VerifiedBadge = ({ size = 12 }) => (
    <div className="inline-flex items-center justify-center rounded-full" style={{
      background: 'linear-gradient(135deg, #00E5C8, #D4A843)',
      width: size + 4, height: size + 4
    }}>
      <Check size={size - 4} style={{ color: '#07060D' }} strokeWidth={4} />
    </div>
  );

  const CyanButton = ({ children, onClick, disabled, variant = 'cyan' }) => (
    <button onClick={onClick} disabled={disabled}
      className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-30"
      style={{
        background: !disabled ? (variant === 'gold' ? 'linear-gradient(135deg, #D4A843, #F0C96A)' : 'linear-gradient(135deg, #00E5C8, #D4A843)') : '#10101E',
        color: !disabled ? '#07060D' : '#6B6880',
        fontSize: '14px', letterSpacing: '0.15em',
        border: disabled ? '1px solid rgba(255,255,255,0.06)' : 'none'
      }}>
      {children}
    </button>
  );

  // REUSABLE: Map component
  const LiveMap = ({ height = 300, showDriver = true, showUser = true, showRoute = true, driverPos = { top: '25%', left: '30%' }, userPos = { top: '60%', left: '55%' }, progress = 0 }) => (
    <div className="relative rounded-2xl overflow-hidden" style={{
      background: 'linear-gradient(180deg, #0A1020 0%, #10101E 100%)',
      height: `${height}px`,
      border: '1px solid rgba(0,229,200,0.15)'
    }}>
      {/* Grid */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.12 }}>
        <defs>
          <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00E5C8" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mapgrid)" />
      </svg>

      {/* Roads */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.25 }}>
        <path d="M -10 150 Q 100 80 200 180 T 400 160" stroke="#D4A843" strokeWidth="2" fill="none" />
        <path d="M 150 -10 Q 180 100 120 200 T 100 400" stroke="#D4A843" strokeWidth="1.5" fill="none" />
        <path d="M 0 220 L 340 240" stroke="#D4A843" strokeWidth="1" fill="none" />
        <path d="M 280 0 Q 240 150 300 300" stroke="#D4A843" strokeWidth="1.5" fill="none" />
      </svg>

      {/* Route line (animated) */}
      {showRoute && (
        <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5C8" />
              <stop offset="100%" stopColor="#D4A843" />
            </linearGradient>
          </defs>
          <path 
            d={`M ${parseInt(driverPos.left)}% ${parseInt(driverPos.top)}% Q ${(parseInt(driverPos.left) + parseInt(userPos.left)) / 2}% ${(parseInt(driverPos.top) + parseInt(userPos.top)) / 2 - 10}% ${parseInt(userPos.left)}% ${parseInt(userPos.top)}%`}
            stroke="url(#routeGrad)" 
            strokeWidth="3" 
            fill="none"
            strokeDasharray="6 4"
            strokeLinecap="round"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1s" repeatCount="indefinite" />
          </path>
        </svg>
      )}

      {/* Driver pin */}
      {showDriver && (
        <div className="absolute" style={driverPos}>
          <div className="relative -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-0 rounded-full animate-ping" style={{ background: '#00E5C8', width: '32px', height: '32px', opacity: 0.4, top: '-4px', left: '-4px' }} />
            <div className="w-10 h-10 rounded-full flex items-center justify-center relative" style={{ 
              background: '#00E5C8',
              boxShadow: '0 0 20px rgba(0,229,200,0.6)',
              border: '2px solid #07060D'
            }}>
              <Car size={16} style={{ color: '#07060D' }} />
            </div>
          </div>
        </div>
      )}

      {/* User pin */}
      {showUser && (
        <div className="absolute" style={userPos}>
          <div className="relative -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ 
              background: 'linear-gradient(135deg, #D4A843, #FF3D6B)',
              boxShadow: '0 0 20px rgba(212,168,67,0.6)',
              border: '2px solid #07060D'
            }}>
              <div className="w-2 h-2 rounded-full" style={{ background: '#07060D' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ============ SCREENS ============

  // SCREEN: Home / Order
  const HomeScreen = () => (
    <Frame>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-5 pt-12 pb-3 flex items-center justify-between">
          <button><ChevronLeft size={24} style={{ color: '#F0EDE6' }} /></button>
          <div className="text-center">
            <div style={{ color: '#00E5C8', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>
              🛡️ SAFE RIDE
            </div>
            <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '18px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.04em' }}>
              LAYLA VALET
            </div>
          </div>
          <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Info size={14} style={{ color: '#F0EDE6' }} />
          </button>
        </div>

        {/* Hero */}
        <div className="px-5">
          <div className="relative p-5 rounded-3xl mb-4 overflow-hidden" style={{
            background: 'linear-gradient(135deg, #00E5C8 0%, #D4A843 100%)',
          }}>
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4), transparent 50%)'
            }} />
            <div className="relative z-10">
              <div style={{ color: 'rgba(7,6,13,0.7)', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '6px' }}>
                HAD A FEW TONIGHT?
              </div>
              <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '32px', color: '#07060D', fontWeight: 900, lineHeight: '1', letterSpacing: '0.02em', marginBottom: '8px' }}>
                WE'LL DRIVE<br/>YOU HOME.
              </div>
              <div style={{ color: 'rgba(7,6,13,0.8)', fontSize: '12px', fontWeight: 600, marginBottom: '14px' }}>
                A trained valet gets you and your car safely home.
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(7,6,13,0.2)', backdropFilter: 'blur(8px)' }}>
                  <Clock size={10} style={{ color: '#07060D' }} />
                  <span style={{ color: '#07060D', fontSize: '10px', fontWeight: 800, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.15em' }}>~8 MIN</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(7,6,13,0.2)', backdropFilter: 'blur(8px)' }}>
                  <Shield size={10} style={{ color: '#07060D' }} />
                  <span style={{ color: '#07060D', fontSize: '10px', fontWeight: 800, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.15em' }}>INSURED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-3">
          {/* Route */}
          <div className="rounded-2xl p-4 mb-3" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex gap-3">
              <div className="flex flex-col items-center pt-1">
                <div className="w-3 h-3 rounded-full" style={{ background: '#00E5C8', boxShadow: '0 0 10px #00E5C8' }} />
                <div className="w-0.5 flex-1 my-1" style={{ background: 'linear-gradient(180deg, #00E5C8, #D4A843)' }} />
                <div className="w-3 h-3 rounded-sm" style={{ background: '#D4A843', boxShadow: '0 0 10px #D4A843' }} />
              </div>
              <div className="flex-1">
                <div>
                  <div style={{ color: '#6B6880', fontSize: '9px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>PICKUP</div>
                  <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>Cairo Jazz Club</div>
                  <div style={{ color: '#9A98B0', fontSize: '11px' }}>26 July St, Zamalek</div>
                </div>
                <div className="my-3" style={{ borderTop: '1px dashed rgba(255,255,255,0.1)' }} />
                <div>
                  <div style={{ color: '#6B6880', fontSize: '9px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>DESTINATION</div>
                  <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>{destination}</div>
                  <div style={{ color: '#9A98B0', fontSize: '11px' }}>Saved · 5.8 km away</div>
                </div>
              </div>
            </div>
          </div>

          {/* Car info */}
          <button onClick={() => setScreen('car-info')} className="w-full rounded-2xl p-3 mb-3 flex items-center gap-3" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.3)' }}>
              <Car size={18} style={{ color: '#D4A843' }} />
            </div>
            <div className="flex-1 text-left">
              <div style={{ color: '#D4A843', fontSize: '9px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>YOUR CAR</div>
              <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>{carInfo.make} {carInfo.model}</div>
              <div style={{ color: '#9A98B0', fontSize: '11px', fontFamily: 'ui-monospace, monospace' }}>{carInfo.color} · {carInfo.plate}</div>
            </div>
            <ChevronRight size={14} style={{ color: '#6B6880' }} />
          </button>

          {/* Price */}
          <div className="rounded-2xl p-3 mb-3" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-2">
              <div style={{ color: '#6B6880', fontSize: '9px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>ESTIMATED FARE</div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,61,107,0.15)' }}>
                <Zap size={9} style={{ color: '#FF3D6B' }} />
                <span style={{ color: '#FF3D6B', fontSize: '9px', letterSpacing: '0.15em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>1.3× LATE NIGHT</span>
              </div>
            </div>
            <div style={{ color: '#F0EDE6', fontFamily: 'Impact, sans-serif', fontSize: '36px', fontWeight: 900, letterSpacing: '0.02em', lineHeight: '1' }}>
              {pricing.total} <span style={{ fontSize: '14px', color: '#9A98B0' }}>EGP</span>
            </div>
            <div style={{ color: '#9A98B0', fontSize: '11px', marginTop: '4px' }}>
              Base {pricing.base} · {pricing.distance}km × {pricing.perKm} EGP · 30% surge
            </div>
          </div>

          {/* Safety features */}
          <div className="p-3 rounded-xl mb-3" style={{ background: 'rgba(0,229,200,0.04)', border: '1px solid rgba(0,229,200,0.2)' }}>
            <div style={{ color: '#00E5C8', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '8px' }}>
              🛡️ INCLUDED
            </div>
            <div className="flex flex-col gap-1.5">
              {[
                { icon: UserCheck, text: 'Verified, trained valet' },
                { icon: Shield, text: 'Full insurance coverage' },
                { icon: Share2, text: 'Live location with contacts' },
                { icon: ShieldAlert, text: 'One-tap SOS during trip' },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <f.icon size={12} style={{ color: '#00E5C8' }} />
                  <span style={{ color: '#F0EDE6', fontSize: '11px' }}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom action */}
        <div className="px-5 pt-2 pb-5">
          <CyanButton onClick={() => setScreen('confirm')}>
            ORDER VALET NOW <ArrowRight size={16} />
          </CyanButton>
        </div>
      </div>
    </Frame>
  );

  // SCREEN: Car Info
  const CarInfoScreen = () => (
    <Frame>
      <div className="h-full flex flex-col px-5 pt-12 pb-6">
        <button onClick={() => setScreen('home')} className="self-start mb-4">
          <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
        </button>

        <div style={{ color: '#00E5C8', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>
          YOUR VEHICLE
        </div>
        <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '32px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', lineHeight: '1', marginBottom: '6px' }}>
          WHAT ARE WE<br/>DRIVING?
        </div>
        <div style={{ color: '#9A98B0', fontSize: '13px', marginBottom: '24px' }}>
          Helps your valet find your car quickly.
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>MAKE</div>
              <input
                value={carInfo.make}
                onChange={e => setCarInfo({ ...carInfo, make: e.target.value })}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ background: '#10101E', border: '1px solid rgba(0,229,200,0.2)', color: '#F0EDE6', fontSize: '14px' }}
              />
            </div>
            <div>
              <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>MODEL</div>
              <input
                value={carInfo.model}
                onChange={e => setCarInfo({ ...carInfo, model: e.target.value })}
                className="w-full px-4 py-3 rounded-xl outline-none"
                style={{ background: '#10101E', border: '1px solid rgba(0,229,200,0.2)', color: '#F0EDE6', fontSize: '14px' }}
              />
            </div>
          </div>

          <div>
            <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>COLOR</div>
            <div className="flex gap-2 flex-wrap">
              {['Silver', 'Black', 'White', 'Red', 'Blue', 'Gray'].map(c => (
                <button key={c} onClick={() => setCarInfo({ ...carInfo, color: c })} className="px-3 py-1.5 rounded-full text-xs transition-all" style={{
                  background: carInfo.color === c ? 'linear-gradient(135deg, #00E5C8, #D4A843)' : 'rgba(255,255,255,0.04)',
                  color: carInfo.color === c ? '#07060D' : '#9A98B0',
                  border: carInfo.color === c ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  fontWeight: carInfo.color === c ? 700 : 500
                }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>LICENSE PLATE</div>
            <input
              value={carInfo.plate}
              onChange={e => setCarInfo({ ...carInfo, plate: e.target.value })}
              className="w-full px-4 py-3 rounded-xl outline-none"
              style={{ background: '#10101E', border: '1px solid rgba(0,229,200,0.2)', color: '#F0EDE6', fontSize: '16px', fontFamily: 'ui-monospace, monospace', fontWeight: 700, textAlign: 'center', letterSpacing: '0.1em' }}
            />
            <div style={{ color: '#6B6880', fontSize: '10px', marginTop: '4px', textAlign: 'center' }}>
              Egyptian or Arabic format
            </div>
          </div>

          {/* Photo upload */}
          <button className="p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(212,168,67,0.04)', border: '1px dashed rgba(212,168,67,0.3)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,168,67,0.15)' }}>
              <Camera size={16} style={{ color: '#D4A843' }} />
            </div>
            <div className="flex-1 text-left">
              <div style={{ color: '#F0EDE6', fontSize: '12px', fontWeight: 700 }}>Add a photo (optional)</div>
              <div style={{ color: '#9A98B0', fontSize: '10px' }}>Makes your car easier to spot</div>
            </div>
            <ChevronRight size={14} style={{ color: '#6B6880' }} />
          </button>
        </div>

        <CyanButton onClick={() => setScreen('home')}>SAVE CAR DETAILS</CyanButton>
      </div>
    </Frame>
  );

  // SCREEN: Confirm
  const ConfirmScreen = () => (
    <Frame>
      <div className="h-full flex flex-col px-5 pt-12 pb-6">
        <button onClick={() => setScreen('home')} className="self-start mb-4">
          <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
        </button>

        <div style={{ color: '#00E5C8', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>
          CONFIRM YOUR RIDE
        </div>
        <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '30px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', lineHeight: '1', marginBottom: '20px' }}>
          ONE MORE CHECK.
        </div>

        <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
          {/* Trip summary */}
          <div className="rounded-2xl p-3" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex gap-3">
              <div className="flex flex-col items-center pt-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#00E5C8' }} />
                <div className="w-0.5 flex-1 my-1" style={{ background: 'rgba(255,255,255,0.1)' }} />
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#D4A843' }} />
              </div>
              <div className="flex-1">
                <div style={{ color: '#F0EDE6', fontSize: '12px', fontWeight: 700 }}>Cairo Jazz Club</div>
                <div style={{ color: '#9A98B0', fontSize: '10px', marginBottom: '12px' }}>Pickup · now</div>
                <div style={{ color: '#F0EDE6', fontSize: '12px', fontWeight: 700 }}>{destination}</div>
                <div style={{ color: '#9A98B0', fontSize: '10px' }}>5.8 km · ~18 min</div>
              </div>
            </div>
          </div>

          {/* Car */}
          <div className="rounded-2xl p-3 flex items-center gap-3" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,168,67,0.15)' }}>
              <Car size={16} style={{ color: '#D4A843' }} />
            </div>
            <div className="flex-1">
              <div style={{ color: '#F0EDE6', fontSize: '12px', fontWeight: 700 }}>{carInfo.color} {carInfo.make} {carInfo.model}</div>
              <div style={{ color: '#9A98B0', fontSize: '10px', fontFamily: 'ui-monospace, monospace' }}>{carInfo.plate}</div>
            </div>
          </div>

          {/* Emergency contacts share */}
          <div className="rounded-2xl p-3" style={{ background: 'rgba(0,229,200,0.04)', border: '1px solid rgba(0,229,200,0.2)' }}>
            <div className="flex items-start gap-3">
              <Share2 size={16} style={{ color: '#00E5C8', marginTop: '2px' }} />
              <div className="flex-1">
                <div style={{ color: '#F0EDE6', fontSize: '12px', fontWeight: 700, marginBottom: '2px' }}>Share trip with your contacts</div>
                <div style={{ color: '#9A98B0', fontSize: '10px', marginBottom: '6px' }}>{emergencyContacts.join(' · ')} will see live location</div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div onClick={() => setLocationShared(!locationShared)} className="w-9 h-5 rounded-full relative transition-all" style={{
                    background: locationShared ? '#00E5C8' : 'rgba(255,255,255,0.1)'
                  }}>
                    <div className="w-4 h-4 rounded-full absolute top-0.5 transition-all" style={{
                      background: locationShared ? '#07060D' : '#6B6880',
                      left: locationShared ? '18px' : '2px'
                    }} />
                  </div>
                  <span style={{ color: locationShared ? '#00E5C8' : '#9A98B0', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', fontFamily: 'ui-monospace, monospace' }}>
                    {locationShared ? 'SHARING ON' : 'ENABLE SHARING'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="rounded-2xl p-3" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ color: '#6B6880', fontSize: '9px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '10px' }}>
              FARE BREAKDOWN
            </div>
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between"><span style={{ color: '#9A98B0' }}>Base fare</span><span style={{ color: '#F0EDE6' }}>{pricing.base} EGP</span></div>
              <div className="flex justify-between"><span style={{ color: '#9A98B0' }}>Distance ({pricing.distance}km × {pricing.perKm})</span><span style={{ color: '#F0EDE6' }}>{pricing.distance * pricing.perKm} EGP</span></div>
              <div className="flex justify-between"><span style={{ color: '#FF3D6B' }}>Late night (1.3×)</span><span style={{ color: '#FF3D6B' }}>+{pricing.total - pricing.subtotal} EGP</span></div>
              <div className="flex justify-between pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: '#F0EDE6', fontWeight: 700 }}>Total</span>
                <span style={{ color: '#D4A843', fontSize: '15px', fontWeight: 800, fontFamily: 'Impact, sans-serif' }}>{pricing.total} EGP</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-2xl p-3 flex items-center gap-3" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,63,255,0.15)' }}>
              <DollarSign size={16} style={{ color: '#8B3FFF' }} />
            </div>
            <div className="flex-1">
              <div style={{ color: '#F0EDE6', fontSize: '12px', fontWeight: 700 }}>Visa •••• 6411</div>
              <div style={{ color: '#9A98B0', fontSize: '10px' }}>Charged after trip</div>
            </div>
            <ChevronRight size={14} style={{ color: '#6B6880' }} />
          </div>
        </div>

        <CyanButton onClick={() => { setSearchProgress(0); setScreen('finding'); }}>
          ORDER FOR {pricing.total} EGP
        </CyanButton>
      </div>
    </Frame>
  );

  // SCREEN: Finding Valet
  const FindingScreen = () => (
    <Frame>
      <div className="h-full flex flex-col items-center justify-center px-6">
        <div className="relative mb-8">
          {/* Radar rings */}
          {[0, 1, 2].map(i => (
            <div key={i} className="absolute rounded-full" style={{
              width: `${160 + i * 40}px`,
              height: `${160 + i * 40}px`,
              top: `${-i * 20}px`, left: `${-i * 20}px`,
              border: '1px solid rgba(0,229,200,0.3)',
              animation: `pulse ${2 + i * 0.5}s ease-out infinite`,
              animationDelay: `${i * 0.5}s`,
              opacity: 0.6 - i * 0.15
            }} />
          ))}
          <div className="w-40 h-40 rounded-full flex items-center justify-center relative" style={{
            background: 'radial-gradient(circle, rgba(0,229,200,0.2), transparent 70%)',
          }}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #00E5C8, #D4A843)',
              boxShadow: '0 0 40px rgba(0,229,200,0.6)'
            }}>
              <Navigation size={36} style={{ color: '#07060D', transform: `rotate(${searchProgress * 3.6}deg)` }} strokeWidth={2} />
            </div>
          </div>
          <style>{`
            @keyframes pulse {
              0% { transform: scale(0.95); opacity: 0.6; }
              100% { transform: scale(1.15); opacity: 0; }
            }
          `}</style>
        </div>

        <div style={{ color: '#00E5C8', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px', fontWeight: 700 }}>
          {searchProgress < 40 ? 'SCANNING NEARBY VALETS' : searchProgress < 80 ? 'MATCHING BEST FIT' : 'ASSIGNING DRIVER'}
        </div>
        <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '32px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', textAlign: 'center', lineHeight: '1', marginBottom: '16px' }}>
          FINDING YOUR<br/>VALET...
        </div>

        {/* Progress */}
        <div className="w-full max-w-xs mb-6">
          <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full rounded-full transition-all" style={{
              background: 'linear-gradient(90deg, #00E5C8, #D4A843)',
              width: `${searchProgress}%`
            }} />
          </div>
          <div className="flex justify-between mt-2">
            <span style={{ color: '#6B6880', fontSize: '10px', fontFamily: 'ui-monospace, monospace' }}>{searchProgress}%</span>
            <span style={{ color: '#9A98B0', fontSize: '10px', fontFamily: 'ui-monospace, monospace' }}>12 verified valets nearby</span>
          </div>
        </div>

        <button onClick={() => setScreen('home')} className="px-4 py-2 rounded-full text-xs" style={{
          background: 'rgba(255,61,107,0.1)',
          color: '#FF3D6B',
          border: '1px solid rgba(255,61,107,0.3)',
          letterSpacing: '0.1em',
          fontWeight: 700
        }}>
          CANCEL REQUEST
        </button>
      </div>
    </Frame>
  );

  // SCREEN: Valet Assigned
  const AssignedScreen = () => (
    <Frame>
      <div className="h-full flex flex-col">
        <div className="px-5 pt-12 pb-3 flex items-center justify-between">
          <button onClick={() => setScreen('home')}>
            <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
          </button>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,229,200,0.1)', border: '1px solid rgba(0,229,200,0.3)' }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00E5C8' }} />
            <span style={{ color: '#00E5C8', fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>
              MATCHED
            </span>
          </div>
          <div className="w-8" />
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-3">
          <div style={{ color: '#00E5C8', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>
            YOUR VALET
          </div>
          <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '28px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', lineHeight: '1', marginBottom: '20px' }}>
            MAHMOUD IS<br/>ON THE WAY.
          </div>

          {/* Driver card */}
          <div className="rounded-2xl overflow-hidden mb-4" style={{ background: '#10101E', border: '1px solid rgba(0,229,200,0.2)' }}>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: driver.photo, border: '2px solid #00E5C8' }}>
                    <span style={{ color: '#07060D', fontFamily: 'Impact, sans-serif', fontSize: '28px', fontWeight: 900 }}>M</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1">
                    <VerifiedBadge size={16} />
                  </div>
                </div>
                <div className="flex-1">
                  <div style={{ color: '#F0EDE6', fontSize: '18px', fontWeight: 800, fontFamily: 'Impact, sans-serif', letterSpacing: '0.02em' }}>{driver.name.toUpperCase()}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-0.5">
                      <Star size={12} style={{ color: '#D4A843' }} fill="#D4A843" />
                      <span style={{ color: '#D4A843', fontSize: '12px', fontWeight: 700 }}>{driver.rating}</span>
                    </div>
                    <span style={{ color: '#6B6880' }}>·</span>
                    <span style={{ color: '#9A98B0', fontSize: '11px' }}>{driver.trips} trips</span>
                  </div>
                  <div className="mt-1 inline-block px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,229,200,0.15)' }}>
                    <span style={{ color: '#00E5C8', fontSize: '9px', letterSpacing: '0.15em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>
                      LAYLA VERIFIED · {driver.years}Y
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ color: '#6B6880', fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>ARRIVING ON</div>
                  <div style={{ color: '#F0EDE6', fontSize: '12px', fontWeight: 700 }}>{driver.vehicle}</div>
                </div>
                <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ color: '#6B6880', fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>SPEAKS</div>
                  <div style={{ color: '#F0EDE6', fontSize: '12px', fontWeight: 700 }}>{driver.languages.join(' · ')}</div>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, rgba(0,229,200,0.1), rgba(212,168,67,0.05))', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div style={{ color: '#00E5C8', fontSize: '9px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>ETA</div>
                <div style={{ color: '#F0EDE6', fontFamily: 'Impact, sans-serif', fontSize: '24px', fontWeight: 900, letterSpacing: '0.02em', lineHeight: '1' }}>
                  ~8 MIN
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#07060D', border: '1px solid rgba(0,229,200,0.3)' }}>
                  <MessageCircle size={16} style={{ color: '#00E5C8' }} />
                </button>
                <button className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#00E5C8' }}>
                  <Phone size={16} style={{ color: '#07060D' }} />
                </button>
              </div>
            </div>
          </div>

          {/* Trust moments */}
          <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>
            HOW WE VETTED MAHMOUD
          </div>
          <div className="flex flex-col gap-1.5 mb-4">
            {[
              { icon: UserCheck, text: 'National ID verified · Face match' },
              { icon: Shield, text: 'Background check · Clean record' },
              { icon: Car, text: "Driver's license validated" },
              { icon: Heart, text: 'Defensive driving certification' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'rgba(0,229,200,0.04)' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,229,200,0.15)' }}>
                  <f.icon size={11} style={{ color: '#00E5C8' }} />
                </div>
                <span style={{ color: '#F0EDE6', fontSize: '11px' }}>{f.text}</span>
                <Check size={11} style={{ color: '#00E5C8', marginLeft: 'auto' }} strokeWidth={3} />
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 pt-2 pb-5">
          <CyanButton onClick={() => { setDriverEta(8); setScreen('tracking-pickup'); }}>
            TRACK LIVE →
          </CyanButton>
        </div>
      </div>
    </Frame>
  );

  // SCREEN: Tracking to pickup
  const TrackingPickupScreen = () => (
    <Frame>
      <div className="h-full flex flex-col">
        {/* Map (takes top portion) */}
        <div className="relative" style={{ height: '55%' }}>
          <div className="absolute top-12 left-4 right-4 z-20 flex items-center justify-between">
            <button onClick={() => setScreen('home')} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(7,6,13,0.7)', backdropFilter: 'blur(10px)' }}>
              <X size={18} style={{ color: '#F0EDE6' }} />
            </button>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,229,200,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,229,200,0.4)' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00E5C8' }} />
              <span style={{ color: '#00E5C8', fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>
                LIVE
              </span>
            </div>
          </div>
          <LiveMap height={400} driverPos={{ top: '30%', left: '30%' }} userPos={{ top: '65%', left: '60%' }} progress={50} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent 60%, #07060D)' }} />
        </div>

        {/* Driver info panel */}
        <div className="flex-1 px-5 pt-3 pb-5" style={{ marginTop: '-20px' }}>
          <div className="rounded-2xl p-4 relative" style={{ background: '#10101E', border: '1px solid rgba(0,229,200,0.3)', boxShadow: '0 -10px 40px rgba(0,229,200,0.1)' }}>
            {/* ETA */}
            <div className="flex items-center justify-between mb-3 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div style={{ color: '#00E5C8', fontSize: '9px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>
                  MAHMOUD ARRIVES IN
                </div>
                <div style={{ color: '#F0EDE6', fontFamily: 'Impact, sans-serif', fontSize: '36px', fontWeight: 900, letterSpacing: '0.02em', lineHeight: '1' }}>
                  {driverEta} <span style={{ fontSize: '16px', color: '#9A98B0' }}>MIN</span>
                </div>
              </div>
              <button onClick={() => setScreen('arrival')} className="px-3 py-2 rounded-lg text-xs font-bold" style={{
                background: 'rgba(0,229,200,0.1)',
                color: '#00E5C8',
                border: '1px solid rgba(0,229,200,0.3)',
                letterSpacing: '0.1em'
              }}>
                ✨ ARRIVE
              </button>
            </div>

            {/* Driver quick */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: driver.photo }}>
                  <span style={{ color: '#07060D', fontFamily: 'Impact, sans-serif', fontSize: '18px', fontWeight: 900 }}>M</span>
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <VerifiedBadge size={10} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>{driver.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={10} style={{ color: '#D4A843' }} fill="#D4A843" />
                  <span style={{ color: '#D4A843', fontSize: '11px', fontWeight: 700 }}>{driver.rating}</span>
                  <span style={{ color: '#6B6880', fontSize: '10px' }}>·</span>
                  <span style={{ color: '#9A98B0', fontSize: '10px' }}>{driver.vehicle}</span>
                </div>
              </div>
              <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#07060D', border: '1px solid rgba(0,229,200,0.3)' }}>
                <MessageCircle size={14} style={{ color: '#00E5C8' }} />
              </button>
              <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#00E5C8' }}>
                <Phone size={14} style={{ color: '#07060D' }} />
              </button>
            </div>

            {/* Safety */}
            <button onClick={() => setShowSOS(true)} className="w-full p-3 rounded-xl flex items-center gap-3" style={{
              background: 'linear-gradient(135deg, rgba(255,61,107,0.1), rgba(139,63,255,0.05))',
              border: '1px solid rgba(255,61,107,0.3)'
            }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,61,107,0.15)' }}>
                <ShieldAlert size={16} style={{ color: '#FF3D6B' }} />
              </div>
              <div className="flex-1 text-left">
                <div style={{ color: '#F0EDE6', fontSize: '12px', fontWeight: 700 }}>Safety center</div>
                <div style={{ color: '#9A98B0', fontSize: '10px' }}>SOS · Share trip · Report</div>
              </div>
              <ChevronRight size={14} style={{ color: '#FF3D6B' }} />
            </button>
          </div>
        </div>
      </div>
    </Frame>
  );

  // SCREEN: Arrival (verify handover)
  const ArrivalScreen = () => (
    <Frame>
      <div className="h-full flex flex-col">
        <div className="px-5 pt-12 pb-3 flex items-center justify-between">
          <button onClick={() => setScreen('tracking-pickup')}>
            <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
          </button>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,229,200,0.15)', border: '1px solid rgba(0,229,200,0.4)' }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00E5C8' }} />
            <span style={{ color: '#00E5C8', fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>
              VALET ON SITE
            </span>
          </div>
          <div className="w-6" />
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-3">
          <div style={{ color: '#00E5C8', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>
            VERIFY HANDOVER
          </div>
          <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '30px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', lineHeight: '1', marginBottom: '8px' }}>
            MAHMOUD IS<br/>HERE. 👋
          </div>
          <div style={{ color: '#9A98B0', fontSize: '13px', marginBottom: '20px' }}>
            Match the photo to the person. Confirm before handing over keys.
          </div>

          {/* Driver verification card */}
          <div className="rounded-2xl p-5 mb-4" style={{ background: 'linear-gradient(135deg, rgba(0,229,200,0.08), rgba(212,168,67,0.04))', border: '2px solid rgba(0,229,200,0.3)' }}>
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-28 h-28 rounded-full flex items-center justify-center" style={{ background: driver.photo, border: '4px solid #00E5C8' }}>
                  <span style={{ color: '#07060D', fontFamily: 'Impact, sans-serif', fontSize: '54px', fontWeight: 900 }}>M</span>
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <VerifiedBadge size={24} />
                </div>
              </div>
              <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '24px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.02em' }}>
                {driver.name.toUpperCase()}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  <Star size={12} style={{ color: '#D4A843' }} fill="#D4A843" />
                  <span style={{ color: '#D4A843', fontSize: '12px', fontWeight: 700 }}>{driver.rating}</span>
                </div>
                <span style={{ color: '#6B6880' }}>·</span>
                <span style={{ color: '#9A98B0', fontSize: '11px' }}>{driver.trips} trips</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(7,6,13,0.4)' }}>
              <div style={{ color: '#00E5C8', fontSize: '9px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '4px' }}>
                ASK MAHMOUD TO SAY YOUR NAME
              </div>
              <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>
                "Layla, I'm here for your ride home."
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl mb-3 flex items-start gap-2" style={{ background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.15)' }}>
            <Info size={12} style={{ color: '#D4A843', flexShrink: 0, marginTop: '2px' }} />
            <span style={{ color: '#9A98B0', fontSize: '11px', lineHeight: '1.5' }}>
              Don't hand over keys unless the person matches the photo <span style={{ color: '#D4A843', fontWeight: 700 }}>and</span> knows your name.
            </span>
          </div>
        </div>

        <div className="px-5 pt-2 pb-5 flex flex-col gap-2">
          <CyanButton onClick={() => { setTripProgress(0); setScreen('on-trip'); }}>
            IDENTITY CONFIRMED — START TRIP ✓
          </CyanButton>
          <button onClick={() => setShowSOS(true)} className="w-full py-3 rounded-xl text-xs font-bold" style={{
            background: 'rgba(255,61,107,0.1)',
            color: '#FF3D6B',
            border: '1px solid rgba(255,61,107,0.3)',
            letterSpacing: '0.15em'
          }}>
            ⚠️ SOMETHING'S OFF — REPORT
          </button>
        </div>
      </div>
    </Frame>
  );

  // SCREEN: On Trip
  const OnTripScreen = () => (
    <Frame>
      <div className="h-full flex flex-col">
        {/* Map (big) */}
        <div className="relative" style={{ height: '60%' }}>
          <div className="absolute top-12 left-4 right-4 z-20 flex items-center justify-between">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,229,200,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,229,200,0.4)' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#00E5C8' }} />
              <span style={{ color: '#00E5C8', fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>
                EN ROUTE HOME
              </span>
            </div>
            {locationShared && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: 'rgba(212,168,67,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212,168,67,0.4)' }}>
                <Share2 size={10} style={{ color: '#D4A843' }} />
                <span style={{ color: '#D4A843', fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>
                  SHARED · 2
                </span>
              </div>
            )}
          </div>
          <LiveMap height={440} driverPos={{ top: `${70 - tripProgress * 0.5}%`, left: `${35 + tripProgress * 0.3}%` }} userPos={{ top: '20%', left: '65%' }} />

          {/* Trip progress */}
          <div className="absolute bottom-8 left-4 right-4 z-10">
            <div className="px-3 py-2 rounded-full flex items-center gap-2" style={{ background: 'rgba(7,6,13,0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #00E5C8, #D4A843)', width: `${tripProgress}%` }} />
              </div>
              <span style={{ color: '#00E5C8', fontSize: '10px', fontFamily: 'ui-monospace, monospace', fontWeight: 700, letterSpacing: '0.1em' }}>
                {Math.round(tripProgress)}%
              </span>
            </div>
          </div>
        </div>

        {/* Trip info panel */}
        <div className="flex-1 px-4 py-3 flex flex-col gap-3" style={{ background: '#07060D' }}>
          <div className="flex items-center justify-between p-3 rounded-2xl" style={{ background: '#10101E', border: '1px solid rgba(0,229,200,0.2)' }}>
            <div>
              <div style={{ color: '#00E5C8', fontSize: '9px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>ETA HOME</div>
              <div style={{ color: '#F0EDE6', fontFamily: 'Impact, sans-serif', fontSize: '28px', fontWeight: 900, letterSpacing: '0.02em', lineHeight: '1' }}>
                {Math.max(0, Math.round(18 - tripProgress * 0.18))} <span style={{ fontSize: '13px', color: '#9A98B0' }}>MIN</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: driver.photo }}>
                  <span style={{ color: '#07060D', fontFamily: 'Impact, sans-serif', fontSize: '20px', fontWeight: 900 }}>M</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5">
                  <VerifiedBadge size={10} />
                </div>
              </div>
              <div className="flex gap-1.5">
                <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#07060D', border: '1px solid rgba(0,229,200,0.3)' }}>
                  <MessageCircle size={13} style={{ color: '#00E5C8' }} />
                </button>
                <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#00E5C8' }}>
                  <Phone size={13} style={{ color: '#07060D' }} />
                </button>
              </div>
            </div>
          </div>

          {/* SOS BIG */}
          <button onClick={() => setShowSOS(true)} className="relative w-full py-4 rounded-2xl flex items-center justify-center gap-2 overflow-hidden active:scale-95 transition-transform" style={{
            background: 'linear-gradient(135deg, #FF3D6B, #8B3FFF)',
            boxShadow: '0 0 30px rgba(255,61,107,0.3)'
          }}>
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3), transparent 50%)'
            }} />
            <ShieldAlert size={20} style={{ color: '#F0EDE6', zIndex: 1 }} />
            <span style={{ color: '#F0EDE6', fontSize: '14px', fontWeight: 900, letterSpacing: '0.25em', zIndex: 1 }}>
              EMERGENCY · SOS
            </span>
          </button>

          <button onClick={() => setScreen('completed')} className="w-full py-2 rounded-xl text-xs" style={{
            background: 'rgba(0,229,200,0.08)',
            color: '#00E5C8',
            border: '1px solid rgba(0,229,200,0.2)',
            letterSpacing: '0.15em',
            fontWeight: 700
          }}>
            ✨ SIMULATE ARRIVAL HOME
          </button>
        </div>

        {/* SOS OVERLAY */}
        {showSOS && (
          <div className="absolute inset-0 z-50 flex flex-col" style={{
            background: 'rgba(7,6,13,0.96)', 
            backdropFilter: 'blur(20px)',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full animate-ping" style={{ background: '#FF3D6B', width: '140px', height: '140px', top: '-20px', left: '-20px', opacity: 0.3 }} />
                <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, #FF3D6B, #8B3FFF)',
                  boxShadow: '0 0 60px rgba(255,61,107,0.6)'
                }}>
                  <ShieldAlert size={40} style={{ color: '#F0EDE6' }} strokeWidth={2.5} />
                </div>
              </div>

              <div style={{ color: '#FF3D6B', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '6px' }}>
                EMERGENCY MODE
              </div>
              <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '32px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', textAlign: 'center', lineHeight: '1', marginBottom: '24px' }}>
                WHAT DO YOU<br/>NEED?
              </div>

              <div className="w-full flex flex-col gap-2">
                <button className="w-full py-4 rounded-2xl flex items-center gap-3 px-4" style={{ background: 'linear-gradient(135deg, #FF3D6B, #8B3FFF)' }}>
                  <Phone size={18} style={{ color: '#F0EDE6' }} />
                  <div className="flex-1 text-left">
                    <div style={{ color: '#F0EDE6', fontSize: '14px', fontWeight: 800 }}>Call Police (122)</div>
                    <div style={{ color: 'rgba(240,237,230,0.8)', fontSize: '10px' }}>Egyptian emergency line</div>
                  </div>
                  <ChevronRight size={14} style={{ color: '#F0EDE6' }} />
                </button>
                <button className="w-full py-4 rounded-2xl flex items-center gap-3 px-4" style={{ background: '#10101E', border: '1px solid rgba(212,168,67,0.3)' }}>
                  <Users size={18} style={{ color: '#D4A843' }} />
                  <div className="flex-1 text-left">
                    <div style={{ color: '#F0EDE6', fontSize: '14px', fontWeight: 800 }}>Alert Trusted Contacts</div>
                    <div style={{ color: '#9A98B0', fontSize: '10px' }}>Mom · Karim A. · instantly notified</div>
                  </div>
                  <ChevronRight size={14} style={{ color: '#D4A843' }} />
                </button>
                <button className="w-full py-4 rounded-2xl flex items-center gap-3 px-4" style={{ background: '#10101E', border: '1px solid rgba(0,229,200,0.3)' }}>
                  <Share2 size={18} style={{ color: '#00E5C8' }} />
                  <div className="flex-1 text-left">
                    <div style={{ color: '#F0EDE6', fontSize: '14px', fontWeight: 800 }}>Share Live Location</div>
                    <div style={{ color: '#9A98B0', fontSize: '10px' }}>Send link to anyone</div>
                  </div>
                  <ChevronRight size={14} style={{ color: '#00E5C8' }} />
                </button>
                <button className="w-full py-4 rounded-2xl flex items-center gap-3 px-4" style={{ background: '#10101E', border: '1px solid rgba(139,63,255,0.3)' }}>
                  <AlertTriangle size={18} style={{ color: '#8B3FFF' }} />
                  <div className="flex-1 text-left">
                    <div style={{ color: '#F0EDE6', fontSize: '14px', fontWeight: 800 }}>Report Issue to LAYLA</div>
                    <div style={{ color: '#9A98B0', fontSize: '10px' }}>24/7 safety team</div>
                  </div>
                  <ChevronRight size={14} style={{ color: '#8B3FFF' }} />
                </button>
              </div>

              <div className="mt-6 p-3 rounded-lg" style={{ background: 'rgba(255,61,107,0.05)', border: '1px solid rgba(255,61,107,0.2)' }}>
                <div style={{ color: '#FF3D6B', fontSize: '10px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '4px' }}>
                  🎙️ VOICE TRIGGER
                </div>
                <div style={{ color: '#9A98B0', fontSize: '11px', lineHeight: '1.4' }}>
                  Say <span style={{ color: '#F0EDE6', fontWeight: 700 }}>"LAYLA, HELP ME"</span> hands-free to trigger SOS. Active during trips.
                </div>
              </div>
            </div>

            <div className="px-5 pb-6">
              <button onClick={() => setShowSOS(false)} className="w-full py-3 rounded-xl" style={{
                background: 'rgba(255,255,255,0.06)',
                color: '#F0EDE6',
                fontSize: '13px',
                fontWeight: 600
              }}>
                Cancel — I'm OK
              </button>
            </div>
            <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
          </div>
        )}
      </div>
    </Frame>
  );

  // SCREEN: Completed
  const CompletedScreen = () => (
    <Frame>
      <div className="h-full flex flex-col px-5 pt-12 pb-6">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full animate-ping" style={{ background: '#00E5C8', width: '120px', height: '120px', top: '-12px', left: '-12px', opacity: 0.3 }} />
            <div className="w-24 h-24 rounded-full flex items-center justify-center relative" style={{
              background: 'linear-gradient(135deg, #00E5C8, #D4A843)',
              boxShadow: '0 0 40px rgba(0,229,200,0.5)'
            }}>
              <Home size={40} style={{ color: '#07060D' }} strokeWidth={2.5} />
            </div>
          </div>

          <div style={{ color: '#00E5C8', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '6px' }}>
            TRIP COMPLETE · 2:58 AM
          </div>
          <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '40px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', textAlign: 'center', lineHeight: '1', marginBottom: '12px' }}>
            HOME<br/>SAFE. 🏠
          </div>
          <div style={{ color: '#9A98B0', fontSize: '14px', textAlign: 'center', maxWidth: '280px', marginBottom: '24px' }}>
            Your car is parked, your keys are ready. Sleep well.
          </div>

          {/* Trip summary */}
          <div className="w-full rounded-2xl p-4 mb-4" style={{ background: '#10101E', border: '1px solid rgba(0,229,200,0.2)' }}>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center">
                <div style={{ color: '#F0EDE6', fontFamily: 'Impact, sans-serif', fontSize: '22px', fontWeight: 900 }}>18<span style={{ fontSize: '11px', color: '#9A98B0' }}>MIN</span></div>
                <div style={{ color: '#6B6880', fontSize: '9px', letterSpacing: '0.15em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>DURATION</div>
              </div>
              <div className="text-center">
                <div style={{ color: '#F0EDE6', fontFamily: 'Impact, sans-serif', fontSize: '22px', fontWeight: 900 }}>5.8<span style={{ fontSize: '11px', color: '#9A98B0' }}>KM</span></div>
                <div style={{ color: '#6B6880', fontSize: '9px', letterSpacing: '0.15em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>DISTANCE</div>
              </div>
              <div className="text-center">
                <div style={{ color: '#D4A843', fontFamily: 'Impact, sans-serif', fontSize: '22px', fontWeight: 900 }}>{pricing.total}<span style={{ fontSize: '11px', color: '#9A98B0' }}>EGP</span></div>
                <div style={{ color: '#6B6880', fontSize: '9px', letterSpacing: '0.15em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>CHARGED</div>
              </div>
            </div>
            <div className="pt-3 flex items-center gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: driver.photo }}>
                <span style={{ color: '#07060D', fontFamily: 'Impact, sans-serif', fontSize: '13px', fontWeight: 900 }}>M</span>
              </div>
              <div className="flex-1">
                <div style={{ color: '#F0EDE6', fontSize: '12px', fontWeight: 700 }}>Driven by {driver.name}</div>
                <div style={{ color: '#9A98B0', fontSize: '10px' }}>LAYLA Verified · {driver.rating} ⭐</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <CyanButton onClick={() => { setRating(0); setRatingTags([]); setScreen('rate'); }}>
            RATE YOUR VALET <Star size={16} />
          </CyanButton>
          <button onClick={() => setScreen('home')} className="w-full py-3 rounded-xl text-sm" style={{ background: 'transparent', color: '#9A98B0', border: '1px solid rgba(255,255,255,0.1)' }}>
            Skip for now
          </button>
        </div>
      </div>
    </Frame>
  );

  // SCREEN: Rate Driver
  const RateDriverScreen = () => {
    const toggleTag = (t) => setRatingTags(ratingTags.includes(t) ? ratingTags.filter(x => x !== t) : [...ratingTags, t]);

    return (
      <Frame>
        <div className="h-full flex flex-col px-5 pt-12 pb-6">
          <button onClick={() => setScreen('completed')} className="self-start mb-4">
            <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
          </button>

          <div style={{ color: '#00E5C8', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>
            YOUR FEEDBACK
          </div>
          <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '32px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', lineHeight: '1', marginBottom: '20px' }}>
            HOW WAS<br/>MAHMOUD?
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Driver card */}
            <div className="rounded-2xl p-4 mb-5 text-center" style={{ background: '#10101E', border: '1px solid rgba(0,229,200,0.2)' }}>
              <div className="relative inline-block mb-2">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: driver.photo, border: '2px solid #00E5C8' }}>
                  <span style={{ color: '#07060D', fontFamily: 'Impact, sans-serif', fontSize: '34px', fontWeight: 900 }}>M</span>
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <VerifiedBadge size={18} />
                </div>
              </div>
              <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '22px', color: '#F0EDE6', fontWeight: 900 }}>
                {driver.name.toUpperCase()}
              </div>

              {/* Stars */}
              <div className="flex items-center justify-center gap-2 mt-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <button key={i} onClick={() => setRating(i)} className="transition-transform active:scale-90">
                    <Star size={36} style={{ color: i <= rating ? '#D4A843' : '#3A3A4A' }} fill={i <= rating ? '#D4A843' : 'none'} />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <div className="mt-2" style={{ color: '#D4A843', fontSize: '12px', fontWeight: 700, fontFamily: 'Impact, sans-serif', letterSpacing: '0.05em' }}>
                  {['', 'POOR', 'OK', 'GOOD', 'GREAT', 'EXCELLENT ⭐'][rating]}
                </div>
              )}
            </div>

            {rating > 0 && (
              <>
                <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>
                  WHAT WAS GOOD? · {ratingTags.length} SELECTED
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {ratingTagOptions.map(t => (
                    <button key={t} onClick={() => toggleTag(t)} className="px-3 py-1.5 rounded-full text-xs transition-all" style={{
                      background: ratingTags.includes(t) ? 'linear-gradient(135deg, #00E5C8, #D4A843)' : 'rgba(255,255,255,0.04)',
                      color: ratingTags.includes(t) ? '#07060D' : '#9A98B0',
                      border: ratingTags.includes(t) ? 'none' : '1px solid rgba(255,255,255,0.08)',
                      fontWeight: ratingTags.includes(t) ? 700 : 500
                    }}>
                      {ratingTags.includes(t) && '✓ '}{t}
                    </button>
                  ))}
                </div>
              </>
            )}

            {rating >= 4 && (
              <div className="p-3 rounded-xl mb-3" style={{ background: 'rgba(212,168,67,0.05)', border: '1px solid rgba(212,168,67,0.2)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Heart size={12} style={{ color: '#D4A843' }} fill="#D4A843" />
                  <span style={{ color: '#D4A843', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', fontFamily: 'ui-monospace, monospace' }}>
                    ADD TIP (OPTIONAL)
                  </span>
                </div>
                <div className="flex gap-2">
                  {[20, 50, 100].map(t => (
                    <button key={t} className="flex-1 py-2 rounded-lg text-xs font-bold" style={{
                      background: 'rgba(212,168,67,0.1)',
                      color: '#D4A843',
                      border: '1px solid rgba(212,168,67,0.3)'
                    }}>
                      +{t} EGP
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <CyanButton variant="gold" onClick={() => setScreen('home')} disabled={rating === 0}>
            SUBMIT RATING
          </CyanButton>
        </div>
      </Frame>
    );
  };

  // ============ RENDER ============
  const screens = {
    'home': HomeScreen,
    'car-info': CarInfoScreen,
    'confirm': ConfirmScreen,
    'finding': FindingScreen,
    'assigned': AssignedScreen,
    'tracking-pickup': TrackingPickupScreen,
    'arrival': ArrivalScreen,
    'on-trip': OnTripScreen,
    'completed': CompletedScreen,
    'rate': RateDriverScreen,
  };

  const flowLabel = {
    'home': 'Order Valet',
    'car-info': 'Car Details',
    'confirm': 'Confirm Ride',
    'finding': 'Finding Valet...',
    'assigned': 'Valet Assigned',
    'tracking-pickup': 'Tracking (Live)',
    'arrival': 'Verify Handover',
    'on-trip': 'On Trip Home',
    'completed': 'Home Safe 🏠',
    'rate': 'Rate Driver',
  };

  const CurrentScreen = screens[screen];

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4" style={{ background: '#0A0910' }}>
      <div className="mb-6 text-center">
        <div style={{
          fontFamily: 'Impact, "Bebas Neue", sans-serif',
          fontSize: '32px',
          letterSpacing: '0.05em',
          background: 'linear-gradient(135deg, #00E5C8, #D4A843)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 900
        }}>
          PHASE 05 · SAFE RIDE VALET
        </div>
        <div style={{ color: '#6B6880', fontSize: '11px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginTop: '4px' }}>
          LAYLA · THE SAFETY FEATURE
        </div>
      </div>

      <div className="flex gap-8 items-start flex-wrap justify-center">
        {/* Phone */}
        <div className="relative" style={{ width: '340px', height: '700px' }}>
          <div className="absolute inset-0 rounded-[44px] overflow-hidden" style={{
            background: '#000',
            padding: '10px',
            boxShadow: '0 40px 80px rgba(0,229,200,0.15), 0 0 0 2px #1a1a22, 0 0 0 3px #333'
          }}>
            <div className="w-full h-full rounded-[36px] overflow-hidden relative">
              <CurrentScreen />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 rounded-b-2xl z-50" style={{ background: '#000' }} />
            </div>
          </div>
        </div>

        <div className="w-72 p-4 rounded-2xl" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ color: '#00E5C8', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '12px' }}>
            ⚡ JUMP TO SCREEN
          </div>
          <div className="flex flex-col gap-1">
            {Object.keys(screens).map((s, i) => (
              <button key={s} onClick={() => {
                setScreen(s);
                if (s === 'finding') setSearchProgress(0);
                if (s === 'tracking-pickup') setDriverEta(8);
                if (s === 'on-trip') setTripProgress(0);
              }} className="text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between" style={{
                background: screen === s ? 'rgba(0,229,200,0.15)' : 'transparent',
                color: screen === s ? '#00E5C8' : '#9A98B0',
                border: screen === s ? '1px solid rgba(0,229,200,0.3)' : '1px solid transparent',
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
              SIGNATURE MOMENTS
            </div>
            <div style={{ color: '#9A98B0', fontSize: '11px', lineHeight: '1.5' }}>
              🔍 <span style={{ color: '#00E5C8' }}>Finding</span> — radar animation<br/>
              ✅ <span style={{ color: '#00E5C8' }}>Verify</span> — identity handover<br/>
              🗺️ <span style={{ color: '#00E5C8' }}>On Trip</span> — live map + SOS<br/>
              🆘 Tap <span style={{ color: '#FF3D6B' }}>SOS</span> button on Trip screen!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
