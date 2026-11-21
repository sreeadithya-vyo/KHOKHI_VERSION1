# KHOKHI — Claude Code Build Prompts (frontend first)

A staged set of copy-paste prompts for building the KHOKHI web app in Claude Code.
Run them in order, one phase per session where you can. Finish the frontend, then
move to the backend phase at the end.

---

## How to use this file

1. Open Claude Code inside your project folder (`E:\KHOKI`).
2. For each phase, paste the **Preamble** first, then the **Phase prompt** below it, in the same message.
3. Let it finish, check the acceptance list, then start the next phase.
4. Keep effort on **high**.
5. If something is wrong, tell it what you see and let it fix before moving on. Do not stack phases on top of a broken one.

**Assumptions (change these in the Preamble if they are wrong):**
- Stack: Vite + React + TypeScript + Tailwind CSS + React Router. This matches the AI Studio prototype and makes a Supabase backend easy later.
- All data comes from a mock API layer now. Supabase replaces it in the last phase.
- English only. Mobile and desktop browsers.
- Backend later = Supabase (you have used it before).

---

## THE PREAMBLE (paste this before every phase prompt)

```
I'm building KHOKHI, a roommate-matching and verified-accommodation web app for
students and working professionals relocating within India. This is a paid client
project and the client will demo it to real users and to investors, so the frontend
has to look production-ready, not like a prototype. Right now I am building the
complete frontend with mock data only. The backend (Supabase) comes in a later phase.

One rule that must hold across the whole project: pages and components never hold
data inline. All data is read from functions in src/lib/api/ that currently return
mock data from src/lib/mock/. Keep those function names and their TypeScript return
types stable. The backend phase will only replace what is inside those functions, so
nothing on the page should assume the data is local.

Scope restraint: Don't add features, refactor, or introduce abstractions beyond what
the task requires. Do the simplest thing that works well. Don't design for
hypothetical future requirements. Don't add error handling, fallbacks, or validation
for scenarios that cannot happen. Only validate at system boundaries (user input).

Verify before you claim: after building, run the type check and the dev build, and
only say a page works if it compiled and you can point to the file. If something
fails, show the actual error, don't paper over it.

Lead with the outcome when you talk to me: your first sentence after finishing says
what you built and whether it builds, then the detail. Keep it readable.

When you hit a real decision that only I can make (a scope change, a design choice
with no obvious answer, anything destructive), stop and ask. Otherwise keep going.

Effort: high.
```

---

## PHASE 0 — Foundation (do this first, once)

```
Set up the KHOKHI project foundation. Nothing visual yet beyond a shell.

Do this:
1. Scaffold a Vite + React + TypeScript app with Tailwind CSS and React Router.
2. Create the design system from the prototype:
   - Brand: clean, trust-first, modern. Primary accent teal/deep green (#0F766E family),
     near-black text on off-white, generous spacing, rounded cards, subtle shadows.
   - Set Tailwind theme tokens (colors, font sizes, radius, spacing) so pages use tokens,
     not raw hex values. Pick one clean sans-serif (Inter).
   - Build shared UI primitives: Button, Card, Badge, Tag, Avatar, Input, Select,
     Filter chip, Modal, Tabs, EmptyState, Skeleton loader.
3. Build the app shell: top nav (Discover, Matches, Stays, Messages, Premium),
   logo "KHOKHI", a right-side account menu placeholder. Make it responsive with a
   mobile bottom tab bar.
4. Create the data architecture:
   - src/types/ with TypeScript interfaces for: User, RoommateProfile, CompatibilityResult,
     Stay, Match, Conversation, Message. Base the fields on the prototype
     (name, age, role, institution/company, city, budget range, lifestyle tags,
     cleanliness, sleep schedule, smoker, interests, verification badges, bio,
     compatibility score; stays: title, area, city, rent, type, gender policy,
     rating, amenities, distance note, room types).
   - src/lib/mock/ with ~12 roommate profiles and ~8 stays matching the prototype content.
   - src/lib/api/ with async functions that return the mock data (getProfiles, getProfile,
     getStays, getStay, getMatches, getConversations, getMessages, getCurrentUser, etc).
     Add a small artificial delay so loading states are real.
5. Set up routing for all pages as empty placeholders so navigation works:
   /, /discover, /profile/:id, /matches, /messages, /messages/:id, /stays, /stays/:id,
   /premium, /onboarding, /login, /signup, /list-your-space (owner).

Acceptance: app builds and runs, nav works, every route loads a placeholder, no data is
hardcoded in any page, type check passes. Give me the run command.
```

---

## PHASE 1 — Landing page

