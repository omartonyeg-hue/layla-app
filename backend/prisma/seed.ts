import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Dev seed — 4 events modelled after the copy in events-v2.jsx.
const EVENTS = [
  {
    name: 'Sahel Sunset Rave 2026',
    venue: 'Six Eight',
    location: 'Sidi Heneish · 120km west',
    description:
      'Season opener at the iconic Six Eight. Sunset-to-sunrise on the shore — house and techno on the main, afro on the west deck.',
    startsAt: new Date('2026-04-24T19:00:00Z'),
    gradient: 'sunset',
    lineup: 'Aguizi & Fahim · Misty · Ahmed Samy',
    tag: 'HOT',
    featured: true,
    city: 'SAHEL' as const,
    tiers: [
      { name: 'Standard',       description: 'General admission',                      priceEgp: 800,  stockTotal: 500, stockLeft: 212, sortOrder: 0 },
      { name: 'VIP',            description: 'Priority entry + VIP bar',               priceEgp: 1200, stockTotal: 120, stockLeft: 38,  sortOrder: 1 },
      { name: 'Table (4 pax)',  description: 'Reserved table · 6,000 EGP min spend',   priceEgp: 6000, stockTotal: 24,  stockLeft: 6,   sortOrder: 2 },
    ],
  },
  {
    name: 'Underground · 180BPM',
    venue: 'CJC',
    location: 'Zamalek · Cairo',
    description: 'Hardgroove, acid, no compromises. Basement doors from 11 pm.',
    startsAt: new Date('2026-04-25T23:00:00Z'),
    gradient: 'night',
    lineup: 'Rama · SVP · dj.nar',
    tag: 'NEW',
    featured: false,
    city: 'CAIRO' as const,
    tiers: [
      { name: 'Standard', description: 'Walk-up admission', priceEgp: 500, stockTotal: 200, stockLeft: 140, sortOrder: 0 },
      { name: 'Priority', description: 'Skip-the-line',      priceEgp: 800, stockTotal: 50,  stockLeft: 22,  sortOrder: 1 },
    ],
  },
  {
    name: 'Rooftop House',
    venue: 'Kiva',
    location: 'Nile-front · Cairo',
    description: 'Deep house with a skyline. Sunset set + kitchen open late.',
    startsAt: new Date('2026-04-26T18:00:00Z'),
    gradient: 'valet',
    lineup: 'Hassan Abou Alam · Mishaal',
    tag: null,
    featured: false,
    city: 'CAIRO' as const,
    tiers: [
      { name: 'Standard', description: 'General admission', priceEgp: 400, stockTotal: 150, stockLeft: 95, sortOrder: 0 },
    ],
  },
  {
    name: 'Afro Nights',
    venue: 'Scene',
    location: 'Sahel',
    description: 'Amapiano, afrohouse, and the occasional baile. Dress for sand.',
    startsAt: new Date('2026-04-27T21:00:00Z'),
    gradient: 'community',
    lineup: 'Hotniga · Nour Tarek',
    tag: null,
    featured: false,
    city: 'SAHEL' as const,
    tiers: [
      { name: 'Standard', description: 'General admission', priceEgp: 600, stockTotal: 300, stockLeft: 240, sortOrder: 0 },
      { name: 'VIP',      description: 'Priority + bar',     priceEgp: 900, stockTotal: 80,  stockLeft: 50,  sortOrder: 1 },
    ],
  },
];

// Phase 3 — Parties: three hosts, three parties with distinct themes.
// Hosts are seeded as full User rows with dev-only phone numbers so the
// relationship + avatar-color lookup work end-to-end.
const HOSTS = [
  { phone: '+20200000001', name: 'Nour H.',   avatarColor: '#FF3D6B', hostRating: 4.9, hostedCount: 14, hostVerified: true  },
  { phone: '+20200000002', name: 'Karim A.',  avatarColor: '#8B3FFF', hostRating: 4.7, hostedCount: 9,  hostVerified: true  },
  { phone: '+20200000003', name: 'Yasmin R.', avatarColor: '#00E5C8', hostRating: 0,    hostedCount: 0,  hostVerified: false },
];

