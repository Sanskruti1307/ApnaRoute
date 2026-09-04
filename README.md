 # ApnaRoute

ApnaRoute is India's next-generation tourism, route-planning, and travel-safety platform. It combines personalized trip planning, verified local services, live route intelligence, traveler communities, and emergency support in one dark, responsive web application.

> **Your journey, Your route.**

## Product Overview

ApnaRoute helps travelers eliminate uncertainty before and during a trip across India. Visitors can discover destinations without creating an account, while signed-in travelers can create and save itineraries, monitor active trips, connect with other travelers, and use the platform's safety tools.

The platform is designed around four principles:

- **Plan with context:** Generate day-by-day itineraries that account for destination, travel pace, timing, activities, and route logistics.
- **Travel with confidence:** Access live advisories, safe-zone information, verified providers, and emergency assistance.
- **Discover local expertise:** Find screened drivers, guides, stays, artisan bazaars, and regional services.
- **Keep the journey connected:** Save trips, monitor active routes, and meet compatible travelers through community circles.

## Landing Page

The first screen is a focused landing experience. It opens directly with:

- The live status badge: `India's Next-Gen Tourism & Safety Grid • LIVE PLATFORM`
- The ApnaRoute headline
- The tagline `Your journey, Your route`
- The travel value proposition
- Two access choices:
   - **Explorer / Guest Access:** Browse destinations, routes, and advisories without signing in.
   - **Traveler / Partner Login:** Sign in as a traveler or access the verified partner and local-guide path.

The landing page is available without authentication. Authentication is opened only when a user chooses an account-based path. This keeps destination discovery available to every visitor.

## Navigation

The sticky navigation bar provides:

- **Home:** Returns to the landing page.
- **Location:** Opens destination discovery, seasonal intelligence, and travel advisories.
- **About:** Shows the ApnaRoute mission, safety architecture principles, and trust metrics.
- **Search:** Searches destinations, states, transit information, bazaars, and related content.
- **SOS:** Opens the emergency assistance flow.
- **Notifications:** Displays live grid broadcasts and travel alerts.
- **Profile:** Opens the account flow for guests or the signed-in traveler profile.
- **Explore India:** Takes the user to destination discovery.

The navigation collapses into a mobile menu on smaller screens. Tab content uses a short opacity and vertical-translation transition and respects `prefers-reduced-motion`.

## Travel Features

### AI Trip Planner

The trip planner creates structured, multi-day itineraries from traveler preferences. Generated plans can include:

- Destination and origin
- Duration and number of travelers
- Travel style and budget tier
- Daily activities and timing
- Travel logistics and route notes
- Packing guidance
- Safety scoring and route risk information
- Estimated costs across available tiers

The Gemini-backed server service is used for itinerary generation and AI travel assistance. Generated itineraries can be saved locally and reopened later.

### AI Concierge

The AI Concierge provides destination-aware travel assistance and helps users refine plans or select a route. It is available from the broader application workspace after the visitor enters a product flow.

### Destination Explorer

The destination explorer presents destination cards and detailed destination briefings. The current destination data includes popular Indian travel regions such as:

- Sikkim
- Munnar
- Manali
- Goa
- Jaipur

Destination details can include the best time to visit, highlights, safety information, local context, and a route-planning action.

### Seasonal Intelligence

Seasonal Intelligence highlights current travel conditions and curated seasonal routes. It supports destination selection, itinerary planning, and seasonal travel recommendations for high-altitude and coastal destinations.

### Live Trip Monitor

The Live Trip Monitor represents an active itinerary as a trip in progress. It is designed for route awareness and quick access to SOS support while traveling.

### Map Radar

Map Radar uses Leaflet to provide a destination map and route-oriented point-of-interest experience. It supports itinerary stop markers, selected-stop focus, fullscreen map mode, and live location-oriented interactions where browser permissions are available.

### Verified Transport

The transport area surfaces verified drivers and ride options. It is intended to help travelers compare local transportation with more confidence.

### Services Directory

The services directory connects travelers with local guides, verified drivers, artisan bazaars, stays, and other regional providers. Service data is loaded through the application API.

### Traveler Matching

Traveler Matching helps solo travelers discover compatible community members and travel circles based on destination and trip context.

### Saved Trips

Authenticated travelers can save generated itineraries. Saved plans include itinerary details, costs, safety information, and actions to reopen the plan or start GPS monitoring. Saved plans are persisted in browser local storage under `apna_route_saved_plans`.

## Safety Features

ApnaRoute treats safety as a core product capability rather than an add-on. The safety experience includes:

- One-tap SOS actions in the navigation and floating safety controls
- Emergency SOS modal with responder-oriented assistance
- Safety Toolkit with practical traveler support tools
- Live safety center summaries
- Safety map advisories and safe-zone context
- Route safety scores and risk alerts
- Live trip monitoring
- Notifications for grid broadcasts and travel advisories

Emergency actions should be used alongside local emergency services and official government guidance. The application must not be treated as a replacement for emergency responders.

## Authentication

The application supports these account paths:

- Email and password login
- Email and password registration
- Google OAuth when configured
- Direct Google fallback flow for development or unconfigured OAuth environments
- Password recovery
- Traveler access for saved trips and live routes
- Service partner and local-guide access entry point

Guests can access the landing page and destination discovery without signing in. Account-only features may require authentication.