```
Build the KHOKHI landing page at /. This is the marketing page the client shows investors,
so it should look polished.

Sections:
1. Hero: headline "Right People. Right Place.", subline about finding compatible roommates
   and verified stays when you move to a new city. Two buttons: "Find your people" and
   "Find your place". Clean, confident, lots of whitespace.
2. Trust strip: identity verified, college/work verified, verified listings.
3. How it works: Profile -> Lifestyle match -> Compatible people -> Verified stays -> Connect.
4. For students / for professionals / for owners: three short value cards.
5. Problem/solution block: moving is easy, living together is hard.
6. Stats band (use the deck figures as display text only): higher-education enrolment,
   urban migrants, co-living market growth.
7. Footer with nav and a note that this is an early product.

Make it fully responsive. No real auth yet, buttons route to /signup and /stays.
Pull any displayed sample content from the mock layer where it makes sense; static
marketing copy can live in the component.

Acceptance: /, builds, responsive on mobile and desktop, matches the design system.
```

---

## PHASE 2 — Auth shell + onboarding lifestyle quiz

```
Build the sign-up/login screens and the onboarding lifestyle quiz.

1. /login and /signup: simple forms (no real backend). On submit, set a mock
   "current user" in a lightweight auth context and route to /onboarding for new users
   or /discover for returning. Keep the auth context behind src/lib/api/ so the backend
   can replace it.
2. /onboarding: a multi-step lifestyle quiz that produces a CompatibilityResult
   (an archetype name like "Zen Harmonizer" plus a 0-100 score) from answers on
   cleanliness, routine/sleep schedule, social cadence, communication, smoking, interests,
   budget range and target city. Show a nice result screen with the archetype, then
   route to /discover.
3. The scoring is a simple preference-based function in src/lib/ (not a real model).
   Label it clearly as preference-based, never as a scientific assessment.

Acceptance: a new user can sign up, take the quiz, see an archetype, and land on Discover.
State persists for the session. Builds and type-checks.
```

---

## PHASE 3 — Discover feed (the core screen)

```
Build /discover, the roommate discovery feed. This is the main screen.

1. Header: "Find your people", subline about lifestyle compatibility.
2. Filter bar: city chips (All + the cities in the mock data), budget filter, lifestyle
   tags, and a "lifestyle match active" indicator showing the user's archetype and score.
3. Profile cards ranked by compatibility score (desc). Each card: avatar, name, age,
   role and institution/company, big compatibility % with a label (Exceptional/Good),
   verification badges, lifestyle tags (sleep schedule, cleanliness, smoker, interests),
   budget range, target city, short bio, and three actions: Pass, View Profile, Connect.
4. Pass removes the card; Connect creates a Match (via the api layer) and shows a toast.
5. Loading skeletons and an empty state when filters match nothing.
6. All data via src/lib/api getProfiles with the active filters.

Acceptance: feed renders from the mock api, filters work, ranking is by score, Pass and
Connect work against the api layer, responsive, builds.
```

---

## PHASE 4 — Profile detail + Matches

```
Build two screens.

1. /profile/:id: full roommate profile. Hero with avatar, name, age, verification;
   compatibility breakdown (lifestyle, habits, budget, location, personality,
   accommodation, interests with the weights from the deck); full bio; lifestyle details;
   budget and target city; Connect and Pass actions. Data via getProfile.
2. /matches: list of people the user connected with (getMatches). Each row: avatar, name,
   compatibility, status (requested / matched), and a button to open the chat
   (/messages/:id). Empty state when there are no matches yet.

Acceptance: profile detail renders from the api, compatibility breakdown shows, Matches
lists connections and links to chat, builds.
```

---

## PHASE 5 — Messages

```
Build messaging.

1. /messages: conversation list (getConversations) with avatar, name, last message
   preview, timestamp, unread dot.
2. /messages/:id: chat view with message bubbles (getMessages), a text input, and
   sending a message appends to the conversation via the api layer (mock, in-memory).
3. Responsive: list + thread side by side on desktop, stacked on mobile.
4. Empty states for no conversations and no messages yet.

Acceptance: can open a conversation from Matches or the list, see messages, send a
message that appears in the thread, builds. Real-time is not needed yet.
```

---

## PHASE 6 — Stays (verified accommodations)

```
Build the accommodation side.

1. /stays: "Find your place". Filter bar: gender policy (all / men / women / unisex),
   budget bands, property type (PG, private room, shared room, flat, co-living, hostel),
   city. Listing cards (getStays): verified badge, title, area and city, rating,
   distance note, amenities, monthly rent, room-type count, View Details.
2. /stays/:id: stay detail with gallery placeholder, full amenities, room types with
   prices, location note, and a "Request visit / Contact" action that opens a mock
   enquiry (no real contact yet).
3. Loading skeletons and empty state.

Acceptance: listings render from the api, filters work, detail page works, builds.
```

