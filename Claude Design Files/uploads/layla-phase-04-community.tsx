import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Home, Search, Plus, MessageCircle, User, Heart, Bell, MapPin, Calendar, Star, Send, Camera, Image, X, Check, Sparkles, UserPlus, UserCheck, MoreHorizontal, Smile, Share2, MessageSquare, Users, Music, ThumbsUp, Clock, Eye, Zap, Mic, Phone, Video, Info, Pin, Volume2, Verified } from 'lucide-react';

export default function LaylaCommunity() {
  const [screen, setScreen] = useState('feed');
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDm, setSelectedDm] = useState(null);
  const [createTab, setCreateTab] = useState('photo');
  const [profileTab, setProfileTab] = useState('events');
  const [searchTab, setSearchTab] = useState('people');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewVibes, setReviewVibes] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [postText, setPostText] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set(['p2']));
  const [friendRequests, setFriendRequests] = useState([{ id: 'req1', userId: 4 }]);
  const [friends, setFriends] = useState(new Set([1, 2, 3, 6]));
  const [following, setFollowing] = useState(new Set(['v1', 'v2', 'd1']));
  const [liveMessages, setLiveMessages] = useState({});

  // =========== DATA ===========
  const me = {
    name: 'Layla', handle: '@layla.m', age: 24,
    bio: 'Techno nights & rooftop sunsets 🌙',
    vibes: ['House', 'Techno', 'Rooftop'],
    city: 'Cairo',
    stats: { friends: 127, followers: 43, following: 56, parties: 18 },
    avatar: 'linear-gradient(135deg, #D4A843, #FF3D6B)',
  };

  const people = {
    1: { id: 1, name: 'Karim A.', handle: '@karim.a', age: 27, vibes: ['Techno', 'Rooftop', 'House'], avatar: '#D4A843', verified: true, mutual: 12, city: 'Cairo', bio: 'Rooftop architect · host' },
    2: { id: 2, name: 'Yasmin R.', handle: '@yas.r', age: 29, vibes: ['House', 'Beach'], avatar: '#00E5C8', verified: true, mutual: 8, city: 'Sahel', bio: 'Pool days & beach nights' },
    3: { id: 3, name: 'Nour H.', handle: '@nour.h', age: 25, vibes: ['Techno', 'Underground'], avatar: '#8B3FFF', verified: true, mutual: 15, city: 'Cairo', bio: 'Private parties · afterhours' },
    4: { id: 4, name: 'Omar K.', handle: '@omar.k', age: 27, vibes: ['Techno'], avatar: '#8B3FFF', verified: false, mutual: 7, city: 'Cairo', bio: 'Techno purist' },
    5: { id: 5, name: 'Salma A.', handle: '@salma.a', age: 22, vibes: ['Chill', 'Rooftop'], avatar: '#FF3D6B', verified: false, mutual: 3, city: 'Cairo', bio: 'Documenting the scene 📸' },
    6: { id: 6, name: 'Ahmed M.', handle: '@ahmed.m', age: 26, vibes: ['House', 'Afrobeats'], avatar: '#D4A843', verified: false, mutual: 5, city: 'Gouna', bio: 'Beach vibes' },
  };

  const accounts = {
    v1: { id: 'v1', name: 'Cairo Jazz Club', handle: '@cjc', type: 'Venue', city: 'Cairo', avatar: '#FF3D6B', verified: true, followers: 12400, bio: 'Egypt\'s home of live jazz & electronic' },
    v2: { id: 'v2', name: 'Six Eight', handle: '@sixeight', type: 'Venue', city: 'Sahel', avatar: '#00E5C8', verified: true, followers: 8900, bio: 'Beach club · Sahel\'s hottest' },
    v3: { id: 'v3', name: 'Sachi Rooftop', handle: '@sachi', type: 'Venue', city: 'Cairo', avatar: '#D4A843', verified: true, followers: 5600, bio: 'Rooftop fine dining' },
    h1: { id: 'h1', name: 'Karim A.', handle: '@karim.a', type: 'Host', city: 'Cairo', avatar: '#D4A843', verified: true, followers: 890, bio: 'Rooftop parties · Zamalek' },
    d1: { id: 'd1', name: 'Aguizi & Fahim', handle: '@aguizifahim', type: 'DJ', city: 'Cairo', avatar: 'linear-gradient(135deg, #FF3D6B, #8B3FFF)', verified: true, followers: 45200, bio: 'Techno · Progressive · Melodic' },
    d2: { id: 'd2', name: 'Disco Misr', handle: '@discomisr', type: 'DJ', city: 'Cairo', avatar: 'linear-gradient(135deg, #D4A843, #F0C96A)', verified: true, followers: 32800, bio: 'Disco · Funk · House' },
  };

  const stories = [
    { id: 's1', userId: 1, user: 'Karim A.', avatar: '#D4A843', time: '2h', gradient: 'linear-gradient(135deg, #FF3D6B, #D4A843)', emoji: '🌅', text: "Last night's rooftop was insane", verified: true },
    { id: 's2', userId: 2, user: 'Yasmin R.', avatar: '#00E5C8', time: '4h', gradient: 'linear-gradient(135deg, #00E5C8, #D4A843)', emoji: '🏖️', text: 'Sahel sessions ☀️', verified: true },
    { id: 's3', userId: 'v1', user: 'Cairo Jazz Club', avatar: '#FF3D6B', time: '6h', gradient: 'linear-gradient(135deg, #FF3D6B, #8B3FFF)', emoji: '🎷', text: 'Tonight · Aguizi set at 11 PM', verified: true, isVenue: true },
    { id: 's4', userId: 4, user: 'Omar K.', avatar: '#8B3FFF', time: '8h', gradient: 'linear-gradient(135deg, #8B3FFF, #07060D)', emoji: '🎛️', text: 'Finding the underground', verified: false },
  ];

  const feedPosts = [
    {
      id: 'p1', type: 'checkin', userId: 1, user: 'Karim A.', avatar: '#D4A843',
      time: '2h ago', verified: true,
      event: { name: 'Techno Night', venue: 'Cairo Jazz Club', gradient: 'linear-gradient(135deg, #FF3D6B, #D4A843)', emoji: '🎷' },
      likes: 42, comments: 3,
    },
    {
      id: 'p2', type: 'photo', userId: 2, user: 'Yasmin R.', avatar: '#00E5C8',
      time: '4h ago', verified: true,
      caption: "Pool day was golden 🌅 Can't wait for next weekend",
      photo: { gradient: 'linear-gradient(135deg, #00E5C8 0%, #D4A843 50%, #FF3D6B 100%)', emoji: '🏖️' },
      location: 'Sahel', likes: 89, comments: 12,
    },
    {
      id: 'p3', type: 'review', userId: 5, user: 'Salma A.', avatar: '#FF3D6B',
      time: '6h ago', verified: false, rating: 5,
      event: { name: 'The Tap East', category: 'House Grooves', date: 'Last Thursday' },
      text: 'Sound system was 🔥 Stayed til 4 AM. Crowd was friendly, bar staff on point.',
      vibes: ['Great crowd', 'Amazing music', 'Worth it'],
      likes: 23, comments: 5,
    },
    {
      id: 'p4', type: 'text', userId: 4, user: 'Omar K.', avatar: '#8B3FFF',
      time: '8h ago', verified: false,
      text: 'Anyone else think techno in Cairo is having its best year? The underground scene is finally getting the respect it deserves 🎛️',
      likes: 56, comments: 18,
    },
    {
      id: 'p5', type: 'event-announce', userId: 'd1', user: 'Aguizi & Fahim',
      avatar: 'linear-gradient(135deg, #FF3D6B, #8B3FFF)',
      time: '1d ago', verified: true, isDj: true,
      event: { name: 'Sahel Sunset Rave 2026', venue: 'Six Eight · Sahel', date: 'Fri, Apr 24', gradient: 'linear-gradient(135deg, #D4A843, #FF3D6B)', emoji: '🌅' },
      text: 'Locked in for the big one. Three-hour set to close the night. See you there.',
      likes: 234, comments: 41,
    },
  ];

  const conversations = [
    { id: 'c1', userId: 1, user: 'Karim A.', avatar: '#D4A843', verified: true, lastMsg: 'Coming tonight? Got a spot for you', time: '5m', unread: 2, online: true },
    { id: 'c2', userId: 2, user: 'Yasmin R.', avatar: '#00E5C8', verified: true, lastMsg: 'Sahel next week? Planning something', time: '1h', unread: 0, online: false },
    { id: 'c3', userId: 3, user: 'Nour H.', avatar: '#8B3FFF', verified: true, lastMsg: 'Sent you the guestlist link', time: '3h', unread: 0, online: true },
    { id: 'c4', userId: 6, user: 'Ahmed M.', avatar: '#D4A843', verified: false, lastMsg: 'You: See you there 🌙', time: '1d', unread: 0, online: false },
  ];

  const mockMessages = {
    c1: [
      { id: 1, from: 'them', text: 'Yo! You going to Cairo Jazz tonight?', time: '5:42 PM' },
      { id: 2, from: 'them', text: "Got a spot for you on the list 🎷", time: '5:42 PM' },
      { id: 3, from: 'me', text: "Maybe! Who's playing?", time: '5:45 PM' },
      { id: 4, from: 'them', text: 'Aguizi & Fahim closing set at 11', time: '5:48 PM', shareEvent: { name: 'Techno Night', venue: 'Cairo Jazz Club', time: 'Tonight · 11 PM', gradient: 'linear-gradient(135deg, #FF3D6B, #D4A843)' } },
      { id: 5, from: 'them', text: 'Coming tonight?', time: '5:50 PM' },
    ],
    c2: [
      { id: 1, from: 'them', text: 'Planning a trip to Sahel next week 🏖️', time: '2:14 PM' },
      { id: 2, from: 'them', text: 'You in?', time: '2:14 PM' },
    ],
    c3: [
      { id: 1, from: 'them', text: 'Hey! Sending the guestlist link', time: '1:00 PM' },
      { id: 2, from: 'them', text: 'layla.app/l/afterparty-zamalek', time: '1:00 PM' },
    ],
  };

  const notifications = [
    { id: 'n1', type: 'friend-request', user: 'Omar K.', avatar: '#8B3FFF', time: '10m', action: 'wants to be your friend', mutual: 7, userId: 4 },
    { id: 'n2', type: 'going-same', user: 'Salma A.', avatar: '#FF3D6B', time: '1h', action: 'is also going to', target: 'Sahel Sunset Rave', userId: 5 },
    { id: 'n3', type: 'new-event', user: 'Cairo Jazz Club', avatar: '#FF3D6B', time: '2h', action: 'posted a new event:', target: 'Techno Sessions · Sat', verified: true, isVenue: true },
    { id: 'n4', type: 'like', user: 'Ahmed M.', avatar: '#D4A843', time: '4h', action: 'liked your review of', target: 'The Tap East', userId: 6 },
    { id: 'n5', type: 'new-follower', user: 'Disco Misr', avatar: 'linear-gradient(135deg, #D4A843, #F0C96A)', time: '1d', action: 'started following you', verified: true, isDj: true },
  ];

  // =========== HELPERS ===========
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

  const PurpleButton = ({ children, onClick, disabled, variant = 'purple' }) => (
    <button onClick={onClick} disabled={disabled}
      className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-30"
      style={{
        background: !disabled ? (variant === 'gold' ? 'linear-gradient(135deg, #D4A843, #F0C96A)' : 'linear-gradient(135deg, #8B3FFF, #FF3D6B)') : '#10101E',
        color: !disabled ? (variant === 'gold' ? '#07060D' : '#F0EDE6') : '#6B6880',
        fontSize: '14px', letterSpacing: '0.15em',
        border: disabled ? '1px solid rgba(255,255,255,0.06)' : 'none'
      }}>
      {children}
    </button>
  );

  const VerifiedBadge = ({ size = 12, gold = false }) => (
    <div className="inline-flex items-center justify-center rounded-full" style={{
      background: gold ? 'linear-gradient(135deg, #D4A843, #F0C96A)' : 'linear-gradient(135deg, #00E5C8, #D4A843)',
      width: size + 4, height: size + 4
    }}>
      <Check size={size - 4} style={{ color: '#07060D' }} strokeWidth={4} />
    </div>
  );

  const Avatar = ({ bg, size = 40, name, border = false, ring = null }) => (
    <div className="rounded-full flex items-center justify-center flex-shrink-0 relative" style={{
      background: bg, width: size, height: size,
      border: border ? '2px solid #07060D' : 'none',
      boxShadow: ring ? `0 0 0 2px ${ring}` : 'none'
    }}>
      <span style={{ color: '#07060D', fontFamily: 'Impact, sans-serif', fontSize: size * 0.42, fontWeight: 900 }}>
        {name?.[0] || '?'}
      </span>
    </div>
  );

  // Bottom Nav
  const BottomNav = () => {
    const items = [
      { id: 'feed', icon: Home, label: 'Feed' },
      { id: 'search', icon: Search, label: 'Discover' },
      { id: 'create-post', icon: Plus, label: '', isCreate: true },
      { id: 'dms', icon: MessageCircle, label: 'Inbox', badge: 2 },
      { id: 'profile-me', icon: null, label: 'Me', isAvatar: true },
    ];
    return (
      <div className="px-3 pt-2 pb-4 border-t" style={{ background: '#07060D', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-around">
          {items.map(t => (
            <button key={t.id} onClick={() => setScreen(t.id)} className="flex flex-col items-center gap-0.5 py-1 px-2 flex-1 relative">
              {t.isCreate ? (
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8B3FFF, #FF3D6B)' }}>
                  <Plus size={20} style={{ color: '#F0EDE6' }} strokeWidth={3} />
                </div>
              ) : t.isAvatar ? (
                <div className="w-6 h-6 rounded-full" style={{
                  background: me.avatar,
                  boxShadow: screen === t.id ? '0 0 0 2px #8B3FFF' : 'none'
                }} />
              ) : (
                <>
                  <t.icon size={22} style={{ color: screen === t.id ? '#8B3FFF' : '#6B6880' }} />
                  {t.badge && (
                    <div className="absolute top-0 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#FF3D6B' }}>
                      <span style={{ color: '#F0EDE6', fontSize: '9px', fontWeight: 900 }}>{t.badge}</span>
                    </div>
                  )}
                </>
              )}
              {t.label && !t.isCreate && (
                <span style={{
                  fontSize: '9px', letterSpacing: '0.1em', fontFamily: 'ui-monospace, monospace',
                  color: screen === t.id ? '#8B3FFF' : '#6B6880',
                  fontWeight: screen === t.id ? 700 : 500
                }}>
                  {t.label.toUpperCase()}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // =========== SCREENS ===========

  // SCREEN: Feed
  const FeedScreen = () => (
    <Frame>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-5 pt-12 pb-3 flex items-center justify-between">
          <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '32px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.04em', background: 'linear-gradient(135deg, #D4A843, #FF3D6B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            LAYLA
          </div>
          <div className="flex gap-2">
            <button onClick={() => setScreen('notifications')} className="relative w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Bell size={16} style={{ color: '#F0EDE6' }} />
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: '#FF3D6B' }} />
            </button>
          </div>
        </div>

        {/* Stories bar */}
        <div className="px-5 pb-3">
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {/* Your story */}
            <button onClick={() => setScreen('create-post')} className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className="relative">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: me.avatar }}>
                  <span style={{ color: '#07060D', fontFamily: 'Impact, sans-serif', fontSize: '22px', fontWeight: 900 }}>L</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#8B3FFF', border: '2px solid #07060D' }}>
                  <Plus size={10} style={{ color: '#F0EDE6' }} strokeWidth={3} />
                </div>
              </div>
              <span style={{ color: '#9A98B0', fontSize: '10px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.05em' }}>YOUR STORY</span>
            </button>
            {stories.map((s, i) => (
              <button key={s.id} onClick={() => { setActiveStoryIdx(i); setScreen('story-viewer'); }} className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="relative p-0.5 rounded-full" style={{ background: 'linear-gradient(135deg, #D4A843, #FF3D6B, #8B3FFF)' }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center border-2" style={{ background: s.avatar, borderColor: '#07060D' }}>
                    <span style={{ color: '#07060D', fontFamily: 'Impact, sans-serif', fontSize: '22px', fontWeight: 900 }}>
                      {s.user[0]}
                    </span>
                  </div>
                  {s.verified && (
                    <div className="absolute -bottom-0 right-0 z-10">
                      <VerifiedBadge size={12} />
                    </div>
                  )}
                </div>
                <span style={{ color: '#F0EDE6', fontSize: '10px', fontWeight: 600, maxWidth: '60px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {s.user.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Feed */}
        <div className="flex-1 overflow-y-auto pb-3">
          {feedPosts.map(p => (
            <FeedPost key={p.id} post={p} />
          ))}
          <div className="px-5 py-6 text-center">
            <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace' }}>
              · END OF FEED ·
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </Frame>
  );

  // Feed Post component
  const FeedPost = ({ post }) => {
    const isLiked = likedPosts.has(post.id);
    const toggleLike = () => {
      const next = new Set(likedPosts);
      if (next.has(post.id)) next.delete(post.id); else next.add(post.id);
      setLikedPosts(next);
    };

    return (
      <div className="px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => { setSelectedUser(post.userId); setScreen('profile-other'); }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: post.avatar }}>
              <span style={{ color: '#07060D', fontFamily: 'Impact, sans-serif', fontSize: '15px', fontWeight: 900 }}>
                {post.user[0]}
              </span>
            </div>
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>{post.user}</span>
              {post.verified && <VerifiedBadge size={10} />}
              {post.isDj && <span className="px-1 py-0.5 rounded text-[8px] font-bold" style={{ background: 'rgba(139,63,255,0.15)', color: '#8B3FFF', letterSpacing: '0.1em' }}>DJ</span>}
            </div>
            <div className="flex items-center gap-1">
              <span style={{ color: '#6B6880', fontSize: '10px', fontFamily: 'ui-monospace, monospace' }}>{post.time}</span>
              {post.location && (
                <>
                  <span style={{ color: '#6B6880', fontSize: '10px' }}>·</span>
                  <span style={{ color: '#9A98B0', fontSize: '10px' }}>
                    <MapPin size={8} className="inline" /> {post.location}
                  </span>
                </>
              )}
            </div>
          </div>
          <button><MoreHorizontal size={16} style={{ color: '#6B6880' }} /></button>
        </div>

        {/* Body — varies by type */}
        {post.type === 'checkin' && (
          <div className="rounded-xl overflow-hidden mb-3" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-3 p-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0" style={{ background: post.event.gradient }}>
                {post.event.emoji}
              </div>
              <div className="flex-1">
                <div style={{ color: '#D4A843', fontSize: '9px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '2px' }}>
                  📍 CHECKED IN
                </div>
                <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>{post.event.name}</div>
                <div style={{ color: '#9A98B0', fontSize: '11px' }}>{post.event.venue}</div>
              </div>
            </div>
          </div>
        )}

        {post.type === 'photo' && (
          <>
            <div className="rounded-xl overflow-hidden mb-3 relative" style={{ height: '220px', background: post.photo.gradient }}>
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.4), transparent 50%)' }} />
              <div className="absolute bottom-3 right-3 text-6xl">{post.photo.emoji}</div>
            </div>
            <div style={{ color: '#F0EDE6', fontSize: '13px', lineHeight: '1.4', marginBottom: '8px' }}>
              {post.caption}
            </div>
          </>
        )}

        {post.type === 'review' && (
          <div className="rounded-xl p-3 mb-3" style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.08), rgba(255,61,107,0.05))', border: '1px solid rgba(212,168,67,0.2)' }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div style={{ color: '#D4A843', fontSize: '9px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>
                  ⭐ REVIEWED
                </div>
                <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>{post.event.name}</div>
                <div style={{ color: '#9A98B0', fontSize: '11px' }}>{post.event.category} · {post.event.date}</div>
              </div>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={12} style={{ color: i <= post.rating ? '#D4A843' : '#3A3A4A' }} fill={i <= post.rating ? '#D4A843' : 'none'} />
                ))}
              </div>
            </div>
            <div style={{ color: '#F0EDE6', fontSize: '12px', lineHeight: '1.5', marginBottom: '8px' }}>
              {post.text}
            </div>
            <div className="flex flex-wrap gap-1">
              {post.vibes.map(v => (
                <span key={v} className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: 'rgba(212,168,67,0.15)', color: '#D4A843', fontWeight: 600 }}>
                  ✓ {v}
                </span>
              ))}
            </div>
          </div>
        )}

        {post.type === 'text' && (
          <div style={{ color: '#F0EDE6', fontSize: '14px', lineHeight: '1.5', marginBottom: '8px' }}>
            {post.text}
          </div>
        )}

        {post.type === 'event-announce' && (
          <>
            <div style={{ color: '#F0EDE6', fontSize: '13px', lineHeight: '1.5', marginBottom: '10px' }}>
              {post.text}
            </div>
            <div className="rounded-xl overflow-hidden mb-3" style={{ background: post.event.gradient }}>
              <div className="p-4">
                <div style={{ color: 'rgba(7,6,13,0.7)', fontSize: '9px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', fontWeight: 700, marginBottom: '4px' }}>
                  🔥 UPCOMING
                </div>
                <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '24px', color: '#07060D', fontWeight: 900, lineHeight: '1.05', marginBottom: '4px' }}>
                  {post.event.name.toUpperCase()}
                </div>
                <div style={{ color: '#07060D', fontSize: '11px', fontWeight: 600, opacity: 0.8 }}>
                  {post.event.venue} · {post.event.date}
                </div>
                <button className="mt-3 px-3 py-1.5 rounded-full text-[10px] font-bold" style={{ background: '#07060D', color: '#D4A843', letterSpacing: '0.15em' }}>
                  GET TICKETS →
                </button>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button onClick={toggleLike} className="flex items-center gap-1.5">
            <Heart size={18} style={{ color: isLiked ? '#FF3D6B' : '#9A98B0' }} fill={isLiked ? '#FF3D6B' : 'none'} />
            <span style={{ color: isLiked ? '#FF3D6B' : '#9A98B0', fontSize: '12px', fontWeight: 600, fontFamily: 'ui-monospace, monospace' }}>
              {post.likes + (isLiked && !likedPosts.has(post.id) ? 1 : 0)}
            </span>
          </button>
          <button className="flex items-center gap-1.5">
            <MessageSquare size={17} style={{ color: '#9A98B0' }} />
            <span style={{ color: '#9A98B0', fontSize: '12px', fontWeight: 600, fontFamily: 'ui-monospace, monospace' }}>
              {post.comments}
            </span>
          </button>
          <button><Share2 size={17} style={{ color: '#9A98B0' }} /></button>
        </div>
      </div>
    );
  };

  // SCREEN: Story Viewer
  const StoryViewerScreen = () => {
    const s = stories[activeStoryIdx];
    const prev = () => activeStoryIdx > 0 ? setActiveStoryIdx(activeStoryIdx - 1) : setScreen('feed');
    const next = () => activeStoryIdx < stories.length - 1 ? setActiveStoryIdx(activeStoryIdx + 1) : setScreen('feed');

    return (
      <Frame bg={s.gradient.split(',')[0].replace('linear-gradient(135deg', '').trim()}>
        <div className="h-full relative" style={{ background: s.gradient }}>
          {/* Progress bars */}
          <div className="absolute top-3 left-4 right-4 flex gap-1 z-30">
            {stories.map((_, i) => (
              <div key={i} className="flex-1 h-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }}>
                <div className="h-full rounded-full transition-all" style={{
                  background: '#F0EDE6',
                  width: i < activeStoryIdx ? '100%' : i === activeStoryIdx ? '40%' : '0%'
                }} />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: s.avatar }}>
                <span style={{ color: '#07060D', fontFamily: 'Impact, sans-serif', fontSize: '15px', fontWeight: 900 }}>{s.user[0]}</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>{s.user}</span>
                  {s.verified && <VerifiedBadge size={10} />}
                </div>
                <div style={{ color: 'rgba(240,237,230,0.8)', fontSize: '10px', fontFamily: 'ui-monospace, monospace' }}>{s.time} ago</div>
              </div>
            </div>
            <button onClick={() => setScreen('feed')}>
              <X size={24} style={{ color: '#F0EDE6' }} />
            </button>
          </div>

          {/* Tap zones */}
          <button onClick={prev} className="absolute left-0 top-0 bottom-0 w-1/3 z-10" />
          <button onClick={next} className="absolute right-0 top-0 bottom-0 w-1/3 z-10" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-10 pb-32 z-[5]">
            <div className="text-[120px] mb-6">{s.emoji}</div>
            <div style={{
              fontFamily: 'Impact, "Bebas Neue", sans-serif',
              fontSize: '28px',
              color: '#F0EDE6',
              fontWeight: 900,
              letterSpacing: '0.04em',
              textAlign: 'center',
              lineHeight: '1.1',
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
              maxWidth: '280px'
            }}>
              {s.text}
            </div>
          </div>

          {/* Reply bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.4))' }}>
            <div className="flex items-center gap-2">
              <input placeholder={`Reply to ${s.user.split(' ')[0]}...`} className="flex-1 px-4 py-3 rounded-full outline-none text-sm" style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#F0EDE6',
              }} />
              <button className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Heart size={18} style={{ color: '#F0EDE6' }} />
              </button>
            </div>
          </div>
        </div>
      </Frame>
    );
  };

  // SCREEN: Profile (Me)
  const ProfileMeScreen = () => (
    <Frame>
      <div className="h-full flex flex-col">
        {/* Hero */}
        <div className="relative" style={{ height: '200px', background: 'linear-gradient(135deg, #8B3FFF, #FF3D6B, #D4A843)' }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent, #07060D)' }} />
          <div className="absolute top-12 left-4 right-4 flex items-center justify-between z-10">
            <button onClick={() => setScreen('feed')}>
              <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
            </button>
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(7,6,13,0.5)', backdropFilter: 'blur(8px)' }}>
                <Share2 size={14} style={{ color: '#F0EDE6' }} />
              </button>
              <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(7,6,13,0.5)', backdropFilter: 'blur(8px)' }}>
                <MoreHorizontal size={14} style={{ color: '#F0EDE6' }} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 -mt-14 relative z-10">
          {/* Avatar + name */}
          <div className="flex items-end gap-3 mb-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: me.avatar, border: '3px solid #07060D' }}>
              <span style={{ color: '#07060D', fontFamily: 'Impact, sans-serif', fontSize: '36px', fontWeight: 900 }}>L</span>
            </div>
            <button className="flex-1 px-3 py-2 rounded-full text-xs font-bold mb-1" style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#F0EDE6',
              letterSpacing: '0.1em'
            }}>
              EDIT PROFILE
            </button>
          </div>

          <div className="flex items-center gap-1 mb-1">
            <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '26px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.02em' }}>
              {me.name}
            </div>
            <span style={{ color: '#9A98B0', fontSize: '14px' }}>· {me.age}</span>
          </div>
          <div style={{ color: '#8B3FFF', fontSize: '12px', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>
            {me.handle}
          </div>
          <div style={{ color: '#F0EDE6', fontSize: '13px', lineHeight: '1.5', marginBottom: '10px' }}>
            {me.bio}
          </div>
          <div className="flex flex-wrap gap-1 mb-4">
            {me.vibes.map(v => (
              <span key={v} className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: 'rgba(139,63,255,0.15)', color: '#8B3FFF', fontWeight: 600 }}>
                {v}
              </span>
            ))}
            <span className="px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1" style={{ color: '#9A98B0' }}>
              <MapPin size={9} /> {me.city}
            </span>
          </div>

          {/* Stats */}
          <div className="flex gap-2 mb-5">
            {[
              { label: 'FRIENDS', value: me.stats.friends, color: '#FF3D6B' },
              { label: 'FOLLOWERS', value: me.stats.followers, color: '#D4A843' },
              { label: 'FOLLOWING', value: me.stats.following, color: '#8B3FFF' },
              { label: 'PARTIES', value: me.stats.parties, color: '#00E5C8' },
            ].map(s => (
              <div key={s.label} className="flex-1 p-2 rounded-xl text-center" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: s.color, fontFamily: 'Impact, sans-serif', fontSize: '20px', fontWeight: 900 }}>{s.value}</div>
                <div style={{ color: '#6B6880', fontSize: '8px', letterSpacing: '0.15em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl mb-4" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { id: 'events', label: 'Events', icon: Calendar },
              { id: 'posts', label: 'Posts', icon: Image },
              { id: 'reviews', label: 'Reviews', icon: Star },
            ].map(t => (
              <button key={t.id} onClick={() => setProfileTab(t.id)} className="flex-1 py-2 rounded-lg text-xs flex items-center justify-center gap-1 transition-all"
                style={{
                  background: profileTab === t.id ? 'linear-gradient(135deg, #8B3FFF, #FF3D6B)' : 'transparent',
                  color: profileTab === t.id ? '#F0EDE6' : '#9A98B0',
                  fontWeight: profileTab === t.id ? 700 : 500
                }}>
                <t.icon size={12} /> {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {profileTab === 'events' && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { g: 'linear-gradient(135deg, #FF3D6B, #D4A843)', e: '🎷' },
                { g: 'linear-gradient(135deg, #00E5C8, #D4A843)', e: '🏖️' },
                { g: 'linear-gradient(135deg, #8B3FFF, #FF3D6B)', e: '🌙' },
                { g: 'linear-gradient(135deg, #D4A843, #F0C96A)', e: '🎶' },
                { g: 'linear-gradient(135deg, #FF3D6B, #8B3FFF)', e: '🎛️' },
                { g: 'linear-gradient(135deg, #00E5C8, #8B3FFF)', e: '🌅' },
              ].map((c, i) => (
                <div key={i} className="relative aspect-square rounded-lg flex items-center justify-center text-4xl" style={{ background: c.g }}>
                  {c.e}
                </div>
              ))}
            </div>
          )}
          {profileTab === 'posts' && (
            <div className="py-8 text-center">
              <Image size={32} style={{ color: '#6B6880', margin: '0 auto 8px' }} />
              <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>Share your first post</div>
              <div style={{ color: '#9A98B0', fontSize: '11px' }}>Stories · photos · thoughts</div>
            </div>
          )}
          {profileTab === 'reviews' && (
            <div className="py-8 text-center">
              <Star size={32} style={{ color: '#6B6880', margin: '0 auto 8px' }} />
              <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>No reviews yet</div>
              <div style={{ color: '#9A98B0', fontSize: '11px' }}>Write your first after a night out</div>
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    </Frame>
  );

  // SCREEN: Profile (Other User)
  const ProfileOtherScreen = () => {
    const user = typeof selectedUser === 'string' ? accounts[selectedUser] : people[selectedUser];
    if (!user) return null;
    const isFriend = friends.has(user.id);
    const isFollowing = following.has(user.id);
    const isAccount = typeof user.id === 'string';

    const toggleFriend = () => {
      const next = new Set(friends);
      if (next.has(user.id)) next.delete(user.id); else next.add(user.id);
      setFriends(next);
    };
    const toggleFollow = () => {
      const next = new Set(following);
      if (next.has(user.id)) next.delete(user.id); else next.add(user.id);
      setFollowing(next);
    };

    return (
      <Frame>
        <div className="h-full flex flex-col">
          {/* Hero */}
          <div className="relative" style={{ height: '160px', background: typeof user.avatar === 'string' && user.avatar.includes('gradient') ? user.avatar : `linear-gradient(135deg, ${user.avatar}, #07060D)` }}>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent, #07060D)' }} />
            <div className="absolute top-12 left-4 right-4 flex items-center justify-between z-10">
              <button onClick={() => setScreen('feed')}>
                <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
              </button>
              <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(7,6,13,0.5)', backdropFilter: 'blur(8px)' }}>
                <MoreHorizontal size={14} style={{ color: '#F0EDE6' }} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 -mt-12 relative z-10">
            {/* Avatar */}
            <div className="flex items-end gap-3 mb-3">
              <div className="w-20 h-20 rounded-full flex items-center justify-center relative" style={{
                background: user.avatar,
                border: '3px solid #07060D'
              }}>
                <span style={{ color: '#07060D', fontFamily: 'Impact, sans-serif', fontSize: '34px', fontWeight: 900 }}>
                  {user.name[0]}
                </span>
                {user.verified && (
                  <div className="absolute -bottom-1 -right-1">
                    <VerifiedBadge size={18} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 mb-1">
              <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '24px', color: '#F0EDE6', fontWeight: 900 }}>
                {user.name}
              </div>
              {!isAccount && <span style={{ color: '#9A98B0', fontSize: '13px' }}>· {user.age}</span>}
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color: '#8B3FFF', fontSize: '12px', fontFamily: 'ui-monospace, monospace' }}>{user.handle}</span>
              {isAccount && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{
                  background: user.type === 'Venue' ? 'rgba(255,61,107,0.15)' : user.type === 'DJ' ? 'rgba(139,63,255,0.15)' : 'rgba(212,168,67,0.15)',
                  color: user.type === 'Venue' ? '#FF3D6B' : user.type === 'DJ' ? '#8B3FFF' : '#D4A843',
                  letterSpacing: '0.15em'
                }}>
                  {user.type.toUpperCase()}
                </span>
              )}
            </div>
            <div style={{ color: '#F0EDE6', fontSize: '13px', lineHeight: '1.5', marginBottom: '10px' }}>
              {user.bio}
            </div>

            {!isAccount && user.vibes && (
              <div className="flex flex-wrap gap-1 mb-4">
                {user.vibes.map(v => (
                  <span key={v} className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: 'rgba(139,63,255,0.15)', color: '#8B3FFF', fontWeight: 600 }}>
                    {v}
                  </span>
                ))}
              </div>
            )}

            {/* Mutual */}
            {!isAccount && user.mutual && (
              <div className="flex items-center gap-2 p-2 rounded-lg mb-4" style={{ background: 'rgba(0,229,200,0.05)', border: '1px solid rgba(0,229,200,0.15)' }}>
                <div className="flex -space-x-2">
                  {['#D4A843', '#FF3D6B', '#8B3FFF'].map((c, i) => (
                    <div key={i} className="w-5 h-5 rounded-full border-2" style={{ background: c, borderColor: '#07060D' }} />
                  ))}
                </div>
                <span style={{ color: '#00E5C8', fontSize: '11px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em', fontWeight: 700 }}>
                  {user.mutual} MUTUAL FRIENDS
                </span>
              </div>
            )}

            {/* Actions */}
            {isAccount ? (
              <div className="flex gap-2 mb-5">
                <button onClick={toggleFollow} className="flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95" style={{
                  background: isFollowing ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #8B3FFF, #FF3D6B)',
                  color: isFollowing ? '#F0EDE6' : '#F0EDE6',
                  border: isFollowing ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  letterSpacing: '0.15em'
                }}>
                  {isFollowing ? <><Check size={13} /> FOLLOWING</> : <><Plus size={13} strokeWidth={3} /> FOLLOW</>}
                </button>
                <button onClick={() => { setSelectedDm({ userId: user.id, user: user.name, avatar: user.avatar, verified: user.verified }); setScreen('dm-conversation'); }} className="flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5" style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: '#F0EDE6',
                  border: '1px solid rgba(255,255,255,0.1)',
                  letterSpacing: '0.15em'
                }}>
                  <MessageCircle size={13} /> MESSAGE
                </button>
              </div>
            ) : (
              <div className="flex gap-2 mb-5">
                <button onClick={toggleFriend} className="flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95" style={{
                  background: isFriend ? 'rgba(0,229,200,0.1)' : 'linear-gradient(135deg, #8B3FFF, #FF3D6B)',
                  color: isFriend ? '#00E5C8' : '#F0EDE6',
                  border: isFriend ? '1px solid rgba(0,229,200,0.3)' : 'none',
                  letterSpacing: '0.15em'
                }}>
                  {isFriend ? <><UserCheck size={13} /> FRIENDS</> : <><UserPlus size={13} /> ADD FRIEND</>}
                </button>
                <button onClick={() => { setSelectedDm({ userId: user.id, user: user.name, avatar: user.avatar, verified: user.verified }); setScreen('dm-conversation'); }} className="flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5" style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: '#F0EDE6',
                  border: '1px solid rgba(255,255,255,0.1)',
                  letterSpacing: '0.15em'
                }}>
                  <MessageCircle size={13} /> MESSAGE
                </button>
              </div>
            )}

            {/* Recent activity */}
            <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '10px' }}>
              RECENT ACTIVITY
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { g: 'linear-gradient(135deg, #FF3D6B, #D4A843)', e: '🎷' },
                { g: 'linear-gradient(135deg, #00E5C8, #D4A843)', e: '🏖️' },
                { g: 'linear-gradient(135deg, #8B3FFF, #FF3D6B)', e: '🌙' },
              ].map((c, i) => (
                <div key={i} className="aspect-square rounded-lg flex items-center justify-center text-3xl" style={{ background: c.g }}>
                  {c.e}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Frame>
    );
  };

  // SCREEN: Search / Discover
  const SearchScreen = () => {
    const tabs = [
      { id: 'people', label: 'People', icon: Users },
      { id: 'venues', label: 'Venues', icon: Home },
      { id: 'hosts', label: 'Hosts', icon: Sparkles },
      { id: 'djs', label: 'DJs', icon: Music },
    ];

    const getResults = () => {
      if (searchTab === 'people') return Object.values(people);
      if (searchTab === 'venues') return Object.values(accounts).filter(a => a.type === 'Venue');
      if (searchTab === 'hosts') return Object.values(accounts).filter(a => a.type === 'Host');
      if (searchTab === 'djs') return Object.values(accounts).filter(a => a.type === 'DJ');
      return [];
    };
    const results = getResults().filter(r => !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const isPeople = searchTab === 'people';

    return (
      <Frame>
        <div className="h-full flex flex-col">
          <div className="px-5 pt-12 pb-2">
            <div style={{ color: '#8B3FFF', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '4px' }}>
              DISCOVER YOUR SCENE
            </div>
            <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '28px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.02em', marginBottom: '16px' }}>
              Find Your People.
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3" style={{ background: '#10101E', border: '1px solid rgba(139,63,255,0.2)' }}>
              <Search size={14} style={{ color: '#8B3FFF' }} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Name, @handle, or venue..."
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: '#F0EDE6' }}
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 mb-2" style={{ scrollbarWidth: 'none' }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setSearchTab(t.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all flex-shrink-0" style={{
                  background: searchTab === t.id ? 'linear-gradient(135deg, #8B3FFF, #FF3D6B)' : 'rgba(255,255,255,0.04)',
                  color: searchTab === t.id ? '#F0EDE6' : '#9A98B0',
                  border: searchTab === t.id ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  fontWeight: searchTab === t.id ? 700 : 500
                }}>
                  <t.icon size={11} /> {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-3">
            {isPeople && !searchQuery && (
              <div className="mb-4">
                <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>
                  ✨ IN YOUR SCENE
                </div>
                <div className="p-3 rounded-xl mb-3" style={{ background: 'linear-gradient(135deg, rgba(139,63,255,0.08), rgba(255,61,107,0.05))', border: '1px solid rgba(139,63,255,0.2)' }}>
                  <div className="flex items-center gap-2">
                    <Zap size={14} style={{ color: '#8B3FFF' }} />
                    <span style={{ color: '#F0EDE6', fontSize: '12px', fontWeight: 700 }}>People with similar vibes</span>
                  </div>
                  <div style={{ color: '#9A98B0', fontSize: '11px', marginTop: '2px' }}>
                    Based on House · Techno · Rooftop
                  </div>
                </div>
              </div>
            )}

            <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>
              {searchQuery ? `RESULTS · ${results.length}` : 'SUGGESTED'}
            </div>
            <div className="flex flex-col gap-2">
              {results.map(r => {
                const isFriend = friends.has(r.id);
                const isFollow = following.has(r.id);
                return (
                  <button key={r.id} onClick={() => { setSelectedUser(r.id); setScreen('profile-other'); }} className="p-3 rounded-xl flex items-center gap-3 active:scale-[0.98] transition-transform" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="relative flex-shrink-0">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: r.avatar }}>
                        <span style={{ color: '#07060D', fontFamily: 'Impact, sans-serif', fontSize: '17px', fontWeight: 900 }}>
                          {r.name[0]}
                        </span>
                      </div>
                      {r.verified && (
                        <div className="absolute -bottom-1 -right-1">
                          <VerifiedBadge size={10} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-1">
                        <span style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>{r.name}</span>
                        {r.type && (
                          <span className="px-1 py-0.5 rounded text-[8px] font-bold" style={{
                            background: r.type === 'Venue' ? 'rgba(255,61,107,0.15)' : r.type === 'DJ' ? 'rgba(139,63,255,0.15)' : 'rgba(212,168,67,0.15)',
                            color: r.type === 'Venue' ? '#FF3D6B' : r.type === 'DJ' ? '#8B3FFF' : '#D4A843',
                            letterSpacing: '0.1em'
                          }}>
                            {r.type.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div style={{ color: '#9A98B0', fontSize: '11px', lineHeight: '1.3' }}>{r.bio}</div>
                      {isPeople ? (
                        r.mutual > 0 && (
                          <div style={{ color: '#00E5C8', fontSize: '10px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em', marginTop: '2px' }}>
                            {r.mutual} MUTUAL
                          </div>
                        )
                      ) : (
                        <div style={{ color: '#6B6880', fontSize: '10px', fontFamily: 'ui-monospace, monospace', marginTop: '2px' }}>
                          {r.followers?.toLocaleString()} FOLLOWERS
                        </div>
                      )}
                    </div>
                    <div className="px-2.5 py-1.5 rounded-full text-[10px] font-bold flex-shrink-0" style={{
                      background: (isPeople ? isFriend : isFollow) ? 'rgba(0,229,200,0.1)' : 'linear-gradient(135deg, #8B3FFF, #FF3D6B)',
                      color: (isPeople ? isFriend : isFollow) ? '#00E5C8' : '#F0EDE6',
                      border: (isPeople ? isFriend : isFollow) ? '1px solid rgba(0,229,200,0.3)' : 'none',
                      letterSpacing: '0.1em'
                    }}>
                      {isPeople ? (isFriend ? 'FRIENDS' : 'ADD') : (isFollow ? 'FOLLOWING' : 'FOLLOW')}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <BottomNav />
        </div>
      </Frame>
    );
  };

  // SCREEN: DMs list
  const DMsScreen = () => (
    <Frame>
      <div className="h-full flex flex-col">
        <div className="px-5 pt-12 pb-3">
          <div style={{ color: '#8B3FFF', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '4px' }}>
            INBOX · 2 UNREAD
          </div>
          <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '28px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.02em', marginBottom: '12px' }}>
            Messages.
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Search size={13} style={{ color: '#6B6880' }} />
            <input placeholder="Search conversations..." className="flex-1 bg-transparent outline-none text-sm" style={{ color: '#F0EDE6' }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map(c => (
            <button key={c.id} onClick={() => { setSelectedDm(c); setScreen('dm-conversation'); }} className="w-full px-5 py-3 flex items-center gap-3 active:bg-white/5 transition-colors">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: c.avatar }}>
                  <span style={{ color: '#07060D', fontFamily: 'Impact, sans-serif', fontSize: '18px', fontWeight: 900 }}>{c.user[0]}</span>
                </div>
                {c.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2" style={{ background: '#00E5C8', borderColor: '#07060D' }} />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: c.unread > 0 ? 800 : 600 }}>{c.user}</span>
                    {c.verified && <VerifiedBadge size={10} />}
                  </div>
                  <span style={{ color: c.unread > 0 ? '#8B3FFF' : '#6B6880', fontSize: '10px', fontFamily: 'ui-monospace, monospace', fontWeight: c.unread > 0 ? 700 : 500 }}>
                    {c.time}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span style={{ color: c.unread > 0 ? '#F0EDE6' : '#9A98B0', fontSize: '12px', fontWeight: c.unread > 0 ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, paddingRight: '8px' }}>
                    {c.lastMsg}
                  </span>
                  {c.unread > 0 && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #8B3FFF, #FF3D6B)' }}>
                      <span style={{ color: '#F0EDE6', fontSize: '10px', fontWeight: 900 }}>{c.unread}</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        <BottomNav />
      </div>
    </Frame>
  );

  // SCREEN: DM Conversation
  const DMConversationScreen = () => {
    if (!selectedDm) return null;
    const baseMessages = mockMessages[selectedDm.id] || mockMessages.c1 || [];
    const extraMessages = liveMessages[selectedDm.id] || [];
    const allMessages = [...baseMessages, ...extraMessages];

    const sendMessage = () => {
      if (!messageInput.trim()) return;
      const newMsg = { id: Date.now(), from: 'me', text: messageInput, time: 'Now' };
      setLiveMessages({ ...liveMessages, [selectedDm.id]: [...extraMessages, newMsg] });
      setMessageInput('');
    };

    return (
      <Frame>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-4 pt-12 pb-3 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={() => setScreen('dms')}>
              <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
            </button>
            <button onClick={() => { setSelectedUser(selectedDm.userId); setScreen('profile-other'); }} className="flex items-center gap-2 flex-1">
              <div className="relative">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: selectedDm.avatar }}>
                  <span style={{ color: '#07060D', fontFamily: 'Impact, sans-serif', fontSize: '14px', fontWeight: 900 }}>{selectedDm.user[0]}</span>
                </div>
                {selectedDm.online && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2" style={{ background: '#00E5C8', borderColor: '#07060D' }} />
                )}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>{selectedDm.user}</span>
                  {selectedDm.verified && <VerifiedBadge size={10} />}
                </div>
                <div style={{ color: selectedDm.online ? '#00E5C8' : '#9A98B0', fontSize: '10px', fontFamily: 'ui-monospace, monospace' }}>
                  {selectedDm.online ? 'ACTIVE NOW' : 'ACTIVE 2H AGO'}
                </div>
              </div>
            </button>
            <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#10101E' }}>
              <Phone size={14} style={{ color: '#8B3FFF' }} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
            <div className="text-center mb-2">
              <span style={{ color: '#6B6880', fontSize: '10px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.15em' }}>
                TODAY · 5:42 PM
              </span>
            </div>
            {allMessages.map(m => (
              <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[75%]">
                  {m.shareEvent && (
                    <div className="rounded-xl overflow-hidden mb-1" style={{ background: m.shareEvent.gradient, minWidth: '200px' }}>
                      <div className="p-3">
                        <div style={{ color: 'rgba(7,6,13,0.7)', fontSize: '9px', letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>
                          🎟️ SHARED EVENT
                        </div>
                        <div style={{ color: '#07060D', fontSize: '14px', fontWeight: 800, fontFamily: 'Impact, sans-serif', letterSpacing: '0.02em' }}>
                          {m.shareEvent.name.toUpperCase()}
                        </div>
                        <div style={{ color: '#07060D', fontSize: '11px', opacity: 0.8, fontWeight: 600 }}>
                          {m.shareEvent.venue}
                        </div>
                        <div style={{ color: '#07060D', fontSize: '10px', fontFamily: 'ui-monospace, monospace', marginTop: '4px', fontWeight: 700 }}>
                          {m.shareEvent.time}
                        </div>
                      </div>
                    </div>
                  )}
                  {m.text && (
                    <div className="px-3 py-2 rounded-2xl" style={{
                      background: m.from === 'me' ? 'linear-gradient(135deg, #8B3FFF, #FF3D6B)' : '#10101E',
                      color: '#F0EDE6',
                      fontSize: '13px',
                      lineHeight: '1.4',
                      borderTopRightRadius: m.from === 'me' ? '4px' : '16px',
                      borderTopLeftRadius: m.from === 'them' ? '4px' : '16px',
                    }}>
                      {m.text}
                    </div>
                  )}
                  <div className="text-[9px] px-1 mt-0.5" style={{ color: '#6B6880', fontFamily: 'ui-monospace, monospace', textAlign: m.from === 'me' ? 'right' : 'left' }}>
                    {m.time}
                  </div>
                </div>
              </div>
            ))}
            {/* Typing indicator */}
            {selectedDm.online && extraMessages.length === 0 && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-2xl" style={{ background: '#10101E' }}>
                  <div className="flex gap-1">
                    {[0, 200, 400].map(d => (
                      <div key={d} className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#8B3FFF', animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-3 pt-2 pb-4 flex items-center gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#10101E' }}>
              <Image size={16} style={{ color: '#8B3FFF' }} />
            </button>
            <div className="flex-1 flex items-center gap-1 px-3 py-2 rounded-full" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
              <input
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Message..."
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: '#F0EDE6' }}
              />
              <button><Smile size={16} style={{ color: '#6B6880' }} /></button>
            </div>
            {messageInput ? (
              <button onClick={sendMessage} className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #8B3FFF, #FF3D6B)' }}>
                <Send size={14} style={{ color: '#F0EDE6' }} />
              </button>
            ) : (
              <button className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#10101E' }}>
                <Mic size={16} style={{ color: '#8B3FFF' }} />
              </button>
            )}
          </div>
        </div>
      </Frame>
    );
  };

  // SCREEN: Create Post
  const CreatePostScreen = () => {
    const tabs = [
      { id: 'photo', label: 'Story', icon: Camera, color: '#8B3FFF' },
      { id: 'text', label: 'Post', icon: MessageSquare, color: '#FF3D6B' },
      { id: 'checkin', label: 'Check-in', icon: MapPin, color: '#D4A843' },
      { id: 'review', label: 'Review', icon: Star, color: '#00E5C8' },
    ];

    return (
      <Frame>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-4 pt-12 pb-3 flex items-center justify-between">
            <button onClick={() => setScreen('feed')}>
              <X size={24} style={{ color: '#F0EDE6' }} />
            </button>
            <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '18px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.04em' }}>
              NEW {createTab.toUpperCase()}
            </div>
            <button
              onClick={() => {
                if (createTab === 'review') setScreen('write-review');
                else setScreen('feed');
              }}
              disabled={createTab === 'text' && !postText}
              className="px-3 py-1 rounded-full text-xs font-bold disabled:opacity-30"
              style={{
                background: 'linear-gradient(135deg, #8B3FFF, #FF3D6B)',
                color: '#F0EDE6',
                letterSpacing: '0.1em'
              }}
            >
              POST
            </button>
          </div>

          {/* Tabs */}
          <div className="px-4 pb-3">
            <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {tabs.map(t => (
                <button key={t.id} onClick={() => setCreateTab(t.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all flex-shrink-0" style={{
                  background: createTab === t.id ? `${t.color}20` : 'rgba(255,255,255,0.04)',
                  color: createTab === t.id ? t.color : '#9A98B0',
                  border: createTab === t.id ? `1px solid ${t.color}60` : '1px solid rgba(255,255,255,0.08)',
                  fontWeight: createTab === t.id ? 700 : 500
                }}>
                  <t.icon size={11} /> {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {createTab === 'photo' && (
              <>
                <div className="relative rounded-2xl mb-3 flex items-center justify-center text-6xl" style={{
                  height: '320px',
                  background: 'linear-gradient(135deg, #8B3FFF, #FF3D6B, #D4A843)',
                }}>
                  <div className="absolute inset-0 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(7,6,13,0.3)' }}>
                    <div className="flex flex-col items-center">
                      <Camera size={40} style={{ color: '#F0EDE6', marginBottom: '8px' }} />
                      <span style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>Tap to take photo</span>
                      <span style={{ color: 'rgba(240,237,230,0.7)', fontSize: '11px' }}>or choose from gallery</span>
                    </div>
                  </div>
                </div>
                <input placeholder="Add a caption..." className="w-full px-4 py-3 rounded-xl outline-none mb-3" style={{ background: '#10101E', border: '1px solid rgba(139,63,255,0.2)', color: '#F0EDE6', fontSize: '14px' }} />
                <button className="w-full p-3 rounded-xl flex items-center gap-2" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <MapPin size={14} style={{ color: '#D4A843' }} />
                  <span style={{ color: '#9A98B0', fontSize: '13px' }}>Add location</span>
                </button>
              </>
            )}

            {createTab === 'text' && (
              <>
                <textarea
                  value={postText}
                  onChange={e => setPostText(e.target.value.slice(0, 280))}
                  placeholder="What's on your mind?"
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl outline-none resize-none mb-2"
                  style={{ background: '#10101E', border: '1px solid rgba(255,61,107,0.2)', color: '#F0EDE6', fontSize: '15px', lineHeight: '1.5' }}
                />
                <div className="text-right mb-3">
                  <span style={{ color: '#9A98B0', fontSize: '11px', fontFamily: 'ui-monospace, monospace' }}>
                    {postText.length}/280
                  </span>
                </div>
              </>
            )}

            {createTab === 'checkin' && (
              <>
                <div className="rounded-2xl p-4 mb-3 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.1), rgba(255,61,107,0.05))', border: '1px solid rgba(212,168,67,0.3)' }}>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #FF3D6B, #D4A843)' }}>
                    🎷
                  </div>
                  <div className="flex-1">
                    <div style={{ color: '#D4A843', fontSize: '9px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>
                      📍 CHECKING IN AT
                    </div>
                    <div style={{ color: '#F0EDE6', fontSize: '14px', fontWeight: 700 }}>Cairo Jazz Club</div>
                    <div style={{ color: '#9A98B0', fontSize: '11px' }}>Zamalek · Cairo</div>
                  </div>
                  <Check size={18} style={{ color: '#D4A843' }} />
                </div>
                <input placeholder="Say something..." className="w-full px-4 py-3 rounded-xl outline-none mb-3" style={{ background: '#10101E', border: '1px solid rgba(212,168,67,0.2)', color: '#F0EDE6', fontSize: '14px' }} />
                <div className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: 'rgba(0,229,200,0.05)', border: '1px solid rgba(0,229,200,0.15)' }}>
                  <Eye size={12} style={{ color: '#00E5C8', flexShrink: 0 }} />
                  <span style={{ color: '#9A98B0', fontSize: '11px', lineHeight: '1.4' }}>
                    Your friends will see you're here
                  </span>
                </div>
              </>
            )}

            {createTab === 'review' && (
              <div className="py-8 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(0,229,200,0.1)', border: '1px solid rgba(0,229,200,0.3)' }}>
                  <Star size={28} style={{ color: '#00E5C8' }} />
                </div>
                <div style={{ color: '#F0EDE6', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
                  Review a recent event
                </div>
                <div style={{ color: '#9A98B0', fontSize: '12px', marginBottom: '20px' }}>
                  Help others discover the scene
                </div>
                <button
                  onClick={() => setScreen('write-review')}
                  className="px-5 py-2.5 rounded-full text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, #00E5C8, #D4A843)', color: '#07060D', letterSpacing: '0.1em' }}
                >
                  START REVIEW →
                </button>
              </div>
            )}
          </div>
        </div>
      </Frame>
    );
  };

  // SCREEN: Write Review
  const WriteReviewScreen = () => {
    const vibeOptions = ['Great crowd', 'Amazing music', 'Worth it', 'Good vibes', 'Strong drinks', 'Packed', 'Intimate', 'DJ set 🔥', 'Would return', 'Safe', 'Friendly staff'];
    const toggle = (v) => setReviewVibes(reviewVibes.includes(v) ? reviewVibes.filter(x => x !== v) : [...reviewVibes, v]);

    return (
      <Frame>
        <div className="h-full flex flex-col px-5 pt-12 pb-6">
          <button onClick={() => setScreen('create-post')} className="self-start mb-3">
            <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
          </button>

          <div style={{ color: '#00E5C8', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '6px' }}>
            WRITE A REVIEW
          </div>
          <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '30px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.03em', lineHeight: '1', marginBottom: '16px' }}>
            HOW WAS<br/>LAST NIGHT?
          </div>

          {/* Event card */}
          <div className="p-3 rounded-xl mb-5 flex items-center gap-3" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #FF3D6B, #D4A843)' }}>
              🎷
            </div>
            <div className="flex-1">
              <div style={{ color: '#F0EDE6', fontSize: '13px', fontWeight: 700 }}>Techno Night</div>
              <div style={{ color: '#9A98B0', fontSize: '11px' }}>Cairo Jazz Club · Last night</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Rating */}
            <div className="mb-5 text-center">
              <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '10px' }}>
                YOUR RATING
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <button key={i} onClick={() => setReviewRating(i)} className="transition-transform active:scale-90">
                    <Star size={36} style={{ color: i <= reviewRating ? '#D4A843' : '#3A3A4A' }} fill={i <= reviewRating ? '#D4A843' : 'none'} />
                  </button>
                ))}
              </div>
              {reviewRating > 0 && (
                <div style={{ color: '#D4A843', fontSize: '13px', fontWeight: 700, fontFamily: 'Impact, sans-serif', letterSpacing: '0.05em' }}>
                  {['', 'NOT GREAT', 'IT WAS OK', 'SOLID', 'REALLY GOOD', 'ABSOLUTE FIRE 🔥'][reviewRating]}
                </div>
              )}
            </div>

            {/* Vibes */}
            <div className="mb-5">
              <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>
                VIBE CHECK · {reviewVibes.length} SELECTED
              </div>
              <div className="flex flex-wrap gap-2">
                {vibeOptions.map(v => (
                  <button key={v} onClick={() => toggle(v)} className="px-3 py-1.5 rounded-full text-xs transition-all" style={{
                    background: reviewVibes.includes(v) ? 'linear-gradient(135deg, #00E5C8, #D4A843)' : 'rgba(255,255,255,0.04)',
                    color: reviewVibes.includes(v) ? '#07060D' : '#9A98B0',
                    border: reviewVibes.includes(v) ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    fontWeight: reviewVibes.includes(v) ? 700 : 500
                  }}>
                    {reviewVibes.includes(v) && '✓ '}{v}
                  </button>
                ))}
              </div>
            </div>

            {/* Text */}
            <div className="mb-3">
              <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>
                TELL US MORE (OPTIONAL)
              </div>
              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value.slice(0, 300))}
                placeholder="Sound system, crowd, service..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                style={{ background: '#10101E', border: '1px solid rgba(0,229,200,0.2)', color: '#F0EDE6', fontSize: '13px', lineHeight: '1.5' }}
              />
              <div className="text-right mt-1">
                <span style={{ color: '#9A98B0', fontSize: '10px', fontFamily: 'ui-monospace, monospace' }}>
                  {reviewText.length}/300
                </span>
              </div>
            </div>
          </div>

          <PurpleButton variant="gold" onClick={() => setScreen('feed')} disabled={reviewRating === 0}>
            POST REVIEW ⭐
          </PurpleButton>
        </div>
      </Frame>
    );
  };

  // SCREEN: Notifications
  const NotificationsScreen = () => {
    const acceptRequest = (userId) => {
      const next = new Set(friends);
      next.add(userId);
      setFriends(next);
      setFriendRequests(friendRequests.filter(r => r.userId !== userId));
    };
    const declineRequest = (userId) => {
      setFriendRequests(friendRequests.filter(r => r.userId !== userId));
    };

    return (
      <Frame>
        <div className="h-full flex flex-col">
          <div className="px-5 pt-12 pb-3 flex items-center gap-3">
            <button onClick={() => setScreen('feed')}>
              <ChevronLeft size={24} style={{ color: '#F0EDE6' }} />
            </button>
            <div>
              <div style={{ color: '#8B3FFF', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace' }}>
                ACTIVITY
              </div>
              <div style={{ fontFamily: 'Impact, "Bebas Neue", sans-serif', fontSize: '24px', color: '#F0EDE6', fontWeight: 900, letterSpacing: '0.02em' }}>
                Notifications
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-3">
            <div style={{ color: '#6B6880', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'ui-monospace, monospace', marginBottom: '8px' }}>
              TODAY
            </div>
            <div className="flex flex-col gap-2 mb-5">
              {notifications.map(n => {
                const isPending = n.type === 'friend-request' && friendRequests.some(r => r.userId === n.userId);
                return (
                  <div key={n.id} className="p-3 rounded-xl flex items-start gap-3" style={{
                    background: n.type === 'friend-request' && isPending ? 'rgba(139,63,255,0.06)' : '#10101E',
                    border: `1px solid ${n.type === 'friend-request' && isPending ? 'rgba(139,63,255,0.2)' : 'rgba(255,255,255,0.06)'}`
                  }}>
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: n.avatar }}>
                        <span style={{ color: '#07060D', fontFamily: 'Impact, sans-serif', fontSize: '16px', fontWeight: 900 }}>{n.user[0]}</span>
                      </div>
                      {n.verified && (
                        <div className="absolute -bottom-1 -right-1">
                          <VerifiedBadge size={10} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div style={{ color: '#F0EDE6', fontSize: '12px', lineHeight: '1.4' }}>
                        <span style={{ fontWeight: 700 }}>{n.user}</span>{' '}
                        <span style={{ color: '#9A98B0' }}>{n.action}</span>
                        {n.target && <span style={{ color: '#D4A843', fontWeight: 700 }}> {n.target}</span>}
                      </div>
                      {n.type === 'friend-request' && n.mutual && (
                        <div style={{ color: '#00E5C8', fontSize: '10px', fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em', marginTop: '3px' }}>
                          {n.mutual} MUTUAL FRIENDS
                        </div>
                      )}
                      <div style={{ color: '#6B6880', fontSize: '10px', fontFamily: 'ui-monospace, monospace', marginTop: '3px' }}>
                        {n.time} ago
                      </div>
                      {n.type === 'friend-request' && isPending && (
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => declineRequest(n.userId)} className="px-3 py-1.5 rounded-lg text-[10px] font-bold" style={{ background: 'rgba(255,255,255,0.06)', color: '#9A98B0', letterSpacing: '0.1em' }}>
                            DECLINE
                          </button>
                          <button onClick={() => acceptRequest(n.userId)} className="px-3 py-1.5 rounded-lg text-[10px] font-bold" style={{ background: 'linear-gradient(135deg, #8B3FFF, #FF3D6B)', color: '#F0EDE6', letterSpacing: '0.1em' }}>
                            ACCEPT
                          </button>
                        </div>
                      )}
                      {n.type === 'friend-request' && !isPending && (
                        <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,229,200,0.1)', border: '1px solid rgba(0,229,200,0.3)' }}>
                          <Check size={10} style={{ color: '#00E5C8' }} />
                          <span style={{ color: '#00E5C8', fontSize: '9px', letterSpacing: '0.15em', fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>
                            FRIENDS
                          </span>
                        </div>
                      )}
                    </div>
                    {n.type !== 'friend-request' && (
                      <ChevronRight size={14} style={{ color: '#6B6880', marginTop: '4px' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Frame>
    );
  };

  // =========== RENDER ===========
  const screens = {
    'feed': FeedScreen,
    'story-viewer': StoryViewerScreen,
    'create-post': CreatePostScreen,
    'write-review': WriteReviewScreen,
    'profile-me': ProfileMeScreen,
    'profile-other': ProfileOtherScreen,
    'search': SearchScreen,
    'dms': DMsScreen,
    'dm-conversation': DMConversationScreen,
    'notifications': NotificationsScreen,
  };

  const flowLabel = {
    'feed': 'Activity Feed',
    'story-viewer': 'Story Viewer',
    'create-post': 'Create Post',
    'write-review': 'Write Review',
    'profile-me': 'My Profile',
    'profile-other': 'Someone\'s Profile',
    'search': 'Discover',
    'dms': 'Inbox',
    'dm-conversation': 'Chat',
    'notifications': 'Notifications',
  };

  const CurrentScreen = screens[screen];

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4" style={{ background: '#0A0910' }}>
      <div className="mb-6 text-center">
        <div style={{
          fontFamily: 'Impact, "Bebas Neue", sans-serif',
          fontSize: '32px',
          letterSpacing: '0.05em',
          background: 'linear-gradient(135deg, #8B3FFF, #FF3D6B, #D4A843)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 900
        }}>
          PHASE 04 · COMMUNITY
        </div>
        <div style={{ color: '#6B6880', fontSize: '11px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginTop: '4px' }}>
          LAYLA · FEED · STORIES · DMS · REVIEWS
        </div>
      </div>

      <div className="flex gap-8 items-start flex-wrap justify-center">
        {/* Phone */}
        <div className="relative" style={{ width: '340px', height: '700px' }}>
          <div className="absolute inset-0 rounded-[44px] overflow-hidden" style={{
            background: '#000',
            padding: '10px',
            boxShadow: '0 40px 80px rgba(139,63,255,0.15), 0 0 0 2px #1a1a22, 0 0 0 3px #333'
          }}>
            <div className="w-full h-full rounded-[36px] overflow-hidden relative">
              <CurrentScreen />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 rounded-b-2xl z-50" style={{ background: '#000' }} />
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="w-72 p-4 rounded-2xl" style={{ background: '#10101E', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ color: '#8B3FFF', fontSize: '10px', letterSpacing: '0.3em', fontFamily: 'ui-monospace, monospace', marginBottom: '12px' }}>
            ⚡ JUMP TO SCREEN
          </div>
          <div className="flex flex-col gap-1">
            {Object.keys(screens).map((s, i) => (
              <button key={s} onClick={() => {
                if (s === 'profile-other' && !selectedUser) setSelectedUser(1);
                if (s === 'dm-conversation' && !selectedDm) setSelectedDm(conversations[0]);
                setScreen(s);
              }} className="text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between" style={{
                background: screen === s ? 'rgba(139,63,255,0.15)' : 'transparent',
                color: screen === s ? '#8B3FFF' : '#9A98B0',
                border: screen === s ? '1px solid rgba(139,63,255,0.3)' : '1px solid transparent',
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
              TRY THIS
            </div>
            <div style={{ color: '#9A98B0', fontSize: '11px', lineHeight: '1.5' }}>
              Feed → tap a story → swipe back<br/>
              Feed → tap 🔔 → accept Omar's request<br/>
              Inbox → Karim's chat → send a message<br/>
              + button → Review → rate 5 ⭐
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