## Technology Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4 and application-level CSS variables
- **Icons:** `lucide-react`
- **Motion:** `motion`
- **Maps:** Leaflet and React-compatible Leaflet integrations
- **Backend:** Node.js, Express, TypeScript, and `tsx`
- **Database:** MongoDB
- **AI:** Google Gemini through `@google/genai`
- **Authentication:** Application API with email/password and Google OAuth support
- **Build tooling:** Vite and esbuild

## Project Structure

```text
.
├── index.html                 # HTML shell and page metadata
├── metadata.json              # AI Studio/app capability metadata
├── package.json               # Scripts and dependencies
├── server.ts                  # Express server and Vite integration
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
├── public/assets/             # Public static assets
├── server/
│   ├── auth.ts                # Authentication helpers and routes
│   ├── data.ts                # Seed and application data helpers
│   ├── db.ts                  # MongoDB connection and persistence
│   ├── gemini.ts              # Gemini API integration
│   └── routes.ts               # Express API routes
└── src/
      ├── App.tsx                # Application state and top-level routing
      ├── index.css              # Global theme and transitions
      ├── main.tsx               # React entry point
      ├── types.ts               # Shared domain types
      ├── services/api.ts        # Frontend API client
      └── components/            # Feature and UI components
```

Important UI components include:

- `Hero.tsx` for the landing hero
- `AccessPortal.tsx` for the two landing access choices
- `Navbar.tsx` for sticky navigation and global actions
- `AboutView.tsx` for mission and trust content
- `LoginPage.tsx` for authentication
- `TripPlanner.tsx` and `ItineraryView.tsx` for itinerary creation and results
- `DestinationExplorer.tsx` and `DestinationModal.tsx` for destination discovery
- `SafetyCenter.tsx`, `SafetyMapAdvisory.tsx`, `EmergencySOSModal.tsx`, and `SafetyToolkitModal.tsx` for safety workflows

## Requirements

- Node.js 18 or newer is recommended.
- npm 9 or newer is recommended.
- MongoDB is required for persistent backend data and authentication flows.
- A Gemini API key is required for AI itinerary and concierge features.
- Google OAuth credentials are required for the full Google sign-in popup flow.

## Environment Variables

Create a local environment file based on the variables expected by the server configuration. At minimum, configure the Gemini key:

```env
GEMINI_API_KEY=your_gemini_api_key
```

Depending on the deployment configuration, the backend may also require MongoDB and authentication settings such as:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/apna_route
MONGODB_DB_NAME=apna_route
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=replace_with_a_long_random_secret
```

Do not commit `.env`, `.env.local`, API keys, OAuth secrets, or session secrets.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

The development command starts the Express backend and serves the Vite frontend from the same local server.

## Available Commands

```bash
npm run dev       # Start the local backend and frontend
npm run lint      # Run TypeScript checking without emitting files
npm run build     # Build the frontend and bundle the server
npm run start     # Start the production server from dist/
npm run preview   # Preview the Vite production output
npm run clean     # Remove generated build output
```

## API and Data Flow

The browser communicates with the Express API through `src/services/api.ts`. The API supports data and workflows for:

- Destinations
- Verified drivers
- Local guides
- Artisan bazaars
- Traveler groups
- Notifications
- Authentication and current-user sessions
- AI itinerary generation
- Google OAuth configuration and exchange
- Password recovery

The backend owns provider credentials and Gemini requests. Client components should use the service layer instead of calling provider APIs directly.

## Responsive Design

The interface is designed for desktop and mobile use:

- Sticky navigation with a compact mobile menu
- Responsive hero typography and access cards
- Flexible destination and service grids
- Touch-friendly action targets
- Responsive modals, drawers, map surfaces, and itinerary panels
- Dark theme based on pure black `#05070a`, violet-indigo highlights `#6366f1`, dark borders `#1f293d`, and white typography

## Accessibility and UX Notes

- Interactive controls use recognizable Lucide icons and accessible titles where needed.
- The landing page does not force authentication before discovery.
- Motion is disabled for users who request reduced motion.
- Browser geolocation is requested only where map or live-route features need it.
- Emergency actions remain visually distinct from regular travel actions.

## Validation

Before submitting changes, run:

```bash
npm run lint
npm run build
```

The production build currently emits a bundle-size warning for the main JavaScript chunk. This is a performance optimization opportunity, not a build failure.

## Security Notes

- Keep all provider secrets on the server.
- Validate and authorize account-specific API requests on the backend.
- Use HTTPS and secure cookie settings in production.
- Configure a strict, production-appropriate CORS policy.
- Treat client-side local storage as convenience storage, not a secure data vault.
- Verify emergency and location workflows against official requirements before production launch.

## Deployment Checklist

1. Configure production environment variables and secrets.
2. Provision MongoDB and verify indexes and connectivity.
3. Configure Google OAuth redirect URLs for the production domain.
4. Run `npm run lint` and `npm run build`.
5. Start the generated server with `npm run start`.
6. Verify landing access, authentication, destination search, itinerary generation, maps, notifications, and SOS flows.
7. Enable HTTPS, monitoring, logging, backups, and rate limiting.

## License

No license is currently declared in this repository. Add a license file before distributing the project publicly.

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/e79b8d25-b112-451e-a94a-9acdb27e6a2d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