---

## PHASE 7 — Premium + Owner listing flow

```
Build the last two frontend pieces.

1. /premium: the upgrade page. Free vs Premium comparison (unlock 80%+ matches, advanced
   filters, unlimited connections, priority visibility, early access). A mock upgrade
   button that flips the user's plan in the auth context. No real payment. Clearly a
   simulated upgrade.
2. /list-your-space: owner flow to add a listing. A form (title, area, city, type,
   gender policy, rent, room types, amenities, description) that creates a Stay via the
   api layer (mock, in-memory) and shows it in /stays. Add a simple "my listings" view
   with enquiry count placeholders.
3. Add Report and Block actions on profiles and stays (mock, just a confirm + toast).

Acceptance: premium page renders and the mock upgrade changes gated UI; an owner can add
a listing that appears in Stays; report/block work as mock actions; builds.
```

---

## PHASE 8 — Polish pass (frontend done)

```
Do a polish and consistency pass across the whole frontend. Do not add new features.

1. Check every page against the design system: spacing, typography, colors, card styles,
   buttons, badges are consistent.
2. Make sure every list has a loading skeleton and an empty state.
3. Responsive check on all pages at mobile and desktop widths; fix overflow and tap targets.
4. Add the "demo data" honesty: a small, dismissible banner or label making clear that
   profiles, listings, verification badges and payments are demonstration placeholders,
   so the client never shows fake verification to real users as genuine.
5. Basic accessibility: alt text, focus states, labels on inputs, color contrast.
6. Run the full type check and build and report anything failing.

Acceptance: one consistent-looking app, all pages responsive, no type or build errors.
Give me a short list of what you changed and anything still rough.
```

---

## PHASE 9 (LATER) — Backend handoff (do not start until the frontend is signed off)

```
The frontend is complete and uses a mock api layer in src/lib/api/ backed by src/lib/mock/.
I now want to replace the mock implementations with a real Supabase backend, without
changing any page or component.

Before writing code, do this and then stop and show me the plan:
1. Read every function in src/lib/api/ and list the exact signatures and return types.
2. Propose a Supabase schema (tables, columns, relationships, RLS policy intent) that can
   satisfy those return types: users/profiles, lifestyle answers, stays, room types,
   matches, conversations, messages, listings, reports.
3. Propose the auth approach (Supabase Auth) to replace the mock auth context.
4. Flag anything the current mock shape would make awkward, so we fix the contract once
   rather than after tables exist.

Wait for my approval of the schema before implementing. Then implement the api functions
against Supabase one module at a time, keeping the signatures identical, and verify each
against the UI before moving on.
```

---

## OPTIONAL: single autonomous loop (if you want it to run the whole frontend unattended)

Use this instead of running phases one by one. Paste the Preamble, then this. Expect a long run.

```
Build the entire KHOKHI frontend, phases 0 through 8 as defined in KHOKHI_BUILD_PROMPTS.md,
in order, with mock data only. Do not start the backend.

You are working mostly unattended, so for reversible steps that follow from this plan,
proceed without asking. Pause and ask only for a genuine decision I alone can make
(a real design choice with no obvious answer, or something destructive).

After each phase: run the type check and build, and keep a short running checklist in
BUILD_LOG.md of what is done and verified, with the file paths. Before reporting a phase
complete, confirm it actually compiled; if a page is not verified, say so.

You have ample context. Do not stop or suggest a new session on account of context limits.
Before you end your turn, check your last message: if it is a plan, a question you can
answer yourself, or a promise of work not yet done, do that work now instead. End only
when phases 0 to 8 are built and verified, or you are blocked on a decision only I can make.

When you finish, write the summary for someone who did not watch the run: what is built,
what builds cleanly, and what is still rough. Plain sentences, outcome first.
```

---

## Why these prompts look the way they do

- **Context first:** each phase opens with who it's for and that it's a client demo, so the agent optimizes for a production look, not a toy.
- **One stable rule (the api layer):** this is what lets the backend phase swap data without touching pages. It is the single most important line in the Preamble.
- **Scope restraint + verify-before-claiming:** stops the agent from refactoring your foundation each phase and from telling you a page works when it never compiled.
- **Checkpoint + anti-early-stop (loop variant):** keeps an unattended run from stalling on "shall I continue?" while still pausing for real decisions.
- **Effort high:** right default for build work.

Scaffolding note: if you run the autonomous loop, expect a long session. Keep an eye on the
first phase output; if the foundation is wrong, stop it there, because every later phase
builds on it.
