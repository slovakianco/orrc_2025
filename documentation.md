# Stana de Vale Trail Race - Complete Documentation

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [File Structure](#3-file-structure)
4. [Environment Variables](#4-environment-variables)
5. [Database Schema](#5-database-schema)
6. [Backend (Server)](#6-backend-server)
7. [Frontend (Client)](#7-frontend-client)
8. [Internationalization (i18n)](#8-internationalization-i18n)
9. [Third-Party Integrations](#9-third-party-integrations)
10. [Common Modifications Guide](#10-common-modifications-guide)
11. [Commands Reference](#11-commands-reference)

---

## 1. Project Overview

A multilingual trail running competition website for the "Stana de Vale Trail Race" supporting six languages (English, Romanian, French, German, Italian, Spanish). The platform manages race information, participant registration, results display, and event logistics.

**Key Features:**
- Two race categories: 33km Long Trail and 11km Short Trail
- Participant registration with Stripe payment integration (currently closed)
- Embedded TraceDeTrail interactive maps for race routes
- GPX file downloads for offline navigation
- Embedded race results from my-run.ro
- EMA (European Masters Athletics) Off-Road Running Circuit integration
- Contact form with SendGrid email delivery
- Sponsor showcase with tiered display
- Countdown timer to event date
- Responsive design for mobile, tablet, and desktop

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React with TypeScript |
| Build Tool | Vite |
| Routing | wouter |
| State Management | TanStack Query (React Query v5) |
| Styling | Tailwind CSS + shadcn/ui (Radix UI) |
| Forms | React Hook Form + Zod validation |
| Internationalization | react-i18next |
| Backend Framework | Express.js with TypeScript |
| Database ORM | Drizzle ORM |
| Primary Database | Supabase (PostgreSQL) |
| Fallback Storage | In-memory (MemStorage) |
| Payments | Stripe |
| Email | SendGrid |
| Runtime | Node.js v20 |

---

## 3. File Structure

```
project-root/
├── client/                          # Frontend application
│   ├── index.html                   # HTML entry point
│   └── src/
│       ├── App.tsx                   # Main app component + routing
│       ├── main.tsx                  # React entry point
│       ├── index.css                # Global styles
│       ├── components/              # Reusable React components
│       │   ├── NavigationHeader.tsx  # Main navbar (ACTIVE)
│       │   ├── Navbar.tsx           # Alternative navbar (UNUSED)
│       │   ├── Footer.tsx           # Site footer
│       │   ├── HeroSection.tsx      # Homepage hero banner
│       │   ├── CountdownTimer.tsx   # Event countdown
│       │   ├── RacesSection.tsx     # Race cards display
│       │   ├── ContactForm.tsx      # Contact form
│       │   ├── EnhancedParticipantsList.tsx  # Participants table
│       │   ├── RegistrationFormWithPayment.tsx  # Registration (closed)
│       │   ├── SponsorsShowcase.tsx  # Sponsor logos/tiers
│       │   ├── ProgramSchedule.tsx  # Event schedule
│       │   ├── RulesContent.tsx     # Competition rules
│       │   ├── QuickInfoSection.tsx  # Homepage quick info
│       │   ├── SectionsOverview.tsx  # Homepage sections
│       │   ├── LanguageSelectorWithFlags.tsx  # Language dropdown
│       │   ├── PageHeader.tsx       # Reusable page header
│       │   ├── StripePaymentForm.tsx # Stripe payment elements
│       │   └── ui/                  # shadcn/ui components (40+ files)
│       │       ├── button.tsx
│       │       ├── card.tsx
│       │       ├── form.tsx
│       │       ├── input.tsx
│       │       ├── select.tsx
│       │       ├── dialog.tsx
│       │       └── ... (accordion, table, tabs, etc.)
│       ├── pages/                   # Page components
│       │   ├── HomePage.tsx         # Landing page
│       │   ├── RacesPage.tsx        # All races listing
│       │   ├── RaceDetail.tsx       # Individual race details
│       │   ├── RegistrationPage.tsx # Registration form page
│       │   ├── ParticipantsPage.tsx # Participant listing
│       │   ├── ResultsPage.tsx      # Race results (iframe)
│       │   ├── RulesPage.tsx        # Competition rules
│       │   ├── ProgramPage.tsx      # Event schedule
│       │   ├── ContactPage.tsx      # Contact form page
│       │   ├── SponsorsPage.tsx     # Sponsors showcase
│       │   ├── AccommodationPage.tsx # Accommodation info
│       │   ├── HowToGetPage.tsx     # Directions/travel info
│       │   ├── EmaCircuitPage.tsx   # EMA circuit info
│       │   ├── CNMastersPage.tsx    # CN Masters info
│       │   ├── PrivacyPolicy.tsx    # Privacy policy
│       │   ├── TermsConditions.tsx  # Terms and conditions
│       │   ├── CookiePolicy.tsx     # Cookie policy
│       │   ├── AdminPage.tsx        # Admin panel
│       │   ├── EmailTestPage.tsx    # Email testing page
│       │   ├── RegistrationSuccessPage.tsx  # Post-registration
│       │   └── not-found.tsx        # 404 page
│       ├── hooks/                   # Custom React hooks
│       │   ├── use-mobile.tsx       # Mobile detection
│       │   └── use-toast.ts         # Toast notifications
│       ├── lib/                     # Frontend utilities
│       │   ├── i18n.ts             # i18n configuration
│       │   ├── queryClient.ts      # TanStack Query setup
│       │   ├── types.ts            # Frontend type definitions
│       │   ├── utils.ts            # Utility functions
│       │   ├── hooks/
│       │   │   └── useLanguage.ts  # Language context/hook
│       │   └── translations/       # Translation files
│       │       ├── en.json         # English
│       │       ├── ro.json         # Romanian
│       │       ├── fr.json         # French
│       │       ├── de.json         # German
│       │       ├── it.json         # Italian
│       │       └── es.json         # Spanish
│       └── types/
│           ├── index.ts
│           └── race.ts
│
├── server/                          # Backend application
│   ├── index.ts                     # Server entry point
│   ├── routes.ts                    # All API routes
│   ├── storage.ts                   # IStorage interface + MemStorage
│   ├── storage-provider.ts          # Storage singleton manager
│   ├── hybrid-storage.ts            # Supabase + Memory hybrid
│   ├── supabase.ts                  # Supabase client init
│   ├── supabase-storage.ts          # Supabase storage implementation
│   ├── supabase-init.ts             # Supabase table creation
│   ├── email.ts                     # SendGrid email service
│   ├── db.ts                        # Drizzle database connection
│   ├── production.ts                # Production-specific setup
│   ├── vite.ts                      # Vite dev server integration
│   ├── postgres-storage.ts          # PostgreSQL storage (optional)
│   └── types.d.ts                   # Server type declarations
│
├── shared/                          # Shared between frontend/backend
│   └── schema.ts                    # Drizzle ORM schema + Zod types
│
├── public/                          # Static assets served directly
│   ├── images/                      # Race images
│   ├── regulations/                 # PDF regulation documents
│   └── *.png, *.jpeg               # Logos and branding
│
├── attached_assets/                 # Downloadable assets
│   ├── long-trail-33km.gpx         # GPX track for 33km race
│   ├── short-trail-11km.gpx        # GPX track for 11km race
│   └── Regulation2025_ORRCircuit.*  # Regulation documents
│
├── theme.json                       # UI theme configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── vite.config.ts                   # Vite build configuration (DO NOT EDIT)
├── drizzle.config.ts                # Drizzle ORM config (DO NOT EDIT)
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies (DO NOT EDIT directly)
└── replit.md                        # Replit project documentation
```

---

## 4. Environment Variables

| Variable | Type | Purpose |
|----------|------|---------|
| `SUPABASE_URL` | Env Var (shared) | Supabase project URL (format: `https://xxx.supabase.co`) |
| `SUPABASE_ANON_KEY` | Env Var (shared) | Supabase anonymous API key (JWT starting with `eyJ...`) |
| `STRIPE_SECRET_KEY` | Secret | Stripe API secret key for payment processing |
| `VITE_STRIPE_PUBLIC_KEY` | Secret | Stripe publishable key (available to frontend via `import.meta.env`) |
| `SENDGRID_API_KEY` | Secret | SendGrid API key for sending emails |
| `DATABASE_URL` | Secret | PostgreSQL connection string (auto-managed by Replit) |
| `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` | Secrets | Individual PostgreSQL connection parameters |

**Important:** Environment variables prefixed with `VITE_` are accessible on the frontend via `import.meta.env.VITE_*`. All others are server-side only.

---

## 5. Database Schema

Defined in `shared/schema.ts` using Drizzle ORM.

### Tables

#### `users`
Admin access accounts.

| Column | Type | Notes |
|--------|------|-------|
| id | serial | Primary Key, auto-increment |
| username | text | Unique, required |
| password | text | Required |

#### `races`
Race event information with multilingual content.

| Column | Type | Notes |
|--------|------|-------|
| id | serial | Primary Key |
| name | text | English name |
| nameRo, nameFr, nameDe, nameIt, nameEs | text | Translated names |
| description | text | English description |
| descriptionRo, descriptionFr, descriptionDe, descriptionIt, descriptionEs | text | Translated descriptions |
| distance | integer | Distance in km |
| elevation | integer | Elevation gain in meters |
| difficulty | enum | 'classic_updown' or 'long_trail' |
| date | text | ISO date string |
| price | integer | Registration fee in EUR |
| imageUrl | text | Race image path (optional) |
| raceMap | text | TraceDeTrail iframe HTML (optional) |
| isemacertified | boolean | EMA certification status |
| isNationalChampionship | boolean | National championship flag |

#### `participants`
Registered runner data.

| Column | Type | Notes |
|--------|------|-------|
| id | serial | Primary Key |
| firstname, lastname | text | Runner name |
| email | text | Contact email |
| phoneNumber | text | Contact phone |
| country | text | Country of origin |
| gender | text | 'M' or 'F' |
| birthDate | text | ISO date string |
| age | integer | Calculated from birth date |
| raceid | integer | References races.id |
| bibNumber | text | Assigned bib number (optional) |
| status | text | 'pending', 'confirmed', etc. |
| medicalInfo | text | Optional medical notes |
| registrationDate | timestamp | Auto-set to current time |
| emergencyContactName | text | Emergency contact |
| emergencyContactPhone | text | Emergency phone |
| isemaparticipant | boolean | EMA participant flag |
| tshirtsize | text | T-shirt size for EMA participants |
| payment_link | text | Stripe payment link URL |
| payment_link_created_at | text | Payment link creation date |
| payment_link_expires_at | text | Payment link expiry date |

#### `contact_inquiries`
Contact form submissions.

| Column | Type | Notes |
|--------|------|-------|
| id | serial | Primary Key |
| name | text | Sender name |
| email | text | Sender email |
| subject | text | Message subject |
| message | text | Message body |
| createdAt | timestamp | Submission time |

#### `faqs`
Frequently asked questions (multilingual).

| Column | Type | Notes |
|--------|------|-------|
| id | serial | Primary Key |
| question, questionRo, questionFr, questionDe, questionIt, questionEs | text | Translated questions |
| answer, answerRo, answerFr, answerDe, answerIt, answerEs | text | Translated answers |
| order_index | integer | Display order |

#### `program_events`
Event schedule entries (multilingual).

| Column | Type | Notes |
|--------|------|-------|
| id | serial | Primary Key |
| date | text | Event date |
| startTime, endTime | text | Time range |
| title, titleRo, titleFr, titleDe, titleIt, titleEs | text | Translated titles |
| description, descriptionRo, descriptionFr, descriptionDe, descriptionIt, descriptionEs | text | Translated descriptions |
| location | text | Event location |
| order_index | integer | Display order |

#### `sponsors`
Sponsor information (multilingual).

| Column | Type | Notes |
|--------|------|-------|
| id | serial | Primary Key |
| name | text | Sponsor name |
| description, descriptionRo, descriptionFr, descriptionDe, descriptionIt, descriptionEs | text | Translated descriptions |
| logoPlaceholder | text | Logo image path |
| website | text | Sponsor website URL |
| level | text | 'premium' or 'standard' |
| order_index | integer | Display order |

### Schema Push

To apply schema changes to the database:
```bash
npm run db:push
```
If there are data-loss warnings:
```bash
npm run db:push --force
```

---

## 6. Backend (Server)

### Server Entry Point (`server/index.ts`)

- Initializes Express with JSON and URL-encoded body parsing
- Sets up logging middleware for API requests
- Registers all API routes from `server/routes.ts`
- In development: Uses Vite for hot module replacement
- In production: Serves static files from `dist/public`
- Listens on port **5000**

### API Routes (`server/routes.ts`)

All routes are prefixed with `/api`.

#### Races
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/races` | List all races. Optional `?difficulty=` filter |
| GET | `/api/races/:id` | Get single race details |
| PATCH | `/api/races/:id` | Update race data (images, content) |
| GET | `/api/races/:id/gpx` | Download GPX track file |

**GPX Download Logic:** If race distance >= 30km, serves `attached_assets/long-trail-33km.gpx`. Otherwise serves `attached_assets/short-trail-11km.gpx`.

#### Participants
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/participants` | List participants. Filters: `?raceid=`, `?country=`, `?search=` |
| GET | `/api/participants/:id` | Get single participant |
| GET | `/api/participant-status/:id` | Registration status summary |
| POST | `/api/participants` | Create new registration |

#### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/create-payment-link` | Generate Stripe payment link for a participant |
| POST | `/api/stripe-webhook` | Handle Stripe payment events |

**Payment Link Logic:**
- Calculates fee based on race (33km vs 11km) and EMA status
- Creates Stripe Price + Payment Link
- Links expire after 48 hours
- Checks for existing valid links before creating new ones

#### Contact & Content
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Submit contact form (sends email to admin) |
| GET | `/api/faqs` | Get FAQ entries (sorted by order_index) |
| GET | `/api/program` | Get event schedule. Optional `?date=` filter |
| GET | `/api/sponsors` | Get sponsors. Optional `?level=` filter |

### Storage Architecture

The app uses an interface-based storage pattern with three implementations:

```
IStorage (interface in storage.ts)
    ├── MemStorage (storage.ts) - In-memory with sample data
    ├── SupabaseStorage (supabase-storage.ts) - Supabase database
    └── HybridStorage (hybrid-storage.ts) - ACTIVE: combines both
```

**HybridStorage** (the default) works as follows:
- **Participants & Races**: Tries Supabase first, falls back to MemStorage on failure
- **FAQs, Sponsors, Program Events, Contact, Users**: Always uses MemStorage
- Connection is tested at startup; if Supabase is unreachable, all operations fall back to memory

**Storage Provider** (`storage-provider.ts`): A singleton that holds the current storage instance, preventing circular imports.

### Supabase Client (`server/supabase.ts`)

- Validates the `SUPABASE_URL` format before creating the client
- Returns `null` if URL is invalid or environment variables are missing
- The app continues to function using MemStorage fallback
- Tests connection at startup by querying the races table

### Email Service (`server/email.ts`)

Uses SendGrid to send:
- **Registration confirmation**: Sent after form submission, includes Stripe payment link
- **Payment confirmation**: Sent after successful Stripe payment (via webhook)
- Supports all 6 languages for email subjects and body content
- Sender address: `registration@stanatrailrace.ro`

---

## 7. Frontend (Client)

### App Structure (`client/src/App.tsx`)

The app wraps all content in:
1. `QueryClientProvider` - TanStack Query for data fetching
2. `LanguageProvider` - Language context
3. `Router` (wouter) - Client-side routing

Layout includes `NavigationHeader` at top and `Footer` at bottom on every page.

### Routes

| Path | Page Component | Description |
|------|---------------|-------------|
| `/` | HomePage | Landing page with hero, countdown, overview |
| `/races` | RacesPage | All race categories |
| `/races/:id` | RaceDetail | Individual race details, map, GPX download |
| `/registration` | RegistrationPage | Registration form (shows "Closed") |
| `/participants` | ParticipantsPage | Searchable participant list |
| `/results` | ResultsPage | Race results iframe |
| `/rules` | RulesPage | Competition rules |
| `/program` | ProgramPage | Event schedule |
| `/contact` | ContactPage | Contact form with FAQ |
| `/sponsors` | SponsorsPage | Sponsor showcase |
| `/accommodation` | AccommodationPage | Accommodation info |
| `/how-to-get` | HowToGetPage | Travel directions |
| `/ema-circuit` | EmaCircuitPage | EMA circuit info |
| `/cn-masters` | CNMastersPage | CN Masters info |
| `/privacy-policy` | PrivacyPolicy | Privacy policy |
| `/terms-conditions` | TermsConditions | Terms and conditions |
| `/cookie-policy` | CookiePolicy | Cookie policy |
| `/admin` | AdminPage | Admin panel |

### Key Components

**NavigationHeader.tsx** - The main navigation bar
- Responsive design with mobile hamburger menu
- Includes `LanguageSelectorWithFlags` for language switching
- Links to all major sections

**HeroSection.tsx** - Homepage hero
- Large banner with race branding
- Countdown timer to event date

**RacesSection.tsx** - Race card display
- Shows race cards with distance, elevation, difficulty
- Links to individual race detail pages

**RaceDetail.tsx** - Individual race page
- Displays race stats, description, aid stations
- **TraceDeTrail Map**: Rendered via `dangerouslySetInnerHTML` from the `raceMap` database field (contains iframe HTML)
- **GPX Download**: Direct link to `/api/races/{id}/gpx`

**ResultsPage.tsx** - Race results
- Embeds an iframe from my-run.ro
- Uses CSS positioning (`top: -200px`) to crop the external site's header/footer
- Overflow hidden on container

**EnhancedParticipantsList.tsx** - Participant table
- Search by name or country
- Filter by race
- Sortable columns
- Pagination

**RegistrationFormWithPayment.tsx** - Registration
- Currently displays "Registration Closed" message
- When active: multi-step form with Zod validation, age verification, EMA eligibility check

**SponsorsShowcase.tsx** - Sponsor display
- Tiered display (premium/standard)
- Logo + description + website link

**ContactForm.tsx** - Contact form
- Form validation with React Hook Form
- Submits to `/api/contact` endpoint
- Success/error toast notifications

### Data Fetching

Uses TanStack Query v5 (object-form only):

```typescript
// Fetching data
const { data, isLoading, error } = useQuery<Type>({
  queryKey: ['/api/endpoint'],
});

// Mutations
const mutation = useMutation({
  mutationFn: async (data) => {
    await apiRequest('POST', '/api/endpoint', data);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/endpoint'] });
  },
});
```

- Default fetcher is pre-configured in `queryClient.ts`
- `apiRequest` helper handles POST/PATCH/DELETE requests
- Cache invalidation by queryKey after mutations

### Styling

- **Theme**: Configured in `theme.json` (primary color, variant, appearance, border radius)
- **Tailwind CSS**: Utility-first styling throughout
- **shadcn/ui**: Pre-built components in `client/src/components/ui/`
- **Icons**: `lucide-react` for UI icons

---

## 8. Internationalization (i18n)

### Setup

Configured in `client/src/lib/i18n.ts` using react-i18next.

**Supported Languages:**
| Code | Language |
|------|----------|
| en | English |
| ro | Romanian |
| fr | French |
| de | German |
| it | Italian |
| es | Spanish |

### Translation Files

Located in `client/src/lib/translations/`:
- `en.json`, `ro.json`, `fr.json`, `de.json`, `it.json`, `es.json`

### Usage in Components

```typescript
const { t } = useTranslation();
return <h1>{t('page.title')}</h1>;
```

### Language Detection

1. Checks `localStorage` for saved preference
2. Falls back to browser language
3. Default: English

### Adding a New Translation Key

1. Add the key to ALL 6 translation files in `client/src/lib/translations/`
2. Use the key in components with `t('your.key')`

### Database Multilingual Fields

Race names, descriptions, FAQ questions/answers, program titles, and sponsor descriptions all have dedicated columns per language (e.g., `name`, `nameRo`, `nameFr`, `nameDe`, `nameIt`, `nameEs`).

---

## 9. Third-Party Integrations

### Supabase (Database)

**Files:** `server/supabase.ts`, `server/supabase-storage.ts`, `server/supabase-init.ts`

- Primary storage for participant data
- Client initialized with URL validation (graceful fallback if invalid)
- Tables created via `supabase-init.ts` or `scripts/create-supabase-tables.js`

### Stripe (Payments)

**Files:** `server/routes.ts` (lines 11-162 + webhook handler), `client/src/components/StripePaymentForm.tsx`

- Payment links generated per participant
- Fee calculation based on race category and EMA status
- Links expire after 48 hours
- Webhook at `/api/stripe-webhook` handles `payment_intent.succeeded`
- On success: updates participant status to "confirmed", sends confirmation email

### SendGrid (Email)

**Files:** `server/email.ts`

- Registration confirmation emails (with payment link)
- Payment confirmation emails (triggered by Stripe webhook)
- Multilingual email templates (6 languages)
- Sender: `registration@stanatrailrace.ro`

### TraceDeTrail (Maps)

**How it works:**
- Race maps stored as HTML iframe embed code in the `raceMap` database field
- Example: `<iframe src="https://tracedetrail.fr/en/iframe/6296" ...>`
- Rendered in `RaceDetail.tsx` using `dangerouslySetInnerHTML`
- 33km race uses iframe ID 6296, 11km uses ID 6297

**To change a map:** Update the `raceMap` field in the race data with the new iframe HTML from TraceDeTrail.

### my-run.ro (Results)

**File:** `client/src/pages/ResultsPage.tsx`

- Race results displayed via iframe from my-run.ro
- CSS tricks used to hide the external site's header/footer (negative positioning + overflow hidden)
- Cross-origin restrictions prevent direct CSS injection into the iframe

---

## 10. Common Modifications Guide

### Change the Event Date

1. Update the countdown timer in `client/src/components/CountdownTimer.tsx`
2. Update the age calculation reference date in `client/src/components/RegistrationFormWithPayment.tsx` (the `calculateAgeForValidation` function uses `new Date(2026, 6, 11)`)
3. Update race dates in the MemStorage sample data in `server/storage.ts`

### Add a New Page

1. Create the page component in `client/src/pages/YourPage.tsx`
2. Register the route in `client/src/App.tsx`:
   ```typescript
   <Route path="/your-path" component={YourPage} />
   ```
3. Add navigation link in `client/src/components/NavigationHeader.tsx`
4. Add translation keys for the page title in all 6 translation files

### Add a New Race

Update the MemStorage sample data in `server/storage.ts` or add via Supabase:
- Include all multilingual fields (name, description in 6 languages)
- Set distance, elevation, difficulty, price, date
- Add TraceDeTrail iframe HTML to `raceMap` field
- Add a GPX file to `attached_assets/` and update the GPX endpoint logic in `server/routes.ts` if needed

### Add a New Sponsor

Update the sponsors array in `server/storage.ts` (MemStorage):
- Include name, multilingual descriptions, logo path, website, level ('premium' or 'standard')
- Place the logo image in `public/` directory

### Change Registration Status (Open/Close)

Currently closed in `client/src/components/RegistrationFormWithPayment.tsx`. To reopen:
- Remove the "Registration Closed" message block
- Restore the form JSX
- Ensure Stripe keys are configured

### Modify Race Fees

Payment calculation is in `server/routes.ts` in the `createPaymentLink` function:
- Locate the fee logic based on race distance and EMA status
- Update the amounts (in cents for Stripe)

### Update TraceDeTrail Maps

1. Get the new iframe embed code from tracedetrail.fr
2. Update the `raceMap` field in:
   - MemStorage sample data in `server/storage.ts`
   - Supabase database (if using)

### Update GPX Files

1. Replace the files in `attached_assets/`:
   - `long-trail-33km.gpx` for the long race
   - `short-trail-11km.gpx` for the short race
2. The API endpoint in `server/routes.ts` automatically serves the correct file based on race distance

### Update Results Page

Edit `client/src/pages/ResultsPage.tsx`:
- Change the iframe `src` URL to point to the new results page
- Adjust the CSS positioning if the external site's layout changes

### Change the Theme/Colors

Edit `theme.json`:
```json
{
  "variant": "vibrant",         // "professional", "tint", or "vibrant"
  "primary": "oklch(70% 0.1 20)", // Primary color in oklch format
  "appearance": "light",        // "light", "dark", or "system"
  "radius": 0.5                 // Border radius multiplier
}
```

### Add a New Translation Language

1. Create a new translation file in `client/src/lib/translations/` (e.g., `pt.json`)
2. Copy the structure from `en.json` and translate all values
3. Register the language in `client/src/lib/i18n.ts`:
   - Import the new file
   - Add it to the `resources` object
4. Add the language option to `LanguageSelectorWithFlags.tsx`
5. Add database columns for the new language in `shared/schema.ts` (e.g., `namePt`, `descriptionPt`)
6. Run `npm run db:push` to update the database
7. Update storage implementations to handle the new columns

### Add a New API Endpoint

1. Add the route in `server/routes.ts`:
   ```typescript
   app.get('/api/your-endpoint', async (req, res) => {
     const data = await storage.yourMethod();
     res.json(data);
   });
   ```
2. If it needs storage, add the method to `IStorage` interface in `server/storage.ts`
3. Implement the method in `MemStorage`, `SupabaseStorage`, and `HybridStorage`

### Add a New Database Table

1. Define the table in `shared/schema.ts`:
   ```typescript
   export const yourTable = pgTable("your_table", {
     id: serial("id").primaryKey(),
     name: text("name").notNull(),
   });
   export const insertYourTableSchema = createInsertSchema(yourTable).omit({ id: true });
   export type YourTable = typeof yourTable.$inferSelect;
   export type InsertYourTable = z.infer<typeof insertYourTableSchema>;
   ```
2. Run `npm run db:push` to create the table
3. Add CRUD methods to the storage interface and implementations

---

## 11. Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (frontend + backend on port 5000) |
| `npm run build` | Build for production (frontend to `dist/public`, backend to `dist/index.js`) |
| `npm start` | Run production server |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push Drizzle schema changes to database |

### Files You Should NOT Edit

| File | Reason |
|------|--------|
| `vite.config.ts` | Pre-configured Vite setup for frontend/backend integration |
| `drizzle.config.ts` | Pre-configured Drizzle ORM settings |
| `package.json` | Managed by the package management system |
| `server/vite.ts` | Vite development server integration |

---

## Architecture Diagram

```
Browser (React SPA)
    │
    ├── wouter (routing)
    ├── react-i18next (translations)
    ├── TanStack Query (data fetching/caching)
    └── shadcn/ui + Tailwind (styling)
    │
    ▼ HTTP requests to /api/*
    │
Express.js Server (port 5000)
    │
    ├── routes.ts (API endpoints)
    ├── email.ts (SendGrid)
    ├── Stripe SDK (payments)
    │
    ▼ Storage Interface
    │
HybridStorage
    ├── SupabaseStorage ──► Supabase (PostgreSQL cloud)
    │   (participants, races)
    └── MemStorage ──► In-memory (fallback + static content)
        (FAQs, sponsors, program, users)
```