const PARTIES = [
  {
    hostPhone: '+20200000001',
    title: 'Afterparty Zamalek',
    theme: 'LOFT' as const,
    emoji: '🌙',
    gradient: 'night',
    neighborhood: 'Zamalek · Cairo',
    address: '14 Abu El Feda St., Apt 8',
    doorDetail: 'Building with blue door',
    startsAt: new Date('2026-04-25T00:30:00Z'),
    cap: 22,
    rules: [
      '18+ only',
      'No phones on the dancefloor',
      'Stay until sunrise or leave before 3 AM',
      'Guest list only',
    ],
    tag: 'STRICT DOOR',
    city: 'CAIRO' as const,
  },
  {
    hostPhone: '+20200000002',
    title: 'Rooftop Sunset',
    theme: 'ROOFTOP' as const,
    emoji: '🌅',
    gradient: 'sunset',
    neighborhood: 'Heliopolis · Cairo',
    address: '22 El Thawra St., rooftop',
    doorDetail: 'Ring top-right buzzer',
    startsAt: new Date('2026-04-26T17:30:00Z'),
    cap: 30,
    rules: [
      '21+ only',
      'Dress code: rooftop casual',
      'BYOB welcome, no hard liquor',
    ],
    tag: 'TONIGHT',
    city: 'CAIRO' as const,
  },
  {
    hostPhone: '+20200000003',
    title: 'Pool Day · Sahel',
    theme: 'POOL' as const,
    emoji: '🏖️',
    gradient: 'valet',
    neighborhood: 'Sidi Heneish · Sahel',
    address: 'Villa 48, Marassi North Bay',
    doorDetail: 'Gate code sent on approval',
    startsAt: new Date('2026-04-27T13:00:00Z'),
    cap: 18,
    rules: [
      'Swim gear required',
      'No glass by the pool',
    ],
    tag: 'NEW HOST',
    city: 'SAHEL' as const,
  },
];

// Phase 6 — Pro exclusive drops. Static teaser feed; capacity progress is what
// makes the cards feel alive. `feeEgp: 0` renders as "FREE FOR PRO".
const DROPS = [
  { name: 'Midnight Warehouse', host: 'Unknown · Verified', neighborhood: 'New Cairo',     emoji: '🌑', gradient: 'night',     startsAt: new Date('2026-04-19T22:00:00Z'), capacity: 80, taken: 47, tag: 'LIVE'      as const, feeEgp: 0    },
  { name: 'Desert Dawn Rave',   host: 'LAYLA Curated',     neighborhood: 'Fayoum',        emoji: '🏜️', gradient: 'sunset',    startsAt: new Date('2026-04-25T02:00:00Z'), capacity: 60, taken: 23, tag: 'LIMITED'   as const, feeEgp: 1200 },
  { name: 'Yacht Afterhours',   host: 'Partner',           neighborhood: 'Gouna Marina',  emoji: '⚓', gradient: 'valet',     startsAt: new Date('2026-05-01T01:00:00Z'), capacity: 30, taken: 12, tag: 'EXCLUSIVE' as const, feeEgp: 3500 },
];

// Phase 5 — Valet drivers. Static fleet so the Finding screen can always
// show a non-empty list. `online` flips real availability.
const DRIVERS = [
  { name: 'Ahmed M.',  avatarColor: '#00E5C8', rating: 4.9, trips: 312, yearsActive: 3, carMake: 'VW',       carModel: 'Polo',    carColor: 'White', plate: 'B 4291',   transmission: 'AUTOMATIC' },
  { name: 'Karim H.',  avatarColor: '#8B3FFF', rating: 5.0, trips: 198, yearsActive: 2, carMake: 'Toyota',   carModel: 'Yaris',   carColor: 'Silver', plate: 'KS 1234', transmission: 'AUTOMATIC' },
  { name: 'Tamer S.',  avatarColor: '#FF3D6B', rating: 4.8, trips: 540, yearsActive: 5, carMake: 'Hyundai',  carModel: 'Elantra', carColor: 'Black',  plate: 'AR 7890', transmission: 'MANUAL'    },
  { name: 'Hossam K.', avatarColor: '#D4A843', rating: 4.7, trips: 88,  yearsActive: 1, carMake: 'Mercedes', carModel: 'C200',    carColor: 'Black',  plate: 'QAS 4718', transmission: 'AUTOMATIC' },
];

