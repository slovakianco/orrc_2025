# Trail Running Competition Platform

## Overview

This is a multilingual trail running competition website built with React, Express.js, and supports multiple database options (Supabase, PostgreSQL). The platform manages race information, participant registration, and provides comprehensive event details in multiple languages (English, Romanian, French, German, Italian, Spanish).

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Styling**: Tailwind CSS with custom theme based on trail running aesthetics
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Internationalization**: i18next for multi-language support
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful API endpoints under `/api/` namespace
- **Request Handling**: JSON parsing with comprehensive error handling
- **Development Tools**: Hot module replacement via Vite integration

### Hybrid Data Storage Strategy
The application implements a unique hybrid storage approach:
- **Supabase**: Primary storage for participant data
- **In-memory storage**: Fallback for all entities when Supabase is unavailable
- **PostgreSQL**: Optional secondary database (configured but not actively used)

This design ensures the application remains functional even if external services are unavailable.

## Key Components

### Core Pages
- **Home Page**: Hero section with countdown timer, quick info, and sections overview
- **Races Page**: Displays available races with filtering by difficulty
- **Registration Page**: Multi-step participant registration with payment integration
- **Participants Page**: Enhanced participant listing with search and filtering
- **Rules Page**: Comprehensive competition rules in all supported languages
- **Program Page**: Detailed event schedule with downloadable content
- **Contact Page**: Contact form with FAQ accordion
- **Sponsors Page**: Sponsor showcase with customizable tiers

### Registration System
- Form validation using Zod schemas
- Age calculation based on event date
- Emergency contact information collection
- EMA participant certification tracking
- T-shirt size collection for certified participants
- Medical information optional field

### Payment Integration
- Stripe payment processor integration
- Payment link generation for race fees
- Email confirmation system
- Support for different pricing tiers

### Multi-language Support
- Complete translation system covering 6 languages
- Localized content for races, descriptions, and UI elements
- Language-specific formatting for dates and currencies
- Persistent language selection via localStorage

## Data Flow

### Registration Process
1. User selects race and fills registration form
2. Form validation occurs client-side using Zod
3. Data submitted to `/api/participants` endpoint
4. Server validates and stores participant data
5. Payment link generated via Stripe integration
6. Confirmation email sent via SendGrid
7. Participant status updated upon payment completion

### Data Retrieval
1. Client requests data via TanStack Query
2. API endpoints fetch from appropriate storage backend
3. Data transformed and localized based on user language
4. Response cached on client for optimal performance

## External Dependencies

### Required Services
- **Supabase**: Database hosting and API (requires `SUPABASE_URL` and `SUPABASE_ANON_KEY`)
- **SendGrid**: Email service (requires `SENDGRID_API_KEY`)
- **Stripe**: Payment processing (requires `STRIPE_SECRET_KEY` and `VITE_STRIPE_PUBLIC_KEY`)

### Optional Services
- **PostgreSQL**: Alternative database option (requires `DATABASE_URL` or individual `PG*` variables)

### Environment Variables
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SENDGRID_API_KEY=your_sendgrid_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
DATABASE_URL=your_postgresql_connection_string (optional)
```

## Deployment Strategy

### Development
- Run `npm run dev` to start development server
- Vite handles frontend with HMR
- Express server runs on backend with TypeScript compilation
- Database initialization via `initialize-database.js` script

### Production Build
- `npm run build` creates optimized production bundle
- Frontend assets compiled to `dist/public`
- Backend compiled to `dist/index.js`
- `npm start` runs production server

### Database Setup
- Supabase tables created automatically via API calls
- PostgreSQL schema managed through Drizzle migrations
- Sample data population handled by storage implementations

The application gracefully degrades when external services are unavailable, ensuring core functionality remains accessible.

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 02, 2025. Initial setup