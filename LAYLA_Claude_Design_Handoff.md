# LAYLA — Claude Design Handoff Brief

> Paste this entire document into the **"LAYLA App"** Claude Design session along with the 6 artifact screenshots.

---

## 🎯 The Ask

**Build LAYLA's design system based on these 6 prototype artifacts.**

Extract every design decision already made in the prototypes, codify it into a reusable system, and apply it consistently to every future screen you generate for this project.

---

## 📎 What I'm Uploading

6 prototype artifacts (React/TSX + screenshots) representing the full LAYLA product arc. These are the **source of truth** — do not invent new visual language. Mirror what's there.

| # | Phase | Artifact | Key Flows |
|---|-------|----------|-----------|
| 1 | Onboarding | `layla-phase-01-onboarding.tsx` | Splash → welcome → phone/OTP → profile (name, age, vibes) → role pick → home |
| 2 | Events | `layla-phase-02-events.tsx` | Event discovery (list/map), ticket tiers, checkout, secure QR ticket w/ anti-screenshot |
| 3 | Parties | `layla-phase-03-parties.tsx` | House-party feed, host/guest modes, request-to-join, ID verification, create-party flow |
| 4 | Community | `layla-phase-04-community.tsx` | Social feed, stories, DMs, profiles, reviews, friend requests, search |
| 5 | Valet | `layla-phase-05-valet.tsx` | Valet/ride request, driver match, trip tracking, SOS, emergency contacts, rating |
| 6 | Scale | `layla-phase-06-scale.tsx` | Pro membership, Sahel seasonal mode, plans/pricing, perks, countdowns |

---

## 🧬 Extract These Primitives

Pull the following from the artifacts and lock them in as the system:

### Color
- Primary / secondary / accent
- Background layers (base, surface, elevated)
- Text colors (primary, secondary, muted, inverse)
- Semantic (success, warning, error, info)
- **Output as named tokens**, e.g. `color.brand.primary`, `color.surface.elevated`

### Typography
- Font families (display + body)
- Type scale (sizes + line-heights)
- Weights used
- Heading vs. body vs. caption vs. label styles

### Spacing & Layout
- Base unit (4px? 8px?)
- Section padding, card padding, screen margins
- Grid / column structure

### Components
Catalog every reusable element visible in the artifacts:
- Buttons (primary, secondary, tertiary, icon-only)
- Inputs / form fields
- Cards / list items
- Navigation (tab bar, header, nav drawer)
- Modals / sheets / toasts
- Avatars, badges, chips, tags
- Empty / loading / error states

### Motion & Elevation
- Shadow / elevation scale
- Corner radius scale
- Any visible animation or transition cues

---

## 📐 Deliverables

1. **Design tokens** — exported as JSON or CSS variables
2. **Component library** — every component above, in all states (default, hover, active, disabled)
3. **Screen templates** — how any new screen should be structured
4. **A one-page visual style guide** I can export to PDF for the investor deck

---

## ✅ Rules of Engagement

- **Don't improvise.** If the artifacts are silent on something, ask me rather than inventing.
- **Consistency > novelty.** Every future screen should feel like it came from the same hand.
- **Export-ready.** Output should drop cleanly into Canva and PDF for the pitch deck.

---

## 🚀 First Task After Setup

Once the system is codified, generate a **polished V2** of each of the 6 uploaded artifacts using the new design system. That becomes my investor-deck starting material.