// Phase 4 — Community seed. One review per host against one of the events,
// plus a pure-text post. Seed is idempotent — we skip if any post exists.
const POSTS = [
  {
    authorPhone: '+20200000001',
    kind: 'REVIEW' as const,
    stars: 5,
    vibes: ['Great sound', 'Real crowd', 'Strict door'],
    text: 'Sound system is unreal. Door was strict but fair — got in 5 min. Crowd is actually into techno, no phones on the floor.',
    venueEventName: 'Underground · 180BPM',
  },
  {
    authorPhone: '+20200000002',
    kind: 'REVIEW' as const,
    stars: 4,
    vibes: ['Sunset view', 'Packed', 'Worth it'],
    text: 'Showed up for the golden hour set — paid off. Kitchen stayed open late, that\'s the move.',
    venueEventName: 'Rooftop House',
  },
  {
    authorPhone: '+20200000003',
    kind: 'TEXT' as const,
    text: 'Beach set tomorrow. Come early — first 50 through the gate get Vimto shots on us.',
  },
];

async function main() {
  for (const ev of EVENTS) {
    const existing = await prisma.event.findFirst({ where: { name: ev.name } });
    if (existing) {
      console.log(`[seed] skip existing event: ${ev.name}`);
      continue;
    }
    await prisma.event.create({
      data: {
        name: ev.name,
        venue: ev.venue,
        location: ev.location,
        description: ev.description,
        startsAt: ev.startsAt,
        gradient: ev.gradient,
        lineup: ev.lineup,
        tag: ev.tag,
        featured: ev.featured,
        city: ev.city,
        tiers: { create: ev.tiers },
      },
    });
    console.log(`[seed] inserted event: ${ev.name}`);
  }

  for (const h of HOSTS) {
    await prisma.user.upsert({
      where: { phone: h.phone },
      create: {
        phone: h.phone,
        phoneVerified: true,
        role: 'HOST',
        name: h.name,
        avatarColor: h.avatarColor,
        hostRating: h.hostRating,
        hostedCount: h.hostedCount,
        hostVerified: h.hostVerified,
      },
      update: {
        name: h.name,
        avatarColor: h.avatarColor,
        hostRating: h.hostRating,
        hostedCount: h.hostedCount,
        hostVerified: h.hostVerified,
      },
    });
    console.log(`[seed] upsert host: ${h.name}`);
  }

  for (const p of PARTIES) {
    const host = await prisma.user.findUnique({ where: { phone: p.hostPhone } });
    if (!host) throw new Error(`missing host ${p.hostPhone}`);
    const existing = await prisma.party.findFirst({ where: { title: p.title } });
    if (existing) {
      console.log(`[seed] skip existing party: ${p.title}`);
      continue;
    }
    await prisma.party.create({
      data: {
        hostId: host.id,
        title: p.title,
        theme: p.theme,
        emoji: p.emoji,
        gradient: p.gradient,
        neighborhood: p.neighborhood,
        address: p.address,
        doorDetail: p.doorDetail,
        startsAt: p.startsAt,
        cap: p.cap,
        rules: p.rules,
        tag: p.tag,
        city: p.city,
      },
    });
    console.log(`[seed] inserted party: ${p.title}`);
  }

  const dropCount = await prisma.drop.count();
  if (dropCount === 0) {
    for (const d of DROPS) {
      await prisma.drop.create({ data: d });
      console.log(`[seed] inserted drop: ${d.name}`);
    }
  } else {
    console.log(`[seed] skip drops (${dropCount} already present)`);
  }

  const driverCount = await prisma.driver.count();
  if (driverCount === 0) {
    for (const d of DRIVERS) {
      await prisma.driver.create({ data: d });
      console.log(`[seed] inserted driver: ${d.name}`);
    }
  } else {
    console.log(`[seed] skip drivers (${driverCount} already present)`);
  }

  const postCount = await prisma.post.count();
  if (postCount === 0) {
    for (const p of POSTS) {
      const author = await prisma.user.findUnique({ where: { phone: p.authorPhone } });
      if (!author) { console.warn(`[seed] post skipped, missing author ${p.authorPhone}`); continue; }
      let venueEventId: string | undefined;
      if (p.kind === 'REVIEW' && 'venueEventName' in p && p.venueEventName) {
        const ev = await prisma.event.findFirst({ where: { name: p.venueEventName } });
        venueEventId = ev?.id;
      }
      await prisma.post.create({
        data: {
          authorId: author.id,
          kind: p.kind,
          text: p.text,
          stars: p.kind === 'REVIEW' ? p.stars : null,
          vibes: p.kind === 'REVIEW' ? p.vibes : [],
          venueEventId,
        },
      });
      console.log(`[seed] inserted post: ${p.authorPhone} · ${p.kind}`);
    }
  } else {
    console.log(`[seed] skip posts (${postCount} already present)`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
