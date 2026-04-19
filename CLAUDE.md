# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

LAYLA — mobile app for Egyptian nightlife (events, private parties, valet, community, pro membership). Night-first visual language: dark surfaces, gold signature, Bebas Neue display, Arabic touches. Six phase designs live in `Claude Design Files/*-v2.jsx`; they're the source of truth. Never invent new visual language — mirror those artifacts.

## Build order (hard rule — never parallel)

Phases ship one at a time, in order:

1. **Auth** (onboarding splash → phone → OTP → profile → role → done)
2. **Events & Tickets**
3. **Parties**
4. **Community**
5. **Valet**
6. **Pro / Scale**

For each phase: **backend first** (Prisma models + routes + seed), **then wire screens**. The phase is not done until the happy path works end-to-end on the iPhone. Do not start the next phase before that checkpoint.

## Monorepo layout

npm workspaces at the root.

- `/backend` — Node + Express + Prisma + Neon Postgres (TypeScript, ESM/NodeNext)
- `/mobile` — Expo SDK 54 + React Native 0.81 + TypeScript
- `/Claude Design Files/*-v2.jsx` — canonical design (HTML-prototyped, ported to RN screen-by-screen)
- `LAYLA_Claude_Design_Handoff.md` — design brief that produced the v2 artifacts

## Commands

```bash
# One-time install (from repo root)
npm install

# Run dev servers
npm run dev:backend        # :3001, backend + tsx watch
npm run dev:mobile         # expo start --lan

# Prisma (run from /backend)
npx prisma db push --accept-data-loss    # dev-only: sync schema without migration file
npx prisma migrate dev --name <slug>     # preferred once schema is stable
npm run prisma:seed                       # inserts 4 events from prisma/seed.ts
npx prisma studio                         # inspect Neon data

# Sanity checks
curl http://localhost:3001/health
```

## Architecture

### Backend (`/backend/src`)

- `index.ts` — Express bootstrap; mounts `/auth`, `/users`, `/events`
- `config.ts` — reads env via dotenv, throws on missing `JWT_SECRET`
- `middleware/auth.ts` — `requireAuth` Bearer-token gate; attaches `userId` to request
- `lib/{prisma,jwt,phone}.ts` — shared helpers; `phone.ts` normalizes to E.164 via libphonenumber-js with EG default
- `services/otp.ts` — generates 6-digit code, bcrypt-hashes it, enforces 5-min TTL / 30s resend cooldown / 5-attempt lockout. In dev (`OTP_DEV_LOG=true`), the code is printed to stdout — there is no SMS provider wired yet.
- `routes/{auth,users,events}.ts` — thin route layer; Zod validates every request body
- `prisma/schema.prisma` — `User`, `OtpChallenge`, `Event`, `EventTier`, `Ticket`; enums for `UserRole` and `City`
- `prisma/seed.ts` — idempotent event seed keyed on event name

Routing gotcha: `/events/tickets/me` must be declared **before** `/events/:id`, otherwise Express matches `tickets` as an event id.

### Mobile (`/mobile`)

- `App.tsx` — **linear state-machine router**, not react-navigation. Each `Step` is a discriminated union; each screen receives `onBack` and a single `next` callback. Swap for react-navigation once Phase 3 introduces the bottom tab bar.
- `src/theme/tokens.ts` — 1:1 port of `Claude Design Files/tokens.jsx`. Hex values, font weights, spacing must stay identical between the two files.
- `src/theme/typography.ts` — `resolveType(name)` converts em-based letter-spacing from web tokens to RN's point-based `letterSpacing`.
- `src/components/DisplayHeadline.tsx` — **mandatory for display/title text**. See the Bebas clipping gotcha below.
- `src/components/` — design-system primitives (`Button`, `Chip`, `Tag`, `Input`, `Card`, `FeatureRow`, `Avatar`, badges). Mirrors `Claude Design Files/components.jsx`.
- `src/screens/` — one file per flow step (`Splash`, `PhoneEntry`, `PhoneOTP`, `Profile`, `Role`, `Done`, `EventsList`, `EventDetail`, `Checkout`, `TicketQR`).
- `src/lib/api.ts` — typed fetch client; auto-derives dev API host from `Constants.expoConfig.hostUri` so the phone hits the laptop's LAN IP without config.
- `src/lib/auth.ts` — JWT persistence via AsyncStorage.
- `src/lib/gradients.ts` — maps string keys (backend `Event.gradient`) to `LinearGradient` color-stop arrays. Gradient decisions live in code, not the DB.

### Design-system port convention

The web artifacts in `Claude Design Files/` use web-only constructs (CSS gradients, `WebkitBackgroundClip` for gradient text, `lineHeight: 0.82` with overflow). The port rules:

- **Gradients:** tokens expose `{ colors, start, end }` tuples — feed them straight to `expo-linear-gradient`. `135deg` → `{x:0,y:0}→{x:1,y:1}`, `180deg` → `{x:0,y:0}→{x:0,y:1}`.
- **Display text (Bebas ≥18pt):** use `<DisplayHeadline>` (SVG text). RN's `<Text>` clips Bebas' tall ascenders on iOS regardless of `lineHeight`. Never render a display-size headline through RN `Text`.
- **Shadows:** tokens split into iOS `shadow*` and Android `elevation`; applied as a single spread: `...shadow.glowGold`.
- **Radial glows:** use `react-native-svg`'s `<RadialGradient>` (no RN equivalent).

## Critical gotchas

