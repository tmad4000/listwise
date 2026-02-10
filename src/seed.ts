import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.join(process.cwd(), 'data');

// Seed users
const users = [
  {
    username: 'jacob',
    displayName: 'Jacob',
    passwordHash: bcrypt.hashSync('demo123', 10),
    isSample: true,
    createdAt: new Date().toISOString(),
  },
  {
    username: 'sarah',
    displayName: 'Sarah',
    passwordHash: bcrypt.hashSync('demo123', 10),
    isSample: true,
    createdAt: new Date().toISOString(),
  },
  {
    username: 'alex',
    displayName: 'Alex',
    passwordHash: bcrypt.hashSync('demo123', 10),
    isSample: true,
    createdAt: new Date().toISOString(),
  },
];

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.writeFileSync(path.join(DATA_DIR, 'users.json'), JSON.stringify(users, null, 2));

// Seed lists
const seedLists: { owner: string; slug: string; content: string }[] = [
  {
    owner: 'jacob',
    slug: 'sf-events',
    content: `---
title: SF Events This Week
description: Curated events happening in San Francisco
category: events
tags: [sf, music, art, nightlife]
created: 2026-02-08T10:00:00Z
updated: 2026-02-08T10:00:00Z
public: true
---

## Music & Nightlife

### Noise Pop Festival
**Where:** Various venues across SF
**When:** Feb 10-15
**Price:** $25-45

The annual indie music festival returns with 100+ acts across a dozen venues. Don't miss Japanese Breakfast at The Fillmore on Thursday night.

> "One of the best indie music festivals on the West Coast" — Pitchfork

[Get tickets →](https://noisepop.com)

### DJ Set: Floating Points
**Where:** The Midway
**When:** Friday, Feb 13, 10pm
**Price:** $35

Sam Shepherd brings his live hybrid set — part electronic, part jazz, all transcendent.

---

## Art & Culture

### SFMOMA: New Photography Exhibition
**Where:** SFMOMA, 3rd floor
**When:** Through March 30
**Price:** $25 (free first Tuesdays)

A stunning collection of contemporary photography exploring urban landscapes and the tension between nature and architecture.

### Chinatown Night Market
**Where:** Grant Avenue
**When:** Saturday, Feb 14, 5-10pm
**Price:** Free entry

Celebrate Lunar New Year with street food, lion dances, and artisan vendors. Arrive early — it gets packed.

---

## Food & Drink

### Ferry Building Saturday Market
**Where:** Ferry Building Marketplace
**When:** Every Saturday, 8am-2pm
**Price:** Free entry

The best farmers market in the city. Must-tries:
- **Blue Bottle Coffee** — the original kiosk
- **Cowgirl Creamery** — Mt. Tam triple cream
- **Hog Island Oysters** — $2 oysters before 11am

### New Opening: Nari 2.0
**Where:** Japantown
**When:** Opened Feb 1
**Price:** $$$$

Pim Techamuanvivit's follow-up to the beloved original. Thai-inspired tasting menu with wine pairings. Book weeks in advance.

---

## Outdoor

### Lands End Trail Morning Hike
**Where:** Lands End Lookout (park at Legion of Honor)
**When:** Any morning
**Price:** Free

Best done at sunrise. The trail from the Lookout to Sutro Baths takes about 45 minutes. Bring layers — it's foggy.

### Saturday Bike Ride: Golden Gate Loop
**Where:** Start at Crissy Field
**When:** Any weekend
**Price:** Free (bike rental ~$30)

Cross the Golden Gate Bridge, ride through Sausalito, ferry back. Classic SF experience, ~15 miles total.
`,
  },
  {
    owner: 'jacob',
    slug: 'best-coffee-shops',
    content: `---
title: Best Coffee Shops for Remote Work
description: Tested and approved spots with great wifi and vibes
category: food
tags: [coffee, remote-work, wifi, sf]
created: 2026-02-05T08:00:00Z
updated: 2026-02-07T14:30:00Z
public: true
---

## The A-List

### Sightglass Coffee — SoMa
**Address:** 270 7th Street
**Wifi:** Fast and reliable
**Power outlets:** Plenty
**Noise level:** Medium buzz

The cathedral of San Francisco coffee. High ceilings, natural light, and some of the best single-origin pour-overs in the city. The affogato is legendary.

> Perfect for deep work sessions. I've written entire projects here.

### Andytown Coffee — Outer Sunset
**Address:** 3655 Lawton Street
**Wifi:** Good
**Power outlets:** Limited
**Noise level:** Quiet

Tucked in the foggy Outer Sunset. Their "Snowy Plover" (espresso + sparkling water + whipped cream) is the signature move. Cozy, unpretentious, great for focus.

---

## Solid Choices

### Ritual Coffee — Valencia
**Address:** 1026 Valencia Street
**Wifi:** Good
**Power outlets:** Some
**Noise level:** Lively

Mission District staple. The outdoor parklet is great on sunny days. Good pastries from neighboring bakeries.

### Equator Coffee — Fort Mason
**Address:** 2 Marina Blvd, Building A
**Wifi:** Good
**Power outlets:** Enough
**Noise level:** Calm

Waterfront views while you work. Certified B Corp with excellent sustainability practices. The cold brew is smooth.

### Red Bay Coffee — Oakland
**Address:** 3098 International Blvd
**Wifi:** Fast
**Power outlets:** Many
**Noise level:** Quiet

Worth the trip across the bay. Black-owned, incredible roasts, massive space. The East African blends are outstanding.

---

## Pro Tips

1. **Go early** — Most spots fill up by 10am on weekdays
2. **Buy something every 2 hours** — Support the business
3. **Bring headphones** — Even quiet cafes have espresso machines
4. **Have a backup** — If your spot is full, know a plan B nearby
`,
  },
  {
    owner: 'sarah',
    slug: 'bodywork-practitioners',
    content: `---
title: Bay Area Bodywork & Healing Practitioners
description: Trusted practitioners for massage, acupuncture, and somatic work
category: wellness
tags: [bodywork, massage, acupuncture, healing, bay-area]
created: 2026-02-01T09:00:00Z
updated: 2026-02-06T16:00:00Z
public: true
---

## Massage Therapy

### Elena Rodriguez — Deep Tissue & Myofascial
**Location:** Inner Sunset, SF
**Price:** $150/90min
**Booking:** By referral

Elena has magic hands. She specializes in chronic pain patterns and can find tension you didn't know you had. Book for 90 minutes minimum — 60 isn't enough.

> The best bodyworker I've ever seen. She fixed my shoulder issue in three sessions. — Sarah

### Marcus Chen — Sports & Recovery
**Location:** Berkeley
**Price:** $130/60min
**Booking:** [online booking](https://example.com)

Former physical therapist turned massage therapist. Great for athletes and anyone with repetitive strain. He explains what he's doing and why.

---

## Acupuncture

### Dr. Wei Lin — Traditional Chinese Medicine
**Location:** Chinatown, SF
**Price:** $90/session (sliding scale available)
**Booking:** Call (415) 555-0123

30+ years experience. The real deal. His herbal formulas are custom-blended. Best for chronic conditions, stress, and digestive issues.

### Community Acupuncture at Poke Lounge
**Location:** Mission, SF
**Price:** $30-50 sliding scale
**Booking:** Walk-in welcome

Acupuncture in a group setting (recliners, not beds). Affordable and effective. Great for first-timers who want to try it without commitment.

---

## Somatic Work

### Jamie Torres — Somatic Experiencing
**Location:** Oakland (in-person) or Zoom
**Price:** $180/session
**Booking:** Email jamie@example.com

Trauma-informed somatic work. Incredibly gentle and skilled. Sessions combine talk therapy with body awareness. Transformative for processing stored stress.

### Craniosacral Therapy with Anna Kowalski
**Location:** Noe Valley, SF
**Price:** $160/75min
**Booking:** [online](https://example.com)

Deeply relaxing and surprisingly powerful. Anna creates a safe container. Sessions often bring unexpected emotional releases. Bring water and clear your schedule after.

---

## Tips for Finding Good Practitioners

- **Ask for referrals** from people whose bodies you trust
- **Try 3 sessions** before deciding if someone is right for you
- **Communicate** what you need — pressure, areas to avoid, emotional boundaries
- **Don't cheap out** on bodywork — your body remembers quality
`,
  },
  {
    owner: 'sarah',
    slug: 'reading-list-2026',
    content: `---
title: Reading List 2026
description: Books I'm reading and recommending this year
category: books
tags: [books, reading, recommendations]
created: 2026-01-15T12:00:00Z
updated: 2026-02-08T09:00:00Z
public: true
---

## Currently Reading

### "The Master and His Emissary" — Iain McGilchrist
A dense but rewarding exploration of how the brain's two hemispheres shape our experience of the world. McGilchrist argues that Western civilization has become too left-hemisphere dominant.

> "The right hemisphere sees the whole, the left hemisphere breaks it into parts."

**Reading time:** ~30 hours. Take it slow.

---

## Loved This Year

### "Tomorrow, and Tomorrow, and Tomorrow" — Gabrielle Zevin
A novel about two game designers and their decades-long creative partnership. Beautiful meditation on friendship, creativity, and identity. Made me cry on a plane.

### "Four Thousand Weeks" — Oliver Burkeman
The anti-productivity productivity book. Burkeman argues that our finite time is the point, not the problem. Changed how I think about my to-do list.

### "The Overstory" — Richard Powers
Nine strangers whose lives are connected by trees. Sounds weird, is magnificent. Pulitzer-winner that will make you look at forests differently.

---

## On Deck

- **"Braiding Sweetgrass"** — Robin Wall Kimmerer (indigenous wisdom + botany)
- **"The Dawn of Everything"** — Graeber & Wengrow (rethinking human history)
- **"How to Do Nothing"** — Jenny Odell (attention + resistance)
- **"Entangled Life"** — Merlin Sheldrake (fungi networks)

---

## All-Time Favorites

1. **"Siddhartha"** — Hermann Hesse
2. **"Gödel, Escher, Bach"** — Douglas Hofstadter
3. **"The Left Hand of Darkness"** — Ursula K. Le Guin
4. **"When Things Fall Apart"** — Pema Chödrön
5. **"Sapiens"** — Yuval Noah Harari
`,
  },
  {
    owner: 'alex',
    slug: 'hiking-trails',
    content: `---
title: Best Bay Area Hiking Trails
description: Favorite hikes rated by difficulty, views, and crowd levels
category: outdoors
tags: [hiking, outdoors, bay-area, nature]
created: 2026-01-20T07:00:00Z
updated: 2026-02-04T11:00:00Z
public: true
---

## Easy (Great for Everyone)

### Lands End Trail
**Location:** SF, Outer Richmond
**Distance:** 3.4 miles out-and-back
**Elevation:** 200 ft
**Crowds:** Moderate

Stunning Golden Gate Bridge views, Sutro Baths ruins, and a labyrinth. Best at sunset. Watch for the occasional whale sighting.

### Muir Woods Main Trail
**Location:** Mill Valley
**Distance:** 2 miles loop
**Elevation:** Flat
**Crowds:** Heavy (go early or late)

Old-growth redwoods that make you feel small in the best way. The Cathedral Grove is truly awe-inspiring.

> Arrive before 9am or after 4pm to avoid the crowds. Reservation required for parking.

---

## Moderate

### Tennessee Valley Trail to Beach
**Location:** Marin Headlands
**Distance:** 3.4 miles out-and-back
**Elevation:** 300 ft
**Crowds:** Light on weekdays

A hidden black-sand beach at the end of a gentle valley trail. Pack a picnic. The sunset here is world-class.

### Ring Mountain
**Location:** Tiburon
**Distance:** 3.5 miles loop
**Elevation:** 600 ft
**Crowds:** Light

One of the best-kept secrets in Marin. 360-degree views of the bay, SF skyline, and Mt. Tam. Wildflowers in spring are incredible.

---

## Challenging

### Mission Peak
**Location:** Fremont
**Distance:** 6.2 miles out-and-back
**Elevation:** 2,100 ft
**Crowds:** Heavy on weekends

The famous "glory pole" at the summit. Brutally steep but the panoramic views are worth every step. Start before sunrise for a magical experience.

### Mt. Tamalpais: Steep Ravine to Stinson Beach
**Location:** Mt. Tam
**Distance:** 7 miles loop
**Elevation:** 1,500 ft
**Crowds:** Moderate

The crown jewel. Ladders, waterfalls, redwoods, and a beach finish. This hike has everything.

---

## Packing Checklist

- [ ] Water (1L per hour of hiking)
- [ ] Sunscreen + hat
- [ ] Layers (fog can roll in fast)
- [ ] Trail snacks
- [ ] Fully charged phone (for maps + photos)
- [ ] Cash (some trailhead parking needs it)
`,
  },
];

for (const list of seedLists) {
  const dir = path.join(DATA_DIR, list.owner);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${list.slug}.md`), list.content);
}

// Create _anonymous directory
fs.mkdirSync(path.join(DATA_DIR, '_anonymous'), { recursive: true });

console.log('Seed data created successfully!');
console.log(`  Users: ${users.map((u) => u.username).join(', ')}`);
console.log(`  Lists: ${seedLists.length} lists created`);