1. **Metro file watcher misses edits on Windows paths with spaces.** The project path contains a space (`Houseparty App`). chokidar silently fails to detect file changes, so Fast Refresh *and* full Reload serve Metro's stale AST. Symptom: your code change does not appear on device; element inspector shows old styles. Fix: `TaskStop` the Metro bg task, free port 8081 (`Get-NetTCPConnection -LocalPort 8081 | Stop-Process -Force`), restart with `CI=1 npx expo start --lan --clear`. Do this every time you need a confirmed-on-device change.

2. **Port 8081 sticks after Metro crashes.** Same PowerShell one-liner above. Expo will otherwise prompt for port 8082, which fails under `CI=1`.

3. **Neon aggressively closes idle connections.** Backend `.env` uses the pooled URL with `?pgbouncer=true&connection_limit=1` for runtime, and a separate `DIRECT_URL` (non-pooled) for migrations (`directUrl` in `schema.prisma`). Expect occasional `Error { kind: Closed }` log lines; Prisma retries automatically. Do not remove the two-URL setup.

4. **Prisma client DLL lock on Windows.** Regenerating Prisma client while the backend is running fails with `EPERM: operation not permitted, rename ... query_engine-windows.dll.node`. Always stop the backend (`TaskStop`) before `prisma generate` or `db push`. If it still fails, find the holder via `Get-Process node | Where-Object { $_.Modules.FileName -like '*query_engine*' }` and `Stop-Process`.

5. **Backend uses ESM with NodeNext.** Intra-repo imports must include the `.js` suffix (`from './lib/prisma.js'`) even though the source is `.ts`. `"type": "module"` is set in `backend/package.json`.

6. **OTP codes live only in the backend log.** There's no SMS provider yet. `OTP_DEV_LOG=true` prints codes to stdout; the dev loop tails `/tmp/layla-backend.log` and streams `[OTP]` lines.

## Adding a screen

1. Read the corresponding V2 design in `Claude Design Files/*-v2.jsx` and keep hex values, weights, spacing identical.
2. Create `mobile/src/screens/<Name>.tsx`. Use primitives from `src/components`; use `<DisplayHeadline>` for any display/title text.
3. Add a new `Step` variant to the `Step` union in `App.tsx` and wire the transition.
4. If new data is involved: add a Prisma model, a Zod-validated route, and a typed method on `api` in `src/lib/api.ts`.
5. Cold-restart Metro (gotcha #1).

## Screenshot workflow (iPhone / Expo Go)

This is a React Native project — there is no `localhost:3000` web view. Design review happens against iPhone screenshots of the running Expo Go app.

**Capture flow:**
1. User takes an iPhone screenshot (Side + Volume Up) while running LAYLA in Expo Go.
2. User transfers the PNG to the Windows box and drops it into `./temporary screenshots/` at the repo root.
   - Quickest paths: iCloud Photos → Photos app on Windows, or iMessage-to-self → Save As from the Messages app, or AirDrop via a Mac, or a USB cable + File Explorer under `DCIM/`.
3. Name or rename the file as `screenshot-N.png` (increment; never overwrite). Optional label suffix: `screenshot-N-<label>.png` (e.g. `screenshot-04-event-detail.png`).
4. Tell Claude the filename; Claude reads the PNG with the Read tool and can see the image directly.

**Reference material to compare against lives at** `Claude Design Files/*-v2.jsx` (source) and `Claude Design Files/LAYLA * V2.html` (rendered harness). When comparing mobile render to the design artifact, be specific: cite exact pixel values, hex colors, font weights — not vague impressions. Check: spacing/padding, font size/weight/line-height, colors (exact hex against `src/theme/tokens.ts`), alignment, border-radius, shadows (iOS `shadow*` vs Android `elevation`), SVG text clipping on display headlines.

**Claude self-screenshot (Expo Web via preview MCP).** For fast layout checks without waiting on the user, Claude runs the app in React Native Web and screenshots the browser render:

1. `.claude/launch.json` has an `expo-web` entry that boots `npx expo start --web --port 8082` in `/mobile`. Port 8082 so it doesn't collide with the iPhone LAN server on 8081.
2. Use `preview_start` with `name: "expo-web"` to launch it, then `preview_screenshot` against the returned `serverId`.
3. For precise style queries (exact px, computed colors) use `preview_inspect` rather than relying on the JPEG — the screenshot tool's docstring says so explicitly.

**Fidelity caveat** (the reason iPhone screenshots from the user are still the truth): React Native Web does not match iOS pixel-for-pixel. Known differences in this codebase:
- Bebas Neue is loaded via `@expo-google-fonts/bebas-neue`; on iOS we force SVG text (DisplayHeadline) because iOS Text clips. On web the fallback path renders differently, so display-headline clipping cannot be validated via web preview.
- iOS `shadow*` doesn't map cleanly to CSS box-shadow in RN Web.
- `ActionSheetIOS` (Profile city picker), `DateTimePicker` (Profile birthdate), and the iOS wheel picker have no web equivalent and may crash or render as HTML fallbacks.
- Safe-area insets are synthesized rather than read from the physical device.

Use web screenshots to catch **structural regressions** (missing elements, wrong grid, wrong color token, wrong copy, broken layouts). Rely on iPhone screenshots from the user for fidelity sign-off at each phase checkpoint.

## Memory

Per-project memory lives under `.claude/projects/C--Users-W-1-Documents-Claude-Projects-Houseparty-App/memory/` with an index at `MEMORY.md`. Current highlights: phase build plan (6 phases, sequential, review after each), the two gotchas above, and Neon/schema decisions. Read these before making cross-cutting changes.
